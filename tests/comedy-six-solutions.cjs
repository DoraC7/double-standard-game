function goosePlan(E){
 const start=E.create('office-goose'),key=s=>[s.x,s.y,s.tick%4,s.alarm,s.carry,s.done.join(','),s.distract].join('|');
 const queue=[{s:start,path:[]}],seen=new Set([key(start)]),actions=['up','down','left','right','pickup','drop','blend','honk'];
 for(let n=0;n<queue.length&&n<100000;n++){
   const {s,path}=queue[n];
   for(const a of actions){const next=E.act(s,a);if(next.status==='won')return [...path,a];if(next.status!=='playing')continue;const k=key(next);if(seen.has(k))continue;seen.add(k);next.log=[];queue.push({s:next,path:[...path,a]});}
 }
 throw Error('無法在100000個狀態內找到鵝的完整路線');
}
module.exports={goosePlan};
