const {test}=require('node:test');
const assert=require('node:assert/strict');
const {questions}=require('../skincare-lab-data.js');
const game=require('../skincare-lab-engine.js');

test('題庫涵蓋常見用途辨識、維他命、胜肽、酸類及保濕成分',()=>{
  assert.equal(questions.length,20);
  assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
  for(const q of questions){
    assert.ok(q.title&&q.prompt&&q.explanation);
    assert.equal(q.options.length,3);
    assert.ok(q.answer>=0&&q.answer<q.options.length);
  }
  for(const term of ['定妝噴霧','維他命 C','維他命 E','菸鹼醯胺','A 醇','AHA','BHA','PHA','胜肽','玻尿酸','神經醯胺','甘油']){
    assert.ok(questions.some(q=>q.title.includes(term)||q.prompt.includes(term)),`missing ${term}`);
  }
});

test('快閃題涵蓋所有知識類別，完整模式收齊20題',()=>{
  const quick=game.createRound(questions,'quick',()=>0.37);
  assert.equal(quick.questions.length,10);
  assert.deepEqual(new Set(quick.questions.map(q=>q.category)),new Set(questions.map(q=>q.category)));
  const full=game.createRound(questions,'full',()=>0.42);
  assert.equal(full.questions.length,20);
  assert.deepEqual(new Set(full.questions.map(q=>q.id)),new Set(questions.map(q=>q.id)));
});

test('選項確認後鎖定；未選不能確認；提交即顯示正誤記錄',()=>{
  const round=game.createRound(questions,'quick',()=>0.2);
  assert.equal(game.commit(round),null);
  assert.equal(game.select(round,99),false);
  assert.equal(game.select(round,0),true);
  const selected=round.questions[0].displayOptions[0];
  const record=game.commit(round);
  assert.equal(record.selected,selected);
  assert.equal(game.select(round,1),false);
  assert.equal(game.commit(round),null);
  assert.equal(game.advance(round),true);
  assert.equal(round.index,1);
  assert.equal(round.committed,false);
});

test('跳過計入題目分母、另行統計，完整通關保存首輪並可重練',()=>{
  let round=game.createRound(questions,'quick',()=>0.13);
  const total=round.questions.length;
  for(let i=0;i<total;i++){
    if(i===0) game.skip(round);
    else {
      const q=round.questions[round.index];
      const answer=q.options[q.answer];
      const shown=q.displayOptions.indexOf(answer);
      assert.equal(game.select(round,shown),true);
      assert.equal(game.commit(round).correct,true);
    }
    assert.equal(game.advance(round),true);
  }
  assert.equal(round.complete,true);
  assert.equal(round.latestAttempt.total,total);
  assert.equal(round.latestAttempt.correct,total-1);
  assert.equal(round.latestAttempt.skipped,1);
  const first=round.firstAttempt;
  const retry=game.retry(round,()=>0.31);
  assert.equal(retry.records.length,0);
  assert.equal(retry.index,0);
  assert.deepEqual(retry.firstAttempt,first);
  assert.equal(retry.runNumber,2);
});

test('下載文字紀錄保留字面答案與解析內容',()=>{
  let round=game.createRound(questions,'quick',()=>0.4);
  const q=round.questions[0];
  game.select(round,q.displayOptions.indexOf(q.options[q.answer]));
  const rec=game.commit(round);
  assert.equal(rec.correct,true);
  assert.match(game.exportText(round),/臉部保養品成分偵探/);
  assert.ok(game.exportText(round).includes(q.title));
  assert.ok(game.exportText(round).includes(q.explanation));
});
