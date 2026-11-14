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
questions.push(
 {id:'body-5',topic:'body',title:'蝙蝠的手變成翅膀',icon:'🦇',display:'蝙蝠翅膀展開可見細長手指骨支撐翼膜。',prompt:'這些骨骼最能說明什麼？',options:['蝙蝠是哺乳類，前肢特化成翅膀','蝙蝠是有羽毛的鳥','翼膜是沒有骨骼的外套'],answer:0,why:'蝙蝠是哺乳類，前肢骨骼與翼膜構成翅膀；能飛不代表就是鳥類。',source:'mammals'},
 {id:'body-6',topic:'body',title:'哺乳動物的共同線索',icon:'🐾',display:'觀察到動物有毛，雌性會以乳汁哺育幼體。',prompt:'哪個分類最符合這些特徵？',options:['哺乳類','昆蟲','魚類'],answer:0,why:'毛髮與乳腺是哺乳類的重要特徵；單看生活環境或體型不足以分類。',source:'mammals'},
 {id:'body-7',topic:'body',title:'鼠婦不是昆蟲',icon:'🪵',display:'鼠婦有分節外骨骼與多對步足，常在潮濕處活動。',prompt:'它屬於哪一大類？',options:['甲殼類節肢動物','昆蟲，因為有六隻腳','環節動物，因為身體有分節'],answer:0,why:'鼠婦是等足目甲殼類，不是昆蟲；分類要看具體構造，不能只看分節。',source:'woodlouse'},
 {id:'body-8',topic:'body',title:'蝸牛殼是外套膜形成',icon:'🐚',display:'蝸牛背上有一個螺旋形硬殼。',prompt:'殼的主要功能和來源較接近哪個說法？',options:['由外套膜分泌形成，可提供保護','是蝸牛的骨骼，由足長出','是搬運食物的翅膀'],answer:0,why:'許多腹足類由外套膜形成碳酸鈣殼，作為保護構造；殼不是牠的足。',source:'molluscs'},
 {id:'body-9',topic:'body',title:'昆蟲有三對步足',icon:'🪲',display:'照片中昆蟲有三對胸部步足與一對觸角。',prompt:'哪個描述符合昆蟲的基本構造？',options:['三對步足接在胸部','四對步足接在腹部','有幾對腳都算昆蟲'],answer:0,why:'成體昆蟲通常有頭、胸、腹三部分，三對步足接在胸部；幼期外觀可能不同。',source:'arthropods'},
 {id:'body-10',topic:'body',title:'外骨骼要定期換',icon:'🦗',display:'昆蟲成長時，外層硬殼不會跟著身體一直變大。',prompt:'牠如何繼續長大？',options:['脫去舊外骨骼，再形成較大的新外骨骼','把外骨骼像氣球一樣吹大','長出內骨骼取代所有外殼'],answer:0,why:'節肢動物透過蛻皮成長；蛻皮期間較脆弱，並非殼會不斷伸展。',source:'arthropods'},
 {id:'body-11',topic:'body',title:'蚯蚓沒有腳也能移動',icon:'🪱',display:'蚯蚓身體伸長、縮短，細小剛毛接觸土壤。',prompt:'哪項幫助牠在土中移動？',options:['肌肉收縮配合剛毛固定','昆蟲的六隻腳','用翅膀挖土'],answer:0,why:'環節動物藉由體壁肌肉與剛毛協助移動，沒有昆蟲式步足。',source:'molluscs'},
 {id:'body-12',topic:'body',title:'蛙的皮膚也參與交換',icon:'🐸',display:'蛙皮保持濕潤，牠也會用肺呼吸。',prompt:'最合理的理解是？',options:['蛙可透過肺與濕潤皮膚進行氣體交換','蛙只靠乾燥皮膚呼吸','所有兩生類一生都只用鰓'],answer:0,why:'成蛙通常用肺及皮膚呼吸；不同物種與生活階段會有差異。',source:'frogs'},
 {id:'body-13',topic:'body',title:'蜘蛛絲不只一種用途',icon:'🕸️',display:'蜘蛛能吐絲，有些結網捕食，有些用絲包裹卵。',prompt:'哪項結論有根據？',options:['蛛絲可有多種功能，不是每種蜘蛛都靠網捕食','所有蜘蛛都結相同形狀的網','蛛絲是昆蟲翅膀'],answer:0,why:'蛛絲用途包含捕食、移動與保護卵等，不同蜘蛛策略不同。',source:'arthropods'},
 {id:'body-14',topic:'body',title:'貝殼裡的身體',icon:'🦪',display:'蛤蜊有兩片殼，柔軟身體藏在殼內。',prompt:'蛤蜊屬於哪類動物？',options:['雙殼類軟體動物','昆蟲','脊椎動物'],answer:0,why:'蛤蜊是雙殼類軟體動物；硬殼不代表牠有脊椎。',source:'molluscs'},
 {id:'body-15',topic:'body',title:'羽毛是鳥類的特徵',icon:'🪶',display:'動物身上有羽毛，前肢形成翅膀。',prompt:'哪個分類最符合？',options:['鳥類','蝙蝠等哺乳類','昆蟲'],answer:0,why:'羽毛是鳥類的辨識特徵；蝙蝠也會飛，但沒有羽毛而是哺乳類。',source:'mammals'},
 {id:'bio-extra-cycle-5',topic:'cycle',title:'蛙卵在水裡開始',icon:'🥚',display:'蛙卵孵化出蝌蚪，之後長出後腿、前腿並逐漸形成肺。',prompt:'這個變化叫什麼？',options:['變態發育','直接長成小魚','脫去一次外骨骼'],answer:0,why:'典型蛙類會經歷蝌蚪到成蛙的變態，形態與呼吸構造隨階段改變。',source:'frogs'},
 {id:'bio-extra-cycle-6',topic:'cycle',title:'蝴蝶蛹不是休眠的成蝶',icon:'🦋',display:'毛毛蟲形成蛹，蛹內發生劇烈的身體重組。',prompt:'接著最可能出現什麼？',options:['成蝶，完成完全變態','另一隻毛毛蟲，形態不變','蛹本身就是成蝶'],answer:0,why:'蝴蝶經過卵、幼蟲、蛹、成蟲的完全變態；蛹期不是成蟲。',source:'arthropods'},
 {id:'bio-extra-cycle-7',topic:'cycle',title:'蚊子幼蟲生活在水中',icon:'🦟',display:'斑蚊卵孵化後，幼蟲在積水中發育，蛹再羽化為成蚊。',prompt:'清除積水主要打斷哪個環節？',options:['幼蟲與蛹的水生發育場所','成蚊的羽毛生長','蝴蝶的授粉階段'],answer:0,why:'斑蚊需積水完成幼蟲與蛹階段；定期清除積水可減少孳生源。',source:'mosquito'},
 {id:'bio-extra-cycle-8',topic:'cycle',title:'草蜢是不完全變態',icon:'🦗',display:'草蜢若蟲外形像小型成蟲，逐次蛻皮並長出翅芽。',prompt:'哪項符合這種發育？',options:['若蟲逐漸長成成蟲，沒有蛹期','一定先結蛹再羽化','若蟲是另一個物種'],answer:0,why:'蝗蟲等不完全變態昆蟲由若蟲逐步長成成蟲，沒有蛹期。',source:'arthropods'},
 {id:'cycle-9',topic:'cycle',title:'種子發芽需要合適條件',icon:'🌱',display:'種子吸水後胚根先伸出，之後幼苗長出葉片。',prompt:'哪個說法較準確？',options:['發芽需要適合的水分、氧氣與溫度，需求因物種而異','每種種子都需要強光才能發芽','種子吸水就保證一定成活'],answer:0,why:'種子發芽條件因物種而異，吸水是常見起始條件之一，但不保證後續存活。',source:'science'},
 {id:'cycle-10',topic:'cycle',title:'花粉管把精細胞送往胚珠',icon:'🌼',display:'花粉落到柱頭後，花粉管朝胚珠方向生長。',prompt:'接下來可能發生哪個過程？',options:['精細胞經花粉管到達胚珠並完成受精','花粉直接變成種子','柱頭變成根'],answer:0,why:'被子植物的花粉管協助精細胞到達胚珠；受精後胚珠可發育為種子。',source:'flowers'},
 {id:'cycle-11',topic:'cycle',title:'種子與果實不是同一構造',icon:'🍎',display:'開花植物受精後，子房與胚珠分別發育。',prompt:'通常哪個對應正確？',options:['子房發育成果實，胚珠發育成種子','子房變成葉，胚珠變成花粉','果實與種子都是根'],answer:0,why:'典型被子植物受精後子房發育成果實，胚珠發育成種子；細節因植物而異。',source:'flowers'},
 {id:'cycle-12',topic:'cycle',title:'真菌孢子萌發成菌絲',icon:'🍄',display:'適合條件下，真菌孢子萌發並形成菌絲網。',prompt:'哪個理解合理？',options:['孢子可發育成菌絲，菌絲再形成真菌個體結構','孢子是動物的卵','所有孢子都能立刻長成可食用菇'],answer:0,why:'真菌孢子在合適條件下可萌發成菌絲；不能據此判斷野外菇類可食。',source:'fungi'},
 {id:'cycle-13',topic:'cycle',title:'生命週期會受環境影響',icon:'🌡️',display:'同種昆蟲在不同溫度下，發育所需時間可能不同。',prompt:'比較發育速度時應注意什麼？',options:['控制其他條件並重複觀察，不能只比較一次','看到一次差異就說溫度是唯一原因','把不同物種混在一起比較'],answer:0,why:'溫度可能影響發育，但食物、濕度與個體差異也可能作用；公平比較需控制變因。',source:'science'},
 {id:'cycle-14',topic:'cycle',title:'幼鳥會離巢但仍需照顧',icon:'🐣',display:'羽毛未成熟的小鳥在地面，附近可能有親鳥。',prompt:'哪個做法較適當？',options:['先保持距離觀察，確認是否受傷或身處危險再求助','立刻帶回家飼養','為了拍照把牠放到高處'],answer:0,why:'離巢幼鳥可能仍由親鳥照顧；避免不必要搬動，若確有受傷或危險可聯繫野生動物救援單位。',source:'mammals'},
 {id:'cycle-15',topic:'cycle',title:'生命週期不是每種都一樣',icon:'🔄',display:'比較蝴蝶、蚱蜢與蛙的發育圖。',prompt:'哪個說法最好？',options:['不同類群的階段與變態方式不同','所有動物都經過蛹期','長大只是把身體等比例放大'],answer:0,why:'生命週期依類群而異；昆蟲可有完全或不完全變態，蛙也有蝌蚪階段。',source:'science'},
 {id:'ecology-5',topic:'ecology',title:'真菌是分解者',icon:'🍄',display:'落葉逐漸被真菌菌絲分解，物質回到環境。',prompt:'真菌在這裡扮演什麼角色？',options:['分解者，分解有機物並促進物質循環','生產者，靠葉綠素製造所有食物','消費者，只能捕捉大型動物'],answer:0,why:'許多真菌分解有機物，讓養分回到生態系；真菌沒有葉綠素。',source:'fungi'},
 {id:'ecology-6',topic:'ecology',title:'授粉者與花的互動',icon:'🐝',display:'蜜蜂訪花時身上沾到花粉，接著訪問同種植物另一朵花。',prompt:'可能促成什麼？',options:['花粉轉移並有機會促成授粉','蜜蜂直接變成種子','每次訪花都保證成功受精'],answer:0,why:'訪花可促進花粉轉移，但是否成功授粉與受精還受多種條件影響。',source:'flowers'},
 {id:'ecology-7',topic:'ecology',title:'食物鏈的箭頭方向',icon:'➡️',display:'草被兔子吃，兔子被狐狸捕食。',prompt:'能量流動箭頭應如何畫？',options:['草 → 兔子 → 狐狸','狐狸 → 兔子 → 草','箭頭只代表誰比較大'],answer:0,why:'食物鏈箭頭通常由被吃者指向取食者，表示能量傳遞方向。',source:'energy'},
 {id:'ecology-8',topic:'ecology',title:'能量不會完整傳到下一層',icon:'🔋',display:'生態系中，植物固定的能量經食物鏈傳遞。',prompt:'為什麼高營養階層可用能量通常較少？',options:['生物代謝與散熱等會消耗能量，傳遞並非百分之百','能量在每一層都自動增加','狐狸把能量存進毛皮所以不會流失'],answer:0,why:'能量在代謝、活動與散熱中轉移或耗散，不能將生態系能量循環與物質循環混為一談。',source:'energy'},
 {id:'bio-extra-ecology-9',topic:'ecology',title:'授粉不是蜜蜂專利',icon:'🌺',display:'花粉可由昆蟲、鳥類、蝙蝠或風等媒介移動。',prompt:'哪個結論合理？',options:['不同植物可依構造與環境使用不同授粉媒介','每種花都只能由蜜蜂授粉','風媒植物不會繁殖'],answer:0,why:'授粉媒介多樣；花的構造與生態環境會影響其授粉方式。',source:'flowers'},
 {id:'bio-extra-ecology-10',topic:'ecology',title:'外來種影響需看證據',icon:'🌿',display:'新出現的植物在某地快速增加，但尚未調查在地物種變化。',prompt:'目前可以說到哪裡？',options:['它數量增加；是否造成生態影響仍需比較資料','只要是外來就必定立即造成所有物種滅絕','它長得漂亮所以沒有影響'],answer:0,why:'來源與影響是不同問題；需調查分布、競爭與在地生態資料才能評估。',source:'science'},
 {id:'bio-extra-ecology-11',topic:'ecology',title:'蚯蚓與土壤',icon:'🪱',display:'蚯蚓活動使土壤形成孔隙，並把有機物混入土中。',prompt:'這可能帶來什麼影響？',options:['改變土壤通氣與物質分解，但效果依環境而異','保證任何土壤都變成肥沃農地','蚯蚓直接製造陽光'],answer:0,why:'蚯蚓可影響土壤結構與有機物分解；不同生態系與物種的效果不完全相同。',source:'science'},
 {id:'bio-extra-ecology-12',topic:'ecology',title:'捕食者不一定消滅獵物',icon:'🦊',display:'某地狐狸數量增加，兔子數量同期下降。',prompt:'下一步應如何判斷兩者關係？',options:['蒐集長期資料並檢查疾病、食物與棲地等其他因素','只憑同時變化就認定狐狸是唯一原因','假設數量下降代表兔子滅絕'],answer:0,why:'數量相關不證明單一因果；捕食、疾病、棲地與食物都可能影響族群。',source:'science'},
 {id:'ecology-13',topic:'ecology',title:'棲地碎裂的線索',icon:'🌳',display:'道路把一片連續林地分成兩塊，小型動物較難穿越。',prompt:'可能需要調查什麼？',options:['移動、繁殖與兩側族群連結是否改變','只調查樹木顏色','看到道路就斷定所有動物消失'],answer:0,why:'棲地碎裂可能影響移動與族群連結，但實際影響需依物種與地點調查。',source:'science'},
 {id:'ecology-14',topic:'ecology',title:'菌根互利也有條件',icon:'🌱',display:'部分真菌與植物根部形成菌根，交換礦物質與碳水化合物。',prompt:'哪個描述較精確？',options:['可能互利，但結果會隨物種與環境而變','真菌永遠只傷害植物','植物不需要光合作用'],answer:0,why:'菌根常涉及資源交換，但互動效果可能依條件改變，不宜一概而論。',source:'fungi'},
 {id:'ecology-15',topic:'ecology',title:'生態網比單條食物鏈複雜',icon:'🕸️',display:'一種鳥會吃昆蟲與果實，也可能被猛禽捕食。',prompt:'哪種圖較能呈現這些多重關係？',options:['多條相連的食物網','只畫一條永遠不變的直線','只列動物大小排名'],answer:0,why:'多數生物有多種食物與天敵，食物網比單一食物鏈能呈現更多關係。',source:'energy'},
 {id:'observe-5',topic:'observe',title:'把觀察和推論分開',icon:'🔎',display:'紀錄寫：「樹下有三片新鮮葉子，葉柄有咬痕。」',prompt:'哪項是尚未證實的推論？',options:['某隻兔子昨晚一定吃了葉子','找到三片葉子','葉柄有咬痕'],answer:0,why:'咬痕是觀察；由誰、何時造成則需要額外證據。',source:'science'},
 {id:'observe-6',topic:'observe',title:'比較時一次改一個條件',icon:'🧪',display:'想知道光照是否影響幼苗高度。',prompt:'哪種比較較有力？',options:['除光照外盡量保持水、土壤與幼苗條件一致並重複','一組天天澆水另一組不澆，還同時改光照','各挑一株外觀差異最大的幼苗'],answer:0,why:'控制其他條件可較清楚檢查光照的作用；重複測量也能看見個體差異。',source:'science'},
 {id:'observe-7',topic:'observe',title:'重複觀察避免偶然',icon:'📊',display:'一次測量顯示有光幼苗比無光幼苗高。',prompt:'如何提高判斷可信度？',options:['使用多株、重複測量並記錄變異','只挑最高的一株做結論','刪掉不符合期待的資料'],answer:0,why:'重複與完整記錄可呈現變異，避免用單一結果過度概括。',source:'science'},
 {id:'observe-8',topic:'observe',title:'樣本數與範圍',icon:'🧭',display:'在一座公園看到兩隻蝴蝶。',prompt:'可以推論整個城市蝴蝶都很多嗎？',options:['不行，地點與樣本有限，需更廣泛的調查','可以，兩隻已代表全市','不行，所以這座公園也沒有蝴蝶'],answer:0,why:'觀察支持該地點當時至少有兩隻，不能直接代表全市族群。',source:'science'},
 {id:'observe-9',topic:'observe',title:'量測要寫單位',icon:'📏',display:'筆記只寫「幼苗高 8」，沒有單位或量測日期。',prompt:'怎麼改善紀錄？',options:['補上單位、日期、量測方法與樣本編號','把數字改大讓變化明顯','只記錄看起來健康的幼苗'],answer:0,why:'單位與方法讓他人能解讀及重複測量；選擇性記錄會造成偏差。',source:'science'},
 {id:'observe-10',topic:'observe',title:'不確定時不抓動物',icon:'📷',display:'草叢中看到不認識的小型兩生類。',prompt:'如何記錄最友善？',options:['保持距離拍照並記下位置，不觸摸或搬動','徒手捕捉帶回家查資料','移到乾燥路面方便拍照'],answer:0,why:'避免觸碰與搬動可降低對動物和人的風險；不確定物種時可請專業單位協助。',source:'science'},
 {id:'observe-11',topic:'observe',title:'照片也有取景偏差',icon:'📸',display:'連續三張照片都只拍到同一個花叢裡的昆蟲。',prompt:'這能代表整座公園的昆蟲種類嗎？',options:['不能，取樣集中在一處，需多地點與時段觀察','可以，照片張數夠多就代表全園','不能，所以照片裡的昆蟲不存在'],answer:0,why:'多張照片若來自同一位置仍可能有取樣偏差；代表性取決於抽樣設計。',source:'science'},
 {id:'observe-12',topic:'observe',title:'分類要保留不確定',icon:'🔬',display:'遠距照片看不清昆蟲觸角與翅脈。',prompt:'紀錄怎麼寫較誠實？',options:['寫下可見特徵並標示「疑似」，不強行定種','挑一個看起來最像的物種當確定答案','因為不能定種就刪除全部觀察'],answer:0,why:'保留可見證據與不確定性，日後才能用更清楚資料修正分類。',source:'science'},
 {id:'bio-extra-observe-13',topic:'observe',title:'不餵野生動物',icon:'🦆',display:'遊客餵食後，池邊聚集更多水鳥。',prompt:'這證明麵包是牠們合適的食物嗎？',options:['不能；聚集只顯示牠們來取食，不代表食物適合或無害','可以，牠們吃了就代表健康','不可以，所以所有水鳥都不吃麵包'],answer:0,why:'動物接受食物不證明營養合適；餵食也會改變行為並造成環境問題，遵守場域規定。',source:'science'},
 {id:'bio-extra-observe-14',topic:'observe',title:'留下棲地比帶走標本好',icon:'🍃',display:'想比較不同地點的植物葉片，公園告示禁止採摘。',prompt:'如何完成觀察？',options:['原地拍照並記錄特徵與環境，不採摘','趁無人時拔一株帶走','把標本移植到另一處再記錄'],answer:0,why:'依場域規定原地觀察可避免破壞棲地；影像與描述也能留下可核對資料。',source:'science'},
 {id:'bio-extra-observe-15',topic:'observe',title:'因果結論要有比較',icon:'🧪',display:'下雨後蚯蚓出現在步道上。',prompt:'這能證明雨水讓所有蚯蚓離開土壤嗎？',options:['不能，只是一次觀察；需要重複與對照不同條件','可以，所有蚯蚓行為完全相同','不能，所以雨天沒有蚯蚓'],answer:0,why:'單次觀察無法概括所有個體或證明機制；需多次觀察並考慮土壤濕度、氧氣等因素。',source:'science'}
);
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function create(mode='short'){
 if(!['short','all',...Object.keys(topics)].includes(mode))throw new Error('不支援的練習範圍');
 const items=mode==='short'?(()=>{const keys=shuffle(Object.keys(topics));return shuffle(keys.flatMap((t,i)=>shuffle(questions.filter(q=>q.topic===t)).slice(0,2+(i<2?1:0))));})():shuffle(questions.filter(q=>mode==='all'||q.topic===mode));
 return {items,index:0,selected:null,locked:false,results:[],done:false};
}
function select(s,value){const q=s.items[s.index];if(s.done||s.locked||!Number.isInteger(value)||value<0||value>=q.options.length)return false;s.selected=value;return true;}
function submit(s,value=s.selected){const q=s.items[s.index];if(s.done||s.locked||(value!=='unsure'&&(!Number.isInteger(value)||value<0||value>=q.options.length)))return null;
 const ok=value===q.answer,prior=s.results[s.index];s.results[s.index]={first:prior?prior.first:ok,latest:ok,value,tries:prior?prior.tries+1:1};s.locked=true;return s.results[s.index];}
function retry(s){if(s.done||!s.locked||s.results[s.index].latest)return false;s.locked=false;s.selected=null;return true;}
function next(s){if(s.done||!s.locked)return false;if(s.index===s.items.length-1){s.done=true;return true;}s.index++;s.selected=null;s.locked=false;return true;}
return {topics,questions,sources,create,select,submit,retry,next,shuffle};
});
