(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MischiefSchool=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{'use strict';
const scenes=[
  {
    "id": "office-1",
    "topic": "office",
    "title": "會議開場音效",
    "goal": "讓一聲嘎嘎打斷卡通會議的安靜開場。",
    "target": 0,
    "props": [
      {
        "label": "發條鴨",
        "effect": "quack",
        "note": "鴨鴨搶麥，龍蝦的會議變成嘎嘎演唱會。",
        "cleanup": "收回發條鴨，停止嘎嘎聲"
      },
      {
        "label": "紙皇冠",
        "effect": "crown",
        "note": "龍蝦戴上紙皇冠，現場進入浮誇加冕典禮。",
        "cleanup": "取下紙皇冠，放回道具箱"
      },
      {
        "label": "紙彩帶",
        "effect": "confetti",
        "note": "紙彩帶落滿舞台，龍蝦站上自己的慶功現場。",
        "cleanup": "收好舞台上的紙彩帶"
      }
    ]
  },
  {
    "id": "office-2",
    "topic": "office",
    "title": "摸魚王加冕",
    "goal": "讓龍蝦頭上出現一頂紙皇冠。",
    "target": 1,
    "props": [
      {
        "label": "發條鴨",
        "effect": "quack",
        "note": "鴨鴨搶麥，龍蝦的會議變成嘎嘎演唱會。",
        "cleanup": "收回發條鴨，停止嘎嘎聲"
      },
      {
        "label": "紙皇冠",
        "effect": "crown",
        "note": "龍蝦戴上紙皇冠，現場進入浮誇加冕典禮。",
        "cleanup": "取下紙皇冠，放回道具箱"
      },
      {
        "label": "紙彩帶",
        "effect": "confetti",
        "note": "紙彩帶落滿舞台，龍蝦站上自己的慶功現場。",
        "cleanup": "收好舞台上的紙彩帶"
      }
    ]
  },
  {
    "id": "office-3",
    "topic": "office",
    "title": "簡報結尾撒花",
    "goal": "讓舞台出現一片紙彩帶慶功效果。",
    "target": 2,
    "props": [
      {
        "label": "發條鴨",
        "effect": "quack",
        "note": "鴨鴨搶麥，龍蝦的會議變成嘎嘎演唱會。",
        "cleanup": "收回發條鴨，停止嘎嘎聲"
      },
      {
        "label": "紙皇冠",
        "effect": "crown",
        "note": "龍蝦戴上紙皇冠，現場進入浮誇加冕典禮。",
        "cleanup": "取下紙皇冠，放回道具箱"
      },
      {
        "label": "紙彩帶",
        "effect": "confetti",
        "note": "紙彩帶落滿舞台，龍蝦站上自己的慶功現場。",
        "cleanup": "收好舞台上的紙彩帶"
      }
    ]
  },
  {
    "id": "office-4",
    "topic": "office",
    "title": "午休起床號",
    "goal": "讓發條鴨替卡通龍蝦唱嘎嘎起床歌。",
    "target": 0,
    "props": [
      {
        "label": "發條鴨",
        "effect": "quack",
        "note": "鴨鴨搶麥，龍蝦的會議變成嘎嘎演唱會。",
        "cleanup": "收回發條鴨，停止嘎嘎聲"
      },
      {
        "label": "紙皇冠",
        "effect": "crown",
        "note": "龍蝦戴上紙皇冠，現場進入浮誇加冕典禮。",
        "cleanup": "取下紙皇冠，放回道具箱"
      },
      {
        "label": "紙彩帶",
        "effect": "confetti",
        "note": "紙彩帶落滿舞台，龍蝦站上自己的慶功現場。",
        "cleanup": "收好舞台上的紙彩帶"
      }
    ]
  },
  {
    "id": "party-1",
    "topic": "party",
    "title": "泡泡安可曲",
    "goal": "替卡通龍蝦加上一場泡泡安可。",
    "target": 0,
    "props": [
      {
        "label": "泡泡機",
        "effect": "bubbles",
        "note": "泡泡飄過舞台，龍蝦變成泡泡演唱會主角。",
        "cleanup": "關掉泡泡機，收回泡泡道具"
      },
      {
        "label": "繫繩氣球",
        "effect": "float",
        "note": "繫在紙帽上的卡通氣球把帽子托上半空。",
        "cleanup": "拉回繫繩，收好氣球紙帽"
      },
      {
        "label": "彩色舞台燈",
        "effect": "disco",
        "note": "彩色光斑照上舞台，龍蝦原地開起迪斯可。",
        "cleanup": "關掉彩色舞台燈"
      }
    ]
  },
  {
    "id": "party-2",
    "topic": "party",
    "title": "紙帽升空秀",
    "goal": "讓繫著繩子的紙帽在卡通舞台上浮起來。",
    "target": 1,
    "props": [
      {
        "label": "泡泡機",
        "effect": "bubbles",
        "note": "泡泡飄過舞台，龍蝦變成泡泡演唱會主角。",
        "cleanup": "關掉泡泡機，收回泡泡道具"
      },
      {
        "label": "繫繩氣球",
        "effect": "float",
        "note": "繫在紙帽上的卡通氣球把帽子托上半空。",
        "cleanup": "拉回繫繩，收好氣球紙帽"
      },
      {
        "label": "彩色舞台燈",
        "effect": "disco",
        "note": "彩色光斑照上舞台，龍蝦原地開起迪斯可。",
        "cleanup": "關掉彩色舞台燈"
      }
    ]
  },
  {
    "id": "party-3",
    "topic": "party",
    "title": "突然開始跳舞",
    "goal": "讓舞台出現彩色迪斯可光斑。",
    "target": 2,
    "props": [
      {
        "label": "泡泡機",
        "effect": "bubbles",
        "note": "泡泡飄過舞台，龍蝦變成泡泡演唱會主角。",
        "cleanup": "關掉泡泡機，收回泡泡道具"
      },
      {
        "label": "繫繩氣球",
        "effect": "float",
        "note": "繫在紙帽上的卡通氣球把帽子托上半空。",
        "cleanup": "拉回繫繩，收好氣球紙帽"
      },
      {
        "label": "彩色舞台燈",
        "effect": "disco",
        "note": "彩色光斑照上舞台，龍蝦原地開起迪斯可。",
        "cleanup": "關掉彩色舞台燈"
      }
    ]
  },
  {
    "id": "party-4",
    "topic": "party",
    "title": "泡泡合照亭",
    "goal": "替合照加上漂浮泡泡，不是彩色燈光。",
    "target": 0,
    "props": [
      {
        "label": "泡泡機",
        "effect": "bubbles",
        "note": "泡泡飄過舞台，龍蝦變成泡泡演唱會主角。",
        "cleanup": "關掉泡泡機，收回泡泡道具"
      },
      {
        "label": "繫繩氣球",
        "effect": "float",
        "note": "繫在紙帽上的卡通氣球把帽子托上半空。",
        "cleanup": "拉回繫繩，收好氣球紙帽"
      },
      {
        "label": "彩色舞台燈",
        "effect": "disco",
        "note": "彩色光斑照上舞台，龍蝦原地開起迪斯可。",
        "cleanup": "關掉彩色舞台燈"
      }
    ]
  },
  {
    "id": "lab-1",
    "topic": "lab",
    "title": "龍蝦騰雲術",
    "goal": "用玩具棉花雲讓舞台看起來像雲端。",
    "target": 0,
    "props": [
      {
        "label": "棉花雲道具",
        "effect": "cloud",
        "note": "白色棉花雲道具蓋上舞台，龍蝦彷彿住進雲裡。",
        "cleanup": "把棉花雲道具放回盒子"
      },
      {
        "label": "磁力積木",
        "effect": "robot",
        "note": "磁力積木在卡通舞台拼成一隻小機器人。",
        "cleanup": "拆回磁力積木，收入積木盒"
      },
      {
        "label": "彈簧紙帽",
        "effect": "bounce",
        "note": "彈簧紙帽在龍蝦頭上彈呀彈，龍蝦變成驚喜箱。",
        "cleanup": "收起彈簧紙帽並扣好玩具盒"
      }
    ]
  },
  {
    "id": "lab-2",
    "topic": "lab",
    "title": "機器人來串門",
    "goal": "讓磁力積木小機器人出現在舞台。",
    "target": 1,
    "props": [
      {
        "label": "棉花雲道具",
        "effect": "cloud",
        "note": "白色棉花雲道具蓋上舞台，龍蝦彷彿住進雲裡。",
        "cleanup": "把棉花雲道具放回盒子"
      },
      {
        "label": "磁力積木",
        "effect": "robot",
        "note": "磁力積木在卡通舞台拼成一隻小機器人。",
        "cleanup": "拆回磁力積木，收入積木盒"
      },
      {
        "label": "彈簧紙帽",
        "effect": "bounce",
        "note": "彈簧紙帽在龍蝦頭上彈呀彈，龍蝦變成驚喜箱。",
        "cleanup": "收起彈簧紙帽並扣好玩具盒"
      }
    ]
  },
  {
    "id": "lab-3",
    "topic": "lab",
    "title": "頭頂驚喜箱",
    "goal": "讓龍蝦的紙帽變成彈跳驚喜效果。",
    "target": 2,
    "props": [
      {
        "label": "棉花雲道具",
        "effect": "cloud",
        "note": "白色棉花雲道具蓋上舞台，龍蝦彷彿住進雲裡。",
        "cleanup": "把棉花雲道具放回盒子"
      },
      {
        "label": "磁力積木",
        "effect": "robot",
        "note": "磁力積木在卡通舞台拼成一隻小機器人。",
        "cleanup": "拆回磁力積木，收入積木盒"
      },
      {
        "label": "彈簧紙帽",
        "effect": "bounce",
        "note": "彈簧紙帽在龍蝦頭上彈呀彈，龍蝦變成驚喜箱。",
        "cleanup": "收起彈簧紙帽並扣好玩具盒"
      }
    ]
  },
  {
    "id": "lab-4",
    "topic": "lab",
    "title": "今日多雲",
    "goal": "讓卡通舞台再次出現白色棉花雲，不是機器人。",
    "target": 0,
    "props": [
      {
        "label": "棉花雲道具",
        "effect": "cloud",
        "note": "白色棉花雲道具蓋上舞台，龍蝦彷彿住進雲裡。",
        "cleanup": "把棉花雲道具放回盒子"
      },
      {
        "label": "磁力積木",
        "effect": "robot",
        "note": "磁力積木在卡通舞台拼成一隻小機器人。",
        "cleanup": "拆回磁力積木，收入積木盒"
      },
      {
        "label": "彈簧紙帽",
        "effect": "bounce",
        "note": "彈簧紙帽在龍蝦頭上彈呀彈，龍蝦變成驚喜箱。",
        "cleanup": "收起彈簧紙帽並扣好玩具盒"
      }
    ]
  }
];
const topics={office:'龍蝦會議室',party:'派對加戲場',lab:'玩具實驗室'};
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function create(mode='short'){
 if(!['short','all',...Object.keys(topics)].includes(mode))throw Error('不支援的模式');
 const items=mode==='short'?shuffle(Object.keys(topics).flatMap(t=>shuffle(scenes.filter(s=>s.topic===t)).slice(0,2))):shuffle(scenes.filter(s=>mode==='all'||s.topic===mode));
 return {items,index:0,phase:'prop',selected:null,branch:null,records:[],done:false};
}
function select(s,n){if(s.done||!['prop','cleanup'].includes(s.phase)||!Number.isInteger(n)||n<0||n>2)return false;s.selected=n;return true;}
function confirm(s){
 if(s.done||s.selected===null||!['prop','cleanup'].includes(s.phase))return false;
 const scene=s.items[s.index],n=s.selected,r=s.records[s.index]??={tries:0};
 if(s.phase==='prop'){
  s.branch=n;r.tries++;r.firstBranch??=n;r.lastBranch=n;r.propFirst??=n===scene.target;r.propLatest=n===scene.target;s.phase='outcome';
 }else{
  r.cleanFirst??=n===s.branch;r.cleanLatest=n===s.branch;r.cleanup=n;s.phase='feedback';
 }
 s.selected=null;return true;
}
function next(s){if(s.done)return false;if(s.phase==='outcome'){s.phase='cleanup';s.selected=null;return true;}if(s.phase!=='feedback')return false;
 if(s.index===s.items.length-1){s.done=true;s.phase='done';}else {s.index++;s.phase='prop';s.selected=null;s.branch=null;}return true;
}
function retry(s){if(s.done||s.phase!=='feedback')return false;s.phase='prop';s.selected=null;s.branch=null;return true;}
function scores(s){return {first:s.records.reduce((n,r)=>n+Number(r.propFirst===true)+Number(r.cleanFirst===true),0),latest:s.records.reduce((n,r)=>n+Number(r.propLatest===true)+Number(r.cleanLatest===true),0)};}
return {scenes,topics,create,select,confirm,next,retry,scores,shuffle};});
