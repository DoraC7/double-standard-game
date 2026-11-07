const {test}=require('node:test'),assert=require('node:assert/strict'),E=require('../biology-explorer-engine.js');
test('16個觀察情境、四主題平衡，題目來源完整',()=>{
 assert.equal(E.questions.length,16);assert.equal(new Set(E.questions.map(q=>q.id)).size,16);
 for(const topic of Object.keys(E.topics))assert.equal(E.questions.filter(q=>q.topic===topic).length,4);
 for(const q of E.questions){assert.equal(new Set(q.options).size,3);assert.ok(q.options[q.answer]);assert.ok(q.display&&q.why&&q.icon);assert.ok(E.sources[q.source]);assert.match(E.sources[q.source][1],/^https:\/\//);}
});
test('生物答案涵蓋構造、變態、生態角色與觀察範圍',()=>{
 const correct=E.questions.map(q=>q.options[q.answer]);
 const expected=['蛛形綱：蜘蛛有4對步足','腹足，是肌肉質的足','哺乳動物','牠是甲殼類，不能因為在陸地上就當成昆蟲','卵 → 幼蟲 → 蛹 → 成蟲','同一隻動物發育時，身體構造也在改變','定期清除容器積水，並刷洗容器內壁','昆蟲的發育方式不只一種','授粉','分解者，協助物質循環','掘穴與攝食活動能影響土壤結構與有機物處理','草能利用光能製造有機物，蝗蟲取食草後取得部分能量','只能描述這次這隻的路線，還需要更多觀察','這幾次觀察中，雨後晚上較容易看到；原因還需查證','同時改變光照與水量，難把差異只歸因於水量','保持距離拍照，記下地點、時間與動作，不碰觸或餵食'];
 assert.deepEqual(correct,expected);
 const byTitle=t=>E.questions.find(q=>q.title===t).why;
 assert.match(byTitle('蜜蜂帶走的不只花蜜'),/授粉不等於.*受精/);assert.match(byTitle('菇類不是小植物'),/並非每種真菌/);assert.match(byTitle('潮濕處看到蝸牛'),/關聯.*不是證明/);assert.match(byTitle('青蛙不是放大版蝌蚪'),/不同蛙種/);
});
test('100輪短場每類兩題、不重複；完整與單元範圍正確',()=>{
 for(let i=0;i<100;i++){const s=E.create();assert.equal(s.items.length,8);assert.equal(new Set(s.items.map(q=>q.id)).size,8);for(const t of Object.keys(E.topics))assert.equal(s.items.filter(q=>q.topic===t).length,2);}
 assert.equal(E.create('all').items.length,16);for(const t of Object.keys(E.topics))assert.equal(E.create(t).items.length,4);assert.throws(()=>E.create('unknown'));
});
test('選擇不計分、確認鎖定、每類錯後重試保留首次、結算完整',()=>{
 const s=E.create('all'),missed=new Set();assert.equal(E.submit(s),null);assert.equal(E.next(s),false);
 for(const q of s.items){assert.ok(E.select(s,q.answer));assert.equal(s.results.length,s.index);
 if(!missed.has(q.topic)){missed.add(q.topic);E.submit(s,(q.answer+1)%3);const before=JSON.stringify(s);assert.equal(E.submit(s,q.answer),null);assert.equal(E.select(s,q.answer),false);assert.equal(JSON.stringify(s),before);assert.ok(E.retry(s));assert.equal(s.selected,null);}
 assert.ok(E.submit(s,q.answer));assert.ok(E.next(s));}
 assert.ok(s.done);assert.equal(s.results.length,16);assert.equal(s.results.filter(r=>r.first).length,12);assert.equal(s.results.filter(r=>r.latest).length,16);assert.equal(E.submit(s,0),null);assert.equal(E.next(s),false);assert.equal(E.create().results.length,0);
});
test('只看解析不能變成答對，非法選擇不改狀態',()=>{
 const s=E.create(),before=JSON.stringify(s);for(const v of [-1,3,NaN,.5,'0',null])assert.equal(E.select(s,v),false);assert.equal(JSON.stringify(s),before);
 for(const q of s.items){E.submit(s,'unsure');E.next(s);}assert.ok(s.done);assert.equal(s.results.filter(r=>r.first).length,0);
});
