(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MelonMayor=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
const districts=['噴泉商圈','安靜住宅區','瓜田農業區'];
const levels=[{name:'休息一下',cost:0,water:0,delta:[0,1,1]},{name:'小巧水花',cost:2,water:3,delta:[2,0,0]},{name:'觀光水舞',cost:5,water:7,delta:[4,-2,-1]},{name:'衝天民主噴泉',cost:9,water:12,delta:[6,-5,-3]}];
const choice=(name,cost,water,delta,why,repair=false)=>({name,cost,water,delta,why,repair});
const rounds=[
 {title:'一顆西瓜，正式登記',text:'民主聖地「瓜瓜市」開放市長登記。對手冬瓜已經掛滿看板。你的第一招是？',choices:[choice('掛滿「西瓜凍蒜」看板',20,0,[8,1,0],'看板讓商圈認得你，瓜田仍在等具體安排。'),choice('推著瓜車走訪三區',10,0,[4,7,7],'你聽到水壓、噪音與灌溉三種不同需求。'),choice('躺著等瓜熟',0,0,[-5,-4,-4],'西瓜不說話很合理，但市民不知道你的計畫。')]},
 {title:'噴泉底下在漏水',text:'技師發現水管漏水。修好後，每回合噴泉的預算與用水成本都會減半、無條件進位。',choices:[choice('先貼巨大競選海報遮住',4,0,[2,-6,-8],'海報擋不住漏水，也沒有改善後續成本。'),choice('修水管，公開施工紀錄',18,0,[2,7,9],'水管修好了！從本回合開始套用節水成本。',true),choice('暫時關閉支管並回收存水',0,18,[-3,2,3],'先取回18格水；沒有修復，所以往後成本不變。')]},
 {title:'瓜田喊渴',text:'農民帶來乾裂的土塊；商圈則期待週末水舞。你的儲水槽也是噴泉的水源。',choices:[choice('把灌溉水都借來造勢',0,20,[5,-3,-14],'水槽增加20格水，但農業區支持下降。'),choice('鋪設滴灌並回收雨水',15,24,[0,5,12],'回收24格水，瓜田用水安排也改善。'),choice('開放公所屋頂集雨',0,12,[0,2,4],'增加12格水，成本低，但改善幅度較小。')]},
 {title:'觀光團來拍照',text:'遊覽車停在噴泉廣場，導遊問：「市長候選瓜，今天除了噴很高，還有什麼？」',choices:[choice('撒亮片，讓整條街閃亮',16,0,[12,-6,-5],'照片很搶眼，但住戶與農民擔心清理。'),choice('安排瓜市集與步行導覽',10,0,[9,4,4],'遊客逛市集，三區也各有收穫。'),choice('只擺一張西瓜自拍立牌',0,0,[3,0,0],'便宜又可愛，吸引力也比較有限。')]},
 {title:'今晚，誰睡得著？',text:'住戶抱著枕頭來陳情。阿嬤說：「我不是反對噴泉，我是想睡覺。」',choices:[choice('加碼音響，蓋過陳情聲',12,0,[7,-15,-4],'廣場更熱鬧，但住宅區更加不滿。'),choice('設安靜時段，改善隔音',10,0,[-1,14,3],'夜間安排改善，住戶支持回升。'),choice('送大家一張耳塞折價券',0,0,[0,-5,0],'市民覺得問題沒有被處理。')]},
 {title:'辯論台上，西瓜能說話嗎',text:'冬瓜問你：「你到底靠政見，還是靠皮綠？」主持人遞來一支迷你麥克風。',choices:[choice('大喊：我有籽，他沒有！',0,0,[4,-5,-3],'梗有傳開，但沒有回答市政問題。'),choice('拿出水管與預算帳本',4,0,[5,8,8],'帳目清楚，支持增加。這是遊戲預設效果，不是真實民調模型。'),choice('跳一段噴泉西瓜舞',6,0,[9,0,0],'商圈很喜歡這段舞，其他區還在等回答。')]},
 {title:'最後一場造勢',text:'團隊說還能辦一場活動。預算與水槽都有限，噴泉強度也要一起算。',choices:[choice('全押巨型舞台',24,0,[15,-3,-3],'商圈歡呼，但費用很高。'),choice('三區小型說明會',8,0,[5,7,7],'沒有巨型煙火，但每區都有人聽見你。'),choice('在瓜棚直播聊天',0,0,[2,2,2],'花費少，各區各增加一點支持。')]},
 {title:'選前最後一晚',text:'噴泉旋鈕還在你手上。投票之前，你想留下什麼樣的廣場？',choices:[choice('加派人手辦整夜狂歡',16,0,[12,-8,-4],'觀光客很開心，住戶與瓜田的反應不同。'),choice('清理廣場，保留返家通道',6,0,[4,8,6],'散場順暢，各區支持增加。'),choice('先收攤，留下公開帳本',0,0,[1,3,3],'沒有大場面，省下最後一筆預算。')]}
];
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function create(){return {index:0,budget:100,water:70,support:[38,42,36],repaired:false,selected:null,level:1,locked:false,done:false,history:[],opened:[]};}
function validIndex(v,n){return Number.isInteger(v)&&v>=0&&v<n;}
function preview(s,selected=s.selected,level=s.level){
 if(s.done||!validIndex(selected,3)||!validIndex(level,4))return null;
 const c=rounds[s.index].choices[selected],f=levels[level],div=s.repaired||c.repair?2:1;
 const cost=c.cost+Math.ceil(f.cost/div),used=Math.ceil(f.water/div);
 return {cost,used,water:clamp(s.water+c.water-used,0,100),budget:s.budget-cost,repaired:s.repaired||c.repair,delta:c.delta.map((d,i)=>clamp(s.support[i]+d+f.delta[i],5,95)-s.support[i]),affordable:s.budget>=cost&&s.water+c.water>=used};
}
function select(s,value){if(s.done||s.locked||!validIndex(value,3))return false;s.selected=value;return true;}
function setLevel(s,value){if(s.done||s.locked||!validIndex(value,4))return false;s.level=value;return true;}
function submit(s){const p=preview(s);if(s.locked||!p||!p.affordable)return false;const c=rounds[s.index].choices[s.selected];s.history.push({round:s.index,choice:s.selected,level:s.level,cost:p.cost,used:p.used,delta:[...p.delta],why:c.why});s.budget=p.budget;s.water=p.water;s.repaired=p.repaired;s.support=s.support.map((v,i)=>clamp(v+p.delta[i],5,95));s.locked=true;return true;}
function next(s){if(s.done||!s.locked)return false;if(s.index===rounds.length-1){s.done=true;return true;}s.index++;s.locked=false;s.selected=null;return true;}
function open(s,index){if(!s.done||!validIndex(index,3)||s.opened.includes(index))return false;s.opened.push(index);return true;}
function tally(s){const votes=s.support.map(v=>v*10),total=votes.reduce((a,b)=>a+b,0);return {votes,total,opponent:3000-total,won:total>1500,tie:total===1500};}
return {districts,levels,rounds,create,preview,select,setLevel,submit,next,open,tally};
});
