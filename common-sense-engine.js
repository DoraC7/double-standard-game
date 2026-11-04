(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CommonSchool=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{'use strict';
const topics={"wash": "洗衣精放哪裡", "care": "衣物照護", "clean": "清潔劑別亂混", "food": "廚房與冰箱", "power": "用電不賭運氣", "label": "先看標示再動手"};
const sources={"washer": ["Samsung：洗衣機投放槽與自動投放", "https://www.samsung.com/uk/support/home-appliances/how-do-i-use-the-detergent-drawer-compartments-in-my-washing-machine/"], "care": ["GINETEX：ISO 3758 洗滌照護符號", "https://www.ginetex.net/GB/labelling/care-symbols.asp"], "chemical": ["UKHSA：家用漂白水、混用與暴露風險", "https://www.gov.uk/government/publications/sodium-hypochlorite-properties-incident-management-and-toxicology/sodium-hypochlorite-general-information"], "food": ["英國 FSA：冷藏、解凍與冰箱收納", "https://www.gov.uk/government/publications/how-to-chill-freeze-and-defrost-food-safely/how-to-chill-freeze-and-defrost-food-safely"], "power": ["USFA：家電與電氣防火", "https://www.usfa.fema.gov/prevention/home-fires/prevent-fires/appliance-and-electrical/"], "heat": ["USFA：取暖設備防火", "https://www.usfa.fema.gov/prevention/home-fires/prevent-fires/heating/"]};
const questions=[
 {
  "id": "mainwash",
  "topic": "wash",
  "title": "洗衣精不是衣服的醬料",
  "prompt": "本題機型手冊指定：一般液體洗衣精倒入「II 主洗槽」，本次只做主洗、不是污漬預處理。請選投放位置。",
  "options": [],
  "answer": 0,
  "why": "本題要放 II 主洗槽，不直接把濃縮洗衣精淋在衣服上。專用槽會按程序送入；液體用的插片／隔板依機型。其他機型、洗衣膠囊、污漬預處理可能有不同指示，要分開看。",
  "source": "washer",
  "kind": "drawer",
  "target": "main",
  "item": "一般液體洗衣精",
  "clue": "本題手冊：一般液體洗衣精 → II 主洗槽"
 },
 {
  "id": "softener",
  "topic": "wash",
  "title": "柔軟精也有自己的位子",
  "prompt": "這台手冊指定柔軟精使用花形標示槽，而且不超過 MAX。把柔軟精放對位置。",
  "options": [],
  "answer": 0,
  "why": "柔軟精不是洗衣精，使用對應槽並不超過 MAX。不是把所有洗劑混進同一格；也不是每種衣物都需要柔軟精，依衣物及產品說明。",
  "source": "washer",
  "kind": "drawer",
  "target": "soft",
  "item": "柔軟精（本次衣物與產品允許）",
  "clue": "本題手冊：柔軟精 → 花形槽，勿超過 MAX"
 },
 {
  "id": "capsule",
  "topic": "wash",
  "title": "換了膠囊，就要換讀法",
  "prompt": "本題機型手冊指定：洗衣膠囊放滾筒，不放洗劑抽屜。應怎麼做？",
  "options": [
   "依手冊與膠囊包裝放入滾筒，不塞進投放槽",
   "既然是洗劑，就一律塞進 II 槽",
   "剪破膠囊把內容倒進柔軟精槽"
  ],
  "answer": 0,
  "why": "液體洗衣精、粉劑、膠囊投放方式可能不同。Samsung 這類抽屜說明不建議把膠囊放抽屜；仍依自己的機型／產品規範，妥善存放在兒童無法取得處。",
  "source": "washer"
 },
 {
  "id": "autodose",
  "topic": "wash",
  "title": "自動投放，不是加兩次更安心",
  "prompt": "這台自動投放已開啟，槽內有洗衣精。你想再手動加同樣一份。",
  "options": [
   "先看手冊的自動／手動切換，不額外重複加一份",
   "自動加一次、自己再加一次比較乾淨",
   "把柔軟精倒進自動洗衣精槽補強"
  ],
  "answer": 0,
  "why": "自動投放機型會依設定送出洗劑；手動使用可能要先關閉對應自動設定。不要照搬別台洗衣機或雙重投放；用量依洗劑、衣量、髒污與手冊。",
  "source": "washer"
 },
 {
  "id": "wash30",
  "topic": "care",
  "title": "洗標上的 30 是上限",
  "prompt": "本題洗標是水洗桶內寫 30，沒有其他更低限制。這個符號允許的最高水洗溫度是多少？",
  "options": [],
  "answer": 0,
  "why": "洗桶內數字表示不得超過的最高水洗溫度，不是最低溫、洗幾分鐘或衣服件數。30°C 以下也可能可用，仍需遵守洗標上的其他限制與程序。",
  "source": "care",
  "kind": "temperature",
  "limit": 30,
  "clue": "本題洗標：水洗桶內「30」",
  "art": "wash30"
 },
 {
  "id": "nobleach",
  "topic": "care",
  "title": "三角形打叉",
  "prompt": "衣物洗標的漂白三角形上有叉。你想把它漂白得更白。",
  "options": [
   "不要漂白，選不含漂白劑的洗劑並遵守其餘洗標",
   "只要少量就可用任何漂白水",
   "天然材質就不用管洗標"
  ],
  "answer": 0,
  "why": "打叉的三角形表示不可漂白，不是只禁止某一個牌子。照護方式看整張洗標，不憑顏色或材質猜。",
  "source": "care",
  "art": "nobleach"
 },
 {
  "id": "notumble",
  "topic": "care",
  "title": "方框圓圈打叉",
  "prompt": "這件衣服洗標的「方框內圓圈」打叉，代表什麼？",
  "options": [
   "不可滾筒烘乾，改依其他允許方式乾燥",
   "不能放在任何通風處",
   "烘乾兩次就比較安全"
  ],
  "answer": 0,
  "why": "方框內圓圈表示滾筒烘乾，打叉表示不可滾筒烘乾；不是洗完就能一律丟烘衣機。其他晾乾方式依完整洗標。",
  "source": "care",
  "art": "notumble"
 },
 {
  "id": "pretreat",
  "topic": "care",
  "title": "那去漬時也不能直接碰衣物？",
  "prompt": "本題洗劑包裝明寫「可局部預處理，先試不顯眼處」，衣物洗標也允許。如何理解？",
  "options": [
   "依指定用量／接觸時間先做局部測試；這與整機主洗投放不同",
   "因為有主洗槽，所以所有局部處理都絕對禁止",
   "既然可預處理，就整件泡濃縮液過夜"
  ],
  "answer": 0,
  "why": "「主洗用專用槽」與「依產品指示做局部預處理」是不同情境。本題給定的標示才允許此做法，不代表每一種洗衣精與布料都適合；有疑問先問廠商。",
  "source": "care",
  "clue": "本題虛構產品標示：可局部預處理，先試不顯眼處；用量／時間另依包裝"
 },
 {
  "id": "acid",
  "topic": "clean",
  "title": "漂白水＋醋，不是雙倍乾淨",
  "prompt": "含次氯酸鈉的漂白水，可以混醋或酸性清潔劑嗎？",
  "options": [
   "不要混用，可能釋出有毒氯氣",
   "醋是食品，所以一定能混",
   "只要聞起來不刺鼻就安全"
  ],
  "answer": 0,
  "why": "漂白水遇酸性產品可能產生氯氣。不要自行混清潔劑，也不要用自己的嗅覺測安全；各自依產品標示使用，不做混合實驗。",
  "source": "chemical",
  "art": "bottles"
 },
 {
  "id": "ammonia",
  "topic": "clean",
  "title": "漂白水＋含氨清潔劑",
  "prompt": "有人建議混漂白水和含氨清潔劑來加強去污。",
  "options": [
   "拒絕混用，可能產生刺激呼吸道的氯胺",
   "兩者都是清潔劑就能混",
   "加熱後就能混"
  ],
  "answer": 0,
  "why": "漂白水與含氨產品可能產生氯胺，刺激呼吸道；與酸混合主要是氯氣，兩者不能混為同一化學反應。最簡單可執行原則：不自行混清潔劑。",
  "source": "chemical",
  "art": "bottles"
 },
 {
  "id": "bottle",
  "topic": "clean",
  "title": "無標示的透明液體",
  "prompt": "家裡有裝在飲料瓶的清潔液，沒有名稱與濃度標示。",
  "options": [
   "先停用並確認來源；不喝、不聞著猜，也不隨便混或倒掉",
   "透明的都當水喝一口確認",
   "倒入漂白水看看會不會起泡"
  ],
  "answer": 0,
  "why": "清潔化學品應保留合適容器、標示與安全存放，避免誤食及錯誤混用。不明物依當地廢棄物／廠商指示處理，不擅自混入其他液體。",
  "source": "chemical",
  "art": "bottles"
 },
 {
  "id": "fumes",
  "topic": "clean",
  "title": "已經混到，還出現刺激氣味",
  "prompt": "清潔時誤混產品，現在眼喉刺痛、咳嗽。第一件事？",
  "options": [
   "立刻離開暴露區至安全新鮮空氣處；嚴重不適打119並求醫，不回去聞或混其他物中和",
   "繼續刷完再說",
   "加另一種清潔劑中和，站旁邊看反應"
  ],
  "answer": 0,
  "why": "先停止暴露、離開危險處並尋求醫療協助，不冒險留在現場處理。不要為拿瓶子返回危險區；能安全取得時提供產品資訊給救援人員。此處119是台灣緊急救援號碼，非外國來源的電話。",
  "source": "chemical",
  "art": "bottles"
 },
 {
  "id": "fridge",
  "topic": "food",
  "title": "生肉應該坐哪一層？",
  "prompt": "這盒生肉已放在乾淨密封容器。冰箱最上層有可直接吃的熟食。請替生肉選位置。",
  "options": [],
  "answer": 0,
  "why": "生肉、禽肉、魚類密封存放在冷藏下層，避免接觸或滴汁污染其他食物。密封與上下分開都重要；另依食品包裝與冰箱手冊安排。",
  "source": "food",
  "kind": "fridge",
  "target": "bottom",
  "clue": "上層已放可直接食用的熟食；生肉盒已密封"
 },
 {
  "id": "defrost",
  "topic": "food",
  "title": "解凍不用室溫賭一夜",
  "prompt": "明天要煮冷凍肉，現在有足夠時間。",
  "options": [
   "放入可接滴汁的容器，在冰箱冷藏解凍",
   "整晚放流理台上",
   "放電暖器旁加速，不管中間是否解凍"
  ],
  "answer": 0,
  "why": "冷藏解凍可避免食物長時間處於容易滋生細菌的溫度。若用微波解凍，應依包裝／設備指示並接著烹調；不把室溫過夜當通用解法。",
  "source": "food",
  "art": "fridge"
 },
 {
  "id": "board",
  "topic": "food",
  "title": "切完生肉，下一刀是水果",
  "prompt": "砧板、刀與手剛接觸生肉，接著要處理直接吃的水果。",
  "options": [
   "先徹底清潔接觸過生肉的器具、檯面與手，避免交叉污染",
   "擦掉看得到的肉屑就好",
   "先切水果，吃完再一起洗"
  ],
  "answer": 0,
  "why": "接觸生肉／解凍肉後，應徹底清洗器具、表面與手再處理即食食品。看起來乾淨、沒味道不表示沒有污染；不同用途分開更容易管理。",
  "source": "food",
  "art": "fridge"
 },
 {
  "id": "freezer",
  "topic": "food",
  "title": "冷凍不是殺菌魔法",
  "prompt": "把有細菌的食物放入冷凍，就可以直接安全吃了嗎？",
  "options": [
   "不行，冷凍主要抑制生長，解凍後仍需適當保存與烹調",
   "是，冷凍會保證殺死所有細菌",
   "只要結冰，來源不明的肉也安全"
  ],
  "answer": 0,
  "why": "冷凍像暫停鍵，不是保證殺菌；解凍後細菌仍可能恢復活動。食材來源、冷鏈、保存和適當烹調都重要。",
  "source": "food",
  "art": "fridge"
 },
 {
  "id": "overload",
  "topic": "power",
  "title": "有空插孔，不等於有餘裕",
  "prompt": "本題延長線標示最高總功率1650W，想同接1500W電暖器與800W微波爐。",
  "options": [
   "不這樣接；2300W已超標，高功率／主要家電也不應靠延長線硬接",
   "還有插孔就都接上",
   "把另一條延長線串上去分擔"
  ],
  "answer": 0,
  "why": "1500＋800＝2300W，超過本題標示1650W。即使總數未超過，也不代表任意接法都安全；主要家電依手冊使用合適牆壁插座／迴路，勿串接延長線。1650W不是所有產品通用上限。",
  "source": "power",
  "clue": "本題額定上限1650W；設備1500W＋800W",
  "art": "plug"
 },
 {
  "id": "cord",
  "topic": "power",
  "title": "電線破皮，膠帶不是通行證",
  "prompt": "家電電源線已破裂、鬆動，還能勉強通電。",
  "options": [
   "停止使用，安全斷電並交合格人員處理，不自行帶電修補",
   "貼膠帶後長期照用",
   "只要通電就代表安全"
  ],
  "answer": 0,
  "why": "破損線材有觸電／火災風險；不要拿能不能亮燈當檢查結果。更換或維修依設備與專業人員建議，不把遊戲當電工教學。",
  "source": "power",
  "art": "plug"
 },
 {
  "id": "rug",
  "topic": "power",
  "title": "電線藏地毯下，眼不見為淨？",
  "prompt": "延長線走在地毯下，家具又壓著它。",
  "options": [
   "重新安排安全走線，避免被壓、受損與熱累積",
   "蓋越厚越不容易起火",
   "只要電器還動就不用理"
  ],
  "answer": 0,
  "why": "避免把線材放在地毯下或可能被夾壓、損壞的位置。先安全斷電再調整；已有受損、焦味或發熱異常應停用求助。",
  "source": "power",
  "art": "plug"
 },
 {
  "id": "major",
  "topic": "power",
  "title": "洗衣機不靠一條延長線救場",
  "prompt": "洗衣機想接到共用延長線，再一起接其他家電。",
  "options": [
   "依手冊使用合適牆壁插座／迴路，不用延長線硬接主要家電；不合適時找合格人員",
   "延長線能再串另一條就沒問題",
   "剪掉接地腳讓它插得下"
  ],
  "answer": 0,
  "why": "USFA 建議冰箱、洗衣機、烘衣機等主要家電直接接牆壁插座，不用延長線。插座、電壓、接地與迴路仍需符合設備及當地要求；不自行改插頭。",
  "source": "power",
  "art": "plug"
 },
 {
  "id": "dose",
  "topic": "label",
  "title": "不是一瓶蓋適用全世界",
  "prompt": "本題虛構洗劑標籤：這次衣量與髒污用30mL。請量取指定用量，不靠「感覺多一點」。",
  "options": [],
  "answer": 0,
  "why": "本題指定30mL，不是所有洗衣精每次都30mL。依實際產品濃度、衣量、髒污、水質與機型要求量取；瓶蓋大小也不同。自動投放請依機型設定，不與手動重複。",
  "source": "washer",
  "kind": "dose",
  "limit": 30,
  "clue": "本題虛構標籤：本次衣量／髒污 → 30mL"
 },
 {
  "id": "opened",
  "topic": "label",
  "title": "開封後冷藏，不是裝飾文字",
  "prompt": "本題食品包裝寫「未開封常溫；開封後須冷藏」。現在已開封。",
  "options": [
   "依標示放冰箱並遵守開封後期限",
   "原本放常溫，所以開封後永遠一樣",
   "只要聞起來正常就無限期放室溫"
  ],
  "answer": 0,
  "why": "開封可能改變保存條件；未開封保存方式與總有效期限，不能直接當成開封後規則。依自己的食品標籤，不用氣味代替安全判斷。",
  "source": "food",
  "clue": "本題虛構包裝：未開封常溫；開封後須冷藏"
 },
 {
  "id": "heater",
  "topic": "label",
  "title": "離開房間，電暖器要做什麼？",
  "prompt": "要離開房間或上床睡覺，電暖器還開著。",
  "options": [
   "關閉電暖器，依手冊安全操作",
   "蓋條毯子保溫後繼續開",
   "用烤箱代替房間暖氣"
  ],
  "answer": 0,
  "why": "USFA 建議離開房間或睡覺時關閉電暖器，並讓可燃物遠離熱源。別用烤箱取暖；實際安全距離與操作也要依設備手冊。",
  "source": "heat",
  "art": "heater"
 },
 {
  "id": "sequence",
  "topic": "label",
  "title": "沒用過的新洗衣機，先做哪件事？",
  "prompt": "以下是本題一般主洗的三個準備步驟，請排好；本題不是自動投放或膠囊程序。",
  "options": [],
  "answer": 0,
  "why": "先讀衣物、洗劑與機器說明，確認可用方式，再按規範量取、放對指定槽。示意順序只涵蓋這三個準備步驟，不是完整開機程序；實際裝衣、關門、選程式等仍依手冊。",
  "source": "washer",
  "kind": "order",
  "steps": [
   "核對洗標、洗劑與機型說明",
   "依本次條件量取洗衣精",
   "倒入手冊指定的主洗槽"
  ]
 },
{"id": "wash-extra-1", "topic": "wash", "title": "濃度換了，用量也換嗎？", "prompt": "舊洗劑用40mL；新產品標示相同衣量用20mL，機器允許此產品。該怎麼投放？", "options": ["依新標示量20mL，確認投放設定", "沿用舊瓶蓋裝40mL", "兩種各加20mL"], "answer": 0, "why": "濃度與瓶蓋不同，不能沿用舊產品的體積。自動投放也應核對濃度設定。", "source": "washer", "difficulty": "medium"},
{"id": "wash-extra-2", "topic": "wash", "title": "手動與自動擇一", "prompt": "本題手冊要求手動投放前關閉自動投放。你已手動加好一份，發現自動投放仍開著。", "options": ["開始前依手冊關閉自動投放", "直接啟動，機器一定會抵銷", "再加柔軟精抵銷"], "answer": 0, "why": "依本題手冊避免雙重投放，不能假設機器會偵測手動加入量。", "source": "washer", "difficulty": "medium"},
{"id": "wash-extra-3", "topic": "wash", "title": "抽屜配置換邊了", "prompt": "新機器左槽標II、右槽標I，手冊指定II放主洗劑。你記得舊機器主洗在右邊。", "options": ["用新機器標II的左槽", "仍用右槽，位置不會變", "兩槽平均倒"], "answer": 0, "why": "槽位看新機手冊與標記，不靠左右的肌肉記憶。", "source": "washer", "difficulty": "medium"},
{"id": "wash-extra-4", "topic": "wash", "title": "兩種標示一起讀", "prompt": "衣物禁止漂白，洗劑卻含漂白成分且標示只限可漂白衣物。少放一半是否合適？", "options": ["不使用這款，改選相容產品", "減半就解除洗標限制", "放柔軟精槽就不算漂白"], "answer": 0, "why": "劑量減半不會取消衣物照護限制；產品與衣物要求必須同時符合。", "source": "care", "difficulty": "hard"},
{"id": "care-extra-1", "topic": "care", "title": "兩件衣服一起洗", "prompt": "A洗標最高40°C，B最高30°C；兩者均允許相同柔和程序且無其他衝突。共同水溫上限？", "options": ["30°C", "40°C", "平均35°C"], "answer": 0, "why": "共同條件取較嚴格的30°C，不取平均；實際還須檢查顏色與其餘照護限制。", "source": "care", "difficulty": "medium"},
{"id": "care-extra-2", "topic": "care", "title": "低溫烘乾不是禁止烘乾", "prompt": "本題洗標說明：方框圓圈內一點＝允許低溫滾筒烘乾。怎麼做？", "options": ["依設備與洗標選低溫程序", "任何溫度都可以", "一定完全禁止滾筒烘乾"], "answer": 0, "why": "一點的低溫限制與打叉的禁止不同，不能只看有沒有圓圈。", "source": "care", "difficulty": "medium"},
{"id": "care-extra-3", "topic": "care", "title": "有機器不代表能水洗", "prompt": "衣物標示不可水洗，但家中機器有精緻衣物程序。", "options": ["依洗標選允許方式，必要時詢問專業清洗", "用精緻程序就能水洗", "水量減半就可以"], "answer": 0, "why": "精緻程序仍是水洗，不會推翻衣物禁止水洗的條件。", "source": "care", "difficulty": "medium"},
{"id": "care-extra-4", "topic": "care", "title": "上限不是推薦目標", "prompt": "A最高60°C，B最高30°C，產品本次要求40°C以上才適用。能否把兩件與此產品一起洗？", "options": ["沒有共同條件，分開或更換相容產品", "設30°C即可同時滿足", "設40°C折衷"], "answer": 0, "why": "B要求不超過30°C，產品要求至少40°C，沒有交集；不可拿平均值折衷。", "source": "care", "difficulty": "hard"},
{"id": "clean-extra-1", "topic": "clean", "title": "戴手套就能混嗎？", "prompt": "兩種清潔劑都需戴手套；其中一瓶含漂白水，另一瓶酸性。", "options": ["仍不可混用，手套不消除產氣風險", "戴兩層手套就能混", "開窗後就能混"], "answer": 0, "why": "個人防護不能讓不相容的化學品變得可混用。", "source": "chemical", "difficulty": "medium"},
{"id": "clean-extra-2", "topic": "clean", "title": "換瓶後的記憶不可靠", "prompt": "清潔劑只剩一點，想裝進無標籤飲料瓶暫存。", "options": ["保留原合適容器與標示，不用飲料瓶", "只寫勿喝即可取代全部標示", "放高處就不用標示"], "answer": 0, "why": "包裝、濃度與使用說明都是安全資訊，飲料容器容易造成誤食。", "source": "chemical", "difficulty": "medium"},
{"id": "clean-extra-3", "topic": "clean", "title": "天然與相容是兩回事", "prompt": "朋友說醋天然、漂白水殺菌，混合更環保。哪個判斷有依據？", "options": ["天然不代表可混，酸與漂白水可能產生氯氣", "天然產品一定不反應", "稀釋後所有產品都相容"], "answer": 0, "why": "是否天然與化學相容性不同；不要自行試混或聞氣味驗證。", "source": "chemical", "difficulty": "medium"},
{"id": "clean-extra-4", "topic": "clean", "title": "稀釋指示也有範圍", "prompt": "本題產品標籤寫每1公升水加10mL原液，且容器容量足夠；要用2公升水。應取多少原液？", "options": ["20mL，並遵守該產品其餘指示", "5mL", "100mL"], "answer": 0, "why": "依題目比例10×2＝20mL。這只適用本題標籤，不是通用漂白水配方，不與其他產品混合。", "source": "chemical", "difficulty": "hard"},
{"id": "food-extra-1", "topic": "food", "title": "日期沒到但已開封", "prompt": "食品總有效期限尚有一週，但標示開封後冷藏並於3日內食用，今天是開封第5日。", "options": ["不以總期限取代開封後限制", "聞起來正常就能繼續吃", "再冷凍就重新計算3日"], "answer": 0, "why": "總期限與開封後條件不同，冷凍不會把過往保存紀錄歸零。", "source": "food", "difficulty": "medium"},
{"id": "food-extra-2", "topic": "food", "title": "冷藏也要防滴汁", "prompt": "上層是生肉盒，下層是即食沙拉；肉盒有裂縫。只把肉移到下層夠嗎？", "options": ["還要換完整防漏容器並處理可能污染", "只換層就一定安全", "把沙拉擦乾即可"], "answer": 0, "why": "分層與密封都要做到；已可能受污染的即食食品不能靠換位置恢復安全。", "source": "food", "difficulty": "medium"},
{"id": "food-extra-3", "topic": "food", "title": "微波解凍後還有事", "prompt": "肉已用微波解凍，現在不想煮，想放流理台等到晚上。", "options": ["依設備與食品指示立即接著烹調", "用蓋子蓋著放室溫", "重新冷凍就能取消所有風險"], "answer": 0, "why": "微波解凍可能使局部升溫，應接著烹調，不在室溫長時間等待。", "source": "food", "difficulty": "medium"},
{"id": "food-extra-4", "topic": "food", "title": "冷藏規則衝突嗎？", "prompt": "包裝指定0至4°C；冰箱此層實測8°C，面板設定卻是4°C。哪項證據重要？", "options": ["實測未符保存條件，應改善冷藏與評估食品保存紀錄", "面板4°C保證所有位置都是4°C", "把日期標籤撕掉就不受限"], "answer": 0, "why": "面板設定不等於每處實際溫度；不能只憑設定或外觀認定食品安全。", "source": "food", "difficulty": "hard"},
{"id": "power-extra-1", "topic": "power", "title": "共用上限一起算", "prompt": "本題合格電源設備標示總上限1200W，已有700W與400W負載，還想加200W。", "options": ["總計1300W超限，不增加", "200W很小所以沒差", "換另一孔就不算總功率"], "answer": 0, "why": "700＋400＋200＝1300W。總上限不是每個插孔各有1200W；符合總量也不保證任意接法適合。", "source": "power", "difficulty": "medium"},
{"id": "power-extra-2", "topic": "power", "title": "插頭摸起來異常燙", "prompt": "插頭有焦味與變色，但家電仍運轉。", "options": ["停用並在安全情況下斷電，找合格人員檢查", "能運轉就繼續", "噴水降溫後繼續"], "answer": 0, "why": "運轉不是安全證據；異常發熱、焦味、變色都應處理，不向帶電設備潑水。", "source": "power", "difficulty": "medium"},
{"id": "power-extra-3", "topic": "power", "title": "轉接頭不是變壓器", "prompt": "本題設備只允許110V，當地插座220V；轉接頭註明不具變壓功能。", "options": ["不可只靠此轉接頭使用，確認合適供電", "插得進就能用", "只使用一半時間即可"], "answer": 0, "why": "插頭形狀適配不等於電壓相容，時間減半也無法解決規格不符。", "source": "power", "difficulty": "medium"},
{"id": "power-extra-4", "topic": "power", "title": "兩條線不能把容量相加", "prompt": "兩條各標1650W延長線串接，想供應2000W設備。", "options": ["不能相加，且不應串接延長線", "串接後總上限3300W", "把線捲緊就能增加上限"], "answer": 0, "why": "串接不是並出新的額定容量；前段仍承受後段負載，並增加接點與風險。", "source": "power", "difficulty": "hard"},
{"id": "label-extra-1", "topic": "label", "title": "一瓶蓋不等於一份", "prompt": "本題瓶蓋全滿50mL，標籤本次需25mL且有刻度。", "options": ["依25mL刻度量取", "一瓶蓋固定等於一份", "倒兩蓋比較均勻"], "answer": 0, "why": "計量看體積與刻度，不把瓶蓋當通用單位。", "source": "washer", "difficulty": "medium"},
{"id": "label-extra-2", "topic": "label", "title": "先後順序不能省", "prompt": "產品要求先在隱蔽處測試、確認無異常再局部處理。想趕時間先整件用。", "options": ["先完成測試，不能用事後檢查取代", "用完再看效果等同先測試", "減少用量就不用測"], "answer": 0, "why": "測試是處理前的條件，先整件使用就失去風險控制作用。", "source": "care", "difficulty": "medium"},
{"id": "label-extra-3", "topic": "label", "title": "小字是條件不是裝飾", "prompt": "包裝正面寫可常溫，背面限定未開封且陰涼存放。現在放在日曬車內。", "options": ["未符合陰涼條件，不能只看正面", "只要未開封就適合任何高溫", "標示常溫代表耐曝曬"], "answer": 0, "why": "完整標示包含限制條件；日曬車內不等於指定常溫保存環境。", "source": "food", "difficulty": "medium"},
{"id": "label-extra-4", "topic": "label", "title": "同時滿足兩個限制", "prompt": "本題產品規定每次最多20mL，機器該槽MAX為40mL；這次產品建議量15mL。應選？", "options": ["15mL，兩個上限都不是目標量", "40mL，以槽位MAX為準", "20mL，永遠加到產品上限"], "answer": 0, "why": "建議量15mL同時不超過20與40；MAX是上限，不是每次必須加滿。", "source": "washer", "difficulty": "hard"}
];
for(const q of questions)q.difficulty ??= "easy";
function shuffled(items,rng=Math.random){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function queue(mode='short',rng=Math.random){if(mode==='all')return shuffled(questions,rng);if(Object.hasOwn(topics,mode))return shuffled(questions.filter(q=>q.topic===mode),rng);if(mode!=='short')throw new Error('Unknown mode');return shuffled(Object.keys(topics).flatMap(t=>['easy','challenge'].map(level=>shuffled(questions.filter(q=>q.topic===t&&(level==='easy'?q.difficulty==='easy':q.difficulty!=='easy')),rng)[0])),rng);}
function correct(q,value){if(value==='unsure')return false;if(['temperature','dose'].includes(q.kind))return typeof value==='number'&&value===q.limit;if(['drawer','fridge'].includes(q.kind))return value===q.target;if(q.kind==='order')return Array.isArray(value)&&value.length===3&&value.every((v,i)=>v===i);return Number.isInteger(value)&&value===q.answer;}
function create(mode='short',rng=Math.random){return {items:queue(mode,rng),index:0,answers:[],locked:false};}
function submit(s,value){if(s.locked||s.index>=s.items.length)return null;const q=s.items[s.index];const a={id:q.id,value:Array.isArray(value)?[...value]:value,ok:correct(q,value)};s.answers.push(a);s.locked=true;return a;}
function next(s){if(!s.locked)return false;s.index++;s.locked=false;return true;}
return {topics,sources,questions,shuffled,queue,correct,create,submit,next};});
