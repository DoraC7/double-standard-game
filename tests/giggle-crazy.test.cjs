const {test}=require('node:test'),assert=require('node:assert/strict');const E=require('../giggle-crazy-engine.js'),Art=require('../giggle-crazy-art.js');
test('12顆怪東西、36反應與本機插圖，三句台詞完全保留',()=>{
 assert.equal(E.items.length,12);assert.equal(new Set(E.items.map(i=>i.id)).size,12);assert.deepEqual(E.reactions.map(r=>r.label),['好好玩','好有趣','看起來很好吃']);
 const texts=[];for(const item of E.items){assert.equal(item.reactions.length,3);for(const text of item.reactions){assert.ok(text.length>10);texts.push(text);}assert.match(Art.markup(item.id),/^<svg/);}assert.equal(new Set(texts).size,36);assert.throws(()=>Art.markup('missing'));
});
test('三種反應都能完成整輪，沒有正解或錯誤分支',()=>{
 for(let choice=0;choice<3;choice++){const s=E.create('all');for(const item of s.items){assert.equal(E.next(s),false);const r=E.react(s,choice);assert.equal(r.text,item.reactions[choice]);assert.equal(r.reaction,choice);assert.ok(E.next(s));}assert.ok(s.done);assert.equal(s.records.length,12);assert.equal(E.counts(s)[choice],12);assert.equal(E.react(s,choice),null);}
});
test('切換反應不多算笑泡泡，戳戳不會代替選反應',()=>{
 const s=E.create();assert.ok(E.poke(s));assert.equal(s.pokes,1);assert.equal(E.next(s),false);
 E.react(s,0);E.react(s,1);E.react(s,2);assert.equal(s.records.length,1);assert.deepEqual(E.counts(s),[0,0,1]);assert.equal(s.records[0].text,s.items[0].reactions[2]);E.next(s);assert.equal(s.records[1],undefined);
});
test('短場與完整場不重複、重開清空、無效輸入不改狀態',()=>{
 for(let i=0;i<100;i++){const s=E.create();assert.equal(s.items.length,4);assert.equal(new Set(s.items.map(q=>q.id)).size,4);}
 const s=E.create('all'),before=JSON.stringify(s);for(const n of [-1,3,'0',.5,null])assert.equal(E.react(s,n),null);assert.equal(JSON.stringify(s),before);assert.throws(()=>E.create('other'));assert.equal(E.create().pokes,0);assert.equal(E.create().records.length,0);
});
test('純傻笑畫面沒有判分解析、答錯標籤或嚴肅教學',()=>{
 const fs=require('node:fs'),path=require('node:path');const html=fs.readFileSync(path.join(__dirname,'../giggle-crazy.html'),'utf8');
 assert.doesNotMatch(html,/正確答案|答錯|因果|證據|待複習|能力評鑑/);assert.match(html,/戳戳怪東西/);
});
