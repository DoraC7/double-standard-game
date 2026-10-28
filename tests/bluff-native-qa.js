/* Automated human choices, native 650 ms bot timers; no clock overrides during play. */
async function bluffNativeQA() {
  const $ = id => document.getElementById(id), oldNow = Date.now;
  Date.now = () => 1; try { $('quick').click(); } finally { Date.now = oldNow; }
  const started = performance.now(); let humanActions = 0;
  return await new Promise((resolve,reject) => {
    const interval = setInterval(() => {
      try {
        const v = window.BluffRun.snapshot();
        if (performance.now()-started > 45000) throw Error('native match timeout');
        if (v.paused) throw Error('native match unexpectedly paused');
        if (v.outcome) { clearInterval(interval); if(v.outcome !== 'won') throw Error('unexpected native outcome'); resolve({outcome:v.outcome,rounds:v.round,humanActions,elapsedMs:Math.round(performance.now()-started)}); return; }
        if (v.phase === 'reveal') { $('next').click(); return; }
        if (v.current !== 0) return;
        const a = window.BluffEngine.decide({actor:0,hand:v.players[0].dice,counts:v.players.map(p=>p.count),bid:v.bid},.5);
        if(a.type==='challenge') $('challenge').click();
        else { $('quantity').value=a.quantity; $('quantity').dispatchEvent(new Event('input',{bubbles:true})); document.querySelector(`[data-face="${a.face}"]`).click(); $('bid').click(); }
        humanActions++;
      } catch(e) { clearInterval(interval); reject(e); }
    },25);
  });
}
