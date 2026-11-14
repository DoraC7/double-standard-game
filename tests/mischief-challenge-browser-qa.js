function mischiefChallengeQA(){
 const $=id=>document.getElementById(id),check=(v,m)=>{if(!v)throw Error(m)},click=sel=>{const n=document.querySelector(sel);check(n&&!n.disabled,'按鈕可用 '+sel);n.click();},sel=(q,v)=>{const n=document.querySelector(q);check(n,'選單存在 '+q);n.value=String(v);n.dispatchEvent(new Event('change',{bubbles:true}));},act=x=>click(`[data-prank="${x}"]`),clean=x=>click(`[data-clean="${x}"]`);
 if($('prank-challenge').hidden)$('prank-open').click();
 $('prank-mode').value='all';$('prank-start').click();let completed=0;
 for(let i=0;i<9;i++){
 check(document.documentElement.scrollWidth<=innerWidth,'畫面不溢出 '+i);
 if(i<3){const props=i===0?['mic','duck','confetti']:i===1?['mic','crown']:['mic','recorder','confetti'];for(const p of props){click(`[data-prop="${p}"]`);sel(`[data-place-for="${p}"]`,i);}
 if(i===2)sel('[data-route]','B');act('start-show');for(const p of props)act('step');check($('prank-game').textContent.includes('指定笑點：達成'),'順序及位置目標 '+i);
 if(i===0){clean('paper');check($('prank-game').textContent.includes('掃完又有彩帶'),'先掃不能關機');}
 for(const p of props)clean(p);clean('paper');clean('cards');
 }else if(i<6){sel('[data-question]',i-3);for(const route of ['C','B','A']){sel('[data-route]',route);act('broadcast');}clean('cards');}
 else{act('broadcast');sel('[data-question]',1);act('broadcast');act('inspect');if(i===6)click('[data-setting="loop"]');if(i===7)sel('[data-route]','A');if(i===8)click('[data-setting="echo"]');sel('[data-question]',0);act('broadcast');sel('[data-question]',1);act('broadcast');check($('prank-status').textContent.includes('2 / 2'),'兩題修復驗收 '+i);}
 act('finish');check($('prank-game').textContent.includes('最近：指定演出達成；收尾／修復達成'),'完整過關 '+i);check(!document.querySelector('[data-prank="broadcast"]'),'完成後鎖住演出');completed++;act('next');
 }
 check(!$('prank-summary').hidden,'完整回顧');check(document.querySelectorAll('.prank-review').length===9,'回顧九幕');check($('prank-summary').textContent.includes('保力答'),'實際回覆保留');
 $('prank-summary').querySelector('button').click();
 // 錯誤提交後重演，不覆寫首次；切換原版並可重新進場。
 $('prank-classic').click();check(!$('intro').hidden,'回原版');$('prank-open').click();$('prank-mode').value='recorder';$('prank-start').click();act('finish');act('retry');act('broadcast');sel('[data-question]',1);act('broadcast');act('inspect');click('[data-setting="loop"]');sel('[data-question]',0);act('broadcast');sel('[data-question]',1);act('broadcast');act('finish');check($('prank-game').textContent.includes('首次：0 / 2'),'首次錯誤保留');act('retry');act('pause');check($('prank-game').textContent.includes('已暫停'),'暫停');act('pause');window.dispatchEvent(new Event('blur'));check($('prank-game').textContent.includes('已暫停'),'失焦暫停');act('pause');$('prank-classic').click();check(!$('intro').hidden,'結束回原版');
 return {completed};
}
