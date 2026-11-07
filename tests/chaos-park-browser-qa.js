async function chaosParkQA(){
 const $=id=>document.getElementById(id),E=ChaosPark,check=(ok,t)=>{if(!ok)throw Error(t)};
 const choose=n=>{document.querySelector('[data-choice="'+n+'"]').click();check(!$('launch').disabled&&$('outcome').hidden,'只選擇不開鬧');$('launch').click();};
 const run=(mode,branch)=>{
  $('mode').value=mode;$('start').click();const total=mode==='all'?9:4;let n=0,seen=new Set(),records=[];
  while(!$('play').hidden&&n<10){
   const q=E.scenes.find(q=>q.title===$('title').textContent);check(q&&!seen.has(q.id),'園區不重複');seen.add(q.id);
   check($('stage').dataset.action==='idle'&&!$('stage').classList.contains('live')&&$('launch').disabled&&$('outcome').hidden,'新區清空');check($('note').textContent==='','舊災情清空');
   choose(branch);check($('stage').dataset.zone===q.id&&$('stage').dataset.action===String(branch),'場面對應招式');
   check($('disaster').textContent===q.actions[branch].badge&&$('note').textContent===q.actions[branch].note&&$('extra').textContent===q.actions[branch].extra,'災情不偷換分支');
   check(!$('outcome').hidden&&[...$('actions').querySelectorAll('button')].every(b=>b.disabled),'開鬧後鎖定');check($('detail-scene').textContent.length>0,'道具場面出現');
   const meter=$('meter').textContent;$('launch').click();check($('meter').textContent===meter,'不重複累加');
   $('replay').click();check($('launch').disabled&&$('outcome').hidden&&$('detail-scene').textContent===''&&$('stage').dataset.action==='idle','重演清空');
   choose((branch+1)%3); // 最後再重演回本輪要驗證的招式。
   $('replay').click();choose(branch);
   check($('meter').textContent===`混亂小火花 ${(n+1)*(branch+1)}`,'重演只取代、不重複累加');check(document.documentElement.scrollWidth<=innerWidth,'災情狀態無溢出');
   records.push(q);$('next').click();n++;
  }
  check(!$('result').hidden&&n===total,'完整離園');check($('album').children.length===total,'報表完整');
  records.forEach((q,i)=>check($('album').children[i].textContent.includes(q.actions[branch].note),'離園報表符合分支'));
  check($('summary').textContent.includes(`留下 ${total*(branch+1)} 顆`),'總計符合最近結果');check(document.documentElement.scrollWidth<=innerWidth,'報表無溢出');$('restart').click();return {mode,branch,total,mess:total*(branch+1)};
 };
 return [run('all',0),run('all',1),run('all',2),run('short',2)];
}
