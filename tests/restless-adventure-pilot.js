// Test-only controller: reads snapshots and sends ordinary movement/jump inputs.
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.AdventurePilot=factory();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
const routes=[[[250,280],[820,360],[1370,280],[1550,360]],[[230,280],[790,280],[1380,280],[1530,200],[1750,360]],[[260,280],[730,280],[900,200],[1730,280],[1950,360]]];
function control(s,at,level){const p=s.player,t=routes[s.level][at];if(!t)return {input:{x:0},at};const dx=t[0]-(p.x+p.w/2),feet=p.y+p.h;let x=Math.abs(dx)>10?Math.sign(dx):0;let jump=p.grounded&&feet>t[1]+12&&Math.abs(dx)<140;
const danger=s.enemies.some(e=>e.awake&&(e.x+e.w/2-(p.x+p.w/2))*Math.sign(dx)>0&&Math.abs(e.x+e.w/2-(p.x+p.w/2))<105&&feet>e.y-10);if(p.grounded&&danger)jump=true;
const floor=level.platforms.find(f=>f.y===feet&&p.x+p.w>f.x&&p.x<f.x+f.w);if(p.grounded&&floor&&floor.y===360&&x>0&&floor.x+floor.w-(p.x+p.w)<30)jump=true;
if(Math.abs(dx)<22&&p.grounded&&Math.abs(feet-t[1])<8)return {input:{x:0},at:at+1};return {input:{x,jump},at};}
return {routes,control};
});
