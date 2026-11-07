const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../housework-school-engine.js');
test('24個情境：四類各六題，8排序與16選擇',()=>{
 assert.equal(E.questions.length,24);assert.equal(new Set(E.questions.map(q=>q.id)).size,24);
 assert.equal(E.questions.filter(q=>q.kind==='order').length,8);
 for(const t of Object.keys(E.topics))assert.equal(E.questions.filter(q=>q.topic===t).length,6);
 for(const q of E.questions){assert.ok(q.why.length>20);if(q.kind==='order'){assert.equal(q.steps.length,3);assert.equal(new Set(q.steps).size,3);}else {assert.equal(new Set(q.options).size,3);assert.ok(q.options[q.answer]);}}
});
test('短局分布、不重複及所有模式可完成',()=>{
 for(let i=0;i<100;i++){const s=E.create();assert.equal(s.items.length,8);assert.equal(new Set(s.items.map(q=>q.id)).size,8);for(const t of Object.keys(E.topics))assert.equal(s.items.filter(q=>q.topic===t).length,2);}
 for(const mode of ['all',...Object.keys(E.topics)]){const s=E.create(mode);for(const q of s.items){const value=q.kind==='order'?[0,1,2]:q.answer;assert.ok(E.select(s,value));assert.ok(E.submit(s).latest);E.next(s);}assert.ok(s.done);assert.equal(s.results.length,mode==='all'?24:6);}
});
test('排序驗證拒絕缺步、重複、越界；判斷全部六種排列',()=>{
 const q=E.questions.find(q=>q.kind==='order');for(const v of [[0,0,2],[0,1],[0,1,3],0,'unsure'])assert.equal(E.valid(q,v),false);
 for(const v of [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]])assert.equal(E.correct(q,v),v.join()==='0,1,2');
});
test('每種操作的首次答錯、重試、鎖定、陣列快照與略過',()=>{
 for(const kind of ['choice','order']){
  const s=E.create('all'),q=E.questions.find(q=>q.kind===kind);s.items=[q];
  assert.equal(E.submit(s),null);assert.equal(E.next(s),false);
  E.submit(s,kind==='order'?[1,0,2]:(q.answer+1)%3);assert.equal(E.submit(s,0),null);assert.ok(E.retry(s));assert.equal(s.selected,null);
  const value=kind==='order'?[0,1,2]:q.answer;E.select(s,value);if(Array.isArray(value))value.reverse();assert.ok(E.submit(s).latest);assert.equal(s.results[0].first,false);assert.equal(s.results[0].tries,2);assert.equal(E.select(s,value),false);E.next(s);assert.ok(s.done);assert.equal(E.submit(s,value),null);
 }
 const s=E.create();E.submit(s,'unsure');assert.equal(s.results[0].first,false);assert.equal(s.results[0].value,'unsure');
});
test('內容以實際驗收、確認接手與公平分工為準，不以開始代替完成',()=>{
 for(const text of ['完全乾燥','確認接手者明確同意','共同討論工作量','不由性別','不等於整個任務完成'])assert.ok(JSON.stringify(E.questions).includes(text),text);
});
