(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MathSchool=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{'use strict';
const topics={calc:'四則運算',fraction:'分數探險',life:'時間與生活',shape:'周長與面積'};
const questions=[
  {
    "id": "calc-1",
    "topic": "calc",
    "title": "先算哪一步？",
    "display": "18 + 6 × 3",
    "prompt": "這個算式的結果是多少？",
    "options": [
      "72",
      "36",
      "24"
    ],
    "answer": 1,
    "why": "先乘除、後加減：6 × 3 = 18，再算 18 + 18 = 36。"
  },
  {
    "id": "calc-2",
    "topic": "calc",
    "title": "括號先出場",
    "display": "(18 + 6) × 3",
    "prompt": "加上括號後，結果是多少？",
    "options": [
      "36",
      "54",
      "72"
    ],
    "answer": 2,
    "why": "括號內先算：18 + 6 = 24，再算 24 × 3 = 72。"
  },
  {
    "id": "calc-3",
    "topic": "calc",
    "title": "平均分貼紙",
    "display": "48 張 ÷ 6 人",
    "prompt": "48 張貼紙平均分給 6 人，每人幾張？",
    "options": [
      "8 張",
      "6 張",
      "9 張"
    ],
    "answer": 0,
    "why": "平均分用除法：48 ÷ 6 = 8；6 × 8 = 48 可檢查。"
  },
  {
    "id": "calc-4",
    "topic": "calc",
    "title": "還剩幾顆？",
    "display": "5 袋 × 8 顆 − 7 顆",
    "prompt": "每袋 8 顆糖，買了 5 袋，吃掉 7 顆後還有幾顆？",
    "options": [
      "33 顆",
      "35 顆",
      "47 顆"
    ],
    "answer": 0,
    "why": "先算總數 5 × 8 = 40，再減去吃掉的 7 顆，剩 33 顆。"
  },
  {
    "id": "calc-5",
    "topic": "calc",
    "title": "方框裡的數",
    "display": "□ × 7 = 63",
    "prompt": "方框應填哪個數？",
    "options": [
      "8",
      "7",
      "9"
    ],
    "answer": 2,
    "why": "用相反運算檢查：63 ÷ 7 = 9，所以 9 × 7 = 63。"
  },
  {
    "id": "calc-6",
    "topic": "calc",
    "title": "裝滿還有剩",
    "display": "29 顆球，每盒裝 4 顆",
    "prompt": "最多裝滿幾盒，還剩幾顆？",
    "options": [
      "7 盒，剩 1 顆",
      "6 盒，剩 5 顆",
      "8 盒，剩 1 顆"
    ],
    "answer": 0,
    "why": "4 × 7 = 28，29 − 28 = 1。餘數須小於每盒容量 4。"
  },
  {
    "id": "fraction-1",
    "topic": "fraction",
    "title": "分母看全部",
    "display": "整條平均分成 4 份，塗色 3 份",
    "prompt": "塗色占整條的幾分之幾？",
    "options": [
      "1/4",
      "3/4",
      "4/3"
    ],
    "answer": 1,
    "why": "分母是平均分成的總份數 4；分子是塗色的 3 份，所以是 3/4。",
    "art": "fraction",
    "parts": 4,
    "filled": 3
  },
  {
    "id": "fraction-2",
    "topic": "fraction",
    "title": "同分母相加",
    "display": "2/7 + 3/7",
    "prompt": "總共是幾分之幾？",
    "options": [
      "5/14",
      "6/7",
      "5/7"
    ],
    "answer": 2,
    "why": "每份大小都是七分之一，只合併份數：2 + 3 = 5，分母維持 7。"
  },
  {
    "id": "fraction-3",
    "topic": "fraction",
    "title": "同分母比大小",
    "display": "3/8　與　5/8",
    "prompt": "哪一個比較大？",
    "options": [
      "3/8",
      "5/8",
      "一樣大"
    ],
    "answer": 1,
    "why": "同一個整體分成 8 等份，拿 5 份比拿 3 份多，所以 5/8 較大。"
  },
  {
    "id": "fraction-4",
    "topic": "fraction",
    "title": "一半長得不一樣",
    "display": "1/2 = □",
    "prompt": "哪一個和 1/2 一樣大？",
    "options": [
      "1/4",
      "2/3",
      "2/4"
    ],
    "answer": 2,
    "why": "把每個二分之一再切成兩份，就得到四分之二；2/4 和 1/2 一樣大。",
    "art": "fraction",
    "parts": 4,
    "filled": 2
  },
  {
    "id": "fraction-5",
    "topic": "fraction",
    "title": "一整個拿走一些",
    "display": "1 − 3/8",
    "prompt": "還剩幾分之幾？",
    "options": [
      "5/8",
      "3/8",
      "7/8"
    ],
    "answer": 0,
    "why": "一整個是 8/8。8/8 − 3/8 = 5/8。"
  },
  {
    "id": "fraction-6",
    "topic": "fraction",
    "title": "一群物品的三分之一",
    "display": "12 個蘋果的 1/3",
    "prompt": "把 12 個蘋果平均分成 3 組，取其中一組，有幾個？",
    "options": [
      "3 個",
      "4 個",
      "6 個"
    ],
    "answer": 1,
    "why": "把總數 12 平均分成 3 組：12 ÷ 3 = 4，所以三分之一是 4 個。"
  },
  {
    "id": "life-1",
    "topic": "life",
    "title": "買東西找零",
    "display": "付 100 元｜買 35 元 + 28 元",
    "prompt": "應找回多少元？",
    "options": [
      "37 元",
      "47 元",
      "63 元"
    ],
    "answer": 0,
    "why": "花費 35 + 28 = 63 元；100 − 63 = 37 元。"
  },
  {
    "id": "life-2",
    "topic": "life",
    "title": "電影什麼時候結束？",
    "display": "14:35 開始｜片長 50 分鐘",
    "prompt": "同一天的結束時間是？",
    "options": [
      "14:85",
      "15:15",
      "15:25"
    ],
    "answer": 2,
    "why": "14:35 再過 25 分鐘到 15:00，還有 25 分鐘，所以是 15:25。每小時 60 分鐘。"
  },
  {
    "id": "life-3",
    "topic": "life",
    "title": "這段路走多久？",
    "display": "09:45 出發 → 10:20 到達",
    "prompt": "總共經過幾分鐘？",
    "options": [
      "75 分鐘",
      "35 分鐘",
      "25 分鐘"
    ],
    "answer": 1,
    "why": "09:45 到 10:00 是 15 分鐘，再到 10:20 是 20 分鐘，合計 35 分鐘。"
  },
  {
    "id": "life-4",
    "topic": "life",
    "title": "公尺換公分",
    "display": "2 公尺 35 公分",
    "prompt": "全部換成公分是多少？",
    "options": [
      "235 公分",
      "2035 公分",
      "37 公分"
    ],
    "answer": 0,
    "why": "1 公尺 = 100 公分，所以 2 公尺是 200 公分，再加 35 得 235 公分。"
  },
  {
    "id": "life-5",
    "topic": "life",
    "title": "公升換毫升",
    "display": "1 公升 250 毫升",
    "prompt": "全部換成毫升是多少？",
    "options": [
      "250 毫升",
      "125 毫升",
      "1250 毫升"
    ],
    "answer": 2,
    "why": "1 公升 = 1000 毫升；1000 + 250 = 1250 毫升。"
  },
  {
    "id": "life-6",
    "topic": "life",
    "title": "哪一包單價比較低？",
    "display": "A：3 枝筆 45 元｜B：4 枝筆 64 元",
    "prompt": "兩包每枝筆品質相同，哪包每枝比較便宜？",
    "options": [
      "B 包",
      "A 包",
      "一樣便宜"
    ],
    "answer": 1,
    "why": "A 每枝 45 ÷ 3 = 15 元；B 每枝 64 ÷ 4 = 16 元。A 每枝少 1 元。"
  },
  {
    "id": "shape-1",
    "topic": "shape",
    "title": "沿著邊走一圈",
    "display": "長方形：長 8 公分、寬 3 公分",
    "prompt": "周長是多少？",
    "options": [
      "24 公分",
      "11 公分",
      "22 公分"
    ],
    "answer": 2,
    "why": "周長是四邊總長：8 + 3 + 8 + 3 = 22 公分。不要與面積混淆。"
  },
  {
    "id": "shape-2",
    "topic": "shape",
    "title": "鋪滿多少小方格？",
    "display": "長方形：長 6 公分、寬 4 公分",
    "prompt": "每個小格 1 平方公分，面積是多少？",
    "options": [
      "20 平方公分",
      "24 平方公分",
      "10 平方公分"
    ],
    "answer": 1,
    "why": "每排 6 格，共 4 排：6 × 4 = 24 平方公分。",
    "art": "tiles",
    "cols": 6,
    "rows": 4
  },
  {
    "id": "shape-3",
    "topic": "shape",
    "title": "正方形的圍牆",
    "display": "正方形：邊長 5 公分",
    "prompt": "周長是多少？",
    "options": [
      "20 公分",
      "25 公分",
      "10 公分"
    ],
    "answer": 0,
    "why": "正方形四邊相等，5 × 4 = 20 公分。25 平方公分才是面積。"
  },
  {
    "id": "shape-4",
    "topic": "shape",
    "title": "邊長加倍，面積呢？",
    "display": "小正方形邊長 2 公分 → 大正方形邊長 4 公分",
    "prompt": "大正方形面積是小正方形的幾倍？",
    "options": [
      "2 倍",
      "8 倍",
      "4 倍"
    ],
    "answer": 2,
    "why": "小面積 2 × 2 = 4，大面積 4 × 4 = 16；16 ÷ 4 = 4 倍。"
  },
  {
    "id": "shape-5",
    "topic": "shape",
    "title": "拼起來的面積",
    "display": "長寬分別為 3 × 4 公分與 2 × 4 公分的兩塊長方形",
    "prompt": "兩塊沒有重疊，也沒有空隙，拼成的總面積是多少平方公分？",
    "options": [
      "24",
      "20",
      "16"
    ],
    "answer": 1,
    "why": "面積可以相加：3 × 4 + 2 × 4 = 12 + 8 = 20 平方公分。圖形移動不會改變面積。"
  },
  {
    "id": "shape-6",
    "topic": "shape",
    "title": "缺一角的方格板",
    "display": "原有 4 × 3 格，拿走角落 1 格",
    "prompt": "每格 1 平方公分，剩下面積是多少？",
    "options": [
      "10 平方公分",
      "12 平方公分",
      "11 平方公分"
    ],
    "answer": 2,
    "why": "原面積 4 × 3 = 12 平方公分，拿掉 1 格後是 11 平方公分。"
  }
];
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function create(mode='short'){
 if(!['short','all',...Object.keys(topics)].includes(mode))throw new Error('不支援的練習範圍');
 const items=mode==='short'?shuffle(Object.keys(topics).flatMap(t=>shuffle(questions.filter(q=>q.topic===t)).slice(0,2))):shuffle(questions.filter(q=>mode==='all'||q.topic===mode));
 return {items,index:0,selected:null,locked:false,results:[],done:false};
}
function select(s,value){const q=s.items[s.index];if(s.done||s.locked||!Number.isInteger(value)||value<0||value>=q.options.length)return false;s.selected=value;return true;}
function submit(s,value=s.selected){const q=s.items[s.index];if(s.done||s.locked||(value!=='unsure'&&(!Number.isInteger(value)||value<0||value>=q.options.length)))return null;
 const ok=value===q.answer,prior=s.results[s.index];s.results[s.index]={first:prior?prior.first:ok,latest:ok,value,tries:prior?prior.tries+1:1};s.locked=true;return s.results[s.index];}
function retry(s){if(s.done||!s.locked||s.results[s.index].latest)return false;s.locked=false;s.selected=null;return true;}
function next(s){if(s.done||!s.locked)return false;if(s.index===s.items.length-1){s.done=true;return true;}s.index++;s.selected=null;s.locked=false;return true;}
return {topics,questions,create,select,submit,retry,next,shuffle};
});
