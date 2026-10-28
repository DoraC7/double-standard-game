(() => {
  'use strict';
  const boot = () => {
    const body = document.body;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const active = new Set();
    const bits = new Set();
    const running = new WeakMap();
    let enabled = true;
    const legacyToggle = document.getElementById('motion-toggle');
    const allowed = () => enabled && !reduced.matches && !body.classList.contains('no-motion') && !document.hidden;
    function stop() {
      active.forEach(a => a.cancel());active.clear();
      bits.forEach(bit => bit.remove());bits.clear();
    }
    function animate(el, frames, options = {}) {
      if (!allowed() || !el?.animate || !el.getClientRects().length) return;
      const old = running.get(el);
      if (old) { old.cancel();active.delete(old); }
      const a = el.animate(frames, {duration:360,easing:'cubic-bezier(.2,.8,.2,1)',...options});
      running.set(el,a);active.add(a);
      const clear = () => {active.delete(a);if(running.get(el) === a)running.delete(el);};
      a.onfinish = clear;a.oncancel = clear;
    }
    function burst(el, count = 7) {
      if (!allowed() || !el?.animate || bits.size >= 28 || !el.getClientRects().length) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const x = Math.max(12,Math.min(innerWidth - 12,r.left + r.width / 2));
      const y = Math.max(12,Math.min(innerHeight - 12,r.top + Math.min(r.height / 2,70)));
      for(let i=0;i<count && bits.size<28;i++) {
        const bit=document.createElement('i');bit.className='arcade-fx-bit';bit.setAttribute('aria-hidden','true');
        bit.style.left=x+'px';bit.style.top=y+'px';
        bit.style.background=['#efb84f','#ae83bf','#69a78c'][i%3];
        body.append(bit);bits.add(bit);
        const angle=(i/count)*Math.PI*2;
        const a=bit.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(${Math.cos(angle)*65}px,${Math.sin(angle)*48+18}px) rotate(160deg) scale(.3)`,opacity:0}],{duration:650,easing:'ease-out'});
        active.add(a);
        const clear=()=>{bit.remove();bits.delete(bit);active.delete(a);};a.onfinish=clear;a.oncancel=clear;
      }
    }
    const frames = {
      reveal:[{opacity:.4,translate:'0 9px'},{opacity:1,translate:'0 0'}],
      stamp:[{scale:'1.025',outline:'2px solid #e4ab50',outlineOffset:'5px'},{scale:'1',outline:'0px solid transparent',outlineOffset:'0px'}],
      draw:[{rotate:'-2deg',translate:'0 10px',opacity:.45},{rotate:'1deg',offset:.6,opacity:1},{rotate:'0deg',translate:'0 0',opacity:1}],
      print:[{translate:'0 -12px',opacity:.4},{translate:'0 3px',offset:.7,opacity:1},{translate:'0 0',opacity:1}],
      score:[{scale:'1'},{scale:'1.16',offset:.4},{scale:'1'}],
      finish:[{opacity:.4,translate:'0 14px'},{opacity:1,translate:'0 0'}]
    };
    // Observe explicit presentation nodes, never infer correctness from answer text.
    document.querySelectorAll('[data-fx]').forEach(el => {
      let previous = el.textContent;
      let visible = !!el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
      const observer = new MutationObserver(() => {
        const now = !!el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
        const text = el.textContent;
        const changed = text !== previous;
        const appeared = now && !visible;
        previous=text;visible=now;
        if(!now || (!changed && !appeared))return;
        const kind=el.dataset.fx;
        animate(el,frames[kind] || frames.reveal);
        if(kind === 'finish' && appeared)burst(el,12);
      });
      observer.observe(el,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden','class','open']});
    });
    // A neutral little tap ring, also available to Enter/Space activation.
    document.addEventListener('click',event => {
      const button=event.target.closest?.('button');
      if(!button || button.disabled || button.matches('#left,#right,#drift,[data-dir],.arcade-fx-toggle,#motion-toggle'))return;
      animate(button,[{outline:'2px solid #e4ab50',outlineOffset:'0px'},{outline:'0px solid transparent',outlineOffset:'6px'}],{duration:260});
    },true);
    let toggle;
    function sync() {
      if(body.classList.contains('arcade-still') === enabled)body.classList.toggle('arcade-still',!enabled);
      if(toggle) {
        toggle.setAttribute('aria-pressed',String(enabled && !reduced.matches));
        toggle.textContent=reduced.matches?'小動畫：依系統關閉':'小動畫：'+(enabled?'開':'關');
        toggle.disabled=reduced.matches;
      }
      if(!allowed())stop();
    }
    if(!legacyToggle) {
      const tools=document.createElement('div');tools.className='arcade-fx-tools';
      toggle=document.createElement('button');toggle.type='button';toggle.className='arcade-fx-toggle';
      toggle.setAttribute('aria-label','切換小動畫');
      toggle.addEventListener('click',()=>{enabled=!enabled;sync();});tools.append(toggle);body.append(tools);
    } else {
      // Keep the existing game's single animation switch authoritative.
      new MutationObserver(sync).observe(body,{attributes:true,attributeFilter:['class']});
    }
    reduced.addEventListener?.('change',sync);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
    window.addEventListener('pagehide',stop);
    sync();
    if(body.classList.contains('arcade-lobby')) {
      const cards=[...document.querySelectorAll('.card')];
      cards.forEach(card=>card.dataset.cabinet=card.getAttribute('href').replace('.html',''));
      // Never hide content waiting for an observer, and replay only on user filtering.
      document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=> {
        cards.filter(card=>!card.hidden).forEach((card,i)=>animate(card,frames.reveal,{delay:Math.min(i*28,168)}));
      }));
      const host=document.getElementById('arcade-host');
      const speech=document.getElementById('arcade-host-speech');
      const lines=['鉗子準備好了，換你出招！','今天的任務：玩得開心就好。','選不出來？試試「幫我選一款」！','慢慢玩，不用一次破完全部。'];
      let hello=0;
      host?.addEventListener('click',()=> {
        speech.textContent=lines[hello++%lines.length];
        animate(host,[{rotate:'0deg'},{rotate:'-13deg',offset:.3},{rotate:'11deg',offset:.65},{rotate:'0deg'}],{duration:480});burst(host);
      });
      const hints={all:`有 ${cards.length} 台機台，今天想去哪裡冒險？`,think:'讓腦袋轉一下，答案不用搶快。',chill:'放輕鬆，這裡沒有趕進度。',energy:'電力滿格？找一台放個電！',move:'手指暖身，準備出發！',learn:'親手試一下，把好奇變成新技能。'};
      document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{speech.textContent=hints[button.dataset.filter]||hints.all;animate(speech,frames.reveal);}));
    }
  };
  if(document.readyState === 'loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
