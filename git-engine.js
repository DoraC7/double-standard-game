/* Browser-only teaching model: snapshots, a single-parent history, fast-forward merges. */
(function(root) {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const own = (obj, key) => Object.hasOwn(obj, key);
  const same = (a,b) => JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());
  const help = 'git restore [--staged|-S] [--worktree|-W] [--] 檔案…（或 .） · git show [HEAD|分支|提交ID][:檔名] · git show :檔名 · git branch -d 名稱\nrestore --staged 只改暫存區；restore 檔案 會丟棄該檔工作區草稿。show 僅讀取；branch -d 只刪已合入目前分支的本地指標，不模擬 upstream。\ngit init · git status [-sb] · git add [-A|-u] [檔案…] · git diff [--staged|--cached] · git commit [-a] -m "訊息" · git log [--oneline] [-n 筆數] · git branch [名稱] · git switch [-c] 分支 · git checkout [-b] 分支 · git merge 分支（僅快轉）\n建立並切換分支：git switch -c 名稱 或 git checkout -b 名稱。add 接受 ./檔名、多檔與 --；commit 也接受 --message、-m訊息 與 -am。status 支援 --short／--branch，branch 支援 --list／--show-current，merge 支援 --ff-only。checkout 只模擬分支切換，不含還原檔案或 detached HEAD。\n用右側編輯器修改檔案；所有版本都是遊戲模擬，不連接 GitHub。';
  const initial = () => ({ready:false, work:{'README.md':'# 龍蝦食堂\n今日供應：海藻湯\n'}, index:{}, commits:[], branches:{main:null}, branch:'main', serial:0});
  const head = s => s.commits.find(c => c.id === s.branches[s.branch]);
  const snapshot = s => head(s)?.files || {};
  const changes = (a,b) => [...new Set([...Object.keys(a),...Object.keys(b)])].sort().filter(k => a[k] !== b[k]).map(k => ({name:k, kind:!own(a,k)?'新增':!own(b,k)?'刪除':'修改'}));
  const status = s => ({staged:changes(snapshot(s),s.index), unstaged:changes(s.index,s.work)});
  const clean = s => same(s.work,s.index) && same(s.index,snapshot(s));
  const ancestor = (s,a,b) => {while(b){if(a===b)return true;b=s.commits.find(c=>c.id===b)?.parent;}return a===null;};
  const validFile = name => /^[\p{L}\p{N}_-][\p{L}\p{N}_. -]{0,60}$/u.test(name) && !['__proto__','constructor','prototype'].includes(name);
  function edit(s,name,text) {
    if (!validFile(name)) return {ok:false,output:'檔名請用 1–61 個文字、數字、空格、底線、點或短橫線；本練習只處理根目錄檔案。'};
    if (text.length>6000 || (!own(s.work,name) && Object.keys(s.work).length>=15)) return {ok:false,output:'每檔最多 6000 字、最多 15 個工作檔案。'};
    s.work[name]=text; return {ok:true,output:'已修改工作區的 '+name+'；還沒有暫存或提交。',event:'edit',name};
  }
  function tokens(line) {
    const out=[]; let word='',quote='',started=false;
    for(let i=0;i<line.length;i++) {
      const ch=line[i];
      if(ch==='\\'&&quote!=="'"){
        if(i+1>=line.length)throw Error('反斜線後還需要一個字元。');
        if(!quote||/["\\$`]/.test(line[i+1])){word+=line[++i];started=true;continue;}
      }
      if(quote) { if(ch===quote)quote=''; else word+=ch; }
      else if(ch==='"'||ch==="'") {quote=ch;started=true;}
      else if(/\s/.test(ch)) {if(started){out.push(word);word='';started=false;}}
      else if(/[;|&<>`$*?\[\]{}]/.test(ch)) throw Error('一次一條指令；不支援管線、重導向、變數或萬用字元。');
      else {word+=ch;started=true;}
    }
    if(quote)throw Error('引號尚未成對。'); if(started)out.push(word); return out;
  }
  function execute(s,line) {
    const fail=output=>({ok:false,output});
    if(line.length>500)return fail('指令最多 500 字。');
    let words; try{words=tokens(line);}catch(e){return fail(e.message);}
    if(!words.length)return {ok:true,output:''};
    if(words[0]==='help'&&words.length===1)return {ok:true,output:help,event:'help'};
    if(words[0]==='clear'&&words.length===1)return {ok:true,output:'',clear:true};
    if(words[0]!=='git')return fail('這是 Git 模擬器；輸入 help 看支援用法。檔案請用編輯器修改。');
    const [,cmd,...args]=words, usage=()=>fail('本模擬器尚未支援這組參數；不代表真實 Git 不支援。\n'+help);
    const result=(output,event=cmd)=>({ok:true,output,event,args,...(event==='status'?{clean:clean(s),branch:s.branch}:{})});
    if(cmd==='init') {
      if(args.length)return usage();
      if(s.ready)return result('已經初始化；既有紀錄保留。');
      s.ready=true; return result('已建立遊戲內的 Git 倉庫（初始分支 main）。');
    }
    if((cmd==='--version'||cmd==='-v')&&!args.length)return result('git version 2.53.0（遊戲模擬）','version');
    if((cmd==='--help'||cmd==='help')&&!args.length)return result(help,'help');
    if(!s.ready)return fail('還不是 Git 倉庫。先執行 git init。');
    if(cmd==='status') {
      let short=false,branch=false;
      for(const a of args){
        if(a==='--short')short=true;else if(a==='--branch')branch=true;
        else if(/^-[sb]+$/.test(a)){short ||= a.includes('s');branch ||= a.includes('b');}else return usage();
      }
      const t=status(s);
      if(short){
        const mark={新增:'A',修改:'M',刪除:'D'};
        const names=[...new Set([...t.staged,...t.unstaged].map(x=>x.name))].sort();
        return result((branch?['## '+s.branch]:[]).concat(names.flatMap(n=>{
          if(!own(s.index,n)&&!own(snapshot(s),n))return '?? '+n;
          if(!own(s.index,n)&&own(s.work,n))return ['D  '+n,'?? '+n];
          return (mark[t.staged.find(x=>x.name===n)?.kind]||' ')+(mark[t.unstaged.find(x=>x.name===n)?.kind]||' ')+' '+n;
        })).join('\n'));
      }
      return result('目前分支：'+s.branch+'\n'+(!head(s)?'尚無提交\n':'')+'\n已暫存（下次 commit 會收錄）：\n'+(t.staged.map(x=>'  '+x.kind+' '+x.name).join('\n')||'  無')+'\n尚未暫存／未追蹤：\n'+(t.unstaged.map(x=>'  '+x.kind+' '+x.name).join('\n')||'  無')+ (clean(s)?'\n工作目錄乾淨。':''));
    }
    if(cmd==='add') {
      let mode='all',ended=false;const names=[];
      for(const a of args){
        if(!ended&&a==='--'){ended=true;continue;}
        if(!ended&&['-A','--all','-u','--update'].includes(a)){mode=['-u','--update'].includes(a)?'tracked':'all';continue;}
        if(!ended&&a.startsWith('-'))return usage();
        if(!a)return fail('檔案路徑不可為空字串。');
        names.push(a.replace(/^(?:\.\/)+/,''));
      }
      if(!names.length&&args.length===0)return usage();
      const all=!names.length||names.includes('.')||names.includes('');
      const selected=all?[...new Set([...Object.keys(s.work),...Object.keys(s.index)])]:names;
      for(const n of [...selected,...names.filter(n=>n&&n!=='.')])if(!own(s.work,n)&&!own(s.index,n))return fail('找不到檔案：'+n);
      for(const n of selected){
        if(mode==='tracked'&&!own(s.index,n))continue;
        if(own(s.work,n))s.index[n]=s.work[n];else delete s.index[n];
      }
      return result('已更新暫存區；commit 仍未發生。請用 git status 或 git diff --staged 核對。');
    }
    if(cmd==='diff') {
      if(args.length>1||(args.length===1&&!['--staged','--cached'].includes(args[0])))return usage();
      const a=args.length?snapshot(s):s.index, b=args.length?s.index:s.work;
      // Real git diff omits untracked files. Keep that distinction here too.
      const files=changes(a,b).filter(x=>args.length||own(s.index,x.name));
      return {...result(files.map(x=>'--- '+x.name+'（'+x.kind+'；整份舊／新內容比較）\n'+(own(a,x.name)?a[x.name].split('\n').map(l=>'- '+l).join('\n'):'（原本不存在）')+'\n'+(own(b,x.name)?b[x.name].split('\n').map(l=>'+ '+l).join('\n'):'（已刪除）')).join('\n\n')||'沒有差異。未追蹤檔請用 git status 查看。',args.length?'diff-staged':'diff'),comparisons:files.map(x=>({name:x.name,before:a[x.name],after:b[x.name]}))};
    }
    if(cmd==='commit') {
      let message=null,auto=false;
      for(let i=0;i<args.length;i++){
        const a=args[i];
        if(a==='-a'||a==='--all'){auto=true;continue;}
        if(a==='-m'||a==='--message'||a==='-am'){if(a==='-am')auto=true;if(message!==null||++i>=args.length)return usage();message=args[i];}
        else if(a.startsWith('--message=')){if(message!==null)return usage();message=a.slice(10);}
        else if(a.startsWith('-am')||a.startsWith('-m')){if(message!==null)return usage();auto ||= a.startsWith('-am');message=a.slice(auto&&a.startsWith('-am')?3:2);}
        else return usage();
      }
      if(message===null||!message.trim())return usage();
      const nextIndex=clone(s.index);
      if(auto)for(const n of Object.keys(s.index)){if(own(s.work,n))nextIndex[n]=s.work[n];else delete nextIndex[n];}
      if(same(nextIndex,snapshot(s)))return fail('沒有可提交的暫存變更。修改工作檔案不等於已暫存。');
      if(s.commits.length>=80)return fail('沙盒最多保留 80 個提交，請重設後再練。');
      s.index=nextIndex;
      const id=(++s.serial).toString(16).padStart(7,'0');
      s.commits.push({id,parent:s.branches[s.branch],message,files:clone(s.index)}); s.branches[s.branch]=id;
      return {...result('['+s.branch+' '+id+'] '+message+(auto?'\n已先暫存追蹤檔的修改／刪除，再保存快照；未追蹤新檔不包含在內。':'\n已保存暫存區快照；未暫存的修改不包含在內。')),auto,commitId:id};
    }
    if(cmd==='log') {
      let limit=80;
      for(let i=0;i<args.length;i++){
        const a=args[i];if(a==='--oneline')continue;
        let n;
        if(a==='-n'||a==='--max-count'){if(++i>=args.length)return usage();n=args[i];}
        else if(/^--max-count=/.test(a))n=a.slice(12);
        else if(/^-n?\d+$/.test(a))n=a.replace(/^-n?/,'');else return usage();
        if(!/^\d+$/.test(n))return usage();limit=Math.min(Number(n),80);
      }
      const rows=[],logIds=[];let c=head(s);
      while(c&&rows.length<limit){rows.push(c.id+' '+c.message);logIds.push(c.id);c=s.commits.find(x=>x.id===c.parent);}
      return {...result(rows.join('\n')||(!head(s)?'目前分支還沒有提交。':'')),logIds};
    }
    if(cmd==='restore') {
      let staged=false,worktree=false,ended=false;const names=[];
      for(const a of args){
        if(!ended&&a==='--'){ended=true;continue;}
        if(!ended&&a==='--staged'){staged=true;continue;}
        if(!ended&&a==='--worktree'){worktree=true;continue;}
        if(!ended&&/^-[SW]+$/.test(a)){staged ||= a.includes('S');worktree ||= a.includes('W');continue;}
        if(!ended&&a.startsWith('-'))return usage();
        if(!a)return fail('檔案路徑不可為空字串。');
        names.push(a.replace(/^(?:\.\/)+/,''));
      }
      if(!names.length)return usage();
      if(staged&&!head(s))return fail('尚無 HEAD 提交，不能從 HEAD 還原暫存區。');
      // With --staged the default source is HEAD; otherwise it is the index.
      const source=staged?snapshot(s):s.index,targets=names.some(n=>n==='.'||n==='')?[...new Set([...Object.keys(source),...Object.keys(s.index)])]:names;
      for(const n of [...targets,...names.filter(n=>n&&n!=='.')])if(!own(source,n)&&!own(s.index,n))return fail('找不到已追蹤的路徑：'+n+'；未追蹤新檔不會被 restore 刪除。');
      const nextWork=clone(s.work),nextIndex=clone(s.index);
      for(const n of targets){
        if(staged){if(own(source,n))nextIndex[n]=source[n];else delete nextIndex[n];}
        if(worktree||!staged){if(own(source,n))nextWork[n]=source[n];else delete nextWork[n];}
      }
      if(Object.keys(nextWork).length>15)return fail('還原後會超過 15 個工作檔案，請先整理。');
      const changed=!same(s.work,nextWork)||!same(s.index,nextIndex);s.work=nextWork;s.index=nextIndex;
      return {...result(staged&&!worktree?'已從 HEAD 還原暫存區；工作區內容保留，尚未建立提交。':'已還原工作區；指定檔案尚未保存的修改會被取代。請用 diff／status 核對。'),targets,staged,changed,worktree:worktree||!staged};
    }
    if(cmd==='show') {
      if(args.length>1||args[0]?.startsWith('-'))return usage();
      const spec=args[0]??'HEAD',colon=spec.indexOf(':'),ref=colon<0?spec:spec.slice(0,colon),name=colon<0?null:spec.slice(colon+1);
      let files,c;
      if(ref==='')files=s.index;
      else {const id=ref==='HEAD'?s.branches[s.branch]:own(s.branches,ref)?s.branches[ref]:ref;c=s.commits.find(x=>x.id===id);if(!c)return fail('找不到已提交的版本：'+ref);files=c.files;}
      if(name!==null){if(!own(files,name))return fail('該版本沒有檔案：'+name);return {...result(files[name]),ref,name,commitId:c?.id};}
      if(!c)return usage();
      return {...result(c.id+' '+c.message+'\n'+changes(s.commits.find(x=>x.id===c.parent)?.files||{},files).map(x=>x.kind+' '+x.name).join('\n')),commitId:c.id};
    }
    const validBranch = name => /^[a-zA-Z][a-zA-Z0-9_/-]{0,59}$/.test(name) && name.split('/').every(p=>p&&p!=='@') && !['__proto__','constructor','prototype','HEAD'].includes(name);
    function create(name) {
      if(!head(s))return '先做第一個 commit，再建立分支。';
      if(!validBranch(name))return '分支名稱請用英文字母開頭，搭配英數、底線、短橫線或 /（最多 60 字，不可有空白路徑段）。';
      if(own(s.branches,name))return '分支已存在。';
      if(Object.keys(s.branches).some(b=>b.startsWith(name+'/')||name.startsWith(b+'/')))return '分支名稱與既有分支路徑衝突。';
      if(Object.keys(s.branches).length>=15)return '最多 15 個分支。';
      return '';
    }
    if(cmd==='branch') {
      if(args[0]==='-d'||args[0]==='--delete'){
        const name=args[1];if(args.length!==2||!name||name.startsWith('-'))return usage();
        if(!own(s.branches,name))return fail('找不到分支：'+name);
        if(name===s.branch)return fail('不能刪除目前所在的分支。');
        if(!ancestor(s,s.branches[name],s.branches[s.branch]))return fail('該分支尚未完整合入目前分支；保留分支，不模擬強制刪除。');
        delete s.branches[name];return {...result('已刪除合入目前分支的本地分支 '+name+'；提交仍保留，沒有操作遠端分支。','branch-delete'),name};
      }
      if(args.length>1)return usage();
      if(args.length===1&&args[0]==='--show-current')return result(s.branch);
      if(args.length===1&&['--list','-l'].includes(args[0]))args.length=0;
      if(!args.length)return result(Object.keys(s.branches).map(b=>(s.branch===b?'* ':'  ')+b+' → '+(s.branches[b]||'尚無提交')).join('\n'));
      const error=create(args[0]);if(error)return fail(error);
      s.branches[args[0]]=s.branches[s.branch];return result('已建立 '+args[0]+'，但目前仍在 '+s.branch+'。');
    }
    if(cmd==='switch'||cmd==='checkout') {
      const make=(cmd==='checkout'?['-b']:['-c','--create']).includes(args[0]),name=args[make?1:0];
      if(args.length!==(make?2:1)||!name||name.startsWith('-'))return usage();
      if(!clean(s))return fail('本練習要求先提交所有變更再切換，避免覆蓋；真實 Git 有時允許攜帶不衝突的變更。');
      if(make){const error=create(name);if(error)return fail(error);s.branches[name]=s.branches[s.branch];}
      if(!own(s.branches,name))return fail('找不到分支：'+name);
      s.branch=name;s.index=clone(snapshot(s));s.work=clone(s.index);return result('已切換到 '+name+'；工作區與暫存區對齊該分支。','switch');
    }
    if(cmd==='merge') {
      const operands=args.filter(a=>a!=='--ff-only');
      if(operands.length!==1||operands[0].startsWith('-'))return usage();const name=operands[0];
      if(!own(s.branches,name))return fail('找不到分支：'+name);
      if(!clean(s))return fail('本練習要求乾淨的工作目錄才能合併。');
      const here=s.branches[s.branch],there=s.branches[name];
      if(ancestor(s,there,here))return result('已經包含該分支的歷史，不需合併。');
      if(!ancestor(s,here,there))return fail('兩邊已有各自提交；本練習只支援 fast-forward，尚未模擬三方合併或衝突。資料保持原狀。');
      s.branches[s.branch]=there;s.index=clone(snapshot(s));s.work=clone(s.index);
      return result('Fast-forward：'+s.branch+' 指向 '+there+'。沒有額外建立 merge commit。');
    }
    return fail('本模擬器尚未實作這個 Git 子指令；不代表真實 Git 不支援。\n'+help);
  }
  const api={initial,clone,head,snapshot,status,clean,edit,execute,changes,help};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GitEngine=api;
})(typeof window!=='undefined'?window:globalThis);
