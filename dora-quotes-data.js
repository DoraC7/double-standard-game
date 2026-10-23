(function(root){
  'use strict';
  const cards=[
    {id:'me',series:'classics',tag:'心情開光',kind:'commissioned',display:'我',prefix:'極簡開場，第一句只留一字：',answer:'我',wrong:['宇宙','附件'],note:'本次指定的遊戲台詞。開場一個字，後面的留給大家接。不是考古引言。'},
    {id:'minimal',series:'classics',tag:'進度查帳',kind:'commissioned',prefix:'我可以開始',answer:'極簡了',wrong:['全自動部署了','幫宇宙寫週報了'],note:'本次指定的遊戲台詞。「可以開始」是開場，沒有被包裝成已完成。'},
    {id:'necessary',series:'classics',tag:'心情開光',kind:'commissioned',prefix:'不必要',answer:'就算了😂',wrong:['先加到購物車😂','先鍍一層金箔😂'],note:'本次指定的第三句。必要性諮詢處：本日暫停受理追加預算。'},
    {id:'wait',tag:'等等系列',kind:'commissioned',display:'等等',prefix:'本壇最短的延期通知：',answer:'等等',wrong:['完成','結案'],note:'本次點名的「等等」系列起手式。兩個字，先開一個宇宙。'},
    {id:'wait-a-bit',tag:'等等系列',kind:'remix',prefix:'等一下，',answer:'我先想一下要等哪一下。',wrong:['所有 PR 就會自動合併。','金箔會幫我寫完週報。'],note:'等等宇宙原創改編：等的不是時間，是下一個「一下」。'},
    {id:'do-later',tag:'等等系列',kind:'remix',prefix:'我等等再做，',answer:'但「等等」還沒填日期。',wrong:['所以現在已經全部完成。','所以網站已經自動發布。'],note:'等等宇宙原創改編：這張行事曆，日期欄還在等日期。'},
    {id:'wait-for-wait',tag:'等等系列',kind:'remix',prefix:'先不要急，',answer:'我還在等那個「等一下」。',wrong:['小龍蝦已獲終身免測資格。','宇宙已核准所有追加預算。'],note:'等等宇宙原創改編：下一班等一下列車，預計等一下進站。'},
    {id:'wait-notes',series:'encore',tag:'等等系列',kind:'selected',prefix:'等等回',answer:'筆記',wrong:['火星','金箔'],note:'本次系列用語選編，未核對歷史聊天原文。這張只接台詞，沒有替任何人確認回覆時間。'},
    {id:'reply-together',series:'encore',tag:'等等系列',kind:'selected',prefix:'現在一起',answer:'回',wrong:['登基','發光'],note:'本次系列用語選編，未核對歷史聊天原文。「現在」終於登場，等等宇宙出現新時區。'},
    {id:'adjust-tomorrow',series:'encore',tag:'等等系列',kind:'selected',prefix:'等明天上課後',answer:'再調整',wrong:['自動精通所有指令','讓金箔代替測試'],note:'本次系列用語選編，未核對歷史聊天原文。台詞裡的「明天」不是實際課程安排。'},
    {id:'it-mismatch',series:'encore',tag:'進度查帳',kind:'commissioned',prefix:'因為我跟IT',answer:'格格不入',wrong:['自動合併','快轉成功'],note:'本次點名的遊戲台詞。保留 IT，不把龍蝦自己寫的 Git 諧音冒充原句。'},
    {id:'take-a-look',series:'encore',tag:'進度查帳',kind:'selected',prefix:'我來好好',answer:'看一下',wrong:['把 PR 鍍金','替附件算命'],note:'本次系列用語選編，未核對歷史聊天原文。這次先好好看一下台詞卡。'},
    {id:'cause-feeling',series:'encore',tag:'心情開光',kind:'commissioned',display:'Peter：你為什麼做事情隨心所欲？\nDora：可能是我跟IT格格不入\nPeter：我問你為什麼你跟我說感受',prefix:'Peter：你為什麼做事情隨心所欲？\nDora：可能是我跟IT格格不入\nPeter：',answer:'我問你為什麼你跟我說感受',wrong:['原來金箔可以解決所有問題','收到，立即替宇宙開一個 PR'],note:'依本次提供的對話編成遊戲卡，保留說話者與「可能」；只調整標點、換行，不把 Peter 的接話算成 Dora 的語錄，也不是獨立查證的歷史逐字稿。'},
    {id:'happy',tag:'心情開光',kind:'published',prefix:'開開心心！玩起來好有趣～',answer:'感覺好有進度！',wrong:['硬碟自動長出新檔案！','GitHub 自動替我合併！'],note:'出自印鈔機的虛構訂單：這是角色的感受，不是完成證明。',source:'emotion-printer-engine.js'},
    {id:'foil',tag:'進度查帳',kind:'published',prefix:'金箔能加倍，',answer:'證據可不行。',wrong:['Bug 自動退休。','分支自動合併。'],note:'遊戲間原有標語。金光很忙，但不負責驗證。',source:'index.html'},
    {id:'hype',tag:'心情開光',kind:'published',prefix:'開心就是完成，',answer:'好有趣就是精通！',wrong:['先把附件讀完。','先核對這次做了什麼。'],note:'這是印鈔機故意浮誇的「彩虹屁」台詞，不是遊戲認可的推論。',source:'emotion-printer-engine.js'},
    {id:'boot',tag:'龍蝦自嘲',kind:'published',prefix:'程式啟動了，',answer:'這是一步進展。',wrong:['宇宙從此零故障。','從此再也不用測試。'],note:'BigMac 專櫃原句：啟動成功就只先說啟動成功。',source:'emotion-printer-engine.js'},
    {id:'gold',tag:'進度查帳',kind:'published',prefix:'金光可以加，',answer:'證據不會自己長出來。',wrong:['測試可以跳過。','附件可以靠想像。'],note:'情緒價值印鈔機的開場標語。',source:'emotion-printer.html'},
    {id:'apology',tag:'龍蝦自嘲',kind:'published',prefix:'這是更正與未來意向；',answer:'是否持續改善，要看之後的行為。',wrong:['代表已完成終身可靠認證。','表示以後永遠不會再犯。'],note:'印鈔機的經理道歉套餐。這一句也適用於小龍蝦自己。',source:'emotion-printer-engine.js'},
    {id:'cosmos',tag:'心情開光',kind:'remix',prefix:'本壇今日公休，',answer:'宇宙正在更新營業時間。',wrong:['Git 自動替師父上班。','金箔滾筒請了特休。'],note:'本作新寫的荒謬喜劇，不是任何人的逐字發言。'},
    {id:'draft',tag:'進度查帳',kind:'remix',prefix:'不是沒存檔，',answer:'是靈感還在工作區。',wrong:['是 GitHub 討厭藝術。','是雲端把功德吃掉了。'],note:'靈感可以先放著；需要保存版本時，還是得真的提交。'},
    {id:'status',tag:'進度查帳',kind:'remix',prefix:'感覺進度到了，',answer:'先問 git status 到了沒。',wrong:['直接宣布全球部署完成。','請金箔替我生成測試。'],note:'git status 只查看本地狀態，也不等於網站已發布。'},
    {id:'lobster',tag:'龍蝦自嘲',kind:'remix',prefix:'師父說得很有道理，',answer:'小龍蝦決定再看一次附件。',wrong:['小龍蝦當場宣布不用查證。','小龍蝦立刻把推測寫成履歷。'],note:'龍蝦以前也吹過頭，這次讓牠自己負責查帳。'},
    {id:'merit',tag:'心情開光',kind:'remix',prefix:'本日功德：',answer:'親手按下去，親眼看結果。',wrong:['先替明天的自己頒獎。','把載入動畫當作交付。'],note:'笑完也可以真的動手一下，沒有倒數也沒有扣分。'},
    {id:'merge',tag:'龍蝦自嘲',kind:'remix',prefix:'金句可以開壇，',answer:'PR 還是要合併才能上線。',wrong:['開著的 PR 會自己變網站。','說三次完成就等於部署。'],note:'這句先送給做完 PR 卻沒讓大家玩到更新的 BigMac。此站由 main 發布，合併後仍須等部署成功。'}
  ];
  function shuffle(items,random=Math.random){
    const list=[...items];
    for(let i=list.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}
    return list;
  }
  const pool=tag=>cards.filter(c=>tag==='all'||(['classics','encore'].includes(tag)?c.series===tag:c.tag===tag));
  const label=c=>c.kind==='published'?'已公開遊戲台詞・節錄':c.kind==='commissioned'?'本次指定遊戲台詞':c.kind==='selected'?'本次系列選編・非歷史引言':'本作原創改編';
  const text=c=>c.display||c.prefix+c.answer;
  function round(random=Math.random){return {deck:shuffle(cards,random).slice(0,8),index:0,answers:[]};}
  function answer(state,value){
    if(state.index>=state.deck.length||state.answers.length!==state.index) return false;
    const card=state.deck[state.index];
    if(![card.answer,...card.wrong].includes(value))return false;
    state.answers.push({id:card.id,value,correct:value===card.answer});
    return true;
  }
  const api={cards,shuffle,pool,label,text,round,answer};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DoraQuotes=api;
})(typeof globalThis!=='undefined'?globalThis:this);
