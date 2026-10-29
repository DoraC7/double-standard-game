(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./ignorance-cases.js'):root.IGNORANCE_CASES);if(typeof module==='object'&&module.exports)module.exports=api;else root.Ignorance=api;})(typeof globalThis!=='undefined'?globalThis:this,cases=>{
'use strict';
const areas={image:'畫面之外',cause:'因果別跳步',source:'來源與原話',update:'證據來了，改判'};
const stages=['拆原話','挑查證','更新結論'];
function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function create(mode='quick',rng=Math.random){
 if(!['quick','full'].includes(mode))throw new Error('不支援的模式');
 const items=mode==='quick'?shuffle(Object.keys(areas).map(a=>shuffle(cases.filter(c=>c.area===a),rng)[0]),rng):shuffle(cases,rng);
 return {mode,items,index:0,stage:0,selected:null,opened:null,locked:false,paused:false,done:false,results:[]};
}
function question(s){
 if(s.done)return null;
 const c=s.items[s.index];
 if(s.stage===0)return {prompt:'只按原話與已知資訊，問題在哪裡？也可能沒有問題。',options:c.diagnosis,answer:c.answer,why:c.why};
 if(s.stage===1)return {prompt:c.checkPrompt||'哪份資料最能核對原話的關鍵問題？確認後才會翻開內容。',options:c.cards.map(x=>x.title),answer:c.best,why:c.checkWhy};
 const card=c.cards[s.opened];
 return {prompt:'只根據已知資訊與你翻開的這張卡，現在能說到哪裡？',options:[card.conclusion,...c.overclaims],answer:0,why:card.why};
}
function active(s){return !s.done&&!s.paused&&!s.locked;}
function select(s,value){if(!active(s)||!Number.isInteger(value)||value<0||value>2)return false;s.selected=value;return true;}
function submit(s,value=s.selected){
 if(!active(s)||(value!=='unsure'&&(!Number.isInteger(value)||value<0||value>2)))return null;
 const q=question(s),key=s.index*3+s.stage,old=s.results[key],ok=value===q.answer;
 if(s.stage===1)s.opened=value==='unsure'?q.answer:value;
 const result={first:old?old.first:ok,firstValue:old?old.firstValue:value,latest:ok,value,tries:old?old.tries+1:1,answer:q.options[q.answer],chosen:value==='unsure'?'先看解析':q.options[value],why:q.why};
 s.results[key]=result;s.locked=true;return result;
}
function retry(s){if(s.done||s.paused||!s.locked||s.results[s.index*3+s.stage].latest)return false;s.locked=false;s.selected=null;if(s.stage===1)s.opened=null;return true;}
function next(s){
 if(s.done||s.paused||!s.locked)return false;
 if(s.stage<2)s.stage++;else if(s.index<s.items.length-1){s.index++;s.stage=0;s.opened=null;}else{s.done=true;return true;}
 s.selected=null;s.locked=false;return true;
}
function pause(s,value){if(s.done||s.paused===value)return false;s.paused=value;return true;}
function summary(s){return {completed:s.results.length,total:s.items.length*3,first:s.results.filter(r=>r.first).length,latest:s.results.filter(r=>r.latest).length};}
function exportText(s){
 const score=summary(s),lines=['無知大挑戰｜本輪練習紀錄',`已核對 ${score.completed} / ${score.total} 步；首次答對 ${score.first} 步；重試後答對 ${score.latest} 步。`,'分數只記本輪選擇，不代表智力或人格。'];
 s.items.forEach((c,i)=>{lines.push('',`${i+1}. ${c.title}`,`原話：${c.claim}`);stages.forEach((stage,j)=>{const r=s.results[i*3+j];if(r)lines.push(`${stage}｜首次${r.first?'答對':'待複習'}｜最近選擇：${r.chosen}`,`核對：${r.answer}`,`解析：${r.why}`);});});return lines.join('\n');
}
return {cases,areas,stages,shuffle,create,question,select,submit,retry,next,pause,summary,exportText};
});
