'use strict';
const RetellingEngine = (() => {
  const copy = x => JSON.parse(JSON.stringify(x));
  const same = (a,b) => a.length===b.length&&a.every((v,i)=>v===b[i]);
  function initial(t){
    const s={finished:false};
    if(t.kind==='detect')s.answers=t.cards.map(()=>null);
    if(t.kind==='repair')s.values=t.fields.map(()=>null);
    if(t.kind==='relay')Object.assign(s,{values:[...t.origin],history:[],earliest:null});
    if(t.kind==='evidence')Object.assign(s,{opened:[],active:null,answer:null});
    return s;
  }
  function act(t,state,action,value){
    if(state.finished)return state;
    const s=copy(state);
    if(t.kind==='detect'&&action==='classify'){
      const [i,n]=value;if(!t.cards[i]||!Number.isInteger(n)||n<0||n>=t.labels.length)return state;s.answers[i]=n;
    }else if(t.kind==='repair'&&action==='choose'){
      const [i,n]=value;if(!t.fields[i]||!Number.isInteger(n)||!t.fields[i].options[n])return state;s.values[i]=n;
    }else if(t.kind==='relay'&&action==='hop'){
      if(s.history.length>=3||!Number.isInteger(value)||value<0||value>t.origin.length)return state;
      const before=[...s.values];if(value>0)s.values[value-1]=t.alternates[value-1];s.history.push({before,after:[...s.values],action:value});
    }else if(t.kind==='relay'&&action==='repair'){
      const [i,n]=value;if(s.history.length!==3||!t.origin[i]||![0,1].includes(n))return state;s.values[i]=n===0?t.origin[i]:t.alternates[i];
    }else if(t.kind==='relay'&&action==='earliest'){
      if(!Number.isInteger(value)||value<0||value>3||s.history.length!==3)return state;s.earliest=value;
    }else if(t.kind==='evidence'&&action==='open'){
      if(!Number.isInteger(value)||!t.sources[value])return state;s.active=value;if(!s.opened.includes(value))s.opened.push(value);s.answer=null;
    }else if(t.kind==='evidence'&&action==='answer'){
      if(s.active===null||!Number.isInteger(value)||!t.answers[value])return state;s.answer=value;
    }else return state;
    return s;
  }
  function earliest(t,s){const n=s.history.findIndex(h=>!same(h.after,t.origin));return n<0?0:n+1;}
  function ready(t,s){
    if(t.kind==='detect')return s.answers.every(a=>a!==null);
    if(t.kind==='repair')return s.values.every(a=>a!==null);
    if(t.kind==='relay')return s.history.length===3&&s.earliest!==null;
    return s.active!==null&&s.answer!==null;
  }
  function check(t,s){
    if(!ready(t,s))return false;
    if(t.kind==='detect')return s.answers.every((a,i)=>a===t.cards[i][1]);
    if(t.kind==='repair')return s.values.every((n,i)=>t.fields[i].options[n][0]===t.fields[i].answer);
    if(t.kind==='relay')return same(s.values,t.origin)&&s.earliest===earliest(t,s);
    return s.answer===t.sources[s.active].answer;
  }
  function draft(t,s){
    if(t.kind==='repair')return s.values.map((n,i)=>t.fields[i].label+'：'+(n===null?'（待選取）':t.fields[i].options[n][1])).join('；');
    if(t.kind==='relay')return t.names.map((n,i)=>n+'：'+s.values[i]).join('；');
    return '';
  }
  function report(t,s){
    if(t.kind==='detect')return t.cards.map((c,i)=>c[0]+' → '+(s.answers[i]===null?'未選':t.labels[s.answers[i]])).join('\n');
    if(t.kind==='repair')return draft(t,s);
    if(t.kind==='relay')return s.history.map((h,i)=>'第'+(i+1)+'棒：'+h.after.join('；')).join('\n')+'\n判斷最早變動：'+(s.earliest===0?'沒有':s.earliest+'棒')+'\n修復後：'+draft(t,s);
    return s.active===null?'尚未查看來源':'本次來源：'+t.sources[s.active].label+'\n'+t.sources[s.active].text+'\n我的結論：'+(s.answer===null?'未選':t.answers[s.answer]);
  }
  function reference(t,s){
    if(t.kind==='detect')return t.cards.map(c=>c[0]+' → '+t.labels[c[1]]+'。'+c[2]).join('\n');
    if(t.kind==='repair')return t.fields.map(f=>f.label+'：'+f.options.find(o=>o[0]===f.answer)[1]).join('；');
    if(t.kind==='relay')return '最早偏離原意：'+(earliest(t,s)||'沒有')+'；原本內容：'+t.origin.join('；');
    return s.active===null?'請先查看來源':t.answers[t.sources[s.active].answer];
  }
  function finish(t,state){if(state.finished||!ready(t,state))return state;return {...copy(state),finished:true,pass:check(t,state)};}
  return {initial,act,earliest,ready,check,draft,report,reference,finish};
})();
if(typeof module!=='undefined')module.exports=RetellingEngine;
