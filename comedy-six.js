'use strict';
(() => {
  const E=ComedySix,id=document.body.dataset.comedy,M=E.meta[id],$=x=>document.getElementById(x);
  const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
  let state=E.create(id),started=false,paused=false,round=0;
  const first=Array(M.rounds).fill(null),latest=Array(M.rounds).fill(null);
  const gooseSVG='<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M20 64Q2 37 36 34l8-20q8-15 17 0l-2 28q22 12 5 25Z" fill="#fff7d5" stroke="#17352a" stroke-width="3"/><path d="m59 15 13 5-14 6" fill="#d76a2e"/><circle cx="55" cy="14" r="2" fill="#17352a"/><path d="m28 66-3 8m27-8 3 8" stroke="#d76a2e" stroke-width="4"/></svg>';
  const humanSVG='<svg viewBox="0 0 60 95" aria-hidden="true"><circle cx="30" cy="19" r="12" fill="#f2bb89" stroke="#17352a" stroke-width="3"/><path d="M15 82V44q15-17 30 0v38M30 60v32" fill="#52796a" stroke="#17352a" stroke-width="4"/><path d="m16 44-8 28m36-28 8 28" stroke="#17352a" stroke-width="5"/></svg>';
  const active=()=>started&&!paused&&state.status==='playing';
  function btn(label,action,value,attrs={}){
    const b=node('button',label);b.disabled=!active();b.dataset.action=action;
    if(value!==undefined)b.dataset.value=String(value);
    Object.entries(attrs).forEach(([k,v])=>b.setAttribute(k,String(v)));
    b.onclick=()=>dispatch(action,value);return b;
  }
  function metric(root,...items){const d=node('div');d.className='scene-metrics';items.forEach(t=>d.append(node('span',t)));root.append(d);}
  function choose(root,label,action,options,value){
    const l=node('label',label),s=node('select');s.id='input-'+action.replace(':','-');s.disabled=!active();
    const blank=node('option','請選取');blank.value='';blank.disabled=true;s.append(blank);
    options.forEach((text,i)=>{const o=node('option',text);o.value=i;s.append(o);});s.value=value===null?'':String(value);
    s.onchange=()=>{if(s.value!=='')dispatch(action,Number(s.value));};l.htmlFor=s.id;l.append(s);root.append(l);
  }
  function svg(root,html,cls,label){const d=node('div');d.className=cls||'';d.innerHTML=html;if(label){d.setAttribute('role','img');d.setAttribute('aria-label',label);}root.append(d);return d;}
  function renderButton(stage,controls){
    stage.append(node('h3','禁止按鈕委員會・現場'));
    metric(stage,'混亂 '+state.chaos+' / 5','委員會 '+state.committees, state.powered?'授權通電':'授權斷電');
    const red=btn(state.powered?'不要按！':'沒電了','press');red.id='big-button';red.className='big-red'+(state.powered?'':' off');stage.append(red);
    const groups=node('div');groups.className='committee-list';
    for(let i=0;i<Math.min(7,state.committees);i++){const card=node('div',i===0?'禁止按鈕委員會':'監督第'+i+'委員會的委員會');card.className='committee';groups.append(card);}
    stage.append(groups,node('p',state.committees?'每一張真的都是一個新增委員會。':'目前無委員會，椅子數量暫時合理。'));
    controls.append(node('p','先觀察銘牌再決定怎麼收場。一直按也有自己的結局。'));
    for(const[a,label]of[['inspect','看銘牌'],['delegate','外包給另一個小組'],['unplug','關閉授權電源'],['dissolve','解散現有委員會'],['archive','封存整個按鈕計畫']])controls.append(btn(label,a));
    if(state.inspected){const p=node('p','銘牌：斷電→解散→封存。紅鈕只負責新增組織，不負責善後。');p.className='record';controls.append(p);}
  }
  function renderGoose(stage,controls){
    stage.append(node('h3','鵝的辦公室平面圖'));
    metric(stage,'步數 '+state.tick,'疑心 '+state.alarm+' / 5',state.distract?'主管分心 '+state.distract+' 步':'主管正常巡邏');
    const grid=node('div');grid.className='office-grid';const g=E.guard(state);
    for(let y=0;y<6;y++)for(let x=0;x<8;x++){
      const here=x===state.x&&y===state.y,guard=x===g[0]&&y===g[1],wall=E.walls.some(p=>p[0]===x&&p[1]===y);
      const item=E.items.findIndex((p,n)=>p[0]===x&&p[1]===y&&!state.done[n]&&state.carry!==n);
      const target=E.targets.findIndex(p=>p[0]===x&&p[1]===y),exit=x===0&&y===4;
      const text=wall?'牆':guard?'主管':item>=0?item===0?'筆':'文件':target>=0?target===0?'鵝巢':'紙鵝桌':exit?'出口':'';
      const cell=node('button',here?'':text);cell.className='office-cell'+(wall?' wall':'')+(here?' player':'')+(guard?' guard':'')+(target>=0||exit?' goal':'');
      cell.id='cell-'+x+'-'+y;cell.setAttribute('aria-label',`第${x+1}欄第${y+1}列 ${here?'鵝 ':''}${text}`);
      const adjacent=Math.abs(x-state.x)+Math.abs(y-state.y)===1;
      cell.disabled=!active()||!adjacent||wall;
      if(here)cell.innerHTML=gooseSVG;
      cell.onclick=()=>dispatch(x>state.x?'right':x<state.x?'left':y>state.y?'down':'up');grid.append(cell);
    }
    stage.append(grid,node('p','主管巡邏路線：'+[[4,2],[4,3],[3,3],[3,2]].map(([x,y])=>`(${x+1},${y+1})`).join(' → ')),node('p','同格或相鄰會增加疑心。HONK本身+1疑心，但讓主管分心；裝資料夾時嘴巴要空。'));
    controls.append(node('p',(state.done[0]?'✓ ':'□ ')+'雷射筆帶回鵝巢'),node('p',(state.done[1]?'✓ ':'□ ')+'文件排到紙鵝桌'),node('p','最後到出口「裝沒事離場」。'),node('p','嘴裡：'+(state.carry===null?'空':state.carry===0?'雷射筆':'文件')));
    const pad=node('div');pad.className='dpad';for(const[a,label]of[['up','↑'],['left','←'],['down','↓'],['right','→']]){const b=btn(label,a);b.dataset.move=a;b.setAttribute('aria-label',a==='up'?'向上':a==='down'?'向下':a==='left'?'向左':'向右');pad.append(b);}controls.append(pad);
    for(const[a,label]of[['pickup','叼起任務物品'],['drop','放到任務位置'],['honk','HONK！讓主管分心'],['blend','裝資料夾／在出口裝沒事離場']])controls.append(btn(label,a));
  }
  function renderPackage(stage,controls){
    const obj=E.objects[round];stage.append(node('h3','今日商品：'+obj.name),node('p',`商品 ${obj.w}×${obj.d}×${obj.h} 公分；目標體積至少50倍。`));
    const m=E.packageMetrics(state);
    if(state.box!==null){const b=E.cartons[state.box],w=b.w,h=state.turned?b.d:b.h,ow=obj.w,oh=state.turned?obj.d:obj.h,scale=Math.min(180/Math.max(w,ow+state.pad*2),160/Math.max(h,oh+state.pad*2)),bw=w*scale,bh=h*scale,iw=ow*scale,ih=oh*scale;
      svg(stage,`<svg class="box-art" viewBox="0 0 280 230" aria-hidden="true"><rect x="${140-bw/2}" y="${190-bh}" width="${bw}" height="${bh}" fill="${state.material===0?'#d9bc83':state.material===1?'#bce0db':'#d7a1d4'}" stroke="#fff0bf" stroke-width="4"/><rect x="${140-iw/2}" y="${190-state.pad*scale-ih}" width="${iw}" height="${ih}" fill="#a95132" stroke="#17352a" stroke-width="1"/><text x="140" y="220" text-anchor="middle" fill="#fff3d0" font-size="15">${b.w}×${b.d}×${b.h} 公分／${state.turned?'側放':'直立'}</text></svg>`,'',b.name+'與商品的尺寸示意');
    }else stage.append(node('p','紙箱還沒選，商品暫時不用付房租。'));
    if(m){metric(stage,'體積 '+Math.round(m.ratio)+' 倍',m.fitsObject?'商品與緩衝放得下':'商品或緩衝放不下',m.fitsLift?'電梯尺寸符合':'電梯卡住');stage.append(node('p','朝向尺寸：寬'+m.dims[0]+' × 深'+m.dims[1]+' × 高'+m.dims[2]+'。'));}
    const form=node('div');form.className='form-grid';
    choose(form,'紙箱（內尺寸：寬×深×高）','box',E.cartons.map(b=>`${b.name} ${b.w}×${b.d}×${b.h}`),state.box);
    choose(form,'每側緩衝厚度（公分）','pad',[0,1,2,3].map(String),state.pad);
    choose(form,'填充材料','material',E.materials,state.material);choose(form,'標籤','label',E.labels,state.label);
    choose(form,'目的電梯（寬×深×高限制）','lift',E.lifts.map(l=>`${l.name} ${l.w}×${l.d}×${l.h}`),state.lift);
    const rotate=btn(state.turned?'改回直立':'把紙箱側放','rotate',undefined,{'aria-pressed':state.turned});form.append(rotate);
    const ship=btn('試著送進電梯','ship');ship.id='commit';ship.disabled=!active()||!E.packageReady(state);form.append(ship);controls.append(form);
    controls.append(node('p','填充材會改變箱內顏色。示意圖按正面尺寸縮放，不是實際物流測試。'));
  }
  function renderElevator(stage,controls){
    stage.append(node('h3',E.elevatorScene(state)));metric(stage,'喜劇尷尬值 '+state.awkward,'已演 '+state.turn+' / 6 幕');
    const shaft=node('div');shaft.className='elevator-shaft';const light=node('div',Math.min(3,Math.floor(state.turn/2)+1)+'F');light.className='floor-light';shaft.append(light);
    const grid=node('div');grid.className='position-grid';E.positions.forEach((label,n)=>{const current=state.position===null?state.lastPosition:state.position;const slot=node('div');slot.className='position-slot'+(current===n?' selected':'');slot.append(node('p',label));if(current===n)slot.innerHTML+=humanSVG;else slot.append(node('p',n===1?'門在這裡':'空位'));grid.append(slot);});shaft.append(grid);stage.append(shaft,node('p','選站位時，人會移到對應位置。站門口中央會妨礙開門，側邊能讓路。'));
    controls.append(node('p','先選站位，再選台詞，最後開口。每次只演一幕。'));
    E.positions.forEach((label,n)=>controls.append(btn(label,'position',n,{'aria-pressed':state.position===n})));
    const choices=node('div');choices.className='options';E.elevatorChoices(state).forEach((text,n)=>choices.append(btn(text,'line',n,{'aria-pressed':state.line===n})));controls.append(choices);
    const speak=btn('就在這個位置開口','speak');speak.id='commit';speak.disabled=!active()||state.position===null||state.line===null;controls.append(speak);
  }
  function bowl(stage){
    const r=state.recipe,color=r.base===2?'#73a55a':r.base===1?'#fff5d2':'#e2b66b',broth=r.soup===1?'#c88236':'#f3dfb1';let paths='';
    for(let n=0;n<7;n++){const x=55+n*25;paths+=`<path d="M${x} 82q-20 35 0 60t0 45" stroke="${color}" stroke-width="7" fill="none"/>`;}
    const topping=r.season===1||r.season===3?'<circle cx="90" cy="130" r="12" fill="#bc5d2c"/><circle cx="170" cy="145" r="10" fill="#bc5d2c"/>':r.season===2?'<path d="M65 100q80-40 135 40" stroke="#b62e21" stroke-width="15" fill="none"/>':'';
    svg(stage,`<svg class="recipe-art" viewBox="0 0 280 230" aria-hidden="true"><path d="M25 100h230q-10 105-115 105T25 100Z" fill="#fff5d5" stroke="#17352a" stroke-width="5"/><ellipse cx="140" cy="105" rx="114" ry="35" fill="${broth}"/>${paths}${topping}${r.texture===1?'<path d="m80 92 18 10-12 12m85-18 18 13-14 8" stroke="#83ac4d" fill="none" stroke-width="7"/>':''}${r.soup===2?'<rect x="215" y="155" width="50" height="50" rx="9" fill="#e0ab55" stroke="#fff5d5" stroke-width="4"/>':''}</svg>`,'','碗中配料依選取狀態顯示');
  }
  function renderNoodle(stage,controls){
    const c=E.customers[round];stage.append(node('h3',c.name),node('p','「'+c.quote+'」'));bowl(stage);
    const selected=Object.entries(state.recipe).filter(([,v])=>v!==null).map(([k,v])=>E.recipes[k][v]);stage.append(node('p',selected.join('／')||'目前是一碗尚未決定的可能性。'));
    if(state.asked[0]){const p=node('p','客人的意思：'+c.meaning);p.className='record';stage.append(p);}
    if(state.asked[1]){const p=node('p','不能放的項目：'+c.avoid);p.className='record';stage.append(p);}
    controls.append(node('h3','先問清楚'));
    ['你說的感覺／外型是什麼？','哪些東西不能放？','要不要先買我們的會員？'].forEach((label,n)=>controls.append(btn((state.asked[n]?'已問過：':'追問：')+label,'ask',n)));
    const form=node('div');form.className='form-grid';for(const[key,label]of[['base','麵體'],['soup','湯的安排'],['season','調味'],['texture','口感']])choose(form,label,'recipe:'+key,E.recipes[key],state.recipe[key]);
    const serve=btn('出餐，接受客人反應','serve');serve.id='commit';serve.disabled=!active()||!E.noodleReady(state);form.append(serve);controls.append(form);
  }
  function pressArt(stage){
    const card=state.card||state.lastCard;let chart='';
    if(card==='dinosaur'){for(let n=0;n<state.drama+1;n++){const x=15+n*62;chart+=`<g transform="translate(${x} 20)"><path d="M5 120 17 90 28 92 30 40 52 25 58 42 45 48 45 105 36 126 34 150 27 150 26 128 16 130 9 150 2 150Z" fill="#6e9f53" stroke="#17352a" stroke-width="3"/></g>`;}}
    else if(card==='universe')chart=`<circle cx="140" cy="95" r="${25+state.drama*14}" fill="#7c80af"/><ellipse cx="140" cy="95" rx="115" ry="35" fill="none" stroke="#a95132" stroke-width="6"/><text x="140" y="175" text-anchor="middle" font-size="16">宇宙很大，原題還在桌上</text>`;
    else if(card==='facts'&&state.opened){if(round===0)chart='<rect x="50" y="65" width="45" height="100" fill="#bd642f"/><rect x="115" y="125" width="45" height="40" fill="#75a164"/><rect x="180" y="105" width="45" height="60" fill="#82a6b0"/><text x="72" y="52" text-anchor="middle">食材+5</text><text x="137" y="112" text-anchor="middle">包材+2</text><text x="202" y="92" text-anchor="middle">人力+3</text>';
      else if(round===1)chart='<rect x="60" y="85" width="60" height="80" fill="#75a164"/><rect x="160" y="45" width="60" height="120" fill="#bd642f"/><text x="90" y="70" text-anchor="middle">舊20克</text><text x="190" y="30" text-anchor="middle">新30克</text>';
      else chart='<text x="140" y="80" text-anchor="middle" font-size="25">只有A店</text><text x="140" y="125" text-anchor="middle" font-size="25">下週一</text>';}
    else chart='<text x="140" y="95" text-anchor="middle" font-size="20">麥克風已開</text><text x="140" y="130" text-anchor="middle" font-size="16">選一張發言卡，看看世界怎麼反應</text>';
    const d=node('div');d.className='press-chart';d.innerHTML=`<svg viewBox="0 0 280 190" role="img" aria-label="${card==='facts'&&state.opened?'根據本題資料的圖表':'虛構喜劇圖表，不是事實證據'}">${chart}</svg>`;stage.append(d);
  }
  function renderPress(stage,controls){
    const c=E.conferences[round];stage.append(node('h3','記者原題'),node('p',c.question));metric(stage,'發言 '+state.turn+' / 5','混亂 '+state.chaos+' / 8',state.focus?'目前在原題':'目前已離題');
    pressArt(stage);stage.append(node('p',state.card?'預覽中，尚未發言：'+E.pressCards.find(c=>c.id===state.card).name:'上次發言：'+(state.lastCard?E.pressCards.find(c=>c.id===state.lastCard).name:'還沒有')));
    controls.append(btn(state.opened?'重新看桌上資料':'打開桌上資料夾','open'));
    if(state.opened){const record=node('p',c.record);record.className='record';controls.append(record);}
    const hand=node('div');hand.className='hand';E.pressCards.forEach(c=>{const b=btn(c.name+(state.used.includes(c.id)?'（已用）':''),'card',c.id,{'aria-pressed':state.card===c.id});b.disabled=!active()||state.used.includes(c.id);hand.append(b);});controls.append(hand);
    const label=node('label','戲劇效果 0–3：'),range=node('input'),output=node('output',String(state.drama));range.id='input-drama';range.type='range';range.min=0;range.max=3;range.step=1;range.value=state.drama;range.disabled=!active();output.id='drama-value';label.htmlFor=range.id;label.append(output);
    range.oninput=()=>dispatch('drama',Number(range.value),false);controls.append(label,range,node('p','效果越大，離題卡越容易把現場變成恐龍展；資料與原題不會因此改變。'));
    const speak=btn('用選取的卡正式發言','speak');speak.id='commit';speak.disabled=!active()||state.card===null;controls.append(speak);
  }
  function summary(s){
    const kind=M.kind;let details='';
    if(kind==='button')details=`按鈕混亂${s.chaos}／委員會${s.committees}／電源${s.powered?'開':'關'}`;
    if(kind==='goose')details=`雷射筆${s.done[0]?'完成':'未完成'}／紙鵝${s.done[1]?'完成':'未完成'}／疑心${s.alarm}／步數${s.tick}`;
    if(kind==='package'){const m=E.packageMetrics(s);details=E.objects[s.round].name+'；'+(s.box===null?'未選紙箱':E.cartons[s.box].name)+'；'+(s.lift===null?'未選電梯':E.lifts[s.lift].name)+(m?'；體積'+Math.round(m.ratio)+'倍；朝向'+m.dims.join('×'):'');}
    if(kind==='elevator')details='虛構尷尬值：'+s.awkward;
    if(kind==='noodle')details=Object.entries(s.recipe).map(([k,v])=>v===null?'未選':E.recipes[k][v]).join('／')+'；需求追問'+s.asked[0]+'／排除項追問'+s.asked[1];
    if(kind==='press')details='原題：'+E.conferences[s.round].question+'；發言'+s.turn+'；混亂'+s.chaos;
    return details+'\n'+s.ending+'\n'+s.log.join('\n');
  }
  function record(){if(state.status==='playing')return;const r={pass:state.pass,ending:state.ending,text:summary(state)};if(first[round]===null)first[round]={...r};latest[round]=r;}
  function render(rebuildControls=true){
    const focus=document.activeElement?.id;
    const stage=$('stage'),controls=$('controls');stage.replaceChildren();
    // A range input stays mounted while dragging; all other actions rebuild controls with focus restoration.
    const target=rebuildControls?controls:node('div');if(rebuildControls)controls.replaceChildren();
    ({button:renderButton,goose:renderGoose,package:renderPackage,elevator:renderElevator,noodle:renderNoodle,press:renderPress})[M.kind](stage,target);
    $('round').textContent=`${M.title} · 第 ${round+1} / ${M.rounds} 局`;
    $('status').textContent=state.note;$('pause').disabled=!started||state.status!=='playing';
    $('round-end').hidden=state.status==='playing';$('next').hidden=round+1>=M.rounds;
    $('ending-title').textContent=state.status==='ending'?'電梯到站，演出完成':state.pass?'這局有收場！':'這局鬧出另一種收場';$('ending').textContent=state.ending;
    const complete=latest.every(Boolean);$('recap-panel').hidden=!complete||state.status==='playing';
    if(complete){$('score').textContent=M.kind==='elevator'?'本輪六幕已演完；尷尬值不是社交能力評分。':`首次有效完成 ${first.filter(r=>r?.pass).length} / ${M.rounds} 局；最近有效完成 ${latest.filter(r=>r?.pass).length} / ${M.rounds} 局。`;
      $('recap').replaceChildren(...latest.map((r,n)=>{const li=node('li',`第${n+1}局：首次${first[n].pass?'有效完成':'另一種收場'}；最近${r.pass?'有效完成':'另一種收場'}`);li.append(node('pre',r.text));return li;}));}
    if($('drama-value'))$('drama-value').textContent=String(state.drama);
    if(rebuildControls&&focus&&$(focus)&&!$(focus).disabled)$(focus).focus({preventScroll:true});
  }
  function dispatch(action,value,rebuild=true){if(!active())return;state=E.act(state,action,value);record();render(rebuild);}
  function start(){started=true;paused=false;round=0;first.fill(null);latest.fill(null);state=E.create(id);$('overlay').hidden=true;$('game').hidden=false;$('start').hidden=true;render();$('stage').focus({preventScroll:true});}
  $('stage').tabIndex=0;$('start').onclick=start;$('restart').onclick=start;
  $('retry').onclick=()=>{if(paused)return;state=E.create(id,round);render();$('stage').focus({preventScroll:true});};
  $('next').onclick=()=>{if(paused||state.status==='playing'||round+1>=M.rounds)return;round++;state=E.create(id,round);render();$('stage').focus({preventScroll:true});};
  function pause(){if(!started||paused||state.status!=='playing')return;paused=true;$('overlay').hidden=false;render();$('resume').focus();}
  function resume(){if(!paused)return;paused=false;$('overlay').hidden=true;render();$('stage').focus({preventScroll:true});}
  $('pause').onclick=pause;$('resume').onclick=resume;window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&started){e.preventDefault();paused?resume():pause();return;}if(M.kind!=='goose'||!active()||e.target?.closest?.('select,input,textarea'))return;const dir={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'}[e.key]||{w:'up',s:'down',a:'left',d:'right'}[e.key.toLowerCase()];if(dir){e.preventDefault();if(!e.repeat)dispatch(dir);}});
  $('download').onclick=()=>{if(!latest.every(Boolean))return;const text=M.title+'｜本輪喜劇回條\n'+$('score').textContent+'\n\n'+latest.map((r,n)=>`第${n+1}局\n首次：${first[n].ending}\n最近：${r.ending}\n${r.text}`).join('\n\n');const a=node('a'),url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));a.href=url;a.download=M.title+'-喜劇回條.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  for(const[slug,m]of Object.entries(E.meta)){const a=node('a',m.title);a.href=slug+'.html';if(slug===id)a.setAttribute('aria-current','page');$('comedy-nav').append(a);}
  window.ComedyGame=Object.freeze({snapshot:()=>cloneSnapshot()});function cloneSnapshot(){return JSON.parse(JSON.stringify({state,paused,started,first,latest}));}
})();
