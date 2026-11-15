(()=>{
  'use strict';
  const D=window.TypeCompassData,E=window.TypeCompassEngine,$=id=>document.getElementById(id);
  const intro=$('intro'),play=$('play'),result=$('result');
  let mode='full',set=[],answers={},index=0;
  const responseLabels=['很像左側','比較像左側','看情況／都像','比較像右側','很像右側'];
  const responseHints=['明顯比較像左側','有一點比較像左側','兩邊都像或要看情境','有一點比較像右側','明顯比較像右側'];
  function show(section){intro.hidden=section!==intro;play.hidden=section!==play;result.hidden=section!==result;window.scrollTo(0,0);}
  function question(){return set[index];}
  function render(){
    const q=question(),axis=D.axes.find(x=>x.id===q.axis);
    $('mode-label').textContent=mode==='quick'?'平衡快測 / 每個向度各 5 題':'完整探索 / 每個向度各 10 題';
    $('question-title').textContent=`${index+1}．${axis.first} / ${axis.second}`;
    $('progress-label').textContent=`第 ${index+1} / ${set.length} 題`;
    $('progress').max=set.length;$('progress').value=index;
    $('progress').setAttribute('aria-valuetext',`第 ${index+1} 題，共 ${set.length} 題`);
    $('axis-tag').textContent=`${axis.name}｜${axis.first} ${axis.firstName} ↔ ${axis.second} ${axis.secondName}`;
    $('prompt').textContent=q.prompt;$('left-copy').textContent=q.left;$('right-copy').textContent=q.right;
    const chosen=answers[q.id];
    const options=$('response-options');options.replaceChildren();
    E.ANSWER_VALUES.forEach((value,i)=>{
      const b=document.createElement('button');b.type='button';b.textContent=responseLabels[i];
      b.setAttribute('aria-pressed',String(chosen===value));
      b.setAttribute('aria-label',`${responseHints[i]}。${responseLabels[i]}`);
      b.addEventListener('click',()=>select(value));options.append(b);
    });
    $('answer-status').textContent=Number.isInteger(chosen)?`已選：${responseHints[E.ANSWER_VALUES.indexOf(chosen)]}`:'尚未作答；不確定時選看情況。';
    $('back').disabled=index===0;$('next').disabled=!Number.isInteger(chosen);
    $('next').textContent=index===set.length-1?'看我的分析 →':'下一題 →';
  }
  function select(value){answers[question().id]=value;render();$('response-options').querySelector(`[aria-pressed="true"]`)?.focus();}
  function move(delta){index=Math.max(0,Math.min(set.length-1,index+delta));render();$('question-title').focus();}
  function polarityText(axisResult){
    if(Math.abs(axisResult.position)<=0.15)return axisResult.middleText;
    return axisResult.score>0?axisResult.firstText:axisResult.secondText;
  }
  function experimentFor(id,letter){
    const first=letter===D.axes.find(a=>a.id===id).first;
    const ideas={
      EI:first?'重要想法先留幾分鐘寫下來，再找人交換意見。':'找一位信任的人口頭講一遍，觀察自己是否因此更容易整理想法。',
      SN:first?'先問一次「還有哪些可能或模式值得留意？」':'把大方向拆成一個可以觀察、核對的具體下一步。',
      TF:first?'最後多問一句「這個決定會怎麼影響相關的人？」':'最後多問一句「同樣原則用在相似情況，結果是否一致？」',
      JP:first?'替計畫保留一個有邊界的彈性備案。':'替開放任務設定一個很小的檢查點，不必一次把全程排死。'
    };
    return ideas[id];
  }
  function showResult(){
    const r=E.calculate(D,set,answers);
    $('result-title').textContent=`${r.type}｜${r.name}（本輪暫定）`;
    $('summary').textContent=`你完成 ${r.answered} 題。這個組合只是把本輪偏好方向濃縮成一個好讀的索引；每個字母都要回頭看分軸結果，尤其接近中線時。`;
    $('type-code').textContent=`暫定組合：${r.type}　｜　非官方評量結果`;
    const cards=$('axis-cards');cards.replaceChildren();
    for(const a of r.axes){
      const card=document.createElement('article');card.className='tc-axis-card';
      const h=document.createElement('h4');h.textContent=`${a.name}：${a.letter} ${a.letter===a.first?a.firstName:a.secondName}`;
      const copy=document.createElement('p');copy.className='tc-axis-copy';copy.textContent=polarityText(a);
      const scale=document.createElement('div');scale.className='tc-axis-scale';
      const left=document.createElement('span');left.textContent=`${a.first} ${a.firstName}`;
      const right=document.createElement('span');right.textContent=`${a.second} ${a.secondName}`;scale.append(left,right);
      const track=document.createElement('div');track.className='tc-axis-track';track.setAttribute('role','img');track.setAttribute('aria-label',`${a.name}，本次回答位置：${a.letter} 方向；${a.level}`);
      const marker=document.createElement('span');marker.className='tc-axis-marker';marker.style.left=`${a.barPercent}%`;track.append(marker);
      const score=document.createElement('p');score.className='tc-axis-score';score.textContent=`${a.level}｜本題組 ${a.answered}/${a.total} 題有效作答`;
      card.append(h,copy,scale,track,score);cards.append(card);
    }
    $('blend').textContent=r.axes.map(a=>`${a.name}：${polarityText(a)}`).join(' ');
    $('experiment').textContent=r.axes.map(a=>experimentFor(a.id,a.letter)).join(' ');
    const reflections=[
      '哪幾題最像平常的你？哪幾題會因工作、家人或朋友等角色而改變？',
      '你選的是感到自在的偏好，還是目前環境要求你採取的做法？',
      '下次遇到不同情境時，哪一種反向策略值得小試一次？'
    ];
    $('reflect-prompts').replaceChildren(...reflections.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
    show(result);$('result-title').focus();
  }
  function restart(){mode='full';set=[];answers={};index=0;show(intro);$('full-start').focus();}
  $('quick-start').addEventListener('click',()=>start('quick'));
  $('full-start').addEventListener('click',()=>start('full'));
  function start(which){mode=which;set=E.createSet(D,mode);answers={};index=0;show(play);render();$('question-title').focus();}
  $('back').addEventListener('click',()=>move(-1));
  $('next').addEventListener('click',()=>{if(!Number.isInteger(answers[question().id]))return;if(index<set.length-1)move(1);else showResult();});
  $('exit').addEventListener('click',restart);
  $('edit').addEventListener('click',()=>{index=0;show(play);render();$('question-title').focus();});
  $('restart').addEventListener('click',restart);
  $('download').addEventListener('click',()=>{
    const text=E.exportText(E.calculate(D,set,answers),set,answers);
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='16型偏好探索-本機報告.txt';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  document.addEventListener('keydown',event=>{
    if(play.hidden||event.altKey||event.ctrlKey||event.metaKey||!['1','2','3','4','5'].includes(event.key))return;
    if(event.target instanceof HTMLButtonElement)return;
    event.preventDefault();select(E.ANSWER_VALUES[Number(event.key)-1]);
  });
})();
