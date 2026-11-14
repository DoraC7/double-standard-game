function retellingQA(mode='all',branch=0,intentional=false){
 const $=id=>document.getElementById(id),T=RetellingData,E=RetellingEngine,check=(v,m)=>{if(!v)throw Error(m)},snap=()=>RetellingGame.snapshot();
 const click=(action,value)=>{const b=[...document.querySelectorAll('#workspace button')].find(x=>x.dataset.action===action&&x.dataset.value===JSON.stringify(value));check(b&&!b.disabled,'可操作 '+action+JSON.stringify(value));b.click();};
 const pick=(action,index,value)=>{const n=document.querySelector(`select[data-action="${action}"][data-index="${index}"]`);check(n&&!n.disabled,'可選欄位 '+action);n.value=String(value);n.dispatchEvent(new Event('change',{bubbles:true}));};
 $('mode').value=mode;$('start').click();const ids=snap().ids,missed=new Set();let count=0;
 function answer(t,bad){
  if(t.kind==='detect')t.cards.forEach((c,i)=>click('classify',[i,bad&&i===0?(c[1]+1)%3:c[1]]));
  if(t.kind==='repair')t.fields.forEach((f,i)=>{let n=f.options.findIndex(o=>o[0]===f.answer);if(bad&&i===0)n=f.options.findIndex(o=>o[0]!==f.answer);pick('choose',i,n);});
  if(t.kind==='relay'){
   for(const h of [0,1,0]){const before=[...snap().state.values];click('hop',h);const state=snap().state;check(JSON.stringify(state.history.at(-1).before)===JSON.stringify(before),'沿用前一棒');}
   check(snap().state.values[0]===t.alternates[0],'變動真的留到最後');pick('earliest',0,bad?0:2);t.origin.forEach((_,i)=>pick('repair',i,0));check($('observation').textContent.includes(t.origin[0]),'修復實際內容');
  }
  if(t.kind==='evidence'){
   check(!document.querySelector('.source-card'),'未打開不洩漏內容');click('open',branch);check(document.querySelector('.source-card p').textContent===t.sources[branch].text,'正是所選來源，不偷換');check(snap().state.answer===null&&$('confirm').disabled,'先開來源仍需選答');
   click('answer',bad?(t.sources[branch].answer+1)%3:t.sources[branch].answer);
  }
 }
 for(const id of ids){const t=T[id];check(snap().id===id,'正確關卡');check($('confirm').disabled,'未選取不能送');check(document.documentElement.scrollWidth<=innerWidth,'不溢出 '+id);const bad=intentional&&!missed.has(t.kind);if(bad)missed.add(t.kind);answer(t,bad);check(!$('confirm').disabled,'選好才能提交');$('confirm').click();check(snap().state.finished,'提交鎖定');check(snap().latest[id].pass===!bad,'判分符合實際');const old=JSON.stringify(snap().latest);$('confirm').click();check(JSON.stringify(snap().latest)===old,'不能重複提交');check([...document.querySelectorAll('#workspace button,#workspace select')].every(n=>n.disabled),'答題控制鎖定');
  if(bad){$('retry').click();check($('confirm').disabled,'重試沒有舊選擇');if(t.kind==='evidence')check(snap().state.active===null&&snap().state.opened.length===0&&!document.querySelector('.source-card'),'重試清空開啟來源');answer(t,false);$('confirm').click();check(snap().latest[id].pass&&!snap().first[id].pass,'首次錯誤仍保留');}
  $('next').click();count++;
 }
 check(!$('result').hidden&&$('game').hidden,'完整結算');check($('review').children.length===ids.length,'逐關回顧');check($('score').textContent===`首次通過 ${ids.length-missed.size} / ${ids.length} 關；最近通過 ${ids.length} / ${ids.length} 關。`,'首次最近正確');check(document.documentElement.scrollWidth<=innerWidth,'結算不溢出');if(mode==='short')check(ids.map(i=>T[i].kind).join(',')==='detect,repair,relay,evidence','快閃四部門平衡');
 return {mode,branch,count,first:ids.length-missed.size,latest:ids.length};
}
