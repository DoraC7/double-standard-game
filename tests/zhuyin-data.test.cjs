const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const {createHash} = require('node:crypto');
const vm = require('node:vm');

const root = join(__dirname, '..');
const context = {window: {}};
vm.runInNewContext(readFileSync(join(root, 'zhuyin-data.js'), 'utf8'), context);
const data = JSON.parse(JSON.stringify(context.window.ZHUYIN));
// Independently transcribed from MOE's two symbol tables, reviewed 2026-10-17.
const order = 'ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦㄧㄨㄩ';
const strokeCounts = [1,2,2,2,2,3,1,2,2,2,2,2,1,2,4,3,3,4,2,2,2,3,2,2,3,3,1,3,2,2,1,3,1,2,1,2,2];

test('exactly 37 MOE symbols, with 21 initials and 16 finals including ㄧㄨㄩ', () => {
  assert.equal(data.length, 37);
  assert.equal(data.map(s => s.symbol).join(''), order);
  assert.equal(new Set(data.map(s => s.id)).size, 37);
  assert.equal(data.filter(s => s.group === 'initial').length, 21);
  assert.equal(data.filter(s => s.group === 'final').length, 16);
  data.forEach((s, i) => {
    assert.equal(s.id, i + 1);
    assert.equal(s.group, i < 21 ? 'initial' : 'final');
  });
});

test('stroke sequences match the MOE printed counts, not sums of cumulative SVG frames', () => {
  assert.deepEqual(data.map(s => s.strokes.length), strokeCounts);
  assert.equal(strokeCounts.reduce((a, b) => a + b, 0), 79);
  data.forEach(s => s.strokes.forEach(d => assert.match(d, /^M [\d\s.,MLQCZ-]+$/)));
});

test('all 37 WAV files are complete, original recordings with matching IDs and SHA-256', () => {
  data.forEach(s => {
    assert.equal(s.audio, `assets/zhuyin/F${s.id}.WAV`);
    const audio = readFileSync(join(root, s.audio));
    assert.equal(audio.toString('ascii', 0, 4), 'RIFF');
    assert.equal(audio.toString('ascii', 8, 12), 'WAVE');
    assert.equal(audio.readUInt32LE(4) + 8, audio.length);
    assert.equal(createHash('sha256').update(audio).digest('hex'), s.sha256);
  });
  assert.equal(new Set(data.map(s => s.sha256)).size, 37);
});

test('lobby games have unique local files and the teaching page retains attribution', () => {
  const lobby = readFileSync(join(root, 'index.html'), 'utf8');
  const links = [...lobby.matchAll(/<a class="card" href="([^"]+)"/g)].map(m => m[1]);
  assert(links.length >= 6);
  assert.equal(new Set(links).size, links.length);
  assert(links.includes('zhuyin.html'));
  links.forEach(href => assert(readFileSync(join(root, href)).length));
  const page = readFileSync(join(root, 'zhuyin.html'), 'utf8');
  assert.match(page, /2017 © 教育部，國語注音符號手冊-開放部件/);
  assert.match(page, /creativecommons.org\/licenses\/by\/4.0/);
  assert(readFileSync(join(root, 'assets/zhuyin/LICENSE-MOE.txt')).length);
});
