async () => {
 const $=id=>document.getElementById(id), E=LogicVillage,checks=[];
 const ok=(v,msg)=>{if(!v)throw Error(msg);checks.push(msg);};
 const click=id=>$(id).click();
 const predict=()=>{$('prediction').value='0';$('prediction').dispatchEvent(new Event('input',{bubbles:true}));};
 const assemble=l=>{click('reset');while($('program').querySelector('li'))$('program').querySelector('li .row-controls button:last-child').click();for(const card of l.solution){const b=[...$('palette').children].find(b=>b.textContent==='＋'+E.OPS[card.op]);b.click();const row=$('program').lastElementChild;const input=row.querySelector('input');if(input){input.value=card.arg;input.dispatchEvent(new Event('input',{bubbles:true}));}}};
 if(!$('start').hidden)click('start');
 for(let i=0;i<13;i++){
  [...$('levels').children][i].click();const l=E.levels[i];ok($('confirm').disabled,'關 '+i+' 尚未跑不可驗收');
  click('run');ok($('notice').textContent.includes('先填'),'關 '+i+' 空白預測提示');
  if([0,2,4,6,8,10].includes(i)){predict();click('run');click('confirm');ok($('feedback').textContent.includes('尚未完成'),'關 '+i+' 錯誤驗收不算過關');const before=$('progress').textContent;click('confirm');ok($('progress').textContent===before,'關 '+i+' 驗收鎖定');}
  assemble(l);predict();click('run');ok($('test-results').children.length===l.cases.length,'關 '+i+' 全案例呈現');ok(!$('test-results').textContent.includes('✗'),'關 '+i+' 正解全案例通過');
  if(i===0){const input=$('program').querySelector('input');input.value='6';input.dispatchEvent(new Event('input',{bubbles:true}));ok($('confirm').disabled,'修改後舊成功失效');predict();click('run');ok($('test-results').textContent.includes('✗'),'修改後確實重跑失敗');assemble(l);predict();click('run');window.dispatchEvent(new Event('blur'));ok($('confirm').disabled&&$('pause').textContent==='繼續','失焦暫停');click('pause');ok(!$('confirm').disabled,'手動繼續恢復');}
  for(let j=0;j<l.cases.length;j++){$('case-select').value=j;$('case-select').dispatchEvent(new Event('change'));let guard=0;while(!$('step').disabled&&guard++<181){click('step');ok(document.documentElement.scrollWidth<=innerWidth,'關 '+i+' 案例 '+j+' 步驟 '+guard+' 無水平溢出');}ok(guard<181,'有限步數完成');const expected=E.run(l.solution,l.cases[j]).state;const actual=[...document.querySelectorAll('#state b')].map(n=>Number(n.textContent));ok(JSON.stringify(actual)===JSON.stringify(['stock','order','shipped','water','result','bag','amount'].map(k=>expected[k])),'關 '+i+' 案例 '+j+' 顯示狀態正確');if(guard){click('back');ok(!$('step').disabled,'可以返回再單步');click('step');}}
  click('confirm');ok($('feedback').textContent.includes('驗收通過'),'關 '+i+' 完成');ok($('confirm').disabled,'關 '+i+' 通過後鎖定');
 }
 ok($('progress').textContent.startsWith('13 / 13'),'完整13關進度');ok($('progress').textContent.includes('首次驗收獨立通過 7 關'),'六次故意失敗的首次結果保留');ok($('review').children.length===13,'完整複習13項');ok(!$('graduation').hidden,'畢業總結可見');
 await Promise.all([...document.images].map(i=>i.decode().catch(()=>null)));ok([...document.images].every(i=>i.naturalWidth>0),'圖片載入');
 return {checks:checks.length,progress:$('progress').textContent,viewport:[innerWidth,innerHeight],overflow:document.documentElement.scrollWidth>innerWidth};
}
