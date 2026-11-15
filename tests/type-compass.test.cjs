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
  assert.match(report,/版本：2026-11-15.2/);
});

test('固定快測不受隨機種子改變；非法答案不算有效',()=>{
  assert.deepEqual(game.createSet(data,'quick',()=>0),game.createSet(data,'quick',()=>0.99));
  const set=game.createSet(data,'quick');
  const r=game.calculate(data,set,Object.fromEntries(set.map((q,i)=>[q.id,[3,-3,'0',undefined][i%4]])));
  assert.equal(r.answered,0);assert.equal(r.type,'????');
});
