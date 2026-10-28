async function melonActionQA(){
const $=id=>document.getElementById(id),checks=[],ok=(v,m)=>{if(!v)throw Error(m);checks.push(m);},snap=()=>MelonRun.snapshot(),fit=()=>ok(document.documentElement.scrollWidth<=innerWidth,'無水平溢出');
const realRAF=window.requestAnimationFrame,realCancel=window.cancelAnimationFrame;let clock=1000,id=0,frames=[],cancelled=new Set();window.requestAnimationFrame=fn=>{frames.push({id:++id,fn});return id;};window.cancelAnimationFrame=n=>cancelled.add(n);
const advance=seconds=>{for(let i=0;i<Math.ceil(seconds/.05);i++){clock+=50;const pending=frames;frames=[];for(const f of pending)if(!cancelled.has(f.id))f.fn(clock);}};
const key=(k,on=true)=>window.dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{key:k,bubbles:true}));
try{
 $('start').click();advance(.05);ok(!snap().done&&snap().remaining===60,'正式賽60秒開始');fit();let before=snap();key('ArrowRight');advance(.25);key('ArrowRight',false);ok(snap().player.x>before.player.x+40,'鍵盤持續移動');
 key(' ');advance(.05);key(' ',false);ok(snap().cooldown>2,'空白鍵衝刺有冷卻');key('ArrowUp');advance(.65);key('ArrowUp',false);
 $('pause').click();const frozen=JSON.stringify(snap());advance(2);ok(JSON.stringify(snap())===frozen,'暫停時間／對手／資源全部凍結');ok(!$('pause-cover').hidden&&document.activeElement===$('resume'),'暫停面板與焦點');$('resume').click();advance(.1);ok(snap().time>JSON.parse(frozen).time,'繼續遊戲');
 key('ArrowLeft');window.dispatchEvent(new Event('blur'));ok(snap().paused,'失焦自動暫停');$('resume').click();const x=snap().player.x;advance(.1);ok(snap().player.x===x,'暫停清除按鍵避免卡住');key('ArrowLeft',false);
 Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));ok(snap().paused,'背景分頁自動暫停');delete document.hidden;$('resume').click();
 const capture=$('field').setPointerCapture;$('field').setPointerCapture=()=>{};const r=$('field').getBoundingClientRect(),a=snap().player;
 $('field').dispatchEvent(new PointerEvent('pointerdown',{pointerId:77,clientX:r.left+(a.x+70)*r.width/640,clientY:r.top+a.y*r.height/480,bubbles:true}));advance(.15);ok(snap().player.x>a.x,'拖曳座標隨畫面縮放正確換算');$('field').dispatchEvent(new PointerEvent('pointercancel',{pointerId:77,bubbles:true}));const released=snap().player.x;advance(.1);ok(snap().player.x===released,'拖曳取消停止移動');$('field').setPointerCapture=capture;
 const left=document.querySelector('[data-move=left]'),cap=left.setPointerCapture;left.setPointerCapture=()=>{};left.dispatchEvent(new PointerEvent('pointerdown',{pointerId:78,bubbles:true}));advance(.1);ok(snap().player.x<released,'手機方向按住移動');left.dispatchEvent(new PointerEvent('pointerup',{pointerId:78,bubbles:true}));left.setPointerCapture=cap;const released2=snap().player.x;advance(.1);ok(snap().player.x===released2,'手機方向放開停止');
 function autopilot(){const s=snap();if(!s.ballots.length)return;let t=s.ballots.reduce((a,b)=>Math.hypot(a.x-s.player.x,a.y-s.player.y)/(a.gold?1.25:1)<Math.hypot(b.x-s.player.x,b.y-s.player.y)/(b.gold?1.25:1)?a:b);const l={x1:s.player.x,y1:s.player.y,x2:t.x,y2:t.y};if(MelonArcade.segmentDistance({x:320,y:240},l)<90){const a=Math.atan2(s.player.y-240,s.player.x-320),b=Math.atan2(t.y-240,t.x-320),d=Math.atan2(Math.sin(b-a),Math.cos(b-a));t={x:320+Math.cos(a+(d>=0?1:-1)*.65)*115,y:240+Math.sin(a+(d>=0?1:-1)*.65)*115};}const dx=t.x-s.player.x,dy=t.y-s.player.y;for(const [k,on] of [['ArrowLeft',dx<-6],['ArrowRight',dx>6],['ArrowUp',dy<-6],['ArrowDown',dy>6]])key(k,on);if(s.cooldown===0&&MelonArcade.jets(s).some(j=>j.active&&MelonArcade.segmentDistance(s.player,j)<65)){key(' ');key(' ',false);}}
 let n=0;while(!snap().done&&n++<1500){autopilot();advance(.05);if(n%100===0)fit();}ok(snap().done,'完整正式賽倒數結束');ok(!document.getElementById('result').hidden,'顯示結算');ok(MelonArcade.outcome(snap()).won,'操作路線可實際勝選');ok(snap().collected>0&&snap().bestCombo>1&&snap().rivalVotes>0,'雙方搶票與連擊實際發生');ok($('result-title').textContent.includes('市長室'),'勝選結局');ok(document.activeElement===$('result-title'),'結算焦點');const won={votes:snap().votes,rival:snap().rivalVotes,hits:snap().hits};fit();
 $('restart').click();ok(snap().votes===0&&snap().hits===0&&snap().combo===0&&snap().remaining===60,'再戰清空所有局內狀態');while(!snap().done)advance(.05);ok(!MelonArcade.outcome(snap()).won&&$('result-title').textContent.includes('瓜棚'),'無操作會落選');
 $('back').click();$('practice').click();ok(snap().mode==='practice'&&snap().remaining===30,'暖身模式30秒');while(!snap().done){autopilot();advance(.05);}ok(MelonArcade.outcome(snap()).won,'完整暖身可通關');$('back').click();ok(!$('intro').hidden&&document.activeElement===$('start'),'返回說明焦點');fit();return {viewport:[innerWidth,innerHeight],assertions:checks.length,won,checks:[...new Set(checks)],time:'瀏覽器加速時間模擬，非實際60秒'};
}finally{window.requestAnimationFrame=realRAF;window.cancelAnimationFrame=realCancel;}
}

async function melonRealtimeQA(chosen='normal'){
 const $=id=>document.getElementById(id),snap=()=>MelonRun.snapshot(),key=(k,on=true)=>window.dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{key:k,bubbles:true}));
 function autopilot(){const s=snap();if(!s.ballots.length)return;let t=s.ballots.reduce((a,b)=>Math.hypot(a.x-s.player.x,a.y-s.player.y)/(a.gold?1.25:1)<Math.hypot(b.x-s.player.x,b.y-s.player.y)/(b.gold?1.25:1)?a:b);const l={x1:s.player.x,y1:s.player.y,x2:t.x,y2:t.y};if(MelonArcade.segmentDistance({x:320,y:240},l)<90){const a=Math.atan2(s.player.y-240,s.player.x-320),b=Math.atan2(t.y-240,t.x-320),d=Math.atan2(Math.sin(b-a),Math.cos(b-a));t={x:320+Math.cos(a+(d>=0?1:-1)*.65)*115,y:240+Math.sin(a+(d>=0?1:-1)*.65)*115};}const dx=t.x-s.player.x,dy=t.y-s.player.y;for(const [k,on] of [['ArrowLeft',dx<-6],['ArrowRight',dx>6],['ArrowUp',dy<-6],['ArrowDown',dy>6]])key(k,on);if(s.cooldown===0&&MelonArcade.jets(s).some(j=>j.active&&MelonArcade.segmentDistance(s.player,j)<65)){key(' ');key(' ',false);}}
 $(chosen==='practice'?'practice':'start').click();const started=performance.now();let count=0;
 return await new Promise((resolve,reject)=>{const limit=setTimeout(()=>reject(Error('實際計時測試逾時')),85000);function tick(){const s=snap();if(s.paused){clearTimeout(limit);reject(Error('實際計時測試被暫停'));return;}if(s.done){clearTimeout(limit);const r=MelonArcade.outcome(s);if(!r.won){reject(Error('實際操作路線未勝選：'+JSON.stringify(r)));return;}resolve({mode:chosen,wallSeconds:(performance.now()-started)/1000,gameSeconds:s.time,votes:s.votes,rival:s.rivalVotes,hits:s.hits,bestCombo:s.bestCombo,frames:count,result:document.getElementById('result-title').textContent});return;}autopilot();count++;requestAnimationFrame(tick);}requestAnimationFrame(tick);});
}

// Scoped long-press protection and input-release regression (synthetic pointer IDs).
async function melonTouchQA(){
 const $=id=>document.getElementById(id),checks=[],ok=(v,m)=>{if(!v)throw Error(m);checks.push(m);},snap=()=>MelonRun.snapshot();
 const realRAF=requestAnimationFrame,realCancel=cancelAnimationFrame;let clock=1000,id=0,frames=[],cancelled=new Set();
 window.requestAnimationFrame=fn=>{frames.push({id:++id,fn});return id;};window.cancelAnimationFrame=n=>cancelled.add(n);
 const advance=seconds=>{for(let i=0;i<Math.ceil(seconds/.05);i++){clock+=50;const pending=frames;frames=[];for(const f of pending)if(!cancelled.has(f.id))f.fn(clock);}};
 const event=(el,type)=>{const e=new Event(type,{bubbles:true,cancelable:true});el.dispatchEvent(e);return e;};
 try{
  $('practice').click();advance(.05);
  for(const el of [$('field'),...document.querySelectorAll('.controls,.controls *')]){
   ok(getComputedStyle(el).userSelect==='none','操作區不選字');
   ok(event(el,'contextmenu').defaultPrevented&&event(el,'selectstart').defaultPrevented,'操作區攔截原生選單／選取');
  }
  for(const el of [document.querySelector('.play-help'),document.querySelector('header a')]){
   ok(getComputedStyle(el).userSelect!=='none','一般文字保留選取');
   ok(!event(el,'contextmenu').defaultPrevented&&!event(el,'selectstart').defaultPrevented,'一般文字與連結不攔截選單');
  }
  for(const [i,direction] of ['up','down','left','right'].entries()){
   $('practice').click();advance(.05);const b=document.querySelector(`[data-move=${direction}]`),capture=b.setPointerCapture;
   b.setPointerCapture=()=>{};
   try{
    const before=snap().player;
    b.dispatchEvent(new PointerEvent('pointerdown',{pointerId:87+i,bubbles:true,cancelable:true}));advance(1.2);
    const after=snap().player;ok(Math.hypot(after.x-before.x,after.y-before.y)>30,`${direction}長按持續移動`);
    ok(b.classList.contains('held')&&event(b,'contextmenu').defaultPrevented,'長按選單不打斷按住狀態');
    const release=['pointerup','pointercancel','lostpointercapture','pointerup'][i];
    b.dispatchEvent(new PointerEvent(release,{pointerId:87+i,bubbles:true}));const pos=snap().player;advance(.15);
    ok(JSON.stringify(snap().player)===JSON.stringify(pos)&&!b.classList.contains('held'),`${release}清除移動`);
   }finally{b.setPointerCapture=capture;}
  }
  $('practice').click();advance(.05);const b=document.querySelector('[data-move=up]');
  b.focus();b.dispatchEvent(new KeyboardEvent('keydown',{key:' ',bubbles:true,cancelable:true}));advance(.15);
  ok(snap().player.y<240,'方向按鈕仍支援鍵盤長按');b.dispatchEvent(new KeyboardEvent('keyup',{key:' ',bubbles:true}));
  const y=snap().player.y;advance(.1);ok(snap().player.y===y,'鍵盤放開停止');
  $('dash').click();advance(.05);ok(snap().cooldown>2,'衝刺點選仍可用');
  window.dispatchEvent(new Event('blur'));ok(snap().paused,'失焦仍自動暫停');$('quit').click();
  ok(document.documentElement.scrollWidth<=innerWidth,'無水平溢出');
  return {passed:true,viewport:[innerWidth,innerHeight],assertions:checks.length,note:'DOM pointer模擬；未測實體iPhone系統選單'};
 }finally{window.requestAnimationFrame=realRAF;window.cancelAnimationFrame=realCancel;}
}
