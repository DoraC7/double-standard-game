(function(){
'use strict';
const D=FamilyLifeData,E=FamilyLifeEngine,B=D.banks[document.body.dataset.bank],family=document.body.dataset.bank==='family',$=id=>document.getElementById(id);
let state=null,value=null,display=[],focusBeforePause=null,lastText='';
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function button(text,fn){const b=el('button',text);b.type='button';b.addEventListener('click',fn);return b;}
function reference(q){const div=el('div',undefined,'reference');div.append(el('p','參考資料 · '+D.checked+'查核（原創情境應用，不是官方題庫）'));for(const key of q.sources){const a=el('a',D.sources[key][0]);a.href=D.sources[key][1];a.target='_blank';a.rel='noopener noreferrer';div.append(a);}return div;}
function describe(q,v){if(v==='unsure')return '不確定，先看解析';if(q.kind==='choice')return q.options[v];if(q.kind==='order')return v.map((n,i)=>`${i+1}. ${q.options[n]}`).join('\n');return v.map((x,i)=>(x?'需要調整：':'本題可行：')+q.options[i]).join('\n');}
function example(q){if(q.kind==='choice')return q.options[q.answer];if(q.kind==='order')return '一種可行順序：\n'+q.options.map((x,i)=>`${i+1}. ${x}`).join('\n');return '需要調整：'+q.answer.map(i=>q.options[i]).join('；');}
function showIntro(){state=null;$('play').hidden=true;$('result').hidden=true;$('intro').hidden=false;$('start').focus();}
function start(){state=E.create(B,$('mode').value);$('intro').hidden=true;$('result').hidden=true;$('play').hidden=false;$('progress').max=state.items.length;render();}
function updateStatus(){const q=state.items[state.index],ready=E.valid(q,value);$('confirm').disabled=!ready;
 $('selection-status').textContent=q.kind==='choice'?(ready?'已選：'+q.options[value]:'尚未選擇，選好才能確認。'):q.kind==='order'?`已排 ${value.length} / ${q.options.length} 步；點上方步驟可移回待排區。`:`已判斷 ${value.filter(v=>v!==null).length} / ${q.options.length} 張；每張都要選。`;
}
function drawControls(){const active=document.activeElement;const focusKey=active?.dataset.choice!==undefined?`[data-choice="${active.dataset.choice}"]`:active?.dataset.card!==undefined?`[data-card="${active.dataset.card}"][data-mark="${active.dataset.mark}"]`:active?.dataset.step!==undefined?'order':active?.dataset.remove!==undefined?'order':null;const q=state.items[state.index],locked=state.locked;const options=$('options');options.replaceChildren();$('picked').replaceChildren();
 if(q.kind==='choice')for(const i of display){const b=button(q.options[i],()=>{if(state.locked)return;value=i;drawControls();updateStatus();});b.dataset.choice=i;b.setAttribute('aria-pressed',String(value===i));b.disabled=locked;options.append(b);}
 if(q.kind==='spot')for(const i of display){const card=el('div',undefined,'spot-card');card.append(el('p',q.options[i]));const controls=el('div',undefined,'toolbar');for(const [v,label] of [[true,'需要調整'],[false,'本題可行']]){const b=button(label,()=>{if(state.locked)return;value[i]=v;drawControls();updateStatus();});b.dataset.card=i;b.dataset.mark=String(v);b.setAttribute('aria-label',q.options[i]+'：'+label);b.setAttribute('aria-pressed',String(value[i]===v));b.disabled=locked;controls.append(b);}card.append(controls);options.append(card);}
 if(q.kind==='order'){
  if(!value.length)$('picked').append(el('span','尚未排列，從下面點選第一步。'));
  value.forEach((i,pos)=>{const b=button(`${pos+1}. ${q.options[i]} ×`,()=>{if(state.locked)return;value.splice(pos,1);drawControls();updateStatus();});b.dataset.remove=i;b.setAttribute('aria-label',`移回待排區：${q.options[i]}`);b.disabled=locked;$('picked').append(b);});
  for(const i of display.filter(i=>!value.includes(i))){const b=button('+ '+q.options[i],()=>{if(state.locked)return;value.push(i);drawControls();updateStatus();});b.dataset.step=i;b.disabled=locked;options.append(b);}
 }
 if(!locked&&focusKey){const target=focusKey==='order'?(options.querySelector('button')||$('picked').querySelector('button')):options.querySelector(focusKey);target?.focus();}
}
function render(){const q=state.items[state.index];value=q.kind==='choice'?null:q.kind==='order'?[]:q.options.map(()=>null);display=E.shuffle(q.options.map((_,i)=>i));
 $('round').textContent=`第 ${state.index+1} / ${state.items.length} 題`;$('progress').value=Object.keys(state.records).length;$('category').textContent=q.category+' / '+({choice:'選回應，看可能後續',spot:'逐張判斷，找出問題',order:'親手排步驟'})[q.kind];$('question-title').textContent=q.title;$('prompt').textContent=q.prompt;
 $('instruction').textContent=q.kind==='choice'?'選一個符合本題目標的做法，再確認。':q.kind==='spot'?'每張卡都標示「需要調整」或「本題可行」，再確認。':'點待排步驟加入上方清單。若要更改，點上方步驟移回重排；接受符合必要先後的不同排法。';$('picked').hidden=q.kind!=='order';
 $('confirm').hidden=false;$('unsure').hidden=false;$('retry').hidden=true;$('next').hidden=true;$('feedback').hidden=true;$('feedback').replaceChildren();drawControls();updateStatus();$('question-title').focus();
}
function answer(v){if(!state)return;const r=E.submit(state,v);if(!r)return;const q=state.items[state.index];drawControls();$('confirm').disabled=true;$('unsure').hidden=true;
 const f=$('feedback');f.hidden=false;f.replaceChildren(el('strong',r.latest?(family?'這次做法符合本題練習目標。':'這次判斷符合本題安全原則。'):'先看看原因，再決定是否修改。'));
 f.append(el('p','這次操作：\n'+describe(q,v),'review-answer'));
 if(q.kind==='choice'&&v!=='unsure')f.append(el('p','可能後續：'+q.effects[v]));
 f.append(el('p',example(q),'review-answer'),el('p',q.why),reference(q));
 if(r.tries>1)f.append(el('p','已更新最近做法，首次紀錄保持不變。','small'));
 $('progress').value=Object.keys(state.records).length;$('retry').hidden=false;$('next').hidden=false;$('next').textContent=state.index===state.items.length-1?'看本輪回顧 →':'下一題 →';
}
function report(){const lines=[B.title,'版本 '+D.version,'原創情境練習；不是人格、親職或醫療評鑑。','首次與最近分開；本頁未上傳或永久儲存作答。'];for(const q of state.items){const r=state.records[q.id];lines.push('',q.id+'｜'+q.category+'｜'+q.title,q.prompt,'首次：'+describe(q,r.firstValue),'首次符合本題目標：'+(r.first?'是':'待複習'),'最近：'+describe(q,r.value),'最近符合本題目標：'+(r.latest?'是':'待複習'),'作答次數：'+r.tries,...(q.kind==='choice'&&r.firstValue!=='unsure'?['首次做法可能後續：'+q.effects[r.firstValue]]:[]),...(q.kind==='choice'&&r.value!=='unsure'?['最近做法可能後續：'+q.effects[r.value]]:[]),example(q),q.why,...q.sources.map(k=>D.sources[k].join(' ')));}return lines.join('\n');}
function finish(){state.done=true;$('play').hidden=true;$('result').hidden=false;const records=Object.values(state.records);$('summary').textContent=family?`完成 ${state.items.length} 個情境，練習聽懂需求、界線與修復。下面看每個情境的選擇，不替家庭打總分。`:`完成 ${state.items.length} 個情境；首次符合本題原則 ${records.filter(r=>r.first).length} 題，目前符合 ${records.filter(r=>r.latest).length} 題。`;
 $('result-limit').textContent=family?'家庭互動有不同可行做法，這些是有條件的練習示例。照顧責任不對等，不用角色互換就判定雙標。':'這是本輪作答紀錄，不是健康程度、風險機率或實際急救能力。';$('coverage').replaceChildren();for(const c of B.categories){const count=state.items.filter(q=>q.category===c).length;$('coverage').append(el('li',`${c}：${count?`完成 ${count} 題`:'本輪未選到'}`));}
 $('review').replaceChildren();for(const q of state.items){const r=state.records[q.id],d=el('details');d.append(el('summary',`${q.title}｜首次${r.first?'符合本題目標':'待複習'} · 最近${r.latest?'符合':'待複習'}`),el('p',q.prompt),el('p','首次：\n'+describe(q,r.firstValue),'review-answer'),el('p','最近：\n'+describe(q,r.value),'review-answer'),el('p',example(q),'review-answer'),el('p',q.why),reference(q));if(q.kind==='choice'&&r.firstValue!=='unsure')d.append(el('p','首次做法可能後續：'+q.effects[r.firstValue]));if(q.kind==='choice'&&r.value!=='unsure')d.append(el('p','最近做法可能後續：'+q.effects[r.value]));$('review').append(d);}lastText=report();$('result-title').focus();}
function pause(){if(!state||state.done||$('pause-dialog').open)return;focusBeforePause=document.activeElement;$('pause-dialog').showModal();$('resume').focus();}
$('pause').addEventListener('click',pause);$('resume').addEventListener('click',()=>$('pause-dialog').close());$('pause-dialog').addEventListener('close',()=>{if(focusBeforePause?.isConnected)focusBeforePause.focus();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('blur',pause);
$('start').addEventListener('click',start);$('confirm').addEventListener('click',()=>answer(value));$('unsure').addEventListener('click',()=>answer('unsure'));
$('retry').addEventListener('click',()=>{if(E.retry(state))render();});$('next').addEventListener('click',()=>{if(E.next(state)){if(state.done)finish();else render();}});$('leave').addEventListener('click',showIntro);$('restart').addEventListener('click',showIntro);
$('download').addEventListener('click',()=>{const blob=new Blob([lastText],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=B.title+'-本輪紀錄.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
})();
