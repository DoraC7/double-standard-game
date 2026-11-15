(()=>{
  'use strict';
  const D=window.TypeCompassData,E=window.TypeCompassEngine,$=id=>document.getElementById(id);
  const intro=$('intro'),play=$('play'),result=$('result');
  let mode='standard',set=[],answers={},index=0;
  const responseLabels=['很像左側','比較像左側','兩側相近／依情境切換','比較像右側','很像右側'];
  const responseHints=['明顯比較像左側','有一點比較像左側','兩側相近，或知道自己會依情境切換','有一點比較像右側','明顯比較像右側'];
  function show(section){intro.hidden=section!==intro;play.hidden=section!==play;result.hidden=section!==result;window.scrollTo(0,0);}
  function question(){return set[index];}
  function render(){
    const q=question(),axis=D.axes.find(x=>x.id===q.axis);
    $('mode-label').textContent={quick:'快測 / 每軸 5 題',standard:'標準探索 / 每軸 10 題',full:'完整探索 / 每軸 20 題'}[mode];
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
    const skip=document.createElement('button');skip.type='button';skip.textContent='無法判斷／不適用（不計分）';skip.setAttribute('aria-pressed',String(chosen===null));skip.addEventListener('click',()=>select(null));options.append(skip);
    $('answer-status').textContent=chosen===null?'已選：無法判斷／不適用，不計分。':Number.isInteger(chosen)?`已選：${responseHints[E.ANSWER_VALUES.indexOf(chosen)]}`:'尚未作答；無法判斷時請選不計分選項。';
    $('back').disabled=index===0;$('next').disabled=!(Number.isInteger(chosen)||chosen===null);
    $('next').textContent=index===set.length-1?'看我的分析 →':'下一題 →';
  }
  function select(value){answers[question().id]=value;render();$('response-options').querySelector(`[aria-pressed="true"]`)?.focus();}
  function move(delta){index=Math.max(0,Math.min(set.length-1,index+delta));render();$('question-title').focus();}
  function polarityText(axisResult){
    if(!axisResult.sufficient)return '有效作答不足，暫不解讀方向；這不表示你的偏好居中。';
    if(Math.abs(axisResult.position)<=0.15)return axisResult.middleText+' 平均居中也可能是不同情境方向互相抵銷，不表示每題都居中；請核對下方分布與下載明細。';
    return axisResult.score>0?axisResult.firstText:axisResult.secondText;
  }
  function experimentFor(id,letter,sufficient){
    if(!sufficient)return '此向度有效作答不足：先檢查題目是否適用，無須勉強選答案。';
    if(letter==='?')return '這個向度本輪接近中線：留意自己在不同角色、熟悉度與壓力下何時偏向哪一側，不必刻意練某個方向。';
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
    $('result-title').textContent=`${r.type}｜${r.name}（本輪方向索引）`;
    $('summary').textContent=`有效作答 ${r.answered}/${r.total} 題（版本 ${r.version}）。這個索引只濃縮本輪偏好方向；「?」表示該軸接近中線或有效作答不足，不強行分類。題數較多能增加情境涵蓋，但未經試測，不能因此宣稱更準。`;
    $('type-code').textContent=`本輪方向索引：${r.type}　｜　非官方、未驗證的自我反思結果`;
    const cards=$('axis-cards');cards.replaceChildren();
    for(const a of r.axes){
      const card=document.createElement('article');card.className='tc-axis-card';
      const h=document.createElement('h4');h.textContent=`${a.name}：${a.decisive?`${a.letter} ${a.letter===a.first?a.firstName:a.secondName}`:a.sufficient?'接近中線（不分側）':'有效作答不足（不分側）'}`;
      const copy=document.createElement('p');copy.className='tc-axis-copy';copy.textContent=polarityText(a);
      const scale=document.createElement('div');scale.className='tc-axis-scale';
      const left=document.createElement('span');left.textContent=`${a.first} ${a.firstName}`;
      const right=document.createElement('span');right.textContent=`${a.second} ${a.secondName}`;scale.append(left,right);
      const track=document.createElement('div');track.className='tc-axis-track';track.setAttribute('role','img');track.setAttribute('aria-label',`${a.name}，本次回答位置：${!a.sufficient?'有效作答不足':a.displayLetter==='?'?'接近中線':`${a.letter} 方向`}；${a.level}`);
      const marker=document.createElement('span');marker.className='tc-axis-marker';marker.hidden=!a.sufficient;marker.style.left=`${a.barPercent}%`;track.append(marker);
      const score=document.createElement('p');score.className='tc-axis-score';score.textContent=`${a.level}｜本題組 ${a.answered}/${a.total} 題有效作答｜情境涵蓋 ${a.coveredFacets}/${a.facetTotal} 類（編輯分類，非子量表）｜${a.first} 側 ${a.firstCount}／${a.second} 側 ${a.secondCount}／居中 ${a.neutralCount}`;
      card.append(h,copy,scale,track,score);cards.append(card);
    }
    $('blend').textContent=r.axes.map(a=>`${a.name}：${polarityText(a)}`).join(' ');
    $('experiment').textContent=r.axes.map(a=>experimentFor(a.id,a.displayLetter,a.sufficient)).join(' ');
    const reflections=[
      '哪幾題最像平常的你？哪幾題會因工作、家人或朋友等角色而改變？',
      '你選的是感到自在的偏好，還是目前環境要求你採取的做法？',
      '下次遇到不同情境時，哪一種反向策略值得小試一次？'
    ];
    $('reflect-prompts').replaceChildren(...reflections.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
    show(result);$('result-title').focus();
  }
  function restart(){mode='standard';set=[];answers={};index=0;show(intro);$('standard-start').focus();}
  $('standard-start').addEventListener('click',()=>start('standard'));
  $('quick-start').addEventListener('click',()=>start('quick'));
  $('full-start').addEventListener('click',()=>start('full'));
  function start(which){mode=which;set=E.createSet(D,mode);answers={};index=0;show(play);render();$('question-title').focus();}
  $('back').addEventListener('click',()=>move(-1));
  $('next').addEventListener('click',()=>{if(!(Number.isInteger(answers[question().id])||answers[question().id]===null))return;if(index<set.length-1)move(1);else showResult();});
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
