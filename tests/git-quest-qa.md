# Git 時光機驗證（2026-10-21）

## checkout 相容修正（2026-10-22）

- `node --test tests/*.test.cjs`：44/44 通過，其中 Git 13 項。三條完整 10 關路線分別使用 switch、checkout、branch 後再 checkout；驗證錯誤參數、重複分支、未提交變更與未模擬 checkout 模式均不改環境。
- OpenClaw browser 拒絕 localhost 導航，因此本機開發檢查使用獨立 headless Chromium／既有 Playwright，透過 Python HTTP server 載入修正分支，未新增專案依賴。
- 實際 UI 用 `git checkout -b soup` 與 `git checkout main` 完成全部 10 關、兩題觀念題和快轉合併；切回 main 時編輯器恢復 main 內容。
- 下載並讀回 `.txt`，確認保留原始 checkout 指令、10 關證據與玩家筆記；切換沙盒不改關卡進度，checkout 建分支可復原，文字不執行 HTML，↑ 與 Tab 操作有效。
- 小抄需展開後才能點選；checkout 小抄只填入、不執行。桌面 1280×900、手機 390×844、橫向 844×390；桌面與手機截圖目視檢查，窄版無水平溢位，reduced-motion 可操作。
- 重新整理清空本分頁進度與筆記；首頁 10 個入口、學習分類 3 款、隨機推薦與舊分享轉送有效。上述 UI 流程無 pageerror。
- 以上為本機修正分支驗證，不是正式站已部署的證據。checkout 僅模擬分支切換與 -b 建立分支，未新增檔案還原或 detached HEAD。

## 引擎

`node --test tests/git-quest.test.cjs tests/terminal-quest.test.cjs`：24/24 通過（Git 9、既有終端機 15）。涵蓋 10 關完整路線、add 快照不收錄後續修改、未追蹤 diff、分支切換、快轉不增加提交、分歧拒絕且不改資料、髒工作區保護、提交刪除檔案、錯誤與注入文字、重複 init／merge 和環境隔離。

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
- 重新整理清空進度與筆記。
- 首頁 9 個入口，學習分類 3 款、隨機推薦對話框可開關且使用相對連結。
- 舊 `#r=` 連結由全新導航載入會轉至原雙標頁；首頁仍原封保留 query 與 hash 轉送程式。用無效示例時原遊戲顯示原有警告；沒有改動分享格式。
- 上述流程無 pageerror；首頁與全部新增／共用資產 HTTP 200。

## 範圍

這是快轉合併入門模型，不宣稱完整 Git；不測不存在的 remote、衝突處理或真實 GitHub 發布。遊戲紀錄代表遊戲內操作，不是學員已交作業或真實環境安裝成功的證明。

## 全指令相容性檢查（2026-10-22）

完整入口、接受的等效寫法與保留限制見 [command-compatibility-audit.md](command-compatibility-audit.md)。

- 全站 `node --test tests/*.test.cjs`：62/62 通過；其中 Git 22 項、終端機 24 項。引擎測試包含 6 條 Git 完整 10 關路線、3 條終端機完整 14 關路線。
- 本機 HTTP server + 主機既有獨立 Chromium／Playwright：1280×900 與 390×844 各自用新增等效指令完整走過 Git 10/10、終端機 14/14；觀念題錯答不前進，正答才前進。無 pageerror。
- 桌面／手機均實際下載並讀回兩款 .txt，確認保留原始等效指令、通關證據與玩家自寫筆記。沙盒隔離、復原、clear 保留紀錄、跳脫空白名稱自動完成、↑ 歷史與 Tab 焦點均通過。
- 兩尺寸的兩款遊戲與首頁無水平溢位；桌面／手機完整截圖目視檢查；reduced-motion 開啟下可操作。首頁仍有 10 款遊戲。
- 額外以真正的本機 Git 在獨立暫存儲存庫對照 9 項短格式狀態、暫存、commit -am 與分支切換結果，符合已宣告子集。遊戲比真實 Git 更嚴格的乾淨工作目錄要求仍保留，不以真實 Git 可切換推論遊戲必須放行。
- OpenClaw browser 實測仍拒絕 loopback；未改動導覽政策，改用主機既有獨立 Chromium。未安裝專案依賴。
- 這是修正分支的驗證；尚未合併／部署，不宣稱已上正式站或實體手機／Safari 驗證。


## 12 關擴充驗證（2026-10-22）

本節是最新擴充驗證；前文的 10／14 關與 62 項為當時版本的歷史記錄。

- 全站 `node --test tests/*.test.cjs`：74/74 通過。新增 `practice-expansion.test.cjs` 的 12 項測試涵蓋兩條完整 Git 16 關路線、終端機 20 站、還原來源／錯誤原子化、show 讀取位置、安全刪分支、過期差異證據、find／grep／head／tail。
- 本機 HTTP + 既有獨立 Chromium／Playwright，在 1280×900、390×844 透過真實表單輸入完成 Git 16/16、終端機 20/20；每題觀念題先錯答、再正答，錯答不前進。無 pageerror。
- Git 取消暫存後按 Undo，再 status 不會通過；重來本關後需重新操作。終端機 head 後重來，再單獨 tail 不通過，重新 head／tail 才通過；證據確實清除。
- 兩尺寸都下載並讀回兩款 .txt，核對實際指令、新關卡證據與使用者自寫筆記；clear 後早期指令仍在匯出紀錄。沙盒隔離、Undo、跳脫空白的自動完成、歷史與 Tab 焦點正常。
- 目視檢查新 Git 雙差異關的手機完整截圖與終端機日誌關的桌面完整截圖。兩尺寸的兩款與首頁無水平溢位。
- 額外在 320×640 與 844×390 展開指令小抄、切沙盒，無水平溢位、Run 可用、localStorage／sessionStorage 無新增；使用 reduced-motion。
- 獨立暫存參考儲存庫與文字檔，用真正本機 Git、find、grep、head、tail 做 16 項對照：restore 工作區／暫存區／兩區、取消新檔案的暫存、show 兩位置、安全刪指標、讀日誌與尋找檔案結果，在宣告子集內一致。
- JavaScript 語法與 `git diff --check` 通過。未新增依賴、網路呼叫或資料持久儲存。OpenClaw browser 拒絕 loopback，使用主機既有的獨立 Chromium，未更改導覽政策。
- PR 基於尚未合併的 #20，相容性修正需先合併至。此為擴充分支本機驗證，尚未部署；未驗證實體手機／Safari。
