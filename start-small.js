'use strict';
const $=id=>document.getElementById(id);
// Each item has one concrete first action, a too-large task, and a preparation detour.
const missions=[
 ['衣服山快變火山','衣服堆在椅子上，每次看到都想繞路。','拿起一件衣服，折一次','把全家的衣服整理完','先研究最完美的收納法','👕'],
 ['訊息黑洞','一則訊息一直沒回，越等越不知道怎麼開口。','打開對話，寫「我看到了」草稿','一次回完所有未讀訊息','先滑別人的動態找靈感','💬'],
 ['報告大怪獸','空白文件讓你很想明天再開始。','開文件，寫一個暫定標題','今晚寫完十頁報告','先挑一小時的字型','📝'],
 ['散步發射台','想出門走走，可是沙發黏住你了。','把鞋子放到門口','今天一定走滿一萬步','先比較十款運動手環','👟'],
 ['水槽迷宮','碗盤越積越多，你假裝沒有看見。','拿起一個杯子沖洗','一次刷完整個廚房','先把清潔影片全部看完','🥤'],
 ['繳費小隕石','帳單放了幾天，想到就有點煩。','拿出一張帳單看截止日','今晚處理所有財務','先規劃五年的理財目標','🧾'],
 ['看不完的書','一本想讀的書還停在第一頁。','打開書，讀第一段','今天讀完整本','先列出今年一百本書單','📖'],
 ['工作桌失蹤案','桌子上什麼都有，就是沒有空位。','把一張廢紙放進回收桶','把整個房間打掃完','先逛新桌子和收納架','🗂️'],
 ['冷掉的創意','有個點子一直躺在腦袋裡。','寫下描述點子的一句話','今天直接做成完整作品','先等到更有靈感','💡'],
 ['預約逃跑了','想預約一件事，但一直忘記處理。','打開預約頁看可選時段','安排好往後一年的行程','先把所有心得文章讀完','📅'],
 ['背包出走','明天要帶的東西還沒準備。','把一件必要物品放進包裡','一次準備好整週的東西','先查哪個背包最時尚','🎒'],
 ['照片星雲','手機裡的重複照片越來越多。','打開相簿刪一張重複照','一口氣整理一萬張照片','先換一個相簿分類工具','📷'],
 ['冰箱探險','不知道煮什麼，所以遲遲沒開始。','打開冰箱，選一樣可用食材','規劃好整個月的健康菜單','先收藏五十道食譜','🥕'],
 ['履歷睡美人','想更新履歷，但總覺得要先有空。','開履歷加一行最近的工作','今天改完履歷並投二十家公司','先研究所有履歷模板','💼'],
 ['作業太空站','學習任務很大，不知從哪邊下手。','讀第一題，把關鍵字圈起來','今晚做完全部作業','先整理三小時文具','✏️'],
 ['垃圾衛星','垃圾袋已經滿了，還在等誰先動。','把垃圾袋綁起來','今天把全家垃圾都清完','先研究一套完美家務制度','♻️'],
 ['空白畫布','想畫畫，又怕第一筆不好看。','畫一條線，不滿意也先留著','第一張就畫成得獎作品','等到完全不怕失敗再畫','🎨'],
 ['信箱怪獸','工作信箱累積太多，看了就想關掉。','打開一封信，辨認要不要處理','把全部信件歸零','先重新設計所有分類標籤','📨']
];
const obstacles=[
 ['手機召喚術','手機亮了：來看一下嘛，只要一下！','先把手機放到伸手拿不到的地方','先刷完新通知，再看推薦影片','每做一下就看一次通知','降低分心的便利性，會比一直和自己拔河容易。'],
 ['完美主義魔王','藉口怪說：做不好就不要做。','先做粗糙第一版，之後再修','先找到永遠不會失敗的方法','等到有完整三小時才能動','第一版的工作是出現，不是完美。'],
 ['突然想到一百件事','你又想到別的事情，很想全部一起做。','寫一個簡短待辦，先回原來的小步','立刻切換，哪件新鮮就做哪件','把全部待辦一次做完','把想到的事先停在紙上，不必立刻切換任務。'],
 ['被叫走了','有人需要你，原來的小任務被打斷。','記下下一步，先處理必要的事','認定今天已經全毀了','為了分數拒絕所有必要的求助','中斷不是失敗；留下下一步，回來比較容易接上。'],
 ['真的太累了','不是懶，是眼睛都快睜不開了。','先休息，留下醒來後的一個小步','硬撐，休息的人都不夠努力','靠罵自己把精力罵回來','疲累時先照顧自己。小步不等於不准休息。'],
 ['整理偽裝怪','藉口怪說：要先把所有工具整理好才能開始。','只拿這一步真的需要的工具','重新整理所有抽屜','先做一份工具比較表','準備只要足以開始，不必替準備再準備。'],
 ['任務膨脹了','做到一半，發現比想像中大很多。','把下一步再拆小，先做其中一件','既然做不完就整件放棄','立刻答應今晚一定做完','發現太大時可以縮小範圍，不用強迫硬闖。'],
 ['等心情到站','藉口怪說：等有動力再動手。','試一個小動作，看看能不能開始','一直等到心情自動完美','先刷半小時勵志短片','有時行動會帶來動力；不舒服時仍可以停下。'],
 ['新點子插隊','你突然想把原任務升級成超豪華版本。','先把加碼點子記下，做原來的小步','立刻把需求翻倍','全部推翻，從研究開始','先完成小範圍，再決定需不需要加碼。'],
 ['忘記做到哪','中途離開後，你忘了剛才的進度。','用一句話記下「接下來要做什麼」','每次都從頭重新開始','不記錄，靠心情猜進度','下一步便條是接力棒，不是對自己的考試。']
];
let deck=[],traps=[],round=0,phase=0,points=0,attempts=0,locked=false,records=[],mode=4;
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a};
function screen(id){for(const s of document.querySelectorAll('.screen'))s.hidden=s.id!==id;$('home').hidden=id==='intro';}
function start(n){resetTimer();mode=n;deck=shuffle(missions).slice(0,n);traps=shuffle(obstacles).slice(0,n);round=0;phase=0;points=0;records=[];screen('game');render();}
function render(){locked=false;attempts=0;$('next').hidden=true;$('feedback').textContent='';$('round').textContent=`第 ${round+1} / ${mode} 關`;$('score').textContent=`啟動星星 ${points} / ${mode*2}`;$('progress').style.width=`${round/mode*100}%`;const bar=document.querySelector('[role="progressbar"]');bar.setAttribute('aria-valuemax',mode);bar.setAttribute('aria-valuenow',round);$('parts').textContent=records.map(r=>r.icon).join(' ');document.querySelector('.rocket').style.filter=`grayscale(${1-round/mode})`;document.querySelector('.rocket').style.opacity=0.6+0.4*round/mode;const m=deck[round],t=traps[round];$('phase').textContent=phase===0?'第一步 / 把任務拆小':'第二步 / 藉口怪出沒';$('title').textContent=phase===0?`${m[5]} ${m[0]}`:`👾 ${t[0]}`;$('story').textContent=(phase===0?m[1]+' 哪個動作現在最容易開始？':t[1]+' 哪個做法能幫你接住下一步？');const options=shuffle([2,3,4].map((i)=>({text:(phase===0?m:t)[i],correct:i===2})));$('choices').replaceChildren();options.forEach((o,i)=>{const b=document.createElement('button');b.className='choice';const number=document.createElement('span');number.className='number';number.textContent=i+1;const label=document.createElement('span');label.textContent=o.text;b.append(number,label);b.onclick=()=>choose(o,b);$('choices').append(b)});$('title').classList.remove('arrive');void $('title').offsetWidth;$('title').classList.add('arrive');$('title').focus({preventScroll:true});}
function choose(option,b){if(locked||b.disabled)return;attempts++;if(!option.correct){b.classList.add('wrong');b.disabled=true;$('feedback').textContent=phase===0?'這一步有點大，或只是繞路準備。再找一個具體、現在就能動手的小動作。':'這個做法可能讓你更難接回任務。找一個能降低阻力、也照顧需要的選擇。';return;}locked=true;if(attempts===1)points++;$('score').textContent=`啟動星星 ${points} / ${mode*2}`;for(const el of $('choices').children)el.disabled=true;b.classList.add('correct');$('feedback').textContent=phase===0?'✓ 就是這麼小！不必答應做完整件事，先讓第一個動作發生。':'✓ '+traps[round][5];$('next').textContent=phase===0?'小步選好了 → 面對藉口怪':round===mode-1?'裝好最後一片 → 發射！':'收下零件 → 下一關';$('next').hidden=false;}
function next(){if(!locked)return;if(phase===0){phase=1;render();}else{records.push({title:deck[round][0],step:deck[round][2],tip:traps[round][5],icon:deck[round][5]});round++;if(round===mode)finish();else{phase=0;render();}}}
function finish(){$('progress').style.width='100%';document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',mode);screen('result');$('summary').textContent=`你裝好了 ${mode} 個零件，拿到 ${points} / ${mode*2} 顆啟動星星（第一次選對得一顆）。重選一樣能過關；真正要帶走的是下面這些小步。`;$('review').replaceChildren();records.forEach(r=>{const p=document.createElement('p'),b=document.createElement('b');b.textContent=`${r.icon} ${r.title} → ${r.step}`;p.append(b,document.createElement('br'),document.createTextNode(r.tip));$('review').append(p)});$('task').value='';$('task-display').textContent='';resetTimer();window.scrollTo({top:0,behavior:'instant'});}
let remaining=120000,deadline=0,ticking=null,running=false;
function paintClock(){$('clock').textContent=`${Math.floor(Math.ceil(remaining/1000)/60).toString().padStart(2,'0')}:${(Math.ceil(remaining/1000)%60).toString().padStart(2,'0')}`;}
function clearTick(){if(ticking!==null)clearInterval(ticking);ticking=null;running=false;$('timer-pause').hidden=true;$('timer-start').hidden=false;}
function tick(){remaining=Math.max(0,deadline-performance.now());paintClock();if(remaining===0){clearTick();$('timer-start').disabled=true;$('timer-note').textContent='兩分鐘到了。想繼續或停下都可以；有沒有做，只有你自己知道。';}}
function startTimer(){if(running||remaining<=0)return;$('task-display').textContent=$('task').value.trim()||'先做一個很小的動作';deadline=performance.now()+remaining;running=true;$('timer-start').hidden=true;$('timer-pause').hidden=false;$('timer-note').textContent='這兩分鐘只顧一小步，不用追求做完。';ticking=setInterval(tick,200);}
function pauseTimer(){if(!running)return;remaining=Math.max(0,deadline-performance.now());clearTick();paintClock();$('timer-start').textContent='繼續這一小步';$('timer-note').textContent='已暫停。被打斷或需要休息，都沒關係。';if(!remaining)$('timer-start').disabled=true;}
function resetTimer(){clearTick();remaining=120000;paintClock();$('timer-start').textContent='開始兩分鐘';$('timer-start').disabled=false;$('timer-note').textContent='也可以不計時，直接去做一小步。';}
$('easy').onclick=()=>start(4);$('hard').onclick=()=>start(6);$('next').onclick=next;$('home').onclick=()=>{resetTimer();$('task').value='';$('task-display').textContent='';screen('intro');window.scrollTo(0,0)};$('replay').onclick=()=>start(mode);$('timer-start').onclick=startTimer;$('timer-pause').onclick=pauseTimer;$('timer-reset').onclick=resetTimer;$('did-step').onclick=()=>{pauseTimer();$('timer-note').textContent='🙌 這一小步算數！不必為了遊戲繼續做。';};$('rest').onclick=()=>{pauseTimer();$('timer-note').textContent='🌿 今天先休息也可以。下次回來，從一小步開始。';};
// Keep running while the user goes to their real task; an explicit pause is always available.
