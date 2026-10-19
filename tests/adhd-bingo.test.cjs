const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const {join} = require('node:path');
const context = {window: {}};
vm.runInNewContext(readFileSync(join(__dirname, '..', 'adhd-bingo-data.js'), 'utf8'), context);
const {items, makeCard, findLines} = context.window.AdhdBingo;
test('題庫唯一，說明與小方法完整', () => {
  assert.equal(items.length, 40);
  assert.equal(new Set(items.map(item => item.id)).size, 40);
  assert.equal(new Set(items.map(item => item.text)).size, 40);
  for (const item of items) assert.ok(item.text && item.detail && item.tip && item.category);
});
test('多種卡號與尺寸：四類均衡、中央自由格、不重複、同號重現', () => {
  for (const size of [3, 5]) for (let seed = 0; seed < 200; seed++) {
    const code = seed.toString(16).padStart(8, '0');
    const card = makeCard(code, size), actual = card.filter(Boolean);
    assert.equal(card.length, size * size);
    assert.equal(card[Math.floor(size * size / 2)], null);
    assert.equal(new Set(actual.map(item => item.id)).size, size * size - 1);
    for (const group of ['focus', 'time', 'impulse', 'daily']) assert.equal(actual.filter(item => item.group === group).length, size === 5 ? 6 : 2);
    assert.equal(JSON.stringify(card), JSON.stringify(makeCard(code, size)));
  }
  assert.notEqual(JSON.stringify(makeCard('11111111')), JSON.stringify(makeCard('22222222')));
});
test('拒絕不合法的卡號或尺寸', () => {
  for (const seed of ['', 'hello', '1234567g', '123456789']) assert.throws(() => makeCard(seed));
  assert.throws(() => makeCard('12345678', 4));
});
test('橫直斜、重疊、多線、取消與滿卡計算', () => {
  for (const size of [3, 5]) {
    const center = Math.floor(size * size / 2);
    assert.equal(findLines(new Set([center]), size).length, 0);
    const row = new Set(Array.from({length: size}, (_, i) => i));
    assert.equal(findLines(row, size).length, 1);
    row.delete(0); assert.equal(findLines(row, size).length, 0);
    const col = new Set(Array.from({length: size}, (_, i) => i * size));
    assert.equal(findLines(col, size).length, 1);
    const diagonals = new Set(Array.from({length: size}, (_, i) => [i * size + i, i * size + size - i - 1]).flat());
    assert.equal(findLines(diagonals, size).length, 2);
    diagonals.delete(center); assert.equal(findLines(diagonals, size).length, 0);
    const full = new Set(Array.from({length: size * size}, (_, i) => i));
    assert.equal(findLines(full, size).length, 2 * size + 2);
  }
});
