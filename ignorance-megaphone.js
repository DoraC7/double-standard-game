(()=>{'use strict';
const E=IgnoranceMegaphone,$=id=>document.getElementById(id);let state=null;
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
function intro(){state=null;$('intro').hidden=false;$('play').hidden=true;$('result').hidden=true;$('start').focus();}
function volume(){const v=state.volume;$('volume').value=v;$('volume-value').textContent=v+' / 100';$('reach').textContent=`${state.locked?'本次':'預計'}擴散：${E.reach(v)} 人次${v===0?'（不外播）':''}`;$('studio').style.setProperty('--spread',String(.5+v/100));}
function render(){
 const q=state.items[state.index];$('round').textContent=`第 ${state.index+1} / ${state.items.length} 題`;$('topic').textContent=E.topics[q.topic];$('title').textContent=q.title;$('source').textContent=q.source;$('score').textContent=`首次有據 ${E.scores(state).first} 題`;$('progress').max=state.items.length;$('progress').value=state.results.length;
 $('options').replaceChildren();E.shuffle(q.options.map((_,i)=>i)).forEach(i=>{const b=el('button',q.options[i]);b.type='button';b.dataset.choice=i;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{if(!E.select(state,i))return;$('options').querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));$('preview').textContent='待播：'+q.options[i];$('confirm').disabled=false;});$('options').append(b);});
 $('preview').textContent='先選一句話，再決定擴音。';$('confirm').disabled=true;$('volume').disabled=false;$('feedback').hidden=true;$('feedback').replaceChildren();$('retry').hidden=true;$('next').hidden=true;$('studio').classList.remove('air');volume();$('title').focus();
}
function start(){state=E.create($('mode').value);$('intro').hidden=true;$('result').hidden=true;$('play').hidden=false;render();}
function broadcast(){const r=E.submit(state);if(!r)return;const q=state.items[state.index];$('options').querySelectorAll('button').forEach(b=>b.disabled=true);$('volume').disabled=true;$('confirm').disabled=true;$('studio').classList.add('air');$('preview').textContent='已播：'+q.options[r.choice];volume();
 $('feedback').hidden=false;$('feedback').replaceChildren(el('strong',r.supported?'這句有資料支持。':'音量很明確，證據卻沒有跟上。'),el('p',r.reach===0?'本次未外播；句子仍依資料核對。':r.supported?`有依據的句子傳到 ${r.reach} 人次。`:`這句不受資料支持，模擬誤傳 ${r.reach} 人次。`),el('p','資料支持的說法：'+q.options[q.answer]),el('p',q.why));
 if(state.results[state.index].tries>1)$('feedback').append(el('p','重播不改首次句子、音量與誤傳紀錄。'));
 $('score').textContent=`首次有據 ${E.scores(state).first} 題`;$('progress').value=state.results.length;$('retry').hidden=false;$('next').hidden=false;$('next').textContent=state.index===state.items.length-1?'看本輪播報紀錄 →':'下一則 →';
}
function finish(){const s=E.scores(state);$('play').hidden=true;$('result').hidden=false;$('summary').textContent=`完成 ${state.items.length} 題，首次有據 ${s.first} 題；最近有據 ${s.latest} 題。首次擴散 ${s.firstReached} 人次，其中誤傳 ${s.firstMisled} 人次。`;$('review').replaceChildren();
 state.items.forEach((q,i)=>{const r=state.results[i],d=el('details');d.append(el('summary',q.title),el('p','原始資料：'+q.source),el('p','首次：'+q.options[r.first.choice]),el('p',`首次擴音 ${r.first.volume}，擴散 ${r.first.reach} 人次；${r.first.supported?'有據':'資料不支持'}。`),el('p','最近：'+q.options[r.latest.choice]),el('p',`最近擴音 ${r.latest.volume}，擴散 ${r.latest.reach} 人次；${r.latest.supported?'有據':'資料不支持'}。`),el('p','資料支持的說法：'+q.options[q.answer]),el('p',q.why));$('review').append(d);});$('result-title').focus();}
$('start').addEventListener('click',start);$('volume').addEventListener('input',()=>{if(E.setVolume(state,Number($('volume').value)))volume();});$('confirm').addEventListener('click',broadcast);$('retry').addEventListener('click',()=>{if(E.retry(state))render();});$('next').addEventListener('click',()=>{if(E.next(state)){if(state.done)finish();else render();}});$('leave').addEventListener('click',intro);$('restart').addEventListener('click',intro);
})();
