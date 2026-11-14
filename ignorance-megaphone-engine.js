(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.IgnoranceMegaphone=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{'use strict';
const cases=[
  {
    "id": "frame-1",
    "topic": "frame",
    "title": "空椅子的全景",
    "source": "卡通活動全景：右半邊椅子沒人，左半邊清楚看見3位參加者。有人只截了右半邊。",
    "options": [
      "這場活動完全沒人來",
      "右半邊座位空著，但全景左側有3人",
      "主辦方已經取消活動"
    ],
    "answer": 1,
    "why": "完整畫面足以確認有人參加；右側沒人不能變成全場沒人，也沒有活動取消的資料。"
  },
  {
    "id": "frame-2",
    "topic": "frame",
    "title": "舊照片的新標題",
    "source": "圖片上寫「休店」，照片拍攝日期是昨天。沒有今天的公告或現場資料。",
    "options": [
      "這間店今天也一定休店",
      "這間店永久停業",
      "照片顯示昨天休店，今天是否營業仍待確認"
    ],
    "answer": 2,
    "why": "資料有日期界線。昨天休店不等於今天休店，更不支持永久停業；這裡保留不確定性有具體理由。"
  },
  {
    "id": "frame-3",
    "topic": "frame",
    "title": "把原話講完整",
    "source": "卡通工程師原話：「這次只測了A款的舊電池，電力不足；沒有測B款或新電池。」",
    "options": [
      "這次測到A款舊電池電力不足，其他情況未測",
      "所有品牌的新電池都不行",
      "工程師說任何電池都不能用"
    ],
    "answer": 0,
    "why": "報告範圍只包含這次測試的A款舊電池。擴大到所有品牌或新電池，都是原話沒有說的內容。"
  },
  {
    "id": "frame-4",
    "topic": "frame",
    "title": "沒收到不等於沒做",
    "source": "原約定6人交模型。收件紀錄目前有2份，其餘4份尚未收到；未查詢他們的製作狀態。",
    "options": [
      "其餘4人完全沒動手",
      "目前收到2份，另4份未收到，製作狀態未知",
      "6人都完成交件了"
    ],
    "answer": 1,
    "why": "收件紀錄能證明收到哪些，不能直接判斷未收到的人是否有製作，也不能把開始當成已交件。"
  },
  {
    "id": "cause-1",
    "topic": "cause",
    "title": "雨傘把地面變濕？",
    "source": "觀察紀錄：下雨那天，街上雨傘多，地面也濕。沒有比較無雨但有雨傘的情況。",
    "options": [
      "雨傘一多就會讓整條街下雨",
      "雨傘和濕地面毫無可能相關",
      "紀錄顯示兩者一起出現，但不足以證明雨傘造成地面濕"
    ],
    "answer": 2,
    "why": "同時出現不等於因果。降雨可能同時影響撐傘與地面潮濕；現有紀錄沒有隔離這些因素。"
  },
  {
    "id": "cause-2",
    "topic": "cause",
    "title": "重開機的同一分鐘",
    "source": "卡通路由器重開機後網路恢復；同一分鐘，供應商也公告線路修復。沒有其他對照紀錄。",
    "options": [
      "網路恢復了，但還不能只歸功於重開機",
      "所有網路問題都能靠重開機修好",
      "供應商的修復一定完全沒影響"
    ],
    "answer": 0,
    "why": "兩件事同時發生，無法只用這次結果分開各自影響。可以確認恢復，但不能指定唯一功臣或推廣到所有問題。"
  },
  {
    "id": "cause-3",
    "topic": "cause",
    "title": "風扇測試的界線",
    "source": "虛構對照測試：同種紙、同樣水量與室內條件，只改變有無開風扇；這次開風扇組較早乾。未測其他材質。",
    "options": [
      "任何材質開任何風扇都一定更快乾",
      "這次指定條件下，開風扇組較早乾；其他條件未測",
      "完全不能說這次哪組較早乾"
    ],
    "answer": 1,
    "why": "這次比較有明確結果，可以直接說指定條件下哪組較早乾；但沒有證據把結果擴大到其他材質與所有風扇。"
  },
  {
    "id": "cause-4",
    "topic": "cause",
    "title": "黑畫面恢復了",
    "source": "卡通螢幕的訊號線鬆脫。技術員插回這條線後畫面立即恢復；未檢查其他裝置。",
    "options": [
      "所有黑畫面都是同一條線造成的",
      "螢幕永久壞掉了",
      "這次插回訊號線後恢復，支持先前連線有問題"
    ],
    "answer": 2,
    "why": "實際檢查與恢復結果支持本次連線問題。這不是所有黑畫面的通用診斷，也不支持永久損壞。"
  },
  {
    "id": "numbers-1",
    "topic": "numbers",
    "title": "多10個是多10％？",
    "source": "虛構社團上週10人報名，本週20人報名。兩週統計口徑相同。",
    "options": [
      "本週多10人，增幅100％",
      "本週只增加10％",
      "本週比上週少一半"
    ],
    "answer": 0,
    "why": "增加人數是20−10＝10；增幅以原本10人為分母：10÷10＝100％。人數差和百分比不同。"
  },
  {
    "id": "numbers-2",
    "topic": "numbers",
    "title": "80％到底有幾個？",
    "source": "5台玩具接受同一項測試，其中4台通過。沒有測試其他玩具。",
    "options": [
      "整個工廠所有玩具的通過率一定80％",
      "這5台中有80台通過",
      "本次5台中4台通過，樣本通過率80％"
    ],
    "answer": 2,
    "why": "4÷5＝80％，這裡有明確分母。80％不是80台，也不能直接當成整個工廠所有產品的比例。"
  },
  {
    "id": "numbers-3",
    "topic": "numbers",
    "title": "平均不代表每個都一樣",
    "source": "三位卡通角色各有3、3、9顆球，三人合計15顆。",
    "options": [
      "每一位都剛好有5顆球",
      "平均每人5顆，但實際數量是3、3、9",
      "最多球的人只有3顆"
    ],
    "answer": 1,
    "why": "平均是15÷3＝5，但原始數量並沒有變。平均數描述整體，不表示每個人都等於平均。"
  },
  {
    "id": "numbers-4",
    "topic": "numbers",
    "title": "年繳標籤換算",
    "source": "虛構服務月繳99元，年繳1080元，均為12個月相同內容，無其他費用。此題不進行購買。",
    "options": [
      "年繳平均每月90元，比月繳每月少9元",
      "年繳每月只要9元",
      "年繳一定適合所有人"
    ],
    "answer": 0,
    "why": "1080÷12＝90，99−90＝9。價格比較可以算清楚，但適不適合仍與使用需求等其他條件有關。"
  }
];
cases.push(
 {id:'frame-5',topic:'frame',title:'裁切後的排隊照',source:'完整照片顯示隊伍轉彎延伸到畫面外；截圖只留下空出的入口。',options:['截圖裡入口空著，但全場是否有人要看完整照片','現場從頭到尾都沒有排隊','活動已取消'],answer:0,why:'裁切畫面不能代表全貌；完整影像已顯示隊伍延伸，不能把局部空位誇大成全場無人。'},
 {id:'frame-6',topic:'frame',title:'舊公告又被轉傳',source:'公告寫「週三停水」，發布日期是去年；轉傳文字稱「今天全區停水」。',options:['去年公告曾通知週三停水，今日狀況需查最新公告','今天全區一定停水','這個行政區永久沒有自來水'],answer:0,why:'日期和範圍都有限定；應核對主管單位最新公告，不能把舊資訊套到今天。'},
 {id:'frame-7',topic:'frame',title:'影片只拍到最後一秒',source:'短片只顯示球落地，沒有拍到此前的比賽過程或裁判判決。',options:['片段顯示球落地，是否出界仍需完整畫面或判決','球一定是被故意打出界','這場比賽已經結束'],answer:0,why:'片段只能支持畫面中可見的事；缺少前後脈絡不能推論動機或比賽結果。'},
 {id:'frame-8',topic:'frame',title:'照片中的空桌',source:'照片拍攝時餐廳有一桌空著，未提供其他桌況或時段。',options:['那一刻有一桌空著，餐廳整體客滿與否未知','整間店都沒人','這家店生意永遠很好'],answer:0,why:'單桌照片不能代表整間店或其他時段；結論範圍應與證據相同。'},
 {id:'frame-9',topic:'frame',title:'地圖上的紅點',source:'即時地圖截圖有一個路段紅色，沒有顯示更新時間或其他道路。',options:['截圖標示一段路況，仍需確認時間與替代路線','全市道路都塞車','紅色代表道路已封閉'],answer:0,why:'顏色的意義與更新時間需看圖例；一段道路不能代表全市。'},
 {id:'frame-10',topic:'frame',title:'只截到半句留言',source:'完整留言為「這次測試在舊版失敗，新版尚未測」；截圖只留下「測試失敗」。',options:['舊版測試失敗，新版結果未知','所有版本都失敗','新版已經通過'],answer:0,why:'剪掉版本限定會改變原意；新版尚未測試，不可說成功或失敗。'},
 {id:'frame-11',topic:'frame',title:'畫面沒拍到不等於不存在',source:'監視器鏡頭有盲區，物品在兩個時間點之間不見了。',options:['物品在兩次畫面間消失，但盲區內經過什麼未知','一定是某人偷走','物品從來沒有放在桌上'],answer:0,why:'監視器盲區造成資訊缺口；沒有拍到行為不代表已證明行為或動機。'},
 {id:'frame-12',topic:'frame',title:'一張笑臉不能代表整場',source:'合照中一位參加者在快門時微笑，沒有訪問其他人。',options:['這位參加者當時面帶微笑，整場感受未知','所有人都非常滿意','沒笑的人都不開心'],answer:0,why:'表情照片只呈現一個瞬間，不能取代每個人的完整感受或回饋。'},
 {id:'frame-13',topic:'frame',title:'儀表板的範圍',source:'儀表板顯示一個分店今天營收較低，未顯示其他分店或退貨資料。',options:['這家分店此欄位今天較低，原因及全公司狀況待查','公司所有分店都倒閉','一定是店員偷錢'],answer:0,why:'單一欄位不能交代原因或整體趨勢；需核對口徑、時間與完整資料。'},
 {id:'frame-14',topic:'frame',title:'截圖裡的百分比',source:'貼文宣稱「改善50%」，但截圖沒寫基準值、樣本數或比較期間。',options:['貼文聲稱50%，實際意義需看基準、樣本與期間','每個人都改善一半','這個百分比必定造假'],answer:0,why:'百分比缺少分母與比較方式時無法判讀；既不能直接照信，也不能僅憑截圖斷定造假。'},
 {id:'frame-15',topic:'frame',title:'照片日期和上傳日期不同',source:'照片檔案日期是三年前，今天才被上傳並配上「剛剛發生」。',options:['照片拍於三年前，不能當成今天現場證據','照片證明事件今天發生','上傳日期證明照片是偽造'],answer:0,why:'上傳時間不等於拍攝時間；舊照片可能真實但不支持今日事件。'},
 {id:'cause-5',topic:'cause',title:'冰淇淋與溺水',source:'夏天冰淇淋銷量和溺水事件都增加，沒有控制氣溫或游泳人數。',options:['共同的季節因素可能影響兩者，不能說冰淇淋造成溺水','一起增加就證明冰淇淋有害','溺水增加證明冰淇淋能救人'],answer:0,why:'氣溫與水域活動可能是共同因素；相關性不能直接證明因果。'},
 {id:'cause-6',topic:'cause',title:'運動後心跳較快',source:'一人運動後心跳較休息時快，但沒有其他測量或症狀資料。',options:['這次觀察到心跳較快；單憑它不能診斷疾病','運動必定造成心臟病','心跳較快代表身體更健康'],answer:0,why:'運動時心率上升可能是正常反應；個人症狀或異常需依醫療評估，不能由單筆比較診斷。'},
 {id:'cause-7',topic:'cause',title:'新招牌與客流',source:'店家換招牌後客人增加，同期也有大型活動在附近舉辦。',options:['活動可能影響客流，需比較相似日期與時段','客人增加證明招牌是唯一原因','活動一定完全無關'],answer:0,why:'多個條件同時改變，應用合適對照與時間資料區分可能原因。'},
 {id:'cause-8',topic:'cause',title:'手機和睡眠',source:'調查發現晚睡者較常用手機，但未記錄作息、工作與睡眠習慣。',options:['兩者相關，方向與其他因素仍需研究','手機是每個人晚睡的唯一原因','晚睡證明手機有益健康'],answer:0,why:'觀察性關聯無法單獨判定因果方向，也可能受其他因素影響。'},
 {id:'cause-9',topic:'cause',title:'肥料與植物高度',source:'施肥組較高，但兩組日照與澆水量不同。',options:['目前無法隔離肥料效果，需控制其他條件再比較','較高就證明肥料一定有效','條件不同證明肥料有害'],answer:0,why:'日照、澆水等混雜因素可能解釋差異；公平試驗需控制條件並重複。'},
 {id:'cause-10',topic:'cause',title:'新政策與事故變化',source:'政策上路後事故數下降，但同期交通量也減少，未做比較。',options:['事故數下降是觀察結果，政策因果效果還要分析交通暴露量等','政策一定是唯一原因','交通量減少表示事故率一定上升'],answer:0,why:'總件數受暴露量影響；評估政策需合適基準、趨勢與其他變動。'},
 {id:'cause-11',topic:'cause',title:'冰敷與腫脹',source:'某人冰敷後腫脹減少，沒有對照或症狀追蹤。',options:['腫脹隨時間減少，但單例不能證明完全由冰敷造成','冰敷治好所有傷勢','未做對照就證明冰敷無效'],answer:0,why:'單一經驗無法排除自然恢復或其他處理；傷勢嚴重時應尋求醫療評估。'},
 {id:'cause-12',topic:'cause',title:'補習與成績',source:'補習學生平均分數較高，但學生背景與先前成績未比較。',options:['觀察到組間差異，不能單憑此資料判定補習效果','補習讓每位學生都進步','分數較高證明學生更聰明'],answer:0,why:'先前能力、資源與選擇補習的因素可能不同；不能把組間差異直接歸因於補習。'},
 {id:'cause-13',topic:'cause',title:'植物朝窗生長',source:'一盆植物靠窗長得較彎，盆栽也只在窗邊旋轉過一次。',options:['光線方向可能相關，但需控制盆栽方向與其他條件','窗戶一定讓植物生病','植物彎曲證明土壤沒有養分'],answer:0,why:'光向性是可能解釋；要確認可固定其他條件並重複觀察。'},
 {id:'cause-14',topic:'cause',title:'降雨與遲到',source:'雨天遲到人數較多，沒有記錄交通或出門時間。',options:['降雨可能影響交通，但仍需資料檢查其他原因','下雨必定讓每個人遲到','遲到證明雨量測錯'],answer:0,why:'交通、路線與出門安排等都可能影響結果；同時發生不等於唯一成因。'},
 {id:'cause-15',topic:'cause',title:'使用者少與介面改版',source:'改版後使用人數下降，同期服務中斷兩小時。',options:['服務中斷是重要替代解釋，需比較可用時段與使用紀錄','介面改版必定趕走所有人','服務中斷與使用量無關'],answer:0,why:'需要把服務可用性等同期因素納入；否則不能把變化直接歸因於介面。'},
 {id:'numbers-5',topic:'numbers',title:'平均數被極端值拉高',source:'四人各得 1、2、3、14 分，貼文只稱平均 5 分。',options:['平均確為5分，但中位數為2.5，分布也很重要','每個人都拿5分','14分證明全班都很高分'],answer:0,why:'平均數不能代表每個個體；應同看分布、中位數與樣本數。'},
 {id:'numbers-6',topic:'numbers',title:'百分比要有分母',source:'貼文寫「新增100%」，原本1件變成2件。',options:['增加100%但只多1件，需同看絕對數與基準','增加100%代表多100件','新增1件所以百分比必定是1%'],answer:0,why:'相對百分比受基數影響；提供原始數值能避免誤讀幅度。'},
 {id:'numbers-7',topic:'numbers',title:'小樣本不能代表所有人',source:'問了同一桌的3位朋友，3人都喜歡新口味。',options:['這3位喜歡，不能代表全部顧客','所有顧客都喜歡','3人樣本證明產品不好'],answer:0,why:'樣本小且來源集中，代表性有限；不能推廣到整體客群。'},
 {id:'numbers-8',topic:'numbers',title:'比例和人數不同',source:'甲組10人中有5人答對；乙組100人中有40人答對。',options:['甲組比例50%、乙組40%，乙組答對人數較多','乙組答對比例較高','兩組人數不同所以不能算比例'],answer:0,why:'人數與比例回答不同問題，需清楚說明分母。'},
 {id:'numbers-9',topic:'numbers',title:'圖表縱軸從90開始',source:'長條圖只畫90至100，兩個值是95與96。',options:['差1單位，截斷座標可能誇大視覺差距','兩者相差十倍','圖表一定偽造資料'],answer:0,why:'截斷座標可放大視覺差異；看刻度、原始數值與圖表目的再判讀。'},
 {id:'numbers-10',topic:'numbers',title:'缺失資料不是零',source:'報表有20筆資料，其中4筆未回覆；分析時把未回覆填成0。',options:['缺失不等於0，需交代缺失處理方式','未回覆都代表答案為零','填0一定使結果更準'],answer:0,why:'缺失值代表未知；擅自當零可能扭曲平均與比例。'},
 {id:'numbers-11',topic:'numbers',title:'每月與每年不能混比',source:'一個方案每月收費，另一個公布年費，貼文只比較數字大小。',options:['先換算相同期間並納入費用條件','數字較小者一定全年更便宜','年費不能換算'],answer:0,why:'比較需統一期間、使用量及額外費用，否則數字不具可比性。'},
 {id:'numbers-12',topic:'numbers',title:'成長率的基期',source:'去年營收從1元到2元，成長率100%；今年從100元到110元，成長10%。',options:['今年增加的絕對金額較大，去年成長率較高','去年多賺100元','成長率高代表絕對增加一定較多'],answer:0,why:'成長率與絕對金額不同；應依問題同時比較基期與增加額。'},
 {id:'numbers-13',topic:'numbers',title:'中位數看典型位置',source:'五個等待時間為2、3、4、5、60分鐘。',options:['中位數4分鐘，平均14.8分鐘；長尾影響平均','平均和中位數都為4','60分鐘可以忽略不報'],answer:0,why:'偏斜分布中平均可能被極端值拉動；呈現摘要時應說明採用何種統計量。'},
 {id:'numbers-14',topic:'numbers',title:'沒有基準不能說改善',source:'新系統錯誤率1%，貼文稱「改善很多」，未提供舊系統資料。',options:['目前知道新系統錯誤率1%，改善幅度未知','錯誤率1%代表改善99%','沒基準就代表完全沒改善'],answer:0,why:'改善需與可比基準對照；單獨數值不能給出變化幅度。'},
 {id:'numbers-15',topic:'numbers',title:'抽樣偏差',source:'滿意度問卷只寄給曾按讚的使用者，回覆者滿意度很高。',options:['結果只描述回覆樣本，可能有選擇偏差','所有使用者都很滿意','問卷回覆高就代表無偏差'],answer:0,why:'受邀與回覆方式會影響樣本；不能直接代表未受邀或未回覆者。'}
);
const topics={frame:'畫面與原話',cause:'因果別亂喊',numbers:'數字看清楚'};
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function create(mode='short'){if(!['short','all',...Object.keys(topics)].includes(mode))throw Error('不支援的模式');const items=mode==='short'?(()=>{const keys=shuffle(Object.keys(topics));return shuffle(keys.flatMap((t,i)=>shuffle(cases.filter(c=>c.topic===t)).slice(0,3+(i===0?1:0))));})():shuffle(cases.filter(c=>mode==='all'||c.topic===mode));return {items,index:0,selected:null,volume:40,locked:false,results:[],done:false};}
function select(s,n){if(s.done||s.locked||!Number.isInteger(n)||n<0||n>2)return false;s.selected=n;return true;}
function setVolume(s,n){if(s.done||s.locked||!Number.isInteger(n)||n<0||n>100||n%10!==0)return false;s.volume=n;return true;}
function reach(volume){return volume*2;}
function submit(s){if(s.done||s.locked||s.selected===null)return null;const q=s.items[s.index],record={choice:s.selected,volume:s.volume,reach:reach(s.volume),supported:s.selected===q.answer};const r=s.results[s.index]??={first:{...record},tries:0};r.latest={...record};r.tries++;s.locked=true;return {...record};}
function retry(s){if(s.done||!s.locked)return false;s.locked=false;s.selected=null;s.volume=40;return true;}
function next(s){if(s.done||!s.locked)return false;if(s.index===s.items.length-1){s.done=true;return true;}s.index++;s.selected=null;s.volume=40;s.locked=false;return true;}
function scores(s){return {first:s.results.filter(r=>r.first.supported).length,latest:s.results.filter(r=>r.latest.supported).length,firstMisled:s.results.reduce((n,r)=>n+(r.first.supported?0:r.first.reach),0),firstReached:s.results.reduce((n,r)=>n+r.first.reach,0)};}
return {cases,topics,create,select,setVolume,reach,submit,retry,next,scores,shuffle};});
