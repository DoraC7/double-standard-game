(() => {
  'use strict';
  const {makeCard, findLines} = window.AdhdBingo;
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  function freshSeed() {
    const values = new Uint32Array(1);
    if (globalThis.crypto?.getRandomValues) crypto.getRandomValues(values);
    else values[0] = Math.floor(Math.random() * 4294967296);
    return values[0].toString(16).padStart(8, '0');
  }
  let seed = /^[0-9a-f]{8}$/i.test(params.get('card') || '') ? params.get('card').toLowerCase() : freshSeed();
  let size = params.get('size') === '3' ? 3 : 5;
  let mode = params.get('mode') === 'hyper' ? 'hyper' : 'mix';
  let card = makeCard(seed, size, mode), selected = new Set([Math.floor(size * size / 2)]);
  let previous = null, activeIndex = null, downloadUrl = null;
  const board = $('board');
  const blankTip = () => {
    $('tip-title').textContent = '吐槽完了，主線怎麼接？';
    $('tip-detail').textContent = '點選任一經驗格，這裡會出現它的說明與一個可以試試的小方法。';
    $('tip-action').textContent = '挑一招試就好，不必一次裝滿技能樹。';
  };
  function snapshot() { previous = {seed, size, mode, selected: [...selected], activeIndex}; $('undo').disabled = false; }
  function invalidateExport() {
    $('download-fallback').hidden = true;
    $('download-preview').removeAttribute('src');
    $('download-file').removeAttribute('href');
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = null;
  }
  function updateUrl() {
    const url = new URL(location.href);
    url.search = ''; url.searchParams.set('card', seed); url.searchParams.set('size', size); url.searchParams.set('mode', mode); url.hash = '';
    try { history.replaceState(null, '', url); } catch { /* Game still works without history access. */ }
  }
  function showTip(index) {
    const item = card[index];
    if (!item) return;
    $('tip-title').textContent = item.text;
    $('tip-detail').textContent = `${item.category}｜${item.detail}`;
    $('tip-action').textContent = `可以試試：${item.tip}`;
  }
  function renderBoard() {
    board.replaceChildren();
    card.forEach((item, index) => {
      const tile = document.createElement('button');
      tile.type = 'button'; tile.className = 'tile'; tile.dataset.index = index;
      if (!item) {
        tile.classList.add('free'); tile.disabled = true;
        tile.innerHTML = '<span class="lobster" aria-hidden="true">FREE</span><span>自由格</span><small>先送你一格</small>';
        tile.setAttribute('aria-label', '自由格，已自動勾選');
      } else {
        tile.style.setProperty('--group-color', item.color);
        const check = document.createElement('span'); check.className = 'check'; check.textContent = '✓'; check.setAttribute('aria-hidden', 'true');
        const label = document.createElement('span'); label.textContent = item.text;
        tile.append(check, label);
        tile.setAttribute('aria-label', `${item.text}（${item.category}）`);
        tile.setAttribute('aria-controls', 'tip-title tip-detail tip-action');
        tile.addEventListener('click', () => {
          snapshot(); invalidateExport(); $('action-status').textContent = '';
          if (selected.has(index)) selected.delete(index); else selected.add(index);
          activeIndex = index; showTip(index); updateState();
        });
      }
      board.append(tile);
    });
    document.querySelector('.game-shell').classList.toggle('small-board', size === 3);
    document.querySelectorAll('[data-size]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.size) === size)));
    document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
    $('mode-description').textContent = mode === 'hyper' ? `坐不住加量：${size === 5 ? '10 / 24' : '5 / 8'} 格是坐不住與衝動，其他格保留生活支線。` : '混合開局：注意力、時間與安排、坐不住與衝動、生活支線，四類平均抽。';
    $('card-code').textContent = `#${seed.toUpperCase()}`;
    $('marked-total').textContent = ` / ${size * size - 1} 格`;
    updateUrl(); updateState();
  }
  function updateState() {
    const lines = findLines(selected, size), winning = new Set(lines.flat());
    board.querySelectorAll('.tile').forEach((tile, index) => {
      tile.setAttribute('aria-pressed', String(selected.has(index)));
      tile.classList.toggle('in-line', winning.has(index));
    });
    $('marked-count').textContent = selected.size - 1;
    $('line-count').textContent = lines.length;
    const banner = $('result-banner');
    const text = lines.length ? `BINGO！${lines.length} 條線，支線終於接起來了！再勾或取消，連線會跟著變。` : '有發生再勾，沒發生就放過；中間自由格先送。';
    if (banner.textContent !== text) banner.textContent = text;
    banner.classList.toggle('bingo', lines.length > 0);
    $('clear-card').disabled = selected.size === 1;
  }
  $('new-card').addEventListener('click', () => {
    snapshot(); invalidateExport(); const oldSeed = seed;
    do { seed = freshSeed(); } while (seed === oldSeed);
    card = makeCard(seed, size, mode); selected = new Set([Math.floor(size * size / 2)]); activeIndex = null;
    blankTip(); renderBoard(); $('action-status').textContent = '新卡準備好了；按「復原上次操作」可回到上一張。';
  });
  $('clear-card').addEventListener('click', () => {
    snapshot(); invalidateExport(); selected = new Set([Math.floor(size * size / 2)]); activeIndex = null;
    blankTip(); updateState(); $('action-status').textContent = '勾選已清除，保留原卡。可以復原。';
  });
  document.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => {
    if (Number(button.dataset.size) === size) return;
    snapshot(); invalidateExport(); size = Number(button.dataset.size); card = makeCard(seed, size, mode);
    selected = new Set([Math.floor(size * size / 2)]); activeIndex = null;
    blankTip(); renderBoard(); $('action-status').textContent = `已換成 ${size}×${size} 空白卡；原本卡片和勾選可復原。`;
  }));
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.mode === mode) return;
    snapshot(); invalidateExport(); mode = button.dataset.mode; card = makeCard(seed, size, mode);
    selected = new Set([Math.floor(size * size / 2)]); activeIndex = null;
    blankTip(); renderBoard(); $('action-status').textContent = '抽卡比例已切換，這張從空白開始；原卡和勾選可復原。';
  }));
  $('undo').addEventListener('click', () => {
    if (!previous) return;
    invalidateExport(); ({seed, size, mode, activeIndex} = previous); selected = new Set(previous.selected);
    previous = null; $('undo').disabled = true; card = makeCard(seed, size, mode); renderBoard();
    if (activeIndex !== null) showTip(activeIndex); else blankTip();
    $('action-status').textContent = '已復原上次操作。';
  });
  $('copy-link').addEventListener('click', async () => {
    const url = new URL(location.pathname, location.origin);
    url.searchParams.set('card', seed); url.searchParams.set('size', size); url.searchParams.set('mode', mode);
    const text = url.href;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Use fallback');
      await navigator.clipboard.writeText(text);
      $('action-status').textContent = '已複製同款空白卡連結，不含你的勾選。';
    } catch {
      const input = document.createElement('textarea'); input.value = text;
      input.setAttribute('aria-label', '同款空白卡連結');
      input.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0';
      document.body.append(input); input.focus(); input.select();
      let copied = false; try { copied = document.execCommand('copy'); } catch { /* Manual copy below. */ }
      input.remove(); $('copy-link').focus();
      if (copied) $('action-status').textContent = '已複製同款空白卡連結，不含你的勾選。';
      else {
        const field = document.createElement('input'); field.type = 'url'; field.readOnly = true; field.value = text;
        field.setAttribute('aria-label', '請手動複製同款空白卡連結'); field.style.width = '100%';
        $('action-status').replaceChildren('請長按或選取以下連結複製（不含勾選）：', field); field.focus(); field.select();
      }
    }
  });
  function wrap(ctx, text, maxWidth) {
    const lines = []; let line = '';
    for (const char of text) {
      if (line && ctx.measureText(line + char).width > maxWidth) { lines.push(line); line = char; }
      else line += char;
    }
    if (line) lines.push(line); return lines;
  }
  $('download').addEventListener('click', async () => {
    const button = $('download'); button.disabled = true;
    $('action-status').textContent = '正在產生賓果圖…';
    // Capture a coherent card before awaiting fonts/blob conversion.
    const saved = {seed, size, mode, card: [...card], selected: new Set(selected)};
    const lines = findLines(saved.selected, saved.size), winning = new Set(lines.flat());
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      const canvas = document.createElement('canvas'); canvas.width = 1400; canvas.height = 1820;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No canvas');
      const font = 'system-ui, -apple-system, "Noto Sans TC", sans-serif';
      ctx.fillStyle = '#f6f1e4'; ctx.fillRect(0, 0, 1400, 1820);
      ctx.fillStyle = '#20372f'; ctx.font = `800 30px ${font}`; ctx.fillText('Dora playground / ADHD 日常賓果・全面過動版', 70, 85);
      ctx.font = `900 78px ${font}`; ctx.fillText('人還坐著，腦內全面過動。', 65, 190);
      ctx.font = `30px ${font}`; ctx.fillText(`${saved.mode === 'hyper' ? '坐不住加量' : '混合開局'} · 有發生再勾，沒發生就放過。`, 70, 258);
      ctx.font = `700 30px ${font}`; ctx.fillText(`共鳴 ${saved.selected.size - 1} / ${saved.size * saved.size - 1} 格　 ·　 ${lines.length} 條連線`, 70, 325);
      const gap = 14, width = (1260 - gap * (saved.size - 1)) / saved.size, height = 1100 / saved.size - gap;
      saved.card.forEach((item, index) => {
        const x = 70 + index % saved.size * (width + gap), y = 385 + Math.floor(index / saved.size) * (height + gap);
        const marked = saved.selected.has(index);
        ctx.fillStyle = item ? (marked ? '#20372f' : '#fffdf6') : '#eed1ac';
        ctx.beginPath(); ctx.roundRect(x, y, width, height, 14); ctx.fill();
        ctx.strokeStyle = winning.has(index) ? '#b27216' : '#ced3bf'; ctx.lineWidth = winning.has(index) ? 6 : 2; ctx.stroke();
        if (item) { ctx.fillStyle = item.color; ctx.beginPath(); ctx.arc(x + 19, y + 20, 6, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = marked && item ? '#fff9e8' : '#20372f';
        if (marked && item) { ctx.font = `800 26px ${font}`; ctx.fillText('✓', x + width - 38, y + 33); }
        const fontSize = saved.size === 5 ? 28 : 40;
        ctx.font = `750 ${fontSize}px ${font}`;
        const textLines = item ? wrap(ctx, item.text, width - 28) : ['FREE', '自由格', '先送你一格'];
        const lineHeight = fontSize * 1.4;
        const firstY = y + height / 2 - (textLines.length - 1) * lineHeight / 2;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        textLines.forEach((line, j) => ctx.fillText(line, x + width / 2, firstY + j * lineHeight));
        ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      });
      ctx.fillStyle = '#20372f'; ctx.font = `700 29px ${font}`;
      ctx.fillText('娛樂賓果，連線不作診斷或嚴重度判定。', 70, 1565);
      ctx.font = `25px ${font}`; ctx.fillText('勾選只留在目前分頁；這張圖片由你自行決定是否分享。', 70, 1610);
      ctx.font = `23px ${font}`; ctx.fillText(`卡號 ${saved.seed.toUpperCase()} / ${saved.size}×${saved.size} / ${saved.mode === 'hyper' ? '坐不住加量' : '混合開局'} · 參考 NIMH、NHS`, 70, 1730);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Image export failed');
      invalidateExport(); downloadUrl = URL.createObjectURL(blob);
      const link = $('download-file'); link.href = downloadUrl; link.download = `daily-bingo-${saved.seed}.png`;
      $('download-preview').src = downloadUrl; $('download-fallback').hidden = false;
      link.click(); $('action-status').textContent = '賓果圖已產生（含你的勾選與遊戲說明）。若未自動下載，可長按下方圖片儲存。';
    } catch {
      $('action-status').textContent = '這個瀏覽器無法產生圖片，請用裝置截圖儲存賓果卡。';
    } finally { button.disabled = false; }
  });
  renderBoard();
})();
