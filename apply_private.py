#!/usr/bin/env python3
"""Build private, local-only PokéSurvivor Pages site from an upstream fork.

Usage: python3 apply_private.py
Output: ./_site/ (for GitHub Pages). Build-time PokéAPI CSV access required.
"""
from __future__ import annotations
import csv
import io
import json
import urllib.request
import re
import shutil
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SITE = ROOT / '_site'
BEGIN, END = '<!-- scripts:begin -->', '<!-- scripts:end -->'


# PokéAPI contains official Traditional Chinese names as local_language_id=4.
# Fetch ONLY at GitHub Actions build time; the published game is fully standalone.
POKEAPI_NAMES = ('https://raw.githubusercontent.com/PokeAPI/pokeapi/'
                 'master/data/v2/csv/pokemon_species_names.csv')

def build_dex_chinese_map():
    source = (ROOT / 'js' / 'data' / 'pokedex.js').read_text(encoding='utf-8')
    start = source.find('G.DEX = [')
    if start < 0:
        raise SystemExit('找不到 G.DEX：上游圖鑑結構可能已更動，取消部署。')
    source = source[start:]
    entries = re.findall(r'\{\s*"dex":(\d+),\s*"name":"([^"\n]+)"', source)
    dex_by_id = {int(dex): name for dex, name in entries}
    if len(dex_by_id) < 900 or len(dex_by_id) != len(entries):
        raise SystemExit(f'圖鑑資料數量異常：{len(entries)} 筆、{len(dex_by_id)} 個不同編號。取消部署。')
    request = urllib.request.Request(
        POKEAPI_NAMES, headers={'User-Agent':'PokeSurvivor-private-zh-Hant-build/2.7'})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            content = response.read().decode('utf-8-sig')
    except Exception as err:
        raise SystemExit('無法在 GitHub 建置時取得 PokéAPI 中文名稱資料；為避免產生不完整的版本，取消部署：'+str(err))
    names = {}
    for row in csv.DictReader(io.StringIO(content)):
        if row.get('local_language_id') == '4':
            names[int(row['pokemon_species_id'])] = row['name']
    missing = sorted(set(dex_by_id) - set(names))
    if missing:
        raise SystemExit('繁體中文名稱資料不完整，取消部署。缺少圖鑑編號：'+str(missing[:30]))
    result = {str(dex): names[dex] for dex in sorted(dex_by_id)}
    print(f'寶可夢繁中名稱比對：{len(result)}/{len(dex_by_id)} 筆；缺漏 0。')
    return result

# V2.7: official move / ability / item names. We do not rewrite gameplay
# variables or source names; all mappings are used by the UI-only overlay.
POKEAPI_CSV_BASE = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/'
TERM_TABLES = {
    'moves': ('move_names.csv', 'move_id'),
    'abilities': ('ability_names.csv', 'ability_id'),
    'items': ('item_names.csv', 'item_id'),
}

def _download_csv(url):
    request = urllib.request.Request(url, headers={
        'User-Agent': 'PokeSurvivor-private-zh-Hant-build/2.7'
    })
    with urllib.request.urlopen(request, timeout=45) as response:
        return list(csv.DictReader(io.StringIO(response.read().decode('utf-8-sig'))))

def _terms_from_rows(rows, id_column):
    by_id = defaultdict(dict)
    for row in rows:
        language = row.get('local_language_id')
        key = row.get(id_column)
        name = row.get('name', '').strip()
        if key and language in ('4', '7', '9') and name:
            by_id[key][language] = name
    translated = {}
    conflicts = set()
    covered = 0
    for entry in by_id.values():
        zh = entry.get('4')
        if not zh: continue
        covered += 1
        for language in ('7','9'):
            name = entry.get(language)
            if not name or name == zh or len(name) < 3: continue
            # Identical names can refer to different items; never guess which
            # is meant. Ambiguities are omitted instead of mistranslated.
            if name in translated and translated[name] != zh:
                conflicts.add(name)
            else:
                translated[name] = zh
    for name in conflicts: translated.pop(name, None)
    return translated, {'localized_entries': covered, 'name_pairs': len(translated),
                        'ambiguous_names_skipped': len(conflicts)}

def build_game_terms():
    combined = {}
    report = {}
    for group, (csv_name, id_field) in TERM_TABLES.items():
        try:
            rows = _download_csv(POKEAPI_CSV_BASE + csv_name)
        except Exception as exc:
            raise SystemExit(f'V2.7 無法取得 {csv_name}，為避免缺漏而停止部署：{exc}')
        terms, stats = _terms_from_rows(rows, id_field)
        # A zero-name result indicates a schema change or upstream outage.
        if len(terms) < 10:
            raise SystemExit(f'V2.7 {csv_name} 缺少有效的繁中對照，停止部署（{len(terms)} 筆）')
        combined[group] = terms
        report[group] = stats
        print(f'V2.7 {group}: {stats["localized_entries"]} 個繁中名稱、{stats["name_pairs"]} 組西文/英文對照，跳過 {stats["ambiguous_names_skipped"]} 個衝突名稱')
    return combined, report

# Manually reviewed names that are absent from the downloaded name CSVs, or
# belong to this fan game's own upgrade/card vocabulary. Keys are DISPLAY
# text only; do not write them back to gameplay data structures.
LOCAL_GAME_NAMES = {
    'moves': {'Foco Resplandor': '加農光炮'},
    'abilities': {},
    'items': {
        'Banda Focus': '氣勢披帶',
        'Cambio de cartas': '更換卡牌',
        'Coraza': '護甲',
        'Fortuna': '幸運',
        'Fuerza': '力量',
        'Golpe Crítico': '暴擊',
        'Reflejos': '反應速度',
        'Repertorio': '技能庫',
        'Sabiduría': '智慧',
        'Síntesis': '再生',  # shop upgrade; a move with this name means Synthesis
        'Veto': '排除',
        'Vitalidad': '生命力',
        'Zancada': '移動速度',
    },
}

# Static-code review only: no write to game JS files, and does not inspect
# users' saved data. Detects literals from public JS checked out at build time.
TEXT_FIELD = re.compile(
    r"(?<![\w$])(?:description|descripcion|descripción|desc|effect|efecto|"
    r"tooltip|objective|objetivo|message|mensaje|text|texto|hint|subtitle|"
    r"label|title|titulo|título|help|summary)\s*:\s*(['\"])((?:\\.|(?!\1)[^\r\n]){3,320})\1",
    re.IGNORECASE,
)
UI_STRING = re.compile(r"(['\"])((?:\\.|(?!\1)[^\r\n]){8,260})\1")
SPANISH_WORDS = re.compile(r'\b(?:el|la|los|las|un|una|del|para|por|con|sin|que|cuando|cada|'
                           r'aumenta|reduce|recupera|obtén|consigue|tienes|durante|tiempo|'
                           r'ataque|daño|habilidad|objeto|recompensa|nivel|vida|movimiento|'
                           r'enemigos|elegir|recibe|daños|derrota|enemigo|crítico)\b', re.I)

def _candidate_text(value):
    value = value.strip().replace('\\n', ' ').replace('\\t', ' ')
    if not (6 <= len(value) <= 240): return None
    if '${' in value or '<' in value or '>' in value or '\\x' in value or '\\u' in value:
        return None
    if '://' in value or '/' in value and value.endswith(('.png','.webp','.js','.ogg','.json')):
        return None
    if not re.search(r'[A-Za-zÀ-ÿ]', value): return None
    if value.count('{')+value.count('}') > 0: return None
    if not (SPANISH_WORDS.search(value) or re.search(r'[áéíóúñ¿¡]', value, re.I)):
        return None
    return re.sub(r'\s+', ' ', value)

def _ui_dictionary_keys():
    """Conservative key extraction from our own JS translations for reporting."""
    data = (ROOT/'private-zh-tw.js').read_text(encoding='utf8')
    pair = re.compile(r"(['\"])([^\r\n'\"\\]{2,170})\1\s*:\s*(['\"])([^\r\n'\"\\]{1,220})\3")
    return {m.group(2) for m in pair.finditer(data)}

def audit_static_text(official_terms):
    """Inventory probable untranslated source literals. Not a translation-rate metric."""
    terms = set(_ui_dictionary_keys())
    for names in official_terms.values(): terms.update(names)
    for names in LOCAL_GAME_NAMES.values(): terms.update(names)
    # Parse the exact literal keys reviewed by the V2.7 display layer.
    # No extra files are required in the GitHub upload.
    localized = (ROOT / 'private-zh-tw.js').read_text(encoding='utf8')
    match = re.search(r'const reviewedTextsV27 = (\{.*?\});\n', localized, flags=re.DOTALL)
    if not match: raise SystemExit('找不到 V2.7 人工校對翻譯字典，停止部署。')
    reviewed = json.loads(match.group(1))
    terms.update(reviewed)
    results = {}
    def category_for(path):
        name = path.name.lower()
        if 'move' in name or 'skill' in name: return 'moves_and_skills'
        if 'abilit' in name or 'passiv' in name: return 'abilities_and_passives'
        if 'item' in name or 'equip' in name or 'upgrade' in name: return 'items_and_upgrades'
        if any(k in name for k in ('mission','quest','achievement','daily','weekly')): return 'quests_and_achievements'
        if 'battle' in name or 'run' in name or 'combat' in name: return 'battle_and_leveling'
        return 'interface_and_other'
    for path in sorted((ROOT/'js').rglob('*.js')):
        if path.name.endswith('.min.js') or 'vendor' in path.parts: continue
        if path.stat().st_size > 900_000: continue
        rel = path.relative_to(ROOT).as_posix()
        if rel.startswith('js/data/pokedex'): continue  # 966 species already mapped
        raw = path.read_text(encoding='utf8', errors='replace')
        bucket = category_for(path)
        found = {}
        # Search field-value strings in data modules and likely Spanish UI literals.
        for match in TEXT_FIELD.finditer(raw):
            val = _candidate_text(match.group(2))
            if val: found.setdefault(val, 'field_value')
        if '/ui/' in rel or '/systems/' in rel:
            for match in UI_STRING.finditer(raw):
                val = _candidate_text(match.group(2))
                if val: found.setdefault(val, 'interface_literal')
        # DOM-heavy screens often assemble visible text inside JS template HTML.
        # Report those literals without editing or executing any game code.
        if '/ui/' in rel or '/systems/' in rel:
            for template in re.finditer(r'`([^`]{10,6000})`', raw, re.DOTALL):
                if '<' not in template.group(1): continue
                for part in re.finditer(r'>([^<>]{6,240})<', template.group(1)):
                    val = _candidate_text(part.group(1))
                    if val: found.setdefault(val, 'html_template_text')
        for val, kind in found.items():
            key=(bucket,val)
            if key not in results:
                results[key]={'category':bucket,'text':val,'source_file':rel,
                              'kind':kind,'status':'already_matched' if val in terms else 'needs_review'}
    # Initial static HTML can contain text outside JavaScript modules.
    html_file = ROOT/'dev.html'
    if html_file.is_file():
        html = html_file.read_text(encoding='utf8', errors='replace')
        html = re.sub(r'<script\b[^>]*>.*?</script>', '', html, flags=re.DOTALL|re.I)
        for match in re.finditer(r'>([^<>]{6,260})<', html):
            val = _candidate_text(match.group(1))
            if val:
                key=('interface_and_other',val)
                if key not in results:
                    results[key]={'category':'interface_and_other','text':val,'source_file':'dev.html',
                                  'kind':'html_static_text','status':'already_matched' if val in terms else 'needs_review'}
    items = sorted(results.values(), key=lambda x:(x['category'],x['status'],x['text'].casefold()))
    by_category={}
    for item in items:
        rec=by_category.setdefault(item['category'],{'detected':0,'already_matched':0,'needs_review':0})
        rec['detected']+=1
        rec[item['status']]+=1
    return {'detected_static_literals':len(items),
            'recognized_in_dictionary':sum(x['status']=='already_matched' for x in items),
            'remaining_for_manual_review':sum(x['status']=='needs_review' for x in items),
            'by_category':by_category,
            'v27_reviewed_count': len(reviewed),
            'caveat':'靜態字串啟發式掃描，並非完整覆蓋率。可能有偽陽性、HTML 模板或執行時產生的文字未納入。'}, items

def audit_source_names(terms):
    # Report *potential* unpaired names, not a promise of 100% coverage.
    reports = {}
    for category, files in {
        'moves': ['js/data/moves.js'],
        'abilities': ['js/data/abilities.js'],
        'items': ['js/data/items.js', 'js/data/upgrades.js'],
    }.items():
        names = set()
        for filename in files:
            path = ROOT / filename
            if not path.is_file(): continue
            raw = path.read_text(encoding='utf-8')
            for match in re.finditer(r"(?:[\"']?)(?:name|nombre)[\"']?\s*:\s*([\"'])(.{2,100}?)\1", raw):
                value = match.group(2).strip()
                if value and not re.search(r'[$\{\}\n\r]', value): names.add(value)
        official = sorted(v for v in names if v in terms[category])
        local = sorted(v for v in names if v not in terms[category] and v in LOCAL_GAME_NAMES[category])
        missing = sorted(v for v in names if v not in terms[category] and v not in LOCAL_GAME_NAMES[category])
        translated = official + local
        reports[category] = {
            'detected_source_names': len(names),
            'matched_source_names': len(translated),
            'matched_official': len(official),
            'matched_local_overrides': len(local),
            'unmatched_source_names': missing[:500],
            'note': '僅掃描已存在資料檔的 name/nombre 字面值，非完整遊戲翻譯率。'
        }
    return reports

def build():
    devpath = ROOT / 'dev.html'
    if not devpath.is_file():
        raise SystemExit('找不到 dev.html：請在 PokéSurvivor 原始碼專案根目錄執行。')
    if not (ROOT / 'private-cheats.js').is_file():
        raise SystemExit('缺少 private-cheats.js')
    if not (ROOT / 'private-zh-tw.js').is_file():
        raise SystemExit('缺少 private-zh-tw.js：V2.7 需有此檔案')
    dev = devpath.read_text(encoding='utf-8')
    a, b = dev.find(BEGIN), dev.find(END)
    if a < 0 or b < a:
        raise SystemExit('遊戲原始碼結構已變更：找不到 scripts:begin / scripts:end。停止，避免錯誤發布。')
    block = dev[a:b+len(END)]
    scripts = re.findall(r'<script\s+defer\s+src="(js/[^"?]+\.js)(?:\?[^\"]*)?"\s*>', block)
    required = ['js/core/util.js', 'js/core/db.js', 'js/entities/player.js',
                'js/systems/gacha.js', 'js/ui/run-ui.js', 'js/game.js', 'js/main.js']
    if not all(f in scripts for f in required):
        raise SystemExit('上游遊戲核心檔案與目前修改版不相容，停止發布。')
    dex_zh = build_dex_chinese_map()
    terms_zh, term_stats = build_game_terms()
    source_audit = audit_source_names(terms_zh)
    text_audit, text_todo = audit_static_text(terms_zh)
    reviewed_count = text_audit.get('v27_reviewed_count', 0)
    if SITE.exists(): shutil.rmtree(SITE)
    SITE.mkdir(parents=True)
    # All sprites remain in the private fork. Credits/licenses must be retained.
    for name in ('assets', 'css'):
        if (ROOT / name).is_dir(): shutil.copytree(ROOT / name, SITE / name)
    for name in ('favicon.ico', '.nojekyll', 'CREDITS.md', 'LICENSE', 'LICENSE-NONCOMMERCIAL.md', 'README.md'):
        if (ROOT / name).exists(): shutil.copy2(ROOT / name, SITE / name)

    output_js = []
    for name in scripts:
        if name == 'js/core/firebase-config.js':
            # Deliberately exclude real remote Firebase credentials.
            continue
        if name == 'js/main.js':
            # The normal game launcher executes last. The cheat hooks run first.
            output_js.append('/* Force permanently LOCAL database mode */\nG.FIREBASE_CONFIG = null;')
            output_js.append('/* Private features */\n' + (ROOT/'private-cheats.js').read_text('utf-8'))
            output_js.append('/* Full national dex Traditional Chinese names (baked at build-time) */\n' + 'globalThis.PS_PRIVATE_DEX_ZH = Object.freeze(' + json.dumps(dex_zh, ensure_ascii=False, separators=(',', ':')) + ');')
            output_js.append('/* Official PokéAPI localized move/ability/item names (V2.7 build time; no runtime fetch) */\n' + 'globalThis.PS_PRIVATE_TERMS_ZH = Object.freeze(' + json.dumps(terms_zh, ensure_ascii=False, separators=(',', ':')) + ');')
            output_js.append('/* Verified local names for missing terms */\n' + 'globalThis.PS_PRIVATE_GAME_NAMES_ZH = Object.freeze(' + json.dumps(LOCAL_GAME_NAMES, ensure_ascii=False, separators=(',', ':')) + ');')
            output_js.append('/* Traditional Chinese UI overlay (V2.7 terms and dex) */\n' + (ROOT/'private-zh-tw.js').read_text('utf-8'))
        path = ROOT / name
        if not path.exists():
            raise SystemExit('缺少上游檔案 ' + name)
        output_js.append('/* ' + name + ' */\n' + path.read_text('utf-8'))
    (SITE/'js').mkdir(exist_ok=True)
    (SITE/'js'/'private-game.js').write_text('\n;\n'.join(output_js)+'\n', encoding='utf-8')

    html = dev[:a] + '<script defer src="js/private-game.js?v=private-v2-7"></script>' + dev[b+len(END):]
    # Use the source Spanish text as stable keys for the local overlay.
    # This only changes the private site origin; the original game is unaffected.
    html = html.replace('</head>', '<script>try{localStorage.setItem("ps.lang","es")}catch(_){}</script></head>', 1)
    html = html.replace('<title>PokéSurvivor –', '<title>PokéSurvivor 私人版 –')
    html = html.replace('content="PokéSurvivor"', 'content="PS私人版"')
    html = re.sub(r'<link rel="canonical"[^>]*>\s*', '', html)
    html = re.sub(r'<meta name="robots"[^>]*>', '<meta name="robots" content="noindex,nofollow">', html)
    html = re.sub(r'<meta property="og:url"[^>]*>\s*', '', html)
    html = re.sub(r'<meta property="og:image"[^>]*>\s*', '', html)
    html = re.sub(r'<meta name="twitter:image"[^>]*>\s*', '', html)
    # Disambiguate the private edition without erasing the upstream license/credits.
    html = html.replace('Web oficial: pokesurvivor.com · si alguien te pide pagar, no somos nosotros',
                        '私人非官方修改版 · 僅供個人非商業使用 · 原作者 JPTER78 · 不使用官方雲端')
    (SITE/'index.html').write_text(html, encoding='utf-8')

    manifest = json.loads((ROOT/'manifest.webmanifest').read_text('utf-8'))
    manifest.update(name='PokéSurvivor 私人版', short_name='PS私人版',
                    description='非官方、個人非商業用 iPhone 本機金手指修改版', lang='zh-TW')
    (SITE/'manifest.webmanifest').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    (SITE/'version.json').write_text(json.dumps({'v':'private-v2.7','private':True}), encoding='utf-8')
    (SITE/'translation-report.json').write_text(json.dumps({
        'version': 'private-v2.7',
        'pokemon_names': len(dex_zh),
        'official_name_tables': term_stats,
        'source_name_audit': source_audit,
        'local_name_overrides': {k: len(v) for k,v in LOCAL_GAME_NAMES.items()},
        'static_text_audit': text_audit,
        'translation_todo_url': 'translation-todo.json',
        'reviewed_v27_texts': reviewed_count,
        'limitations': [
            '保留 V2.5 官方名稱對照及 14 個遊戲專用名稱。V2.7 新增人工校對的靜態顯示文字，並非全部執行時文字。',
            'V2.7 額外掃描遊戲原始碼的疑似西班牙文敘述並列於 translation-todo.json；報告並未自動將其翻譯。',
            '所有稽核均為啟發式，不代表總遊戲文字覆蓋率；動態組合文字可能未列入。'
        ]
    }, ensure_ascii=False, indent=2), encoding='utf-8')

    (SITE/'translation-todo.json').write_text(json.dumps({
        'version': 'private-v2.7',
        'summary': text_audit,
        'entries': [x for x in text_todo if x['status'] == 'needs_review'],
        'notice': '這是來自公開遊戲原始碼的待檢查清單，並非已自動翻譯的文字。'
    }, ensure_ascii=False, indent=2), encoding='utf-8')

    # Keep upstream fetch cache strategy and eagerly cache our ENTIRE core executable.
    sw = (ROOT/'sw.js').read_text('utf-8')
    original = "['./', './index.html', './css/style.css', './manifest.webmanifest']"
    if original not in sw:
        raise SystemExit('上游 sw.js 已變更，請重新檢查離線預載邏輯。')
    sw = sw.replace(original,
          "['./', './index.html', './css/style.css', './manifest.webmanifest', './js/private-game.js']")
    sw = sw.replace("'ps-code-v1'", "'ps-private-code-v2-7'").replace("'ps-art-v1'", "'ps-private-art-v1'")
    (SITE/'sw.js').write_text(sw, encoding='utf-8')
    print('私人版 V2.7 建置完成：' + str(SITE))
    print('保留原本金手指與本機存檔；新增 V2.7 人工校對的靜態文字對照及剩餘待翻譯清單。')
    print('注意：部分效果描述、任務與成就已新增中文，但動態內容仍可能缺漏；詳見 translation-todo.json。')
    print('警告：未預先快取的全部精靈圖片，離線時不保證可顯示。')

if __name__ == '__main__': build()
