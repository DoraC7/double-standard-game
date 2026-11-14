'use strict';
const KeelungEngine=(()=>{
 const clone=x=>JSON.parse(JSON.stringify(x));
 function initial(t){const s={finished:false,note:'先操作，再提交本次探索。'};if(t.kind==='route')Object.assign(s,{current:'harbor',visited:['harbor'],history:[],cost:0,mode:'walk'});if(t.kind==='sort')Object.assign(s,{order:[...t.order],moves:0});if(t.kind==='match')s.answers=t.slots.map(()=>null);if(t.kind==='plan')s.selected=[];return s;}
 function act(D,t,state,a,v){if(state.finished)return state;const s=clone(state);
  if(t.kind==='route'&&a==='mode'){if(!['walk','transit'].includes(v))return state;s.mode=v;}
  else if(t.kind==='route'&&a==='move'){if(!D.points[v]||v===s.current)return state;const edge=D.edges.find(e=>e[2]===s.mode&&((e[0]===s.current&&e[1]===v)||(e[1]===s.current&&e[0]===v)));if(!edge){s.note='本關沒有這條'+(s.mode==='walk'?'步行':'大眾運輸')+'示意連線；位置與移動格沒有改變。';return s;}s.history.push({from:s.current,to:v,mode:s.mode,cost:edge[3]});s.cost+=edge[3];s.current=v;if(!s.visited.includes(v))s.visited.push(v);s.note='抵達'+D.byId[v].name+'，下方顯示這一站的實際地方卡。';}
  else if(t.kind==='sort'&&a==='move'){const[id,d]=v,n=s.order.indexOf(id),to=n+d;if(!Number.isInteger(id)||![-1,1].includes(d)||n<0||to<0||to>=s.order.length)return state;[s.order[n],s.order[to]]=[s.order[to],s.order[n]];s.moves++;}
  else if(t.kind==='match'&&a==='match'){const[i,id]=v;if(!t.slots[i]||!t.options.includes(id))return state;s.answers[i]=id;}
  else if(t.kind==='plan'&&a==='toggle'){if(!Number.isInteger(v)||!t.options[v])return state;s.selected=s.selected.includes(v)?s.selected.filter(n=>n!==v):[...s.selected,v];}
  else return state;return s;
 }
 function coverage(t,s){return [...new Set(s.selected.flatMap(n=>t.options[n][1]))];}
 function ready(t,s){if(t.kind==='route')return s.history.length>0;if(t.kind==='sort')return s.moves>0;if(t.kind==='match')return s.answers.every(x=>x!==null);return s.selected.length>0;}
 function check(t,s){if(!ready(t,s))return false;if(t.kind==='route')return s.current===t.end&&s.cost<=t.limit&&t.groups.every(g=>g.some(p=>s.visited.includes(p)));if(t.kind==='sort')return s.order.every((n,i)=>n===i);if(t.kind==='match')return s.answers.every((n,i)=>n===t.slots[i][1]);const c=coverage(t,s);return t.needs.every(x=>c.includes(x))&&s.selected.reduce((n,i)=>n+t.options[i][2],0)<=t.limit&&!s.selected.some(i=>t.options[i][3]);}
 function finish(t,s){if(s.finished||!ready(t,s))return s;return {...clone(s),finished:true,pass:check(t,s)};}
 function report(D,t,s){if(t.kind==='route')return '路線：'+['harbor',...s.history.map(h=>h.to)].map(id=>D.byId[id].name).join(' → ')+'\n'+s.history.map(h=>(h.mode==='walk'?'步行':'大眾運輸')+'：'+D.byId[h.from].name+' → '+D.byId[h.to].name+'（'+h.cost+'移動格）').join('\n')+'\n本關消耗：'+s.cost+' / '+t.limit+'移動格；非真實時間或距離。';if(t.kind==='sort')return s.order.map(n=>t.items[n].join('：')).join('\n');if(t.kind==='match')return t.slots.map((x,i)=>x[0]+' → '+(D.byId[s.answers[i]]?.name||'未選')).join('\n');return s.selected.map(n=>t.options[n][0]).join('\n')+'\n已涵蓋：'+coverage(t,s).join('、');}
 function reference(D,t){if(t.kind==='route')return '要走訪：'+t.groups.map(g=>g.map(id=>D.byId[id].name).join('或')).join('，')+'；終點'+D.byId[t.end].name+'，上限'+t.limit+'移動格。';if(t.kind==='sort')return t.items.map(x=>x.join('：')).join('\n');if(t.kind==='match')return t.slots.map(x=>x[0]+' → '+D.byId[x[1]].name).join('\n');return '應涵蓋：'+t.needs.join('、')+'；不超過'+t.limit+'規劃格，也不選與情境衝突的說法。';}
 return {initial,act,coverage,ready,check,finish,report,reference};
})();if(typeof module!=='undefined')module.exports=KeelungEngine;
