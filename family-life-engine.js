(function(root){
'use strict';
function shuffle(values,rng=Math.random){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function pick(bank,mode,rng=Math.random){
 if(mode==='all')return shuffle(bank.items,rng);
 if(mode!=='short')return shuffle(bank.items.filter(q=>q.category===mode),rng);
 const categories=shuffle(bank.categories,rng);return shuffle(categories.flatMap((c,i)=>shuffle(bank.items.filter(q=>q.category===c),rng).slice(0,i<3?2:1)),rng);
}
function valid(q,value){if(q.kind==='choice')return Number.isInteger(value)&&value>=0&&value<q.options.length;
 if(q.kind==='order')return Array.isArray(value)&&value.length===q.options.length&&new Set(value).size===q.options.length&&value.every(v=>Number.isInteger(v)&&v>=0&&v<q.options.length);
 return Array.isArray(value)&&value.length===q.options.length&&value.every(v=>typeof v==='boolean');}
function judge(q,value){if(!valid(q,value))return false;if(q.kind==='choice')return value===q.answer;if(q.kind==='spot')return value.every((v,i)=>v===q.answer.includes(i));return q.before.every(([a,b])=>value.indexOf(a)<value.indexOf(b));}
function create(bank,mode,rng){return {items:pick(bank,mode,rng),index:0,records:{},locked:false,done:false};}
function submit(state,value){if(state.locked||state.done)return null;const q=state.items[state.index];if(value!=='unsure'&&!valid(q,value))return null;const pass=value!=='unsure'&&judge(q,value),old=state.records[q.id];
 const copy=Array.isArray(value)?[...value]:value;const r={first:old?old.first:pass,firstValue:old?old.firstValue:copy,latest:pass,value:copy,tries:(old?.tries||0)+1};state.records[q.id]=r;state.locked=true;return r;}
function retry(s){if(!s.locked||s.done)return false;s.locked=false;return true;}
function next(s){if(!s.locked||s.done)return false;s.index++;s.locked=false;s.done=s.index>=s.items.length;return true;}
const api={shuffle,pick,valid,judge,create,submit,retry,next};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FamilyLifeEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
