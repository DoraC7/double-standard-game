(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RoadSchool=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{'use strict';
const topics={"speed": "速限與減速", "fluids": "五油三水", "lights": "遠光燈與霧燈", "road": "號誌與迴轉", "tires": "胎壓小教室", "emergency": "緊急事件", "pedal": "右腳不是開關"};
const sources={"speed": ["道路交通安全規則 §93", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=93"], "lights": ["道路交通安全規則 §109", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=109"], "cross": ["道路交通安全規則 §102", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=102"], "ped": ["道路交通安全規則 §103", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=103"], "uturn": ["道路交通安全規則 §106", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=106"], "flash": ["道路交通標誌標線號誌設置規則 §211", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040014&flno=211"], "signal": ["道路交通標誌標線號誌設置規則 §206", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040014&flno=206"], "signs": ["道路交通標誌標線號誌設置規則", "https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040014"], "oil": ["Toyota：定期保養項目（實車依手冊）", "https://www.toyota.com.tw/owner_maintenance.aspx"], "cool": ["Mazda 車主手冊：冷卻液與高溫警告", "https://owners-manual.mazda.com/gen/en/cx-5/cx-5_8ft1ee17b/contents/07030501.html"], "tire": ["Mazda 車主手冊：冷胎胎壓", "https://owners-manual.mazda.com/gen/en/cx-5/cx-5_8ft1ee17b/contents/07031401.html"], "freeway": ["交通部168：國道事故先退避再報案（115/10/21）", "https://168.motc.gov.tw/theme/news/post/2610210953097"], "fire": ["US Fire Administration：車輛火災（處置原則；求救號碼採台灣119）", "https://www.usfa.fema.gov/prevention/vehicle-fires/"]};
const questions=[
 {
  "id": "limit40",
  "topic": "speed",
  "title": "看牌子，不看心情",
  "prompt": "一般道路標示最高速限 40，沒有其他較低限制。法定最高速限是多少？",
  "options": [],
  "answer": 0,
  "why": "依速限標誌／標線行駛。40 是上限，不是任何天候都必須開到的速度。",
  "source": "speed",
  "kind": "speed",
  "limit": 40,
  "art": "max40"
 },
 {
  "id": "limit50",
  "topic": "speed",
  "title": "沒牌子，不代表無上限",
  "prompt": "一般道路有車道線，沒有速限標誌或標線，也不是快慢車道分隔線內的慢車道。法定最高速限？",
  "options": [],
  "answer": 0,
  "why": "上述無標示的一般道路以 50 km/h 為上限；有標示時依標示，情況不佳仍要減速。",
  "source": "speed",
  "kind": "speed",
  "limit": 50,
  "art": ""
 },
 {
  "id": "limit30",
  "topic": "speed",
  "title": "巷弄先慢下來",
  "prompt": "這條道路未劃設車道線、行車分向線或分向限制線，也沒有速限標誌／標線。法定最高速限？",
  "options": [],
  "answer": 0,
  "why": "未劃設上述線的道路，無速限標誌／標線時不得超過 30 km/h。不是一律 50，也不是舊印象中的 40。",
  "source": "speed",
  "kind": "speed",
  "limit": 30,
  "art": ""
 },
 {
  "id": "slow40",
  "topic": "speed",
  "title": "慢車道不是外側車道的別名",
  "prompt": "有快慢車道分隔線的慢車道，沒有速限標誌／標線。法定最高速限？",
  "options": [],
  "answer": 0,
  "why": "必須是設有快慢車道分隔線的慢車道，才適用此處 40 km/h 上限；不能看到外側車道就套用。",
  "source": "speed",
  "kind": "speed",
  "limit": 40,
  "art": ""
 },
 {
  "id": "rain",
  "topic": "speed",
  "title": "下雨了，數字還是同一個？",
  "prompt": "道路速限 50，現在大雨、視線不清。應怎麼做？",
  "options": [
   "視線與路況需要時減速，隨時準備停車",
   "只要維持 50 就保證安全",
   "超車時先超速再降回來"
  ],
  "answer": 0,
  "why": "速限是上限。雨霧視線不清時應減速慢行、隨時準備停車；沒有適用所有路況的固定「安全時速」。",
  "source": "speed",
  "art": "rain"
 },
 {
  "id": "school",
  "topic": "speed",
  "title": "學校前，多留一點餘裕",
  "prompt": "接近有學校標誌的路段，行人動向不明。",
  "options": [
   "減速慢行，隨時準備停車",
   "按喇叭後維持速限衝過",
   "只注意後方車有沒有催"
  ],
  "answer": 0,
  "why": "§93 列有學校等應減速路段。符合速限不代表已履行注意義務。",
  "source": "speed",
  "art": "crossing"
 },
 {
  "id": "fuel",
  "topic": "fluids",
  "title": "五油①｜燃油",
  "prompt": "油箱蓋與手冊標示這是汽油車，油槍卻是柴油。",
  "options": [
   "先停止加油，核對規格；誤加時不要發動並求助",
   "柴油比較有力，照加",
   "加水稀釋一下"
  ],
  "answer": 0,
  "why": "燃油提供內燃機能量，是五油之一，汽油／柴油不能任意替代。電動車則沒有汽柴油需求；規格以該車標示與手冊為準。",
  "source": "oil",
  "fluid": "燃油"
 },
 {
  "id": "engine",
  "topic": "fluids",
  "title": "五油②｜機油",
  "prompt": "引擎需要潤滑，該選哪個做法？",
  "options": [
   "依車主手冊的機油規格、檢查方式與保養要求",
   "所有車都套用相同黏度和更換里程",
   "看到少就加到超過上限"
  ],
  "answer": 0,
  "why": "機油負責潤滑等功能。油量、規格和週期依車款，不是越多越好；純電車沒有內燃機機油需求。",
  "source": "oil",
  "fluid": "機油"
 },
 {
  "id": "trans",
  "topic": "fluids",
  "title": "五油③｜變速箱油",
  "prompt": "不同變速箱的油品可以互換嗎？",
  "options": [
   "核對變速箱型式與原廠指定油品，交由合格人員處理",
   "用機油代替就好",
   "只要顏色相近都可以"
  ],
  "answer": 0,
  "why": "變速箱油負責潤滑等功能，依設計也可能參與傳遞動力。手排、自排、CVT 等油品需求不同；五油是分類記憶法，不是混用清單。換油方式與週期依車主手冊。",
  "source": "oil",
  "fluid": "變速箱油"
 },
 {
  "id": "brake",
  "topic": "fluids",
  "title": "五油④｜煞車油",
  "prompt": "煞車油液面突然明顯下降，煞車感也不對。",
  "options": [
   "停止繼續行車，安排專業檢查／救援",
   "補滿就算修好了",
   "加雨刷水替代"
  ],
  "answer": 0,
  "why": "煞車油傳遞煞車力量。異常流失或煞車感改變應查明原因；不把補液當修復，更不能混入其他液體。",
  "source": "oil",
  "fluid": "煞車油"
 },
 {
  "id": "steering",
  "topic": "fluids",
  "title": "五油⑤｜方向機油",
  "prompt": "本題虛構車主手冊明寫「EPS 電動輔助轉向，無液壓方向機油槽」。應怎麼做？",
  "options": [
   "依手冊，不尋找不存在的液壓油槽",
   "為了湊齊五油自行加裝油槽",
   "把煞車油倒進轉向機構"
  ],
  "answer": 0,
  "why": "方向機油用於液壓輔助轉向；傳統液壓輔助系統才有對應油液需求。EPS 車不必為了湊五油硬加；本題車輛設定已在題幹提供，實車查自己的手冊。",
  "source": "oil",
  "fluid": "液壓動力方向機油"
 },
 {
  "id": "coolant",
  "topic": "fluids",
  "title": "三水①｜水箱水其實是冷卻液",
  "prompt": "引擎高溫冒蒸氣。安全停妥後，可以立刻打開水箱蓋嗎？",
  "options": [
   "不開高溫壓力蓋，熄火並尋求協助",
   "用毛巾包著就馬上打開",
   "臉靠近看看還有多少水"
  ],
  "answer": 0,
  "why": "高溫系統有壓力，開蓋可能噴出蒸氣、冷卻液造成燙傷。不要靠近可能自行啟動的風扇；待冷卻並依手冊／專業指示處理。",
  "source": "cool",
  "fluid": "冷卻液"
 },
 {
  "id": "washer",
  "topic": "fluids",
  "title": "三水②｜雨刷水",
  "prompt": "擋風玻璃髒了，該使用哪個系統？",
  "options": [
   "雨刷水系統；依手冊選用適合清洗液",
   "把清洗液倒入冷卻系統",
   "只要是水就可倒入任何油壺"
  ],
  "answer": 0,
  "why": "雨刷水用於清潔玻璃，與冷卻液功能、加注位置不同。圖鑑只是分類示意，不是實車加注位置圖。",
  "source": "oil",
  "fluid": "雨刷水"
 },
 {
  "id": "battery",
  "topic": "fluids",
  "title": "三水③｜不是每顆電瓶都能加水",
  "prompt": "本題虛構手冊標示「密閉免保養電瓶，禁止開啟」。你想補電瓶水。",
  "options": [
   "不要拆開；依手冊與保修人員建議",
   "三水一定要補齊，撬開再加",
   "往接頭上澆水就好"
  ],
  "answer": 0,
  "why": "電瓶水只適用有此保養需求的傳統可維護鉛酸電瓶。密閉免保養電瓶不可硬拆；電動車高壓電池也不是這種補水項目。本題依已給定手冊判斷。",
  "source": "oil",
  "fluid": "傳統可維護電瓶的電瓶水"
 },
 {
  "id": "oncoming",
  "topic": "lights",
  "title": "會車，別把對方照白",
  "prompt": "夜間迎面有來車，天氣晴朗。設定頭燈與霧燈。",
  "options": [],
  "answer": 0,
  "why": "夜間會車使用近光燈；非遇雨、霧不得使用霧燈。遠光不是用來逼對方讓路。",
  "source": "lights",
  "kind": "lights",
  "accepted": [
   "low|0"
  ]
 },
 {
  "id": "following",
  "topic": "lights",
  "title": "跟車 80 公尺",
  "prompt": "夜間同向前方 80 公尺有車，非超車情境，晴天。",
  "options": [],
  "answer": 0,
  "why": "夜間同向前方 100 公尺內有車，原則應用近光燈（法條另有特定超車例外）；本題沒有該例外。",
  "source": "lights",
  "kind": "lights",
  "accepted": [
   "low|0"
  ]
 },
 {
  "id": "fog",
  "topic": "lights",
  "title": "霧裡不要拚亮度",
  "prompt": "濃霧、視線不清。選擇本題合適的燈光；霧燈不是強制配備。",
  "options": [],
  "answer": 0,
  "why": "應開頭燈；濃霧時以近光避免遠光反射影響視線，視需要用霧燈。本題近光單獨使用也接受；霧燈不能取代頭燈。近光是此情境安全選擇，法條不是一律禁止霧中遠光。",
  "source": "lights",
  "kind": "lights",
  "accepted": [
   "low|0",
   "low|1"
  ]
 },
 {
  "id": "clearfog",
  "topic": "lights",
  "title": "晴天不是霧燈展示日",
  "prompt": "晴朗夜間會車，你已開近光。霧燈呢？",
  "options": [],
  "answer": 0,
  "why": "非遇雨、霧，不得使用霧燈。晴天不因覺得好看就開；會車仍用近光。",
  "source": "lights",
  "kind": "lights",
  "accepted": [
   "low|0"
  ]
 },
 {
  "id": "tunnel",
  "topic": "lights",
  "title": "隧道亮，不等於免開燈",
  "prompt": "白天進入隧道，同向前方 50 公尺有車，無雨霧。",
  "options": [],
  "answer": 0,
  "why": "隧道應開頭燈；近光也避免照到前車。日行燈不等於已開妥頭燈。",
  "source": "lights",
  "kind": "lights",
  "accepted": [
   "low|0"
  ]
 },
 {
  "id": "highwhen",
  "topic": "lights",
  "title": "遠光是有條件的工具",
  "prompt": "何者適合考慮使用遠光照明？",
  "options": [
   "無照明、視線需要，且確認不影響其他用路人的路段",
   "晴天夜間貼近前車時",
   "拿來照亮濃霧、逼行人走快"
  ],
  "answer": 0,
  "why": "遠光不是常駐模式；應依環境判斷，遇來車或跟車等情況切回近光。不能把可用遠光誤讀為必須用遠光。",
  "source": "lights",
  "art": "headlight"
 },
 {
  "id": "stop",
  "topic": "road",
  "title": "紅色八角形：停車再開",
  "prompt": "看到這個「停」標誌，沒有其他號誌／指揮覆蓋，應怎麼做？",
  "options": [
   "停車觀察，確認安全再開",
   "沒有看到車就不必停",
   "減速但永遠不用停"
  ],
  "answer": 0,
  "why": "停車再開標誌要求停車觀察，再確認安全通行；不是只有車多才要停。",
  "source": "signs",
  "art": "stop"
 },
 {
  "id": "yield",
  "topic": "road",
  "title": "倒三角：讓路",
  "prompt": "看到「讓」標誌，幹道有車接近。",
  "options": [
   "減速或停車，讓幹道車優先，確認安全才通行",
   "因為是三角形所以一定加速",
   "先搶出去再道歉"
  ],
  "answer": 0,
  "why": "讓路標誌要求依情況減速或停車讓幹道車先行。它與停車再開標誌不同，不是所有情況都必須先停。",
  "source": "signs",
  "art": "yield"
 },
 {
  "id": "flashred",
  "topic": "road",
  "title": "閃紅燈，不是一般紅燈等綠",
  "prompt": "無人指揮的路口，你面前是閃光紅燈。",
  "options": [
   "進路口前停車，讓幹道車先行，安全才通過",
   "只要慢一點就可直接通過",
   "停著等它一定變綠"
  ],
  "answer": 0,
  "why": "閃紅表示停車再開：先停、讓幹道，再確認安全通行。",
  "source": "flash",
  "art": "flashred"
 },
 {
  "id": "flashyellow",
  "topic": "road",
  "title": "閃黃燈，也不是優先權護身符",
  "prompt": "你面前是閃光黃燈，路口無人指揮。",
  "options": [
   "減速接近、注意安全，小心通過",
   "維持原速，別人都得讓",
   "等它變成一般綠燈才能走"
  ],
  "answer": 0,
  "why": "閃黃表示警告，應減速接近並注意安全。不能因對方是閃紅就不觀察路口。",
  "source": "flash",
  "art": "flashyellow"
 },
 {
  "id": "officer",
  "topic": "road",
  "title": "警察與綠燈不一樣？",
  "prompt": "路口綠燈，但交通指揮人員示意你停。",
  "options": [
   "依指揮停車",
   "綠燈較重要，直接通過",
   "只看前車有沒有動"
  ],
  "answer": 0,
  "why": "遇交通指揮人員與燈光號誌並用時，以指揮人員指揮為準。",
  "source": "cross",
  "art": "green"
 },
 {
  "id": "blocked",
  "topic": "road",
  "title": "綠燈，但前面塞住",
  "prompt": "前方壅塞，進入後會卡在路口。",
  "options": [
   "停在停止線前，等有空間再進入",
   "綠燈就先占住路口",
   "把車停在行人穿越道上等"
  ],
  "answer": 0,
  "why": "不能因綠燈就進入會被堵住的路口，妨礙其他車流與行人。",
  "source": "cross",
  "art": "green"
 },
 {
  "id": "pedestrian",
  "topic": "road",
  "title": "行穿線不是停車格",
  "prompt": "行人正在行人穿越道穿越。",
  "options": [
   "暫停，讓行人先行",
   "按喇叭讓他讓你",
   "從行人前面加速繞過"
  ],
  "answer": 0,
  "why": "遇行人穿越，不論有無人員指揮或號誌指示，均應暫停讓行人先行。",
  "source": "ped",
  "art": "crossing"
 },
 {
  "id": "red",
  "topic": "road",
  "title": "圓形紅燈",
  "prompt": "一般路口只有圓形紅燈，無綠色箭頭、其他特殊指示或人員指揮。",
  "options": [
   "不得越過停止線或進入路口",
   "右轉就不必理會紅燈",
   "沒人時可自行通過"
  ],
  "answer": 0,
  "why": "本情境紅燈應停。紅燈加綠色箭頭是另一種情境，需依箭頭及其他規定通行。",
  "source": "signal",
  "art": "red"
 },
 {
  "id": "uturnban",
  "topic": "road",
  "title": "沒有禁止迴轉牌，就一定可以？",
  "prompt": "這段道路標示禁止左轉。能迴轉嗎？",
  "options": [
   "不能，禁止左轉路段也不得迴車",
   "可以，只有左轉被禁止",
   "看後方沒車就可以"
  ],
  "answer": 0,
  "why": "禁止左轉路段不得迴車；雙黃實線等分向限制線、禁止迴轉標誌及其他禁止條件也要查。",
  "source": "uturn",
  "art": "uturnban"
 },
 {
  "id": "uturncheck",
  "topic": "road",
  "title": "可以迴轉，也不是直接一甩",
  "prompt": "已確認地點沒有禁止迴車條件，準備迴轉。",
  "options": [
   "先暫停、顯示左轉方向燈，確認無來車並注意行人",
   "打右方向燈後直接轉",
   "只看後照鏡，不看行人"
  ],
  "answer": 0,
  "why": "迴車前應暫停，顯示左轉燈光或手勢，確認無來往車輛並注意行人。能迴轉不等於取得優先權。",
  "source": "uturn",
  "art": "uturn"
 },
 {
  "id": "cold",
  "topic": "tires",
  "title": "讀車身標籤，不讀胎壁上限",
  "prompt": "本題虛構車門標籤：一般載重、冷胎前後 33 psi；胎壁寫 MAX 51 psi。要以哪個為準？",
  "options": [
   "依車門標籤，本題冷胎 33 psi",
   "一律充到胎壁 MAX 51 psi",
   "任何車都固定 33 psi"
  ],
  "answer": 0,
  "why": "33 psi 只是假想車的已給定規格，不是通用胎壓。胎壁最大值不是該車建議使用值；實車依標籤／手冊和載重條件。",
  "source": "tire",
  "art": "placard"
 },
 {
  "id": "warm",
  "topic": "tires",
  "title": "熱胎比較高，先別放氣",
  "prompt": "剛長途行駛，量到胎壓比手冊冷胎建議高一些。",
  "options": [
   "不要為追冷胎數字直接洩氣，待冷胎再依規範確認",
   "放到冷胎建議值就一定正確",
   "胎壓只看外觀就好"
  ],
  "answer": 0,
  "why": "輪胎熱時壓力上升正常，不應為調到冷胎建議值而洩掉熱胎空氣。若異常或有損傷應求助，不能只當正常熱脹。",
  "source": "tire",
  "art": "tire"
 },
 {
  "id": "tpms",
  "topic": "tires",
  "title": "胎壓燈亮，不是按掉就好",
  "prompt": "行駛中胎壓警示燈亮，車輛狀況尚可控制。",
  "options": [
   "先平穩減速，在安全處檢查／求助，查明原因",
   "直接重設警示繼續跑",
   "加速讓輪胎熱起來消燈"
  ],
  "answer": 0,
  "why": "警示需要確認原因、檢查壓力與可能損傷；不能用重設取代檢查。實車警示與處理程序依手冊。",
  "source": "tire",
  "art": "tire"
 },
 {
  "id": "monthly",
  "topic": "tires",
  "title": "有胎壓偵測，還要量嗎？",
  "prompt": "輪胎外觀看起來正常，也有胎壓偵測系統。",
  "options": [
   "仍定期在冷胎檢查，依手冊含備胎（若有）",
   "不用，燈沒亮就沒有問題",
   "只在高速行駛後量一次"
  ],
  "answer": 0,
  "why": "參考手冊建議每月至少冷胎檢查，實車依自己的手冊；監測系統不能取代定期檢查與損傷觀察。",
  "source": "tire",
  "art": "tire"
 },
 {
  "id": "freewayorder",
  "topic": "emergency",
  "title": "國道故障：先處理什麼？",
  "prompt": "車輛故障已能停靠，周圍仍有高速車流。把以下三個核心優先動作排好。",
  "options": [],
  "answer": 0,
  "why": "核心優先：開危險警告燈 → 儘速退避車道至護欄外或其他安全處所 → 在安全處報警。警示設施僅在確保自身安全時放置；不要為拍照、擺三角架先暴露在車流中。",
  "source": "freeway",
  "kind": "order",
  "steps": [
   "開危險警告燈",
   "安全撤離車道至安全處所",
   "在安全處報警"
  ]
 },
 {
  "id": "blowout",
  "topic": "emergency",
  "title": "爆胎停妥後，別站車旁等",
  "prompt": "國道爆胎後已安全停妥，所有人也已退避到安全處所。下一步？（本題不模擬爆胎瞬間操控。）",
  "options": [
   "在安全處撥 110 或使用高速公路1968 App 警政報案，說明位置並求援",
   "回車道旁換胎，讓同行者站車後擋車",
   "只叫拖吊，留在車道上拍照"
  ],
  "answer": 0,
  "why": "故障也須報案。先確保人員安全，不在高速車流旁自行作業或逗留。報案時提供方向、里程／定位與狀況；本題不取代實車緊急操控訓練。",
  "source": "freeway",
  "art": "hazard"
 },
 {
  "id": "fire",
  "topic": "emergency",
  "title": "引擎室冒煙起火",
  "prompt": "車輛疑似起火，可以安全停靠。",
  "options": [
   "安全停車熄火、全員離車遠離車流，安全處打119；不回車取物、不掀疑似起火的引擎蓋",
   "掀開引擎蓋讓火透氣",
   "先留車內拍完影片"
  ],
  "answer": 0,
  "why": "疑似火災先保人命，不自行冒險滅火；開引擎蓋可能供氧使火勢變大。處置參考 USFA；台灣火災／救護求援用 119，不是美國的 911。",
  "source": "fire",
  "art": "fire"
 },
 {
  "id": "injury",
  "topic": "emergency",
  "title": "事故有人受傷",
  "prompt": "國道事故已先退避安全處所，有人受傷。",
  "options": [
   "在安全處報110，並撥119求救護，說明位置、傷者與危險；依專業指示",
   "讓傷者留在高速車流旁等拍照",
   "認為有保險就不用求援"
  ],
  "answer": 0,
  "why": "先避開持續危險，再報警與求救護；不要為保留現場犧牲人員安全。不要任意搬動傷者，除非有立即危險，並依救援人員指示。",
  "source": "freeway",
  "art": "hazard"
 },
 {
  "id": "smoothstart",
  "topic": "pedal",
  "title": "右腳不是開關①｜平順起步",
  "prompt": "確認可安全起步後，如何控制動力？",
  "options": [
   "漸進、平順地增加，隨路況調整，不急踩衝出",
   "一下踩到底再說",
   "用同一踏板深度套用所有車"
  ],
  "answer": 0,
  "why": "平順不是追求某個油門百分比。不同車款、檔位、坡度與電動車模式反應不同；本頁踏板只是觀念展示，不是實車教練。",
  "source": "speed",
  "art": "pedal"
 },
 {
  "id": "lift",
  "topic": "pedal",
  "title": "右腳不是開關②｜行穿線前",
  "prompt": "接近行穿線，有行人可能穿越。",
  "options": [
   "提早收油減速、準備煞車；行人穿越時停讓",
   "用油門維持原速，貼近再說",
   "只收油，無論情況都不能用煞車"
  ],
  "answer": 0,
  "why": "提早減速可增加反應餘裕；收油不等於一定會停車，更不能代替行人穿越時的停讓。實車減速反應依車款／模式。",
  "source": "ped",
  "art": "crossing"
 },
 {
  "id": "parking",
  "topic": "pedal",
  "title": "右腳不是開關③｜低速停車",
  "prompt": "狹小車位前，需要非常慢地移動。",
  "options": [
   "先觀察並保持可立即煞停，依車款低速特性細緻控制；不確定就停車重新確認",
   "大補油讓車一次進去",
   "所有自排／電動車一律完全同樣操作"
  ],
  "answer": 0,
  "why": "低速停車優先可控、可停。怠速蠕行、Auto Hold、單踏板等差異很大，不以遊戲教一套通用踏板口訣；應依實車手冊與合格教練練習。",
  "source": "speed",
  "art": "pedal"
 },
 {
  "id": "followpedal",
  "topic": "pedal",
  "title": "右腳不是開關④｜跟車不用抽籤",
  "prompt": "前車速度有小幅變化，你應怎麼做？",
  "options": [
   "保持足夠間距、看遠，提早細緻調整；需要時平順煞車",
   "反覆猛踩油門再急煞貼回去",
   "盯著前車保險桿就好"
  ],
  "answer": 0,
  "why": "間距與預判讓速度調整更平順，不為搶回空間忽快忽慢。這是安全建議，不是固定油門刻度或跟車距離公式。",
  "source": "speed",
  "art": "pedal"
 }
];
function shuffled(items,rng=Math.random){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function queue(mode='short',rng=Math.random){if(mode==='all')return shuffled(questions,rng);if(Object.hasOwn(topics,mode))return shuffled(questions.filter(q=>q.topic===mode),rng);if(mode!=='short')throw new Error('Unknown mode');return shuffled(Object.keys(topics).flatMap(t=>shuffled(questions.filter(q=>q.topic===t),rng).slice(0,2)),rng);}
function correct(q,value){if(value==='unsure')return false;if(q.kind==='speed')return typeof value==='number'&&value===q.limit;if(q.kind==='lights')return q.accepted.includes(value);if(q.kind==='order')return Array.isArray(value)&&value.length===3&&value.every((v,i)=>v===i);return Number.isInteger(value)&&value===q.answer;}
function create(mode='short',rng=Math.random){return {items:queue(mode,rng),index:0,answers:[],locked:false};}
function submit(s,value){if(s.locked||s.index>=s.items.length)return null;const q=s.items[s.index];const a={id:q.id,value:Array.isArray(value)?[...value]:value,ok:correct(q,value)};s.answers.push(a);s.locked=true;return a;}
function next(s){if(!s.locked)return false;s.index++;s.locked=false;return true;}
return {topics,sources,questions,shuffled,queue,correct,create,submit,next};});
