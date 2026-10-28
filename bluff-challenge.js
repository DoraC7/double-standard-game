(() => {
  'use strict';
  const E = window.BluffEngine, $ = id => document.getElementById(id);
  const pips = {1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8]};
  let s = null, mode = 'quick', selected = 1, token = '', timer = null;
  function die(value, matched = false) {
    const d = document.createElement('span'); d.className = 'die' + (matched ? ' match' : '');
    d.setAttribute('role', 'img'); d.setAttribute('aria-label', `${value} 點${matched ? '，符合喊話' : ''}`);
    for (const position of pips[value]) { const p = document.createElement('i'); p.className = 'pip'; p.style.gridArea = `${Math.floor(position / 3) + 1} / ${position % 3 + 1}`; d.append(p); }
    return d;
  }
  const faces = Array.from({length: 6}, (_, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.dataset.face = i + 1;
    b.setAttribute('aria-label', `選擇 ${i + 1} 點`); b.append(die(i + 1));
    b.addEventListener('click', () => { if (human()) { selected = i + 1; preview(); } });
    $('face-choices').append(b); return b;
  });
  const human = () => s && s.phase === 'bidding' && s.current === 0 && !s.paused;
  function cancelBot() { if (timer !== null) clearTimeout(timer); timer = null; }
  function scheduleBot() {
    cancelBot();
    if (!s || s.phase !== 'bidding' || s.paused || s.current === 0) return;
    timer = setTimeout(() => { timer = null; if (s && !s.paused && s.phase === 'bidding' && s.current !== 0) { E.bot(s); render(); } }, 650);
  }
  function preview() {
    if (!s) return;
    const quantity = Number($('quantity').value), valid = human() && E.legal(s, quantity, selected);
    faces.forEach(b => { b.setAttribute('aria-pressed', String(Number(b.dataset.face) === selected)); b.disabled = !human(); });
    $('bid').disabled = !valid; $('challenge').disabled = !human() || !s.bid;
    $('minus').disabled = !human() || quantity <= 1; $('plus').disabled = !human() || quantity >= E.total(s);
    $('quantity').disabled = !human(); $('quantity').max = E.total(s);
    $('bid-preview').classList.toggle('invalid', !valid);
    $('bid-preview').textContent = valid ? `準備喊：全桌至少 ${quantity} 顆 ${selected} 點。還沒送出。` : !E.minimum(s) ? '已經喊到最大，只能抓包攤牌。' : `請喊更大的組合，數量需在 1～${E.total(s)} 顆之間。`;
  }
  function render() {
    if (!s) return;
    const v = E.view(s), reveal = s.phase === 'reveal';
    $('intro').hidden = true; $('play').hidden = reveal; $('reveal').hidden = !reveal;
    $('pause-cover').hidden = !s.paused;
    $('round').textContent = `第 ${s.round} 盅 · ${mode === 'quick' ? '快嘴局' : '正式桌'} · 1 點不萬用`;
    $('turn-label').textContent = s.current === 0 ? '輪到你：喊大，還是抓包？' : `換${E.names[s.current]}接招…`;
    $('opponents').replaceChildren(...v.players.slice(1).map(p => {
      const box = document.createElement('div'); box.className = `opponent${s.current === p.id ? ' active' : ''}${p.count === 0 ? ' out' : ''}`;
      const avatar = document.createElement('span'); avatar.className = 'avatar'; avatar.textContent = p.id === 1 ? '膨' : '風';
      const info = document.createElement('div'), name = document.createElement('b'), note = document.createElement('p');
      name.textContent = p.name; note.textContent = p.count ? `盅蓋著 · 剩 ${p.count} 顆骰子` : '骰子用完，下桌觀戰';
      info.append(name, note); box.append(avatar, info); return box;
    }));
    $('current-bid').textContent = s.bid ? `${E.names[s.bid.actor]}：${s.bid.quantity} 顆 ${s.bid.face} 點` : '這一盅，你敢先喊多少？';
    $('table-count').textContent = `全桌共 ${E.total(s)} 顆骰子 · 喊的數量是「至少」`;
    $('your-count').textContent = `剩 ${s.players[0].count} 顆`;
    $('your-dice').replaceChildren(...s.players[0].dice.map(d => die(d)));
    const turn = `${s.round}:${s.turn}`;
    if (turn !== token) { token = turn; const min = E.minimum(s); selected = min?.face || 6; $('quantity').value = min?.quantity || E.total(s); }
    $('bid-controls').hidden = s.current !== 0; $('thinking').hidden = s.current === 0;
    $('thinking').textContent = `${E.names[s.current]}正在掂量自己的骰子。你可以暫停，不用搶快。`;
    $('bid-log').replaceChildren(...s.log.slice(-10).map(t => { const li = document.createElement('li'); li.textContent = t; return li; }));
    preview();
    if (reveal) {
      const r = s.reveal, won = s.outcome === 'won', lost = s.outcome === 'lost';
      $('reveal-label').textContent = won ? 'LAST CUP STANDING' : lost ? 'THE DICE HAVE SPOKEN' : `第 ${s.round} 盅 · 開盅見真章`;
      $('reveal-title').textContent = won ? '嘴上有風，手上有骰！' : lost ? '這桌先下課，嘴砲還能再練。' : r.truthful ? '喊話成立！抓包抓錯了。' : '數量不夠，膨風被抓到了！';
      $('reveal-text').textContent = `${E.names[r.bid.actor]}喊「至少 ${r.bid.quantity} 顆 ${r.bid.face} 點」，全桌實際有 ${r.actual} 顆。${r.truthful ? '達標，所以抓包者輸。' : '未達標，所以喊的人輸。'}`;
      $('reveal-dice').replaceChildren(...r.dice.map(p => {
        const box = document.createElement('div'); box.className = 'revealed-hand';
        const name = document.createElement('h3'); name.textContent = p.name;
        const rack = document.createElement('div'); rack.className = 'dice-rack';
        if (!p.dice.length) rack.textContent = '已下桌';
        else rack.append(...p.dice.map(d => die(d, d === r.bid.face)));
        box.append(name, rack); return box;
      }));
      $('die-loss').textContent = `${E.names[r.loser]}少一顆骰子：${r.before} → ${r.after} 顆。${r.after === 0 ? '骰子歸零，下桌！' : '下一盅由輸的人先喊。'}`;
      $('next').hidden = Boolean(s.outcome); $('again').hidden = !s.outcome;
      $('final-summary').textContent = s.outcome ? `${s.history.length} 次抓包後，${won ? '你成為最後留在桌上的玩家。' : '你的骰子用完，這一桌結束。'}攤牌只算骰子，不代表真實人物的誠信。` : '綠框標出符合喊話的骰子；先看清楚，再搖下一盅。';
      $('match-log').replaceChildren(...s.history.map((h, i) => { const li = document.createElement('li'); li.textContent = `第${i + 1}盅：${E.names[h.bid.actor]}喊${h.bid.quantity}顆${h.bid.face}點，實際${h.actual}顆；${E.names[h.loser]}少1骰。`; return li; }));
      $('reveal-title').focus();
    }
    scheduleBot();
  }
  function start(chosen) { cancelBot(); mode = chosen; s = E.create(mode); token = ''; render(); $('play').scrollIntoView({block: 'start', behavior: 'instant'}); $('quantity').focus({preventScroll: true}); }
  function menu() { cancelBot(); s = null; $('intro').hidden = false; $('play').hidden = true; $('reveal').hidden = true; $('pause-cover').hidden = true; $('quick').focus(); }
  function pause(value) { if (!s || !E.pause(s, value)) return; cancelBot(); render(); if (value) $('resume').focus(); else if (human()) $('quantity').focus({preventScroll: true}); }
  $('quick').addEventListener('click', () => start('quick')); $('normal').addEventListener('click', () => start('normal'));
  $('bid').addEventListener('click', () => { if (human() && E.bid(s, 0, Number($('quantity').value), selected)) render(); });
  $('challenge').addEventListener('click', () => { if (human() && E.challenge(s, 0)) render(); });
  $('quantity').addEventListener('input', preview);
  for (const [id, change] of [['minus', -1], ['plus', 1]]) $(id).addEventListener('click', () => { if (human()) { $('quantity').value = Math.max(1, Math.min(E.total(s), Number($('quantity').value || 1) + change)); preview(); } });
  $('next').addEventListener('click', () => { if (s && E.next(s)) { render(); $('play').scrollIntoView({block: 'start', behavior: 'instant'}); if (human()) $('quantity').focus({preventScroll: true}); } });
  $('again').addEventListener('click', () => start(mode)); $('menu').addEventListener('click', menu); $('quit').addEventListener('click', menu);
  $('pause').addEventListener('click', () => pause(true)); $('resume').addEventListener('click', () => pause(false));
  window.addEventListener('keydown', e => {
    if (!s || e.repeat) return;
    const k = e.key.toLowerCase();
    if (['p', 'escape'].includes(k) && s.phase === 'bidding') { e.preventDefault(); pause(!s.paused); return; }
    if (human() && /^[1-6]$/.test(k) && e.target.tagName !== 'INPUT') { e.preventDefault(); selected = Number(k); preview(); }
  });
  window.addEventListener('blur', () => { if (s?.phase === 'bidding') pause(true); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && s?.phase === 'bidding') pause(true); });
  window.BluffRun = {snapshot: () => s ? E.view(s) : null};
})();
