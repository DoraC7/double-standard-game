(() => {
'use strict';
const E=AllergySchool,$=id=>document.getElementById(id);
let state=null,selected=null,rehearsal=false,locked=false;
function el(tag,text){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;}
function link(key){const a=el('a',E.sources[key][0]+' ↗');a.href=E.sources[key][1];a.target='_blank';a.rel='noopener';return a;}
function intro(){state=null;$('intro').hidden=false;$('lesson').hidden=true;$('result').hidden=true;$('start').focus();}
function start(){state=E.create($('mode').value);$('intro').hidden=true;$('result').hidden=true;$('lesson').hidden=false;render();}
function render(){
 if(state.index===state.items.length){finish();return;}
 const q=state.items[state.index];selected=null;rehearsal=false;locked=false;
 $('round').textContent=`第 ${state.index+1} / ${state.items.length} 題`;$('score').textContent=`首次答對 ${state.answers.filter(a=>a.ok).length} 題`;$('progress').max=state.items.length;$('progress').value=state.answers.length;
 $('topic').textContent=E.topics[q.topic];$('symbol').textContent={skin:'🧴',home:'🛏️',help:'☎️'}[q.topic];$('title').textContent=q.title;$('prompt').textContent=q.prompt;
 $('options').replaceChildren();for(const i of E.shuffled(q.options.map((_,i)=>i))){const b=el('button',q.options[i]);b.type='button';b.dataset.choice=i;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{if(locked)return;selected=i;$('options').querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));$('selection').textContent='已選：'+q.options[i];$('confirm').disabled=false;});$('options').append(b);}
 $('selection').textContent='尚未選擇';$('confirm').disabled=true;$('confirm').hidden=false;$('unsure').hidden=false;$('feedback').hidden=true;$('feedback').replaceChildren();$('next').hidden=true;$('retry').hidden=true;$('title').focus();
}
function answer(unsure=false){
 if(locked||(!unsure&&selected===null))return;const q=state.items[state.index];const a=rehearsal?E.retry(state,selected):E.submit(state,unsure?null:selected);if(!a)return;locked=true;
 $('options').querySelectorAll('button').forEach(b=>b.disabled=true);$('confirm').disabled=true;$('unsure').hidden=true;
 const heading=rehearsal?(a.ok?'重練答對，首次紀錄維持不變。':'重練後，這個觀念仍值得再看一次。'):unsure?'先看解說，本題記為待複習。':a.ok?'這一步方向正確！':'這一步可以換個做法。';
 $('feedback').replaceChildren(el('strong',heading),el('p','建議：'+q.options[q.answer]),el('p',q.why),link(q.source));$('feedback').hidden=false;$('next').hidden=false;$('retry').hidden=false;$('score').textContent=`首次答對 ${state.answers.filter(a=>a.ok).length} 題`;$('progress').value=state.answers.length;
}
function retry(){rehearsal=true;locked=false;selected=null;$('options').querySelectorAll('button').forEach(b=>{b.disabled=false;b.setAttribute('aria-pressed','false');});$('confirm').disabled=true;$('unsure').hidden=true;$('feedback').hidden=true;$('feedback').replaceChildren();$('next').hidden=true;$('retry').hidden=true;$('selection').textContent='重練：重新選擇，不改首次結果。';$('options').querySelector('button').focus();}
function finish(){
 $('lesson').hidden=true;$('result').hidden=false;$('summary').textContent=`完成 ${state.items.length} 題，首次答對 ${state.answers.filter(a=>a.ok).length} 題；待複習 ${state.answers.filter(a=>!a.ok).length} 題。`;$('review').replaceChildren();
 state.items.forEach((q,i)=>{const a=state.answers[i],d=el('details');d.append(el('summary',(a.ok?'✓ ':'待複習 · ')+q.title),el('p','首次選擇：'+(a.choice===null?'先看解說':q.options[a.choice])),el('p','建議：'+q.options[q.answer]),el('p',q.why),link(q.source));$('review').append(d);});$('result-title').focus();
}
$('start').addEventListener('click',start);$('confirm').addEventListener('click',()=>answer());$('unsure').addEventListener('click',()=>answer(true));$('retry').addEventListener('click',retry);$('next').addEventListener('click',()=>{if(locked&&E.next(state))render();});$('leave').addEventListener('click',intro);$('restart').addEventListener('click',intro);
for(const key of Object.keys(E.sources)){const li=el('li');li.append(link(key));$('sources').append(li);}
})();
