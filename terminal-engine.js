/* A deliberately small, browser-only POSIX-style practice environment. No eval or real shell. */
(function (root) {
  'use strict';
  const HOME = '/home/lobster';
  const GUIDE = '歡迎來到龍蝦遊戲間！\n先看位置，再看內容，改動之後再驗證。\n資料夾用 cd 進入；文字檔用 cat 閱讀。\n檔名分大小寫。$ 是提示符，不是指令的一部分。';
  const commands = ['pwd', 'ls', 'cd', 'cat', 'mkdir', 'touch', 'cp', 'mv', 'rm', 'rmdir', 'clear', 'git', 'help'];
  const help = {
    pwd: 'pwd：顯示目前所在的完整路徑，不會搬動檔案。',
    ls: 'ls [路徑]：列出內容；ls -a 也列出隱藏項目與 .、..。資料夾後會加 /。',
    cd: 'cd 路徑：切換資料夾。cd .. 回上一層；cd 或 cd ~ 回家。',
    cat: 'cat 檔案：讀文字內容，不是進入檔案。可用引號包住含空白的檔名。',
    mkdir: 'mkdir 資料夾：建立一層資料夾，不會自動進入；本練習不支援 -p。',
    touch: 'touch 檔案：不存在時建立空白檔；已存在時不清空內容。本練習不模擬時間戳記。',
    cp: 'cp 來源檔 目的檔或資料夾：複製檔案，來源保留。本練習不支援目錄複製。',
    mv: 'mv 來源檔 目的檔或資料夾：搬移或改名，舊位置不再保留。本練習只搬檔案。',
    rm: 'rm 檔案：刪除檔案；不會進垃圾桶。本練習不支援 -r、-f 或萬用字元。',
    rmdir: 'rmdir 資料夾：只刪除空資料夾。',
    clear: 'clear：清除終端機畫面，不改動資料夾、檔案或目前位置。完整文字紀錄仍可匯出。',
    git: 'git --version：顯示本練習的模擬版本，不會安裝 Git，也不能證明你電腦有 Git。',
    help: 'help 或 help 指令：查看本練習支援的用法。這裡不是完整 Bash／zsh。'
  };
  const dir = () => ({ type: 'dir' });
  const file = content => ({ type: 'file', content });
  function initial() {
    return { cwd: HOME, nodes: {
      '/': dir(), '/home': dir(), [HOME]: dir(), [HOME + '/arcade']: dir(),
      [HOME + '/arcade/README.txt']: file(GUIDE),
      [HOME + '/downloads']: dir(), [HOME + '/downloads/hello.txt']: file('小龍蝦說：你好，terminal！'),
      [HOME + '/.shell-note']: file('隱藏檔只是檔名以 . 開頭，不代表加密或安全。')
    }};
  }
  const clone = state => JSON.parse(JSON.stringify(state));
  function resolve(state, raw = '~') {
    let path = raw;
    if (path === '~' || path.startsWith('~/')) path = HOME + path.slice(1);
    if (!path.startsWith('/')) path = state.cwd + '/' + path;
    const parts = [];
    for (const part of path.split('/')) {
      if (!part || part === '.') continue;
      if (part === '..') parts.pop(); else parts.push(part);
    }
    return '/' + parts.join('/');
  }
  const parent = path => path.slice(0, path.lastIndexOf('/')) || '/';
  const basename = path => path.slice(path.lastIndexOf('/') + 1);
  function children(state, path) {
    return Object.keys(state.nodes).filter(key => key !== path && parent(key) === path).sort();
  }
  function tokenize(line) {
    const tokens = []; let word = '', quote = '', started = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '\\' && quote !== "'") {
        if (++i >= line.length) throw Error('反斜線後還需要一個字元。');
        word += line[i]; started = true;
      } else if (quote) {
        if (char === quote) quote = ''; else word += char;
      } else if (char === '"' || char === "'") { quote = char; started = true;
      } else if (/\s/.test(char)) {
        if (started) { tokens.push(word); word = ''; started = false; }
      } else if (/[;|&<>`$*?\[\]{}]/.test(char)) {
        throw Error('這個練習一次執行一條指令，不支援管線、重導向、變數或萬用字元。');
      } else { word += char; started = true; }
    }
    if (quote) throw Error('引號還沒成對，請補上結尾引號。');
    if (started) tokens.push(word);
    return tokens;
  }
  function execute(state, line) {
    const fail = message => ({ ok: false, output: message, changed: false });
    if (line.length > 500) return fail('這條指令太長了，請縮短到 500 字元內。');
    if (/^\s*[$%]\s*/.test(line)) return fail('$／% 是提示符，不用輸入。只輸入後面的指令，例如 pwd。');
    let words;
    try { words = tokenize(line); } catch (error) { return fail(error.message); }
    if (!words.length) return { ok: true, output: '', empty: true, changed: false };
    const [cmd, ...args] = words;
    if (!commands.includes(cmd)) return fail(cmd + '：找不到這個指令。輸入 help 看支援清單；指令分大小寫。');
    const paths = args.map(arg => resolve(state, arg));
    const result = { ok: true, output: '', changed: false, cmd, args, paths };
    const need = count => args.length === count;
    const exists = path => Object.hasOwn(state.nodes, path);
    const isDir = path => exists(path) && state.nodes[path].type === 'dir';
    const usage = () => fail(help[cmd]);
    const checkTarget = path => {
      if (!isDir(parent(path))) return '找不到目的地的上層資料夾。先用 ls 確認路徑。';
      if (basename(path).length > 80 || /[\u0000-\u001f\u007f]/.test(path)) return '檔名過長或含控制字元。';
      if (!exists(path) && Object.keys(state.nodes).length >= 120) return '練習空間已滿；請刪除一些項目或重設沙盒。';
      return '';
    };
    if (cmd === 'help') {
      if (args.length > 1) return usage();
      result.output = args.length ? (Object.hasOwn(help, args[0]) ? help[args[0]] : '沒有這個指令的說明。') : commands.map(c => help[c]).join('\n');
    } else if (cmd === 'pwd') {
      if (!need(0)) return usage(); result.output = state.cwd;
    } else if (cmd === 'clear') {
      if (!need(0)) return usage(); result.clear = true;
    } else if (cmd === 'git') {
      if (args.length !== 1 || args[0] !== '--version') return usage();
      result.output = 'git version 2.53.0 (遊戲模擬，不是你電腦的版本)';
    } else if (cmd === 'ls') {
      if (args.some(a => a.startsWith('-') && a !== '-a') || args.filter(a => a !== '-a').length > 1) return usage();
      const path = resolve(state, args.find(a => a !== '-a') ?? '.');
      if (!exists(path)) return fail('ls：找不到 ' + path);
      if (args.some(a => a.endsWith('/')) && !isDir(path)) return fail('ls：以 / 結尾的路徑必須是資料夾。');
      const showHidden = args.includes('-a');
      result.target = path;
      result.output = isDir(path) ? [...(showHidden ? ['./', '../'] : []), ...children(state, path)
        .filter(p => showHidden || !basename(p).startsWith('.'))
        .map(p => basename(p) + (isDir(p) ? '/' : ''))].join('  ') : basename(path);
    } else if (cmd === 'cd') {
      if (args.length > 1 || args.some(a => a.startsWith('-'))) return usage();
      const path = resolve(state, args[0] ?? '~');
      if (!exists(path)) return fail('cd：找不到資料夾 ' + path);
      if (!isDir(path)) return fail('cd：這是檔案，不是資料夾。要讀文字內容，試試 cat。');
      result.changed = state.cwd !== path; state.cwd = path; result.target = path;
    } else if (cmd === 'cat') {
      if (!need(1) || args[0].startsWith('-')) return usage();
      if (!exists(paths[0])) return fail('cat：找不到檔案 ' + paths[0]);
      if (args[0].endsWith('/') && !isDir(paths[0])) return fail('cat：檔案名稱後面不能加 /。');
      if (isDir(paths[0])) return fail('cat：這是資料夾。要列出內容用 ls，要進入用 cd。');
      result.output = state.nodes[paths[0]].content; result.target = paths[0];
    } else if (cmd === 'mkdir' || cmd === 'touch') {
      if (!need(1) || !args[0] || args[0].startsWith('-')) return usage();
      const path = paths[0], error = checkTarget(path);
      if (error) return fail(error);
      if (cmd === 'touch' && args[0].endsWith('/') && !isDir(path)) return fail('touch：以 / 結尾的路徑必須是已存在的資料夾。');
      if (exists(path)) {
        if (cmd === 'mkdir') return fail('mkdir：這個名稱已存在，不需要重建。');
        return result; // touch does not truncate an existing file or directory.
      }
      state.nodes[path] = cmd === 'mkdir' ? dir() : file(''); result.changed = true; result.target = path;
    } else if (cmd === 'cp' || cmd === 'mv') {
      if (!need(2) || args.some(a => !a || a.startsWith('-'))) return usage();
      const from = paths[0]; let to = paths[1];
      if (!exists(from)) return fail(cmd + '：找不到來源檔 ' + from);
      if (args[0].endsWith('/') && !isDir(from)) return fail(cmd + '：來源是檔案，名稱後不能加 /。');
      if (isDir(from)) return fail('這個練習的 ' + cmd + ' 只支援檔案，不支援資料夾。');
      if (args[1].endsWith('/') && !isDir(to)) return fail(cmd + '：目的地以 / 結尾，必須是已存在的資料夾。');
      if (isDir(to)) to = resolve(state, to + '/' + basename(from));
      if (isDir(to)) return fail('目的地同名項目是資料夾，不能覆蓋。');
      if (from === to) return fail('來源與目的地是同一個檔案。');
      const error = checkTarget(to); if (error) return fail(error);
      // This trainer refuses silent overwrites, unlike a default POSIX cp/mv.
      if (exists(to)) return fail('目的檔已存在。本練習避免直接覆蓋；請換名字或先刪除目的檔。');
      state.nodes[to] = { ...state.nodes[from] };
      if (cmd === 'mv') delete state.nodes[from];
      result.changed = true; result.target = to; result.source = from;
    } else if (cmd === 'rm' || cmd === 'rmdir') {
      if (!need(1) || !args[0] || args[0].startsWith('-')) return usage();
      const path = paths[0];
      if (!exists(path)) return fail(cmd + '：找不到 ' + path);
      if (args[0].endsWith('/') && !isDir(path)) return fail(cmd + '：檔案名稱後面不能加 /。');
      if (cmd === 'rm' && isDir(path)) return fail('rm：這是資料夾。本練習只用 rm 刪檔；空資料夾用 rmdir。');
      if (cmd === 'rmdir') {
        if (!isDir(path)) return fail('rmdir：這不是資料夾。');
        if (path === '/' || state.cwd === path || state.cwd.startsWith(path + '/')) return fail('不能刪除目前位置或它的上層資料夾。');
        if (children(state, path).length) return fail('rmdir：資料夾不是空的，未刪除。');
      }
      delete state.nodes[path]; result.changed = true; result.target = path;
    }
    return result;
  }
  function complete(state, line) {
    if (!line || /['"\\;|&<>`$*?\[\]{}]/.test(line)) return [];
    const pieces = line.split(/\s+/), last = pieces.pop();
    if (!pieces.length) return commands.filter(c => c.startsWith(last)).map(c => c + ' ');
    const slash = last.lastIndexOf('/'), prefix = last.slice(0, slash + 1), name = last.slice(slash + 1);
    const folder = resolve(state, prefix || '.');
    return children(state, folder).filter(p => basename(p).startsWith(name))
      .filter(p => pieces[0] !== 'cd' || state.nodes[p].type === 'dir')
      .map(p => pieces.join(' ') + ' ' + prefix + basename(p) + (state.nodes[p].type === 'dir' ? '/' : ''));
  }
  const api = { HOME, GUIDE, commands, help, initial, clone, resolve, children, execute, complete };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TerminalEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
