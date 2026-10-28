const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const E=require('../shortcut-school-engine.js');
const ids=Object.keys(E.profiles);
function advanceTo(id,task){const s=E.create(id);while(E.current(s).id!==task){answer(s);E.next(s);}return s;}
function answer(s){const result=E.submit(s,E.current(s).keys);if(result.status==='input')E.apply(s,{find:'充電線',folder:'旅行照片',rename:'上課筆記'}[s.pending]);}
test('each platform has 12 unique GUI tasks, constructible chords and no same-platform ambiguity',()=>{
 assert.deepEqual(ids,['windows','mac','gnome','kde']);
 for(const id of ids){const t=E.tasks(id);assert.equal(t.length,12);assert.equal(new Set(t.map(t=>t.id)).size,12);assert.equal(new Set(t.map(t=>E.canonical(t.keys))).size,12);for(const task of t){assert.ok(['notes','files','system'].includes(task.scope));assert.ok(task.keys.every(k=>E.keyOrder.includes(k)));assert.ok(task.context&&task.note&&task.goal);}}
 assert.throws(()=>E.create('toString'));assert.throws(()=>E.tasks('unknown'));
});
test('important system differences are explicit and chords cannot interchange platforms',()=>{
 const keys=(p,id)=>E.tasks(p).find(t=>t.id===id).keys;
 assert.deepEqual(keys('mac','rename'),['Return']);assert.deepEqual(keys('windows','rename'),['F2']);
 assert.deepEqual(keys('gnome','switch'),['Super','Tab']);assert.deepEqual(keys('kde','switch'),['Alt','Tab']);const kde=advanceTo('kde','switch');assert.equal(E.submit(kde,['Super','Tab']).status,'correct');assert.deepEqual(kde.answers.at(-1).keys,['Super','Tab']);
 assert.deepEqual(keys('windows','redo'),['Ctrl','Y']);assert.deepEqual(keys('mac','redo'),['Cmd','Shift','Z']);assert.deepEqual(keys('kde','redo'),['Ctrl','Shift','Z']);
 const s=E.create('mac');assert.equal(E.submit(s,['Ctrl','A']).status,'wrong');assert.equal(s.scene.selected,false);assert.equal(E.submit(s,['A','Cmd']).status,'correct');
 assert.equal(E.matches(['Ctrl','Ctrl','A'],['Ctrl','A']),false);assert.equal(E.matches(['Ctrl','Shift','A'],['Ctrl','A']),false);
});
test('wrong and empty chords do not mutate desktop or complete a task; locked answers do not score twice',()=>{
 const s=E.create();const before=structuredClone(s.scene);
 assert.equal(E.next(s),false);assert.equal(E.submit(s,[]).status,'empty');assert.equal(s.attempts,0);
 assert.equal(E.submit(s,['Alt','F2']).status,'wrong');assert.deepEqual(s.scene,before);assert.equal(s.answers.length,0);
 assert.equal(E.submit(s,['Ctrl','A']).status,'correct');assert.equal(s.scene.selected,true);assert.equal(s.answers[0].first,false);
 assert.equal(E.submit(s,['Ctrl','A']).status,'locked');assert.equal(s.answers.length,1);
});
test('copy keeps original, cut removes selected text, paste uses the simulated clipboard',()=>{
 for(const profile of ids){
  const copy=advanceTo(profile,'copy'),text=copy.scene.text;answer(copy);assert.equal(copy.scene.text,text);assert.equal(copy.scene.clipboard,text);
  const cut=advanceTo(profile,'cut'),cutText=cut.scene.text;answer(cut);assert.equal(cut.scene.text,'');assert.equal(cut.scene.clipboard,cutText);
  const paste=advanceTo(profile,'paste'),clipboard=paste.scene.clipboard;answer(paste);assert.equal(paste.scene.text,'備忘：'+clipboard);
 }
});
test('undo, redo and save cause actual simulated state changes',()=>{
 for(const profile of ids){const undo=advanceTo(profile,'undo');answer(undo);assert.equal(undo.scene.text,'備忘：帶一條線');assert.deepEqual(undo.scene.redo,['備忘：帶三條線']);const redo=advanceTo(profile,'redo');answer(redo);assert.equal(redo.scene.text,'備忘：帶三條線');const save=advanceTo(profile,'save');assert.equal(save.scene.saved,false);answer(save);assert.equal(save.scene.saved,true);}
});
test('search, create and rename require the subsequent input before completion, with fresh independent scenarios',()=>{
 for(const profile of ids)for(const task of ['find','folder','rename']){
  const s=advanceTo(profile,task),prior=s.answers.length,beforeFiles=[...s.scene.files];
  assert.equal(E.submit(s,E.current(s).keys).status,'input');assert.equal(s.solved,false);assert.equal(E.next(s),false);assert.equal(s.answers.length,prior);
  assert.equal(E.submit(s,E.current(s).keys).status,'locked');assert.equal(E.apply(s,'<img onerror=alert(1)>').status,'wrong');assert.deepEqual(s.scene.files,beforeFiles);
  const input={find:'充電線',folder:'旅行照片',rename:'上課筆記'}[task];assert.equal(E.apply(s,' '+input+' ').status,'correct');assert.equal(s.solved,true);assert.equal(s.answers.at(-1).first,false);
  if(task==='find')assert.ok(s.scene.findOpen&&s.scene.found&&s.scene.query===input);
  if(task==='folder')assert.ok(s.scene.files.includes(input));
  if(task==='rename'){assert.ok(s.scene.files.includes(input));assert.ok(!s.scene.files.includes('未命名資料夾'));}
  assert.equal(E.apply(s,input).status,'locked');
 }
});
test('new-window and switch-app tasks change different states',()=>{
 for(const profile of ids){const s=advanceTo(profile,'window');answer(s);assert.equal(s.scene.windows,2);assert.equal(s.scene.app,'files');const t=advanceTo(profile,'switch');assert.equal(t.scene.app,'notes');answer(t);assert.equal(t.scene.app,'files');assert.equal(t.scene.windows,1);}
});
test('all four platforms finish fully, retain hint/retry outcomes and restart without stale progress',()=>{
 for(const profile of ids){const s=E.create(profile);for(let i=0;i<12;i++){if(i===2)E.hint(s);if(i===4)E.submit(s,['Alt','S']);answer(s);assert.equal(s.solved,true);E.next(s);}assert.equal(s.phase,'result');assert.equal(s.answers.length,12);assert.equal(s.answers.filter(a=>a.first).length,10);assert.equal(s.answers[2].usedHint,true);assert.equal(s.answers[4].attempts,2);assert.equal(E.next(s),false);assert.equal(E.submit(s,['Ctrl','S']).status,'locked');const fresh=E.create(profile);assert.equal(fresh.index,0);assert.deepEqual(fresh.answers,[]);assert.equal(fresh.scene.clipboard,'');assert.equal(s.answers.length,12);}
});
test('game has no storage, network, clipboard or real shortcut interception; content renders as text',()=>{
 const engine=fs.readFileSync(require.resolve('../shortcut-school-engine.js'),'utf8');const ui=fs.readFileSync(require.resolve('../shortcut-school.js'),'utf8');
 assert.doesNotMatch(engine+ui,/localStorage|sessionStorage|indexedDB|navigator\.clipboard|fetch\(|XMLHttpRequest|addEventListener\(['"]key(?:down|up)|\.innerHTML/);
 const html=fs.readFileSync(require.resolve('../shortcut-school.html'),'utf8');assert.match(html,/GNOME/);assert.match(html,/KDE/);assert.match(html,/不讀取真實剪貼簿/);assert.match(html,/不教終端機指令/);
});
