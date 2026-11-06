(function(root){'use strict';
const topics={skin:'皮膚照護',home:'居家過敏原',help:'何時求助'};
const sources={"skin": ["AAD｜濕疹居家照護", "https://www.aad.org/news/how-to-treat-eczema-at-home"], "home": ["AAAAI｜室內過敏原", "https://www.aaaai.org/tools-for-the-public/conditions-library/allergies/indoor-allergens-ttr"], "help": ["AAAAI｜嚴重過敏反應", "https://www.aaaai.org/tools-for-the-public/conditions-library/allergies/anaphylaxis"]};
const questions=[
 {
  "id": "bath",
  "topic": "skin",
  "title": "洗澡不是耐熱比賽",
  "prompt": "已確診異位性皮膚炎，今天皮膚乾癢。洗澡怎麼安排？",
  "options": [
   "溫水短洗約 5–10 分鐘，輕柔清潔",
   "用燙水泡久一點，把癢壓過去",
   "用力搓洗到皮膚發紅"
  ],
  "answer": 0,
  "why": "溫水短洗比較不刺激；不要用燙水或摩擦追求「洗乾淨」。這是異位性皮膚炎照護，不代表所有癢都靠洗澡處理。",
  "source": "skin"
 },
 {
  "id": "moist",
  "topic": "skin",
  "title": "水分要留住，不是等它蒸發",
  "prompt": "短時間溫水洗澡後，異位性皮膚炎的皮膚還微濕，下一步？",
  "options": [
   "輕拍後趁微濕擦無香料乳霜或軟膏",
   "等到皮膚完全乾裂再補擦",
   "用香水蓋住乳霜的味道"
  ],
  "answer": 0,
  "why": "洗澡後趁皮膚微濕保濕，乾燥時也可補擦。乳霜或軟膏通常比乳液更能保濕；有處方藥時，使用方式依醫囑。",
  "source": "skin"
 },
 {
  "id": "label",
  "topic": "skin",
  "title": "沒有味道，不等於沒有香料",
  "prompt": "替容易因產品刺激而發作的濕疹皮膚選保濕品，優先看哪個標示？",
  "options": [
   "無香料（fragrance-free），仍需留意個別反應",
   "無氣味（unscented）就保證沒有香料",
   "天然精油保證不會刺激"
  ],
  "answer": 0,
  "why": "無氣味產品仍可能用香料掩蓋氣味；天然也不保證安全。無香料是選購方向，不是對每個人都適用的保證。",
  "source": "skin"
 },
 {
  "id": "patch",
  "topic": "skin",
  "title": "新乳霜先別全身豪賭",
  "prompt": "新買無香料保濕品，想直接擦滿全身。比較穩妥的做法？",
  "options": [
   "先在手臂內側小範圍試用，觀察反應",
   "只要無香料，就完全不用試",
   "一次混三種，才知道效果好不好"
  ],
  "answer": 0,
  "why": "AAD 建議新保養品先在手臂內側小範圍每天試用 7–10 天；出現刺激就停用並詢問醫師。這不是醫療貼膚測試，也不能用來自行挑戰已知過敏原。",
  "source": "skin"
 },
 {
  "id": "bed",
  "topic": "home",
  "title": "臥室防線，不是只噴香香",
  "prompt": "已確認對塵蟎過敏，準備改善臥室，哪個組合較合理？",
  "options": [
   "防蟎套搭配規律清洗寢具、控制潮濕",
   "只噴香氛就能去除所有過敏原",
   "什麼都不改，只把床搬到另一面牆"
  ],
  "answer": 0,
  "why": "塵蟎喜歡溫暖潮濕的寢具；防蟎套、每週清洗寢具與控制濕度是多管齊下，不保證根治。清洗溫度與烘乾須兼顧洗標及防燙安全。",
  "source": "home"
 },
 {
  "id": "damp",
  "topic": "home",
  "title": "牆角發霉，不是換香味",
  "prompt": "屋內有漏水和霉味，已知黴菌會誘發你的症狀，應先做什麼？",
  "options": [
   "修漏水、處理潮濕與黴菌，保持通風",
   "增加加濕，讓牆壁不要乾裂",
   "用香氛把霉味完全蓋住"
  ],
  "answer": 0,
  "why": "黴菌需要水分。減少潮濕、修漏水並妥善處理黴菌，比遮味更重要；大範圍或無法安全處理時找專業人員。清潔劑不可混用。",
  "source": "home"
 },
 {
  "id": "pet",
  "topic": "home",
  "title": "短毛，不是免過敏通行證",
  "prompt": "對貓狗過敏的人看到「低敏短毛品種」廣告，哪個說法合理？",
  "options": [
   "短毛不保證低敏，過敏原也來自皮屑、唾液等",
   "沒有長毛就不可能過敏",
   "剃毛可以保證根治過敏"
  ],
  "answer": 0,
  "why": "AAAAI 指出沒有保證不致過敏的貓狗品種；過敏原不只在毛。先確認個人誘因，已養寵物可討論減少接觸、避免進臥室等方法，不憑廣告下結論。",
  "source": "home"
 },
 {
  "id": "cause",
  "topic": "home",
  "title": "先找誘因，不是全屋亂禁",
  "prompt": "一年四季常打噴嚏、鼻癢，還沒確認誘因，怎麼開始？",
  "options": [
   "記下症狀與接觸情境，找醫師評估可能誘因",
   "直接認定一定是塵蟎，不用評估",
   "只憑一次鼻癢就把所有食物都禁掉"
  ],
  "answer": 0,
  "why": "鼻部症狀有不同可能原因，不能單靠這段描述確診。醫師可結合病史與必要檢查協助找誘因；皮膚保濕也不是鼻過敏的替代治療。",
  "source": "home"
 },
 {
  "id": "urgent",
  "topic": "help",
  "title": "這次不是日常保養題",
  "prompt": "吃東西後突然喉嚨緊、呼吸困難。現在最重要的是？",
  "options": [
   "立刻打119求救；若有醫師開立的腎上腺素，依緊急計畫立即使用",
   "先擦乳霜，睡一覺看看",
   "只吃抗組織胺，等幾小時再說"
  ],
  "answer": 0,
  "why": "疑似嚴重過敏反應需立即處理，不等自行好轉。腎上腺素是第一線急救藥，抗組織胺不能取代。台灣撥119；不要為了找藥延誤求救。",
  "source": "help"
 },
 {
  "id": "better",
  "topic": "help",
  "title": "好轉了，還要去嗎？",
  "prompt": "疑似嚴重過敏反應，已依計畫使用腎上腺素，症狀開始改善。接著？",
  "options": [
   "仍接受急救與醫院評估，不自行取消求救",
   "既然好轉就不用去醫院",
   "繼續吃同一道食物驗證看看"
  ],
  "answer": 0,
  "why": "嚴重過敏反應可能再次出現，好轉不等於處理完成，仍需醫療觀察。不要自行用再次接觸來驗證。",
  "source": "help"
 },
 {
  "id": "plan",
  "topic": "help",
  "title": "急救計畫，不要只存在腦袋",
  "prompt": "曾有嚴重過敏反應，醫師已開立急救藥，出門前怎麼準備？",
  "options": [
   "帶著未過期急救藥，確認用法，讓同行者知道計畫",
   "把急救藥留家裡，靠朋友記得就好",
   "只記商品顏色，不用知道何時使用"
  ],
  "answer": 0,
  "why": "與醫師確認避免誘因、何時用藥與求救方式；隨身攜帶急救藥並檢查有效期。不同製劑與年齡的指示不同，本課不提供劑量。",
  "source": "help"
 },
 {
  "id": "food",
  "topic": "help",
  "title": "已知食物過敏，不靠試一口",
  "prompt": "已確診某種食物會引發嚴重過敏，聚餐時怎麼做？",
  "options": [
   "確認成分並告知店家過敏情況，無法確認就不冒險",
   "先吃一點測試今天會不會發作",
   "把看得見的過敏食材挑掉就保證安全"
  ],
  "answer": 0,
  "why": "讀懂成分與外食風險是避免再次反應的一部分。挑掉可見食材不能保證沒有殘留或交叉接觸；診斷與飲食限制應依醫療評估，不任意擴大禁食。",
  "source": "help"
 }
];
function shuffled(items){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function queue(mode='short'){if(mode==='all')return shuffled(questions);if(mode==='short')return shuffled(Object.keys(topics).flatMap(t=>shuffled(questions.filter(q=>q.topic===t)).slice(0,2)));if(Object.hasOwn(topics,mode))return shuffled(questions.filter(q=>q.topic===mode));throw new Error('未知課程');}
function create(mode){return {items:queue(mode),index:0,answers:[],attempts:[]};}
function submit(s,choice){const q=s.items[s.index];if(!q||s.answers.length>s.index)return null;if(choice!==null&&(!Number.isInteger(choice)||choice<0||choice>=q.options.length))return null;const a={id:q.id,choice,ok:choice===q.answer};s.answers.push(a);return a;}
function retry(s,choice){const q=s.items[s.index];if(!q||s.answers.length<=s.index||!Number.isInteger(choice)||choice<0||choice>=q.options.length)return null;const a={id:q.id,choice,ok:choice===q.answer};s.attempts.push(a);return a;}
function next(s){if(s.answers.length<=s.index||s.index>=s.items.length)return false;s.index++;return true;}
const api={topics,sources,questions,shuffled,queue,create,submit,retry,next};if(typeof module!=='undefined')module.exports=api;else root.AllergySchool=api;
})(typeof globalThis!=='undefined'?globalThis:this);
