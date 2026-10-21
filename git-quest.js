(() => {
  'use strict';
  const E=window.GitEngine,M=window.GitMissions,$=id=>document.getElementById(id);
  const fresh=()=>({env:E.initial(),log:[],history:[],undo:null});
  let lesson=fresh(),sandbox=fresh(),session=lesson,free=false,step=0,passed=false,quizPassed=false,finished=false,hint=false,historyIndex=0;
  let checkpoint=E.clone(lesson.env);
  const proofs=[];
  function entry(input,result) {
    session.log.push({input,output:result.output,ok:result.ok});
    if(session.log.length>500){session.log.shift();session.truncated=true;}
    if(result.clear)$('output').replaceChildren();else drawEntry(session.log.at(-1));
  }
  function drawEntry(e){const n=document.createElement('div');n.className='entry '+(e.ok?'result':'error');n.textContent=(e.input?'$ '+e.input+'\n':'')+e.output;$('output').append(n);while($('output').children.length>100)$('output').firstChild.remove();$('output').scrollTop=$('output').scrollHeight;}
  function redrawLog(){$('output').replaceChildren();session.log.slice(-100).forEach(drawEntry);}
  function loadEditor(){const name=$('file-name').value;$('file-content').value=session.env.work[name]??'';}
  function view(files){return Object.entries(files).map(([n,t])=>n+'\n'+t).join('\n────────\n')||'（空）';}
  function draw(){
    const s=session.env,locked=!free&&(passed||finished),m=M[step];
    $('work-view').textContent=view(s.work);$('index-view').textContent=view(s.index);$('head-view').textContent=view(E.snapshot(s));
    $('branch-label').textContent=(s.ready?'目前分支：':'尚未 init · 預設分支：')+s.branch;
    $('prompt-path').textContent='~/kitchen ['+s.branch+']';
    $('graph').textContent=s.commits.slice().reverse().map(c=>'● '+c.id+' '+c.message+'\n  父版本：'+(c.parent||'無')+'  '+Object.keys(s.branches).filter(b=>s.branches[b]===c.id).map(b=>'['+(b===s.branch?'HEAD → ':'')+b+']').join(' ')).join('\n')||'尚無提交；檔案存在不等於已留下版本。';
    $('lesson-mode').setAttribute('aria-pressed',String(!free));$('sandbox-mode').setAttribute('aria-pressed',String(free));
    const count=finished?M.length:step+(passed&&quizPassed?1:0);$('progress').value=count;$('progress-label').textContent='完成 '+count+' / '+M.length+' 關';
    $('mission-number').textContent=free?'FREE PLAY':finished?'JOURNEY COMPLETE':'MISSION '+String(step+1).padStart(2,'0');
    $('mission-title').textContent=free?'每一版，都自己決定':finished?'你把實驗帶回了主線！':m.title;
    $('goal').textContent=free?'自由試試編輯、暫存、提交、開分支與快轉合併。輸入 help 查看範圍。':finished?'10 關操作與核對已完成。可下載實際紀錄，或到沙盒試著獨立重現。':m.goal;
    $('concept').textContent=free?'沙盒不會覆蓋關卡進度；刷新會清空兩邊，想保留請先下載。':finished?'這能證明遊戲內完成的操作，不等於真實 Git 或 GitHub 設定完成。':m.concept;
    $('lesson-controls').hidden=free||finished;$('free-tools').hidden=!free;$('restart').hidden=free||!finished;
    $('hint').hidden=!hint;$('hint').textContent=m.hint;
    $('feedback').textContent=passed&&!free&&!finished?'✓ 已操作並用指令核對這一關。':'';
    $('next').hidden=free||finished||!passed||!quizPassed;$('next').textContent=step===M.length-1?'完成旅程 →':'下一站 →';
    for(const id of ['command','run','file-name','file-content','apply-file','delete-file'])$(id).disabled=locked;
    $('undo').disabled=locked||!session.undo;
    $('quiz').hidden=free||finished||!passed||!m.quiz;
    if(m.quiz&&!$('quiz').hidden){
      $('quiz-question').textContent=m.quiz.q;
      $('quiz-options').replaceChildren(...m.quiz.options.map((text,i)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.disabled=quizPassed;b.onclick=()=>{quizPassed=i===m.quiz.answer;$('quiz-feedback').textContent=quizPassed?'✓ 正確；依實際保存的位置判斷。':'再看看工作區、暫存區和提交的位置。';draw();if(quizPassed)$('next').focus();};return b;}));
    }
  }
  function run(line){
    if(!line.trim()||(!free&&(passed||finished)))return;
    const before=E.clone(session.env),r=E.execute(session.env,line);
    if(JSON.stringify(before)!==JSON.stringify(session.env))session.undo=before;
    session.history.push(line);session.history=session.history.slice(-100);historyIndex=session.history.length;
    entry(line,r);$('command').value='';
    if(r.event==='switch'||r.event==='merge')loadEditor();
    if(!free&&r.ok&&M[step].check(session.env,r)){
      passed=true;quizPassed=!M[step].quiz;proofs[step]=M[step].title;
    }
    draw();if(passed&&!free)(quizPassed?$('next'):$('quiz-options').querySelector('button')).focus();else $('command').focus();
  }
  $('command-form').onsubmit=e=>{e.preventDefault();run($('command').value);};
  $('command').onkeydown=e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();historyIndex=Math.max(0,Math.min(session.history.length,historyIndex+(e.key==='ArrowUp'?-1:1)));$('command').value=session.history[historyIndex]||'';}};
  function fileAction(action){
    if(!free&&(passed||finished))return;
    const s=session.env,name=$('file-name').value,before=E.clone(s);let r;
    if(action==='edit')r=E.edit(s,name,$('file-content').value);
    else if(Object.hasOwn(s.work,name)){delete s.work[name];r={ok:true,output:'已從工作區刪除 '+name+'；尚未暫存或提交刪除。'};}else r={ok:false,output:'工作區沒有這個檔案。'};
    if(r.ok)session.undo=before;
    entry('〔編輯器：'+(action==='edit'?'套用':'刪除')+' '+name+'〕',r);
    if(r.ok&&action==='edit')entry('',{ok:true,output:'工作檔內容：\n'+s.work[name]});
    draw();
  }
  $('apply-file').onclick=()=>fileAction('edit');$('delete-file').onclick=()=>fileAction('delete');
  $('load-file').onclick=()=>{if(Object.hasOwn(session.env.work,$('file-name').value)){loadEditor();entry('',{ok:true,output:'編輯器已載入 '+$('file-name').value});}else entry('',{ok:false,output:'找不到該檔案；可輸入內容後套用以新增。'});};
  $('hint-button').onclick=()=>{hint=!hint;draw();};
  $('retry').onclick=()=>{session.env=E.clone(checkpoint);session.undo=null;passed=quizPassed=false;hint=false;proofs.length=step;$('quiz-feedback').textContent='';loadEditor();entry('',{ok:true,output:'已回到本關起點；先前操作紀錄保留。'});draw();$('command').focus();};
  $('undo').onclick=()=>{if(!session.undo)return;session.env=session.undo;session.undo=null;loadEditor();entry('',{ok:true,output:'已復原最近一次環境改動；實際 Git 沒有這個遊戲按鈕。'});draw();};
  $('next').onclick=()=>{if(!passed||!quizPassed)return;if(step===M.length-1)finished=true;else {step++;checkpoint=E.clone(lesson.env);passed=quizPassed=false;hint=false;session.undo=null;$('quiz-feedback').textContent='';}draw();$('mission-title').focus();};
  function mode(isFree){free=isFree;session=free?sandbox:lesson;historyIndex=session.history.length;$('command').value='';loadEditor();redrawLog();draw();}
  $('lesson-mode').onclick=()=>mode(false);$('sandbox-mode').onclick=()=>mode(true);
  $('reset-sandbox').onclick=()=>{if(!confirm('重設沙盒的檔案與版本？關卡進度不受影響。'))return;sandbox=fresh();mode(true);};
  $('restart').onclick=()=>{if(!confirm('重開旅程會重置關卡進度；要繼續嗎？'))return;lesson=fresh();step=0;passed=quizPassed=finished=hint=false;checkpoint=E.clone(lesson.env);proofs.length=0;mode(false);};
  const commands=['git init','git status','git add README.md','git add .','git diff','git diff --staged','git commit -m "更新菜單"','git log --oneline','git branch','git switch -c soup','git switch main','git merge soup','help','clear'];
  commands.forEach(text=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=()=>{if($('command').disabled)return;$('command').value=text;$('command').focus();};$('cheats').append(b);});
  $('download').onclick=()=>{
    const record='龍蝦 Git 時光機｜遊戲模擬紀錄（非真實 Git 操作）\n'+(free?'模式：自由沙盒':'模式：10 關旅程')+'\n'+(session.truncated?'〔早期紀錄超過上限，已截斷〕\n':'')+session.log.map(e=>(e.input?'$ '+e.input+'\n':'')+e.output).join('\n\n')+'\n\n本次環境\n工作區：\n'+view(session.env.work)+'\n暫存區：\n'+view(session.env.index)+'\n目前提交：\n'+view(E.snapshot(session.env))+'\n\n'+(!free?'已核對關卡：\n'+proofs.map((p,i)=>(i+1)+'. '+p).join('\n'):'')+'\n\n我自己寫的筆記：\n'+$('reflection').value;
    const url=URL.createObjectURL(new Blob(['\ufeff'+record],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='lobster-git-record.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  entry('',{ok:true,output:'🦞 歡迎來到龍蝦食堂！這是模擬 Git，不會碰你的檔案。想查用法請輸入 help。'});loadEditor();draw();
})();
