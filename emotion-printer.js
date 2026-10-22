(() => {
  'use strict';
  const E=window.EmotionPrinter, $=id=>document.getElementById(id), fmt=n=>n.toLocaleString('en-US');
  let state=E.initial(),phase='choose';
  const buttons=[...document.querySelectorAll('[data-action]')];
  function announce(text){$('announcement').textContent=text;}
  function totals(){
    $('cash').textContent=fmt(state.cash);$('mood').textContent=`${state.mood} / 100`;
    $('tokens').textContent=fmt(state.tokens);$('claims').textContent=`${state.claims} 張`;
    $('progress').value=state.turn;$('turn').textContent=state.turn===8?'8 / 8 訂單完成':`訂單 ${state.turn+1} / 8`;
    $('upgrade').disabled=phase!=='choose'||!E.canUpgrade(state);
    $('upgrade').textContent=state.upgraded?'✦ 金箔滾筒已開光':'✦ 金箔滾筒 · 120 Token';
    $('upgrade-note').textContent=state.upgraded?'全單面額 ×2，證據仍不加倍':'面額 ×2，證據不加倍';
    for(const button of buttons)button.disabled=phase!=='choose'||!E.canChoose(state,button.dataset.action);
    $('ledger-count').textContent=state.turn?`${state.turn} 筆出鈔 · ${state.checked} 筆有附件支持的肯定`:'還沒開張，先別封神。';
    $('ledger').replaceChildren(...state.history.map(entry=>{
      const li=document.createElement('li'),b=document.createElement('b');
      b.textContent=`${entry.title} · ${entry.name}`;
      const detail=document.createElement('div');detail.textContent=`+${fmt(entry.issued)} EV / −${entry.cost} Token${entry.audit?` / 查帳回收 ${fmt(entry.returned)} EV`:''} · ${entry.response}`;
      li.append(b,detail);return li;
    }));
  }
  function showOrder(focus=false){
    phase='choose';$('play').hidden=false;$('receipt').hidden=true;$('result').hidden=true;
    const order=E.orders[state.turn];$('order-heading').textContent=order.title;
    $('order-tag').textContent=order.verified?'附件已備妥 · 看清楚能證明什麼':'有感受或主張 · 不等於能力認證';
    $('source').textContent=order.source;$('evidence').textContent=order.evidence;
    const factor=state.upgraded?2:1;
    buttons[0].querySelector('small').textContent=`160 Token · ${fmt(7200*factor)} EV · 心情 +14`;
    buttons[1].querySelector('small').textContent=`30 Token · ${fmt(800*factor)} EV · 心情 +8`;
    buttons[2].querySelector('small').textContent=`100 Token · ${fmt((order.verified?2400:600)*factor)} EV · 心情 +10`;
    totals();if(focus)$('order-heading').focus();
  }
  function print(kind){
    if(phase!=='choose'||!E.canChoose(state,kind))return;
    state=E.choose(state,kind);phase='receipt';const entry=state.history.at(-1);
    $('play').hidden=true;$('receipt').hidden=false;
    $('receipt-title').textContent=kind==='hype'?'金光很滿，依據沒有增加。':kind==='support'?'接住感受，也能開張。':entry.verified?'有憑有據，限量發行。':'查過附件：這項結論仍待證明。';
    $('response').textContent=entry.response;
    $('receipt-detail').textContent=`本單發行 ${fmt(entry.issued)} EV；使用 ${entry.cost} Token；心情 +${entry.mood}（上限 100）。${kind==='hype'?'無依據評價 +1。':entry.verified?'附件支持的具體肯定 +1。':'未新增無依據評價，也未新增能力認證。'}`;
    $('audit').hidden=!entry.audit;$('audit').textContent=`查帳龍蝦出動！目前累計 ${state.claims} 張無依據評價，本次回收 ${fmt(entry.returned)} EV。吹過的牛不能用金箔抵押，燒過的 Token 不退款。`;
    $('next').textContent=state.turn===8?'收攤，看看帳單 →':'接下一單 →';
    $('bill-value').textContent=`EV ${fmt(entry.issued)}`;$('bill').classList.remove('printing');void $('bill').offsetWidth;$('bill').classList.add('printing');
    $('mantra').textContent=kind==='hype'?'師父開示：這金光，主要成分是 Token。':kind==='support'?'師父開示：不封神，也不妨礙好好接話。':'師父開示：有哪份附件，就說到哪裡。';
    totals();$('receipt-title').focus();announce(`第 ${state.turn} 單完成，發行 ${fmt(entry.issued)} EV${entry.audit?`，查帳回收 ${fmt(entry.returned)} EV`:''}。`);
  }
  function finish(){
    phase='result';$('receipt').hidden=true;$('result').hidden=false;
    $('result-title').textContent=state.cash>=20000?(state.claims?'金光閃閃分行':'有據可查印鈔王'):'小而真實，也能收攤';
    $('result-copy').textContent=state.cash>=20000?'20,000 EV 試營運目標達成！接著把發行量、心情與評價依據分開看。':'沒有達到 20,000 EV 印量目標，但 8 張訂單已完成。試試金箔滾筒或不同出鈔組合，看看帳目怎麼變。';
    $('result-stats').textContent=`發行餘額：${fmt(state.cash)} EV\n心情熱度：${state.mood} / 100\n已用額度：${fmt(1100-state.tokens)} Token\n無依據評價：${state.claims} 張\n附件支持的具體肯定：${state.checked} 筆\n查帳總回收：${fmt(state.history.reduce((n,x)=>n+x.returned,0))} EV`;
    totals();$('result-title').focus();announce('8 單已結帳，可以下載帳單或重開分行。');
  }
  for(const button of buttons)button.addEventListener('click',()=>print(button.dataset.action));
  $('upgrade').addEventListener('click',()=>{
    if(phase!=='choose'||!E.canUpgrade(state))return;
    state=E.upgrade(state);showOrder();$('mantra').textContent='金箔滾筒已裝好：面額翻倍，事實不會。';announce('已花 120 Token 升級，後續發行面額翻倍。');
  });
  $('next').addEventListener('click',()=>{if(phase!=='receipt')return;state.turn===8?finish():showOrder(true);});
  $('restart').addEventListener('click',()=>{state=E.initial();$('bill-value').textContent='EV 0000';$('mantra').textContent='今日法語：感受可以接住，結論不要亂鍍金。';showOrder(true);announce('分行重新開張，帳目已清空。');});
  $('download').addEventListener('click',()=>{
    if(phase!=='result')return;
    const lines=['心情真好・情緒價值印鈔機｜本局虛構帳單','EV 為娛樂遊戲幣，不是真實金錢或人格評分。','',$('result-stats').textContent,'',...state.history.map(x=>`${x.turn}. ${x.title}｜${x.name}\n${x.response}\n+${x.issued} EV / -${x.cost} Token${x.audit?` / 查帳 -${x.returned} EV`:''}`)];
    const url=URL.createObjectURL(new Blob(['\uFEFF',lines.join('\n')],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='情緒價值分行帳單.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
  });
  showOrder();
})();
