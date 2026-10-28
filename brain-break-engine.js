(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BrainBreak=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
'use strict';
const topics={pattern:'規律觀察',logic:'條件推理',space:'空間想像'};
const questions=[
{id:'double',topic:'pattern',title:'每次都翻倍',display:'3 → 6 → 12 → 24 → ？',prompt:'規則是「前一個數乘以 2」。下一個數是？',options:['36','48','42'],answer:1,why:'24 × 2 = 48。每一步都使用同一個規則，不是只看最後兩個數的差。'},
{id:'steps',topic:'pattern',title:'增加的量也在變',display:'2 → 5 → 9 → 14 → ？',prompt:'每次依序加 3、加 4、加 5，接著加 6。下一個數是？',options:['19','21','20'],answer:2,why:'先看相鄰兩項的差：3、4、5、6。所以 14 + 6 = 20。'},
{id:'shapes',topic:'pattern',title:'三個一組',display:'△ ○ ○ ｜ △ ○ ○ ｜ △ ○ ？',prompt:'每組都照「三角形、圓形、圓形」排列。缺少哪個圖形？',options:['○','△','□'],answer:0,why:'每三個圖形是一組。最後一組已有 △、○，還需要一個 ○。'},
{id:'alternating',topic:'pattern',title:'兩條隊伍交錯',display:'1、10、2、20、3、？',prompt:'奇數位置依序是 1、2、3；偶數位置依序是 10、20、30。缺少的數是？',options:['4','30','40'],answer:1,why:'把奇數位置與偶數位置分開看。問號在第六個位置，要接偶數位置的 10、20、30。'},
{id:'machines',topic:'pattern',title:'小機器怎麼算',display:'2 → 7　　4 → 13　　6 → ？',prompt:'機器會把輸入「乘以 3，再加 1」。輸入 6 會得到多少？',options:['18','21','19'],answer:2,why:'先乘後加：6 × 3 = 18，再加 1 得到 19。不能先把 6 加 1 再乘。'},
{id:'backward',topic:'pattern',title:'倒退也有規律',display:'40 → 35 → 30 → 25 → ？',prompt:'規則是每次減 5。下一個數是？',options:['20','15','0'],answer:0,why:'25 減 5 是 20。從頭到尾，每一對相鄰數都相差 5。'},
{id:'boxes',topic:'logic',title:'盒子排隊',display:'紅盒在藍盒左邊\n藍盒在綠盒左邊',prompt:'三個盒子排成一直線，沒有其他盒子。由左到右，中間是哪個？',options:['紅盒','綠盒','藍盒'],answer:2,why:'兩個條件合起來是：紅、藍、綠。因此藍盒在中間。'},
{id:'robots',topic:'logic',title:'只能推出哪一句',display:'所有圓形機器人都有天線\n小圓是圓形機器人',prompt:'只根據這兩個條件，哪一句一定成立？',options:['小圓有天線','有天線的都是圓形機器人','小圓是紅色的'],answer:0,why:'小圓屬於「所有圓形機器人」，所以也有天線。但有天線的機器人不一定都是圓形，題目也沒提供顏色。'},
{id:'weight',topic:'logic',title:'比較重量',display:'甲比乙重\n乙比丙重',prompt:'三個物品中，哪個最輕？',options:['甲','丙','乙'],answer:1,why:'重量順序是甲 > 乙 > 丙。丙比另外兩個都輕。'},
{id:'drawer',topic:'logic',title:'排除一個可能',display:'一顆紅球、一顆藍球\n左右抽屜各放一顆',prompt:'已確認左邊抽屜不是紅球。右邊抽屜是哪顆？',options:['藍球','無法判斷','紅球'],answer:2,why:'左邊不是紅球，就只能是藍球。兩顆球各用一次，右邊因此是紅球。'},
{id:'ticket',topic:'logic',title:'條件要一起成立',display:'入場條件：有票，而且戴帽子',prompt:'誰符合這裡寫出的入場條件？',options:['小安：有票、有戴帽子','小波：有票、沒戴帽子','小可：沒票、有戴帽子'],answer:0,why:'「而且」表示兩個條件都要符合。只有小安同時有票且戴帽子。'},
{id:'schedule',topic:'logic',title:'安排先後',display:'先洗水果，才能切水果\n先切水果，才能裝盤',prompt:'這三件事各做一次，第二件應該做什麼？',options:['裝盤','切水果','洗水果'],answer:1,why:'依條件排列：洗水果 → 切水果 → 裝盤。因此第二件是切水果。'},
{id:'grid-path',topic:'space',title:'在九宮格走兩步',display:'1　2　3\n4　5　6\n7　8　9',prompt:'從 5 出發，先往上走一格，再往右走一格。停在哪個數字？',options:['1','6','3'],answer:2,why:'5 的上方是 2，2 的右方是 3。每一步都從目前所在的位置繼續。'},
{id:'turn',topic:'space',title:'原地轉個彎',display:'↑ 起初面向上方',prompt:'原地向右轉 90 度後，面向哪裡？',options:['→ 右方','← 左方','↓ 下方'],answer:0,why:'從上方順時針轉四分之一圈，會面向右方。轉向不表示往前移動。'},
{id:'squares',topic:'space',title:'不只數小格',art:'grid',display:'橫向 3 格、直向 2 格的方格圖',prompt:'圖中共有幾個正方形？包含由小格組成的大正方形，但不包含長方形。',options:['6 個','8 個','9 個'],answer:1,why:'邊長一格的正方形有 6 個；邊長兩格的有 2 個。總共 6 + 2 = 8 個。'},
{id:'mirror',topic:'space',title:'左右鏡像',display:'● ○ ○',prompt:'把整排圖形左右對調，順序會變成哪一個？',options:['○ ● ○','● ○ ○','○ ○ ●'],answer:2,why:'左右鏡像會把最左與最右的位置交換，中間不變。因此黑圓移到最右邊。'},
{id:'rotate',topic:'space',title:'轉動整張方格紙',display:'A　B　C\nD　E　F\nG　H　I',prompt:'將整張紙順時針轉 90 度。原本左上角的 A，會到哪個角落？',options:['右上角','左下角','右下角'],answer:0,why:'順時針轉四分之一圈：左上角移到右上角；正中央 E 仍在中央。這是旋轉，不是左右翻面。'},
{id:'return-path',topic:'space',title:'一步一步追路線',display:'1　2　3\n4　5　6\n7　8　9',prompt:'從 5 出發，依序往左、往下、往右各走一格。最後在哪裡？',options:['9','8','7'],answer:1,why:'路線是 5 → 4 → 7 → 8。最後向右的一步，是從 7 出發，不是從原點 5 出發。'}
];
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function create(mode='short'){
 if(!['short','all',...Object.keys(topics)].includes(mode))throw new Error('不支援的練習範圍');
 const items=mode==='short'?shuffle(Object.keys(topics).flatMap(t=>shuffle(questions.filter(q=>q.topic===t)).slice(0,2))):shuffle(questions.filter(q=>mode==='all'||q.topic===mode));
 return {items,index:0,selected:null,locked:false,results:[],done:false};
}
function select(s,value){const q=s.items[s.index];if(s.done||s.locked||!Number.isInteger(value)||value<0||value>=q.options.length)return false;s.selected=value;return true;}
function submit(s,value=s.selected){const q=s.items[s.index];if(s.done||s.locked||(value!=='unsure'&&(!Number.isInteger(value)||value<0||value>=q.options.length)))return null;
 const ok=value===q.answer,prior=s.results[s.index];s.results[s.index]={first:prior?prior.first:ok,latest:ok,value,tries:prior?prior.tries+1:1};s.locked=true;return s.results[s.index];}
function retry(s){if(s.done||!s.locked||s.results[s.index].latest)return false;s.locked=false;s.selected=null;return true;}
function next(s){if(s.done||!s.locked)return false;if(s.index===s.items.length-1){s.done=true;return true;}s.index++;s.selected=null;s.locked=false;return true;}
return {topics,questions,create,select,submit,retry,next,shuffle};
});
