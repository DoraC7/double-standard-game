const{chromium}=require('/home/openclaw/.local/lib/node_modules/openclaw/node_modules/playwright-core'),fs=require('node:fs');let connected;
(async()=>{const b=await chromium.connectOverCDP('http://127.0.0.1:18800');connected=b;const p=await b.contexts()[0].newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));const base=process.argv[2]||'http://127.0.0.1:8779/';let flows=0;
 async function run(width,height,branch){
   await p.setViewportSize({width,height});await p.goto(base+'token-value.html?qa='+width+'-'+branch);await p.waitForFunction(()=>window.TokenValueGame);
   const result=await p.evaluate(({branch})=>{const T=TokenValueData,$=id=>document.getElementById(id),snap=()=>TokenValueGame.snapshot(),S=()=>snap().state;let checks=0,spent=0;
    const ok=(x,m)=>{checks++;if(!x)throw Error(m);};
    function charged(fn){const before=S().fuel;fn();spent+=Math.max(0,S().fuel-before);ok(document.documentElement.scrollWidth<=innerWidth,'互動無水平溢出');}
    function click(a,v){const tail=v===undefined?'':`[data-value='${JSON.stringify(v)}']`,b=document.querySelector(`[data-action="${a}"]${tail}`);ok(!!b,'操作存在 '+a+' '+v);ok(!b.disabled,'操作未鎖定 '+a+' '+v);charged(()=>b.click());}
    function finish(done,efficient){charged(()=>$('confirm').click());ok(S().finished&&S().done===done&&S().efficient===efficient,'任務與投入各自判斷');ok($('fuel').textContent===S().fuel+' 格','燃料顯示實際遊戲成本');ok([...$('workspace').querySelectorAll('button,input')].every(el=>el.disabled),'驗收後鎖定');const previous=JSON.stringify(S());$('confirm').click();ok(JSON.stringify(S())===previous,'第二次確認不覆寫');}
    function retry(){$('retry').click();ok(S().fuel===0&&!S().finished,'重演清空當次策略');ok($('confirm').disabled,'重演未操作擋驗收');}
    function source(t,n){click('open',n);ok($('source-text').textContent===t.sources[n].text,'呈現的是選到的來源，不是別張卡');const src=t.sources[n];if(src.kind==='timeline'){const range=$('frame-slider');for(let f=0;f<src.frames.length;f++){range.value=f;charged(()=>range.dispatchEvent(new Event('input',{bubbles:true})));ok(range===$('frame-slider'),'時間軸滑桿保持同一個節點');ok($('frame-caption').textContent===src.frames[f].caption,'關鍵格與內容對應');}ok(S().seen[n].length===src.frames.length,'全部關鍵格已看');}click('answer',t.answer);}
    $('start').click();const frozen=JSON.stringify(S());$('pause').click();ok(snap().paused,'可暫停');for(const b of $('workspace').querySelectorAll('button'))b.click();ok(JSON.stringify(S())===frozen,'暫停不改策略');$('resume').click();window.dispatchEvent(new Event('blur'));ok(snap().paused,'失焦暫停');$('resume').click();Object.defineProperty(document,'hidden',{configurable:true,value:true});try{document.dispatchEvent(new Event('visibilitychange'));ok(snap().paused,'背景暫停');}finally{delete document.hidden;}$('resume').click();
    for(let i=0;i<12;i++){
      const t=T[i];ok($('confirm').disabled,'先操作才能驗收');
      if(t.kind==='media'){
        source(t,3);finish(true,false);retry();ok(S().opened.length===0&&Object.keys(S().seen).length===0,'媒介與閱讀狀態重演清空');
        const n=branch===null?i:branch;source(t,n);const done=n===3||i===0&&n===0||i===1&&(n===1||n===2)||i===2&&n===2;finish(done,done&&n!==3);
      }
      if(t.kind==='prompt'){
        click('run');const response=$('simulated-response').textContent;click('run');ok($('simulated-response').textContent===response&&S().repeats===1,'相同資訊重問沒有假裝新增資訊');finish(false,false);retry();
        click('toggle',0);click('run');ok(!S().last.complete,'部分資訊仍不足');click('toggle',1);click('toggle',2);ok($('confirm').disabled,'改稿後舊模擬不可驗收');click('run');ok($('simulated-response').textContent===t.reply,'補關鍵資料後實際回覆改變');finish(true,true);ok(S().fuel===8,'合理補資訊後重問仍可通過');
      }
      if(t.kind==='reply'){
        t.blocks.forEach((_,n)=>click('toggle',n));click('format',2);finish(i===7,false);retry();
        t.blocks.forEach((b,n)=>{if(t.required.includes(b.key))click('toggle',n);});
        if(i===6)click('toggle',2);if(i===8)click('toggle',2);
        click('format',i===7?2:i===6?1:0);
        if(S().order.length>1){const original=$('reply-draft').textContent;click('move',[0,1]);ok($('reply-draft').textContent!==original,'順序真的改變實際文字');click('move',[1,-1]);ok($('reply-draft').textContent===original,'可調回必要順序');}
        ok($('reply-draft').textContent===TokenValueEngine.text(t,S()),'草稿不是只更新標題');finish(true,true);if(i===7)ok(S().fuel===13,'必要完整步驟可多投入，不獎勵一個好字');if(i===8)ok(S().output.includes('尚未確認'),'保留不確定性');
      }
      if(t.kind==='stop'){
        click('ask');finish(false,false);retry();
        if(t.mode==='form'){click('normal');click('empty');click('fix');ok(document.querySelectorAll('.proof-list .stale').length>=1,'修正後舊版證據顯示過期');click('diff');click('normal');click('empty');finish(true,true);}
        if(t.mode==='site'){
          for(const a of ['diff','candidate','deploy','production'])click(a);click('edit');ok(!TokenValueEngine.evaluate(t,S()),'改版失效本版驗收');ok(document.querySelectorAll('.proof-list .stale').length===4,'四種舊版證據都過期');
          for(const a of ['diff','candidate','deploy','production'])click(a);finish(true,false);ok($('feedback').textContent.includes('任務已完成'),'超範圍不冒充內容做錯');retry();for(const a of ['candidate','diff','deploy','production'])click(a);finish(true,true);
        }
        if(t.mode==='backup'){for(const a of ['backup','restore','compare','handoff'])click(a);finish(true,true);}
      }
      ok(snap().first[i].efficient===false,'重演不洗掉首次投入結果');ok(document.documentElement.scrollWidth<=innerWidth,'結算區無溢出');$('next').click();
    }
    const expect=branch===null?12:[10,10,11,9][branch],done=branch===null?12:[10,10,11,12][branch];
    ok(!$('result').hidden&&$('review').children.length===12,'完整12關回顧');ok(snap().latest.filter(r=>r.efficient).length===expect,'整輪媒介分支策略數正確');ok(snap().latest.filter(r=>r.done).length===done,'整輪任務完成數與策略分開');ok($('score').textContent.includes('最近任務完成 '+done+' / 12；合理投入 '+expect+' / 12'),'分母與結果正確');ok(snap().totalSpent===spent,'重演前投入仍計入探索累計');
    if(branch!==null)ok(!$('result-title').textContent.includes('12關有效策略完成'),'沒有假稱全關有效');
    return{checks,branch,viewport:[innerWidth,innerHeight],done,efficient:expect,explorationFuel:spent};
   },{branch});flows++;console.log(JSON.stringify({base,flow:flows,...result}));
 }
 for(const[w,h]of[[1280,850],[360,740],[740,360]])await run(w,h,null);
 await p.locator('[name="habit"]').nth(1).check();await p.locator('#reflection').fill('<script>alert("不是程式")</script>\n下次先補錯誤全文，不用把整個桌面拍影片。');
 const waiting=p.waitForEvent('download');await p.locator('#download').click();const dl=await waiting,text=fs.readFileSync(await dl.path(),'utf8');for(const expected of ['不是實際Token或帳單','<script>alert("不是程式")</script>','重問前寫下這次新增的證據或限制','正式版是否受影響尚未確認'])if(!text.includes(expected))throw Error('TXT缺少原文：'+expected);console.log('Actual TXT includes costs, completion, habit and literal free-text; no script execution');
 for(let branch=0;branch<4;branch++)await run(1280,850,branch);
 await p.evaluate(()=>{document.getElementById('restart').click();const s=TokenValueGame.snapshot();if(s.first.some(Boolean)||s.latest.some(Boolean)||s.totalSpent!==0||document.getElementById('reflection').value!==''||document.querySelector('[name="habit"]:checked'))throw Error('重開清空');});
 // Native keyboard and actual browser slider input supplement DOM-flow assertions.
 await p.locator('[data-action="open"][data-value="0"]').focus();await p.keyboard.press('Enter');await p.locator('[data-action="answer"][data-value="1"]').focus();await p.keyboard.press('Space');await p.locator('#confirm').focus();await p.keyboard.press('Enter');if(!(await p.evaluate(()=>TokenValueGame.snapshot().state.efficient)))throw Error('鍵盤驗收');await p.keyboard.press('Escape');if(!await p.locator('#overlay').isVisible())throw Error('Esc');await p.locator('#resume').focus();await p.keyboard.press('Enter');
 await p.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode()));if([...document.images].some(i=>i.naturalWidth===0))throw Error('image')});await p.setViewportSize({width:360,height:740});await p.screenshot({path:'/tmp/token-value-qa.png',fullPage:true});
 if(errors.length)throw Error(errors.join('\n'));console.log(JSON.stringify({base,completeRounds:flows,mainViewportRounds:3,allSourceBranchRounds:4,nativeKeyboard:true,pageErrors:0}));await p.close();await b.close();
})().catch(async e=>{console.error(e);process.exitCode=1;if(connected)await connected.close();});
