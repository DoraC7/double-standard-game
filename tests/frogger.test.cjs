const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function boot(){
 const ctx=new Proxy({}, {get:()=>()=>{}}),els={};
 const el=id=>els[id]??={hidden:true,textContent:'',addEventListener(){},focus(){},getContext:()=>ctx,width:540,height:660};
 const sandbox={document:{getElementById:el,addEventListener(){},querySelectorAll:()=>[]},performance:{now:()=>0},setTimeout:()=>0,clearTimeout(){},requestAnimationFrame:()=>1,cancelAnimationFrame(){}};
 // Expose closure only in this test VM; the shipped game has no debug setters.
 const src=fs.readFileSync(path.join(__dirname,'../frogger.js'),'utf8').replace(/\}\)\(\);\s*$/, 'globalThis.qa={start,update,move,pause,resume,setFrog:(x,y)=>frog={x,y},state:()=>({frog:{...frog},lives,homes:[...homesDone],ended,paused})};})();');
 vm.runInNewContext(src,sandbox);sandbox.qa.start();return {q:sandbox.qa,els};
}
test('浮木漂移後仍能進入對準的家',()=>{
 const {q}=boot();q.setFrog(4,9);q.update(.016);
 const x=q.state().frog.x;assert.notEqual(x,4);q.setFrog(x,1);q.move(0,-1);
 assert.equal(q.state().homes[0],4);assert.equal(q.state().lives,3);
});
test('家門範圍內可回家，空隙與已住的家仍扣命',()=>{
 for(const [x,ok] of [[.2,true],[1.67,true],[2.33,true],[4,true],[8.3,true],[2.35,false],[1,false],[7,false]]){
  const {q}=boot();q.setFrog(x,1);q.move(0,-1);
  assert.equal(q.state().homes.length,ok?1:0,`x=${x}`);assert.equal(q.state().lives,ok?3:2);
 }
 const {q}=boot();q.setFrog(4.2,1);q.move(0,-1);q.setFrog(3.8,1);q.move(0,-1);
 assert.equal(q.state().homes.length,1);assert.equal(q.state().lives,2);
});
test('五個家都接受小數位置並完成，重玩清空結果',()=>{
 const {q,els}=boot();for(const x of [0,2,4,6,8]){q.setFrog(x+.2,1);q.move(0,-1);}
 assert.equal(q.state().homes.length,5);assert.equal(q.state().ended,true);assert.equal(els.result.hidden,false);
 q.start();assert.equal(q.state().homes.length,0);assert.equal(q.state().lives,3);assert.equal(q.state().ended,false);
});
test('暫停擋住輸入，失敗可重新開始',()=>{
 const {q,els}=boot();q.pause();const before=JSON.stringify(q.state());q.move(0,-1);assert.equal(JSON.stringify(q.state()),before);
 q.resume();q.move(1,0);assert.equal(q.state().frog.x,5);
 for(let i=0;i<3;i++){q.setFrog(1,1);q.move(0,-1);}
 assert.equal(q.state().lives,0);assert.equal(els.overlay.hidden,false);q.start();assert.equal(q.state().lives,3);
});
