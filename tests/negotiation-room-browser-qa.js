async () => {
 const d=document,w=window,assert=(v,m)=>{if(!v)throw Error(m);};let samples=0;
 const fit=()=>{samples++;assert(d.documentElement.scrollWidth<=w.innerWidth,'overflow');};
 const find=t=>[...d.querySelectorAll('#app button')].find(b=>b.textContent.includes(t));
 const click=t=>{const b=find(t);assert(b&&!b.disabled,'missing/disabled: '+t);b.click();fit();};
 const choose=(values,k=0)=>{const selects=[...d.querySelectorAll('.offer')][k].querySelectorAll('select');values.forEach((v,i)=>{selects[i].value=String(v);selects[i].dispatchEvent(new Event('change',{bubbles:true}));});fit();};
 const answers=[[1,1],[1,1],[0,0],[0,1],[0,1],[0,1],[1,1],[0,1]];
 click('從第一關開始');
 // Verify focus pause, note state and native dialog lifecycle.
 d.getElementById('pause').click();assert(d.getElementById('pause-dialog').open,'pause');d.getElementById('resume').click();await new Promise(r=>w.requestAnimationFrame(()=>w.requestAnimationFrame(r)));assert(d.activeElement===d.getElementById('pause'),'pause focus');
 for(let i=0;i<8;i++){
  const good=w.NegotiationCases[i].opening[2];
  click(w.NegotiationCases[i].opening[i%3]);
  if(i%3!==2){assert(find('開始組方案').disabled,'repair not required');click('修復：');}
  // Each question reveals only its own answer, no substituted hint.
  if(i===0){click('開始組方案');assert(!d.getElementById('app').textContent.includes(w.NegotiationCases[i].questions[0][1]),'unasked leak');assert(d.getElementById('submit-offer').disabled,'empty proposal');click('回去問需求');}
  w.NegotiationCases[i].questions.forEach(([q,a])=>{assert(!d.getElementById('app').textContent.includes(a),'answer before question');click('問：'+q);assert(d.getElementById('app').textContent.includes(a),'wrong answer');});
  click('開始組方案');assert(d.getElementById('submit-offer').disabled,'default selected');
  if(i===0){choose([0,0]);click('送出這個方案');assert(d.getElementById('app').textContent.includes('反建議'),'missing counter');click('調整條件再談');}
  choose(answers[i]);
  if(i===5){click('增加方案 B');assert(d.getElementById('submit-offer').disabled,'incomplete B');choose([1,1],1);click('同時提出');assert(d.querySelectorAll('.panel').length>0,'MESO response');}else click('送出這個方案');
  if(i===6){assert(d.getElementById('app').textContent.includes('超過你的底線'),'unsafe counter unmarked');click('考慮反建議');click('雙方確認誰負責');assert(d.getElementById('app').textContent.includes('答應了超出底線'),'unsafe acceptance credited');click('重練本案');click(good);w.NegotiationCases[i].questions.forEach(([q])=>click('問：'+q));click('開始組方案');choose(answers[i]);click('送出這個方案');click('不成交');assert(d.getElementById('app').textContent.includes('首次收尾：答應了超出底線'),'first overwritten');assert(d.getElementById('app').textContent.includes('守住界線'),'no-zone walk');}
  else{click('採用並核對');if(i===1){click('就這樣');assert(d.getElementById('app').textContent.includes('交接仍模糊'),'vague accepted as clear');click('重練本案');click(good);w.NegotiationCases[i].questions.forEach(([q])=>click('問：'+q));click('開始組方案');choose(answers[i]);click('送出這個方案');click('採用並核對');}click('雙方確認誰負責');assert(d.getElementById('app').textContent.includes('完成核對'),'clear missing');}
  const note=d.querySelector('textarea');note.value='自己的話 <script>只是文字</script>';note.dispatchEvent(new Event('input',{bubbles:true}));
  click(i<7?'下一關':'完成本輪');
 }
 assert(d.getElementById('app').textContent.includes('已練習 8 / 8'),'incomplete summary');assert(d.querySelectorAll('#app details').length===8,'missing reviews');
 let blob;const oldURL=URL.createObjectURL,oldClick=HTMLAnchorElement.prototype.click;URL.createObjectURL=b=>{blob=b;return 'blob:qa';};HTMLAnchorElement.prototype.click=function(){};
 try{click('下載本輪文字紀錄');const text=await blob.text();assert(text.includes('自己的話 <script>只是文字</script>'),'export changed literal');assert(text.includes('提案：'),'missing proposal log');}finally{URL.createObjectURL=oldURL;HTMLAnchorElement.prototype.click=oldClick;}
 click('選擇關卡');click('01 入門');click(w.NegotiationCases[0].opening[2]);w.dispatchEvent(new Event('blur'));assert(d.getElementById('pause-dialog').open,'blur pause');d.getElementById('resume').click();
 return {viewport:[innerWidth,innerHeight],samples,cases:8,checks:'all questions, 3 openings, repair gating, missing selection, counter/reoffer, MESO, unsafe acceptance, safe walk, vague/clear closure, first/latest, literal TXT, pause/blur/focus'};
}
