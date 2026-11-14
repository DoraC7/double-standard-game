'use strict';
const TokenValueEngine=(()=>{
  const clone=x=>JSON.parse(JSON.stringify(x));
  const formatNames=['短句','條列步驟','完整說明'];
  const formatCosts=[0,1,4];
  function initial(t){
    const s={fuel:0,log:[],output:'',done:false,efficient:false,passed:false,finished:false,note:'先操作策略，再驗收本關。'};
    if(t.kind==='media')Object.assign(s,{opened:[],active:null,seen:{},frame:0,answer:null});
    if(t.kind==='prompt')Object.assign(s,{selected:[],last:null,repeats:0});
    if(t.kind==='reply')Object.assign(s,{selected:[],order:[],format:null});
    if(t.kind==='stop')Object.assign(s,{version:0,fixed:false,badSeen:false,evidence:{},deployedVersion:null});
    return s;
  }
  function signature(s){return [...s.selected].sort((a,b)=>a-b).join(',');}
  function coverage(t,s){const covered=new Set();for(const n of s.opened){const src=t.sources[n];if(src.kind==='timeline'&&(s.seen[n]||[]).length<src.frames.length)continue;src.covers.forEach(k=>covered.add(k));}return covered;}
  function text(t,s){const chunks=s.order.map(n=>t.blocks[n].text);return s.format===1?chunks.map(c=>'• '+c).join('\n'):s.format===2?'說明\n'+chunks.join('\n\n'):chunks.join('');}
  function replyCost(t,s){return 1+s.selected.reduce((n,i)=>n+t.blocks[i].cost,0)+(s.format===null?0:formatCosts[s.format]);}
  function proof(t,s){return t.required.filter(k=>s.evidence[k]!==s.version);}
  function ready(t,s){if(t.kind==='media')return s.opened.length>0&&s.answer!==null;if(t.kind==='prompt')return !!s.last&&s.last.signature===signature(s);if(t.kind==='reply')return s.selected.length>0&&s.format!==null;return s.log.length>0;}
  function evaluate(t,s){
    if(t.kind==='media')return t.need.every(k=>coverage(t,s).has(k))&&s.answer===t.answer;
    if(t.kind==='prompt')return !!s.last&&s.last.signature===signature(s)&&s.last.complete;
    if(t.kind==='reply')return t.required.every(k=>s.selected.some(n=>t.blocks[n].key===k))&&t.formats.includes(s.format)&&(t.orderEdges||[]).every(([a,b])=>s.order.findIndex(n=>t.blocks[n].key===a)<s.order.findIndex(n=>t.blocks[n].key===b));
    return proof(t,s).length===0&&(t.mode!=='form'||s.fixed)&&(t.mode!=='site'||s.deployedVersion===s.version);
  }
  function finish(t,s){
    if(!ready(t,s))return s;
    if(t.kind==='media'){s.fuel++;s.output=s.answer===t.answer?t.answers[s.answer]:'這個結論不符合本題證據與目標。';}
    if(t.kind==='reply'){s.fuel=replyCost(t,s);s.output=text(t,s);}
    if(t.kind==='prompt')s.output=s.last.response;
    if(t.kind==='stop')s.output='目前版本v'+s.version+'；本版已取得：'+Object.keys(s.evidence).filter(k=>s.evidence[k]===s.version).join('、');
    s.done=evaluate(t,s);s.efficient=s.done&&s.fuel<=t.target;s.passed=s.efficient;s.finished=true;
    s.note=s.done?(s.efficient?'任務有完成，投入也符合本關合理範圍。':'任務有完成，但本關有可避免的投入；不是內容做錯。'):'還缺少必要證據、內容或本版驗收；低消耗不代表完成。';
    s.log.push('驗收：'+s.note);return s;
  }
  function stopAction(t,s,id){
    const a=t.actions.find(x=>x.id===id);if(!a)return s;
    s.fuel+=a.cost;const has=k=>s.evidence[k]===s.version,mark=k=>{s.evidence[k]=s.version;};let note='';
    if(id==='ask')note='模擬回覆：「已在處理。」沒有新增本題驗收證據。';
    else if(id==='video')note='做了與本題無關的長片示範，仍沒有取得缺少的驗收證據。';
    else if(id==='diff'){mark('diff');note='已查看v'+s.version+'差異，範圍與本題一致。';}
    else if(id==='normal'){mark('normal');note='正常輸入：實際新增一筆，通過v'+s.version+'情境。';}
    else if(id==='empty'){if(s.fixed){mark('empty');note='空白輸入：實際沒有新增，通過v'+s.version+'情境。';}else{s.badSeen=true;note='實際發現：空白仍新增一筆，尚未修正。';}}
    else if(id==='fix'){if(!s.badSeen)note='還沒取得本題空白錯誤的重現結果，先找出具體差異；本次沒有改程式。';else if(s.fixed)note='已修正，本次沒有產生新版本。';else{s.version++;s.fixed=true;note='依重現結果完成模擬修正，成為v'+s.version+'；舊版驗收不能替新版背書。';}}
    else if(id==='candidate'){mark('candidate');note='v'+s.version+'候選版流程通過；仍不代表正式站更新。';}
    else if(id==='deploy'){if(!has('candidate')||!has('diff'))note='缺少本版候選測試或差異審查，模擬發布未執行。';else{s.deployedVersion=s.version;mark('deploy');note='已模擬發布v'+s.version+'；還要核對正式網址。';}}
    else if(id==='production'){if(s.deployedVersion!==s.version)note='模擬正式站仍是舊版或未發布，不把HTTP有回應當新版驗收。';else{mark('production');note='正式站模擬回應v'+s.version+'，完整本題流程通過。';}}
    else if(id==='edit'){s.version++;note='改動產生v'+s.version+'；先前的測試與發布仍屬舊版，需要重驗。';}
    else if(id==='backup'){mark('backup');note='核對備份版本v'+s.version+'與範圍；尚未證明能還原。';}
    else if(id==='restore'){if(!has('backup'))note='尚未核對版本，隔離還原未執行。';else{mark('restore');note='已在虛構隔離位置還原，未碰正式資料；仍待比對。';}}
    else if(id==='compare'){if(!has('restore'))note='沒有本版測試還原可比對。';else{mark('compare');note='本版還原內容與完整性比對通過。';}}
    else if(id==='handoff'){if(!has('compare'))note='還沒比對成功，不寫成已驗證可用。';else{mark('handoff');note='已記錄備份版本、隔離還原與比對結果，未驗證事項另列。';}}
    s.note=note;s.log.push(a.label+'（'+a.cost+'格）：'+note);return s;
  }
  function act(t,state,a,v){
    if(state.finished)return state;const s=clone(state);
    if(a==='finish')return finish(t,s);
    if(t.kind==='media'){
      if(a==='open'){
        if(!Number.isInteger(v)||!t.sources[v])return state;const src=t.sources[v];
        if(!s.opened.includes(v)){s.opened.push(v);s.fuel+=src.cost;s.log.push('檢視'+src.label+'：'+src.cost+'格');}
        s.active=v;s.frame=0;s.answer=null;if(src.kind==='timeline'&&!s.seen[v])s.seen[v]=[0];s.note='查看目前選取媒介；同一份示範內容重看不再扣遊戲燃料。';
      }else if(a==='frame'){
        const src=t.sources[s.active];if(!src||src.kind!=='timeline'||!Number.isInteger(v)||v<0||v>=src.frames.length)return state;s.frame=v;if(!s.seen[s.active].includes(v))s.seen[s.active].push(v);s.answer=null;s.note='時間軸已移到：'+src.frames[v].caption;
      }else if(a==='answer'){if(!Number.isInteger(v)||!t.answers[v])return state;s.answer=v;}else return state;
    }else if(t.kind==='prompt'){
      if(a==='toggle'){if(!Number.isInteger(v)||!t.blocks[v])return state;s.selected=s.selected.includes(v)?s.selected.filter(n=>n!==v):[...s.selected,v];s.note='輸入草稿已變更；送出模擬後才耗燃料，舊回覆不可驗收新草稿。';}
      else if(a==='run'){
        const sig=signature(s),cost=2+s.selected.reduce((n,i)=>n+t.blocks[i].cost,0),missing=t.required.filter(k=>!s.selected.some(n=>t.blocks[n].key===k));s.fuel+=cost;s.repeats=s.last&&s.last.signature===sig?s.repeats+1:0;
        const response=missing.length?'仍缺少：'+missing.map(k=>t.blocks.find(b=>b.key===k).text).join('／')+'。沒有新證據，不重新猜。':t.reply;
        s.last={signature:sig,complete:!missing.length,response};s.note=s.repeats?'輸入未改，本次回覆沒有新資訊；先看缺少什麼。':'模擬已回覆，請核對是否解決本題。';s.log.push('送出第'+(s.log.length+1)+'次：'+cost+'格；'+response);
      }else return state;
    }else if(t.kind==='reply'){
      if(a==='toggle'){if(!Number.isInteger(v)||!t.blocks[v])return state;if(s.selected.includes(v)){s.selected=s.selected.filter(n=>n!==v);s.order=s.order.filter(n=>n!==v);}else{s.selected.push(v);s.order.push(v);}}
      else if(a==='format'){if(!Number.isInteger(v)||v<0||v>=3)return state;s.format=v;}
      else if(a==='move'){if(!Array.isArray(v))return state;const[n,d]=v;if(!Number.isInteger(n)||![-1,1].includes(d)||n<0||n+d<0||n>=s.order.length||n+d>=s.order.length)return state;[s.order[n],s.order[n+d]]=[s.order[n+d],s.order[n]];}
      else return state;s.note='輸出草稿已更新，確認後才記錄燃料；下方字元數不是Token數。';
    }else return stopAction(t,s,a);
    return s;
  }
  function bad(t){let s=initial(t),steps=[];const apply=(a,v)=>{s=act(t,s,a,v);};
    if(t.kind==='media'){apply('open',3);apply('answer',t.answer);steps=['傳整段長片，包含大量與目標無關內容','最後仍要提出本題的結論'];}
    if(t.kind==='prompt'){for(let n=0;n<3;n++)apply('run');steps=['沒有補缺少條件','同一份輸入送三次，得到同樣缺資料的回覆'];}
    if(t.kind==='reply'){t.blocks.forEach((_,n)=>apply('toggle',n));apply('format',2);steps=['保留全部包裝與重述','不管任務大小，一律完整長篇說明'];}
    if(t.kind==='stop'){for(let n=0;n<3;n++)apply('ask');steps=['不看產物，也不跑本題驗收','連問三次完成了沒'];}
    apply('finish');return {...s,steps};
  }
  function sample(t){let s=initial(t);const apply=(a,v)=>{s=act(t,s,a,v);};
    if(t.kind==='media'){const n=t.sources.findIndex(src=>src.covers.length&&src.kind!=='long');apply('open',n);if(t.sources[n].kind==='timeline')t.sources[n].frames.forEach((_,f)=>apply('frame',f));apply('answer',t.answer);}
    if(t.kind==='prompt'){t.blocks.forEach((b,n)=>{if(t.required.includes(b.key))apply('toggle',n);});apply('run');}
    if(t.kind==='reply'){t.blocks.forEach((b,n)=>{if(t.required.includes(b.key))apply('toggle',n);});apply('format',t.formats[0]);}
    if(t.kind==='stop'){const ids=t.mode==='form'?['empty','fix','diff','normal','empty']:t.mode==='site'?['diff','candidate','deploy','production']:['backup','restore','compare','handoff'];ids.forEach(a=>apply(a));}
    apply('finish');return s;
  }
  return {initial,act,coverage,text,replyCost,ready,evaluate,proof,bad,sample,formatNames,formatCosts};
})();
if(typeof module!=='undefined')module.exports=TokenValueEngine;
