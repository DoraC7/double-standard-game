# 搗蛋大挑戰擴充驗收

本次只擴充搞事小學堂；大廳58款不變，原版12幕保留。

## 可重跑的檢查

- `node --test tests/*.test.cjs`：435項通過（含新20項）。
- 透過HTTP載入 `mischief-school.html#prank-challenge`，注入 `tests/mischief-challenge-browser-qa.js` 並呼叫 `mischiefChallengeQA()`。
- 新9幕全流程：位置與順序、逐步觸發、彩帶來源未停不能掃乾淨、C/B/A實際回覆與紙卡、三種故障重現和不同題修復。
- 驗收後無演出控制，重演保留首次，下載TXT含九幕首次／最近與實際操作，切換原版／深連結正常。
- 同頁注入 `tests/mischief-school-browser-qa.js` 並呼叫 `mischiefSchoolQA()`：原版三個道具分支、完整／快閃／單片場及重演共8組檢查。
- 在1280×850、360×740、740×360重跑，不水平溢出、無pageerror；檢視窄版實際畫面。舞台使用本機SVG，避免缺少emoji字型看不見角色。
- 真正鍵盤Enter／Space及原生下拉選單操作，觸控模擬完成連鎖一幕；減少動態效果模式，失焦自動暫停。

此為瀏覽器尺寸與觸控模擬，不是真實手機測試。聲音只有文字，不要求開音效。所有道具和故障是本頁模擬，沒有真實設備連線、飲料、帳號、持久儲存或上傳。
