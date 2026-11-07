const {test}=require('node:test'),assert=require('node:assert/strict');const E=require('../science-lab-engine.js');
const near=(a,b,epsilon=1e-9)=>assert.ok(Math.abs(a-b)<epsilon,`${a} != ${b}`);
function trial(s,p={},prediction='unsure'){for(const [k,v] of Object.entries(p))assert.ok(E.setParam(s,k,v));E.predict(s,prediction);const r=E.run(s);assert.ok(r);return r;}
test('已知數值、單位轉換與物理不變量',()=>{
 near(trial(E.create('pendulum')).outputs.period,2.007089923154493);
 const ohm=trial(E.create('ohm'));near(ohm.outputs.current,60);near(ohm.outputs.power,.36);
 near(trial(E.create('solution')).outputs.concentration,20);
 const fall=trial(E.create('fall'));near(fall.outputs.time,Math.sqrt(10/9.8));near(fall.outputs.speed,Math.sqrt(98));
 for(const id of Object.keys(E.models)){const s=E.create(id);for(const p of E.models[id].params)for(const v of [p.min,p.max]){const r=trial(s,{[p.key]:v});for(const val of Object.values(r.outputs))assert.ok(Number.isFinite(val)&&val>0);}}
});
test('預期趨勢與比例、自由落體質量無關只限此模型',()=>{
 const p=E.create('pendulum'),a=trial(p,{length:.5}),b=trial(p,{length:2});near(b.outputs.period/a.outputs.period,2);
 const o=E.create('ohm'),i1=trial(o,{voltage:3,resistance:100}),i2=trial(o,{voltage:6,resistance:100});near(i2.outputs.current/i1.outputs.current,2);const i3=trial(o,{resistance:200});near(i3.outputs.current,i1.outputs.current);
 const c=E.create('solution'),c1=trial(c,{mass:10,volume:250}),c2=trial(c,{volume:500});near(c2.outputs.concentration,c1.outputs.concentration/2);
 const f=E.create('fall'),f1=trial(f,{mass:.1,height:5}),f2=trial(f,{mass:5});near(f1.outputs.time,f2.outputs.time);near(f1.outputs.speed,f2.outputs.speed);assert.match(E.models.fall.limits,/忽略空氣阻力/);
});
test('控制變因、多變因、相同設定與改到其他變因分別回報',()=>{
 const s=E.create('ohm');trial(s);trial(s,{voltage:12},'increase');let r=E.compare(s);assert.equal(r.kind,'controlled');assert.equal(r.direction,'increase');assert.equal(r.prediction,'match');assert.ok(s.completed);
 trial(s,{resistance:200});r=E.compare(s);assert.equal(r.kind,'confounded');assert.deepEqual(r.changed,['voltage','resistance']);
 E.setPair(s,1,2);E.setX(s,'resistance');assert.equal(E.compare(s).kind,'other');
 const same=trial(s,{voltage:6,resistance:100});E.setPair(s,1,same.id);assert.equal(E.compare(s).kind,'same');
 assert.equal(E.setPair(s,1,999),false);
});
test('預測綁定當時基準，換A不能回填舊預測；資料點排除混雜',()=>{
 const s=E.create('ohm');const a=trial(s),b=trial(s,{voltage:12},'increase');assert.equal(b.predictionBaselineId,a.id);assert.equal(E.compare(s).prediction,'match');
 const c=trial(s,{resistance:200},'same');E.setPair(s,b.id,c.id);assert.equal(E.compare(s).prediction,'not-linked');
 E.setPair(s,a.id,c.id);E.setX(s,'voltage');assert.deepEqual(E.plot(s).map(p=>p.id),[a.id,b.id]);
 E.setPair(s,b.id,c.id);E.setX(s,'resistance');assert.deepEqual(E.plot(s).map(p=>p.id),[b.id,c.id]);
});
test('無效輸入、步距、未預測擋住執行，回傳值與紀錄互不覆寫',()=>{
 const s=E.create('pendulum');assert.equal(E.run(s),null);for(const value of [0,2.1,1.05,NaN,Infinity,'1'])assert.equal(E.setParam(s,'length',value),false);assert.equal(E.setParam(s,'unknown',1),false);
 E.predict(s,'increase');E.setParam(s,'length',1.1);assert.equal(s.prediction,'');assert.equal(E.run(s),null);
 const r=trial(s);r.params.length=999;r.outputs.period=999;assert.equal(s.rows[0].params.length,1.1);assert.notEqual(s.rows[0].outputs.period,999);
});
test('CSV包含單位、完整精度、當時預測與基準；清除只影響目前實驗',()=>{
 const a=E.create('solution'),b=E.create('ohm');trial(a);trial(a,{volume:1000},'decrease');trial(b);const csv=E.csv(a);assert.equal(csv.trim().split('\r\n').length,3);assert.match(csv,/溶液總體積 \(mL\)/);assert.match(csv,/質量濃度 \(g\/L\)/);assert.ok(csv.includes('"2","1","減少"'));assert.match(csv,/"10","1000","10"/);
 E.clear(a);assert.equal(a.rows.length,0);assert.equal(a.seq,0);assert.equal(a.completed,false);assert.equal(b.rows.length,1);assert.equal(E.compare(a),null);assert.deepEqual(E.plot(a),[]);
});
