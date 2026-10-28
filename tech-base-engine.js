(function(r,f){const api=f();if(typeof module==='object'&&module.exports)module.exports=api;else r.TechBaseEngine=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{'use strict';
const directions={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function runRobot(q,program){
 let position=[...q.start],trace=[[...position]];
 if(!Array.isArray(program)||program.length===0||program.length>16)return {position,trace,reached:false,error:'請先排 1～16 個方向指令。'};
 for(let i=0;i<program.length;i++){
  const delta=directions[program[i]];if(!delta)return {position,trace,reached:false,error:`第 ${i+1} 步不是可用的方向。`};
  const next=[position[0]+delta[0],position[1]+delta[1]];
  if(next.some(v=>v<0||v>=q.size))return {position,trace,reached:false,error:`第 ${i+1} 步會走出地圖，所以停下。`};
  if(q.walls.some(p=>p[0]===next[0]&&p[1]===next[1]))return {position,trace,reached:false,error:`第 ${i+1} 步遇到障礙物，所以停下。`};
  position=next;trace.push([...position]);
 }
 return {position,trace,reached:position[0]===q.target[0]&&position[1]===q.target[1],error:''};
}
const clone=files=>files.map(f=>({...f}));
function createFiles(initial){return {files:clone(initial),drafts:Object.fromEntries(initial.map(f=>[f.id,f.content])),nextId:1};}
function operateFile(prior,id,operation,arg){
 const state={files:clone(prior.files),drafts:{...prior.drafts},nextId:prior.nextId};const file=state.files.find(f=>f.id===id);
 if(!file)return {state,applied:false,message:'先選一個檔案。'};
 if(operation==='save'){file.content=state.drafts[id];return {state,applied:true,message:`已將編輯區內容儲存到「${file.name}」。`};}
 if(operation==='rename'){
  if(!arg||typeof arg!=='string')return {state,applied:false,message:'先選新檔名。'};
  if(state.files.some(f=>f.id!==id&&f.folder===file.folder&&f.name===arg))return {state,applied:false,message:'同一資料夾已有這個檔名。'};
  file.name=arg;return {state,applied:true,message:'已重新命名，內容與位置未變。'};
 }
 if(operation==='move'||operation==='copy'){
  if(!['桌面','作品夾'].includes(arg))return {state,applied:false,message:'先選目的資料夾。'};
  if(state.files.some(f=>f.folder===arg&&f.name===file.name))return {state,applied:false,message:'目的資料夾已有同名檔案，本次未變更。'};
  if(operation==='move')file.folder=arg;else{const copy={...file,id:'copy-'+state.nextId++,folder:arg};state.files.push(copy);state.drafts[copy.id]=copy.content;}
  return {state,applied:true,message:operation==='move'?'檔案已移到新位置，原位置不再有它。':'已建立另一份，原檔仍保留。'};
 }
 return {state,applied:false,message:'沒有這個操作。'};
}
function fileGoal(q,state){
 const house=state.files.find(f=>f.id==='house'),tree=state.files.find(f=>f.id==='tree'),oldTree=q.initial.find(f=>f.id==='tree');
 if(!house||JSON.stringify(tree)!==JSON.stringify(oldTree))return false;
 if(q.goal==='save')return state.files.length===2&&house.name==='小屋.txt'&&house.folder==='桌面'&&house.content==='藍色小屋';
 if(q.goal==='rename')return state.files.length===2&&house.name==='我的小屋.txt'&&house.folder==='桌面'&&house.content==='紅色小屋';
 if(q.goal==='move')return state.files.length===2&&house.name==='小屋.txt'&&house.folder==='作品夾'&&house.content==='紅色小屋';
 if(q.goal==='copy')return state.files.length===3&&house.name==='小屋.txt'&&house.folder==='桌面'&&house.content==='紅色小屋'&&state.files.some(f=>f.id!=='house'&&f.name==='小屋.txt'&&f.folder==='作品夾'&&f.content==='紅色小屋');
 return false;
}
return {directions,runRobot,createFiles,operateFile,fileGoal};});
