const {test}=require('node:test'),assert=require('node:assert/strict');const E=require('../english-flex-engine.js');
test('36近似題三類各12，追問各有4個唯一選項',()=>{assert.equal(E.questions.length,36);assert.equal(new Set(E.questions.map(q=>q.id)).size,36);for(const t of Object.keys(E.topics))assert.equal(E.questions.filter(q=>q.topic===t).length,12);for(const q of E.questions){assert.equal(new Set(q.options).size,4);assert.equal(new Set(q.follow.options).size,4);assert.ok(q.options[q.answer]&&q.follow.options[q.follow.answer]&&q.why&&q.follow.why);assert.ok(E.ratio(E.sentence(q,q.answer,2))>=q.target,q.id);}});
test('用法答案逐題獨立核對，不因混搭風味改變',()=>{
 const expected=['at','at','on','on','in','in','in','on','at','in','at','in','at','in','to','to','for','at','on','in','at','of','to','about','by','by','by','by','by','by','on','on','off','into','out of','on'];
 E.questions.forEach((q,i)=>assert.equal(q.options[q.answer],expected[i],q.id));assert.equal(E.ratio('Hello你好123!'),71);assert.equal(E.ratio('中文'),0);assert.equal(E.ratio('English'),100);assert.equal(E.ratio('123！'),0);
});
function answer(s,q,{wrong=false,followWrong=false}={}){E.select(s,wrong?(q.answer+1)%4:q.answer);E.select(s,2,'style');assert.ok(E.submit(s));if(s.phase==='check'){assert.equal(s.records[s.index],undefined);assert.equal(E.submit(s),false);E.select(s,followWrong?(q.follow.answer+1)%4:q.follow.answer,'follow');assert.ok(E.submit(s));}}
test('每輪三分之一隨機追問，不先記分／洩漏判定；全模式可完成',()=>{
 for(const mode of ['all','short',...Object.keys(E.topics)]){const s=E.create(mode);assert.equal(s.items.length,mode==='all'?36:12);assert.equal(s.traps.size,mode==='all'?12:4);for(const q of s.items){answer(s,q);assert.equal(E.select(s,0),false);assert.ok(E.next(s));}assert.ok(s.done);assert.equal(E.scores(s).grammar,s.items.length);assert.equal(E.scores(s).follow,s.traps.size);}
});
test('原題與追問錯後重試分開保留首次，最新紀錄可更新',()=>{
 const s=E.create(),q=s.items[0];s.traps=new Set([q.id]);answer(s,q,{wrong:true,followWrong:true});const first=JSON.stringify(s.records[0].first);assert.ok(E.retry(s));assert.equal(s.choice,null);assert.equal(s.style,null);assert.equal(s.follow,null);
 E.select(s,q.answer);E.select(s,2,'style');E.submit(s);E.select(s,q.follow.answer,'follow');E.submit(s);assert.equal(JSON.stringify(s.records[0].first),first);assert.equal(E.scores(s).grammar,0);assert.equal(E.scores(s).follow,0);assert.equal(E.scores(s).latestGrammar,1);assert.equal(E.scores(s).latestFollow,1);
});
test('100輪短局平衡、不重複；新題／重開清空選擇，非法輸入被拒',()=>{
 for(let i=0;i<100;i++){const s=E.create();for(const t of Object.keys(E.topics))assert.equal(s.items.filter(q=>q.topic===t).length,4);assert.equal(new Set(s.items.map(q=>q.id)).size,12);}
 const s=E.create();assert.equal(E.submit(s),false);for(const n of [-1,4,'0',.5])assert.equal(E.select(s,n),false);assert.equal(E.select(s,3,'style'),false);answer(s,s.items[0]);E.next(s);assert.equal(s.choice,null);assert.equal(s.style,null);assert.equal(E.create().records.length,0);
});
