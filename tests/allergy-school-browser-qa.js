async function allergySchoolQA(){
 const $=id=>document.getElementById(id),E=AllergySchool,check=(ok,t)=>{if(!ok)throw Error(t);};
 function run(mode,unsure=false){
  $('mode').value=mode;$('start').click();let n=0,seen=new Set(),misses=0,topics={};
  while(!$('lesson').hidden&&n<50){
   const q=E.questions.find(q=>q.title===$('title').textContent);check(q&&!seen.has(q.id),'題目存在且本輪不重複');seen.add(q.id);topics[q.topic]=(topics[q.topic]||0)+1;
   check($('confirm').disabled&&$('feedback').hidden,'新題未預選、答案未顯示');check(document.documentElement.scrollWidth<=innerWidth,'題幹無水平溢位');
   if(unsure){$('unsure').click();}
   else {const pick=v=>document.querySelector('[data-choice="'+v+'"]').click();pick(n===0?(q.answer+1)%3:q.answer);check($('feedback').hidden&&!$('confirm').disabled,'選擇不提前判分');$('confirm').click();if(n===0){misses++;$('retry').click();check($('feedback').hidden&&$('confirm').disabled,'重試清空狀態');pick(q.answer);$('confirm').click();}}
   check(!$('feedback').hidden&&$('feedback').textContent.includes(q.why),'顯示本題解析');check($('feedback').querySelector('a').href===E.sources[q.source][1],'來源連結正確');check(document.documentElement.scrollWidth<=innerWidth,'解析無水平溢位');
   const score=$('score').textContent;document.querySelector('[data-choice="'+q.answer+'"]').click();check($('score').textContent===score,'鎖定後不能覆寫首次結果');$('next').click();n++;
  }
  check(!$('result').hidden&&$('review').children.length===n,'結算與逐題回顧完整');
  if(mode==='short')for(const topic of Object.keys(E.topics))check(topics[topic]>=3,'混合局每單元至少3題');
  const expected=unsure?0:n-misses;check($('summary').textContent.includes(`首次答對 ${expected} 題`),'首次分數正確');const result={mode,n,topics,expected};$('restart').click();check(!$('intro').hidden,'重開回到選單');return result;
 }
 return [run('all'),run('short',true),...Object.keys(E.topics).map(t=>run(t))];
}
