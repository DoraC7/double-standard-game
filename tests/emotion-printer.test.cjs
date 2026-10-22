const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../emotion-printer-engine.js');
test('all affordable paths can finish eight orders without negative resources or dead ends',()=>{
  let finished=0;
  function visit(s){
    assert.ok(s.tokens>=0);assert.ok(s.cash>=0);assert.ok(s.mood>=0&&s.mood<=100);
    if(s.turn===8){finished++;assert.equal(E.canUpgrade(s),false);for(const k of Object.keys(E.actions))assert.equal(E.canChoose(s,k),false);return;}
    assert.ok(E.canChoose(s,'support'),'minimum-cost action remains available');
    for(const k of Object.keys(E.actions))if(E.canChoose(s,k))visit(E.choose(s,k));
    if(E.canUpgrade(s))visit(E.upgrade(s));
  }
  visit(E.initial());assert.ok(finished>10000);
});
test('hype creates unsupported claims; both audits reclaim exactly the disclosed amounts',()=>{
  let s=E.initial();for(let i=0;i<4;i++)s=E.choose(s,'hype');
  assert.equal(s.cash,4*7200-4000);assert.equal(s.claims,4);assert.equal(s.history[3].returned,4000);
  for(let i=0;i<4;i++)s=E.choose(s,'support');
  assert.equal(s.history[7].returned,4000);assert.equal(s.tokens,340);assert.equal(s.checked,0);
});
test('verification only certifies supported attachments, never the mere request to verify',()=>{
  let s=E.initial();for(let i=0;i<8;i++)s=E.choose(s,'verify');
  assert.equal(s.checked,3);assert.equal(s.claims,0);assert.equal(s.cash,3*2400+5*600);assert.equal(s.tokens,300);
  assert.equal(s.history[0].verified,false);assert.equal(s.history[3].verified,true);
});
test('foil doubles only future denomination, never evidence, mood, audit rate or cost',()=>{
  let a=E.choose(E.initial(),'hype'),b=E.upgrade(a);assert.equal(a.upgraded,false);assert.equal(b.cash,a.cash);
  assert.equal(b.tokens,a.tokens-120);assert.throws(()=>E.upgrade(b));
  b=E.choose(b,'verify');assert.equal(b.history[1].issued,1200);assert.equal(b.checked,0);assert.equal(b.claims,1);assert.equal(b.history[1].cost,100);
});
test('unaffordable choices and invalid actions do not mutate the prior state',()=>{
  let s=E.upgrade(E.initial());for(let i=0;i<5;i++)s=E.choose(s,'hype');
  assert.equal(E.canChoose(s,'hype'),false);const saved=JSON.stringify(s);
  assert.throws(()=>E.choose(s,'hype'));assert.throws(()=>E.choose(s,'fake'));assert.equal(JSON.stringify(s),saved);
  while(s.turn<8)s=E.choose(s,'support');assert.equal(s.tokens,90);
});
