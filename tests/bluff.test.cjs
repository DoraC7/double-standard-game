const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const E = require('../bluff-engine.js');
function play(mode, seed, humanRoll = .5) {
  const s = E.create(mode, seed); let actions = 0;
  while (!s.outcome && actions++ < 2000) {
    if (s.phase === 'reveal') E.next(s);
    else if (s.current !== 0) assert.ok(E.bot(s));
    else {
      const action = E.decide(E.decisionView(s, 0), humanRoll);
      assert.ok(action.type === 'challenge' ? E.challenge(s, 0) : E.bid(s, 0, action.quantity, action.face));
    }
  }
  assert.ok(actions < 2000); return s;
}
test('兩模式正確配骰，種子可重現，狀態獨立且拒絕未知模式', () => {
  assert.throws(() => E.create('toString'));
  for (const mode of ['quick', 'normal']) {
    const a = E.create(mode, 87), b = E.create(mode, 87);
    assert.deepEqual(a, b); assert.equal(a.current, 0); assert.equal(E.total(a), E.modes[mode] * 3);
    for (const p of a.players) assert.ok(p.dice.every(d => d >= 1 && d <= 6));
    a.players[0].dice[0] = 99; assert.notEqual(b.players[0].dice[0], 99);
  }
});
test('喊話嚴格遞增：同數量加點數、加數量可降點數；非法操作不改狀態', () => {
  const s = E.create();
  for (const args of [[1, 2, 3], [0, '2', 3], [0, 0, 2], [0, 10, 2], [0, 2, 7], [0, 2.5, 1], [0, NaN, 2]]) {
    const before = JSON.stringify(s); assert.equal(E.bid(s, ...args), false); assert.equal(JSON.stringify(s), before);
  }
  assert.ok(E.bid(s, 0, 2, 3)); assert.equal(s.current, 1);
  assert.equal(E.bid(s, 1, 2, 3), false); assert.equal(E.bid(s, 1, 2, 2), false);
  assert.ok(E.bid(s, 1, 2, 4)); assert.ok(E.bid(s, 2, 3, 1)); assert.equal(s.current, 0);
});
test('開盅按至少判斷，等於也成立；1點不當萬用，攤牌證據保留', () => {
  const a = E.create(); a.players.forEach(p => p.dice = [1, 2, 3]);
  E.bid(a, 0, 3, 2); assert.ok(E.challenge(a, 1));
  assert.equal(a.reveal.actual, 3); assert.equal(a.reveal.truthful, true); assert.equal(a.reveal.loser, 1);
  assert.equal(a.players[1].count, 2); assert.equal(a.reveal.dice[1].dice.length, 3);
  const b = E.create(); b.players.forEach(p => p.dice = [1, 2, 3]);
  E.bid(b, 0, 4, 2); E.challenge(b, 1);
  assert.equal(b.reveal.actual, 3); assert.equal(b.reveal.truthful, false); assert.equal(b.reveal.loser, 0);
  assert.equal(b.players[0].count, 2);
});
test('無前手不能抓包、非當事回合不可動作，攤牌與結束鎖定', () => {
  const s = E.create(); assert.equal(E.challenge(s, 0), false); assert.equal(E.bot(s), false);
  E.bid(s, 0, 9, 6); assert.equal(E.challenge(s, 0), false); E.challenge(s, 1);
  const after = JSON.stringify(s);
  assert.equal(E.challenge(s, 1), false); assert.equal(E.bid(s, s.current, 9, 6), false); assert.equal(E.bot(s), false);
  assert.equal(JSON.stringify(s), after); assert.equal(s.history.length, 1);
});
test('輸家下盅先喊，出局玩家跳過，下一盅重搖並清掉喊話', () => {
  const s = E.create(); s.players[1].dice = [6, 6, 6];
  E.bid(s, 0, 1, 6); E.challenge(s, 1); E.next(s);
  assert.equal(s.current, 1); assert.equal(s.round, 2); assert.equal(s.bid, null); assert.equal(s.players[1].dice.length, 2); assert.equal(s.history.length, 1);
  s.players[1].count = 1; s.players[1].dice = [6];
  E.bid(s, 1, 1, 6); E.bid(s, 2, 9 - 2, 6); E.challenge(s, 0);
  if (s.phase === 'reveal' && !s.outcome) E.next(s);
  // Force a fully specified boundary round to test elimination, not RNG luck.
  const b = E.create(); b.players[1].count = 1; b.players[1].dice = [1];
  b.players[0].dice = [1, 1, 1]; b.players[2].dice = [1, 1, 1]; b.current = 1;
  E.bid(b, 1, 7, 6); E.challenge(b, 2); assert.equal(b.players[1].count, 0);
  E.next(b); assert.equal(b.current, 2); assert.equal(b.players[1].dice.length, 0);
  E.bid(b, 2, 1, 1); assert.equal(b.current, 0);
});
test('暫停凍結所有邏輯，恢復才可執行；新局清空整桌紀錄', () => {
  const s = E.create(); E.bid(s, 0, 1, 1); E.pause(s, true); const before = JSON.stringify(s);
  assert.equal(E.bot(s), false); assert.equal(E.challenge(s, 1), false); assert.equal(JSON.stringify(s), before);
  E.pause(s, false); assert.ok(E.bot(s));
  assert.equal(E.create().history.length, 0); assert.equal(E.create().round, 1);
});
test('公開快照不洩漏暗骰，電腦決策只需要一手骰子與公開資訊', () => {
  const a = E.create('normal', 12), before = E.decisionView(a, 1), v = E.view(a);
  assert.equal(v.players[1].dice, null); assert.equal(v.players[2].dice, null); assert.ok(Array.isArray(v.players[0].dice));
  a.players[0].dice = [6, 6, 6, 6, 6]; a.players[2].dice = [6, 6, 6, 6, 6];
  assert.deepEqual(E.decisionView(a, 1), before); assert.deepEqual(E.decide(before, .7), E.decide(E.decisionView(a, 1), .7));
  assert.deepEqual(Object.keys(before).sort(), ['actor', 'bid', 'counts', 'hand']);
});
test('機率計算涵蓋確定、可能與不可能；最大喊話必抓包', () => {
  assert.equal(E.chance(2, 3, 2), 1); assert.equal(E.chance(0, 3, 4), 0);
  assert.ok(Math.abs(E.chance(0, 1, 1) - 1 / 6) < 1e-8);
  const s = E.create(); E.bid(s, 0, 9, 6); assert.equal(E.minimum(s), null); assert.ok(E.bot(s)); assert.equal(s.phase, 'reveal');
});
test('200桌普通操作能終局，勝敗都有且每次僅扣一骰、總局數有界', () => {
  const outcomes = new Set();
  for (const mode of ['quick', 'normal']) for (let seed = 0; seed < 100; seed++) {
    const s = play(mode, seed); outcomes.add(s.outcome);
    assert.ok(s.history.length <= E.modes[mode] * 3 - 1);
    for (const r of s.history) { assert.equal(r.before - r.after, 1); assert.equal(r.actual, r.dice.reduce((n, p) => n + p.dice.filter(d => d === r.bid.face).length, 0)); }
    const before = JSON.stringify(s); assert.equal(E.next(s), false); assert.equal(JSON.stringify(s), before);
  }
  assert.deepEqual([...outcomes].sort(), ['lost', 'won']);
});
test('入口使用相對資產，沒有帳號、網路與儲存功能', () => {
  const root = path.resolve(__dirname, '..'), html = fs.readFileSync(path.join(root, 'bluff-challenge.html'), 'utf8');
  for (const m of html.matchAll(/(?:src|href)="([^"?#]+)(?:\?[^"#]*)?"/g)) assert.ok(fs.existsSync(path.join(root, m[1])), m[1]);
  const js = fs.readFileSync(path.join(root, 'bluff-challenge.js'), 'utf8'); assert.doesNotMatch(js, /localStorage|sessionStorage|fetch\(|XMLHttpRequest/);
  assert.match(js, /visibilitychange/); assert.match(js, /clearTimeout/); assert.match(html, /1 點不是萬用/);
});
module.exports = {play};
