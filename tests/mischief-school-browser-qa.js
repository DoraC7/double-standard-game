async function mischiefSchoolQA(){
 const $=id=>document.getElementById(id),E=MischiefSchool,check=(ok,t)=>{if(!ok)throw Error(t)};
 const choose=n=>{check($('confirm').disabled,'未選不能確認');document.querySelector('[data-choice="'+n+'"]').click();check(!$('confirm').disabled,'選後可確認');$('confirm').click();};
 const run=(mode,branch)=>{
  $('mode').value=mode;$('start').click();let count=0,points=0,seen=new Set(),notes=[];
  const total=mode==='all'?12:mode==='short'?6:4;
  while(!$('play').hidden&&count<13){
   const q=E.scenes.find(q=>q.title===$('title').textContent);check(q&&!seen.has(q.id),'幕不重複');seen.add(q.id);
   check($('stage').dataset.effect==='idle'&&$('stage-note').textContent==='道具還沒上場。','新幕清空舞台');
   check(document.documentElement.scrollWidth<=innerWidth,'不溢出');
   choose(branch);check($('stage').dataset.effect===q.props[branch].effect,'效果符合所選道具');check($('stage-note').textContent===q.props[branch].note,'結果不是偷換的道具');notes.push(q.props[branch].note);
   const after=$('score').textContent;$('confirm').click();check($('score').textContent===after,'不重複提交');$('next').click();
   check($('stage-note').textContent===q.props[branch].note,'收尾前保留實際結果');check(document.querySelector('[data-choice="'+branch+'"]').textContent===q.props[branch].cleanup,'收尾選項對應真實分支');
   choose(branch);check($('feedback').textContent.includes('這個場面收對了。'),'依分支收對尾');points+=1+Number(branch===q.target);$('next').click();count++;
  }
  check(!$('result').hidden&&count===total,'完整結算');check($('review').children.length===total,'回顧完整');
  check($('summary').textContent===`完成 ${total} 幕，首次 ${points} / ${total*2} 點；最近 ${points} 點。`,'正確總分');
  const reviews=[...$('review').children];notes.forEach((note,i)=>check(reviews[i].textContent.includes(note),'回顧保留該分支結果'));
  $('restart').click();check(!$('intro').hidden,'重新開始');return {mode,branch,count,points};
 };
 const results=[run('all',0),run('all',1),run('all',2),run('short',0),...Object.keys(E.topics).map(t=>run(t,2))];
 // 重演時換掉最初道具，確保舞台和收尾都不沿用上一輪。
 $('mode').value='all';$('start').click();const q=E.scenes.find(q=>q.title===$('title').textContent),wrong=(q.target+1)%3;
 choose(wrong);$('next').click();choose((wrong+1)%3);$('retry').click();
 check($('stage').dataset.effect==='idle'&&$('stage-note').textContent==='道具還沒上場。'&&$('confirm').disabled,'重演清空結果');
 choose(q.target);$('next').click();choose(q.target);check($('score').textContent==='首次 0 點','重演不覆寫首次');
 $('leave').click();results.push({retryClearsBranch:true,firstPreserved:true});return results;
}
