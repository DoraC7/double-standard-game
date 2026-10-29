async function ignoranceQA() {
  const $=id=>document.getElementById(id),E=window.Ignorance,snap=()=>window.IgnoranceRun.snapshot();
  let checks=0;const games=[];
  const assert=(value,label)=>{checks++;if(!value)throw new Error(label);};
  const overflow=()=>assert(document.documentElement.scrollWidth<=innerWidth,'no horizontal overflow');
  const same=()=>JSON.stringify(snap());
  const choice=value=>$('options').querySelector(`[data-choice="${value}"]`);
  const question=()=>{const v=snap(),c=E.cases.find(c=>c.id===v.caseId);return {v,c,answer:v.stage===0?c.answer:v.stage===1?c.best:0};};
  function selectAndSubmit(value,keyboard=false){
    const before=snap().summary.completed;
    if(keyboard){const buttons=[...$('options').querySelectorAll('button')],i=buttons.indexOf(choice(value));window.dispatchEvent(new KeyboardEvent('keydown',{key:String(i+1),bubbles:true}));}
    else choice(value).click();
    assert(!$('confirm').disabled,'selected answer enables confirm');assert(snap().summary.completed===before,'selection does not score');assert(choice(value).getAttribute('aria-pressed')==='true','selection is visible');
    if(keyboard)window.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));else $('confirm').click();
    assert(snap().locked&&$('confirm').disabled,'confirm locks answer');assert(!$('feedback').hidden,'feedback visible');assert([...$('options').querySelectorAll('button')].every(b=>b.disabled),'all choices locked');
    const stable=same(),feedback=$('feedback').textContent;choice((value+1)%3).click();$('confirm').click();$('unsure').click();assert(same()===stable&&$('feedback').textContent===feedback,'repeat input cannot replace first outcome');overflow();
  }
  await Promise.all([...document.images].map(i=>i.decode().catch(()=>null)));
  assert([...document.images].every(i=>i.naturalWidth>0),'local artwork loads');overflow();
  // Pause blocks selection and progression, resumes without losing the current selection.
  $('quick').click();choice(1).click();const beforeBlur=snap();window.dispatchEvent(new Event('blur'));
  assert(snap().paused&&!$('pause-cover').hidden&&$('play').inert,'blur pauses and isolates controls');
  const frozen=same();choice(0).click();$('confirm').click();$('next').click();assert(same()===frozen,'paused game cannot mutate');
  $('resume').click();assert(!snap().paused&&snap().selected===beforeBlur.selected&&!$('play').inert,'manual resume retains selection');
  window.dispatchEvent(new KeyboardEvent('keydown',{key:'p',bubbles:true}));assert(snap().paused,'P pauses');window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert(!snap().paused,'Escape resumes');
  const descriptor=Object.getOwnPropertyDescriptor(document,'hidden');
  try{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));assert(snap().paused,'hidden page pauses');}finally{if(descriptor)Object.defineProperty(document,'hidden',descriptor);else delete document.hidden;}
  $('pause-menu').click();assert(snap()===null&&!$('intro').hidden,'leave paused game clears state');
  // Full game: deliberately fail once per stage, then retry. First scores cannot be washed away.
  $('full').click();const missed=new Set();let moves=0;
  while(!snap().done&&moves++<40){
    const {v,c,answer}=question();assert($('confirm').disabled,'new step requires fresh selection');assert($('next').hidden,'cannot advance unanswered step');
    if(v.stage===1)assert($('evidence').hidden&&v.opened===null,'card contents hidden before commit');
    if(!missed.has(v.stage)){
      selectAndSubmit((answer+1)%3);assert(!$('retry').hidden,'wrong answer offers retry');$('retry').click();assert(!snap().locked&&snap().selected===null&&$('confirm').disabled,'retry clears selection');
      if(v.stage===1)assert(snap().opened===null&&$('evidence').hidden,'retry removes previously opened card');missed.add(v.stage);
    }
    selectAndSubmit(answer,v.stage===0);if(v.stage===1){assert(!$('evidence').hidden&&$('evidence-text').textContent===c.cards[c.best].text,'only committed card revealed');}
    $('next').click();overflow();
  }
  assert(moves===36&&snap().done,'full game completes all 36 steps');assert(snap().summary.first===33&&snap().summary.latest===36,'retry preserves first score 33/36');assert($('review').children.length===12,'review contains every case');
  assert($('summary').textContent.includes('首次答對 33 步'),'visible first score matches');games.push({mode:'full',first:33,total:36});
  const text=E.exportText({items:E.cases,results:snap().results});assert(text.includes('首次答對 33 步'),'export preserves first score');
  // Three complete full rounds explore every card of every case, including unrelated cards.
  for(let card=0;card<3;card++){
    $('again').click();assert(snap().summary.completed===0&&snap().opened===null,'replay starts fresh');
    while(!snap().done){const {v,c,answer}=question();selectAndSubmit(v.stage===1?card:answer);if(v.stage===1)assert($('evidence-text').textContent===c.cards[card].text,'chosen card content not substituted');if(v.stage===2)assert(choice(0).textContent.includes(c.cards[card].conclusion),'conclusion follows actually opened card');$('next').click();}
    assert(snap().summary.first===28,'each full fixed-card round has 28 first answers');assert($('review').children.length===12,'branch round complete review');games.push({mode:'full',card,first:28,total:36});
  }
  $('menu').click();$('quick').click();const areas=[];
  // Short game: choose an irrelevant source without retry; a bounded conclusion still earns its own point.
  while(!snap().done){const {v,c,answer}=question();if(v.stage===0)areas.push(c.area);selectAndSubmit(v.stage===1?(c.best+1)%3:answer);$('next').click();}
  assert(new Set(areas).size===4&&areas.length===4,'quick mode covers all four topics');assert(snap().summary.first===8&&snap().summary.total===12,'bad source remains wrong, evidence-bounded conclusion is scored separately');games.push({mode:'quick',first:8,total:12});
  $('again').click();
  while(!snap().done){$('unsure').click();assert(snap().locked,'unsure commits a result');$('next').click();overflow();}
  assert(snap().summary.first===0&&snap().summary.total===12,'all unsure is zero out of all 12 steps');assert($('review').children.length===4,'unsure review includes all four cases');games.push({mode:'quick',first:0,total:12});
  const stable=same();$('confirm').click();$('next').click();assert(same()===stable,'completed game rejects hidden controls');
  const motion=document.querySelector('.arcade-fx-toggle');if(motion&&!motion.disabled){motion.click();assert(document.body.classList.contains('arcade-still'),'decorations switch off');$('again').click();assert(!snap().done,'play still works with decorations disabled');$('leave').click();motion.click();}else $('menu').click();
  assert(snap()===null&&!$('intro').hidden,'QA returns to clean intro');overflow();
  return {viewport:[innerWidth,innerHeight],checks,games,branches:36};
}
