(() => {
  'use strict';
  const E = window.TerminalEngine, missions = window.TerminalMissions;
  const $ = id => document.getElementById(id);
  const command = $('command'), output = $('output');
  const makeSession = () => ({ env: E.initial(), history: [], historyIndex: 0, draft: '', transcript: [], screen: [], undo: null, events: [] });
  let lesson = makeSession(), sandbox = makeSession(), session = lesson;
  let mode = 'lesson', index = 0, passed = false, quizPassed = false, hintCount = 0, finished = false;
  let checkpoint = E.clone(lesson.env);
  const proofs = [];
  let recordReturnFocus = null;
  const shortPath = path => path === E.HOME ? '~' : path.startsWith(E.HOME + '/') ? '~' + path.slice(E.HOME.length) : path;
  const logText = (text, style = 'system') => {
    const node = document.createElement('div'); node.className = style; node.textContent = text; return node;
  };
  function append(entry) {
    session.screen.push(entry);
    if (session.screen.length > 150) { session.screen.shift(); output.firstElementChild?.remove(); }
    const node = document.createElement('div'); node.className = 'entry';
    if (entry.input !== undefined) node.append(logText(shortPath(entry.cwd) + ' $ ' + entry.input, 'entered'));
    if (entry.text) node.append(logText(entry.text, entry.style || 'result'));
    output.append(node); output.scrollTop = output.scrollHeight;
  }
  function system(text) { append({ text, style: 'system' }); }
  function redrawScreen() {
    const saved = [...session.screen]; session.screen = []; output.replaceChildren(); saved.forEach(append);
  }
  function drawTree() {
    const env = session.env, lines = [];
    function visit(path, prefix, label) {
      const node = env.nodes[path], marker = env.cwd === path ? ' ← 目前位置' : '';
      lines.push(prefix + (node.type === 'dir' ? '📁 ' : '· ') + label + marker);
      if (node.type === 'dir') for (const child of E.children(env, path)) visit(child, prefix + '  ', child.slice(child.lastIndexOf('/') + 1));
    }
    visit('/', '', '/'); $('file-tree').textContent = lines.join('\n');
    $('location').textContent = '目前位置：' + env.cwd;
    $('prompt-path').textContent = shortPath(env.cwd);
    $('undo').disabled = !session.undo || (mode === 'lesson' && (passed || finished));
  }
  function completedCount() { return finished ? missions.length : index + (passed && quizPassed ? 1 : 0); }
  function drawProgress() {
    const count = completedCount(); $('progress').value = count; $('progress').max = missions.length;
    $('progress-label').textContent = '完成 ' + count + ' / ' + missions.length + ' 關';
    $('chapter').textContent = mode === 'sandbox' ? '自由沙盒 / 沒有指定答案' : finished ? '探險路線完成 / 繼續自己試試' : missions[index].chapter;
    $('milestones').replaceChildren(...missions.map((m, i) => {
      const span = document.createElement('span'); span.className = i < count ? 'done' : i === index ? 'current' : ''; return span;
    }));
  }
  function setLocked(locked) {
    command.disabled = locked; $('run').disabled = locked; $('complete').disabled = locked; $('history-up').disabled = locked;
  }
  function renderMission() {
    const free = mode === 'sandbox';
    $('lesson-mode').setAttribute('aria-pressed', String(!free)); $('sandbox-mode').setAttribute('aria-pressed', String(free));
    $('lesson-controls').hidden = free || finished; $('sandbox-tools').hidden = !free;
    $('finish').hidden = free || !finished; $('quiz').hidden = true; $('feedback').textContent = '';
    $('next').hidden = true;
    if (free) {
      $('mission-number').textContent = 'FREE PLAY'; $('mission-title').textContent = '小島任你探索';
      $('goal').textContent = '用指令建立自己的虛擬資料夾與檔案。可以開啟小抄、查看地圖，或按 help 查用法。';
      $('concept').textContent = '別只看「沒有出錯」：改完用 pwd、ls 或 cat 確認，才知道發生了什麼。';
      setLocked(false);
    } else if (finished) {
      $('mission-number').textContent = 'EXPEDITION COMPLETE'; $('mission-title').textContent = '從一行指令，到一趟探險';
      $('goal').textContent = '14 站都完成了。通關紀錄能證明你在這個模擬環境做過什麼；能否獨立重現，還可以繼續練。';
      $('concept').textContent = '想帶走過程，請開啟「文字紀錄」。自己的理解可以寫在下方筆記，不會替你代寫。';
      setLocked(true);
    } else {
      const m = missions[index];
      $('mission-number').textContent = 'MISSION ' + String(index + 1).padStart(2, '0');
      $('mission-title').textContent = m.title; $('goal').textContent = m.goal; $('concept').textContent = m.concept;
      $('hint').hidden = hintCount === 0;
      $('hint').textContent = hintCount ? m.hints[hintCount - 1] : '';
      $('hint-button').textContent = hintCount === 0 ? '🦞 給我一點提示' : hintCount === 1 ? '再給我明確一點的提示' : '提示已展開';
      $('hint-button').disabled = hintCount === m.hints.length;
      setLocked(passed);
      if (passed) renderSuccess();
    }
    drawProgress(); drawTree();
  }
  function renderSuccess() {
    const m = missions[index]; $('feedback').textContent = '✓ ' + m.proof;
    if (m.quiz) {
      $('quiz').hidden = false; $('quiz-question').textContent = m.quiz.q;
      $('quiz-options').replaceChildren(...m.quiz.options.map((text, i) => {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = text;
        button.disabled = quizPassed; button.setAttribute('aria-pressed', String(quizPassed && i === m.quiz.answer));
        button.addEventListener('click', () => {
          if (i === m.quiz.answer) {
            quizPassed = true; proofs[index].understanding = m.quiz.explain;
            renderSuccess(); drawProgress(); $('next').focus();
          } else {
            $('quiz-feedback').textContent = '再想一下：' + m.quiz.explain;
            button.setAttribute('aria-pressed', 'true');
          }
        }); return button;
      }));
      $('quiz-feedback').textContent = quizPassed ? '✓ ' + m.quiz.explain : '操作完成。再分清這個觀念，就可以前進。';
    }
    $('next').hidden = !quizPassed;
    $('next').textContent = index === missions.length - 1 ? '完成這趟探險 →' : '下一站 →';
    drawTree();
  }
  function submit(line) {
    if (!line.trim() || (mode === 'lesson' && (passed || finished))) return;
    const before = E.clone(session.env), cwd = session.env.cwd;
    const result = E.execute(session.env, line);
    session.history.push(line); session.history = session.history.slice(-150); session.historyIndex = session.history.length; session.draft = '';
    session.transcript.push({ cwd, input: line, output: result.output, ok: result.ok });
    // Bound session memory, but explicitly mark truncation in the exported record.
    if (session.transcript.length > 1000) { session.transcript.shift(); session.truncated = true; }
    if (result.clear) { session.screen = []; output.replaceChildren(); }
    else append({ cwd, input: line, text: result.output || (result.ok ? '（無文字輸出）' : ''), style: result.ok ? (result.output ? 'result' : 'quiet') : 'error' });
    if (result.changed) session.undo = before;
    command.value = '';
    if (result.ok) {
      session.events.push(result); session.events = session.events.slice(-200);
      if (mode === 'lesson' && missions[index].check(session.env, result, session.events)) {
        passed = true; quizPassed = !missions[index].quiz;
        proofs[index] = { title: missions[index].title, proof: missions[index].proof, hints: hintCount };
        setLocked(true); renderSuccess(); drawProgress();
        const focusTarget = quizPassed ? $('next') : $('quiz-options').querySelector('button');
        focusTarget.focus();
      }
    }
    drawTree();
  }
  $('command-form').addEventListener('submit', event => { event.preventDefault(); submit(command.value); });
  function previous(delta) {
    if (command.disabled || !session.history.length) return;
    if (session.historyIndex === session.history.length) session.draft = command.value;
    session.historyIndex = Math.max(0, Math.min(session.history.length, session.historyIndex + delta));
    command.value = session.historyIndex === session.history.length ? session.draft : session.history[session.historyIndex];
    command.focus(); command.setSelectionRange(command.value.length, command.value.length);
  }
  function completion() {
    if (command.disabled) return;
    const options = E.complete(session.env, command.value);
    if (options.length === 1) command.value = options[0];
    else system(options.length ? '可自動補全：' + options.map(o => o.trim()).join('  ') : '沒有可自動補全的項目；可用 ls 看看名稱。');
    command.focus();
  }
  command.addEventListener('keydown', event => {
    if (event.isComposing) return;
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') { event.preventDefault(); previous(event.key === 'ArrowUp' ? -1 : 1); }
    // Tab remains normal focus navigation. Use Ctrl+Space or the button for completion.
    if (event.key === ' ' && event.ctrlKey) { event.preventDefault(); completion(); }
  });
  $('history-up').addEventListener('click', () => previous(-1)); $('complete').addEventListener('click', completion);
  $('hint-button').addEventListener('click', () => { hintCount = Math.min(missions[index].hints.length, hintCount + 1); renderMission(); });
  $('retry').addEventListener('click', () => {
    lesson.env = E.clone(checkpoint); lesson.events = []; lesson.undo = null;
    passed = false; quizPassed = false; delete proofs[index];
    lesson.transcript.push({ note: '重來第 ' + (index + 1) + ' 關：還原本關起始狀態。' });
    system('↶ 已還原本關的起始位置與檔案。先前操作仍在文字紀錄中。');
    renderMission(); command.focus();
  });
  $('undo').addEventListener('click', () => {
    if (!session.undo || (mode === 'lesson' && (passed || finished))) return;
    session.env = E.clone(session.undo); session.undo = null; session.events = [];
    session.transcript.push({ note: '復原上一次檔案／位置改動；文字輸出未清除。' });
    system('↶ 已復原上次檔案／位置改動。文字輸出是先前的紀錄；請重新用指令驗證。'); drawTree(); command.focus();
  });
  $('next').addEventListener('click', () => {
    if (!passed || !quizPassed) return;
    if (index === missions.length - 1) finished = true;
    else {
      index++; passed = false; quizPassed = false; hintCount = 0;
      checkpoint = E.clone(lesson.env); lesson.events = []; lesson.undo = null;
      lesson.transcript.push({ note: '開始第 ' + (index + 1) + ' 關：' + missions[index].title });
      system('── 第 ' + (index + 1) + ' 關：' + missions[index].title + ' ──');
    }
    renderMission(); $('mission-title').focus();
  });
  function switchMode(nextMode) {
    if (nextMode === mode) return;
    mode = nextMode; session = mode === 'lesson' ? lesson : sandbox; command.value = '';
    if (!session.screen.length) system('🦞 自由沙盒就緒。這裡只支援 help 列出的練習指令，不是完整 shell；回到關卡時，原本進度會保留。');
    redrawScreen(); renderMission(); $('mission-title').focus();
  }
  $('lesson-mode').addEventListener('click', () => switchMode('lesson'));
  $('sandbox-mode').addEventListener('click', () => switchMode('sandbox'));
  $('free-after').addEventListener('click', () => switchMode('sandbox'));
  $('reset-sandbox').addEventListener('click', () => {
    const old = sandbox.transcript; sandbox = makeSession(); sandbox.transcript = old;
    sandbox.transcript.push({ note: '重設自由沙盒。' }); session = sandbox;
    output.replaceChildren(); system('↶ 沙盒位置與檔案已重設。操作紀錄仍保留。'); renderMission(); command.focus();
  });
  $('restart').addEventListener('click', () => {
    const old = lesson.transcript; lesson = makeSession(); lesson.transcript = old;
    lesson.transcript.push({ note: '重新開始一趟探險。先前操作保留，但通關證據重新計算。' });
    session = lesson; index = 0; passed = false; quizPassed = false; hintCount = 0; finished = false;
    proofs.length = 0; checkpoint = E.clone(lesson.env); output.replaceChildren();
    system('🦞 新的一趟探險開始。這次試著少看一點提示。'); renderMission(); command.focus();
  });
  const cheatNames = { pwd:'看位置', ls:'列出內容', cd:'切換資料夾', cat:'讀文字檔', mkdir:'建立資料夾', touch:'建立空白檔', cp:'複製檔案', mv:'搬移／改名', rm:'刪除檔案', clear:'清畫面', git:'模擬版本', uname:'模擬系統資訊', help:'查說明' };
  for (const [cmd, description] of Object.entries(cheatNames)) {
    const button = document.createElement('button'); button.type = 'button'; button.append(document.createTextNode(cmd));
    const small = document.createElement('small'); small.textContent = description; button.append(small);
    button.addEventListener('click', () => {
      if (command.disabled) { system('這關操作已完成；請先回答觀念題或按下一站，再輸入指令。'); return; }
      command.value = cmd === 'git' ? 'git --version' : cmd + (['cd','cat','mkdir','touch','cp','mv','rm'].includes(cmd) ? ' ' : ''); command.focus();
    }); $('cheats').append(button);
  }
  function recordText() {
    const lines = ['龍蝦終端機探險｜本分頁文字紀錄', '這是瀏覽器內模擬，不是實際電腦、Git 或 GitHub 操作證明。', '目前進度：' + completedCount() + '/' + missions.length + '（含觀念題）', '', '【關卡證據】'];
    proofs.forEach((p, i) => {
      if (!p) return;
      lines.push((i + 1) + '. ' + p.title, p.proof, '本次過關看過提示：' + p.hints + ' 段');
      if (missions[i].quiz) lines.push(p.understanding ? '觀念題答對：' + p.understanding : '觀念題：尚待作答');
    });
    for (const [name, s] of [['關卡', lesson], ['自由沙盒', sandbox]]) {
      lines.push('', '【' + name + '操作紀錄】');
      if (s.truncated) lines.push('（操作超過上限，僅保留最近 1000 筆）');
      s.transcript.forEach(entry => {
        if (entry.note) lines.push('── ' + entry.note + ' ──');
        else lines.push(entry.cwd + ' $ ' + entry.input, entry.output || '（無文字輸出）');
      });
    }
    lines.push('', '【我自己的筆記】', $('reflection').value || '（尚未填寫）');
    return lines.join('\n');
  }
  function openRecord() {
    recordReturnFocus = document.activeElement; $('record-text').value = recordText(); $('copy-status').textContent = '';
    if (typeof $('record-dialog').showModal === 'function') $('record-dialog').showModal();
    else $('record-dialog').setAttribute('open', '');
    $('record-text').focus();
  }
  $('open-record').addEventListener('click', openRecord); $('notes-record').addEventListener('click', openRecord);
  $('close-record').addEventListener('click', () => {
    if (typeof $('record-dialog').close === 'function') $('record-dialog').close();
    else { $('record-dialog').removeAttribute('open'); recordReturnFocus?.focus(); }
  });
  $('record-dialog').addEventListener('close', () => recordReturnFocus?.focus());
  $('copy-record').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('record-text').value); $('copy-status').textContent = '✓ 已複製文字。'; }
    catch { $('record-text').focus(); $('record-text').select(); $('copy-status').textContent = '文字已選取，請用系統「複製」或 Ctrl/Cmd+C。'; }
  });
  $('download-record').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob(['\ufeff' + $('record-text').value], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'lobster-terminal-notes.txt';
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
    $('copy-status').textContent = '已請瀏覽器下載 .txt；若未下載，可改用複製文字。';
  });
  system('🦞 歡迎登陸 Shell Island！\n這是虛擬終端機，只會改動遊戲裡的檔案。\n看左邊（手機看上方）的任務，從第一行指令開始。\n$ 是提示符，不用輸入。輸入 help 可看支援的指令。');
  lesson.transcript.push({ note: '開始第 1 關：' + missions[0].title });
  renderMission();
})();
