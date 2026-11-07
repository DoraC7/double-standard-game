async function houseworkSchoolQA(){
 const $=id=>document.getElementById(id),E=HouseworkSchool,check=(v,t)=>{if(!v)throw Error(t)};
 const run=(mode,skipAll=false)=>{
  $('mode').value=mode;$('start').click();let n=0,missKinds=new Set(),seen=new Set(),expectedTotal=mode==='all'?24:mode==='short'?8:6;
  const arrange=goal=>{
   for(let pos=0;pos<goal.length;pos++){
    for(let guard=0;guard<3;guard++){
     const rows=[...document.querySelectorAll('.step-list li')],idx=rows.findIndex(r=>Number(r.dataset.step)===goal[pos]);
     if(idx===pos)break;rows[idx].querySelector('[data-delta="-1"]').click();
    }
   }
  };
  while(!$('play').hidden&&n<30){
   const q=E.questions.find(q=>q.title===$('question-title').textContent);check(q&&!seen.has(q.id),'題目不重複');seen.add(q.id);
   check($('confirm').disabled&&$('feedback').hidden,'新題清除狀態');check(document.documentElement.scrollWidth<=innerWidth,'無水平溢出');
   const pick=wrong=>{if(q.kind==='order')arrange(wrong?[1,0,2]:[0,1,2]);else document.querySelector('[data-choice="'+(wrong?(q.answer+1)%3:q.answer)+'"]').click();check(!$('confirm').disabled&&$('feedback').hidden,'先操作不提前判分');};
   if(skipAll||n===expectedTotal-1)$('unsure').click();
   else {
    const miss=!missKinds.has(q.kind);pick(miss);$('confirm').click();
    if(miss){missKinds.add(q.kind);$('retry').click();check($('confirm').disabled&&$('feedback').hidden,'重試清空');pick(false);$('confirm').click();}
   }
   check(!$('feedback').hidden&&$('feedback').textContent.includes(q.why),'解析符合本題');
   check([...$('options').querySelectorAll('button')].every(b=>b.disabled),'操作已鎖定');
   const score=$('score').textContent;[...$('options').querySelectorAll('button')].forEach(b=>b.click());check($('score').textContent===score,'鎖定後不可覆寫');$('next').click();n++;
  }
  check(!$('result').hidden&&n===expectedTotal,'結算題數');check($('review').children.length===n,'回顧完整');
  const first=skipAll?0:n-missKinds.size-1,latest=skipAll?0:n-1;
  check($('summary').textContent===`完成 ${n} 題，首次答對 ${first} 題；重試後目前答對 ${latest} 題。`,'首次與最新成績');
  const result={mode,n,first,latest,interactionKinds:[...missKinds]};$('restart').click();check(!$('intro').hidden,'重開');return result;
 };
 return [run('all'),run('short',true),...Object.keys(E.topics).map(t=>run(t))];
}
