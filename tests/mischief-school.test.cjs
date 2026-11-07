const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../mischief-school-engine.js');
test('12幕三片場，36分支資料完整且收尾不同',()=>{
 assert.equal(E.scenes.length,12);assert.equal(new Set(E.scenes.map(s=>s.id)).size,12);
 for(const t of Object.keys(E.topics))assert.equal(E.scenes.filter(s=>s.topic===t).length,4);
 for(const s of E.scenes){assert.equal(s.props.length,3);assert.equal(new Set(s.props.map(p=>p.cleanup)).size,3);assert.ok(s.props[s.target]);for(const p of s.props)assert.ok(p.label&&p.note&&p.effect&&p.cleanup);}
});
test('全部36個道具分支依實際選擇收尾，不依標準道具偷換',()=>{
 for(const scene of E.scenes)for(let branch=0;branch<3;branch++)for(let cleanup=0;cleanup<3;cleanup++){
  const s=E.create('all');s.items=[scene];assert.equal(E.confirm(s),false);E.select(s,branch);E.confirm(s);assert.equal(s.branch,branch);assert.equal(s.phase,'outcome');assert.equal(s.records[0].propFirst,branch===scene.target);
  assert.equal(E.select(s,1),false);assert.equal(E.confirm(s),false);E.next(s);E.select(s,cleanup);E.confirm(s);assert.equal(s.records[0].cleanFirst,cleanup===branch);assert.equal(s.records[0].lastBranch,branch);E.next(s);assert.ok(s.done);
 }
});
test('重演清空舞台並保留首次分數與最初道具',()=>{
 const s=E.create('all'),scene=s.items[0],wrong=(scene.target+1)%3;
 E.select(s,wrong);E.confirm(s);E.next(s);E.select(s,(wrong+1)%3);E.confirm(s);assert.equal(E.scores(s).first,0);
 assert.ok(E.retry(s));assert.equal(s.branch,null);assert.equal(s.selected,null);assert.equal(s.phase,'prop');
 E.select(s,scene.target);E.confirm(s);E.next(s);E.select(s,scene.target);E.confirm(s);
 assert.equal(E.scores(s).first,0);assert.equal(E.scores(s).latest,2);assert.equal(s.records[0].firstBranch,wrong);assert.equal(s.records[0].lastBranch,scene.target);assert.equal(s.records[0].tries,2);
});
test('全部模式完整完成與100輪短局平衡、不重複',()=>{
 for(let i=0;i<100;i++){const s=E.create();assert.equal(s.items.length,6);for(const t of Object.keys(E.topics))assert.equal(s.items.filter(q=>q.topic===t).length,2);assert.equal(new Set(s.items.map(q=>q.id)).size,6);}
 for(const mode of ['short','all',...Object.keys(E.topics)]){const s=E.create(mode);for(const scene of s.items){E.select(s,scene.target);E.confirm(s);E.next(s);E.select(s,scene.target);E.confirm(s);E.next(s);}assert.ok(s.done);assert.equal(E.scores(s).first,s.items.length*2);assert.equal(E.confirm(s),false);assert.equal(E.next(s),false);}
});
test('輸入與階段限制阻擋越界、未選、重複提交',()=>{
 const s=E.create();for(const n of [-1,3,null,'1',.5])assert.equal(E.select(s,n),false);assert.equal(E.next(s),false);assert.equal(E.retry(s),false);
 E.select(s,0);E.confirm(s);const before=JSON.stringify(s);E.confirm(s);assert.equal(JSON.stringify(s),before);E.next(s);assert.equal(s.selected,null);assert.equal(E.confirm(s),false);
});
