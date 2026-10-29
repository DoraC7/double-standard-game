const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'arcade-fx.js'),'utf8');
function boot({reduce=false,legacy=false,canAnimate=true}={}) {
 const listeners={},observers=[],animations=[],children=[];
 const node=(data={})=>{
  const classes=new Set();
  const el={textContent:'',dataset:data,style:{},attrs:{},listeners:{},visible:true,disabled:false,
   classList:{contains:k=>classes.has(k),toggle(k,force){if(force)classes.add(k);else classes.delete(k);}},
   getClientRects(){return this.visible?[{}]:[];},getBoundingClientRect:()=>({left:30,top:40,bottom:120,width:80,height:80}),
   setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,fn){this.listeners[k]=fn;},
   append(...els){children.push(...els);},remove(){this.removed=true;},matches:()=>false};
  if(canAnimate)el.animate=(frames,options)=>{const a={frames,options,cancelled:false,cancel(){this.cancelled=true;this.oncancel?.();}};animations.push(a);return a;};
  return el;
 };
 const body=node(),result=node({fx:'finish'});result.visible=false;
 const setting={matches:reduce,addEventListener:(k,fn)=>listeners.motion=fn};
 const document={readyState:'complete',body,hidden:false,querySelectorAll:q=>q==='[data-fx]'?[result]:[],getElementById:id=>legacy&&id==='motion-toggle'?{}:null,createElement:()=>node(),addEventListener:(k,fn)=>listeners[k]=fn};
 vm.runInNewContext(source,{document,window:{addEventListener:(k,fn)=>listeners[k]=fn},matchMedia:()=>setting,innerHeight:800,innerWidth:400,getComputedStyle:()=>({visibility:'visible'}),MutationObserver:class{constructor(fn){this.fn=fn;}observe(el,options){observers.push({el,options,fn:this.fn});}}});
 const change=()=>observers.find(o=>o.el===result).fn();
 const toggle=()=>children.find(c=>c.className==='arcade-fx-tools') && children.find(c=>c.className==='arcade-fx-toggle');
 return {document,body,result,setting,listeners,observers,animations,children,change,toggle};
}
test('all games and lobby load local effects without modifying game scripts',()=>{
 const lobby=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const pages=['index.html',...[...lobby.matchAll(/<a class="card" href="([^"]+)"/g)].map(m=>m[1])];
 assert.equal(pages.length,29);
 for(const file of pages){const html=fs.readFileSync(path.join(root,file),'utf8');assert.match(html,/href="arcade-fx.css\?v=/,file);assert.match(html,/src="arcade-fx.js\?v=/,file);assert.match(html,/data-fx=/,file);}
});
test('completion celebrates once on appearance, not on subsequent result text changes',()=>{
 const app=boot();app.result.visible=true;app.result.textContent='完成';app.change();
 assert.equal(app.animations.length,13);
 app.result.textContent='完成本輪';app.change();assert.equal(app.animations.length,14);
 assert.equal(app.animations[0].cancelled,true);
 app.result.visible=false;app.change();app.result.visible=true;app.change();assert.equal(app.animations.length,27);
});
test('reduced motion still reveals content but creates no decorative animations',()=>{
 const app=boot({reduce:true});app.result.visible=true;app.result.textContent='完成';app.change();
 assert.equal(app.result.visible,true);assert.equal(app.animations.length,0);assert.equal(app.toggle().disabled,true);
});
test('turning off animations immediately cancels effects and never hides result content',()=>{
 const app=boot();app.result.visible=true;app.result.textContent='完成';app.change();
 app.toggle().listeners.click();assert.equal(app.body.classList.contains('arcade-still'),true);
 assert.ok(app.animations.every(a=>a.cancelled));assert.equal(app.result.visible,true);
 const count=app.animations.length;app.result.textContent='新結果';app.change();assert.equal(app.animations.length,count);
 app.toggle().listeners.click();app.result.textContent='再試一次';app.change();assert.equal(app.animations.length,count+1);
});
test('switching system preference or hiding the tab cancels live animations',()=>{
 for(const event of ['motion','visibilitychange']){const app=boot();app.result.visible=true;app.result.textContent='完成';app.change();if(event==='motion')app.setting.matches=true;else app.document.hidden=true;app.listeners[event]();assert.ok(app.animations.every(a=>a.cancelled));}
});
test('legacy double-standard motion switch stays authoritative without a second switch',()=>{
 const app=boot({legacy:true});assert.equal(app.toggle(),undefined);app.body.classList.toggle('no-motion',true);
 app.result.visible=true;app.result.textContent='完成';app.change();assert.equal(app.animations.length,0);
});
test('old browsers without Web Animations keep usable results and no orphan particles',()=>{
 const app=boot({canAnimate:false});app.result.visible=true;app.result.textContent='完成';assert.doesNotThrow(app.change);assert.equal(app.children.filter(x=>x.className==='arcade-fx-bit').length,0);
});
