(function (root, factory) {
  const engine = factory();
  if (typeof module === 'object' && module.exports) module.exports = engine;
  else root.ItchEngine = engine;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const levels = ['毛球沙發', '花粉花園', '睡前大亂鬥'];
  const modes = {
    normal: {seconds: 18, hold: .65, interval: 1.1, lifetime: 3.4, goals: [4, 5, 6]},
    easy: {seconds: 12, hold: .45, interval: 1.4, lifetime: 4.2, goals: [2, 3, 4]}
  };
  function random(s) {
    s.seed = (Math.imul(s.seed, 1664525) + 1013904223) >>> 0;
    return s.seed / 4294967296;
  }
  function resetStage(s) {
    Object.assign(s, {state: 'playing', paused: false, time: 0, itch: 24,
      cooled: 0, mistakes: 0, missed: 0, spawned: 0, spawnIn: .35,
      combo: 0, bestCombo: 0, score: 0, message: '找到藍色癢癢怪，按住到泡泡裝滿！',
      messageTime: 2, cells: Array.from({length: 9}, () => null)});
  }
  function create(mode = 'normal', seed = Date.now()) {
    if (!Object.hasOwn(modes, mode)) throw new Error('Unknown mode');
    const s = {mode, seed: Number(seed) >>> 0, level: 0, totalScore: 0,
      totalCooled: 0, totalMistakes: 0, cleared: []};
    resetStage(s);
    return s;
  }
  function tell(s, text) { s.message = text; s.messageTime = 1.5; }
  function spawn(s) {
    const free = s.cells.map((c, i) => c ? -1 : i).filter(i => i >= 0);
    if (!free.length) return;
    const at = free[Math.floor(random(s) * free.length)];
    s.spawned++;
    const trap = s.spawned % (s.level === 2 ? 3 : 4) === 0;
    s.cells[at] = {kind: trap ? 'trap' : 'itch', age: 0, charge: 0, triggered: false,
      life: modes[s.mode].lifetime - s.level * .25};
  }
  function step(s, dt, held = -1) {
    if (s.state !== 'playing' || s.paused || !Number.isFinite(dt) || dt <= 0) return false;
    dt = Math.min(dt, .05);
    const m = modes[s.mode];
    s.time = Math.min(m.seconds, s.time + dt);
    s.messageTime = Math.max(0, s.messageTime - dt);
    if (!Number.isInteger(held) || held < 0 || held > 8) held = -1;
    let active = 0;
    for (let i = 0; i < 9; i++) {
      const c = s.cells[i];
      if (!c) continue;
      c.age += dt;
      if (c.kind === 'itch') {
        active++;
        c.charge = held === i ? c.charge + dt : 0;
        if (c.charge + 1e-8 >= m.hold) {
          s.cells[i] = null; s.cooled++; s.combo++;
          s.bestCombo = Math.max(s.bestCombo, s.combo);
          s.score += 100 + Math.min(5, s.combo - 1) * 20;
          s.itch = Math.max(0, s.itch - 8);
          tell(s, `泡泡封印！${s.combo} 連擊，癢癢怪 −1。`);
          continue;
        }
      } else if (held === i && !c.triggered) {
        c.triggered = true; s.mistakes++; s.combo = 0; s.itch += 18;
        tell(s, '抓抓手搗蛋！警報 +18，放開再找藍色怪。');
      }
      if (c.age >= c.life) {
        if (c.kind === 'itch') { s.missed++; s.combo = 0; s.itch += 7; }
        s.cells[i] = null;
      }
    }
    s.itch = Math.min(100, s.itch + dt * (.8 + active * .8));
    s.spawnIn -= dt;
    if (s.spawnIn <= 0 && s.time < m.seconds - m.hold) {
      spawn(s); s.spawnIn += m.interval - s.level * .12;
    }
    if (s.itch >= 100) { s.state = 'failed'; tell(s, '警報滿格！這一關可以重新挑戰。'); }
    else if (s.time >= m.seconds) {
      s.state = s.cooled >= m.goals[s.level] ? 'clear' : 'failed';
      tell(s, s.state === 'clear' ? '這一區守住了！' : '封印數還差一點，再來一局！');
    }
    return true;
  }
  function pause(s, value) {
    if (s.state !== 'playing') return false;
    s.paused = Boolean(value); return true;
  }
  function next(s) {
    if (s.state !== 'clear') return false;
    s.totalScore += s.score; s.totalCooled += s.cooled; s.totalMistakes += s.mistakes;
    s.cleared.push({name: levels[s.level], score: s.score, cooled: s.cooled, mistakes: s.mistakes});
    if (s.level === 2) s.state = 'won';
    else { s.level++; resetStage(s); }
    return true;
  }
  function retry(s) { if (s.state !== 'failed') return false; resetStage(s); return true; }
  return {levels, modes, create, step, pause, next, retry};
});
