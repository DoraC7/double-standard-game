const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../git-engine.js');
global.GitEngine=E;require('../git-missions.js');const M=global.GitMissions;
const run=(s,line)=>{const r=E.execute(s,line);assert.equal(r.ok,true,line+': '+r.output);return r;};
const commit=(s,text)=>{run(s,'git add .');run(s,'git commit -m "'+text+'"');};
const init=()=>{const s=E.initial();run(s,'git init');return s;};
for(const [label,create,switchBack] of [
 ['switch',['git switch -c soup'],'git switch main'],
 ['checkout',['git checkout -b soup'],'git checkout main'],
 ['branch + checkout',['git branch soup','git checkout soup'],'git switch main']
])test('完整 10 關操作與驗證（'+label+'）；每關前狀態不能直接通過',()=>{
 const s=E.initial();
 const steps=[['git init'],['git status'],['git add README.md','git status'],['git commit -m "開張"','git log'],[()=>E.edit(s,'README.md','新菜單'),'git diff'],['git add .','git diff --staged'],['git commit -m "更新"','git status'],[...create,'git branch'],[()=>E.edit(s,'README.md','濃湯'),'git add .','git commit -m "濃湯"','git log'],[switchBack,'git merge soup','git status']];
 steps.forEach((commands,i)=>{assert.equal(Boolean(M[i].check(s,{event:'unrelated'})),false);let r;for(const c of commands)r=typeof c==='function'?c():run(s,c);assert.equal(M[i].check(s,r),true,'mission '+i);});
 assert.equal(E.clean(s),true);assert.equal(s.commits.length,3);assert.equal(s.work['README.md'],'濃湯');
});
test('add 保存當時快照；commit 不偷收後續工作區修改',()=>{
 const s=init();E.edit(s,'README.md','A');run(s,'git add .');E.edit(s,'README.md','B');run(s,'git commit -m "A"');
 assert.equal(E.head(s).files['README.md'],'A');assert.equal(s.work['README.md'],'B');assert.equal(E.clean(s),false);
 assert.match(run(s,'git diff').output,/\+ B/);assert.match(run(s,'git diff --staged').output,/沒有差異/);
});
test('status 不修改狀態；未追蹤檔不列入 diff；staged diff 顯示新增',()=>{
 const s=init(),before=E.clone(s);run(s,'git status');assert.deepEqual(s,before);
 assert.match(run(s,'git diff').output,/沒有差異/);run(s,'git add .');assert.match(run(s,'git diff --staged').output,/新增/);
});
test('branch 不切換，switch 帶出對應版本；快轉不新增提交',()=>{
 const s=init();commit(s,'one');const first=s.branches.main;run(s,'git branch soup');assert.equal(s.branch,'main');
 run(s,'git switch soup');E.edit(s,'README.md','two');commit(s,'two');run(s,'git switch main');assert.equal(s.branches.main,first);assert.notEqual(s.work['README.md'],'two');
 run(s,'git merge soup');assert.equal(s.work['README.md'],'two');assert.equal(s.commits.length,2);assert.equal(s.branches.main,s.branches.soup);
});
test('分歧合併明確拒絕，且完全保留雙邊資料',()=>{
 const s=init();commit(s,'one');run(s,'git branch soup');E.edit(s,'README.md','main');commit(s,'main');run(s,'git switch soup');E.edit(s,'README.md','soup');commit(s,'soup');run(s,'git switch main');
 const before=E.clone(s);assert.match(E.execute(s,'git merge soup').output,/三方合併/);assert.deepEqual(s,before);
});
test('髒工作區切換和合併均不會覆蓋；未暫存不可提交',()=>{
 const s=init();assert.equal(E.execute(s,'git commit -m "oops"').ok,false);commit(s,'one');run(s,'git branch soup');E.edit(s,'README.md','draft');
 const before=E.clone(s);for(const c of ['git switch soup','git switch -c test','git checkout soup','git checkout -b test','git merge soup']){assert.equal(E.execute(s,c).ok,false);assert.deepEqual(s,before);}
});
test('checkout 切換事件與 switch 相同；不同分支快照可正確帶回且不多建提交',()=>{
 const s=init();commit(s,'one');const main=E.clone(s.work),first=s.branches.main;
 assert.equal(run(s,'git checkout -b soup').event,'switch');
 assert.equal(s.branches.soup,first);assert.equal(s.commits.length,1);
 E.edit(s,'README.md','濃湯');commit(s,'soup');
 assert.equal(run(s,'git checkout main').event,'switch');assert.deepEqual(s.work,main);assert.deepEqual(s.index,main);
 run(s,'git switch soup');assert.equal(s.work['README.md'],'濃湯');assert.equal(s.commits.length,2);
});
test('checkout 錯誤、未模擬模式及重複分支都不改環境',()=>{
 const s=init(),unborn=E.clone(s);assert.equal(E.execute(s,'git checkout -b soup').ok,false);assert.deepEqual(s,unborn);
 commit(s,'one');run(s,'git branch soup');
 for(const c of ['git checkout','git checkout -b','git checkout -b soup','git checkout missing','git checkout -c soup','git switch -b soup','git checkout -- README.md','git checkout -b other main','git checkout -B soup','git checkout --detach','git checkout -b constructor','git checkout -b __proto__']){
  const before=E.clone(s);assert.equal(E.execute(s,c).ok,false,c);assert.deepEqual(s,before,c);
 }
 assert.match(E.execute(s,'git push').output,/本模擬器尚未實作/);
});
test('可提交刪檔；刪除工作區內容不刪除既有版本',()=>{
 const s=init();commit(s,'one');delete s.work['README.md'];run(s,'git add README.md');assert.match(run(s,'git diff --staged').output,/刪除/);run(s,'git commit -m "remove"');assert.deepEqual(E.head(s).files,{});assert.ok(s.commits[0].files['README.md']);
});
test('不執行 shell；不支援操作與錯誤引號不改環境',()=>{
 const s=init();for(const c of ['git push','git reset --hard','git init extra','git commit -m "unterminated','git add .; evil','git switch __proto__','git branch constructor']){const before=E.clone(s);assert.equal(E.execute(s,c).ok,false,c);assert.deepEqual(s,before);}
 for(const name of ['../secret','__proto__','constructor','a/b','.git'])assert.equal(E.edit(s,name,'bad').ok,false);
 assert.equal(E.edit(s,'notes.txt','<script>not executed</script>').ok,true);
});
test('重複 init 保留資料；重複合併保持原狀；獨立環境不共用',()=>{
 const s=init();commit(s,'one');const before=E.clone(s);run(s,'git init');run(s,'git merge main');assert.deepEqual(s,before);const other=E.initial();E.edit(s,'README.md','x');assert.notEqual(other.work['README.md'],s.work['README.md']);
});

for(const [name,options] of [
 ['long',{add:'git add --all',status:'git status --short --branch',message:'git commit --message="開張"',log:'git log --oneline --max-count=1',diff:'git diff --cached',branch:'git switch --create soup',list:'git branch --list'}],
 ['short',{add:'git add -A',status:'git status -sb',message:'git commit -m開張',log:'git log -1',diff:'git diff --cached',branch:'git checkout -b soup',list:'git branch --show-current'}],
 ['paths',{add:'git add -- ./README.md',status:'git status -s -b',message:'git commit --message 開張',log:'git log -n 1',diff:'git diff --staged',branch:'git branch soup',list:'git branch -l'}]
])test('等效命令完整通過 10 關：'+name,()=>{
 const s=E.initial(),steps=[['git init'],[options.status],[options.add,options.status],[options.message,options.log],
 [()=>E.edit(s,'README.md','第二版'),'git diff'],[options.add,options.diff],['git commit -am "第二版"',options.status],
 [options.branch,...(name==='paths'?['git checkout soup']:[]),options.list],
 [()=>E.edit(s,'README.md','濃湯'),'git add --update','git commit --message 濃湯',options.log],['git checkout main','git merge --ff-only soup',options.status]];
 steps.forEach((commands,i)=>{let r;for(const c of commands)r=typeof c==='function'?c():run(s,c);assert.ok(M[i].check(s,r),'mission '+i);});
 assert.ok(E.clean(s));assert.equal(s.work['README.md'],'濃湯');
});
test('add 多檔先驗證，錯誤不會留下部分暫存；-u 不收未追蹤檔',()=>{
 const s=init();commit(s,'base');E.edit(s,'README.md','new');E.edit(s,'notes.txt','notes');
 run(s,'git add --update');assert.equal(s.index['README.md'],'new');assert.equal(s.index['notes.txt'],undefined);
 const before=E.clone(s);for(const bad of ['git add notes.txt missing','git add . missing','git add \"\"']){assert.equal(E.execute(s,bad).ok,false);assert.deepEqual(s,before);}
 run(s,'git add ./README.md notes.txt');assert.equal(s.index['notes.txt'],'notes');
 delete s.work['README.md'];run(s,'git add -A');assert.equal(s.index['README.md'],undefined);
});
test('commit -a 真正更新追蹤檔快照，保留未追蹤檔；無訊息／錯誤旗標不可偷偷暫存',()=>{
 for(const syntax of ['git commit -am update','git commit -a -mupdate','git commit --all --message=update','git commit -amupdate']){
  const s=init();commit(s,'base');E.edit(s,'README.md','changed');E.edit(s,'notes.txt','untracked');
  const before=E.clone(s);for(const bad of ['git commit -a','git commit -a -m ""','git commit -a --unknown -m x']){assert.equal(E.execute(s,bad).ok,false);assert.deepEqual(s,before);}
  run(s,syntax);assert.equal(E.head(s).files['README.md'],'changed');assert.equal(E.head(s).files['notes.txt'],undefined);assert.equal(s.work['notes.txt'],'untracked');
 }
});
test('status 短格式區分未追蹤、已暫存與暫存後再修改；所有讀取指令不改環境',()=>{
 const s=init();assert.match(run(s,'git status -s').output,/\?\? README.md/);run(s,'git add .');
 assert.match(run(s,'git status -s').output,/A  README.md/);E.edit(s,'README.md','changed');
 assert.match(run(s,'git status -sb').output,/AM README.md/);
 const before=E.clone(s);for(const c of ['git status -sb','git diff --cached','git branch --list','git branch --show-current','git log -n0','git --version','git --help'])run(s,c);assert.deepEqual(s,before);
});
test('log 限制筆數正確；沒有列出提交不能通過 log 關卡',()=>{
 const s=init();commit(s,'base');const empty=run(s,'git log -n0');assert.deepEqual(empty.logIds,[]);assert.equal(Boolean(M[3].check(s,empty)),false);
 E.edit(s,'README.md','second');commit(s,'second');
 for(const c of ['git log -n 1','git log -n1','git log -1','git log --max-count 1','git log --max-count=1'])assert.equal(run(s,c).logIds.length,1);
 assert.equal(run(s,'git log').logIds.length,2);
 const before=E.clone(s);for(const c of ['git log -n','git log -n -1','git log --max-count=bad','git add --bad','git diff --unknown','git merge --no-ff main']){assert.equal(E.execute(s,c).ok,false);assert.deepEqual(s,before);}
});
test('斜線分支名稱不允許與既有分支的路徑前綴衝突；失敗不改環境',()=>{
 const s=init();commit(s,'base');run(s,'git branch feature/soup');const before=E.clone(s);
 for(const c of ['git branch feature','git branch feature/soup/extra','git branch feature//other','git branch feature/']){assert.equal(E.execute(s,c).ok,false);assert.deepEqual(s,before);}
 run(s,'git checkout feature/soup');assert.equal(s.branch,'feature/soup');
});
test('短格式區分已暫存刪除及同名的未追蹤新檔',()=>{
 const s=init();commit(s,'base');delete s.work['README.md'];run(s,'git add -u');E.edit(s,'README.md','new');
 assert.equal(run(s,'git status -s').output,'D  README.md\n?? README.md');
});
