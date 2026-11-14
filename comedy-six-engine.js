'use strict';
const ComedySix = (() => {
  const clone = x => JSON.parse(JSON.stringify(x));
  const meta = {
    'dont-press': {title:'不要按那個按鈕',subtitle:'委員會的委員會，請不要再成立了',kind:'button',rounds:1},
    'office-goose': {title:'鵝作劇辦公室',subtitle:'今天的績效，是讓主管找不到雷射筆',kind:'goose',rounds:1},
    'oversize-package': {title:'包裝比商品大',subtitle:'一顆橡皮擦，值得冰箱級待遇',kind:'package',rounds:3},
    'awkward-elevator': {title:'電梯社交地獄',subtitle:'只有三層樓，尷尬卻直達頂樓',kind:'elevator',rounds:1},
    'weird-order': {title:'點餐越解釋越奇怪',subtitle:'不要辣，但要有辣的感覺',kind:'noodle',rounds:3},
    'offtopic-press': {title:'記者會答非所問',subtitle:'便當漲價，為什麼出現恐龍圖表',kind:'press',rounds:3}
  };
  const cartons = [
    {name:'小巧盒',w:4,d:4,h:4}, {name:'禮盒',w:14,d:14,h:14},
    {name:'家電盒',w:40,d:40,h:60}, {name:'冰箱級大盒',w:70,d:70,h:160},
    {name:'宇宙級紙箱',w:120,d:120,h:240}
  ];
  const objects = [
    {name:'一顆橡皮擦',w:1,d:1,h:1},
    {name:'一個玩具杯',w:8,d:8,h:10},
    {name:'一顆橡膠西瓜',w:20,d:20,h:20}
  ];
  const lifts = [{name:'迷你客梯',w:60,d:80,h:100},{name:'貨梯',w:100,d:120,h:200}];
  const materials = ['回收紙填充','空氣袋','塑膠彩帶'];
  const labels = ['樸素標籤','環保包裝','宇宙級隆重'];
  const recipes = {
    base:['小麥麵','米麵','櫛瓜絲'], soup:['乾拌','整碗湯','湯另外裝'],
    season:['原味','烤甜椒','辣椒醬','不辣烤椒香油'], texture:['軟口感','脆洋蔥／脆口感']
  };
  const customers = [
    {name:'客人小椒',quote:'不要辣，但要有辣的感覺。',meaning:'想要烤椒香，不要辣度；用小麥麵乾拌，加脆洋蔥。',avoid:'不要辣椒醬；烤甜椒或不辣烤椒香油都可以。',allowed:{base:[0],soup:[0],season:[1,3],texture:[1]}},
    {name:'客人小湯',quote:'不要湯，但要有湯的感覺。',meaning:'米麵保持乾爽，清湯另外裝，原味、軟口感。',avoid:'不要整碗泡湯；我不是不要任何湯。',allowed:{base:[1],soup:[2],season:[0],texture:[0]}},
    {name:'客人小麵',quote:'不要麵，但要一碗像麵的東西。',meaning:'我要櫛瓜絲的條狀外型，乾拌、原味、保持脆口。',avoid:'不要小麥麵或米麵，不是要求廚師把空碗叫做麵。',allowed:{base:[2],soup:[0],season:[0],texture:[1]}}
  ];
  const conferences = [
    {question:'便當從65元變75元，多出的10元是什麼？',record:'這家虛構店成本表：食材+5元、包材+2元、人力+3元，售價+10元。其他條件不變。',answer:'本店這次每份增加的食材、包材與人力成本合計10元，對應本次漲幅。',follow:'恐龍的身高，如何解釋便當多出的10元？'},
    {question:'新包裝真的比較省紙嗎？',record:'同款便當包裝測量：舊版20克紙，新版30克紙；沒有其他環保資料。',answer:'目前資料顯示紙用量從20克增至30克，不能據此宣稱省紙或全面更環保。',follow:'請問這隻恐龍，會把30克紙吃成20克嗎？'},
    {question:'是不是每家店明天都改價？',record:'公告只有虛構A店，下週一起調整；沒有其他分店的公告。',answer:'已確認的只有A店下週一調整，不能擴大成每家店明天改價。',follow:'宇宙這麼大，能不能先回答是哪家店、哪一天？'}
  ];
  const positions = ['後角落','門口中央','側邊讓路'];
  function create(id, round=0) {
    const m=meta[id]; if(!m) throw Error('未知遊戲');
    if(!Number.isInteger(round)||round<0||round>=m.rounds) throw Error('未知回合');
    const s={id,round,status:'playing',pass:false,log:[],ending:'',note:'先操作舞台上的物件。'};
    if(m.kind==='button') Object.assign(s,{chaos:0,powered:true,inspected:false,committees:0});
    if(m.kind==='goose') Object.assign(s,{x:1,y:4,tick:0,alarm:0,carry:null,done:[false,false],distract:0});
    if(m.kind==='package') Object.assign(s,{box:null,pad:0,material:null,label:null,lift:null,turned:false,checked:false});
    if(m.kind==='elevator') Object.assign(s,{turn:0,awkward:0,position:null,lastPosition:0,line:null,mistaken:false,goodbye:false,ringtone:false});
    if(m.kind==='noodle') Object.assign(s,{asked:[false,false,false],recipe:{base:null,soup:null,season:null,texture:null}});
    if(m.kind==='press') Object.assign(s,{turn:0,chaos:0,focus:true,opened:false,used:[],card:null,drama:0,lastCard:null});
    return s;
  }
  function finish(s,status,ending,pass=false) {s.status=status;s.ending=ending;s.pass=pass;s.log.push(ending);return s;}
  function buttonAction(s,a) {
    if(a==='inspect'){s.inspected=true;s.note='銘牌：紅鈕成立委員會；停電可凍結授權。斷電後才能解散，再封存。';}
    else if(a==='press'){
      if(!s.powered){s.note='紅鈕沒電了，委員會無法用愛發電。';return s;}
      s.chaos++;s.committees++;s.note=['','「禁止按鈕委員會」宣布成立。','委員會成立「監督委員會的委員會」。','茶水費成立獨立董事會，印表機開始選總統。','橡皮鴨接管行政，所有公文都要蓋腳印。','委員會填滿地球，地球申請改當會議室。'][s.chaos];
      if(s.chaos>=5)return finish(s,'lost','結局：地球會議室化。你成了第八千萬位副召集人。');
    } else if(a==='delegate'){
      if(!s.powered){s.note='授權已凍結，不能再外包一個外包委員會。';return s;}
      s.chaos+=2;s.committees+=2;s.note='外包公司另外成立兩個小組，流程長出了流程。';
      if(s.chaos>=5)return finish(s,'lost','結局：委員會接管。連關閉委員會都要再開會。');
    } else if(a==='unplug'){
      if(!s.inspected){s.note='電線長得一樣，先看銘牌確認哪條是授權電源。';return s;}
      s.powered=false;s.note='授權電源已關閉，世界停止新增會議。';
    } else if(a==='dissolve'){
      if(s.powered){s.note='電源仍開著，解散申請被轉交給新委員會。請先停電。';return s;}
      s.committees=0;s.note='委員會已解散，椅子終於可以當椅子。';
    } else if(a==='archive'){
      if(s.powered||s.committees){s.note='封存失敗：先停止授權並解散現有委員會。';return s;}
      return finish(s,'won',s.chaos===0?'結局：零次會議。你沒按紅鈕，世界第一次準時下班。':'結局：解散成功。你按過紅鈕，也親手收拾了委員會。',true);
    } else return s;
    s.log.push(s.note);return s;
  }
  const walls=[[2,2],[2,3],[5,3]],patrol=[[4,2],[4,3],[3,3],[3,2]],items=[[6,1],[6,4]],targets=[[1,4],[2,4]];
  function guard(s){return patrol[s.tick%patrol.length];}
  function gooseAction(s,a) {
    const dirs={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
    if(dirs[a]){
      const[x,y]=[s.x+dirs[a][0],s.y+dirs[a][1]];
      if(x<0||y<0||x>7||y>5||walls.some(p=>p[0]===x&&p[1]===y)){s.note='那是牆，不是有禮貌就能穿過去。';return s;}
      s.x=x;s.y=y;s.note='鵝挪動一步，主管巡邏一步。';
    } else if(a==='pickup'){
      if(s.carry!==null){s.note='嘴巴已經叼著東西。';return s;}
      const n=items.findIndex((p,i)=>!s.done[i]&&p[0]===s.x&&p[1]===s.y);
      if(n<0){s.note='這裡沒有可叼的任務物品。';return s;}s.carry=n;s.note=n===0?'雷射筆到嘴！主管失去指點江山的能力。':'文件到嘴！準備排成一隻紙鵝。';
    } else if(a==='drop'){
      if(s.carry===null){s.note='嘴巴空空，沒有東西可以放。';return s;}
      const n=s.carry,t=targets[n];
      if(t[0]!==s.x||t[1]!==s.y){s.note='請放到標示的任務位置：雷射筆回巢、文件到紙鵝桌。';return s;}
      s.done[n]=true;s.carry=null;s.note=n===0?'雷射筆已藏進鵝巢。':'文件排成鵝了，看起來比報表更有方向。';
    } else if(a==='honk'){s.distract=4;s.alarm++;s.note='HONK！疑心+1，但主管接著會分心研究影印機為什麼會叫。';}
    else if(a==='blend'){
      if(s.carry!==null){s.note='嘴叼雷射筆還說自己是資料夾，說服力有限。';return s;}
      if(s.done.every(Boolean)&&s.x===0&&s.y===4)return finish(s,'won','結局：績效優良的資料夾。任務完成，鵝若無其事走出辦公室。',true);
      s.alarm=Math.max(0,s.alarm-1);s.note='你站直裝成資料夾，疑心降低1。';
    } else return s;
    s.tick++;const g=guard(s);
    if(s.distract>0)s.distract--;else if(Math.abs(s.x-g[0])+Math.abs(s.y-g[1])<=1){s.alarm++;s.note+=' 主管靠近，疑心+1！';}
    s.log.push(s.note);if(s.alarm>=5)return finish(s,'lost','結局：鵝力資源部約談。你被任命為全職吉祥物。');return s;
  }
  function packageMetrics(s){
    if(s.box===null||s.lift===null)return null;
    const b=cartons[s.box],o=objects[s.round],l=lifts[s.lift];
    const dims=s.turned?[b.w,b.h,b.d]:[b.w,b.d,b.h];
    const fitsObject=b.w>=o.w+2*s.pad&&b.d>=o.d+2*s.pad&&b.h>=o.h+2*s.pad;
    const fitsLift=dims[0]<=l.w&&dims[1]<=l.d&&dims[2]<=l.h;
    return{ratio:b.w*b.d*b.h/(o.w*o.d*o.h),fitsObject,fitsLift,dims,green:s.label!==1||s.material===0};
  }
  function packageAction(s,a,v){
    const ranges={box:cartons.length,material:materials.length,label:labels.length,lift:lifts.length};
    if(a in ranges){if(!Number.isInteger(v)||v<0||v>=ranges[a])return s;s[a]=v;s.checked=false;}
    else if(a==='pad'){if(!Number.isInteger(v)||v<0||v>3)return s;s.pad=v;s.checked=false;}
    else if(a==='rotate'){s.turned=!s.turned;s.checked=false;}
    else if(a==='ship'){
      if(!packageReady(s)){s.note='紙箱、填充材、標籤和電梯都要選好。';return s;}
      const m=packageMetrics(s);s.checked=true;
      if(m.fitsObject&&m.fitsLift&&s.pad>=1&&m.ratio>=50&&m.green)return finish(s,'won','包裝成功：'+objects[s.round].name+'享有 '+Math.round(m.ratio)+' 倍體積的尊榮，已塞進'+lifts[s.lift].name+'。',true);
      return finish(s,'lost','包裝失敗：'+(!m.fitsObject?'商品加緩衝塞不進盒子。':!m.fitsLift?'盒子卡住電梯。':s.pad<1?'隆重歸隆重，還是要留緩衝。':m.ratio<50?'還不夠荒謬，體積至少要50倍。':'塑膠填充卻貼環保標籤，紙箱自己都害羞了。'));
    }else return s;
    s.note='組裝已更新；模擬電梯不會真的載走你的橡皮擦。';return s;
  }
  function packageReady(s){return ['box','material','label','lift'].every(k=>s[k]!==null);}
  function elevatorChoices(s){
    const floor=Math.floor(s.turn/2),follow=s.turn%2;
    if(floor===0)return follow?(s.mistaken?['抱歉，認錯人了。','不是阿明嗎？那你先當一下。','我剛在跟電梯打招呼。']:['安靜點頭。','追問：你確定我們沒見過？','說聲借過，留出空間。']):['阿明！好久不見！','先點頭，不強認人。','詢問：請問你是阿明嗎？'];
    if(floor===1)return follow?(s.goodbye?['笑說：原來我們同一層。','再告別三次，增加儀式感。','改口：剛才是對上一層說的。']:['請對方先出。','宣布：這是我的電梯演講時間。','安靜站旁邊。']):['先說掰掰，然後也留在電梯。','問對方要去幾樓。','宣布：我們永遠不會再見！'];
    return follow?(s.ringtone?['坦白：其實是我肚子叫。','繼續拿肚子假裝接電話。','說：這支手機需要吃飯。']:['笑一下，不追究。','詢問要不要一起找午餐。','要求肚子把鈴聲關掉。']):['拿起手機假裝剛才是鈴聲。','笑說：我好像該吃午餐了。','盯著天花板假裝沒聽見。'];
  }
  function elevatorScene(s){const floor=Math.floor(s.turn/2);return ['一樓：一位有點眼熟的人走進電梯。','二樓：你們都還沒出去，樓層燈卻很有存在感。','三樓前：你的肚子發出一聲響亮的咕嚕。'][Math.min(floor,2)];}
  function elevatorAction(s,a,v){
    if(a==='position'){if(!Number.isInteger(v)||v<0||v>2)return s;s.position=v;return s;}
    if(a==='line'){if(!Number.isInteger(v)||v<0||v>2)return s;s.line=v;return s;}
    if(a!=='speak'||s.position===null||s.line===null)return s;
    const turn=s.turn,choice=s.line,words=elevatorChoices(s)[choice];let delta=0,response='';
    if(turn===0){s.mistaken=choice===0;if(choice===0){delta=2;response='乘客：「我不是阿明，但你叫得很有感情。」';}else if(choice===1){response='乘客點頭。兩人暫時都保有名字。';}else{response='乘客：「不是喔。」你仍有優雅收場的空間。';}}
    if(turn===1){delta=s.mistaken?[ -1,3,1][choice]:[0,2,-1][choice];response=s.mistaken?(choice===1?'乘客：「好，我代理阿明到三樓。」':'認錯人的後續已落幕，電梯保住了一個身分。'):(choice===1?'乘客開始懷疑自己是不是失憶了。':'這一段安靜得很有禮貌。');}
    if(turn===2){s.goodbye=choice!==1;delta=[2,0,3][choice];response=s.goodbye?'乘客：「掰掰……欸，你也還在？」':'乘客：「我也三樓。」至少路線現在清楚了。';}
    if(turn===3){delta=s.goodbye?[ -1,3,1][choice]:[-1,3,0][choice];response=choice===1?'告別／演講儀式持續擴張，電梯像小型典禮。':'你們對同路這件事達成了暫時共識。';}
    if(turn===4){s.ringtone=choice===0;delta=[2,0,1][choice];response=s.ringtone?'乘客：「你的手機放在肚子裡？」':'乘客微笑，電梯裡多了一個午餐議題。';}
    if(turn===5){delta=s.ringtone?[-1,3,1][choice]:[0,-1,2][choice];response=choice===1&&s.ringtone?'你對著肚子說喂，乘客開始找訊號基地台。':'樓層到了。所有人都獲得一個可以講很久的故事。';}
    if(s.position===1){delta+=2;response+=' 你站在門口中央，電梯門也加入尷尬。';}
    if(s.position===2)delta--;
    s.awkward=Math.max(0,s.awkward+delta);s.note=response;s.log.push('第'+(turn+1)+'幕／'+positions[s.position]+'／你：'+words+'／'+response);s.turn++;s.lastPosition=s.position;s.line=null;s.position=null;
    if(s.turn>=6)return finish(s,'ending',s.awkward<=3?'結局：平安出梯。你們交換了微笑，沒有交換靈魂。':s.awkward<=10?'結局：電梯都市傳說。乘客回去會說「我今天遇到一個人」。':'結局：尷尬建國。你在三層樓之間成立了一個新文明。',true);return s;
  }
  function noodleReady(s){return Object.values(s.recipe).every(x=>x!==null);}
  function noodleAction(s,a,v){
    if(a==='ask'){
      if(!Number.isInteger(v)||v<0||v>2)return s;s.asked[v]=true;const c=customers[s.round];
      s.note=v===0?c.meaning:v===1?c.avoid:'客人：「會員先不用，我只想吃一頓不用再解釋的飯。」';s.log.push(s.note);return s;
    }
    if(a.startsWith('recipe:')){const key=a.slice(7);if(!recipes[key]||!Number.isInteger(v)||v<0||v>=recipes[key].length)return s;s.recipe[key]=v;s.note='碗裡的配置已變更，還沒出餐。';return s;}
    if(a==='serve'){
      if(!noodleReady(s)){s.note='請把四項配料選完整，再出餐。';return s;}
      const c=customers[s.round],correct=Object.entries(c.allowed).every(([k,allowed])=>allowed.includes(s.recipe[k]));
      if(!s.asked[0]||!s.asked[1])return finish(s,'lost',correct?'猜中的組合，但尚未問明需求與排除項；請重試，把想法核對清楚。':'還沒問明需求就出餐，客人啟動第七輪解釋。');
      return finish(s,correct?'won':'lost',correct?'出餐成功：'+c.name+'說「對！就是這個奇怪但正確的東西。」':'出餐失敗：請對照客人實際回答，不要只看最初那句怪要求。',correct);
    }return s;
  }
  const pressCards=[{id:'dinosaur',name:'恐龍圖表'},{id:'universe',name:'宇宙總體因素'},{id:'unknown',name:'承認目前沒回答到'},{id:'return',name:'拉回原題'},{id:'facts',name:'依桌上資料回答'}];
  function pressAction(s,a,v){
    const c=conferences[s.round];
    if(a==='open'){s.opened=true;s.note=c.record;return s;}
    if(a==='card'){if(!pressCards.some(c=>c.id===v)||s.used.includes(v))return s;s.card=v;return s;}
    if(a==='drama'){if(!Number.isInteger(v)||v<0||v>3)return s;s.drama=v;return s;}
    if(a!=='speak'||s.card===null||s.used.includes(s.card))return s;
    const card=s.card;
    if(card==='return'&&s.focus){s.note='目前就在原題上，不必為了拉回而先繞遠。';return s;}
    s.used.push(card);s.turn++;s.lastCard=card;s.card=null;
    if(card==='dinosaur'||card==='universe'){s.focus=false;s.chaos+=1+s.drama;s.note=card==='dinosaur'?c.follow:'記者：「宇宙可以等，先回答我們剛才那一題。」';}
    if(card==='unknown'){s.chaos=Math.max(0,s.chaos-1);s.note='記者：「謝謝承認。桌上那份資料可以先看一下嗎？」';}
    if(card==='return'){s.focus=true;s.chaos=Math.max(0,s.chaos-1);s.note='主持人把問題拉回：'+c.question;}
    if(card==='facts'){
      if(!s.opened){s.used=s.used.filter(x=>x!=='facts');s.note='你舉起空白資料夾。記者：「可以先打開有內容的那份嗎？」這次發言已耗用，但資料卡可再試。';}
      else if(!s.focus){s.used=s.used.filter(x=>x!=='facts');s.note='資料是對的，但麥克風還在談恐龍；請先把話題拉回原題再回答。資料卡可再試。';}
      else{s.note=c.answer;s.log.push(c.answer);return finish(s,'won','結局：記者終於拿到答案。'+c.answer,true);}
    }
    s.log.push(s.note);
    if(s.chaos>=8)return finish(s,'lost','結局：記者會變成恐龍展，便當問題被排到白堊紀。');
    if(s.turn>=5)return finish(s,'lost','結局：下次記者會再開記者會。你用完五張卡，原題仍未解決。');return s;
  }
  function act(state,a,v){
    if(state.status!=='playing')return state;
    const s=clone(state),kind=meta[s.id].kind;
    return ({button:buttonAction,goose:gooseAction,package:packageAction,elevator:elevatorAction,noodle:noodleAction,press:pressAction})[kind](s,a,v);
  }
  return {meta,create,act,guard,walls,items,targets,cartons,objects,lifts,materials,labels,recipes,customers,conferences,positions,pressCards,packageMetrics,packageReady,noodleReady,elevatorChoices,elevatorScene};
})();
if(typeof module!=='undefined')module.exports=ComedySix;
