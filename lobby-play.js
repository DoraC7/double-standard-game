(()=>{'use strict';const boot=()=>{
const body=document.body,motion=document.getElementById('lobby-motion'),globalMotion=document.querySelector('.arcade-fx-toggle'),replay=document.getElementById('opening-replay'),status=document.getElementById('opening-status'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),active=new Set();let timer=null;
function stop(){active.forEach(a=>a.cancel());active.clear();clearTimeout(timer);timer=null;}
const allowed=()=>!body.classList.contains('arcade-still')&&!reduced.matches&&!document.hidden;
function sync(){const enabled=!body.classList.contains('arcade-still')&&!reduced.matches;motion.disabled=reduced.matches||!globalMotion;motion.setAttribute('aria-pressed',String(enabled));motion.textContent=reduced.matches?'效果：依系統關閉':'效果：'+(enabled?'開':'關');replay.disabled=!enabled;if(!allowed())stop();}
function animate(selector,frames,duration,delay=0){const el=document.querySelector(selector);if(!el?.animate)return;const a=el.animate(frames,{duration,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});active.add(a);a.onfinish=()=>active.delete(a);}
function opening(){stop();if(!allowed())return;status.textContent='開場演出中';
 animate('.feature-poster',[{opacity:.4,translate:'0 18px'},{opacity:1,translate:'0 0'}],600);
 animate('.feature-copy h1',[{opacity:0,translate:'0 40px'},{opacity:1,translate:'0 0'}],800,100);
 animate('.poster-melon',[{translate:'-260px 120px'},{translate:'16px -8px',offset:.76},{translate:'0 0'}],1100,80);
 animate('.poster-rival',[{translate:'180px -60px'},{translate:'0 0'}],950,260);
 document.querySelectorAll('.poster-jet').forEach(el=>{if(!el.animate)return;const a=el.animate([{strokeDasharray:'1000',strokeDashoffset:'1000'},{strokeDasharray:'1000',strokeDashoffset:'0'}],{duration:1000,delay:220,easing:'cubic-bezier(.2,.7,.3,1)',fill:'backwards'});active.add(a);a.onfinish=()=>active.delete(a);});
 animate('.poster-ballots',[{opacity:0,translate:'0 -90px',scale:.5},{opacity:1,translate:'0 0',scale:1}],850,480);
 animate('.poster-caption h2',[{opacity:0,translate:'0 28px'},{opacity:1,translate:'0 0'}],600,850);
 timer=setTimeout(()=>{status.textContent='開場演出結束，可以直接開玩。';timer=null;},1500);
}
motion.addEventListener('click',()=>{globalMotion?.click();sync();});replay.addEventListener('click',opening);new MutationObserver(sync).observe(body,{attributes:true,attributeFilter:['class']});reduced.addEventListener?.('change',sync);document.addEventListener('visibilitychange',sync);window.addEventListener('pagehide',stop);
const dialog=document.getElementById('pick-dialog'),surprise=document.getElementById('surprise');let opener=null;surprise.addEventListener('click',()=>{opener=surprise;});dialog.addEventListener('close',()=>{opener?.focus();opener=null;});sync();opening();
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();})();
