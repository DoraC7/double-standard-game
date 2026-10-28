(() => {
  'use strict';
  const boot=()=>{
    const stage=document.querySelector('.lobby-stage');
    if(!stage)return;
    const body=document.body,reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const lights=[...document.querySelectorAll('[data-light]')],lit=new Set(),active=new Set(),bits=new Set();
    const status=document.getElementById('lobby-status'),draw=document.getElementById('lobby-draw');
    const motion=document.getElementById('lobby-motion'),globalMotion=document.querySelector('.arcade-fx-toggle');
    const cards=[...document.querySelectorAll('.card')],resets=[];
    const enabled=()=>!reduced.matches&&!body.classList.contains('arcade-still');
    const allowed=()=>enabled()&&!document.hidden;
    function stop(){active.forEach(a=>a.cancel());active.clear();bits.forEach(n=>n.remove());bits.clear();resets.forEach(fn=>fn());}
    function animate(node,frames,options={}){
      if(!allowed()||!node?.animate||!node.getClientRects().length)return;
      let a;try{a=node.animate(frames,{duration:420,easing:'cubic-bezier(.2,.8,.2,1)',...options});}catch{return;}
      active.add(a);const clear=()=>active.delete(a);a.onfinish=clear;a.oncancel=clear;
    }
    // Real image readiness, not a timer pretending to measure download progress.
    // The welcome never covers links, moves focus or delays playing a game.
    const welcome=document.querySelector('.lobby-welcome');
    function welcomeShow(){
      if(!welcome)return;
      animate(welcome.querySelector('.welcome-mascot'),[{rotate:'-12deg',scale:.85},{rotate:'8deg',scale:1.12,offset:.55},{rotate:'0deg',scale:1}],{duration:750});
      animate(welcome.querySelector('.welcome-badge'),[{scale:1.3,rotate:'-14deg',opacity:.4},{scale:1,rotate:'-6deg',opacity:1}],{duration:550});
      animate(document.querySelector('.lobby-intro'),[{translate:'0 10px',opacity:.65},{translate:'0 0',opacity:1}],{duration:600});
    }
    if(welcome){
      const headline=document.getElementById('welcome-status'),detail=document.getElementById('welcome-detail'),meter=document.getElementById('welcome-meter'),replay=document.getElementById('welcome-replay');
      const images=[...document.images];let done=0,failed=0,settled=false;
      const paint=()=>{meter.style.setProperty('--welcome-progress',String(images.length?done/images.length:1));};
      headline.textContent='小龍蝦正在準備遊戲間…';detail.textContent='插圖載入中，遊戲可以直接開始。';
      welcome.classList.add('is-loading');paint();
      const finish=()=>{
        settled=true;welcome.classList.remove('is-loading');welcome.classList.add('is-ready');
        headline.textContent='歡迎來到龍蝦遊戲間！';
        detail.textContent=failed?'部分插圖暫時無法顯示，仍可選擇遊戲。':`${cards.length} 款遊戲已在這裡，挑一款就出發。`;
        replay.hidden=false;welcomeShow();
      };
      // Slow artwork must not leave a permanent "loading" announcement.
      const deadline=setTimeout(()=>{if(!settled){welcome.classList.remove('is-loading');headline.textContent='歡迎來到龍蝦遊戲間！';detail.textContent='部分插圖還在載入，遊戲可以直接開始。';replay.hidden=false;}},2500);
      Promise.all(images.map(async image=>{
        try{if(image.decode)await image.decode();else if(!image.complete)await new Promise(resolve=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',resolve,{once:true});});if(!image.naturalWidth)failed++;}
        catch{failed++;}
        done++;paint();
      })).then(()=>{clearTimeout(deadline);finish();});
      replay.addEventListener('click',()=>{
        headline.textContent=headline.textContent==='歡迎來到龍蝦遊戲間！'?'小龍蝦向你打招呼，一起玩吧！':'歡迎來到龍蝦遊戲間！';
        welcomeShow();
      });
    }
    function celebrate(){
      const windowNode=stage.querySelector('.stage-window');
      if(!allowed()||!windowNode.animate||bits.size)return;
      for(let i=0;i<12;i++){
        const bit=document.createElement('i');bit.className='lobby-bit';bit.setAttribute('aria-hidden','true');bit.textContent=i%2?'✦':'●';bit.style.color=['#a8502c','#567c54','#ab78ab'][i%3];windowNode.append(bit);bits.add(bit);
        const angle=Math.PI*2*i/12,a=bit.animate([{translate:'0 0',opacity:1,scale:1},{translate:`${Math.cos(angle)*110}px ${Math.sin(angle)*85}px`,opacity:0,scale:.4,rotate:'100deg'}],{duration:900,easing:'ease-out'});active.add(a);const clear=()=>{bits.delete(bit);bit.remove();active.delete(a);};a.onfinish=clear;a.oncancel=clear;
      }
    }
    function renderLights(){
      lights.forEach(b=>b.setAttribute('aria-pressed',String(lit.has(b.dataset.light))));
      stage.classList.toggle('ready',lit.size===lights.length);
      status.textContent=lit.size===3?'三盞都亮了！龍蝦準備好陪你出發。':`亮燈 ${lit.size} / 3 · ${lit.size?'再點亮一個不同的按鈕。':'想從哪一盞開始？'}`;
    }
    lights.forEach(b=>b.addEventListener('click',()=>{
      const fresh=!lit.has(b.dataset.light);lit.add(b.dataset.light);renderLights();
      animate(b.querySelector('span'),[{scale:1},{scale:1.35,rotate:'15deg',offset:.45},{scale:1,rotate:'0deg'}]);
      if(fresh&&lit.size===3){animate(stage.querySelector('.stage-top'),[{background:'#17352a'},{background:'#a54f2d',offset:.5},{background:'#17352a'}],{duration:650});celebrate();}
    }));
    document.getElementById('lobby-reset').addEventListener('click',()=>{lit.clear();stop();renderLights();});
    // Both entry buttons use the same dialog, preserving their own return focus.
    const dialog=document.getElementById('pick-dialog'),surprise=document.getElementById('surprise');
    let stageDraw=false,dialogOpener=null;
    draw.addEventListener('click',()=>{stageDraw=true;surprise.click();stageDraw=false;});
    surprise.addEventListener('click',()=>{dialogOpener=stageDraw?draw:surprise;});
    dialog.addEventListener('close',()=>{dialogOpener?.focus();dialogOpener=null;});
    function sync(){
      body.classList.toggle('lobby-paused',document.hidden);
      motion.disabled=reduced.matches||!globalMotion;
      motion.setAttribute('aria-pressed',String(enabled()));
      motion.textContent=reduced.matches?'小動畫：依系統關閉':'小動畫：'+(enabled()?'開':'關');
      if(!allowed())stop();
    }
    motion.addEventListener('click',()=>{globalMotion?.click();sync();});
    new MutationObserver(sync).observe(body,{attributes:true,attributeFilter:['class']});
    reduced.addEventListener?.('change',sync);
    document.addEventListener('visibilitychange',sync);
    window.addEventListener('pagehide',stop);
    window.addEventListener('blur',stop);
    cards.forEach(card=>{
      let frame=null,last=null;
      function reset(){if(frame!==null)cancelAnimationFrame(frame);frame=null;last=null;['--card-x','--card-y','--art-x','--art-y','--card-spot-x','--card-spot-y'].forEach(k=>card.style.removeProperty(k));}
      resets.push(reset);
      card.addEventListener('pointermove',event=>{
        if(event.pointerType!=='mouse'||!allowed()||typeof requestAnimationFrame!=='function')return;
        const r=card.getBoundingClientRect();last={x:Math.max(0,Math.min(1,(event.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(event.clientY-r.top)/r.height))};
        if(frame!==null)return;
        frame=requestAnimationFrame(()=>{frame=null;if(!allowed()||!last)return;card.style.setProperty('--card-x',(last.x-.5)*12+'px');card.style.setProperty('--card-y',(last.y-.5)*8+'px');card.style.setProperty('--art-x',(last.x-.5)*8+'px');card.style.setProperty('--art-y',(last.y-.5)*5+'px');card.style.setProperty('--card-spot-x',last.x*100+'%');card.style.setProperty('--card-spot-y',last.y*100+'%');});
      });
      card.addEventListener('pointerleave',reset);
      card.addEventListener('pointercancel',reset);
    });
    const pool=document.getElementById('lobby-pool');
    document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{
      const visible=cards.filter(c=>!c.hidden).length;
      pool.textContent=`冒險票範圍：${b.textContent.trim()} · ${visible} 款遊戲。不花錢、不需要帳號。`;
      animate(document.getElementById('result-count'),[{translate:'0 5px',opacity:.5},{translate:'0 0',opacity:1}],{duration:280});
    }));
    document.getElementById('pick-again').addEventListener('click',()=>animate(document.getElementById('pick-image'),[{rotate:'0deg',scale:1},{rotate:'-12deg',scale:.86,offset:.45},{rotate:'0deg',scale:1}],{duration:400}));
    if(typeof IntersectionObserver==='function'){
      const stageObserver=new IntersectionObserver(entries=>{for(const entry of entries)body.classList.toggle('lobby-offstage',!entry.isIntersecting);});stageObserver.observe(stage);
      const revealObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){animate(entry.target.querySelector('.art img'),[{scale:'.96',opacity:.6},{scale:'1',opacity:1}],{duration:420});revealObserver.unobserve(entry.target);}},{threshold:.12});cards.forEach(c=>revealObserver.observe(c));
    }
    renderLights();sync();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
