/*
 * PokéSurvivor iPhone 私人版 V1.0
 * For a privately hosted, NONCOMMERCIAL copy of JPTER78/pokesurvivor.
 * NOT an official PokéSurvivor release. Original source & asset credits remain in the fork.
 * This module is bundled AFTER all game modules, BEFORE js/main.js, in a local-only build.
 */
(() => {
  'use strict';
  if (typeof G === 'undefined' || !G.DB || !G.Gacha || !G.Player || !G.RunUI) {
    console.warn('[Private V1] Missing game modules; cheat module not installed');
    return;
  }

  // Separate cheat preferences from game saves. No cloud service / analytics.
  const PREF = 'ps.private.v1.settings';
  const defaults = Object.freeze({ exp20: true, reroll: true, gacha: true, unlock: true, coins: true });
  let prefs = { ...defaults };
  try {
    const prev = JSON.parse(localStorage.getItem(PREF) || 'null');
    if (prev && typeof prev === 'object') {
      for (const k of Object.keys(defaults)) if (typeof prev[k] === 'boolean') prefs[k] = prev[k];
    }
  } catch (_) { /* storage denied */ }

  const COIN_FLOOR = 1_000_000_000; // Refilled on every save/purchase, not Infinity (JSON-safe).
  let busyApplying = false;
  let appliedFor = null;
  function currentSave() { return G.DB && G.DB.save; }
  function savePrefs() { try { localStorage.setItem(PREF, JSON.stringify(prefs)); } catch (_) {} }
  function validDex() { return (G.DEX || []).filter(p => p && G.SPRITE_META && G.SPRITE_META[p.dex]); }
  function fillCoins(save) {
    if (save && prefs.coins && Number.isFinite(+save.coins) && save.coins < COIN_FLOOR) save.coins = COIN_FLOOR;
  }
  function unlockAll(save) {
    if (!save || !prefs.unlock) return 0;
    if (!save.owned || typeof save.owned !== 'object') save.owned = {};
    let count = 0;
    const now = Date.now();
    for (const mon of validDex()) {
      if (!save.owned[mon.dex]) { save.owned[mon.dex] = { at: now, from: 'private' }; count++; }
    }
    // Shiny variants are deliberately untouched.
    return count;
  }

  // Important: per-profile application, not on guest-only saves (guests never persist).
  function applySave() {
    const save = currentSave();
    if (!save || G.DB.mode !== 'local' || G.DB.guest || busyApplying) return;
    const identity = save;
    if (appliedFor === identity && !prefs.coins) return;
    const first = appliedFor !== identity;
    appliedFor = identity;
    busyApplying = true;
    try {
      const prev = save.coins;
      fillCoins(save);
      const added = unlockAll(save);
      if (first || prev !== save.coins || added) G.DB.commit(true);
    } finally { busyApplying = false; }
  }
  // Save hook: restores the money after each upgrade purchase, BEFORE the persistence write.
  const originalCommit = G.DB.commit.bind(G.DB);
  G.DB.commit = function (...args) {
    if (!busyApplying && G.DB.mode === 'local' && !G.DB.guest) fillCoins(currentSave());
    return originalCommit(...args);
  };
  for (const key of ['ready', 'register', 'login']) {
    const orig = G.DB[key].bind(G.DB);
    G.DB[key] = function (...args) {
      return Promise.resolve(orig(...args)).then(result => { applySave(); return result; });
    };
  }

  // 20x only on earned XP, preserving the game's original xpMul buffs.
  const originalGainXp = G.Player.prototype.gainXp;
  G.Player.prototype.gainXp = function (amount, ...args) {
    return originalGainXp.call(this, prefs.exp20 ? amount * 20 : amount, ...args);
  };

  // Unlimited rerolls: temporarily remove the cost, then restore the original counter.
  const originalReroll = G.RunUI.reroll.bind(G.RunUI);
  G.RunUI.reroll = function (...args) {
    const pl = G.Game && G.Game.player;
    if (!prefs.reroll || !pl) return originalReroll(...args);
    const prev = pl.rerolls || 0;
    pl.rerolls = -1_000_000;
    try { return originalReroll(...args); }
    finally {
      pl.rerolls = prev;
      const remaining = document.getElementById('lvl-rr-n');
      const btn = document.getElementById('lvl-reroll');
      if (remaining) remaining.textContent = '∞';
      if (btn && !document.getElementById('scr-levelup')?.classList.contains('hidden')) btn.classList.remove('hidden');
    }
  };
  const originalShowLevelUp = G.RunUI.showLevelUp.bind(G.RunUI);
  G.RunUI.showLevelUp = function (...args) {
    const result = originalShowLevelUp(...args);
    const btn = document.getElementById('lvl-reroll');
    if (btn) btn.onclick = G.RunUI.reroll;
    if (prefs.reroll) {
      const cnt = document.getElementById('lvl-rr-n');
      if (cnt) cnt.textContent = '∞';
      if (btn) btn.classList.remove('hidden');
    }
    return result;
  };

  // Gacha core uses a CLOSED-OVER costOf() internally; replacing exported costOf only
  // affects the UI. Temporarily credit exact tickets before the original pull call.
  const originalCostOf = G.Gacha.costOf.bind(G.Gacha);
  const originalPull = G.Gacha.pull.bind(G.Gacha);
  G.Gacha.costOf = (save, n, use = 't1') => prefs.gacha ? { t1: 0, t10: 0 } : originalCostOf(save, n, use);
  G.Gacha.pull = function (save, n, gen, use = 't1') {
    if (!prefs.gacha) return originalPull(save, n, gen, use);
    if (!save) return null;
    if (!save.tickets) save.tickets = { t1: 0, t10: 0 };
    const t = save.tickets;
    const isTenTicket = n === 10 && use === 't10';
    const key = isTenTicket ? 't10' : 't1';
    const need = isTenTicket ? 1 : n;
    const before = Math.max(0, Number(t[key]) || 0);
    // Treat negative / odd values as zero, avoiding corrupting ticket balances.
    t[key] = before + need;
    try {
      const results = originalPull(save, n, gen, use);
      if (results) t[key] = before; // Exactly zero tickets used for the roll.
      return results;
    } finally {
      // If the draw failed or threw, undo temporary credit too.
      if (t[key] !== before) t[key] = before;
    }
  };

  // UI for iPhone landscape and desktop; never blocks touch gameplay when closed.
  function makeUI() {
    if (document.getElementById('ps-private-btn')) return;
    const style = document.createElement('style');
    style.textContent = `
      #ps-private-btn{position:fixed;right:max(8px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));z-index:9000;background:#f2c94c;color:#15223f;border:2px solid #9b7326;border-radius:12px;padding:9px 13px;font:bold 14px system-ui;box-shadow:0 3px 12px #000a;touch-action:manipulation}
      #ps-private-panel{position:fixed;inset:0;z-index:9001;background:#050c17c9;display:flex;align-items:center;justify-content:center;padding:calc(env(safe-area-inset-top) + 8px) calc(env(safe-area-inset-right) + 8px) calc(env(safe-area-inset-bottom) + 8px) calc(env(safe-area-inset-left) + 8px);font:14px/1.45 system-ui;color:#f7f9fe}
      #ps-private-panel[hidden]{display:none}
      .ps-private-box{max-height:96dvh;overflow:auto;width:min(440px,100%);border:2px solid #d5b355;background:#14213b;border-radius:16px;padding:14px;box-shadow:0 10px 40px #000c}
      .ps-private-title{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:20px;font-weight:800;color:#ffdf76}
      .ps-private-close{padding:4px 10px;border-radius:8px;border:1px solid #8295b0;background:#273b5c;color:white;font-weight:bold}
      .ps-private-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:8px 0;border-bottom:1px solid #334563}
      .ps-private-row input{width:23px;height:23px;accent-color:#f2c94c;flex-shrink:0}
      .ps-private-note{font-size:12px;color:#c3d3e9;margin:8px 0}
      .ps-private-action{padding:10px 12px;border:1px solid #e8be48;background:#273b5c;color:#fff;border-radius:10px;font-weight:bold;margin-top:8px;width:100%}
      #ps-private-status{color:#dbe9fc;font-size:12px;margin:8px 0 0}
    `;
    document.head.appendChild(style);
    const btn = document.createElement('button');
    btn.id = 'ps-private-btn'; btn.type = 'button'; btn.textContent = '金手指';
    btn.setAttribute('aria-label', '私人版金手指設定');
    const panel = document.createElement('div');
    panel.id = 'ps-private-panel'; panel.hidden = true;
    panel.innerHTML = `
      <div class="ps-private-box" role="dialog" aria-modal="true" aria-label="私人版金手指設定">
        <div class="ps-private-title"><span>PokéSurvivor 私人版</span><button class="ps-private-close" type="button">關閉</button></div>
        <div class="ps-private-note">V1.0 · 完全本機帳號 · 非官方修改版 · 僅限私人非商業使用</div>
        <div id="ps-private-options"></div>
        <button class="ps-private-action" id="ps-private-unlock" type="button">重新套用全寶可夢解鎖與金幣</button>
        <button class="ps-private-action" id="ps-private-export" type="button">匯出本機存檔備份（JSON）</button>
        <button class="ps-private-action" id="ps-private-import" type="button">匯入先前備份（將覆蓋目前存檔）</button>
        <input id="ps-private-import-file" type="file" accept="application/json,.json" style="display:none">
        <button class="ps-private-action" id="ps-private-cache" type="button">下載全圖鑑動畫離線素材（大量；Wi-Fi）</button>
        <button class="ps-private-action" id="ps-private-cancel" type="button" hidden>停止下載離線素材</button>
        <p class="ps-private-note" id="ps-private-progress">離線核心檔案會在安裝後快取；所有 Pokémon 圖片需另行下載。Safari 可能因儲存空間壓力清理快取。</p>
        <p class="ps-private-note">請建立「本機帳號」並登入，不要使用「訪客」模式，否則遊戲原本就不會儲存進度。</p>
        <p class="ps-private-note">離線需先在有網路時開啟、安裝至主畫面並完成遊戲載入；未快取的寶可夢圖片可能無法顯示，iOS 也可能清除快取。</p>
        <p id="ps-private-status"></p>
      </div>`;
    document.body.append(btn, panel);
    const labels = [
      ['exp20', '經驗值 ×20'],
      ['reroll', '無限重抽技能'],
      ['gacha', '無限抽卡（單抽／十連）'],
      ['unlock', '解鎖全部一般寶可夢'],
      ['coins', '無限金幣（自動補滿）']
    ];
    const options = panel.querySelector('#ps-private-options');
    for (const [key, title] of labels) {
      const row = document.createElement('label');
      row.className = 'ps-private-row';
      const name = document.createElement('span'); name.textContent = title;
      const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = prefs[key];
      cb.addEventListener('change', () => {
        prefs[key] = cb.checked; savePrefs();
        if (prefs[key] && (key === 'coins' || key === 'unlock')) applySave();
        if (key === 'reroll') {
          const count = document.getElementById('lvl-rr-n');
          const rr = document.getElementById('lvl-reroll');
          if (prefs.reroll && count) count.textContent = '∞';
          if (prefs.reroll && rr) rr.classList.remove('hidden');
        }
        updateStatus();
      });
      row.append(name, cb); options.append(row);
    }
    function updateStatus() {
      const s = currentSave();
      const status = panel.querySelector('#ps-private-status');
      status.textContent = !s ? '尚未登入：請先建立本機帳號。'
        : G.DB.guest ? '目前是訪客模式，離開後進度不會保留。'
        : G.DB.mode !== 'local' ? '警告：目前不是本機模式！請停止使用。'
        : '本機存檔已啟用 · 金幣：' + Math.floor(s.coins || 0).toLocaleString() + ' · 一般寶可夢：' + Object.keys(s.owned || {}).length;
    }
    const close = () => { panel.hidden = true; };
    btn.onclick = () => { applySave(); updateStatus(); panel.hidden = false; };
    panel.querySelector('.ps-private-close').onclick = close;
    panel.addEventListener('click', event => { if (event.target === panel) close(); });
    panel.querySelector('#ps-private-unlock').onclick = () => {
      const save = currentSave();
      if (!save || G.DB.guest || G.DB.mode !== 'local') { updateStatus(); return; }
      if (!confirm('解鎖全部一般寶可夢會永久改變此本機存檔（不包含異色）。確定繼續嗎？')) return;
      appliedFor = null; applySave(); updateStatus();
    };
    panel.querySelector('#ps-private-export').onclick = () => {
      const save = currentSave();
      if (!save || G.DB.guest) { updateStatus(); return; }
      G.DB.commit(true);
      const content = JSON.stringify({ kind: 'pokesurvivor-private-backup-v1', exported: new Date().toISOString(), save }, null, 2);
      const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = `pokesurvivor-private-${new Date().toISOString().slice(0,10)}.json`;
      document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10_000);
    };
    const fileInput = panel.querySelector('#ps-private-import-file');
    panel.querySelector('#ps-private-import').onclick = () => {
      if (!currentSave() || G.DB.guest || G.DB.mode !== 'local') return updateStatus();
      fileInput.click();
    };
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      try {
        if (file.size > 6 * 1024 * 1024) throw new Error('存檔檔案過大');
        const data = JSON.parse(await file.text());
        const incoming = data && data.kind === 'pokesurvivor-private-backup-v1' ? data.save : null;
        if (!incoming || typeof incoming !== 'object' || !incoming.owned || !incoming.tickets || !incoming.stats)
          throw new Error('不是有效的私人版存檔 JSON');
        if (G.DB.mode !== 'local' || G.DB.guest || !G.DB.user) throw new Error('請先登入本機帳號');
        if (!confirm('匯入將覆蓋目前這個本機帳號的存檔。建議先匯出目前進度。確定匯入嗎？')) return;
        incoming.name = G.DB.user;
        const key = 'ps.save.' + G.DB.user.toLowerCase();
        localStorage.setItem(key, JSON.stringify(incoming));
        location.reload();
      } catch (e) { alert('匯入失敗：' + e.message); }
      finally { fileInput.value = ''; }
    });

    let stopCache = false, cacheRunning = false;
    const cacheBtn = panel.querySelector('#ps-private-cache');
    const cancelBtn = panel.querySelector('#ps-private-cancel');
    const progress = panel.querySelector('#ps-private-progress');
    cancelBtn.onclick = () => { stopCache = true; progress.textContent = '正在停止，請稍候…'; };
    cacheBtn.onclick = async () => {
      if (cacheRunning) return;
      if (!('caches' in window)) { progress.textContent = '此瀏覽器不支援離線快取。'; return; }
      if (!confirm('將下載一般與異色寶可夢的完整動畫素材，可能有數千個檔案、耗費大量流量與儲存空間。請保持 Wi-Fi 與畫面開啟。繼續嗎？')) return;
      cacheRunning = true; stopCache = false; cacheBtn.disabled = true; cancelBtn.hidden = false;
      const entries = Object.entries(G.SPRITE_META || {});
      const paths = [];
      for (const [dex, meta] of entries) {
        if (!meta || !meta.a) continue;
        for (const anim of Object.keys(meta.a)) {
          paths.push(`assets/pokemon/${dex}/${anim}.png`);
          if (meta.sh && !(meta.sm || []).includes(anim)) paths.push(`assets/pokemon/${dex}/s/${anim}.png`);
        }
      }
      let ok = 0, failed = 0, done = 0, next = 0;
      try {
        const cache = await caches.open('ps-private-art-v1');
        const work = async () => {
          while (!stopCache) {
            const i = next++;
            if (i >= paths.length) break;
            const path = paths[i];
            try {
              if (!(await cache.match(path))) {
                const res = await fetch(path);
                if (!res.ok) throw new Error('HTTP ' + res.status);
                await cache.put(path, res.clone());
              }
              ok++;
            } catch (e) {
              failed++;
              if (e && (e.name === 'QuotaExceededError' || /quota/i.test(e.message))) {
                stopCache = true;
                progress.textContent = '儲存空間不足，已停止下載；先前完成的快取仍會保留。';
              }
            }
            done++;
            if (done % 10 === 0 || done === paths.length) {
              progress.textContent = `離線素材 ${done}/${paths.length}（成功 ${ok}，失敗 ${failed}）`; 
              await new Promise(resolve => setTimeout(resolve, 0));
            }
          }
        };
        await Promise.all([work(), work(), work()]);
        progress.textContent = `離線素材：${ok}/${paths.length} 成功，${failed} 失敗${stopCache ? '（已中止）' : '（下載完成）'}。快取仍可能被 iOS 清理。`;
      } catch (e) { progress.textContent = '快取作業失敗：' + e.message; }
      finally { cacheRunning = false; cacheBtn.disabled = false; cancelBtn.hidden = true; }
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', makeUI, { once: true });
  else makeUI();

  G.PrivateV1 = Object.freeze({ version: '1.0', get settings() { return { ...prefs }; }, applySave });
  // The local save can be restored by ready() before DOMLoaded, so catch both cases.
  if (G.DB.loggedIn) applySave();
  console.info('[Private V1] initialized; this is NOT an official release');
})();
