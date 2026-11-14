'use strict';
const KeelungData=(()=>{
 const tour=(s,n=7841)=>'https://travel.klcg.gov.tw/TourContent.aspx?n='+n+'&s='+s;
 const sources={history:'https://www.klcg.gov.tw/tw/klcg1/3173.html',geo:'https://www.klcg.gov.tw/tw/klcg1/3175.html',city:'https://www.klcg.gov.tw/tw/klcg1',museum:'https://www.nmmst.gov.tw/',region:'https://www.nmmst.gov.tw/chhtml/content/230',bus:'https://www.klcba.gov.tw/',rail:'https://www.railway.gov.tw/tra-tip-web/tip'};
 const places=[
 ['harbor','海洋廣場','仁愛區','港都','城市通往港口的門戶，能看船、港景與公共藝術。港灣深入市區，是認識基隆生活與產業的起點。','觀察黑鳶與港景時，留意岸邊與作業動線。',tour(435,7835)],
 ['gate','國門廣場','仁愛區','港都','以零點廣場為概念，連結港口、鐵路與城市門戶意象；旁側玻璃屋前身為舊公車總站。','表演、水舞與店家活動需另查當日公告。',tour(528,7838)],
 ['market','基隆廟口夜市','仁愛區','吃逛','廟口的興起與奠濟宮、香客及在地居民生活相關。可認識鼎邊銼、天婦羅、泡泡冰等小吃。','開放街區不等於每攤全天營業；先看店家公告，也留通行空間。',tour(558,8059)],
 ['mall','微風東岸','仁愛區','吃逛','東岸廣場的複合商場，結合服飾生活品牌、餐飲與港景；屋頂空中跑道、平台是戶外空間。','室內吃逛與戶外屋頂要分開；品牌、樓層與營業時間依商場公告。',tour(537)],
 ['renai','仁愛市場','仁愛區','吃逛','一樓日常採買與生鮮小吃，二樓聚集多樣美食與老店。白天市場生活也是城市風景，不只有夜市。','各攤營業與公休日不同，不把市場開放時間當每家店的營業時間。',tour(552)],
 ['commission','委託行商圈','仁愛區','吃逛','從港口舶來品、寄賣與委託交易的記憶，轉化為小吃、伴手禮與地方創生街區。','店家、市集與走讀活動須查當期資訊；尊重居民與店家空間。',tour(555)],
 ['xiaosan','孝三路','仁愛區','吃逛','曾是船員停靠享用美食的街區，傳統大腸圈、麵食與老店小吃是特色。大腸圈是米腸的一種。','店家分布在街巷中；不保證每家都開，不用把整條街一次吃完。',tour(718)],
 ['foodcourt','基隆港好食城','中正區','吃逛','位在港東岸旅客服務中心（叁肆行）的複合餐飲購物空間，兼具港景、餐飲與伴手禮。','不是微風東岸的另一個名字；不同場館各查營運與店家資訊。',tour(710)],
 ['lenjen','連珍糕餅店','仁愛區','吃逛','官方旅遊資料介紹其芋泥球，是認識基隆甜點與伴手禮的一個例子。','口味、成分、保存與價格依實際商品標示；不把所有點心當成能常溫久放。',tour(636,8061)],
 ['rice','泉利米香','信義區','吃逛','古早味與特色米香，是基隆地方特產與伴手禮的例子。','選購仍需看包裝、過敏原與保存標示；不是全市品牌排名。',tour(637,8061)],
 ['fish','崁仔頂漁市','仁愛區','吃逛','夜間與清晨的生鮮漁獲批發活動，呈現港都另一種生活節奏，不是一般白天小吃夜市。','先查年度公休與作業時間；不擋拍賣、搬運動線，別把工作現場當攝影棚。',tour(717)],
 ['zhengbin','正濱漁港色彩屋','中正區','港都','色彩屋與漁港相映，保留港灣、漁船與老建築風貌；可從對岸公共觀景處欣賞。','色彩屋周邊仍有居民與店家；別擅入私人空間或港邊作業區。',tour(52,7834)],
 ['heping','和平島地質公園','中正區','山海','長期風化與海浪侵蝕形成豆腐岩、蕈狀石等海蝕景觀，也承載社寮島與西荷時期歷史。','海岸、泳池及特定區域可能受天候、季節與管制影響，以園方公告為準。',tour(59,7837)],
 ['museum','國立海洋科技博物館','中正區','港都','八斗子的海洋科技、科學文化與環境教育場館。區域探索館也介紹漁村、煤礦、北火電廠與海岸變遷。','可規劃室內展館，但仍需查開館、票種、場館與交通資訊。',sources.museum],
 ['lake','情人湖公園','安樂區','山海','大武崙山腰的高地湖泊，環湖與環山步道帶來不同視角，提醒我們基隆不只有港邊。','走不同步道前確認坡度、天候與個人狀況，勿把所有路線視為平坦無階梯。',tour(516,7837)],
 ['valley','暖東峽谷','暖暖區','山海','沿溪、峽谷與滑瀑風景，連結暖暖的淡蘭古道山徑與先民往來歷史。','以步道觀察自然，不擅入溪水；出發前查天候、步道與現場管制。',tour(886,7839)],
 ['tower','基隆塔','中正區','港都','以港區橋式起重機為設計概念，連結山城與港景，是理解城市地形的新地標。','查核時官方細項仍列電梯與鳶人文空間自115/4/1整修、開放另行公告；不保證今天可登塔。',tour(56,7834)]
 ].map(([id,name,district,category,text,note,url])=>({id,name,district,category,text,note,url}));
 const byId=Object.fromEntries(places.map(p=>[p.id,p]));
 const points={harbor:[220,175],gate:[145,100],market:[360,245],mall:[365,160],renai:[280,290],commission:[125,245],xiaosan:[90,175],zhengbin:[455,85],heping:[540,45],museum:[560,160],lake:[45,345],valley:[450,350]};
 const mapIds=Object.keys(points),edges=[['harbor','gate','walk',1],['gate','commission','walk',1],['harbor','xiaosan','walk',1],['xiaosan','commission','walk',1],['commission','harbor','walk',1],['harbor','market','walk',1],['market','renai','walk',1],['renai','mall','walk',1],['market','mall','walk',1],['mall','harbor','walk',1],['harbor','renai','walk',1],['harbor','zhengbin','transit',3],['zhengbin','heping','walk',1],['zhengbin','museum','transit',3],['harbor','lake','transit',3],['harbor','valley','transit',3]];
 const missions=[
 {kind:'route',title:'先吃再逛，港邊小旅行',goal:'從海洋廣場出發，拜訪至少一個小吃點與一個購物街區，最後回海洋廣場；不超過6移動格。',groups:[['market','renai','xiaosan'],['mall','commission']],end:'harbor',limit:6,refs:[byId.market.url,byId.renai.url,byId.commission.url],why:'廟口、白天市場、老街小吃與委託行／商場，可以組成不同的吃逛路線。'},
 {kind:'route',title:'市場加商場，雨天也有選擇',goal:'本關是一般雨天、沒有災害情境。走訪仁愛市場與微風東岸，回海洋廣場；不超過5移動格。',groups:[['renai'],['mall']],end:'harbor',limit:5,refs:[byId.renai.url,byId.mall.url],why:'有室內場所不代表全程有遮雨，兩站之間與屋頂仍可能在戶外；店家營業也各自不同。'},
 {kind:'route',title:'正濱接山海，別只在市中心',goal:'從海洋廣場走訪正濱，再到和平島或海科館其中一站，回海洋廣場；不超過12移動格。',groups:[['zhengbin'],['heping','museum']],end:'harbor',limit:12,refs:[byId.zhengbin.url,byId.heping.url,byId.museum.url],why:'港灣色彩、地質景觀與海洋科普是不同主題；實遊要查正確路線、班次與開放區域。'},
 {kind:'sort',title:'港都時光：雞籠到基隆',goal:'把四張事件卡按年代由早到晚排列；年份可直接參考，不考硬背。',items:[['1626','西班牙遠征隊在社寮島（今和平島）登陸。'],['1642','荷蘭人攻佔社寮島。'],['1875','清廷將雞籠改名為基隆。'],['1895','基隆港積極籌劃展開築港工程。']],order:[2,0,3,1],refs:[sources.history],why:'和平島、城市名稱與築港，串起不同時期的港都故事；更早已有在地人群生活，不代表歷史從外來者抵達才開始。'},
 {kind:'sort',title:'八斗子不只是看海',goal:'依海科館的海岸變遷敘事，排出「自然環境→產業介入→今日教育與地方故事」的順序。',items:[['早期','蜿蜒海岸與漁村生活。'],['產業變遷','煤礦、北火電廠與海岸建設改變地景。'],['今日','海科館保存、展示海洋與地方產業故事。']],order:[2,0,1],refs:[sources.region],why:'城市之美也包含產業、居民與環境變遷，而不是只有一張漂亮海景照。'},
 {kind:'sort',title:'伴手禮最後一哩路',goal:'虛構包裝寫著「需冷藏」，不是指任何品牌全產品。依本關流程先確認條件，再準備、購買及保存。',items:[['1','先讀保存、成分與攜帶條件。'],['2','安排保冷方式與返程，確認可維持標示條件。'],['3','把需要冷藏的點心安排在接近返程時選購。'],['4','返程後依標示儘速冷藏。']],order:[1,3,0,2],refs:[byId.lenjen.url,byId.rice.url],why:'認識芋泥點心與米香，也要看實際商品標示；本關是虛構流程，不提供所有食品通用的保存時數。'},
 {kind:'match',title:'吃逛街區，不是同一種夜市',goal:'把地方卡放到對應的生活特色。',slots:[['與奠濟宮、香客與小吃發展相關','market'],['一樓日常採買、二樓美食','renai'],['舶來品與寄賣記憶、地方創生','commission']],options:['commission','market','mall','renai'],refs:[byId.market.url,byId.renai.url,byId.commission.url],why:'廟口、傳統市場、委託行各有自己的歷史與生活節奏。'},
 {kind:'match',title:'甜鹹都要，商場也要',goal:'把吃的、逛的與地方特色配成你的港都名片。',slots:[['大腸圈與傳統麵食街','xiaosan'],['芋泥球是其官方介紹特色','lenjen'],['古早味與特色米香','rice'],['購物餐飲加戶外屋頂平台','mall']],options:['mall','rice','xiaosan','lenjen'],refs:[byId.xiaosan.url,byId.lenjen.url,byId.rice.url,byId.mall.url],why:'這是特色對照，不是品牌排行，也不是每家店今天都營業的保證。'},
 {kind:'match',title:'山海城市的四個角度',goal:'把地質、湖泊、古道與海洋科學放回對的地方。',slots:[['豆腐岩、蕈狀石等海蝕景觀','heping'],['大武崙山腰的高地湖泊','lake'],['峽谷滑瀑與淡蘭古道山徑','valley'],['海洋科技與八斗子產業故事','museum']],options:['valley','museum','heping','lake'],refs:[byId.heping.url,byId.lake.url,byId.valley.url,sources.region],why:'基隆不只有港口與小吃，也有多樣山林、海岸與人文教育。'},
 {kind:'plan',title:'雨天吃逛方案板',goal:'規劃一般雨天的室內用餐、逛街、營運查核與雨天銜接；最多5規劃格（不是金額或分鐘）。',needs:['室內用餐','逛街','查營運','雨天銜接'],limit:5,options:[
 ['微風東岸室內餐飲與購物',['室內用餐','逛街'],2],['港好食城餐飲與購物',['室內用餐','逛街'],2],['仁愛市場用餐',['室內用餐'],1],['委託行街區逛店',['逛街'],1],['查各場館、店家當日營業',['查營運'],1],['準備雨具並查看戶外銜接路段',['雨天銜接'],1],['把商場屋頂跑道當成室內避雨空間',[],1,true]],refs:[byId.mall.url,byId.foodcourt.url,byId.renai.url,byId.commission.url],why:'商場、市場與港邊複合餐飲提供不同選擇；遇警報或停班停課等特殊情況須依官方指示重排，不用本關當即時出遊建議。'},
 {kind:'plan',title:'伴手禮怎麼帶回家',goal:'選特色點心，並補齊讀包裝與攜帶安排；最多4規劃格。不操作真實購物。',needs:['挑選特色','讀包裝','安排攜帶'],limit:4,options:[
 ['選一款連珍芋泥點心，保存依實際包裝',['挑選特色'],1],['選泉利米香作為地方伴手禮例子',['挑選特色'],1],['讀成分、過敏原與保存標示',['讀包裝'],1],['依標示安排攜帶；需冷藏品準備保冷與返程',['安排攜帶'],1],['買前核對標示，依返程條件選適合的款式',['讀包裝','安排攜帶'],2],['所有點心都能常溫放整天',[],1,true]],refs:[byId.lenjen.url,byId.rice.url],why:'不是一定要買哪一家，重點是地方特色與適合自己行程的保存方式。'},
 {kind:'plan',title:'如果住在基隆：日常探勘',goal:'替虛構新住民安排通勤、坡地與生活服務查核；最多4規劃格。不能只看夜景就決定生活品質。',needs:['通勤','地形','生活服務'],limit:4,options:[
 ['查臺鐵起訖站與班次，安排實際試乘',['通勤'],1],['查公車路線、末班與轉乘，安排試走',['通勤'],1],['實走住家周邊坡度、雨天與步行銜接',['地形'],1],['查市府教育、醫療、托育與市場服務入口',['生活服務'],1],['實走住家到站牌／車站並核對坡度',['通勤','地形'],2],['住在基隆任何地方，走路都一樣近',[],1,true]],refs:[sources.geo,sources.city,sources.bus,sources.rail],why:'全市有中正、信義、仁愛、中山、安樂、暖暖、七堵七區，山、海、河、港的環境不同。通勤與生活機能要依實際住址、目的地和需求查核，不保證房價、時間或設施適用性。'}
 ];
 sources.library='https://kllib.klcg.gov.tw/';
 sources.culture='https://klctb.klcg.gov.tw/Default.aspx';
 sources.libraries='https://klctb.klcg.gov.tw/cp.aspx?n=7491';
 sources.education='https://www.klcg.gov.tw/tw/education';
 sources.schools='https://12basic.kl.edu.tw/';
 sources.lifelong='https://lifelearn.kl.edu.tw/sites/1';
 sources.arts=tour(391,7834);
 const civicPlaces=[
 ['library','基隆公共圖書館與分館','全市各區','生活教育','各區的公共圖書館不只借閱，也有閱讀推廣、兒少活動、講座與影片討論。百福、暖暖、仁愛等分館，把閱讀接回不同街區。','先查所需館藏、分館位置與開放，再依官方借閱規則或詢問館員；活動、臨時休館另看當期公告。',sources.library],
 ['education','教育與適性升學資源','全市查詢','生活教育','可從教育處與十二年國教資訊網認識基隆女中、基隆商工、中山高中、海大附中等在地學校，查特色、群科與適性入學。認識選擇不等於替學校排高低。','依學生需求查當年度課程、招生或學區資料，不因距離近就保證能入學，也不使用過期簡章。',sources.schools],
 ['lifelong','社區與終身學習','跨街區學習','生活教育','終身學習網介紹基隆社區大學等資源，將成人學習、在地文化與公共參與連在一起；學習不只發生在學齡階段。','課程、校區、名額、費用與報名資格以當期公告為準，不在遊戲內代報名或付費。',sources.lifelong],
 ['services','日常照顧與市民服務','全市查詢','生活教育','市府服務入口可找教育、托育、健康醫療、零售市場等資訊，讓城市認識包含日常需求，不只景點與採買。','依家庭與實際住址查適用條件；入口有服務不代表每人都有名額或符合資格。',sources.city],
 ['memory','八斗子居民與產業記憶','八斗子','人文故事','海科館區域探索館談漁寮、家庭分工、海女採石花、煤礦與北火，也讓社區物件、影像與生活故事共同參與展示。','把居民視為故事主體，不只拍照背景；個人回憶與可查史料各有價值，要保留其來源與範圍。',sources.region],
 ['arts','沙灣老屋與音樂展演','中正區','人文故事','必應創造展演空間 B’IN LIVE SPACE–KEELUNG 前身為舊公車處，整修後於2024年7月開放，連結老建築、展覽、音樂與文化創意。','老屋再利用不等於宗教場所；實際節目、開放區域與票務請查場館當期資訊。',sources.arts]
 ];
 for(const [id,name,district,category,text,note,url] of civicPlaces){const p={id,name,district,category,text,note,url};places.push(p);byId[id]=p;}
 missions.push(
 {kind:'plan',section:'生活教育',title:'圖書館不只是進去坐一下',goal:'替虛構讀者找一本需要的書，補齊館藏查詢、分館開放與借閱條件；最多4規劃格，不實際查個人借閱紀錄。',needs:['查館藏','確認分館','借閱條件'],limit:4,examples:[[0,1,2],[3,2]],options:[
 ['從公共圖書館入口或詢問館員查所需館藏',['查館藏'],1],['確認分館位置、開放與臨時休館',['確認分館'],1],['依官方規則確認借閱方式與所需條件',['借閱條件'],1],['查書在哪個分館，再核對該館開放',['查館藏','確認分館'],2],['只看建築照片，就假設每館都有這本書',[],1,true]],refs:[sources.library,sources.libraries],why:'閱讀資源分布在不同街區；館藏、所在館與開放要各自核對，不能把某一間圖書館當全市。'},
 {kind:'match',section:'生活教育',title:'想學什麼，先找對資源',goal:'把學習需求連到對的基隆資訊入口；不是替學校、課程或讀者排名。',slots:[['教育公告、在地高中職與適性入學','education'],['成人持續學習、社區大學與公共參與','lifelong'],['閱讀、館藏與分館活動','library']],options:['library','services','lifelong','education'],refs:[sources.education,sources.schools,sources.lifelong,sources.library],why:'學校教育、成人學習與圖書館閱讀互補，不是同一套招生或借閱規則；條件與課程查當期公告。'},
 {kind:'plan',section:'生活教育',title:'親子日常：學習之外還要能生活',goal:'為虛構家庭連結學習資源、照顧服務與實際動線；最多4規劃格，不假設每家都有相同需求。',needs:['學習資源','照顧服務','實走動線'],limit:4,examples:[[0,2,3],[1,2,3]],options:[
 ['從圖書館找適合的閱讀或兒少活動',['學習資源'],1],['依孩子需求查教育處與在地學習資訊',['學習資源'],1],['由市府入口查托育、健康與適用服務',['照顧服務'],1],['實走住家、學習場所與站牌銜接',['實走動線'],1],['生活需求確認後再安排市場採買',[],1],['以一次商場遊逛代替所有教育與照顧安排',[],1,true]],refs:[sources.library,sources.education,sources.city,sources.bus],why:'吃逛可以是日常的一部分，但不能代替學習、照顧與能不能到達的查核。這是情境規劃，不保證任何設施名額或服務資格。'},
 {kind:'match',section:'人文故事',title:'港都的人，不只是打卡背景',goal:'把勞動、老屋展演與商業記憶配到對的地方。這裡的人文以居民、產業與文化生活為主題。',slots:[['漁寮、家庭分工、海女與社區生活物件','memory'],['舊公車處轉為音樂展演與文化創意空間','arts'],['舶來品寄賣、商業記憶與地方創生','commission']],options:['arts','renai','memory','commission'],refs:[sources.region,sources.arts,byId.commission.url],why:'人文包括如何工作、生活、學習與創作；不能用宗教景點替代所有居民與城市文化故事。'},
 {kind:'sort',section:'人文故事',title:'老建築的新一頁：沙灣展演空間',goal:'依官方介紹，重建這棟建築「原用途→整修→新用途」的先後，不考尚未提供的細節。',items:[['原用途','基隆舊公車處的建築。'],['轉變','空間經過整修，準備承接新的文化用途。'],['2024年7月','以必應創造展演空間開放，連結音樂、展覽與文化創意。']],order:[2,0,1],refs:[sources.arts],why:'老屋價值也在於新的公共與創作用途，不只建築外觀；特定活動與可進入區域仍以場館公告為準。'},
 {kind:'plan',section:'人文故事',title:'走讀一個有居民的街區',goal:'規劃有來源、會查活動且尊重居民的非宗教主題走讀；最多4規劃格。',needs:['查活動','理解產業','尊重居民'],limit:4,examples:[[0,1,2],[3,2]],options:[
 ['查沙灣音樂／展覽的當期場館活動',['查活動'],1],['先讀八斗子居民、漁寮與產業故事',['理解產業'],1],['拍攝或訪談先徵詢同意，不擋居民與工作動線',['尊重居民'],1],['查委託行當期走讀，連同舶來品產業背景閱讀',['查活動','理解產業'],2],['直接替陌生居民編故事，當成全社區的共同說法',[],1,true]],refs:[sources.region,sources.arts,byId.commission.url,sources.library],why:'官方展覽介紹、社區敘事與個人口述要保留來源；徵詢同意與不干擾工作是本遊戲的走讀協作準則，不是替任何居民預先發言。'}
 );
 return {sources,places,byId,points,mapIds,edges,missions};
})();if(typeof module!=='undefined')module.exports=KeelungData;
