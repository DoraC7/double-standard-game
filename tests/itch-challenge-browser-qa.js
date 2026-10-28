async function itchBrowserQA() {
  const checks = [], $ = id => document.getElementById(id);
  const check = (condition, name) => { if (!condition) throw new Error(name); checks.push(name); };
  const fit = label => check(document.documentElement.scrollWidth <= innerWidth, `no-overflow:${label}`);
  const originalRAF = window.requestAnimationFrame, originalCancel = window.cancelAnimationFrame;
  let now = 1000, seq = 0, queue = new Map();
  window.requestAnimationFrame = fn => { queue.set(++seq, fn); return seq; };
  window.cancelAnimationFrame = id => queue.delete(id);
  const advance = seconds => {
    for (let i = 0; i < Math.ceil(seconds * 20); i++) {
      now += 50; const current = queue; queue = new Map();
      for (const callback of current.values()) callback(now);
    }
  };
  const snapshot = () => window.ItchRun.snapshot();
  const down = key => window.dispatchEvent(new KeyboardEvent('keydown', {key, bubbles: true}));
  const up = key => window.dispatchEvent(new KeyboardEvent('keyup', {key, bubbles: true}));
  try {
    fit('intro');
    $('easy').click(); advance(.5);
    const first = snapshot().cells.findIndex(c => c?.kind === 'itch'), key = String(first + 1);
    down(key); advance(.15); up(key); advance(.05);
    check(snapshot().cells[first].charge === 0 && snapshot().cooled === 0, 'release-cancels-charge');
    down(key); advance(.5); up(key); check(snapshot().cooled === 1, 'keyboard-hold-cools');
    down('1'); window.dispatchEvent(new Event('blur'));
    const paused = JSON.stringify(snapshot()); advance(2);
    check(JSON.stringify(snapshot()) === paused && !$('pause-cover').hidden, 'blur-freezes-whole-game');
    $('resume').click(); advance(.1);
    check(!document.querySelector('.cell.held'), 'resume-clears-held-input');
    Object.defineProperty(document, 'hidden', {configurable: true, value: true});
    document.dispatchEvent(new Event('visibilitychange')); delete document.hidden;
    check(snapshot().paused, 'background-auto-pause'); $('resume').click();
    down('p'); check(snapshot().paused, 'keyboard-pause'); up('p');
    down('Escape'); up('Escape'); check(!snapshot().paused, 'keyboard-resume');
    fit('play');
    const board = $('board'), context = new Event('contextmenu', {cancelable: true});
    board.dispatchEvent(context); check(context.defaultPrevented, 'controls-block-long-press-menu');
    check(getComputedStyle(board.querySelector('button')).userSelect === 'none', 'controls-block-selection');
    for (let wait = 0; wait < 40 && !snapshot().cells.some(c => c?.kind === 'itch'); wait++) advance(.05);
    const at = snapshot().cells.findIndex(c => c?.kind === 'itch');
    check(at >= 0, 'pointer-target-present');
    const button = board.children[at], capture = button.setPointerCapture;
    button.setPointerCapture = () => {};
    try {
      button.dispatchEvent(new PointerEvent('pointerdown', {pointerId: 37, bubbles: true})); advance(.1);
      button.dispatchEvent(new PointerEvent('pointercancel', {pointerId: 37, bubbles: true})); advance(.05);
      check(snapshot().cells[at].charge === 0 && !document.querySelector('.cell.held'), 'pointercancel-clears-charge');
      button.dispatchEvent(new PointerEvent('pointerdown', {pointerId: 38, bubbles: true})); advance(.5);
      button.dispatchEvent(new PointerEvent('pointerup', {pointerId: 38, bubbles: true}));
      check(snapshot().cooled === 2, 'synthetic-touch-hold-cools');
    } finally { button.setPointerCapture = capture; }
    $('pause').click(); $('quit').click(); check(snapshot() === null, 'quit-resets');
    $('easy').click(); advance(15);
    check(snapshot().state === 'failed' && !$('retry').hidden, 'idle-failure-shown'); fit('failure');
    $('retry').click();
    check(snapshot().time === 0 && snapshot().score === 0 && snapshot().itch === 24, 'retry-clean-stage');
    advance(4.7);
    const trap = snapshot().cells.findIndex(c => c?.kind === 'trap');
    check(trap >= 0, 'trap-present'); down(String(trap + 1)); advance(.3); up(String(trap + 1));
    check(snapshot().mistakes === 1, 'trap-penalty-once');
    $('pause').click(); $('quit').click();
    for (const mode of ['easy', 'normal']) {
      $(mode === 'easy' ? 'easy' : 'start').click(); let held = null;
      for (let stage = 0; stage < 3; stage++) {
        let budget = 0;
        while (snapshot().state === 'playing' && budget++ < 600) {
          const state = snapshot();
          const target = state.cells.map((c, i) => ({c, i})).filter(x => x.c?.kind === 'itch').sort((a, b) => b.c.age - a.c.age)[0];
          const nextKey = target ? String(target.i + 1) : null;
          if (held !== nextKey) { if (held) up(held); if (nextKey) down(nextKey); held = nextKey; }
          advance(.05);
        }
        if (held) up(held); held = null;
        check(snapshot().state === 'clear', `${mode}:stage-${stage + 1}-complete`); fit(`${mode}:stage-${stage + 1}`);
        $('next').click();
      }
      check(snapshot().state === 'won' && snapshot().cleared.length === 3, `${mode}:full-game-won`);
      check(!$('again').hidden && $('result-text').textContent.includes('三區完成'), `${mode}:result-visible`);
      fit(`${mode}:won`); $('again').click();
      check(snapshot().level === 0 && snapshot().totalScore === 0 && snapshot().cooled === 0, `${mode}:new-game-reset`);
      $('pause').click(); $('quit').click();
    }
    await Promise.all([...document.images].map(i => i.decode().catch(() => null)));
    check([...document.images].every(i => i.naturalWidth > 0), 'artwork-loaded');
    return {viewport: `${innerWidth}x${innerHeight}`, checks, accelerated: true, input: 'DOM keyboard + synthetic pointer; pointer capture stubbed, not device-tested'};
  } finally {
    if (snapshot()?.state === 'playing') { $('pause').click(); $('quit').click(); }
    window.requestAnimationFrame = originalRAF; window.cancelAnimationFrame = originalCancel;
  }
}
