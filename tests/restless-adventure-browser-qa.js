async function adventureQA(){
 const $=id=>document.getElementById(id),snapshot=()=>RestlessRun.snapshot(),checks=[],ok=(v,m)=>{if(!v)throw Error(m);checks.push(m);},fit=()=>ok(document.documentElement.scrollWidth<=innerWidth,'畫面不橫向溢出');
 const oldRAF=requestAnimationFrame,oldCancel=cancelAnimationFrame;let clock=1000,id=0,queue=[],cancelled=new Set();
 const beforeStorage=[JSON.stringify({...localStorage}),JSON.stringify({...sessionStorage})];
 window.requestAnimationFrame=fn=>{queue.push({id:++id,fn});return id;};window.cancelAnimationFrame=n=>cancelled.add(n);
 const advance=seconds=>{for(let i=0;i<Math.ceil(seconds/.05);i++){clock+=50;const jobs=queue;queue=[];for(const j of jobs)if(!cancelled.has(j.id))j.fn(clock);}};
 const key=(k,on=true)=>window.dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{key:k,bubbles:true,cancelable:true}));
 const pointer=(el,type,id)=>el.dispatchEvent(new PointerEvent(type,{pointerId:id,bubbles:true,cancelable:true}));
 try{
  fit();$('start').click();advance(.05);ok(snapshot().mode==='normal'&&snapshot().hearts===3&&snapshot().remaining<=90,'限時模式開始');fit();
  key('ArrowRight');advance(.3);key('ArrowRight',false);ok(snapshot().player.x>90,'鍵盤向右移動');key(' ');advance(.2);key(' ',false);ok(snapshot().player.y<300,'鍵盤跳躍');
  key('ArrowLeft');window.dispatchEvent(new Event('blur'));ok(snapshot().paused,'失焦自動暫停');const frozen=JSON.stringify(snapshot());advance(1);ok(JSON.stringify(snapshot())===frozen,'暫停凍結整個世界');$('resume').click();const stopped=snapshot().player.x;advance(.05);ok(snapshot().player.x===stopped,'暫停清除按住輸入');key('ArrowLeft',false);
  Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));ok(snapshot().paused,'背景自動暫停');delete document.hidden;$('resume').click();
  $('pause').click();$('quit').click();$('start').click();advance(.05);
  const right=document.querySelector('[data-dir=right]'),capture=right.setPointerCapture;right.setPointerCapture=()=>{};
  try{pointer(right,'pointerdown',87);advance(.2);ok(snapshot().player.x>70,'觸控方向按住移動');pointer(right,'pointercancel',87);const x=snapshot().player.x;advance(.1);ok(snapshot().player.x===x&&!right.classList.contains('held'),'觸控取消不黏住');pointer(right,'pointerdown',88);advance(.1);pointer(right,'lostpointercapture',88);const x2=snapshot().player.x;advance(.1);ok(snapshot().player.x===x2,'失去捕捉停止');pointer(right,'pointerdown',89);advance(.05);pointer(right,'pointerup',89);const x3=snapshot().player.x;advance(.05);ok(snapshot().player.x===x3,'放開停止');}finally{right.setPointerCapture=capture;}
  for(const el of [$('field'),...document.querySelectorAll('.controls,.controls *')]){ok(getComputedStyle(el).userSelect==='none','操作區不可選字');for(const type of ['contextmenu','selectstart']){const e=new Event(type,{bubbles:true,cancelable:true});el.dispatchEvent(e);ok(e.defaultPrevented,'操作區擋原生長按');}}
  const help=document.querySelector('.help'),event=new Event('contextmenu',{bubbles:true,cancelable:true});help.dispatchEvent(event);ok(!event.defaultPrevented&&getComputedStyle(help).userSelect!=='none','一般說明仍可選取');
  const jump=$('jump'),jumpCapture=jump.setPointerCapture;jump.setPointerCapture=()=>{};try{pointer(jump,'pointerdown',90);advance(.15);pointer(jump,'pointerup',90);ok(snapshot().player.vy<0,'觸控跳躍');}finally{jump.setPointerCapture=jumpCapture;}
  // Start a clean run and intentionally time out before the real full route.
  $('pause').click();$('quit').click();$('start').click();advance(91);ok(snapshot().state==='failed'&&!$('retry').hidden,'失敗與重試入口');$('retry').click();advance(.05);ok(snapshot().state==='playing'&&snapshot().hearts===3&&snapshot().items.every(i=>!i.taken),'重試重開當關');
  const results=[];
  for(const mode of ['normal','calm']){
   if(mode==='calm'){$('menu').click();$('calm').click();advance(.05);ok(snapshot().remaining===null&&snapshot().hearts===5,'悠哉模式不限時與五生命');}
   for(let stage=0;stage<3;stage++){
    let at=0,n=0;while(snapshot().state==='playing'&&n++<2500){const s=snapshot(),out=AdventurePilot.control(s,at,RestlessAdventure.levels[stage]);at=out.at;key('ArrowLeft',out.input.x<0);key('ArrowRight',out.input.x>0);if(out.input.jump){key(' ');key(' ',false);}advance(.05);if(n%50===0)fit();}
    ok(snapshot().state==='clear',`${mode}第${stage+1}站可通關`);ok(snapshot().items.every(i=>i.taken),'三件主線齊全');ok(!$('result').hidden&&document.activeElement===$('result-title'),'通關結果與焦點');fit();results.push({mode,stage:stage+1,hearts:snapshot().hearts,time:snapshot().time});$('next').click();if(stage<2)ok(snapshot().level===stage+1&&snapshot().hearts===(mode==='calm'?5:3),'下一站補滿生命');
   }
   ok(snapshot().state==='won'&&!$('again').hidden,'三站完整結局');ok($('result-text').textContent.includes('九件主線'),'九件物品交付結算');fit();
  }
  $('again').click();advance(.05);ok(snapshot().level===0&&snapshot().totalStars===0&&snapshot().totalHits===0,'重新冒險無舊紀錄');$('pause').click();$('quit').click();ok(!$('intro').hidden&&document.activeElement===$('start'),'回說明與焦點');fit();
  document.querySelector('.arcade-fx-toggle').click();ok(document.body.classList.contains('arcade-still'),'動畫開關有效');$('calm').click();advance(.05);key('ArrowRight');advance(.15);key('ArrowRight',false);ok(snapshot().player.x>50,'關裝飾動畫仍可移動');$('pause').click();$('quit').click();document.querySelector('.arcade-fx-toggle').click();
  await Promise.all([...document.images].map(i=>i.decode().catch(()=>null)));ok([...document.images].every(i=>i.naturalWidth>0),'圖片完整');ok(beforeStorage[0]===JSON.stringify({...localStorage})&&beforeStorage[1]===JSON.stringify({...sessionStorage}),'無持久儲存');
  return {passed:true,viewport:[innerWidth,innerHeight],assertions:checks.length,results,note:'加速時鐘與DOM指標模擬，非實體手機操作'};
 }finally{window.requestAnimationFrame=oldRAF;window.cancelAnimationFrame=oldCancel;delete document.hidden;}
}
async function adventureRealtimeQA(){
 const $=id=>document.getElementById(id),snap=()=>RestlessRun.snapshot(),key=(k,on=true)=>window.dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{key:k,bubbles:true,cancelable:true}));
 $('start').click();let at=0,stage=0,frames=0,started=performance.now();const results=[];
 return await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('原生時鐘冒險逾時')),80000);function frame(){const s=snap();if(s.paused||s.state==='failed'){clearTimeout(timeout);reject(Error('原生冒險中斷：'+JSON.stringify({level:s.level,state:s.state,hearts:s.hearts})));return;}if(s.state==='clear'){results.push({stage:s.level+1,time:s.time,hearts:s.hearts});$('next').click();at=0;stage++;}else if(s.state==='won'){clearTimeout(timeout);resolve({passed:true,wallSeconds:(performance.now()-started)/1000,frames,results});return;}else{const out=AdventurePilot.control(s,at,RestlessAdventure.levels[stage]);at=out.at;key('ArrowLeft',out.input.x<0);key('ArrowRight',out.input.x>0);if(out.input.jump){key(' ');key(' ',false);}}frames++;requestAnimationFrame(frame);}requestAnimationFrame(frame);});
}
