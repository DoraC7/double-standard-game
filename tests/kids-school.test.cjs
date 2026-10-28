const {test}=require('node:test'),assert=require('node:assert/strict');
const data=require('../kids-school-data.js');
test('both schools offer four balanced stations and unique completable missions',()=>{
 for(const school of Object.values(data)){
  assert.equal(Object.keys(school.topics).length,4);assert.equal(school.questions.length,16);assert.equal(new Set(school.questions.map(q=>q.id)).size,16);
  for(const topic of Object.keys(school.topics))assert.equal(school.questions.filter(q=>q.topic===topic).length,4);
  for(const q of school.questions){for(const key of ['title','prompt','why','parent','home'])assert.ok(q[key]);assert.ok(q.topic in school.topics);assert.ok(Number.isInteger(q.answer));if(q.kind==='number'){assert.ok(q.answer>=0&&q.answer<=q.max);}else{assert.ok(q.answer>=0&&q.answer<q.options.length);assert.equal(new Set(q.options).size,q.options.length);}}
 }
});
test('numeric tasks match independently derived counts and arithmetic, not an arbitrary key',()=>{
 const q=Object.fromEntries(data.math.questions.map(q=>[q.id,q]));
 assert.equal(q.count.answer,q.count.objects.length);assert.equal(q.add.answer,3+2);assert.equal(q.subtract.answer,8-3);assert.equal(q.share.answer*2,6);assert.equal(q.pay.answer,4+3);assert.equal(q.change.answer+7,10);assert.equal(q.enough.answer+5,8);assert.equal(q.coin.answer+5,10);assert.equal(q.length.answer,5);assert.equal(q.clock3.answer,q.clock3.hour);assert.equal(q.clock8.answer,q.clock8.hour);assert.equal(q.later.answer,q.later.hour+1);
});
test('experiment evidence includes distinct settings, observations, and bounded conclusions',()=>{
 const keys=new Set();for(const q of data.science.questions){assert.equal(q.kind,'experiment');assert.equal(q.settings.length,2);assert.equal(new Set(q.settings.map(s=>s.label)).size,2);assert.equal(new Set(q.settings.map(s=>s.result)).size,2);for(const s of q.settings)assert.ok(s.visual);assert.equal(q.predictions.length,3);keys.add(q.answer);}
 assert.equal(keys.size,3,'correct answer positions should not all be the first option');
 const q=Object.fromEntries(data.science.questions.map(q=>[q.id,q]));assert.match(q.metal.options[q.metal.answer],/不是所有金屬/);assert.match(q.boat.options[q.boat.answer],/形狀/);assert.match(q.seedrecord.why,/看不出每一天/);assert.match(q.seedlight.why,/不等同所有種子發芽都需要光/);
});
