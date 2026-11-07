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
const topics={frame:'畫面與原話',cause:'因果別亂喊',numbers:'數字看清楚'};
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function create(mode='short'){if(!['short','all',...Object.keys(topics)].includes(mode))throw Error('不支援的模式');const items=mode==='short'?shuffle(Object.keys(topics).flatMap(t=>shuffle(cases.filter(c=>c.topic===t)).slice(0,2))):shuffle(cases.filter(c=>mode==='all'||c.topic===mode));return {items,index:0,selected:null,volume:40,locked:false,results:[],done:false};}
function select(s,n){if(s.done||s.locked||!Number.isInteger(n)||n<0||n>2)return false;s.selected=n;return true;}
function setVolume(s,n){if(s.done||s.locked||!Number.isInteger(n)||n<0||n>100||n%10!==0)return false;s.volume=n;return true;}
function reach(volume){return volume*2;}
function submit(s){if(s.done||s.locked||s.selected===null)return null;const q=s.items[s.index],record={choice:s.selected,volume:s.volume,reach:reach(s.volume),supported:s.selected===q.answer};const r=s.results[s.index]??={first:{...record},tries:0};r.latest={...record};r.tries++;s.locked=true;return {...record};}
function retry(s){if(s.done||!s.locked)return false;s.locked=false;s.selected=null;s.volume=40;return true;}
function next(s){if(s.done||!s.locked)return false;if(s.index===s.items.length-1){s.done=true;return true;}s.index++;s.selected=null;s.volume=40;s.locked=false;return true;}
function scores(s){return {first:s.results.filter(r=>r.first.supported).length,latest:s.results.filter(r=>r.latest.supported).length,firstMisled:s.results.reduce((n,r)=>n+(r.first.supported?0:r.first.reach),0),firstReached:s.results.reduce((n,r)=>n+r.first.reach,0)};}
return {cases,topics,create,select,setVolume,reach,submit,retry,next,scores,shuffle};});
