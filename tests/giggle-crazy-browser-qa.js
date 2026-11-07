async function giggleCrazyQA(){
 const $=id=>document.getElementById(id),E=GiggleCrazy,check=(ok,t)=>{if(!ok)throw Error(t)};
 const run=(mode,choice)=>{
  $('mode').value=mode;$('start').click();let n=0,seen=new Set(),selected=[];const total=mode==='all'?12:4;
  while(!$('play').hidden&&n<13){
   const item=E.items.find(q=>q.name===$('name').textContent);check(item&&!seen.has(item.id),'怪東西不重複');seen.add(item.id);
   check($('next').disabled&&$('stage').dataset.kind==='idle'&&$('poke-note').textContent==='','新顆清空狀態');check($('critter').querySelector('svg'),'插圖存在');
   $('critter').click();check(!$('poke-note').textContent.includes('undefined')&&$('poke-note').textContent.length>0,'戳出泡泡');check($('next').disabled,'戳戳不代替反應');
   for(const r of [(choice+1)%3,choice]){
    document.querySelector('[data-reaction="'+r+'"]').click();check($('stage').dataset.kind===E.reactions[r].kind,'反應改變姿勢');check($('reply').textContent===E.reactions[r].label+'！'+item.reactions[r],'變身不是別種反應');check(!$('next').disabled,'每種都能前進');
    check($('bubbles').textContent===`笑泡泡 ${n+1} / ${total}`,'切換不重複加泡泡');check(document.querySelector('[data-reaction="'+r+'"]').getAttribute('aria-pressed')==='true','已選可辨識');
   }
   check(document.documentElement.scrollWidth<=innerWidth,'反應後不溢出');selected.push(item);$('next').click();n++;
  }
  check(!$('result').hidden&&n===total,'完整笑場');check($('album').children.length===total,'相簿完整');check($('summary').textContent===`收集 ${total} 顆笑泡泡，還戳了 ${total} 下！哈哈哈哈哈！`,'泡泡與戳戳數量');
  selected.forEach((item,i)=>check($('album').children[i].textContent.includes(item.reactions[choice]),'相簿保留所選變身'));
  check($('counts').children[choice].textContent.endsWith('× '+total),'反應統計');check(document.documentElement.scrollWidth<=innerWidth,'相簿無溢出');$('restart').click();check(!$('intro').hidden,'重開笑場');return {mode,choice,total,allReactionsAccepted:true};
 };
 return [run('all',0),run('all',1),run('all',2),run('short',2)];
}
