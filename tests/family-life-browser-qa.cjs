// DOM preview: public origin only; local navigation policy remains unchanged.
const {chromium}=require('/home/openclaw/.local/lib/node_modules/openclaw/node_modules/playwright-core');
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),D=require('../family-life-data.js');
const base=process.argv[2]||'preview',native=process.argv.includes('--native');
async function boot(page,slug){
 if(base==='preview'){
  await page.goto('https://dorac7.github.io/double-standard-game/index.html');
  let html=fs.readFileSync(path.join(root,slug+'.html'),'utf8');
  html=html.replace(/<script[^>]*src="[^"]+"[^>]*><\/script>/g,'').replace(/<link[^>]*rel="stylesheet"[^>]*>/g,'');
  html=html.replace(/src="([^"]+\.svg)"/g,(_,f)=>'src="data:image/svg+xml;base64,'+fs.readFileSync(path.join(root,f)).toString('base64')+'"');
  await page.evaluate(h=>{document.open();document.write(h);document.close();},html);
  for(const f of ['family-life.css','arcade-fx.css'])await page.addStyleTag({content:fs.readFileSync(path.join(root,f),'utf8')});
  for(const file of ['family-life-data.js','family-life-engine.js','family-life.js','arcade-fx.js'])await page.addScriptTag({content:fs.readFileSync(path.join(root,file),'utf8')});
 }else await page.goto(base+slug+'.html');
 await page.bringToFront();
}
const checkOverflow=async p=>assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');
async function activate(p,selector){if(native==='touch')await p.locator(selector).tap();else if(native){await p.locator(selector).focus();await p.keyboard.press('Enter');}else await p.locator(selector).click();}
async function answer(p,q,good){
 if(q.kind==='choice'){const i=good?q.answer:(q.answer+1)%q.options.length;await activate(p,`[data-choice="${i}"]`);}
 else if(q.kind==='spot'){for(let i=0;i<q.options.length;i++){const v=good?q.answer.includes(i):!q.answer.includes(i);await activate(p,`[data-card="${i}"][data-mark="${v}"]`);}}
 else {for(const i of good?q.options.map((_,i)=>i):q.options.map((_,i)=>i).reverse())await activate(p,`[data-step="${i}"]`);}
}
(async()=>{const b=await chromium.connectOverCDP('http://127.0.0.1:18800');const out=[];
try{
 for(const [width,height] of [[1280,900],[320,568],[844,390]]){
 const ctx=await b.newContext({viewport:{width,height},reducedMotion:'reduce',acceptDownloads:true});const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 try{
 for(const [slug,key] of [['family-room','family'],['safe-life','safe']]){
 await boot(p,slug);await p.selectOption('#mode','all');await activate(p,'#start');let failed=new Set(),seen=new Set();
 for(let n=0;n<20;n++){
  const title=await p.locator('#question-title').textContent(),q=D.banks[key].items.find(x=>x.title===title);assert.ok(q&&!seen.has(q.id));seen.add(q.id);await checkOverflow(p);assert.equal(await p.locator('#confirm').isDisabled(),true);assert.equal(await p.locator('#feedback').isHidden(),true);assert.equal(await p.locator('#next').isHidden(),true);
  if(n===0){await activate(p,'#pause');assert.equal(await p.locator('#pause-dialog').isVisible(),true);await activate(p,'#resume');assert.equal(await p.locator('#pause-dialog').isHidden(),true);assert.equal(await p.locator('#pause').evaluate(n=>n===document.activeElement),true);}
  const intentional=!failed.has(q.kind);if(intentional){failed.add(q.kind);await answer(p,q,false);await activate(p,'#confirm');assert.ok((await p.locator('#feedback').textContent()).includes('先看看原因'));const first=await p.locator('#feedback').textContent();await p.evaluate(()=>document.getElementById('confirm').click());assert.equal(await p.locator('#feedback').textContent(),first);await activate(p,'#retry');assert.equal(await p.locator('#feedback').isHidden(),true);assert.equal(await p.locator('#confirm').isDisabled(),true);}
  await answer(p,q,true);assert.equal(await p.locator('#confirm').isDisabled(),false);await activate(p,'#confirm');assert.ok((await p.locator('#feedback').textContent()).includes('這次'));if(q.kind==='choice')assert.ok((await p.locator('#feedback').textContent()).includes(q.effects[q.answer]));assert.equal(await p.locator('#options button:not(:disabled)').count(),0);await checkOverflow(p);await activate(p,'#next');
 }
 assert.equal(await p.locator('#result').isVisible(),true);assert.equal(await p.locator('#review details').count(),20);const firstText=await p.locator('#review summary').allTextContents();assert.equal(firstText.filter(x=>x.includes('首次待複習')).length,3);assert.equal(firstText.filter(x=>x.includes('最近符合')).length,20);
 if(key==='family')assert.ok(!(await p.locator('#summary').textContent()).includes('首次符合'));else assert.ok((await p.locator('#summary').textContent()).includes('首次符合本題原則 17 題'));
 const dl=p.waitForEvent('download');await activate(p,'#download');const download=await dl,exported=fs.readFileSync(await download.path(),'utf8');assert.ok(exported.includes('作答次數：2'));assert.ok(exported.includes('首次符合本題目標：待複習'));for(const id of seen)assert.ok(exported.includes(id));assert.ok(exported.includes(D.version));await checkOverflow(p);
 await p.screenshot({path:`/tmp/${slug}-${base==='preview'?'candidate':'live'}-${width}.png`,fullPage:true});
 await activate(p,'#restart');await p.selectOption('#mode','short');await activate(p,'#start');const counts={};for(let i=0;i<8;i++){const title=await p.locator('#question-title').textContent(),q=D.banks[key].items.find(x=>x.title===title);counts[q.category]=(counts[q.category]||0)+1;await activate(p,'#unsure');await activate(p,'#next');}assert.deepEqual(Object.values(counts).sort(),[1,1,2,2,2]);assert.equal((await p.locator('#review summary').allTextContents()).filter(s=>s.includes('首次待複習')).length,8);
 out.push({origin:base,slug,width,height,full:20,short:8,firstMisses:3,download:true});
 }
 assert.deepEqual(errors,[]);
 }finally{await ctx.close();}
 }
 console.log(JSON.stringify(out));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1);});
