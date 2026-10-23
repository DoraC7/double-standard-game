(() => {
  'use strict';
  const Q=DoraQuotes,$=id=>document.getElementById(id);
  const saved=new Set(),seen=new Set();
  let current=null,tag='all',bag=[],quiz=null;
  function mode(name){
    const draw=name==='draw';
    $('draw-panel').hidden=!draw;$('quiz-panel').hidden=draw;
    $('draw-mode').setAttribute('aria-pressed',String(draw));$('quiz-mode').setAttribute('aria-pressed',String(!draw));
    if(!draw&&!quiz)startQuiz();
  }
  function showCard(card){
    current=card;seen.add(card.id);
    $('quote-text').textContent=card.display||card.prefix+'\n'+card.answer;
    $('quote-kind').textContent=Q.label(card);
    $('quote-number').textContent='NO. '+String(Q.cards.indexOf(card)+1).padStart(3,'0');
    $('quote-tag').textContent=card.tag;$('quote-note').textContent=card.note;
    $('quote-source').replaceChildren();
    if(card.kind==='published'){
      const a=document.createElement('a');a.href=card.id==='foil'?'index.html':'emotion-printer.html';a.textContent='來源：既有公開遊戲（非本人引言） ↗';$('quote-source').append(a);
    }else $('quote-source').textContent=card.kind==='commissioned'?'來源：本次明確指定的遊戲台詞（非歷史引言）':card.kind==='selected'?'來源：本次系列用語選編（未核對歷史聊天原文）':'來源：本遊戲原創喜劇改編（非本人引言）';
    $('collection-count').textContent=`本頁已看 ${seen.size} / ${Q.cards.length}`;
    $('save').textContent=saved.has(card.id)?'取消收藏 ♥':'收藏這句 ♡';
  }
  function draw(){
    if(bag.length===1&&bag[0].id===current?.id)bag=[];
    if(!bag.length){
      bag=Q.shuffle(Q.pool(tag));
      if(bag.length>1&&bag.at(-1).id===current?.id)[bag[0],bag[bag.length-1]]=[bag.at(-1),bag[0]];
    }
    if(bag.length>1&&bag.at(-1).id===current?.id)[bag[0],bag[bag.length-1]]=[bag.at(-1),bag[0]];
    showCard(bag.pop());$('draw-status').textContent=`抽到「${Q.text(current)}」・${Q.label(current)}`;
    $('copy-fallback').hidden=true;
  }
  function setFilter(value){
    tag=value;bag=[];
    document.querySelectorAll('[data-tag]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tag===tag)));
    draw();
  }
  function collection(){
    $('saved-list').replaceChildren();
    $('download').disabled=!saved.size;$('collection-empty').hidden=!!saved.size;
    for(const c of Q.cards.filter(c=>saved.has(c.id))){
      const li=document.createElement('li'),small=document.createElement('small'),p=document.createElement('p'),b=document.createElement('button');
      small.textContent=Q.label(c);p.textContent=Q.text(c);b.type='button';b.textContent='翻開這張 ↗';b.setAttribute('aria-label','翻開：'+Q.text(c));
      b.addEventListener('click',()=>{mode('draw');if(!Q.pool(tag).includes(c)){tag='all';bag=[];document.querySelectorAll('[data-tag]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.tag==='all')));}showCard(c);$('draw-status').textContent='已翻開收藏的卡片。';$('draw-title').scrollIntoView({block:'start'});});
      li.append(small,p,b);$('saved-list').append(li);
    }
  }
  function exportText(card){return `多拉語錄・金句開壇｜喜劇選集，改編不冒充本人發言\n${Q.label(card)}\n${Q.text(card)}\n${card.note}\n`+(card.source?`公開遊戲來源檔：${card.source}\n`:'');}
  async function copyText(text,success){
    try{if(!navigator.clipboard?.writeText)throw new Error('clipboard unavailable');await navigator.clipboard.writeText(text);$('draw-status').textContent=success;$('copy-fallback').hidden=true;}
    catch{$('copy-fallback').value=text;$('copy-fallback').hidden=false;$('copy-fallback').focus();$('copy-fallback').select();$('draw-status').textContent='未能自動複製，請在下方文字框手動複製。';}
  }
  function startQuiz(){quiz=Q.round();$('quiz-result').hidden=true;$('question-area').hidden=false;renderQuestion();}
  function renderQuestion(){
    const c=quiz.deck[quiz.index];
    $('quiz-count').textContent=`第 ${quiz.index+1} / 8 句`;$('quiz-progress').value=quiz.answers.length;
    $('quiz-kind').textContent=Q.label(c);$('quiz-prefix').textContent=c.prefix;
    $('quiz-options').replaceChildren();$('quiz-feedback').hidden=true;$('quiz-feedback').replaceChildren();$('quiz-next').hidden=true;
    Q.shuffle([c.answer,...c.wrong]).forEach(value=>{
      const b=document.createElement('button');b.type='button';b.textContent=value;
      b.addEventListener('click',()=>{
        if(!Q.answer(quiz,value))return;
        const correct=value===c.answer;
        $('quiz-options').querySelectorAll('button').forEach(x=>{x.disabled=true;if(x.textContent===c.answer)x.classList.add('correct');else if(x===b)x.classList.add('incorrect');});
        const title=document.createElement('b'),text=document.createElement('p'),note=document.createElement('p');
        title.textContent=correct?'接上了！✦':'這壇接歪了，也有笑點。';text.textContent='這張卡的下一句：'+c.answer;note.textContent=Q.label(c)+'。'+c.note;
        $('quiz-feedback').append(title,text,note);$('quiz-feedback').hidden=false;$('quiz-progress').value=quiz.answers.length;
        $('quiz-next').textContent=quiz.index===7?'看本壇結算 →':'下一句 →';$('quiz-next').hidden=false;$('quiz-next').focus();
      });
      $('quiz-options').append(b);
    });
  }
  function result(){
    $('question-area').hidden=true;$('quiz-result').hidden=false;$('quiz-count').textContent='8 / 8 句完成';
    const score=quiz.answers.filter(a=>a.correct).length;$('result-title').textContent=`本壇接上 ${score} / 8 句`;
    $('quiz-review').replaceChildren();
    quiz.answers.forEach(a=>{const c=Q.cards.find(c=>c.id===a.id),li=document.createElement('li'),small=document.createElement('small');li.textContent=(a.correct?'✓ ':'↺ ')+Q.text(c);small.textContent=Q.label(c)+(a.correct?'':'｜你選的是：'+a.value);li.append(small);$('quiz-review').append(li);});
    $('result-title').focus();
  }
  $('draw').addEventListener('click',draw);
  document.querySelectorAll('[data-tag]').forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.tag)));
  $('save').addEventListener('click',()=>{const adding=!saved.has(current.id);if(adding)saved.add(current.id);else saved.delete(current.id);showCard(current);collection();$('draw-status').textContent=adding?'已收藏在本分頁；要永久保留請下載典藏。':'已取消收藏。';});
  $('copy').addEventListener('click',()=>copyText(exportText(current),'金句已複製，包含虛構改編標示。'));
  $('share').addEventListener('click',()=>{const url=new URL(location.href);url.search='';url.hash='q='+current.id;copyText(url.href,'這張卡的連結已複製，不含收藏或答題紀錄。');});
  $('download').addEventListener('click',()=>{if(!saved.size)return;const text='本頁自選典藏｜喜劇選集，改編不冒充本人發言\n\n'+Q.cards.filter(c=>saved.has(c.id)).map(exportText).join('\n');const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='多拉語錄-喜劇典藏.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('draw-status').textContent='已發起下載；檔案只在你的裝置產生。';});
  $('draw-mode').addEventListener('click',()=>mode('draw'));
  $('start-draw').addEventListener('click',()=>{mode('draw');$('draw-title').focus();});
  $('quiz-mode').addEventListener('click',()=>mode('quiz'));
  $('start-quiz').addEventListener('click',()=>{mode('quiz');$('quiz-title').focus();});
  $('quiz-next').addEventListener('click',()=>{if(quiz.answers.length!==quiz.index+1)return;if(quiz.index===7){quiz.index=8;result();}else{quiz.index++;renderQuestion();$('quiz-prefix').focus();}});
  $('quiz-restart').addEventListener('click',()=>{startQuiz();$('quiz-prefix').focus();});
  $('return-draw').addEventListener('click',()=>{mode('draw');$('draw-mode').focus();});
  function sharedCard(){const id=location.hash.startsWith('#q=')?location.hash.slice(3):'';return Q.cards.find(c=>c.id===id);}
  showCard(sharedCard()||Q.cards[0]);
  bag=Q.shuffle(Q.cards.filter(c=>c.id!==current.id));
  window.addEventListener('hashchange',()=>{
    const card=sharedCard();if(!card)return;
    mode('draw');tag='all';document.querySelectorAll('[data-tag]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tag==='all')));
    showCard(card);bag=Q.shuffle(Q.cards.filter(c=>c.id!==current.id));$('draw-status').textContent='已開啟連結指定的卡片。';
  });
})();
