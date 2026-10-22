# Terminal Quest QA — 2026-10-20

## Automated checks

- `node --test tests/terminal-quest.test.cjs`: virtual filesystem behavior, errors without mutations, quoted names, hidden files, command completion, final-delivery evidence, equivalent paths and all 14 missions.
- `node --check terminal-quest.js` and `git diff --check`.

## Local browser checks

Served with `python3 -m http.server 8765 --bind 127.0.0.1`. An isolated Chromium launched via the host's existing Playwright Core performed the checks; the OpenClaw browser tool rejected loopback navigation, so no browser configuration or navigation policy was changed. No runtime dependency was added to the game.

- Completed all 14 missions through the command input and next buttons, including an absolute-path `cd` alternative.
- All four concept questions: deliberately selected an incorrect answer (next remains hidden), then the correct one.
- Typed `$ pwd`: shows prompt-marker guidance, does not pass the mission.
- Expanded both hints; removed a seeded file then restored it with Undo; created an unwanted file then restored the mission checkpoint with Retry.
- `clear` visibly clears terminal output without clearing the filesystem or exported transcript.
- Exported `.txt` contains commands, output, undo/retry markers, concept answers, completion evidence and the player's own note; download filename verified.
- Sandbox deletion does not change lesson filesystem or completion; sandbox reset restores initial files.
- Command-history up/down, completion button and Tab focus navigation verified. Tab reaches Run rather than trapping focus.
- Desktop 1365px, mobile widths 390px and 320px, landscape 844×390: no horizontal document overflow, Run remains usable; screenshots inspected on desktop and 390px.
- Reduced-motion setting: reload works and clears progress as documented. No localStorage or sessionStorage entries.
- Lobby: eight cards, learning filter includes both terminal and zhuyin, random recommendation dialog opens with the correct category label and relative play link, Escape closes it, terminal card navigates correctly.
- Old `?old=1#r=abc` lobby link still redirects to `double-standard.html?old=1#r=abc`.
- No page runtime errors observed in these flows.

No claim of physical-device, Safari or real shell/Git execution testing. This game intentionally runs only the documented command subset.

## Follow-up: terminology and uname — 2026-10-20

- Replaced 補完 with 自動補全 in UI, feedback, and documentation. Ctrl+Space/button still complete; Tab still moves focus to Run.
- Added explicitly fictional `uname` information with POSIX-style `-a`, `-s`, `-n`, `-r`, `-v`, `-m` flags; no device detection. Unsupported commands now explain the simulator limitation rather than implying a real command does not exist.
- `node --test tests/terminal-quest.test.cjs`: 15/15 passed, including all 14 missions and new uname flag/error/non-mutation checks.
- Focused local Chromium checks at 1365×950, 390×844, 320×640, and 844×390: completion button/Ctrl+Space, Tab focus, uname output/help, unsupported-command guidance, transcript export, lesson/sandbox isolation, lobby link, no horizontal overflow or page runtime errors. Mobile screenshot inspected.

## 全指令相容性檢查（2026-10-22）

完整入口、接受的等效寫法與保留限制見 [command-compatibility-audit.md](command-compatibility-audit.md)。

- 全站 `node --test tests/*.test.cjs`：62/62 通過；其中 Git 22 項、終端機 24 項。引擎測試包含 6 條 Git 完整 10 關路線、3 條終端機完整 14 關路線。
- 本機 HTTP server + 主機既有獨立 Chromium／Playwright：1280×900 與 390×844 各自用新增等效指令完整走過 Git 10/10、終端機 14/14；觀念題錯答不前進，正答才前進。無 pageerror。
- 桌面／手機均實際下載並讀回兩款 .txt，確認保留原始等效指令、通關證據與玩家自寫筆記。沙盒隔離、復原、clear 保留紀錄、跳脫空白名稱自動補全、↑ 歷史與 Tab 焦點均通過。
- 兩尺寸的兩款遊戲與首頁無水平溢位；桌面／手機完整截圖目視檢查；reduced-motion 開啟下可操作。首頁仍有 10 款遊戲。
- 額外以真正的本機 Git 在獨立暫存倉庫對照 9 項短格式狀態、暫存、commit -am 與分支切換結果，符合已宣告子集。遊戲比真實 Git 更嚴格的乾淨工作目錄要求仍保留，不以真實 Git 可切換推論遊戲必須放行。
- OpenClaw browser 實測仍拒絕 loopback；未改動導覽政策，改用主機既有獨立 Chromium。未安裝專案依賴。
- 這是修正分支的驗證；尚未合併／部署，不宣稱已上正式站或實體手機／Safari 驗證。


## 12 關擴充驗證（2026-10-22）

本節是最新擴充驗證；前文的 10／14 關與 62 項為當時版本的歷史記錄。

- 全站 `node --test tests/*.test.cjs`：74/74 通過。新增 `practice-expansion.test.cjs` 的 12 項測試涵蓋兩條完整 Git 16 關路線、終端機 20 站、還原來源／錯誤原子化、show 讀取位置、安全刪分支、過期差異證據、find／grep／head／tail。
- 本機 HTTP + 既有獨立 Chromium／Playwright，在 1280×900、390×844 透過真實表單輸入完成 Git 16/16、終端機 20/20；每題觀念題先錯答、再正答，錯答不前進。無 pageerror。
- Git 取消暫存後按 Undo，再 status 不會通過；重來本關後需重新操作。終端機 head 後重來，再單獨 tail 不通過，重新 head／tail 才通過；證據確實清除。
- 兩尺寸都下載並讀回兩款 .txt，核對實際指令、新關卡證據與使用者自寫筆記；clear 後早期指令仍在匯出紀錄。沙盒隔離、Undo、跳脫空白的自動補全、歷史與 Tab 焦點正常。
- 目視檢查新 Git 雙差異關的手機完整截圖與終端機日誌關的桌面完整截圖。兩尺寸的兩款與首頁無水平溢位。
- 額外在 320×640 與 844×390 展開指令小抄、切沙盒，無水平溢位、Run 可用、localStorage／sessionStorage 無新增；使用 reduced-motion。
- 獨立暫存參考倉庫與文字檔，用真正本機 Git、find、grep、head、tail 做 16 項對照：restore 工作區／暫存區／兩區、取消新檔暫存、show 兩位置、安全刪指標、讀日誌與找檔結果，在宣告子集內一致。
- JavaScript 語法與 `git diff --check` 通過。未新增依賴、網路呼叫或資料持久儲存。OpenClaw browser 拒絕 loopback，使用主機既有的獨立 Chromium，未更改導覽政策。
- PR 基於尚未合併的 #20，相容性修正需先合入。此為擴充分支本機驗證，尚未部署；未驗證實體手機／Safari。
