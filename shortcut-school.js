(() => {
  'use strict';
  const E=ShortcutSchool,$=id=>document.getElementById(id);
  const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  let profile='windows',state=null,selected=new Set();
  const modifiers=['Ctrl','Cmd','Alt','Super','Shift'];
  const keyLabel=k=>k==='Cmd'?'Cmd ⌘':k==='Alt'&&profile==='mac'?'Option ⌥':k==='Super'&&profile==='windows'?'Win':k;
  const chord=keys=>keys.map(keyLabel).join(' + ');
  function keycaps(keys){const row=el('span',undefined,'chord');keys.forEach((key,i)=>{if(i)row.append(el('span','+'));row.append(el('kbd',keyLabel(key)));});return row;}
  function reference(){
    const filter=$('reference-filter').value;
    $('reference-list').replaceChildren();
    E.tasks(profile).filter(t=>filter==='all'||t.scope===filter).forEach(t=>{const card=el('article',undefined,'reference-card');card.append(el('h3',t.title),keycaps(t.keys));t.alternatives.forEach(keys=>card.append(el('p','也可用：'),keycaps(keys)));card.append(el('p',t.context),el('p',t.note));$('reference-list').append(card);});
  }
  function selectProfile(next){
    profile=next;state=null;selected.clear();$('intro').hidden=false;$('lesson').hidden=true;$('result').hidden=true;
    $('platform-note').textContent=E.profiles[profile].note+' 切換平台會從第 1 關重新開始。';
    document.querySelectorAll('[data-os]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.os===(['gnome','kde'].includes(profile)?'linux':profile))));
    $('linux-choice').hidden=!['gnome','kde'].includes(profile);reference();
  }
  function paintKeys(){
    document.querySelectorAll('#keydeck button').forEach(b=>{b.setAttribute('aria-pressed',String(selected.has(b.dataset.key)));b.disabled=state.solved||!!state.pending;});
    $('combo').textContent=selected.size?chord([...selected].sort((a,b)=>E.keyOrder.indexOf(a)-E.keyOrder.indexOf(b))):'還沒選鍵';
    $('try').disabled=state.solved||!!state.pending;$('clear').disabled=state.solved||!!state.pending;$('hint').disabled=state.solved||!!state.pending;
  }
  function buildKeys(){
    $('keydeck').replaceChildren();
    const keys=[...(profile==='mac'?['Cmd','Ctrl','Alt','Shift']:['Ctrl','Alt','Super','Shift']),...E.keyOrder.filter(k=>!modifiers.includes(k))];
    keys.forEach(key=>{const b=el('button',keyLabel(key),'keycap'+(modifiers.includes(key)?' modifier':'')+(['Return','Super'].includes(key)?' wide':''));b.type='button';b.dataset.key=key;b.setAttribute('aria-label','鍵帽 '+keyLabel(key));b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{if(selected.has(key))selected.delete(key);else{if(!modifiers.includes(key))for(const old of selected)if(!modifiers.includes(old))selected.delete(old);selected.add(key);}paintKeys();});$('keydeck').append(b);});paintKeys();
  }
  function renderScene(){
    const v=state.scene,t=E.current(state),p=E.profiles[profile];
    $('desktop-label').textContent=p.label;$('clipboard').textContent=v.clipboard||'（空的）';
    const app=el('article',undefined,'app-window');app.setAttribute('aria-label',v.app==='notes'?'模擬記事本':'模擬'+p.fileApp);
    const bar=el('div',undefined,'window-bar');for(let i=0;i<3;i++){const dot=el('i',undefined,'window-dot');dot.setAttribute('aria-hidden','true');bar.append(dot);}bar.append(el('b',v.app==='notes'?'旅行備忘.txt · 圖形介面記事本':p.fileApp+' · 文件'));
    const content=el('div',undefined,'window-body');
    if(v.app==='notes'){
      const text=el('p',undefined,'note-text'+(v.selected?' selected':''));
      if(v.found){const i=v.text.indexOf(v.query);text.append(document.createTextNode(v.text.slice(0,i)),el('mark',v.query),document.createTextNode(v.text.slice(i+v.query.length)));}else text.textContent=v.text||'（這段文字已剪下）';
      content.append(text,el('p',v.saved?'已儲存到本頁模擬檔案（重新整理清空）':'尚未儲存 · 僅為模擬情境','save-state'+(v.saved?' saved':'')));
      if(v.selected)content.append(el('p','反白選取中','small'));
    }else{
      const grid=el('div',undefined,'file-grid');v.files.forEach(name=>{const item=el('div',undefined,'file-item'+(v.selectedFile===name?' selected':''));const icon=el('i',undefined,'file-symbol'+(name.endsWith('.txt')?' document':''));icon.setAttribute('aria-hidden','true');item.append(icon,el('span',name));grid.append(item);});content.append(grid);
    }
    if(state.pending){
      const form=el('form',undefined,'sim-form');const labels={find:'搜尋文件內的文字',folder:'新資料夾名稱',rename:'重新命名為'};
      const label=el('label',labels[state.pending]);label.htmlFor='sim-input';const input=el('input');input.id='sim-input';input.type='text';input.maxLength=60;input.autocomplete='off';input.value=state.pending==='rename'?'未命名資料夾':'';
      const submit=el('button',state.pending==='find'?'搜尋':state.pending==='folder'?'確認建立':'確認重新命名','primary');submit.type='submit';
      form.append(label,input,submit);form.addEventListener('submit',event=>{event.preventDefault();const result=E.apply(state,input.value);if(result.status==='wrong'){feedback('請依任務輸入「'+result.expected+'」，再確認一次。',true);input.focus();return;}renderScene();finishStep();});content.append(form);
    }
    app.append(bar,content);$('scene').replaceChildren(app);
    if(v.windows>1){const second=app.cloneNode(true);second.classList.add('second-window');second.querySelector('.window-bar b').textContent=p.fileApp+' · 新視窗（第 2 個）';$('scene').append(second);}
    if(t.id==='switch'){const dock=el('div',undefined,'sim-dock');dock.setAttribute('aria-label','兩個已開啟程式，目前'+(v.app==='notes'?'記事本':'檔案管理員')+'在前面');dock.append(el('span','記事本'+(v.app==='notes'?' · 前景':''),v.app==='notes'?'active':''),el('span',p.fileApp+(v.app==='files'?' · 前景':''),v.app==='files'?'active':''));$('scene').append(dock);if(state.solved)$('scene').append(el('div','記事本仍開著，沒有被關閉。','stack-note'));}
    if(state.pending){$('sim-input').focus();if(state.pending==='rename')$('sim-input').select();}
  }
  function feedback(text,error=false){$('feedback').textContent=text;$('feedback').classList.toggle('error',error);}
  function finishStep(){
    const t=E.current(state);feedback('完成！'+chord(t.keys)+'\n'+t.note);$('next').hidden=false;$('next').textContent=state.index===11?'看本輪回顧 →':'下一關 →';paintKeys();$('progress').value=state.answers.length;$('independent').textContent='首次完成 '+state.answers.filter(a=>a.first).length+' 關';$('next').focus();
  }
  function renderMission(){
    const t=E.current(state);selected.clear();$('lesson').hidden=false;$('result').hidden=true;$('intro').hidden=true;
    $('round').textContent=(state.index+1)+' / 12';$('progress').value=state.answers.length;$('context').textContent=t.context;$('mission-title').textContent=t.title;$('goal').textContent=t.goal;$('next').hidden=true;$('hint-text').hidden=true;feedback('');buildKeys();renderScene();$('mission-title').focus();$('lesson').scrollIntoView({block:'start',behavior:'auto'});
  }
  function start(){state=E.create(profile);$('independent').textContent='首次完成 0 關';renderMission();}
  function result(){
    $('lesson').hidden=true;$('result').hidden=false;const first=state.answers.filter(a=>a.first).length;$('result-summary').textContent=E.profiles[profile].label+' · 完成 '+state.answers.length+' / 12 關，其中 '+first+' 關首次完成（未看提示）。';$('review').replaceChildren();
    state.answers.forEach((a,i)=>{const t=E.tasks(profile)[i];const li=el('li',t.title+' · '+chord(a.keys));li.append(el('span',(a.first?'首次完成':a.usedHint?'看過提示後完成':'重試後完成')+' · 組合嘗試 '+a.attempts+' 次'+(a.formMistakes?' · 輸入修正 '+a.formMistakes+' 次':'')+'。'+t.note));$('review').append(li);});$('result-title').focus();$('result').scrollIntoView({block:'start',behavior:'auto'});
  }
  document.querySelectorAll('[data-os]').forEach(b=>b.addEventListener('click',()=>selectProfile(b.dataset.os==='linux'?$('linux-desktop').value:b.dataset.os)));
  $('linux-desktop').addEventListener('change',()=>selectProfile($('linux-desktop').value));$('reference-filter').addEventListener('change',reference);$('start').addEventListener('click',start);$('restart').addEventListener('click',start);
  $('clear').addEventListener('click',()=>{selected.clear();paintKeys();});
  $('hint').addEventListener('click',()=>{const keys=E.hint(state);if(keys){$('hint-text').textContent='本關組合：'+chord(keys)+'。先按住修飾鍵，再按最後一鍵；這裡請點選鍵帽。';$('hint-text').hidden=false;}});
  $('try').addEventListener('click',()=>{const r=E.submit(state,[...selected]);if(r.status==='empty'){feedback('先選一組鍵帽，再試試看。');return;}if(r.status==='wrong'){feedback('這不是本關練的組合。先看目前程式與任務；可以清空重選，或看提示。',true);return;}if(r.status==='locked')return;renderScene();if(r.status==='input'){feedback('組合正確！接著在模擬視窗的輸入框完成任務。');paintKeys();}else finishStep();});
  $('next').addEventListener('click',()=>{if(!E.next(state))return;if(state.phase==='result')result();else renderMission();});
  selectProfile('windows');
})();
