# 過敏搔癢大挑戰驗收

## 2026-10-28 發布候選

- 乾淨、隔離的 Git worktree；沒有改動既有服務設定、連接埠或其他遊戲邏輯。
- `node --check itch-challenge.js`、`node --check itch-challenge-engine.js` 及兩份瀏覽器 QA helper 語法檢查通過。
- `node --test tests/*.test.cjs`：189 項全過，沒有排除任何測試。
- 原站共用 `arcade-fx.css/js` 與候選內容 2/2 逐位元相同。
- 瀏覽器政策拒絕 `127.0.0.1` 導覽，未調整政策。發布前使用原公開站首頁作 DOM 候選預覽：將同一候選的 CSS／JS 內嵌、原創 SVG 轉成 data URI；不是本機伺服器瀏覽器測試，也不是正式部署。
- `tests/itch-challenge-browser-qa.js`：1280×900、360×800、740×390 各通過 41 項檢查。每個尺寸都完成正式／暖身的完整三區、失敗／重試、重新開局、警報、紅手誤碰、連擊、按住中斷、鍵盤、合成指標、失焦與背景自動暫停、手動繼續、長按選字防護、所有狀態的水平溢出及圖片載入檢查。
- 指標測試有暫時 stub `setPointerCapture`，只證明 DOM 事件處理；不代表原生指標捕捉或實體觸控裝置已驗證。
- `tests/itch-challenge-native-qa.js`：未修改 requestAnimationFrame／原生時鐘，以自動鍵盤輸入走完暖身三區，遊戲36秒、實際36.104秒，封印20隻、誤碰0次。不是人工遊玩。
- 關閉共用小動畫後 `aria-pressed=false`，操作區 computed `transitionDuration=0s`，仍可開始遊戲並顯示藍怪；沒有實測作業系統減少動態效果設定。
- 直式首頁與遊戲畫面均已目視檢查；發布前瀏覽器 errors 為0。

## 發布後重跑

分別重新導覽以下兩個來源，不能沿用 DOM 預覽當作部署證據：

- <http://bigmac.dorac7.com:5487/itch-challenge.html>
- <https://dorac7.github.io/double-standard-game/itch-challenge.html>

每個來源都在桌機與窄手機尺寸執行 `itchBrowserQA()`；另比對入口、首頁、引擎、CSS、JS、SVG、共用效果資產與發布候選位元組，並核對該 commit 的 GitHub Pages deployment status。確認首頁新入口與分類／隨機推薦仍有效。

## 驗收界線

尚未操作實體 iPhone／Android，也未在實體 Safari 實測長按。沒有使用皮膚照片、玩家輸入、真實用藥或健康紀錄；全為卡通反應遊戲，分數不評估健康。
