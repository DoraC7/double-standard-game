(function (root, factory) {
  const engine = factory();
  if (typeof module === 'object' && module.exports) module.exports = engine;
  else root.BluffEngine = engine;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const modes = {quick: 3, normal: 5}, names = ['你', '阿膨', '阿風'];
  function random(s) { s.seed = (Math.imul(s.seed, 1664525) + 1013904223) >>> 0; return s.seed / 4294967296; }
  const total = s => s.players.reduce((n, p) => n + p.count, 0);
  const active = s => s.players.filter(p => p.count > 0);
  function nextPlayer(s, actor) { for (let n = 1; n <= 3; n++) { const i = (actor + n) % 3; if (s.players[i].count > 0) return i; } return actor; }
  function deal(s, starter) {
    for (const p of s.players) p.dice = Array.from({length: p.count}, () => 1 + Math.floor(random(s) * 6));
    s.current = s.players[starter].count > 0 ? starter : nextPlayer(s, starter);
    s.phase = 'bidding'; s.bid = null; s.reveal = null; s.turn = 0; s.log = [];
  }
  function create(mode = 'quick', seed = Date.now()) {
    if (!Object.hasOwn(modes, mode)) throw new Error('Unknown mode');
    const s = {mode, seed: Number(seed) >>> 0, round: 1, phase: 'bidding', outcome: null,
      paused: false, players: names.map((name, id) => ({id, name, count: modes[mode], dice: []})), history: []};
    deal(s, 0); return s;
  }
  function legal(s, quantity, face) {
    return Number.isInteger(quantity) && Number.isInteger(face) && quantity >= 1 && quantity <= total(s) && face >= 1 && face <= 6 &&
      (!s.bid || quantity > s.bid.quantity || quantity === s.bid.quantity && face > s.bid.face);
  }
  function ready(s, actor) { return s.phase === 'bidding' && !s.paused && s.current === actor && s.players[actor]?.count > 0; }
  function minimum(s) {
    if (!s.bid) return {quantity: 1, face: 1};
    const b = s.bid;
    if (b.face < 6) return {quantity: b.quantity, face: b.face + 1};
    return b.quantity < total(s) ? {quantity: b.quantity + 1, face: 1} : null;
  }
  function bid(s, actor, quantity, face) {
    if (!ready(s, actor) || !legal(s, quantity, face)) return false;
    s.bid = {actor, quantity, face}; s.turn++;
    s.log.push(`${names[actor]}喊：至少 ${quantity} 顆 ${face} 點。`);
    s.current = nextPlayer(s, actor); return true;
  }
  function challenge(s, actor) {
    if (!ready(s, actor) || !s.bid || s.bid.actor === actor) return false;
    const previous = {...s.bid}, dice = s.players.map(p => ({id: p.id, name: p.name, dice: [...p.dice]}));
    const count = dice.reduce((n, p) => n + p.dice.filter(d => d === previous.face).length, 0);
    const truthful = count >= previous.quantity, loser = truthful ? actor : previous.actor;
    const before = s.players[loser].count; s.players[loser].count--;
    s.reveal = {bid: previous, challenger: actor, actual: count, truthful, loser, before, after: before - 1, dice};
    s.history.push(JSON.parse(JSON.stringify(s.reveal))); s.phase = 'reveal';
    s.log.push(`${names[actor]}抓包！全桌有 ${count} 顆 ${previous.face} 點，${names[loser]}少一顆骰子。`);
    if (s.players[0].count === 0) s.outcome = 'lost';
    else if (active(s).length === 1) s.outcome = 'won';
    return true;
  }
  function next(s) {
    if (s.phase !== 'reveal' || s.outcome || s.paused) return false;
    const starter = s.reveal.loser; s.round++; deal(s, starter); return true;
  }
  function pause(s, value) { if (s.outcome) return false; s.paused = Boolean(value); return true; }
  // This input contains only one hand and public facts. Opponents' dice are never supplied.
  function decisionView(s, actor) {
    return {actor, hand: [...s.players[actor].dice], counts: s.players.map(p => p.count),
      bid: s.bid ? {...s.bid} : null};
  }
  function chance(known, unknown, quantity) {
    const need = quantity - known;
    if (need <= 0) return 1;
    if (need > unknown) return 0;
    let probability = Math.pow(5 / 6, unknown), sum = 0;
    for (let k = 0; k <= unknown; k++) {
      if (k >= need) sum += probability;
      probability *= (unknown - k) / (k + 1) / 5;
    }
    return Math.max(0, Math.min(1, sum));
  }
  function decide(view, roll = .5) {
    const count = view.counts.reduce((a, b) => a + b, 0), unknown = count - view.hand.length;
    const own = face => view.hand.filter(d => d === face).length;
    const probability = (q, f) => chance(own(f), unknown, q);
    const b = view.bid, threshold = .24 + roll * .18;
    if (b && probability(b.quantity, b.face) < threshold) return {type: 'challenge'};
    const candidates = [];
    for (let q = 1; q <= count; q++) for (let face = 1; face <= 6; face++) {
      if (b && !(q > b.quantity || q === b.quantity && face > b.face)) continue;
      const p = probability(q, face);
      if (p >= (roll < .2 ? .12 : .32)) candidates.push({type: 'bid', quantity: q, face,
        rank: Math.abs(p - (.6 - roll * .16)) + .012 * q - .006 * own(face)});
    }
    if (!candidates.length) return b ? {type: 'challenge'} : {type: 'bid', quantity: 1, face: view.hand[0]};
    candidates.sort((a, c) => a.rank - c.rank || a.quantity - c.quantity || a.face - c.face);
    const {rank, ...action} = candidates[0]; return action;
  }
  function bot(s) {
    if (s.current === 0 || !ready(s, s.current)) return false;
    const actor = s.current, action = decide(decisionView(s, actor), random(s));
    return action.type === 'challenge' ? challenge(s, actor) : bid(s, actor, action.quantity, action.face);
  }
  function view(s) {
    return {mode: s.mode, round: s.round, phase: s.phase, current: s.current, outcome: s.outcome,
      paused: s.paused, turn: s.turn, total: total(s), bid: s.bid ? {...s.bid} : null,
      players: s.players.map(p => ({id: p.id, name: p.name, count: p.count, dice: p.id === 0 ? [...p.dice] : null})),
      reveal: s.reveal ? JSON.parse(JSON.stringify(s.reveal)) : null,
      history: JSON.parse(JSON.stringify(s.history)), log: [...s.log]};
  }
  return {modes, names, create, total, legal, minimum, bid, challenge, next, pause, chance, decide, decisionView, bot, view};
});
