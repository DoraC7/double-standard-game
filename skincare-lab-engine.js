(function (root) {
  'use strict';

  const QUICK_COUNT = 10;
  function shuffled(items, random = Math.random) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function chooseQuickSet(questions, random) {
    const categories = [...new Set(questions.map(q => q.category))];
    const picked = [];
    for (const category of shuffled(categories, random)) {
      const options = shuffled(questions.filter(q => q.category === category), random);
      if (options.length) picked.push(options[0]);
    }
    const used = new Set(picked.map(q => q.id));
    const remaining = shuffled(questions.filter(q => !used.has(q.id)), random);
    while (picked.length < Math.min(QUICK_COUNT, questions.length) && remaining.length) picked.push(remaining.pop());
    return shuffled(picked, random);
  }
  function createRound(questions, mode = 'quick', random = Math.random, firstAttempt = null, runNumber = 1) {
    const chosen = mode === 'full' ? shuffled(questions, random) : chooseQuickSet(questions, random);
    return {
      mode: mode === 'full' ? 'full' : 'quick',
      questions: chosen.map(question => ({...question, displayOptions: shuffled(question.options, random)})),
      index: 0,
      selectedIndex: null,
      committed: false,
      records: [],
      firstAttempt: firstAttempt ? structuredClone(firstAttempt) : null,
      latestAttempt: null,
      runNumber,
      complete: false
    };
  }
  function select(round, optionIndex) {
    if (round.complete || round.committed || !Number.isInteger(optionIndex)) return false;
    const q = round.questions[round.index];
    if (!q || optionIndex < 0 || optionIndex >= q.displayOptions.length) return false;
    round.selectedIndex = optionIndex;
    return true;
  }
  function commit(round) {
    if (round.complete || round.committed || round.selectedIndex === null) return null;
    const question = round.questions[round.index];
    const selected = question.displayOptions[round.selectedIndex];
    const correctAnswer = question.options[question.answer];
    const record = {
      questionId: question.id,
      selected,
      correctAnswer,
      correct: selected === correctAnswer,
      skipped: false
    };
    round.records.push(record);
    round.committed = true;
    return record;
  }
  function skip(round) {
    if (round.complete || round.committed) return false;
    const question = round.questions[round.index];
    round.records.push({
      questionId: question.id,
      selected: null,
      correctAnswer: question.options[question.answer],
      correct: false,
      skipped: true
    });
    round.committed = true;
    round.selectedIndex = null;
    return true;
  }
  function snapshot(round) {
    return {
      mode: round.mode,
      questionIds: round.questions.map(q => q.id),
      records: round.records.map(record => ({...record})),
      total: round.questions.length,
      correct: round.records.filter(record => record.correct).length,
      skipped: round.records.filter(record => record.skipped).length
    };
  }
  function advance(round) {
    if (!round.committed || round.complete) return false;
    if (round.index + 1 < round.questions.length) {
      round.index++;
      round.selectedIndex = null;
      round.committed = false;
      return true;
    }
    const result = snapshot(round);
    if (!round.firstAttempt) round.firstAttempt = structuredClone(result);
    round.latestAttempt = structuredClone(result);
    round.complete = true;
    return true;
  }
  function retry(round, random = Math.random) {
    if (!round.complete) return null;
    const first = round.firstAttempt || snapshot(round);
    return createRound(round.questions, round.mode, random, first, round.runNumber + 1);
  }
  function exportText(round) {
    const latest = round.latestAttempt || snapshot(round);
    const lines = [
      '臉部保養品成分偵探｜本機文字紀錄',
      `模式：${latest.mode === 'full' ? '完整 20 題' : `快閃 ${latest.total} 題`}`,
      `本次：答對 ${latest.correct}/${latest.total}；跳過 ${latest.skipped} 題`,
      ''
    ];
    if (round.firstAttempt && round.runNumber > 1) lines.push(`首輪保留：答對 ${round.firstAttempt.correct}/${round.firstAttempt.total}；最新一輪：${latest.correct}/${latest.total}`, '');
    round.questions.forEach((question, index) => {
      const record = latest.records[index];
      lines.push(`${index + 1}. ${question.title}`);
      lines.push(`題目：${question.prompt}`);
      lines.push(`你的答案：${record?.skipped ? '跳過' : record?.selected ?? '尚未作答'}`);
      lines.push(`正解：${record?.correctAnswer ?? question.options[question.answer]}`);
      lines.push(`判定：${record?.skipped ? '跳過' : record?.correct ? '答對' : '答錯'}`);
      lines.push(`解析：${question.explanation}`, '');
    });
    lines.push('一般保養知識遊戲，不是個人醫療建議。');
    return lines.join('\n');
  }
  const api = { QUICK_COUNT, shuffled, createRound, select, commit, skip, advance, retry, snapshot, exportText };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SkincareEngine = api;
})(globalThis);
