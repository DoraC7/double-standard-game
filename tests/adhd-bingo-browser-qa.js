// Run this expression using browser evaluate after loading the candidate game.
async () => {
  const $ = id => document.getElementById(id);
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const overflow = () => assert(document.documentElement.scrollWidth <= innerWidth, 'page overflows');
  const tiles = () => [...document.querySelectorAll('#board .tile')];
  const click = selector => document.querySelector(selector).click();
  const state = () => tiles().map(t => [t.textContent, t.getAttribute('aria-pressed')]);
  const pressed = () => tiles().filter(t => t.getAttribute('aria-pressed') === 'true');
  const assertCount = count => assert(Number($('marked-count').textContent) === count, `marked count != ${count}`);
  const storage = {local: JSON.stringify({...localStorage}), session: JSON.stringify({...sessionStorage})};
  assert(tiles().length === 25, 'default size'); assertCount(0); overflow();
  const oldIds = tiles().map(t => t.textContent);
  for (let i = 0; i < 5; i++) tiles()[i].click();
  assertCount(5); assert($('line-count').textContent === '1', 'first row line');
  assert(tiles().filter(t => t.classList.contains('in-line')).length === 5, 'visible line');
  assert($('tip-detail').textContent.length > 10 && $('tip-action').textContent.startsWith('可以試試'), 'matching tip');
  tiles()[0].click(); assertCount(4); assert($('line-count').textContent === '0', 'cancel line');
  $('undo').click(); assertCount(5); assert($('line-count').textContent === '1', 'undo selection');
  const initial = JSON.stringify(state());
  click('[data-mode="hyper"]'); assertCount(0); overflow();
  assert(document.querySelector('[data-mode="hyper"]').getAttribute('aria-pressed') === 'true', 'mode highlight');
  assert(tiles().filter(t => t.getAttribute('aria-label').includes('坐不住與衝動')).length === 10, 'hyper proportion');
  assert(tiles().some((t, i) => t.textContent !== oldIds[i]), 'mode must change board');
  $('undo').click(); assert(JSON.stringify(state()) === initial, 'undo entire mode and selected state');
  assert(document.querySelector('[data-mode="mix"]').getAttribute('aria-pressed') === 'true', 'mode restored');
  click('[data-mode="hyper"]');
  click('[data-size="3"]'); assert(tiles().length === 9, 'small size'); assertCount(0); overflow();
  assert(tiles().filter(t => t.getAttribute('aria-label').includes('坐不住與衝動')).length === 5, 'small hyper proportion');
  for (const tile of tiles()) if (!tile.disabled) tile.click();
  assertCount(8); assert($('line-count').textContent === '8', 'full small card');
  assert(pressed().length === 9, 'free plus eight selections'); overflow();
  const full = JSON.stringify(state());
  $('clear-card').click(); assertCount(0); assert($('clear-card').disabled, 'clear disabled for blank');
  $('undo').click(); assert(JSON.stringify(state()) === full, 'undo clear');
  const oldCode = $('card-code').textContent;
  $('new-card').click(); assertCount(0); assert($('card-code').textContent !== oldCode, 'fresh card');
  $('undo').click(); assert(JSON.stringify(state()) === full, 'undo new card');
  const parsed = new URL(location.href);
  assert(parsed.searchParams.get('mode') === 'hyper' && parsed.searchParams.get('size') === '3', 'URL restores mode/size');
  assert([...parsed.searchParams.keys()].sort().join() === 'card,mode,size', 'URL has no answers');
  const pngLines = []; const oldFillText = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function(text, ...args) { pngLines.push(text); return oldFillText.call(this, text, ...args); };
  // Suppress only automatic download in this DOM flow; the manual link/PNG remains inspectable.
  const oldLinkClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function() { if (this.id !== 'download-file') return oldLinkClick.call(this); };
  try {
    $('download').click();
    const deadline = performance.now() + 10000;
    while ($('download').disabled && performance.now() < deadline) await frame();
    assert(!$('download-fallback').hidden, 'PNG fallback visible');
    await $('download-preview').decode();
    assert($('download-preview').naturalWidth === 1400 && $('download-preview').naturalHeight === 1820, 'PNG dimensions');
    assert(pngLines.some(x => x.includes('坐不住加量')) && pngLines.some(x => x.includes('8 / 8')), 'PNG reflects captured mode/count');
    assert(pngLines.filter(x => x.includes('診斷')).length === 1, 'one compact image note');
  } finally { CanvasRenderingContext2D.prototype.fillText = oldFillText; HTMLAnchorElement.prototype.click = oldLinkClick; }
  const png = await (await fetch($('download-preview').src)).blob();
  assert(png.type === 'image/png' && png.size > 1000, 'PNG blob'); overflow();
  tiles()[0].click(); assert($('download-fallback').hidden, 'stale export hidden after changing card');
  $('clear-card').click();
  document.querySelector('details').open = true; overflow();
  document.querySelector('details').open = false;
  await Promise.all([...document.images].map(i => i.decode().catch(() => null)));
  assert([...document.images].filter(i => i.hasAttribute('src')).every(i => i.naturalWidth > 0), 'all images load');
  assert(JSON.stringify({...localStorage}) === storage.local && JSON.stringify({...sessionStorage}) === storage.session, 'no persistence');
  await frame(); tiles()[0].focus();
  return {passed:true, width:innerWidth, height:innerHeight, cases: 'line/cancel/undo/mode/size/full/clear/new/URL/PNG/privacy/layout', pngBytes:png.size, focus:document.activeElement.dataset.index};
}
