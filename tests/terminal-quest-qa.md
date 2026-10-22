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
