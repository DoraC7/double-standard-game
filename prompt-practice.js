const scenarios=[
  {type:'提問 1 · 求助與除錯',title:'資料夾怎麼進不去？',copy:'你想進入「projects」資料夾，試過輸入 `cd /projects`，畫面回覆「No such file or directory」。你不知道目前資料夾在哪，也不想亂改檔案。',goal:'請別人幫你找出下一個安全的確認步驟。',intro:'求助時把目標、試過的事、實際結果和卡住的問題放在一起，對方比較能接著查。',checks:['有說你最後想完成什麼','有寫出試過的指令和完整錯誤','有指出目前真正不確定的點'] ,example:'我想進到 projects 資料夾，剛試了 `cd /projects`，收到「No such file or directory」。可以先教我用哪個指令查看目前位置和裡面的資料夾嗎？先不要改動檔案；我跑完會貼結果。'},
  {type:'下指令 1 · 目標與範圍',title:'請幫忙整理課堂筆記',copy:'你有一份今天的課堂筆記，想整理成「目的、我實際做的操作、怎麼確認成功、還不懂的問題」四個段落。只能根據筆記整理，不可補寫沒記錄的內容。',goal:'把要做的事、輸入資料、格式與不可做的事交代清楚。',intro:'下指令時，不只說「幫我整理」；要交代材料、想要的結果，以及哪些界線不能跨。',checks:['有指定要整理哪份材料','有說明想要的段落或格式','有要求不要捏造筆記沒有的資訊'] ,example:'請只根據我接下來貼的課堂筆記，整理成四個小標題：目的、我實際做的操作、怎麼確認成功、還不懂的問題。只重排和濃縮原文；沒有記錄的內容請標「筆記未提到」，不要自行補充。'},
  {type:'提問 2 · 釐清概念',title:'pwd 和 cd 有什麼不同？',copy:'你看過 `pwd` 和 `cd` 兩個指令，知道一個會顯示路徑、一個會切換位置，但還不清楚什麼時候用哪個。你希望先懂差別，再自己試一次。',goal:'問出你想理解的差異，並指定適合自己的解釋方式。',intro:'好問題可以直接指出「我知道什麼、混淆什麼」，再說希望怎麼學；不用假裝自己已經懂。',checks:['有說你目前理解到哪裡','有點出真正混淆的地方','有請對方用小例子或一步練習說明'] ,example:'我知道 `pwd` 會顯示目前位置，`cd` 會切換位置，但我常把「查看」和「改變」混在一起。可以用一個小資料夾例子說明差異，再給我一題讓我自己判斷要用哪個嗎？先不要直接替我操作。'},
  {type:'下指令 2 · 安全界線',title:'先找檔案，不要動它',copy:'你想找到名為 `weekly.md` 的檔案並知道它在哪個資料夾。你只需要位置，不要開啟內容、修改、搬移或刪除檔案。',goal:'明確指定動作和禁止事項，避免「幫我處理一下」被過度解讀。',intro:'牽涉檔案時，說清楚要查什麼、要回報什麼，也要列出不要做的事。',checks:['有指定要找的檔名','有說要回報檔案位置','有明確禁止讀取內容或改動檔案'] ,example:'請只搜尋名為 `weekly.md` 的檔案，回報找到的完整路徑；不要讀取檔案內容，也不要建立、修改、搬移或刪除任何檔案。若找到多個，請列出全部位置。'},
  {type:'提問 3 · 看懂錯誤',title:'出現 Permission denied',copy:'你在嘗試讀取一個檔案時看到 `Permission denied`。你還不知道是路徑、權限還是其他原因，也不確定下一步該查什麼。',goal:'提供錯誤原文，詢問一個不會擴大改動的診斷步驟。',intro:'遇到權限錯誤時，不要直接猜要用管理員權限；先把情境和錯誤貼出來，要求安全的檢查步驟。',checks:['有貼出操作目的和錯誤原文','有坦白說目前不知道原因','有先要求檢查，不要直接改權限或使用 sudo'] ,example:'我想讀取這個檔案，但執行 `cat notes.txt` 得到 `Permission denied`。我還不知道是路徑或權限問題；可以先教我一個只查看資訊、不改檔案也不使用 sudo 的檢查步驟嗎？我會回報結果後再繼續。'},
  {type:'下指令 3 · 一步一步與驗收',title:'帶我新增檔案並確認成功',copy:'你想在目前資料夾建立一個空的 `todo.txt`。你希望自己親手輸入指令：一次只給一個步驟，等你回報結果後再給下一步；最後確認檔案真的存在。',goal:'說明節奏、由誰操作，以及怎樣算完成。',intro:'交代過程和驗收方式，能讓協助保留你的操作空間，也不會把「指令跑過」誤當成成功。',checks:['有指定要建立的檔案和位置','有要求一次一步、由你親自操作','有要求最後查看結果確認檔案存在'] ,example:'請帶我在目前資料夾建立空的 `todo.txt`。一次只給我一個指令，解釋它會做什麼，等我親自執行並貼回結果後再繼續；最後請教我用只讀方式確認檔案確實存在，不要替我直接操作。'}
];

const byId=id=>document.getElementById(id);
let current=0;
const roundLabel=byId('round-label'),progress=byId('round-progress'),type=byId('scenario-type'),title=byId('scenario-title'),copy=byId('scenario-copy'),goal=byId('scenario-goal'),draft=byId('draft'),feedback=byId('feedback'),finish=byId('finish');

function render(){
  const item=scenarios[current];
  roundLabel.textContent=`情境 ${current+1} / ${scenarios.length}`;
  progress.value=current;
  type.textContent=item.type;title.textContent=item.title;copy.textContent=item.copy;goal.textContent=item.goal;
  draft.value='';feedback.hidden=true;finish.hidden=true;byId('error').hidden=true;
  byId('review').hidden=false;byId('clear').hidden=false;draft.hidden=false;byId('review').focus();
}

byId('review').addEventListener('click',()=>{
  if(!draft.value.trim()){byId('error').hidden=false;draft.focus();return;}
  const item=scenarios[current];
  byId('feedback-intro').textContent=item.intro;
  const list=byId('checklist');list.replaceChildren(...item.checks.map(text=>{const li=document.createElement('li'),label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.setAttribute('aria-label',text);label.append(input,document.createTextNode(text));li.append(label);return li;}));
  byId('example').textContent=item.example;
  byId('error').hidden=true;feedback.hidden=false;byId('review').hidden=true;byId('clear').hidden=true;
  byId('next').textContent=current===scenarios.length-1?'完成這輪 ✓':'我看完了，下一題 →';
  byId('feedback').scrollIntoView({behavior:'smooth',block:'nearest'});
});
byId('clear').addEventListener('click',()=>{draft.value='';draft.focus();});
byId('next').addEventListener('click',()=>{
  current++;
  if(current>=scenarios.length){feedback.hidden=true;byId('review').hidden=true;byId('clear').hidden=true;draft.hidden=true;roundLabel.textContent='情境 6 / 6';progress.value=scenarios.length;finish.hidden=false;byId('restart').focus();return;}
  render();title.focus();
});
byId('restart').addEventListener('click',()=>{current=0;draft.hidden=false;render();title.focus();});
render();
