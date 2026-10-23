const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const Q=require('../dora-quotes-data.js');
test('published excerpts exist verbatim in prior public game files, remixes are explicitly distinguished',()=>{
  assert.equal(new Set(Q.cards.map(c=>c.id)).size,19);
  for(const c of Q.cards){
    assert.equal(new Set([c.answer,...c.wrong]).size,3);
    assert.ok(c.prefix&&c.note&&c.tag);
    if(c.kind==='published'){
      assert.ok(fs.readFileSync(path.join(__dirname,'..',c.source),'utf8').includes(Q.text(c)),c.id);
      assert.match(Q.label(c),/公開遊戲/);
    }else if(c.kind==='commissioned'){assert.match(Q.label(c),/指定遊戲台詞/);assert.equal(c.source,undefined);}
    else{assert.equal(c.kind,'remix');assert.match(Q.label(c),/改編/);assert.equal(c.source,undefined);}
  }
});
test('requested opening cards preserve exact wording and are not presented as historical quotations',()=>{
  assert.equal(Q.text(Q.cards[0]),'我');assert.equal(Q.text(Q.cards[1]),'我可以開始極簡了');
  assert.equal(Q.text(Q.cards[2]),'不必要就算了😂');assert.deepEqual(Q.pool('classics').map(c=>c.id),['me','minimal','necessary']);
  assert.ok(Q.cards.slice(0,3).every(c=>c.kind==='commissioned'));
});
test('all categories have enough nonrepeating cards and shuffle does not change source data',()=>{
  const original=[...Q.cards];
  for(const tag of ['all','心情開光','進度查帳','龍蝦自嘲','等等系列']){
    const pool=Q.pool(tag),deck=Q.shuffle(pool,()=>0);
    assert.ok(pool.length>=4);assert.equal(new Set(deck.map(c=>c.id)).size,pool.length);
    if(tag!=='all')assert.ok(deck.every(c=>c.tag===tag));
  }
  assert.deepEqual(Q.cards,original);assert.deepEqual(Q.pool('unknown'),[]);
});
test('wait series is separately selectable and supplied word is distinct from original extensions',()=>{
  const series=Q.pool('等等系列');assert.equal(series.length,4);
  assert.equal(Q.text(series[0]),'等等');assert.equal(series[0].kind,'commissioned');
  assert.ok(series.slice(1).every(c=>c.kind==='remix'));assert.ok(series.some(c=>Q.text(c).startsWith('等一下，')));assert.ok(series.some(c=>Q.text(c).startsWith('我等等再做，')));
});
test('eight unique quiz questions, exactly one accepted answer each, bounded score, full finish and fresh restart',()=>{
  const s=Q.round(()=>.4);assert.equal(s.deck.length,8);assert.equal(new Set(s.deck.map(c=>c.id)).size,8);
  for(let i=0;i<8;i++){
    const c=s.deck[i];assert.equal(Q.answer(s,'not an option'),false);
    assert.equal(Q.answer(s,i%2?c.wrong[0]:c.answer),true);
    assert.equal(Q.answer(s,c.answer),false);assert.equal(s.answers.length,i+1);s.index++;
  }
  assert.equal(Q.answer(s,s.deck[0].answer),false);assert.equal(s.answers.filter(x=>x.correct).length,4);
  const fresh=Q.round();assert.equal(fresh.index,0);assert.deepEqual(fresh.answers,[]);assert.equal(s.answers.length,8);
});
