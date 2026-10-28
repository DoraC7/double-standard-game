async function melonBrowserQA(){
 const $=id=>document.getElementById(id),checks=[];
 const ok=(value,label)=>{if(!value)throw Error(label);checks.push(label);};
 const fit=()=>ok(document.documentElement.scrollWidth<=innerWidth,'無水平溢出');
 const level=n=>{$('level').value=n;$('level').dispatchEvent(new Event('input',{bubbles:true}));};
 const choose=n=>$('choices').children[n].click();
 const play=async(path,power,expected)=>{
  ($('intro').hidden?$('restart'):$('start')).click();ok(!$('play').hidden,'參選成功');
  for(let i=0;i<8;i++){
   ok($('confirm').disabled,'尚未選活動，確認停用');fit();
   const before=$('budget').textContent;choose(path[i]);level(power);
   ok(!$('confirm').disabled,'可行活動可確認');ok($('budget').textContent===before,'預覽不扣預算');
   $('confirm').click();const budget=$('budget').textContent,feedback=$('feedback').textContent;
   ok([...$('choices').children].every(b=>b.disabled)&&$('level').disabled,'確認後鎖定全部輸入');
   $('confirm').click();choose((path[i]+1)%3);level(3);
   ok($('budget').textContent===budget&&$('feedback').textContent===feedback,'重複操作不扣款或改結果');fit();$('next').click();
  }
  ok(!$('election').hidden&&$('outcome').hidden,'完成八回合後才開票');
  for(let i=0;i<3;i++){const b=$('boxes').children[i];b.click();const count=$('count').textContent;b.click();ok($('count').textContent===count,'票匭不得重複計票');if(i<2)ok($('outcome').hidden,'未開完不揭曉結局');fit();}
  ok(!$('outcome').hidden,'三區開完出現結果');ok($('result-text').textContent.includes(`西瓜 ${expected} 票`),'票數符合路線');
  ok($('ledger').children.length===8,'帳本包含八回合');ok(document.activeElement===$('result-title'),'結局鍵盤焦點');
 };
 await play([1,1,1,1,1,1,1,1],1,2690);ok($('result-title').textContent.includes('當選市長'),'勝選結局');
 await play([2,0,0,2,2,0,2,0],0,950);ok($('result-title').textContent.includes('落選'),'落選結局');
 $('restart').click();ok($('budget').textContent==='100 點'&&$('water').textContent==='70 / 100','重玩重設全部資源');
 for(let i=0;i<5;i++){choose(0);level(3);ok(!$('confirm').disabled,'高花費路線可執行');$('confirm').click();$('next').click();}
 ok($('budget').textContent==='3 點','高花費路線剩餘3點');choose(1);level(0);ok($('confirm').disabled&&$('preview').textContent.includes('資源不足'),'資源不足清楚提示且不能執行');choose(0);ok(!$('confirm').disabled,'零花費退路可繼續');
 $('reset').click();ok(!$('intro').hidden&&document.activeElement===$('start'),'放棄返回說明並恢復焦點');
 $('start').click();level(3);await new Promise(resolve=>setTimeout(resolve,330));const high=getComputedStyle($('jets')).transform;
 level(0);await new Promise(resolve=>setTimeout(resolve,330));const low=getComputedStyle($('jets')).transform;ok(high!==low&&low.includes(', 0,'),'噴泉旋鈕改變實際顯示');
 const toggle=document.querySelector('.arcade-fx-toggle');if(toggle&&!toggle.disabled&&toggle.getAttribute('aria-pressed')==='true')toggle.click();level(2);ok(getComputedStyle($('jets')).transitionDuration==='0s','關閉動畫仍顯示噴泉但無過渡動畫');
 fit();await Promise.all([...document.images].map(i=>i.decode().catch(()=>null)));ok([...document.images].every(i=>i.naturalWidth>0),'圖片全部載入');
 return {viewport:[innerWidth,innerHeight],assertions:checks.length,win:2690,lose:950,checks:[...new Set(checks)]};
}
