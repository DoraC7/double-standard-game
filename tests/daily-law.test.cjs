const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');const E=require('../daily-law-engine.js');
test('180 sourced Taiwan daily-law cases span twelve balanced units',()=>{assert.equal(E.questions.length,180);assert.equal(Object.keys(E.topics).length,12);assert.equal(new Set(E.questions.map(q=>q.id)).size,180);for(const q of E.questions){assert.ok(q.title&&q.display&&q.prompt&&q.why);assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert.ok(q.answer>=0&&q.answer<3);assert.ok(E.sources[q.source][1].startsWith('https://law.moj.gov.tw/'));}for(const topic of Object.keys(E.topics))assert.equal(E.questions.filter(q=>q.topic===topic).length,15);});
test('short round balances each unit; every mode completes and preserves first outcomes across retries',()=>{for(let n=0;n<50;n++){const s=E.create('short');assert.equal(s.items.length,24);for(const t of Object.keys(E.topics))assert.equal(s.items.filter(q=>q.topic===t).length,2);}for(const mode of ['short','all',...Object.keys(E.topics)]){const s=E.create(mode,'all');for(const q of s.items){assert.equal(E.next(s),false);assert.equal(E.submit(s,null),null);assert.ok(E.select(s,(q.answer+1)%3));assert.equal(E.submit(s).first,false);assert.equal(E.submit(s,q.answer),null);assert.ok(E.retry(s));assert.equal(s.selected,null);assert.ok(E.select(s,q.answer));const r=E.submit(s);assert.equal(r.first,false);assert.equal(r.latest,true);assert.equal(r.tries,2);assert.equal(E.retry(s),false);assert.ok(E.next(s));}assert.equal(s.done,true);assert.equal(s.results.length,s.items.length);assert.equal(E.select(s,0),false);assert.equal(E.submit(s,0),null);}assert.throws(()=>E.create('constructor'));assert.equal(E.create().results.length,0);});
test('unsure records a real first attempt; a correct first attempt remains locked',()=>{let s=E.create();assert.equal(E.submit(s,'unsure').first,false);assert.equal(E.submit(s,0),null);assert.ok(E.retry(s));assert.equal(E.submit(s,s.items[0].answer).first,false);s=E.create();const r=E.submit(s,s.items[0].answer);assert.equal(r.first,true);assert.equal(E.select(s,2),false);assert.equal(E.retry(s),false);});
test('sensitive boundaries are explicit rather than categorical legal outcomes',()=>{const q=id=>E.questions.find(q=>q.id===id);assert.match(q('property-1').why,/各自所有/);assert.match(q('property-2').why,/繼承.*慰撫金/);assert.match(q('property-4').why,/三個月.*法院/);assert.match(q('injury-2').why,/不是所有/);assert.match(q('injury-3').why,/知悉犯人.*六個月/);assert.match(q('injury-4').why,/不得再行告訴/);assert.match(q('accident-1').why,/資料不足/);assert.match(q('consumer-2').why,/不是所有/);assert.match(q('copyright-2').why,/不是單看營利/);assert.match(q('privacy-4').why,/法定條件/);});
test('local static delivery integrates privacy, accessible confirmation and reduced motion',()=>{const html=fs.readFileSync('daily-law.html','utf8'),js=fs.readFileSync('daily-law.js','utf8'),css=fs.readFileSync('daily-law.css','utf8');assert.match(html,/抽 10 題/);assert.match(html,/180 題/);assert.match(html,/各 15 題/);assert.ok(html.indexOf('daily-law-bank.js')<html.indexOf('daily-law-engine.js'));assert.match(html,/round-size/);assert.match(html,/不是個案法律意見/);assert.match(html,/href="index.html"/);assert.match(js,/aria-expanded/);assert.match(js,/b.disabled=true/);assert.match(js,/state.selected/);assert.match(css,/prefers-reduced-motion/);assert.doesNotMatch(js,/localStorage|sessionStorage|fetch\(|XMLHttpRequest|eval\(/);assert.match(fs.readFileSync('index.html','utf8'),/href="daily-law.html"/);});


test('醫療與健康消費保留適用條件、病歷費用及申訴與退費區別',()=>{
 const q=id=>E.questions.find(q=>q.id===id);
 assert.match(q('medical-1').why,/緊急.*例外/);assert.match(q('medical-2').why,/主管機關規定/);assert.match(q('medical-3').why,/費用由病人負擔/);assert.match(q('medical-4').why,/自費不等於任意收費/);assert.match(q('medical-7').why,/同意書也不是.*免責/);assert.match(q('healthconsumer-1').why,/禁止.*醫療效能/);assert.match(q('healthconsumer-4').why,/不是所有契約都固定三十天/);assert.match(q('healthconsumer-6').why,/十五日內妥適處理/);assert.match(q('healthconsumer-7').why,/不是.*醫療療程/);assert.match(q('healthconsumer-8').why,/不同制度/);
 for(const topic of ['medical','healthconsumer']){const state=E.create(topic,'all');assert.equal(state.items.length,15);for(const item of state.items){E.submit(state,'unsure');E.retry(state);E.select(state,item.answer);const r=E.submit(state);assert.equal(r.first,false);assert.equal(r.latest,true);E.next(state);}assert.equal(state.done,true);}
});

test('random ten stays in selected pool with no same-round repetition and no guaranteed cross-round exclusion',()=>{
 let seed=12345;const rng=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 const seen=new Set();
 for(const scope of ['random',...Object.keys(E.topics)])for(let n=0;n<60;n++){
  const s=E.create(scope,10,rng);assert.equal(s.items.length,10);assert.equal(new Set(s.items.map(q=>q.id)).size,10);
  for(const q of s.items){assert.ok(E.questions.includes(q));if(scope!=='random')assert.equal(q.topic,scope);seen.add(q.id);}
 }
 assert.equal(seen.size,180);
 const r1=E.create('consumer',10,()=>0.5),r2=E.create('consumer',10,()=>0.5);assert.deepEqual(r1.items,r2.items);
 for(const scope of ['random',...Object.keys(E.topics)])assert.equal(E.create(scope,'all').items.length,scope==='random'?180:15);
 assert.throws(()=>E.create('random',0));assert.throws(()=>E.create('random',11));assert.throws(()=>E.create('__proto__'));
});
test('expanded cases introduce distinct concepts and avoid uncommenced amendment dependencies',()=>{
 const B=require('../daily-law-bank.js');assert.equal(B.questions.length,124);
 for(const t of Object.keys(E.topics)){const additions=B.questions.filter(q=>q.topic===t);assert.equal(new Set(additions.map(q=>q.concept)).size,additions.length);}
 const links=B.questions.map(q=>B.sources[q.source][1]);assert.ok(!links.some(url=>/pcode=B0000001&flno=1223$/.test(url)));assert.ok(!links.some(url=>/pcode=I0050021&flno=(12|27)$/.test(url)));
 const q=id=>E.questions.find(q=>q.id===id);
 assert.match(q('property-11').why,/十六|1186/);assert.match(q('medical-13').why,/未成年|70/);assert.match(q('injury-13').why,/告發.*告訴權/);assert.match(q('healthconsumer-15').why,/不保證/);
});
