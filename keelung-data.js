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
 return {sources,places,byId,points,mapIds,edges,missions};
})();if(typeof module!=='undefined')module.exports=KeelungData;
