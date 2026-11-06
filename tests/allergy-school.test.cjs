const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../allergy-school-engine.js');
test('12個情境均有公開來源，三單元各4題',()=>{
 assert.equal(E.questions.length,12);assert.equal(new Set(E.questions.map(q=>q.id)).size,12);
 for(const t of Object.keys(E.topics))assert.equal(E.questions.filter(q=>q.topic===t).length,4);
 for(const q of E.questions){assert.ok(E.sources[q.source][1].startsWith('https://'));assert.ok(q.why&&q.prompt);assert.equal(q.options.length,3);}
});
test('短局每單元2題，其他模式不重複，拒絕未知模式',()=>{
 for(let i=0;i<30;i++){const qs=E.queue();assert.equal(qs.length,6);assert.equal(new Set(qs.map(q=>q.id)).size,6);for(const t of Object.keys(E.topics))assert.equal(qs.filter(q=>q.topic===t).length,2);}
 assert.equal(E.queue('all').length,12);for(const t of Object.keys(E.topics))assert.equal(E.queue(t).length,4);assert.throws(()=>E.queue('toString'));
});
test('每種模式完整作答：第一次錯答、看解說與重練分開計算',()=>{
 for(const mode of ['short','all',...Object.keys(E.topics)]){
 const s=E.create(mode);for(const [i,q] of s.items.entries()){
 assert.equal(E.next(s),false);for(const bad of [undefined,-1,3,'0',NaN])assert.equal(E.submit(s,bad),null);
 const choice=i===0?1:i===1?null:q.answer;
 assert.equal(E.submit(s,choice).ok,i>1);const first=JSON.stringify(s.answers);
 assert.equal(E.submit(s,q.answer),null);assert.equal(E.retry(s,q.answer).ok,true);assert.equal(JSON.stringify(s.answers),first);assert.equal(E.next(s),true);
 }assert.equal(s.answers.filter(a=>a.ok).length,s.items.length-2);assert.equal(E.submit(s,0),null);assert.equal(E.retry(s,0),null);assert.equal(E.next(s),false);
 }
});
test('只看解說仍完成整輪但不能拿答對分數',()=>{const s=E.create();for(const q of s.items){E.submit(s,null);E.next(s);}assert.equal(s.answers.length,6);assert.equal(s.answers.filter(a=>a.ok).length,0);});
test('急救、疾病差異與個別化照護的重要界線存在',()=>{
 const q=id=>E.questions.find(q=>q.id===id);
 assert.match(q('urgent').options[0],/119.*腎上腺素/);assert.match(q('urgent').why,/抗組織胺不能取代/);
 assert.match(q('better').why,/仍需醫療/);assert.match(q('cause').why,/不能.*確診/);assert.match(q('pet').why,/不只在毛/);assert.match(q('patch').why,/不是醫療貼膚測試/);assert.match(q('food').why,/不任意擴大禁食/);
});
