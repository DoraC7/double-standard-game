const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const markup=[...html.matchAll(/<a class="card"[^>]*>[\s\S]*?<\/a>/g)].map(m=>m[0]);
const attr=(text,key)=>text.match(new RegExp(`${key}="([^"]*)"`))?.[1];
const categories=[...html.matchAll(/data-filter="([^"]+)"/g)].map(m=>m[1]);
function node(){return {textContent:'',hidden:false,dataset:{},style:{},attrs:{},listeners:{},classList:{toggle(){},add(){},remove(){}},setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k];},addEventListener(k,f){this.listeners[k]=f;},replaceChildren(...items){this.children=items;}};}
function boot({extra=false,dialogAPI=true}={}){
 const cards=(extra?[...markup,markup[0]]:markup).map(m=>{const n=node();n.dataset.tags=attr(m,'data-tags');n.attrs.href=attr(m,'href');const title={textContent:m.match(/<h3>(.*?)<\/h3>/)[1]};const image=node();image.attrs.src=attr(m,'src');n.querySelector=q=>q==='h3'?title:q==='.art img'?image:{textContent:'description'};n.querySelectorAll=()=>[{textContent:'meta'}];return n;});
 const buttons=categories.map(filter=>Object.assign(node(),{dataset:{filter}}));
 const ids=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],node()]));
 if(dialogAPI){ids['pick-dialog'].showModal=()=>{};ids['pick-dialog'].close=()=>{};}
 const context={document:{querySelectorAll:q=>q==='.card'?cards:buttons,getElementById:id=>ids[id],createElement:node},window:{location:{}},getComputedStyle:()=>({backgroundColor:'green'}),Math};
 vm.runInNewContext(scripts.at(-1),context);
 return {cards,buttons,ids,context,filter:name=>buttons.find(b=>b.dataset.filter===name).listeners.click()};
}
test('every lobby card has valid local links, artwork, metadata and classifications',()=>{
 assert.ok(markup.length>=9);
 const links=new Set();
 for(const m of markup){
  const href=attr(m,'href');assert.match(href,/^[\w-]+\.html$/);assert.ok(!links.has(href));links.add(href);assert.ok(fs.existsSync(path.join(root,href)),href);
  const image=attr(m,'src');assert.match(image,/^[\w-]+\.svg$/);assert.ok(fs.existsSync(path.join(root,image)),image);
  const tags=attr(m,'data-tags');assert.ok(tags);for(const tag of tags.split(' '))assert.ok(categories.includes(tag),tag);
  assert.match(m,/<h3>[^<]+<\/h3>/);assert.match(m,/class="description">[^<]+/);assert.match(m,/class="meta"><span>[^<]+/);
 }
 assert.ok(categories.includes('learn'));
});
test('all filters announce category, visible count and derived total; aria-pressed stays exclusive',()=>{
 for(const extra of [false,true]){const app=boot({extra});for(const category of categories){app.filter(category);const visible=app.cards.filter(c=>!c.hidden);assert.equal(visible.length,app.cards.filter(c=>category==='all'||c.dataset.tags.split(' ').includes(category)).length);assert.ok(app.ids['result-count'].textContent.endsWith(`${visible.length} / ${app.cards.length} 款遊戲`));assert.match(app.ids['result-count'].textContent,/^[^：]+：/);assert.equal(app.buttons.filter(b=>b.attrs['aria-pressed']==='true').length,1);}}
});
test('recommendation follows active category, reshuffles without repeating and announces only the new name',()=>{
 const app=boot();for(const category of categories){app.filter(category);app.ids.surprise.listeners.click();assert.equal(app.ids['pick-announcement'].textContent,'');let previous=app.ids['pick-play'].href;for(let i=0;i<5;i++){app.ids['pick-again'].listeners.click();const chosen=app.cards.find(c=>c.attrs.href===app.ids['pick-play'].href);assert.ok(chosen);assert.equal(chosen.hidden,false);assert.notEqual(app.ids['pick-play'].href,previous);previous=app.ids['pick-play'].href;assert.equal(app.ids['pick-announcement'].textContent,`推薦：${app.ids['pick-title'].textContent}`);assert.ok(!app.ids['pick-context'].textContent.includes('undefined'));}}
});
test('unknown categories have a safe label and empty pool does not open a recommendation',()=>{
 const app=boot();app.buttons[0].dataset.filter='unknown';app.buttons[0].listeners.click();assert.match(app.ids['result-count'].textContent,/其他分類：0/);app.ids.surprise.listeners.click();assert.equal(app.ids['pick-play'].href,undefined);app.cards[0].dataset.tags='unknown';app.ids.surprise.listeners.click();assert.equal(app.ids['pick-context'].textContent,'從「其他分類」分類中選出');
});
test('without dialog API recommendations navigate directly to a matching game',()=>{
 const app=boot({dialogAPI:false});app.filter('learn');app.ids.surprise.listeners.click();assert.equal(app.ids['pick-dialog'].hidden,true);assert.ok(app.cards.some(c=>!c.hidden&&c.attrs.href===app.context.window.location.href));
});
test('legacy result redirect preserves search and hash',()=>{
 let url;vm.runInNewContext(scripts[0],{location:{hash:'#r=sample',search:'?from=old',replace:u=>url=u}});assert.equal(url,'double-standard.html?from=old#r=sample');
 url=undefined;vm.runInNewContext(scripts[0],{location:{hash:'#other',search:'',replace:u=>url=u}});assert.equal(url,undefined);
});
