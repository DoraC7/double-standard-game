# Git 時光機驗證（2026-10-21）

## 引擎

`node --test tests/git-quest.test.cjs tests/terminal-quest.test.cjs`：24/24 通過（Git 9、既有終端機 15）。涵蓋 10 關完整路線、add 快照不收錄後續修改、未追蹤 diff、分支切換、快轉不增加提交、分歧拒絕且不改資料、髒工作區保護、提交刪檔、錯誤與注入文字、重複 init／merge 和環境隔離。

## 瀏覽器

透過 Python HTTP server 與本機 headless Chromium / Playwright 實際走 UI，沒有安裝專案依賴。OpenClaw browser 工具拒絕 localhost 導航，故本機開發驗證使用獨立 Chromium。另以 OpenClaw browser 實際在既有 GitHub Pages 終端機沙盒執行 `uname -a`，確認輸出標示虛構系統。

已驗證：

- 全部 10 關：編輯器套用、輸入指令、狀態核對與兩題觀念確認；選錯不顯示下一關，選對才前進。
- main → soup 修改／提交 → main 內容恢復 → fast-forward 合併 → status 乾淨 → 10/10 通關。
- 實際下載 UTF-8 `.txt`，讀回包含 merge 指令、10 關操作證據與玩家自行輸入的筆記。
- 切換沙盒有獨立環境，切回仍有完整關卡進度；復原環境改動有效。
- HTML 文字以純文字顯示，不產生可執行圖片節點。
- ↑ 指令歷史；Tab 從輸入框到執行按鈕；觸控大小按鈕可點。
- 桌面 1280×900、手機 390×844、橫向 844×390 均無水平溢位；桌面／手機完整截圖目視檢查；reduced-motion 模式可用。
- 刷新清空進度與筆記。
- 首頁 9 個入口，學習分類 3 款、隨機推薦對話框可開關且使用相對連結。
- 舊 `#r=` 連結由全新導航載入會轉至原雙標頁；首頁仍原封保留 query 與 hash 轉送程式。用無效示例時原遊戲顯示原有警告；沒有改動分享格式。
- 上述流程無 pageerror；首頁與全部新增／共用資產 HTTP 200。

## 範圍

這是快轉合併入門模型，不宣稱完整 Git；不測不存在的 remote、衝突處理或真實 GitHub 發布。遊戲紀錄代表遊戲內操作，不是學員已交作業或真實環境安裝成功的證明。
