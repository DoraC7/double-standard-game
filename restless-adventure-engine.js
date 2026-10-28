(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RestlessAdventure=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
const W=720,H=420,SPEED=225,GRAVITY=1500,JUMP=565;
const ground=(x,w)=>({x,y:360,w,h:90}),ledge=(x,y,w=180)=>({x,y,w,h:18});
const levels=[
 {name:'第一站・出門三件組',subtitle:'鑰匙、錢包、手機，這次一起帶走。',width:1600,goal:1530,checkpoint:750,color:'#7fba8e',platforms:[ground(0,500),ground(620,460),ground(1200,400),ledge(170,280),ledge(360,200,110),ledge(1280,280)],items:[{x:250,y:258,label:'鑰匙'},{x:820,y:338,label:'錢包'},{x:1370,y:258,label:'手機'}],stars:[{x:415,y:176},{x:690,y:260},{x:1110,y:180}],springs:[450,1030],enemies:[{left:860,right:1010,y:334,speed:55}]},
 {name:'第二站・分頁森林',subtitle:'支線可以逛，主線三張草稿別漏掉。',width:1800,goal:1730,checkpoint:1110,color:'#9e8ac7',platforms:[ground(0,420),ground(540,380),ground(1040,760),ledge(150,280),ledge(700,280),ledge(1300,280),ledge(1450,200)],items:[{x:230,y:258,label:'草稿①'},{x:790,y:258,label:'草稿②'},{x:1530,y:178,label:'草稿③'}],stars:[{x:350,y:210},{x:970,y:180},{x:1610,y:155}],springs:[365,865],enemies:[{left:560,right:680,y:334,speed:70},{left:1110,right:1280,y:334,speed:75}]},
 {name:'第三站・主線交付城',subtitle:'目的、操作、證據，打包送到終點！',width:2000,goal:1930,checkpoint:1320,color:'#db9a68',platforms:[ground(0,500),ground(640,520),ground(1250,750),ledge(180,280),ledge(670,280),ledge(820,200),ledge(1640,280)],items:[{x:260,y:258,label:'目的'},{x:900,y:178,label:'操作'},{x:1730,y:258,label:'證據'}],stars:[{x:425,y:200},{x:1160,y:180},{x:1800,y:190}],springs:[445,1105],enemies:[{left:660,right:800,y:334,speed:80},{left:1330,right:1530,y:334,speed:90},{left:1780,right:1880,y:334,speed:70}]}
];
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function load(s,index){const l=levels[index];s.level=index;s.time=0;s.remaining=s.mode==='calm'?null:90;s.hearts=s.mode==='calm'?5:3;s.player={x:48,y:326,w:26,h:34,vx:0,vy:0,grounded:true,coyote:.1,buffer:0};s.items=l.items.map(i=>({...i,taken:false}));s.stars=l.stars.map(i=>({...i,taken:false}));s.enemies=l.enemies.map((e,i)=>({...e,x:e.left+(e.right-e.left)*.4,w:30,h:26,dir:i%2?-1:1,awake:true}));s.checkpoint=48;s.invulnerable=0;s.state='playing';s.paused=false;s.message=l.subtitle;s.messageTime=4;s.facing=1;s.elapsed=0;}
function create(mode='normal'){if(!['normal','calm'].includes(mode))throw Error('不支援的玩法');const s={mode,totalStars:0,totalHits:0};load(s,0);return s;}
function say(s,text){s.message=text;s.messageTime=2.5;}
function hurt(s,fall=false){if(s.state!=='playing'||(!fall&&s.invulnerable>0))return false;s.hearts--;s.totalHits++;s.invulnerable=1.5;if(s.hearts<=0){s.state='failed';say(s,'冒險暫停一下，這關可以重新挑戰。');return true;}s.player={x:s.checkpoint,y:326,w:26,h:34,vx:0,vy:0,grounded:true,coyote:.1,buffer:0};say(s,fall?'掉進支線裂縫！回到最近旗子，已收集物品保留。':'通知怪撞過來了！回到旗子，再出發。');return true;}
function tick(s,dt,axis){const p=s.player,l=levels[s.level];s.time+=dt;s.elapsed+=dt;s.invulnerable=Math.max(0,s.invulnerable-dt);s.messageTime=Math.max(0,s.messageTime-dt);if(s.remaining!==null){s.remaining=Math.max(0,90-s.time);if(s.remaining===0){s.state='failed';say(s,'時間到了，重試這一關就好。');return;}}
 p.coyote=p.grounded?.1:Math.max(0,p.coyote-dt);p.buffer=Math.max(0,p.buffer-dt);if(p.buffer>0&&p.coyote>0){p.vy=-JUMP;p.grounded=false;p.coyote=0;p.buffer=0;}
 p.vx=axis*SPEED;if(axis)s.facing=Math.sign(axis);p.x=Math.max(0,Math.min(l.width-p.w,p.x+p.vx*dt));const beforeBottom=p.y+p.h;p.vy=Math.min(950,p.vy+GRAVITY*dt);p.y+=p.vy*dt;p.grounded=false;
 if(p.vy>=0){let top=Infinity;for(const f of l.platforms)if(p.x+p.w>f.x&&p.x<f.x+f.w&&beforeBottom<=f.y+.1&&p.y+p.h>=f.y)top=Math.min(top,f.y);if(Number.isFinite(top)){p.y=top-p.h;p.vy=0;p.grounded=true;}}
 if(p.grounded&&p.y+p.h===360&&l.springs.some(x=>p.x+p.w>x&&p.x<x+34)){p.vy=-780;p.grounded=false;p.coyote=0;say(s,'彈跳墊：主線直接起飛！');}
 if(p.y>H+90){hurt(s,true);return;}
 for(const e of s.enemies){if(!e.awake)continue;e.x+=e.dir*e.speed*dt;if(e.x<=e.left||e.x>=e.right){e.x=Math.max(e.left,Math.min(e.right,e.x));e.dir*=-1;}if(overlap(p,e)){if(p.vy>0&&beforeBottom<=e.y+10){e.awake=false;p.vy=-360;say(s,'踩掉通知怪，繼續主線！');}else if(hurt(s))return;}}
 for(const i of [...s.items,...s.stars])if(!i.taken&&overlap(p,{x:i.x-13,y:i.y-15,w:26,h:30})){i.taken=true;say(s,s.items.includes(i)?'帶上了：'+i.label+'！':'支線星星 +1，主線也別放飛。');}
 if(s.checkpoint===48&&p.x>=l.checkpoint&&p.x<l.checkpoint+85&&p.grounded&&p.y+p.h===360){s.checkpoint=l.checkpoint;say(s,'旗子已亮！跌倒從這裡繼續。');}
 if(p.x+p.w>l.goal&&p.y+p.h>280){if(s.items.every(i=>i.taken)){s.state='clear';say(s,'主線送達！');}else if(s.messageTime<1)say(s,'門還沒開：少了 '+s.items.filter(i=>!i.taken).map(i=>i.label).join('、')+'。');}
}
function step(s,dt,input={}){if(s.paused||s.state!=='playing'||!Number.isFinite(dt)||dt<=0)return false;dt=Math.min(dt,.05);const axis=Number.isFinite(input.x)?Math.max(-1,Math.min(1,input.x)):0;if(input.jump)s.player.buffer=.13;const n=Math.ceil(dt/(1/120));for(let i=0;i<n&&s.state==='playing';i++)tick(s,dt/n,axis);return true;}
function pause(s,value=true){if(s.state!=='playing')return false;s.paused=!!value;return true;}
function next(s){if(s.state!=='clear')return false;s.totalStars+=s.stars.filter(i=>i.taken).length;if(s.level===levels.length-1){s.state='won';return true;}load(s,s.level+1);return true;}
function retry(s){if(s.state!=='failed')return false;load(s,s.level);return true;}
return {W,H,SPEED,GRAVITY,JUMP,levels,create,step,pause,next,retry,overlap};
});
