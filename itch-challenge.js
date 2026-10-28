(() => {
  'use strict';
  const E = window.ItchEngine, $ = id => document.getElementById(id);
  let s = null, mode = 'normal', raf = 0, last = 0, hold = null;
  const keys = 'qweasdzxc';
  const cells = Array.from({length: 9}, (_, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'cell empty';
    b.dataset.index = i;
    for (const [cls, text] of [['number', String(i + 1)], ['face', '·'], ['label', '等怪出沒']]) {
      const t = document.createElement('span'); t.className = cls; t.textContent = text; b.append(t);
    }
    $('board').append(b); return b;
  });
  const active = () => s && s.state === 'playing' && !s.paused;
  function clearInput() { hold = null; cells.forEach(b => b.classList.remove('held')); }
  function render() {
    if (!s) return;
    const m = E.modes[s.mode];
    $('stage-label').textContent = `第 ${s.level + 1} / 3 區 · ${s.mode === 'easy' ? '暖身' : '正式挑戰'}`;
    $('stage-name').textContent = E.levels[s.level];
    $('time').textContent = Math.max(0, Math.ceil(m.seconds - s.time));
    $('cooled').textContent = `${s.cooled} / ${m.goals[s.level]}`;
    $('combo').textContent = s.combo; $('score').textContent = s.totalScore + s.score;
    $('alarm').value = s.itch; $('alarm-value').textContent = `${Math.ceil(s.itch)} / 100`;
    const note = s.messageTime > 0 ? s.message : '按住藍色怪直到泡泡裝滿；紅色抓抓手不用理它。';
    if ($('notice').textContent !== note) $('notice').textContent = note;
    cells.forEach((b, i) => {
      const c = s.cells[i], kind = c?.kind || 'empty';
      b.className = `cell ${kind}${hold?.index === i ? ' held' : ''}${c?.triggered ? ' triggered' : ''}`;
      b.style.setProperty('--charge', `${c?.kind === 'itch' ? Math.min(100, c.charge / m.hold * 100) : 0}%`);
      const label = kind === 'itch' ? '按住封印' : kind === 'trap' ? (c.triggered ? '抓抓中計！' : '不要碰！') : '等怪出沒';
      const aria = `${i + 1} 號：${kind === 'itch' ? '藍色癢癢怪，按住封印' : kind === 'trap' ? '紅色抓抓誘惑，不要碰' : '空白格'}`;
      b.querySelector('.face').textContent = kind === 'itch' ? '◉ᴥ◉' : kind === 'trap' ? '✋' : '·';
      b.querySelector('.label').textContent = label;
      if (b.getAttribute('aria-label') !== aria) b.setAttribute('aria-label', aria);
      b.setAttribute('aria-pressed', String(hold?.index === i));
    });
  }
  function frame(now) {
    raf = 0;
    if (!active()) return;
    E.step(s, last ? (now - last) / 1000 : 0, hold?.index ?? -1); last = now;
    render();
    if (s.state !== 'playing') showResult(); else raf = requestAnimationFrame(frame);
  }
  function schedule() { last = 0; raf = requestAnimationFrame(frame); }
  function showPlay() {
    clearInput(); $('intro').hidden = true; $('result').hidden = true; $('play').hidden = false;
    $('pause-cover').hidden = true; render();
    $('play').scrollIntoView({block: 'start', behavior: 'instant'}); cells[0].focus({preventScroll: true}); schedule();
  }
  function start(chosen) { if (raf) cancelAnimationFrame(raf); mode = chosen; s = E.create(mode); showPlay(); }
  function pause(value) {
    if (!s || !E.pause(s, value)) return;
    clearInput(); if (raf) cancelAnimationFrame(raf); raf = 0;
    $('pause-cover').hidden = !value; render();
    if (value) $('resume').focus(); else { cells[0].focus({preventScroll: true}); schedule(); }
  }
  function menu() {
    if (raf) cancelAnimationFrame(raf); raf = 0; clearInput(); s = null;
    $('intro').hidden = false; $('play').hidden = true; $('result').hidden = true; $('start').focus();
  }
  function showResult() {
    clearInput(); $('play').hidden = true; $('result').hidden = false;
    const won = s.state === 'won', clear = s.state === 'clear';
    $('next').hidden = !clear; $('retry').hidden = s.state !== 'failed'; $('again').hidden = !won;
    $('next').textContent = s.level === 2 ? '收工，查看總成績 →' : '下一區 →';
    $('result-label').textContent = won ? 'ALL THREE DEFENDED' : clear ? 'BUBBLES WIN THIS ROUND' : 'TRY ANOTHER BUBBLE';
    $('result-title').textContent = won ? '癢癢怪，今天先下班！' : clear ? `${E.levels[s.level]}守住了！` : s.itch >= 100 ? '抓抓警報滿格了！' : '封印數還差一點點。';
    $('result-text').textContent = won ? `三區完成！封印 ${s.totalCooled} 隻，總分 ${s.totalScore}，誤碰抓抓手 ${s.totalMistakes} 次。遊戲過關，真實皮膚不計分。` : clear ? `封印 ${s.cooled} 隻、最高 ${s.bestCombo} 連擊，這區拿下 ${s.score} 分。下一區的警報與倒數重新開始。` : `本關封印 ${s.cooled} / ${E.modes[s.mode].goals[s.level]} 隻。重試只重開這一區，前面守住的區域保留；藍怪要按住，紅手別碰。`;
    const summary = won ? s.cleared.map(l => `${l.name} · ${l.cooled} 隻`) : [`警報 ${Math.ceil(s.itch)} / 100`, `誤碰 ${s.mistakes} 次`, `漏掉 ${s.missed} 隻`];
    $('badges').replaceChildren(...summary.map(text => { const b = document.createElement('span'); b.textContent = text; return b; }));
    $('result-title').focus();
  }
  $('start').addEventListener('click', () => start('normal')); $('easy').addEventListener('click', () => start('easy'));
  $('pause').addEventListener('click', () => pause(true)); $('resume').addEventListener('click', () => pause(false));
  $('quit').addEventListener('click', menu); $('menu').addEventListener('click', menu);
  $('again').addEventListener('click', () => start(mode));
  $('next').addEventListener('click', () => { if (!s || !E.next(s)) return; if (s.state === 'won') showResult(); else showPlay(); });
  $('retry').addEventListener('click', () => { if (s && E.retry(s)) showPlay(); });
  cells.forEach((b, index) => {
    b.addEventListener('pointerdown', e => {
      if (!active() || hold) return; e.preventDefault();
      b.setPointerCapture(e.pointerId); hold = {index, source: e.pointerId}; render();
    });
    const release = e => { if (hold?.source === e.pointerId) { clearInput(); render(); } };
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) b.addEventListener(event, release);
    b.addEventListener('keydown', e => {
      if (active() && [' ', 'Enter'].includes(e.key)) {
        e.preventDefault(); if (!e.repeat && !hold) { hold = {index, source: e.key}; render(); }
      }
    });
    b.addEventListener('blur', () => { if (hold && [' ', 'Enter'].includes(hold.source)) clearInput(); });
  });
  window.addEventListener('keydown', e => {
    if (!s || s.state !== 'playing') return;
    const k = e.key.toLowerCase();
    if (['p', 'escape'].includes(k)) { e.preventDefault(); if (!e.repeat) pause(!s.paused); return; }
    if (!active()) return;
    const i = /^[1-9]$/.test(k) ? Number(k) - 1 : keys.indexOf(k);
    if (i < 0) return;
    e.preventDefault(); if (!e.repeat && !hold) { hold = {index: i, source: k}; render(); }
  });
  window.addEventListener('keyup', e => { if (hold?.source === e.key.toLowerCase() || hold?.source === e.key) { clearInput(); render(); } });
  for (const event of ['selectstart', 'contextmenu']) $('board').addEventListener(event, e => e.preventDefault());
  window.addEventListener('blur', () => pause(true));
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(true); });
  window.ItchRun = {snapshot: () => s ? JSON.parse(JSON.stringify(s)) : null};
})();
