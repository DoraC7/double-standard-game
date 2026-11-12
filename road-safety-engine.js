(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RoadSchool=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{'use strict';
const topics={"speed": "速限與減速", "fluids": "五油三水", "lights": "遠光燈與霧燈", "road": "號誌與迴轉", "tires": "胎壓小教室", "emergency": "緊急事件", "pedal": "右腳不是開關"};
const sources={"speed": ["道路交通安全規則 §93", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=93"], "lights": ["道路交通安全規則 §109", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=109"], "cross": ["道路交通安全規則 §102", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=102"], "ped": ["道路交通安全規則 §103", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=103"], "uturn": ["道路交通安全規則 §106", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno=106"], "flash": ["道路交通標誌標線號誌設置規則 §211", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040014&flno=211"], "signal": ["道路交通標誌標線號誌設置規則 §206", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040014&flno=206"], "signs": ["道路交通標誌標線號誌設置規則", "https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040014"], "oil": ["Toyota：定期保養項目（實車依手冊）", "https://www.toyota.com.tw/owner_maintenance.aspx"], "cool": ["Mazda 車主手冊：冷卻液與高溫警告", "https://owners-manual.mazda.com/gen/en/cx-5/cx-5_8ft1ee17b/contents/07030501.html"], "tire": ["Mazda 車主手冊：冷胎胎壓", "https://owners-manual.mazda.com/gen/en/cx-5/cx-5_8ft1ee17b/contents/07031401.html"], "freeway": ["交通部168：國道事故先退避再報案（115/10/21）", "https://168.motc.gov.tw/theme/news/post/2610210953097"], "fire": ["US Fire Administration：車輛火災（處置原則；求救號碼採台灣119）", "https://www.usfa.fema.gov/prevention/vehicle-fires/"]};
Object.assign(topics,{priority:'路權與匯流',parkinglaw:'停車與開門',lanelaw:'車道與超車'});
for(const [key,n] of Object.entries({followingLaw:94,laneLaw:98,passingLaw:101,temporaryLaw:111,parkingLaw:112}))sources[key]=['道路交通安全規則 §'+n,'https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040013&flno='+n];
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
 },
{"id": "speed-extra-1", "topic": "speed", "title": "限速與能見度分開看", "prompt": "速限50，但只能看清前方很短路段。哪個判斷正確？", "options": ["依視距與路況減速，必要時安全停止行駛", "開50就已盡全部義務", "跟緊前車就能提高視距"], "answer": 0, "why": "速限只規範上限，不保證該速度在雨霧中安全。", "source": "speed", "difficulty": "medium"},
{"id": "speed-extra-2", "topic": "speed", "title": "同一速度，不同餘裕", "prompt": "同一路段由乾燥變成積水，速限牌沒變。", "options": ["降低速度並增加安全餘裕", "牌沒變就不調整", "先加速試抓地力"], "answer": 0, "why": "濕滑與視線變化需要調整，不靠試探極限判斷安全。", "source": "speed", "difficulty": "medium"},
{"id": "speed-extra-3", "topic": "speed", "title": "趕路不能借速限", "prompt": "前方速限40，朋友說超車幾秒到60不算。", "options": ["超車也不因此免除速限", "只超過幾秒就合法", "亮方向燈即可超速"], "answer": 0, "why": "超車不是速限例外；無安全條件就不超車。", "source": "speed", "difficulty": "medium"},
{"id": "speed-extra-4", "topic": "speed", "title": "距離的直覺陷阱", "prompt": "只作數學比較：速度由30變60 km/h，反應時間相同，煞車尚未開始前行進距離如何變？", "options": ["變為2倍", "不變", "變為4倍"], "answer": 0, "why": "反應階段距離＝速度×時間，所以2倍；不是總停車距離或通用安全距離公式。", "source": "speed", "difficulty": "hard"},
{"id": "fluids-extra-1", "topic": "fluids", "title": "機油不只看黏度", "prompt": "兩瓶機油黏度相同，但其中一瓶不符合本車手冊要求認證。", "options": ["仍核對全部規格，不能只看黏度", "黏度相同一定互換", "混合後認證自然符合"], "answer": 0, "why": "黏度不是唯一規格，認證、引擎要求與保養方式仍依實車手冊。", "source": "oil", "difficulty": "medium"},
{"id": "fluids-extra-2", "topic": "fluids", "title": "冷卻液顏色能當規格嗎？", "prompt": "兩款冷卻液同為綠色，規格卻不明。", "options": ["先核對手冊與相容性，不憑顏色混加", "同色就一定相容", "加雨刷水調整顏色"], "answer": 0, "why": "顏色不是跨廠牌通用規格；高溫時也不可開啟壓力蓋。", "source": "cool", "difficulty": "medium"},
{"id": "fluids-extra-3", "topic": "fluids", "title": "電動車不是免保養", "prompt": "純電車沒有引擎機油，能否推論煞車液與輪胎都不用檢查？", "options": ["不能，仍依車款維護要求檢查", "可以，所有油水都消失", "只要電量夠就不用保養"], "answer": 0, "why": "沒有燃油引擎不代表沒有其他需維護系統，項目與週期依該車手冊。", "source": "oil", "difficulty": "medium"},
{"id": "fluids-extra-4", "topic": "fluids", "title": "保養的先到者", "prompt": "本題虛構手冊指定每10000公里或12個月保養，以先到者為準。距上次13個月但只跑4000公里。", "options": ["已到時間條件，依手冊安排保養", "等到10000公里才算", "兩個數字平均後判斷"], "answer": 0, "why": "以先到者為準，時間已超過12個月；不是所有車款的統一週期。", "source": "oil", "difficulty": "hard"},
{"id": "lights-extra-1", "topic": "lights", "title": "白天隧道與日行燈", "prompt": "進隧道時只亮日行燈，未確認頭燈。", "options": ["依規定開頭燈，不假設日行燈已代替", "日行燈一定包含所有必要車燈", "開遠光即可免看前車"], "answer": 0, "why": "日行燈不等於頭燈已開啟，也可能不連動尾燈；依實車操作確認。", "source": "lights", "difficulty": "medium"},
{"id": "lights-extra-2", "topic": "lights", "title": "自動頭燈不一定懂霧", "prompt": "白天濃霧，AUTO未點亮頭燈。", "options": ["手動確認近光燈，依天候與法規使用霧燈", "相信AUTO就不需確認", "改用遠光穿透濃霧"], "answer": 0, "why": "AUTO常依環境光線，未必偵測霧；駕駛仍需確認燈光與能見度。", "source": "lights", "difficulty": "medium"},
{"id": "lights-extra-3", "topic": "lights", "title": "出霧區要重新判斷", "prompt": "剛駛出濃霧，天候恢復晴朗，霧燈仍亮著。", "options": ["關閉霧燈，頭燈依當時條件使用", "霧燈一直開比較安全", "關閉所有燈不看路段"], "answer": 0, "why": "霧燈只在適用情況使用，離開霧等條件應關閉；頭燈另看時間路段。", "source": "lights", "difficulty": "medium"},
{"id": "lights-extra-4", "topic": "lights", "title": "兩個條件同時出現", "prompt": "夜間無照明原本開遠光，現在距前車60公尺，對向也有車。", "options": ["切近光，不以道路暗為由維持遠光", "維持遠光直到超過前車", "只關霧燈即可"], "answer": 0, "why": "無照明條件不取消會車與近距離跟車須使用近光的要求。", "source": "lights", "difficulty": "hard"},
{"id": "road-extra-1", "topic": "road", "title": "綠燈不是清空路口的保證", "prompt": "綠燈但出口塞住，進入後會卡在行穿線上。", "options": ["留在路口外等有空間再通過", "綠燈一定要往前", "先停在行穿線等"], "answer": 0, "why": "號誌允許通行不代表可阻塞路口或行人通道。", "source": "cross", "difficulty": "medium"},
{"id": "road-extra-2", "topic": "road", "title": "閃黃還是要讓", "prompt": "閃黃路口前方有行人正在行穿線通行。", "options": ["減速並停讓行人，不拿閃黃當優先權", "閃黃可以不看行人", "按喇叭請行人後退"], "answer": 0, "why": "閃黃是警告注意，不免除行人停讓義務。", "source": "ped", "difficulty": "medium"},
{"id": "road-extra-3", "topic": "road", "title": "禁止左轉與迴轉", "prompt": "路口有禁止左轉標誌，沒有另外放禁止迴轉牌。", "options": ["仍不得在此迴轉", "沒禁止迴轉牌就一律可迴轉", "道路夠寬就能迴轉"], "answer": 0, "why": "依§106，禁止左轉路段亦不得迴轉，不只看單一標誌。", "source": "uturn", "difficulty": "medium"},
{"id": "road-extra-4", "topic": "road", "title": "交通指揮優先", "prompt": "綠燈時警察示意停車，後車卻按喇叭。", "options": ["依警察指揮停車", "依綠燈前進", "聽後車催促前進"], "answer": 0, "why": "交通指揮與燈號不同時依指揮人員指示，不由後車催促決定。", "source": "cross", "difficulty": "hard"},
{"id": "tires-extra-1", "topic": "tires", "title": "前後不一定同壓", "prompt": "本題虛構車門標籤：冷胎前33、後35 psi；目前前後都33。", "options": ["依此標籤將後胎調整至35，前胎33", "四胎一律35", "照胎壁最大值全部充滿"], "answer": 0, "why": "前後要求可能不同；本題數字不是通用胎壓，依實車載重條件。", "source": "tire", "difficulty": "medium"},
{"id": "tires-extra-2", "topic": "tires", "title": "警示消失不是維修證明", "prompt": "胎壓燈重設後熄滅，但沒有量胎壓或檢查輪胎。", "options": ["仍應量測並檢查原因", "熄燈證明沒有漏氣", "一直重設就能修補輪胎"], "answer": 0, "why": "重設不是量測也不是修補，需按手冊確認冷胎壓與輪胎狀況。", "source": "tire", "difficulty": "medium"},
{"id": "tires-extra-3", "topic": "tires", "title": "載重變了看哪裡", "prompt": "準備滿載出遊，標籤分一般與滿載兩列，數值不同。", "options": ["依實際載重與手冊選適用冷胎壓", "沿用任何熟悉的數字", "以胎壁最大值代替兩列"], "answer": 0, "why": "適用壓力取決於車款與條件，不能把一般載重或胎壁上限當全情境答案。", "source": "tire", "difficulty": "medium"},
{"id": "tires-extra-4", "topic": "tires", "title": "單位不一樣先換算", "prompt": "本題給定1 bar約14.5 psi，標籤2.2 bar；儀表只顯示psi。最接近多少？", "options": ["32 psi", "22 psi", "45 psi"], "answer": 0, "why": "2.2×14.5＝31.9，約32 psi；此為題目換算，不是所有車適用胎壓。", "source": "tire", "difficulty": "hard"},
{"id": "emergency-extra-1", "topic": "emergency", "title": "先找人還是拿行李", "prompt": "國道故障已在可安全撤離位置停妥，行李留車內。", "options": ["先確保人員安全退避，不為行李停留車旁", "搬完行李再退避", "站車尾等救援"], "answer": 0, "why": "故障車周邊仍有二次撞擊風險，先退避再報案，不為財物暴露。", "source": "freeway", "difficulty": "medium"},
{"id": "emergency-extra-2", "topic": "emergency", "title": "冒火不靠開蓋確認", "prompt": "引擎室已冒火，想掀引擎蓋看範圍。", "options": ["不掀蓋，安全離車遠離並打119", "開蓋讓火散熱", "回車拿水慢慢處理"], "answer": 0, "why": "開蓋可能助長火勢；不回車取物，告知消防位置並遠離車流與火源。", "source": "fire", "difficulty": "medium"},
{"id": "emergency-extra-3", "topic": "emergency", "title": "急救電話說清楚", "prompt": "國道事故有人受傷，已在安全位置通報119。哪種資訊最有用？", "options": ["道路方向、里程或可辨識位置、傷者及危險狀況", "只說車子品牌就掛斷", "只傳遊戲分數"], "answer": 0, "why": "位置、方向、里程與現場危害協助派遣；照接線人員指示，不為找標誌走入車道。", "source": "freeway", "difficulty": "medium"},
{"id": "emergency-extra-4", "topic": "emergency", "title": "能放警示物不等於要冒險", "prompt": "車停國道旁，但要放警示物必須穿越高速車流。", "options": ["不冒險穿越，優先安全退避並報案", "規定有警示就一定要穿越", "請乘客站車道揮手替代"], "answer": 0, "why": "警示處理須在可安全執行前提下，不把流程變成暴露於車流的理由。", "source": "freeway", "difficulty": "hard"},
{"id": "pedal-extra-1", "topic": "pedal", "title": "跟車輔助不是自駕", "prompt": "開啟跟車輔助後接近行穿線，有行人準備通行。", "options": ["持續觀察並準備自行減速停讓", "雙腳放鬆不再注意路況", "認為系統必定辨識所有人"], "answer": 0, "why": "駕駛輔助有偵測與操作限制，不能免除駕駛的注意與停讓責任。", "source": "ped", "difficulty": "medium"},
{"id": "pedal-extra-2", "topic": "pedal", "title": "下坡不靠反覆補油", "prompt": "下坡車速逐漸增加，前方彎道。", "options": ["提早控制速度，依手冊使用適當檔位與煞車", "持續補油到彎中才急煞", "排空檔讓車滑更快"], "answer": 0, "why": "提早控制速度並保留餘裕，不排空檔滑行；實際檔位與操作依車輛手冊。", "source": "speed", "difficulty": "medium"},
{"id": "pedal-extra-3", "topic": "pedal", "title": "倒車時看不到就停", "prompt": "倒車時後方有遮蔽，看不到兒童可能出現的位置。", "options": ["先停妥，確認周遭安全再移動", "慢慢踩油門就不會撞", "只看一個後視鏡即可"], "answer": 0, "why": "低速也可能造成嚴重傷害；不要把車速慢當成視野足夠。", "source": "speed", "difficulty": "medium"},
{"id": "pedal-extra-4", "topic": "pedal", "title": "平順不是禁止煞車", "prompt": "原本平順跟車，前方突然有障礙需要停下。", "options": ["依危險程度立即採取必要減速與停車", "為了平順而延後煞車", "先加速換道再看盲區"], "answer": 0, "why": "平順是預判與適當控制，不是遇到急迫危險仍拒絕必要制動；遊戲不代替實車訓練。", "source": "speed", "difficulty": "hard"},
{"id": "law-right", "topic": "priority", "title": "同級路口，誰先走？", "prompt": "無號誌、無人指揮，未分幹支道，兩車進入路口的車道數相同，也非壅塞。本車 A 向上直行，右方 B 向左直行，兩車接近路口。請放行應先行的車。", "options": ["B 先行，A 暫停讓 B", "A 先行，B 等候", "兩車同時搶進"], "answer": 0, "why": "同級、同車道數且同為直行時，左方車應暫停讓右方車。右方是從駕駛座行進方向判斷，不是車頭大小。", "source": "cross", "difficulty": "easy", "art": "road", "scene": {"type": "junction", "labels": ["本車 A", "右方 B"], "winner": "b"}},
{"id": "law-main", "topic": "priority", "title": "幹支道先於左右方", "prompt": "無號誌、無人指揮且非壅塞。本車 A 在幹線直行；右方 B 的入口設讓路標誌，為支線。請放行應先行的車。", "options": ["A 先行，B 暫停讓 A", "B 在右方所以永遠先行", "誰快誰先"], "answer": 0, "why": "有幹支道劃分先依幹支道規則，支線道車應暫停讓幹線道車。不能跳過前提直接套右方優先。", "source": "cross", "difficulty": "hard", "art": "road", "scene": {"type": "junction", "labels": ["本車 A", "右方 B"], "winner": "a"}},
{"id": "law-lanes", "topic": "priority", "title": "車道數不是比車寬", "prompt": "無號誌、無指揮、未分幹支且非壅塞。本車 A 入口有一車道，右方 B 入口有二車道，兩車直行。", "options": ["B 多線道先行，A 暫停讓 B", "A 車身大先行", "車道數不影響"], "answer": 0, "why": "未分幹支時少線道車暫停讓多線道車。車道數依進入交岔路口的車道計算，不是道路目測寬度。", "source": "cross", "difficulty": "medium", "art": "road", "scene": {"type": "junction", "labels": ["本車 A", "右方 B"], "winner": "b"}},
{"id": "law-turn", "topic": "priority", "title": "右方也不一定先走", "prompt": "無號誌、無指揮、未分幹支、入口車道數相同且非壅塞。本車 A 直行；右方 B 轉彎，路徑衝突。", "options": ["A 直行先行，B 暫停讓 A", "B 在右方所以不必讓", "A 先按喇叭才有路權"], "answer": 0, "why": "在這組前提下先判斷轉彎讓直行，再於同為直行或轉彎時適用左讓右；不可把右方優先當無條件規則。", "source": "cross", "difficulty": "hard", "art": "road", "scene": {"type": "junction", "labels": ["本車 A", "右方 B"], "winner": "a"}},
{"id": "law-zip", "topic": "priority", "title": "塞車匯流，一車換一車", "prompt": "同向二車道縮為一車道，目前交通壅塞，兩列都在排隊，安全距離足夠。", "options": ["內外側互讓，逐車交互輪流", "內側整列通過才輪外側", "外側必須一直等到沒車"], "answer": 0, "why": "壅塞時內外側應互為禮讓、逐車交互輪流行駛，並保持安全距離及間隔。此處不同於非壅塞的一般匯流順序。", "source": "laneLaw", "difficulty": "easy", "art": "road"},
{"id": "law-merge", "topic": "priority", "title": "非壅塞，車道還連著", "prompt": "同向二車道縮一，非壅塞；A 所在車道持續直行，B 車道在前方終止。", "options": ["B 讓直行車道的 A 先行", "一律 B 先行", "一律左右各一台，不分情況"], "answer": 0, "why": "非壅塞時應讓直行車道車輛先行；無直行車道才適用外讓內。壅塞有交互輪流例外，不能混用。", "source": "laneLaw", "difficulty": "medium", "art": "road"},
{"id": "law-circle", "topic": "priority", "title": "圓環不是入口車先搶", "prompt": "無號誌的圓環路口，A 尚未進圓環，B 已在圓環內行駛。", "options": ["A 讓已在圓環內的 B 先行", "A 入場所以先行", "B 必須停在圓環讓 A"], "answer": 0, "why": "無號誌圓環路口應讓已進入圓環車道的車輛先行；多車道圓環另有內側車優先規定，仍須安全觀察。", "source": "cross", "difficulty": "medium", "art": "road"},
{"id": "law-opposite", "topic": "priority", "title": "對向左右轉，進同一車道", "prompt": "本車與對向車都已轉彎，正要進入同一車道；本車右轉，對向車左轉。", "options": ["本車右轉讓對向左轉車先行", "左轉一律最後，所以本車先", "互相加速卡位"], "answer": 0, "why": "§102第1項第8款有特定規則：對向左右轉已轉彎要進同一車道時，右轉讓左轉；若進入二以上車道，則右轉進外側、左轉進內側。", "source": "cross", "difficulty": "hard", "art": "road"},
{"id": "law-hydrant", "topic": "parkinglaw", "title": "消防栓旁，只停一下？", "prompt": "想在消防栓二公尺內臨時停車等人，無特殊交通指揮。", "options": ["不可以，消防栓五公尺內不得臨停", "開警示燈就可以", "人在車上就可以"], "answer": 0, "why": "消防栓五公尺內不得臨時停車。警示燈、駕駛留車內都不會解除禁令。", "source": "temporaryLaw", "difficulty": "easy", "art": "road", "scene": {"type": "parking"}},
{"id": "law-bus", "topic": "parkinglaw", "title": "公車站不是接送灣", "prompt": "這是路邊公車招呼站，想在站牌五公尺內臨時停車。", "options": ["不可以，招呼站十公尺內不得臨停", "沒公車就可以", "只停兩分鐘就可以"], "answer": 0, "why": "§111規定公共汽車招呼站十公尺內不得臨時停車，不以是否看到公車為條件。", "source": "temporaryLaw", "difficulty": "medium", "art": "road", "scene": {"type": "parking"}},
{"id": "law-double", "topic": "parkinglaw", "title": "併排接人也算", "prompt": "路邊已有停放車輛，本車想併排臨時停車等乘客。", "options": ["不可併排臨時停車", "打方向燈就能停", "後方有空間就合法"], "answer": 0, "why": "不得併排臨時停車；一般停車也不得併排，不能靠短時間或人在車上規避。", "source": "temporaryLaw", "difficulty": "easy", "art": "road", "scene": {"type": "parking"}},
{"id": "law-crosswalk", "topic": "parkinglaw", "title": "行穿線上，不是等候區", "prompt": "要選接送位置。三個位置都沒有另外開放停車的指揮，只有一處是准停空車位。", "options": ["使用前方合法准停空車位，不占行穿線", "在行人穿越道上臨停", "在人行道上臨停"], "answer": 0, "why": "人行道、行人穿越道均不得臨時停車。圖示格位僅是假想合法空車位；現場仍要核對時段、車種、標誌與標線。", "source": "temporaryLaw", "difficulty": "medium", "art": "road", "scene": {"type": "parking"}},
{"id": "law-accessible", "topic": "parkinglaw", "title": "空著，不代表你能停", "prompt": "自用一般小客車不具身心障礙者用車資格，眼前專用格空著。", "options": ["不占用，另找符合資格的合法車位", "空著就能停", "只留電話就可停"], "answer": 0, "why": "設有身心障礙者專用停車標誌處所，非身心障礙者用車不得停放。是否有人等待不是許可條件。", "source": "parkingLaw", "difficulty": "medium", "art": "road", "scene": {"type": "parking"}},
{"id": "law-distance", "topic": "parkinglaw", "title": "臨停與停車距路緣不同", "prompt": "一般小客車在准許路邊停車處所停車，非臨時停車。輪胎外側距緣石上限？", "options": ["四十公分", "六十公分", "一公尺"], "answer": 0, "why": "§112的一般汽車路邊停車為四十公分；§111一般汽車臨停為六十公分。不要把臨停數值用到停車。", "source": "parkingLaw", "difficulty": "hard", "art": "road"},
{"id": "law-door", "topic": "parkinglaw", "title": "車停好，車門先別推", "prompt": "本車已停妥，後方有自行車接近車門旁。下一步？", "options": ["先不開門，注意並讓自行車先行", "開一條縫逼車避開", "停車格內不用看後方"], "answer": 0, "why": "駕駛與乘客開關車門都應注意行人、其他車輛並讓其先行；確認安全後再開到可供出入幅度，迅速下車並關門。", "source": "parkingLaw", "difficulty": "medium", "art": "road"},
{"id": "law-leftdoor", "topic": "parkinglaw", "title": "左側停車的下車例外", "prompt": "單行道准許左側停車，本車已合法停在左側；乘客準備下車。", "options": ["依此例外由左側開門，仍須觀察停讓確認安全", "任何情況都只能右側", "在單行道不用觀察就可開門"], "answer": 0, "why": "乘客原則由右側開門，但單行道准許左側停車者應由左側開門；觀察、禮讓及安全開門義務仍在。", "source": "parkingLaw", "difficulty": "hard", "art": "road"},
{"id": "law-change", "topic": "lanelaw", "title": "打燈不是插隊許可", "prompt": "想變換車道，旁邊車道有車直行，空隙不足。", "options": ["先讓直行車，等安全距離再換道", "打燈三秒後就有優先權", "慢慢擠過去就好"], "answer": 0, "why": "變換車道應讓直行車先行並注意安全距離；打方向燈不會自動取得路權。", "source": "laneLaw", "difficulty": "easy", "art": "road"},
{"id": "law-turnlane", "topic": "lanelaw", "title": "轉彎專用道，不能拿來直行", "prompt": "同向有二車道以上，路口明設右轉專用車道，本車要直行。", "options": ["走准許直行車道，不占右轉專用道", "沒右轉車時可直行", "排隊太長就改走右轉道直行"], "answer": 0, "why": "§98規定設左右轉專用道的路口，直行車不得占用轉彎專用車道；不能因方便就忽略車道用途。", "source": "laneLaw", "difficulty": "medium", "art": "road"},
{"id": "law-straddle", "topic": "lanelaw", "title": "兩條車道都想要？", "prompt": "一般行駛，並非準備停車或臨時停車。本車想長時間騎跨兩條車道。", "options": ["不得跨越兩條車道行駛", "沒車時可以一直跨著", "大車才不能，小車可以"], "answer": 0, "why": "§98限制跨越兩條車道或駛出路面邊線行駛，條文有準備停車／臨時停車例外；本題明確排除例外。", "source": "laneLaw", "difficulty": "medium", "art": "road"},
{"id": "law-tailgate", "topic": "lanelaw", "title": "貼車催促，不會生出路權", "prompt": "前車速度較慢，你想迫近前車使其讓道。", "options": ["保持隨時能煞停距離，不逼迫讓道", "貼近再連續閃燈", "按住喇叭逼退前車"], "answer": 0, "why": "§94要求保持可隨時煞停距離，不得任意以迫近等方式迫使前車讓道。安全距離不是固定一個車身適用所有狀況。", "source": "followingLaw", "difficulty": "easy", "art": "road"},
{"id": "law-schoolpass", "topic": "lanelaw", "title": "學校標誌前，超車暫停", "prompt": "前方設有學校標誌，想超越同車道前車。", "options": ["不得在此處超車", "上課時間以外一定可超", "前車慢就例外可超"], "answer": 0, "why": "§101禁止在設有學校、醫院標誌等處所超車；不能自行加上放學後或前車慢的例外。", "source": "passingLaw", "difficulty": "medium", "art": "road"},
{"id": "law-works", "topic": "lanelaw", "title": "施工地段，不拚超車", "prompt": "正在道路施工地段，前車慢行；本車擬超車。", "options": ["不在施工地段超車", "工人沒揮手就可超", "只要小客車就可超"], "answer": 0, "why": "§101列道路施工地段等不得超車；應依現場交通管制與路況通行，不把車慢當作超車許可。", "source": "passingLaw", "difficulty": "medium", "art": "road"},
{"id": "law-siren", "topic": "lanelaw", "title": "救護車不是前導車", "prompt": "執行緊急任務的救護車鳴警號通過後，你想跟著快速穿越車流。", "options": ["避讓，不在後跟隨急駛", "可貼著救護車趕時間", "與救護車併排就好"], "answer": 0, "why": "聞執行緊急任務車輛警號應立即避讓，不得在後跟隨急駛、併駛或超越；不是可借用的快速通道。", "source": "passingLaw", "difficulty": "hard", "art": "road"},
{"id": "law-clearlane", "topic": "lanelaw", "title": "非壅塞匯流，沒有直行車道", "prompt": "兩車道合成一車道，非壅塞，沒有任何一條是持續直行車道，無另設管制。", "options": ["外側車讓內側車先行", "一律右方先行", "外側較寬所以先行"], "answer": 0, "why": "§98同向二車道入一，先讓直行車道車輛；沒有直行車道時外側讓內側。壅塞才改為逐車交互輪流，不套路口左讓右。", "source": "laneLaw", "difficulty": "hard", "art": "road"}
];
for(const q of questions)q.difficulty ??= "easy";
function shuffled(items,rng=Math.random){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function queue(mode='short',rng=Math.random){if(mode==='all')return shuffled(questions,rng);if(Object.hasOwn(topics,mode))return shuffled(questions.filter(q=>q.topic===mode),rng);if(mode!=='short')throw new Error('Unknown mode');return shuffled(Object.keys(topics).flatMap(t=>['easy','challenge'].map(level=>shuffled(questions.filter(q=>q.topic===t&&(level==='easy'?q.difficulty==='easy':q.difficulty!=='easy')),rng)[0])),rng);}
function correct(q,value){if(value==='unsure')return false;if(q.kind==='speed')return typeof value==='number'&&value===q.limit;if(q.kind==='lights')return q.accepted.includes(value);if(q.kind==='order')return Array.isArray(value)&&value.length===3&&value.every((v,i)=>v===i);return Number.isInteger(value)&&value===q.answer;}
function create(mode='short',rng=Math.random){return {items:queue(mode,rng),index:0,answers:[],locked:false};}
function submit(s,value){if(s.locked||s.index>=s.items.length)return null;const q=s.items[s.index];const a={id:q.id,value:Array.isArray(value)?[...value]:value,ok:correct(q,value)};s.answers.push(a);s.locked=true;return a;}
function next(s){if(!s.locked)return false;s.index++;s.locked=false;return true;}
return {topics,sources,questions,shuffled,queue,correct,create,submit,next};});
