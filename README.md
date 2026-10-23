# Dora playground

十二款免費、純前端小遊戲，從 `index.html` 入口進入。

## 試玩

GitHub Pages：<https://dorac7.github.io/double-standard-game/>。同一份遊戲也由現有伺服器提供：<http://bigmac.dorac7.com:9487/>。

## 雙標大挑戰

「雙標大挑戰」（`double-standard.html`）是一款換位選擇遊戲。先替別人處理一件事，隔幾回合在相同條件下換自己面對；兩輪使用同一組具體選項，最後才比較是否改了標準。通融本身不算雙標，前後一致才是判準。

## 三秒就忘記

獨立小遊戲「三秒就忘記・記憶搬家」：<https://dorac7.github.io/double-standard-game/three-second-forget.html>。看物品架，再從混入干擾物的桌面把物品放回原位；可選 6 秒／4 關輕鬆局、3 秒／8 關挑戰局或 3 秒／12 關魔王局。每局從 18 種場景重抽物品與位置；挑戰和魔王局會穿插事先提示的鏡像關，要把所見順序左右顛倒擺放。純前端，從共同入口連入。

## 等一下星球

「等一下星球」：<https://dorac7.github.io/double-standard-game/start-small.html>。48 種任務、24 種藉口事件；6 關輕鬆、12 關挑戰或 20 關星際長征（共 40 段選擇），每關先選小步再應對障礙，任務、藉口與選項順序每次重抽，同一局任務與藉口各不重複。無倒數、可重選；第一次選對得一顆星。結算可自訂一個現實小步，使用可暫停的兩分鐘計時器。任務文字只在分頁記憶體內，不持久儲存或上傳；遊戲不宣稱治療拖延症或 ADHD。

## 多拉甩尾俱樂部

「多拉甩尾俱樂部」：<https://dorac7.github.io/double-standard-game/mini-kart.html>。純 Canvas 原創偽 3D 單機卡丁車，花園、海岸、夜市三條路；兜風 2 圈或正式賽 3 圈，自動加速、左右轉向、按住甩尾後放開衝刺。星星只記收集數，道具箱隨機給護盾或加速，香蕉／路障讓車暫時變慢；有 3 台電腦對手。方向鍵或 A/D 轉向、空白鍵或 Shift 甩尾、P 暫停；手機可按住按鍵或在賽道拖動。切換分頁與視窗失焦自動暫停。重玩重新生成障礙和道具，無帳號／持久儲存。

## 過動大挑戰

`hyper-challenge.html`、`.css`、`.js` 與 `bolt.svg`：原創節奏反應遊戲。左右拍點、任一鍵長按蓄力後放開、紅燈期間停手，暖身 72 BPM / 12 拍、派對 105 BPM / 24 拍、暴走 132 BPM / 36 拍。前四拍帶入四種操作，其餘隨機。以圓環收合提示時機；可選音效，不必開聲音才能玩。手機雙鍵支援 pointer capture，鍵盤方向鍵或 Z/X；P、Escape、失焦或切換分頁可暫停。無淘汰、帳號、儲存或外部套件，分數不是心理診斷。


## ㄅㄆㄇ 小小探險家

`zhuyin.html`、`zhuyin.css`、`zhuyin.js`、`zhuyin-adventure.css`、`zhuyin-adventure.js`、`zhuyin-data.js`、`zhuyin.svg` 與 `assets/zhuyin/`：幼兒園至國小注音練習。使用中華民國教育部《國語注音符號手冊》37 個正式錄音與 SVG 筆順素材，原有五種玩法（新增的小一進階見下節）：

- 符號花園：聽音、逐筆看寫法。
- 聽音找朋友：每局 6 題，起步 2 選 1、進階 4 選 1。
- 翻翻配對：2／4／6 對卡片，翻牌聽音、記住位置；配錯由玩家決定何時蓋回，不限時。
- 小島尋寶：聽錄音後點島嶼，或拖動小船；三張地圖分別有 4／9／12 座島、收集 3／4／5 顆星，收齊後親手開寶箱。
- 聲調小火車：橫式或直式注音，一聲到輕聲各一題。只練符號與標注，不是聽音辨調或完整拼讀課程。

探索護照以完成任務解鎖五枚徽章（花園需親手點選三個不同符號）；切換分頁不會自動解鎖。所有玩法一開始都可選，不強迫依序過關；重新整理後護照重置。無倒數、可重試、無合成語音或麥克風。拖曳之外保留點選與鍵盤操作；切換瀏覽器分頁時停止聲音，尋寶須重播線索才能繼續。

資料核對、教材範圍與 CC BY 4.0 姓名標示見 [ZHUYIN-SOURCES.md](ZHUYIN-SOURCES.md)。原始音檔與授權聲明隨站發布，不依賴教育部網站即時載入。驗證資料可執行 `node --test tests/zhuyin-data.test.cjs`。

### 小一進階：注音拼讀與聽力考試（2026-10-18）

打開 `zhuyin.html` 現在直接進入「小一拼讀挑戰」。原有五種玩法保留，探索護照增為六站。新增：

- 二拼：聽「棒」，選 ㄅㄤ；先不考聲調。
- 三拼：聽「瓜」，選 ㄍㄨㄚ，練含介音的拼讀。
- 聲調進階：聽「棒」，選完整 ㄅㄤˋ。
- 拼讀卡、四選一練習、拼字積木、10／20 題聽力考試；考試每題答一次，交卷後才公布結果，可重播及只重練錯題。

使用教育部《國語辭典簡編本》2014_20260929 版文字與單字原始錄音，原檔完整保留，只選播開頭詞目字音段落；不是把單個注音的錄音硬接成國字。資料與授權詳見 [ZHUYIN-SOURCES.md](ZHUYIN-SOURCES.md)。新增檔案為 `zhuyin-words.js`、`zhuyin-spelling.js`、`zhuyin-spelling.css`、`assets/zhuyin-words/`，部署時須一併發布。

資料與題目選項檢查：

```sh
node --test tests/zhuyin-data.test.cjs tests/zhuyin-spelling.test.cjs
```

## ADHD 日常賓果

`adhd-bingo.html`、`adhd-bingo.css`、`adhd-bingo-data.js`、`adhd-bingo.js` 與 `bingo.svg`：40 則原創繁中敘述，3×3／5×5 均衡抽題、自選勾選、自由格、橫直斜連線、重抽、清除、一層復原、各格生活小提示。可在本機產生 PNG（保留非診斷說明）；同款空白卡連結只含卡號與尺寸，不含勾選。無帳號、依賴、持久儲存或答題上傳，刷新清空。

這是趣味自我觀察，不是 ADHD 篩檢、診斷或治療。格數與連線沒有醫療意義；不給任何人預設勾選。玩法、資料來源與隱私邊界見 [ADHD-BINGO-SOURCES.md](ADHD-BINGO-SOURCES.md)。

資料、抽卡與連線邏輯檢查：`node --test tests/adhd-bingo.test.cjs`。


## 龍蝦終端機探險

試玩：<https://dorac7.github.io/double-standard-game/terminal-quest.html>。

20 站繁中入門任務，親手操作 `pwd`、`ls`、`cd`、`cat`、`mkdir`、`touch`、`cp`、`mv`、`rm`、`clear` 與模擬 `git --version`。建立、複製、改名、刪除後需再用讀取指令核對；五題觀念確認分辨建立與進入、複製與搬移、清畫面與刪檔、查版本與安裝。接著完成隱藏檔、巢狀目錄、空白檔名、find 找檔、grep 查日誌、head／tail 讀取局部內容，共 20 站。find 支援 -type、-name（引號內 *／?）；grep 僅固定文字 -F，支援 -n／-i／-v／-c 及對應長選項；head／tail 接受 -n／--lines／-2 等非負筆數（最多 10000 行），不實作 tail -f。不只比對固定字串，接受等效的相對／絕對路徑；也接受 `ls -la`／`--all`、`mkdir -p`／`--parents`、`cd -`、`pwd -L/-P`、`git -v`、多檔操作及用 `--` 分隔選項。`ls -l` 的權限／時間僅為示意；多檔指令失敗時整條不改環境，與真實指令可能部分成功不同。

- 每關兩段按需提示、不限時、不扣分；可復原最近一次位置／檔案改動、重來本關。
- 獨立自由沙盒，切回關卡保留本分頁進度。↑↓ 呼叫指令歷史，Ctrl+Space 或按鈕自動補全指令／檔名；Tab 正常移動焦點。小抄點擊只填入、不自動執行。支援觸控與鍵盤。
- 即時虛擬檔案地圖與目前路徑；操作紀錄可複製或下載 UTF-8 `.txt`，`clear` 不會抹掉匯出紀錄。玩家可加入自己寫的筆記，遊戲不代寫。
- 所有檔案、指令、進度與筆記只在本分頁記憶體；不持久儲存、不上傳。刷新／關閉即重置；需保留時請自行匯出。
- 不是完整 shell，也不執行任何真正的電腦指令。POSIX 風格，非 Windows cmd；Git 只模擬版本，不能驗證本機安裝或 GitHub 登入。`uname` 與 `uname -a`（另支援 `-s`、`-n`、`-r`、`-v`、`-m`，可合併或使用對應長選項）只顯示明確標示的虛構系統資訊，不偵測裝置。只處理列出的操作，不支援管線、重導向、變數、shell 萬用字元展開、遞迴改動操作。`cp`／`mv` 僅支援檔案且拒絕直接覆蓋；真實指令可能覆蓋。`rm` 的遊戲復原鈕不代表真實 shell 有相同功能。

新增檔案：`terminal-quest.html`、`terminal-quest.css`、`terminal-quest.js`、`terminal-engine.js`、`terminal-missions.js`、`terminal.svg`。全部為無依賴靜態資產，與首頁一併發布。

既有方案預查：[Bashcrawl](https://github.com/notklaatu/bashcrawl) 使用實際 POSIX shell／外部 Binder；[xterm.js](https://github.com/xtermjs/xterm.js) 是終端機顯示元件而非教學引擎。為保持原站免安裝、無後端、繁中與無依賴，本遊戲獨立實作簡化的虛擬檔案系統，未複製上述專案的程式或題目。

檢查引擎、檔案效果、錯誤與完整通關：

```sh
node --test tests/terminal-quest.test.cjs
```


## 龍蝦 Git 時光機

試玩：<https://dorac7.github.io/double-standard-game/git-quest.html>。

16 關繁中模擬練習：初始化、status、add、commit、diff／diff --staged、log、分支、switch／checkout 與 fast-forward merge。建立並切換分支可用 `git switch -c soup` 或 `git checkout -b soup`；切回主線可用 `git switch main` 或 `git checkout main`，也接受先 branch 再切換。也接受 `status -sb`、`add -A/--all/-u/--update`、多檔和 `./檔名`、`diff --cached`、`commit --message`／`-m訊息`／`-am`、`log -n 1`／`-1`／`--max-count=1`、`branch --list/--show-current`、`switch --create` 與 `merge --ff-only`。`commit -a` 只收追蹤檔修改，不收未追蹤檔。新增 6 關練習取消暫存、還原工作區、show 讀取提交、雙份修改、普通 commit 保留草稿，以及刪除已合入主線的本地分支。支援 `restore [--staged/-S] [--worktree/-W] [--] 檔案…`／`.`，可合併為 -SW，不支援 --source；`show [HEAD|分支|完整模擬提交 ID][:檔名]`／`:檔名`；`branch -d/--delete` 只允許已合入目前分支的本地指標（不模擬 upstream）。用內建編輯器改菜單，觀察工作區、暫存區與 HEAD 三份內容；每段操作需再用讀取指令核對，五題觀念題區分暫存快照與工作區、遊戲內合併與遠端發布。

獨立沙盒、指令歷史、小抄、提示、重來本關、最近環境改動復原、實際操作紀錄與自寫筆記下載。進度、檔案、版本和筆記只存在本分頁記憶體，無持久儲存或上傳；刷新即清空。

不是完整 Git 或 shell，不執行系統指令或連接 GitHub。不模擬 remote／push／pull／rebase／reset／三方合併或衝突；checkout 只支援分支切換與 -b 建立分支，不含還原檔案、指定起點或 detached HEAD。只支援根目錄文字檔與單一父提交、快轉合併。提交編號是模擬流水號，非真實雜湊。切換與合併要求乾淨工作目錄，比真實 Git 更嚴格。差異以整份舊／新文字顯示；未追蹤檔不列入 diff。初始分支固定 main；分支名稱可包含 `/`（例如 feature/soup）。這仍是列明範圍的教學子集，未知選項不代表真實指令不合法。上限為每檔 6000 字、15 個工作檔、15 分支、80 提交；復原按鈕不代表真實 Git 有相同功能。

部署須帶上 `git-quest.html`、`git-quest.css`、`git-quest.js`、`git-engine.js`、`git-missions.js`、`git.svg`，並保留共用的 `terminal-quest.css`。不新增外部依賴。終端機探險仍只模擬 git --version；更多 Git 模擬練習由此獨立入口提供。免費延伸：[Learn Git Branching](https://learngitbranching.js.org/)、[Software Carpentry Shell 入門](https://swcarpentry.github.io/shell-novice/)。沿用現有繁中無依賴遊戲，未複製外部課程題目或引入其程式。

引擎與完整通關檢查：`node --test tests/git-quest.test.cjs`。

## 提問與下指令練習場

試玩：<https://dorac7.github.io/double-standard-game/prompt-practice.html>。

六個日常技術情境，逐題練習找缺口並追問、比較兩種問法、修正預設模擬回答，再換到新情境應用。另有目標、背景、限制、輸出格式和驗收方式五種技巧的前後對照卡；提示分層顯示，先作答才看自我檢核與完整參考。不連接 AI；模擬回答是預先編寫，自由文字不會被關鍵字評分。草稿只留在目前分頁記憶體，不儲存、不上傳；重新整理即清空。這是溝通練習，不是能力測驗。

檔案：`prompt-practice.html`、`prompt-practice.css`、`prompt-practice.js`、`prompt-practice.svg`。若想練習實際的模擬終端機指令，另有[龍蝦終端機探險](https://dorac7.github.io/double-standard-game/terminal-quest.html)。



## 本機啟動

需要 Python 3，無需安裝套件或付費 API：

```sh
python3 -m http.server 8765
```

在本目錄執行後，開啟 <http://localhost:8765/>。不要直接用 `file://` 開啟，以便跟網站部署方式一致。

## 玩法

- 雙標遊戲可選「故事模式」或「經典完整挑戰」。故事模式是 5 個固定職場事件、10 回合的短篇，有角色訊息與事件進度；經典模式從 179 個獨立情境抽 15 案、換位重演，共 30 回合。
- 情境選項不會按編號扣資源；遊戲只比較同案兩次選擇是否一致，不以選項本身評判人格或善惡。
- 每回合有倒數計時，較長題目延長時間；超時算棄權，不會代選，也不計入前後是否一致的比較。
- 音效與動畫預設開啟，倒數、音效和動畫可分別關閉。瀏覽器會在首次操作後啟用聲音。結算頁可分享包含模式、本局結果和逐案選擇的連結；資料存在連結中，沒有帳號或伺服器排行榜。舊版經典模式分享連結仍可讀取。

## 專案檔案

- `index.html`：十二款遊戲共同入口；舊首頁 `#r=` 戰績連結自動轉到雙標遊戲並保留片段。
- `double-standard.html`：原雙標遊戲的畫面、流程和計分。
- `start-small.html`、`start-small.css`、`start-small.js`：拖延啟動遊戲。
- `mini-kart.html`、`mini-kart.css`、`mini-kart.js`、`kart.svg`：迷你卡丁車與原創插圖。
- `rocket.svg`、`masks.svg`、`box.svg`：本地向量插圖，不依賴外部字型或圖片服務。
- `scenarios.js`：情境題庫，包括替別人和換自己時的敘述。
- `choices.js`：每案兩輪共用的具體行動選項。
- `v2.html`、`v3.html`：早期原型存檔，不是目前遊戲入口。
- `three-second-forget.html`：獨立的三秒記憶遊戲，不載入雙標題庫。

新增情境時，在 `scenarios.js` 加入唯一標題及兩種視角，並在 `choices.js` 以該標題加入對應選項。請保持同一案的條件與選項一致，再檢查手機畫面與完整一局。

## 部署

這是靜態網站。GitHub Pages 可發布倉庫根目錄的 `index.html` 作共同入口；所有十二款遊戲的 HTML、CSS 和 JS 必須同時發布。啟用 Pages 後，分享連結會自動以當前網站網址產生。發布設定由倉庫擁有者決定。

## 授權

尚未選定開源授權；公開倉庫不等於授權他人再利用。由倉庫擁有者確認後再加入 `LICENSE`。


## 參與修正與 Pull Request

1. 選一個 [Issue](https://github.com/DoraC7/double-standard-game/issues)，先讀需求與 [AGENTS.md](AGENTS.md) 的相容性、素材姓名標示與隱私規則。
2. 把倉庫 clone 到本機（沒有寫入權限時先在 GitHub Fork，再 clone 自己的倉庫）。在倉庫目錄建立分支，例如 `git switch -c fix/lobby-count`。
3. 做小範圍修改，依「本機啟動」開站。執行 `node --test tests/*.test.cjs`，再依 [全站冒煙檢查](tests/arcade-smoke-qa.md) 和 [推薦視窗檢查](tests/arcade-dialog-qa.md) 驗證受影響流程。首頁專用測試為 `node --test tests/arcade.test.cjs`。需要 Node.js 才能執行測試，遊玩不需要。
4. 檢查 `git diff`，用 `git add <修改的檔案>`、`git commit -m "Fix lobby count"`、`git push -u origin fix/lobby-count` 上傳。
5. 到 GitHub 建立以原倉庫 `main` 為目標的 Pull Request，引用 Issue（例如 `Closes #9`），附上實際驗證結果；未做的檢查要註明。不要宣稱未設定的 CI 或格式檢查已通過。

PR 說明範例（以實際結果取代括號）：

```text
目的：修正首頁分類數量（Closes #9）
影響檔案：index.html、tests/arcade.test.cjs
驗證：Node 測試（結果）；桌面／手機與鍵盤操作（結果或未測）
畫面：UI 改動時附前後截圖（注意不要含私人資料）
相容性／隱私：保留舊分享連結；未新增儲存或網路傳輸
```


## 心情真好・情緒價值印鈔機

試玩：<https://dorac7.github.io/double-standard-game/emotion-printer.html>。

「如來紫衣師父多拉」是群聊梗改編的虛構喜劇角色。扮演 BigMac 分行經理，接 8 張虛構訂單，選擇彩虹屁開光、誠實接話或查證再印。管理 1,100 點虛擬 Token、發行 EV 與心情熱度，挑戰 20,000 EV 的試營運目標；沒有倒數。金箔滾筒花 120 Token，將後續面額翻倍，但不增加證據。第 4、8 單按當時累計的無依據評價，每張回收 1,000 EV（以餘額為限），不退 Token；會預留後續最低接話費，避免卡死。

可查看逐單流水帳、下載本局 UTF-8 文字帳單與重玩。查證只支持附件所示的具體事項，沒有附件時保留待證；讓人開心與評語是否有依據分開記錄。所有訂單、評語和數值為遊戲設計，不是任何人的人格評價或心理測量；EV 不能兌現、沒有實際 API 費用。無音效、帳號、儲存或玩家資料上傳，刷新清空。

資產：`emotion-printer.html`、`emotion-printer.css`、`emotion-printer.js`、`emotion-printer-engine.js`、`emotion-printer.svg`。沿用現有無依賴靜態遊戲結構，未引入外部平台或付費服務。引擎檢查：`node --test tests/emotion-printer.test.cjs`；人工驗證見 [QA](tests/emotion-printer-qa.md)。

## 多拉語錄・金句開壇

試玩：<https://dorac7.github.io/double-standard-game/dora-quotes.html>。

第十一款「紫衣劇場」虛構喜劇，不是逐字查證的私人聊天紀錄，**改編不冒充本人發言**。25 張卡分為心情開光、進度查帳、龍蝦自嘲與等等系列：6 張節錄既有公開遊戲台詞（可在來源檔對照），9 張為本作原創改編，另有 6 張本次明確指定的遊戲台詞／對話（極簡三句、「等等」、IT 格格不入與原因／感受對話），以及 4 張系列用語選編（未核對歷史聊天原文），逐張標明來源類型，不從私人聊天考古。「經典加映」收錄本次補充的 6 張；等等系列由 4 張增為 7 張。對話卡保留說話者及「可能」語氣，不將 Peter 的接話誤算為 Dora 發言。

- 抽籤典藏：有「極簡三句」「等等系列」「經典加映」專區、依分類抽卡、一輪不重複、收藏／取消收藏、複製附帶喜劇標示的文字、下載自選 UTF-8 文字典藏。剪貼簿不可用時提供手動複製框。
- 金句接龍：每局隨機 8 張不重複題目，三選一、答後揭曉、完整回顧、可重玩。分數只代表本局接梗，不是人格或能力測量。
- 同張卡連結用 `#q=卡片代號`，不包含玩家收藏或作答；不自動發布或發送。所有收藏、紀錄只留在本分頁記憶體，刷新清空，無登入、追蹤、持久儲存或資料上傳。

隨站發布 `dora-quotes.html`、`.css`、`.js`、`dora-quotes-data.js`、`dora-quotes.svg`。資料來源與完整結算檢查：`node --test tests/dora-quotes.test.cjs`。沿用現有無依賴靜態架構，未引入外部服務或套件。
