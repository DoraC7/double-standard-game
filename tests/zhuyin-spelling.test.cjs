const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const {createHash} = require('node:crypto');
const vm = require('node:vm');
const root = join(__dirname, '..'), context = {window: {}};
for (const file of ['zhuyin-words.js', 'zhuyin-spelling.js']) vm.runInNewContext(readFileSync(join(root, file), 'utf8'), context);
const words = JSON.parse(JSON.stringify(context.window.ZHUYIN_WORDS));
const core = context.window.ZhuyinSpellingCore;
const shuffle = a => [...a].sort(() => Math.random() - .5);
test('all headwords, full phonetics and audio filenames agree with MOE source rows', () => {
  assert.equal(words.length, 72);
  assert.equal(new Set(words.map(w => w.id)).size, words.length);
  for (const w of words) {
    assert.equal(w.word, w.dictionaryEntry.A);
    assert.equal(w.zhuyin, w.dictionaryEntry.G);
    assert.equal(w.id, w.dictionaryEntry.B);
    assert.equal(w.word, w.audioEntry.B);
    assert.equal(w.id, w.audioEntry.A);
    assert.equal(w.audio, `assets/zhuyin-words/${w.audioEntry.C}`);
    assert.equal(w.parts.join(''), w.base);
    assert.match(w.base, /^[\u3105-\u3129]{1,3}$/);
    const b = readFileSync(join(root, w.audio));
    assert.equal(b.toString('ascii', 0, 4), 'RIFF');
    // Original MOE RIFF length is nonstandard; preserve it, check the PCM data chunk instead.
    assert.equal(b.toString('ascii', 36, 40), 'data');
    assert.equal(b.readUInt32LE(40) + 44, b.length);
    assert.equal(createHash('sha256').update(b).digest('hex'), w.sha256);
    assert.ok(w.playbackEnd >= .25 && w.playbackEnd <= 1.8);
  }
});
test('every question has four unique options, exactly one correct; no duplicate listening answers', () => {
  for (const level of ['pair', 'triple', 'tone']) {
    const pool = core.pool(words, level);
    assert.ok(pool.length >= 20, `${level}: ${pool.length}`);
    assert.equal(new Set(pool.map(w => core.label(w, level))).size, pool.length);
    for (const w of pool) {
      if (level !== 'tone') assert.equal(w.parts.length, level === 'pair' ? 2 : 3);
      for (let i = 0; i < 30; i++) {
        const options = core.options(w, pool, level, shuffle);
        assert.equal(options.length, 4);
        assert.equal(new Set(options).size, 4);
        assert.equal(options.filter(s => s === core.label(w, level)).length, 1);
        if (level !== 'tone') assert.ok(options.every(s => !/[ˊˇˋ˙]/.test(s)));
      }
    }
  }
});
test('requested example 棒 remains in the toneless pool, tone mode retains ㄅㄤˋ', () => {
  const b = core.pool(words, 'pair').find(w => w.word === '棒');
  assert.ok(b); assert.equal(core.label(b, 'pair'), 'ㄅㄤ'); assert.equal(core.label(b, 'tone'), 'ㄅㄤˋ');
  assert.ok(core.options(b, words, 'tone', shuffle).includes('ㄅㄤˋ'));
});
