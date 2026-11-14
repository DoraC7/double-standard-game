const {chromium}=require('/home/openclaw/.local/lib/node_modules/openclaw/node_modules/playwright-core'),fs=require('fs'),path=require('path');
(async()=>{
 const browser=await chromium.connectOverCDP('http://127.0.0.1:18800'),base=process.argv[2]||'http://127.0.0.1:8781/',helper=fs.readFileSync(path.join(__dirname,'retelling-browser-qa.js'),'utf8'),results=[];
 try{for(const [width,height] of [[1280,850],[360,740],[740,360]]){
  const ctx=await browser.newContext({viewport:{width,height}});try{const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.goto(base+'index.html');if(await p.locator('a.card').count()!==59)throw Error('lobby count');await p.locator('a.card[href="retelling.html"]').click();await p.waitForFunction(()=>window.RetellingGame);await p.addScriptTag({content:helper});
   const runs=[];for(const [mode,branch,miss] of [['all',0,true],['all',1,false],['all',2,false],['short',0,true],['detect',0,false],['repair',0,false],['relay',0,false],['evidence',2,false]]){
    if(runs.length)await p.click('#again');const r=await p.evaluate(([m,b,f])=>retellingQA(m,b,f),[mode,branch,miss]);runs.push(r);
    if(mode==='all'&&branch===0){await p.locator('#reflection').fill('先看「可能」，再問誰說的。<不是HTML>');const wait=p.waitForEvent('download');await p.click('#download');const d=await wait;const text=fs.readFileSync(await d.path(),'utf8');if(!text.includes('首次通過 8 / 12')||!text.includes('第2棒')||!text.includes('<不是HTML>')||!text.includes('小晴'))throw Error('literal export contents');}
   }
   await p.click('#again');await p.selectOption('#mode','evidence');await p.click('#start');await p.locator('[data-action="open"][data-value="0"]').click();await p.locator('[data-action="answer"][data-value="0"]').click();await p.locator('[data-action="open"][data-value="1"]').click();if(!await p.locator('#confirm').isDisabled())throw Error('source switch stale answer');
   await p.evaluate(()=>window.dispatchEvent(new Event('blur')));if(await p.locator('#overlay').isHidden())throw Error('blur pause');const old=await p.evaluate(()=>JSON.stringify(RetellingGame.snapshot().state));await p.evaluate(()=>document.getElementById('confirm').click());if(await p.evaluate(()=>JSON.stringify(RetellingGame.snapshot().state))!==old)throw Error('paused interaction');await p.click('#resume');
   await p.evaluate(async()=>{await Promise.all([...document.images].map(x=>x.decode()));if([...document.images].some(x=>!x.naturalWidth))throw Error('broken image');});await p.screenshot({path:`/tmp/retelling-${width}.png`,fullPage:true});
   if(errors.length)throw Error(errors.join('\n'));results.push({width,height,runs});
  }finally{await ctx.close();}
 }console.log(JSON.stringify({base,results}));}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
