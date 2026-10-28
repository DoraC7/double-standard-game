(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ChineseSchool=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{'use strict';
const topics={"daily": "日常動作說清楚", "kitchen": "廚房動詞配對", "files": "檔案不是都叫用", "status": "完成到哪一步", "request": "請人幫忙說具體", "context": "用字要看前後文"},questions=[
 {
  "id": "detergent",
  "topic": "daily",
  "title": "洗衣精不是「用進去」",
  "scene": "洗衣機手冊指定一般液體洗衣精放主洗槽；你已量好本次用量。",
  "old": "把洗衣精用進去。",
  "prompt": "哪個動詞最能交代這個動作？",
  "kind": "choice",
  "options": [
   "把量好的洗衣精倒入指定主洗槽。",
   "把洗衣精擦拭在主洗槽。",
   "把洗衣精摺進主洗槽。"
  ],
  "good": [
   0
  ],
  "why": "液體進入容器可說「倒入」；「擦拭」通常是拿布等擦表面。此題只練描述已給定的動作，投放方式仍看機型手冊。",
  "model": "我已把量好的洗衣精倒入指定主洗槽。"
 },
 {
  "id": "table",
  "topic": "daily",
  "title": "桌子怎麼「用乾淨」？",
  "scene": "你拿微濕的抹布擦掉桌面灰塵，已檢查桌面沒有明顯灰塵。",
  "old": "桌子我用好了。",
  "prompt": "各欄選一塊句子，組成符合現場情況的說法，再按確認。",
  "kind": "build",
  "slots": [
   {
    "label": "對象",
    "options": [
     "桌面",
     "洗衣機主洗槽"
    ],
    "good": [
     0
    ]
   },
   {
    "label": "動作",
    "options": [
     "已擦拭乾淨",
     "已擦乾淨",
     "已下載完成"
    ],
    "good": [
     0,
     1
    ]
   },
   {
    "label": "檢查",
    "options": [
     "，已檢查沒有明顯灰塵。",
     "，所以一定完全無菌。"
    ],
    "good": [
     0
    ]
   }
  ],
  "why": "「擦拭／擦乾淨」都能表達這個動作。「沒有明顯灰塵」是實際檢查結果，不等於已證明無菌。",
  "model": "桌面已擦拭乾淨，已檢查沒有明顯灰塵。"
 },
 {
  "id": "clothes",
  "topic": "daily",
  "title": "衣服完成了哪個動作？",
  "scene": "洗衣機洗程已結束，但衣服還濕著，仍放在滾筒裡。",
  "old": "衣服用好了。",
  "prompt": "哪句最符合目前狀態？",
  "kind": "choice",
  "options": [
   "衣服已洗完，還沒取出晾乾。",
   "衣服已收進衣櫃，隨時能穿。",
   "衣服已烘乾並摺好。"
  ],
  "good": [
   0
  ],
  "why": "洗完、晾乾、烘乾、摺好、收好是不同階段；不能把完成其中一步說成全部完成。",
  "model": "衣服已洗完，接著要取出晾乾。"
 },
 {
  "id": "cream",
  "topic": "daily",
  "title": "乳液不是拿來擦拭的布",
  "scene": "你想請對方把乳液均勻抹在乾燥的手背。",
  "old": "手幫我用一下。",
  "prompt": "哪些說法在此情境自然、具體？（選一個即可）",
  "kind": "choice",
  "options": [
   "請幫我把乳液塗抹在手背上。",
   "請幫我把乳液擦在手背上。",
   "請幫我把手背上傳一下。"
  ],
  "good": [
   0,
   1
  ],
  "why": "「塗抹」較明確，口語「擦乳液」也自然；不是只有比較書面的詞才正確。",
  "model": "請幫我把乳液均勻擦在手背上。"
 },
 {
  "id": "vegetable",
  "topic": "kitchen",
  "title": "青菜到底要做什麼？",
  "scene": "準備炒青菜前，你要把青菜放在流動清水下洗去表面髒污。",
  "old": "青菜先用一下。",
  "prompt": "哪句說明了這個準備動作？",
  "kind": "choice",
  "options": [
   "先用流動清水沖洗青菜。",
   "先把青菜煎到焦黃。",
   "先把青菜解壓縮。"
  ],
  "good": [
   0
  ],
  "why": "「沖洗」把方式也說出來；「切、炒、燙」是另外的動作，不是同一件事。",
  "model": "先用流動清水沖洗青菜。"
 },
 {
  "id": "onion",
  "topic": "kitchen",
  "title": "把切法也說清楚",
  "scene": "這道料理要洋蔥丁，不是洋蔥絲。你請人備料，還沒下鍋。",
  "old": "洋蔥幫我用一用。",
  "prompt": "各欄選一塊句子，組成符合現場情況的說法，再按確認。",
  "kind": "build",
  "slots": [
   {
    "label": "對象",
    "options": [
     "請把洋蔥",
     "請把湯"
    ],
    "good": [
     0
    ]
   },
   {
    "label": "動作",
    "options": [
     "切成小丁",
     "切成細絲",
     "切成丁"
    ],
    "good": [
     0,
     2
    ]
   },
   {
    "label": "範圍",
    "options": [
     "，先放在備料碗，不用下鍋。",
     "，順便說成整道菜已完成。"
    ],
    "good": [
     0
    ]
   }
  ],
  "why": "「切丁／切成小丁」都可以；切絲和切丁形狀不同，備料也不等於烹調完成。",
  "model": "請把洋蔥切成丁，先放在備料碗，不用下鍋。"
 },
 {
  "id": "soup",
  "topic": "kitchen",
  "title": "攪拌、加熱、盛裝不一樣",
  "scene": "鍋裡的湯已煮好；你只想請人把湯舀進碗裡。",
  "old": "湯幫我用一下。",
  "prompt": "哪個請求對應現在的需求？",
  "kind": "choice",
  "options": [
   "請幫我把湯盛進碗裡。",
   "請幫我把湯再煮半小時。",
   "請幫我把湯倒回包裝。"
  ],
  "good": [
   0
  ],
  "why": "「盛湯／舀湯」能指向裝入容器的動作；不要讓人猜是加熱、攪拌還是盛裝。",
  "model": "請幫我把湯舀進碗裡。"
 },
 {
  "id": "pan",
  "topic": "kitchen",
  "title": "洗完還是收好了？",
  "scene": "平底鍋已洗淨，放在瀝水架上，尚未擦乾收納。",
  "old": "鍋子用好了。",
  "prompt": "哪句不會把尚未完成的事一起算進去？",
  "kind": "choice",
  "options": [
   "鍋子已洗淨，正在瀝乾，還沒收進櫃子。",
   "鍋子已擦乾並收進櫃子。",
   "廚房所有工作都完成了。"
  ],
  "good": [
   0
  ],
  "why": "清洗、瀝乾、擦乾、收納各有自己的動詞。進度回報不必很長，但要說對階段。",
  "model": "鍋子已洗淨，正在瀝乾，還沒收進櫃子。"
 },
 {
  "id": "download",
  "topic": "files",
  "title": "下載不是安裝",
  "scene": "你只把安裝檔從官網下載到「下載」資料夾，還沒開啟安裝程式。",
  "old": "軟體用好了。",
  "prompt": "各欄選一塊句子，組成符合現場情況的說法，再按確認。",
  "kind": "build",
  "slots": [
   {
    "label": "對象",
    "options": [
     "安裝檔",
     "軟體帳號"
    ],
    "good": [
     0
    ]
   },
   {
    "label": "動作",
    "options": [
     "已下載到「下載」資料夾",
     "已安裝並測試完成"
    ],
    "good": [
     0
    ]
   },
   {
    "label": "未完成",
    "options": [
     "，還沒執行安裝。",
     "，可以當作已安裝。"
    ],
    "good": [
     0
    ]
   }
  ],
  "why": "下載是取得檔案，安裝是另一個步驟。檔案在資料夾裡，不代表程式已可使用。",
  "model": "安裝檔已下載到「下載」資料夾，還沒執行安裝。"
 },
 {
  "id": "unzip",
  "topic": "files",
  "title": "壓縮檔下一步",
  "scene": "你收到 photos.zip，要先把裡面的圖片取出到資料夾。",
  "old": "把檔案用出來。",
  "prompt": "哪個動作名稱最準確？",
  "kind": "choice",
  "options": [
   "把 photos.zip 解壓縮到圖片資料夾。",
   "把 photos.zip 重新命名成 photos.jpg。",
   "把 photos.zip 刪除就會出現圖片。"
  ],
  "good": [
   0
  ],
  "why": "「解壓縮」是取出壓縮內容；改副檔名不會完成格式轉換或解壓縮。",
  "model": "請把 photos.zip 解壓縮到圖片資料夾。"
 },
 {
  "id": "rename",
  "topic": "files",
  "title": "改名字，不是搬位置",
  "scene": "要把 report-final.docx 改名為 會議紀錄.docx，內容與所在資料夾都不變。",
  "old": "檔案幫我用成會議紀錄。",
  "prompt": "哪句最不容易誤解？",
  "kind": "choice",
  "options": [
   "請把 report-final.docx 重新命名為「會議紀錄.docx」。",
   "請把 report-final.docx 搬到另一個資料夾。",
   "請把 report-final.docx 的內容全部刪除。"
  ],
  "good": [
   0
  ],
  "why": "重新命名、移動、編輯、刪除改變的是不同事物。保留檔名與目標，對方才知道要操作哪個檔案。",
  "model": "請把 report-final.docx 重新命名為「會議紀錄.docx」。"
 },
 {
  "id": "upload",
  "topic": "files",
  "title": "本機儲存不等於上傳",
  "scene": "你已修改並儲存本機的會議紀錄，但尚未放到共用雲端資料夾。",
  "old": "會議紀錄用好了。",
  "prompt": "各欄選一塊句子，組成符合現場情況的說法，再按確認。",
  "kind": "build",
  "slots": [
   {
    "label": "對象",
    "options": [
     "會議紀錄",
     "印表機"
    ],
    "good": [
     0
    ]
   },
   {
    "label": "已完成",
    "options": [
     "已修改並儲存在本機",
     "已上傳到共用資料夾"
    ],
    "good": [
     0
    ]
   },
   {
    "label": "尚未完成",
    "options": [
     "，還沒上傳到共用資料夾。",
     "，大家現在一定都看得到了。"
    ],
    "good": [
     0
    ]
   }
  ],
  "why": "儲存本機、上傳、分享權限是不同事情。回報本機完成時，不可順便推論別人已能存取。",
  "model": "會議紀錄已修改並儲存在本機，還沒上傳到共用資料夾。"
 },
 {
  "id": "draft",
  "topic": "status",
  "title": "草稿完成，不是已交件",
  "scene": "筆記草稿已寫完，但還沒核對內容，也沒交給老師。",
  "old": "筆記用好了。",
  "prompt": "哪句回報符合事實？",
  "kind": "choice",
  "options": [
   "筆記草稿已寫完，還沒核對與提交。",
   "筆記已核對正確，老師也收到了。",
   "筆記什麼都不用做了。"
  ],
  "good": [
   0
  ],
  "why": "寫完、核對、提交、對方收到，是可以分開確認的狀態。只回報自己知道的事。",
  "model": "筆記草稿已寫完，接著核對內容後再提交。"
 },
 {
  "id": "test",
  "topic": "status",
  "title": "執行過，不等於通過",
  "scene": "你已執行三項測試，其中兩項通過，一項失敗；尚未修正。",
  "old": "測試用好了。",
  "prompt": "各欄選一塊句子，組成符合現場情況的說法，再按確認。",
  "kind": "build",
  "slots": [
   {
    "label": "動作",
    "options": [
     "已執行三項測試",
     "已修好所有問題"
    ],
    "good": [
     0
    ]
   },
   {
    "label": "結果",
    "options": [
     "，兩項通過、一項失敗",
     "，全部通過"
    ],
    "good": [
     0
    ]
   },
   {
    "label": "下一步",
    "options": [
     "；失敗項目還要修正。",
     "；不用理會失敗項目。"
    ],
    "good": [
     0
    ]
   }
  ],
  "why": "「執行」說的是做過什麼；「通過／失敗」說的是結果。兩者都要說，不能用「用好了」蓋掉失敗。",
  "model": "已執行三項測試，兩項通過、一項失敗；失敗項目還要修正。"
 },
 {
  "id": "sent",
  "topic": "status",
  "title": "寄出不等於收到",
  "scene": "你按下寄送後，信件出現在寄件備份，對方尚未回覆。",
  "old": "信件用好了，對方看了。",
  "prompt": "哪句沒有超出現有證據？",
  "kind": "choice",
  "options": [
   "信件已寄出，可在寄件備份查到；尚未確認對方收到或讀取。",
   "對方一定已讀，而且同意內容。",
   "對方沒回就表示信沒寄出去。"
  ],
  "good": [
   0
  ],
  "why": "寄出、送達、已讀、同意是不同狀態。沒有回覆不能直接證明寄送失敗，也不能證明已讀。",
  "model": "信件已寄出，可在寄件備份查到；尚未確認對方收到或讀取。"
 },
 {
  "id": "plan",
  "topic": "status",
  "title": "打算做，不是做完了",
  "scene": "你決定晚上八點開始整理書桌，現在還沒動手。",
  "old": "書桌用好了，我八點會用。",
  "prompt": "哪句區分了計畫與已完成？",
  "kind": "choice",
  "options": [
   "我預計晚上八點開始整理書桌，目前還沒開始。",
   "書桌已整理完，晚上八點再開始。",
   "我有想到，所以算整理完成。"
  ],
  "good": [
   0
  ],
  "why": "「預計、準備、正在、已完成」標示不同時間與狀態；計畫不是完成證據。",
  "model": "我預計晚上八點開始整理書桌，目前還沒開始。"
 },
 {
  "id": "revise",
  "topic": "request",
  "title": "到底要改哪裡？",
  "scene": "你想請人只修正報告第二段的錯字，其他內容不要改。",
  "old": "報告幫我用一下。",
  "prompt": "各欄選一塊句子，組成符合現場情況的說法，再按確認。",
  "kind": "build",
  "slots": [
   {
    "label": "對象",
    "options": [
     "請幫我把報告第二段的錯字",
     "請幫我把整份報告的觀點"
    ],
    "good": [
     0
    ]
   },
   {
    "label": "動作",
    "options": [
     "修正",
     "改正",
     "刪光"
    ],
    "good": [
     0,
     1
    ]
   },
   {
    "label": "界線",
    "options": [
     "，其他內容先不要改。",
     "，整份重寫也不用告知。"
    ],
    "good": [
     0
    ]
   }
  ],
  "why": "對象＋動作＋範圍就能形成清楚的請求。「修正／改正錯字」都合理，不必為換詞而變得難懂。",
  "model": "請幫我修正報告第二段的錯字，其他內容先不要改。"
 },
 {
  "id": "photo",
  "topic": "request",
  "title": "照片要裁切，不是調色",
  "scene": "你只想去掉照片右側的空白，保留人物和原色調。",
  "old": "照片用漂亮一點。",
  "prompt": "哪句最符合這次明確需求？",
  "kind": "choice",
  "options": [
   "請裁掉照片右側空白，保留人物與原色調。",
   "請把人物換掉並套復古濾鏡。",
   "請自行決定所有修改，不用保留原色。"
  ],
  "good": [
   0
  ],
  "why": "「裁切」比「用漂亮」更能對應這次操作。美感可以討論，但已明確的範圍不用再交給對方猜。",
  "model": "請裁掉照片右側空白，保留人物與原色調。"
 },
 {
  "id": "clarify",
  "topic": "request",
  "title": "一句「幫我用」，先問哪件事？",
  "scene": "對方只說「幫我用一下這個檔案」，沒有其他前後文，也沒交代目標。",
  "old": "幫我用一下這個檔案。",
  "prompt": "你先回哪句，最能釐清真正缺少的資訊？",
  "kind": "choice",
  "options": [
   "你想對哪個檔案做什麼？希望最後變成什麼樣子？",
   "我先幫你刪除它。",
   "我先改成我喜歡的內容再說。"
  ],
  "good": [
   0
  ],
  "why": "缺的是操作目標與預期結果，不是對方的人格或能力。先問關鍵缺口，不擅自替對方決定修改。",
  "model": "你想對哪個檔案做什麼？希望最後變成什麼樣子？"
 },
 {
  "id": "enough",
  "topic": "request",
  "title": "資訊夠了，就不用一直追問",
  "scene": "對方說：「請把 menu.pdf 複製到『備份』資料夾，原檔保留。」兩個位置都已明確且有權限。",
  "old": "幫我把 menu.pdf 複製到備份資料夾。",
  "prompt": "哪個理解正確？",
  "kind": "choice",
  "options": [
   "目標與動作已清楚，可以照要求複製，不必為了追問而追問。",
   "看到「幫我」就代表句子不完整，不能做。",
   "應該改成移動，原檔不用保留。"
  ],
  "good": [
   0
  ],
  "why": "清楚不等於冗長。已提供對象、動作、目的地及原檔處理方式，就不必硬加無關問題。",
  "model": "我會把 menu.pdf 複製到「備份」資料夾，保留原檔。"
 },
 {
  "id": "valid-use",
  "topic": "context",
  "title": "「用」字不是犯規",
  "scene": "一句話是：「請用剪刀沿虛線剪開包裝。」",
  "old": "請用剪刀沿虛線剪開包裝。",
  "prompt": "這句需要把「用」全部換掉嗎？",
  "kind": "choice",
  "options": [
   "不用。「用剪刀」說工具，「剪開」說動作，已經清楚。",
   "需要，所有「用」都是錯字。",
   "換成生僻字才是正確中文。"
  ],
  "good": [
   0
  ],
  "why": "「用」可以引出工具或方法。本課針對的是沒有交代動作的模糊說法，不是全面禁止一個字。",
  "model": "請用剪刀沿虛線剪開包裝。"
 },
 {
  "id": "scissors",
  "topic": "context",
  "title": "工具與動作可以同時存在",
  "scene": "你要把包裝沿虛線剪開；工具是剪刀。",
  "old": "包裝用一下。",
  "prompt": "各欄選一塊句子，組成符合現場情況的說法，再按確認。",
  "kind": "build",
  "slots": [
   {
    "label": "工具",
    "options": [
     "請用剪刀",
     "請用資料夾"
    ],
    "good": [
     0
    ]
   },
   {
    "label": "方式",
    "options": [
     "沿虛線",
     "隨便猜一條線"
    ],
    "good": [
     0
    ]
   },
   {
    "label": "動作",
    "options": [
     "剪開包裝。",
     "剪開袋子上的包裝封口。",
     "上傳包裝。"
    ],
    "good": [
     0,
     1
    ]
   }
  ],
  "why": "「用剪刀」交代工具，「沿虛線」交代方式，「剪開」交代動作。三者不互相衝突。",
  "model": "請用剪刀沿虛線剪開包裝。"
 },
 {
  "id": "context-clear",
  "topic": "context",
  "title": "前後文清楚，口語也可以",
  "scene": "甲問：「你洗好碗了嗎？」乙回答：「洗好了，放在瀝水架。」",
  "old": "洗好了，放在瀝水架。",
  "prompt": "這個回答有什麼特點？",
  "kind": "choice",
  "options": [
   "前後文已說明是碗，回答補了動作與位置，不必每次重複全部名詞。",
   "沒有把碗的名稱寫三次，所以一定錯。",
   "用了口語，不能算正確中文。"
  ],
  "good": [
   0
  ],
  "why": "省略已知資訊是自然語言的一部分。重點是聽者能否理解，不是機械地把每句拉長。",
  "model": "洗好了，放在瀝水架。"
 },
 {
  "id": "synonym",
  "topic": "context",
  "title": "自然、準確，比華麗重要",
  "scene": "你把桌上的書按科目排好，放回書架；兩種說法都對應同一件事。",
  "old": "書我用好了。",
  "prompt": "哪些說法都自然？（選一個即可）",
  "kind": "choice",
  "options": [
   "我已把書按科目整理好，放回書架。",
   "我已把書依科目分類，放回書架。",
   "我已把書高級化，因此不必說放在哪裡。"
  ],
  "good": [
   0,
   1
  ],
  "why": "整理與分類在這個給定情境都能用；只追求高級詞，卻遺失對象和動作，反而更難懂。",
  "model": "我已把書按科目整理好，放回書架。"
 },
 {
  "id": "car-wash",
  "topic": "daily",
  "title": "車子「用好」是洗車還是修車？",
  "scene": "你只清洗車身外觀，沒有檢查或維修車輛。",
  "old": "車子用好了。",
  "prompt": "哪句能準確說明你做的事？",
  "kind": "choice",
  "options": [
   "車身外觀已清洗乾淨，這次沒有做檢查或維修。",
   "車子所有故障都修好了。",
   "整台車已保養完成，任何零件都沒有問題。"
  ],
  "good": [
   0
  ],
  "why": "「洗車、保養、維修、檢查」不是同一動作。洗乾淨不能證明車輛的功能與安全狀況。",
  "model": "車身外觀已清洗乾淨，這次沒有做檢查或維修。"
 },
 {
  "id": "rice",
  "topic": "kitchen",
  "title": "飯「用好了」可以開飯嗎？",
  "scene": "白飯已煮熟，但菜還沒炒好，也尚未盛飯。",
  "old": "飯用好了。",
  "prompt": "哪句保留了真正的完成範圍？",
  "kind": "choice",
  "options": [
   "白飯已煮熟，還沒盛裝；菜還在準備。",
   "整桌飯菜已備妥，可以全部端上桌。",
   "所有碗盤都清洗收好了。"
  ],
  "good": [
   0
  ],
  "why": "煮飯、盛飯與整餐準備好是不同範圍。把完成的部分說出來，就不用讓人猜能否開飯。",
  "model": "白飯已煮熟，還沒盛裝；菜還在準備。"
 },
 {
  "id": "phone-update",
  "topic": "files",
  "title": "手機「用好了」是哪一步？",
  "scene": "手機系統更新已安裝並重新啟動，但你還沒確認常用App是否正常。",
  "old": "手機用好了。",
  "prompt": "各欄選一塊句子，組成符合現場情況的說法，再按確認。",
  "kind": "build",
  "slots": [
   {
    "label": "對象",
    "options": [
     "手機系統",
     "手機電池"
    ],
    "good": [
     0
    ]
   },
   {
    "label": "已完成",
    "options": [
     "已更新並重新啟動",
     "已更換並充飽電"
    ],
    "good": [
     0
    ]
   },
   {
    "label": "尚未檢查",
    "options": [
     "，還沒確認常用App是否正常。",
     "，所以所有App一定都正常。"
    ],
    "good": [
     0
    ]
   }
  ],
  "why": "充電、更新、重新啟動、維修是不同動作。更新完成也不能代替實際確認App能否使用。",
  "model": "手機系統已更新並重新啟動，還沒確認常用App是否正常。"
 },
 {
  "id": "car-service",
  "topic": "status",
  "title": "車廠說完成，也要說完成什麼",
  "scene": "這次只委託更換雨刷，車廠已換好並試噴水，確認雨刷能刷去水痕；其他零件沒有檢查。",
  "old": "車子用好了，全部都沒問題。",
  "prompt": "哪句符合這次工作與驗證的範圍？",
  "kind": "choice",
  "options": [
   "雨刷已更換，試噴水後能刷去水痕；其他零件這次未檢查。",
   "整台車已全面檢查，保證永遠不故障。",
   "既然雨刷換好，引擎也算修好了。"
  ],
  "good": [
   0
  ],
  "why": "具體說明更換了什麼、怎麼確認，並保留未檢查的範圍。局部工作完成不代表整台車所有問題都排除了。",
  "model": "雨刷已更換，試噴水後能刷去水痕；其他零件這次未檢查。"
 },
 {
  "id": "phone-request",
  "topic": "request",
  "title": "手機到底要幫你調什麼？",
  "scene": "你覺得字太小，只想把手機字體調大一級；其他設定保持不變。",
  "old": "手機幫我用好。",
  "prompt": "哪句最能讓對方照你的需求操作？",
  "kind": "choice",
  "options": [
   "請把手機字體調大一級，其他設定先不要改。",
   "請把手機恢復原廠設定。",
   "請幫我把手機換成你喜歡的設定，不用問。"
  ],
  "good": [
   0
  ],
  "why": "把對象和要改的設定說出來，並交代不改哪些部分。「用好」無法表達你只是需要更大的字。",
  "model": "請把手機字體調大一級，其他設定先不要改。"
 },
 {
  "id": "which-car",
  "topic": "context",
  "title": "沒有前後文，別幫「用好」補劇情",
  "scene": "你只收到「車子用好了」這句訊息，不知道對方原本在洗車、保養、修理，還是借車。",
  "old": "車子用好了。",
  "prompt": "哪個回應最合理？",
  "kind": "choice",
  "options": [
   "你指的是洗車、保養、維修，還是已經用完車？目前完成了什麼？",
   "一定是全部故障都修好了。",
   "一定是剛把車洗乾淨，不用確認。"
  ],
  "good": [
   0
  ],
  "why": "「用完車」在借用情境可能很清楚；沒有前後文時，先釐清動作，不替對方猜一個完成狀態。",
  "model": "你指的是洗車、保養、維修，還是已經用完車？目前完成了什麼？"
 }
];
function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function queue(mode='short',rng=Math.random){if(mode==='all')return shuffle(questions,rng);if(Object.hasOwn(topics,mode))return shuffle(questions.filter(q=>q.topic===mode),rng);if(mode!=='short')throw Error('Unknown mode');return shuffle(Object.keys(topics).flatMap(t=>shuffle(questions.filter(q=>q.topic===t),rng).slice(0,2)),rng);}
function correct(q,v){if(q.kind==='choice')return Number.isInteger(v)&&q.good.includes(v);return Array.isArray(v)&&v.length===q.slots.length&&v.every((x,i)=>Number.isInteger(x)&&q.slots[i].good.includes(x));}
function describe(q,v){if(v==='unsure')return '還不確定，先看解說';if(q.kind==='choice')return q.options[v]??'尚未選擇';return q.slots.map((s,i)=>s.options[v?.[i]]??'＿').join('');}
function create(mode='short',rng=Math.random){return {items:queue(mode,rng),index:0,answers:[],locked:false};}
function submit(s,v){if(s.locked||s.index>=s.items.length)return null;const q=s.items[s.index],a={id:q.id,value:Array.isArray(v)?[...v]:v,ok:correct(q,v),draft:''};s.answers.push(a);s.locked=true;return a;}
function next(s){if(!s.locked||s.index>=s.items.length)return false;s.index++;s.locked=false;return true;}
return {topics,questions,shuffle,queue,correct,describe,create,submit,next};});
