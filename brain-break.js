(() => {
'use strict';
const E=BrainBreak,$=id=>document.getElementById(id);let state;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function showIntro(){$('intro').hidden=false;$('play').hidden=true;$('result').hidden=true;state=null;$('start').focus();}
function start(){state=E.create($('mode').value);$('intro').hidden=true;$('result').hidden=true;$('play').hidden=false;render();}
function render(){
 const q=state.items[state.index];$('round').textContent=`第 ${state.index+1} / ${state.items.length} 題`;$('topic').textContent=E.topics[q.topic];$('question-title').textContent=q.title;$('prompt').textContent=q.prompt;
 $('progress').max=state.items.length;$('progress').value=state.results.length;$('score').textContent=`首次答對 ${state.results.filter(r=>r.first).length} 題`;
 const puzzle=$('puzzle');puzzle.replaceChildren();if(q.art==='grid'){
  // Authored local artwork only; no player text is interpreted as markup.
  puzzle.innerHTML='<svg viewBox="0 0 240 160" role="img" aria-label="橫向三格、直向兩格，共六個一樣大的正方形"><path d="M1 1h238v158H1zM80 1v158M160 1v158M1 80h238" fill="none" stroke="#7354a1" stroke-width="3"/></svg>';
 }else puzzle.textContent=q.display;
 $('options').replaceChildren();E.shuffle(q.options.map((_,i)=>i)).forEach(i=>{const b=el('button',q.options[i]);b.type='button';b.dataset.choice=i;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{if(!E.select(state,i))return;$('options').querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));$('confirm').disabled=false;});$('options').append(b);});
 $('confirm').disabled=true;$('confirm').hidden=false;$('unsure').hidden=false;$('feedback').hidden=true;$('feedback').replaceChildren();$('retry').hidden=true;$('next').hidden=true;$('question-title').focus();
}
function answer(value){
 const result=E.submit(state,value);if(!result)return;const q=state.items[state.index];
 $('options').querySelectorAll('button').forEach(b=>{b.disabled=true;const i=Number(b.dataset.choice);if(i===q.answer)b.classList.add('correct');if(i===value&&!result.latest)b.classList.add('wrong');});
 $('confirm').disabled=true;$('unsure').hidden=true;const feedback=$('feedback');feedback.hidden=false;feedback.className='feedback'+(result.latest?'':' review');feedback.replaceChildren(el('strong',result.latest?'✓ 想通了！':value==='unsure'?'一起拆解看看。':'↺ 換個角度看。'),el('p','本題答案：'+q.options[q.answer]),el('p',q.why));
 if(result.tries>1)feedback.append(el('p',result.first?'保留首次答對紀錄。':'重試結果已更新，首次作答仍記為待複習。','small'));
 $('progress').value=state.results.length;$('score').textContent=`首次答對 ${state.results.filter(r=>r.first).length} 題`;$('retry').hidden=result.latest;$('next').hidden=false;$('next').textContent=state.index===state.items.length-1?'看本輪複習 →':'下一題 →';
}
function finish(){
 $('play').hidden=true;$('result').hidden=false;const first=state.results.filter(r=>r.first).length,latest=state.results.filter(r=>r.latest).length;
 $('summary').textContent=`完成 ${state.items.length} 題，首次答對 ${first} 題；重試後目前答對 ${latest} 題。`;$('review').replaceChildren();
 state.items.forEach((q,i)=>{const r=state.results[i],d=el('details');d.append(el('summary',`${r.first?'✓':'○'} ${q.title}｜首次${r.first?'答對':'待複習'}`),el('p','最後作答：'+(r.value==='unsure'?'先看解析':q.options[r.value])),el('p','本題答案：'+q.options[q.answer]),el('p',q.why));$('review').append(d);});$('result-title').focus();
}
$('start').addEventListener('click',start);$('confirm').addEventListener('click',()=>answer(state.selected));$('unsure').addEventListener('click',()=>answer('unsure'));$('retry').addEventListener('click',()=>{if(E.retry(state))render();});$('next').addEventListener('click',()=>{if(E.next(state)){if(state.done)finish();else render();}});$('leave').addEventListener('click',showIntro);$('restart').addEventListener('click',showIntro);
})();
