'use strict';
(()=>{
 const T=TokenValueData,E=TokenValueEngine,$=id=>document.getElementById(id),node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
 let i=0,s={},locked=false,paused=false,started=false,totalSpent=0;
 const first=T.map(()=>null),latest=T.map(()=>null),bad=T.map(t=>E.bad(t));
 const habits=['先說目標與驗收，再提供剛好足夠的資料。','重問前寫下這次新增的證據或限制。','先選需要的媒介與回覆格式，不用長片／長文當預設。','用本版產物驗收；必要步驟不省，無新目的就收尾。'];
 function button(label,a,v,selected){const b=node('button',label);b.id='action-'+a+'-'+String(v??'x').replace(/[^a-zA-Z0-9-]/g,'-');b.dataset.action=a;if(v!==undefined)b.dataset.value=JSON.stringify(v);b.disabled=locked||paused;if(selected!==undefined)b.setAttribute('aria-pressed',String(selected));b.onclick=()=>dispatch(a,v);return b;}
 function dispatch(a,v,rebuild=true){if(locked||paused)return;const before=s.fuel;s=E.act(T[i],s,a,v);totalSpent+=Math.max(0,s.fuel-before);render(rebuild);}
 function describe(t,state){
   if(t.kind==='media')return '已查看：'+state.opened.map(n=>t.sources[n].label).join('／')+'\n提出結論：'+(state.answer===null?'未選':t.answers[state.answer])+'\n'+state.log.join('\n');
   if(t.kind==='prompt')return '送出的資訊：'+t.blocks.filter((_,n)=>state.selected.includes(n)).map(b=>b.text).join('\n')+'\n模擬回覆：'+(state.last?.response||'尚未送出')+'\n'+state.log.join('\n');
   if(t.kind==='reply')return '格式：'+(state.format===null?'未選':E.formatNames[state.format])+'\n實際文字：\n'+E.text(t,state);
   return '目前版本v'+state.version+'\n'+state.log.join('\n')+'\n'+state.output;
 }
 function compare(){
   const t=T[i],table=node('table'),head=node('tr');for(const txt of ['同一任務','任務完成','虛構燃料格','合理投入'])head.append(node('th',txt));table.append(head);
   for(const[label,r]of [['原地燃燒示範',bad[i]],['我的首次策略',first[i]],['我的最近驗收',latest[i]]]){const tr=node('tr');for(const txt of [label,r?r.done?'是':'尚未': '未驗收',r?String(r.fuel):'—',r?r.efficient?'符合本關':'可改善':'—'])tr.append(node('td',txt));table.append(tr);}
   const wrap=node('div');wrap.className='compare-wrap';wrap.append(table);$('compare-table').replaceChildren(wrap);
   $('bad-route').replaceChildren(node('h3','不良路線是什麼？'),...bad[i].steps.map(step=>node('p',step)),node('p',bad[i].done?'示範最後有做出任務，但多花了可避免的投入。':'這條示範甚至還沒取得完成任務的必要證據。'),node('pre',bad[i].output||bad[i].note));
 }
 function renderMedia(t,root){
   root.append(node('p','先挑要提供的媒介／資料。這是頁內示範，沒有真實檔案或AI上傳。'));
   const choices=node('div');choices.className='source-options';t.sources.forEach((src,n)=>choices.append(button(src.label+'〔首次檢視'+src.cost+'格〕'+(s.opened.includes(n)?'（已看）':''),'open',n,s.active===n)));root.append(choices);
   if(s.active!==null){const src=t.sources[s.active],record=node('section');record.className='source-record';record.append(node('h3',src.label));const pre=node('pre',src.text);pre.id='source-text';record.append(pre);
     if(src.kind==='image'){
       const mock=node('div');mock.className='mock-screen';mock.setAttribute('role','img');mock.setAttribute('aria-label',src.text);
       mock.append(node('strong','模擬畫面：'+(t.need.includes('layout')?'360px待辦清單':t.need.includes('sequence')?'拖曳後的最後位置':'待辦清單')));
       const b=node('span',t.need.includes('sequence')?'物件在右側':'送出／新增');b.className='mock-button';mock.append(b);
       if(t.need.includes('layout')){const notice=node('div','固定公告：這一塊正覆蓋送出按鈕');notice.className='mock-notice';mock.append(notice);}record.append(mock);
     }
     if(src.kind==='timeline'){
       record.append(node('p','預寫的時間軸觀察紀錄，不是真影片。把每個關鍵格看完，再判斷先後關係。'));
       const demo=node('div');demo.className='demo-stage';const box=node('div','物');box.className='drag-box';box.id='drag-box';demo.append(box);record.append(demo);
       const caption=node('p');caption.className='frame-caption';caption.id='frame-caption';record.append(caption);
       const l=node('label','關鍵格位置'),range=node('input');range.type='range';range.min=0;range.max=src.frames.length-1;range.step=1;range.value=s.frame;range.id='frame-slider';range.disabled=locked||paused;l.htmlFor=range.id;range.oninput=()=>dispatch('frame',Number(range.value),false);record.append(l,range);
       const buttons=node('div');buttons.className='actions';const prev=button('上一格','frame',s.frame-1),next=button('下一格','frame',s.frame+1);prev.id='frame-prev';next.id='frame-next';buttons.append(prev,next);record.append(buttons,node('p'));record.lastChild.id='frame-count';
     }
     if(src.kind==='long')record.append(node('p','長片只用這份摘要表示，不會真的播放90分鐘；12格是本關預設成本，不是影片Token或價錢。'));
     root.append(record);
   }
   root.append(node('h3','根據已看到的證據，提出下一步'));
   const answers=node('div');answers.className='options';t.answers.forEach((a,n)=>answers.append(button(a,'answer',n,s.answer===n)));root.append(answers);
 }
 function updateMedia(){
   const t=T[i];if(t.kind!=='media'||s.active===null)return;const src=t.sources[s.active];
   document.querySelectorAll('[data-action="answer"]').forEach(b=>b.setAttribute('aria-pressed',String(s.answer===JSON.parse(b.dataset.value))));
   if(src.kind!=='timeline')return;
   $('frame-caption').textContent=src.frames[s.frame].caption;$('drag-box').style.left=src.frames[s.frame].x+'%';$('frame-count').textContent='已觀察 '+s.seen[s.active].length+' / '+src.frames.length+' 個關鍵格；重看不增加遊戲燃料。';$('frame-slider').value=s.frame;
   for(const[id,target]of [['frame-prev',s.frame-1],['frame-next',s.frame+1]]){const b=$(id);b.dataset.value=JSON.stringify(target);b.disabled=locked||paused||target<0||target>=src.frames.length;b.onclick=()=>dispatch('frame',target);}
 }
 function renderPrompt(t,root){
   root.append(node('p','選資訊只是編輯草稿；按「模擬送出」才耗燃料。送出成本＝2格基本處理＋本次所附資訊的預設格數。'));
   const blocks=node('div');blocks.className='block-options';t.blocks.forEach((b,n)=>blocks.append(button((s.selected.includes(n)?'已附：':'可附：')+b.text+'〔每次送出+'+b.cost+'格〕','toggle',n,s.selected.includes(n))));root.append(blocks);
   root.append(node('h3','送出前的實際草稿'));const draft=node('pre',t.blocks.filter((_,n)=>s.selected.includes(n)).map(b=>b.text).join('\n')||'只有原本那句模糊要求，尚未附關鍵資訊。');draft.className='draft';draft.id='prompt-draft';root.append(draft,node('p','若現在送出，使用 '+(2+s.selected.reduce((n,k)=>n+t.blocks[k].cost,0))+' 格（遊戲成本）。'),button('模擬送出這份資訊／同題再問','run'));
   if(s.last){root.append(node('h3','最近一次模擬回覆'));const response=node('pre',s.last.response);response.className='draft';response.id='simulated-response';root.append(response,node('p','連續相同資訊組合的重送：'+s.repeats+' 次。'));
     const current=[...s.selected].sort((a,b)=>a-b).join(',');if(s.last.signature!==current)root.append(node('p','草稿已變更：必須重新模擬，不能拿舊回覆驗收新輸入。'));
   }
 }
 function renderReply(t,root){
   root.append(node('p','親手選要送出的內容，可調整先後。自由寫作不以關鍵字計分；本關只評這些預寫片段是否保留需求與限制。'));
   const blocks=node('div');blocks.className='block-options';t.blocks.forEach((b,n)=>blocks.append(button((s.selected.includes(n)?'保留：':'加入：')+b.text+'〔'+b.cost+'格〕','toggle',n,s.selected.includes(n))));root.append(blocks,node('h3','回覆格式'));
   const formats=node('div');formats.className='actions';E.formatNames.forEach((name,n)=>formats.append(button(name+'〔格式+'+E.formatCosts[n]+'格〕','format',n,s.format===n)));root.append(formats);
   const order=node('ol');order.className='order-list';s.order.forEach((idx,pos)=>{const li=node('li');li.append(node('span',t.blocks[idx].text));for(const[label,d]of [['上移',-1],['下移',1]]){const b=button(label,'move',[pos,d]);b.setAttribute('aria-label',label+t.blocks[idx].text);b.disabled=locked||paused||pos+d<0||pos+d>=s.order.length;li.append(b);}order.append(li);});root.append(order,node('h3','實際輸出草稿'));
   const draft=node('pre',E.text(t,s)||'（目前沒有內容）');draft.className='draft';draft.id='reply-draft';root.append(draft,node('p','草稿 '+E.text(t,s).length+' 字元，不是Token數；若送出約 '+E.replyCost(t,s)+' 格（固定遊戲成本）。'));
 }
 function renderStop(t,root){
   root.append(node('p','每個按鈕都是虛構操作；費用是遊戲格數，不會真的跑測試、部署或還原檔案。'));
   const choices=node('div');choices.className='options';t.actions.forEach(a=>choices.append(button(a.label+'〔'+a.cost+'格〕',a.id)));root.append(choices,node('h3','目前可核對的本版證據'));
   const evidence=node('div');evidence.className='proof-list';t.required.forEach(key=>{const name=t.actions.find(a=>a.id===key)?.label||key,v=s.evidence[key],p=node('p',name+'：'+(v===undefined?'尚未取得':v===s.version?'v'+v+'，與本版一致':'v'+v+'，對目前v'+s.version+'已過期'));if(v!==undefined&&v!==s.version)p.className='stale';evidence.append(p);});root.append(node('p','目前版本v'+s.version+(t.mode==='site'?'；正式站已模擬發布版本：'+(s.deployedVersion===null?'尚無':'v'+s.deployedVersion):'')),evidence);
 }
 function observe(){
   const t=T[i],root=$('observation');root.replaceChildren();
   if(t.kind==='media'){const covers=E.coverage(t,s);root.append(node('h3','本次觀察'),node('p','已開啟 '+s.opened.length+' 份示範資料；必要觀察已取得 '+t.need.filter(k=>covers.has(k)).length+' / '+t.need.length+'。'),node('p',s.note));}
   if(t.kind==='prompt')root.append(node('h3','這次是否帶來新資訊？'),node('p',s.note));
   if(t.kind==='reply')root.append(node('h3','精簡，不等於刪光'),node('p','必要內容 '+t.required.filter(k=>s.selected.some(n=>t.blocks[n].key===k)).length+' / '+t.required.length+' 項；確認還要符合本題格式'+(t.orderEdges?'與必要步驟順序。':'。')),node('p',s.note));
   if(t.kind==='stop')root.append(node('h3','實際模擬回條'),node('p',s.note));
   $('fuel').textContent=s.fuel+' 格';$('target').textContent='≤ '+t.target+' 格';$('quality').textContent=locked?(s.done?'任務完成':'還缺證據／內容'):'尚未驗收';
   $('confirm').disabled=locked||paused||!E.ready(t,s);$('selection').textContent=locked?'本次已鎖定。任務完成與投入是否合理分開看；重演保留首次。':E.ready(t,s)?'可驗收，但仍要看是否真的達成目標。':t.kind==='prompt'?'先送出目前草稿；修改後需重新模擬。':t.kind==='media'?'至少看一份資料並選下一步；時間軸要看完整關鍵格才算足夠觀察。':t.kind==='reply'?'先選必要片段與回覆格式。':'先做一個操作，再用證據決定是否收尾。';
 }
 function render(rebuild=true){
   const focus=document.activeElement?.id,t=T[i];if(rebuild){$('workspace').replaceChildren();({media:renderMedia,prompt:renderPrompt,reply:renderReply,stop:renderStop})[t.kind](t,$('workspace'));}
   updateMedia();observe();compare();if(rebuild&&focus&&$(focus)&&!$(focus).disabled)$(focus).focus({preventScroll:true});
 }
 function load(){s=E.initial(T[i]);locked=false;$('result').hidden=true;$('comparison').open=false;$('area').textContent=T[i].area;$('title').textContent=T[i].title;$('story').textContent=T[i].story;$('feedback').replaceChildren();$('retry').hidden=true;$('next').hidden=true;$('progress').textContent='第 '+(i+1)+' / 12 關 · 已驗收 '+latest.filter(Boolean).length+' 關';render();$('title').focus({preventScroll:true});}
 function reset(){started=true;paused=false;i=0;totalSpent=0;first.fill(null);latest.fill(null);$('overlay').hidden=true;$('game').hidden=false;$('start').hidden=true;$('result').hidden=true;$('reflection').value='';document.querySelectorAll('[name="habit"]').forEach(el=>el.checked=false);load();}
 $('start').onclick=reset;$('restart').onclick=reset;
 $('confirm').onclick=()=>{
   if(locked||paused||!E.ready(T[i],s))return;const before=s.fuel;s=E.act(T[i],s,'finish');totalSpent+=Math.max(0,s.fuel-before);if(!s.finished)return;locked=true;
   const r={done:s.done,efficient:s.efficient,fuel:s.fuel,text:describe(T[i],s),output:s.output};if(first[i]===null)first[i]={...r};latest[i]=r;
   $('feedback').replaceChildren(node('h3',s.done?s.efficient?'成果與投入都符合本題':'任務已完成，策略仍可更有效':'先補足必要條件，不獎勵空省'),node('p',T[i].why));if(!s.done)$('feedback').append(node('p',s.note));if(T[i].kind==='stop')$('feedback').append(node('pre',s.output));
   $('retry').hidden=false;$('next').hidden=false;$('next').textContent=i===11?'看習慣對照與行動清單':'下一個情境';render();
 };
 $('retry').onclick=()=>{if(!paused)load();};$('next').onclick=()=>{if(paused||!locked)return;if(i<11){i++;load();return;}$('result').hidden=false;$('result-title').textContent=latest.every(r=>r.efficient)?'12關有效策略完成，帶一項到真實任務':'本輪策略對照：完成與改進分開看';$('score').textContent='首次任務完成 '+first.filter(r=>r.done).length+' / 12；合理投入 '+first.filter(r=>r.efficient).length+' / 12。最近任務完成 '+latest.filter(r=>r.done).length+' / 12；合理投入 '+latest.filter(r=>r.efficient).length+' / 12。';
   $('totals').textContent='預寫不良路線：'+bad.reduce((n,r)=>n+r.fuel,0)+' 格，任務完成 '+bad.filter(r=>r.done).length+' / 12。最近策略合計：'+latest.reduce((n,r)=>n+r.fuel,0)+' 格（不含重演）。探索累計：'+totalSpent+' 格（含重演）。以上全為遊戲數值，完成程度不同時不能只比誰更省。';
   $('review').replaceChildren(...T.map((t,n)=>{const li=node('li',t.title+'：示範'+bad[n].fuel+'格；首次'+first[n].fuel+'格／任務'+(first[n].done?'完成':'未完')+'；最近'+latest[n].fuel+'格／任務'+(latest[n].done?'完成':'未完')+'／投入'+(latest[n].efficient?'合理':'可改善'));const d=node('details'),sum=node('summary','查看自己的策略與實際結果');d.append(sum,node('pre',latest[n].text),node('p',t.why));li.append(d);return li;}));$('result').scrollIntoView();};
 habits.forEach((text,n)=>{const l=node('label'),input=node('input');l.className='habit-label';input.type='radio';input.name='habit';input.value=n;l.append(input,document.createTextNode(text));$('habits').append(l);});
 $('download').onclick=()=>{if(latest.some(r=>!r))return;const chosen=document.querySelector('[name="habit"]:checked'),text='燃燒Token大挑戰｜虛構燃料格，不是實際Token或帳單\n'+$('score').textContent+'\n'+$('totals').textContent+'\n\n'+T.map((t,n)=>t.title+'\n預寫不良路線：'+bad[n].fuel+'格；任務'+(bad[n].done?'完成':'未完')+'\n首次：'+first[n].fuel+'格；任務'+(first[n].done?'完成':'未完')+'\n最近：'+latest[n].fuel+'格；任務'+(latest[n].done?'完成':'未完')+'；合理投入'+latest[n].efficient+'\n'+latest[n].text+'\n'+t.why).join('\n\n')+'\n\n下一次選擇的習慣：'+(chosen?habits[Number(chosen.value)]:'未選')+'\n我的自由筆記（不評分）：\n'+$('reflection').value;const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=node('a');a.href=url;a.download='燃燒Token大挑戰-策略與行動清單.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 function pause(){if(!started||paused)return;paused=true;$('overlay').hidden=false;render();$('resume').focus();}function resume(){paused=false;$('overlay').hidden=true;render();$('pause').focus();}$('pause').onclick=pause;$('resume').onclick=resume;window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&started&&!e.target?.closest?.('textarea')){e.preventDefault();paused?resume():pause();}});
 window.TokenValueGame=Object.freeze({snapshot:()=>JSON.parse(JSON.stringify({index:i,state:s,first,latest,totalSpent,paused}))});
})();
