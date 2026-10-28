(() => {
'use strict';
const E=AISchool,$=id=>document.getElementById(id);let state=null;
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function button(text,fn){const b=el('button',text);b.type='button';b.addEventListener('click',fn);return b;}
function source(key){const [name,url]=E.sources[key],a=el('a',name+' ↗','source-link');a.href=url;a.target='_blank';a.rel='noopener';return a;}
function clearRound(){state=null;$('lesson').hidden=true;$('result').hidden=true;$('intro').hidden=false;$('controls').replaceChildren();$('feedback').replaceChildren();$('review').replaceChildren();$('draft').value='';$('start').focus();}
function start(){state=E.create($('mode').value);$('intro').hidden=true;$('result').hidden=true;$('lesson').hidden=false;$('review').replaceChildren();render();}
function render(){const q=state.items[state.index];$('round').textContent=`第 ${state.index+1} / ${state.items.length} 題`;$('score').textContent=`首次判斷符合證據 ${state.answers.filter(a=>a.ok).length} 題`;$('progress').max=state.items.length;$('progress').value=state.answers.length;$('topic').textContent=E.topics[q.topic];$('scene').textContent=q.scene;$('title').textContent=q.title;$('prompt').textContent=q.prompt;$('controls').replaceChildren();$('feedback').replaceChildren();$('feedback').hidden=true;$('rewrite').hidden=true;$('draft').value='';$('unsure').hidden=false;$('next').hidden=true;
 let selected=q.kind==='classify'?q.items.map(()=>null):null;const send=button('確認本次判斷',()=>answer(selected));send.id='confirm';send.className='primary confirm';send.disabled=true;
 if(q.kind==='evidence'){
  const deck=el('div',undefined,'evidence-deck'),status=el('p','已翻開 0 / '+q.cards.length+' 張證據','evidence-count');status.id='evidence-count';status.setAttribute('aria-live','polite');
  q.cards.forEach((card,i)=>{const box=el('section',undefined,'evidence-card'),text=el('p',card.text);text.hidden=true;const b=button(card.title,()=>{if(!E.reveal(state,i))return;text.hidden=false;b.disabled=true;box.classList.add('evidence-read');status.textContent=`已翻開 ${state.seen.length} / ${q.cards.length} 張證據`;});b.dataset.evidence=i;box.append(b,text);deck.append(box);});$('controls').append(deck,status);
 }
 if(q.kind!=='classify'){
  const group=el('div',undefined,'options');group.setAttribute('role','group');group.setAttribute('aria-label','依目前資訊選擇判斷');
  for(const i of E.shuffle(q.options.map((_,i)=>i))){const b=button(q.options[i],()=>{if(state.locked)return;selected=i;group.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));send.disabled=false;});b.dataset.choice=i;b.setAttribute('aria-pressed','false');group.append(b);}$('controls').append(group);
 }else{
  const preview=el('p','尚未完成分類','sentence-preview classify-preview');preview.id='classify-preview';preview.setAttribute('aria-live','polite');
  q.items.forEach((item,si)=>{const field=el('fieldset',undefined,'pieces');field.append(el('legend',item.text));const group=el('div');for(const i of E.shuffle(q.labels.map((_,i)=>i))){const b=button(q.labels[i],()=>{if(state.locked)return;selected[si]=i;group.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));preview.textContent=`已分類 ${selected.filter(v=>v!==null).length} / ${q.items.length} 張\n`+E.describe(q,selected);send.disabled=selected.some(v=>v===null);});b.dataset.item=si;b.dataset.category=i;b.setAttribute('aria-pressed','false');group.append(b);}field.append(group);$('controls').append(field);});$('controls').append(preview);
 }$('controls').append(send);$('title').focus();
}
function explain(parent,q,a){
 if(q.kind==='evidence'){parent.append(el('p','作答時翻開：'+(a.seen.length?a.seen.map(i=>q.cards[i].title).join('、'):'尚未翻開任何卡片')));if(!E.enough(q,a.seen))parent.append(el('p',q.whyBefore));const details=el('details',undefined,'reference-evidence');details.append(el('summary','完整證據與取得後的判斷'));q.cards.forEach(c=>details.append(el('p',c.title+'：'+c.text)));details.append(el('p',q.why));parent.append(details);
 }else{parent.append(el('p',q.why));if(q.kind==='classify')parent.append(el('p','分類參考：\n'+E.describe(q,q.items.map(i=>i.answer)),'model'));}
 parent.append(source(q.source));
}
function answer(value){const a=E.submit(state,value);if(!a)return;const q=state.items[state.index];$('controls').querySelectorAll('button').forEach(b=>b.disabled=true);$('unsure').hidden=true;const f=$('feedback');f.hidden=false;f.append(el('strong',a.ok?'✓ 這個判斷，符合目前證據。':value==='unsure'?'○ 先看解說，再補一個觀念。':'↺ 檢查能力、證據與結論的範圍。'),el('p','你的選擇：'+E.describe(q,value)));explain(f,q,a);$('rewrite').hidden=false;$('score').textContent=`首次判斷符合證據 ${state.answers.filter(a=>a.ok).length} 題`;$('progress').value=state.answers.length;$('next').hidden=false;$('next').textContent=state.index===state.items.length-1?'打開本輪回顧 →':'下一題 →';}
function finish(){$('lesson').hidden=true;$('result').hidden=false;const n=state.answers.filter(a=>a.ok).length;$('summary').textContent=`完成 ${state.items.length} 題，首次判斷符合證據 ${n} 題，待複習 ${state.items.length-n} 題。`;$('review').replaceChildren();state.answers.forEach((a,i)=>{const q=state.items[i],d=el('details');d.append(el('summary',`${a.ok?'✓':'○'} ${q.title}`),el('p','情境：'+q.scene),el('p','你的選擇：'+E.describe(q,a.value)));explain(d,q,a);if(a.draft)d.append(el('p','我的筆記（未評分）：'+a.draft,'draft-review'));$('review').append(d);});$('result-title').focus();}
for(const [id,name] of Object.entries(E.topics)){const opt=el('option',`${name} · 5 題`);opt.value=id;$('mode').append(opt);$('topics').append(button(name,()=>{$('mode').value=id;start();}));}
$('start').addEventListener('click',start);$('unsure').addEventListener('click',()=>answer('unsure'));$('next').addEventListener('click',()=>{if(!state?.locked)return;state.answers.at(-1).draft=$('draft').value;if(E.next(state)){if(state.index===state.items.length)finish();else render();}});$('draft').addEventListener('input',()=>{if(state?.locked)state.answers.at(-1).draft=$('draft').value;});$('leave').addEventListener('click',clearRound);$('restart').addEventListener('click',clearRound);
for(const key of Object.keys(E.sources)){const li=el('li');li.append(source(key));$('sources').append(li);}
})();
