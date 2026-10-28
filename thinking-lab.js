'use strict';
(() => {
 const $ = id => document.getElementById(id);
 const cases = THINKING_CASES;
 const labels = {fact:'事實／紀錄',guess:'推測／解釋',unknown:'尚未知曉'};
 const steps = ['分清楚','選線索','下結論','遇到新證據'];
 const storageKey='thinking-lab-progress-v1';
 const records = new Map();
 const notes = new Map();
 let active = -1, phase = 0, round, queue = null, remember=false, rememberNotes=false, hasSaved=false, storageError='';
 const el = (tag, text, cls) => {const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 function button(text, fn, cls) {const b=el('button',text,cls);b.type='button';b.addEventListener('click',fn);return b;}
 function shuffle(items) {const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
 function validRecord(r) {
  const checks=a=>Array.isArray(a)&&a.length===4&&a.every(v=>typeof v==='boolean');
  return r&&checks(r.first)&&checks(r.latest)&&Array.isArray(r.clues)&&r.clues.length===2&&new Set(r.clues).size===2&&r.clues.every(i=>Number.isInteger(i)&&i>=0&&i<4)&&typeof r.conclusion==='string'&&r.conclusion.length<=8000&&typeof r.update==='string'&&r.update.length<=8000;
 }
 function saveState() {
  if(!remember)return;
  try {localStorage.setItem(storageKey,JSON.stringify({version:1,records:Object.fromEntries(records),notesEnabled:rememberNotes,notes:rememberNotes?Object.fromEntries(notes):{}}));hasSaved=true;storageError='';}
  catch {storageError='這個瀏覽器無法儲存資料；仍可在本分頁遊玩或下載筆記。';}
  updateSaveControls();
 }
 function loadState() {
  try {
   const raw=localStorage.getItem(storageKey);hasSaved=raw!==null;if(!hasSaved)return;
   const saved=JSON.parse(raw);
   if(!saved||saved.version!==1||!saved.records||typeof saved.records!=='object'||Array.isArray(saved.records)||typeof saved.notesEnabled!=='boolean'||!saved.notes||typeof saved.notes!=='object'||Array.isArray(saved.notes))throw new Error('invalid save');
   remember=true;rememberNotes=saved.notesEnabled;let invalid=false;
   cases.forEach(c=>{const r=saved.records[c.id];if(r===undefined)return;if(validRecord(r))records.set(c.id,{first:[...r.first],latest:[...r.latest],clues:[...r.clues],conclusion:r.conclusion,update:r.update});else invalid=true;});
   if(rememberNotes)cases.forEach(c=>{const n=saved.notes[c.id];if(n===undefined)return;if(typeof n==='string'&&n.length<=8000)notes.set(c.id,n);else invalid=true;});
   if(invalid)storageError='部分先前紀錄格式不正確，已略過；其餘案件仍可照常練習。';
  } catch {storageError='讀取先前紀錄失敗；目前仍可照常遊玩或清除舊紀錄。';}
 }
 function updateSaveControls() {
  const status=$('save-status');
  status.textContent=storageError||(remember?'已開啟此瀏覽器的進度儲存。'+(rememberNotes?'自由文字筆記也會儲存。':'自由文字筆記不儲存。'):'目前只記在這個分頁，關閉或重新整理會清空本次未儲存的內容。'+(hasSaved?'先前儲存的紀錄仍保留，可用清除按鈕移除。':''));
  $('save-notes-label').hidden=!remember;$('clear-saved').hidden=!hasSaved;
  $('save-notes').checked=rememberNotes;
  $('remember-progress').setAttribute('aria-pressed',String(remember));$('session-only').setAttribute('aria-pressed',String(!remember));
 }
 function focusDesk() {const title=$('case-title');title?.focus();$('desk').scrollIntoView({block:'start',behavior:'instant'});}
 function renderMap() {
  $('case-map').replaceChildren(...cases.map((c,i)=>{
   const r=records.get(c.id), b=button('',()=>{queue=null;startCase(i);},'case-card');
   b.append(el('small',`${String(i+1).padStart(2,'0')} / ${c.area}`),el('span',c.icon,'icon'),el('b',c.title),el('span',r?(r.latest.every(Boolean)?'✓ 已練・可再挑戰':'↺ 已練・待釐清'):'○ 尚未辦案','state'));
   b.setAttribute('aria-current',String(i===active));return b;
  }));
  const pending=[...records.values()].filter(r=>!r.latest.every(Boolean)).length;
  $('completion').textContent=`${records.size} / ${cases.length} 案已練`;
  $('review').textContent=`重練待釐清案件（${pending}）`;$('review').disabled=pending===0;
  $('download').disabled=records.size===0&&notes.size===0;
  $('ending').hidden=records.size!==cases.length;
  if(records.size===cases.length){
   $('ending').replaceChildren(el('h2','12 案走完了，帶一個方法回生活裡。'),el('p',`目前有 ${pending} 案可再釐清。完成代表走過練習，不是通過智力或心理測驗。`),el('p','下次遇到一句很肯定的話，先問：這是觀察、解釋，還是仍缺證據？什麼資訊會讓我改變判斷？'));
  }
 }
 function startCase(i) {
  active=i;phase=0;
  round={choices:{},opened:[],answer:null,update:null,checked:false,checks:[],order:shuffle(cases[i].cards.map((_,n)=>n))};
  $('intro').hidden=true;$('desk').hidden=false;renderMap();renderPhase();focusDesk();
 }
 function noteField() {
  const wrap=el('div');const label=el('label','我的推理筆記（選填，不評分）','notes');label.htmlFor='my-note';
  const hint=el('p','用自己的話記：我憑什麼判斷？還缺什麼？什麼新證據會讓我改變看法？','small');hint.id='note-hint';
  const input=el('textarea');input.id='my-note';input.maxLength=8000;input.setAttribute('aria-describedby','note-hint');input.value=notes.get(cases[active].id)||'';
  input.addEventListener('input',()=>{notes.set(cases[active].id,input.value);$('download').disabled=false;saveState();});
  wrap.append(label,hint,input);return wrap;
 }
 function evidenceBox(c) {
  const box=el('div',undefined,'evidence');box.append(el('b','你目前查到的線索'));
  if(round.opened.length)round.opened.forEach(i=>box.append(el('p',`${c.clues[i][0]}：${c.clues[i][1]}`)));
  else box.append(el('p','尚未取得額外線索。'));
  return box;
 }
 function selectAnswer(container, items, stateKey) {
  const options=el('div',undefined,'answers');
  shuffle(items).forEach(item=>{
   const b=button(item.text,()=>{
    if(round.checked)return;round[stateKey]=item;
    [...options.children].forEach(n=>n.setAttribute('aria-pressed',String(n===b)));
    $('notice').textContent='';
   },'answer');b.setAttribute('aria-pressed','false');options.append(b);
  });container.append(options);
 }
 function renderPhase() {
  const c=cases[active], desk=$('desk');desk.replaceChildren();
  const top=el('div',undefined,'desk-top');const progress=el('progress');progress.max=4;progress.value=Math.min(phase,4);progress.setAttribute('aria-label',`本案已完成 ${Math.min(phase,4)} / 4 步`);
  top.append(el('span',`CASE ${String(active+1).padStart(2,'0')} / ${c.area}`),progress);
  const title=el('h2',c.title,'case-heading');title.id='case-title';title.tabIndex=-1;
  desk.append(top,title,el('p',c.brief,'brief'));
  const nav=el('ol',undefined,'steps');steps.forEach((s,i)=>{const li=el('li',`${i+1}. ${s}`,i===phase?'active':i<phase?'done':'');if(i===phase)li.setAttribute('aria-current','step');nav.append(li);});desk.append(nav);
  if(phase===4){renderCaseSummary(desk,c);return;}
  const panel=el('section',undefined,'phase');panel.id='phase-panel';
  if(phase===0){
   panel.append(el('h3','先別破案。這三張卡，各屬於哪一種？'),el('p','「事實／紀錄」只保證題目中可直接看到或記錄到的內容；解釋不一定錯，但需要支持。','small'));
   round.order.forEach(i=>{
    const card=el('div',undefined,'classify-card');card.append(el('p',c.cards[i][0]));const options=el('div',undefined,'options');options.setAttribute('role','group');options.setAttribute('aria-label',c.cards[i][0]);
    Object.entries(labels).forEach(([key,label])=>{
     const b=button(label,()=>{if(round.checked)return;round.choices[i]=key;[...options.children].forEach(n=>n.setAttribute('aria-pressed',String(n===b)));$('notice').textContent='';});
     b.setAttribute('aria-pressed','false');b.dataset.card=i;b.dataset.category=key;options.append(b);
    });card.append(options);panel.append(card);
   });
  } else if(phase===1){
   panel.append(el('h3','調查預算：只有兩次，先查什麼？'),el('p','每開一張卡用掉一次。挑能區分不同解釋、改變下一步的線索；查完兩張再整理。','small'));
   const remaining=el('p','剩餘調查：2 / 2','tag');remaining.id='budget';panel.append(remaining);
   const grid=el('div',undefined,'clue-grid');
   shuffle(c.clues.map((_,i)=>i)).forEach(i=>{
    const b=button(c.clues[i][0],()=>{
     if(round.checked||round.opened.includes(i)||round.opened.length===2)return;
     round.opened.push(i);b.classList.add('opened');b.append(el('span',c.clues[i][1]));b.disabled=true;
     remaining.textContent=`剩餘調查：${2-round.opened.length} / 2`;$('notice').textContent='';
     if(round.opened.length===2)[...grid.children].forEach(n=>n.disabled=true);
    },'clue');b.dataset.clue=i;grid.append(b);
   });panel.append(grid);
  } else if(phase===2){
   panel.append(el('h3','依「你查到的資訊」，目前能說到哪裡？'),evidenceBox(c));
   const known=c.required.every(i=>round.opened.includes(i));
   selectAnswer(panel,[{id:'lead',text:c.lead,correct:known,why:known?c.reason:'這句可能符合案件全貌，但你還沒取得關鍵線索。不能把沒查到的事寫成已確認。'},{id:'cautious',text:'目前資訊不足以支持具體原因；先補查與決定有關的關鍵證據。',correct:!known,why:!known?'你沒有把尚未查到的內容補成事實；接著仍須取得能解決缺口的資料。':'你已拿到支持有限結論的關鍵線索，不必把所有資訊都當作完全未知。'},{id:'trap',text:c.trap,correct:false,why:'這個斷言超出了目前證據支持的範圍。'}],'answer');
  } else {
   panel.append(el('h3','新證據到了。要改變什麼，又要保留什麼？'));
   if(round.answer)panel.append(el('p',`上一輪你選：${round.answer.text}`,'small'));
   panel.append(el('div',c.twist,'evidence'));
   selectAnswer(panel,c.update.map(([text,correct,why],i)=>({id:String(i),text,correct,why})),'update');
  }
  const notice=el('p','','notice');notice.id='notice';notice.setAttribute('role','status');panel.append(notice);
  const feedback=el('div');feedback.id='feedback';feedback.hidden=true;feedback.setAttribute('role','status');panel.append(feedback);
  const actions=el('div',undefined,'actions');
  actions.append(button('核對這一步',checkPhase,'primary'),button('給我一個方向',()=>{
   const hints=['先問：眼前紀錄真的能直接證明這句話嗎？動機和原因通常需要額外證據。','想像兩個不同原因：查哪張卡，結果不同時會讓你採取不同動作？','只用已翻開的卡下結論。既不要多說，也不要把已知資訊全部丟掉。','新資料是否改變原因、範圍或驗收狀態？證據足夠時可以確認。'];notice.textContent=hints[phase];
  }));panel.append(actions);desk.append(panel,noteField());
 }
 function checkPhase() {
  if(round.checked)return;
  const c=cases[active],feedback=$('feedback'),notice=$('notice');let ok,lines;
  if(phase===0){
   if(Object.keys(round.choices).length!==c.cards.length){notice.textContent='先替每張卡選一個分類，再核對。';return;}
   ok=c.cards.every((v,i)=>round.choices[i]===v[1]);
   lines=c.cards.map((v,i)=>`${round.choices[i]===v[1]?'✓':'↺'} ${v[0]} → ${labels[v[1]]}。${v[2]}`);
  } else if(phase===1){
   if(round.opened.length<2){notice.textContent='還有調查機會，先翻開兩張不同線索。';return;}
   ok=c.required.every(i=>round.opened.includes(i));
   lines=round.opened.map(i=>`${c.clues[i][2]?'✓ 有關':'↺ 關聯弱'}：${c.clues[i][0]}。${c.clues[i][1]}`);
   lines.push(ok?'已找到支撐下一步的關鍵資料。':'這次還缺關鍵資料。下一步可以選擇保留結論，不必為了破案硬猜。');
   // Only disclose unselected evidence after the player commits to a conclusion.
  } else {
   const item=phase===2?round.answer:round.update;
   if(!item){notice.textContent='先選一個目前的判斷，再看回饋。';return;}
   ok=item.correct;lines=[item.why];
   if(phase===2){
    const missing=c.required.filter(i=>!round.opened.includes(i));
    missing.forEach(i=>lines.push(`補查示範（不計入你先前已查證的內容）：${c.clues[i][0]} → ${c.clues[i][1]}`));
    lines.push(`可支持的有限結論：${c.lead}`);
   }
  }
  round.checked=true;round.checks.push(ok);notice.textContent='';
  feedback.hidden=false;feedback.className=`feedback${ok?'':' review'}`;
  feedback.append(el('h4',ok?'✓ 這一步有根據':'↺ 這裡值得再想一次'),...lines.map(s=>el('p',s)));
  $('phase-panel').querySelectorAll('button').forEach(b=>b.disabled=true);
  const next=button(phase===3?'整理本案 →':'下一步 →',()=>{phase++;round.checked=false;renderPhase();focusDesk();},'primary');
  feedback.append(next);next.focus();
 }
 function renderCaseSummary(desk,c) {
  const prior=records.get(c.id);
  records.set(c.id,{first:prior?prior.first:[...round.checks],latest:[...round.checks],clues:[...round.opened],conclusion:round.answer.text,update:round.update.text});
  saveState();
  renderMap();
  const panel=el('div',undefined,'panel');panel.append(el('h3','本案已練完。帶走的是方法，不是標籤。'));
  const list=el('ul',undefined,'summary-list');round.checks.forEach((ok,i)=>list.append(el('li',`${ok?'✓ 已對齊':'↺ 可再釐清'}：${steps[i]}`)));panel.append(list,el('p',c.reason));
  const actions=el('div',undefined,'actions');
  actions.append(button(queue&&queue.length===0?'完成這輪重練 →':records.size===cases.length?'查看本次總結 →':'下一案 →',nextCase,'primary'),button('重練本案',()=>startCase(active)),button('返回案件地圖',()=>{$('map-section').scrollIntoView({block:'start',behavior:'instant'});$('case-map').querySelectorAll('button')[active].focus();}));
  panel.append(actions);desk.append(panel,noteField());
 }
 function nextCase() {
  if(queue){const next=queue.shift();if(next!==undefined){startCase(next);return;}queue=null;$('map-section').scrollIntoView({block:'start',behavior:'instant'});$('case-map').querySelectorAll('button')[active].focus();return;}
  const next=cases.findIndex((c,i)=>i>active&&!records.has(c.id));
  const fallback=cases.findIndex(c=>!records.has(c.id));
  if(next>=0||fallback>=0){startCase(next>=0?next:fallback);return;}
  $('ending').hidden=false;$('ending').scrollIntoView({block:'start',behavior:'instant'});$('ending').tabIndex=-1;$('ending').focus();
 }
 $('start').addEventListener('click',()=>{queue=null;startCase(0);});
 $('random').addEventListener('click',()=>{queue=null;startCase(Math.floor(Math.random()*cases.length));});
 $('review').addEventListener('click',()=>{queue=cases.map((c,i)=>records.has(c.id)&&!records.get(c.id).latest.every(Boolean)?i:-1).filter(i=>i>=0);const next=queue.shift();if(next!==undefined)startCase(next);});
 $('tools').addEventListener('click',()=>{const open=$('toolbox').hidden;$('toolbox').hidden=!open;$('tools').setAttribute('aria-expanded',String(open));if(open)$('toolbox').scrollIntoView({block:'start',behavior:'instant'});});
 $('session-only').addEventListener('click',()=>{remember=false;rememberNotes=false;storageError='';updateSaveControls();});
 $('remember-progress').addEventListener('click',()=>{if(remember)return;remember=true;rememberNotes=false;saveState();});
 $('save-notes').addEventListener('change',e=>{rememberNotes=e.target.checked;saveState();});
 $('clear-saved').addEventListener('click',()=>{
  if(!window.confirm('要清除這個瀏覽器儲存的所有案件進度與筆記嗎？此操作無法復原。'))return;
  try {localStorage.removeItem(storageKey);}catch {storageError='清除失敗；此瀏覽器的舊紀錄可能仍保留，請檢查網站儲存權限。';updateSaveControls();return;}
  records.clear();notes.clear();remember=false;rememberNotes=false;hasSaved=false;storageError='';queue=null;active=-1;round=null;
  $('desk').replaceChildren();$('desk').hidden=true;$('intro').hidden=false;updateSaveControls();renderMap();$('session-only').focus();
 });
 $('download').addEventListener('click',()=>{
  const out=['思考偵探社｜本次辦案筆記','虛構情境練習；不代表智力、心理或人格評分。','紀錄為本分頁內的選擇；自由文字沒有自動評分。',''];
  cases.forEach(c=>{const r=records.get(c.id),note=notes.get(c.id);if(!r&&!note)return;
   out.push(`【${c.title}】`,r?'狀態：已完成四步練習':'狀態：尚未完成四步練習');
   if(r){out.push(`初次核對：${r.first.map((v,i)=>`${steps[i]} ${v?'對齊':'待釐清'}`).join('；')}`,`最近調查：${r.clues.map(i=>c.clues[i][0]).join('、')}`,`當時結論：${r.conclusion}`,`新證據後：${r.update}`);}
   out.push('我的推理筆記：',note||'（尚未寫）','');
  });
  const url=URL.createObjectURL(new Blob(['\uFEFF'+out.join('\n')],{type:'text/plain;charset=utf-8'}));const link=el('a');link.href=url;link.download='思考偵探社-辦案筆記.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
 loadState();updateSaveControls();renderMap();
})();
