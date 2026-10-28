const {test}=require('node:test');
const assert=require('node:assert/strict');
const cases=require('../thinking-cases.js');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../thinking-lab.js'),'utf8');
// Minimal event-driven DOM: exercises the shipped state machine without a browser dependency.
class Node {
 constructor(tag='div'){this.tagName=tag;this.children=[];this.listeners={};this.attrs={};this.dataset={};this.disabled=false;this.hidden=false;this.value='';this.textContent='';this.className='';this.classList={add:n=>this.className+=' '+n};}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this.children=[...nodes];}
 setAttribute(k,v){this.attrs[k]=v;}
 addEventListener(k,f){this.listeners[k]=f;}
 focus(){} scrollIntoView(){} remove(){}
 click(){if(!this.disabled)this.listeners.click?.();}
 querySelectorAll(selector){const found=[];const visit=n=>{if(selector==='button'&&n.tagName==='button')found.push(n);n.children.forEach(visit);};this.children.forEach(visit);return found;}
}
function boot({stored=new Map(),failRead=false,failWrite=false,failRemove=false,confirm=true}={}){
 const ids=Object.fromEntries(['desk','intro','case-map','completion','review','download','ending','map-section','start','random','tools','toolbox','save-status','save-notes-label','save-notes','clear-saved','remember-progress','session-only'].map(id=>[id,new Node()]));
 const walk=(root,id)=>{if(root.id===id)return root;for(const n of root.children){const hit=walk(n,id);if(hit)return hit;}};
 const document={createElement:tag=>new Node(tag),getElementById:id=>ids[id]||Object.values(ids).map(n=>walk(n,id)).find(Boolean),body:new Node('body')};
 const downloads=[],writes=[];
 const localStorage={getItem:k=>{if(failRead)throw Error('blocked');return stored.get(k)??null;},setItem:(k,v)=>{if(failWrite)throw Error('quota');stored.set(k,v);writes.push(v);},removeItem:k=>{if(failRemove)throw Error('blocked');stored.delete(k);}};
 vm.runInNewContext(source,{THINKING_CASES:cases,document,localStorage,window:{confirm:()=>confirm},Map,Math,Blob,URL:{createObjectURL:b=>{downloads.push(b);return 'blob:test';},revokeObjectURL(){}},setTimeout:f=>f()});
 const find=(txt,root=ids.desk)=>root.querySelectorAll('button').find(b=>b.textContent===txt);
 const check=()=>find('核對這一步').click();
 const next=()=>{const b=find('下一步 →')||find('整理本案 →');assert.ok(b,'advance button is present');b.click();};
 return {ids,document,find,check,next,downloads,stored,writes};
}
function classify(app,c,wrong=false){for(const b of app.ids.desk.querySelectorAll('button'))if(b.dataset.card!==undefined&&b.dataset.category===(wrong?'guess':c.cards[Number(b.dataset.card)][1]))b.click();app.check();app.next();}
function investigate(app,indices){for(const i of indices)app.ids.desk.querySelectorAll('button').find(b=>b.dataset.clue===i).click();app.check();app.next();}
function finish(app,c,conclusion){app.find(conclusion).click();app.check();app.next();app.find(c.update.find(x=>x[1])[0]).click();app.check();app.next();}
test('12 original cases, 4 balanced areas, and unambiguous authored answer sets',()=>{
 assert.equal(cases.length,12);assert.equal(new Set(cases.map(c=>c.id)).size,12);
 const areas=new Map();
 for(const c of cases){areas.set(c.area,(areas.get(c.area)||0)+1);assert.deepEqual(new Set(c.cards.map(v=>v[1])),new Set(['fact','guess','unknown']));assert.equal(c.clues.length,4);assert.equal(c.clues.filter(v=>v[2]).length,2);assert.ok(c.required.length>0&&c.required.length<=2);assert.ok(c.required.every(i=>c.clues[i][2]));assert.equal(c.update.filter(v=>v[1]).length,1);assert.equal(new Set(c.update.map(v=>v[0])).size,3);for(const item of c.cards)assert.ok(item[2]);for(const item of c.update)assert.ok(item[2]);}
 assert.deepEqual([...areas.values()],[3,3,3,3]);
});
test('every case completes through the shipped UI with sufficient evidence',()=>{
 const app=boot();
 for(let i=0;i<cases.length;i++){
  const c=cases[i];app.ids['case-map'].children[i].click();classify(app,c);investigate(app,c.clues.map((v,i)=>v[2]?i:-1).filter(i=>i>=0));finish(app,c,c.lead);
  assert.match(app.ids['case-map'].children[i].children.at(-1).textContent,/已練・可再挑戰/);
 }
 assert.equal(app.ids.completion.textContent,'12 / 12 案已練');assert.equal(app.ids.ending.hidden,false);assert.equal(app.ids.review.disabled,true);
});
test('without key evidence, uncertainty is appropriate; a case enters review and can be resolved',()=>{
 const app=boot(),c=cases[0];app.ids.start.click();classify(app,c,true);investigate(app,[2,3]);finish(app,c,'目前資訊不足以支持具體原因；先補查與決定有關的關鍵證據。');
 assert.match(app.ids['case-map'].children[0].children.at(-1).textContent,/待釐清/);assert.equal(app.ids.review.disabled,false);
 app.ids.review.click();classify(app,c);investigate(app,[0,1]);finish(app,c,c.lead);
 assert.equal(app.ids.review.disabled,true);assert.match(app.ids['case-map'].children[0].children.at(-1).textContent,/可再挑戰/);assert.equal(app.ids.completion.textContent,'1 / 12 案已練');
 app.find('完成這輪重練 →').click();assert.equal(app.ids.completion.textContent,'1 / 12 案已練');
});
test('empty submissions cannot skip phases; investigation is capped at two distinct clues',()=>{
 const app=boot(),c=cases[0];app.ids.start.click();app.check();assert.match(app.document.getElementById('notice').textContent,/每張卡/);assert.equal(app.find('下一步 →'),undefined);
 classify(app,c);app.check();assert.match(app.document.getElementById('notice').textContent,/兩張/);
 const clues=app.ids.desk.querySelectorAll('button').filter(b=>b.dataset.clue!==undefined);clues[0].click();clues[0].click();clues[1].click();clues[2].click();
 assert.equal(app.document.getElementById('budget').textContent,'剩餘調查：0 / 2');assert.equal(clues.filter(b=>b.className.includes('opened')).length,2);
 app.check();app.next();app.check();assert.match(app.document.getElementById('notice').textContent,/先選一個/);assert.equal(app.find('下一步 →'),undefined);
});
test('unsupported specificity is not rewarded, nor is blanket uncertainty after sufficient evidence',()=>{
 for(const [indices,answer] of [[[2,3],cases[0].lead],[[0,1],'目前資訊不足以支持具體原因；先補查與決定有關的關鍵證據。']]){
  const app=boot();app.ids.start.click();classify(app,cases[0]);investigate(app,indices);app.find(answer).click();app.check();assert.ok(app.document.getElementById('feedback').className.includes('review'));
 }
});
test('notes export as text, keep first-attempt outcomes, and cannot execute as markup',async()=>{
 const app=boot(),c=cases[0];app.ids.start.click();const input=app.document.getElementById('my-note');input.value='<img src=x onerror=alert(1)> 我自己的推理';input.listeners.input();
 classify(app,c,true);investigate(app,[0,1]);finish(app,c,c.lead);
 app.ids.review.click();classify(app,c);investigate(app,[0,1]);finish(app,c,c.lead);
 app.ids.download.click();const text=await app.downloads[0].text();assert.match(text,/<img src=x onerror=alert\(1\)>/);assert.match(text,/初次核對：分清楚 待釐清/);assert.match(text,/狀態：已完成四步練習/);
 assert.ok(!source.includes('innerHTML'));assert.ok(!/sessionStorage|fetch\(|XMLHttpRequest|sendBeacon/.test(source));assert.equal(app.writes.length,0);
});

const key='thinking-lab-progress-v1';
function complete(app){const c=cases[0];app.ids.start.click();classify(app,c);investigate(app,[0,1]);finish(app,c,c.lead);}
function note(app,text){const n=app.document.getElementById('my-note');n.value=text;n.listeners.input();}
function notesOn(app,on){app.ids['save-notes'].checked=on;app.ids['save-notes'].listeners.change({target:app.ids['save-notes']});}
test('預設不寫入；選擇儲存後重載可還原進度，但不存自由文字',()=>{
 const app=boot();complete(app);note(app,'私人筆記');assert.equal(app.stored.size,0);assert.equal(boot({stored:app.stored}).ids.completion.textContent,'0 / 12 案已練');
 app.ids['remember-progress'].click();assert.equal(JSON.parse(app.stored.get(key)).notesEnabled,false);assert.deepEqual(JSON.parse(app.stored.get(key)).notes,{});
 const loaded=boot({stored:app.stored});assert.equal(loaded.ids.completion.textContent,'1 / 12 案已練');loaded.ids.start.click();assert.equal(loaded.document.getElementById('my-note').value,'');
});
test('筆記另行同意；取消筆記儲存會移除持久副本但保留本分頁文字',()=>{
 const app=boot();app.ids['remember-progress'].click();complete(app);note(app,'<script>文字而已</script>');notesOn(app,true);app.ids['remember-progress'].click();assert.equal(JSON.parse(app.stored.get(key)).notesEnabled,true);
 const loaded=boot({stored:app.stored});loaded.ids.start.click();assert.equal(loaded.document.getElementById('my-note').value,'<script>文字而已</script>');
 notesOn(app,false);assert.deepEqual(JSON.parse(app.stored.get(key)).notes,{});assert.equal(app.document.getElementById('my-note').value,'<script>文字而已</script>');
});
test('再次開啟儲存不讀回舊內容覆蓋當前進度與筆記；分頁模式停止寫入',()=>{
 const app=boot();app.ids['remember-progress'].click();complete(app);note(app,'舊筆記');notesOn(app,true);app.ids['session-only'].click();const saved=app.stored.get(key);
 note(app,'新筆記');assert.equal(app.stored.get(key),saved);assert.equal(app.ids['clear-saved'].hidden,false);
 app.ids['remember-progress'].click();notesOn(app,true);assert.equal(JSON.parse(app.stored.get(key)).notes[cases[0].id],'新筆記');
});
test('清除需確認；成功同時重設畫面，取消及儲存權限錯誤保留紀錄',()=>{
 const app=boot();app.ids['remember-progress'].click();complete(app);note(app,'筆記');notesOn(app,true);const cancel=boot({stored:app.stored,confirm:false});
 cancel.ids['clear-saved'].click();assert.equal(cancel.ids.completion.textContent,'1 / 12 案已練');assert.equal(app.stored.has(key),true);
 const blocked=boot({stored:app.stored,failRemove:true});blocked.ids['clear-saved'].click();assert.match(blocked.ids['save-status'].textContent,/清除失敗/);assert.equal(blocked.ids.completion.textContent,'1 / 12 案已練');
 app.ids['clear-saved'].click();assert.equal(app.stored.has(key),false);assert.equal(app.ids.completion.textContent,'0 / 12 案已練');assert.equal(app.ids.desk.hidden,true);assert.equal(app.ids.intro.hidden,false);assert.equal(app.ids.download.disabled,true);
});
test('瀏覽器無法讀寫時仍可完成案件，不誤報儲存成功',()=>{
 const app=boot({failRead:true,failWrite:true});assert.match(app.ids['save-status'].textContent,/讀取.*失敗/);complete(app);app.ids['remember-progress'].click();assert.match(app.ids['save-status'].textContent,/無法儲存/);assert.equal(app.ids.completion.textContent,'1 / 12 案已練');
});
test('損壞及非預期儲存格式不會使地圖、複習或匯出當掉',()=>{
 for(const raw of ['{','null','[]',JSON.stringify({version:1,records:[],notesEnabled:true,notes:{}})]){const app=boot({stored:new Map([[key,raw]])});assert.match(app.ids['save-status'].textContent,/讀取.*失敗/);complete(app);}
 const valid={first:[false,true,true,true],latest:[true,true,true,true],clues:[0,1],conclusion:'已知線索',update:'新證據'};
 const records={[cases[0].id]:valid,[cases[1].id]:{...valid,clues:[7,7]},[cases[2].id]:{...valid,latest:[1,1,1,1]}};
 const app=boot({stored:new Map([[key,JSON.stringify({version:1,records,notesEnabled:true,notes:{[cases[0].id]:{},[cases[1].id]:'可還原的筆記'}})]])});
 assert.equal(app.ids.completion.textContent,'1 / 12 案已練');assert.match(app.ids['save-status'].textContent,/格式不正確/);app.ids.download.click();
});
