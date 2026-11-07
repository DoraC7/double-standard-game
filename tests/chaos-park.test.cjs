const {test}=require('node:test'),assert=require('node:assert/strict');const E=require('../chaos-park-engine.js');
test('九區27種災情，含指定狀況與扶輪社番外',()=>{
 assert.equal(E.scenes.length,9);assert.equal(new Set(E.scenes.map(q=>q.id)).size,9);
 for(const q of E.scenes){assert.equal(q.actions.length,3);assert.equal(new Set(q.actions.map(a=>a.note)).size,3);for(const [i,a] of q.actions.entries()){assert.ok(a.label&&a.note&&a.badge&&a.extra);assert.equal(a.mess,i+1);}}
 const all=JSON.stringify(E.scenes);for(const term of ['鑰匙','油量','水','電','瓦斯','過期','份量','腦袋','定妝噴霧','化妝水','日期','扶輪社','卡通多拉'])assert.ok(all.includes(term),term);
});
test('全部27招式對應各自場面，全場可完成',()=>{
 for(let branch=0;branch<3;branch++){const s=E.create('all');for(const q of s.items){assert.equal(E.launch(s),null);assert.ok(E.select(s,branch));const r=E.launch(s);assert.equal(r.note,q.actions[branch].note);assert.equal(r.badge,q.actions[branch].badge);assert.equal(r.extra,q.actions[branch].extra);assert.ok(E.next(s));}assert.ok(s.done);assert.equal(E.stats(s).visited,9);assert.equal(E.stats(s).mess,9*(branch+1));assert.equal(E.select(s,0),false);}
});
test('重演清除目前選擇與鎖定，最近結果取代、不重複計數',()=>{
 const s=E.create();E.select(s,2);E.launch(s);const before=JSON.stringify(s);assert.equal(E.launch(s),null);assert.equal(JSON.stringify(s),before);assert.equal(E.select(s,0),false);
 assert.ok(E.replay(s));assert.equal(s.selected,null);assert.equal(s.launched,false);assert.equal(E.next(s),false);E.select(s,0);E.launch(s);assert.equal(s.records.length,1);assert.equal(E.stats(s).mess,1);assert.equal(s.records[0].choice,0);
});
test('短場100輪不重複，非法輸入不改變狀態，重開清空',()=>{
 for(let i=0;i<100;i++){const s=E.create();assert.equal(s.items.length,4);assert.equal(new Set(s.items.map(q=>q.id)).size,4);}
 const s=E.create(),before=JSON.stringify(s);for(const n of [-1,3,'0',.5,null])assert.equal(E.select(s,n),false);assert.equal(JSON.stringify(s),before);assert.equal(E.next(s),false);assert.equal(E.replay(s),false);assert.throws(()=>E.create('oops'));assert.equal(E.create().records.length,0);
});
test('食品份量段落不給用量或療效獎勵，車輛／付款與拆輪皆為道具',()=>{
 const over=E.scenes.find(q=>q.id==='overload');assert.doesNotMatch(JSON.stringify(over),/毫克|mg|每天\d|一次\d/);assert.match(over.actions[0].note,/沒有加速鍵/);
 assert.match(E.scenes.find(q=>q.id==='fuel').intro,/園內玩具車/);assert.match(E.scenes.find(q=>q.id==='bills').intro,/道具帳單/);assert.match(E.scenes.find(q=>q.id==='rotary').actions[0].note,/可拆式舞台輪子/);
});

test('地圖單區直接進入指定場景',()=>{for(const q of E.scenes){const s=E.create(q.id);assert.equal(s.items.length,1);assert.equal(s.items[0].id,q.id);E.select(s,0);E.launch(s);E.next(s);assert.ok(s.done);}});
