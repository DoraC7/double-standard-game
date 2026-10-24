'use strict';
(()=>{
  const $=id=>document.getElementById(id),canvas=$('board'),ctx=canvas.getContext('2d');
  const COLS=9,ROWS=11,CW=canvas.width/COLS,RH=canvas.height/ROWS,homes=[0,2,4,6,8];
  const lanes=[
    {row:1,type:'road',speed:76,items:[{x:0,w:1.25,c:'#ef8c64'},{x:3,w:1.35,c:'#f2ca69'},{x:6,w:1.2,c:'#a7d4b2'}]},
    {row:2,type:'road',speed:-112,items:[{x:1,w:1.55,c:'#94c7dc'},{x:5,w:1.2,c:'#f49b82'}]},
    {row:3,type:'road',speed:88,items:[{x:0,w:1.8,c:'#f1cf72'},{x:4.5,w:1.35,c:'#b8d69a'}]},
    {row:4,type:'road',speed:-128,items:[{x:2,w:1.2,c:'#f49b82'},{x:6,w:1.75,c:'#8fc4db'}]},
    {row:6,type:'water',speed:62,items:[{x:0,w:2.5,c:'#9b7248'},{x:4.5,w:2.1,c:'#aa8051'}]},
    {row:7,type:'water',speed:-75,items:[{x:1,w:1.8,c:'#4b9f8d'},{x:5,w:2.2,c:'#9c754c'}]},
    {row:8,type:'water',speed:91,items:[{x:0,w:2.1,c:'#9c754c'},{x:4,w:2.7,c:'#4b9f8d'}]},
    {row:9,type:'water',speed:-58,items:[{x:2,w:4.2,c:'#a27a4e'},{x:7,w:1.8,c:'#4b9f8d'}]}
  ];
  let frog,homesDone,lives,paused,ended,last=0,raf=0,toastTimer=0;
  const wrap=x=>((x%COLS)+COLS)%COLS;
  const distance=(a,b)=>Math.abs(wrap(a-b+COLS/2)-COLS/2);
  function drawFrog(x,y){ctx.save();ctx.translate(x,y);ctx.fillStyle='#38694b';ctx.beginPath();ctx.ellipse(-12,9,8,4,-.2,0,Math.PI*2);ctx.ellipse(12,9,8,4,.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#68b477';ctx.beginPath();ctx.ellipse(0,2,17,14,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(-10,-9,8,0,Math.PI*2);ctx.arc(10,-9,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff7df';ctx.beginPath();ctx.arc(-10,-9,4.2,0,Math.PI*2);ctx.arc(10,-9,4.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#23473d';ctx.beginPath();ctx.arc(-9,-9,2,0,Math.PI*2);ctx.arc(11,-9,2,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#23473d';ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(0,4,6,.2,Math.PI-.2);ctx.stroke();ctx.restore();}
  function drawTurtle(x,y){ctx.save();ctx.translate(x,y);ctx.fillStyle='#83c58c';ctx.beginPath();ctx.ellipse(0,1,16,12,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#498a68';ctx.beginPath();ctx.ellipse(0,0,11,9,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#a8d49a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(10,0);ctx.moveTo(0,-8);ctx.lineTo(0,8);ctx.stroke();ctx.fillStyle='#83c58c';ctx.beginPath();ctx.arc(16,0,5,0,Math.PI*2);ctx.arc(-11,-10,4,0,Math.PI*2);ctx.arc(10,-10,4,0,Math.PI*2);ctx.arc(-11,10,4,0,Math.PI*2);ctx.arc(10,10,4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#254b42';ctx.beginPath();ctx.arc(17,-1,1,0,Math.PI*2);ctx.fill();ctx.restore();}
  function drawHome(x,y,occupied){if(occupied){drawFrog(x,y);return;}ctx.fillStyle='#193e39';ctx.fillRect(x-CW*.34,y-RH*.28,CW*.68,RH*.56);ctx.fillStyle='#d6c786';ctx.beginPath();ctx.moveTo(x-CW*.4,y-RH*.15);ctx.lineTo(x,y-RH*.42);ctx.lineTo(x+CW*.4,y-RH*.15);ctx.closePath();ctx.fill();ctx.fillStyle='#78966a';ctx.fillRect(x-5,y+2,10,11);}
  function resetFrog(){frog={x:4,y:10};}
  function start(){cancelAnimationFrame(raf);homesDone=[];lives=3;paused=false;ended=false;lanes.forEach(l=>l.items.forEach((o,i)=>o.x=(o.x+i*2.15)%COLS));resetFrog();$('intro').hidden=true;$('result').hidden=true;$('play').hidden=false;$('overlay').hidden=true;updateHud();say('出發！小心車車和河水');last=performance.now();canvas.focus({preventScroll:true});draw();raf=requestAnimationFrame(frame);}
  function updateHud(){$('homes').textContent=`${homesDone.length} / 5`;$('lives').textContent='♥'.repeat(lives)||'0';}
  function say(t){$('message').textContent=t;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{$('message').textContent='';},1600);}
  function hit(){lives--;updateHud();if(lives<=0){paused=true;$('overlay-title').textContent='青蛙們需要再試一次';$('resume').hidden=true;$('overlay').hidden=false;}else{resetFrog();say('哎呀！回起點再來一次');}}
  function move(dx,dy){if($('play').hidden||paused||ended||!frog)return;const nx=frog.x+dx,ny=frog.y+dy;if(nx<0||nx>=COLS||ny<0||ny>=ROWS)return;frog={x:nx,y:ny};if(ny===0){if(!homes.includes(nx)||homesDone.includes(nx)){hit();return;}homesDone.push(nx);updateHud();if(homesDone.length===5){ended=true;cancelAnimationFrame(raf);$('play').hidden=true;$('result').hidden=false;return;}resetFrog();say('安全到家！再接一位');}draw();}
  function laneAt(row){return lanes.find(l=>l.row===row);}
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let r=0;r<ROWS;r++){const y=r*RH;let color='#408557';if(r===0)color='#456b4b';if(r===5||r===10)color='#526b4e';if(r>=6&&r<=9)color='#247c91';if(r>=1&&r<=4)color='#3c4945';ctx.fillStyle=color;ctx.fillRect(0,y,canvas.width,RH);if(r===5||r===10){ctx.fillStyle='#b6c78c';for(let x=8;x<canvas.width;x+=28)ctx.fillRect(x,y+RH/2,12,3);}}
    homes.forEach(x=>{ctx.fillStyle=homesDone.includes(x)?'#9dcf6e':'#193e39';ctx.fillRect(x*CW+3,3,CW-6,RH-6);drawHome(x*CW+CW/2,RH/2,homesDone.includes(x));});
    for(const lane of lanes){for(const o of lane.items){let x=wrap(o.x);for(const xx of [x,x-COLS]){const px=xx*CW,y=lane.row*RH;if(lane.type==='road'){ctx.fillStyle=o.c;ctx.beginPath();ctx.roundRect(px+2,y+5,o.w*CW-4,RH-10,8);ctx.fill();ctx.fillStyle='#edf1d3';ctx.fillRect(px+o.w*CW*.7,y+10,8,5);ctx.fillRect(px+o.w*CW*.7,y+RH-15,8,5);ctx.fillStyle='#253b3c';ctx.fillRect(px+o.w*CW*.2,y+2,12,7);ctx.fillRect(px+o.w*CW*.68,y+2,12,7);ctx.fillRect(px+o.w*CW*.2,y+RH-9,12,7);ctx.fillRect(px+o.w*CW*.68,y+RH-9,12,7);}else{ctx.fillStyle=o.c;ctx.beginPath();ctx.roundRect(px+2,y+7,o.w*CW-4,RH-14,10);ctx.fill();if(o.c==='#4b9f8d')drawTurtle(px+o.w*CW/2,y+RH/2);}}}}
    if(frog)drawFrog(frog.x*CW+CW/2,frog.y*RH+RH/2);
  }
  function update(dt){for(const lane of lanes)for(const o of lane.items)o.x=wrap(o.x+lane.speed*dt/CW);
    const lane=laneAt(frog.y);if(!lane)return;
    if(lane.type==='road'){const car=lane.items.some(o=>distance(frog.x+.5,o.x+o.w/2)<o.w/2+.32);if(car)hit();}
    else {const log=lane.items.find(o=>distance(frog.x+.5,o.x+o.w/2)<o.w/2-.05);if(!log){hit();return;}frog.x=wrap(frog.x+lane.speed*dt/CW);if(frog.x<.15||frog.x>COLS-.85)hit();}
  }
  function frame(now){const dt=Math.min(.04,(now-last)/1000);last=now;if(!paused&&!ended){update(dt);draw();raf=requestAnimationFrame(frame);}}
  function pause(){if(ended||$('play').hidden||paused)return;paused=true;$('overlay-title').textContent='休息一下';$('resume').hidden=false;$('overlay').hidden=false;}
  function resume(){if(lives<=0)return;paused=false;$('overlay').hidden=true;last=performance.now();raf=requestAnimationFrame(frame);canvas.focus({preventScroll:true});}
  function onKey(e){const map={ArrowUp:[0,-1],w:[0,-1],W:[0,-1],ArrowDown:[0,1],s:[0,1],S:[0,1],ArrowLeft:[-1,0],a:[-1,0],A:[-1,0],ArrowRight:[1,0],d:[1,0],D:[1,0]};if(e.key==='p'||e.key==='P'){pause();return;}if(map[e.key]){e.preventDefault();move(...map[e.key]);}}
  document.addEventListener('keydown',onKey);$('start').addEventListener('click',start);$('replay').addEventListener('click',start);$('again').addEventListener('click',start);$('pause').addEventListener('click',pause);$('resume').addEventListener('click',resume);
  document.querySelectorAll('.pad button').forEach(b=>b.addEventListener('click',()=>{const m={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};move(...m[b.dataset.dir]);}));
  canvas.addEventListener('click',e=>{const rect=canvas.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width*COLS,y=(e.clientY-rect.top)/rect.height*ROWS;const dx=x-frog.x-.5,dy=y-frog.y-.5;if(Math.abs(dx)>Math.abs(dy))move(Math.sign(dx),0);else move(0,Math.sign(dy));});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&$('play').hidden===false&&!paused)pause();});
})();
