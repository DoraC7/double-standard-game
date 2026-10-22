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
