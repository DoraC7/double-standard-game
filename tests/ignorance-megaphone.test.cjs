const {test}=require('node:test'),assert=require('node:assert/strict');const E=require('../ignorance-megaphone-engine.js');
test('12情境三類各4，答案與資料完整',()=>{assert.equal(E.cases.length,12);assert.equal(new Set(E.cases.map(q=>q.id)).size,12);for(const t of Object.keys(E.topics))assert.equal(E.cases.filter(q=>q.topic===t).length,4);for(const q of E.cases){assert.equal(new Set(q.options).size,3);assert.ok(q.options[q.answer]&&q.source&&q.why);}});
test('所有句子×靜音／中等／最大音量：真假不隨音量改變',()=>{
 for(const q of E.cases)for(let choice=0;choice<3;choice++)for(const volume of [0,40,100]){
  const s=E.create('all');s.items=[q];assert.equal(E.submit(s),null);E.select(s,choice);E.setVolume(s,volume);const r=E.submit(s);assert.equal(r.supported,choice===q.answer);assert.equal(r.reach,volume*2);assert.equal(E.scores(s).firstMisled,choice===q.answer?0:volume*2);assert.equal(E.scores(s).first,Number(choice===q.answer));
 }
});
test('確認後鎖定；修訂不能改首次句子、音量、擴散與誤傳',()=>{
 const s=E.create('all'),q=s.items[0],wrong=(q.answer+1)%3;E.select(s,wrong);E.setVolume(s,100);const emitted=E.submit(s);emitted.volume=0;
 assert.equal(s.results[0].first.volume,100);assert.equal(E.submit(s),null);assert.equal(E.select(s,q.answer),false);assert.equal(E.setVolume(s,0),false);
 assert.ok(E.retry(s));assert.equal(s.volume,40);assert.equal(s.selected,null);E.select(s,q.answer);E.setVolume(s,0);E.submit(s);assert.equal(s.results[0].first.choice,wrong);assert.equal(s.results[0].first.volume,100);assert.equal(s.results[0].latest.volume,0);assert.equal(E.scores(s).firstMisled,200);assert.equal(E.scores(s).latest,1);
 E.next(s);assert.equal(s.volume,40);assert.equal(s.selected,null);assert.equal(s.locked,false);
});
test('短局100輪平衡；所有模式可完成，重開清空',()=>{
 for(let i=0;i<100;i++){const s=E.create();assert.equal(s.items.length,6);assert.equal(new Set(s.items.map(q=>q.id)).size,6);for(const t of Object.keys(E.topics))assert.equal(s.items.filter(q=>q.topic===t).length,2);}
 for(const mode of ['short','all',...Object.keys(E.topics)]){const s=E.create(mode);for(const q of s.items){E.select(s,q.answer);E.submit(s);E.next(s);}assert.ok(s.done);assert.equal(E.scores(s).first,s.items.length);assert.equal(E.submit(s),null);assert.equal(E.next(s),false);}
 assert.equal(E.create().results.length,0);
});
test('拒絕無效輸入；明確證據可下確定結論，不獎勵一律待查',()=>{
 const s=E.create();for(const v of [-10,101,45,NaN,'40'])assert.equal(E.setVolume(s,v),false);for(const v of [-1,3,'0',.5])assert.equal(E.select(s,v),false);assert.equal(E.next(s),false);
 const rate=E.cases.find(q=>q.id==='numbers-1');assert.match(rate.options[rate.answer],/增幅100％/);const avg=E.cases.find(q=>q.id==='numbers-3');assert.match(avg.options[avg.answer],/平均每人5顆/);const old=E.cases.find(q=>q.id==='frame-2');assert.match(old.options[old.answer],/仍待確認/);
});
