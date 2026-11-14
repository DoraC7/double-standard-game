'use strict';
const ScopeCreepEngine=(()=>{
 const clone=x=>JSON.parse(JSON.stringify(x));
 const deals=[{name:'維持原約定',nowTime:8,nowCost:10,laterTime:0,laterCost:0},{name:'同意延長兩天、追加2預算點',nowTime:12,nowCost:12,laterTime:0,laterCost:0},{name:'同意分期：次期另給8工作格、10預算點',nowTime:8,nowCost:10,laterTime:8,laterCost:10}];
 function initial(t){return {version:0,core:t.core.map(()=>true),choices:t.requests.map(()=>null),deal:null,order:{now:t.core.map(x=>x.id),later:[]},last:null,finished:false};}
 function tasks(t,s,phase){const out=phase==='now'?t.core.filter((_,i)=>s.core[i]):[];t.requests.forEach((r,i)=>{if(s.choices[i]===phase)out.push(...r.tasks);});return out;}
 function sync(t,s){for(const phase of ['now','later']){const ids=tasks(t,s,phase).map(x=>x.id);s.order[phase]=s.order[phase].filter(x=>ids.includes(x));ids.forEach(id=>{if(!s.order[phase].includes(id))s.order[phase].push(id);});}}
 function signature(s){return JSON.stringify([s.core,s.choices,s.deal,s.order,s.version]);}
 function act(t,state,a,v){if(state.finished)return state;const s=clone(state);
  if(a==='core'){if(!Number.isInteger(v)||!t.core[v])return state;s.core[v]=!s.core[v];sync(t,s);}
  else if(a==='request'){const[i,phase]=v;if(!t.requests[i]||!['now','later','decline'].includes(phase))return state;s.choices[i]=phase;sync(t,s);}
  else if(a==='deal'){if(!Number.isInteger(v)||!deals[v])return state;s.deal=v;}
  else if(a==='move'){const[phase,id,d]=v;if(!['now','later'].includes(phase)||![-1,1].includes(d))return state;const n=s.order[phase].indexOf(id),to=n+d;if(n<0||to<0||to>=s.order[phase].length)return state;[s.order[phase][n],s.order[phase][to]]=[s.order[phase][to],s.order[phase][n]];}
  else if(a==='run'){if(!planned(s))return state;s.last=run(t,s);}
  else return state;if(a!=='run'&&signature(s)!==signature(state))s.version++;return s;
 }
 function planned(s){return s.deal!==null&&s.choices.every(x=>x!==null);}
 function usage(t,s){const d=deals[s.deal]||deals[0],out={};for(const phase of ['now','later']){const list=tasks(t,s,phase);out[phase]={time:list.reduce((n,x)=>n+x.time,0),cost:list.reduce((n,x)=>n+x.cost,0),timeCap:d[phase+'Time'],costCap:d[phase+'Cost']};}return out;}
 function run(t,s){const done=new Set(),log=[],use=usage(t,s);let blocked=0;
  for(const phase of ['now','later']){let elapsed=0;const list=tasks(t,s,phase);for(const id of s.order[phase]){const x=list.find(x=>x.id===id);if(!x)continue;elapsed+=x.time;const missing=x.deps.filter(k=>!done.has(k));if(missing.length){blocked++;log.push((phase==='now'?'首期':'次期')+'｜'+x.name+'：相依工作還沒完成，本步未成功。');}else{done.add(id);log.push((phase==='now'?'首期':'次期')+'｜'+x.name+'：第'+(elapsed-x.time+1)+'～'+elapsed+'格完成。');}}}
  const overflow=Object.values(use).reduce((n,p)=>n+Math.max(0,p.time-p.timeCap)+Math.max(0,p.cost-p.costCap),0),core=t.core.every(x=>done.has(x.id)),accepted=s.choices.some(x=>x==='now'||x==='later'),complete=t.requests.every((r,i)=>!['now','later'].includes(s.choices[i])||r.tasks.every(x=>done.has(x.id))),chaos=overflow+blocked*2+(!core?3:0)+(!accepted?2:0);
  return {signature:signature(s),pass:core&&accepted&&complete&&chaos===0,core,accepted,complete,chaos,use,log,done:[...done]};
 }
 function ready(s){return !!s.last&&s.last.signature===signature(s);}
 function finish(t,s){if(s.finished||!ready(s))return s;return {...clone(s),finished:true,pass:s.last.pass};}
 function report(t,s){return '協議：'+(s.deal===null?'未選':deals[s.deal].name)+'\n'+t.requests.map((r,i)=>r.name+'：'+({now:'首期',later:'次期',decline:'不承接'}[s.choices[i]]||'未決定')).join('\n')+'\n原始交付：'+(s.last?.core?'完成':'未完成')+'\n混亂值：'+(s.last?.chaos??'未模擬')+'\n'+(s.last?.log.join('\n')||'尚未模擬');}
 return {deals,initial,tasks,signature,act,planned,usage,run,ready,finish,report};
})();if(typeof module!=='undefined')module.exports=ScopeCreepEngine;
