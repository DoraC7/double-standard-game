(function(root){
  'use strict';
  const staged=s=>Object.hasOwn(s.index,'README.md'), count=s=>s.commits.length;
  const missions=[
    {title:'先建立版本倉庫',goal:'把龍蝦食堂的資料夾初始化為 Git 倉庫。',concept:'init 建立版本管理空間，不會自動提交，也不會上傳。',hint:'git init',check:(s,r)=>r.event==='init'&&s.ready},
    {title:'看清楚現在的狀態',goal:'查看目前分支，找到還沒被追蹤的 README.md。',concept:'status 只觀察，不會把檔案加進版本。',hint:'git status',check:(s,r)=>r.event==='status'&&!staged(s)},
    {title:'把第一份檔案放入暫存區',goal:'暫存 README.md，再用 status 核對它在「已暫存」中。',concept:'add 擷取當下內容；之後再修改檔案，不會自動更新暫存區。',hint:'git add README.md，接著 git status',check:(s,r)=>r.event==='status'&&staged(s)&&count(s)===0},
    {title:'留下第一個版本',goal:'提交第一份快照，再用 log 核對提交訊息。',concept:'commit 保存暫存區快照。它是本地版本，不等於 push 到 GitHub。',hint:'git commit -m "開張菜單"，接著 git log --oneline',check:(s,r)=>r.event==='log'&&count(s)===1},
    {title:'修改後先比較',goal:'用編輯器修改 README.md 並套用，再查看尚未暫存的差異。',concept:'編輯器只改工作區；git diff 比較工作區與暫存區。',hint:'改右側內容並按「套用到工作區」，再 git diff',check:(s,r)=>r.event==='diff'&&s.work['README.md']!==s.index['README.md']},
    {title:'確認真正要提交的內容',goal:'把修改暫存，再查看暫存區與上一版的差異。',concept:'git diff --staged 才是核對下次 commit 內容的入口。',hint:'git add README.md，接著 git diff --staged',check:(s,r)=>r.event==='diff-staged'&&s.index['README.md']!==s.commits[0].files['README.md'],quiz:{q:'add 之後又編輯，直接 commit 會保存什麼？',options:['add 當時的暫存內容','編輯器最後的新內容'],answer:0}},
    {title:'保存第二版，再核對乾淨',goal:'提交這次修改，再用 status 確認工作目錄乾淨。',concept:'乾淨代表工作區、暫存區與目前提交一致，不代表遠端已更新。',hint:'git commit -m "更新菜單"，接著 git status',check:(s,r)=>r.event==='status'&&count(s)>=2&&root.GitEngine.clean(s)},
    {title:'開一條實驗分支',goal:'建立並切換到名為 soup 的分支，再列出分支核對星號。',concept:'branch 建立分支但不切換；switch -c 或 checkout -b 都可以一次建立並切換。',hint:'git switch -c soup 或 git checkout -b soup，接著 git branch；也可先 git branch soup 再 git switch soup。',check:(s,r)=>r.event==='branch'&&s.branch==='soup'},
    {title:'在實驗分支留下新版本',goal:'在 soup 修改並套用 README.md，暫存、提交，最後查看 log。',concept:'提交讓目前分支向前；main 仍指向之前的版本。',hint:'修改並套用 → git add . → git commit -m "試做濃湯" → git log',check:(s,r)=>r.event==='log'&&s.branch==='soup'&&s.branches.soup!==s.branches.main},
    {title:'回主線，帶回實驗結果',goal:'切回 main，把 soup 快轉合併進來，再用 status 核對。',concept:'這次 main 沒有分岔，所以是 fast-forward：只移動分支指標，不新增合併提交。',hint:'git switch main 或 git checkout main → git merge soup → git status',check:(s,r)=>r.event==='status'&&s.branch==='main'&&count(s)>=3&&s.branches.main===s.branches.soup&&root.GitEngine.clean(s),quiz:{q:'這次合併成功，可以證明什麼？',options:['GitHub 上的程式已更新','遊戲內 main 已包含 soup 的提交'],answer:1}}
  ];
  root.GitMissions=missions;
})(typeof window!=='undefined'?window:globalThis);
