/* Run on the real game page or a byte-equivalent DOM preview. No hidden hands used. */
async function bluffBrowserQA() {
  const $ = id => document.getElementById(id), E = window.BluffEngine;
  let checks = 0, ticks = 0;
  const assert = (ok, name) => { if (!ok) throw Error(name); checks++; };
  const snap = () => window.BluffRun.snapshot();
  const same = () => JSON.stringify(snap());
  const overflow = () => assert(document.documentElement.scrollWidth <= innerWidth + 1, 'horizontal overflow');
  const oldSet = window.setTimeout, oldClear = window.clearTimeout, oldNow = Date.now;
  const pending = new Map(); let serial = 0;
  window.setTimeout = (fn, ms, ...args) => ms === 650 ? (pending.set(--serial, () => fn(...args)), serial) : oldSet(fn, ms, ...args);
  window.clearTimeout = id => pending.has(id) ? pending.delete(id) : oldClear(id);
  function start(mode, seed) { Date.now = () => seed; try { $(mode).click(); } finally { Date.now = oldNow; } }
  function key(key) { window.dispatchEvent(new KeyboardEvent('keydown', {key, bubbles: true})); }
  function input(q, f) { $('quantity').value = q; $('quantity').dispatchEvent(new Event('input', {bubbles:true})); document.querySelector(`[data-face="${f}"]`).click(); }
  function flush() { const entry = pending.entries().next().value; assert(Boolean(entry), 'bot timer scheduled'); pending.delete(entry[0]); entry[1](); ticks++; }
  const games = [];
  try {
    assert(Boolean(E && window.BluffRun), 'game loaded');
    if (snap()) { if (snap().phase === 'bidding') { $('pause').click(); $('quit').click(); } else $('menu').click(); }
    overflow();
    start('quick', 1);
    assert(snap().players.every(p => p.count === 3), 'quick allocation');
    assert(snap().players.slice(1).every(p => p.dice === null), 'opponent hands hidden');
    assert($('challenge').disabled, 'cannot challenge without bid');
    const draftBefore = same(); input(2, 3);
    assert(same() === draftBefore, 'draft is not a bid');
    key('5'); assert(document.querySelector('[data-face="5"]').getAttribute('aria-pressed') === 'true', 'keyboard face selection');
    input(99, 3); assert($('bid').disabled, 'invalid draft disabled');
    input(2, 3); key('p'); const paused = same();
    $('bid').click(); assert(same() === paused, 'paused bid cannot mutate');
    key('Escape'); assert(!snap().paused && $('quantity').value === '2', 'resume preserves draft');
    $('bid').click(); assert(snap().current !== 0, 'confirm submits bid');
    window.dispatchEvent(new Event('blur')); assert(snap().paused && pending.size === 0, 'blur cancels computer timer');
    $('resume').click(); assert(!snap().paused && pending.size === 1, 'resume schedules computer');
    const hiddenOwn = Object.getOwnPropertyDescriptor(document, 'hidden');
    try { Object.defineProperty(document, 'hidden', {configurable:true,value:true}); document.dispatchEvent(new Event('visibilitychange')); assert(snap().paused && pending.size === 0, 'hidden page freezes bot'); }
    finally { if (hiddenOwn) Object.defineProperty(document,'hidden',hiddenOwn); else delete document.hidden; }
    $('quit').click(); assert(snap() === null && pending.size === 0, 'quit clears match and timer');
    for (const mode of ['quick','normal']) for (const seed of [0,1]) {
      start(mode, seed); overflow(); let moves = 0;
      while (!snap().outcome && moves++ < 250) {
        const v = snap(); overflow();
        if (v.phase === 'reveal') {
          const r = v.reveal;
          assert(r.before - r.after === 1, 'exactly one die lost');
          assert(document.querySelectorAll('#reveal-dice .die.match').length === r.actual, 'highlight count matches evidence');
          assert(r.dice.reduce((n,p)=>n+p.dice.filter(d=>d===r.bid.face).length,0) === r.actual, 'revealed dice support count');
          const stable = same(); $('challenge').click(); $('bid').click(); assert(same() === stable, 'reveal rejects repeated action');
          $('next').click(); assert(snap().round === v.round + 1, 'next round advances');
        } else if (v.current === 0) {
          const a = E.decide({actor:0,hand:v.players[0].dice,counts:v.players.map(p=>p.count),bid:v.bid}, .5);
          if (a.type === 'challenge') { assert(!$('challenge').disabled, 'challenge available'); $('challenge').click(); }
          else { input(a.quantity,a.face); assert(!$('bid').disabled, 'legal bid enabled'); $('bid').click(); }
        } else flush();
      }
      const end = snap(); assert(moves < 250 && end.outcome === (seed ? 'won' : 'lost'), 'expected complete match outcome');
      assert($('next').hidden && !$('again').hidden && pending.size === 0, 'terminal controls and timer');
      assert(document.querySelectorAll('#match-log li').length === end.history.length, 'complete round history'); overflow();
      const terminal = same(); $('next').click(); assert(same() === terminal, 'terminal next is locked');
      games.push({mode,seed,outcome:end.outcome,rounds:end.round,moves});
      Date.now = () => seed; try { $('again').click(); } finally { Date.now = oldNow; }
      assert(snap().round === 1 && snap().history.length === 0 && snap().bid === null, 'replay starts clean');
      $('pause').click(); $('quit').click();
    }
    assert([...document.images].every(i => i.complete && i.naturalWidth > 0), 'images loaded');
    const motion = document.querySelector('.arcade-fx-toggle');
    if (motion && !motion.disabled) { motion.click(); assert(document.body.classList.contains('arcade-still'), 'effects can be disabled'); start('normal',1); assert(snap().players[0].count===5,'playable without effects'); $('pause').click(); $('quit').click(); motion.click(); }
    return {viewport:[innerWidth,innerHeight],checks,botTicks:ticks,games};
  } finally {
    if (snap()) { if (snap().phase === 'bidding') { $('pause').click(); $('quit').click(); } else $('menu').click(); }
    pending.clear(); window.setTimeout = oldSet; window.clearTimeout = oldClear; Date.now = oldNow;
  }
}
