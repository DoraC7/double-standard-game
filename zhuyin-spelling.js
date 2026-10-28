/* First-grade listening and blending. Original MOE audio is selected, never synthesized. */
'use strict';
window.ZhuyinSpellingCore = (() => {
  const unique = (items, key) => { const seen = new Set(); return items.filter(x => { const k = key(x); if (seen.has(k)) return false; seen.add(k); return true; }); };
  const label = (word, level) => level === 'tone' ? word.zhuyin : word.base;
  const pool = (words, level) => unique(words.filter(w => (level === 'tone' && w.parts.length >= 2) || w.parts.length === (level === 'pair' ? 2 : 3)), w => label(w, level));
  function distance(a, b) {
    const row = Array.from({length: b.length + 1}, (_, i) => i);
    [...a].forEach((c, i) => { let last = row[0]; row[0] = i + 1;
      [...b].forEach((d, j) => { const old = row[j + 1]; row[j + 1] = Math.min(row[j + 1] + 1, row[j] + 1, last + (c === d ? 0 : 1)); last = old; }); });
    return row[b.length];
  }
  function options(target, words, level, shuffle) {
    const answer = label(target, level);
    let candidates = unique(shuffle(words).filter(w => label(w, level) !== answer), w => label(w, level))
      .sort((a, b) => distance(a.base, target.base) - distance(b.base, target.base)).map(w => label(w, level));
    if (level === 'tone') {
      const otherTones = shuffle(['', 'ˊ', 'ˇ', 'ˋ'].map(t => target.base + t).filter(s => s !== answer));
      candidates = [...otherTones.slice(0, 2), ...candidates.filter(s => !s.startsWith(target.base))];
    }
    return shuffle([answer, ...[...new Set(candidates)].slice(0, 3)]);
  }
  return {label, pool, options, distance};
})();

window.createZhuyinSpelling = ({words, shuffle, stopAudio, award}) => {
  const $ = id => document.getElementById(id);
  const core = window.ZhuyinSpellingCore;
  const levelNames = {pair: '二拼', triple: '三拼', tone: '聲調進階'};
  let round = null, request = 0, source = null, context = null;
  let active = false;
  let lastMissed = [];
  const checked = name => document.querySelector(`input[name="${name}"]:checked`).value;
  const make = (tag, text, cls) => { const el = document.createElement(tag); el.textContent = text; if (cls) el.className = cls; return el; };
  const buttons = () => [...$('spelling-answers').querySelectorAll('button'), ...$('spelling-tiles').querySelectorAll('button')];
  function lock() { buttons().forEach(b => b.disabled = true); $('spelling-submit').disabled = true; }
  function unlock() {
    if (!round || round.solved || !round.heard || !active) return;
    buttons().forEach(b => b.disabled = b.classList.contains('wrong') || b.dataset.used === 'true');
    $('spelling-submit').disabled = round.slots.length !== round.tokens.length;
  }
  function stop() {
    request++;
    if (source) { try { source.stop(); } catch (_) { /* already ended */ } source = null; }
    $('spelling-play').classList.remove('playing');
    if (round && !round.solved) { round.heard = false; lock(); }
  }
  // Decode the original file, then play just its initial headword utterance.
  // Web Audio schedules the boundary exactly (not a delayed timeupdate event).
  const buffers = new Map();
  async function play(word, quiz = false, status = $('spelling-audio-note')) {
    stopAudio();
    const token = request;
    if (quiz) { round.heard = false; lock(); $('spelling-play').classList.add('playing'); }
    status.textContent = '正在載入字音…';
    try {
      context ||= new (window.AudioContext || window.webkitAudioContext)();
      await context.resume();
      if (context.state !== 'running') throw new Error('Audio not running');
      let buffer = buffers.get(word.id);
      if (!buffer) {
        const res = await fetch(word.audio);
        if (!res.ok) throw new Error('Audio unavailable');
        buffer = await context.decodeAudioData(await res.arrayBuffer());
        buffers.set(word.id, buffer);
        if (buffers.size > 24) buffers.delete(buffers.keys().next().value);
      }
      if (token !== request || !active) return;
      const node = context.createBufferSource(); node.buffer = buffer; node.connect(context.destination); source = node;
      node.onended = () => {
        if (token !== request || !active) return;
        source = null; $('spelling-play').classList.remove('playing');
        status.textContent = '可以再按喇叭重聽。';
        if (quiz && round && !round.solved) { round.heard = true; unlock(); }
      };
      status.textContent = '仔細聽完整字音…';
      node.start(0, 0, word.playbackEnd);
    } catch (_) {
      if (token !== request) return;
      $('spelling-play').classList.remove('playing');
      status.textContent = '聲音沒有播出，請按喇叭重試。這題尚未計分。';
      if (quiz && round) { round.heard = false; lock(); }
    }
  }
  function show(view) {
    ['setup', 'study', 'game', 'result'].forEach(name => $(`spelling-${name}`).hidden = name !== view);
  }
  function setup() {
    stop(); round = null; show('setup'); $('spelling-audio-note').textContent = '';
  }
  function renderStudy() {
    stop(); round = null; show('study');
    const level = checked('spell-level');
    $('spelling-study-title').textContent = `${levelNames[level]}拼讀卡 · 按喇叭聽完整字音`;
    $('spelling-word-cards').replaceChildren();
    core.pool(words, level).forEach(word => {
      const card = make('article', '', 'word-card');
      card.append(make('span', word.word, 'word-character'), make('strong', word.zhuyin, 'word-phonetic'));
      card.append(make('p', `${word.parts.join(' ＋ ')} → ${word.base}`, 'blend-formula'));
      const b = make('button', '▶ 聽完整字音', 'secondary'); b.type = 'button'; b.setAttribute('aria-label', `聽${word.word}的字音`);
      b.addEventListener('click', () => play(word)); card.append(b); $('spelling-word-cards').append(card);
    });
    $('spelling-study-title').scrollIntoView({block: 'start'});
    $('spelling-study-title').focus({preventScroll: true});
  }
  function start(mode, supplied) {
    stop();
    const level = checked('spell-level');
    const available = supplied || core.pool(words, level);
    const count = supplied ? available.length : Math.min(Number($('spelling-count').value), available.length);
    const deck = shuffle(available).slice(0, count);
    round = {level, mode, deck, index: 0, records: [], heard: false, solved: false, slots: [], tokens: []};
    show('game'); renderQuestion();
  }
  function renderQuestion() {
    stop();
    const q = round, target = q.deck[q.index];
    q.solved = false; q.heard = false; q.attempts = 0; q.slots = [];
    q.tokens = [...target.parts]; if (q.level === 'tone') q.tokens.push(target.zhuyin.match(/[ˊˇˋ]/)?.[0] || '一聲');
    $('spelling-progress').textContent = `${q.mode === 'exam' ? '聽力考試' : q.mode === 'build' ? '拼字積木' : '拼讀練習'} · 第 ${q.index + 1} / ${q.deck.length} 題`;
    $('spelling-progressbar').max = q.deck.length; $('spelling-progressbar').value = q.index;
    $('spelling-question').textContent = q.mode === 'build' ? '聽一聽，排出完整的注音。' : q.level === 'tone' ? '聽一聽，連聲調一起選。' : '聽一聽，選出聲音的注音。';
    $('spelling-rule').textContent = q.mode === 'exam' ? '每題只選一次；可以重聽，交卷後才公布答案。' : q.level === 'tone' ? '一聲不標調號；二、三、四聲也要聽清楚。' : '這一關先不考聲調，選出聲符、韻符的組合。';
    if (q.mode === 'build' && q.level === 'tone') $('spelling-rule').textContent = '先排注音，最後放聲調積木；沒有調號時，最後放「一聲」。';
    $('spelling-feedback').textContent = '';
    $('spelling-audio-note').textContent = '按喇叭聽題目，聽完後就能作答。';
    $('spelling-next').hidden = true; $('spelling-next').textContent = q.index === q.deck.length - 1 ? '交卷看結果 →' : '下一題 →';
    $('spelling-answers').replaceChildren(); $('spelling-tiles').replaceChildren();
    $('spelling-build').hidden = q.mode !== 'build'; $('spelling-answers').hidden = q.mode === 'build';
    if (q.mode === 'build') {
      const alphabet = [...new Set(core.pool(words, q.level).flatMap(w => w.parts))];
      const tiles = shuffle([...q.tokens, ...shuffle(alphabet.filter(c => !q.tokens.includes(c))).slice(0, 3)]);
      tiles.forEach((symbol, i) => {
        const b = make('button', symbol, 'spell-tile'); b.type = 'button'; b.dataset.tile = i; b.disabled = true;
        b.addEventListener('click', () => {
          if (!q.heard || q.solved || q.slots.length >= q.tokens.length || b.dataset.used === 'true') return;
          q.slots.push({symbol, button: b}); b.dataset.used = 'true'; b.disabled = true; renderSlots(); unlock();
        }); $('spelling-tiles').append(b);
      }); renderSlots();
    } else {
      core.options(target, core.pool(words, q.level), q.level, shuffle).forEach(text => {
        const b = make('button', text, 'answer spell-answer'); b.type = 'button'; b.disabled = true;
        b.addEventListener('click', () => choose(text, b)); $('spelling-answers').append(b);
      });
    }
    $('spelling-game').scrollIntoView({block: 'start'});
    $('spelling-question').focus({preventScroll: true});
    // Playback stays a deliberate tap, which works with mobile audio policies.
  }
  function renderSlots() {
    $('spelling-slots').replaceChildren();
    round.tokens.forEach((_, i) => $('spelling-slots').append(make('span', round.slots[i]?.symbol || '？', 'spell-slot')));
  }
  function resetTiles() {
    if (!round || round.solved) return;
    round.slots = []; $('spelling-tiles').querySelectorAll('button').forEach(b => b.dataset.used = 'false'); renderSlots(); unlock();
  }
  function choose(value, b) {
    const q = round;
    if (!q || q.solved || !q.heard) return;
    const target = q.deck[q.index], answer = core.label(target, q.level), correct = value === answer && (q.mode !== 'build' || q.slots.every((s, i) => s.symbol === q.tokens[i]));
    q.attempts++;
    if (q.mode !== 'exam' && !correct) {
      if (b) { b.classList.add('wrong'); b.disabled = true; }
      $('spelling-feedback').textContent = '再聽一次。留意開頭、後面的韻音，以及這一關是否要選聲調。';
      if (q.mode === 'build') resetTiles();
      return;
    }
    q.solved = true; lock();
    q.records.push({word: target, value, correct, first: correct && q.attempts === 1});
    if (q.mode === 'exam') {
      if (b) b.classList.add('selected-answer');
      $('spelling-feedback').textContent = '已記下答案，繼續下一題。';
    } else {
      if (b) b.classList.add('correct');
      $('spelling-feedback').textContent = `答對了！${target.word}：${target.zhuyin}。${target.parts.join(' ＋ ')}，合起來就是 ${target.base}。`;
    }
    $('spelling-next').hidden = false; $('spelling-next').focus({preventScroll: true});
  }
  function finish() {
    stop(); show('result');
    const q = round, first = q.records.filter(r => r.first).length;
    lastMissed = q.records.filter(r => !r.first).map(r => r.word);
    $('spelling-result-title').textContent = q.mode === 'exam' ? `聽力考試 ${Math.round(first / q.deck.length * 100)} 分` : '拼讀任務完成！';
    $('spelling-summary').textContent = `${levelNames[q.level]} · ${q.deck.length} 題，${first} 題${q.mode === 'exam' ? '答對' : '第一次就答對'}。${lastMissed.length ? '把需要再練的字，聽一聽、讀一讀。' : '這一回合每題都一次答對！'}`;
    $('spelling-review').replaceChildren();
    q.records.forEach(r => {
      const card = make('article', '', `spell-review-row ${r.first ? 'review-good' : 'review-missed'}`);
      card.append(make('span', r.first ? '✓' : '再練', 'review-mark'));
      const detail = make('div', ''); detail.append(make('b', `${r.word.word} · ${r.word.zhuyin}`));
      detail.append(make('small', q.mode === 'exam' ? `你的答案：${r.value}` : r.first ? '第一次就答對' : '重試後完成'));
      const b = make('button', '▶ 重聽', 'secondary'); b.type = 'button'; b.setAttribute('aria-label', `重聽${r.word.word}`); b.addEventListener('click', () => play(r.word));
      card.append(detail, b); $('spelling-review').append(card);
    });
    $('spelling-missed').hidden = !lastMissed.length;
    $('spelling-result-title').scrollIntoView({block: 'start'});
    $('spelling-result-title').focus({preventScroll: true});
    award('spelling');
  }
  $('spelling-start').addEventListener('click', () => checked('spell-mode') === 'study' ? renderStudy() : start(checked('spell-mode')));
  $('spelling-play').addEventListener('click', () => { if (round) play(round.deck[round.index], true); });
  $('spelling-next').addEventListener('click', () => {
    if (!round?.solved) return;
    if (++round.index < round.deck.length) renderQuestion(); else finish();
  });
  $('spelling-submit').addEventListener('click', () => {
    if (!round || round.slots.length !== round.tokens.length) return;
    const value = round.slots.map(s => s.symbol === '一聲' ? '' : s.symbol).join(''); choose(value);
  });
  $('spelling-clear').addEventListener('click', resetTiles);
  ['spelling-back', 'spelling-settings', 'spelling-study-back'].forEach(id => $(id).addEventListener('click', setup));
  $('spelling-retry').addEventListener('click', () => start(round.mode));
  $('spelling-missed').addEventListener('click', () => start('practice', lastMissed));
  return {
    stop,
    enter(mode) { active = mode === 'spelling'; if (active) setup(); },
    leave() { active = false; stop(); round = null; },
    pause() { stop(); if (active && round && !round.solved) $('spelling-audio-note').textContent = '剛才暫停了聲音，請重新播放本題。'; }
  };
};
