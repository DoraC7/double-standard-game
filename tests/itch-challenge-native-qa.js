async function itchNativeQA() {
  const $ = id => document.getElementById(id), began = performance.now(), stages = [];
  let held = null, lastLevel = -1;
  $('easy').click();
  return await new Promise((resolve, reject) => {
    const key = (type, value) => window.dispatchEvent(new KeyboardEvent(type, {key: value, bubbles: true}));
    const stop = () => { clearInterval(timer); if (held) key('keyup', held); };
    const timer = setInterval(() => {
      const s = window.ItchRun.snapshot(), wall = (performance.now() - began) / 1000;
      if (!s || s.paused || wall > 55 || s.state === 'failed') {
        stop(); reject(new Error(`Native run interrupted: ${JSON.stringify({wall, state: s?.state, paused: s?.paused})}`)); return;
      }
      if (s.state === 'won') {
        stop(); resolve({nativeClock: true, automatedKeyboard: true, wallSeconds: wall,
          gameSeconds: 36, state: s.state, stages, totalCooled: s.totalCooled, mistakes: s.totalMistakes}); return;
      }
      if (s.level !== lastLevel) { stages.push({level: s.level + 1, wallAtStart: wall}); lastLevel = s.level; }
      if (s.state === 'clear') { if (held) key('keyup', held); held = null; $('next').click(); return; }
      const target = s.cells.map((c, i) => ({c, i})).filter(x => x.c?.kind === 'itch').sort((a, b) => b.c.age - a.c.age)[0];
      const next = target ? String(target.i + 1) : null;
      if (held !== next) { if (held) key('keyup', held); if (next) key('keydown', next); held = next; }
    }, 25);
  });
}
