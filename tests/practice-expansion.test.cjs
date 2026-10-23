const {test}=require('node:test');
const assert=require('node:assert/strict');
const G=require('../git-engine.js'),T=require('../terminal-engine.js');
global.GitEngine=G;require('../git-missions.js');const GM=global.GitMissions;
const TM=require('../terminal-missions.js');
const run=(E,s,line)=>{const r=E.execute(s,line);assert.equal(r.ok,true,line+': '+r.output);return r;};
const base=()=>{const s=G.initial();run(G,s,'git init');run(G,s,'git add .');run(G,s,'git commit -m base');return s;};
const edit=(s,text,name='README.md')=>{const r=G.edit(s,name,text);assert.ok(r.ok);return r;};
for(const short of [false,true])test('Git 16 關完整路線：'+(short?'短旗標':'長旗標')+'；實際保存內容與事件核對',()=>{
 const s=G.initial(),restore=short?'git restore -S':'git restore --staged';
 const steps=[['git init'],['git status'],['git add README.md','git status'],['git commit -m base','git log'],
 [()=>edit(s,'second'),'git diff'],['git add .','git diff --cached'],['git commit -m second','git status'],
 ['git checkout -b soup','git branch'],[()=>edit(s,'soup'),'git add .','git commit -m soup','git log'],
 ['git switch main','git merge soup','git status'],
 [()=>edit(s,'oops'),'git add README.md',restore+' -- ./README.md','git status -sb'],
 ['git restore -- README.md','git diff'],[()=>edit(s,'自己的筆記','notes.txt'),'git add notes.txt','git commit -m notes','git show HEAD:notes.txt'],
 [()=>edit(s,'staged A'),'git add README.md',()=>edit(s,'work B'),'git diff','git diff --staged'],
 ['git commit -m A','git status'],['git restore README.md','git status','git branch '+(short?'-d':'--delete')+' soup','git branch --list']];
 assert.equal(GM.length,16);assert.equal(GM.filter(m=>m.quiz).length,5);
 steps.forEach((commands,i)=>{const events=[];assert.equal(Boolean(GM[i].check(s,{event:'help'},events)),false,GM[i].title);for(const c of commands)events.push(typeof c==='function'?c():run(G,s,c));assert.ok(GM[i].check(s,events.at(-1),events),GM[i].title);});
 assert.equal(G.head(s).files['README.md'],'staged A');assert.equal(G.head(s).files['notes.txt'],'自己的筆記');assert.ok(G.clean(s));assert.equal(s.commits.length,5);assert.deepEqual(Object.keys(s.branches),['main']);
});
test('restore 來源：預設 index、--staged HEAD、同時 -S -W HEAD；未追蹤檔保留',()=>{
 const s=base();const head=G.head(s).files['README.md'];edit(s,'A');run(G,s,'git add .');edit(s,'B');edit(s,'留著','new.txt');
 run(G,s,'git restore README.md');assert.equal(s.work['README.md'],'A');assert.equal(s.index['README.md'],'A');
 edit(s,'B');run(G,s,'git restore --staged README.md');assert.equal(s.work['README.md'],'B');assert.equal(s.index['README.md'],head);
 run(G,s,'git add README.md');run(G,s,'git restore -SW .');assert.equal(s.work['README.md'],head);assert.equal(s.index['README.md'],head);assert.equal(s.work['new.txt'],'留著');assert.equal(s.commits.length,1);
});
test('restore 多檔錯誤原子化；拒絕未知來源與未追蹤路徑；unborn 不猜 HEAD',()=>{
 const s=base();edit(s,'draft');run(G,s,'git add .');const before=G.clone(s);
 for(const line of ['git restore --staged README.md missing','git restore README.md missing','git restore --source=HEAD README.md','git restore ""','git restore --staged','git restore --unknown README.md','git restore --staged --worktree . missing']){
  // Even when . selects everything, invalid explicitly named paths must be rejected.
  assert.equal(G.execute(s,line).ok,false,line);assert.deepEqual(s,before,line);
 }
 const unborn=G.initial();run(G,unborn,'git init');run(G,unborn,'git add .');const snap=G.clone(unborn);assert.equal(G.execute(unborn,'git restore --staged README.md').ok,false);assert.deepEqual(unborn,snap);
});
test('restore 可取消新檔暫存、還原刪除與已暫存刪除；不改動舊提交',()=>{
 const s=base(),original=G.clone(G.head(s));edit(s,'new','notes.txt');run(G,s,'git add notes.txt');run(G,s,'git restore --staged notes.txt');assert.equal(s.index['notes.txt'],undefined);assert.equal(s.work['notes.txt'],'new');
 delete s.work['README.md'];run(G,s,'git restore README.md');assert.equal(s.work['README.md'],original.files['README.md']);
 delete s.work['README.md'];run(G,s,'git add -u');run(G,s,'git restore --staged --worktree README.md');assert.equal(s.work['README.md'],original.files['README.md']);assert.deepEqual(G.head(s),original);
});
test('show 區分 HEAD／index／分支／完整 ID；全部讀取無副作用',()=>{
 const s=base(),id=s.branches.main,head=G.head(s).files['README.md'];run(G,s,'git branch soup');edit(s,'staged');run(G,s,'git add .');edit(s,'work');const before=G.clone(s);
 for(const line of ['git show HEAD:README.md','git show main:README.md','git show soup:README.md','git show '+id+':README.md'])assert.equal(run(G,s,line).output,head);
 assert.equal(run(G,s,'git show :README.md').output,'staged');assert.match(run(G,s,'git show').output,/base/);
 for(const line of ['git show HEAD:missing','git show HEAD~1','git show --stat','git show HEAD extra','git show :__proto__'])assert.equal(G.execute(s,line).ok,false,line);
 assert.deepEqual(s,before);
});
test('branch -d 拒絕目前分支與未合入版本；合入後只移除指標不刪提交',()=>{
 const s=base();run(G,s,'git switch -c soup');edit(s,'soup');run(G,s,'git add .');run(G,s,'git commit -m soup');run(G,s,'git switch main');const before=G.clone(s);
 for(const line of ['git branch -d main','git branch -d soup','git branch -d missing','git branch -D soup']){assert.equal(G.execute(s,line).ok,false);assert.deepEqual(s,before);}
 run(G,s,'git merge soup');const commits=G.clone(s.commits);run(G,s,'git branch --delete soup');assert.deepEqual(s.commits,commits);assert.equal(s.branches.soup,undefined);
});
test('舊的或空的 diff 證據、no-op restore 不能完成新的任務',()=>{
 const s=base();const noop=run(G,s,'git restore --staged README.md');edit(s,'draft');assert.equal(Boolean(GM[10].check(s,run(G,s,'git status'),[noop])),false);
 const empty=run(G,s,'git diff --staged');const old=run(G,s,'git diff');edit(s,'A');run(G,s,'git add .');edit(s,'B');const staged=run(G,s,'git diff --staged');
 assert.equal(Boolean(GM[13].check(s,staged,[empty,old,staged])),false);const diff=run(G,s,'git diff');assert.ok(GM[13].check(s,diff,[staged,diff]));
});
test('終端機 20 關逐關通過並保留日誌及來源；錯誤核對目標不算',()=>{
 const s=T.initial();assert.equal(TM.length,20);
 for(const m of TM){const events=m.solution.map(line=>run(T,s,line));assert.ok(m.check(s,events.at(-1),events),m.title);assert.equal(Boolean(m.check(s,run(T,s,'help'),events)),false,m.title);}
 assert.equal(s.nodes[T.HOME+'/arcade/logs/workshop.log'].content,T.LOG);
});
test('find 支援起點、type、name 引號樣式；只比檔名、不改環境',()=>{
 const s=T.initial();run(T,s,'mkdir -p a/b');run(T,s,'touch a/note.txt "a/b/my notes.txt" a/note.log');const before=T.clone(s);
 const r=run(T,s,'find a -type f -name "*.txt"');assert.deepEqual(r.output.split('\n'),['a/b/my notes.txt','a/note.txt']);assert.equal(run(T,s,'find a -type d').matches.length,2);
 assert.equal(run(T,s,'find a -name "note.?xt"').matches.length,1);assert.ok(run(T,s,'find / -type f').output.startsWith('/home/'));assert.doesNotMatch(run(T,s,'find /').output,/\/\/home/);
 assert.equal(run(T,s,'find a -name "'+('a*'.repeat(180))+'z"').matches.length,0);
 for(const line of ['find missing','find a -delete','find a -type x','find a -name','find a -type f -type d','find arcade/README.txt/'])assert.equal(T.execute(s,line).ok,false,line);
 assert.deepEqual(s,before);
});
test('grep -F 固定文字、行號、大小寫、反選、計行、多檔；無符合與錯誤不改檔',()=>{
 const s=T.initial(),log='arcade/logs/workshop.log',before=T.clone(s);
 assert.equal(run(T,s,'grep -nF ERROR '+log).output,'3:09:02 ERROR missing menu.txt\n6:09:05 ERROR upload not attempted');
 assert.equal(run(T,s,'grep -Fic error '+log).output,'2');assert.equal(run(T,s,'grep --fixed-strings --ignore-case --count error '+log).output,'2');assert.equal(run(T,s,'grep -Fvc ERROR '+log).output,'6');
 assert.match(run(T,s,'grep -nF INFO '+log+' '+log).output,/workshop.log:1:09:00/);
 assert.equal(T.execute(s,'grep -F "E.ROR" '+log).ok,false);assert.equal(T.execute(s,'grep -Fc nothere '+log).output,'0');
 for(const line of ['grep ERROR '+log,'grep -F ERROR missing','grep -F ERROR '+log+' missing','grep -F ERROR arcade','grep -E ERROR '+log])assert.equal(T.execute(s,line).ok,false,line);
 assert.deepEqual(s,before);
});
test('head／tail 保留行尾；零行、少於預設行數、空檔、長短選項與錯誤',()=>{
 const s=T.initial(),log='arcade/logs/workshop.log',before=T.clone(s);
 assert.equal(run(T,s,'head -n 2 '+log).output,'09:00 INFO workshop started\n09:01 INFO read README\n');
 assert.equal(run(T,s,'tail --lines=2 '+log).output,'09:06 INFO local checks passed\n09:07 INFO workshop ended\n');
 for(const cmd of ['head','tail']){assert.equal(run(T,s,cmd+' -2 '+log).output,run(T,s,cmd+' --lines=2 '+log).output);assert.equal(run(T,s,cmd+' '+log).output,T.LOG);assert.equal(run(T,s,cmd+' -n0 '+log).output,'');assert.equal(run(T,s,cmd+' --lines 1 downloads/hello.txt').output,'小龍蝦說：你好，terminal！');
  for(const suffix of ['-n -1 '+log,'-n bad '+log,'-n 10001 '+log,'-f '+log,log+' missing','missing','arcade'])assert.equal(T.execute(s,cmd+' '+suffix).ok,false,cmd+' '+suffix);
 }assert.deepEqual(s,before);run(T,s,'touch empty');assert.equal(run(T,s,'tail -n 2 empty').output,'');
});
