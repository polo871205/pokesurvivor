#!/usr/bin/env python3
"""Build private, local-only PokéSurvivor Pages site from an upstream fork.

Usage: python3 apply_private.py
Output: ./_site/ (for GitHub Pages). No npm, no network calls.
"""
from __future__ import annotations
import csv
import io
import json
import urllib.request
import re
import shutil
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
        POKEAPI_NAMES, headers={'User-Agent':'PokeSurvivor-private-zh-Hant-build/2.4'})
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

def build():
    devpath = ROOT / 'dev.html'
    if not devpath.is_file():
        raise SystemExit('找不到 dev.html：請在 PokéSurvivor 原始碼專案根目錄執行。')
    if not (ROOT / 'private-cheats.js').is_file():
        raise SystemExit('缺少 private-cheats.js')
    if not (ROOT / 'private-zh-tw.js').is_file():
        raise SystemExit('缺少 private-zh-tw.js：V2.4 需有此檔案')
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
            output_js.append('/* Traditional Chinese UI overlay (V2.4 full dex names) */\n' + (ROOT/'private-zh-tw.js').read_text('utf-8'))
        path = ROOT / name
        if not path.exists():
            raise SystemExit('缺少上游檔案 ' + name)
        output_js.append('/* ' + name + ' */\n' + path.read_text('utf-8'))
    (SITE/'js').mkdir(exist_ok=True)
    (SITE/'js'/'private-game.js').write_text('\n;\n'.join(output_js)+'\n', encoding='utf-8')

    html = dev[:a] + '<script defer src="js/private-game.js?v=private-v2-4"></script>' + dev[b+len(END):]
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
    (SITE/'version.json').write_text(json.dumps({'v':'private-v2.4','private':True}), encoding='utf-8')

    # Keep upstream fetch cache strategy and eagerly cache our ENTIRE core executable.
    sw = (ROOT/'sw.js').read_text('utf-8')
    original = "['./', './index.html', './css/style.css', './manifest.webmanifest']"
    if original not in sw:
        raise SystemExit('上游 sw.js 已變更，請重新檢查離線預載邏輯。')
    sw = sw.replace(original,
          "['./', './index.html', './css/style.css', './manifest.webmanifest', './js/private-game.js']")
    sw = sw.replace("'ps-code-v1'", "'ps-private-code-v2-3'").replace("'ps-art-v1'", "'ps-private-art-v1'")
    (SITE/'sw.js').write_text(sw, encoding='utf-8')
    print('私人版 V2.4 建置完成：' + str(SITE))
    print('包含 V2.0 金手指、本機存檔及 V2.4 一次產生全圖鑑中文名稱與動態文字刷新，保留原作者授權署名。')
    print('注意：本次批次完成圖鑑內全部寶可夢的名稱對照，但招式、特性與敘述仍須分批翻譯。')
    print('警告：未預先快取的全部精靈圖片，離線時不保證可顯示。')

if __name__ == '__main__': build()
