(() => {
'use strict';
const E=HouseworkSchool,$=id=>document.getElementById(id);let state;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function valueLabel(q,value){if(value==='unsure')return '先看解析';return q.kind==='order'?value.map(i=>q.steps[i]).join(' → '):q.options[value];}
function solution(q){return q.kind==='order'?q.steps.join(' → '):q.options[q.answer];}
function renderOrder(q){
 let order=[2,0,1];const list=el('ol');list.className='step-list';const status=el('p','請用上移／下移排好順序，再確認。','small');status.setAttribute('aria-live','polite');
 function draw(focus){list.replaceChildren();order.forEach((n,i)=>{const li=el('li');li.dataset.step=n;li.append(el('span',q.steps[n]));const actions=el('div',undefined,'step-actions');
  for(const [delta,text] of [[-1,'上移'],[1,'下移']]){const b=el('button',text);b.type='button';b.dataset.delta=delta;b.setAttribute('aria-label',q.steps[n]+' '+text);b.disabled=i+delta<0||i+delta>=order.length;
   b.addEventListener('click',()=>{if(state.locked)return;const to=i+delta;[order[i],order[to]]=[order[to],order[i]];E.select(state,order);$('confirm').disabled=false;draw({n,delta});status.textContent=q.steps[n]+'，目前第 '+(to+1)+' 步';});actions.append(b);
  }li.append(actions);list.append(li);
 });if(focus){const row=list.querySelector('[data-step="'+focus.n+'"]');const b=row.querySelector('[data-delta="'+focus.delta+'"]');(b&&!b.disabled?b:row.querySelector('button:not(:disabled)'))?.focus();}}
 draw();$('options').append(list,status);
}
function showIntro(){$('intro').hidden=false;$('play').hidden=true;$('result').hidden=true;state=null;$('start').focus();}
function start(){state=E.create($('mode').value);$('intro').hidden=true;$('result').hidden=true;$('play').hidden=false;render();}
function render(){
 const q=state.items[state.index];$('round').textContent=`第 ${state.index+1} / ${state.items.length} 題`;$('topic').textContent=E.topics[q.topic];$('question-title').textContent=q.title;$('prompt').textContent=q.prompt;
 $('progress').max=state.items.length;$('progress').value=state.results.length;$('score').textContent=`首次答對 ${state.results.filter(r=>r.first).length} 題`;
 const puzzle=$('puzzle');puzzle.replaceChildren();puzzle.textContent=q.display;
 $('options').replaceChildren();if(q.kind==='order')renderOrder(q);else E.shuffle(q.options.map((_,i)=>i)).forEach(i=>{const b=el('button',q.options[i]);b.type='button';b.dataset.choice=i;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{if(!E.select(state,i))return;$('options').querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));$('confirm').disabled=false;});$('options').append(b);});
 $('confirm').disabled=true;$('confirm').hidden=false;$('unsure').hidden=false;$('feedback').hidden=true;$('feedback').replaceChildren();$('retry').hidden=true;$('next').hidden=true;$('question-title').focus();
}
function answer(value){
 const result=E.submit(state,value);if(!result)return;const q=state.items[state.index];
 $('options').querySelectorAll('button').forEach(b=>{b.disabled=true;const i=Number(b.dataset.choice);if(i===q.answer)b.classList.add('correct');if(i===value&&!result.latest)b.classList.add('wrong');});
 $('confirm').disabled=true;$('unsure').hidden=true;const feedback=$('feedback');feedback.hidden=false;feedback.className='feedback'+(result.latest?'':' review');feedback.replaceChildren(el('strong',result.latest?'✓ 想通了！':value==='unsure'?'一起拆解看看。':'↺ 換個角度看。'),el('p','本題建議：'+solution(q)),el('p',q.why));
 if(result.tries>1)feedback.append(el('p',result.first?'保留首次答對紀錄。':'重試結果已更新，首次作答仍記為待複習。','small'));
 $('progress').value=state.results.length;$('score').textContent=`首次答對 ${state.results.filter(r=>r.first).length} 題`;$('retry').hidden=result.latest;$('next').hidden=false;$('next').textContent=state.index===state.items.length-1?'看本輪複習 →':'下一題 →';
}
function finish(){
 $('play').hidden=true;$('result').hidden=false;const first=state.results.filter(r=>r.first).length,latest=state.results.filter(r=>r.latest).length;
 $('summary').textContent=`完成 ${state.items.length} 題，首次答對 ${first} 題；重試後目前答對 ${latest} 題。`;$('review').replaceChildren();
 state.items.forEach((q,i)=>{const r=state.results[i],d=el('details');d.append(el('summary',`${r.first?'✓':'○'} ${q.title}｜首次${r.first?'答對':'待複習'}`),el('p','最後作答：'+valueLabel(q,r.value)),el('p','本題建議：'+solution(q)),el('p',q.why));$('review').append(d);});$('result-title').focus();
}
$('start').addEventListener('click',start);$('confirm').addEventListener('click',()=>answer(state.selected));$('unsure').addEventListener('click',()=>answer('unsure'));$('retry').addEventListener('click',()=>{if(E.retry(state))render();});$('next').addEventListener('click',()=>{if(E.next(state)){if(state.done)finish();else render();}});$('leave').addEventListener('click',showIntro);$('restart').addEventListener('click',showIntro);
})();
