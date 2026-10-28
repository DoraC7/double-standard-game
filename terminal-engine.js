/* A deliberately small, browser-only POSIX-style practice environment. No eval or real shell. */
(function (root) {
  'use strict';
  const HOME = '/home/lobster';
  const GUIDE = '歡迎來到龍蝦遊戲間！\n先看位置，再看內容，改動之後再驗證。\n資料夾用 cd 進入；文字檔用 cat 閱讀。\n檔名分大小寫。$ 是提示字元，不是指令的一部分。';
  const commands = ['pwd', 'ls', 'cd', 'cat', 'mkdir', 'touch', 'cp', 'mv', 'rm', 'rmdir', 'find', 'grep', 'head', 'tail', 'clear', 'git', 'uname', 'help'];
  const LOG = '09:00 INFO workshop started\n09:01 INFO read README\n09:02 ERROR missing menu.txt\n09:03 INFO checked path\n09:04 INFO created menu.txt\n09:05 ERROR upload not attempted\n09:06 INFO local checks passed\n09:07 INFO workshop ended\n';
  const help = {
    pwd: 'pwd [-L|-P]：顯示目前所在的完整路徑，不會搬動檔案。',
    ls: 'ls [-laAh1] [路徑…]：列出內容；-a／--all 含隱藏項目和 .、..，-A／--almost-all 不含 .、..；-l 長格式（權限／時間為遊戲示意），-1 每行一項，-h 顯示易讀大小。可合併成 -la。',
    cd: 'cd 路徑：切換資料夾。cd .. 回上一層；cd 或 cd ~ 回家；cd - 回上一個位置。',
    cat: 'cat [--] 檔案…：依序讀文字內容，不是進入檔案。可用引號包住含空白的檔名。',
    mkdir: 'mkdir [-p|--parents] 資料夾…：建立資料夾，不會自動進入；-p 可建立多層且接受已存在的資料夾。',
    touch: 'touch [--] 檔案…：不存在時建立空白檔；已存在時不清空內容。本練習不模擬時間戳記。',
    cp: 'cp [--] 來源檔… 目的檔或資料夾：複製檔案，來源保留。本練習不支援目錄複製。',
    mv: 'mv [--] 來源檔… 目的檔或資料夾：搬移或改名，舊位置不再保留。本練習只搬檔案。',
    rm: 'rm [--] 檔案…：刪除檔案；不會進垃圾桶。本練習不支援 -r、-f 或萬用字元。',
    rmdir: 'rmdir [--] 資料夾…：只刪除空資料夾。',
    find: 'find [起點] [-type f|d] [-name "樣式"]：從起點往下找路徑；f 是檔案、d 是資料夾。-name 只比對檔名，支援引號中的 *、?；這裡不模擬 -exec、-delete 或其他運算式。',
    grep: 'grep -F [-nivc] [--] "文字" 檔案…：以固定文字搜尋內容；-n 顯示行號，-i 忽略大小寫，-v 反選，-c 計算符合行數。可用 -nF 合併；本練習只實作 -F，不實作正規表示式；另支援 --fixed-strings／--line-number／--ignore-case／--invert-match／--count。無符合行時回報未找到，不是路徑錯誤。',
    head: 'head [-n 筆數|--lines=筆數] [--] 檔案：讀取開頭幾行，預設 10 行；也接受 -2 這類筆數寫法，上限 10000 行；不會修改檔案。不模擬標準輸入或負數筆數。',
    tail: 'tail [-n 筆數|--lines=筆數] [--] 檔案：讀取最後幾行，預設 10 行；也接受 -2 這類筆數寫法，上限 10000 行；不會修改檔案。不模擬 -f、標準輸入或 +起始行。',
    clear: 'clear：清除終端機畫面，不改動資料夾、檔案或目前位置。完整文字紀錄仍可匯出。',
    git: 'git --version 或 git -v：顯示本練習的模擬版本，不會安裝 Git，也不能證明你電腦有 Git。',
    uname: 'uname：顯示系統名稱；-a 顯示全部，-s／-n／-r／-v／-m 分別顯示系統名稱、主機名稱、核心發行版、核心版本、硬體類型，可合併使用。也支援 --all、--kernel-name、--nodename、--kernel-release、--kernel-version、--machine。這裡只顯示虛構的遊戲系統，不會偵測你的電腦。',
    help: 'help 或 help 指令：查看本練習支援的用法。這裡不是完整 Bash／zsh。'
  };
  const dir = () => ({ type: 'dir' });
  const file = content => ({ type: 'file', content });
  function initial() {
    return { cwd: HOME, nodes: {
      '/': dir(), '/home': dir(), [HOME]: dir(), [HOME + '/arcade']: dir(),
      [HOME + '/arcade/README.txt']: file(GUIDE),
      [HOME + '/arcade/logs']: dir(), [HOME + '/arcade/logs/workshop.log']: file(LOG),
      [HOME + '/downloads']: dir(), [HOME + '/downloads/hello.txt']: file('小龍蝦說：你好，terminal！'),
      [HOME + '/.shell-note']: file('隱藏檔只是檔名以 . 開頭，不代表加密或安全。')
    }};
  }
  const clone = state => JSON.parse(JSON.stringify(state));
  function resolve(state, raw = '~', expandTilde = true, missingParents = false) {
    if (!raw) throw Error('路徑不可為空字串。');
    let path = raw;
    if (expandTilde && (path === '~' || path.startsWith('~/'))) path = HOME + path.slice(1);
    if (!path.startsWith('/')) path = state.cwd + '/' + path;
    const parts = [], segments = path.split('/');
    for (let i = 0; i < segments.length; i++) {
      const part = segments[i];
      if (!part) continue;
      const current = '/' + parts.join('/'), node = state.nodes[current];
      if (node?.type !== 'dir' && !(missingParents && !node)) throw Error(current + '：上層路徑不存在或不是資料夾。');
      if (part === '.') continue;
      if (part === '..') parts.pop(); else parts.push(part);
    }
    return '/' + parts.join('/');
  }
  const parent = path => path.slice(0, path.lastIndexOf('/')) || '/';
  const basename = path => path.slice(path.lastIndexOf('/') + 1);
  // Bounded wildcard matching, without regex backtracking on player-supplied patterns.
  function matchesName(name,pattern) {
    let row=Array(name.length+1).fill(false);row[0]=true;
    for(const char of pattern){const next=Array(name.length+1).fill(false);next[0]=char==='*'&&row[0];
      for(let j=1;j<=name.length;j++)next[j]=char==='*'?(row[j]||next[j-1]):row[j-1]&&(char==='?'||char===name[j-1]);row=next;
    }return row[name.length];
  }
  function children(state, path) {
    return Object.keys(state.nodes).filter(key => key !== path && parent(key) === path).sort();
  }
  function tokenize(line) {
    const tokens = []; let word = '', quote = '', started = false, tilde = false;
    const push = () => { tokens.push({text:word,tilde}); word='';started=false;tilde=false; };
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '\\' && quote !== "'") {
        if (i+1 >= line.length) throw Error('反斜線後還需要一個字元。');
        if (!quote || /["\\$`]/.test(line[i+1])) {word += line[++i];started=true;continue;}
      }
      if (quote) { if (char === quote) quote = ''; else word += char;
      } else if (char === '"' || char === "'") { quote = char; started = true;
      } else if (/\s/.test(char)) { if (started) push();
      } else if (/[;|&<>`$*?\[\]{}]/.test(char)) {
        throw Error('這個練習一次執行一條指令，不支援管線、重導向、變數或萬用字元。');
      } else { if (!started && char==='~') tilde=true;word += char;started=true; }
    }
    if (quote) throw Error('引號還沒成對，請補上結尾引號。');
    if (started) push();
    return tokens;
  }
  function perform(state, line) {
    const fail = message => ({ ok: false, output: message, changed: false });
    if (line.length > 500) return fail('這條指令太長了，請縮短到 500 字元內。');
    if (/^\s*[$%]\s*/.test(line)) return fail('$／% 是提示字元，不用輸入。只輸入後面的指令，例如 pwd。');
    const tokens = tokenize(line);
    if (!tokens.length) return { ok: true, output: '', empty: true, changed: false };
    const [cmd, ...args] = tokens.map(t=>t.text);
    if (!commands.includes(cmd)) return fail(cmd + '：本模擬器尚未支援這個指令，不代表真實終端機沒有。輸入 help 看支援清單；指令分大小寫。');
    const result = { ok: true, output: '', changed: false, cmd, args };
    const exists = path => Object.hasOwn(state.nodes, path);
    const isDir = path => exists(path) && state.nodes[path].type === 'dir';
    const usage = () => fail('本模擬器尚未支援這組參數；不代表真實終端機不支援。\n'+help[cmd]);
    const checkTarget = path => {
      if (!isDir(parent(path))) return '找不到目的地的上層資料夾。先用 ls 確認路徑。';
      if (basename(path).length > 80 || /[\u0000-\u001f\u007f]/.test(path)) return '檔名過長或含控制字元。';
      if (!exists(path) && Object.keys(state.nodes).length >= 120) return '練習空間已滿；請刪除一些項目或重設沙盒。';
      return '';
    };
    // Parse options separately from operands; -- makes even a leading '-' a filename.
    let ended=false;const operands=[],flags=[];
    for(let i=0;i<args.length;i++){
      const a=args[i];
      if(!ended&&a==='--'){ended=true;continue;}
      if(!ended&&a.startsWith('-')&&a!=='-')flags.push(a);
      else operands.push({text:a,tilde:tokens[i+1].tilde});
    }
    const paths=()=>operands.map(t=>resolve(state,t.text,t.tilde,cmd==='mkdir'&&flags.some(f=>['-p','--parents'].includes(f))));
    if (cmd === 'find') {
      let start={text:'.',tilde:false},type=null,pattern=null,i=0;
      if(args[0]&&!args[0].startsWith('-')){start=tokens[1];i=1;}
      for(;i<args.length;i++){
        const option=args[i],value=args[++i];
        if(option==='-type'&&type===null&&['f','d'].includes(value))type=value;
        else if(option==='-name'&&pattern===null&&value!==undefined)pattern=value;
        else return usage();
      }
      const target=resolve(state,start.text,start.tilde);
      if(!exists(target))return fail('find：找不到起點 '+start.text);
      if(start.text.endsWith('/')&&!isDir(target))return fail('find：起點後面有 /，必須是資料夾。');
      const matches=Object.keys(state.nodes).filter(p=>(p===target||p.startsWith(target==='/'?'/':target+'/'))&&(!type||(state.nodes[p].type==='dir'?'d':'f')===type)&&(pattern===null||matchesName(basename(p),pattern))).sort();
      result.target=target;result.matches=matches;
      result.output=matches.map(p=>target==='/'?p:start.text.replace(/\/$/,'')+p.slice(target.length)).join('\n');
      return result;
    }
    if (cmd === 'grep' || cmd === 'head' || cmd === 'tail') {
      let options='',count=10,endedOptions=false;const input=[];
      for(let i=0;i<args.length;i++){
        const a=args[i];
        if(!endedOptions&&a==='--'){endedOptions=true;continue;}
        if(!endedOptions&&a.startsWith('-')){
          if(cmd==='grep'){const long={'--fixed-strings':'F','--line-number':'n','--ignore-case':'i','--invert-match':'v','--count':'c'};
            if(Object.hasOwn(long,a))options+=long[a];else if(/^-[Fnivc]+$/.test(a))options+=a.slice(1);else return usage();}
          else {let n;if(a==='-n'||a==='--lines')n=args[++i];else if(/^--lines=/.test(a))n=a.slice(8);else if(/^-n\d+$/.test(a))n=a.slice(2);else if(/^-\d+$/.test(a))n=a.slice(1);else return usage();
            if(!/^\d+$/.test(n??'')||Number(n)>10000)return usage();count=Number(n);}
        }else input.push(tokens[i+1]);
      }
      if(cmd==='grep'&&(!options.includes('F')||input.length<2))return usage();
      if(cmd!=='grep'&&input.length!==1)return usage();
      const needle=cmd==='grep'?input.shift().text:null,targets=input.map(t=>resolve(state,t.text,t.tilde)),blocks=[];let matchCount=0;
      for(let i=0;i<targets.length;i++){
        const path=targets[i];if(!exists(path)||isDir(path)||input[i].text.endsWith('/'))return fail(cmd+'：需要存在的文字檔 '+path);
        const text=state.nodes[path].content,lines=text.match(/[^\n]*\n|[^\n]+$/g)||[];
        if(cmd==='grep'){
          const matched=lines.map((line,index)=>({line:line.replace(/\n$/,''),index:index+1})).filter(({line})=>{
            const found=options.includes('i')?line.toLowerCase().includes(needle.toLowerCase()):line.includes(needle);return options.includes('v')?!found:found;
          });matchCount+=matched.length;
          if(options.includes('c'))blocks.push((targets.length>1?input[i].text+':':'')+matched.length);
          else blocks.push(...matched.map(({line,index})=>(targets.length>1?input[i].text+':':'')+(options.includes('n')?index+':':'')+line));
        }else blocks.push((cmd==='head'?lines.slice(0,count):count?lines.slice(-count):[]).join(''));
      }
      result.targets=targets;result.target=targets.length===1?targets[0]:undefined;
      result.output=blocks.join(cmd==='grep'?'\n':'');
      if(cmd==='grep'){result.matchCount=matchCount;result.pattern=needle;if(!matchCount){result.ok=false;result.output=result.output||'沒有符合的行（檔案已讀取，未改動）。';}}
      else result.count=count;
      return result;
    }
    if (cmd === 'help') {
      if(args.length>1)return usage();
      result.output=args.length?(Object.hasOwn(help,args[0])?help[args[0]]:'沒有這個指令的說明。'):commands.map(c=>help[c]).join('\n');
    } else if (cmd === 'pwd') {
      if(operands.length||flags.some(f=>!['-L','-P'].includes(f)))return usage();result.output=state.cwd;
    } else if (cmd === 'clear') {
      if(args.length)return usage();result.clear=true;
    } else if (cmd === 'git') {
      if(args.length!==1||!['--version','-v'].includes(args[0]))return usage();
      result.version=true;result.output='git version 2.53.0 (遊戲模擬，不是你電腦的版本)';
    } else if (cmd === 'uname') {
      const long={'--all':'a','--kernel-name':'s','--nodename':'n','--kernel-release':'r','--kernel-version':'v','--machine':'m'};
      if(operands.length||flags.some(f=>!Object.hasOwn(long,f)&&!/^-[asnrvm]+$/.test(f)))return usage();
      const selected=flags.length?flags.map(f=>long[f]||f.slice(1)).join(''):'s';
      const fields=[['s','LobsterOS'],['n','island'],['r','1.0'],['v','Browser-Simulator'],['m','virtual']];
      result.output=fields.filter(([f])=>selected.includes('a')||selected.includes(f)).map(([,v])=>v).join(' ')+'\n（遊戲模擬：虛構系統資訊，不是你電腦的作業系統或硬體）';
    } else if (cmd === 'ls') {
      const long={'--all':'a','--almost-all':'A','--human-readable':'h'};
      if(flags.some(f=>!Object.hasOwn(long,f)&&!/^-[alAh1]+$/.test(f)))return usage();
      const options=flags.map(f=>long[f]||f.slice(1)).join(''),targets=operands.length?paths():[state.cwd];
      const blocks=[];
      for(let i=0;i<targets.length;i++){
        const path=targets[i];if(!exists(path))return fail('ls：找不到 '+path);
        if(operands[i]?.text.endsWith('/')&&!isDir(path))return fail('ls：以 / 結尾的路徑必須是資料夾。');
        const entries=isDir(path)?[...(options.includes('a')?[path+'/.',path+'/..']:[]),...children(state,path).filter(p=>/[aA]/.test(options)||!basename(p).startsWith('.'))]:[path];
        const rows=entries.map(p=>{
          const special=basename(p)==='.'||basename(p)==='..',n=special?dir():state.nodes[p];
          const name=basename(p)+(n.type==='dir'?'/':'');
          if(!options.includes('l'))return name;
          const bytes=n.type==='dir'?0:new TextEncoder().encode(n.content).length;
          const size=options.includes('h')&&bytes>=1024?(bytes/1024).toFixed(1)+'K':String(bytes);
          return (n.type==='dir'?'drwxr-xr-x':'-rw-r--r--')+' 1 lobster lobster '+size+' [模擬時間] '+name;
        });
        blocks.push((targets.length>1?path+':\n':'')+rows.join(/[l1]/.test(options)?'\n':'  '));
      }
      result.target=targets.length===1?targets[0]:undefined;result.targets=targets;result.output=blocks.join('\n\n');
    } else if (cmd === 'cd') {
      if(flags.length||operands.length>1)return usage();
      const previous=operands[0]?.text==='-';
      if(previous&&!state.previousCwd)return fail('cd：還沒有上一個位置。');
      const path=previous?state.previousCwd:operands.length?paths()[0]:HOME;
      if(!isDir(path))return fail('cd：找不到資料夾，或這是檔案。讀文字請用 cat。');
      result.changed=state.cwd!==path;
      if(result.changed){state.previousCwd=state.cwd;state.cwd=path;}
      if(previous)result.output=path;result.target=path;
    } else if (cmd === 'cat') {
      if(flags.length||!operands.length)return usage();
      const targets=paths(),contents=[];
      for(let i=0;i<targets.length;i++){
        const p=targets[i];if(!exists(p))return fail('cat：找不到檔案 '+p);
        if(isDir(p)||operands[i].text.endsWith('/'))return fail('cat：需要文字檔，檔名後不可加 /；資料夾請用 ls 或 cd。');
        contents.push(state.nodes[p].content);
      }
      result.output=contents.join('');result.targets=targets;result.target=targets.length===1?targets[0]:undefined;
    } else if (cmd === 'mkdir' || cmd === 'touch') {
      if(!operands.length||flags.some(f=>cmd!=='mkdir'||!['-p','--parents'].includes(f)))return usage();
      const parents=flags.length>0,targets=paths();
      for(let i=0;i<targets.length;i++){
        const path=targets[i];
        if(cmd==='touch'&&operands[i].text.endsWith('/')&&!isDir(path))return fail('touch：以 / 結尾的路徑必須是已存在的資料夾。');
        if(parents){
          const parts=path.split('/').filter(Boolean);let current='';
          for(const part of parts){current+='/'+part;if(exists(current)){if(!isDir(current))return fail('mkdir：路徑中有同名檔案。');continue;}
            const error=checkTarget(current);if(error)return fail(error);state.nodes[current]=dir();result.changed=true;
          }
        } else {
          const error=checkTarget(path);if(error)return fail(error);
          if(exists(path)){if(cmd==='mkdir')return fail('mkdir：這個名稱已存在，不需要重建。');continue;}
          state.nodes[path]=cmd==='mkdir'?dir():file('');result.changed=true;
        }
      }
      result.targets=targets;result.target=targets.length===1?targets[0]:undefined;
    } else if (cmd === 'cp' || cmd === 'mv') {
      if(flags.length||operands.length<2)return usage();
      const targets=paths(),destination=targets.at(-1);
      if(targets.length>2&&!isDir(destination))return fail('多個來源檔的目的地必須是資料夾。');
      for(let i=0;i<targets.length-1;i++){
        const from=targets[i];let to=destination;
        if(!exists(from))return fail(cmd+'：找不到來源檔 '+from);
        if(isDir(from))return fail('這個練習的 '+cmd+' 只支援檔案，不支援資料夾。');
        if(operands[i].text.endsWith('/'))return fail(cmd+'：來源檔名後不能加 /。');
        if(operands.at(-1).text.endsWith('/')&&!isDir(to))return fail(cmd+'：目的地以 / 結尾，必須是已存在的資料夾。');
        if(isDir(to))to+='/'+basename(from);
        if(from===to)return fail('來源與目的地是同一個檔案。');
        const error=checkTarget(to);if(error)return fail(error);
        if(exists(to))return fail('目的檔已存在。本練習避免直接覆蓋；請換名字或先刪除目的檔。');
        state.nodes[to]={...state.nodes[from]};if(cmd==='mv')delete state.nodes[from];
        result.changed=true;result.target=to;result.source=from;
      }
    } else if (cmd === 'rm' || cmd === 'rmdir') {
      if(flags.length||!operands.length)return usage();const targets=paths();
      for(let i=0;i<targets.length;i++){
        const path=targets[i];if(!exists(path))return fail(cmd+'：找不到 '+path);
        if(operands[i].text.endsWith('/')&&!isDir(path))return fail(cmd+'：檔案名稱後面不能加 /。');
        if(cmd==='rm'&&isDir(path))return fail('rm：這是資料夾。本練習只用 rm 刪除檔案；空資料夾用 rmdir。');
        if(cmd==='rmdir'){
          if(!isDir(path))return fail('rmdir：這不是資料夾。');
          if(path==='/'||state.cwd===path||state.cwd.startsWith(path+'/'))return fail('不能刪除目前位置或它的上層資料夾。');
          if(children(state,path).length)return fail('rmdir：資料夾不是空的，未刪除。');
        }
        delete state.nodes[path];result.changed=true;
      }
      result.targets=targets;result.target=targets.length===1?targets[0]:undefined;
    }
    return result;
  }
  function execute(state,line) {
    // A failed multi-operand command is atomic in this teaching sandbox (unlike a real shell).
    const draft=clone(state);let result;
    try{result=perform(draft,line);}catch(e){return {ok:false,output:e.message,changed:false};}
    if(result.ok&&result.changed)Object.assign(state,draft);
    return result;
  }
  function complete(state, line) {
    if (!line || /['"\\;|&<>`$*?\[\]{}]/.test(line)) return [];
    const pieces = line.split(/\s+/), last = pieces.pop();
    if (!pieces.length) return commands.filter(c => c.startsWith(last)).map(c => c + ' ');
    const slash = last.lastIndexOf('/'), prefix = last.slice(0, slash + 1), name = last.slice(slash + 1);
    let folder;try{folder=resolve(state,prefix||'.');}catch{return [];}
    const escape = text => text.replace(/([^a-zA-Z0-9_./~\p{L}\p{N}-])/gu,'\\$1');
    return children(state, folder).filter(p => basename(p).startsWith(name))
      .filter(p => pieces[0] !== 'cd' || state.nodes[p].type === 'dir')
      .map(p => pieces.join(' ') + ' ' + prefix + escape(basename(p)) + (state.nodes[p].type === 'dir' ? '/' : ''));
  }
  const api = { HOME, GUIDE, LOG, commands, help, initial, clone, resolve, children, execute, complete };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TerminalEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
