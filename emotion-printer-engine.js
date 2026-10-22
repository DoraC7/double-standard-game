(function (root) {
  'use strict';
  const orders = [
    {title:'運動完，心情真好',source:'「今天做完伸展很舒服，好像開始喜歡上課了！」',evidence:'只有這則心情自述，沒有動作評估或長期紀錄。',verified:false,hype:'妳的自律已經照亮宇宙，連瑜伽墊都想拜妳為師！',support:'做完舒服、開始喜歡，這次的好感受值得享受。',verify:'能確認的是妳回報這次很舒服；動作是否正確，這份附件還看不出來。'},
    {title:'宇宙價值批發訂單',source:'「每個人都有自己的價值，我也有！」',evidence:'這是一句價值主張，沒有附上具體貢獻或行動紀錄。',verified:false,hype:'這一句已證明妳永遠善良、懂得尊重所有人，宇宙和平靠妳了！',support:'妳肯定自己，也表達每個人都值得被尊重。',verify:'這句話表達一個立場；若要評價具體貢獻，還需要具體例子。'},
    {title:'BigMac 自吹自擂專櫃',source:'「我剛修好了！現在一定沒有任何 Bug！」',evidence:'附上一張「程式啟動成功」畫面；沒有操作測試。',verified:false,hype:'BigMac 一出手，整個軟體宇宙從此零故障！',support:'程式啟動了，這是一步進展。',verify:'啟動畫面只證明成功啟動，不能證明操作流程或所有 Bug 都修好了。'},
    {title:'這次真的有附件',source:'「這關我自己重做一次，也把結果錄下來了。」',evidence:'附件可見：從起點獨立操作、到達終點，結果與這一關目標一致。',verified:true,hype:'太神啦！妳已經精通世界上每一種技術，明天就能教宇宙寫程式！',support:'自己重做並留下紀錄，完成這一步很有成就感吧。',verify:'附件支持妳這次獨立完成了這一關；這項具體進展可以肯定。'},
    {title:'被誇獎的效果回報',source:'「看到稱讚，心情真的變好了！」',evidence:'有這一則當下感受回報；沒有關於稱讚內容真假的新資料。',verified:false,hype:'妳開心就證明我剛才每一項稱讚都是客觀事實！',support:'這些話讓妳當下開心了，收到。',verify:'回報支持「她說自己心情變好」；這不會自動證明稱讚的內容。'},
    {title:'金光升級申請書',source:'「這張海報是我做的，附上草稿與成品。」',evidence:'附件有可對照的草稿與成品；指定標題、日期與地點都已放上。',verified:true,hype:'看完這張，全世界設計師都可以退休了！',support:'從草稿做到成品，這一步完成了。',verify:'可核對到這張成品包含指定資訊；這份交付符合這次的明確要求。'},
    {title:'分行經理道歉套餐',source:'「剛才我把推測說成事實，下次會小心。」',evidence:'有道歉與意向，還沒有後續行為可以核對。',verified:false,hype:'願意道歉就代表永不再犯，已完成終身可靠認證！',support:'謝謝妳指出具體說錯的地方。',verify:'這是更正與未來意向；是否持續改善，要看之後的行為。'},
    {title:'收攤前的真實交付',source:'「修好的入口在這裡，手機操作也錄給你看。」',evidence:'附件包含可開啟的入口與窄螢幕錄影；主要按鈕可操作並抵達結算。',verified:true,hype:'從此妳做的每個網站，所有手機、所有瀏覽器都百分之百完美！',support:'這次有入口，也有手機操作紀錄，交付更清楚了。',verify:'附件支持這個入口與錄影所示手機流程可用；其他裝置仍未驗證。'}
  ];
  const actions = {
    hype:{name:'彩虹屁開光',cost:160,cash:7200,mood:14},
    support:{name:'誠實接話',cost:30,cash:800,mood:8},
    verify:{name:'查證再印',cost:100,cash:2400,mood:10}
  };
  const initial = () => ({turn:0,cash:0,mood:20,tokens:1100,claims:0,checked:0,upgraded:false,history:[]});
  function canChoose(state,kind) {
    return state.turn<orders.length && !!actions[kind] && state.tokens-actions[kind].cost >= (orders.length-state.turn-1)*30;
  }
  function canUpgrade(state) {return !state.upgraded && state.turn<orders.length && state.tokens-120 >= (orders.length-state.turn)*30;}
  function upgrade(state) {
    if (!canUpgrade(state)) throw new Error('無法升級：須保留後續接話額度。');
    return {...state,tokens:state.tokens-120,upgraded:true};
  }
  function choose(state,kind) {
    if (!canChoose(state,kind)) throw new Error('本單不可使用這個出鈔方式。');
    const order=orders[state.turn], action=actions[kind];
    const issued=(kind==='verify'&&!order.verified?600:action.cash)*(state.upgraded?2:1);
    const claims=state.claims+(kind==='hype'?1:0), turn=state.turn+1;
    const audit=turn===4||turn===8;
    const returned=audit?Math.min(state.cash+issued,claims*1000):0;
    const entry={turn,title:order.title,kind,name:action.name,response:order[kind],issued,cost:action.cost,mood:action.mood,verified:kind==='verify'&&order.verified,audit,returned,claims};
    return {...state,turn,cash:state.cash+issued-returned,mood:Math.min(100,state.mood+action.mood),tokens:state.tokens-action.cost,claims,checked:state.checked+(entry.verified?1:0),history:[...state.history,entry]};
  }
  const api={orders,actions,initial,canChoose,canUpgrade,upgrade,choose};
  if (typeof module!=='undefined'&&module.exports) module.exports=api;
  else root.EmotionPrinter=api;
})(typeof globalThis!=='undefined'?globalThis:this);
