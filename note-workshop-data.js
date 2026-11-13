'use strict';
const NoteTasks=[
  {
    "title": "01 讓標題有層級",
    "topic": "Markdown",
    "story": "把「整理照片」設為唯一一個一級標題，並用至少兩個二級標題分出準備與步驟。不用把字全部放大。",
    "docs": [
      {
        "id": "draft",
        "title": "工作筆記",
        "category": "待整理",
        "date": "2026-11-13",
        "status": "active",
        "source": "未核對",
        "text": "整理照片\n準備\n手機與傳輸線\n步驟\n先複製再檢查"
      }
    ],
    "solution": "# 整理照片\n\n## 準備\n手機與傳輸線\n\n## 步驟\n先複製，再確認檔案數量。",
    "kind": "headings"
  },
  {
    "title": "02 清單不只是破折號",
    "topic": "Markdown",
    "story": "用有序清單寫至少兩個步驟，在其中一步下放一份無序子清單（縮排）。畫面與語法樹都要真的出現巢狀清單。",
    "docs": [
      {
        "id": "draft",
        "title": "工作筆記",
        "category": "待整理",
        "date": "2026-11-13",
        "status": "active",
        "source": "未核對",
        "text": "備份照片\n插上傳輸線\n複製檔案\n檢查張數與抽看照片"
      }
    ],
    "solution": "1. 插上傳輸線\n2. 複製檔案\n   - 檢查張數\n   - 抽看照片\n",
    "kind": "lists"
  },
  {
    "title": "03 連結要能追到來源",
    "topic": "Markdown",
    "story": "在工作稿加入能開啟來源筆記的 Markdown 連結，目標是 note:source。預覽中的連結只在本練習切換筆記，不會連外。",
    "docs": [
      {
        "id": "draft",
        "title": "工作筆記",
        "category": "待整理",
        "date": "2026-11-13",
        "status": "active",
        "source": "未核對",
        "text": "我查過來源了。"
      },
      {
        "id": "source",
        "title": "照片備份來源",
        "category": "來源資料",
        "date": "2026-11-13",
        "status": "active",
        "source": "官方說明A",
        "text": "# 官方說明摘要\n先複製檔案，再確認檔案數量與抽查內容。"
      }
    ],
    "solution": "請見 [照片備份的官方說明摘要](note:source)。",
    "kind": "link"
  },
  {
    "title": "04 引用跟自己的想法分開",
    "topic": "Markdown",
    "story": "用引用區塊標出來源原文，並在引用區塊外加上自己的觀察。加入 note:source 連結，讀者才能回頭看出處。只核對結構，不替你評斷心得是否理解。",
    "docs": [
      {
        "id": "draft",
        "title": "工作筆記",
        "category": "待整理",
        "date": "2026-11-13",
        "status": "active",
        "source": "未核對",
        "text": "先複製再抽查。\n我想先挑一個小資料夾試做。"
      },
      {
        "id": "source",
        "title": "備份原文",
        "category": "來源資料",
        "date": "2026-11-13",
        "status": "active",
        "source": "官方說明A",
        "text": "# 備份說明\n先複製，再抽查檔案是否可開啟。"
      }
    ],
    "solution": "> 先複製，再抽查檔案是否可開啟。\n\n來源：[備份原文](note:source)。\n\n我的觀察：先挑一個小資料夾試做。",
    "kind": "quote"
  },
  {
    "title": "05 指令別變成排版",
    "topic": "Markdown",
    "story": "把 console.log(\"# 不是標題\"); 放入標示 js 的圍欄程式碼區塊。它應該原樣顯示，而不是執行。",
    "docs": [
      {
        "id": "draft",
        "title": "工作筆記",
        "category": "待整理",
        "date": "2026-11-13",
        "status": "active",
        "source": "未核對",
        "text": "console.log(\"# 不是標題\");"
      }
    ],
    "solution": "```js\nconsole.log(\"# 不是標題\");\n```",
    "kind": "code"
  },
  {
    "title": "06 比較資料用表格",
    "topic": "Markdown",
    "story": "用表格呈現「檢查方式／能確認什麼」，至少兩筆資料。表頭下需要分隔列；只檢查表格與資料列，不判定文字品質。",
    "docs": [
      {
        "id": "draft",
        "title": "工作筆記",
        "category": "待整理",
        "date": "2026-11-13",
        "status": "active",
        "source": "未核對",
        "text": "檢查方式 能確認什麼\n數量比對 是否少檔案\n抽開檔案 是否至少部分內容可讀"
      }
    ],
    "solution": "| 檢查方式 | 能確認什麼 |\n| --- | --- |\n| 數量比對 | 是否少檔案 |\n| 抽開檔案 | 部分內容可讀 |",
    "kind": "table"
  },
  {
    "title": "07 程式碼區塊忘了關",
    "topic": "Markdown",
    "story": "原稿少了結束圍欄，讓「檢查結果」也被吃進程式碼。修好後需同時有一個程式碼區塊，以及區塊外的二級標題「檢查結果」。",
    "docs": [
      {
        "id": "draft",
        "title": "工作筆記",
        "category": "待整理",
        "date": "2026-11-13",
        "status": "active",
        "source": "未核對",
        "text": "# 測試紀錄\n\n```js\nconsole.log(1 + 1);\n\n## 檢查結果\n畫面顯示 2。"
      }
    ],
    "solution": "# 測試紀錄\n\n```js\nconsole.log(1 + 1);\n```\n\n## 檢查結果\n畫面顯示 2。",
    "kind": "repair"
  },
  {
    "title": "08 筆記取名與歸類",
    "topic": "知識庫",
    "story": "把工作稿名稱改為包含「照片備份」的具體名稱，分類改為「操作紀錄」，日期保留 2026-11-13，來源選「實測紀錄」。內容至少加一個一級標題。需按「儲存到本輪筆記」才算變更。",
    "docs": [
      {
        "id": "draft",
        "title": "筆記1",
        "category": "待整理",
        "date": "2026-11-13",
        "status": "active",
        "source": "未核對",
        "text": "我剛剛有做。"
      }
    ],
    "solution": "# 照片備份操作紀錄\n已複製並抽查。",
    "kind": "metadata"
  },
  {
    "title": "09 用問題找筆記",
    "topic": "知識庫",
    "story": "用搜尋找出「刪錯檔案後怎麼恢復」的有效說明，開啟正確筆記並標記為本題依據。在工作稿加入該筆記連結，再儲存。不要把過期說明當作目前版本。",
    "docs": [
      {
        "id": "draft",
        "title": "工作筆記",
        "category": "待整理",
        "date": "2026-11-13",
        "status": "active",
        "source": "未核對",
        "text": "# 我的查找結果\n還沒找到。"
      },
      {
        "id": "current",
        "title": "恢復刪錯的檔案",
        "category": "操作說明",
        "date": "2026-11-13",
        "status": "active",
        "source": "官方說明B",
        "text": "# 恢復刪錯的檔案\n先到資源回收筒查看檔案，再選還原。若沒有，檢查既有備份。"
      },
      {
        "id": "old",
        "title": "舊版恢復刪錯檔案",
        "category": "操作說明",
        "date": "2025-01-02",
        "status": "superseded",
        "source": "官方說明A",
        "text": "# 舊版恢復方式\n這篇只供舊版工具參考，已被新版取代。"
      },
      {
        "id": "photo",
        "title": "照片備份",
        "category": "操作說明",
        "date": "2026-11-13",
        "status": "active",
        "source": "未核對",
        "text": "# 備份照片\n這篇是複製照片的流程，不是刪除後還原。"
      }
    ],
    "solution": "# 查找結果\n[目前恢復方式](note:current)",
    "kind": "retrieval"
  },
  {
    "title": "10 新舊說明不要混用",
    "topic": "知識庫",
    "story": "兩份說明適用版本不同：v1 是 2025 年舊工具；v2 是 2026 年目前工具。把舊筆記標成「已被取代」，新版保持「有效」，並把工作稿的連結更新為 note:new。實際修改三份文件後分別儲存，不是只選「新版較好」。",
    "docs": [
      {
        "id": "draft",
        "title": "工作筆記",
        "category": "待整理",
        "date": "2026-11-13",
        "status": "active",
        "source": "未核對",
        "text": "# 使用說明索引\n[操作方式](note:old)"
      },
      {
        "id": "old",
        "title": "工具 v1 操作",
        "category": "操作說明",
        "date": "2025-01-01",
        "status": "active",
        "source": "官方說明A",
        "text": "# 工具 v1\n適用：舊版。按「匯出」取得檔案。"
      },
      {
        "id": "new",
        "title": "工具 v2 操作",
        "category": "操作說明",
        "date": "2026-11-13",
        "status": "active",
        "source": "官方說明B",
        "text": "# 工具 v2\n適用：目前版本。按「下載」取得檔案。"
      }
    ],
    "solution": "# 目前工具的使用索引\n[工具 v2 操作](note:new)",
    "kind": "version"
  },
  {
    "title": "11 修好知識庫斷鏈",
    "topic": "知識庫",
    "story": "工作稿指向不存在的 note:missing。找出現有的「檢查備份」筆記，把連結修到 note:check，並開啟確認內容。驗收會檢查實際連結目標，不只比對顯示文字。",
    "docs": [
      {
        "id": "draft",
        "title": "工作筆記",
        "category": "待整理",
        "date": "2026-11-13",
        "status": "active",
        "source": "未核對",
        "text": "# 備份索引\n[檢查備份](note:missing)"
      },
      {
        "id": "check",
        "title": "檢查備份",
        "category": "操作說明",
        "date": "2026-11-13",
        "status": "active",
        "source": "實測紀錄",
        "text": "# 檢查備份\n比對檔案數量，抽查照片可開啟。"
      }
    ],
    "solution": "# 備份索引\n[檢查備份](note:check)",
    "kind": "broken"
  },
  {
    "title": "12 從操作到可重用筆記",
    "topic": "整合",
    "story": "把這次練習寫成一份筆記：包含「目的、步驟、成功證據、待釐清」四個二級標題、有序步驟、程式碼區塊及 note:record 的依據連結。名稱具體、分類「操作紀錄」、來源「實測紀錄」，並開啟依據。只驗證結構與來源可追溯，不用字數或關鍵字冒充理解評分。",
    "docs": [
      {
        "id": "draft",
        "title": "未命名",
        "category": "待整理",
        "date": "2026-11-13",
        "status": "active",
        "source": "未核對",
        "text": "今天學了很多！"
      },
      {
        "id": "record",
        "title": "本次實際操作",
        "category": "原始紀錄",
        "date": "2026-11-13",
        "status": "active",
        "source": "實測紀錄",
        "text": "# 原始操作紀錄\n目的：確認備份程式可計算檔案數量。\n操作：執行 console.log(3)。\n觀察：畫面顯示 3。\n限制：沒有驗證每個檔案內容，也未測其他資料夾。"
      }
    ],
    "solution": "# 備份程式操作紀錄\n\n## 目的\n確認計數指令的輸出。\n\n## 步驟\n1. 執行以下指令\n2. 觀察輸出\n\n```js\nconsole.log(3);\n```\n\n## 成功證據\n畫面顯示 3，見[原始操作紀錄](note:record)。\n\n## 待釐清\n尚未測試其他資料夾，也未驗證檔案內容。",
    "kind": "final"
  }
];
if(typeof module!=='undefined')module.exports=NoteTasks;
