(function(root,factory){const api=typeof module==='object'&&module.exports?factory(require('./english-flex-data.js')):factory(root.EnglishFlexData);if(typeof module==='object'&&module.exports)module.exports=api;else root.EnglishFlex=api;})(typeof globalThis!=='undefined'?globalThis:this,data=>{'use strict';
const topics={time:'時間差一點',action:'地點與動作',travel:'交通別混搭'};
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;}
function english(q,choice){return q.stem+' '+q.options[choice]+' '+q.tail;}
function sentence(q,choice,style){const text=english(q,choice).replace(/[.!?]$/,'');return ["我們這次的安排是："+text+"，大家先把行程與地點核對好再出發。","這次"+text+"，先這樣安排。",text+"，OK啦。"][style];}
function ratio(text){const en=(text.match(/[a-z]/gi)||[]).length,zh=(text.match(/[㐀-鿿]/g)||[]).length;return en+zh?Math.round(en/(en+zh)*100):0;}
function create(mode='short'){if(!['short','all',...Object.keys(topics)].includes(mode))throw Error('不支援的練習範圍');const items=mode==='short'?shuffle(Object.keys(topics).flatMap(t=>shuffle(data.filter(q=>q.topic===t)).slice(0,4))):shuffle(data.filter(q=>mode==='all'||q.topic===mode));const traps=new Set(shuffle(items.map(q=>q.id)).slice(0,Math.floor(items.length/3)));return {items,traps,index:0,phase:'pick',choice:null,style:null,follow:null,records:[],done:false};}
function select(s,n,kind='choice'){if(s.done||!Number.isInteger(n))return false;if(s.phase==='check'&&kind==='follow'&&n>=0&&n<4){s.follow=n;return true;}if(s.phase!=='pick')return false;if(kind==='choice'&&n>=0&&n<4){s.choice=n;return true;}if(kind==='style'&&n>=0&&n<3){s.style=n;return true;}return false;}
function submit(s){if(s.done)return false;const q=s.items[s.index];if(s.phase==='pick'){
 if(s.choice===null||s.style===null)return false;const text=sentence(q,s.choice,s.style);s.pending={choice:s.choice,style:s.style,text,ratio:ratio(text),grammar:s.choice===q.answer,follow:null};s.pending.styleOK=s.pending.ratio>=q.target;
 if(s.traps.has(q.id)){s.phase='check';s.follow=null;return true;}
 }else if(s.phase==='check'){if(s.follow===null)return false;s.pending.follow={choice:s.follow,ok:s.follow===q.follow.answer};}else return false;
 const r=s.records[s.index]??={first:JSON.parse(JSON.stringify(s.pending)),tries:0};r.latest=JSON.parse(JSON.stringify(s.pending));r.tries++;s.phase='feedback';return true;
}
function retry(s){if(s.done||s.phase!=='feedback')return false;s.phase='pick';s.choice=null;s.style=null;s.follow=null;delete s.pending;return true;}
function next(s){if(s.done||s.phase!=='feedback')return false;if(s.index===s.items.length-1)s.done=true;else{s.index++;s.phase='pick';s.choice=null;s.style=null;s.follow=null;delete s.pending;}return true;}
function scores(s){const first=s.records.map(r=>r.first),latest=s.records.map(r=>r.latest);return {grammar:first.filter(r=>r.grammar).length,style:first.filter(r=>r.styleOK).length,follow:first.filter(r=>r.follow?.ok).length,followTotal:first.filter(r=>r.follow!==null).length,latestGrammar:latest.filter(r=>r.grammar).length,latestFollow:latest.filter(r=>r.follow?.ok).length};}
return {questions:data,topics,shuffle,english,sentence,ratio,create,select,submit,retry,next,scores};});
