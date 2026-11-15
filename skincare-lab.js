(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const engine = window.SkincareEngine;
  const questions = window.SkincareData.questions;
  const home = $('home'), play = $('play'), result = $('result');
  let round = null;
  let selectedMode = 'quick';

  function show(section) {
    home.hidden = section !== home;
    play.hidden = section !== play;
    result.hidden = section !== result;
    window.scrollTo(0, 0);
  }
  function start(mode, firstAttempt = null, runNumber = 1, fixedQuestions = null) {
    selectedMode = mode;
    round = fixedQuestions
      ? engine.createRound(fixedQuestions, mode, Math.random, firstAttempt, runNumber)
      : engine.createRound(questions, mode, Math.random, firstAttempt, runNumber);
    $('round-label').textContent = `${mode === 'full' ? '完整成分巡查' : '快閃成分巡查'}${runNumber > 1 ? `・第 ${runNumber} 輪` : ''}`;
    show(play);
    renderQuestion();
  }
  function renderQuestion() {
    const q = round.questions[round.index];
    $('question-title').textContent = `${round.index + 1}．${q.title}`;
    $('category').textContent = q.category;
    $('badge').textContent = q.badge;
    $('prompt').textContent = q.prompt;
    $('progress-text').textContent = `第 ${round.index + 1} / ${round.questions.length} 題`;
    $('score-text').textContent = `答對 ${round.records.filter(record => record.correct).length} 題`;
    $('progress').max = round.questions.length;
    $('progress').value = round.index;
    $('progress').setAttribute('aria-valuetext', `第 ${round.index + 1} 題，共 ${round.questions.length} 題`);
    const choices = $('choices');
    choices.replaceChildren();
    q.displayOptions.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice';
      button.setAttribute('aria-pressed', 'false');
      const mark = document.createElement('span');
      mark.className = 'choice-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = String.fromCharCode(65 + index);
      button.append(mark, document.createTextNode(option));
      button.addEventListener('click', () => {
        if (round.committed) return;
        engine.select(round, index);
        choices.querySelectorAll('.choice').forEach((item, itemIndex) => item.setAttribute('aria-pressed', String(itemIndex === index)));
        $('confirm').disabled = false;
      });
      choices.append(button);
    });
    $('confirm').disabled = true;
    $('confirm').hidden = false;
    $('skip').hidden = false;
    $('feedback').hidden = true;
    $('feedback').classList.remove('wrong');
    $('next').textContent = round.index + 1 === round.questions.length ? '看檢驗報告 →' : '下一題 →';
    $('progress').value = round.index;
    choices.querySelector('.choice')?.focus();
  }
  function reveal(record) {
    const q = round.questions[round.index];
    const feedback = $('feedback');
    const choices = $('choices');
    choices.querySelectorAll('.choice').forEach(button => { button.disabled = true; });
    $('confirm').hidden = true;
    $('skip').hidden = true;
    feedback.hidden = false;
    feedback.classList.toggle('wrong', !record.correct);
    $('feedback-title').textContent = record.skipped ? `📝 先記下這題：正解是「${record.correctAnswer}」` : record.correct ? '🔎 線索抓到了！' : `🧴 這個線索不太對；答案是「${record.correctAnswer}」`;
    $('explanation').textContent = q.explanation;
    $('score-text').textContent = `答對 ${round.records.filter(item => item.correct).length} 題`;
    $('progress').value = round.index + 1;
    $('next').focus();
  }
  function completeRound() {
    const current = engine.snapshot(round);
    const first = round.firstAttempt;
    $('result-summary').textContent = `本輪答對 ${current.correct} / ${current.total} 題，跳過 ${current.skipped} 題。每題分母都計入總題數；跳過會另外標出，不當成答錯。`;
    const stats = $('result-stats');
    stats.replaceChildren();
    const cards = [
      ['本輪答對', `${current.correct}/${current.total}`],
      ['跳過', String(current.skipped)],
      ['完成關卡', String(round.runNumber)]
    ];
    if (first && round.runNumber > 1) cards.splice(2, 0, ['首輪答對', `${first.correct}/${first.total}`]);
    for (const [label, value] of cards) {
      const item = document.createElement('div');
      const number = document.createElement('b'); number.textContent = value;
      const caption = document.createElement('span'); caption.textContent = label;
      item.append(number, caption); stats.append(item);
    }
    const review = $('review');
    review.replaceChildren();
    round.questions.forEach((q, index) => {
      const record = current.records[index];
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = `${index + 1}. ${q.title}｜${record.skipped ? '跳過' : record.correct ? '答對' : '答錯'}`;
      summary.className = record.skipped ? '' : record.correct ? 'correct' : 'missed';
      const answer = document.createElement('p');
      answer.textContent = `你的答案：${record.skipped ? '跳過' : record.selected}　｜　正解：${record.correctAnswer}`;
      const explanation = document.createElement('p'); explanation.textContent = q.explanation;
      details.append(summary, answer, explanation); review.append(details);
    });
    $('retry').textContent = `重練這組（保留首輪 ${round.firstAttempt.correct}/${round.firstAttempt.total}）`;
    $('retry').hidden = false;
    $('export').disabled = false;
    show(result);
  }

  $('quick-start').addEventListener('click', () => start('quick'));
  $('full-start').addEventListener('click', () => start('full'));
  $('confirm').addEventListener('click', () => {
    const record = engine.commit(round);
    if (record) reveal(record);
  });
  $('skip').addEventListener('click', () => {
    if (engine.skip(round)) reveal(round.records[round.records.length - 1]);
  });
  $('next').addEventListener('click', () => {
    if (!engine.advance(round)) return;
    if (round.complete) completeRound();
    else renderQuestion();
  });
  $('leave-round').addEventListener('click', () => { round = null; show(home); $('quick-start').focus(); });
  $('retry').addEventListener('click', () => {
    const next = engine.retry(round);
    if (next) { round = next; $('round-label').textContent = `${round.mode === 'full' ? '完整成分巡查' : '快閃成分巡查'}・第 ${round.runNumber} 輪`; show(play); renderQuestion(); }
  });
  $('new-round').addEventListener('click', () => { round = null; show(home); $('quick-start').focus(); });
  $('export').addEventListener('click', () => {
    if (!round) return;
    const blob = new Blob([engine.exportText(round)], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'skincare-lab-round.txt'; link.click();
    URL.revokeObjectURL(url);
  });
  document.addEventListener('keydown', event => {
    if (play.hidden || round?.committed || round?.complete || !['1', '2', '3'].includes(event.key)) return;
    const index = Number(event.key) - 1;
    const button = $('choices').querySelectorAll('.choice')[index];
    if (button) { event.preventDefault(); button.click(); }
  });
})();
