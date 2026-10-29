const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const E=require('../ignorance-engine.js');
const one=c=>{const s=E.create('full');s.items=[c];return s;};
function answer(s,value){assert.equal(E.select(s,value),true);const r=E.submit(s);assert.ok(r);return r;}
function advance(s){assert.equal(E.next(s),true);}
test('十二個虛構案例分成四類，資料卡有獨立內容與限定結論',()=>{
 assert.equal(E.cases.length,12);assert.equal(new Set(E.cases.map(c=>c.id)).size,12);
 for(const area of Object.keys(E.areas))assert.equal(E.cases.filter(c=>c.area===area).length,3);
 for(const c of E.cases){assert.equal(new Set(c.diagnosis).size,3);assert.ok(c.answer>=0&&c.answer<3);assert.equal(c.cards.length,3);assert.equal(new Set(c.cards.map(k=>k.title)).size,3);assert.ok(c.scene&&c.claim&&c.why&&c.checkWhy);for(const k of c.cards){assert.ok(k.text&&k.conclusion&&k.why);assert.equal(new Set([k.conclusion,...c.overclaims]).size,3);}}
});
test('快局每類一案、完整局每類三案；同輪不重複且拒絕無效模式',()=>{
 for(let n=0;n<30;n++){const s=E.create('quick');assert.equal(s.items.length,4);assert.equal(new Set(s.items.map(c=>c.id)).size,4);assert.deepEqual(new Set(s.items.map(c=>c.area)),new Set(Object.keys(E.areas)));}
 assert.equal(E.create('full').items.length,12);for(const mode of [null,'constructor','bad'])assert.throws(()=>E.create(mode));
 assert.deepEqual(E.create('full',()=>.25).items,E.create('full',()=>.25).items);
});
test('選擇不計分、確認才能鎖定；不能略過未作答的步驟',()=>{
 const s=E.create();assert.equal(E.next(s),false);assert.equal(E.submit(s),null);
 for(const v of [-1,3,NaN,null,'0'])assert.equal(E.select(s,v),false);
 assert.equal(E.select(s,E.question(s).answer),true);assert.equal(s.results.length,0);assert.equal(s.opened,null);assert.equal(E.submit(s).first,true);
 const before=JSON.stringify(s.results);assert.equal(E.select(s,2),false);assert.equal(E.submit(s,'unsure'),null);assert.equal(JSON.stringify(s.results),before);assert.equal(E.retry(s),false);
});
test('十二案三十六種查證分支：後續選項必須依實際翻開的卡改變',()=>{
 for(const c of E.cases)for(let card=0;card<3;card++){
  const s=one(c);answer(s,c.answer);advance(s);assert.equal(s.opened,null);assert.deepEqual(E.question(s).options,c.cards.map(k=>k.title));
  answer(s,card);assert.equal(s.opened,card);advance(s);const q=E.question(s);assert.equal(q.options[q.answer],c.cards[card].conclusion);assert.equal(q.why,c.cards[card].why);
  answer(s,q.answer);advance(s);assert.equal(s.done,true);assert.deepEqual(E.summary(s),{completed:3,total:3,first:card===c.best?3:2,latest:card===c.best?3:2});
 }
});
test('錯誤查證可重挑，舊卡會清除，首次錯誤不能被洗掉',()=>{
 for(const c of E.cases){const s=one(c);answer(s,c.answer);advance(s);answer(s,(c.best+1)%3);assert.equal(E.retry(s),true);assert.equal(s.opened,null);assert.equal(s.selected,null);assert.equal(E.next(s),false);answer(s,c.best);advance(s);assert.equal(E.question(s).options[0],c.cards[c.best].conclusion);assert.equal(s.results[1].first,false);assert.equal(s.results[1].latest,true);assert.equal(s.results[1].tries,2);}
});
test('先看解析不算答對；查證步的解析明確翻開關鍵卡供下一步使用',()=>{
 const s=one(E.cases[0]);E.submit(s,'unsure');advance(s);E.submit(s,'unsure');assert.equal(s.opened,s.items[0].best);advance(s);E.submit(s,'unsure');advance(s);assert.equal(s.done,true);assert.equal(E.summary(s).first,0);assert.equal(E.summary(s).completed,3);
});
test('兩種模式都能完成全局，每個階段故意錯一次再重試仍保留首次分數',()=>{
 for(const mode of ['quick','full']){const s=E.create(mode),missed=new Set();while(!s.done){const stage=s.stage;if(!missed.has(stage)){answer(s,(E.question(s).answer+1)%3);assert.equal(E.retry(s),true);missed.add(stage);}answer(s,E.question(s).answer);advance(s);}const r=E.summary(s);assert.equal(r.first,r.total-3);assert.equal(r.latest,r.total);assert.equal(E.next(s),false);assert.equal(E.submit(s,0),null);assert.equal(E.retry(s),false);assert.equal(E.select(s,0),false);assert.equal(E.question(s),null);assert.equal(E.create(mode).results.length,0);}
});
test('暫停封鎖所有作答、重試與推進，手動恢復不改進度',()=>{
 const s=E.create();E.select(s,0);E.pause(s,true);assert.equal(E.select(s,1),false);assert.equal(E.submit(s),null);assert.equal(E.next(s),false);assert.equal(E.retry(s),false);assert.equal(s.selected,0);E.pause(s,false);answer(s,1);E.pause(s,true);assert.equal(E.retry(s),false);assert.equal(E.next(s),false);E.pause(s,false);assert.equal(E.retry(s),true);
});
test('足夠證據能得確定結論；不把一律懷疑當成較好的判斷',()=>{
 for(const id of ['display','switch','pass','rain']){const c=E.cases.find(c=>c.id===id);assert.match(c.diagnosis[c.answer],/觀察|結論|推測/);}
 const display=E.cases.find(c=>c.id==='display');assert.match(display.cards[display.best].conclusion,/顯示 28°C.*26°C/);
 const pass=E.cases.find(c=>c.id==='pass');assert.match(pass.cards[pass.best].conclusion,/九點有證.*十點.*沒有/);
 const quote=E.cases.find(c=>c.id==='quote');assert.match(quote.cards[0].conclusion,/不是原話/);
 const rain=E.cases.find(c=>c.id==='rain');assert.match(rain.cards[rain.best].conclusion,/確實有降雨/);
});
test('匯出保留完整分母、每案原話與每步首次結果，沒有網路或儲存操作',()=>{
 const s=E.create('quick');while(!s.done){E.submit(s,'unsure');advance(s);}const text=E.exportText(s);assert.match(text,/已核對 12 \/ 12 步；首次答對 0 步/);for(const c of s.items)assert.ok(text.includes(c.claim));assert.equal((text.match(/首次待複習/g)||[]).length,12);assert.equal((text.match(/核對：/g)||[]).length,12);
 const js=fs.readFileSync('ignorance-challenge.js','utf8');assert.doesNotMatch(js,/innerHTML|localStorage|sessionStorage|fetch\(|XMLHttpRequest|sendBeacon/);assert.match(js,/visibilitychange/);assert.match(js,/blur/);assert.match(js,/text\/plain;charset=utf-8/);
 const html=fs.readFileSync('ignorance-challenge.html','utf8');for(const file of ['ignorance-cases.js','ignorance-engine.js','ignorance-challenge.js','ignorance-challenge.css','arcade-fx.js'])assert.ok(html.includes(file));assert.match(html,/disabled>確認判斷/);assert.match(html,/href="index.html"/);assert.match(fs.readFileSync('index.html','utf8'),/href="ignorance-challenge.html"/);
});
