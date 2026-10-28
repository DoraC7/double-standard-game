const {test} = require('node:test');
const assert = require('node:assert/strict');
const E = require('../itch-challenge-engine.js');
const fs = require('node:fs');
const path = require('node:path');
const tick = (s, seconds, input = -1) => { for (let i = 0; i < Math.ceil(seconds * 100); i++) E.step(s, .01, input); };
function pilot(s) {
  let count = 0;
  while (s.state === 'playing' && count++ < 5000) {
    const active = s.cells.map((c, i) => ({c, i})).filter(x => x.c?.kind === 'itch').sort((a, b) => b.c.age - a.c.age);
    E.step(s, .05, active[0]?.i ?? -1);
  }
  assert.ok(count < 5000);
}
test('模式、獨立狀態、輸入限制與固定種子有效', () => {
  assert.throws(() => E.create('toString'));
  const a = E.create('normal', 87), b = E.create('normal', 87);
  tick(a, 2); tick(b, 2); assert.deepEqual(a, b);
  a.cells[0] = {kind: 'trap'}; assert.notDeepEqual(a.cells, b.cells);
  for (const dt of [NaN, Infinity, 0, -1]) assert.equal(E.step(b, dt), false);
  E.step(b, .01, Infinity); assert.ok(Number.isFinite(b.itch));
});
test('必須持續按住，放開會中斷，封印只加一次分且警報下降', () => {
  const s = E.create('normal', 2); tick(s, .4);
  const i = s.cells.findIndex(c => c?.kind === 'itch');
  tick(s, .3, i); assert.equal(s.cooled, 0); assert.ok(s.cells[i].charge > 0);
  tick(s, .1); assert.equal(s.cells[i].charge, 0);
  const before = s.itch; tick(s, .66, i);
  assert.equal(s.cooled, 1); assert.equal(s.score, 100); assert.ok(s.itch < before);
  tick(s, .1, i); assert.equal(s.cooled, 1);
});
test('紅手長按只處罰一次；放著不碰不扣警報、不算漏怪', () => {
  const s = E.create('normal', 1); tick(s, 3.8);
  const i = s.cells.findIndex(c => c?.kind === 'trap'); assert.ok(i >= 0);
  tick(s, .5, i); assert.equal(s.mistakes, 1); assert.equal(s.combo, 0);
  tick(s, .1); tick(s, .1, i); assert.equal(s.mistakes, 1);
  const b = E.create(); b.spawnIn = 99; b.cells[0] = {kind: 'trap', age: 0, life: .1, triggered: false, charge: 0};
  tick(b, .2); assert.equal(b.mistakes, 0); assert.equal(b.missed, 0); assert.ok(b.itch < 25);
});
test('無操作確實失敗，空格長按不直接加分；漏怪增加警報', () => {
  for (const mode of ['easy', 'normal']) {
    const s = E.create(mode, 42); tick(s, 20);
    assert.equal(s.state, 'failed'); assert.equal(s.cooled, 0); assert.equal(s.score, 0); assert.ok(s.missed > 0);
  }
  const s = E.create(); s.spawnIn = 99; tick(s, 1, 0); assert.equal(s.score, 0);
});
test('暫停凍結完整狀態，終局不再接受輸入；警報滿格可提早失敗', () => {
  const s = E.create(); tick(s, .5); E.pause(s, true);
  const before = JSON.stringify(s); tick(s, 10, 0); assert.equal(JSON.stringify(s), before);
  E.pause(s, false); s.itch = 99.99; E.step(s, .05); assert.equal(s.state, 'failed');
  const end = JSON.stringify(s); tick(s, 2, 1); assert.equal(JSON.stringify(s), end); assert.equal(E.pause(s, true), false);
});
test('兩模式、多個種子僅以一般按住操作完整通過三區', () => {
  for (const mode of ['easy', 'normal']) for (const seed of [0, 1, 87, 4096, 20261028]) {
    const s = E.create(mode, seed);
    for (let n = 0; n < 3; n++) { pilot(s); assert.equal(s.state, 'clear', `${mode}/${seed}/${n}`); assert.ok(s.cooled >= E.modes[mode].goals[n]); assert.equal(s.mistakes, 0); assert.ok(E.next(s)); }
    assert.equal(s.state, 'won'); assert.equal(s.cleared.length, 3);
    const score = s.totalScore; assert.equal(E.next(s), false); assert.equal(s.totalScore, score);
    assert.equal(s.totalScore, s.cleared.reduce((sum, l) => sum + l.score, 0));
  }
});
test('重試只重開失敗區，前區成果保留；新局完全重設', () => {
  const s = E.create('easy', 87); assert.equal(E.next(s), false); pilot(s); E.next(s);
  const total = s.totalScore; tick(s, 20); assert.equal(s.state, 'failed'); assert.ok(E.retry(s));
  assert.equal(s.level, 1); assert.equal(s.totalScore, total); assert.equal(s.cleared.length, 1);
  assert.equal(s.cooled, 0); assert.equal(s.itch, 24); assert.ok(s.cells.every(c => !c));
  const fresh = E.create('easy'); assert.equal(fresh.totalScore, 0); assert.equal(fresh.level, 0);
});
test('遊戲使用本機資產與無持久儲存的獨立入口', () => {
  const root = path.resolve(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'itch-challenge.html'), 'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"?#]+)(?:\?[^"#]*)?"/g)) assert.ok(fs.existsSync(path.join(root, match[1])), match[1]);
  const source = fs.readFileSync(path.join(root, 'itch-challenge.js'), 'utf8');
  assert.doesNotMatch(source, /localStorage|sessionStorage|fetch\(|XMLHttpRequest/);
  assert.match(source, /pointercancel/); assert.match(source, /lostpointercapture/); assert.match(source, /visibilitychange/);
  assert.match(html, /不是過敏測驗或治療建議/);
});
