# Dora playground

四十七款免費、純前端小遊戲，從 `index.html` 入口進入。

## 試玩

GitHub Pages：<https://dorac7.github.io/double-standard-game/>。同一份遊戲也由現有伺服器提供：<http://bigmac.dorac7.com:5487/>。

## 買房知識王

試玩：<https://dorac7.github.io/double-standard-game/home-buying.html>，現有伺服器：<http://bigmac.dorac7.com:5487/home-buying.html>。

12關台灣成屋入門：自備現金、核貸缺口、扣車位單價填答，可編輯本金／利率／年限的本息平均攤還試算，以及實價比較、登記權利、漏水、契約審閱、核貸不足、付款與點交情境。數字均為虛構，不是即時價格、核貸保證或稅率；試算無寬限期、不含費用、全期固定假設利率。契約內容依行政院成屋買賣規範（115年4月1日施行版本），不混同所有交易適用。不作物件鑑定、投資或個案法律／稅務建議。

先填答再確認，確認後鎖定；重試保留首次、參考後與最近結果，12關完整回顧。不儲存／上傳資料，失焦自動暫停、無倒數。部署 `home-buying.html/css/js/svg`、`home-buying-engine.js`，共用 `digital-practice.css` 與 `arcade-fx.css/js`。

## 防失智大挑戰

試玩：<https://dorac7.github.io/double-standard-game/brain-health.html>，現有伺服器：<http://bigmac.dorac7.com:5487/brain-health.html>。

12關原創練習：自由觀看後蓋卡的購物清單／位置回想、注意力找不同、文字規則切換，以及8則WHO風險降低與照護情境。不是臨床量表、診斷或治療，不保證預防失智，不將疾病歸咎於不努力。各題有回饋，最後完整回顧；重看與重試標記參考，保留首次結果。不儲存／上傳資料、無倒數，失焦遮罩暫停；鍵盤與觸控皆可使用。

部署 `brain-health.html/css/js/svg`、`brain-health-data.js` 及共用 `digital-practice.css`。來源與查核日在遊戲頁。

## 運動健身小學堂

試玩：<https://dorac7.github.io/double-standard-game/fitness-school.html>，現有伺服器：<http://bigmac.dorac7.com:5487/fitness-school.html>。

12 個原創任務、四種互動：活動／相對強度分類、暖身與緩和的依賴排序、阻力／高溫／警訊情境模擬，以及親手編輯的一週有氧與肌力安排。每週表分開顯示輕鬆、中等、較高強度、實際課表分鐘、有氧等效分鐘與肌力天數；肌力不偷算有氧，指南比較用「中等＋2×較高」，不當個人體能或熱量推估。新手起步關卡用故事中的小步約定，不強迫第一週就湊150分鐘；同肌群不連日為特定故事安排，不冒充所有運動的唯一規則。可接受不同有效課表與排序；高溫可延期，不以硬撐取得分數。

以18–64歲虛構成人為例，不作診斷、個人運動處方、動作辨識或真實完成認證。無體重／熱量／步數排行榜，不需要當場運動、相機或穿戴裝置。警訊題練停止與緊急求助（台灣119），按鈕不會真撥電話。來源包含CDC成人活動、說話測試、熱相關風險，以及NHS暖身、運動傷害與胸痛說明；各題有來源與查核日。

先操作再確認，分類需選完、無效分鐘不可驗收；確認後鎖定、重試保留首次與參考紀錄，完整回顧可下載。失焦／背景自動暫停，無倒數／必要聲音，不儲存或上傳任何健康資料，重新整理清空本輪。部署 `fitness-school.html/css/js/svg`、`fitness-school-engine.js`、共用 `digital-practice.css`、`arcade-fx.css/js`。測試 `node --test tests/fitness-school.test.cjs`，驗收見 `tests/fitness-school-qa.md`。

## GitHub／GitLab 協作學習中心

試玩：<https://dorac7.github.io/double-standard-game/git-platform.html>，現有伺服器：<http://bigmac.dorac7.com:5487/git-platform.html>。

12 個原創狀態式任務，三區各 4 關：共同基本功（Fork／Clone、Issue 證據、Diff 範圍、私人分享）、GitHub（PR 方向、Review 與最新檢查、Actions 失敗紀錄、部署驗收）、GitLab（MR／Draft、Pipeline 與 manual job、最小角色權限、外洩示範憑證的撤銷與變數限制）。先展開實際資料包，再操作模擬專案；操作會改變狀態與回條，以結果驗收，允許不同有效順序。條件不足時不改狀態，並明示這是教學預檢，不代表真實平台會替你阻止所有錯誤。

共同／GitHub／GitLab 分區可篩選與逐關前進；首次、重試與參考後成果分開，完整狀態與操作回顧可下載。可復原模擬操作，但不宣稱真實外洩或公開可復原。失焦／背景自動暫停，無倒數與必要音效。沒有帳號、storage、平台 API 或真正的 push／寄信／部署／憑證操作，重新整理清空；角色、保護規則與 CI 行為依方案及專案設定不同，本題規則皆明示。通關不證明真實帳號或正式部署已完成。

與 Git 時光機互相連結，不重複實作整套 Git 指令。GitHub 官方文件／Skills 可作延伸；GitLab 文件站本輪403，另核對官方程式庫鏡像的 MR、Pipeline、Permissions 文件。部署 `git-platform.html/css/js/svg`、`git-platform-engine.js`、共用 `digital-practice.css` 與 `arcade-fx.css/js`。測試 `node --test tests/git-platform.test.cjs`；驗收紀錄 `tests/git-platform-qa.md`。

## 數位生活防詐練習場

試玩：<https://dorac7.github.io/double-standard-game/digital-safety.html>，現有伺服器：<http://bigmac.dorac7.com:5487/digital-safety.html>。

一般人視角的 12 則虛構訊息，含 4 則正常通知。可展開寄件資訊、檢查網址與附件要求，選擇從原本 App／官方入口、已知聯絡方式或直接回覆原訊息查證。不同管道揭露不同內容；判斷依玩家實際取得的證據，不要求使用未翻開的資訊。資料不足時可暫停查證；正常通知不以一律刪除過關。再依未操作、只點開、交密碼、交驗證碼、授權、付款等實際狀態選補救，不把刪信當撤銷交易或授權。

先選再確認，確認後鎖定；重試清空已開資料，保留首次與最近結果及完整回顧。無倒數，失焦／背景自動暫停，Esc 切換暫停。所有網址只顯示示範文字、不提供掃碼、下載、登入、付款或真的寄信。沒有帳號、儲存與上傳；重新整理清空本輪。內容參考 CISA 與 165 防詐原則，虛構紀錄不冒充即時查詢。

部署 `digital-safety.html/js/svg`、`digital-safety-data.js`、`digital-safety-engine.js`、`digital-practice.css`、共用 `arcade-fx.css/js`。

## 筆記修復工坊

試玩：<https://dorac7.github.io/double-standard-game/note-workshop.html>，現有伺服器：<http://bigmac.dorac7.com:5487/note-workshop.html>。

12 個實作任務：Markdown 標題、巢狀清單、連結、引用、圍欄程式碼、表格、錯誤修復，以及筆記名稱／分類／日期／來源、搜尋有效說明、新舊版本標記、斷鏈修復與操作紀錄整合。實際編輯內容與中繼資料、即時預覽；搜尋已儲存的筆記，內部 note: 連結在虛構知識庫中切換。草稿與已儲存版本分開，未儲存不能沿用舊成功驗收；切換文件和關卡保留本輪草稿。自動核對語法樹、指定操作與實際連結目標，不用自由文字字數或關鍵字宣稱理解。

首次、最近與參考後成果分開；可下載當前關卡的整組筆記（含未儲存草稿）。「儲存」只在分頁記憶體，無持久儲存／上傳，重新整理清空。無倒數，失焦／背景自動暫停。使用本機附帶的 markdown-it 14.1.0（MIT，見 `vendor/markdown-it/LICENSE`），無 CDN 執行依賴、無安裝步驟；停用原始 HTML、圖片網路載入與預覽連外，支援常用語法與表格，不宣稱支援所有 GitHub 擴充。官方說明A／B為虛構來源代號。

部署 `note-workshop.html/js/svg`、`note-workshop-data.js`、`note-workshop-engine.js`、`digital-practice.css`、`vendor/markdown-it/markdown-it.min.js` 與授權、共用 `arcade-fx.css/js`。

## 先停、再想、再做：既有遊戲補強

過動大挑戰新增「先看規則」：16 拍、每 4 拍切換正常／反向，反向只交換左右箭頭操作，蓄力與紅燈停手規則不變；有持續可見的規則提示，不只靠顏色。原三模式與鍵盤／觸控、失焦暫停保留。選單另有 4 個不限時「保護主線」情境，練區分可延後通知與需獨立核對的安全風險，留下待辦或離開前交接，不強迫熬著做完。

提問與下指令練習場新增 3 個「訊息先別急著送」情境，先核對原話範圍與目的，再選回覆；不同選擇呈現不同後續，不真的送出。兩種日常模式皆先選再確認、確認後鎖定、可重試並保留首次結果，完整回顧與重開本輪；不把遊戲表現當心理診斷或日常自制力改善的證據。新增檔案 `hyper-rules.js`、`impulse-practice.js/css`，沿用既有頁面。

## 程式邏輯新手村

試玩：<https://dorac7.github.io/double-standard-game/logic-village.html>，現有伺服器：<http://bigmac.dorac7.com:5487/logic-village.html>。

幫小龍蝦修復村莊：順序、變數、條件、迴圈、函式、除錯各 2 關，加 1 個補給機整合任務。點選指令卡、填入數值或變數，以按鈕上下排序及移除；無須拖曳或輸入真正的程式碼。每關先預測第一組結果，再執行所有預寫測試資料；可切換案例、單步前後查看狀態與目前指令，或自動播放。暫停、失焦及背景停止播放，須手動繼續。多種有效解法以最終狀態驗收，不以固定指令順序判分；180 步上限會攔下不停的迴圈。

變數、分支與函式都由受限指令解譯器模擬，參數可用一次加減、比較及 AND／OR；不使用 eval 或執行真實程式。修改後舊結果立即失效，必須重新執行。首次驗收、重試完成、參考解法分開記錄；預測不計入驗收。可自由選關與重訪，13 關完成後有總回顧及終端機／Git 延伸入口。沒有倒數、必要音效、帳號、儲存或上傳；重新整理清空本輪。通關不代表已證明長期理解。

部署 `logic-village.html/css/js/svg`、`logic-village-engine.js`。測試 `node --test tests/logic-village.test.cjs`；驗收紀錄見 `tests/logic-village-qa.md`。

## 無知大挑戰

試玩：<https://dorac7.github.io/double-standard-game/ignorance-challenge.html>，現有伺服器：<http://bigmac.dorac7.com:5487/ignorance-challenge.html>。

12 個原創虛構案例，四類各三案：畫面之外、因果別跳步、來源與原話、證據來了改判。每案三步：拆原話 → 三選一查證卡（確認後才揭露內容）→ 依實際翻開的資料更新結論。選到無關資料，後續答案也不會要求使用尚未取得的證據；證據足夠時則可以明確下結論，不鼓勵一律說不知道。

快問快查每類一案，共4案12步；完整挑戰12案36步。同輪不重複，案例與選項順序隨機。先選再確認，可先看解析、答錯重試，保留首次與最近結果；重新挑查證會換掉目前資料卡。結算可逐案複習、下載本輪文字紀錄。1–3選答案、Enter確認、P／Esc暫停；切換分頁或失焦自動暫停，手動繼續。不限時，不需音效，手機與鍵盤皆可操作。

不影射真人，不連接AI；情境與查證資料皆預先編寫，不是真實事件報告。沒有帳號、儲存、上傳或外部依賴，重新整理即清空；分數不是智力、人格或道德評鑑。沿用原站純JavaScript與共用動畫，未引入另一套平台。部署 `ignorance-challenge.html/css/js/svg`、`ignorance-cases.js`、`ignorance-engine.js` 與 `arcade-fx.css/js`。測試：`node --test tests/ignorance.test.cjs`；驗收見 `tests/ignorance-qa.md`。

## 吹牛大挑戰

試玩：<https://dorac7.github.io/double-standard-game/bluff-challenge.html>，現有伺服器：<http://bigmac.dorac7.com:5487/bluff-challenge.html>。

三人單機骰盅吹牛：你對兩位虛構電腦對手阿膨、阿風。快嘴局每人3骰、正式桌每人5骰；自己暗骰可見，對手只顯示剩餘骰數。輪流喊「全桌至少幾顆某點數」；加數量，或同數量加點數。固定1點不萬用，沒有喊齋、搶開或精準開等額外規則。

輪到自己可加喊或抓包前手。抓包後攤開整桌並標出符合的骰子：實際數量達標（包含相等）則抓包者少1骰，不足則喊的人少1骰。輸家下一盅先喊；出局者跳過。玩家骰子先歸零就結束，撐到兩位對手都歸零即獲勝。攤牌紀錄保留在當前分頁，親手按下一盅才會繼續；可以重新開桌。

電腦以自己的手牌、公開剩餘骰數和前手喊話估算機率，加入風險差異；決策函式沒有收到對手的暗骰。不連接AI或真人。選好數量與點數後再確認喊話；1–6可選點數，數量欄支援原生↑↓，P／Esc暫停。失焦或背景會停止電腦回合，須手動繼續。手機按鈕與鍵盤皆可操作，不限時、無必要音效。

原創虛構骰桌，不是誠信或人格測驗，無下注、帳號、上傳、儲存或外部套件。沿用原站純JavaScript，未引入遊戲平台。部署 `bluff-challenge.html/css/js/svg`、`bluff-engine.js`，共用 `arcade-fx.css/js`。測試：`node --test tests/bluff.test.cjs`；驗收見 `tests/bluff-qa.md`。

## 過敏搔癢大挑戰

試玩：<https://dorac7.github.io/double-standard-game/itch-challenge.html>，現有伺服器：<http://bigmac.dorac7.com:5487/itch-challenge.html>。

三區九宮格反應防線：毛球沙發、花粉花園、睡前大亂鬥。按住藍色癢癢怪到泡泡裝滿，放開會中斷充能；紅色抓抓手別碰，誤碰增加18點警報並斷連擊，同一隻紅手只處罰一次。漏掉藍怪增加7點警報；封印成功降8點。警報達100立即失敗；每區倒數結束需達封印目標。正式挑戰每關18秒、長按0.65秒、目標4／5／6隻；暖身每關12秒、長按0.45秒、目標2／3／4隻。關卡結算後親手前進；失敗可重試本區，前區成果保留。

手機／滑鼠直接按住格子；鍵盤按住1–9（左到右、上到下）或QWE／ASD／ZXC，也可聚焦格子後按住空白鍵／Enter。P／Esc暫停；失焦／背景自動暫停，須手動繼續並清除按住狀態。操作區防長按選字，不影響說明文字複製。無必要音效，尊重減少動態效果。

原創虛構卡通遊戲，不是過敏測驗或治療，警報值與分數不代表真實健康。沒有使用真實皮膚照片，無帳號、儲存、上傳或外部依賴。沿用原站純DOM／JavaScript，不引入遊戲框架。部署 `itch-challenge.html/css/js/svg`、`itch-challenge-engine.js`，共用 `arcade-fx.css/js`。測試：`node --test tests/itch-challenge.test.cjs`；操作驗收見 `tests/itch-challenge-qa.md`。

## 過動兒大冒險

試玩：<https://dorac7.github.io/double-standard-game/restless-adventure.html>，本機伺服器：<http://bigmac.dorac7.com:5487/restless-adventure.html>。

三站橫向平台跑跳：出門三件組、分頁森林、主線交付城。左右移動、跳上單向平台，收齊每關三件主線物品再到右側終點；支線星星每關三顆、自由選擇。通知怪可從上方踩掉，側面碰撞或掉落扣一顆心並回檢查點，已收集物品保留；黃色彈跳墊自動彈高。通關後親手前往下一站，最後打包交付。

一般模式每關90秒、三顆心；悠哉模式不限時、五顆心。失敗可重試本關，前關成果保留。方向鍵／A D移動，空白鍵／↑／W跳躍，P／Esc暫停；手機有方向與跳躍按鈕，操作區防長按選字。失焦／背景自動暫停，須手動繼續。裝飾動畫可關閉，必要移動仍保留。

虛構跑跳遊戲，無帳號、儲存、上傳或套件。部署 `restless-adventure.html/css/js/svg`、`restless-adventure-engine.js`，沿用共用 `arcade-fx.css/js`。驗收見 `tests/restless-adventure-qa.md`。

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

- `index.html`：二十七款遊戲共同入口；舊首頁 `#r=` 戰績連結自動轉到雙標遊戲並保留片段。
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

這是靜態網站。GitHub Pages 可發布儲存庫根目錄的 `index.html` 作共同入口；所有二十七款遊戲的 HTML、CSS 和 JS 必須同時發布。啟用 Pages 後，分享連結會自動以當前網站網址產生。發布設定由儲存庫擁有者決定。

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

「多拉絕對不是三寶之汽車知識跟道路安全小學堂」：`road-safety-school.html`。94 個台灣道路情境、十大單元（速限、五油三水、遠光燈／霧燈、號誌與迴轉、胎壓、緊急事件、油門控制、路權與匯流、停車與開門、車道與超車），20 題短局、94 題完整局與單元練習。速限滑桿、可見光束的燈光面板、三步處置排序、八項油水圖鑑、號誌口袋卡與示意踏板；選擇送出即鎖定，結束可逐題複習。

依台灣法規與官方資料整理（2026-10-28），各題附來源。法規與安全建議分開，廠牌手冊不當成通用保養週期；EPS、電動車、密閉電瓶另說明。胎壓 33 psi 只是假想車的標籤閱讀題，非通用建議；踏板只呈現輸入大小，不是實車速度／煞停距離模擬。不取代駕訓、維修或現場救援，不可邊開車邊玩。僅分頁記憶體，無儲存、上傳或第三方套件。測試及來源對照：`tests/road-safety-school-qa.md`。

車燈控制採車頭朝上的俯視示意，近光、遠光與霧燈分別顯示照射範圍，並有完整文字狀態；光型與亮度不是實車校準。

## Common sense 生活小學堂

「多拉真的不是生活白癡之 common sense 小學堂」：`common-sense-school.html`。48 個情境、六單元：洗衣投放、衣物照護、清潔劑、廚房冰箱、家電用電、標示判讀。12 題短局每單元2題，亦可完整48題或單元練習。原創投放槽選擇、量杯用量、水溫滑桿、冰箱分層及三步排序；答後鎖定，附解說、來源與結束回顧。

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

## 過敏兒保養小教室

現有伺服器：<http://bigmac.dorac7.com:5487/allergy-school.html>。GitHub Pages：<https://dorac7.github.io/double-standard-game/allergy-school.html>。

12個原創情境，皮膚照護、居家過敏原、何時求助各4題。輕鬆局6題、完整12題或單元4題，題目和選項隨機。先選再確認；可先看解說或重練，首次結果不被覆蓋。結算逐題顯示首次選擇、建議與來源。不限時，原生按鈕支援觸控與鍵盤；沒有即時背景進程。

依AAD與AAAAI公開衛教整理（2026-11-04），不是官方測驗、診斷或個人治療計畫，不提供劑量；緊急求助依台灣119。無帳號、儲存、上傳、外部套件或網路執行依賴。部署檔案：`allergy-school.html/css/js/svg`、`allergy-school-engine.js`，共用`road-safety-school.css`與`arcade-fx.css/js`。測試：`node --test tests/allergy-school.test.cjs`；驗收見`tests/allergy-school-qa.md`。


## 2026-11-04 生活與汽車題庫擴充

生活常識由24題增至48題（六單元各8題）；汽車與道路安全由42題增至70題。新增52題涵蓋洗衣濃度與照護條件、食品冷藏與開封期限、用電容量與電壓、車輛規格與保養條件、燈光組合、載重胎壓、緊急退避及輔助駕駛限制。加入標示比較、條件交集、比例與單位換算，保留原有位置選取、數值調整與排序操作。

短局仍為12／14題，每單元各抽1題基礎及1題中階或進階，維持一半基礎、一半中高難度；完整題庫中高難度分別24／48與28／70。新增題目每單元3題中階、1題進階，難度為編輯分級而非實證能力測量。全題模式與單元模式均不重複，首次作答鎖定及逐題解說維持不變。計算的數字與車輛設定是題目條件，不當成通用產品或車款規格。


## 數學小學堂挑戰

[開始挑戰](https://dorac7.github.io/double-standard-game/math-school.html)，現有伺服器：<http://bigmac.dorac7.com:5487/math-school.html>。24 題四主題：四則運算、分數、時間與生活、周長與面積；約小三、小四程度。短局8題（每類2題）、完整24題或單類6題。同輪不重複，題序與選項隨機；分數圖與面積格由本機SVG繪製。

先選再確認，答錯或先看解析後可重試，首次與最新結果分開保留；結算逐題複習。無倒數、必要音效、帳號、儲存或上傳，非官方教材／能力測驗。沿用原站純JavaScript與共用版面，保留小一二「數感冒險島」。部署 `math-school.html/css/js/svg`、`math-school-engine.js`，依賴 `brain-break.css` 與共用 `arcade-fx.css/js`。


## 家事小學堂

[開始家事練習](https://dorac7.github.io/double-standard-game/housework-school.html)，現有伺服器：<http://bigmac.dorac7.com:5487/housework-school.html>。24個原創情境：洗晾收衣、餐後廚房、清掃整理、分工與收尾各6題；16題選擇、8題三步排序，使用上移／下移而非拖曳限定。排序依題目明示流程，不宣稱家事只有一種合法順序。

短局8題（各類2題）、完整24題或單類6題。先選／排序再確認，答錯可重試但保留首次結果；完整回顧含最後作答與建議順序。著重執行、驗收與交接，不重複生活常識的洗標／設備知識定位，不依性別分工。無倒數、帳號、儲存、上傳或外部依賴；不是實際家事能力認證。部署 `housework-school.html/css/js/svg`、`housework-school-engine.js`，沿用 `brain-break.css` 與共用 `arcade-fx.css/js`。


## 搞事小學堂

[開搞](https://dorac7.github.io/double-standard-game/mischief-school.html)，現有伺服器：<http://bigmac.dorac7.com:5487/mischief-school.html>。12幕卡通惡作劇、三個片場各4幕。每幕挑道具確認後，舞台與文字呈現該道具的實際結果，再依該結果選收尾；不是把錯選道具偷換成標準答案。36個道具分支可走完，笑點與收尾各1點。

快閃6幕、完整12幕或單片場4幕；同輪不重複，幕序與選項隨機。可重演本幕，清除舞台和選擇但保留首次紀錄；結算可對照首次與最近道具、實際結果與收尾。全為虛構卡通及玩具舞台，無真實設備、帳號、倒數、儲存、上傳或外部依賴。裝飾動畫可關閉且尊重減少動態效果。部署 `mischief-school.html/css/js/svg`、`mischief-school-engine.js`，沿用 `brain-break.css` 和 `arcade-fx.css/js`。


## 無知大聲公 🔉

[開台](https://dorac7.github.io/double-standard-game/ignorance-megaphone.html)，現有伺服器：<http://bigmac.dorac7.com:5487/ignorance-megaphone.html>。12個原創虛構廣播情境，畫面與原話、因果、數字各4題。原始資料全程可讀，先選句子再調整擴音0～100、確認廣播；每級2人次、0不外播，是遊戲模型不是社群預測，也不改裝置實際音量。真假判定只依提供資料，不以音量或一律不確定拿分。

快閃6題（每類2）、完整12題或單類4題。選句與調音量不提前判分，確認後鎖定；修訂重播保留首次句子、音量與模擬誤傳人次，結算對照首次／最近。聲波視覺大小隨滑桿改變，無實際音效；裝飾動畫可關閉且尊重減少動態效果。無倒數、帳號、儲存、上傳或外部依賴。保留原「無知大挑戰」，不是改名取代。部署 `ignorance-megaphone.html/css/js/svg`、`ignorance-megaphone-engine.js`，共用 `brain-break.css` 和 `arcade-fx.css/js`。


## 開心傻笑瘋挑戰

[哈哈哈開場](https://dorac7.github.io/double-standard-game/giggle-crazy.html)，現有伺服器：<http://bigmac.dorac7.com:5487/giggle-crazy.html>。12顆原創怪東西、36種傻笑反應，只有「好好玩」「好有趣」「看起來很好吃」，沒有答錯、解析或說教。點選怪東西可戳出啵啵泡；反應改變姿勢、動畫、裝飾和奇怪變身文字，三種都能換著喊。

短場4顆或完整12顆，同輪不重複；每顆收集一顆笑泡泡，切換反應不重複計數，結束有本輪傻笑相簿。無倒數、音效、帳號、儲存、上傳或外部依賴；動畫可關閉且尊重減少動態效果，關閉後仍保留反應姿勢與文字。部署 `giggle-crazy.html/css/js/svg`、`giggle-crazy-engine.js`、`giggle-crazy-art.js`，共用 `arcade-fx.css/js`。


## 鬧事樂園

[入園開鬧](https://dorac7.github.io/double-standard-game/chaos-park.html)，現有伺服器：<http://bigmac.dorac7.com:5487/chaos-park.html>。卡通阿鬧的十六區諷刺鬧劇：忘鑰匙、空油箱、重複繳水電瓦斯、保健品過期、美容食品份量失控、上班忘腦袋、美妝用途／時間亂用、自己填錯先兇人，另有卡通多拉「扶輪社拆輪子」字面理解番外。新增吃飯上課時間錯置、筆記字體選美、簡報特效先行、計畫表裝修、上課濾鏡與優惠研究六種主線被配角擠走的情境。另有「廁所擦身折返站」：經過說不用、離開馬上要上，讓全隊折返的三種鬧法。每區3個招式，48種明確對應的場面與後果。

快閃4區或完整16區，同輪不重複；地圖也可點選單一園區直接入場；先選再確認，招式改變場面道具、姿勢、災情牌與文字，不是選擇正確答案。可重演本區看不同災情，報表保留各區最近招式，重演不重複累加園區或混亂小火花；小火花為卡通鬧劇刻度，不是金錢或健康數值。玩具車在園內，帳單為道具；沒有真實付款、購物、設備控制或食品用量／療效建議，不影射真人。

無倒數、音效、帳號、儲存、上傳或外部依賴；裝飾動畫可關閉且尊重減少動態效果。部署 `chaos-park.html/css/js/svg`、`chaos-park-engine.js` 與共用 `arcade-fx.css/js`。


## 烙英文大挑戰

[Let's 開始](https://dorac7.github.io/double-standard-game/english-flex.html)，現有伺服器：<http://bigmac.dorac7.com:5487/english-flex.html>。36組近似介係詞題：時間、地點與動作、交通各12題；熱身12題（各類4題）、完整36題或單類12題。題幹明確限定時間、語意或慣用句型，避免把可接受的不同意思誤判為唯一錯誤。

先填介係詞、選混搭風味，再確認；烙度定義為英文字母÷英文字母與中文字總數，忽略空白／數字／標點，只是遊戲風味門檻，不是英文能力分數。每輪隨機三分之一題會先追問Really？真的嗎？以新的近似情境測轉用，回答前不揭露原題解答。用法、風味與追問分開統計，重試保留首次紀錄；一次答對或相似題高分不等於證明長期學會。

無倒數、帳號、儲存、上傳或外部執行依賴。題目原創，文法參考連結供延伸閱讀；不宣稱官方題庫。部署 `english-flex.html/css/js/svg`、`english-flex-data.js`、`english-flex-engine.js`，沿用 `brain-break.css` 與共用 `arcade-fx.css/js`。


## 科學實驗室

[開始研究](https://dorac7.github.io/double-standard-game/science-lab.html)，現有伺服器：<http://bigmac.dorac7.com:5487/science-lab.html>。九個可自由調參數的科學模型；保留原有四種：小角度單擺、歐姆定律、溶液質量濃度、無空氣阻力的自由落體。先預測，再執行，留下輸入／輸出／當時預測與基準編號。不是即時感測、真實實測或實體操作教學。各模型附公式、成立條件與對應參考資料。

可選任兩筆A/B紀錄與研究變因。比較區分相同設定、只改研究變因、改到其他變因、同時改多項；預測只和當時指定的A核對，不套到後來換過的基準。圖表只顯示其他參數都與A相同的資料點，表格保留全部紀錄。重複同條件得到同結果，沒有假造量測噪音。每個模型資料在分頁內各自保留，可匯出CSV，清除需確認且只清目前模型。

無帳號、永久儲存、上傳、音效、倒數或外部依賴；重新整理清空。保留低年級「好奇心研究所」，本頁更重視控制變因與資料比較。部署 `science-lab.html/css/js/svg`、`science-lab-engine.js` 與共用 `arcade-fx.css/js`。

生活科學新增：濕度與露點（NWS近似式）、雨量換算理論落水量（mm×m²=L）、熱湯冷卻（牛頓冷卻簡化式）、三大營養素熱量（4／4／9估算）、份量與鈉標示。每個附生活提問、比較操作與模型限制，沿用A/B、圖表及CSV。露點不是降雨機率，冷卻曲線不判定食品安全；營養估算不等於健康評分或個人攝取建議。參考NWS、OpenStax、FDA與21 CFR 101.9營養標示規則。

## 小動物與生物探索館

[帶著好奇心出發](https://dorac7.github.io/double-standard-game/biology-explorer.html)，現有伺服器：<http://bigmac.dorac7.com:5487/biology-explorer.html>。

獨立於科學實驗室的生物觀察區，16個原創情境、四主題各4題：身體構造（蜘蛛、蝸牛、蝙蝠、鼠婦）、生命週期（蝴蝶、蛙、斑蚊、蝗蟲）、生態關係（授粉、真菌、蚯蚓、食物鏈）、友善觀察（樣本範圍、關聯與原因、控制變因、非侵入式紀錄）。參考OpenStax Biology 2e、CDC與Animal Diversity Web，每題解析與複習附對應連結；插圖只是示意，不是物種鑑定圖。

短輪8題、每類2題，完整16題或單元4題，同輪不重複；先選再確認，解析在確認後揭露。可先看解析、答錯重試，首次與最新結果分開；結算逐題回顧。無倒數，使用原生按鈕與鍵盤焦點，手機可操作。不捕捉、餵食或移放動物，不提供飼養或現場鑑定；非官方教材。無帳號、永久儲存、上傳或外部依賴，重新整理清空。

部署 `biology-explorer.html/css/js/svg`、`biology-explorer-engine.js`、共用 `brain-break.css` 與 `arcade-fx.css/js`。


## 多拉忘記大挑戰

[進入甩鍋片場](https://dorac7.github.io/double-standard-game/dora-forget.html)。16幕原創卡通鬧劇，快閃4幕或完整16幕。看三張道具卡，親手蓋起來再回答記憶題；確認才揭露紀錄。接著選怪鬧鐘、怪龍蝦、宇宙理由或自己補救，確認才發射鍋子；目標、飛行位置與舞台後果各自改變。記憶命中與荒謬火花分開統計，結算保留每幕口供、紀錄與演出。不是真人事蹟或人格測驗。

不限時，原生按鈕支援觸控與鍵盤；非按鈕焦點下1–4可選擇。可關特效，尊重減少動態效果；重新開場清空本局。無帳號、永久儲存、上傳、外部依賴。部署 `dora-forget.html/css/js/svg`。


### 道路法規擴充（2026-11-12）

新增24題（三新單元各8題），包含幹支道、左讓右之前提、少線讓多線、轉彎讓直行、匯流壅塞例外、圓環、對向轉彎同車道、消防栓／公車站禁臨停、併排、無障礙車位、開門停讓、換道、專用道、跟車及禁止超車。依全國法規資料庫現行道路交通安全規則§94、98、101、102、111、112核對；不編寫罰鍰與未確認施行的新制。9題有互動場景（4路口、5停車），確認選擇即鎖定，放行或禁止效果有文字等價說明，不必靠動畫理解。


## 法普小學堂

[接下生活情境](https://dorac7.github.io/double-standard-game/daily-law.html)。56個原創台灣法律情境、12單元（原10單元各4題，新2單元各8題）：消費、勞動、租屋租借、契約賠償、個資行銷、著作權、婚姻家事、夫妻財產繼承、意外賠償、傷害告訴、醫療權益、健康消費。短局24題（每類2題）、完整56題或單元4／8題。翻開虛構情境文件後選擇、確認才判分；可先看解析、答錯重試，但首次與最新結果分開保留。結算逐題列答案、說明與對應官方法條。

查核日2026-11-12，來源為全國法規資料庫。條文適用前提與例外寫入情境；不把所有傷害說成告訴乃論、和解當作自動撤告、結婚當作全部財產共有，或把無獲利當作合理使用。不是個案法律意見、官方教材、法律能力認證或期限提醒服務。沒有真實案件輸入、帳號、儲存、上傳、外部執行依賴。沿用現有純前端與共用樣式，支援觸控／鍵盤、減少動態效果。部署 `daily-law.html/css/js/svg`、`daily-law-engine.js` 及共用 `brain-break.css`、`arcade-fx.css/js`。


### 醫療與健康消費擴充（2026-11-12）

新增16題：醫療法§22、24、63、64、71、72、81、82涵蓋收費收據、說明同意、病歷、隱私、結果與過失及安全申訴；健康消費涵蓋食品療效宣傳、健康食品許可、健檢廣告、非醫療美容契約審閱／公平條款、一般健身課程申訴、網購補充品解除與健康用品瑕疵。每題附官方法條。

區分醫療與非醫療服務，不將消費申訴15日妥處解讀為一定全額退款，不將7日解除套所有食品或醫療療程，不將同意書當萬用免責書；不以診療結果直接判定過失。醫療爭議向所在地衛生主管機關等確認程序，遊戲不蒐集病歷或取代診斷、法律意見與申訴。
