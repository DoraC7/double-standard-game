const {test}=require('node:test');
const assert=require('node:assert/strict');
const data=require('../type-compass-data.js');
const game=require('../type-compass-engine.js');

test('40 題原創題庫四向度均衡，左右極性各半',()=>{
  assert.equal(data.questions.length,40);
  assert.equal(new Set(data.questions.map(q=>q.id)).size,40);
  for(const axis of data.axes){
    const items=data.questions.filter(q=>q.axis===axis.id);
    assert.equal(items.length,10,axis.id);
    assert.equal(items.filter(q=>q.direction===1).length,5,axis.id+' left-first');
    assert.equal(items.filter(q=>q.direction===-1).length,5,axis.id+' right-first');
  }
});

test('快速版20題每個向度取5題，完整模式保留全部題目',()=>{
  const quick=game.createSet(data,'quick',()=>0.37);
  assert.equal(quick.length,20);
  for(const axis of data.axes)assert.equal(quick.filter(q=>q.axis===axis.id).length,5);
  const full=game.createSet(data,'full',()=>0.42);
  assert.deepEqual(new Set(full.map(q=>q.id)),new Set(data.questions.map(q=>q.id)));
});

test('計分依題目左右方向校正；強偏向與近中線分開呈現',()=>{
  const full=game.createSet(data,'full',()=>0.5);
  const answers=Object.fromEntries(full.map(q=>[q.id,-2*q.direction]));
  const result=game.calculate(data,full,answers);
  assert.equal(result.type,'ESTJ');
  assert.ok(result.axes.every(a=>a.score===20&&a.position===1));
  const middle=game.calculate(data,full,Object.fromEntries(full.map(q=>[q.id,0])));
  assert.ok(middle.axes.every(a=>a.score===0&&a.level==='接近中線'));
});

test('答案偏向每題左側不會因題目方向不平衡而偏向某一極',()=>{
  const full=game.createSet(data,'full',()=>0.25);
  const left=game.calculate(data,full,Object.fromEntries(full.map(q=>[q.id,-2])));
  assert.ok(left.axes.every(a=>a.score===0));
});

test('報告文字說明非官方限制並保留每題回覆',()=>{
  const quick=game.createSet(data,'quick',()=>0.61);
  const answers=Object.fromEntries(quick.map(q=>[q.id,0]));
  const text=game.exportText(game.calculate(data,quick,answers),quick,answers);
  assert.match(text,/非官方 MBTI/);
  assert.match(text,/非經驗證心理量表/);
  assert.ok(text.includes(quick[0].prompt));
});
