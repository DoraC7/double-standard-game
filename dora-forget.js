'use strict';
// All situations are fictional, authored comedy. No network or storage.
const scenes = [
 {title:'鑰匙隱形術',cards:[['🔑','鑰匙在紫色包'],['👜','包在門邊'],['🚪','出門先拿包']],q:'鑰匙原本放哪裡？',answers:['紫色包','冰箱','龍蝦口袋'],fact:'道具紀錄：鑰匙一直在門邊的紫色包裡。',line:'誰把我的鑰匙藏在我自己放的地方！'},
 {title:'會議時空裂縫',cards:[['🗓️','會議星期三'],['🕑','下午兩點'],['🏠','線上開會']],q:'會議是星期幾？',answers:['星期三','星期五','宇宙放假日'],fact:'道具邀請函：星期三下午兩點，線上會議。',line:'我的星期三跟你們的星期三不是同一版！'},
 {title:'奶茶平行宇宙',cards:[['🧋','奶茶微糖'],['🧊','去冰'],['🏷️','取餐號 27']],q:'奶茶點了什麼甜度？',answers:['微糖','全糖','糖自己決定'],fact:'道具訂單：微糖、去冰、27 號。',line:'訂單懂我的字，但不懂我臨時改變的靈魂。'},
 {title:'檔案被誰吃掉',cards:[['📄','檔名：月亮'],['📁','放在草稿夾'],['💾','尚未按儲存']],q:'檔案目前的儲存狀態？',answers:['尚未儲存','已發布','龍蝦吃掉了'],fact:'道具畫面：草稿夾中的「月亮」尚未儲存。',line:'我有想過要存，電腦為什麼沒收到腦波？'},
 {title:'包裹移動城堡',cards:[['📦','包裹在管理室'],['🕔','五點後領'],['🪪','帶領取卡']],q:'包裹放在哪裡？',answers:['管理室','月球基地','沙發下面'],fact:'道具通知：管理室，五點後帶領取卡領取。',line:'包裹不在我想的地方，一定是它離家出走。'},
 {title:'雨傘叛逃記',cards:[['☂️','雨傘在傘架'],['🟡','黃色雨傘'],['🚪','傘架在門口']],q:'要找哪一種顏色的傘？',answers:['黃色','紫色','透明到看不見'],fact:'道具便條：黃色雨傘在門口傘架。',line:'傘架怎麼沒有主動把傘遞給我？'},
 {title:'便當日曆翻車',cards:[['🍱','便當訂週四'],['🍄','蘑菇口味'],['🕛','中午領取']],q:'便當訂在哪一天？',answers:['週四','週一','每天都應該有'],fact:'道具收據：週四中午，蘑菇便當。',line:'我今天想吃，所以日曆應該自己往前翻！'},
 {title:'充電線大逃亡',cards:[['🔌','線在抽屜'],['🔋','電量剩 8%'],['🖥️','抽屜在書桌']],q:'充電線放在哪裡？',answers:['書桌抽屜','太空站','鬧鐘肚子裡'],fact:'道具提醒：書桌抽屜裡有充電線，電量剩 8%。',line:'手機怎麼不早在昨天提醒我明天會沒電？'}
 ,{title:'電梯樓層抽籤',cards:[['🏢','教室在六樓'],['🚪','靠左第二間'],['🟣','紫色門牌']],q:'教室在幾樓？',answers:['六樓','三樓','地下月球層'],fact:'道具路線圖：六樓，靠左第二間，紫色門牌。',line:'不是我按錯樓，是電梯沒有讀懂我的目的地。'},
 {title:'圖書館還書漂流',cards:[['📚','星期五還書'],['📕','書名：小火山'],['📍','還書箱在一樓']],q:'要還的書叫什麼？',answers:['小火山','大海嘯','龍蝦烹飪術'],fact:'道具借閱單：《小火山》，星期五交到一樓還書箱。',line:'書跟我培養出感情，所以期限應該自動延長。'},
 {title:'簡報版本大亂鬥',cards:[['🖥️','使用第三版'],['📄','共十二頁'],['📁','放在發布夾']],q:'這次應該使用哪一版？',answers:['第三版','第一版','名字最長那版'],fact:'道具交接單：發布夾第三版，共十二頁。',line:'我開到舊版，是因為它看起來比較資深！'},
 {title:'洗衣標籤失憶',cards:[['👕','白色上衣'],['🧺','放在藍籃'],['🏷️','待洗標籤']],q:'上衣放在哪個籃子？',answers:['藍籃','紅籃','龍蝦浴缸'],fact:'道具清單：白色上衣放藍籃，標示待洗。',line:'衣服沒自己跳進洗衣機，我也很意外。'},
 {title:'電影票時光倒流',cards:[['🎬','下午四點場'],['🎟️','座位 C8'],['🏛️','二號影廳']],q:'電影票上的座位？',answers:['C8','A1','導演旁邊'],fact:'道具票券：下午四點，二號影廳，C8。',line:'我記得是好位子，所以全場都應該讓我挑。'},
 {title:'野餐餐具越獄',cards:[['🥄','帶四支湯匙'],['🧺','裝綠色袋'],['🌳','約在樹下']],q:'需要帶幾支湯匙？',answers:['四支','兩支','一支共享宇宙'],fact:'道具分工：四支湯匙裝綠色袋，樹下集合。',line:'我帶了吃飯的心情，餐具怎麼沒有跟上？'},
 {title:'交接訊息蒸發',cards:[['📋','清單交給阿圓'],['🕒','三點前回覆'],['✅','完成後打勾']],q:'清單要交給誰？',answers:['阿圓','阿方','全宇宙廣播'],fact:'道具訊息：清單交阿圓，三點前回覆，完成後打勾。',line:'我心裡已經交接了，對方收不到是訊號問題。'},
 {title:'蛋糕蠟燭算術',cards:[['🎂','蛋糕六吋'],['🕯️','三根蠟燭'],['📦','白色提盒']],q:'盒內有幾根蠟燭？',answers:['三根','六根','許願後自動增生'],fact:'道具備料單：六吋蛋糕、三根蠟燭、白色提盒。',line:'我把蛋糕尺寸記成蠟燭數，這叫跨領域整合。'}
];
const $=id=>document.getElementById(id);
const shuffle=a=>a.map(v=>({v,n:Math.random()})).sort((a,b)=>a.n-b.n).map(x=>x.v);
let queue=[],i=0,score=0,sparks=0,phase='home',selected=null,log=[],answer='';
function button(text,fn){const b=document.createElement('button');b.textContent=text;b.onclick=fn;return b;}
function heading(text){$('heading').textContent=text;$('heading').focus();}
function clear(){selected=null;$('choices').replaceChildren();$('actions').replaceChildren();$('feedback').textContent='';$('content').replaceChildren();$('stage').className='stage';}
function stats(){$('round').textContent=`第 ${i+1} / ${queue.length} 幕`;$('score').textContent=`記對 ${score}`;$('chaos').textContent=`荒謬火花 ${sparks}`;}
function start(n){queue=shuffle(scenes).slice(0,n);i=score=sparks=0;log=[];$('reset').hidden=false;showMemory();}
function showMemory(){phase='memory';clear();stats();const s=queue[i];$('stage').style.backgroundColor=['#e1d1ee','#d5e8e2','#f3dfbb','#d5e0f0'][scenes.indexOf(s)%4];heading(s.title+'：先看三張卡');const cards=document.createElement('div');cards.className='cards';s.cards.forEach(([emoji,text],cardIndex)=>{const c=document.createElement('div');c.className='memory-card';const b=document.createElement('b');b.textContent=String(cardIndex+1);c.append(b,document.createTextNode(text));cards.append(c);});$('content').append(cards);$('bubble').textContent='這次真的記住了！……應該吧？';$('actions').append(button('記好了，蓋起來！',ask));}
function ask(){phase='quiz';clear();const s=queue[i];heading(s.q);const choices=shuffle(s.answers);let confirm=button('確認口供',()=>{if(phase!=='quiz'||selected===null)return;answer=choices[selected];const correct=answer===s.answers[0];if(correct)score++;log.push({title:s.title,answer,correct,fact:s.fact});phase='revealed';[...$('choices').children].forEach(b=>b.disabled=true);confirm.disabled=true;$('feedback').textContent=(correct?'記憶連線成功！✨':'記憶飛去度假啦！📡')+'\n'+s.fact;$('stage').classList.add('paper');$('bubble').textContent=s.line;stats();$('actions').append(button('進入甩鍋片場 →',responses));});confirm.disabled=true;choices.forEach((a,k)=>{const b=button(`${k+1} · ${a}`,()=>{if(phase!=='quiz')return;selected=k;[...$('choices').children].forEach((x,j)=>x.setAttribute('aria-pressed',String(k===j)));confirm.disabled=false;});b.setAttribute('aria-pressed','false');$('choices').append(b);});$('actions').append(confirm);}
const moves=[
 ['⏰ 怪鬧鐘：你沒提醒我！','鬧鐘長出八隻手，每隻都舉著「我只負責叫醒」的牌子。',3,'17%',-1],
 ['🦞 怪龍蝦：一定是你動的！','龍蝦攤開兩隻螯：一手拿收據，一手拿不在場證明。鍋子退件！',4,'50%',0],
 ['🪐 找理由：宇宙版本不相容！','土星寄來更新通知：「已更新宇宙，記憶快取請自行清除。」',5,'83%',1],
 ['🧰 不甩鍋：查紀錄，自己補救','鍋子回廚房，多拉翻開紀錄補上下一步。龍蝦撒蔥花：這鍋終於能煮湯！',0,'50%',0]
];
function responses(){phase='response';clear();heading('選一招，看看鍋子飛去哪！');const fact=document.createElement('p');fact.className='receipt';fact.textContent=queue[i].fact;$('content').append(fact);let fire=button('發射這一招 🍳',()=>{if(phase!=='response'||selected===null)return;const m=moves[selected];phase='result';sparks+=m[2];const effect=m[1]+' 本幕道具亮出標籤：「'+queue[i].cards[0][1]+'」。';Object.assign(log[i],{move:m[0],effect});[...$('choices').children].forEach(b=>b.disabled=true);fire.disabled=true;const stage=$('stage');stage.style.setProperty('--dx',`${m[4]*stage.clientWidth/3}px`);stage.style.setProperty('--target',m[3]);stage.classList.add(selected===3?'repair':'fired');$('bubble').textContent=effect;$('feedback').textContent=effect+`\n本幕 +${m[2]} 荒謬火花`;stats();$('actions').append(button(i===queue.length-1?'領取本局荒謬戰報':'下一幕 →',()=>{i++;i===queue.length?finish():showMemory();}));});fire.disabled=true;moves.forEach((m,k)=>{const b=button(m[0],()=>{if(phase!=='response')return;selected=k;[...$('choices').children].forEach((x,j)=>x.setAttribute('aria-pressed',String(j===k)));fire.disabled=false;$('bubble').textContent=k===3?'鍋子準備安全降落。':`瞄準${['鬧鐘','龍蝦','宇宙'][k]}……按發射才會出手！`;});b.setAttribute('aria-pressed','false');$('choices').append(b);});$('actions').append(fire);}
function finish(){phase='done';clear();heading('本局荒謬戰報');$('round').textContent='全片殺青';$('bubble').textContent=sparks>=16?'本局鍋子已申請飛航許可！':'鍋子平安落地，今晚可以煮湯。';const summary=document.createElement('p');summary.textContent=`記憶連線 ${score} / ${queue.length}；荒謬火花 ${sparks}。火花只是喜劇效果，沒有標準答案。`;$('content').append(summary);log.forEach(r=>{const d=document.createElement('div');d.className='review';for(const text of [r.title,`${r.correct?'✓':'○'} 口供：${r.answer}`,r.fact,r.move,r.effect]){const p=document.createElement('p');p.textContent=text;d.append(p);}$('content').append(d);});$('actions').append(button('再拍 4 幕',()=>start(4)),button('完整 16 幕',()=>start(16)));}
$('short').onclick=()=>start(4);$('full').onclick=()=>start(16);$('reset').onclick=()=>start(queue.length||4);$('motion').onclick=()=>{const off=document.body.classList.toggle('no-motion');$('motion').setAttribute('aria-pressed',String(off));$('motion').textContent='特效：'+(off?'關':'開');};
document.addEventListener('keydown',e=>{if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('button,a'))return;if(['quiz','response'].includes(phase)&&/^[1-4]$/.test(e.key)){const b=$('choices').children[Number(e.key)-1];if(b){e.preventDefault();b.click();}}});
