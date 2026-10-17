/* Extra play modes. Educational content still comes only from the MOE symbol data. */
'use strict';
window.createZhuyinAdventure = ({symbols, shuffle, glyph, play, stopAudio, openMode}) => {
  const $ = id => document.getElementById(id);
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const stops = [
    {id: 'garden', name: '符號花園', badge: '花園小園丁', icon: 'plant', task: '認識 3 個', goal: '親手點選 3 個不同的符號'},
    {id: 'listen', name: '聽音找朋友', badge: '耳朵小偵探', icon: 'shell', task: '完成 6 題', goal: '完成一趟 6 題聽音練習'},
    {id: 'match', name: '翻翻配對', badge: '配對小達人', icon: 'match', task: '找齊雙胞胎', goal: '找到一整副卡片的雙胞胎'},
    {id: 'hunt', name: '小島尋寶', badge: '寶藏小船長', icon: 'chest', task: '收星開寶箱', goal: '收齊星星並親手打開寶箱'},
    {id: 'tones', name: '聲調小火車', badge: '聲調小車長', icon: 'train', task: '完成 5 題', goal: '完成一趟 5 題聲調練習'}
  ];
  const badges = new Set();
  const visits = new Set();
  let celebrationTimer = null;
  let match = null;
  let hunt = null;
  let drag = null;

  function passport() {
    $('badge-count').textContent = `${badges.size} / 5 枚徽章`;
    stops.forEach(stop => {
      const b = $('island-stops').querySelector(`[data-stop="${stop.id}"]`);
      b.classList.toggle('earned', badges.has(stop.id));
      b.setAttribute('aria-label', `${stop.name}，${badges.has(stop.id) ? `已獲得${stop.badge}徽章` : stop.goal}，點選開始`);
      b.querySelector('.stop-state').textContent = badges.has(stop.id) ? '✓ 已點亮' : stop.task;
    });
    $('passport-note').textContent = badges.size === 5
      ? '五個地方都亮起來了！可以再出發，每次都會重新洗牌。'
      : '點地點就能出發。完成小任務，讓小島慢慢亮起來！';
  }
  stops.forEach(stop => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'island-stop';
    b.dataset.stop = stop.id;
    b.title = stop.goal;
    b.innerHTML = `<span class="stop-icon">${icon(stop.icon)}<span class="stop-check" aria-hidden="true">✓</span></span><b>${stop.name}</b><span class="stop-state"></span>`;
    b.addEventListener('click', () => openMode(stop.id));
    $('island-stops').append(b);
  });
  passport();

  function award(id) {
    const stop = stops.find(s => s.id === id);
    if (!stop) return;
    const fresh = !badges.has(id);
    badges.add(id);
    passport();
    clearTimeout(celebrationTimer);
    $('celebration-text').textContent = fresh ? `獲得「${stop.badge}」徽章！` : `再一次完成「${stop.name}」！`;
    $('celebration').hidden = false;
    $('celebration').classList.remove('celebrate');
    void $('celebration').offsetWidth;
    $('celebration').classList.add('celebrate');
    celebrationTimer = setTimeout(() => { $('celebration').hidden = true; }, 2600);
  }
  function visit(item) {
    visits.add(item.id);
    if (visits.size === 3 && !badges.has('garden')) award('garden');
  }

  const matchLevels = {
    small: {pairs: 2, pool: () => symbols.slice(0, 4)},
    forest: {pairs: 4, pool: () => symbols.slice(0, 21)},
    wide: {pairs: 6, pool: () => symbols}
  };
  function matchSetup() {
    stopAudio();
    match = null;
    $('match-setup').hidden = false;
    $('match-game').hidden = true;
    $('match-result').hidden = true;
  }
  function matchStats() {
    $('match-progress').textContent = `找到 ${match.found} / ${match.pairs} 對`;
    $('match-moves').textContent = `翻了 ${match.turns} 組`;
  }
  function startMatch() {
    stopAudio();
    const level = matchLevels[document.querySelector('input[name="match-level"]:checked').value];
    const chosen = shuffle(level.pool()).slice(0, level.pairs);
    const q = {pairs: level.pairs, found: 0, turns: 0, open: [], locked: false};
    match = q;
    $('match-setup').hidden = true;
    $('match-result').hidden = true;
    $('match-game').hidden = false;
    $('match-cover').hidden = true;
    $('match-finish').hidden = true;
    $('match-feedback').textContent = '翻開一張卡，看看誰躲在裡面。';
    $('match-board').replaceChildren();
    $('match-board').classList.toggle('small', level.pairs === 2);
    shuffle([...chosen, ...chosen]).forEach((item, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'match-card';
      b.dataset.symbol = item.symbol;
      b.setAttribute('aria-label', `第 ${i + 1} 張卡，還沒翻開`);
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = `<span class="card-inner"><span class="card-cover" aria-hidden="true">${icon('plant')}<small>${i + 1}</small></span><span class="card-face" aria-hidden="true">${glyph(item)}<span class="pair-tick">✓</span></span></span>`;
      b.addEventListener('click', () => {
        if (match !== q || q.locked || b.classList.contains('flipped') || b.classList.contains('paired')) return;
        b.classList.add('flipped');
        b.setAttribute('aria-label', `第 ${i + 1} 張卡，${item.symbol}`);
        b.setAttribute('aria-pressed', 'true');
        q.open.push({item, button: b, index: i});
        play(item);
        if (q.open.length < 2) {
          $('match-feedback').textContent = '再翻一張，找到它的雙胞胎。';
          return;
        }
        q.turns++;
        const [one, two] = q.open;
        if (one.item.id === two.item.id) {
          q.found++;
          q.open.forEach(card => {
            card.button.classList.add('paired');
            card.button.disabled = true;
            card.button.setAttribute('aria-label', `${card.item.symbol}，配對成功`);
          });
          q.open = [];
          $('match-feedback').textContent = `找到一對 ${item.symbol} 了！${q.found === q.pairs ? '全部朋友都到齊囉。' : '還有朋友在等你。'}`;
          if (q.found === q.pairs) {
            q.locked = true;
            $('match-finish').hidden = false;
            $('match-finish').focus({preventScroll: true});
          }
        } else {
          q.locked = true;
          // No automatic timeout: children decide when they are ready to hide the cards.
          $('match-board').querySelectorAll('button:not(.paired)').forEach(card => card.disabled = true);
          $('match-feedback').textContent = '這次不一樣。記住它們的位置，看夠了再蓋起來。';
          $('match-cover').hidden = false;
          $('match-cover').focus({preventScroll: true});
        }
        matchStats();
      });
      $('match-board').append(b);
    });
    matchStats();
  }
  $('match-start').addEventListener('click', startMatch);
  $('match-retry').addEventListener('click', startMatch);
  $('match-back').addEventListener('click', matchSetup);
  $('match-next-mode').addEventListener('click', () => openMode('hunt'));
  $('match-cover').addEventListener('click', () => {
    if (!match || !match.locked || match.open.length !== 2) return;
    const first = match.open[0].button;
    match.open.forEach(card => {
      card.button.classList.remove('flipped');
      card.button.setAttribute('aria-pressed', 'false');
      card.button.setAttribute('aria-label', `第 ${card.index + 1} 張卡，還沒翻開`);
    });
    match.open = [];
    match.locked = false;
    $('match-board').querySelectorAll('button:not(.paired)').forEach(b => b.disabled = false);
    $('match-cover').hidden = true;
    $('match-feedback').textContent = '準備好了，再翻兩張吧。';
    first.focus({preventScroll: true});
  });
  $('match-finish').addEventListener('click', () => {
    if (!match || match.found !== match.pairs) return;
    stopAudio();
    $('match-game').hidden = true;
    $('match-result').hidden = false;
    $('match-summary').textContent = `找到 ${match.pairs} 對朋友，一共翻了 ${match.turns} 組。慢慢找、記住位置，就是這次的小任務！`;
    award('match');
    $('match-result-title').focus({preventScroll: true});
  });

  const huntLevels = {
    shore: {tiles: 4, cols: 2, stars: 3, pool: () => symbols.slice(0, 4)},
    forest: {tiles: 9, cols: 3, stars: 4, pool: () => symbols.slice(0, 21)},
    night: {tiles: 12, cols: 4, stars: 5, pool: () => symbols}
  };
  function huntSetup() {
    cancelDrag();
    stopAudio();
    hunt = null;
    $('hunt-setup').hidden = false;
    $('hunt-game').hidden = true;
    $('hunt-result').hidden = true;
  }
  function startHunt() {
    cancelDrag();
    stopAudio();
    const levelId = document.querySelector('input[name="hunt-level"]:checked').value;
    const level = huntLevels[levelId];
    const nodes = shuffle(level.pool()).slice(0, level.tiles);
    const q = {nodes, goals: shuffle(nodes.map((_, i) => i)).slice(0, level.stars), found: 0, attempts: 0, heard: false, path: [], last: null, clueVersion: 0};
    hunt = q;
    $('hunt-setup').hidden = true;
    $('hunt-result').hidden = true;
    $('hunt-game').hidden = false;
    $('hunt-open').hidden = true;
    $('hunt-play').disabled = false;
    $('treasure-map').dataset.land = levelId;
    $('hunt-board').style.setProperty('--cols', level.cols);
    $('hunt-board').replaceChildren();
    $('hunt-question').textContent = '下一顆星星，在哪裡？';
    $('hunt-instruction').textContent = '聽一聽，再點符號，或把小船拖過去。';
    nodes.forEach((item, index) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'treasure-tile';
      b.dataset.treasureIndex = index;
      b.dataset.symbol = item.symbol;
      b.setAttribute('aria-label', `第 ${index + 1} 座島，${item.symbol}`);
      b.innerHTML = `${glyph(item)}<span class="island-star" aria-hidden="true">★</span>`;
      b.addEventListener('click', () => chooseIsland(index));
      $('hunt-board').append(b);
    });
    huntStats();
    updateRoute();
    clue();
  }
  function huntStats() {
    $('hunt-progress').textContent = `星星 ${hunt.found} / ${hunt.goals.length}`;
    $('hunt-stars').textContent = '★'.repeat(hunt.found) + '☆'.repeat(hunt.goals.length - hunt.found);
    $('hunt-stars').setAttribute('aria-label', `已收集 ${hunt.found} 顆，共 ${hunt.goals.length} 顆`);
  }
  function setSailing(ready) {
    if (!hunt) return;
    hunt.heard = ready;
    $('hunt-board').querySelectorAll('button').forEach(b => b.disabled = !ready || b.classList.contains('collected'));
    $('hunt-boat').classList.toggle('can-sail', ready);
  }
  async function clue() {
    const q = hunt;
    if (!q || q.found >= q.goals.length) return;
    const version = ++q.clueVersion;
    cancelDrag();
    setSailing(false);
    $('hunt-feedback').textContent = '仔細聽，星星正在跟你打招呼。';
    const played = await play(q.nodes[q.goals[q.found]]);
    if (hunt !== q || version !== q.clueVersion || q.found >= q.goals.length) return;
    // A replay or mode switch may have cancelled this recording. Never unlock stale clues.
    if (played) {
      setSailing(true);
      $('hunt-feedback').textContent = '聽到了嗎？點小島，或拖動小船去找它。';
    } else {
      $('hunt-feedback').textContent = '還沒有播出線索，請再按一次喇叭。';
    }
  }
  function chooseIsland(index) {
    const q = hunt;
    if (!q || !q.heard || q.found >= q.goals.length) return;
    const tile = $('hunt-board').children[index];
    if (!tile || tile.disabled) return;
    q.attempts++;
    if (index !== q.goals[q.found]) {
      tile.classList.remove('try-again');
      void tile.offsetWidth;
      tile.classList.add('try-again');
      $('hunt-feedback').textContent = '還不是這座島，再聽聽看。';
      updateRoute();
      return;
    }
    tile.classList.add('collected');
    tile.setAttribute('aria-label', `${q.nodes[index].symbol}，這顆星星找到了`);
    q.path.push(index);
    q.last = index;
    q.found++;
    huntStats();
    updateRoute();
    if (q.found === q.goals.length) {
      setSailing(false);
      stopAudio();
      $('hunt-play').disabled = true;
      $('hunt-question').textContent = '星星收齊了！';
      $('hunt-instruction').textContent = '寶箱解鎖，輪到你親手打開。';
      $('hunt-feedback').textContent = '跟著星星的路線，寶藏就在眼前！';
      $('hunt-open').hidden = false;
      $('hunt-open').focus({preventScroll: true});
    } else {
      clue();
    }
  }
  function positionFor(index) {
    const map = $('treasure-map').getBoundingClientRect();
    if (index === null) return {x: 50, y: 100 - 34 / map.height * 100};
    const rect = $('hunt-board').children[index].getBoundingClientRect();
    return {x: (rect.left + rect.width / 2 - map.left) / map.width * 100, y: (rect.top + rect.height / 2 - map.top) / map.height * 100};
  }
  function updateRoute() {
    if (!hunt || $('hunt-game').hidden) return;
    const positions = [positionFor(null), ...hunt.path.map(positionFor)];
    $('hunt-route').innerHTML = `<polyline points="${positions.map(p => `${p.x * 10},${p.y * 10}`).join(' ')}"/>`;
    if (!drag) {
      const pos = positionFor(hunt.last);
      $('hunt-boat').style.left = `${pos.x}%`;
      $('hunt-boat').style.top = `${pos.y}%`;
    }
  }
  function cancelDrag() {
    const old = drag;
    drag = null;
    $('hunt-boat').classList.remove('dragging');
    $('hunt-board').querySelectorAll('.drop-target').forEach(b => b.classList.remove('drop-target'));
    if (old && $('hunt-boat').hasPointerCapture(old.id)) $('hunt-boat').releasePointerCapture(old.id);
    updateRoute();
  }
  function tileAt(x, y) {
    return [...$('hunt-board').children].findIndex(tile => {
      const r = tile.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom && !tile.disabled;
    });
  }
  $('hunt-boat').addEventListener('pointerdown', e => {
    if (!hunt || !hunt.heard || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    drag = {id: e.pointerId};
    $('hunt-boat').setPointerCapture(e.pointerId);
    $('hunt-boat').classList.add('dragging');
  });
  $('hunt-boat').addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    e.preventDefault();
    const r = $('treasure-map').getBoundingClientRect();
    $('hunt-boat').style.left = `${Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100))}%`;
    $('hunt-boat').style.top = `${Math.max(0, Math.min(100, (e.clientY - r.top) / r.height * 100))}%`;
    const index = tileAt(e.clientX, e.clientY);
    [...$('hunt-board').children].forEach((tile, i) => tile.classList.toggle('drop-target', i === index));
  });
  $('hunt-boat').addEventListener('pointerup', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const index = tileAt(e.clientX, e.clientY);
    cancelDrag();
    if (index >= 0) chooseIsland(index);
  });
  $('hunt-boat').addEventListener('pointercancel', cancelDrag);
  $('hunt-boat').addEventListener('lostpointercapture', () => { if (drag) cancelDrag(); });
  $('hunt-start').addEventListener('click', startHunt);
  $('hunt-retry').addEventListener('click', startHunt);
  $('hunt-back').addEventListener('click', huntSetup);
  $('hunt-play').addEventListener('click', clue);
  $('hunt-next-mode').addEventListener('click', () => openMode('tones'));
  $('hunt-open').addEventListener('click', () => {
    if (!hunt || hunt.found !== hunt.goals.length || $('hunt-game').hidden) return;
    $('hunt-game').hidden = true;
    $('hunt-result').hidden = false;
    $('hunt-summary').textContent = `找到 ${hunt.goals.length} 顆星星、航行了 ${hunt.path.length} 座小島。每一步，都是你聽出來的線索！`;
    award('hunt');
    $('hunt-result-title').focus({preventScroll: true});
  });
  window.addEventListener('resize', updateRoute);

  return {
    award, visit,
    enter(next) { if (next === 'match') matchSetup(); if (next === 'hunt') huntSetup(); },
    leave() {
      cancelDrag();
      match = null;
      hunt = null;
      clearTimeout(celebrationTimer);
      $('celebration').hidden = true;
    },
    pause() {
      cancelDrag();
      if (hunt && hunt.found < hunt.goals.length) {
        hunt.clueVersion++;
        setSailing(false);
        $('hunt-feedback').textContent = '回來囉！按喇叭再聽一次線索，就能繼續出航。';
      }
    }
  };
};
