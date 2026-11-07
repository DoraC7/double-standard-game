(()=>{'use strict';
const E=MischiefSchool,$=id=>document.getElementById(id);let state=null;
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
const symbols={idle:'',quack:'♫ 🦆 ♫',crown:'♛ ✦ ♛',confetti:'🎊 ✦ 🎊',bubbles:'○ ◯ ○',float:'🎈 🎈',disco:'✦ 🪩 ✦',cloud:'☁ ☁ ☁',robot:'⚙ 🤖 ⚙',bounce:'🎩 ↟ 🎩'};
function intro(){state=null;$('intro').hidden=false;$('play').hidden=true;$('result').hidden=true;$('start').focus();}
function stage(){const q=state.items[state.index],p=state.branch===null?null:q.props[state.branch];$('stage').dataset.effect=p?.effect||'idle';$('effect').textContent=symbols[p?.effect||'idle'];$('stage-note').textContent=p?p.note:'道具還沒上場。';}
function render(){
 if(state.done){finish();return;}
 const q=state.items[state.index],score=E.scores(state);$('round').textContent=`第 ${state.index+1} / ${state.items.length} 幕`;$('score').textContent=`首次 ${score.first} 點`;$('progress').max=state.items.length;$('progress').value=state.index;
 $('topic').textContent=E.topics[q.topic];$('title').textContent=q.title;$('goal').textContent='指定笑點：'+q.goal;stage();
 const phase=state.phase,choosing=['prop','cleanup'].includes(phase);$('options').replaceChildren();$('feedback').replaceChildren();$('feedback').hidden=true;$('confirm').hidden=!choosing;$('confirm').disabled=true;$('next').hidden=choosing;$('retry').hidden=phase!=='feedback';
 $('step-title').textContent=phase==='prop'?'第一步：挑道具':phase==='outcome'?'場面已經變了！':phase==='cleanup'?'第二步：依實際結果收尾':'這一幕有交代了';
 if(choosing){
  E.shuffle(q.props.map((_,i)=>i)).forEach(i=>{const b=el('button',phase==='prop'?q.props[i].label:q.props[i].cleanup);b.type='button';b.dataset.choice=i;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{if(!E.select(state,i))return;$('options').querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));$('confirm').disabled=false;});$('options').append(b);});
  $('confirm').textContent=phase==='prop'?'確認開搞':'確認收尾';
 }else{
  const r=state.records[state.index];$('feedback').hidden=false;
  if(phase==='outcome'){$('feedback').append(el('strong',r.propLatest?'指定笑點成功！':'不是指定效果，但現場已經開演。'),el('p','你選的是：'+q.props[state.branch].label),el('p','實際結果：'+q.props[state.branch].note));$('next').textContent='看看怎麼收尾 →';}
  else{$('feedback').append(el('strong',r.cleanLatest?'這個場面收對了。':'這個做法沒有處理現在的場面。'),el('p','你選的收尾：'+q.props[r.cleanup].cleanup),el('p','依實際結果應該：'+q.props[state.branch].cleanup));$('next').textContent=state.index===state.items.length-1?'看本輪導演筆記 →':'下一幕 →';}
 }
 $('title').focus();
}
function start(){state=E.create($('mode').value);$('intro').hidden=true;$('result').hidden=true;$('play').hidden=false;render();}
function finish(){const score=E.scores(state);$('play').hidden=true;$('result').hidden=false;$('summary').textContent=`完成 ${state.items.length} 幕，首次 ${score.first} / ${state.items.length*2} 點；最近 ${score.latest} 點。`;$('review').replaceChildren();
 state.items.forEach((q,i)=>{const r=state.records[i],d=el('details');d.append(el('summary',q.title),el('p','首次道具：'+q.props[r.firstBranch].label),el('p','最近道具：'+q.props[r.lastBranch].label),el('p','實際結果：'+q.props[r.lastBranch].note),el('p','這個結果的收尾：'+q.props[r.lastBranch].cleanup),el('p',`首次笑點 ${Number(r.propFirst)}、收尾 ${Number(r.cleanFirst)}；最近笑點 ${Number(r.propLatest)}、收尾 ${Number(r.cleanLatest)}。`));$('review').append(d);});$('result-title').focus();}
$('start').addEventListener('click',start);$('confirm').addEventListener('click',()=>{if(E.confirm(state))render();});$('next').addEventListener('click',()=>{if(E.next(state))render();});$('retry').addEventListener('click',()=>{if(E.retry(state))render();});$('leave').addEventListener('click',intro);$('restart').addEventListener('click',intro);
})();
