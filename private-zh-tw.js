/*
 * PokéSurvivor PRIVATE Traditional Chinese UI layer — V2.7 (move, ability, item + Pokédex names via build-time mapping)
 * Noncommercial derivative. Upstream game logic, save keys, data IDs stay unchanged.
 * This file translates only visible UI text and common proper names.
 * Species are mapped by Dex ID, moves/abilities/items by official localized names. Descriptions and quests remain partial.
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
  // V2.2: untranslated text verified from iPhone screenshots (missions, achievements,
  // profile, collection, gacha, account, controls, graphics). Only visible text is altered.
  const screenWords = {
    // Daily quests and achievements
    'Diarias': '每日任務',
    'Semanales': '每週任務',
    'Encuentra un objeto equipable': '獲得一件可裝備道具',
    'Aguanta 9 minutos en una run': '在單次冒險中存活 9 分鐘',
    'Cambiar': '更換',
    'Coleccionista': '收藏家',
    'Cien amigos': '百位夥伴',
    'Maestro Pokémon': '寶可夢大師',
    'Enciclopedia': '百科全書',
    'Profesor Pokémon': '寶可夢博士',
    'Algo brilla': '閃亮的邂逅',
    'Ten 50 Pokémon.': '擁有 50 隻寶可夢。',
    'Ten 100 Pokémon.': '擁有 100 隻寶可夢。',
    'Ten 250 Pokémon.': '擁有 250 隻寶可夢。',
    'Ten 500 Pokémon.': '擁有 500 隻寶可夢。',
    'Título: Coleccionista': '稱號：收藏家',
    'Título: Maestro Pokémon': '稱號：寶可夢大師',
    // Profile
    'Título': '稱號',
    '(sin título)': '（尚無稱號）',
    'Consigue logros para desbloquear títulos.': '完成成就即可解鎖稱號。',
    'Ver mi perfil público': '查看我的公開個人資料',
    // Gacha regions, banners and collection
    'Kanto': '關都',
    'Johto': '城都',
    'Hoenn': '豐緣',
    'Sinnoh': '神奧',
    'Teselia': '合眾',
    'Unova': '合眾',
    'Kalos': '卡洛斯',
    'Alola': '阿羅拉',
    'Galar': '伽勒爾',
    'Paldea': '帕底亞',
    'Kanto Misterioso': '神祕關都',
    'Johto Misterioso': '神祕城都',
    'Hoenn Misterioso': '神祕豐緣',
    'Sinnoh Misterioso': '神祕神奧',
    'Teselia Misteriosa': '神祕合眾',
    'Kalos Misterioso': '神祕卡洛斯',
    'Alola Misteriosa': '神祕阿羅拉',
    'Galar Misterioso': '神祕伽勒爾',
    'Paldea Misteriosa': '神祕帕底亞',
    'Los 151 Pokémon de la generación 1. ¡Los legendarios esperan!': '第一世代的 151 隻寶可夢，傳說中的寶可夢正等著你！',
    'Todos': '全部',
    'Tengo': '已擁有',
    'Me faltan': '未擁有',
    'Legendaria': '傳說',
    'Legendario': '傳說',
    'Épica': '史詩',
    'Épico': '史詩',
    'Rara': '稀有',
    'Raro': '稀有',
    'Común': '普通',
    'Aún no lo tienes': '尚未擁有',
    'Aún no la tienes': '尚未擁有',
    // Account settings
    'Apodo': '暱稱',
    'Es único y no se puede cambiar.': '暱稱不可重複，設定後無法變更。',
    'Tipo de cuenta': '帳號類型',
    'Cuenta de este navegador': '此瀏覽器的本機帳號',
    'Partida': '遊戲存檔',
    'Guardado sólo en este navegador': '僅儲存在此瀏覽器',
    'Cerrar sesión': '登出',
    'Borrar cuenta': '刪除帳號',
    // Control settings
    'Tamaño del joystick': '虛擬搖桿大小',
    'Cuánto hay que arrastrar el dedo.': '設定拖曳手指時的搖桿操作範圍。',
    'Pequeño': '小',
    'Grande': '大',
    'Colocar los botones': '調整按鍵位置',
    'Pon los ataques, la pausa y el joystick (fijo, si quieres) donde quieras de la pantalla.': '將攻擊、暫停及搖桿（可選固定）按鈕放到螢幕上喜歡的位置。',
    'Colocar': '調整位置',
    'En PC': '電腦操作',
    'o flechas': '或方向鍵',
    'moverse': '移動',
    // Graphics settings
    'Calidad': '畫質',
    'Cuántos efectos y partículas se dibujan. Auto la baja sola si el juego va a tirones (ahora: media).': '調整畫面特效及粒子數量。選擇「自動」時，遊戲卡頓會自動降低畫質（目前：中）。',
    'Auto': '自動',
    'Alta': '高',
    'Media': '中',
    'Baja': '低',
    'Pantalla': '畫面',
    'Números de daño': '傷害數字',
    'Los números que salen al golpear y al recibir daño.': '攻擊敵人或受到傷害時顯示的數字。',
    'Menos sacudidas y destellos': '減少畫面晃動與閃光',
    'La cámara tiembla menos y los fogonazos son suaves.': '減少鏡頭震動，並降低閃光效果的強度。',
    'Sí': '是',
    'No': '否',
    // Common small inline strings
    'Aún no lo tienes.': '尚未擁有。',
    'Consíguelo en el banner de Kanto': '在關都卡池中抽取即可獲得',
    'Consíguelo en el banner de Kanto.': '在關都卡池中抽取即可獲得。',
  };
  // V2.3 supplement for screenshots of upgrades, game account, controls and graphics.
  const screenWordsV23 = {
    // Upgrade names / descriptions
    'Vitalidad': '生命力',
    'Fuerza': '力量',
    'Zancada': '步伐',
    'Reflejos': '反應',
    'Coraza': '護甲',
    'Síntesis': '再生',
    'Imán': '磁力',
    'Sabiduría': '智慧',
    'vida': '生命', 'daño': '傷害', 'velocidad': '移動速度',
    'recarga': '冷卻時間', 'defensa': '防禦', 'vida/s': '生命／秒',
    'recogida': '拾取範圍', 'experiencia': '經驗值',
    // Settings — full phrases or titles appearing in the screenshots
    'En móvil o tablet': '手機或平板操作',
    'Pon el dedo en cualquier parte y arrastra para moverte: el joystick aparece donde tocas. Toca un ataque de abajo para cambiarlo y el botón de arriba a la derecha para pausar. Se juega en horizontal.':
      '在畫面任意位置按住並拖曳即可移動，虛擬搖桿會出現在觸碰的位置。點選下方招式可切換攻擊；點選右上角按鈕可暫停。建議橫向遊玩。',
    'Idioma': '語言',
    'El juego se recarga al cambiarlo.': '切換語言後遊戲會重新載入。',
    'Español': '西班牙文', 'English': '英文',
    'Cuántos efectos y partículas se dibujan. Auto la baja sola si el juego va a tirones (ahora: media).':
      '決定特效與粒子顯示數量。選擇自動時，遊戲卡頓會自動降低畫質（目前：中）。',
    // Extra short labels and pop-up notices
    '¡Logro: Cien amigos!': '獲得成就：百位夥伴！',
    '¡Logro: Coleccionista!': '獲得成就：收藏家！',
    '¡Logro: Maestro Pokémon!': '獲得成就：寶可夢大師！',
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
// V2.7: human-reviewed source-language literals from translation-todo.json.
// DISPLAY TEXT ONLY. Never modify source data, gameplay, IDs, networking,
// or local saves; no global substring replacement.
const reviewedTextsV27 = {
  ". Queda un hueco libre.": "。仍有一個空欄位。",
  "Elige el primer movimiento que vas a unir": "選擇要組合的第一個招式",
  "Elige qué movimiento se une a": "選擇要與其組合的招式",
  "Faltan por elegir:": "尚需選擇：",
  "Pokémonedas ganadas": "獲得的寶可夢幣",
  "Quedarme con": "保留",
  "Salir de la partida": "離開本次冒險",
  "Se lanzará a la vez que": "會與下列招式同時施放：",
  "¡Nuevo récord de tiempo!": "刷新最長生存時間紀錄！",
  "· ¡nuevo!": "・新獲得！",
  "¿Con cuál unes": "要和哪個招式組合？",
  "! Recoge el premio…": "！領取獎勵……",
  "(CC BY-NC 4.0, créditos completos en CREDITS.md del repositorio). Datos de la Pokédex de": "（CC BY-NC 4.0；完整署名請見儲存庫內的 CREDITS.md）。寶可夢圖鑑資料來源：",
  "(compañero)": "（夥伴）",
  ") y empezad cuando estéis.": "），準備好後即可開始。",
  "+0.9 de vida regenerada por segundo.": "每秒恢復 0.9 點生命值。",
  "+10% de daño con todos los movimientos.": "所有招式造成的傷害 +10%。",
  "+20 de vida máxima (y la recupera).": "最大生命值 +20，並恢復增加的生命值。",
  "+6% de reducción de daño recibido.": "受到的傷害減少 6%。",
  "+7% de velocidad de movimiento.": "移動速度 +7%。",
  ", nada más.": "，僅此而已。",
  ", sin anuncios ni compras. Si quieres ayudar a que siga en línea, puedes hacer una": "，沒有廣告或內購。如果你想幫助遊戲繼續營運，可以提供一筆",
  "-8% de recarga en todos los movimientos.": "所有招式的冷卻時間縮短 8%。",
  ". El anfitrión empezará la partida.": "。房主將開始遊戲。",
  ". Fuente Pixelify Sans (OFL). La música y los efectos de sonido son originales del proyecto.": "。使用 Pixelify Sans 字型（OFL）。音樂與音效皆由本專案原創。",
  ". No tiene anuncios ni compras. Se puede apoyar con donaciones voluntarias, que se usan sólo para pagar los servidores y el dominio, y que no dan ninguna ventaja en el juego.": "。遊戲沒有廣告或內購。你可以自願捐款支持，款項只用於伺服器與網域費用，不會帶來任何遊戲優勢。",
  ": todo el dinero se usa para los": "：所有款項都用於",
  "? No podrán volver a salir en el ranking y se borra su marca.": "？這些紀錄將不再出現在排行榜，且原紀錄會被刪除。",
  "Abierto desde un archivo: la partida sólo se guarda en este navegador. Para guardar en la nube, juega en la versión publicada.": "目前以本機檔案方式開啟：進度只會儲存在此瀏覽器。雲端存檔需使用原版線上遊戲。",
  "Anfitrión": "房主",
  "Arrastra los botones a donde quieras": "拖曳按鈕到你想要的位置",
  "Así te ven los demás jugadores (desde el ranking y la lista de amigos).": "其他玩家會在排行榜與好友清單中看到這些公開資料。",
  "Aún no tienes amigos añadidos. Escribe arriba el apodo de un amigo.": "你目前還沒有好友。請在上方輸入好友的暱稱。",
  "Borrar para siempre": "永久刪除",
  "Cambia esta misión por otra (una vez al día)": "將這項任務更換成其他任務（每天一次）",
  "Compañero": "夥伴",
  "con ese Gmail: es tu misma cuenta. Si no lo vinculaste, no se puede recuperar: crea una cuenta nueva (y esta vez vincula tu Gmail desde el aviso que sale al entrar).": "使用該 Gmail 登入，就會回到同一個帳號。若先前沒有綁定 Gmail，便無法復原，請建立新帳號，並在登入提示中綁定 Gmail。",
  "Conectado (por servidor)": "已連線（透過伺服器）",
  "Conectando con tus amigos…": "正在連線到好友……",
  "Consíguelo en el banner de": "可從以下卡池取得：",
  "Crea una cuenta para jugar con amigos y salir en el ranking.": "建立帳號即可與好友遊玩並登上排行榜。",
  "Créditos": "製作名單與授權資訊",
  "Cuando el anfitrión empiece, entraréis todos a la vez.": "房主開始遊戲時，所有人會同時進入。",
  "Cuanta más gente juega, más cuestan los servidores. Lo que sobre se guarda para los gastos de los meses siguientes.": "玩家越多，伺服器成本越高。剩餘款項將留作後續月份的營運費用。",
  "Código fuente:": "原始碼：",
  "daño ×2": "傷害 ×2",
  "de este año": "今年",
  "donación voluntaria": "自願捐款",
  "Donar no da ninguna ventaja en el juego.": "捐款不會帶來任何遊戲優勢。",
  "el Agua se potencia y el Fuego se debilita": "水屬性增強，火屬性減弱",
  "el Fuego se potencia y el Agua se debilita": "火屬性增強，水屬性減弱",
  "el Hielo se potencia; el resto sufre y va más lento": "冰屬性增強；其他屬性受到影響且移動減慢",
  "El manantial se ha secado (se recarga solo)": "泉水已乾涸（會自動恢復）",
  "El tiempo se ha agotado…": "時間到了……",
  "En iPhone, Safari no deja poner las webs a pantalla completa. Pulsa Compartir y luego \"Añadir a pantalla de inicio\": abriendo el juego desde ese icono se juega a pantalla completa.": "在 iPhone 上，Safari 無法直接讓網站全螢幕顯示。請點「分享」→「加入主畫面」，之後從主畫面圖示開啟，即可全螢幕遊玩。",
  "En la sala": "在房間內",
  "en línea": "線上",
  "En línea": "線上",
  "Eres el anfitrión. Invita a tus amigos (hasta": "你是房主。邀請好友加入（最多",
  "Eres invitado: se perderá todo el progreso. ¿Salir?": "你目前是受邀玩家，離開後將失去這場冒險的進度。確定離開嗎？",
  "es ahora tu compañero": "成為你現在的夥伴",
  "Es el nombre que verán tus amigos y el que sale en el ranking. Tu nombre y tu correo de Google no se enseñan a nadie.": "這個暱稱會顯示在好友與排行榜中。你的姓名與 Google 電子郵件不會公開。",
  "Es invencible: huye y aguanta todo lo que puedas": "牠是無敵的：快逃跑並盡可能撐下去",
  "es público para otros jugadores. Guardamos tu lista de amigos, si estás en línea y tus mejores tiempos (con tu apodo y tu Pokémon).": "對其他玩家公開。我們會保存你的好友名單、上線狀態及最佳紀錄（包含暱稱與寶可夢）。",
  "es un juego hecho por fans,": "是一款粉絲自製遊戲，",
  "Esta no es la web oficial: la partida sólo se guarda en este navegador. El juego oficial y gratis está en pokesurvivor.com.": "這不是官方網站：遊戲進度只儲存在此瀏覽器。免費的原版遊戲網站為 pokesurvivor.com。",
  "Esto necesita la versión online del juego (con la nube).": "此功能需要原版線上遊戲（使用雲端服務）。",
  "Estás en la sala de": "你目前位於以下玩家的房間：",
  "EVOLUCIÓN": "進化",
  "Fan game gratuito de supervivencia con 966 Pokémon de las 9 regiones: elige tu compañero, sobrevive a las hordas, evoluciona tus ataques, enfréntate a legendarios y juega en cooperativo con hasta 4 amigos.": "這是一款免費的寶可夢粉絲生存遊戲，收錄九個地區共 966 隻寶可夢。選擇夥伴、抵禦敵人、進化招式、挑戰傳說寶可夢，還能與最多 4 名好友合作遊玩。",
  "Fantasma, Hada y Psíquico se potencian": "幽靈、妖精及超能力屬性增強",
  "Flotante: aparece donde pones el dedo. Fijo: siempre en el mismo sitio.": "浮動：搖桿出現在手指觸碰的位置。固定：搖桿位置不變。",
  "Fotogramas por segundo, en la esquina de abajo.": "每秒影格數（FPS），顯示於畫面下方角落。",
  "Gira el móvil": "旋轉手機",
  "Gira el móvil: se juega en horizontal.": "請將手機橫向放置以遊玩。",
  "Gracias: la revisaremos": "謝謝，我們會審核你的回報",
  "gratuito y sin ánimo de lucro": "免費、非營利",
  "Guardado en la nube": "已儲存至雲端",
  "Guía y preguntas": "指南與常見問題",
  "Habéis caído todos…": "所有隊友都倒下了……",
  "hace 3 días": "3 天前",
  "Has caído: un compañero puede levantarte": "你倒下了：隊友可以扶起你",
  "Has entrado en la grieta…": "你已進入裂隙……",
  "Histórico": "歷史紀錄",
  "Inicia sesión para poder borrar tu cuenta.": "請先登入，才能刪除帳號。",
  "La grieta os ha expulsado…": "裂隙將你們逐出了……",
  "La partida empieza para todos a la vez.": "所有玩家會同時開始遊戲。",
  "La sala se ha cerrado": "房間已關閉",
  "LA SENTENCIA": "審判",
  "LA SENTENCIA DE ARCEUS": "阿爾宙斯的審判",
  "La única web oficial de PokéSurvivor es pokesurvivor.com. El juego es y será gratis: si alguien te pide pagar, no somos nosotros.": "PokéSurvivor 唯一官方網站是 pokesurvivor.com。遊戲現在及未來都免費；若有人要求付費，並非官方團隊。",
  "Licencia del código: PolyForm Noncommercial 1.0.0 (se puede usar, estudiar y modificar, pero no para ganar dinero). Las versiones hasta el 14-10-2026 siguen bajo MIT.": "程式碼授權：PolyForm Noncommercial 1.0.0（可使用、研究及修改，但不得用於營利）。截至 2026-10-14 的舊版本依 MIT 授權。",
  "Lo que cuesta mantenerlo": "維護遊戲的成本",
  "marcas de más de 1 hora (": "超過 1 小時的紀錄（",
  "Mejor tiempo": "最佳時間",
  "Misión completada:": "任務完成：",
  "Movimientos que puede aprender": "可以學習的招式",
  "Más de 33 min: casi imposible con la Sentencia de Arceus": "超過 33 分鐘：阿爾宙斯的審判讓這幾乎不可能",
  "Música": "音樂",
  "Necesitas al menos un amigo en la sala.": "房間裡至少需要一位好友。",
  "Ningún amigo en línea ahora mismo.": "目前沒有好友在線上。",
  "Nivel máximo": "最高等級",
  "No está afiliado, patrocinado ni aprobado por Nintendo, Creatures Inc., GAME FREAK ni The Pokémon Company. Pokémon y todos los nombres y personajes relacionados son marcas y propiedad de sus respectivos dueños.": "本遊戲未獲 Nintendo、Creatures Inc.、GAME FREAK 或 The Pokémon Company 聯盟、贊助或認可。寶可夢及相關名稱與角色皆為各權利人之商標與財產。",
  "No hay ningún Pokémon con ese nombre": "找不到名稱符合的寶可夢",
  "No se pudo conectar con la nube: la partida sólo se guarda en este navegador.": "無法連接雲端：進度只儲存在此瀏覽器。",
  "No se puede conectar con algún amigo: su red (o la tuya) no deja jugar en grupo. Probad con otra wifi o datos móviles; se reintenta solo.": "有好友無法連線：可能是你或對方的網路限制多人遊玩。請改用其他 Wi-Fi 或行動網路，系統會自動重試。",
  "Nombre y contraseña": "使用者名稱與密碼",
  "Nube sin configurar: la partida sólo se guarda en este navegador.": "雲端未設定：遊戲進度只儲存在此瀏覽器。",
  "o derrotándolo cuando salga shiny.": "或在遇到異色寶可夢時擊敗牠。",
  "Pendiente de subir (se sube al salir del juego)": "等待上傳（離開遊戲時上傳）",
  "Poco común": "較不常見",
  "POKé SLOTS": "寶可夢拉霸",
  "Pokédex: todos los Pokémon jugables": "寶可夢圖鑑：所有可操作的寶可夢",
  "PokéSurvivor es y será": "PokéSurvivor 現在與未來都會",
  "PokéSurvivor necesita JavaScript para funcionar. Actívalo para jugar.": "PokéSurvivor 需要啟用 JavaScript 才能運作，請開啟 JavaScript 後再玩。",
  "PokéSurvivor se juega en horizontal.": "PokéSurvivor 需橫向遊玩。",
  "PokéSurvivor – Juego Pokémon gratis online estilo Survivor.io": "PokéSurvivor－免費線上寶可夢生存遊戲（Survivor.io 風格）",
  "premio por recoger": "項待領取獎勵",
  "premios por recoger": "項待領取獎勵",
  "Proyecto de fan sin ánimo de lucro · Sprites: SpriteCollab (CC BY-NC 4.0) · Pokémon © Nintendo/Creatures/GAME FREAK ·": "非營利同人專案・精靈圖素材：SpriteCollab（CC BY-NC 4.0）・寶可夢 © Nintendo/Creatures/GAME FREAK・",
  "Puedes borrar tu cuenta cuando quieras (se borran también tu apodo, tus amigos y tus marcas):": "你可以隨時刪除帳號（暱稱、好友及紀錄也會一併刪除）：",
  "Pulsa Espacio para saltar": "按空白鍵跳躍",
  "Quitar marcas de más de 1 hora": "清除超過 1 小時的紀錄",
  "Recoge el premio en Misiones": "請到「任務」領取獎勵",
  "Recupera el 45% de tu vida ahora mismo.": "立即恢復生命值的 45%。",
  "Roca, Tierra y Acero se potencian; el resto sufre": "岩石、地面和鋼屬性增強；其他屬性受到影響",
  "salvaje apareció!": "野生寶可夢出現了！",
  "Se borrarán tu cuenta y toda tu partida, para siempre. Para confirmarlo, escribe tu contraseña.": "將永久刪除你的帳號及所有進度。請輸入密碼以確認。",
  "Se borrarán tu cuenta y toda tu partida, para siempre. ¿Seguro?": "將永久刪除你的帳號及所有進度。確定嗎？",
  "Selecciona un Pokémon": "選擇一隻寶可夢",
  "servidores y el dominio": "伺服器及網域",
  "Si eres titular de derechos y quieres que retiremos algo, escríbenos y lo quitaremos lo antes posible:": "如果你是權利持有人，希望我們移除相關內容，請來信通知，我們會儘快處理：",
  "Sigue la flecha morada: dentro te espera un legendario": "跟著紫色箭頭走，傳說寶可夢正在裡面等你",
  "Sin conexión: se subirá al volver": "目前離線：恢復連線後將上傳",
  "Sobrevive a las hordas con tu compañero Pokémon · gratis, en PC y móvil": "與寶可夢夥伴一起抵擋敵人・免費支援電腦與手機",
  "Sólo amigos": "僅限好友",
  "te esperaba en la grieta!": "在裂隙中等著你！",
  "te están levantando": "有人正在扶起你",
  "Tienes su shiny": "你已擁有牠的異色版本",
  "Toca la pantalla para saltar": "點擊畫面跳躍",
  "Tu perfil se publica cuando juegas con una cuenta online.": "使用線上帳號遊玩時，個人資料會公開。",
  "Tus 3 Pokémon favoritos": "你最喜歡的 3 隻寶可夢",
  "Vincula tu Gmail: si un día olvidas la contraseña, pulsas": "綁定 Gmail：若忘記密碼，可以點選",
  "WASD moverse · 1-4 / Q / E o clic en un ataque para cambiarlo · Esc pausa": "WASD 移動・1～4／Q／E 或點擊招式切換・Esc 暫停",
  "y es tu misma cuenta, con todo lo tuyo.": "就會回到同一個帳號，資料也會保留。",
  "Ya la has reportado": "你已經檢舉過該紀錄",
  "Ya tienes": "你已擁有",
  "¡ARCEUS HA DESCENDIDO!": "阿爾宙斯降臨了！",
  "¡Conseguido!": "成功取得！",
  "¡Gmail vinculado! Si olvidas la contraseña, entra con Google.": "已綁定 Gmail！若忘記密碼，請使用 Google 登入。",
  "¡Has llevado a": "你已將",
  "¡Has vencido a": "你擊敗了",
  "¡Hora dorada! Doble de experiencia": "黃金時刻！獲得雙倍經驗值",
  "¡Horda de tipo": "出現了以下屬性的敵人群：",
  "¡Huye de Arceus! Es invencible": "快逃離阿爾宙斯！牠是無敵的",
  "¡Logro:": "獲得成就：",
  "¡Marea de Pokémon!": "寶可夢大軍來襲！",
  "¡Nivel": "等級",
  "¡Pegajoso!": "黏住了！",
  "¡SE HA ABIERTO UNA GRIETA!": "裂隙開啟了！",
  "¡SHINY NUEVO!": "新異色寶可夢！",
  "¡SUERTE!": "幸運！",
  "¡¿LEGENDARIO?!": "傳說級？！",
  "¡¿SHINY?!": "異色？！",
  "¡¿ÉPICO?!": "史詩級？！",
  "· La tirada ×10 garantiza al menos una Épica.": "・十連抽至少保證一張史詩級卡牌。",
  "· Los repetidos dan Pokémonedas. Los shiny no se repiten.": "・抽到重複寶可夢會獲得寶可夢幣；異色寶可夢不會重複取得。",
  "· Los tickets se consiguen jugando: algunos Pokémon los sueltan al caer, y los jefes y los legendarios de las grietas, a veces, tickets ×10.": "・抽卡券可透過遊玩取得：部分寶可夢被擊敗時會掉落，首領與裂隙中的傳說寶可夢也可能掉落十連抽券。",
  "· Mejor tiempo": "・最佳時間",
  "· ya no está en el top 50": "・已離開前 50 名",
  "· ¡vencido!": "・已擊敗！",
  "¿Banear a": "要封鎖",
  "¿Quitar del ranking TODAS las marcas de más de 1 hora (todas las tablas)? No se puede deshacer.": "要將所有排行榜中超過 1 小時的紀錄全部移除嗎？此操作無法復原。",
  "¿Reportar la marca de": "要檢舉以下玩家的紀錄：",
  "¿Seguro que quieres borrar la cuenta?": "確定要刪除帳號嗎？",
  "¿te da miedo perder tu cuenta?": "擔心帳號遺失嗎？",
  "¿Te da miedo perder tu cuenta?": "擔心帳號遺失嗎？",
  "+20% de reducción de daño recibido.": "受到的傷害減少 20%。",
  "+30% de daño, pero cada ataque te quita un poco de vida.": "造成的傷害增加 30%，但每次攻擊會消耗少量生命值。",
  "+40% de daño, pero no puedes cambiar de movimiento.": "造成的傷害增加 40%，但無法切換招式。",
  "+50% de Pokémonedas al acabar la run.": "本次冒險結束時獲得的寶可夢幣增加 50%。",
  "Los que te golpean cuerpo a cuerpo reciben daño.": "以近距離攻擊你的敵人會受到反傷。",
  "Recuperas un 1,5% de tu vida por segundo.": "每秒恢復生命值的 1.5%。",
  "Recuperas vida con el daño que haces.": "依照造成的傷害恢復生命值。",
  "Un golpe que te dejaría KO te deja con 1 de vida (cada 60 s).": "受到原本會使你失去戰鬥能力的傷害時，改為剩下 1 點生命值（每 60 秒可發動一次）。",
  "Aguijón rápido que envenena.": "快速刺擊並使敵人中毒。",
  "Barrido de alas amplio que empuja.": "大範圍揮動翅膀，擊退敵人。",
  "Bola de fuego al enemigo más cercano.": "向最近的敵人發射火球。",
  "Bolas de hielo caen sobre los enemigos y los frenan.": "冰球從天而降攻擊敵人並降低其速度。",
  "Brisa mágica en todas direcciones.": "朝四面八方吹出魔法微風。",
  "Burbujas en abanico que ralentizan a quien tocan.": "扇形射出泡泡，使接觸到的敵人減速。",
  "Caen rocas del cielo sobre los enemigos cercanos.": "岩石從天而降砸向附近敵人。",
  "Campo eléctrico permanente alrededor de ti.": "在自身周圍形成持續存在的電氣場。",
  "Cañonazo de agua lento pero devastador.": "速度慢但威力強大的水砲攻擊。",
  "Chorro de burbujas en abanico corto que frena.": "向前方短距離扇形噴出泡泡，使敵人減速。",
  "Chorro de llamas en abanico corto que quema.": "向前方短距離扇形噴出火焰，使敵人灼傷。",
  "Corres envuelto en fuego y dejas un rastro de llamas.": "全身包覆火焰奔跑，並在身後留下火焰軌跡。",
  "Cruzas como un rayo hacia el enemigo y golpeas todo el camino.": "像閃電般衝向敵人，沿途攻擊所有敵人。",
  "Cuchillas psíquicas que vuelven a ti.": "發射會返回自身的精神利刃。",
  "Deja telarañas en el suelo que atrapan y frenan mucho al que las pisa.": "在地面留下蜘蛛網，大幅減慢踩到的敵人。",
  "Deja una llama flotante que dispara sola y quema.": "留下自動攻擊並造成灼傷的浮動火焰。",
  "Dentellada rápida que hace retroceder.": "快速咬擊並擊退敵人。",
  "Descarga rapidísima que atraviesa varios enemigos.": "釋放極速電擊，可穿透多名敵人。",
  "Dos hojas que van y vuelven cortando a la ida y a la vuelta.": "發射兩片來回旋轉的葉刃，去程與回程都能造成傷害。",
  "Dos meteoros de acero que aplastan donde caen.": "兩顆鋼鐵隕石墜落，砸傷落點的敵人。",
  "Embiste en arco a todo lo que tengas delante.": "向前方弧形範圍的所有敵人猛撞。",
  "Esfera de energía que nunca falla.": "發射必定命中的能量球。",
  "Esfera oscura que atraviesa a varios.": "發射可穿透多名敵人的黑暗能量球。",
  "Estallido mental radial que busca enemigos.": "朝周圍爆發會追蹤敵人的精神能量。",
  "Explota en llamas en todas las direcciones.": "向四面八方引爆火焰。",
  "Lametazo espectral que paraliza un poco.": "使用幽靈舌頭舔擊，有機率造成麻痺。",
  "Llamarada dracónica en línea recta.": "向前方直線噴射龍之烈焰。",
  "Llamas que giran a tu alrededor. Defensa constante.": "火焰在自身周圍旋轉，持續提供防護。",
  "Lodo tóxico que envenena al impactar.": "投射有毒污泥，命中時使敵人中毒。",
  "Látigos de largo alcance en arco amplio.": "在廣闊弧形範圍揮動長藤鞭。",
  "Maldición que salta entre enemigos. Mucho más daño si están quemados, envenenados o frenados.": "詛咒會在敵人之間彈跳傳遞；對灼傷、中毒或減速的敵人造成更高傷害。",
  "Mordisco rápido en arco corto.": "以短弧形範圍快速咬擊。",
  "No hace daño: acumula ATAQUE mientras esté activo.": "不造成傷害：持續累積攻擊力。",
  "No hace daño: acumula ATAQUE más rápido que Danza Espada.": "不造成傷害：累積攻擊力的速度比「劍舞」更快。",
  "No hace daño: acumula DEFENSA mientras esté activo.": "不造成傷害：持續累積防禦力。",
  "No hace daño: acumula REGENERACIÓN de vida.": "不造成傷害：持續提升生命恢復能力。",
  "No hace daño: acumula VELOCIDAD mientras esté activo.": "不造成傷害：持續累積移動速度。",
  "Onda de energía oscura en todas direcciones.": "向四面八方釋放黑暗能量波。",
  "Onda que persigue sola a su objetivo.": "發出會自動追蹤目標的波動。",
  "Onda sonora que sale en todas direcciones.": "向四面八方釋放音波。",
  "Pedrusco pesado que empuja al enemigo.": "投擲沉重岩塊並擊退敵人。",
  "Placaje con todo el peso: lento, corto y brutal.": "以全身重量撞擊：速度慢、距離短但傷害極高。",
  "Púas venenosas que envenenan mucho al estallar.": "散布毒刺，爆炸時造成強烈中毒效果。",
  "Rayo de luz metálica que perfora.": "發射穿透敵人的金屬光束。",
  "Rayo helado que congela casi del todo.": "發射幾乎能完全凍結敵人的冰凍光束。",
  "Rayo psíquico ancho y contundente.": "發射寬廣且強力的精神光束。",
  "Raíces que atrapan y machacan todo lo que tienes cerca.": "以樹根束縛並猛擊周圍敵人。",
  "Remolinos de viento que te escoltan.": "旋風在自身周圍盤旋護衛。",
  "Sacude el suelo: daña y frena a lo cercano.": "震動地面，傷害附近敵人並使其減速。",
  "Siembra púas que estallan al pisarlas.": "在地面布置踩到就會爆炸的尖刺。",
  "Te lanzas en picado y cortas todo lo que cruzas.": "俯衝並斬擊路徑上的所有敵人。",
  "Un ciclón de hojas gira amplio a tu alrededor.": "在身體周圍形成大範圍旋轉的葉片旋風。",
  "Un hueso que va y vuelve golpeando fuerte.": "投擲來回飛行的骨頭，造成強力打擊。",
  "Un muñeco que se queda disparando por ti.": "放置一個替身，持續替你發射攻擊。",
  "Un rayo que salta de un enemigo a otro.": "電擊會在敵人之間連鎖跳躍。",
  "Una sombra te rodea y consume lo cercano.": "暗影圍繞自身，持續傷害周圍敵人。",
  "Vas dejando charcos de veneno que intoxican a quien los pisa.": "沿途留下毒液池，使踩到的敵人中毒。",
  "Ventisca a tu alrededor que ralentiza.": "自身周圍吹起暴風雪，使敵人減速。",
  "Vibración constante que machaca lo cercano.": "持續振動，傷害附近的敵人。",
  "Compañero fiel": "忠實夥伴",
  "Consigue 1 shiny.": "獲得 1 隻異色寶可夢。",
  "Consigue 20 shinies.": "獲得 20 隻異色寶可夢。",
  "Consigue 5 shinies.": "獲得 5 隻異色寶可夢。",
  "Derrota a": "擊敗",
  "Derrota a 1.000 Pokémon.": "擊敗 1,000 隻寶可夢。",
  "Derrota a 10.000 Pokémon.": "擊敗 10,000 隻寶可夢。",
  "Derrota a 100 jefes.": "擊敗 100 名首領。",
  "Derrota a 100.000 Pokémon.": "擊敗 100,000 隻寶可夢。",
  "Derrota a 25 jefes.": "擊敗 25 名首領。",
  "Derrota a 3 legendarios ante Arceus en una partida.": "在單次冒險中，於阿爾宙斯出現前擊敗 3 隻傳說寶可夢。",
  "Derrota a un jefe.": "擊敗 1 名首領。",
  "Encuentra los 11 objetos.": "收集全部 11 種道具。",
  "Evoluciona los 47 movimientos distintos.": "進化全部 47 種不同招式。",
  "Evoluciona un movimiento.": "進化 1 個招式。",
  "Gana en las 18 arenas (una por tipo).": "在全部 18 種屬性競技場獲勝（每種屬性一座）。",
  "Gana tu primera pelea en una grieta.": "在裂隙中贏得第一次對戰。",
  "Haz 100 tiradas en el gacha.": "進行 100 次抽卡。",
  "Juega una partida en grupo.": "進行一場多人遊戲。",
  "Llega a la Sentencia de Arceus (minuto 30).": "到達阿爾宙斯的審判（第 30 分鐘）。",
  "Llega al nivel 15 en una run.": "在單次冒險中達到 15 級。",
  "Llega al nivel 30 en una run.": "在單次冒險中達到 30 級。",
  "Ten 1 Pokémon.": "擁有 1 隻寶可夢。",
  "Ten 10 Pokémon.": "擁有 10 隻寶可夢。",
  "Ten todos los Pokémon del juego.": "擁有遊戲中的全部寶可夢。",
  "Vence a todos los legendarios.": "擊敗所有傳說寶可夢。"
};
  const dict = new Map([...Object.entries(words), ...Object.entries(english), ...Object.entries(screenWords), ...Object.entries(screenWordsV23), ...Object.entries(reviewedTextsV27)]);
// Merge all source Pokédex names with their Taiwan Traditional Chinese names.
// Critical: do not alter G.DEX itself, Pokémon IDs, save data, or asset filenames.
const gameDex = (typeof G !== 'undefined' && Array.isArray(G.DEX)) ? G.DEX : [];
const namesByDex = (typeof globalThis !== 'undefined' && globalThis.PS_PRIVATE_DEX_ZH) || {};
let dexNamesAdded = 0;
for (const pokemon of gameDex) {
  const translated = namesByDex[String(pokemon.dex)];
  if (typeof translated === 'string' && translated.trim() && typeof pokemon.name === 'string') {
    dict.set(pokemon.name, translated);
    dexNamesAdded += 1;
  }
}
// Official localized terms are inserted by the V2.7 GitHub build. Merge
// by exact display name only. Never modify G.MOVES, G.DEX, IDs or save keys.
const officialTerms = (typeof globalThis !== 'undefined' && globalThis.PS_PRIVATE_TERMS_ZH) || {};
const knownTermNames = new Set();
let officialTermsAdded = 0;
for (const category of ['moves', 'abilities', 'items']) {
  const localized = officialTerms[category] || {};
  for (const [original, translated] of Object.entries(localized)) {
    if (!original || typeof translated !== 'string' || !translated.trim()) continue;
    knownTermNames.add(original);
    if (!dict.has(original)) { dict.set(original, translated); officialTermsAdded++; }
  }
}
// V2.7: reviewed game-specific UI display names, generated by the private
// builder. This changes neither source IDs nor game rules / saved data.
const localGameNames = (typeof globalThis !== 'undefined' && globalThis.PS_PRIVATE_GAME_NAMES_ZH) || {};
for (const [group, names] of Object.entries(localGameNames)) {
  if (!['moves', 'abilities', 'items'].includes(group)) continue;
  for (const [source, localized] of Object.entries(names || {})) {
    if (source && typeof localized === 'string' && localized.trim()) { dict.set(source, localized); knownTermNames.add(source); }
  }
}
// Game-specific labels: these are UI words, not simulation variables.
const extraLabels = {
  'Movimientos': '招式', 'Movimiento': '招式', 'Movimiento nuevo': '新招式',
  'Movimiento aprendido': '已學會招式', 'Aprender': '學習', 'Aprendido': '已學會',
  'Elegir movimiento': '選擇招式', 'Elegir mejora': '選擇強化',
  'Habilidades': '特性', 'Habilidad': '特性', 'Habilidad pasiva': '被動特性',
  'Objetos': '道具', 'Objeto': '道具', 'Objeto equipable': '可裝備道具',
  'Equipado': '已裝備', 'Equipar': '裝備', 'Desequipar': '卸下',
  'Daño': '傷害', 'Potencia': '威力', 'Precisión': '命中率',
  'Probabilidad': '機率', 'Duración': '持續時間', 'Alcance': '範圍',
  'Recarga': '冷卻', 'Segundos': '秒', 'Segundo': '秒',
  'Efecto': '效果', 'Efectos': '效果', 'Pasiva': '被動',
  'Físico': '物理', 'Especial': '特殊', 'Estado': '變化',
  'Debilidad': '弱點', 'Resistencia': '抗性',
  'Recompensa': '獎勵', 'Recompensas': '獎勵',
  'Progreso': '進度', 'Completa': '完成', 'Completado': '已完成',
  'Mejora obtenida': '獲得強化', 'Subir de nivel': '升級',
  'Daño crítico': '暴擊傷害', 'Golpe crítico': '暴擊',
  'Velocidad de movimiento': '移動速度', 'Velocidad de ataque': '攻擊速度',
  'Tiempo de recarga': '冷卻時間', 'Salud': '生命值',
  'Ataque': '攻擊', 'Defensa': '防禦', 'Experiencia': '經驗值',
  'Tiempo': '時間', 'Puntos': '點數', 'Racha': '連勝',
  'Rareza': '稀有度', 'Tipo': '屬性', 'Categoría': '分類',
  'Evolución': '進化', 'Evolucionar': '進化',
  'Mis recompensas': '我的獎勵', 'Nuevo': '新增', 'Nueva': '新增',
  'Bloqueado': '尚未解鎖', 'Desbloqueado': '已解鎖'
};
for (const [source, target] of Object.entries(extraLabels)) if (!dict.has(source)) dict.set(source, target);
const templated = [

    [/^¡Nivel\s+(\d+)！?$/i, n => `等級 ${n}！`],
    [/^Nivel\s+(\d+)$/i, n => `等級 ${n}`],
    [/^Cambiar opciones\s*\(([^)]+)\)/i, n => `重新抽選（${n}）`],
    [/^Gen(?:eración)?\s+(\d+)$/i, n => `第 ${n} 世代`],
    [/^Nivel\s*\.?\s*(\d+)$/i, n => `等級 ${n}`],
    [/^Ten\s+(\d+)\s+Pokémon\.$/i, n => `擁有 ${n} 隻寶可夢。`],
    [/^Aguanta\s+(\d+)\s+minutos?\s+en\s+una\s+run\.?$/i, n => `在單次冒險中存活 ${n} 分鐘`],
    [/^Se renuevan en\s+(\d+)\s+d\s+(\d+)\s+h$/i, (d,h) => `距離刷新還有 ${d} 天 ${h} 小時`],
    [/^Se renuevan en\s+(\d+)\s+h\s+(\d+)\s+min$/i, (h,m) => `距離刷新還有 ${h} 小時 ${m} 分鐘`],
    [/^Tienes\s+(\d+)\s+de\s+(\d+)$/i, (n,total) => `已擁有 ${n}／${total} 隻`],
    [/^N[º°]\s*(\d+)\s*[·•-]\s*(.+)$/i, (n,region) => `圖鑑編號 ${n}・${dict.get(region.trim())||region.trim()}`],
    [/^Título:\s*(.+)$/i, name => `稱號：${dict.get(name.trim())||name.trim()}`],
    [/^Consíguelo en el banner de (.+?)[.!]?$/i, region => `可從${dict.get(region.trim())||region.trim()}卡池獲得。`],
    [/^Los\s+(\d+)\s+Pokémon\s+de\s+la\s+generación\s+(\d+)\.\s*¡Los legendarios esperan!$/i, (n,g) => `第 ${g} 世代共 ${n} 隻寶可夢，傳說中的寶可夢正等著你！`],
    [/^Gen(?:eración)?\s*(\d+)$/i, n => `第 ${n} 世代`],
    // The shop uses combined text like 'Vitalidad +8 vida'. Keep values as-is.
    [/^(Vitalidad|Fuerza|Zancada|Reflejos|Coraza|Síntesis|Imán|Sabiduría)\s*([+−-]?[\d.,]+%?)\s*(vida\/s|vida|daño|velocidad|recarga|defensa|recogida|experiencia)$/i,
      (name,value,unit) => `${dict.get(name)||name} ${value} ${dict.get(unit)||unit}`],
    [/^¡Logro:\s*(.+)!$/i, title => `獲得成就：${dict.get(title.trim())||title.trim()}！`],
    [/^\(?ahora:\s*(alta|media|baja)\)?\.?$/i, value => `（目前：${dict.get(value)||value}）`],
    [/^(\d+(?:[.,]\d+)?)\s*vida\/s$/i, n => `${n} 生命／秒`]
  ];

  function translate(raw) {
    if (typeof raw !== 'string') return raw;
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(raw);
    if (!m || !m[2]) return raw;
    const core = m[2];
    const direct = dict.get(core);
    if (direct) return m[1] + direct + m[3];
    // Translate the move/ability/item NAME in a combined label, while
    // preserving numeric values and the game's custom effect descriptions.
    const combo = /^([^·|\n]{2,80}?)(\s*[·|]\s*)([^\n]{1,170})$/.exec(core);
    if (combo && knownTermNames.has(combo[1].trim()) && dict.has(combo[1].trim())) {
      const tail = dict.get(combo[3].trim()) || combo[3];
      return m[1] + dict.get(combo[1].trim()) + combo[2] + tail + m[3];
    }
    for (const [rx, fmt] of templated) {
      const match = core.match(rx);
      if (match) return m[1] + fmt(...match.slice(1)) + m[3];
    }
    // Upgrades sometimes share the name and effect in the same text node.
    const bonus = /^(Vitalidad|Fuerza|Zancada|Reflejos|Coraza|Síntesis|Imán|Sabiduría)\s+([+−-][0-9.,]+%?)\s*(vida\/s|vida|daño|velocidad|recarga|defensa|recogida|experiencia)$/i.exec(core);
    if (bonus) return m[1] + `${dict.get(bonus[1])||bonus[1]} ${bonus[2]} ${dict.get(bonus[3])||bonus[3]}` + m[3];
    // V2.7: game-specific shop options can include a numeric bonus next to
    // their custom name. Do not rewrite identifiers or JS source data.
    const custom = /^(Fortuna|Golpe Crítico|Repertorio|Veto|Cambio de cartas|Banda Focus)\s+([+−-]?[0-9.,]+%?)\s*(vida\/s|vida|daño|velocidad|recarga|defensa|recogida|experiencia)?$/i.exec(core);
    if (custom && dict.has(custom[1])) return m[1] + [dict.get(custom[1]), custom[2], (dict.get(custom[3]) || custom[3] || '')].filter(Boolean).join(' ') + m[3];
    // V2.7: translate conservative, standalone numeric effect phrases only.
    // Free-form combat descriptions are deliberately left for the source audit.
    const gain = /^(?:Aumenta|Incrementa) (?:tu |el |la )?(daño|vida|defensa|velocidad|experiencia) (?:en |un )([0-9]+(?:[.,][0-9]+)?%?)\.?$/i.exec(core);
    if (gain) return m[1] + `增加${dict.get(gain[1]) || gain[1]} ${gain[2]}` + m[3];
    const reduce = /^Reduce (?:el )?(tiempo de recarga|daño recibido) (?:en |un )([0-9]+(?:[.,][0-9]+)?%?)\.?$/i.exec(core);
    if (reduce) return m[1] + `降低${reduce[1] === 'daño recibido' ? '受到的傷害' : '冷卻時間'} ${reduce[2]}` + m[3];
    const heal = /^Recupera ([0-9]+(?:[.,][0-9]+)?) (?:puntos de )?vida\.?$/i.exec(core);
    if (heal) return m[1] + `恢復 ${heal[1]} 點生命值` + m[3];
    const damage = /^Inflige ([0-9]+(?:[.,][0-9]+)?) (?:puntos de )?daño\.?$/i.exec(core);
    if (damage) return m[1] + `造成 ${damage[1]} 點傷害` + m[3];
    // Achievement reward labels sometimes share a text node with progress counters.
    if (core.includes('Título: ')) {
      const next = core.replace(/Título:\s*(Coleccionista|Maestro Pokémon|Profesor Pokémon|Cien amigos|Enciclopedia)/g,
        (_, name) => '稱號：' + (dict.get(name) || name));
      if (next !== core) return m[1] + next + m[3];
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
    // Some game panels regenerate their labels via render/update functions. A
    // low-frequency visible-panel pass catches those cases without altering
    // gameplay state, IDs, storage or the gold/EXP calculations.
    setInterval(() => {
      if (document.visibilityState === 'hidden') return;
      const panels = document.querySelectorAll('section.scr:not(.hidden), #set-body, #topbar:not(.hidden)');
      if (!panels.length) { update(document.body); return; }
      for (const panel of panels) update(panel);
    }, 1200);
    document.addEventListener('click', () => {
      setTimeout(() => {
        const settings = document.getElementById('scr-settings');
        if (settings && !settings.classList.contains('hidden')) update(settings);
      }, 80);
    }, {passive: true});
  }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
  }
  if (typeof globalThis !== 'undefined') globalThis.PSPrivateZH = Object.freeze({ translate, count: dict.size, dexNamesAdded, officialTermsAdded, version: '2.7' });
})();
