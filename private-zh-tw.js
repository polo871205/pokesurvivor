/*
 * PokéSurvivor PRIVATE Traditional Chinese UI layer — V2.1 (first translation pass)
 * Noncommercial derivative. Upstream game logic, save keys, data IDs stay unchanged.
 * This file translates only visible UI text and common proper names.
 * It is NOT a complete Pokédex/move/quest translation.
 */
(() => {
  'use strict';
  const words = {
    // Game entry, login, introduction
    'Mundo Misterioso': '不可思議的迷宮',
    'Juego de supervivencia con Pokémon, gratis en el navegador y en el móvil.': '免費的寶可夢生存遊戲，可在電腦與手機瀏覽器遊玩。',
    'Cargando…': '載入中…',
    'Loading…': '載入中…',
    'Sobrevive a las hordas con tu compañero Pokémon': '與寶可夢夥伴一起抵禦敵人浪潮',
    'Pulsa para empezar': '點擊開始',
    'Jugar como invitado': '以訪客身分遊玩',
    'Contraseña': '密碼',
    'Usuario': '使用者名稱',
    'Nombre de usuario': '使用者名稱',
    '¿Olvidaste tu contraseña?': '忘記密碼？',
    'Entrar': '登入',
    'Entrar con Google': '使用 Google 登入',
    'Registrarse': '註冊',
    'Crear cuenta': '建立帳號',
    'Cuenta': '帳號',
    'Invitado': '訪客',
    'Nueva cuenta': '新帳號',
    'Aviso legal y privacidad': '法律聲明與隱私權',
    'Aviso legal': '法律聲明',
    'Privacidad': '隱私權',
    'Guía': '遊戲指南',
    'Pokédex': '寶可夢圖鑑',
    'Tu personalidad es…': '你的性格是……',
    'Tu compañero:': '你的夥伴：',
    '¡Vamos juntos!': '一起出發吧！',
    'Elegir otro': '選擇其他夥伴',
    'Elige a tu compañero': '選擇你的夥伴',
    'Los iniciales de todas las regiones, y dos amigos más.': '包含各地區的初始夥伴，還有兩位特別朋友。',
    'Elegir': '選擇',
    'Volver': '返回',
    'Guardar': '儲存',
    'Cancelar': '取消',
    'Confirmar': '確認',
    'Aceptar': '確定',
    'Cerrar': '關閉',
    'Continuar': '繼續',
    'Ahora no': '暫時不要',
    'No volver a preguntar': '不要再詢問',
    'Normal': '一般',
    'Shiny': '異色',
    'shiny': '異色',
    'Shinies': '異色寶可夢',
    // Menu and sub-menus
    'Jugar': '開始遊戲',
    'Entra en la mazmorra': '進入迷宮冒險',
    'Pokémon': '寶可夢',
    'Tu colección': '你的收藏圖鑑',
    'Mejoras': '能力強化',
    'Haz más fuerte cada run': '強化每次冒險的能力',
    'Gacha': '抽卡',
    '9 regiones · Pokémon y shinies': '九大地區・寶可夢與異色寶可夢',
    'Misiones': '任務',
    'Misiones, logros y perfil': '任務、成就與個人資料',
    'Logros': '成就',
    'Perfil': '個人資料',
    'Amigos': '好友',
    'Juega en grupo, hasta 4': '最多四人組隊遊玩',
    'Ranking': '排行榜',
    'Quién aguanta más': '看看誰存活最久',
    'Ajustes': '設定',
    'Sonido, gráficos, controles y cuenta': '音效、畫質、操作與帳號',
    'Sonido': '音效',
    'Gráficos': '畫質',
    'Controles': '操作',
    'Acerca de': '關於',
    'Salir': '登出',
    'Pantalla completa': '全螢幕',
    'Novedades': '更新消息',
    'Apoyar el proyecto': '支持原作者',
    'Tickets del gacha': '抽卡券',
    'Guía del juego': '遊戲教學',
    'Web oficial': '官方網站',
    'Proyecto de fan': '同人遊戲',
    'Contenido de terceros': '第三方素材',
    'Contacto y retirada de contenido': '聯絡與內容移除',
    // Gacha, collection and upgrades
    'Tirar ×1 ·': '單抽 ×1 ·',
    'Tirar ×10 ·': '十連抽 ×10 ·',
    'Tirar ×1': '單抽 ×1',
    'Tirar ×10': '十連抽 ×10',
    'Clic para acelerar': '點擊加速',
    'Cada Pokémon tiene sus propias mejoras: sólo cuentan cuando juegas con él.': '每隻寶可夢有獨立的強化，只有使用該寶可夢出戰時才會生效。',
    'Sólo puedes llevar uno ·': '只能攜帶一件道具 ·',
    // Run and battle
    'Pausa': '暫停',
    'Abandonar run': '離開本次冒險',
    'Volver al menú': '返回主選單',
    'Has caído…': '你倒下了……',
    'Elige una recompensa ·': '選擇一項獎勵 ·',
    'Cambiar opciones (': '重新抽選（',
    'Cambiar opciones': '重新抽選',
    '¡Vínculo!': '羈絆！',
    'Los movimientos unidos se lanzan a la vez y ocupan un solo hueco': '組合招式會同時施放，且只占用一個招式欄位',
    'Atrás': '上一步',
    '¡Un objeto!': '獲得道具！',
    'Arrastra el dedo para moverte · toca un ataque para cambiarlo': '拖曳手指移動・點擊招式切換攻擊',
    'moverse ·': '移動 ·',
    'movimiento ·': '招式 ·',
    'ciclar ·': '切換 ·',
    'pausa': '暫停',
    'Partida en grupo: el juego sigue mientras estás aquí.': '多人遊戲中：你停留在這個畫面時，遊戲仍會繼續。',
    // Supporting panels
    'Elige tu apodo': '設定你的暱稱',
    'Es el nombre que verán tus amigos y el que sale en el ranking.': '好友與排行榜會顯示這個暱稱。',
    'Tu nombre y tu correo de Google no se enseñan a nadie.': '你的姓名與 Google 電子郵件不會公開顯示。',
    '3-16 letras, números o _': '3～16 個字元、數字或底線',
    'Guardar apodo': '儲存暱稱',
    'Apodo de tu amigo': '好友暱稱',
    'Añadir amigo': '新增好友',
    'Ir a la sala': '前往房間',
    'Sala': '房間',
    'Menú': '選單',
    'Salir de la sala': '離開房間',
    'Invitar amigos': '邀請好友',
    'Empezar partida': '開始冒險',
    'Moderación': '管理',
    'Reportes': '檢舉',
    'Baneados': '封鎖名單',
    'Quitar filtro': '清除篩選',
    'Filtrar por Pokémon (histórico)': '依寶可夢篩選（歷史紀錄）',
    '· tiempo aguantado': '· 生存時間',
    // Type labels (standalone only, avoid altering internal type IDs)
    'Fuego': '火', 'Agua': '水', 'Planta': '草', 'Eléctrico': '電',
    'Hielo': '冰', 'Lucha': '格鬥', 'Veneno': '毒', 'Tierra': '地面',
    'Volador': '飛行', 'Psíquico': '超能力', 'Bicho': '蟲', 'Roca': '岩石',
    'Fantasma': '幽靈', 'Dragón': '龍', 'Siniestro': '惡', 'Acero': '鋼',
    'Hada': '妖精', 'Neutro': '一般', 'Normal': '一般',
    // Some frequently encountered moves
    'Placaje': '撞擊', 'Ascuas': '火花', 'Pistola Agua': '水槍',
    'Látigo Cepa': '藤鞭', 'Impactrueno': '電擊', 'Rayo': '十萬伏特',
    'Surf': '衝浪', 'Hidrobomba': '水炮', 'Lanzallamas': '噴射火焰',
    'Bola Sombra': '暗影球', 'Terremoto': '地震',
    'Hoja Afilada': '飛葉快刀', 'Rayo Hielo': '冰凍光束',
    // Frequent Pokémon — complete 966-species mapping is a later update
    'Pikachu': '皮卡丘', 'Raichu': '雷丘', 'Bulbasaur': '妙蛙種子',
    'Ivysaur': '妙蛙草', 'Venusaur': '妙蛙花', 'Charmander': '小火龍',
    'Charmeleon': '火恐龍', 'Charizard': '噴火龍', 'Squirtle': '傑尼龜',
    'Wartortle': '卡咪龜', 'Blastoise': '水箭龜', 'Caterpie': '綠毛蟲',
    'Butterfree': '巴大蝶', 'Pidgey': '波波', 'Pidgeotto': '比比鳥',
    'Pidgeot': '大比鳥', 'Eevee': '伊布', 'Vaporeon': '水伊布',
    'Jolteon': '雷伊布', 'Flareon': '火伊布', 'Espeon': '太陽伊布',
    'Umbreon': '月亮伊布', 'Leafeon': '葉伊布', 'Glaceon': '冰伊布',
    'Sylveon': '仙子伊布', 'Snorlax': '卡比獸', 'Mew': '夢幻',
    'Mewtwo': '超夢', 'Gengar': '耿鬼', 'Gastly': '鬼斯',
    'Haunter': '鬼斯通', 'Magikarp': '鯉魚王', 'Gyarados': '暴鯉龍',
    'Dratini': '迷你龍', 'Dragonair': '哈克龍', 'Dragonite': '快龍',
    'Lapras': '拉普拉斯', 'Ditto': '百變怪', 'Psyduck': '可達鴨',
    'Golduck': '哥達鴨', 'Jigglypuff': '胖丁', 'Clefairy': '皮皮',
    'Vulpix': '六尾', 'Ninetales': '九尾', 'Growlithe': '卡蒂狗',
    'Arcanine': '風速狗', 'Abra': '凱西', 'Kadabra': '勇基拉',
    'Alakazam': '胡地', 'Machop': '腕力', 'Machoke': '豪力',
    'Machamp': '怪力', 'Geodude': '小拳石', 'Graveler': '隆隆石',
    'Golem': '隆隆岩', 'Onix': '大岩蛇', 'Scyther': '飛天螳螂',
    'Scizor': '巨鉗螳螂', 'Lucario': '路卡利歐', 'Riolu': '利歐路',
    'Greninja': '甲賀忍蛙', 'Froakie': '呱呱泡蛙', 'Frogadier': '呱頭蛙',
    'Chikorita': '菊草葉', 'Cyndaquil': '火球鼠', 'Totodile': '小鋸鱷',
    'Treecko': '木守宮', 'Torchic': '火稚雞', 'Mudkip': '水躍魚',
    'Turtwig': '草苗龜', 'Chimchar': '小火焰猴', 'Piplup': '波加曼',
    'Snivy': '藤藤蛇', 'Tepig': '暖暖豬', 'Oshawott': '水水獺',
    'Chespin': '哈力栗', 'Fennekin': '火狐狸', 'Rowlet': '木木梟',
    'Litten': '火斑喵', 'Popplio': '球球海獅', 'Grookey': '敲音猴',
    'Scorbunny': '炎兔兒', 'Sobble': '淚眼蜥', 'Sprigatito': '新葉喵',
    'Fuecoco': '呆火鱷', 'Quaxly': '潤水鴨', 'Zorua': '索羅亞',
    'Zoroark': '索羅亞克', 'Gardevoir': '沙奈朵', 'Ralts': '拉魯拉絲',
    'Kirlia': '奇魯莉安'
  };
  // Some static strings in the source are in English depending on user locale.
  const english = {
    'Play': '開始遊戲', 'Settings': '設定', 'Back': '返回', 'Close': '關閉',
    'Continue': '繼續', 'Pause': '暫停', 'Gacha': '抽卡',
    'Achievements': '成就', 'Missions': '任務', 'Collection': '收藏圖鑑',
    'Upgrades': '能力強化', 'Sound': '音效', 'Graphics': '畫質',
    'Controls': '操作', 'Account': '帳號', 'About': '關於',
    'Login': '登入', 'Logout': '登出', 'Guest': '訪客',
    'Normal': '一般', 'Shiny': '異色', 'Pokédex': '寶可夢圖鑑',
    'New game': '新遊戲', 'Loading…': '載入中…',
    'Retry': '再試一次', 'Main menu': '主選單', 'Level': '等級',
    'Coins': '金幣', 'Select': '選擇', 'Reroll': '重新抽選',
    'Start': '開始', 'Save': '儲存', 'Cancel': '取消'
  };
  const dict = new Map([...Object.entries(words), ...Object.entries(english)]);
  const templated = [
    [/^¡Nivel\s+(\d+)！?$/i, n => `等級 ${n}！`],
    [/^Nivel\s+(\d+)$/i, n => `等級 ${n}`],
    [/^Cambiar opciones\s*\(([^)]+)\)/i, n => `重新抽選（${n}）`],
    [/^Gen(?:eración)?\s+(\d+)$/i, n => `第 ${n} 世代`],
    [/^Nivel\s*\.?\s*(\d+)$/i, n => `等級 ${n}`]
  ];

  function translate(raw) {
    if (typeof raw !== 'string') return raw;
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(raw);
    if (!m || !m[2]) return raw;
    const core = m[2];
    const direct = dict.get(core);
    if (direct) return m[1] + direct + m[3];
    for (const [rx, fmt] of templated) {
      const match = core.match(rx);
      if (match) return m[1] + fmt(...match.slice(1)) + m[3];
    }
    // Partial label before a nested count/keyboard hint. Deliberately NOT a
    // global free-text replacement; protects nicknames and game data IDs.
    if (/^Tirar ×(1|10) ·\s*$/.test(core)) return m[1] + core.replace('Tirar ×1', '單抽 ×1').replace('Tirar ×10', '十連抽 ×10') + m[3];
    return raw;
  }

  function update(root) {
    if (!root) return;
    // No changes to game values/IDs and no writes to IndexedDB/localStorage.
    const skip = el => el.closest && el.closest('script,style,code,textarea,[contenteditable="true"],#private-cheats-panel');
    if (root.nodeType === 3) {
      if (skip(root.parentElement)) return;
      const old = root.nodeValue;
      if (old && old.length < 350) {
        const next = translate(old);
        if (next !== old) root.nodeValue = next;
      }
      return;
    }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1 && skip(root)) return;
    if (root.nodeType === 1 && root.matches('input,button,[title],[aria-label]')) {
      for (const attr of ['placeholder', 'title', 'aria-label']) {
        const before = root.getAttribute(attr);
        if (before) {
          const after = translate(before);
          if (after !== before) root.setAttribute(attr, after);
        }
      }
    }
    const tree = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = tree.nextNode())) {
      if (node.nodeType === 3) {
        if (skip(node.parentElement)) continue;
        const old = node.nodeValue;
        if (old && old.length < 350) {
          const next = translate(old);
          if (next !== old) node.nodeValue = next;
        }
      } else if (node.matches && node.matches('input,button,[title],[aria-label]') && !skip(node)) {
        for (const attr of ['placeholder', 'title', 'aria-label']) {
          const before = node.getAttribute(attr);
          if (before) {
            const after = translate(before);
            if (after !== before) node.setAttribute(attr, after);
          }
        }
      }
    }
  }

  function start() {
    document.documentElement.lang = 'zh-TW';
    const css = document.createElement('style');
    css.textContent = 'body,button,input,select,textarea{font-family:"PingFang TC","Microsoft JhengHei",sans-serif !important} .menu-item{line-height:1.35}';
    document.head.appendChild(css);
    update(document.body);
    const tasks = new Set();
    let scheduled = false;
    function flush() {
      scheduled = false;
      const batch = Array.from(tasks).slice(0, 300);
      for (const node of batch) { tasks.delete(node); update(node); }
      if (tasks.size) requestAnimationFrame(flush);
    }
    new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData') tasks.add(record.target);
        for (const node of record.addedNodes || []) tasks.add(node);
      }
      if (!scheduled && tasks.size) { scheduled = true; requestAnimationFrame(flush); }
    }).observe(document.body, { childList: true, characterData: true, subtree: true });
  }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
  }
  if (typeof globalThis !== 'undefined') globalThis.PSPrivateZH = Object.freeze({ translate, count: dict.size });
})();
