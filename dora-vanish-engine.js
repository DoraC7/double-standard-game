(function(root){
'use strict';
const clone=v=>JSON.parse(JSON.stringify(v));
function shuffle(a,rng=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function queue(data,mode,rng=Math.random){const kinds=shuffle(Object.keys(data.kinds),rng);if(mode!=='short'&&mode!=='full'){if(!data.kinds[mode])throw Error('未知模式');return shuffle(data.scenes.filter(s=>s.kind===mode),rng);}const banks=kinds.map(k=>shuffle(data.scenes.filter(s=>s.kind===k),rng));return Array.from({length:mode==='short'?1:banks[0].length},(_,i)=>banks.map(b=>b[i])).flat();}
function create(scene,rng=Math.random){return {scene:clone(scene),status:'playing',actor:'visible',line:'多拉：今天看起來適合當一個負責喊開始的人。',searchOrder:shuffle([0,1,2,3],rng),found:false,inspected:[],lureOrder:shuffle([0,1,2,3],rng),lure:null,work:65,power:20,assign:[null,null,null],film:[],cueOrder:shuffle([0,1,2,3],rng),cursor:-1,rolling:false,transitions:0,log:[],moves:0,outcome:null,day:1,due:scene.days||5,extended:false,scopeAdded:false,scopeCut:false,scopeState:"original",revision:1,tasks:(scene.tasks||[]).map((name,i)=>({name,need:scene.costs?.[i]||2,done:0}))};}
function log(s,text){s.line=text;s.log.push(text);}
function show(s,actor,text){s.actor=actor;log(s,text);}
function begin(s){if(s.status!=='playing')return false;show(s,'vanish',s.scene.work+' → 咻！只留下旋轉的椅子。');return true;}
function finish(s,pass,text){s.status=pass?'won':'lost';s.rolling=false;s.log.push(text);s.outcome={pass,actor:s.actor,text,operations:s.moves,log:[...s.log]};return s.outcome;}
function active(s){return s.status==='playing'&&!s.rolling;}
function search(s,spot){if(!active(s)||s.scene.kind!=='search'||!Number.isInteger(spot)||spot<0||spot>3||s.inspected.includes(spot))return false;s.moves++;s.inspected.push(spot);if(spot===0){s.found=true;show(s,'peek',s.scene.found);}else log(s,s.scene.decoys[spot-1]);return true;}
function call(s,index){if(!active(s)||s.scene.kind!=='search'||!s.found||!Number.isInteger(index)||index<0||index>3)return null;s.moves++;s.lure=index;const k=s.scene.lureKinds[index];if(k==='boss'){show(s,'boss','「這個交給你！那個先處理！全場注意，多拉來統籌！」');return finish(s,true,'找到本人，也成功召喚出全場最大聲的指揮官。');}if(k==='vanish')show(s,'vanish','「剛剛那是我的全息投影，我本人還在載入。」');if(k==='snack'){show(s,'snack','「開飯！我來了！剛剛是待機，現在是餐點高速公路！」');return finish(s,true,'點心一到，本人完整登場，叉子比進度回報還準時。');}if(k==='play'||k==='rest'){show(s,k,k==='play'?'「好好玩！好有趣！我現在馬上出發！」':'「休息放鬆我可以！這個沙發需要我本人親自驗收。」');return finish(s,true,k==='play'?'玩樂通知剛到，多拉已經在集合點，連背景音效都追不上。':'休息區一開放，本人全身到齊；剛才失聯的訊號奇蹟復活。');}if(k==='peek')show(s,'peek','「點名可以遠端代答嗎？我先只出現半張臉。」');return finish(s,false,'本幕花式失蹤成立；換一個口令可再拍。');}
function tune(s,key,n){if(!active(s)||s.scene.kind!=='signal'||!['work','power'].includes(key)||!Number.isInteger(n)||n<0||n>100)return false;s[key]=n;return true;}
function signalResult(s){return s.work<=s.scene.maxWork&&s.power>=s.scene.minPower?(s.scene.entryActor||'boss'):s.work>s.power?'vanish':'peek';}
function broadcast(s){if(!active(s)||s.scene.kind!=='signal')return null;s.moves++;const actor=signalResult(s);if(['boss','snack','play','rest'].includes(actor)){show(s,actor,s.scene.entry+(actor==='boss'?' 「大家聽我的安排！」':' 「好有趣！本人立刻到齊！」'));return finish(s,true,actor==='boss'?'指揮權接收滿格，正經工作量轉交別人，總司令光速登場。':'吃、玩或放鬆訊號到位，剛才離線的本人現在高速上線。');}show(s,actor,actor==='vanish'?'「您撥的多拉已進入飛航模式，請改撥總指揮專線。」':'麥克風與叉子先探出來，本人表示出場條件還要談一下。');return finish(s,false,actor==='vanish'?'工作訊號過強，整個人被傳送到待辦清單外。':'訊號只召喚出半格本人；可以調整後再試。');}
function assign(s,task,person){if(!active(s)||s.scene.kind!=='dispatch'||!Number.isInteger(task)||task<0||task>2||!Number.isInteger(person)||person<0||person>3)return false;s.assign[task]=person;return true;}
function dispatch(s){if(!active(s)||s.scene.kind!=='dispatch'||s.assign.some(v=>v===null))return null;s.moves++;if(s.assign.includes(3)){show(s,'vanish','「什麼？我的名字也在工作欄？這份名單一定有排版錯誤！」');return finish(s,false,'工作一分到本人，多拉立即穿過了自己的職務說明書。');}if(new Set(s.assign).size<3){show(s,'overload','「同一位助理有兩雙手，為什麼不能長出第三雙？」配角全體冒煙。');return finish(s,false,'分工台塞車！每位配角最多一項，不能把全部丟給同一位。');}show(s,'boss','「我來負責最重要的工作：指揮大家把工作做完！」');return finish(s,true,'三位配角各接一項，多拉只拿麥克風，氣勢直接升到董事會。');}
function addCue(s,n){if(!active(s)||s.scene.kind!=='film'||!Number.isInteger(n)||n<0||n>3||s.film.includes(n))return false;s.film.push(n);return true;}
function removeCue(s,pos){if(!active(s)||s.scene.kind!=='film'||!Number.isInteger(pos)||pos<0||pos>=s.film.length)return false;s.film.splice(pos,1);return true;}
function roll(s){if(!active(s)||s.scene.kind!=='film'||s.film.length!==4)return false;s.rolling=true;s.cursor=-1;s.transitions=0;s.moves++;return true;}
function frame(s){if(s.status!=='playing'||!s.rolling)return null;s.cursor++;const q=s.scene.cues[s.film[s.cursor]],prev=s.cursor?s.scene.cues[s.film[s.cursor-1]].kind:null;if(prev&&(prev==='work')!==(q.kind==='work'))s.transitions++;show(s,q.kind==='work'?'vanish':q.kind,q.text+(q.kind==='work'?' → 咻！現場只剩一個蝴蝶結。':q.kind==='boss'?' → 「我來了！先聽我指揮！」':' → 「好有趣！我來了！剛才的好想睡先下班！」'));if(s.cursor===3){const pass=s.transitions===3&&q.kind!=='work';return finish(s,pass,pass?'四格完成三次反差，最後聽見指揮、吃、玩或放鬆，華麗現身！':q.kind==='work'?'片尾一提到親自做事，多拉連片尾字幕一起躲起來。':'本人有登場，但反差不夠密集。把正經與指揮口令交錯再試。');}return {frame:s.cursor};}
function deadlineEdit(s,action){
 if(!active(s)||s.scene.kind!=='deadline')return false;
 if(action==='extend'&&!s.extended){s.extended=true;s.due+=2;log(s,'劇情中的委託方同意延期2天，交期已明確改為第'+s.due+'天；不是偷偷改日曆。');return true;}
 if(action==='scope'&&!s.scopeAdded){s.scopeAdded=true;s.scopeState="expanded";s.revision++;s.tasks[1].need+=2;s.tasks[2].done=0;log(s,'「小改一下！」內容增加2格工作量，期限不變，驗收需按新版重做。');return true;}
 if(action==='cut'&&!s.scopeCut&&s.tasks[1].need>2){s.scopeCut=true;s.scopeState="minimal";s.revision++;s.tasks[1].need=Math.max(2,s.tasks[1].done);s.tasks[2].done=0;log(s,'劇情雙方同意改交最小版本，內容工作量調整為'+s.tasks[1].need+'格；未交原完整範圍，驗收仍要做。');return true;}
 return false;
}
function deadlineDay(s,action,task){
 if(!active(s)||s.scene.kind!=='deadline'||!['hide','slogan','work','tiny','complain','snack','play','rest'].includes(action))return null;
 if(action==='work'||action==='tiny'){
  if(!Number.isInteger(task)||task<0||task>2||s.tasks[task].done>=s.tasks[task].need||s.tasks.slice(0,task).some(t=>t.done<t.need))return null;
  const t=s.tasks[task],amount=Math.min(action==='tiny'?1:s.scene.capacity,t.need-t.done);t.done+=amount;show(s,action==='tiny'?'tired':task===2?'inspect':'boss',action==='tiny'?'第'+s.day+'天：「好累！好想睡！我今天超有進度、超忙！」實際只做「'+t.name+'」'+amount+'格，小步也算進度，但不能當整項都完成。':'第'+s.day+'天：配角實作「'+t.name+'」完成'+amount+'格，多拉負責大聲確認。只有這些實際操作才算進度。');
 }else if(action==='hide')show(s,'vanish','第'+s.day+'天：多拉進入隱身專注模式。專注的內容是不要被找到，實際進度＋0。');
 else if(action==='complain')show(s,'tired','第'+s.day+'天：「好累喔，好想睡，今天忙到沒時間開始。」尚未開始實作，進度＋0。');
 else if(['snack','play','rest'].includes(action))show(s,action,'第'+s.day+'天：'+({snack:'「開飯！我來了！」叉子全速上線。',play:'「好好玩，好有趣！現在出發！」',rest:'「休息放鬆！這個沙發我本人一定到場！」'})[action]+'本回合正在享受生活，專案進度＋0。');
 else show(s,'boss','第'+s.day+'天：「大家加油！要提高效率！先成立提高效率的小組！」喊話結束，實際進度＋0。');
 s.moves++;s.day++;
 if(s.tasks.every(t=>t.done>=t.need))return finish(s,true,s.scopeState==='minimal'?'最小版本已實作並驗收！原範圍有調整，不假裝全部都交了。':s.extended?'協議延期後完成實作與驗收，這次不是靠片尾字幕交件。':'提早留下驗收空間，總指揮的音量終於和實際交付同時在線。');
 if(s.day>s.due){show(s,'fire','「哇！火燒屁股了！好好玩，好刺激！」配角：刺激不會自動變成完成。');return finish(s,false,'期限到了，還缺：'+s.tasks.filter(t=>t.done<t.need).map(t=>t.name+' '+(t.need-t.done)+'格').join('、')+'。本幕沒有憑氣勢變出交付。');}
 return {day:s.day};
}
function summary(records){const all=Object.values(records),first=all.filter(r=>r.first.pass).length,latest=all.filter(r=>r.latest.pass).length;return {count:all.length,first,latest,title:latest===all.length&&all.length?'全場總指揮，正經事零接觸':latest>all.length/2?'指揮專線暢通，本人偶爾在線':'失蹤人口服務台今日爆滿'};}
const api={shuffle,queue,create,begin,search,call,tune,signalResult,broadcast,assign,dispatch,addCue,removeCue,roll,frame,deadlineEdit,deadlineDay,summary};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DoraVanishEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
