(() => {
'use strict';
const E=CommonSchool,$=id=>document.getElementById(id);
let state=null,order=[];
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function button(text,fn){const b=el('button',text);b.type='button';b.addEventListener('click',fn);return b;}
function source(key){const [text,url]=E.sources[key],a=el('a',text+' ↗');a.href=url;a.target='_blank';a.rel='noopener';return a;}
const drawings={
 wash30:'<path d="M28 51l12 89h100l12-89M35 77q15-13 28 0t27 0 27 0 28 0" fill="none" stroke="#473d63" stroke-width="7" stroke-linejoin="round"/><text x="90" y="121" font-size="42" text-anchor="middle" fill="#473d63">30</text>',
 nobleach:'<path d="M90 25l65 120H25z" fill="none" stroke="#473d63" stroke-width="7" stroke-linejoin="round"/><path d="M27 29l126 126m0-126L27 155" stroke="#9b4a3a" stroke-width="9"/>',
 notumble:'<rect x="25" y="25" width="130" height="130" fill="none" stroke="#473d63" stroke-width="7"/><circle cx="90" cy="90" r="47" fill="none" stroke="#473d63" stroke-width="6"/><path d="M21 21l138 138m0-138L21 159" stroke="#9b4a3a" stroke-width="8"/>',
 bottles:'<path d="M37 50h30v24l15 15v65H22V89l15-15z" fill="#b5cdb6" stroke="#473d63" stroke-width="5"/><path d="M115 40h24v30l16 15v69h-56V85l16-15z" fill="#cbb2d7" stroke="#473d63" stroke-width="5"/><path d="M29 109h45m32-6h42" stroke="#fff7df" stroke-width="13"/><path d="M78 24l24 24m0-24L78 48" stroke="#9b4a3a" stroke-width="6"/>',
 fridge:'<rect x="39" y="12" width="102" height="156" rx="12" fill="#f4fcf6" stroke="#473d63" stroke-width="6"/><path d="M39 65h102m-80-31v17m0 36v28" stroke="#473d63" stroke-width="6"/><path d="M74 133h48v23H74z" fill="#cfadbc" stroke="#6e636e" stroke-width="3"/>',
 plug:'<path d="M69 24v40m42-40v40" stroke="#473d63" stroke-width="9" stroke-linecap="round"/><path d="M49 62h82v25a41 41 0 0 1-82 0z" fill="#d5b67c" stroke="#473d63" stroke-width="6"/><path d="M90 128v40" stroke="#473d63" stroke-width="10"/>',
 heater:'<rect x="35" y="36" width="110" height="112" rx="14" fill="#e2bf8a" stroke="#473d63" stroke-width="6"/><path d="M55 58v66m23-66v66m23-66v66m23-66v66M56 148v17m69-17v17" stroke="#473d63" stroke-width="7" stroke-linecap="round"/>'
};
function art(type){if(drawings[type]){const box=el('div',undefined,'label-symbol');box.innerHTML='<svg viewBox="0 0 180 180" aria-hidden="true">'+drawings[type]+'</svg>';return box;}const img=el('img');img.src='common-sense-school.svg';img.alt='';img.width=180;img.height=150;img.style.maxWidth='100%';img.style.height='auto';return img;}
function solution(q){if(q.kind==='drawer')return q.target==='main'?'II 主洗槽':'花形柔軟精槽，勿超過 MAX';if(q.kind==='fridge')return '密封容器放冷藏下層';if(q.kind==='temperature')return '最高水洗溫度 30°C';if(q.kind==='dose')return '本題指定用量 30mL';if(q.kind==='order')return q.steps.join(' → ');return q.options[q.answer];}
function explain(node,q){node.append(el('p','本題重點：'+solution(q)),el('p',q.why),source(q.source));}
function intro(){state=null;$('intro').hidden=false;$('lesson').hidden=true;$('result').hidden=true;$('start').focus();}
function start(){state=E.create($('mode').value);$('intro').hidden=true;$('result').hidden=true;$('lesson').hidden=false;render();}
function render(){
 if(state.index>=state.items.length){finish();return;}
 const q=state.items[state.index];$('round').textContent=`第 ${state.index+1} / ${state.items.length} 題`;$('score').textContent=`首次答對 ${state.answers.filter(a=>a.ok).length} 題`;$('progress').max=state.items.length;$('progress').value=state.answers.length;
 $('topic').textContent=E.topics[q.topic];$('title').textContent=q.title;$('prompt').textContent=q.prompt;$('clue').hidden=!q.clue;$('clue').textContent=q.clue||'';$('art').replaceChildren(art(q.art));$('controls').replaceChildren();$('feedback').replaceChildren();$('feedback').hidden=true;$('next').hidden=true;$('unsure').hidden=false;
 if(q.kind==='drawer')placement(q);else if(q.kind==='fridge')placement(q);else if(q.kind==='temperature')temperature(q);else if(q.kind==='dose')dose(q);else if(q.kind==='order')ordering(q);else choices(q);
 $('title').focus();
}
function choices(q){const group=el('div',undefined,'options');for(const {text,i} of E.shuffled(q.options.map((text,i)=>({text,i})))){const b=button(text,()=>answer(i));b.dataset.choice=i;group.append(b);}$('controls').append(group);}
function placement(q){
 let selected=null;const drawer=q.kind==='drawer',group=el('div',undefined,drawer?'compartments':'fridge-shelves');group.setAttribute('role','group');group.setAttribute('aria-label',drawer?'選擇投放位置':'選擇冰箱層位');
 const slots=drawer?[['pre','I','預洗槽'],['main','II','主洗槽'],['soft','花形','柔軟精槽 · MAX'],['clothes','衣物','直接倒在衣物上']]:[['top','上層','已放即食熟食'],['bottom','下層','可放密封容器'],['door','門邊','瓶罐架']];
 const status=el('p','尚未選位置','selection-status');status.setAttribute('aria-live','polite');
 const send=button(drawer?'確認投放位置':'確認收納位置',()=>answer(selected));send.className='primary control-confirm';send.disabled=true;
 for(const [key,symbol,caption] of slots){const b=button('',()=>{selected=key;group.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));status.textContent='本次選擇：'+symbol+' '+caption;send.disabled=false;});b.dataset.slot=key;b.setAttribute('aria-pressed','false');b.append(el('span',symbol,'slot-symbol'),el('span',caption,'slot-caption'));group.append(b);}
 $('controls').append(group,status,send);
}
function temperature(){const label=el('label','設定洗標允許的最高水洗溫度');label.htmlFor='temperature';const out=el('output','10°C','speed-value');out.id='temperature-value';const input=el('input');input.id='temperature';input.type='range';input.min=10;input.max=90;input.step=10;input.value=10;input.addEventListener('input',()=>out.textContent=input.value+'°C');const send=button('確認最高溫度',()=>answer(Number(input.value)));send.className='primary';$('controls').append(label,out,input,send);}
function dose(){
 let selected=null;const layout=el('div',undefined,'dose-layout'),cup=el('div',undefined,'cup'),fill=el('div',undefined,'cup-fill');cup.setAttribute('aria-hidden','true');cup.append(fill,el('span','60mL','cup-label'));
 const group=el('div',undefined,'dose-buttons');group.setAttribute('role','group');group.setAttribute('aria-label','選擇本題量取用量');const status=el('p','尚未量取','selection-status');status.setAttribute('aria-live','polite');
 const send=button('確認量取用量',()=>answer(selected));send.className='primary control-confirm';send.disabled=true;
 for(const n of [10,20,30,60]){const b=button(n+'mL',()=>{selected=n;fill.style.height=(n/60*100)+'%';group.querySelectorAll('button').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));status.textContent='本次量取：'+n+'mL';send.disabled=false;});b.dataset.ml=n;b.setAttribute('aria-pressed','false');group.append(b);}layout.append(cup,group);$('controls').append(layout,status,send);
}
function ordering(q){order=[2,0,1];const list=el('ol',undefined,'order-list');list.id='order-list';const live=el('p',undefined,'small');live.setAttribute('aria-live','polite');
 function draw(focus){list.replaceChildren();order.forEach((n,i)=>{const li=el('li');li.append(el('span',`${i+1}. ${q.steps[n]}`));for(const [delta,text] of [[-1,'上移'],[1,'下移']]){const b=button(text,()=>{const to=i+delta;[order[i],order[to]]=[order[to],order[i]];draw({n,delta});live.textContent=q.steps[n]+'，目前第 '+(to+1)+' 步';});b.dataset.step=n;b.dataset.delta=delta;b.setAttribute('aria-label',q.steps[n]+' '+text);b.disabled=i+delta<0||i+delta>=order.length;li.append(b);}list.append(li);});if(focus){const b=list.querySelector(`[data-step="${focus.n}"][data-delta="${focus.delta}"]`);if(b&&!b.disabled)b.focus();else list.querySelector(`[data-step="${focus.n}"]:not(:disabled)`)?.focus();}}
 draw();const send=button('確認三步順序',()=>answer(order));send.className='primary';$('controls').append(list,live,send);
}
function answer(value){
 const a=E.submit(state,value);if(!a)return;const q=state.items[state.index];$('controls').querySelectorAll('button,input').forEach(n=>n.disabled=true);$('unsure').hidden=true;
 $('controls').querySelectorAll('[data-choice]').forEach(b=>{const n=Number(b.dataset.choice);if(n===q.answer)b.classList.add('correct');if(n===value){b.classList.add('chosen');if(!a.ok)b.classList.add('wrong');}});
 if(a.ok&&['drawer','fridge'].includes(q.kind))$('controls').querySelector(`[data-slot="${q.target}"]`).classList.add('placed');
 const f=$('feedback');f.hidden=false;f.append(el('strong',a.ok?'✓ 放進生活技能包！':value==='unsure'?'○ 先看懂，再動手。':'↺ 這裡有個生活小細節。'));explain(f,q);
 $('progress').value=state.answers.length;$('score').textContent=`首次答對 ${state.answers.filter(a=>a.ok).length} 題`;$('next').hidden=false;$('next').textContent=state.index===state.items.length-1?'打開本輪複習 →':'下一題 →';
}
function finish(){
 $('lesson').hidden=true;$('result').hidden=false;const n=state.answers.filter(a=>a.ok).length;$('summary').textContent=`完成 ${state.items.length} 題，首次答對 ${n} 題，待複習 ${state.items.length-n} 題。`;$('review').replaceChildren();
 for(const [i,a] of state.answers.entries()){const q=state.items[i],d=el('details');d.append(el('summary',`${a.ok?'✓':'○'} ${q.title}`));explain(d,q);$('review').append(d);}$('result-title').focus();
}
for(const [id,name] of Object.entries(E.topics)){const opt=el('option',`${name} · ${E.questions.filter(q=>q.topic===id).length} 題`);opt.value=id;$('mode').append(opt);$('topic-chips').append(button(name,()=>{$('mode').value=id;start();}));}
$('start').addEventListener('click',start);$('next').addEventListener('click',()=>{if(E.next(state))render();});$('unsure').addEventListener('click',()=>answer('unsure'));$('leave').addEventListener('click',intro);$('restart').addEventListener('click',intro);
const refs=[['投放：對槽，不靠左右記','一般主洗依手冊放主洗槽；膠囊、自動投放與局部預處理分開看。','washer'],['照護：看整張洗標','水桶內數字是最高水洗溫度；漂白三角形與滾筒烘乾符號打叉，分別禁止該程序。','care'],['清潔：不自行混合','漂白水不可混酸或含氨清潔劑；產品保留標示並安全存放，出現刺激不適先離開暴露區。','chemical'],['冰箱：密封、分層、依標籤','生肉放密封容器於下層，避免滴汁；冷凍不等於殺菌，優先用冷藏解凍。','food'],['用電：插得進不等於安全','不超載、不串接延長線，不自行帶電修補。主要家電使用符合需求的牆壁插座與迴路。','power'],['取暖：離開或睡覺就關','可燃物遠離熱源，不用烤箱取暖。依設備手冊與環境條件保留安全距離。','heat']];
for(const [title,note,src] of refs){const card=el('article');card.append(el('h3',title),el('p',note),source(src));$('reference').append(card);}for(const key of Object.keys(E.sources)){const li=el('li');li.append(source(key));$('sources').append(li);}
})();
