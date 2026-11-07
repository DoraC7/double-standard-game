(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BiologyExplorer=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{'use strict';
const topics={"body": "身體構造", "cycle": "生命週期", "ecology": "生態關係", "observe": "友善觀察"};
const sources={"woodlouse":["Animal Diversity Web｜鼠婦的構造與生態","https://animaldiversity.org/accounts/Armadillidium_vulgare/"],"arthropods": ["OpenStax｜節肢動物", "https://openstax.org/books/biology-2e/pages/28-6-superphylum-ecdysozoa-arthropods"], "molluscs": ["OpenStax｜軟體動物與環節動物", "https://openstax.org/books/biology-2e/pages/28-4-superphylum-lophotrochozoa-molluscs-and-annelids"], "mammals": ["OpenStax｜哺乳動物", "https://openstax.org/books/biology-2e/pages/29-6-mammals"], "frogs": ["OpenStax｜兩生類", "https://openstax.org/books/biology-2e/pages/29-3-amphibians"], "fungi": ["OpenStax｜真菌的生態", "https://openstax.org/books/biology-2e/pages/24-3-ecology-of-fungi"], "flowers": ["OpenStax｜授粉與受精", "https://openstax.org/books/biology-2e/pages/32-2-pollination-and-fertilization"], "mosquito": ["CDC｜斑蚊生命週期", "https://www.cdc.gov/mosquitoes/about/life-cycle-of-aedes-mosquitoes.html"], "energy": ["OpenStax｜生態系的能量流動", "https://openstax.org/books/biology-2e/pages/46-2-energy-flow-through-ecosystems"], "science": ["OpenStax｜科學方法", "https://openstax.org/books/biology-2e/pages/1-1-the-science-of-biology"]};
const questions=[
  {
    "id": "body-1",
    "topic": "body",
    "title": "蜘蛛不是昆蟲",
    "icon": "🕷️",
    "display": "放大照片：成體蜘蛛有4對步足，沒有觸角。",
    "prompt": "這些構造較支持哪個分類？",
    "options": [
      "昆蟲：成體通常3對步足",
      "蛛形綱：蜘蛛有4對步足",
      "只要小小的都是昆蟲"
    ],
    "answer": 1,
    "why": "蜘蛛屬蛛形綱，不是昆蟲。昆蟲成體通常有3對步足與1對觸角；蜘蛛有4對步足、沒有觸角。分類要看構造，不是看大小或讓不讓人害怕。",
    "source": "arthropods"
  },
  {
    "id": "body-2",
    "topic": "body",
    "title": "蝸牛的腳在哪裡",
    "icon": "🐌",
    "display": "蝸牛沿著玻璃緩慢移動，腹面有一大片肌肉貼著表面。",
    "prompt": "這片主要幫助移動的構造是什麼？",
    "options": [
      "腹足，是肌肉質的足",
      "用來飛行的翅膀",
      "六隻縮起來的昆蟲腳"
    ],
    "answer": 0,
    "why": "蝸牛是腹足類軟體動物，利用肌肉質的足移動，黏液也能幫助移動。牠不是沒有腳，只是足的形狀與貓狗不同。殼也不是用來行走的足。",
    "source": "molluscs"
  },
  {
    "id": "body-3",
    "topic": "body",
    "title": "會飛不一定是鳥",
    "icon": "🦇",
    "display": "動物資料卡：蝙蝠有毛、用肺呼吸，雌性會分泌乳汁哺育幼獸。",
    "prompt": "這些特徵支持牠屬於哪一類？",
    "options": [
      "因為會飛，所以是鳥",
      "因為夜間活動，所以是昆蟲",
      "哺乳動物"
    ],
    "answer": 2,
    "why": "蝙蝠是哺乳動物；毛與哺乳等特徵支持這個分類。會飛是一種移動能力，不是鳥類專屬的分類條件；鳥、昆蟲和蝙蝠的翅膀構造也不相同。",
    "source": "mammals"
  },
  {
    "id": "body-4",
    "topic": "body",
    "title": "鼠婦不是小昆蟲",
    "icon": "🪵",
    "display": "放大照片：陸生鼠婦成體有7對步足，身體背面像一片片小甲板。",
    "prompt": "哪個說法正確？",
    "options": [
      "牠是甲殼類，不能因為在陸地上就當成昆蟲",
      "有硬外殼就一定是昆蟲",
      "牠住土裡，所以是植物"
    ],
    "answer": 0,
    "why": "鼠婦是等足目的甲殼類動物，成體有7對步足。昆蟲成體通常是3對步足；住在陸地、個頭小、有外骨骼，都不足以單獨判定是昆蟲。",
    "source": "woodlouse"
  },
  {
    "id": "cycle-5",
    "topic": "cycle",
    "title": "蝴蝶的一生",
    "icon": "🦋",
    "display": "觀察卡：卵、吃葉子的幼蟲、蛹、有翅的成蟲，四張紀錄卡被打亂。",
    "prompt": "蝴蝶典型的生命週期順序是？",
    "options": [
      "卵 → 蛹 → 幼蟲 → 成蟲",
      "卵 → 幼蟲 → 蛹 → 成蟲",
      "幼蟲 → 卵 → 成蟲 → 蛹"
    ],
    "answer": 1,
    "why": "蝴蝶是完全變態的昆蟲，經過卵、幼蟲、蛹、成蟲四個階段。毛毛蟲是幼蟲，不是蝴蝶的另一個物種；蛹也是發育階段，不是已經死亡。",
    "source": "arthropods"
  },
  {
    "id": "cycle-6",
    "topic": "cycle",
    "title": "青蛙不是放大版蝌蚪",
    "icon": "🐸",
    "display": "常見蛙類紀錄：幼期有尾、主要以鰓呼吸；變態時長出四肢，尾巴逐漸被吸收。",
    "prompt": "較合理的解釋是？",
    "options": [
      "只是體型變大，構造沒有變化",
      "蝌蚪一定是魚，後來才換物種",
      "同一隻動物發育時，身體構造也在改變"
    ],
    "answer": 2,
    "why": "常見蛙類會從蝌蚪經過變態成蛙，不只是等比例變大。呼吸、身體構造與生活方式都會改變；成蛙常利用肺與皮膚進行氣體交換。不同蛙種的發育方式仍有差異。",
    "source": "frogs"
  },
  {
    "id": "cycle-7",
    "topic": "cycle",
    "title": "斑蚊從哪裡來",
    "icon": "🦟",
    "display": "斑蚊資料卡：卵、生活在水中的幼蟲（孑孓）、水中的蛹、成蚊。",
    "prompt": "想減少住家周圍孑孓，哪個做法有根據？",
    "options": [
      "定期清除容器積水，並刷洗容器內壁",
      "只把容器搬到看不到的角落",
      "只要水看起來乾淨，就不會有蚊子"
    ],
    "answer": 0,
    "why": "斑蚊的幼蟲與蛹需要水，卵可附在容器內壁、水線附近。定期倒掉積水並刷洗內壁，比只換位置有效；清澈的小容器積水也可能繁殖斑蚊。這不表示所有蚊種都只在容器繁殖。",
    "source": "mosquito"
  },
  {
    "id": "cycle-8",
    "topic": "cycle",
    "title": "不是每種昆蟲都有蛹",
    "icon": "🦗",
    "display": "圖鑑記錄：蝗蟲的卵孵出若蟲，若蟲多次蛻皮後成為成蟲，沒有蛹期。",
    "prompt": "能得到哪個結論？",
    "options": [
      "蝗蟲不是昆蟲",
      "昆蟲的發育方式不只一種",
      "圖鑑漏掉蛹，因為所有昆蟲一定有蛹"
    ],
    "answer": 1,
    "why": "蝗蟲屬不完全變態，典型過程是卵、若蟲、成蟲，沒有蛹期。蝴蝶則是完全變態；不能把一種昆蟲的生命週期當成所有昆蟲都相同。",
    "source": "arthropods"
  },
  {
    "id": "ecology-9",
    "topic": "ecology",
    "title": "蜜蜂帶走的不只花蜜",
    "icon": "🐝",
    "display": "蜜蜂離開花朵時，身上沾有花粉；之後又停在另一朵同種植物的花上。",
    "prompt": "花粉若被帶到適合的柱頭，可能幫助什麼？",
    "options": [
      "授粉",
      "把花變成蜜蜂",
      "讓所有花粉直接變成種子"
    ],
    "answer": 0,
    "why": "授粉是花粉到達適合的柱頭。蜜蜂等動物可協助運送花粉，但授粉不等於已經完成受精；還需要後續過程，才能形成種子。不是所有植物都靠蜜蜂授粉。",
    "source": "flowers"
  },
  {
    "id": "ecology-10",
    "topic": "ecology",
    "title": "菇類不是小植物",
    "icon": "🍄",
    "display": "生物資料卡：這種菇的菌絲分解落葉中的有機物，再吸收養分；不進行光合作用。",
    "prompt": "這個例子中的真菌扮演什麼角色？",
    "options": [
      "生產者，靠陽光製造養分",
      "分解者，協助物質循環",
      "只要固定在地上就是植物"
    ],
    "answer": 1,
    "why": "真菌不是植物。這個分解落葉的例子中，菌絲在體外分解有機物並吸收養分，促進物質循環。不過真菌也有共生或寄生等生活方式，並非每種真菌都只扮演分解者。",
    "source": "fungi"
  },
  {
    "id": "ecology-11",
    "topic": "ecology",
    "title": "蚯蚓幫土壤做了什麼",
    "icon": "🪱",
    "display": "觀察紀錄：蚯蚓鑽過土壤，也攝食含有腐植質的物質；地表可看到牠排出的糞土。",
    "prompt": "哪個解釋較合理？",
    "options": [
      "蚯蚓鑽洞只會讓土壤完全失去養分",
      "蚯蚓會把土壤變成塑膠",
      "掘穴與攝食活動能影響土壤結構與有機物處理"
    ],
    "answer": 2,
    "why": "蚯蚓的掘穴與攝食會改變土壤結構，並參與有機物的處理。牠不是把石頭變成養分的魔法師；不同環境中的影響也不同，不應把蚯蚓任意移放到野外。",
    "source": "molluscs"
  },
  {
    "id": "ecology-12",
    "topic": "ecology",
    "title": "草地上的能量路線",
    "icon": "🌱",
    "display": "簡化食物鏈：草 → 蝗蟲 → 蛙。箭頭在這裡表示食物中的能量傳遞方向。",
    "prompt": "哪個說法符合這張圖？",
    "options": [
      "蛙的能量會全部回到草裡循環",
      "草能利用光能製造有機物，蝗蟲取食草後取得部分能量",
      "每一層都能得到上一層的全部能量"
    ],
    "answer": 1,
    "why": "草是生產者，利用光合作用將光能轉為有機物中的化學能。能量沿食物關係傳遞時，有部分用於生命活動並以熱散失，並非全部傳到下一層；物質能循環，能量的流動方式不同。",
    "source": "energy"
  },
  {
    "id": "observe-13",
    "topic": "observe",
    "title": "看到一隻，不等於全部",
    "icon": "🐜",
    "display": "你只追蹤了一隻螞蟻，發現牠繞路；同伴說「所以螞蟻都不會走直線」。",
    "prompt": "這份紀錄支持到什麼程度？",
    "options": [
      "所有種類、所有時間的螞蟻都如此",
      "只能描述這次這隻的路線，還需要更多觀察",
      "只要結論聽起來有趣，就不需要紀錄"
    ],
    "answer": 1,
    "why": "一隻螞蟻的一次路線，不能代表所有螞蟻。可以在不干擾牠們的情況下記錄更多個體、時間與環境，再比較是否有一致模式；也要區分實際看到的事與對原因的猜測。",
    "source": "science"
  },
  {
    "id": "observe-14",
    "topic": "observe",
    "title": "潮濕處看到蝸牛",
    "icon": "🐌",
    "display": "三個雨後晚上看到蝸牛，乾燥白天沒看到；沒有記錄白天的躲藏處。",
    "prompt": "哪個結論最符合目前資料？",
    "options": [
      "蝸牛碰到陽光一定立刻死亡",
      "水會讓石頭變成蝸牛",
      "這幾次觀察中，雨後晚上較容易看到；原因還需查證"
    ],
    "answer": 2,
    "why": "目前紀錄是出現時段的關聯，不是證明單一原因。濕度、溫度、時段與躲藏位置都可能影響是否看得到。補記條件、比較多次觀察，比把動物抓來曝曬更合適。",
    "source": "science"
  },
  {
    "id": "observe-15",
    "topic": "observe",
    "title": "綠豆發芽怎麼比較",
    "icon": "🌱",
    "display": "想研究水量：A組綠豆放窗邊且每天少量水；B組放暗櫃且每天大量水。",
    "prompt": "這個設計最大的問題是？",
    "options": [
      "同時改變光照與水量，難把差異只歸因於水量",
      "每組有綠豆，所以不能比較",
      "植物發芽不能留下任何紀錄"
    ],
    "answer": 0,
    "why": "若要比較水量，其他條件例如種子來源、數量、容器、光照與溫度應盡量相同，並有多顆種子與重複觀察。A/B同時改光照與水量，即使結果不同也不能只歸因於水量。",
    "source": "science"
  },
  {
    "id": "observe-16",
    "topic": "observe",
    "title": "觀察，不用抓回家",
    "icon": "🔎",
    "display": "公園裡發現不熟悉的小動物，想記錄牠的外形、動作和棲地。",
    "prompt": "哪個方法最適合這次的非侵入式觀察？",
    "options": [
      "先抓回家，辨識完再放到另一個公園",
      "保持距離拍照，記下地點、時間與動作，不碰觸或餵食",
      "追趕牠，讓牠表演不同動作"
    ],
    "answer": 1,
    "why": "保持距離、記錄外形與環境，可以留下可比較的觀察資料，也減少改變動物原有行為。這是本館的非侵入式觀察守則，不是捕捉或飼養教學；不認識的動物不要任意碰觸、餵食或移放。",
    "source": "science"
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
return {topics,questions,sources,create,select,submit,retry,next,shuffle};
});
