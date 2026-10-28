(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ShortcutSchool=api;})(typeof globalThis==='object'?globalThis:this,()=>{
  'use strict';
  const profiles={
    windows:{label:'Windows',fileApp:'檔案總管',primary:'Ctrl',switchKeys:['Alt','Tab'],note:'以 Windows 常見預設為例；文字操作限一般圖形介面編輯器。'},
    mac:{label:'macOS',fileApp:'Finder',primary:'Cmd',switchKeys:['Cmd','Tab'],note:'Cmd 是 Command（⌘），不是 Control。檔案重新命名用 Return；剪下課程只處理文字，不套用到 Finder 檔案。'},
    gnome:{label:'Linux · GNOME',fileApp:'Files（Nautilus）',primary:'Ctrl',switchKeys:['Super','Tab'],note:'以 GNOME／Files 預設為例；Super 通常是鍵盤上的 Windows 標誌鍵。不同發行版與自訂設定可能不同。'},
    kde:{label:'Linux · KDE Plasma',fileApp:'Dolphin',primary:'Ctrl',switchKeys:['Alt','Tab'],note:'以 KDE Plasma／Dolphin 目前上游常見預設為例；較舊版本或發行版可能不同，請以應用程式選單為準。'}
  };
  const definitions=[
    ['all','全選這一頁','把記事本中的整段旅行清單選起來。','notes','A','全選影響目前有焦點的文件，不是整台電腦。'],
    ['copy','留下原文，複製一份','文字已反白。把它放進模擬剪貼簿，原文要留下。','notes','C','複製不會刪除原文；剪貼簿只存在這個模擬情境。'],
    ['paste','把備忘貼進去','模擬剪貼簿已備妥「記得帶充電線。」；貼到備忘末尾。','notes','V','貼上使用剪貼簿的內容，不會自動替你重做複製。'],
    ['cut','把選取文字剪走','把反白的「多帶三條線」剪下，觀察原文與剪貼簿。','notes','X','這關剪的是文字。macOS Finder 搬移檔案不是直接照套 Cmd + X。'],
    ['undo','剛剛改錯了','上一個動作把「一條線」改成「三條線」，請復原。','notes','Z','復原會回到上一個可復原的編輯狀態，不等於重新載入檔案。'],
    ['redo','把復原的編輯重做','剛剛已復原一次，現在重新套用「帶三條線」的編輯。','notes','redo','重做只重做剛被復原的動作；Windows 與其他平台的常見組合不同。'],
    ['save','儲存目前文件','記事本顯示「尚未儲存」，把目前內容儲存到模擬文件。','notes','S','這裡只更新本頁模擬檔案；真正應用程式第一次儲存可能要求選檔名與位置。'],
    ['find','在文件裡找一段文字','先打開文件內搜尋，再輸入「充電線」並按「搜尋」。','notes','F','這是目前文件內的搜尋，不是全系統搜尋。'],
    ['folder','建立收納資料夾','先開啟新增資料夾，再輸入「旅行照片」並確認建立。','files','folder','先在檔案管理員工作，再用新增資料夾組合；不是在文字編輯器裡。'],
    ['rename','替資料夾改名字','已選取「未命名資料夾」。開啟重新命名，再改成「上課筆記」。','files','rename','macOS 在 Finder 選取後按 Return；Windows／Linux 常用 F2。'],
    ['window','再開一個檔案視窗','目前在檔案管理員；開一個新的檔案管理員視窗。','files','N','同樣的 N 組合，在不同應用程式可能是新文件或新視窗，要看焦點。'],
    ['switch','切換到另一個程式','目前記事本在前面，把已開啟的檔案管理員切到前面。','system','switch','真實系統通常先按住修飾鍵，再按 Tab 選擇；這裡簡化成兩個已開啟程式的切換。']
  ];
  const keyOrder=['Ctrl','Cmd','Alt','Super','Shift','A','C','V','X','Z','Y','S','F','N','F2','Return','Tab'];
  function profile(id){if(!Object.hasOwn(profiles,id))throw new Error('Unknown profile');return profiles[id];}
  function tasks(id){const p=profile(id);return definitions.map(([key,title,goal,scope,last,note])=>{
    let keys=[p.primary,last];
    if(last==='redo')keys=id==='windows'?['Ctrl','Y']:[p.primary,'Shift','Z'];
    if(last==='folder')keys=[p.primary,'Shift','N'];
    if(last==='rename')keys=id==='mac'?['Return']:['F2'];
    if(last==='switch')keys=[...p.switchKeys];
    return {id:key,title,goal,scope,keys,alternatives:key==='switch'&&id==='kde'?[['Super','Tab']]:[],note,context:scope==='files'?p.fileApp:scope==='system'?'兩個已開啟的圖形介面程式':'一般圖形介面文字編輯器'};
  });}
  function canonical(keys){return [...keys].sort((a,b)=>keyOrder.indexOf(a)-keyOrder.indexOf(b)).join('+');}
  function matches(a,b){return a.length===b.length&&new Set(a).size===a.length&&canonical(a)===canonical(b);}
  function scene(id){
    const s={app:['folder','rename','window'].includes(id)?'files':'notes',text:'旅行清單：帶水壺、充電線。',selected:false,clipboard:'',saved:false,findOpen:false,query:'',found:false,dialog:null,files:['旅行清單.txt','未命名資料夾'],selectedFile:'未命名資料夾',windows:1,history:[],redo:[]};
    if(id==='copy')s.selected=true;
    if(id==='paste'){s.text='備忘：';s.clipboard='記得帶充電線。';}
    if(id==='cut'){s.text='多帶三條線';s.selected=true;}
    if(id==='undo'){s.text='備忘：帶三條線';s.history=['備忘：帶一條線'];}
    if(id==='redo'){s.text='備忘：帶一條線';s.redo=['備忘：帶三條線'];}
    return s;
  }
  function create(id='windows'){profile(id);return {profile:id,index:0,phase:'playing',scene:scene(definitions[0][0]),attempts:0,usedHint:false,formMistakes:0,pending:null,solved:false,answers:[]};}
  function current(s){return tasks(s.profile)[s.index];}
  function complete(s){s.pending=null;s.solved=true;s.answers.push({id:current(s).id,keys:[...s.lastKeys],attempts:s.attempts,usedHint:s.usedHint,formMistakes:s.formMistakes,first:s.attempts===1&&!s.usedHint&&s.formMistakes===0});}
  function submit(s,keys){
    if(s.phase!=='playing'||s.solved||s.pending)return {status:'locked'};
    if(!keys.length)return {status:'empty'};
    s.attempts++;
    if(![current(s).keys,...current(s).alternatives].some(answer=>matches(keys,answer)))return {status:'wrong'};
    s.lastKeys=[...keys];
    const v=s.scene;
    switch(current(s).id){
      case 'all':v.selected=true;break;
      case 'copy':v.clipboard=v.text;break;
      case 'paste':v.history.push(v.text);v.text+=v.clipboard;break;
      case 'cut':v.history.push(v.text);v.clipboard=v.text;v.text='';v.selected=false;break;
      case 'undo':v.redo.push(v.text);v.text=v.history.pop();break;
      case 'redo':v.history.push(v.text);v.text=v.redo.pop();break;
      case 'save':v.saved=true;break;
      case 'find':v.findOpen=true;s.pending='find';break;
      case 'folder':v.dialog='folder';s.pending='folder';break;
      case 'rename':v.dialog='rename';s.pending='rename';break;
      case 'window':v.windows++;break;
      case 'switch':v.app='files';break;
    }
    if(s.pending)return {status:'input'};
    complete(s);return {status:'correct'};
  }
  function apply(s,value){
    if(!s.pending||s.solved||s.phase!=='playing')return {status:'locked'};
    const expected={find:'充電線',folder:'旅行照片',rename:'上課筆記'}[s.pending];
    if(value.trim()!==expected){s.formMistakes++;return {status:'wrong',expected};}
    if(s.pending==='find'){s.scene.query=value.trim();s.scene.found=s.scene.text.includes(value.trim());}
    if(s.pending==='folder'){s.scene.files.push(value.trim());s.scene.selectedFile=value.trim();}
    if(s.pending==='rename'){const i=s.scene.files.indexOf(s.scene.selectedFile);s.scene.files[i]=value.trim();s.scene.selectedFile=value.trim();}
    s.scene.dialog=null;complete(s);return {status:'correct'};
  }
  function hint(s){if(s.phase!=='playing'||s.solved)return null;s.usedHint=true;return [...current(s).keys];}
  function next(s){
    if(s.phase!=='playing'||!s.solved)return false;
    if(s.index===definitions.length-1){s.phase='result';return true;}
    s.index++;s.scene=scene(current(s).id);s.attempts=0;s.usedHint=false;s.formMistakes=0;s.pending=null;s.solved=false;return true;
  }
  return {profiles,keyOrder,tasks,canonical,matches,create,current,submit,apply,hint,next};
});
