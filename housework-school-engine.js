(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.HouseworkSchool=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{'use strict';
const topics={laundry:'洗晾收衣',kitchen:'餐後廚房',clean:'清掃整理',team:'分工與收尾'};
const questions=[
  {
    "id": "laundry-1",
    "topic": "laundry",
    "title": "洗衣前的三步",
    "display": "口袋檢查 → 分類確認 → 啟動",
    "prompt": "本題約定：先清出口袋物品，再依洗標分類與確認程序，最後才啟動。把步驟排好。",
    "steps": [
      "清出口袋物品",
      "依洗標分類並確認適用程序",
      "依機器手冊放入衣物與洗劑，啟動洗程"
    ],
    "why": "先檢查能避免紙屑或小物混入；確認洗標後才知道怎麼洗。實際操作依衣物與設備說明。",
    "kind": "order"
  },
  {
    "id": "laundry-2",
    "topic": "laundry",
    "title": "收衣不是只收回來",
    "display": "完全乾燥 → 摺好 → 歸位",
    "prompt": "本題衣物仍微濕，且約定衣櫃只放完全乾燥、摺好的衣物。請排序。",
    "steps": [
      "繼續晾至完全乾燥",
      "依家庭習慣摺好衣物",
      "放回指定衣櫃位置"
    ],
    "why": "微濕衣物不能直接悶進衣櫃；本題完成標準包含乾燥、摺好和歸位，不是只從衣架拿下來。",
    "kind": "order"
  },
  {
    "id": "laundry-3",
    "topic": "laundry",
    "title": "襪子洗好就完成了？",
    "display": "任務：洗、晾、配對並收進抽屜",
    "prompt": "襪子已乾但散在沙發，怎樣才符合這次約定？",
    "options": [
      "放著等別人配對",
      "配對後收進指定抽屜",
      "只傳訊息說洗好了"
    ],
    "answer": 1,
    "why": "照原約定還有配對與歸位；洗完是進度，不等於整個任務完成。",
    "kind": "choice"
  },
  {
    "id": "laundry-4",
    "topic": "laundry",
    "title": "晾衣服要看哪裡",
    "display": "外層已乾，腰頭與口袋較厚",
    "prompt": "收衣前適合怎麼檢查？",
    "options": [
      "只看顏色",
      "計時到了就全部收",
      "摸查厚處是否仍潮濕，再決定是否繼續晾"
    ],
    "answer": 2,
    "why": "厚處乾燥速度可能不同；用實際乾燥狀態檢查，比只看經過多久可靠。",
    "kind": "choice"
  },
  {
    "id": "laundry-5",
    "topic": "laundry",
    "title": "忘了誰的衣服",
    "display": "乾衣已分類，兩件不知道放哪",
    "prompt": "較好的收尾是？",
    "options": [
      "先問本人並放在約定暫放區",
      "塞進最近的衣櫃",
      "丟進待洗籃當作沒看見"
    ],
    "answer": 0,
    "why": "不確定位置先確認；暫放也要有約定位置與狀態，避免乾淨衣物又被當成待洗。",
    "kind": "choice"
  },
  {
    "id": "laundry-6",
    "topic": "laundry",
    "title": "洗標說不能烘",
    "display": "衣物標示不可滾筒烘乾",
    "prompt": "為了快點交差可以怎麼做？",
    "options": [
      "高溫烘短一點",
      "依洗標選可用的乾燥方式，必要時回報還沒乾",
      "烘完再看有沒有縮"
    ],
    "answer": 1,
    "why": "時間壓力不會取消洗標限制。若尚未乾燥，就如實回報剩餘工作，不把啟動機器當成完成。",
    "kind": "choice"
  },
  {
    "id": "kitchen-1",
    "topic": "kitchen",
    "title": "餐具的收尾鏈",
    "display": "清除殘渣 → 清洗沖淨 → 乾燥歸位",
    "prompt": "本題約定先移除殘渣再洗；清洗沖淨後，完全乾燥才歸位。請排序。",
    "steps": [
      "刮除餐具殘渣並依當地規定處理",
      "使用適合餐具的清潔方式清洗沖淨",
      "完全乾燥後放回指定位置"
    ],
    "why": "每一步要等前一步完成：先去除殘渣，接著清洗沖淨，最後乾燥歸位。乾燥方法依餐具與設備說明。",
    "kind": "order"
  },
  {
    "id": "kitchen-2",
    "topic": "kitchen",
    "title": "洗完鍋子還有水槽",
    "display": "先洗餐具 → 清理水槽 → 收好工具",
    "prompt": "本題約定餐具都清洗後，才清除水槽殘渣；最後處理本次用過的清潔工具。",
    "steps": [
      "完成本次餐具清洗",
      "清除濾網殘渣並清理水槽",
      "清理清潔工具並放回通風的指定位置"
    ],
    "why": "水槽與清潔工具也是收尾的一部分。本題順序是家庭約定，不是所有廚房唯一的流程。",
    "kind": "order"
  },
  {
    "id": "kitchen-3",
    "topic": "kitchen",
    "title": "碗看起來沒東西",
    "display": "碗沒有可見殘渣，但手摸仍滑油",
    "prompt": "符合清洗完成的判斷是？",
    "options": [
      "沒有食物就一定乾淨",
      "用毛巾蓋住就好",
      "依餐具適用方式去除油污並沖淨，再檢查"
    ],
    "answer": 2,
    "why": "沒有可見殘渣，不代表油污已去除；應檢查餐具實際狀態，不只看有沒有放進水槽。",
    "kind": "choice"
  },
  {
    "id": "kitchen-4",
    "topic": "kitchen",
    "title": "擦桌子不擦掉落物？",
    "display": "約定：桌面與座位周圍清潔",
    "prompt": "桌面擦好了，地上還有飯粒。怎麼回報？",
    "options": [
      "桌面完成，地面還沒清；接著處理地面",
      "直接說全部完成",
      "把飯粒踢到椅子底下"
    ],
    "answer": 0,
    "why": "把已完成與未完成分開說清楚；地面仍在原約定範圍內，不能用桌面完成代替。",
    "kind": "choice"
  },
  {
    "id": "kitchen-5",
    "topic": "kitchen",
    "title": "垃圾分類不靠猜",
    "display": "包裝有殘留內容物，回收規則不確定",
    "prompt": "適合的下一步是？",
    "options": [
      "所有塑膠都放同一袋",
      "查當地清潔隊規定，依要求清空與分類",
      "丟進鄰居的袋子"
    ],
    "answer": 1,
    "why": "各地與不同材質的收運規則可能不同；依當地規定處理，不把外地經驗當成通用規則。",
    "kind": "choice"
  },
  {
    "id": "kitchen-6",
    "topic": "kitchen",
    "title": "刀子別藏起來",
    "display": "洗碗水裡還有一把廚房刀",
    "prompt": "處理方式應優先考慮什麼？",
    "options": [
      "把刀藏在泡泡下等一下",
      "閉眼把手伸進水裡摸",
      "讓刀具位置清楚，依安全操作方式單獨處理"
    ],
    "answer": 2,
    "why": "避免利器藏在不透明的水中，讓自己與接手者能辨識位置；不熟悉刀具時請會操作的人協助。",
    "kind": "choice"
  },
  {
    "id": "clean-1",
    "topic": "clean",
    "title": "拖地前先做什麼",
    "display": "清出走道 → 去除乾垃圾 → 適度拖擦",
    "prompt": "本題地板允許以微濕方式清潔。約定先清走地面物品，再除去乾垃圾，最後拖擦。",
    "steps": [
      "收起走道上的物品",
      "掃除或吸除乾垃圾與灰塵",
      "依地板適用方式拖擦並讓地面乾燥"
    ],
    "why": "先處理物品和乾垃圾，再依地板材質清潔；不是所有地板都適合大量用水。",
    "kind": "order"
  },
  {
    "id": "clean-2",
    "topic": "clean",
    "title": "整理抽屜三步",
    "display": "分類 → 確認位置 → 放回",
    "prompt": "本題約定先看清抽屜全部物品，再確認保留物的位置，最後放回。請排序。",
    "steps": [
      "取出物品並分類，不擅自丟棄他人物品",
      "確認保留物的指定位置",
      "依分類放回，確保抽屜能順利關上"
    ],
    "why": "分類能看清現況；確認位置後再歸位。決定不要的物品仍須依所有者同意與適當方式處理。",
    "kind": "order"
  },
  {
    "id": "clean-3",
    "topic": "clean",
    "title": "拖完地還濕滑",
    "display": "走道剛拖好，家人準備走過",
    "prompt": "較完整的收尾是？",
    "options": [
      "提醒地面濕滑，維持安全通道並讓地面乾燥",
      "把拖把留在路中央",
      "不說，等別人自己發現"
    ],
    "answer": 0,
    "why": "清潔也要照顧使用空間的人；濕滑處應有提醒，不能讓工具或水分變成新的障礙。",
    "kind": "choice"
  },
  {
    "id": "clean-4",
    "topic": "clean",
    "title": "看不到就算收好了？",
    "display": "任務：書桌可使用，物品有固定位置",
    "prompt": "把全部雜物推進椅子下，算完成嗎？",
    "options": [
      "算，桌面看不見就好",
      "不算，仍需確認去向與可使用狀態",
      "拍照不要拍到下面就好"
    ],
    "answer": 1,
    "why": "本題標準不是藏起來，而是物品能找到、桌面能使用，且沒有把混亂轉移到別處。",
    "kind": "choice"
  },
  {
    "id": "clean-5",
    "topic": "clean",
    "title": "別把灰塵帶回去",
    "display": "同一條布擦過髒污後，準備擦另一處",
    "prompt": "適合怎麼做？",
    "options": [
      "一直擦到全部同色",
      "翻一面就一定能處理所有髒污",
      "依髒污與表面需求清理或更換工具，再處理下一處"
    ],
    "answer": 2,
    "why": "工具本身的狀態會影響清潔結果；不同區域也可能需要分開工具，不能只計算擦了幾次。",
    "kind": "choice"
  },
  {
    "id": "clean-6",
    "topic": "clean",
    "title": "想丟別人的紙袋",
    "display": "整理公共區域，紙袋所有人還沒確認",
    "prompt": "適合的行動是？",
    "options": [
      "先確認是否保留，暫放在約定位置",
      "直接丟掉比較快",
      "藏進別人的房間"
    ],
    "answer": 0,
    "why": "整理公共區域不等於取得丟棄他人物品的同意；先確認所有者與暫放安排。",
    "kind": "choice"
  },
  {
    "id": "team-1",
    "topic": "team",
    "title": "接家事前先對齊",
    "display": "約定 → 執行檢查 → 回報",
    "prompt": "本題要求先約定範圍、負責人與完成時間，再執行；檢查後才回報完成。",
    "steps": [
      "確認範圍、負責人、完成時間與完成標準",
      "執行家事並依標準檢查",
      "如實回報完成，或說明剩餘工作"
    ],
    "why": "先對齊能減少彼此期待不同；回報根據檢查結果，不只根據自己有沒有動手。",
    "kind": "order"
  },
  {
    "id": "team-2",
    "topic": "team",
    "title": "離開前的交接",
    "display": "安全停下 → 說明狀態 → 確認接手",
    "prompt": "本題約定先將工具與現場留在安全狀態，再說明已做未做，最後取得接手者明確回覆。",
    "steps": [
      "讓現場與工具維持安全狀態",
      "說明已完成、剩餘項目與工具位置",
      "確認接手者明確同意，再視為交接成立"
    ],
    "why": "傳訊息不代表有人接手；本題要確認對方回覆，原責任才不會憑空消失。",
    "kind": "order"
  },
  {
    "id": "team-3",
    "topic": "team",
    "title": "只回好，不代表約好了",
    "display": "對方說：晚餐前把餐桌整理好",
    "prompt": "如果不知道包含哪些工作，應該？",
    "options": [
      "先回好，之後再猜",
      "確認是否包含餐具、桌面與周圍地面，以及完成時間",
      "把要求轉傳給別人就好"
    ],
    "answer": 1,
    "why": "先問缺少的範圍與時間；不需要反覆問已經清楚的部分，也別把理解與完成混在一起。",
    "kind": "choice"
  },
  {
    "id": "team-4",
    "topic": "team",
    "title": "時間不夠怎麼說",
    "display": "原約定18:00完成，現在發現還需要30分鐘",
    "prompt": "較好的狀態回報是？",
    "options": [
      "我已開始，所以算完成",
      "假裝沒看到時間",
      "說明完成與剩餘項目，提出新時間並和受影響的人確認"
    ],
    "answer": 2,
    "why": "及早提供具體狀態與調整提案；提出新時間還不等於對方已同意，原約定不能默默改掉。",
    "kind": "choice"
  },
  {
    "id": "team-5",
    "topic": "team",
    "title": "不是誰順手就變誰的",
    "display": "兩人共同生活，要分配本週家事",
    "prompt": "怎麼安排比較清楚？",
    "options": [
      "共同討論工作量與可用時間，確認負責人與輪替",
      "固定交給最先看見的人",
      "說大家一起做，但不分配"
    ],
    "answer": 0,
    "why": "把工作量與責任說清楚，比默認某人會補位更容易合作；分工不由性別或身份自動決定。",
    "kind": "choice"
  },
  {
    "id": "team-6",
    "topic": "team",
    "title": "自己的進度怎麼驗收",
    "display": "約定：垃圾移出、換新袋、桶周圍乾淨",
    "prompt": "你只把垃圾拿到門口，現在可以怎麼說？",
    "options": [
      "垃圾已移到門口；還沒送到收運點，也還沒換袋與清理",
      "整件完成了",
      "桶空了，其他不關我的事"
    ],
    "answer": 0,
    "why": "進度可以承認，但不能取代原完成標準。清楚列出剩餘工作，才方便自己繼續或協調。",
    "kind": "choice"
  }
];
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function create(mode='short'){
 if(!['short','all',...Object.keys(topics)].includes(mode))throw new Error('不支援的練習範圍');
 const items=mode==='short'?shuffle(Object.keys(topics).flatMap(t=>shuffle(questions.filter(q=>q.topic===t)).slice(0,2))):shuffle(questions.filter(q=>mode==='all'||q.topic===mode));
 return {items,index:0,selected:null,locked:false,results:[],done:false};
}
function valid(q,value){return q.kind==='order'?Array.isArray(value)&&value.length===q.steps.length&&new Set(value).size===q.steps.length&&value.every(n=>Number.isInteger(n)&&n>=0&&n<q.steps.length):Number.isInteger(value)&&value>=0&&value<q.options.length;}
function correct(q,value){return q.kind==='order'?valid(q,value)&&value.every((n,i)=>n===i):value===q.answer;}
function select(s,value){if(s.done||s.locked||!valid(s.items[s.index],value))return false;s.selected=Array.isArray(value)?[...value]:value;return true;}
function submit(s,value=s.selected){if(s.done||s.locked)return null;const q=s.items[s.index];if(value!=='unsure'&&!valid(q,value))return null;const ok=value!=='unsure'&&correct(q,value),prior=s.results[s.index];s.results[s.index]={first:prior?prior.first:ok,latest:ok,value:Array.isArray(value)?[...value]:value,tries:prior?prior.tries+1:1};s.locked=true;return s.results[s.index];}
function retry(s){if(s.done||!s.locked||s.results[s.index].latest)return false;s.locked=false;s.selected=null;return true;}
function next(s){if(s.done||!s.locked)return false;if(s.index===s.items.length-1){s.done=true;return true;}s.index++;s.selected=null;s.locked=false;return true;}
return {topics,questions,create,select,submit,retry,next,shuffle,valid,correct};
});
