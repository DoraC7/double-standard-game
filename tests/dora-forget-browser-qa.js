// Run this function through the browser evaluate tool on dora-forget.html.
// DOM-driven flow checks; viewport emulation is not a physical iPhone/Safari test.
async () => {
  const check = (ok, label) => { if (!ok) throw new Error(label); };
  const byId = id => document.getElementById(id);
  let overflow = false;
  const layout = () => { overflow ||= document.documentElement.scrollWidth > innerWidth; };
  const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
  for (const count of [4, 16]) {
    start(count); layout();
    for (let round = 0; round < count; round++) {
      byId('actions').firstElementChild.click(); layout();
      const wrong = round === 0;
      const expected = queue[i].answers[wrong ? 1 : 0];
      [...byId('choices').children].find(b => b.textContent.endsWith(' · '+expected)).click();
      byId('actions').firstElementChild.click();
      const scoreBefore = score;
      [...byId('choices').children].forEach(b => b.click());
      byId('actions').firstElementChild.click();
      check(score === scoreBefore, 'answer locked');
      byId('actions').lastElementChild.click(); layout();
      const fire = byId('actions').firstElementChild;
      check(!fire.disabled, 'fire remains actionable before selection');
      fire.click();
      check(phase === 'response' && selected === null && byId('move-status').textContent.includes('還沒選擇'), 'no-selection hint');
      check(document.activeElement === byId('move-status'), 'hint receives focus');
      const buttons = [...byId('choices').children], move = round % 4, before = sparks;
      buttons[(move+1)%4].click(); buttons[move].click();
      check(phase === 'response' && sparks === before, 'selection does not fire or score');
      check(buttons.every((b,j) => b.getAttribute('aria-pressed') === String(j === move)), 'selected state');
      check(byId('move-status').textContent.includes(moves[move][0]), 'selected label');
      fire.click(); layout();
      check(phase === 'result' && sparks === before + moves[move][2], 'fire produces outcome');
      const feedback = byId('feedback').textContent;
      fire.click(); buttons.forEach(b=>b.click());
      check(byId('feedback').textContent === feedback && sparks === before + moves[move][2], 'result locked after double input');
      check(buttons.every(b=>b.disabled) && fire.disabled, 'buttons locked');
      check(log[round].move === moves[move][0], 'review records selected move');
      if (count === 4) {
        const deadline = performance.now()+1800;
        while (performance.now() < deadline) {
          layout();
          const transform = getComputedStyle(byId('pot')).transform;
          const expectedY = move === 3 ? 45 : -110;
          if (transform !== 'none' && Math.abs(new DOMMatrixReadOnly(transform).m42-expectedY)<0.1 && (move===3 || Number(getComputedStyle(byId('burst')).opacity)===1)) break;
          await nextFrame();
        }
        const matrix = new DOMMatrixReadOnly(getComputedStyle(byId('pot')).transform);
        check(Math.abs(matrix.m42-(move===3 ? 45 : -110))<0.1, 'rendered pot destination');
        if (move!==3) check(Number(getComputedStyle(byId('burst')).opacity) === 1, 'rendered burst');
      }
      byId('actions').lastElementChild.click(); layout();
    }
    check(phase === 'done' && score === count-1 && log.length === count, 'full session score');
    check(document.querySelectorAll('.review').length === count, 'complete review');
    check(new Set(log.map(r=>r.title)).size === count, 'unique scenes');
    byId('reset').click();
    check(phase === 'memory' && score === 0 && sparks === 0 && log.length === 0, 'reset');
  }
  byId('motion').click();
  ask(); byId('choices').firstElementChild.click(); byId('actions').firstElementChild.click(); byId('actions').lastElementChild.click();
  byId('choices').children[2].click(); byId('actions').firstElementChild.click();
  check(getComputedStyle(byId('pot')).transitionDuration === '0s', 'motion disabled');
  check(phase === 'result' && byId('feedback').textContent.includes(moves[2][1]), 'no-motion feedback');
  byId('motion').click(); layout();
  check(!overflow, 'no overflow during complete flow and animations');
  return {viewport:[innerWidth,innerHeight],rounds:20,moves:4,misses:2,review:true,reset:true,motionToggle:true,overflow};
}
