(function(root){'use strict';
const decisions={legit:'正常：從已確認的入口處理',scam:'有風險證據：拒絕並通報',hold:'資料還不足：暫停並另行查證'};
const remedies={none:'尚未操作：先停下；可疑訊息保留證據並由原管道通報，正常通知從確認入口辦理',clicked:'只點開：關閉可疑頁，不再下載或輸入；若有下載、安裝或異常，改按實際暴露狀況求助',password:'已交密碼：從官方入口改密碼、檢查登入與終止不明工作階段；其他共用密碼也要更換，啟用多因素驗證',otp:'已交驗證碼：立即從官方管道聯絡該服務，檢查帳號與交易並處理不明登入；改密碼不能代替通報',grant:'已授權：到官方帳號頁撤銷不明應用程式權限，檢查活動與已發送內容，必要時依官方流程復原',payment:'已付款／交卡片資料：立即聯絡銀行或付款機構處理止付與卡片風險，保留紀錄並向警方／165求助',dismiss:'不管交出了什麼，只刪掉訊息就算完成'};
function expected(s,route){const r=s.routes.find(x=>x.id===route);return r?.sufficient?s.outcome:'hold';}
function judge(s,route,decision,remedy){if(!s.routes.some(r=>r.id===route)||!decisions[decision]||!remedies[remedy])return {ready:false,pass:false,why:'先選一種查證方式、判斷與符合實際操作的下一步。'};const answer=expected(s,route),decisionOK=decision===answer,remedyOK=remedy===s.exposure;return {ready:true,pass:decisionOK&&remedyOK,decisionOK,remedyOK,answer,resolved:decisionOK&&remedyOK&&s.routes.find(r=>r.id===route).sufficient,why:(answer==='hold'?'這次查證仍不足，不能把對方的自稱當成獨立確認。':s.outcome==='legit'?'你取得的獨立紀錄支持這是正常通知，不必把所有訊息都當詐騙。':'你取得的獨立紀錄支持停止這個高風險要求，保留證據並通報；不必先證明對方的犯罪意圖。')+' '+(remedyOK?'下一步符合實際暴露情況。':'下一步要依「已做了什麼」處理；只刪信不會撤銷授權、交易或外洩的憑證。')};}
const api={decisions,remedies,expected,judge};if(typeof module!=='undefined')module.exports=api;else root.SafetyEngine=api;
})(globalThis);
