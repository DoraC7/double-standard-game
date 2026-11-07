async function scienceLabQA(){
 const $=id=>document.getElementById(id),E=ScienceLab,check=(ok,t)=>{if(!ok)throw Error(t)},settle=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 const open=id=>document.querySelector('[data-lab="'+id+'"]').click();
 async function wipe(){if(!$('clear').disabled){$('clear').click();check($('clear-dialog').open,'清除需確認');$('clear-confirm').click();await settle();}}
 function input(key,value){const n=$('number-'+key);n.value=value;n.dispatchEvent(new Event('input',{bubbles:true}));}
 function run(prediction){$('prediction').value=prediction;$('prediction').dispatchEvent(new Event('change',{bubbles:true}));check(!$('run').disabled,'預測後可執行');$('run').click();check($('run').disabled,'執行後重新預測');}
 function pair(a,b){$('pair-a').value=a;$('pair-a').dispatchEvent(new Event('change',{bubbles:true}));$('pair-b').value=b;$('pair-b').dispatchEvent(new Event('change',{bubbles:true}));}
 function axis(key){$('x-axis').value=key;$('x-axis').dispatchEvent(new Event('change',{bubbles:true}));}
 // 清空本驗證先前建立的資料，並非操作使用者資料。
 for(const id of Object.keys(E.models)){open(id);await wipe();}
 const results=[];
 for(const [id,m] of Object.entries(E.models)){
  open(id);for(const p of m.params)input(p.key,p.value);axis(m.params[0].key);check($('table-body').children.length===0&&$('run').disabled&&$('export').disabled,'空白實驗狀態');check($('formula').textContent===m.formula,'公式符合模型');
  run('unsure');check($('table-body').children.length===1&&$('compare').disabled,'第一筆只建基準');
  input(m.params[0].key,m.params[0].max);check($('run').disabled,'改參數重設預測');run('increase');$('compare').click();check($('conclusion').textContent.includes('只改變'),'受控比較');check($('conclusion').textContent.includes('一致'),'預測相符');
  pair(2,2);run('same');$('compare').click();check($('conclusion').textContent.includes('設定完全相同'),'相同設定不當成因果證據');
  pair(1,3);input(m.params[1].key,m.params[1].max);run('unsure');$('compare').click();check($('conclusion').textContent.includes('同時改了'),'指出多變因');check($('chart').querySelectorAll('circle').length===3,'圖表排除其他條件不同的紀錄');
  pair(1,2);axis(m.params[1].key);$('compare').click();check($('conclusion').textContent.includes('不是你選的橫軸變因'),'改到其他變因的提示');
  pair(2,4);$('compare').click();check($('conclusion').textContent.includes('不是目前A'),'舊預測不套到新基準');
  input(m.params[0].key,m.params[0].min-m.params[0].step);$('prediction').value='increase';$('prediction').dispatchEvent(new Event('change',{bubbles:true}));check($('run').disabled&&$('input-error').textContent.length>0,'非法輸入擋執行');check($('table-body').children.length===4,'非法輸入不新增資料');input(m.params[0].key,m.params[0].max);
  let captured=null,filename='';const createURL=URL.createObjectURL,click=HTMLAnchorElement.prototype.click;
  try{URL.createObjectURL=blob=>{captured=blob;return createURL.call(URL,blob)};HTMLAnchorElement.prototype.click=function(){filename=this.download;};$('export').click();check(captured,'建立CSV Blob');const text=(await captured.text()).replace(/^\uFEFF/,'');check(text.trim().split(/\r?\n/).length===5,'CSV完整4筆');check(text.includes(m.params[0].unit)&&text.includes(m.outputs[0].unit),'CSV有單位');check(filename==='science-lab-'+id+'.csv','下載檔名');}
  finally{URL.createObjectURL=createURL;HTMLAnchorElement.prototype.click=click;}
  $('clear').click();$('clear-cancel').click();await settle();check(!$('clear-dialog').open&&document.activeElement===$('clear'),'取消後恢復焦點');check($('table-body').children.length===4,'取消保留紀錄');
  check(document.documentElement.scrollWidth<=innerWidth,'整頁溢出 '+id+' '+document.documentElement.scrollWidth+'/'+innerWidth+' '+[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>e.tagName+'#'+e.id).slice(0,8).join(','));results.push({id,records:4,controlled:true,confounded:true,predictionBaselineChecked:true,csvRows:4});
 }
 check($('completion').textContent.includes('4 / 4'),'四個模型完成受控比較');
 // 清除目前模型不影響其他實驗。
 await wipe();check($('table-body').children.length===0&&!$('chart').querySelector('svg'),'清除目前實驗');open('pendulum');check($('table-body').children.length===4,'其他實驗仍保留');
 for(const id of Object.keys(E.models)){open(id);await wipe();}
 return {models:results,clearIsolation:true,clearCancelFocus:true};
}
