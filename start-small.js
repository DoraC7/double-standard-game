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
 ['信箱怪獸','工作信箱累積太多，看了就想關掉。','打開一封信，辨認要不要處理','把全部信件歸零','先重新設計所有分類標籤','📨'],
 ["洗衣機在等你", "換洗衣物放在旁邊，卻一直沒進洗衣機。", "把三件可一起洗的衣服放進洗衣機", "今晚把全部床單衣物洗完", "先研究所有洗衣精評價", "🧺"],
 ["床鋪小丘陵", "床單皺成一團，看了就不想整理。", "拉平床的一個角落", "把整間臥室改造成旅館", "先找最漂亮的寢具套組", "🛏️"],
 ["植物求救站", "想照顧盆栽，但拖了幾天沒檢查。", "摸一盆植物的土，看看是否乾了", "今天學會所有植物的養護法", "先把園藝頻道看一輪", "🪴"],
 ["早餐空白題", "早上忙亂，常常不知道先做什麼。", "拿出一個碗和一樣現成食物", "做一整桌營養完美的早餐", "先設計一週早餐拍照風格", "🍳"],
 ["文件躲貓貓", "一份重要文件不知放到哪裡。", "只檢查平常放文件的那個抽屜", "今晚把全家文件全部數位化", "先購買新的文件管理軟體", "📁"],
 ["冰箱過期怪", "你擔心有食物過期，但不想整台翻一遍。", "看一盒食物的有效日期", "今晚清空冰箱並徹底刷洗", "先規劃完整冰箱分區圖", "🧊"],
 ["牙刷小任務", "出門用品還沒補齊，又想晚點再找。", "把牙刷放進旅行小袋", "今天打包好所有可能用到的東西", "先看十篇旅行收納攻略", "🪥"],
 ["快遞紙箱城", "收完包裹，紙箱還佔著走道。", "拆平一個空紙箱", "一次搬走家中所有雜物", "先比較回收整理工具", "📦"],
 ["生日問候星", "想祝朋友生日快樂，又怕寫得不夠特別。", "先寫一句真誠的生日祝福", "寫出一篇感人的千字長文", "先等到想到完美開場白", "🎂"],
 ["約會時段拼圖", "朋友約聚會，你還沒確認自己何時有空。", "看行事曆，找一個可以的時段", "安排所有人接下來三個月的活動", "先把每間餐廳都比較完", "🗓️"],
 ["忘了寄的信", "一封要寄出的信卡在草稿裡。", "先寫收件者和一行主旨", "一次寄完這個月的全部信件", "先為信箱重新設計簽名圖", "✉️"],
 ["地址更新站", "搬家後有個資料還沒更新。", "打開一個要改地址的服務頁", "今天更新所有帳號的所有資料", "先重做整套帳號分類表", "🏠"],
 ["會議筆記化石", "剛開完會，筆記還是一堆零碎句子。", "圈出一件需要你處理的事", "把每句發言整理成正式逐字稿", "先重新排版全部筆記樣式", "📋"],
 ["簡報封面怪", "要做簡報，空白投影片讓你很抗拒。", "建立一張投影片，寫聽眾要知道的一件事", "今天完成三十張精美簡報", "先收集一百個炫麗轉場", "📊"],
 ["資料表森林", "數字資料很多，你不知道先看哪裡。", "打開資料表，看第一欄的標題", "一次分析所有資料並完成報告", "先把每個儲存格都美化", "📈"],
 ["程式錯誤星", "程式有錯誤，一想到修就想逃。", "重現一次錯誤，記下錯誤訊息", "今晚重寫整個專案", "先換一套新的編輯器主題", "💻"],
 ["學習新語言", "想學一種語言，但課程看起來太長。", "讀一句例句，試著唸一次", "今天背完五百個單字", "先比較所有學習 App", "🗣️"],
 ["樂器積灰塵", "想練樂器，總覺得沒有完整時間。", "拿出樂器，試一個音或一個和弦", "今天練出整首高難度曲子", "先看兩小時器材開箱", "🎸"],
 ["練字第一格", "想練字，卻還在等一本好看的練習本。", "拿一張現有的紙，寫一個字", "把整本字帖全部寫完", "先尋找一支完美的筆", "🖊️"],
 ["影片剪輯山", "素材拍了很多，一直沒開始整理。", "打開一段素材，標記一個可用片段", "今天剪出一部完整紀錄片", "先下載所有特效包", "🎬"],
 ["願望清單霧", "想做的事情好多，反而一件都沒動。", "寫下一件這週想試的小事", "規劃好未來十年的每一天", "先把清單美化到可以出版", "🌤️"],
 ["買菜路線圖", "想補一點食材，想到採買就覺得麻煩。", "看家裡缺什麼，記下一樣要買的食材", "一次囤滿一個月所有食物", "先搜尋整座城市的最低價格", "🛒"],
 ["一個小修補", "衣服的扣子鬆了，一直放著不管。", "拿出這件衣服和針線", "把全家的衣物都修補完成", "先學完所有裁縫技巧", "🧵"],
 ["浴室鏡子星", "鏡子上有一塊水漬，已經看它好幾天。", "拿一塊布擦掉那一塊水漬", "今天徹底刷洗全家每個角落", "先研究完整清潔品配方", "🪞"],
 ["玩具返航", "玩具散在地上，你不知道從哪個開始收。", "把一個玩具放回原來的盒子", "把所有玩具分類編號收好", "先規劃一套全年玩具輪替制度", "🧸"],
 ["捐物小箱子", "想把不用的東西捐出去，但箱子還是空的。", "挑一件確定不用的物品放入箱中", "今天清掉家中一半的物品", "先讀完所有斷捨離書籍", "🎁"],
 ["帳務第一筆", "想記帳，想到補前面的就覺得壓力大。", "只記下一筆今天的支出", "今晚補完過去一年全部帳目", "先設計最完整的財務儀表板", "💰"],
 ["回顧小航線", "忙了一天，不知道今天到底做了什麼。", "寫一句今天已經做過的小事", "完整檢討人生所有不足", "先建立二十種追蹤表格", "🧭"],
 ["睡前充電站", "明天要用的手機還沒接上電源。", "拿起充電線，接上需要充電的設備", "把所有裝置重新整理配置", "先查一整晚充電設備評測", "🔌"],
 ["新專案起點", "想開始一個新計畫，卻一直停在想像。", "寫一句「我想解決的問題是什麼」", "今天就交出完整可上市的成果", "先等到所有條件都完全到位", "🛠️"]
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
 ['忘記做到哪','中途離開後，你忘了剛才的進度。','用一句話記下「接下來要做什麼」','每次都從頭重新開始','不記錄，靠心情猜進度','下一步便條是接力棒，不是對自己的考試。'],
 ["時間只剩一點點", "你只有幾分鐘，藉口怪說這根本沒用。", "選一個這幾分鐘能開始的小動作", "既然做不完就完全不動", "把原本的任務硬塞進幾分鐘", "短時間也能做小步；不要把所有時間都拿來準備。"],
 ["做了一點又內疚", "你只完成一小部分，開始嫌自己做得不夠。", "記下已做的小步，再評估是否繼續", "把已完成的部分當成零分", "罵自己到願意做完整件事", "一部分仍是進度，不需要靠羞辱換取行動。"],
 ["有人做得比你好", "看到別人的成果，你的第一步突然變得很寒酸。", "把比較先放下，只顧自己的下一步", "等到能比別人厲害再開始", "立刻把自己的範圍加到十倍", "別人的成果不是你開始行動的門檻。"],
 ["昨天沒做到", "昨天的計畫沒有發生，今天想乾脆放棄。", "今天重新選一個小步，不補罰昨天", "一次做三倍當作懲罰", "等下個月重新開始才算數", "重新開始不用挑吉日，也不用先補罰。"],
 ["要等整點才開始", "現在不是整點，你想再等二十分鐘。", "不用等漂亮的時間，現在試第一個動作", "每過整點就再等下一個整點", "先研究最佳開始時刻", "鐘面上的數字不決定這一小步值不值得做。"],
 ["拿不到需要的工具", "原本要用的東西不在身邊，任務卡住了。", "先做不需要它的部分，或記下去哪裡拿", "假裝工具一定會自己出現", "直接宣布這件事永遠不能做", "找出缺少的條件，也可以是一個具體下一步。"],
 ["其實不知道要求", "別人交代得不清楚，你越想越不敢動。", "寫下一個需要釐清的問題，再去確認", "在完全不清楚時做完整件事", "先假設自己一定會做錯", "有時第一步是問清楚，不是閉著眼硬做。"],
 ["任務不是你的優先事", "這件事不重要，但你怕放下就是拖延。", "確認優先順序，必要時延期或取消", "每件事都答應立刻做完", "只挑最容易打卡的事忙", "不是所有延後都叫拖延；選擇不做也可能是合理決策。"],
 ["朋友臨時來訊息", "不是急事，但你很想馬上聊下去。", "簡短回覆晚點聊，先顧目前的小步", "開啟一場沒有結束時間的聊天", "一邊回十則訊息一邊做每個動作", "非急事可以安排回覆時間，不用每次都立刻切換。"],
 ["小事都來插隊", "一堆不急的小事把原本任務擠掉。", "先記下小事，挑最重要的一小步", "忙最零碎的小事直到沒力氣", "同時開十件任務避免漏掉", "看起來很忙不一定有推進；回到當下最重要的小步。"],
 ["第一步仍然太難", "你選的小步看起來很小，實際上還是卡住。", "再縮小，改成只拿出或打開需要的東西", "既然小步也難就證明自己沒救", "立刻把目標調得更高", "小步的大小由實際阻力決定，不是由別人決定。"],
 ["想先把心情說服", "你想先想通所有負面情緒才能動。", "先辨認感受，選一個可承受的小動作", "要求自己完全沒有情緒才能開始", "告訴自己不准感到難受", "情緒可以被看見；不必先把所有感受消除才有下一步。"],
 ["截止日期在逼近", "期限近了，你越急越想做別的。", "先辨認最必要的交付，做其中第一步", "加上所有可選功能讓它更完美", "一直想像最壞結果直到時間用完", "期限近時縮小到必要範圍；做不到也可以及早溝通。"],
 ["忘了為什麼要做", "這件事做了很久，已經不知道還值不值得。", "用一句話確認目的，再決定下一步或停止", "只因為已經花時間就永遠做下去", "沒有目的也加倍忙碌", "先確認價值，再選行動；停止無意義的事不是失敗。"]
];
let deck=[],traps=[],round=0,phase=0,points=0,attempts=0,locked=false,records=[],mode=6;
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
$('easy').onclick=()=>start(6);$('hard').onclick=()=>start(12);$('marathon').onclick=()=>start(20);$('next').onclick=next;$('home').onclick=()=>{resetTimer();$('task').value='';$('task-display').textContent='';screen('intro');window.scrollTo(0,0)};$('replay').onclick=()=>start(mode);$('timer-start').onclick=startTimer;$('timer-pause').onclick=pauseTimer;$('timer-reset').onclick=resetTimer;$('did-step').onclick=()=>{pauseTimer();$('timer-note').textContent='🙌 這一小步算數！不必為了遊戲繼續做。';};$('rest').onclick=()=>{pauseTimer();$('timer-note').textContent='🌿 今天先休息也可以。下次回來，從一小步開始。';};
// Keep running while the user goes to their real task; an explicit pause is always available.
