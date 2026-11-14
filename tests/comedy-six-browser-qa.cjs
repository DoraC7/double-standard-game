const {chromium}=require('/home/openclaw/.local/lib/node_modules/openclaw/node_modules/playwright-core');
const fs=require('node:fs'),E=require('../comedy-six-engine.js'),{goosePlan}=require('./comedy-six-solutions.cjs');
let connected;
(async()=>{
 const browser=await chromium.connectOverCDP('http://127.0.0.1:18800'),page=await browser.contexts()[0].newPage(),errors=[];connected=browser;
 page.on('pageerror',e=>errors.push(e.message));const base=process.argv[2]||'http://127.0.0.1:8778/',goose=goosePlan(E);let flows=0;
 for(const [width,height]of[[1280,850],[360,740],[740,360]])for(const id of Object.keys(E.meta)){
  await page.setViewportSize({width,height});await page.goto(base+id+'.html?qa='+width);await page.waitForFunction(()=>window.ComedyGame);
  const result=await page.evaluate(({id,goose})=>{
    let checks=0;const $=x=>document.getElementById(x),snap=()=>ComedyGame.snapshot(),S=()=>snap().state;
    const ok=(x,m)=>{checks++;if(!x)throw Error(id+': '+m);};
    function click(a,v){const value=v===undefined?'':`[data-value="${v}"]`,b=document.querySelector(`[data-action="${a}"]${value}`);ok(!!b,'控制存在 '+a+' '+v);ok(!b.disabled,'控制可用 '+a+' '+v);b.click();ok(document.documentElement.scrollWidth<=innerWidth,'操作後無水平溢出');}
    function set(a,v){const el=$('input-'+a.replace(':','-'));ok(!!el&&!el.disabled,'選單可用 '+a);el.value=String(v);el.dispatchEvent(new Event('change',{bubbles:true}));ok(document.documentElement.scrollWidth<=innerWidth,'選單後無溢出');}
    function drama(n){const el=$('input-drama');el.value=n;el.dispatchEvent(new Event('input',{bubbles:true}));ok(el===$('input-drama'),'拖曳滑桿不被重新建立');ok($('drama-value').textContent===String(n),'戲劇數值可見');}
    function ended(pass){ok(S().status!=='playing','已收場');ok(S().pass===pass,'收場類型正確');const before=JSON.stringify(S());for(const b of document.querySelectorAll('[data-action]')){ok(b.disabled,'收場後操作鎖定');b.click();}ok(JSON.stringify(S())===before,'收場後不可覆寫');}
    function retry(){$('retry').click();ok(S().status==='playing','單局重演');}
    function next(){$('next').click();ok(S().status==='playing','下一局');}
    $('start').click();ok(snap().started&&S().status==='playing','開演');
    const initial=JSON.stringify(S());$('pause').click();ok(snap().paused&&!$('overlay').hidden,'手動暫停');for(const b of document.querySelectorAll('[data-action]'))b.click();ok(JSON.stringify(S())===initial,'暫停後操作無效');$('resume').click();window.dispatchEvent(new Event('blur'));ok(snap().paused,'失焦暫停');$('resume').click();
    Object.defineProperty(document,'hidden',{configurable:true,value:true});try{document.dispatchEvent(new Event('visibilitychange'));ok(snap().paused,'背景暫停');}finally{delete document.hidden;}$('resume').click();
    if(id==='dont-press'){
      click('unplug');ok(S().powered,'未看銘牌不亂斷電');for(let n=0;n<5;n++){click('press');if(n<4)ok(document.querySelectorAll('.committee').length===S().committees,'委員會實際生成');}ended(false);retry();
      click('press');click('press');click('inspect');click('unplug');const chaos=S().chaos;click('press');ok(S().chaos===chaos,'沒電不生成');click('dissolve');ok(document.querySelectorAll('.committee').length===0,'組織實際移除');click('archive');ended(true);ok(snap().first[0].pass===false,'首次失敗保留');
      retry();click('inspect');click('unplug');click('archive');ended(true);ok(S().ending.includes('零次會議'),'零次會議結局');
    }
    if(id==='office-goose'){
      for(let n=0;n<5;n++)click('honk');ended(false);retry();for(const a of goose){click(a);const s=S(),cell=document.querySelector('.office-cell.player');ok(cell.id===`cell-${s.x}-${s.y}`,'圖上鵝位置等於狀態');const g=ComedySix.guard(s);ok($(`cell-${g[0]}-${g[1]}`).classList.contains('guard'),'主管位置等於巡邏');}ended(true);ok(S().done.every(Boolean)&&S().x===0&&S().y===4,'雙任務與出口');ok(snap().first[0].pass===false,'先前被抓保留');
    }
    if(id==='oversize-package'){
      for(let r=0;r<3;r++){
        ok($('commit').disabled,'未組裝不能送出');for(const[a,v]of[['box',4],['material',0],['label',2],['lift',1],['pad',1]])set(a,v);click('ship');ended(false);retry();
        for(const[a,v]of[['box',3],['material',0],['label',2],['lift',1],['pad',1]])set(a,v);click('rotate');ok(ComedySix.packageMetrics(S()).fitsLift===false,'側放改變電梯相容');click('rotate');ok(ComedySix.packageMetrics(S()).fitsLift,'直立可進貨梯');ok(document.querySelector('.box-art rect').getAttribute('height')>0,'紙箱實際繪製');click('ship');ended(true);if(r<2)next();
      }ok(snap().first.every(r=>!r.pass)&&snap().latest.every(r=>r.pass),'三局首次與最近分開');
    }
    if(id==='awkward-elevator'){
      function ride(lines,pos){for(let n=0;n<6;n++){ok($('commit').disabled,'站位台詞未選不可說');click('position',pos);ok(document.querySelectorAll('.position-slot.selected').length===1,'實際站位選取');click('line',lines[n]);ok(document.querySelector(`[data-action="line"][data-value="${lines[n]}"]`).getAttribute('aria-pressed')==='true','台詞選取');click('speak');ok(S().turn===n+1,'一按只前進一幕');if(n===0)ok(document.querySelector('[data-action="line"]').textContent.includes(S().mistaken?'抱歉':'安靜'),'認錯人改變下一幕選項');}}
      ride([0,1,2,1,0,1],1);ended(true);ok(S().ending.includes('尷尬建國'),'建國結局');retry();ride([1,2,1,0,1,1],2);ok(S().ending.includes('平安出梯'),'平安結局');retry();ride([0,0,0,0,0,2],0);ok(S().ending.includes('都市傳說'),'都市傳說結局');
    }
    if(id==='weird-order'){
      const meals=[{base:0,soup:0,season:3,texture:1},{base:1,soup:2,season:0,texture:0},{base:2,soup:0,season:0,texture:1}];
      for(let r=0;r<3;r++){
        ok($('commit').disabled,'未選完整不能出餐');for(const[k,v]of Object.entries(meals[r]))set('recipe:'+k,v);click('serve');ended(false);ok(S().ending.includes('猜中'),'猜中與問明分開');retry();
        click('ask',2);ok(document.querySelectorAll('#stage .record').length===0,'推會員不會冒出答案');click('ask',0);ok(document.querySelector('#stage .record').textContent.includes(ComedySix.customers[r].meaning),'實際問題對應實際回覆');click('ask',1);ok(document.querySelectorAll('#stage .record')[1].textContent.includes(ComedySix.customers[r].avoid),'排除項回覆');
        for(const[k,v]of Object.entries(meals[r]))set('recipe:'+k,v);const svg=document.querySelector('.recipe-art');ok(svg.innerHTML.includes(r===2?'#73a55a':r===1?'#fff5d2':'#e2b66b'),'麵體顏色依配料變');ok(svg.querySelectorAll('rect').length===(r===1?1:0),'湯另外裝實際有湯杯');click('serve');ended(true);if(r<2){next();ok(S().asked.every(x=>!x),'跨客人清空追問');}
      }ok(snap().first.every(r=>!r.pass)&&snap().latest.every(r=>r.pass),'怪餐首次與最近分開');
    }
    if(id==='offtopic-press'){
      for(let r=0;r<3;r++){
        ok($('commit').disabled,'未選卡不可發言');click('card','dinosaur');drama(3);ok(S().turn===0&&S().chaos===0,'預覽不算發言');ok(document.querySelectorAll('.press-chart svg g').length===4,'戲劇效果改變實際恐龍數');click('speak');ok(S().note===ComedySix.conferences[r].follow,'記者針對恐龍追問');click('card','universe');click('speak');ended(false);ok(S().ending.includes('恐龍展'),'恐龍展結局');retry();
        click('card','dinosaur');drama(1);click('speak');click('open');ok(document.querySelector('#controls .record').textContent===ComedySix.conferences[r].record,'開啟本場而非舊場資料');click('card','facts');click('speak');ok(!S().focus&&S().status==='playing','離題時資料不自動結案');click('card','return');click('speak');ok(S().focus,'拉回原題真的改變狀態');click('card','facts');click('speak');ended(true);ok(S().ending.includes(ComedySix.conferences[r].answer),'根據本場資料實際回答');if(r<2){next();ok(!S().opened&&S().used.length===0,'新場清空資料與手牌');}
      }
      retry();for(let n=0;n<5;n++){click('card','facts');click('speak');}ended(false);ok(S().ending.includes('下次記者會'),'五次未回答結局');retry();click('open');click('card','facts');click('speak');ended(true);
    }
    ok(!$('recap-panel').hidden,'完整回顧可見');ok($('recap').children.length===ComedySix.meta[id].rounds,'沒有跳過回合分母');ok(document.documentElement.scrollWidth<=innerWidth,'結算無溢出');
    return {checks,id,viewport:[innerWidth,innerHeight],ending:S().ending};
  },{id,goose});
  flows++;console.log(JSON.stringify({base,flow:flows,...result}));
  if(width===360)await page.locator('#stage').screenshot({path:'/tmp/comedy-six-'+id+'.png'});
  if(width===740){const waiting=page.waitForEvent('download');await page.locator('#download').click();const d=await waiting,text=fs.readFileSync(await d.path(),'utf8');if(!text.includes(E.meta[id].title)||!text.includes('首次：')||!text.includes('最近：'))throw Error(id+' TXT缺紀錄');console.log(id+' actual TXT download verified');}
  await page.evaluate(()=>{document.getElementById('restart').click();const s=ComedyGame.snapshot();if(s.state.round!==0||s.first.some(Boolean)||s.latest.some(Boolean)||!document.getElementById('recap-panel').hidden)throw Error('重新開演未清空');});
 }
 // Native keyboard and touch-like clicks supplement the DOM flow; no real phone claim.
 await page.goto(base+'office-goose.html');await page.locator('#start').focus();await page.keyboard.press('Enter');await page.keyboard.press('ArrowUp');if(await page.evaluate(()=>ComedyGame.snapshot().state.y)!==3)throw Error('方向鍵');await page.keyboard.press('w');if(await page.evaluate(()=>ComedyGame.snapshot().state.y)!==2)throw Error('WASD');await page.keyboard.press('Escape');if(!await page.locator('#overlay').isVisible())throw Error('Esc暫停');await page.locator('#resume').focus();await page.keyboard.press('Space');const before=await page.evaluate(()=>ComedyGame.snapshot().state.x);await page.locator('[data-action="left"]').click();if(await page.evaluate(()=>ComedyGame.snapshot().state.x)!==before-1)throw Error('原生按鈕');
 await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode()));if([...document.images].some(i=>i.naturalWidth===0))throw Error('圖片');});
 if(errors.length)throw Error(errors.join('\n'));console.log(JSON.stringify({base,completeFlows:flows,nativeKeyboard:true,pageErrors:errors.length}));await page.close();await browser.close();
})().catch(async e=>{console.error(e);process.exitCode=1;if(connected)await connected.close();});
