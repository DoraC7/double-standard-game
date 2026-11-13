'use strict';
const SnakeEngine=(()=>{
const vectors={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
const same=(a,b)=>a.x===b.x&&a.y===b.y;
function food(s,rng=Math.random){const cells=[];for(let y=0;y<s.size;y++)for(let x=0;x<s.size;x++)if(!s.snake.some(p=>p.x===x&&p.y===y))cells.push({x,y});if(!cells.length)return null;return cells[Math.min(cells.length-1,Math.max(0,Math.floor(rng()*cells.length)))];}
function create(size=16,rng=Math.random){if(!Number.isInteger(size)||size<4||size>30)throw Error('棋盤大小需為4–30整數');const y=Math.floor(size/2),x=Math.floor(size/2);const s={size,snake:[{x,y},{x:x-1,y},{x:x-2,y}],direction:'right',pending:null,score:0,status:'ready',food:null,ticks:0};s.food=food(s,rng);return s;}
function start(s){if(s.status==='ready')s.status='running';}
function turn(s,dir){if(s.status!=='running'||!vectors[dir]||s.pending)return false;const a=vectors[s.direction],b=vectors[dir];if(a.x+b.x===0&&a.y+b.y===0||s.direction===dir)return false;s.pending=dir;return true;}
function pause(s){if(s.status==='running'){s.status='paused';s.pending=null;return true;}return false;}
function resume(s){if(s.status==='paused'){s.status='running';s.pending=null;return true;}return false;}
function step(s,rng=Math.random){if(s.status!=='running')return false;if(s.pending){s.direction=s.pending;s.pending=null;}const d=vectors[s.direction],h={x:s.snake[0].x+d.x,y:s.snake[0].y+d.y},eat=s.food&&same(h,s.food),body=eat?s.snake:s.snake.slice(0,-1);s.ticks++;if(h.x<0||h.y<0||h.x>=s.size||h.y>=s.size||body.some(p=>same(p,h))){s.status='lost';return false;}s.snake.unshift(h);if(eat){s.score++;s.food=food(s,rng);if(!s.food)s.status='won';}else s.snake.pop();return true;}
return{create,start,turn,pause,resume,step,food};})();
if(typeof module!=='undefined')module.exports=SnakeEngine;
