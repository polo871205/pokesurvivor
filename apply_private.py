#!/usr/bin/env python3
"""Build private, local-only PokéSurvivor Pages site from an upstream fork.

Usage: python3 apply_private.py
Output: ./_site/ (for GitHub Pages). Build-time PokeAPI CSV access required.
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
        POKEAPI_NAMES, headers={'User-Agent':'PokeSurvivor-private-zh-Hant-build/2.5'})
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

# V2.5: official move / ability / item names. We do not rewrite gameplay
# variables or source names; all mappings are used by the UI-only overlay.
POKEAPI_CSV_BASE = 'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/'
TERM_TABLES = {
    'moves': ('move_names.csv', 'move_id'),
    'abilities': ('ability_names.csv', 'ability_id'),
    'items': ('item_names.csv', 'item_id'),
}

def _download_csv(url):
    request = urllib.request.Request(url, headers={
        'User-Agent': 'PokeSurvivor-private-zh-Hant-build/2.5'
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
            raise SystemExit(f'V2.5 無法取得 {csv_name}，為避免缺漏而停止部署：{exc}')
        terms, stats = _terms_from_rows(rows, id_field)
        # A zero-name result indicates a schema change or upstream outage.
        if len(terms) < 10:
            raise SystemExit(f'V2.5 {csv_name} 缺少有效的繁中對照，停止部署（{len(terms)} 筆）')
        combined[group] = terms
        report[group] = stats
        print(f'V2.5 {group}: {stats["localized_entries"]} 個繁中名稱、{stats["name_pairs"]} 組西文/英文對照，跳過 {stats["ambiguous_names_skipped"]} 個衝突名稱')
    return combined, report

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
        translated = sorted(v for v in names if v in terms[category])
        missing = sorted(v for v in names if v not in terms[category])
        reports[category] = {
            'detected_source_names': len(names),
            'matched_source_names': len(translated),
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
        raise SystemExit('缺少 private-zh-tw.js：V2.5 需有此檔案')
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
            output_js.append('/* Official PokéAPI localized move/ability/item names (V2.5 build time; no runtime fetch) */\n' + 'globalThis.PS_PRIVATE_TERMS_ZH = Object.freeze(' + json.dumps(terms_zh, ensure_ascii=False, separators=(',', ':')) + ');')
            output_js.append('/* Traditional Chinese UI overlay (V2.5 terms and dex) */\n' + (ROOT/'private-zh-tw.js').read_text('utf-8'))
        path = ROOT / name
        if not path.exists():
            raise SystemExit('缺少上游檔案 ' + name)
        output_js.append('/* ' + name + ' */\n' + path.read_text('utf-8'))
    (SITE/'js').mkdir(exist_ok=True)
    (SITE/'js'/'private-game.js').write_text('\n;\n'.join(output_js)+'\n', encoding='utf-8')

    html = dev[:a] + '<script defer src="js/private-game.js?v=private-v2-5"></script>' + dev[b+len(END):]
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
    (SITE/'version.json').write_text(json.dumps({'v':'private-v2.5','private':True}), encoding='utf-8')
    (SITE/'translation-report.json').write_text(json.dumps({
        'version': 'private-v2.5',
        'pokemon_names': len(dex_zh),
        'official_name_tables': term_stats,
        'source_name_audit': source_audit,
        'limitations': [
            '僅姓名欄位與直接可辨識的文字對照；特殊招式、特性、裝備名可能無法匹配。',
            '遊戲自行撰寫的技能效果、裝備描述、任務與成就文字仍非完整翻譯。',
            'name/nombre 稽核是啟發式比對，不代表總遊戲文字覆蓋率。'
        ]
    }, ensure_ascii=False, indent=2), encoding='utf-8')

    # Keep upstream fetch cache strategy and eagerly cache our ENTIRE core executable.
    sw = (ROOT/'sw.js').read_text('utf-8')
    original = "['./', './index.html', './css/style.css', './manifest.webmanifest']"
    if original not in sw:
        raise SystemExit('上游 sw.js 已變更，請重新檢查離線預載邏輯。')
    sw = sw.replace(original,
          "['./', './index.html', './css/style.css', './manifest.webmanifest', './js/private-game.js']")
    sw = sw.replace("'ps-code-v1'", "'ps-private-code-v2-5'").replace("'ps-art-v1'", "'ps-private-art-v1'")
    (SITE/'sw.js').write_text(sw, encoding='utf-8')
    print('私人版 V2.5 建置完成：' + str(SITE))
    print('包含 V2.0 金手指、本機存檔及 V2.5 一次產生寶可夢、招式、特性及道具中文名稱與動態文字刷新，保留原作者授權署名。')
    print('注意：官方技能／特性／道具名稱會自動比對；原創名稱、效果描述、任務與成就仍可能未翻譯。')
    print('警告：未預先快取的全部精靈圖片，離線時不保證可顯示。')

if __name__ == '__main__': build()
