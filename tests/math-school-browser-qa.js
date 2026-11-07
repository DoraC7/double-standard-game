async function mathSchoolQA(){
 const $=id=>document.getElementById(id),E=MathSchool;
 const check=(ok,label)=>{if(!ok)throw Error(label)};
 const run=(mode,skipAll=false)=>{
  $('mode').value=mode;$('start').click();let n=0,seen=new Set(),overflows=[];
  while(!$('play').hidden&&n<30){
   const q=E.questions.find(q=>q.title===$('question-title').textContent);check(q,'題目存在');check(!seen.has(q.id),'同輪不重複');seen.add(q.id);
   check($('confirm').disabled,'尚未選擇不能確認');check($('feedback').hidden,'答案先隱藏');
   if(document.documentElement.scrollWidth>innerWidth)overflows.push(q.id);
   if(skipAll||n===1){$('unsure').click();}
   else {
    const pick=v=>document.querySelector('[data-choice="'+v+'"]').click();
    pick(n===0?(q.answer+1)%q.options.length:q.answer);check(!$('confirm').disabled,'選後可確認');check($('feedback').hidden,'選擇不提前判分');$('confirm').click();
    if(n===0){$('retry').click();check($('confirm').disabled&&$('feedback').hidden,'重試清空選擇與解析');pick(q.answer);$('confirm').click();}
   }
   check(!$('feedback').hidden,'顯示解析');check($('feedback').textContent.includes(q.why),'解說符合本題');
   const before=$('score').textContent;document.querySelector('[data-choice="'+q.answer+'"]').click();check($('score').textContent===before,'鎖定首次結果');
   $('next').click();n++;
  }
  check(!$('result').hidden,'完成結算');check($('review').children.length===n,'完整回顧');check(!overflows.length,'無水平溢出');
  const expected=skipAll?0:n-2,latest=skipAll?0:n-1;
  check($('summary').textContent===`完成 ${n} 題，首次答對 ${expected} 題；重試後目前答對 ${latest} 題。`,'首次與最新分數');
  const summary=$('summary').textContent;$('restart').click();check(!$('intro').hidden,'重開回選單');return {mode,n,summary,overflows};
 };
 return [run('all'),run('short',true),...Object.keys(E.topics).map(t=>run(t))];
}
