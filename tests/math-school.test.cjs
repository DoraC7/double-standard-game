const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../math-school-engine.js');
test('24題四類、選項唯一、內容完整',()=>{
 assert.equal(E.questions.length,24);assert.equal(new Set(E.questions.map(q=>q.id)).size,24);
 for(const t of Object.keys(E.topics))assert.equal(E.questions.filter(q=>q.topic===t).length,6);
 for(const q of E.questions){assert.equal(new Set(q.options).size,3);assert.ok(q.options[q.answer]);assert.ok(q.why.length>20);}
});
test('算術、時間、單位與幾何的答案獨立核對',()=>{
 const values=[36,72,8,33,9,'7 盒，剩 1 顆','3/4','5/7','5/8','2/4','5/8',4,37,'15:25',35,235,1250,'A 包',22,24,20,4,20,11];
 E.questions.forEach((q,i)=>{const answer=q.options[q.answer];if(typeof values[i]==='number')assert.equal(Number(answer.match(/\d+/)[0]),values[i],q.id);else assert.equal(answer,values[i],q.id);});
});
test('100輪短局各類2題，全題及單類不重複',()=>{
 for(let n=0;n<100;n++){const s=E.create();assert.equal(s.items.length,8);assert.equal(new Set(s.items.map(q=>q.id)).size,8);for(const t of Object.keys(E.topics))assert.equal(s.items.filter(q=>q.topic===t).length,2);}
 assert.equal(E.create('all').items.length,24);for(const t of Object.keys(E.topics))assert.equal(E.create(t).items.length,6);assert.throws(()=>E.create('oops'));
});
test('完整作答、錯後重試、略過、鎖定、重開',()=>{
 const s=E.create('all');assert.equal(E.submit(s),null);assert.equal(E.next(s),false);
 s.items.forEach((q,i)=>{
  if(i===0){E.submit(s,(q.answer+1)%3);assert.equal(E.submit(s,q.answer),null);assert.ok(E.retry(s));assert.equal(s.selected,null);E.submit(s,q.answer);}
  else E.submit(s,i===1?'unsure':q.answer);
  assert.equal(E.select(s,q.answer),false);assert.ok(E.next(s));
 });
 assert.ok(s.done);assert.equal(s.results.filter(r=>r.first).length,22);assert.equal(s.results.filter(r=>r.latest).length,23);assert.equal(E.next(s),false);assert.equal(E.submit(s,0),null);assert.equal(E.create().results.length,0);
});
test('分數等分圖與面積格的題目幾何',()=>{
 const qs=E.questions.filter(q=>q.art==='fraction');assert.equal(qs.length,2);for(const q of qs){assert.ok(q.filled<=q.parts);assert.ok(q.parts>0);}
 const grid=E.questions.find(q=>q.art==='tiles');assert.equal(grid.cols*grid.rows,24);
});
