(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.MischiefChallenge=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const places=['主管席','主持席（你）','舞台中央'],props={mic:'🎤 假麥克風',duck:'🦆 發條鴨',crown:'👑 紙皇冠',confetti:'🎊 彩帶機',recorder:'📼 答錄機'};
const questions=['典禮幾點開始？','誰負責收尾？','今天午餐吃什麼？'];
const answers=[['三點開始。','主持人負責收尾。','今天吃烏龍麵。'],['四點開始。','主管負責收尾。','今天吃水餃。'],['五點開始。','鴨子隊負責收尾。','今天吃咖哩飯。']];
const scenes=[
{type:'chain',title:'主管嘎嘎頒獎典禮',goal:'主管席先開麥、再讓鴨子接管聲音，最後放彩帶。',target:0},
{type:'chain',title:'原來主持人是我',goal:'主持席先開麥、再戴皇冠；主管席不要被加冕。',target:1},
{type:'chain',title:'保力答B登台',goal:'中央先開麥，答錄機播B紙卡，再放彩帶慶祝。',target:2},
...[0,1,2].map((q)=>({type:'routing',title:['問時間，答午餐','問收尾，答時間','問午餐，答收尾'][q],goal:'對指定問題依序播C跑題 → B紙卡 → A對題，最後收走B紙卡。',q})),
...[0,1,2].map((fault)=>({type:'recorder',title:['跳針答錄機','問A答C接線事故','永遠慢一題'][fault],goal:'先用不同問題重現原故障、查看接線，再修好；用兩種不同問題驗收。靜音不算修好。',fault}))];
function create(i){const s={i,scene:scenes[i],phase:'setup',order:[],at:{},route:'A',q:0,step:0,events:[],log:[],cards:0,subtitle:'',speaker:null,voice:null,crown:null,paper:0,active:{},progress:0,loop:false,echo:false,mute:false,cache:{text:'本機正在回答，回答就是本機正在回答。',topic:-1},revision:0,proof:[],inspected:false,witness:false,history:[]};if(s.scene.type==='recorder'){s.loop=s.scene.fault===0;s.route=s.scene.fault===1?'C':'A';s.echo=s.scene.fault===2;}return s;}
function note(s,t){s.log.push(t);}
function fresh(s){const topic=s.route==='A'?s.q:s.route==='C'?(s.q+2)%3:-1;return {text:s.route==='B'?'保力答 B！這是紙卡，不是答案。':answers[s.i%3][topic],topic,asked:s.q};}
function broadcast(s){if(s.phase==='finished')return s.reply;let r=fresh(s);if(s.mute)r={text:'（靜音：沒有回覆）',topic:-1};else if(s.loop){if(!s.cache)s.cache=r;r={...s.cache};}else if(s.echo){const next=r;r={...(s.cache||{text:'（空白緩衝）',topic:-1})};s.cache=next;}else s.cache=r;
s.reply=r;s.subtitle=r.text;if(!s.mute&&r.text.startsWith('保力答'))s.cards++;
if(s.scene.type==='routing'){const expected=['C','B','A'][s.progress];if(s.q===s.scene.q&&s.route===expected)s.progress++;}
if(s.scene.type==='recorder'){
s.history.push({q:s.q,r:{...r},rev:s.revision});const h=s.history.filter(x=>x.rev===0);
if(s.scene.fault===0&&h.some(x=>x.q!==s.q&&x.r.text===r.text)&&s.loop)s.witness=true;
if(s.scene.fault===1&&s.revision===0&&!s.mute&&r.topic!==s.q)s.witness=true;
if(s.scene.fault===2&&h.length>1){const prev=h[h.length-2];if(prev.q!==s.q&&r.topic===prev.q&&s.echo)s.witness=true;}
if(s.witness&&s.inspected&&!s.loop&&!s.echo&&!s.mute&&s.route==='A'&&r.topic===s.q&&!s.proof.includes(s.q))s.proof.push(s.q);
}note(s,questions[s.q]+' → '+r.text);return r;}
function configure(s,key,value){if(s.phase==='finished')return;if(s[key]===value)return;s[key]=value;s.revision++;s.proof=[];}
function toggle(s,p){if(s.phase!=='setup')return;const n=s.order.indexOf(p);if(n<0){s.order.push(p);s.at[p]=0;}else s.order.splice(n,1);}
function move(s,p,d){if(s.phase!=='setup')return;const n=s.order.indexOf(p),to=n+d;if(n>=0&&to>=0&&to<s.order.length)[s.order[n],s.order[to]]=[s.order[to],s.order[n]];}
function start(s){if(s.scene.type==='chain'&&s.order.length&&s.phase==='setup')s.phase='performance';}
function step(s){if(s.phase!=='performance')return;const p=s.order[s.step++],at=s.at[p];s.active[p]=true;
if(p==='mic')s.speaker=at;if(p==='duck'){s.voice=at;note(s,s.speaker===at?'麥克風擴音：嘎嘎頒獎！':'只有座位旁的小聲嘎嘎。');}
if(p==='crown')s.crown=at;
if(p==='confetti'){s.paper++;note(s,'彩帶灑向'+places[at]);}
if(p==='recorder')broadcast(s);
s.events.push({p,at,speaker:s.speaker,voice:s.voice,reply:s.reply?{...s.reply}:null});note(s,props[p]+' 在'+places[at]+'啟動');
if(s.step===s.order.length){s.show=show(s);s.phase='cleanup';}}
function show(s){const e=s.events;const idx=p=>e.findIndex(x=>x.p===p);const mic=idx('mic'),duck=idx('duck'),crown=idx('crown'),rec=idx('recorder'),conf=idx('confetti');if(s.i===0)return mic>=0&&duck>mic&&conf>duck&&['mic','duck','confetti'].every(p=>s.at[p]===0);if(s.i===1)return mic>=0&&crown>mic&&s.at.mic===1&&s.crown===1;return mic>=0&&rec>mic&&conf>rec&&['mic','recorder','confetti'].every(p=>s.at[p]===2)&&e[rec].reply&&e[rec].reply.topic===-1&&e[rec].reply.text.startsWith('保力答');}
function clean(s,key){if(s.phase==='finished')return;if(key==='paper'){s.paper=s.active.confetti?1:0;note(s,s.paper?'機器還在噴，掃完又有彩帶！':'彩帶收好了。');}else if(key==='cards'){s.cards=s.active.recorder&&s.route==='B'?1:0;s.subtitle=s.active.recorder?s.subtitle:'';note(s,s.active.recorder?'答錄機還在播，請先停止機器！':'紙卡與字幕收好。');}else{delete s.active[key];if(key==='mic')s.speaker=null;if(key==='duck')s.voice=null;if(key==='crown')s.crown=null;note(s,'收回 '+props[key]);}}
function assess(s){if(s.scene.type==='chain')return {show:!!s.show,cleanup:Object.keys(s.active).length===0&&s.paper===0&&s.cards===0&&s.subtitle===''};if(s.scene.type==='routing')return {show:s.progress===3,cleanup:s.cards===0&&s.route==='A'&&s.q===s.scene.q&&!!s.reply&&s.reply.asked===s.q&&s.reply.topic===s.q};return {show:s.witness&&s.inspected,cleanup:s.cards===0&&s.proof.length>=2&&!s.loop&&!s.echo&&!s.mute&&s.route==='A'&&!!s.reply&&s.reply.asked===s.q&&s.reply.topic===s.q};}
function finish(s){if(s.phase==='finished')return s.result;s.result={...assess(s),log:s.log.slice(),order:s.order.map(p=>props[p]+'@'+places[s.at[p]])};s.phase='finished';return s.result;}
return {places,props,questions,scenes,create,toggle,move,start,step,broadcast,configure,clean,assess,finish};
});
