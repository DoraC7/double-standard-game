const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function game() {
  const nodes = new Map();
  class Element {
    constructor() {
      this.children = []; this.attributes = {}; this.disabled = false; this.textContent = '';
      this.style = {setProperty() {}}; this.clientWidth = 360;
      this.classList = {add() {}, toggle() { return false; }};
    }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = children; }
    setAttribute(key, value) { this.attributes[key] = value; }
    focus() { document.activeElement = this; }
    click() { if (!this.disabled) this.onclick?.({target:this}); }
  }
  const document = {
    createElement() { return new Element(); }, createTextNode(text) { return {textContent:text}; },
    getElementById(id) {
      for (const node of nodes.values()) for (const child of node.children) if (child.id === id) return child;
      if (!nodes.has(id)) nodes.set(id, new Element());
      return nodes.get(id);
    },
    addEventListener() {}, body:new Element()
  };
  const context = vm.createContext({document});
  vm.runInContext(fs.readFileSync(require.resolve('../dora-forget.js'), 'utf8'), context);
  return {document, run: code => vm.runInContext(code, context), get:id=>document.getElementById(id)};
}
function enterResponses(g, wrong = false) {
  g.get('actions').children[0].click();
  const answer = g.run('queue[i].answers['+(wrong ? 1 : 0)+']');
  g.get('choices').children.find(b => b.textContent.endsWith(' · '+answer)).click();
  g.get('actions').children[0].click();
  g.get('actions').children[1].click();
}

test('未選招按發射會顯示提示，不會卡在無法點選的按鈕或提前計分', () => {
  const g = game(); g.get('short').click(); enterResponses(g);
  const fire = g.get('actions').children[0];
  assert.equal(fire.disabled, false);
  fire.click();
  assert.match(g.get('move-status').textContent, /還沒選擇/);
  assert.equal(g.document.activeElement, g.get('move-status'));
  assert.equal(g.run('phase'), 'response'); assert.equal(g.run('sparks'), 0);
  assert.equal(g.run('log[0].move'), undefined);
});

test('四種招式均可切換再確認；發射後鎖定、結果與分數不受連點影響', () => {
  for (let move = 0; move < 4; move++) {
    const g = game(); g.get('short').click(); enterResponses(g);
    const choices = [...g.get('choices').children], fire = g.get('actions').children[0];
    choices[(move+1)%4].click(); choices[move].click();
    assert.match(g.get('move-status').textContent, /已選擇/);
    assert.deepEqual(choices.map(b=>b.attributes['aria-pressed']), choices.map((_,i)=>String(i===move)));
    assert.equal(g.run('sparks'), 0);
    fire.click(); const feedback = g.get('feedback').textContent, sparks = g.run('sparks');
    assert.equal(g.run('phase'), 'result'); assert.equal(g.run('log[0].move'), choices[move].textContent);
    assert.equal(sparks, [3,4,5,0][move]); assert.equal(fire.disabled, true);
    choices.forEach(b=>b.click()); fire.click();
    assert.equal(g.get('feedback').textContent, feedback); assert.equal(g.run('sparks'), sparks);
  }
});

test('完整16幕與快閃4幕皆可完成，記錯不阻擋發射，重新開場清空選擇與戰報', () => {
  for (const count of [4,16]) {
    const g = game(); g.get(count === 4 ? 'short' : 'full').click();
    for (let i = 0; i < count; i++) {
      enterResponses(g, i === 0);
      assert.equal(g.run('selected'), null);
      assert.match(g.get('move-status').textContent, /尚未選招/);
      g.get('choices').children[i%4].click(); g.get('actions').children[0].click();
      g.get('actions').children[1].click();
    }
    assert.equal(g.run('phase'), 'done'); assert.equal(g.run('score'), count-1);
    assert.equal(g.run('log.length'), count); assert.equal(g.run('new Set(log.map(r=>r.title)).size'), count);
    assert.equal(g.get('content').children.length, count+1);
    g.get('reset').click();
    assert.equal(g.run('phase'), 'memory'); assert.equal(g.run('sparks'), 0);
    assert.equal(g.run('score'), 0); assert.equal(g.run('log.length'), 0);
  }
});
