(function(root){
const data={
  "version": "2026-11-17.2",
  "kinds": {
    "search": "訊號定位",
    "signal": "指揮訊號調音",
    "dispatch": "指揮台大發包",
    "film": "反差短片剪輯",
    "deadline": "最後一天火燒片場"
  },
  "scenes": [
    {
      "id": "vanish-01",
      "kind": "search",
      "title": "企劃書黑洞",
      "room": "辦公室",
      "work": "多拉，請把企劃書補上最後一頁。",
      "command": "多拉，請來指揮大家分工寫企劃！",
      "spots": [
        "📦 文件紙箱",
        "🪴 盆栽後面",
        "🛋️ 沙發底下",
        "🚪 會議室門後"
      ],
      "trace": "只有文件紙箱伸出一條粉紅色緞帶。",
      "found": "紙箱裡傳來：「我在做容器內部品質管理！」",
      "decoys": [
        "盆栽說它只會光合作用，不會寫企劃。",
        "沙發底下找到一張「下次一定」兌換券。",
        "門後只剩一個寫著「本人目前僅支援遠端鼓勵」的立牌。"
      ],
      "lures": [
        "多拉，請來指揮大家分工寫企劃！",
        "多拉，請妳自己把剛才的事情做完。",
        "開飯囉！今天有點心，快出來吃！",
        "出去玩囉，妳要一起來嗎？"
      ],
      "lureKinds": [
        "boss",
        "vanish",
        "snack",
        "play"
      ]
    },
    {
      "id": "vanish-02",
      "kind": "search",
      "title": "家事頻道節能中",
      "room": "客廳",
      "work": "多拉，這一籃乾衣服換妳摺。",
      "command": "多拉，大家在等妳主持摺衣服分工大會！",
      "spots": [
        "🧺 空洗衣籃",
        "🧸 布偶堆",
        "🚪 衣櫃",
        "🪑 椅子下"
      ],
      "trace": "空洗衣籃明明沒衣服，卻多了一個蝴蝶結。",
      "found": "洗衣籃突然有聲音：「我只是比較立體的空氣！」",
      "decoys": [
        "布偶舉牌：我們也只是被分派的。",
        "衣櫃只有一套「主管專用」披風。",
        "椅子下藏著拖鞋，鞋子本人沒有出席。"
      ],
      "lures": [
        "多拉，大家在等妳主持摺衣服分工大會！",
        "多拉，請妳自己把剛才的事情做完。",
        "吃飯不用摺衣服，先出來吃點心！",
        "沙發休息區開放，先躺一下？"
      ],
      "lureKinds": [
        "boss",
        "vanish",
        "snack",
        "rest"
      ]
    },
    {
      "id": "vanish-03",
      "kind": "search",
      "title": "筆記量子穿隧",
      "room": "教室",
      "work": "多拉，請用自己的話整理這一段筆記。",
      "command": "多拉，請上台安排大家的筆記分工！",
      "spots": [
        "📚 大書堆",
        "🖥️ 螢幕後方",
        "🎒 背包裡",
        "🚪 白板後面"
      ],
      "trace": "大書堆露出一撮粉紅色頭髮，書頁還在抖。",
      "found": "書堆說：「我跟知識正在互相吸收，勿擾！」",
      "decoys": [
        "螢幕貼著「正在同步，剩餘999年」。",
        "背包裡只有三份空白筆記模板。",
        "白板後面寫：主管席請往前走。"
      ],
      "lures": [
        "多拉，請上台安排大家的筆記分工！",
        "多拉，請妳自己把剛才的事情做完。",
        "先吃點心，筆記等一下再討論。",
        "今天放鬆看風景，走出去玩！"
      ],
      "lureKinds": [
        "boss",
        "vanish",
        "snack",
        "play"
      ]
    },
    {
      "id": "vanish-04",
      "kind": "search",
      "title": "宇宙交件正在緩衝",
      "room": "太空站",
      "work": "多拉，請把自己負責的太空站報告交出來。",
      "command": "多拉，請擔任全宇宙報告進度總指揮！",
      "spots": [
        "🚀 小火箭艙",
        "🪐 土星環",
        "📡 天線底座",
        "🧊 冷凍睡眠箱"
      ],
      "trace": "小火箭艙門縫露出一支粉紅色指揮棒。",
      "found": "火箭艙廣播：「本艙正在進行低重力漫遊！」",
      "decoys": [
        "土星說：我只有環，沒有交件環節。",
        "天線收到「已讀但未到場」的訊號。",
        "冷凍箱裡的布丁請求不要被叫醒。"
      ],
      "lures": [
        "多拉，請擔任全宇宙報告進度總指揮！",
        "多拉，請妳自己把剛才的事情做完。",
        "太空站點心時間，全員開吃！",
        "太空觀光團出發，躺著看星星！"
      ],
      "lureKinds": [
        "boss",
        "vanish",
        "snack",
        "rest"
      ]
    },
    {
      "id": "vanish-05",
      "kind": "signal",
      "title": "線上會議連線奇蹟",
      "room": "遠端辦公室",
      "work": "請開鏡頭報告妳的進度。",
      "command": "請主持會議，分配別人的進度。",
      "spots": [],
      "trace": "",
      "found": "",
      "decoys": [],
      "maxWork": 25,
      "minPower": 75,
      "entry": "多拉從「網路不穩」直接升級成全場最大音量。"
    },
    {
      "id": "vanish-06",
      "kind": "signal",
      "title": "洗衣電台大復活",
      "room": "洗衣間",
      "work": "輪到妳把衣服收好歸位。",
      "command": "請妳指揮全隊晾衣服動線。",
      "spots": [],
      "trace": "",
      "found": "",
      "decoys": [],
      "maxWork": 20,
      "minPower": 80,
      "entry": "洗衣機還沒脫水，多拉已經開始脫稿指揮。"
    },
    {
      "id": "vanish-07",
      "kind": "signal",
      "title": "小組報告接收器",
      "room": "研究室",
      "work": "請完成妳自己的摘要。",
      "command": "請擔任摘要分工總召。",
      "spots": [],
      "trace": "",
      "found": "",
      "decoys": [],
      "maxWork": 30,
      "minPower": 70,
      "entry": "「喂？我聽不到」瞬間變成「全部都聽我說！」"
    },
    {
      "id": "vanish-08",
      "kind": "signal",
      "title": "野餐集合號角",
      "room": "草地",
      "work": "多拉，輪到妳把野餐道具收起來。",
      "command": "請妳拿擴音器指揮大家收道具。",
      "spots": [],
      "trace": "",
      "found": "",
      "decoys": [],
      "maxWork": 35,
      "minPower": 65,
      "entry": "剛才連影子都沒帶，現在連開場音效都自備。"
    },
    {
      "id": "vanish-09",
      "kind": "dispatch",
      "title": "廚房總司令",
      "room": "卡通廚房",
      "work": "多拉，請妳把道具餐盤收好。",
      "command": "請安排三位配角收尾，妳負責指揮氣氛。",
      "spots": [],
      "trace": "",
      "found": "",
      "decoys": [],
      "tasks": [
        "收道具餐盤",
        "整理紙做的菜單",
        "把玩具杯歸位"
      ],
      "crew": [
        "🦞 小龍蝦",
        "🍮 布丁隊長",
        "🦆 橡皮鴨"
      ]
    },
    {
      "id": "vanish-10",
      "kind": "dispatch",
      "title": "佈置界董事長",
      "room": "派對現場",
      "work": "多拉，請妳把彩帶道具整理一下。",
      "command": "請妳指揮三位配角佈置舞台。",
      "spots": [],
      "trace": "",
      "found": "",
      "decoys": [],
      "tasks": [
        "掛紙星星",
        "擺紙花",
        "排好座位卡"
      ],
      "crew": [
        "🐧 企鵝助理",
        "🐌 蝸牛主任",
        "🦞 小龍蝦"
      ]
    },
    {
      "id": "vanish-11",
      "kind": "dispatch",
      "title": "外星任務發包中心",
      "room": "月球基地",
      "work": "多拉，請整理自己那一袋道具。",
      "command": "請指揮三位配角各接一項月球任務。",
      "spots": [],
      "trace": "",
      "found": "",
      "decoys": [],
      "tasks": [
        "整理玩具隕石",
        "排好外星拖鞋",
        "收紙做的星圖"
      ],
      "crew": [
        "👾 果凍外星人",
        "🦆 橡皮鴨",
        "🍮 布丁隊長"
      ]
    },
    {
      "id": "vanish-12",
      "kind": "dispatch",
      "title": "旅行行李指揮塔",
      "room": "出發大廳",
      "work": "多拉，請把自己的旅行道具裝好。",
      "command": "請分派三位配角，各做一項打包任務。",
      "spots": [],
      "trace": "",
      "found": "",
      "decoys": [],
      "tasks": [
        "把玩具地圖摺好",
        "整理紀念章",
        "將空紙盒疊好"
      ],
      "crew": [
        "🐌 蝸牛主任",
        "🐧 企鵝助理",
        "👾 果凍外星人"
      ]
    },
    {
      "id": "vanish-13",
      "kind": "film",
      "title": "月會瞬移剪輯",
      "room": "月會攝影棚",
      "work": "請交出妳自己的進度。",
      "command": "請上台主持分工。",
      "spots": [],
      "trace": "",
      "found": "",
      "decoys": [],
      "cues": [
        {
          "kind": "work",
          "text": "請交出妳自己的進度。"
        },
        {
          "kind": "boss",
          "text": "請上台主持分工。"
        },
        {
          "kind": "work",
          "text": "那這一頁由妳親自補。"
        },
        {
          "kind": "boss",
          "text": "請妳指揮大家補這一頁！"
        }
      ]
    },
    {
      "id": "vanish-14",
      "kind": "film",
      "title": "野餐快閃劇",
      "room": "野餐攝影棚",
      "work": "換妳收自己的空盒。",
      "command": "來當收尾指揮官。",
      "spots": [],
      "trace": "",
      "found": "",
      "decoys": [],
      "cues": [
        {
          "kind": "work",
          "text": "換妳收自己的空盒。"
        },
        {
          "kind": "boss",
          "text": "來當收尾指揮官。"
        },
        {
          "kind": "work",
          "text": "這份道具請妳自己歸位。"
        },
        {
          "kind": "boss",
          "text": "請妳安排全隊歸位！"
        }
      ]
    },
    {
      "id": "vanish-15",
      "kind": "film",
      "title": "搬家傳送門",
      "room": "搬家攝影棚",
      "work": "請妳整理自己的小紙箱。",
      "command": "請妳拿指揮棒安排動線。",
      "spots": [],
      "trace": "",
      "found": "",
      "decoys": [],
      "cues": [
        {
          "kind": "work",
          "text": "請妳整理自己的小紙箱。"
        },
        {
          "kind": "boss",
          "text": "請妳拿指揮棒安排動線。"
        },
        {
          "kind": "work",
          "text": "那這箱由妳自己貼標籤。"
        },
        {
          "kind": "boss",
          "text": "請妳指揮大家貼標籤！"
        }
      ]
    },
    {
      "id": "vanish-16",
      "kind": "film",
      "title": "遠端主管誕生記",
      "room": "視訊攝影棚",
      "work": "請把自己的待辦做完。",
      "command": "請主持全隊工作分配。",
      "spots": [],
      "trace": "",
      "found": "",
      "decoys": [],
      "cues": [
        {
          "kind": "work",
          "text": "請把自己的待辦做完。"
        },
        {
          "kind": "boss",
          "text": "請主持全隊工作分配。"
        },
        {
          "kind": "work",
          "text": "先親手整理妳自己的摘要。"
        },
        {
          "kind": "boss",
          "text": "請妳指揮大家整理摘要！"
        }
      ]
    },
    {
      "id": "vanish-17",
      "kind": "deadline",
      "title": "週五才想起星期一",
      "room": "專案作戰室",
      "work": "多拉，今天請回報「實際完成」與下一步，不是想像中的進度。",
      "command": "請多拉主持最後一天火燒屁股緊急動員大會！",
      "days": 5,
      "capacity": 2,
      "tasks": [
        "確認需求",
        "製作原型",
        "實際驗收"
      ],
      "costs": [
        2,
        4,
        2
      ]
    },
    {
      "id": "vanish-18",
      "kind": "deadline",
      "title": "開會等於有做事？",
      "room": "進度會議室",
      "work": "多拉，今天請回報「實際完成」與下一步，不是想像中的進度。",
      "command": "請多拉主持最後一天火燒屁股緊急動員大會！",
      "days": 4,
      "capacity": 2,
      "tasks": [
        "定好交付範圍",
        "完成內容",
        "交叉核對"
      ],
      "costs": [
        1,
        3,
        2
      ]
    },
    {
      "id": "vanish-19",
      "kind": "deadline",
      "title": "就再加一點點",
      "room": "需求追加中心",
      "work": "多拉，今天請回報「實際完成」與下一步，不是想像中的進度。",
      "command": "請多拉主持最後一天火燒屁股緊急動員大會！",
      "days": 5,
      "capacity": 2,
      "tasks": [
        "確認本版需求",
        "做出可玩版本",
        "整合驗收"
      ],
      "costs": [
        2,
        2,
        2
      ]
    },
    {
      "id": "vanish-20",
      "kind": "deadline",
      "title": "驗收不是片尾彩蛋",
      "room": "交件倒數棚",
      "work": "多拉，今天請回報「實際完成」與下一步，不是想像中的進度。",
      "command": "請多拉主持最後一天火燒屁股緊急動員大會！",
      "days": 4,
      "capacity": 2,
      "tasks": [
        "整理需求清單",
        "完成道具內容",
        "逐項操作驗收"
      ],
      "costs": [
        2,
        2,
        3
      ]
    },
    {
      "kind": "search",
      "title": "開飯雷達零延遲",
      "room": "點心攝影棚",
      "work": "多拉，請整理妳自己的那張清單。",
      "command": "請來指揮大家安排點心座位！",
      "spots": [
        "🍮 巨大布丁模型",
        "🧺 空餐籃",
        "📦 紙箱城堡",
        "🚪 點心室門後"
      ],
      "trace": "巨大布丁模型後面露出一支粉紅色叉子道具。",
      "found": "布丁後傳來：「本人正在背景執行，點心通知可以優先插隊！」",
      "decoys": [
        "餐籃只有一張「等開飯通知我」的便條。",
        "紙箱裡是主管專用餐巾紙。",
        "門後的鐘還沒響，多拉的叉子已經準備好了。"
      ],
      "lures": [
        "請來指揮大家安排點心座位！",
        "清單請妳親手整理完再走。",
        "開飯！點心全部到齊囉！",
        "吃完一起出去散步玩！"
      ],
      "lureKinds": [
        "boss",
        "vanish",
        "snack",
        "play"
      ],
      "id": "vanish-21"
    },
    {
      "kind": "search",
      "title": "出遊集合點突然有訊號",
      "room": "出發大廳",
      "work": "多拉，出發前請先整理自己的待辦。",
      "command": "請妳指揮大家排出遊隊形！",
      "spots": [
        "🧳 旅行箱道具",
        "🪑 候車椅",
        "🗺️ 紙地圖後面",
        "🚪 休息室門後"
      ],
      "trace": "旅行箱道具的拉鍊邊露出一條粉紅色緞帶。",
      "found": "旅行箱說：「有行程表我在，有待辦表我不在！」",
      "decoys": [
        "椅子放著一張「我好累，先幫我留位子」。",
        "地圖只標了遊樂區，工作區被摺進去。",
        "休息室裡有一個正在休息的休息告示牌。"
      ],
      "lures": [
        "請妳指揮大家排出遊隊形！",
        "先完成妳自己那份待辦。",
        "車上點心要發囉！",
        "出發去玩！不用主持進度會議！"
      ],
      "lureKinds": [
        "boss",
        "vanish",
        "snack",
        "play"
      ],
      "id": "vanish-22"
    },
    {
      "kind": "signal",
      "title": "下午茶頻道滿格",
      "room": "下午茶廣播站",
      "work": "請回來核對妳自己的報告。",
      "command": "點心已到，請到場開吃！",
      "maxWork": 25,
      "minPower": 70,
      "powerLabel": "點心誘惑值",
      "entryActor": "snack",
      "entry": "剛剛訊號差到像在山洞，聽見點心就連叉子都4K上線。",
      "id": "vanish-23"
    },
    {
      "kind": "signal",
      "title": "躺平觀光局",
      "room": "放鬆旅行社",
      "work": "請把自己的行程資料整理好。",
      "command": "行程是休息、放鬆和出去玩。",
      "maxWork": 30,
      "minPower": 75,
      "powerLabel": "休息與出遊吸引力",
      "entryActor": "play",
      "entry": "「好有趣！我可以！我現在就出發！」剛才的好想睡暫時忘了帶。",
      "id": "vanish-24"
    },
    {
      "kind": "dispatch",
      "title": "下午茶席次總監",
      "room": "卡通點心桌",
      "work": "多拉，妳自己的道具杯還沒收。",
      "command": "請妳安排三位配角準備下午茶。",
      "tasks": [
        "排座位卡",
        "整理玩具托盤",
        "擺紙做點心卡"
      ],
      "crew": [
        "🍮 布丁隊長",
        "🦆 橡皮鴨",
        "🐧 企鵝助理"
      ],
      "id": "vanish-25"
    },
    {
      "kind": "dispatch",
      "title": "出遊打包總指揮",
      "room": "玩樂集合處",
      "work": "多拉，請整理妳自己的旅行道具。",
      "command": "請妳安排三位配角準備出遊道具。",
      "tasks": [
        "整理紙地圖",
        "擺好拍照立牌",
        "歸位空旅行盒"
      ],
      "crew": [
        "👾 果凍外星人",
        "🦞 小龍蝦",
        "🐌 蝸牛主任"
      ],
      "id": "vanish-26"
    },
    {
      "kind": "film",
      "title": "開飯前後的網路品質",
      "room": "點心反差攝影棚",
      "work": "多拉，請補自己的進度。",
      "command": "開飯了，還有好玩的活動！",
      "cues": [
        {
          "kind": "work",
          "text": "先把自己的清單核對好。"
        },
        {
          "kind": "snack",
          "text": "點心桌開放，開飯囉！"
        },
        {
          "kind": "work",
          "text": "吃完請整理自己的道具。"
        },
        {
          "kind": "play",
          "text": "出去玩囉，好好玩好有趣！"
        }
      ],
      "id": "vanish-27"
    },
    {
      "kind": "film",
      "title": "喊累與放鬆的切換鍵",
      "room": "沙發反差攝影棚",
      "work": "多拉，這一小段資料輪到妳整理。",
      "command": "這次是躺沙發、休息、看風景。",
      "cues": [
        {
          "kind": "work",
          "text": "請整理這一小段自己的資料。"
        },
        {
          "kind": "rest",
          "text": "沙發休息區開放，先放鬆！"
        },
        {
          "kind": "work",
          "text": "休息後請核對自己的那一頁。"
        },
        {
          "kind": "play",
          "text": "集合出去玩，好有趣！"
        }
      ],
      "id": "vanish-28"
    },
    {
      "kind": "deadline",
      "title": "一格進度，十頁戰報",
      "room": "忙碌演技發表會",
      "work": "多拉，這次請把實際完成格數和成果宣告分開。",
      "command": "請主持「我今天超有進度」記者會！",
      "days": 5,
      "capacity": 2,
      "tasks": [
        "釐清交付需求",
        "完成可玩內容",
        "操作驗收"
      ],
      "costs": [
        3,
        2,
        2
      ],
      "id": "vanish-29"
    },
    {
      "kind": "deadline",
      "title": "還沒開工先喊累",
      "room": "疲勞台詞錄音室",
      "work": "多拉，工作還沒開始，但「好累好想睡」已經錄了三個版本。",
      "command": "休息、點心、出遊與指揮專線同時開放！",
      "days": 5,
      "capacity": 2,
      "tasks": [
        "整理需求便條",
        "完成道具版本",
        "逐項驗收"
      ],
      "costs": [
        2,
        3,
        2
      ],
      "id": "vanish-30"
    }
  ]
};
if(typeof module!=="undefined"&&module.exports)module.exports=data;else root.DoraVanishData=data;
})(typeof globalThis!=="undefined"?globalThis:this);
