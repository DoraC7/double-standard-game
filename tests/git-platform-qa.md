# GitHub／GitLab 協作學習中心驗收

2026-11-13，候選版基於 `b59f95e`。新增一款學習中心，並在既有 Git 時光機加入反向入口；不改既有 Git 指令引擎，不混入原工作目錄其他草稿。

## 範圍與來源

- 共同基本功／GitHub／GitLab 三區各四任務，共12個狀態式模擬：Fork／Clone、Issue、Diff範圍、私人分享、PR方向、Review／CI、Actions失敗、部署驗收、MR／Draft、Pipeline／manual、角色最小權限、憑證撤銷與變數限制。
- GitHub Hello World、Pull requests、Actions 與 GitHub Skills 均實際讀取成功。Skills 作為後續需帳號的官方實作延伸，不替玩家建立真實專案。
- GitLab 文件網站 MR／Pipelines／Permissions 回傳403；改讀官方程式庫鏡像 gitlabhq/gitlabhq 的 doc/user/project/merge_requests/_index.md、doc/ci/pipelines/_index.md、doc/user/permissions.md，以及 doc/ci/variables/_index.md。角色、保護／核准政策與CI行為皆限定本題規則，不冒充所有版本及方案預設。
- 免帳號、無storage、API、真指令、push、通知、部署或憑證操作。只有下載時產生玩家選擇的本機文字紀錄；重新整理清空本輪。

## 已執行

- 候選版 `node --test tests/*.test.cjs`：352項通過；原工作目錄同指令349項通過。既有測試版本不同，分開計數。
- 新增19個Node測試，12參考流程皆通過；空白初始狀態皆失敗；資料未開、條件不足與錯誤操作不改原狀態；Issue密碼欄位、無關暫存、PR／MR方向、核准與CI失效、Retry不修程式、最小角色、Masked不能代替撤銷等驗證通過。
- `git-platform-browser-qa.js` 每輪318檢查：完整12任務、每個操作從初始狀態的分支回條與狀態均核對引擎；先故意驗收失敗，再跑完整流程並驗收通過，結算12完成但首次獨立通過0，確保重試不覆寫首次。
- 所有任務的資料開啟、未取得資料不可驗收、鎖定後不可重答、重試清空證據、復原狀態、完整回顧、三區篩選與失焦暫停／手動繼續皆驗證。
- 既有公開伺服器 http://bigmac.dorac7.com:5487/git-platform.html 完整流程在1280×900、360×740、740×360通過，各操作分支無水平溢出。屬瀏覽器尺寸模擬及腳本DOM操作，不是真機驗收。
- 鍵盤Enter啟動已驗證，按鈕有原生鍵盤焦點與44px以上操作高度。截圖檢視後將12個長標題收在可展開任務選單，保留目前任務提示，避免窄畫面被導覽塞滿。
- 圖片均可解碼；瀏覽器錯誤清單為空；文字下載實際產生 GitHub-GitLab協作練習.txt，包含完整12任務與首次結果。

## 發布要求

沿用 GitHub Pages 與既有公開伺服器，分別核對資產；Pages正式網址另跑桌面與手機完整流程。候選版結果不代替部署證據。發布SHA、部署紀錄及兩站核對由當次交付記錄另列。
