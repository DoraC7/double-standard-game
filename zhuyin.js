/* No synthesized pronunciation, microphone, tracking, storage, or external runtime requests. */
(() => {
  'use strict';
  const symbols = window.ZHUYIN;
  const $ = id => document.getElementById(id);
  const shuffle = items => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  function glyph(item, paths = item.strokes, extra = '') {
    return `<svg class="glyph ${extra}" viewBox="0 0 2048 2048" aria-hidden="true" focusable="false">${paths.map(path => `<path d="${path}"/>`).join('')}</svg>`;
  }
  function button(html, label, className = '') {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = className;
    b.innerHTML = html;
    if (label) b.setAttribute('aria-label', label);
    return b;
  }
  let mode = 'garden';
  let selected = symbols[0];
  let group = 'all';
  let strokeStep = null;
  let strokeTimer = null;
  let audio = null;
  let audioRequest = 0;
  let quiz = null;
  let toneQuiz = null;
  let adventure = null;

  function stopAudio() {
    audioRequest++;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audio = null;
    }
    $('question-play').classList.remove('playing');
    $('hunt-play').classList.remove('playing');
  }
  async function play(item) {
    stopAudio();
    const request = audioRequest;
    const sound = new Audio(item.audio);
    audio = sound;
    $('audio-status').textContent = '';
    if (mode === 'listen') {
      $('question-play').classList.add('playing');
      // Keep answer controls locked until the actual recording has begun playing.
      if (quiz && !quiz.solved) {
        quiz.heard = false;
        $('listen-answers').querySelectorAll('button:not(.wrong)').forEach(b => b.disabled = true);
      }
    }
    if (mode === 'hunt') $('hunt-play').classList.add('playing');
    const failed = () => {
      if (request !== audioRequest) return;
      $('question-play').classList.remove('playing');
      $('hunt-play').classList.remove('playing');
      $('audio-status').textContent = '這次沒有播出聲音。請確認音量與網路，再按一次喇叭；也可以先到符號花園看看。';
    };
    sound.addEventListener('error', failed, {once: true});
    sound.addEventListener('ended', () => {
      if (request === audioRequest) {
        $('question-play').classList.remove('playing');
        $('hunt-play').classList.remove('playing');
      }
    }, {once: true});
    try {
      await sound.play();
      if (request !== audioRequest) return false;
      if (mode === 'listen' && quiz && !quiz.solved) {
        quiz.heard = true;
        $('listen-answers').querySelectorAll('button:not(.wrong)').forEach(b => b.disabled = false);
      }
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') failed();
      return false;
    }
  }

  function clearStrokes() {
    clearInterval(strokeTimer);
    strokeTimer = null;
  }
  function switchMode(next) {
    stopAudio();
    clearStrokes();
    if (adventure) adventure.leave();
    mode = next;
    quiz = null;
    toneQuiz = null;
    $('audio-status').textContent = '';
    ['garden', 'listen', 'tones', 'match', 'hunt'].forEach(id => $(id).hidden = id !== next);
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === next)));
    if (next === 'listen') listenSetup();
    if (next === 'tones') toneSetup();
    if (next === 'garden') renderStudy();
    if (adventure) adventure.enter(next);
  }
  function openMode(next) {
    if (next !== mode) switchMode(next);
    $(next).scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
  }
  document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
    openMode(b.dataset.mode);
  }));

  function renderGrid() {
    $('symbol-grid').replaceChildren();
    symbols.filter(item => group === 'all' || item.group === group).forEach(item => {
      const b = button(glyph(item), `${item.symbol}，聽發音`, 'symbol-key');
      b.dataset.number = item.id;
      b.setAttribute('aria-pressed', String(item.id === selected.id));
      b.addEventListener('click', () => {
        selected = item;
        clearStrokes();
        strokeStep = null;
        // Preserve the clicked button and keyboard focus while updating selection.
        $('symbol-grid').querySelectorAll('button').forEach(key => key.setAttribute('aria-pressed', String(Number(key.dataset.number) === item.id)));
        renderStudy();
        adventure.visit(item);
        play(item);
      });
      $('symbol-grid').append(b);
    });
  }
  function renderStudy() {
    const count = selected.strokes.length;
    $('symbol-label').textContent = `${selected.group === 'initial' ? '聲符' : '韻符'} · 符號 ${selected.id} / 37`;
    $('writing-board').innerHTML = glyph(selected);
    const paths = [...$('writing-board').querySelectorAll('path')];
    if (strokeStep !== null) paths.forEach((path, i) => path.style.fill = i < strokeStep ? (i === strokeStep - 1 ? '#bf603d' : '#25634f') : '#d7ddc9');
    $('writing-board').setAttribute('aria-label', `${selected.symbol}，共${count}筆，${strokeStep === null ? '完整字形' : `第${strokeStep}筆`}`);
    $('stroke-label').textContent = `${selected.symbol} · 共 ${count} 筆`;
    $('stroke-step').textContent = strokeStep === null ? '完整字形' : `第 ${strokeStep} / ${count} 筆`;
    $('stroke-prev').disabled = strokeStep === null || strokeStep <= 1;
    $('stroke-next').disabled = strokeStep !== null && strokeStep >= count;
  }
  document.querySelectorAll('[data-group]').forEach(b => b.addEventListener('click', () => {
    group = b.dataset.group;
    stopAudio();
    clearStrokes();
    if (group !== 'all' && selected.group !== group) {
      selected = symbols.find(item => item.group === group);
      strokeStep = null;
    }
    document.querySelectorAll('[data-group]').forEach(key => key.setAttribute('aria-pressed', String(key === b)));
    renderGrid();
    renderStudy();
  }));
  $('study-play').addEventListener('click', () => play(selected));
  $('stroke-play').addEventListener('click', () => {
    clearStrokes();
    strokeStep = 1;
    renderStudy();
    if (strokeStep === selected.strokes.length) return;
    strokeTimer = setInterval(() => {
      strokeStep++;
      renderStudy();
      if (strokeStep >= selected.strokes.length) clearStrokes();
    }, 850);
  });
  $('stroke-prev').addEventListener('click', () => {
    clearStrokes();
    if (strokeStep > 1) strokeStep--;
    renderStudy();
  });
  $('stroke-next').addEventListener('click', () => {
    clearStrokes();
    strokeStep = strokeStep === null ? 1 : Math.min(strokeStep + 1, selected.strokes.length);
    renderStudy();
  });

  function dots(id, index, total) {
    $(id).innerHTML = Array.from({length: total}, (_, i) => `<i class="${i < index ? 'done' : i === index ? 'current' : ''}"></i>`).join('');
  }
  function listenSetup() {
    stopAudio();
    quiz = null;
    $('listen-setup').hidden = false;
    $('listen-game').hidden = true;
    $('listen-result').hidden = true;
  }
  function startListen() {
    const poolId = document.querySelector('input[name="pool"]:checked').value;
    const pool = symbols.filter(item => poolId === 'all' || (poolId === 'starter' ? item.id <= 4 : item.group === poolId));
    const deck = [];
    while (deck.length < 6) {
      const batch = shuffle(pool);
      if (deck.length && batch[0].id === deck[deck.length - 1].id) [batch[0], batch[1]] = [batch[1], batch[0]];
      deck.push(...batch);
    }
    quiz = {pool, deck: deck.slice(0, 6), index: 0, first: 0, attempts: 0, missed: new Map(), solved: false, heard: false, choices: poolId === 'starter' ? 2 : 4};
    $('listen-setup').hidden = true;
    $('listen-result').hidden = true;
    $('listen-game').hidden = false;
    renderListen();
  }
  function renderListen() {
    const q = quiz;
    const target = q.deck[q.index];
    q.solved = false;
    q.heard = false;
    q.attempts = 0;
    $('listen-progress').textContent = `朋友 ${q.index + 1} / ${q.deck.length}`;
    dots('listen-dots', q.index, q.deck.length);
    $('listen-feedback').textContent = '';
    $('listen-next').hidden = true;
    $('listen-next').textContent = q.index === q.deck.length - 1 ? '看看這趟探險 →' : '下一位朋友 →';
    $('listen-answers').classList.toggle('two', q.choices === 2);
    $('listen-answers').replaceChildren();
    const options = shuffle([target, ...shuffle(q.pool.filter(item => item.id !== target.id)).slice(0, q.choices - 1)]);
    options.forEach(item => {
      const b = button(glyph(item), item.symbol, 'answer');
      b.dataset.symbol = item.symbol;
      b.disabled = true;
      b.addEventListener('click', () => {
        if (!quiz || q !== quiz || q.solved || !q.heard) return;
        q.attempts++;
        if (item.id === target.id) {
          q.solved = true;
          if (q.attempts === 1) q.first++;
          b.classList.add('correct');
          $('listen-answers').querySelectorAll('button').forEach(key => key.disabled = true);
          $('listen-feedback').textContent = `找到 ${target.symbol} 了！${q.attempts === 1 ? '耳朵真仔細。' : '慢慢聽，也能找到朋友。'}`;
          $('listen-next').hidden = false;
          $('listen-next').focus({preventScroll: true});
        } else {
          b.classList.add('wrong');
          b.disabled = true;
          q.missed.set(target.id, target);
          $('listen-feedback').textContent = '還不是這個朋友，再聽一次試試看。';
          play(target);
        }
      });
      $('listen-answers').append(b);
    });
    $('listen-question').focus({preventScroll: true});
    play(target);
  }
  function finishListen() {
    stopAudio();
    $('listen-game').hidden = true;
    $('listen-result').hidden = false;
    const missed = [...quiz.missed.values()];
    $('listen-summary').textContent = `完成 ${quiz.deck.length} 題，其中 ${quiz.first} 題第一次就找到。${missed.length ? '下面這些朋友可以再聽聽，點一下就有聲音。' : '每一題都一次找到！也可以換一組新朋友。'}`;
    $('review-symbols').replaceChildren();
    missed.forEach(item => {
      const b = button(glyph(item), `再聽${item.symbol}`);
      b.addEventListener('click', () => play(item));
      $('review-symbols').append(b);
    });
    $('listen-result-title').focus({preventScroll: true});
    adventure.award('listen');
  }
  $('listen-start').addEventListener('click', startListen);
  $('question-play').addEventListener('click', () => { if (quiz) play(quiz.deck[quiz.index]); });
  $('listen-next').addEventListener('click', () => {
    if (!quiz || !quiz.solved) return;
    quiz.index++;
    if (quiz.index >= quiz.deck.length) finishListen(); else renderListen();
  });
  $('listen-learn').addEventListener('click', () => switchMode('garden'));
  $('listen-retry').addEventListener('click', startListen);
  $('listen-settings').addEventListener('click', listenSetup);

  // Rules: MOE handbook, 四、調號說明表. This mode does NOT synthesize tone audio.
  const tones = [
    {id: 1, name: '一聲', formal: '陰平', mark: '', hint: '高而平', rule: '一聲的調號可以省略，這裡不標。'},
    {id: 2, name: '二聲', formal: '陽平', mark: 'ˊ', hint: '往上升', rule: '二聲的 ˊ 在最後一個注音符號右上角。'},
    {id: 3, name: '三聲', formal: '上聲', mark: 'ˇ', hint: '先降後升', rule: '三聲的 ˇ 在最後一個注音符號右上角。'},
    {id: 4, name: '四聲', formal: '去聲', mark: 'ˋ', hint: '往下降', rule: '四聲的 ˋ 在最後一個注音符號右上角。'},
    {id: 5, name: '輕聲', formal: '輕聲', mark: '˙', hint: '輕而短', rule: '輕聲的 ˙：橫式在字音前方，直式在字音上方。'}
  ];
  function syllable(tone, vertical = false) {
    const letters = `<span class="letters">${glyph(symbols[2])}${glyph(symbols[21])}</span>`;
    const mark = tone.mark ? `<span class="mark ${tone.id === 5 ? 'neutral' : ''}">${tone.mark}</span>` : '';
    return `<span class="syllable ${vertical ? 'vertical' : 'horizontal'}" aria-hidden="true">${tone.id === 5 ? mark + letters : letters + mark}</span>`;
  }
  $('tone-guide').innerHTML = tones.map(tone => `<div class="tone-tile"><b>${tone.name}</b><small>${tone.formal}</small>${syllable(tone)}<p>${tone.hint}<br>${tone.id === 1 ? '省略調號' : tone.id === 5 ? '橫式標在前方' : '標在最後右上角'}</p></div>`).join('');
  function toneSetup() {
    toneQuiz = null;
    $('tone-setup').hidden = false;
    $('tone-game').hidden = true;
    $('tone-result').hidden = true;
  }
  function startTone() {
    toneQuiz = {deck: shuffle(tones), index: 0, first: 0, attempts: 0, solved: false, vertical: document.querySelector('input[name="orientation"]:checked').value === 'vertical'};
    $('tone-setup').hidden = true;
    $('tone-result').hidden = true;
    $('tone-game').hidden = false;
    renderTone();
  }
  function renderTone() {
    const q = toneQuiz;
    const target = q.deck[q.index];
    q.solved = false;
    q.attempts = 0;
    $('tone-progress').textContent = `車站 ${q.index + 1} / 5`;
    dots('tone-dots', q.index, 5);
    $('tone-direction').textContent = `${q.vertical ? '直式 ↓' : '橫式 →'} · 找到指定聲調的注音`;
    $('tone-question').textContent = `哪一張是「${target.name}${target.id === 5 ? '' : '・' + target.formal}」？`;
    $('tone-feedback').textContent = '';
    $('tone-next').hidden = true;
    $('tone-next').textContent = q.index === 4 ? '小火車到站囉 →' : '下一站 →';
    $('tone-answers').replaceChildren();
    const options = shuffle([target, ...shuffle(tones.filter(tone => tone.id !== target.id)).slice(0, 3)]);
    options.forEach(tone => {
      // Describe the visual annotation, not the answer's tone name, for screen-reader play.
      const label = tone.id === 1 ? 'ㄇㄚ，不標調號' : tone.id === 5 ? `ㄇㄚ，點在${q.vertical ? '上方' : '前方'}` : `ㄇㄚ，${tone.mark}在最後右上角`;
      const b = button(syllable(tone, q.vertical), label, 'answer');
      b.dataset.tone = tone.id;
      b.addEventListener('click', () => {
        if (!toneQuiz || q !== toneQuiz || q.solved) return;
        q.attempts++;
        if (tone.id === target.id) {
          q.solved = true;
          if (q.attempts === 1) q.first++;
          b.classList.add('correct');
          $('tone-answers').querySelectorAll('button').forEach(key => key.disabled = true);
          $('tone-feedback').textContent = `答對了！${target.rule}`;
          $('tone-next').hidden = false;
          $('tone-next').focus({preventScroll: true});
        } else {
          b.classList.add('wrong');
          b.disabled = true;
          $('tone-feedback').textContent = `再看一次：${target.rule}`;
        }
      });
      $('tone-answers').append(b);
    });
    $('tone-question').focus({preventScroll: true});
  }
  $('tone-start').addEventListener('click', startTone);
  $('tone-next').addEventListener('click', () => {
    if (!toneQuiz || !toneQuiz.solved) return;
    toneQuiz.index++;
    if (toneQuiz.index < 5) return renderTone();
    $('tone-game').hidden = true;
    $('tone-result').hidden = false;
    $('tone-summary').textContent = `完成 ${toneQuiz.vertical ? '直式' : '橫式'} 5 題，其中 ${toneQuiz.first} 題第一次就找到。記得：輕聲橫式在前，直式在上！`;
    $('tone-result-title').focus({preventScroll: true});
    adventure.award('tones');
  });
  $('tone-back').addEventListener('click', toneSetup);
  $('tone-retry').addEventListener('click', startTone);
  $('tone-settings').addEventListener('click', toneSetup);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAudio();
      clearStrokes();
      adventure.pause();
    }
  });
  window.addEventListener('pagehide', () => { stopAudio(); clearStrokes(); adventure.pause(); });
  adventure = window.createZhuyinAdventure({
    symbols, shuffle, glyph, play, stopAudio,
    openMode
  });
  renderGrid();
  renderStudy();
})();
