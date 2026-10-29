(() => {
'use strict';
const E=Ignorance,$=id=>document.getElementById(id);let s=null,mode='quick',lastFocus=null;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function score(){const r=E.summary(s);$('score').textContent=`首次答對 ${r.first} / ${r.total} 步`;$('progress').max=r.total;$('progress').value=r.completed;}
function start(value){mode=value;s=E.create(mode);$('intro').hidden=true;$('result').hidden=true;$('play').hidden=false;$('pause-cover').hidden=true;render();$('play').scrollIntoView({block:'start',behavior:'instant'});}
function menu(){s=null;$('intro').hidden=false;$('play').hidden=true;$('result').hidden=true;$('pause-cover').hidden=true;$('quick').focus();}
function evidence(){
 $('evidence').hidden=s.opened===null;
 if(s.opened!==null){const card=s.items[s.index].cards[s.opened];$('evidence-title').textContent='已翻開：'+card.title;$('evidence-text').textContent=card.text;}
}
function render(){
 const c=s.items[s.index],q=E.question(s);
 $('round').textContent=`第 ${s.index+1} / ${s.items.length} 案 · ${E.stages[s.stage]}`;$('area').textContent=E.areas[c.area];$('case-title').textContent=c.title;$('scene').textContent=c.scene;$('claim').textContent=c.claim;$('prompt').textContent=q.prompt;score();evidence();
 document.querySelectorAll('.track li').forEach((li,i)=>{if(i===s.stage)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});
 $('options').replaceChildren();E.shuffle([0,1,2]).forEach((value,index)=>{
  const b=el('button');b.type='button';b.dataset.choice=value;b.setAttribute('aria-pressed','false');b.append(el('small',String(index+1)),el('span',q.options[value]));
  b.addEventListener('click',()=>{if(!E.select(s,value))return;$('options').querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));$('confirm').disabled=false;});$('options').append(b);
 });
 $('confirm').disabled=true;$('confirm').textContent=s.stage===1?'確認並翻開這張 →':'確認判斷 →';$('unsure').hidden=false;$('feedback').hidden=true;$('feedback').replaceChildren();$('retry').hidden=true;$('next').hidden=true;$('case-title').focus();
}
function answer(value){
 if(!s)return;const q=E.question(s),r=E.submit(s,value);if(!r)return;
 $('options').querySelectorAll('button').forEach(b=>{b.disabled=true;const n=Number(b.dataset.choice);if(n===q.answer)b.classList.add('correct');if(n===value&&!r.latest)b.classList.add('wrong');});
 $('confirm').disabled=true;$('unsure').hidden=true;const f=$('feedback');f.hidden=false;f.className='feedback'+(r.latest?'':' review');f.replaceChildren(el('strong',r.latest?'✓ 這一步有根據。':'↺ 這一步留待複習。'),el('p','核對：'+q.options[q.answer]),el('p',q.why));
 if(r.tries>1)f.append(el('p','重試已更新，首次結果保留不變。','small'));
 if(s.stage===1){evidence();if(value==='unsure')f.append(el('p','先看解析會翻開關鍵卡，首次挑查證仍記為待複習。','small'));else if(!r.latest)f.append(el('p','上面只翻開你選的卡。可以重新挑查證，或帶著這份資料往下判斷。','small'));}
 $('retry').hidden=r.latest;$('next').hidden=false;$('next').textContent=s.stage===2?(s.index===s.items.length-1?'看整輪紀錄 →':'下一案 →'):'下一步 →';score();
}
function finish(){
 $('play').hidden=true;$('result').hidden=false;const r=E.summary(s);$('summary').textContent=`完成 ${s.items.length} 案、${r.total} 步。首次答對 ${r.first} 步；重試後答對 ${r.latest} 步。`;$('review').replaceChildren();
 s.items.forEach((c,i)=>{const d=el('details'),rows=s.results.slice(i*3,i*3+3);d.append(el('summary',`${rows.every(r=>r.first)?'✓':'○'} ${c.title} · 首次 ${rows.filter(r=>r.first).length} / 3`),el('p','原話：'+c.claim));rows.forEach((r,j)=>d.append(el('p',`${E.stages[j]}｜首次${r.first?'答對':'待複習'}，最近選擇：${r.chosen}`),el('p','核對：'+r.answer),el('p',r.why)));$('review').append(d);});$('result-title').focus();
}
function pause(value){
 if(!s||!E.pause(s,value))return;
 if(value){lastFocus=document.activeElement;$('pause-cover').hidden=false;$('play').inert=true;$('resume').focus();}
 else{$('pause-cover').hidden=true;$('play').inert=false;if(lastFocus?.isConnected&&!lastFocus.disabled)lastFocus.focus();else $('case-title').focus();}
}
$('quick').addEventListener('click',()=>{ $('play').inert=false;start('quick'); });$('full').addEventListener('click',()=>{ $('play').inert=false;start('full'); });
$('confirm').addEventListener('click',()=>answer(s?.selected));$('unsure').addEventListener('click',()=>answer('unsure'));
$('retry').addEventListener('click',()=>{if(s&&E.retry(s))render();});$('next').addEventListener('click',()=>{if(s&&E.next(s)){if(s.done)finish();else render();}});
for(const id of ['leave','menu','pause-menu'])$(id).addEventListener('click',()=>{ $('play').inert=false;menu(); });
$('again').addEventListener('click',()=>start(mode));$('pause').addEventListener('click',()=>pause(true));$('resume').addEventListener('click',()=>pause(false));
$('download').addEventListener('click',()=>{if(!s?.done)return;const blob=new Blob([E.exportText(s)],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='無知大挑戰-本輪紀錄.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
window.addEventListener('keydown',e=>{
 if(!s||s.done||e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();
 if(k==='p'||k==='escape'){e.preventDefault();pause(!s.paused);return;}
 if(s.paused){if(e.key==='Tab'){const buttons=$('pause-cover').querySelectorAll('button'),first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}return;}
 if(!s.locked&&/^[1-3]$/.test(k)){e.preventDefault();const b=$('options').querySelectorAll('button')[Number(k)-1];b.click();b.focus();}
 if(!s.locked&&k==='enter'&&s.selected!==null){e.preventDefault();answer(s.selected);}
});
window.addEventListener('blur',()=>pause(true));document.addEventListener('visibilitychange',()=>{if(document.hidden)pause(true);});
window.IgnoranceRun={snapshot:()=>s?{mode:s.mode,index:s.index,stage:s.stage,caseId:s.items[s.index].id,opened:s.opened,selected:s.selected,locked:s.locked,paused:s.paused,done:s.done,summary:E.summary(s),results:s.results.map(r=>({...r}))}:null};
})();
