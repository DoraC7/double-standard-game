# Dora playground

二十四款免費、純前端小遊戲，從 `index.html` 入口進入。

## 試玩

GitHub Pages：<https://dorac7.github.io/double-standard-game/>。同一份遊戲也由現有伺服器提供：<http://bigmac.dorac7.com:5666/>。

## 民主聖地噴泉西瓜選市長大挑戰

試玩：<https://dorac7.github.io/double-standard-game/watermelon-mayor.html>。

即時動作遊戲，不再用選項推進競選。操控西瓜在噴泉廣場搶票，冬瓜會自己追逐並拿走同一批選票。正式賽 60 秒，需至少 400 票且超過冬瓜；暖身 30 秒、門檻 80 票、對手較慢。平票不算勝選。

方向鍵／WASD 移動，空白鍵衝刺，P／Esc 暫停；手機可拖曳場地或按住四向按鍵，另有衝刺鍵。一般票 10、金票 30，3 秒內接著撿可累積最多 6 連擊，每級額外 2 票。噴泉先出黃色虛線預警，再出藍水柱；碰到扣 8 票、斷連擊，受傷後短暫無敵。衝刺持續 0.2 秒、冷卻 2.2 秒，期間無敵但不能穿過噴泉池。正式賽最後 20 秒，二向噴泉升為四向。換分頁或視窗失焦自動暫停，須手動繼續；重玩清空本局狀態。

虛構街機喜劇，不是真實人物、政黨或民調模型。無帳號、儲存、上傳或金錢交易；所有素材在本機繪製、無外部套件。減少動態效果／關閉動畫時取消裝飾搖動與結果彩紙，遊戲必要移動及危險提示仍保留。

部署：`watermelon-mayor.html/css/js/svg`、`watermelon-mayor-engine.js`、共用 `arcade-fx.css/js`。測試：`node --test tests/watermelon-mayor.test.cjs`；驗收見 `tests/watermelon-mayor-qa.md`。

## 腦力補給站

試玩：<https://dorac7.github.io/double-standard-game/brain-break.html>。

18 道原創益智題：規律觀察、條件推理、空間想像各 6 題。輕鬆一輪 6 題（每類 2 題）、完整補給 18 題，或單類 6 題；同輪不重複，題目與選項順序隨機。先選答案再確認，作答後顯示解析；可先看解析或重新嘗試，首次結果不會被重試覆蓋。結算列出所有題目與解法，不限時、無智力評分。作答只留在本分頁，重新整理即清空，不儲存或上傳；無外部套件。

部署檔案：`brain-break.html`、`brain-break.css`、`brain-break.js`、`brain-break-engine.js`、`brain-break.svg`，沿用共用動畫控制。

## 思考偵探社

試玩：<https://dorac7.github.io/double-standard-game/thinking-lab.html>。

12 個原創虛構案件，四個主題各三案：分辨觀察與推測、比較替代解釋、選擇關鍵證據、依新證據更新判斷。每案四步：逐卡分類 → 兩次調查選線索 → 依已取得的證據下有限結論 → 看新證據重新判斷。結論核對會依玩家實際翻開的線索調整，不要求拿尚未查到的內容硬猜答案；證據足夠時也不鼓勵一律選「不知道」。

可自由選案、隨機辦案、重練待釐清案件。每步有方向提示與具體解釋；可寫自己的推理筆記並下載 UTF-8 文字紀錄。保留初次核對與最近重練結果，不把重練當初次答對。自由文字不依字數、關鍵字或範例相似度評分；完成與選擇結果不代表智力、心理或人格評分。無倒數，鍵盤與觸控皆可操作。

所有情境、線索與回饋預先編寫，不連接 AI，不使用真實人物的事件作題目。玩家可選擇只在本次分頁練習，或將已完成案件與作答結果儲存在此瀏覽器；自由文字筆記另行選擇是否儲存。資料不會上傳，並可清除；換裝置不會同步。切回本次練習會停止後續儲存，但先前已儲存的紀錄仍保留，需用清除按鈕移除；清除前會再次確認。仍可下載 UTF-8 文字紀錄。方法靈感與延伸閱讀：[Harvard Project Zero / See, Think, Wonder](https://pz.harvard.edu/resources/see-think-wonder)、[Claim, Support, Question](https://pz.harvard.edu/resources/claim-support-question)。不是官方教材或影片內容改編。

部署檔案：`thinking-lab.html`、`thinking-lab.css`、`thinking-lab.js`、`thinking-cases.js`、`thinking-lab.svg`。無外部套件或網路執行依賴。

## 雙標大挑戰

「雙標大挑戰」（`double-standard.html`）是一款換位選擇遊戲。先替別人處理一件事，隔幾回合在相同條件下換自己面對；兩輪使用同一組具體選項，最後才比較是否改了標準。通融本身不算雙標，前後一致才是判準。

## 三秒就忘記

獨立小遊戲「三秒就忘記・記憶搬家」：<https://dorac7.github.io/double-standard-game/three-second-forget.html>。看物品架，再從混入干擾物的桌面把物品放回原位；可選 6 秒／4 關輕鬆局、3 秒／8 關挑戰局或 3 秒／12 關魔王局。每局從 18 種場景重抽物品與位置；挑戰和魔王局會穿插事先提示的鏡像關，要把所見順序左右顛倒擺放。純前端，從共同入口連入。

## 等一下星球

「等一下星球」：<https://dorac7.github.io/double-standard-game/start-small.html>。48 種任務、24 種藉口事件；6 關輕鬆、12 關挑戰或 20 關星際長征（共 40 段選擇），每關先選小步再應對障礙，任務、藉口與選項順序每次重抽，同一局任務與藉口各不重複。無倒數、可重選；第一次選對得一顆星。結算可自訂一個現實小步，使用可暫停的兩分鐘計時器。任務文字只在分頁記憶體內，不持久儲存或上傳；遊戲不宣稱治療拖延症或 ADHD。

## 多拉甩尾俱樂部

「多拉甩尾俱樂部」：<https://dorac7.github.io/double-standard-game/mini-kart.html>。純 Canvas 原創偽 3D 單機卡丁車，花園、海岸、夜市三條路；兜風 2 圈或正式賽 3 圈，自動加速、左右轉向、按住甩尾後放開衝刺。星星只記收集數，道具箱隨機給護盾或加速，香蕉／路障讓車暫時變慢；有 3 台電腦對手。方向鍵或 A/D 轉向、空白鍵或 Shift 甩尾、P 暫停；手機可按住按鍵或在賽道拖動。切換分頁與視窗失焦自動暫停。重玩重新產生障礙和道具，無帳號／持久儲存。

## 過動大挑戰

`hyper-challenge.html`、`.css`、`.js` 與 `bolt.svg`：原創節奏反應遊戲。左右拍點、任一鍵長按蓄力後放開、紅燈期間停手，暖身 72 BPM / 12 拍、派對 105 BPM / 24 拍、暴走 132 BPM / 36 拍。前四拍帶入四種操作，其餘隨機。以圓環收合提示時機；可選音效，不必開聲音才能玩。手機雙鍵支援 pointer capture，鍵盤方向鍵或 Z/X；P、Escape、失焦或切換分頁可暫停。無淘汰、帳號、儲存或外部套件，分數不是心理診斷。


## ㄅㄆㄇ 小小探險家

`zhuyin.html`、`zhuyin.css`、`zhuyin.js`、`zhuyin-adventure.css`、`zhuyin-adventure.js`、`zhuyin-data.js`、`zhuyin.svg` 與 `assets/zhuyin/`：幼兒園至國小注音練習。使用中華民國教育部《國語注音符號手冊》37 個正式錄音與 SVG 筆順素材，原有五種玩法（新增的小一進階見下節）：

- 符號花園：聽音、逐筆看寫法。
- 聽音找朋友：每局 6 題，起步 2 選 1、進階 4 選 1。
- 翻翻配對：2／4／6 對卡片，翻牌聽音、記住位置；配錯由玩家決定何時蓋回，不限時。
- 小島尋寶：聽錄音後點選島嶼，或拖動小船；三張地圖分別有 4／9／12 座島、收集 3／4／5 顆星，收齊後親手開寶箱。
- 聲調小火車：橫式或直式注音，一聲到輕聲各一題。只練符號與標注，不是聽音辨調或完整拼讀課程。

探索護照以完成任務解鎖五枚徽章（花園需親手點選三個不同符號）；切換分頁不會自動解鎖。所有玩法一開始都可選，不強迫依序過關；重新整理後護照重設。無倒數、可重試、無合成語音或麥克風。拖曳之外保留點選與鍵盤操作；切換瀏覽器分頁時停止聲音，尋寶須重播線索才能繼續。

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

## ADHD 日常賓果・全面過動版

試玩：<https://dorac7.github.io/double-standard-game/adhd-bingo.html>。

40 則原創日常吐槽：注意力、時間與安排、坐不住與衝動、生活支線各 10 則。3×3／5×5 兩種卡片；混合開局平均抽四類，坐不住加量在 5×5 抽 10 則坐不住與衝動、5 則注意力、5 則時間、4 則生活支線，3×3 則為 5、1、1、1 格。兩種都另送中央自由格。模式真正改變抽卡比例，不是只換標題。

點格子可取消、看對應的小方法，橫直斜連線；切換模式／尺寸、換卡、清除均可復原上次操作。卡號、尺寸、模式可複製成同款空白卡連結，不含勾選；舊的 card／size 連結仍以混合模式開啟。PNG 包含當次模式與勾選。所有選擇只留在目前分頁，重新整理即清空，不儲存或上傳。

娛樂賓果，不以連線判定診斷或嚴重度；簡短說明收在來源折疊區，遊玩回饋不反覆插播。保留 `ADHD-BINGO-SOURCES.md` 的來源與用途說明。沒有引入依賴、外部託管或私人病史素材。

檢查：`node --test tests/adhd-bingo.test.cjs`；瀏覽器驗收紀錄：`tests/adhd-bingo-qa.md`。

## 龍蝦終端機探險

試玩：<https://dorac7.github.io/double-standard-game/terminal-quest.html>。

20 站正體中文入門任務，親手操作 `pwd`、`ls`、`cd`、`cat`、`mkdir`、`touch`、`cp`、`mv`、`rm`、`clear` 與模擬 `git --version`。建立、複製、改名、刪除後需再用讀取指令核對；五題觀念確認分辨建立與進入、複製與搬移、清除畫面與刪除檔案、查版本與安裝。接著完成隱藏檔、巢狀目錄、空白檔名、find 尋找檔案、grep 查日誌、head／tail 讀取局部內容，共 20 站。find 支援 -type、-name（引號內 *／?）；grep 僅固定文字 -F，支援 -n／-i／-v／-c 及對應長選項；head／tail 接受 -n／--lines／-2 等非負筆數（最多 10000 行），不實作 tail -f。不只比對固定字串，接受等效的相對／絕對路徑；也接受 `ls -la`／`--all`、`mkdir -p`／`--parents`、`cd -`、`pwd -L/-P`、`git -v`、多個檔案的操作及用 `--` 分隔選項。`ls -l` 的權限／時間僅為示意；操作多個檔案的指令失敗時整條不改環境，與真實指令可能部分成功不同。

- 每關兩段視需要提供的提示、不限時、不扣分；可復原最近一次位置／檔案改動、重來本關。
- 獨立自由沙盒，切回關卡保留本分頁進度。↑↓ 呼叫指令歷史，Ctrl+Space 或按鈕自動完成指令／檔名；Tab 正常移動焦點。小抄點選只填入、不自動執行。支援觸控與鍵盤。
- 即時虛擬檔案地圖與目前路徑；操作紀錄可複製或下載 UTF-8 `.txt`，`clear` 不會抹掉匯出紀錄。玩家可加入自己寫的筆記，遊戲不代寫。
- 所有檔案、指令、進度與筆記只在本分頁記憶體；不持久儲存、不上傳。重新整理／關閉即重設；需保留時請自行匯出。
- 不是完整 shell，也不執行任何真正的電腦指令。POSIX 風格，非 Windows cmd；Git 只模擬版本，不能驗證本機安裝或 GitHub 登入。`uname` 與 `uname -a`（另支援 `-s`、`-n`、`-r`、`-v`、`-m`，可合併或使用對應長選項）只顯示明確標示的虛構系統資訊，不偵測裝置。只處理列出的操作，不支援管線、重導向、變數、shell 萬用字元展開、遞迴改動操作。`cp`／`mv` 僅支援檔案且拒絕直接覆蓋；真實指令可能覆蓋。`rm` 的遊戲復原鈕不代表真實 shell 有相同功能。

新增檔案：`terminal-quest.html`、`terminal-quest.css`、`terminal-quest.js`、`terminal-engine.js`、`terminal-missions.js`、`terminal.svg`。全部為無依賴靜態資產，與首頁一併發布。

既有方案預查：[Bashcrawl](https://github.com/notklaatu/bashcrawl) 使用實際 POSIX shell／外部 Binder；[xterm.js](https://github.com/xtermjs/xterm.js) 是終端機顯示元件而非教學引擎。為保持原站免安裝、無後端、正體中文與無依賴，本遊戲獨立實作簡化的虛擬檔案系統，未複製上述專案的程式或題目。

檢查引擎、檔案效果、錯誤與完整通關：

```sh
node --test tests/terminal-quest.test.cjs
```


## 龍蝦 Git 時光機

試玩：<https://dorac7.github.io/double-standard-game/git-quest.html>。

16 關正體中文模擬練習：初始化、status、add、commit、diff／diff --staged、log、分支、switch／checkout 與 fast-forward merge。建立並切換分支可用 `git switch -c soup` 或 `git checkout -b soup`；切回主線可用 `git switch main` 或 `git checkout main`，也接受先 branch 再切換。也接受 `status -sb`、`add -A/--all/-u/--update`、多個檔案和 `./檔名`、`diff --cached`、`commit --message`／`-m訊息`／`-am`、`log -n 1`／`-1`／`--max-count=1`、`branch --list/--show-current`、`switch --create` 與 `merge --ff-only`。`commit -a` 只收追蹤檔修改，不收未追蹤檔。新增 6 關練習取消暫存、還原工作區、show 讀取提交、雙份修改、普通 commit 保留草稿，以及刪除已合併至主線的本機分支。支援 `restore [--staged/-S] [--worktree/-W] [--] 檔案…`／`.`，可合併為 -SW，不支援 --source；`show [HEAD|分支|完整模擬提交 ID][:檔名]`／`:檔名`；`branch -d/--delete` 只允許已合併至目前分支的本機指標（不模擬 upstream）。用內建編輯器改菜單，觀察工作區、暫存區與 HEAD 三份內容；每段操作需再用讀取指令核對，五題觀念題區分暫存快照與工作區、遊戲內合併與遠端發布。

獨立沙盒、指令歷史、小抄、提示、重來本關、最近環境改動復原、實際操作紀錄與自寫筆記下載。進度、檔案、版本和筆記只存在本分頁記憶體，無持久儲存或上傳；重新整理即清空。

不是完整 Git 或 shell，不執行系統指令或連接 GitHub。不模擬 remote／push／pull／rebase／reset／三方合併或衝突；checkout 只支援分支切換與 -b 建立分支，不含還原檔案、指定起點或 detached HEAD。只支援根目錄文字檔與單一父提交、快轉合併。提交編號是模擬流水號，非真實雜湊。切換與合併要求乾淨工作目錄，比真實 Git 更嚴格。差異以整份舊／新文字顯示；未追蹤檔不列入 diff。初始分支固定 main；分支名稱可包含 `/`（例如 feature/soup）。這仍是列明範圍的教學子集，未知選項不代表真實指令不合法。上限為每檔 6000 字、15 個工作檔、15 分支、80 提交；復原按鈕不代表真實 Git 有相同功能。

部署須帶上 `git-quest.html`、`git-quest.css`、`git-quest.js`、`git-engine.js`、`git-missions.js`、`git.svg`，並保留共用的 `terminal-quest.css`。不新增外部依賴。終端機探險仍只模擬 git --version；更多 Git 模擬練習由此獨立入口提供。免費延伸：[Learn Git Branching](https://learngitbranching.js.org/)、[Software Carpentry Shell 入門](https://swcarpentry.github.io/shell-novice/)。沿用現有正體中文無依賴遊戲，未複製外部課程題目或引入其程式。

引擎與完整通關檢查：`node --test tests/git-quest.test.cjs`。

## 提問與下指令練習場

試玩：<https://dorac7.github.io/double-standard-game/prompt-practice.html>。

七個日常技術／學習情境，逐題練習找缺口並追問、比較兩種問法、修正預設模擬回答，再換到新情境應用。另有「AI 協作任務台」八個主題、每題三個短情境，涵蓋工具選擇、資料與指令分隔、防注入、大任務拆解、除錯證據、回答查核、授權停止點、長對話交接與驗收設計。互動包含選擇、逐張分類、拖曳排序、點選可疑片段、有限補問／分支選擇；可重練錯題及換情境挑戰。另有七步 App 完整任務鏈，從需求拆解、分工授權、除錯、查證、親自驗收至交接，特別區分計畫、已完成及有證據的結果。

基礎課保留「拆題與優先追問」、五種提示技巧前後對照、分層提示、自我檢核與完整參考。不連接 AI；模擬內容為預先編寫。自由文字不會被字數、關鍵字或相似度評分。錯題選擇只用於本頁練習；草稿只留在目前分頁記憶體，不儲存、不上傳；重新整理即清空。這是溝通練習，不是能力測驗。

新增「問問題的藝術」速查：從了解目標、追問關鍵證據、說清界線到確認下一步；同時提醒資訊已足夠時直接提出請求即可。AI 指令部分參考 [OpenAI Prompt engineering 指南](https://developers.openai.com/api/docs/guides/prompt-engineering) 的明確指示、相關背景與迭代原則，並清楚標示它不是一般人際溝通的普遍定律。

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

- `index.html`：二十二款遊戲共同入口；舊首頁 `#r=` 戰績連結自動轉到雙標遊戲並保留片段。
- `double-standard.html`：原雙標遊戲的畫面、流程和計分。
- `start-small.html`、`start-small.css`、`start-small.js`：拖延啟動遊戲。
- `mini-kart.html`、`mini-kart.css`、`mini-kart.js`、`kart.svg`：迷你卡丁車與原創插圖。
- `frogger.html`、`frogger.css`、`frogger.js`、`frogger.svg`：青蛙過街，躲車、搭浮木渡河，將五隻青蛙送回家；每局不儲存紀錄。
- `rocket.svg`、`masks.svg`、`box.svg`：專案內的向量插圖，不依賴外部字型或圖片服務。
- `scenarios.js`：情境題庫，包括替別人和換自己時的敘述。
- `choices.js`：每案兩輪共用的具體行動選項。
- `v2.html`、`v3.html`：早期原型存檔，不是目前遊戲入口。
- `three-second-forget.html`：獨立的三秒記憶遊戲，不載入雙標題庫。

新增情境時，在 `scenarios.js` 加入唯一標題及兩種視角，並在 `choices.js` 以該標題加入對應選項。請保持同一案的條件與選項一致，再檢查手機畫面與完整一局。

## 部署

這是靜態網站。GitHub Pages 可發布儲存庫根目錄的 `index.html` 作共同入口；所有二十四款遊戲的 HTML、CSS 和 JS 必須同時發布。啟用 Pages 後，分享連結會自動以當前網站網址產生。發布設定由儲存庫擁有者決定。

## 授權

尚未選定開源授權；公開儲存庫不等於授權他人再利用。由儲存庫擁有者確認後再加入 `LICENSE`。


## 參與修正與 Pull Request

1. 選一個 [Issue](https://github.com/DoraC7/double-standard-game/issues)，先讀需求與 [AGENTS.md](AGENTS.md) 的相容性、素材姓名標示與隱私規則。
2. 把儲存庫 clone 到本機（沒有寫入權限時先在 GitHub Fork，再 clone 自己的儲存庫）。在儲存庫目錄建立分支，例如 `git switch -c fix/lobby-count`。
3. 做小範圍修改，依「本機啟動」開站。執行 `node --test tests/*.test.cjs`，再依 [全站冒煙檢查](tests/arcade-smoke-qa.md) 和 [推薦視窗檢查](tests/arcade-dialog-qa.md) 驗證受影響流程。首頁專用測試為 `node --test tests/arcade.test.cjs`。需要 Node.js 才能執行測試，遊玩不需要。
4. 檢查 `git diff`，用 `git add <修改的檔案>`、`git commit -m "Fix lobby count"`、`git push -u origin fix/lobby-count` 上傳。
5. 到 GitHub 建立以原儲存庫 `main` 為目標的 Pull Request，引用 Issue（例如 `Closes #9`），附上實際驗證結果；未做的檢查要註明。不要宣稱未設定的 CI 或格式檢查已通過。

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

可查看逐單流水帳、下載本局 UTF-8 文字帳單與重玩。查證只支持附件所示的具體事項，沒有附件時保留待證；讓人開心與評語是否有依據分開記錄。所有訂單、評語和數值為遊戲設計，不是任何人的人格評價或心理測量；EV 不能兌現、沒有實際 API 費用。無音效、帳號、儲存或玩家資料上傳，重新整理清空。

資產：`emotion-printer.html`、`emotion-printer.css`、`emotion-printer.js`、`emotion-printer-engine.js`、`emotion-printer.svg`。沿用現有無依賴靜態遊戲結構，未引入外部平台或付費服務。引擎檢查：`node --test tests/emotion-printer.test.cjs`；人工驗證見 [QA](tests/emotion-printer-qa.md)。

## 多拉語錄・金句開壇

試玩：<https://dorac7.github.io/double-standard-game/dora-quotes.html>。

第十一款「紫衣劇場」虛構喜劇，不是逐字查證的私人聊天紀錄，**改編不冒充本人發言**。25 張卡分為心情開光、進度查帳、龍蝦自嘲與等等系列：6 張節錄既有公開遊戲台詞（可在來源檔對照），9 張為本作原創改編，另有 6 張本次明確指定的遊戲台詞／對話（極簡三句、「等等」、IT 格格不入與原因／感受對話），以及 4 張系列用語選編（未核對歷史聊天原文），逐張標明來源類型，不從私人聊天考古。「經典加映」收錄本次補充的 6 張；等等系列由 4 張增為 7 張。對話卡保留說話者及「可能」語氣，不將 Peter 的接話誤算為 Dora 發言。

- 抽籤典藏：有「極簡三句」「等等系列」「經典加映」專區、依分類抽卡、一輪不重複、收藏／取消收藏、複製附帶喜劇標示的文字、下載自選 UTF-8 文字典藏。剪貼簿不可用時提供手動複製框。
- 金句接龍：每局隨機 8 張不重複題目，三選一、答後揭曉、完整回顧、可重玩。分數只代表本局接梗，不是人格或能力測量。
- 同張卡連結用 `#q=卡片代號`，不包含玩家收藏或作答；不自動發布或發送。所有收藏、紀錄只留在本分頁記憶體，重新整理清空，無登入、追蹤、持久儲存或資料上傳。

隨站發布 `dora-quotes.html`、`.css`、`.js`、`dora-quotes-data.js`、`dora-quotes.svg`。資料來源與完整結算檢查：`node --test tests/dora-quotes.test.cjs`。沿用現有無依賴靜態架構，未引入外部服務或套件。

## 遊戲間互動小動畫

大廳的小龍蝦可點選打招呼；依心情篩選時有短轉場，遊戲封面在滑鼠或鍵盤聚焦時呈現不同動效。各遊戲加入抽卡、回條出紙、線索／題目揭示、數值跳動與結算短動畫，不改變玩法、分數或操作時機。

共用 `arcade-fx.css`、`arcade-fx.js` 與大廳原創向量小龍蝦 `arcade-lobster.svg`，需隨所有遊戲一起部署。頁尾可關閉小動畫（只影響目前分頁，不儲存）；雙標遊戲沿用原動畫按鈕。尊重系統減少動態效果，離開分頁會停止新增裝飾動畫，不加入音效、儲存、追蹤或外部依賴。

## 電腦快速鍵小學堂

試玩：<https://dorac7.github.io/double-standard-game/shortcut-school.html>。

Windows、macOS、Linux GNOME／KDE 的圖形介面快速鍵，每個平台 12 個獨立情境：全選、複製、貼上、剪下文字、復原、重做、儲存、文件內搜尋、新增資料夾、重新命名、新視窗、程式切換。點選畫面鍵帽組合，親眼看模擬文字、剪貼簿、資料夾與視窗改變；搜尋、建資料夾與重新命名還要實際填入目標內容才完成。提供提示、依主題分類的圖鑑、整輪回顧與重玩。首次完成需第一次組合正確、未看提示且後續輸入無誤；無倒數，不是能力測驗。

Linux 明確區分 GNOME／Files 與 KDE Plasma／Dolphin 預設；macOS 的 Return 重新命名、Cmd 與 Control 差別、文字剪下與 Finder 搬檔案不混用。依官方文件及上游預設整理並附來源；實際行為依應用程式、發行版與自訂設定而異。所有組合只用本頁鍵帽，不攔截真實系統組合、不讀寫系統剪貼簿或檔案。只留在本分頁記憶體，重新整理清空，無儲存或上傳。

部署 `shortcut-school.html`、`shortcut-school.css`、`shortcut-school.js`、`shortcut-school-engine.js`、`shortcut-school.svg` 及共用 `arcade-fx.css/js`。不新增依賴。檢查：`node --test tests/shortcut-school.test.cjs`。

## 汽車知識跟道路安全小學堂

「多拉絕對不是三寶之汽車知識跟道路安全小學堂」：`road-safety-school.html`。42 個台灣道路情境、七大單元（速限、五油三水、遠光燈／霧燈、號誌與迴轉、胎壓、緊急事件、油門控制），14 題短局、42 題完整局與單元練習。速限滑桿、可見光束的燈光面板、三步處置排序、八項油水圖鑑、號誌口袋卡與示意踏板；選擇送出即鎖定，結束可逐題複習。

依台灣法規與官方資料整理（2026-10-28），各題附來源。法規與安全建議分開，廠牌手冊不當成通用保養週期；EPS、電動車、密閉電瓶另說明。胎壓 33 psi 只是假想車的標籤閱讀題，非通用建議；踏板只呈現輸入大小，不是實車速度／煞停距離模擬。不取代駕訓、維修或現場救援，不可邊開車邊玩。僅分頁記憶體，無儲存、上傳或第三方套件。測試及來源對照：`tests/road-safety-school-qa.md`。

車燈控制採車頭朝上的俯視示意，近光、遠光與霧燈分別顯示照射範圍，並有完整文字狀態；光型與亮度不是實車校準。

## Common sense 生活小學堂

「多拉真的不是生活白癡之 common sense 小學堂」：`common-sense-school.html`。24 個情境、六單元：洗衣投放、衣物照護、清潔劑、廚房冰箱、家電用電、標示判讀。12 題短局每單元2題，亦可完整24題或單元練習。原創投放槽選擇、量杯用量、水溫滑桿、冰箱分層及三步排序；答後鎖定，附解說、來源與結束回顧。

洗衣精放手冊指定槽，不直接淋衣物，但膠囊、自動投放與允許的局部預處理各有不同；不把一台洗衣機教成所有機型。虛構30mL、1650W等標籤只供閱讀題，不是通用規格。名稱是受委託玩笑，不評斷人物能力；無倒數、無儲存／上傳，不操作真實家電或做化學實驗。依Samsung、GINETEX、UKHSA、FSA與USFA公開說明（2026-10-28），不冒充台灣官方法規或專業維修。

新頁使用 `common-sense-engine.js`、`common-sense-school.js/css/svg`，沿用 `road-safety-school.css` 的基礎版面與共用動畫。測試：`tests/common-sense-school.test.cjs`、`tests/common-sense-school-qa.md`。


## 國文小學堂・動詞不要只會用

試玩：<https://dorac7.github.io/double-standard-game/chinese-school.html>。

30 個原創情境、六單元：日常動作、廚房動詞、檔案操作、完成狀態、具體請求與前後文。12 題短局每單元兩題，可選完整30題或單元5題。選詞與三欄句子積木都需先選再確認；自然且符合情境的已列同義選項均接受，答後保留首次結果。結算逐題顯示情境、選擇、解說、參考句與自己的選填改寫。

重點不是禁止「用」，而是區分洗淨、瀝乾、收納，以及下載、安裝、儲存、上傳等不同動作；也區分計畫、執行與驗證結果。原創例句不是私人聊天引述、官方題庫或人物能力評量，口語省略需看前後文。自由改寫不以字數、關鍵字或範例相似度評分。無倒數、無AI、無儲存或上傳；只留分頁記憶體，重新整理即清空。教育部辭典僅列為查字工具，非逐題來源。

部署檔案：`chinese-school.html`、`chinese-school.css`、`chinese-school.js`、`chinese-school-engine.js`、`chinese-school.svg`，共用 `road-safety-school.css` 與 `arcade-fx.css/js`。沒有新增依賴。測試：`node --test tests/chinese-school.test.cjs`；人工驗證見 `tests/chinese-school-qa.md`。


## AI 小學堂・會問，也要會驗收

試玩：<https://dorac7.github.io/double-standard-game/ai-school.html>。

30個原創情境、六單元各5題：AI基本原理、模型與工具、查證、合作與學習、資料授權、結果驗收。18題選擇、6題三卡分類、6題證據判讀；12題短局每單元2題，亦可完整30題／單元5題。證據只在親自翻開後才算作答時已知；未取得足夠證據時可合理待查，取得關鍵證據後則需作出有依據的具體結論。送出後鎖定首次結果與已讀卡片，回顧可對照當時證據、完整材料及自己的選填筆記。

以Google LLM入門、OWASP提示注入、錯誤資訊、敏感資料與代理權限公開說明為概念來源，各題附連結；數字、對話與工具回條均為原創模擬，不冒充真實操作或官方題庫。沒有連接AI、不要求API Key、不執行真實工具、不儲存或上傳；筆記不由關鍵字／字數評分。與既有提問練習場互相連結，重點是能力判斷、證據範圍與驗收，而非重複提示句型。

部署：`ai-school.html`、`ai-school.css`、`ai-school.js`、`ai-school-engine.js`、`ai-school.svg`，沿用共用`road-safety-school.css`與`arcade-fx.css/js`。無新增依賴。測試：`node --test tests/ai-school.test.cjs`；檢查紀錄：`tests/ai-school-qa.md`。


## 親子小學堂：數感冒險島／好奇心研究所

- [數感冒險島](https://dorac7.github.io/double-standard-game/math-island.html)：16 關、四站，練具體數量、10 以內加減與分配、小店金額、規律、量長度和整點。用加減按鈕擺出答案，或點選比較；時鐘由 SVG 繪製。
- [好奇心研究所](https://dorac7.github.io/double-standard-game/curiosity-lab.html)：16 關、四站，探索水、光影、豆苗、磁鐵。先做不評分的預測，再親手觀察每種設定的示例紀錄，全部比較後才能核對結論。模型與多日紀錄都預先編寫，不是真實感測或即時植物生長。

面向小一、小二與家長，單站四關約 3～5 分鐘，也可完整玩 16 關。每關提供家長提問與安全的離線延伸建議；答錯可重試，保留第一次核對結果。無倒數、排行榜、帳號、作答儲存或上傳，重新整理或回地圖清空本輪。可由家長朗讀，亦有可選的瀏覽器裝置語音與無語音回退；可用聲音與是否連線依裝置而異。不要求語音才能玩。

部署：`math-island.html/svg`、`curiosity-lab.html/svg`、`kids-school.css`、`kids-school.js`、`kids-school-data.js`，無外部依賴。非官方教材或完整課綱。檢查：`node --test tests/kids-school.test.cjs`；手動 QA 見 `tests/kids-school-qa.md`。


## 科技任務基地 · 資訊科技小學堂

試玩：<https://dorac7.github.io/double-standard-game/tech-base.html>。

小一、小二親子 16 關四站：電腦好朋友（輸入／輸出／兩者分類）、檔案小管家（編輯再儲存、改名、移動與複製）、網路安全盾（個資、密碼、照片同意與可疑連結）、小小程式員（排方向指令、執行地圖機器人、觀察撞牆與修改除錯）。可只玩一站四關，或完整 16 關；每關附家長提問與離線活動。

不是只選操作名稱：檔案執行後才改變模擬內容／位置，並依實際狀態驗收；機器人接受不同可行路線，編輯指令後須重新執行，不能靠舊執行結果通關。第四個程式任務先觀察原錯誤程式，再修改。核對前不評分，答錯可重試，首次驗收結果仍保留，結算含操作紀錄。

全為本頁離線模擬，不存取真實檔案、帳號、攝影機、麥克風或訊息。無帳號、倒數、作答儲存／上傳或外部依賴；裝置語音可選並有失敗回退。不是完整課綱或程度認證。部署：`tech-base.html`、`tech-base.svg`、`tech-base.css`、`tech-base.js`、`tech-base-data.js`、`tech-base-engine.js`，沿用 `kids-school.css` 與 `arcade-fx.css/js`。測試：`node --test tests/tech-base.test.cjs`；驗收見 `tests/tech-base-qa.md`。


## 龍蝦遊戲間首頁

首頁採街機海報式主打區：大標題、即時動作遊戲場景、直接開玩與全部遊戲入口。不再顯示載入進度、暖身燈、問候泡泡或要求先完成暖身；完整遊戲清單、分類、隨機推薦與舊 `#r=` 戰績轉址均保留。

開場是約 1.5 秒的有限演出：西瓜衝入、冬瓜入場、水柱展開、選票飛入與標題落版；「重播開場」重播完整序列，不只是改文字。按鈕與連結全程可用，不遮罩、不等待插圖解碼。首頁／頁尾的動畫開關同步，系統減少動態效果或關閉動畫時，直接顯示完整靜態海報；離開分頁停止開場。沒有新套件、帳號或資料儲存。

部署 `lobby-play.css/js` 與 `lobby-feature.svg`（海報向量原稿；首頁內嵌同一份 SVG 以控制分層動畫）。人工驗收見 `tests/lobby-play-qa.md`，瀏覽器檢查程式 `tests/lobby-play-browser-qa.js`。
