(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GiggleCrazy=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{'use strict';
const items=[
  {
    "id": "pudding",
    "name": "穿拖鞋的布丁",
    "entrance": "啪搭啪搭，布丁拖鞋自己跑來了。",
    "reactions": [
      "布丁跳上拖鞋溜滑梯，還對你比了個耶！",
      "拖鞋變成布丁的小翅膀，啪搭啪搭飛出蝴蝶結！",
      "布丁把自己變成焦糖小城堡，門口還有兩隻拖鞋守衛！"
    ]
  },
  {
    "id": "toast",
    "name": "雲朵烤吐司",
    "entrance": "一片吐司躺在雲上打奶油呼嚕。",
    "reactions": [
      "吐司把雲當彈簧床，烤出一排奶油小星星！",
      "吐司翻過來，背面竟然長著一座迷你彩虹！",
      "雲朵淋上蜂蜜，吐司自動排成早餐小火車！"
    ]
  },
  {
    "id": "rainbow",
    "name": "會打嗝的彩虹",
    "entrance": "嗝！彩虹吐出一顆粉紅色泡泡。",
    "reactions": [
      "彩虹打嗝打出彩色溜滑梯，泡泡排隊玩！",
      "七種顏色開始互換座位，最後變成彩虹辮子！",
      "彩虹捲成七彩棉花糖，還附一顆打嗝珍珠！"
    ]
  },
  {
    "id": "rice",
    "name": "打領結的飯糰",
    "entrance": "飯糰正對著海苔鏡子整理領結。",
    "reactions": [
      "飯糰帶著領結轉圈圈，海苔在旁邊拍手！",
      "領結自己開花，飯糰頭上長出一朵海苔蝴蝶！",
      "飯糰排出迷你便當派對，米粒全部穿西裝！"
    ]
  },
  {
    "id": "planet",
    "name": "彈跳鳳梨星球",
    "entrance": "一顆鳳梨星球正沿著果汁軌道彈跳。",
    "reactions": [
      "鳳梨星球變成彈珠台，珍珠衛星滾來滾去！",
      "星環竟然是會轉圈的鳳梨葉皇冠！",
      "鳳梨星球切成星星果凍，果汁繞成一圈彩帶！"
    ]
  },
  {
    "id": "cloud",
    "name": "會游泳的棉花糖",
    "entrance": "棉花糖戴著泳圈，在天空划奶油水。",
    "reactions": [
      "棉花糖划出一條雲朵水滑梯，咻——！",
      "泳圈變成甜甜圈飛船，棉花糖倒立開船！",
      "整朵雲變成蓬蓬棉花糖聖代，頂端站著小櫻桃！"
    ]
  },
  {
    "id": "dumpling",
    "name": "長腳小湯圓",
    "entrance": "三顆湯圓穿著小襪子，一起踢踏踢踏。",
    "reactions": [
      "湯圓們開始踢踏舞，芝麻餡在裡面敲鼓！",
      "小襪子變成滑輪，湯圓繞成一個愛心！",
      "湯圓排成三色甜湯星座，每顆都在說啵！"
    ]
  },
  {
    "id": "saucer",
    "name": "迷你西瓜飛碟",
    "entrance": "嗶嗶！西瓜飛碟正在尋找冰塊停車場。",
    "reactions": [
      "飛碟甩出西瓜籽小煙火，咻咻咻！",
      "西瓜皮變成飛碟翅膀，籽籽成為小船員！",
      "飛碟端出一碗西瓜冰，冰塊自己排隊跳進去！"
    ]
  },
  {
    "id": "volcano",
    "name": "嘟嘴奶油火山",
    "entrance": "噗——奶油火山吐出一個超小的泡芙。",
    "reactions": [
      "火山噴出泡芙蹦床，奶油在空中翻跟斗！",
      "火山口長出一張嘟嘟嘴，正在吹奶油泡泡！",
      "奶油火山變成超大泡芙塔，頂端插著餅乾旗！"
    ]
  },
  {
    "id": "waffle",
    "name": "戴墨鏡的鬆餅",
    "entrance": "鬆餅扶了一下墨鏡，蜂蜜說：太帥了吧。",
    "reactions": [
      "鬆餅拿蜂蜜當滑板，帥到草莓都鼓掌！",
      "墨鏡裡住著兩顆小太陽，鬆餅開始發光！",
      "鬆餅疊成摩天大樓，奶油搭電梯上頂樓！"
    ]
  },
  {
    "id": "tornado",
    "name": "果凍龍捲風",
    "entrance": "咕溜咕溜，一陣龍捲風把自己轉成彈簧。",
    "reactions": [
      "果凍龍捲風變成旋轉木馬，軟糖坐滿一圈！",
      "風眼裡藏著一顆戴帽子的迷你龍捲風！",
      "整陣風凍成螺旋果凍，湯匙在旁邊跳探戈！"
    ]
  },
  {
    "id": "boba",
    "name": "珍珠奶茶木星",
    "entrance": "吸管星環繞著奶茶木星，珍珠們正在散步。",
    "reactions": [
      "珍珠衛星開起碰碰車，吸管星環咚咚響！",
      "每顆珍珠裡都有一顆更迷你的奶茶木星！",
      "奶茶木星變成宇宙特大杯，珍珠排隊溜吸管！"
    ]
  }
];
const reactions=[{label:'好好玩',kind:'play',spark:'✦ 🛝 ✦'},{label:'好有趣',kind:'wonder',spark:'🌈 ✦ 🪄'},{label:'看起來很好吃',kind:'tasty',spark:'🍮 ✨ 🍒'}];
function shuffle(list){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function create(mode='short'){if(!['short','all'].includes(mode))throw Error('不支援的笑場');return {items:shuffle(items).slice(0,mode==='all'?12:4),index:0,records:[],pokes:0,done:false};}
function react(s,n){if(s.done||!Number.isInteger(n)||n<0||n>2)return null;const item=s.items[s.index];const r={id:item.id,reaction:n,text:item.reactions[n]};s.records[s.index]={...r};return {...r};}
function poke(s){if(s.done)return false;s.pokes++;return true;}
function next(s){if(s.done||!s.records[s.index])return false;if(s.index===s.items.length-1)s.done=true;else s.index++;return true;}
function counts(s){return reactions.map((_,i)=>s.records.filter(r=>r.reaction===i).length);}
return {items,reactions,create,react,poke,next,counts,shuffle};});
