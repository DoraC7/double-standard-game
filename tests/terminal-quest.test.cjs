const { test } = require('node:test');
const assert = require('node:assert/strict');
const E = require('../terminal-engine.js');
const missions = require('../terminal-missions.js');
const H = E.HOME, A = H + '/arcade';
const run = (s, line) => { const r = E.execute(s, line); assert.equal(r.ok, true, line + ': ' + r.output); return r; };

test('20 站完整通關，狀態與五題觀念均可驗證，非指定任務不自動跳關', () => {
  const s = E.initial(); assert.equal(missions.length, 20);
  assert.equal(missions.filter(m => m.quiz).length, 5);
  missions.forEach((m, i) => {
    const events = [];
    const unrelated = run(s, 'help'); assert.equal(Boolean(m.check(s, unrelated, events)), false, m.title);
    assert.equal(m.hints.length, 2);
    for (const line of m.solution) events.push(run(s, line));
    assert.ok(m.check(s, events.at(-1), events), 'mission ' + (i + 1));
    if (m.quiz) assert.ok(m.quiz.options[m.quiz.answer]);
  });
  assert.equal(s.nodes[A + '/delivery/guide.txt'].content, E.GUIDE);
  assert.equal(s.nodes[A + '/README.txt'].content, E.GUIDE);
  assert.equal(s.nodes[A + '/practice/notes.txt'].content, '');
  assert.equal(Object.hasOwn(s.nodes, A + '/practice/shell-backup.txt'), false);
});

test('等效路徑、.、..、~、根路徑與空參數 cd', () => {
  const s = E.initial();
  const r = run(s, 'cd /home/lobster/arcade'); assert.ok(missions[2].check(s, r));
  run(s, 'cd ./../downloads/'); assert.equal(s.cwd, H + '/downloads');
  run(s, 'cd'); assert.equal(s.cwd, H);
  run(s, 'cd /'); run(s, 'cd ..'); assert.equal(s.cwd, '/');
  run(s, 'cd ~/arcade'); assert.equal(s.cwd, A);
  run(s, 'cd ~'); assert.equal(s.cwd, H);
});

test('mkdir 不進入；touch 不清空既有檔；cp 保留來源；mv 移除舊位置', () => {
  const s = E.initial(); run(s, 'cd arcade'); run(s, 'mkdir practice');
  assert.equal(s.cwd, A); run(s, 'touch README.txt'); assert.equal(s.nodes[A + '/README.txt'].content, E.GUIDE);
  run(s, 'cp README.txt practice'); assert.equal(s.nodes[A + '/practice/README.txt'].content, E.GUIDE);
  assert.ok(s.nodes[A + '/README.txt']);
  run(s, 'mv practice/README.txt practice/guide.txt');
  assert.equal(s.nodes[A + '/practice/README.txt'], undefined);
  assert.equal(run(s, 'cat practice/guide.txt').output, E.GUIDE);
});

test('mkdir、複製、改名、刪除後，只有實際核對才過對應關卡', () => {
  const s = E.initial(); run(s, 'cd arcade'); run(s, 'mkdir practice'); run(s, 'cd practice');
  const touch = run(s, 'touch shell.txt'); assert.equal(missions[6].check(s, touch), false);
  const cp = run(s, 'cp shell.txt shell-backup.txt'); assert.equal(missions[7].check(s, cp), false);
  assert.ok(missions[7].check(s, run(s, 'ls')));
  run(s, 'mv shell.txt notes.txt'); assert.ok(missions[8].check(s, run(s, 'ls .')));
  const rm = run(s, 'rm shell-backup.txt'); assert.equal(missions[9].check(s, rm), false);
  assert.ok(missions[9].check(s, run(s, 'ls /home/lobster/arcade/practice')));
});

test('clear 不改變位置或檔案，關卡必須真的執行 clear 並重新 ls', () => {
  const s = E.initial(); run(s, 'cd arcade'); run(s, 'mkdir practice');
  const before = E.clone(s); const clear = run(s, 'clear'); assert.ok(clear.clear); assert.deepEqual(s, before);
  const ls = run(s, 'ls'); assert.equal(missions[11].check(s, ls, []), false);
  assert.ok(missions[11].check(s, ls, [clear, ls]));
});

test('git --version 只模擬查版本；拒絕 install、push 與錯誤選項', () => {
  const s = E.initial(), before = E.clone(s); const r = run(s, 'git --version');
  assert.match(r.output, /模擬/); assert.ok(missions[12].check(s, r)); assert.deepEqual(s, before);
  for (const line of ['git push', 'git --Version', 'git -version', 'git --version extra']) assert.equal(E.execute(s, line).ok, false);
});

test('uname 顯示明確標示的模擬資訊，接受基本旗標，不改動環境或通關', () => {
  const s = E.initial(), before = E.clone(s);
  const all = run(s, 'uname -a');
  assert.match(all.output, /^LobsterOS island 1\.0 Browser-Simulator virtual\n/);
  for (const line of ['uname', 'uname -a', 'uname -s', 'uname -n', 'uname -r', 'uname -v', 'uname -m', 'uname -sn', 'uname -n -s', 'uname -aa']) {
    const r = run(s, line);
    assert.match(r.output, /遊戲模擬.*不是你電腦/);
    assert.equal(r.changed, false);
    assert.deepEqual(s, before);
    for (const m of missions) assert.equal(Boolean(m.check(s, r, [r])), false);
  }
  assert.match(run(s, 'uname').output, /^LobsterOS\n/);
  assert.match(run(s, 'uname -n -s').output, /^LobsterOS island\n/);
  for (const line of ['uname -A', 'uname x', 'uname -o', 'uname -', 'uname -a extra']) {
    assert.equal(E.execute(s, line).ok, false, line);
    assert.deepEqual(s, before);
  }
  assert.match(run(s, 'help').output, /uname/);
  assert.match(run(s, 'help uname').output, /不會偵測你的電腦/);
  assert.deepEqual(E.complete(s, 'una'), ['uname ']);
});

test('未支援的指令不誤稱真實終端機沒有該指令', () => {
  const s = E.initial(), before = E.clone(s);
  const r = E.execute(s, 'whoami');
  assert.equal(r.ok, false);
  assert.match(r.output, /本模擬器尚未支援.*不代表真實終端機沒有/);
  assert.deepEqual(s, before);
});

test('錯誤不改動環境；分清檔案與目錄、不直接覆蓋、不遞迴刪除', () => {
  const s = E.initial();
  for (const line of ['cd missing', 'cd arcade/README.txt', 'cat arcade', 'cp arcade other', 'mv arcade other', 'rm arcade', 'rmdir arcade', 'rm -rf /', 'mkdir arcade', 'touch missing/x', 'cp arcade/README.txt arcade/README.txt', 'mv arcade/README.txt arcade/README.txt', 'cp arcade/README.txt downloads/hello.txt', 'rmdir /', 'rmdir .', 'pwd extra', 'clear extra']) {
    const before = E.clone(s); assert.equal(E.execute(s, line).ok, false, line); assert.deepEqual(s, before, line);
  }
});

test('引號、中文與空白檔名；隱藏檔 ls -a；空目錄可刪', () => {
  const s = E.initial();
  run(s, 'mkdir "我的 筆記"'); run(s, "touch '我的 筆記/第一課.txt'");
  assert.equal(run(s, "cat '我的 筆記/第一課.txt'").output, '');
  assert.doesNotMatch(run(s, 'ls').output, /\.shell-note/);
  assert.match(run(s, 'ls -a').output, /\.shell-note/);
  run(s, 'rm "我的 筆記/第一課.txt"'); run(s, 'rmdir "我的 筆記"');
  assert.equal(s.nodes[H + '/我的 筆記'], undefined);
});

test('提示符、未關引號、shell 操作符與原型名稱安全拒絕，不執行 JavaScript', () => {
  const s = E.initial();
  assert.match(E.execute(s, '$ pwd').output, /提示符/);
  for (const line of ['% ls', 'cat "README.txt', 'pwd; rm x', 'pwd | cat x', 'touch x > y', 'echo $(pwd)', 'rm *', 'toString', '__proto__', 'constructor']) {
    const before = E.clone(s); assert.equal(E.execute(s, line).ok, false, line); assert.deepEqual(s, before);
  }
  assert.equal(run(s, 'help __proto__').output, '沒有這個指令的說明。');
});

test('自動補全命令與資料夾，不改動環境；多個候選不擅自選擇', () => {
  const s = E.initial(), before = E.clone(s);
  assert.deepEqual(E.complete(s, 'pw'), ['pwd ']);
  assert.deepEqual(E.complete(s, 'cd ar'), ['cd arcade/']);
  assert.deepEqual(E.complete(s, 'cat arcade/RE'), ['cat arcade/README.txt']);
  assert.deepEqual(E.complete(s, 'cd "ar'), []); assert.deepEqual(s, before);
});

test('最後一關必須有正確副本、保留來源、讀到副本，再核對資料夾', () => {
  const s = E.initial(); run(s, 'cd arcade'); run(s, 'mkdir delivery'); run(s, 'cp README.txt delivery/guide.txt');
  let ls = run(s, 'ls delivery'); assert.equal(missions[13].check(s, ls, []), false);
  const cat = run(s, 'cat delivery/guide.txt'); ls = run(s, 'ls delivery'); assert.ok(missions[13].check(s, ls, [cat]));
  run(s, 'rm README.txt'); assert.equal(missions[13].check(s, ls, [cat]), false);
});

test('快照復原與環境隔離，沙盒改動不會串到關卡', () => {
  const lesson = E.initial(), sandbox = E.initial(), snap = E.clone(lesson);
  run(sandbox, 'rm arcade/README.txt'); assert.ok(lesson.nodes[A + '/README.txt']);
  run(lesson, 'cd downloads'); run(lesson, 'touch new.txt'); assert.notDeepEqual(lesson, snap);
  assert.equal(snap.cwd, H); assert.equal(snap.nodes[H + '/downloads/new.txt'], undefined);
});

test('尾端斜線代表目錄，不把錯寫的檔案路徑當普通檔名', () => {
  const s = E.initial();
  for (const line of ['touch new/', 'rm arcade/README.txt/', 'cat arcade/README.txt/', 'ls arcade/README.txt/', 'cp arcade/README.txt/ new.txt', 'cp arcade/README.txt missing/', 'mv arcade/README.txt missing/']) {
    const before = E.clone(s); assert.equal(E.execute(s, line).ok, false, line); assert.deepEqual(s, before);
  }
  run(s, 'mkdir new/'); run(s, 'cp arcade/README.txt new/'); assert.equal(s.nodes[H + '/new/README.txt'].content, E.GUIDE);
});

for(const style of ['short','long'])test('終端機等效寫法完整通過 14 關：'+style,()=>{
 const s=E.initial(),ls=style==='short'?'ls -lah':'ls --all --human-readable -l';
 const steps=[['pwd -P'],[ls+' . downloads'],['cd -- ./arcade'],['cat -- ./README.txt'],
 ['mkdir '+(style==='short'?'-p':'--parents')+' ./practice'],['cd -- practice'],['touch -- ./shell.txt',ls],
 ['cp -- ./shell.txt ./shell-backup.txt',ls],['mv -- ./shell.txt ./notes.txt',ls],['rm -- ./shell-backup.txt',ls],
 ['cd -- ..','pwd -L'],['clear',ls],['git -v'],['mkdir -p delivery','cp -- README.txt delivery/guide.txt','cat README.txt delivery/guide.txt',ls+' . delivery']];
 steps.forEach((commands,i)=>{const events=commands.map(c=>run(s,c));assert.ok(missions[i].check(s,events.at(-1),events),'mission '+i);});
});
test('ls 合併／長選項、隱藏項目、長格式與多路徑；不改環境',()=>{
 const s=E.initial(),before=E.clone(s);
 for(const c of ['ls -la','ls -al','ls -lah','ls --all -l','ls -a -l'])assert.match(run(s,c).output,/\.shell-note/);
 assert.match(run(s,'ls -a').output,/(^| )\.\//);assert.doesNotMatch(run(s,'ls -A').output,/(^| )\.\//);
 assert.doesNotMatch(run(s,'ls --almost-all').output,/(^| )\.\//);
 assert.match(run(s,'ls -1').output,/arcade\/\ndownloads\//);
 assert.match(run(s,'ls -l').output,/drwxr-xr-x.*模擬時間/);
 const multi=run(s,'ls -la . downloads');assert.deepEqual(multi.targets,[H,H+'/downloads']);assert.ok(missions[1].check(s,multi));
 assert.equal(Boolean(missions[1].check(s,run(s,'ls downloads'))),false);assert.deepEqual(s,before);
});
test('mkdir -p 多層／既存目錄；多檔 touch、cp、mv、cat、rm、rmdir',()=>{
 const s=E.initial();run(s,'mkdir -p a/b/c other');run(s,'mkdir --parents a/b/c');
 run(s,'touch a/x a/y');run(s,'cp a/x a/y other/');assert.ok(s.nodes[H+'/a/x']);
 run(s,'mv other/x other/y a/b');assert.equal(s.nodes[H+'/other/x'],undefined);
 assert.equal(run(s,'cat arcade/README.txt downloads/hello.txt').output,E.GUIDE+'小龍蝦說：你好，terminal！');
 run(s,'rm a/b/x a/b/y a/x a/y');run(s,'rmdir a/b/c a/b a other');
 assert.equal(s.nodes[H+'/a'],undefined);
});
test('多檔操作任何失敗均整條復原；不靜默覆蓋，保留沙盒空間限制',()=>{
 for(const c of ['mkdir made arcade','mkdir -p made arcade/README.txt/child','touch made missing/file','cp arcade/README.txt missing other/','mv downloads/hello.txt missing arcade/','rm downloads/hello.txt missing','rmdir downloads arcade','touch ""','mkdir -p ""']){
  const s=E.initial(),before=E.clone(s);assert.equal(E.execute(s,c).ok,false,c);assert.deepEqual(s,before,c);
 }
 const s=E.initial();while(Object.keys(s.nodes).length<119)run(s,'touch f'+Object.keys(s.nodes).length);
 const before=E.clone(s);assert.equal(E.execute(s,'mkdir -p a/b').ok,false);assert.deepEqual(s,before);
});
test('路徑中間必須是真正存在的目錄，不把檔案或缺失路徑的 /.. 消掉',()=>{
 const s=E.initial();for(const c of ['cat arcade/README.txt/../README.txt','touch arcade/README.txt/../new','ls missing/../arcade','cd arcade/README.txt/.','mkdir -p arcade/README.txt/../new']){
  const before=E.clone(s);assert.equal(E.execute(s,c).ok,false,c);assert.deepEqual(s,before);
 }
});
test('cd - 來回切換；引號與跳脫的 ~ 是普通檔名，-- 接受短橫開頭名稱',()=>{
 const s=E.initial();assert.equal(E.execute(s,'cd -').ok,false);
 run(s,'cd arcade');run(s,'cd -');assert.equal(s.cwd,H);run(s,'cd -');assert.equal(s.cwd,A);
 run(s,'mkdir "~"');run(s,'cd "~"');assert.equal(s.cwd,A+'/~');run(s,'cd ~');assert.equal(s.cwd,H);
 run(s,'touch -- -note');assert.equal(run(s,'cat -- -note').output,'');run(s,'rm -- -note');
 run(s,'mkdir "my notes"');run(s,'cd my\\ notes');assert.equal(s.cwd,H+'/my notes');
 run(s,'touch "a\\q"');assert.ok(s.nodes[s.cwd+'/a\\q']);
});
test('uname 長旗標與 git -v 可核對版本；沒有偵測真實裝置',()=>{
 const s=E.initial(),before=E.clone(s);assert.equal(run(s,'uname --all').output,run(s,'uname -a').output);
 assert.equal(run(s,'uname --kernel-name --machine').output,run(s,'uname -sm').output);
 for(const c of ['uname --nodename','uname --kernel-release','uname --kernel-version'])assert.match(run(s,c).output,/遊戲模擬/);
 assert.ok(missions[12].check(s,run(s,'git -v')));assert.deepEqual(s,before);
});
test('自動補全會跳脫空白檔名，結果可直接執行；不存在路徑不丟例外',()=>{
 const s=E.initial();run(s,'mkdir "my notes"');const choices=E.complete(s,'cd my');assert.deepEqual(choices,['cd my\\ notes/']);run(s,choices[0]);assert.equal(s.cwd,H+'/my notes');
 assert.deepEqual(E.complete(s,'cat missing/sub/'),[]);
});
