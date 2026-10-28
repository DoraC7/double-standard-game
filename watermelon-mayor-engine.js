(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MelonArcade=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
const W=640,H=480,CX=320,CY=240,R=18,POOL=58;
const modes={normal:{seconds:60,target:400,rival:185,period:2.8},practice:{seconds:30,target:80,rival:100,period:3.5}};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function random(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
function spawn(s){for(let n=0;n<70;n++){const b={x:40+random(s)*560,y:42+random(s)*396,id:s.serial,gold:s.serial%7===6};if(Math.hypot(b.x-CX,b.y-CY)<100||distance(b,s.player)<55||distance(b,s.rival)<45||s.ballots.some(a=>distance(a,b)<42))continue;s.serial++;s.ballots.push(b);return true;}return false;}
function create(mode='normal',seed=Math.floor(Math.random()*4294967295)){
 if(!modes[mode])throw Error('不支援的玩法');
 const s={mode,seed:seed>>>0,serial:0,time:0,remaining:modes[mode].seconds,player:{x:100,y:240},rival:{x:540,y:240},votes:0,rivalVotes:0,combo:0,bestCombo:0,chain:0,hits:0,collected:0,cooldown:0,dash:0,invulnerable:0,facing:{x:1,y:0},dashDirection:{x:1,y:0},ballots:[],spawnClock:0,paused:false,done:false,notice:'搶金色選票，注意黃色預警！',noticeClock:3};
 for(let i=0;i<7;i++)spawn(s);return s;
}
function jets(s){const period=modes[s.mode].period,cycle=Math.floor(s.time/period),phase=s.time%period;const warning=phase<.85,active=phase>=.85&&phase<1.85;const angles=[cycle*Math.PI/4,cycle*Math.PI/4+Math.PI];if(s.time>=40&&s.mode==='normal')angles.push(cycle*Math.PI/4+Math.PI/2,cycle*Math.PI/4+Math.PI*1.5);return angles.map(a=>({x1:CX+Math.cos(a)*65,y1:CY+Math.sin(a)*65,x2:CX+Math.cos(a)*290,y2:CY+Math.sin(a)*290,warning,active}));}
function segmentDistance(p,l){const dx=l.x2-l.x1,dy=l.y2-l.y1,t=clamp(((p.x-l.x1)*dx+(p.y-l.y1)*dy)/(dx*dx+dy*dy),0,1);return Math.hypot(p.x-l.x1-t*dx,p.y-l.y1-t*dy);}
function move(p,dx,dy){p.x=clamp(p.x+dx,R,W-R);p.y=clamp(p.y+dy,R,H-R);const x=p.x-CX,y=p.y-CY,d=Math.hypot(x,y);if(d<POOL+R){const a=d>0?x/d:1,b=d>0?y/d:0;p.x=CX+a*(POOL+R);p.y=CY+b*(POOL+R);}}
function say(s,message){s.notice=message;s.noticeClock=1.6;}
function hurt(s){if(s.invulnerable>0||s.dash>0)return false;s.votes=Math.max(0,s.votes-8);s.hits++;s.combo=0;s.chain=0;s.invulnerable=1.1;const dx=s.player.x-CX,dy=s.player.y-CY,d=Math.hypot(dx,dy)||1;move(s.player,dx/d*18,dy/d*18);say(s,'被噴到！−8 票，連擊中斷');return true;}
function pause(s,value=true){if(s.done)return false;s.paused=!!value;return true;}
function outcome(s){const target=modes[s.mode].target;return {won:s.votes>=target&&s.votes>s.rivalVotes,tie:s.votes===s.rivalVotes,target,votes:s.votes,rivalVotes:s.rivalVotes};}
function step(s,elapsed,input={}){
 if(s.done||s.paused||!Number.isFinite(elapsed)||elapsed<=0)return false;const dt=Math.min(elapsed,.05),cfg=modes[s.mode];s.time=Math.min(cfg.seconds,s.time+dt);s.remaining=Math.max(0,cfg.seconds-s.time);
 for(const key of ['cooldown','dash','invulnerable','chain','noticeClock'])s[key]=Math.max(0,s[key]-dt);
 if(!s.chain)s.combo=0;
 let x=Number.isFinite(input.x)?clamp(input.x,-1,1):0,y=Number.isFinite(input.y)?clamp(input.y,-1,1):0;const len=Math.hypot(x,y);if(len>0){x/=len;y/=len;s.facing={x,y};}
 if(input.dash&&s.cooldown===0){s.dash=.2;s.cooldown=2.2;s.dashDirection={...s.facing};say(s,'西瓜衝刺！短暫無敵');}
 const dir=s.dash>0?s.dashDirection:{x,y},speed=s.dash>0?650:225;move(s.player,dir.x*speed*dt,dir.y*speed*dt);
 if(s.ballots.length){let target=s.ballots.reduce((a,b)=>distance(s.rival,a)<distance(s.rival,b)?a:b);const line={x1:s.rival.x,y1:s.rival.y,x2:target.x,y2:target.y};if(segmentDistance({x:CX,y:CY},line)<POOL+R+10){const a=Math.atan2(s.rival.y-CY,s.rival.x-CX),b=Math.atan2(target.y-CY,target.x-CX),diff=Math.atan2(Math.sin(b-a),Math.cos(b-a)),turn=diff>=0?1:-1;target={x:CX+Math.cos(a+turn*.65)*115,y:CY+Math.sin(a+turn*.65)*115};}const dx=target.x-s.rival.x,dy=target.y-s.rival.y,d=Math.hypot(dx,dy)||1;move(s.rival,dx/d*cfg.rival*dt,dy/d*cfg.rival*dt);}
 for(const jet of jets(s))if(jet.active&&segmentDistance(s.player,jet)<R+9)hurt(s);
 s.ballots=s.ballots.filter(b=>{if(distance(s.player,b)<R+12){s.combo=Math.min(6,s.combo+1);s.bestCombo=Math.max(s.bestCombo,s.combo);s.chain=3;s.collected++;const gain=(b.gold?30:10)+(s.combo-1)*2;s.votes+=gain;say(s,`${b.gold?'金票！':'搶到票！'}+${gain} · ${s.combo} 連擊`);return false;}if(distance(s.rival,b)<R+12){s.rivalVotes+=b.gold?30:10;return false;}return true;});
 s.spawnClock+=dt;while(s.spawnClock>=.55){s.spawnClock-=.55;if(s.ballots.length<7)spawn(s);}
 if(s.remaining<=0){s.done=true;s.paused=false;s.dash=0;say(s,outcome(s).won?'凍蒜！西瓜當選！':'選戰結束，再拚一局！');}return true;
}
return {W,H,CX,CY,R,POOL,modes,create,step,jets,segmentDistance,move,pause,outcome};
});
