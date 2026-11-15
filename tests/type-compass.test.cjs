const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const data=require('../type-compass-data.js');
const game=require('../type-compass-engine.js');

test('80 題原創題庫四向度均衡，左右極性各半',()=>{
  assert.equal(data.questions.length,80);
  assert.equal(new Set(data.questions.map(q=>q.id)).size,80);
  for(const axis of data.axes){
    const items=data.questions.filter(q=>q.axis===axis.id);
    assert.equal(items.length,20,axis.id);
    assert.equal(items.filter(q=>q.direction===1).length,10,axis.id+' left-first');
    assert.equal(items.filter(q=>q.direction===-1).length,10,axis.id+' right-first');
  }
});

test('快速版20題每個向度取5題，完整模式保留全部題目且交錯呈現',()=>{
  const quick=game.createSet(data,'quick',()=>0.37);
  assert.equal(quick.length,20);
  for(const axis of data.axes)assert.equal(quick.filter(q=>q.axis===axis.id).length,5);
  const full=game.createSet(data,'full',()=>0.42);
  assert.equal(full.length,80);
  assert.ok(full.every((q,i)=>i===0||q.axis!==full[i-1].axis));
  assert.deepEqual(new Set(full.map(q=>q.id)),new Set(data.questions.map(q=>q.id)));
});

test('計分依題目左右方向校正；強偏向與近中線分開呈現',()=>{
  const full=game.createSet(data,'full',()=>0.5);
  const answers=Object.fromEntries(full.map(q=>[q.id,-2*q.direction]));
  const result=game.calculate(data,full,answers);
  assert.equal(result.type,'ESTJ');
  assert.ok(result.axes.every(a=>a.score===40&&a.position===1));
  const middle=game.calculate(data,full,Object.fromEntries(full.map(q=>[q.id,0])));
  assert.ok(middle.axes.every(a=>a.score===0&&a.level==='接近中線'&&a.displayLetter==='?'&&!a.decisive));
  assert.equal(middle.type,'????');
});

test('答案偏向每題左側不會因題目方向不平衡而偏向某一極',()=>{
  const full=game.createSet(data,'full',()=>0.25);
  const left=game.calculate(data,full,Object.fromEntries(full.map(q=>[q.id,-2])));
  assert.ok(left.axes.every(a=>a.score===0&&a.displayLetter==='?'));
});

test('報告文字說明非官方限制並保留每題回覆',()=>{
  const quick=game.createSet(data,'quick',()=>0.61);
  const answers=Object.fromEntries(quick.map(q=>[q.id,0]));
  const text=game.exportText(game.calculate(data,quick,answers),quick,answers);
  assert.match(text,/非官方 MBTI/);
  assert.match(text,/非經驗驗證的心理量表/);
  assert.ok(text.includes(quick[0].prompt));
});

test('頁面不把80題或中線提示宣稱成已驗證準確度',()=>{
  const html=fs.readFileSync('type-compass.html','utf8');
  const js=fs.readFileSync('type-compass.js','utf8');
  assert.match(html,/完整探索・80 題/);
  assert.match(html,/題數增加本身不代表更準/);
  assert.match(html,/未經代表性樣本試測/);
  assert.match(js,/接近中線（不分側）/);
  assert.match(js,/不強行分類/);
});

test('未知不當居中；低覆蓋不分型且不計入分母',()=>{
  const set=game.createSet(data,'quick');
  const answers=Object.fromEntries(set.map(q=>[q.id,null]));
  let r=game.calculate(data,set,answers);
  assert.equal(r.answered,0);assert.equal(r.type,'????');
  assert.ok(r.axes.every(a=>!a.sufficient&&a.level==='有效作答不足'));
  const ei=set.filter(q=>q.axis==='EI');
  for(const q of ei.slice(0,3))answers[q.id]=-2*q.direction;
  answers.unrelated=2;
  r=game.calculate(data,set,answers);
  assert.equal(r.answered,3);assert.equal(r.axes[0].position,1);
  assert.equal(r.axes[0].displayLetter,'?');
  answers[ei[3].id]=-2*ei[3].direction;
  r=game.calculate(data,set,answers);
  assert.equal(r.axes[0].displayLetter,'E');assert.equal(r.axes[0].maxScore,8);
  const report=game.exportText(r,set,answers);
  assert.match(report,/有效 4\/5 題/);assert.match(report,/無法判斷／不適用（不計分）/);
  assert.match(report,/版本：2026-11-15.4/);
});

test('固定快測選題不受種子改變，但題序會變；非法答案不算有效',()=>{
  assert.deepEqual(new Set(game.createSet(data,'quick',()=>0).map(q=>q.id)),new Set(game.createSet(data,'quick',()=>0.99).map(q=>q.id)));
  assert.notDeepEqual(game.createSet(data,'quick',()=>0),game.createSet(data,'quick',()=>0.99));
  const set=game.createSet(data,'quick');
  const r=game.calculate(data,set,Object.fromEntries(set.map((q,i)=>[q.id,[3,-3,'0',undefined][i%4]])));
  assert.equal(r.answered,0);assert.equal(r.type,'????');
});

test('審查發現的十題左右順序與軸方向相符',()=>{
  const firstDescriptions={sn08:'沿用證明可行的步驟',sn20:'先找實際例子',tf18:'是否偏離原則',jp06:'先評估變動成本',jp07:'把題目拆小',jp08:'主要行程先訂好',jp09:'整理成明確的下一步',jp10:'先訂出工作階段',jp19:'先判斷是否值得變更',jp20:'保留幾個階段檢查點'};
  for(const [id,phrase] of Object.entries(firstDescriptions)){
    const q=data.questions.find(q=>q.id===id);
    assert.ok((q.direction===1?q.left:q.right).includes(phrase),id);
    const set=data.questions.filter(x=>x.axis===q.axis);
    const answers=Object.fromEntries(set.map(x=>[x.id,0]));
    answers[id]=-2*q.direction;
    assert.equal(game.calculate(data,set,answers).axes.find(a=>a.id===q.axis).score,2,id);
  }
});


test('三種長度涵蓋每軸五種情境；短版為長版子集且40題左右各半',()=>{
  for(const [mode,n,perFacet] of [['quick',20,1],['standard',40,2],['full',80,4]]){
    const qs=game.createSet(data,mode,()=>0.7);
    assert.equal(qs.length,n);assert.equal(new Set(qs.map(q=>q.id)).size,n);
    for(const axis of data.axes){
      const items=qs.filter(q=>q.axis===axis.id);
      const facets=[...new Set(items.map(q=>q.facet))];assert.equal(facets.length,5);
      for(const facet of facets)assert.equal(items.filter(q=>q.facet===facet).length,perFacet);
      if(mode==='standard')assert.equal(items.filter(q=>q.direction===1).length,5);
    }
  }
  assert.ok(data.forms.quick.every(id=>data.forms.standard.includes(id)));
});

test('平均相同但作答分布不同，結果與匯出保留差別及選項強度',()=>{
  const qs=game.createSet(data,'full',()=>0.5);
  const neutral=Object.fromEntries(qs.map(q=>[q.id,0]));
  const mixed=Object.fromEntries(qs.map(q=>[q.id,-2]));
  const a=game.calculate(data,qs,neutral),b=game.calculate(data,qs,mixed);
  assert.equal(a.type,b.type);
  assert.ok(a.axes.every(x=>x.neutralCount===20));
  assert.ok(b.axes.every(x=>x.firstCount===10&&x.secondCount===10&&x.neutralCount===0));
  assert.match(game.exportText(b,qs,mixed),/方向抵銷/);
  assert.match(game.exportText(b,qs,mixed),/很像左側/);
  mixed[qs[0].id]=-1;
  assert.match(game.exportText(game.calculate(data,qs,mixed),qs,mixed),/比較像左側/);
});
