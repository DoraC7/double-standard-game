async function ignoranceMegaphoneQA(){
 const $=id=>document.getElementById(id),E=IgnoranceMegaphone,check=(ok,t)=>{if(!ok)throw Error(t)};
 function setVolume(v){$('volume').value=v;$('volume').dispatchEvent(new Event('input',{bubbles:true}));}
 function choose(n){document.querySelector('[data-choice="'+n+'"]').click();}
 function run(mode,branch){
  $('mode').value=mode;$('start').click();const total=mode==='all'?12:mode==='short'?6:4;let count=0,first=0,misled=0,reached=0,seen=new Set(),snapshots=[];
  while(!$('play').hidden&&count<13){
   const q=E.cases.find(q=>q.title===$('title').textContent);check(q&&!seen.has(q.id),'同輪不重複');seen.add(q.id);
   check($('source').textContent===q.source,'完整資料已顯示');check($('confirm').disabled&&$('feedback').hidden&&$('volume').value==='40','新題狀態清空');
   const vol=[0,40,100][count%3],ok=branch===q.answer;
   setVolume(vol);check(document.documentElement.scrollWidth<=innerWidth,'擴音時無溢出');check($('confirm').disabled&&$('feedback').hidden,'調音量不判分');check($('reach').textContent.includes(String(vol*2)),'擴散預覽');
   choose(branch);check(!$('confirm').disabled&&$('feedback').hidden,'選句不提前判分');check($('preview').textContent.includes(q.options[branch]),'待播句子正確');$('confirm').click();
   check($('feedback').textContent.includes(q.why),'解說對應本題');check($('preview').textContent==='已播：'+q.options[branch],'實際播出所選句');check($('feedback').textContent.includes(ok?'這句有資料支持。':'音量很明確，證據卻沒有跟上。'),'真假判定不依音量');
   check($('volume').disabled&&[...$('options').querySelectorAll('button')].every(b=>b.disabled),'廣播後鎖定');
   first+=Number(ok);reached+=vol*2;if(!ok)misled+=vol*2;snapshots.push({q,vol,branch});
   const score=$('score').textContent;$('confirm').click();check($('score').textContent===score,'不能重複判分');
   $('retry').click();check($('confirm').disabled&&$('feedback').hidden&&$('volume').value==='40'&&!$('studio').classList.contains('air'),'重播清空狀態');
   setVolume(100-vol);choose(q.answer);$('confirm').click();check($('score').textContent===score,'重播不洗掉首次成績');$('next').click();count++;
   check(document.documentElement.scrollWidth<=innerWidth,'無水平溢出');
  }
  check(!$('result').hidden&&count===total,'完整結算');check($('review').children.length===total,'回顧完整');
  check($('summary').textContent===`完成 ${total} 題，首次有據 ${first} 題；最近有據 ${total} 題。首次擴散 ${reached} 人次，其中誤傳 ${misled} 人次。`,'首次與最新統計');
  snapshots.forEach(({q,vol,branch},i)=>{const text=$('review').children[i].textContent;check(text.includes('首次：'+q.options[branch])&&text.includes('首次擴音 '+vol),'回顧保留原句和音量');});
  $('restart').click();check(!$('intro').hidden,'重開');return {mode,branch,total,first,latest:total,reached,misled};
 }
 return [run('all',0),run('all',1),run('all',2),run('short',0),...Object.keys(E.topics).map(t=>run(t,1))];
}
