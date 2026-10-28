(() => {
'use strict';
const E=RoadSchool,$=id=>document.getElementById(id);
let state=null,order=[],lamps={head:'off',fog:false};
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function button(text,fn){const b=el('button',text);b.type='button';b.addEventListener('click',fn);return b;}
function source(key){const [text,url]=E.sources[key];const a=el('a',text+' ↗');a.href=url;a.target='_blank';a.rel='noopener';return a;}
const drawings={
 tire:'<circle cx="90" cy="90" r="65" fill="#27413e"/><circle cx="90" cy="90" r="35" fill="#e5ded0" stroke="#849b8c" stroke-width="8"/><path d="M90 58v64m-32-32h64" stroke="#527966" stroke-width="7"/><path d="M48 36l12 15m60 78 12 15M36 120l15-12m78-48 15-12" stroke="#e9bb5c" stroke-width="7"/>',
 hazard:'<path d="M90 17l75 135H15z" fill="#f3bb5c" stroke="#7c4c25" stroke-width="7" stroke-linejoin="round"/><path d="M90 61v44" stroke="#183f3d" stroke-width="12"/><circle cx="90" cy="125" r="7" fill="#183f3d"/>',
 pedal:'<path d="M35 135l16-49h78l23 49" fill="#45866b" stroke="#183f3d" stroke-width="5"/><path d="M61 95h54l17 32H49z" fill="#e1eee1"/><rect x="27" y="127" width="133" height="32" rx="13" fill="#f3bb5c" stroke="#183f3d" stroke-width="5"/><circle cx="55" cy="158" r="13" fill="#183f3d"/><circle cx="131" cy="158" r="13" fill="#183f3d"/>',
 rain:'<path d="M42 85C5 75 22 31 54 39 60 1 123 5 124 42c46-12 56 44 18 43z" fill="#7faaa0"/><path d="M52 108l-10 24m48-24-10 24m48-24-10 24M65 143l-8 20m48-20-8 20" stroke="#367a9b" stroke-width="8" stroke-linecap="round"/>',
 headlight:'<path d="M85 55C20 35 20 145 85 125z" fill="#f3bb5c" stroke="#183f3d" stroke-width="6"/><path d="M102 55h54m-54 23h54m-54 24h54m-54 23h54" stroke="#367e67" stroke-width="7"/>',
 fire:'<path d="M90 18c12 48 58 55 47 102-10 48-84 52-100 3-7-25 5-48 22-63-2 27 12 28 17 19 8-14 10-35 14-61z" fill="#bd5936"/><path d="M89 86c6 19 31 35 16 54-17 18-43-5-30-25z" fill="#f7d06e"/>',
 road:'<path d="M64 15h52l40 150H24z" fill="#4f6b61"/><path d="M90 26v25m0 15v25m0 15v25m0 15v15" stroke="#fff4cd" stroke-width="5"/>',

 stop:'<polygon points="56,10 124,10 170,56 170,124 124,170 56,170 10,124 10,56" fill="#b82c29" stroke="white" stroke-width="5"/><text x="90" y="111" font-size="60" fill="white" text-anchor="middle">停</text>',
 yield:'<path d="M15 20h150L90 158z" fill="white" stroke="#bf302b" stroke-width="12" stroke-linejoin="round"/><text x="90" y="89" font-size="42" text-anchor="middle">讓</text>',
 max40:'<circle cx="90" cy="90" r="73" fill="white" stroke="#bf302b" stroke-width="13"/><text x="90" y="111" font-size="65" text-anchor="middle">40</text>',
 min40:'<circle cx="90" cy="90" r="73" fill="#23599b" stroke="white" stroke-width="5"/><text x="90" y="111" font-size="65" fill="white" text-anchor="middle">40</text>',
 doubleyellow:'<path d="M70 8v164m40-164v164" stroke="#e4ad22" stroke-width="10"/>',
 grid:'<rect x="15" y="15" width="150" height="150" fill="none" stroke="#e4ad22" stroke-width="5"/><path d="M15 15l150 150m0-150L15 165m0-75 75-75m75 75-75 75M15 90l75 75m0-150 75 75" stroke="#e4ad22" stroke-width="5"/>',
 uturn:'<path d="M126 155V70a36 36 0 0 0-72 0v43m-23-23 23 23 23-23" fill="none" stroke="#244f49" stroke-width="13" stroke-linejoin="round"/>',
 crossing:'<path d="M10 48h160M10 135h160" stroke="#53695d" stroke-width="4"/><path d="M25 60v63m33-63v63m33-63v63m33-63v63m33-63v63" stroke="white" stroke-width="15"/>'
};
function art(type){
 const box=el('div');if(!type)type='road';
 if(['red','green','flashred','flashyellow'].includes(type)){const color=type==='green'?'#28794d':type==='flashyellow'?'#f1ba37':'#bd332a';box.innerHTML='<svg viewBox="0 0 180 180" aria-hidden="true"><rect x="48" y="5" width="84" height="170" rx="25" fill="#213d3b"/><circle cx="90" cy="90" r="29" fill="'+color+'"/></svg>';box.append(el('b',{red:'紅燈',green:'綠燈',flashred:'閃光紅燈',flashyellow:'閃光黃燈'}[type]));return box;}
 if(type==='uturnban'){box.innerHTML='<svg viewBox="0 0 180 180" aria-hidden="true">'+drawings.uturn+'<circle cx="90" cy="90" r="77" fill="none" stroke="#bf302b" stroke-width="9"/><path d="M34 34l112 112" stroke="#bf302b" stroke-width="10"/></svg>';box.append(el('b','禁止迴轉（示意）'));return box;}
 if(drawings[type]){box.innerHTML='<svg viewBox="0 0 180 180" aria-hidden="true">'+drawings[type]+'</svg>';return box;}
 if(type==='placard'){box.className='placard';box.append(el('div','本題虛構車門標籤'),el('div','冷胎・一般載重'),el('div','前 33 / 後 33 psi'));return box;}
 box.append(el('span',({tire:'🛞',rain:'🌧️',fire:'🚒',hazard:'⚠️',pedal:'🚙',headlight:'💡'})[type]||'🛣️','emoji'));return box;
}
function showIntro(){state=null;$('intro').hidden=false;$('lesson').hidden=true;$('result').hidden=true;$('start').focus();}
function start(){state=E.create($('mode').value);$('intro').hidden=true;$('result').hidden=true;$('lesson').hidden=false;render();}
function render(){
 if(state.index>=state.items.length){finish();return;}
 const q=state.items[state.index];$('round').textContent=`第 ${state.index+1} / ${state.items.length} 題`;$('score').textContent=`首次答對 ${state.answers.filter(a=>a.ok).length} 題`;
 $('progress').max=state.items.length;$('progress').value=state.answers.length;$('topic').textContent=E.topics[q.topic];$('title').textContent=q.title;$('prompt').textContent=q.prompt;
 $('art').replaceChildren(art(q.art));$('controls').replaceChildren();$('feedback').hidden=true;$('feedback').replaceChildren();$('next').hidden=true;$('unsure').hidden=false;$('unsure').disabled=false;
 if(q.kind==='speed')speedControl(q);else if(q.kind==='lights')lampControl();else if(q.kind==='order')orderControl(q);else choiceControl(q);
 $('title').focus();
}
function choiceControl(q){const group=el('div',undefined,'options');E.shuffled(q.options.map((text,i)=>({text,i}))).forEach(o=>{const b=button(o.text,()=>answer(o.i));b.dataset.choice=o.i;group.append(b);});$('controls').append(group);}
function speedControl(){const label=el('label','設定法定最高速限（不是建議安全速度）');label.htmlFor='speed-input';const out=el('output','0 km/h','speed-value');out.id='speed-value';const input=el('input');input.id='speed-input';input.type='range';input.min=0;input.max=100;input.step=10;input.value=0;input.setAttribute('aria-describedby','speed-help');input.addEventListener('input',()=>out.textContent=input.value+' km/h');const help=el('p','可拖滑桿，鍵盤用方向鍵調整；最後按送出。','small');help.id='speed-help';const send=button('送出速限',()=>answer(Number(input.value)));send.className='primary';$('controls').append(label,out,input,help,send);}
function lampControl(){
 lamps={head:'off',fog:false};const group=el('div',undefined,'controls-row');group.setAttribute('role','group');group.setAttribute('aria-label','頭燈模式');
 [['off','關閉'],['low','近光燈'],['high','遠光燈']].forEach(([key,text])=>{const b=button(text,()=>{lamps.head=key;update();});b.dataset.head=key;group.append(b);});
 const label=el('label',undefined,'fog-label');const check=el('input');check.id='fog';check.type='checkbox';check.addEventListener('change',()=>{lamps.fog=check.checked;update();});label.append(check,el('span','加開霧燈'));
 const road=el('div',undefined,'lamp-road off');road.setAttribute('aria-hidden','true');
 road.innerHTML='<svg class="lamp-scene" viewBox="0 0 240 240" focusable="false"><path d="M36 0v240M204 0v240" stroke="#71898d" stroke-width="2"/><path d="M120 0v22m0 14v22m0 14v22m0 14v22" stroke="#a8b6b4" stroke-width="3"/><g class="head-beams" fill="#fff1ae"><g class="low-beams"><path d="M94 169L68 92h47l-13 77Z"/><path d="M138 169l-13-77h47l-26 77Z"/></g><g class="high-beams"><path d="M94 169L52 14h66l-16 155Z"/><path d="M138 169L122 14h66l-42 155Z"/></g></g><g class="fog-beam" fill="#e4eaa5"><path d="M88 177L40 132h76l-20 45Z"/><path d="M144 177l-20-45h76l-48 45Z"/></g><g class="lamp-car"><rect x="82" y="162" width="76" height="66" rx="18" fill="#e7ad55" stroke="#0d2028" stroke-width="3"/><path d="M96 177h48l-5 19h-38Z" fill="#48737c"/><rect x="89" y="207" width="8" height="10" rx="2" fill="#c64c44"/><rect x="143" y="207" width="8" height="10" rx="2" fill="#c64c44"/><path class="headlamps" d="M91 169h12m34 0h12" stroke-width="6" stroke-linecap="round"/><path class="fog-lamps" d="M85 178h7m56 0h7" stroke-width="4" stroke-linecap="round"/></g></svg><span class="road-direction">行進方向 ↑</span>';
 const hint=el('p','車頭朝上；光束只示意照射距離與寬度，不代表實際光型或亮度。','small');
 const status=el('p',undefined,'lamp-status');status.id='lamp-status';status.setAttribute('aria-live','polite');
 function update(){road.className='lamp-road '+lamps.head+(lamps.fog?' fog':'');group.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.head===lamps.head)));status.textContent='目前：'+{off:'頭燈關閉',low:'近光燈',high:'遠光燈'}[lamps.head]+'／霧燈'+(lamps.fog?'開':'關');}
 const send=button('確認燈光配置',()=>answer(lamps.head+'|'+Number(lamps.fog)));send.className='primary';$('controls').append(group,label,road,hint,status,send);update();
}
function orderControl(q){order=[2,0,1];const list=el('ol',undefined,'order-list');list.id='order-list';const live=el('p',undefined,'small');live.setAttribute('aria-live','polite');
 function draw(focus){list.replaceChildren();order.forEach((n,i)=>{const li=el('li');li.append(el('span',`${i+1}. ${q.steps[n]}`));for(const [delta,text] of [[-1,'上移'],[1,'下移']]){const b=button(text,()=>{const to=i+delta;[order[i],order[to]]=[order[to],order[i]];draw({n,delta});live.textContent=q.steps[n]+'，目前第 '+(to+1)+' 步';});b.dataset.step=n;b.dataset.delta=delta;b.setAttribute('aria-label',q.steps[n]+' '+text);b.disabled=i+delta<0||i+delta>=order.length;li.append(b);}list.append(li);});if(focus){const b=list.querySelector(`[data-step="${focus.n}"][data-delta="${focus.delta}"]`);if(b&&!b.disabled)b.focus();else list.querySelector(`[data-step="${focus.n}"]:not(:disabled)`)?.focus();}}
 draw();const send=button('送出三步排序',()=>answer(order));send.className='primary';$('controls').append(list,live,send);
}
function answer(value){
 const a=E.submit(state,value);if(!a)return;const q=state.items[state.index];$('controls').querySelectorAll('button,input').forEach(n=>n.disabled=true);$('unsure').hidden=true;
 $('controls').querySelectorAll('[data-choice]').forEach(b=>{const n=Number(b.dataset.choice);if(n===q.answer)b.classList.add('correct');if(n===value){b.classList.add('chosen');if(!a.ok)b.classList.add('wrong');}});
 const f=$('feedback');f.hidden=false;f.append(el('strong',a.ok?'✓ 觀念到位！':value==='unsure'?'○ 先學會，比猜中重要。':'↺ 這裡有個關鍵。'));
 if(q.kind==='speed')f.append(el('p',`本題法定最高速限：${q.limit} km/h。`));
 if(q.kind==='lights')f.append(el('p','本題配置：近光燈'+(q.accepted.includes('low|1')?'；霧燈可開可不開。':'；霧燈關閉。')));
 if(q.kind==='order')f.append(el('p',q.steps.join(' → ')));
 if(q.options.length)f.append(el('p','本題選擇：'+q.options[q.answer]));f.append(el('p',q.why),source(q.source));
 $('progress').value=state.answers.length;$('score').textContent=`首次答對 ${state.answers.filter(a=>a.ok).length} 題`;$('next').hidden=false;$('next').textContent=state.index===state.items.length-1?'看本輪複習 →':'下一題 →';
}
function finish(){
 $('lesson').hidden=true;$('result').hidden=false;const n=state.answers.filter(a=>a.ok).length;$('summary').textContent=`完成 ${state.items.length} 題，首次答對 ${n} 題，待複習 ${state.items.length-n} 題。`;$('review').replaceChildren();
 for(const [i,a] of state.answers.entries()){const q=state.items[i],d=el('details');d.append(el('summary',`${a.ok?'✓':'○'} ${q.title}`));if(q.options.length)d.append(el('p',q.options[q.answer]));if(q.kind==='speed')d.append(el('p',`本題法定最高速限 ${q.limit} km/h`));if(q.kind==='order')d.append(el('p',q.steps.join(' → ')));d.append(el('p',q.why),source(q.source));$('review').append(d);}$('result-title').focus();
}
for(const [id,name] of Object.entries(E.topics)){const opt=el('option',`${name} · ${E.questions.filter(q=>q.topic===id).length} 題`);opt.value=id;$('mode').append(opt);const b=button(name,()=>{$('mode').value=id;start();});$('topic-chips').append(b);}
$('start').addEventListener('click',start);$('next').addEventListener('click',()=>{if(E.next(state))render();});$('unsure').addEventListener('click',()=>answer('unsure'));$('leave').addEventListener('click',showIntro);$('restart').addEventListener('click',showIntro);
for(const q of E.questions.filter(q=>q.topic==='fluids'))$('fluid-buttons').append(button(q.fluid,()=>{const d=$('fluid-detail');d.replaceChildren(el('h3',q.fluid),el('p',q.why),source(q.source));}));
const signs=[['max40','最高速限','紅圈黑字 40：最高速限 40 km/h；路況需要時還要減速。','speed'],['min40','最低速限','藍底白字 40：最低速限標誌；不能與最高速限紅圈混淆。仍須遵守其他規則，緊急／路況限制不能盲目硬衝。','signs'],['stop','停車再開','先停車觀察，安全再開。','signs'],['yield','讓路','依情況減速或停車，讓幹道車先行。','signs'],['doubleyellow','雙黃實線','分向限制線：禁止跨越及迴轉。','signs'],['grid','黃網狀線','保持淨空，不得停車或臨時停車；此示意為無號誌出入口，不套到有號誌路口的繪設規則。','signs'],['flashred','閃紅燈','停車再開，讓幹道車先行。','flash'],['flashyellow','閃黃燈','減速接近，注意安全，小心通過。','flash'],['uturnban','禁止迴轉','禁止左轉路段也不能迴車；另注意線型與其他禁止條件。','uturn']];
for(const [type,name,note,src] of signs){const card=el('article');card.append(art(type),el('h3',name),el('p',note),source(src));$('sign-atlas').append(card);}
for(const key of Object.keys(E.sources)){const li=el('li');li.append(source(key));$('sources').append(li);}
let previous=0;function pedal(){const n=Number($('pedal').value),delta=n-previous;$('pedal-value').textContent=n+' / 10 格';$('demo-car').style.left=(5+n*7)+'%';$('pedal-note').textContent=n===0?'目前收油。收油不保證車輛停止；需要停車時仍須適當煞車。':delta>2?'這次示意輸入突然加重了。試著細緻分段調整，不追求一腳到位。':'這次示意輸入變化較小。重點是觀察路況、預留餘裕，而非守住這個刻度。';previous=n;}
$('pedal').addEventListener('input',pedal);$('pedal-reset').addEventListener('click',()=>{$('pedal').value=0;pedal();});
})();
