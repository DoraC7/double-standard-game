/* Browser-only teaching model: snapshots, a single-parent history, fast-forward merges. */
(function(root) {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const own = (obj, key) => Object.hasOwn(obj, key);
  const same = (a,b) => JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());
  const help = 'git init · git status · git add README.md / . · git diff [--staged] · git commit -m "訊息" · git log [--oneline] · git branch [名稱] · git switch [-c] 分支 · git checkout [-b] 分支 · git merge 分支（僅快轉）\n建立並切換分支：git switch -c 名稱 或 git checkout -b 名稱。checkout 只模擬分支切換，不含還原檔案或 detached HEAD。\n用右側編輯器修改檔案；所有版本都是遊戲模擬，不連接 GitHub。';
  const initial = () => ({ready:false, work:{'README.md':'# 龍蝦食堂\n今日供應：海藻湯\n'}, index:{}, commits:[], branches:{main:null}, branch:'main', serial:0});
  const head = s => s.commits.find(c => c.id === s.branches[s.branch]);
  const snapshot = s => head(s)?.files || {};
  const changes = (a,b) => [...new Set([...Object.keys(a),...Object.keys(b)])].sort().filter(k => a[k] !== b[k]).map(k => ({name:k, kind:!own(a,k)?'新增':!own(b,k)?'刪除':'修改'}));
  const status = s => ({staged:changes(snapshot(s),s.index), unstaged:changes(s.index,s.work)});
  const clean = s => same(s.work,s.index) && same(s.index,snapshot(s));
  const validFile = name => /^[\p{L}\p{N}_-][\p{L}\p{N}_. -]{0,60}$/u.test(name) && !['__proto__','constructor','prototype'].includes(name);
  function edit(s,name,text) {
    if (!validFile(name)) return {ok:false,output:'檔名請用 1–61 個文字、數字、空格、底線、點或短橫線；本練習只處理根目錄檔案。'};
    if (text.length>6000 || (!own(s.work,name) && Object.keys(s.work).length>=15)) return {ok:false,output:'每檔最多 6000 字、最多 15 個工作檔案。'};
    s.work[name]=text; return {ok:true,output:'已修改工作區的 '+name+'；還沒有暫存或提交。',event:'edit',name};
  }
  function tokens(line) {
    const out=[]; let word='',quote='',started=false;
    for(const ch of line) {
      if(quote) { if(ch===quote)quote=''; else word+=ch; }
      else if(ch==='"'||ch==="'") {quote=ch;started=true;}
      else if(/\s/.test(ch)) {if(started){out.push(word);word='';started=false;}}
      else if(/[;|&<>`$\\]/.test(ch)) throw Error('一次一條指令；不支援管線、重導向、變數或跳脫字元。');
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
    const [,cmd,...args]=words, usage=()=>fail(help);
    const result=(output,event=cmd)=>({ok:true,output,event,args});
    if(cmd==='init') {
      if(args.length)return usage();
      if(s.ready)return result('已經初始化；既有紀錄保留。');
      s.ready=true; return result('已建立遊戲內的 Git 倉庫（初始分支 main）。');
    }
    if(!s.ready)return fail('還不是 Git 倉庫。先執行 git init。');
    if(cmd==='status') {
      if(args.length)return usage(); const t=status(s);
      return result('目前分支：'+s.branch+'\n'+(!head(s)?'尚無提交\n':'')+'\n已暫存（下次 commit 會收錄）：\n'+(t.staged.map(x=>'  '+x.kind+' '+x.name).join('\n')||'  無')+'\n尚未暫存／未追蹤：\n'+(t.unstaged.map(x=>'  '+x.kind+' '+x.name).join('\n')||'  無')+ (clean(s)?'\n工作目錄乾淨。':''));
    }
    if(cmd==='add') {
      if(args.length!==1)return usage(); const name=args[0];
      if(name==='.')s.index=clone(s.work);
      else {
        if(!own(s.work,name)&&!own(s.index,name))return fail('找不到檔案：'+name);
        if(own(s.work,name))s.index[name]=s.work[name]; else delete s.index[name];
      }
      return result('已更新暫存區；commit 仍未發生。請用 git status 或 git diff --staged 核對。');
    }
    if(cmd==='diff') {
      if(args.length>1||(args.length===1&&args[0]!=='--staged'))return usage();
      const a=args.length?snapshot(s):s.index, b=args.length?s.index:s.work;
      // Real git diff omits untracked files. Keep that distinction here too.
      const files=changes(a,b).filter(x=>args.length||own(s.index,x.name));
      return result(files.map(x=>'--- '+x.name+'（'+x.kind+'；整份舊／新內容比較）\n'+(own(a,x.name)?a[x.name].split('\n').map(l=>'- '+l).join('\n'):'（原本不存在）')+'\n'+(own(b,x.name)?b[x.name].split('\n').map(l=>'+ '+l).join('\n'):'（已刪除）')).join('\n\n')||'沒有差異。未追蹤檔請用 git status 查看。',args.length?'diff-staged':'diff');
    }
    if(cmd==='commit') {
      if(args.length!==2||args[0]!=='-m'||!args[1].trim())return usage();
      if(same(s.index,snapshot(s)))return fail('沒有可提交的暫存變更。修改工作檔案不等於已暫存。');
      if(s.commits.length>=80)return fail('沙盒最多保留 80 個提交，請重設後再練。');
      const id=(++s.serial).toString(16).padStart(7,'0');
      s.commits.push({id,parent:s.branches[s.branch],message:args[1],files:clone(s.index)}); s.branches[s.branch]=id;
      return result('['+s.branch+' '+id+'] '+args[1]+'\n已保存暫存區快照；未暫存的修改不包含在內。');
    }
    if(cmd==='log') {
      if(args.length>1||(args.length&&args[0]!=='--oneline'))return usage();
      const rows=[];let c=head(s);
      while(c){rows.push(c.id+' '+c.message);c=s.commits.find(x=>x.id===c.parent);}
      return result(rows.join('\n')||'目前分支還沒有提交。');
    }
    const validBranch = name => /^[a-zA-Z][a-zA-Z0-9_-]{0,29}$/.test(name) && !['__proto__','constructor','prototype','HEAD'].includes(name);
    function create(name) {
      if(!head(s))return '先做第一個 commit，再建立分支。';
      if(!validBranch(name))return '分支名稱請用英文字母開頭，搭配英數、底線或短橫線（最多 30 字）。';
      if(own(s.branches,name))return '分支已存在。';
      if(Object.keys(s.branches).length>=15)return '最多 15 個分支。';
      return '';
    }
    if(cmd==='branch') {
      if(args.length>1)return usage();
      if(!args.length)return result(Object.keys(s.branches).map(b=>(s.branch===b?'* ':'  ')+b+' → '+(s.branches[b]||'尚無提交')).join('\n'));
      const error=create(args[0]);if(error)return fail(error);
      s.branches[args[0]]=s.branches[s.branch];return result('已建立 '+args[0]+'，但目前仍在 '+s.branch+'。');
    }
    if(cmd==='switch'||cmd==='checkout') {
      const make=args[0]===(cmd==='checkout'?'-b':'-c'),name=args[make?1:0];
      if(args.length!==(make?2:1)||!name||name.startsWith('-'))return usage();
      if(!clean(s))return fail('本練習要求先提交所有變更再切換，避免覆蓋；真實 Git 有時允許攜帶不衝突的變更。');
      if(make){const error=create(name);if(error)return fail(error);s.branches[name]=s.branches[s.branch];}
      if(!own(s.branches,name))return fail('找不到分支：'+name);
      s.branch=name;s.index=clone(snapshot(s));s.work=clone(s.index);return result('已切換到 '+name+'；工作區與暫存區對齊該分支。','switch');
    }
    if(cmd==='merge') {
      if(args.length!==1)return usage();const name=args[0];
      if(!own(s.branches,name))return fail('找不到分支：'+name);
      if(!clean(s))return fail('本練習要求乾淨的工作目錄才能合併。');
      const ancestor=(a,b)=>{while(b){if(a===b)return true;b=s.commits.find(c=>c.id===b)?.parent;}return a===null;};
      const here=s.branches[s.branch],there=s.branches[name];
      if(ancestor(there,here))return result('已經包含該分支的歷史，不需合併。');
      if(!ancestor(here,there))return fail('兩邊已有各自提交；本練習只支援 fast-forward，尚未模擬三方合併或衝突。資料保持原狀。');
      s.branches[s.branch]=there;s.index=clone(snapshot(s));s.work=clone(s.index);
      return result('Fast-forward：'+s.branch+' 指向 '+there+'。沒有額外建立 merge commit。');
    }
    return fail('本模擬器尚未實作這個 Git 子指令；不代表真實 Git 不支援。\n'+help);
  }
  const api={initial,clone,head,snapshot,status,clean,edit,execute,changes,help};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GitEngine=api;
})(typeof window!=='undefined'?window:globalThis);
