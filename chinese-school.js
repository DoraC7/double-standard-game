(() => {
'use strict';
const E=ChineseSchool,$=id=>document.getElementById(id);
let state=null;
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function button(text,fn){const b=el('button',text);b.type='button';b.addEventListener('click',fn);return b;}
function clearRound(){state=null;$('lesson').hidden=true;$('result').hidden=true;$('intro').hidden=false;$('controls').replaceChildren();$('feedback').replaceChildren();$('review').replaceChildren();$('draft').value='';$('start').focus();}
function start(){state=E.create($('mode').value);$('intro').hidden=true;$('result').hidden=true;$('lesson').hidden=false;$('review').replaceChildren();render();}
function render(){const q=state.items[state.index];$('round').textContent=`第 ${state.index+1} / ${state.items.length} 題`;$('score').textContent=`首次答對 ${state.answers.filter(a=>a.ok).length} 題`;$('progress').max=state.items.length;$('progress').value=state.answers.length;$('topic').textContent=E.topics[q.topic];$('scene').textContent=q.scene;$('old').textContent=q.old;$('title').textContent=q.title;$('prompt').textContent=q.prompt;$('controls').replaceChildren();$('feedback').replaceChildren();$('feedback').hidden=true;$('rewrite').hidden=true;$('draft').value='';$('unsure').hidden=false;$('next').hidden=true;
 let selected=q.kind==='choice'?null:q.slots.map(()=>null);const send=button('確認這個說法',()=>answer(selected));send.id='confirm';send.className='primary confirm';send.disabled=true;
 if(q.kind==='choice'){
  const group=el('div',undefined,'options');group.setAttribute('role','group');group.setAttribute('aria-label','選擇最符合情境的說法');
  for(const i of E.shuffle(q.options.map((_,i)=>i))){const b=button(q.options[i],()=>{if(state.locked)return;selected=i;group.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));send.disabled=false;});b.dataset.choice=i;b.setAttribute('aria-pressed','false');group.append(b);}$('controls').append(group);
 }else{
  const preview=el('p','請選擇句子積木','sentence-preview');preview.id='sentence-preview';preview.setAttribute('aria-live','polite');
  q.slots.forEach((slot,si)=>{const field=el('fieldset',undefined,'pieces');field.append(el('legend',slot.label));const group=el('div');for(const i of E.shuffle(slot.options.map((_,i)=>i))){const b=button(slot.options[i],()=>{if(state.locked)return;selected[si]=i;group.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));preview.textContent=E.describe(q,selected);send.disabled=selected.some(v=>v===null);});b.dataset.slot=si;b.dataset.piece=i;b.setAttribute('aria-pressed','false');group.append(b);}field.append(group);$('controls').append(field);});$('controls').append(preview);
 }$('controls').append(send);$('title').focus();
}
function explain(parent,q){parent.append(el('p',q.why),el('p','參考說法：'+q.model,'model'));}
function answer(value){const a=E.submit(state,value);if(!a)return;const q=state.items[state.index];$('controls').querySelectorAll('button').forEach(b=>b.disabled=true);$('unsure').hidden=true;const f=$('feedback');f.hidden=false;f.append(el('strong',a.ok?'✓ 這句接得住！':value==='unsure'?'○ 先看懂，再練一次。':'↺ 換個動詞，或確認目前狀態。'),el('p','你的選擇：'+E.describe(q,value)));explain(f,q);$('rewrite').hidden=false;$('score').textContent=`首次答對 ${state.answers.filter(a=>a.ok).length} 題`;$('progress').value=state.answers.length;$('next').hidden=false;$('next').textContent=state.index===state.items.length-1?'打開本輪回顧 →':'下一題 →';}
function finish(){$('lesson').hidden=true;$('result').hidden=false;const n=state.answers.filter(a=>a.ok).length;$('summary').textContent=`完成 ${state.items.length} 題，首次答對 ${n} 題，待複習 ${state.items.length-n} 題。`;$('review').replaceChildren();state.answers.forEach((a,i)=>{const q=state.items[i],d=el('details');d.append(el('summary',`${a.ok?'✓':'○'} ${q.title}`),el('p','情境：'+q.scene),el('p','原句／待判讀句：'+q.old),el('p','你的選擇：'+E.describe(q,a.value)));explain(d,q);if(a.draft)d.append(el('p','我的改寫（未評分）：'+a.draft,'draft-review'));$('review').append(d);});$('result-title').focus();}
for(const [id,name] of Object.entries(E.topics)){const opt=el('option',`${name} · 5 題`);opt.value=id;$('mode').append(opt);$('topics').append(button(name,()=>{$('mode').value=id;start();}));}
$('start').addEventListener('click',start);$('unsure').addEventListener('click',()=>answer('unsure'));$('next').addEventListener('click',()=>{if(!state?.locked)return;state.answers.at(-1).draft=$('draft').value;if(E.next(state)){if(state.index===state.items.length)finish();else render();}});$('draft').addEventListener('input',()=>{if(state?.locked)state.answers.at(-1).draft=$('draft').value;});$('leave').addEventListener('click',clearRound);$('restart').addEventListener('click',clearRound);
})();
