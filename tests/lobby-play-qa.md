# 首頁互動 QA · 2026-10-28

## 候選驗證

- 全站 `node --test tests/*.test.cjs` 144/144；`node --check lobby-play.js` 通過。保留所有22個遊戲入口、分類會員資格及舊#r=轉址。
- Chromium候選DOM預覽1280×900、320×568、844×390、568×320完整首頁流程：三盞燈／重複點選不增加數量／三燈完成／重設清空。自己的彩紙最多12個，重設取消動畫並移除。
- 不必完成暖身也可抽票。六分類逐一確認篩選人數、票券範圍與推薦結果一致，兩次重抽不連續重複，關閉對話框後正確回到舞台或一般推薦的開啟按鈕。
- 滑鼠pointer事件模擬確實改變圖像computed translate，離開恢復；touch pointer不觸發視差、不攔截遊戲連結。未宣稱實體觸控已測。
- 頂端／底部動畫切換同步；關閉後computed animation none、transition 0s、沒有彩紙與視差，但暖身狀態和抽票仍正常。
- 透過同一Chrome CDP測試連線設定prefers-reduced-motion: reduce（瀏覽器工具未提供此參數），同一連線內核對系統開關disabled、host／spark animation none、light transition 0s；三燈與抽票仍可用。最後清除測試媒體覆寫，沒有修改瀏覽器安全政策。
- 模擬document.hidden／visibilitychange：12粒彩紙變0、stage animationPlayState paused，恢復可見後移除暫停狀態。這是DOM事件模擬，不等同實體背景分頁測試。
- 四種寬高在初始／完成／推薦視窗／全部卡片均無水平溢出；桌面舞台與窄螢幕截圖目視檢查。全部圖片decode正常，瀏覽器錯誤0。

## 界線

發布前使用公開來源頁面上的暫時DOM預覽，所有重用SVG與arcade-fx JS/CSS先逐byte核對；新HTML/CSS/JS直接嵌入。不是本機伺服器測試或部署證據；正式發布後另核對HTML及兩個新增檔案與正式流程。無新增外部函式庫、儲存、追蹤、付費服務或自動音效。尚未測實體手機、Safari、讀屏器。

`lobby-play-browser-qa.js`為瀏覽器evaluate檢查函式，不是網站執行依賴。
