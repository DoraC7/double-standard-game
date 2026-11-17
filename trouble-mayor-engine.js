(function(root){
'use strict';
const cases=[
 {id:'feed',title:'第一案｜小螃蟹豪華服務處',goal:'用現有工具交出一份可用的辦事清單。',brief:'幕僚提醒：先用小方案完成一次任務，再評估是否擴充。市長看著豪華控制台：「可是這個看起來比較有未來！」',warning:'A 用現有工具，需3格工作、2枚市政幣；B 全新控制台需4格、5枚。兩者都能交清單，B 不會自動替你寫。',a:3,b:4,helper:0,newNeed:false},
 {id:'fountain',title:'第二案｜心情噴泉與辦事窗口',goal:'完成分類、實作、驗收三格，讓市民能找到辦事窗口。',brief:'市長已說好先做 A 版索引。心情噴泉很好聊，B 版全息迎賓也很好看。只是今天下班前，市民還需要那份索引。',warning:'抒發可以提供支持，但不會自動產生索引。A 需3格、2枚；B 需4格、5枚，換版必須重做。幕僚本期沒有空檔。',a:3,b:4,helper:0,newNeed:false},
 {id:'bridge',title:'第三案｜縫合許願市',goal:'交出可供讀屏軟體使用的公車資訊頁。',brief:'原先約定 A 圖片版。先試作一格，再開現場報告：這次會不會真的有理由換 B？「繞遠路就是走捷徑！」仍然不能代替測試。',warning:'A 圖片版需3格、2枚；B 文字版需3格、5枚。新現場報告要先試作1格才看得到；幕僚僅在確有需求且新版已確認時，可協助1格。',a:3,b:3,helper:1,newNeed:true}
];
function create(id){const scene=cases.find(c=>c.id===id);if(!scene)throw Error('未知案件');return {id,plan:null,pending:false,read:false,evidence:false,progress:0,spent:0,turn:0,max:9,work:0,wasted:0,detours:0,talks:0,helperUsed:false,status:'playing',log:[],last:'歡迎就職！政見很多，交付欄還是空的。'};}
function need(s){const c=cases.find(c=>c.id===s.id);return s.plan==='B'?c.b:c.a;}
function record(s,line){s.last=line;s.log.push(line);}
function availability(s){const c=cases.find(c=>c.id===s.id);return {inspect:!s.read,report:c.newNeed&&!s.evidence&&s.progress>=1,A:s.pending||s.plan!=='A',B:!s.pending&&s.plan!=='B',agree:s.pending,work:!!s.plan&&!s.pending&&s.progress<need(s),ask:!!s.plan&&!s.pending&&!s.helperUsed&&s.progress<need(s),vent:true,detour:true,deliver:!!s.plan&&!s.pending};}
function act(s,key){if(s.status!=='playing'||!availability(s)[key])return false;const c=cases.find(c=>c.id===s.id);
 if(key==='inspect'){s.read=true;record(s,'事前提醒已打開：'+c.warning);return true;}
 if(key==='report'){s.evidence=true;record(s,'新證據：讀屏軟體無法取得 A 圖片中的班次。B 文字版能滿足需求；這不是單純想換新玩具。');return true;}
 s.turn++;
 if(key==='A'){
  if(s.plan==='A'&&s.pending){s.pending=false;record(s,'B 提案撤回，維持已確認的 A。既有進度和預算不重算；本次討論使用1回合。');}
  else {if(s.plan){s.wasted+=s.progress;s.progress=0;}s.plan='A';s.pending=false;s.spent+=2;record(s,'A 方案已確認。交付範圍不變，先做可用版本。'+(s.wasted?'舊版實作保留在重做帳本，不會憑空消失。':''));}
 }else if(key==='B'){s.pending=true;record(s,'市長提出 B 許願案：「小改一下！」目前只是提案，尚未換版、沒有替幕僚排工作。');
 }else if(key==='agree'){s.wasted+=s.progress;s.progress=0;s.plan='B';s.pending=false;s.spent+=5;record(s,'新版 B 確認，自行承擔實作。前版工作轉入重做帳本，重新起算；幫忙仍須另外詢問。');
 }else if(key==='work'){s.progress++;s.work++;record(s,'實際完成第'+s.progress+'／'+need(s)+'格：'+(['分類與試作','內容實作','測試與修正','新版整合測試'][s.progress-1])+ '。這次不是只把「進行中」改成「非常進行中」。');
 }else if(key==='ask'){
  if(c.helper&&s.evidence&&s.plan==='B'){s.helperUsed=true;if(s.progress<need(s)){s.progress++;s.work++;}record(s,'幕僚明確同意協助1格，已完成並留下結果。這不是市長一按送出就自動接案。');}
  else record(s,'幕僚回覆：「本次無法協助，請自行處理或維持原案。」商量已收到，不代表承接。進度不變。');
 }else if(key==='vent'){s.talks++;record(s,'心情噴泉：「我有聽到，反覆調整真的會煩。」獲得陪伴，本回合技術進度＋0；抒發不算交付，也不是做錯事。');
 }else if(key==='detour'){s.detours++;s.spent++;record(s,'多拉洋市長宣布：「繞遠路就是走捷徑！」剪綵一座繞路紀念碑，市政幣－1，工單進度＋0。');
 }else if(key==='deliver'){
  const missing=[];if(!s.read)missing.push('尚未看過事前提醒');if(s.progress<need(s))missing.push('工作還缺'+(need(s)-s.progress)+'格');if(c.newNeed&&!s.evidence)missing.push('尚未開啟現場報告');if(c.newNeed&&s.evidence&&s.plan!=='B')missing.push('A 圖片版仍無法讀屏');if(s.spent>12)missing.push('超過12枚市政預算');
  if(missing.length){record(s,'驗收未過：'+missing.join('、')+'。口號沒有自動補齊缺項，仍可在任期內修正。');}
  else{s.status='won';record(s,'驗收通過！'+(s.plan==='B'&&c.newNeed?'有新證據、確認新版、完成實作，這次換 B 有交代理由。':'辦事清單已可使用，市長終於剪到真正有用的綵。'));return true;}
 }
 if(s.turn>=s.max){s.status='lost';record(s,'任期用完！'+s.last+' 尚未取得驗收通過；可以重選路線，首次結果會保留。');}
 return true;
}
function snapshot(s){return JSON.parse(JSON.stringify(s));}
const api={cases,create,act,need,availability,snapshot};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TroubleMayor=api;
})(typeof globalThis!=='undefined'?globalThis:this);
