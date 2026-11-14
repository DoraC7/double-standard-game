(function(root){'use strict';
const topics={skin:'皮膚照護',home:'居家過敏原',help:'何時求助'};
const sources={"skin": ["AAD｜濕疹居家照護", "https://www.aad.org/news/how-to-treat-eczema-at-home"], "home": ["AAAAI｜室內過敏原", "https://www.aaaai.org/tools-for-the-public/conditions-library/allergies/indoor-allergens-ttr"], "help": ["AAAAI｜嚴重過敏反應", "https://www.aaaai.org/tools-for-the-public/conditions-library/allergies/anaphylaxis"]};
const questions=[
 {
  "id": "bath",
  "topic": "skin",
  "title": "洗澡不是耐熱比賽",
  "prompt": "已確診異位性皮膚炎，今天皮膚乾癢。洗澡怎麼安排？",
  "options": [
   "溫水短洗約 5–10 分鐘，輕柔清潔",
   "用燙水泡久一點，把癢壓過去",
   "用力搓洗到皮膚發紅"
  ],
  "answer": 0,
  "why": "溫水短洗比較不刺激；不要用燙水或摩擦追求「洗乾淨」。這是異位性皮膚炎照護，不代表所有癢都靠洗澡處理。",
  "source": "skin"
 },
 {
  "id": "moist",
  "topic": "skin",
  "title": "水分要留住，不是等它蒸發",
  "prompt": "短時間溫水洗澡後，異位性皮膚炎的皮膚還微濕，下一步？",
  "options": [
   "輕拍後趁微濕擦無香料乳霜或軟膏",
   "等到皮膚完全乾裂再補擦",
   "用香水蓋住乳霜的味道"
  ],
  "answer": 0,
  "why": "洗澡後趁皮膚微濕保濕，乾燥時也可補擦。乳霜或軟膏通常比乳液更能保濕；有處方藥時，使用方式依醫囑。",
  "source": "skin"
 },
 {
  "id": "label",
  "topic": "skin",
  "title": "沒有味道，不等於沒有香料",
  "prompt": "替容易因產品刺激而發作的濕疹皮膚選保濕品，優先看哪個標示？",
  "options": [
   "無香料（fragrance-free），仍需留意個別反應",
   "無氣味（unscented）就保證沒有香料",
   "天然精油保證不會刺激"
  ],
  "answer": 0,
  "why": "無氣味產品仍可能用香料掩蓋氣味；天然也不保證安全。無香料是選購方向，不是對每個人都適用的保證。",
  "source": "skin"
 },
 {
  "id": "patch",
  "topic": "skin",
  "title": "新乳霜先別全身豪賭",
  "prompt": "新買無香料保濕品，想直接擦滿全身。比較穩妥的做法？",
  "options": [
   "先在手臂內側小範圍試用，觀察反應",
   "只要無香料，就完全不用試",
   "一次混三種，才知道效果好不好"
  ],
  "answer": 0,
  "why": "AAD 建議新保養品先在手臂內側小範圍每天試用 7–10 天；出現刺激就停用並詢問醫師。這不是醫療貼膚測試，也不能用來自行挑戰已知過敏原。",
  "source": "skin"
 },
 {
  "id": "bed",
  "topic": "home",
  "title": "臥室防線，不是只噴香香",
  "prompt": "已確認對塵蟎過敏，準備改善臥室，哪個組合較合理？",
  "options": [
   "防蟎套搭配規律清洗寢具、控制潮濕",
   "只噴香氛就能去除所有過敏原",
   "什麼都不改，只把床搬到另一面牆"
  ],
  "answer": 0,
  "why": "塵蟎喜歡溫暖潮濕的寢具；防蟎套、每週清洗寢具與控制濕度是多管齊下，不保證根治。清洗溫度與烘乾須兼顧洗標及防燙安全。",
  "source": "home"
 },
 {
  "id": "damp",
  "topic": "home",
  "title": "牆角發霉，不是換香味",
  "prompt": "屋內有漏水和霉味，已知黴菌會誘發你的症狀，應先做什麼？",
  "options": [
   "修漏水、處理潮濕與黴菌，保持通風",
   "增加加濕，讓牆壁不要乾裂",
   "用香氛把霉味完全蓋住"
  ],
  "answer": 0,
  "why": "黴菌需要水分。減少潮濕、修漏水並妥善處理黴菌，比遮味更重要；大範圍或無法安全處理時找專業人員。清潔劑不可混用。",
  "source": "home"
 },
 {
  "id": "pet",
  "topic": "home",
  "title": "短毛，不是免過敏通行證",
  "prompt": "對貓狗過敏的人看到「低敏短毛品種」廣告，哪個說法合理？",
  "options": [
   "短毛不保證低敏，過敏原也來自皮屑、唾液等",
   "沒有長毛就不可能過敏",
   "剃毛可以保證根治過敏"
  ],
  "answer": 0,
  "why": "AAAAI 指出沒有保證不致過敏的貓狗品種；過敏原不只在毛。先確認個人誘因，已養寵物可討論減少接觸、避免進臥室等方法，不憑廣告下結論。",
  "source": "home"
 },
 {
  "id": "cause",
  "topic": "home",
  "title": "先找誘因，不是全屋亂禁",
  "prompt": "一年四季常打噴嚏、鼻癢，還沒確認誘因，怎麼開始？",
  "options": [
   "記下症狀與接觸情境，找醫師評估可能誘因",
   "直接認定一定是塵蟎，不用評估",
   "只憑一次鼻癢就把所有食物都禁掉"
  ],
  "answer": 0,
  "why": "鼻部症狀有不同可能原因，不能單靠這段描述確診。醫師可結合病史與必要檢查協助找誘因；皮膚保濕也不是鼻過敏的替代治療。",
  "source": "home"
 },
 {
  "id": "urgent",
  "topic": "help",
  "title": "這次不是日常保養題",
  "prompt": "吃東西後突然喉嚨緊、呼吸困難。現在最重要的是？",
  "options": [
   "立刻打119求救；若有醫師開立的腎上腺素，依緊急計畫立即使用",
   "先擦乳霜，睡一覺看看",
   "只吃抗組織胺，等幾小時再說"
  ],
  "answer": 0,
  "why": "疑似嚴重過敏反應需立即處理，不等自行好轉。腎上腺素是第一線急救藥，抗組織胺不能取代。台灣撥119；不要為了找藥延誤求救。",
  "source": "help"
 },
 {
  "id": "better",
  "topic": "help",
  "title": "好轉了，還要去嗎？",
  "prompt": "疑似嚴重過敏反應，已依計畫使用腎上腺素，症狀開始改善。接著？",
  "options": [
   "仍接受急救與醫院評估，不自行取消求救",
   "既然好轉就不用去醫院",
   "繼續吃同一道食物驗證看看"
  ],
  "answer": 0,
  "why": "嚴重過敏反應可能再次出現，好轉不等於處理完成，仍需醫療觀察。不要自行用再次接觸來驗證。",
  "source": "help"
 },
 {
  "id": "plan",
  "topic": "help",
  "title": "急救計畫，不要只存在腦袋",
  "prompt": "曾有嚴重過敏反應，醫師已開立急救藥，出門前怎麼準備？",
  "options": [
   "帶著未過期急救藥，確認用法，讓同行者知道計畫",
   "把急救藥留家裡，靠朋友記得就好",
   "只記商品顏色，不用知道何時使用"
  ],
  "answer": 0,
  "why": "與醫師確認避免誘因、何時用藥與求救方式；隨身攜帶急救藥並檢查有效期。不同製劑與年齡的指示不同，本課不提供劑量。",
  "source": "help"
 },
 {
  "id": "food",
  "topic": "help",
  "title": "已知食物過敏，不靠試一口",
  "prompt": "已確診某種食物會引發嚴重過敏，聚餐時怎麼做？",
  "options": [
   "確認成分並告知店家過敏情況，無法確認就不冒險",
   "先吃一點測試今天會不會發作",
   "把看得見的過敏食材挑掉就保證安全"
  ],
  "answer": 0,
  "why": "讀懂成分與外食風險是避免再次反應的一部分。挑掉可見食材不能保證沒有殘留或交叉接觸；診斷與飲食限制應依醫療評估，不任意擴大禁食。",
  "source": "help"
 }
];
// Additional distinct scenarios: vary the decision point, not just the wording.
questions.push(
 {id:'skin-cool',topic:'skin',title:'癢的時候先降溫',prompt:'濕疹處在發癢期，想減少抓傷，哪個做法較合適？',options:['短暫冷敷並依照既有照護計畫處理','用冰塊直接長時間壓住皮膚','抓到破皮才擦刺激性消毒液'],answer:0,why:'冷敷可暫時舒緩，但不能取代診斷或處方治療；冰塊直接接觸可能傷皮膚，破皮或感染疑慮應詢問醫療人員。',source:'skin'},
 {id:'skin-nails',topic:'skin',title:'指甲短一點',prompt:'夜間常不自覺抓癢，以下哪項是較安全的輔助方式？',options:['保持指甲平整，並持續原本的保濕與治療計畫','戴緊繃塑膠手套整晚','自行停掉所有處方藥，只靠忍耐'],answer:0,why:'修短指甲可減少抓傷程度，但不治療發炎；藥物調整應與醫療人員討論。',source:'skin'},
 {id:'skin-detergent',topic:'skin',title:'洗衣精不是越香越乾淨',prompt:'衣物接觸處常不舒服，想先減少可能刺激，怎麼做較合理？',options:['試用無香料洗衣產品並觀察個人反應','加倍使用香氛柔軟精','把所有衣物都改用消毒漂白劑'],answer:0,why:'香料或清潔劑可能刺激部分人的皮膚；可簡化產品並觀察，但不能假定它就是病因。',source:'skin'},
 {id:'skin-wool',topic:'skin',title:'粗糙布料會不會刺激',prompt:'穿羊毛衣後覺得刺癢，較合適的處理是？',options:['改穿柔軟、透氣且不磨擦的衣物，觀察是否改善','用力搓皮膚讓它習慣','認定羊毛一定造成所有濕疹'],answer:0,why:'粗糙或悶熱衣物可能加重部分人的不適；個人觸發因素不同，觀察有助避免過度推論。',source:'skin'},
 {id:'skin-sweat',topic:'skin',title:'皮膚與汗水',prompt:'運動流汗後濕疹處開始刺癢，較好的下一步是？',options:['適時沖掉汗水、輕拍乾並保濕','故意留著汗水一整天','用粗毛巾來回用力擦'],answer:0,why:'汗水與摩擦可能刺激部分皮膚；溫和清潔與保濕比用力摩擦合適。持續或嚴重症狀應依照照護計畫求助。',source:'skin'},
 {id:'skin-medicine',topic:'skin',title:'處方藥照指示用',prompt:'外用處方藥擦幾天後改善，接下來怎麼做？',options:['依開藥者指示完成或調整療程，有疑問先詢問','自行加倍塗抹以免復發','把藥分享給症狀相似的家人'],answer:0,why:'藥物種類、部位與使用時間需要個別指示；不要自行加量、停藥或共用處方藥。',source:'skin'},
 {id:'skin-infection',topic:'skin',title:'紅腫滲液要留意',prompt:'皮膚突然更痛、發熱並有滲液，較適合怎麼做？',options:['儘快聯絡醫療人員評估是否感染','只增加保濕並等數週','用剩下的抗生素自行塗抹'],answer:0,why:'疼痛、發熱、滲液或快速惡化可能需要醫療評估；不要自行使用剩藥。',source:'skin'},
 {id:'skin-stress',topic:'skin',title:'壓力與症狀不畫等號',prompt:'考試週濕疹變癢，可以得到什麼結論？',options:['壓力可能是個人誘因之一，但需看實際模式並維持照護','壓力一定是唯一原因','有濕疹代表心理不夠堅強'],answer:0,why:'壓力可能影響部分人的症狀，但一次同時發生不能證明唯一因果，也不代表個人責任。',source:'skin'},
 {id:'skin-sun',topic:'skin',title:'防曬先看耐受性',prompt:'濕疹皮膚要到戶外，哪個做法較穩妥？',options:['選自己能耐受的防曬並配合遮蔭、衣物等防護','為求天然只用未標示成分的精油','先在大範圍試新產品'],answer:0,why:'產品耐受性因人而異；新產品可先小範圍依標示測試，並用衣物與遮蔭降低曝曬。',source:'skin'},
 {id:'skin-bath-oil',topic:'skin',title:'泡澡油不是治療替代品',prompt:'有人推薦在洗澡水加香氛精油治濕疹，怎麼判斷？',options:['不把精油當已證實治療，並留意刺激或過敏反應','天然精油對所有濕疹都有效','用精油取代醫囑藥物'],answer:0,why:'天然不等於不刺激或有效；治療應依個人醫療建議，避免未確認成分造成額外反應。',source:'skin'},
 {id:'skin-check',topic:'skin',title:'照護計畫何時要回診',prompt:'依照照護計畫處理仍持續惡化或影響睡眠，接下來？',options:['安排醫療評估並帶上使用產品與症狀紀錄','不論多嚴重都只等自然好','同時開始多種新藥與保養品'],answer:0,why:'持續、嚴重或影響生活的症狀值得專業評估；一次改很多項也會讓觸發因素更難判斷。',source:'skin'},
 {id:'home-dust',topic:'home',title:'防塵套能做到什麼',prompt:'已知對塵蟎過敏，床墊與枕頭使用防蟎套的合理期待是？',options:['作為減少暴露的一環，不保證單獨消除症狀','保證房間完全沒有塵蟎','可以取代所有醫療治療'],answer:0,why:'防護套可能降低塵蟎暴露，但通常是多項控制措施之一，效果與個人症狀仍需觀察。',source:'home'},
 {id:'home-humidity',topic:'home',title:'濕度不是越高越好',prompt:'想減少塵蟎滋生，室內濕度該怎麼處理？',options:['避免室內長期潮濕，依環境使用除濕與通風','整天加濕到牆壁結露','只噴香氛掩蓋霉味'],answer:0,why:'塵蟎偏好潮濕環境；控制濕度有助減少暴露，但需依居住環境維持適當通風。',source:'home'},
 {id:'home-mold',topic:'home',title:'霉味不是香味問題',prompt:'浴室牆面持續發霉，家人對霉菌敏感，優先處理什麼？',options:['修復漏水或潮濕來源並安全清除霉斑','用香氛噴霧蓋住氣味','乾刷霉斑讓孢子散開'],answer:0,why:'持續潮濕是霉菌問題的來源之一；處理時要避免把孢子揚散，大面積或反覆發霉應找合適專業協助。',source:'home'},
 {id:'home-pet',topic:'home',title:'寵物過敏原不只在毛上',prompt:'對貓過敏者短暫離開房間後覺得好些，能推論什麼？',options:['可能減少接觸，但過敏原也會留在衣物與家具','只要把貓毛剃掉就不會過敏','有改善就證明過敏已治癒'],answer:0,why:'動物過敏原可在皮屑、唾液等並附著環境；症狀改善不等於過敏消失。',source:'home'},
 {id:'home-pollen',topic:'home',title:'花粉季進屋前',prompt:'花粉季戶外活動後症狀加重，哪個做法可減少帶入室內的花粉？',options:['進屋後更換衣物並洗臉或淋浴','把戶外衣物放床上晾乾','開窗讓花粉循環整晚'],answer:0,why:'花粉可能附著在衣物與頭髮；減少帶入室內可降低暴露，但不能保證完全避免症狀。',source:'home'},
 {id:'home-filter',topic:'home',title:'空氣清淨機的界線',prompt:'空氣清淨機開著後仍打噴嚏，合理理解是？',options:['它可能降低部分空氣微粒，但不能去除所有過敏原或替代治療','有清淨機就不可能有過敏原','立刻把濾網拆掉當風扇用'],answer:0,why:'過敏原也可能在床品、地毯與表面；設備能力有限，需搭配適合的暴露控制措施。',source:'home'},
 {id:'home-cockroach',topic:'home',title:'蟑螂過敏原從源頭處理',prompt:'住家有蟑螂且家人對其過敏，較完整的策略是？',options:['妥善封存食物、清除水源與縫隙並用安全方式防治','只噴香水','讓食物留在桌面吸引牠們出來'],answer:0,why:'減少食物、水源與藏身處可降低害蟲問題；防治產品須依標示，避免不當暴露。',source:'home'},
 {id:'home-smoke',topic:'home',title:'煙霧會刺激呼吸道',prompt:'過敏性鼻炎者聞到室內菸霧後不舒服，怎麼做？',options:['離開煙霧並避免室內吸菸','用香氛蠟燭混合味道','因為不是過敏原就留在原地'],answer:0,why:'煙霧可刺激呼吸道，即使它不是特定過敏原也值得避開。',source:'home'},
 {id:'home-clean',topic:'home',title:'清掃時別揚起灰塵',prompt:'整理容易積灰的房間後鼻子不舒服，較好的調整是？',options:['減少揚塵，使用濕擦並在需要時做好防護','用乾刷快速把灰塵掃向空中','清掃時讓過敏者待在旁邊'],answer:0,why:'乾掃可能使灰塵揚起；濕擦與避免在場暴露可減少刺激。',source:'home'},
 {id:'home-leak',topic:'home',title:'漏水要修，不只除味',prompt:'衣櫃背板反覆出現霉斑，最先要查什麼？',options:['漏水、結露或通風等潮濕來源','換更濃的除臭劑','把發霉衣物移到另一個潮濕角落'],answer:0,why:'霉斑反覆出現常需處理水分來源；只除味不會解決潮濕問題。',source:'home'},
 {id:'home-bedding',topic:'home',title:'床單清洗依標示',prompt:'對塵蟎敏感，清洗寢具時如何做較合適？',options:['定期清洗並依布料標示選擇可耐受的水溫','不看材質一律用最高溫','永遠不清洗，只噴香氛'],answer:0,why:'定期清潔有助減少過敏原；洗滌方式要兼顧布料標示與可行性。',source:'home'},
 {id:'help-symptoms',topic:'help',title:'症狀快速惡化要評估',prompt:'已知嚴重過敏者接觸誘因後出現呼吸困難或昏厥，應怎麼做？',options:['立即使用醫囑備妥的腎上腺素並呼叫119','先等抗組織胺慢慢生效','讓患者獨自休息觀察'],answer:0,why:'呼吸困難、昏厥等可能是嚴重過敏反應；依個人緊急計畫立即使用腎上腺素並呼叫119，抗組織胺不能取代腎上腺素。',source:'help'},
 {id:'help-autoinjector',topic:'help',title:'自動注射器要隨身',prompt:'醫師已開立腎上腺素自動注射器，出門時怎麼安排？',options:['依醫囑隨身攜帶並確認有效期限與使用方式','放在家裡以免弄丟','症狀出現才第一次讀說明'],answer:0,why:'緊急藥物需在需要時能取得；依醫療指示熟悉裝置並定期檢查效期。',source:'help'},
 {id:'help-second',topic:'help',title:'症狀好轉仍要就醫',prompt:'嚴重過敏反應使用腎上腺素後稍微好轉，應怎麼做？',options:['仍立即呼叫緊急服務或就醫評估','取消求助，因為已經好轉','自行開車長途回家觀察'],answer:0,why:'症狀可能復發，腎上腺素後仍需緊急醫療評估；不要因短暫改善取消求助。',source:'help'},
 {id:'help-school',topic:'help',title:'照護計畫要讓照顧者知道',prompt:'孩子有嚴重食物過敏，準備去校外教學，事前要做什麼？',options:['與學校及照顧者確認誘因、緊急計畫與藥物可取得性','只告訴孩子自己小心','把過敏藥交給不知情的同學'],answer:0,why:'照顧者需知道如何避免誘因及遇到反應時採取的步驟；安排依醫療計畫與校方規範進行。',source:'help'},
 {id:'help-label',topic:'help',title:'過敏原標示要核對',prompt:'有嚴重食物過敏，包裝換了新版本但商品名稱相同，怎麼做？',options:['每次重新閱讀成分與過敏原標示，有疑問先確認','只看商品名稱就認定配方沒變','把包裝丟掉，憑記憶食用'],answer:0,why:'配方與製程資訊可能改變；每次核對標示比依舊包裝或記憶安全。',source:'help'},
 {id:'help-cross',topic:'help',title:'共用器具也要問清楚',prompt:'餐廳確認一道菜沒有某食材，但共用鍋具情況不清楚，怎麼辦？',options:['詢問交叉接觸處理方式，無法確認就選擇不冒險','只把食材挑掉就吃','相信菜名足以保證零風險'],answer:0,why:'共用器具可能造成交叉接觸；是否適合食用需依個人過敏風險與可確認資訊判斷。',source:'help'},
 {id:'help-mild',topic:'help',title:'不要把每種疹子都當同一種過敏',prompt:'第一次出現皮疹，沒有已知誘因，應如何判斷？',options:['記錄症狀與可能暴露，依嚴重程度諮詢醫療人員','自行永久禁掉所有常見食物','直接使用別人的急救處方'],answer:0,why:'皮疹原因很多，不能只憑外觀自行診斷過敏；呼吸或循環症狀需立即緊急求助。',source:'help'},
 {id:'help-plan',topic:'help',title:'過敏行動計畫要更新',prompt:'過敏診斷或處方藥最近有變動，舊緊急計畫該怎麼辦？',options:['請醫療團隊更新計畫並同步給相關照顧者','繼續照舊計畫不必核對','把新舊藥混在同一袋不標示'],answer:0,why:'計畫應反映目前診斷、藥物與求助步驟；版本變更要讓照顧者取得一致資訊。',source:'help'},
 {id:'help-skin-test',topic:'help',title:'檢測由專業人員判讀',prompt:'想確認是否食物過敏，網路自測結果陽性，接下來？',options:['帶結果與症狀史找合格醫療人員評估','只憑自測永久避免一長串食物','故意大量吃一次驗證'],answer:0,why:'檢測需配合病史與專業判讀；單一結果不等於臨床過敏診斷，勿自行挑戰可能誘發嚴重反應的食物。',source:'help'},
 {id:'help-emergency',topic:'help',title:'急救電話提供位置',prompt:'呼叫119處理疑似嚴重過敏反應時，通話中優先提供什麼？',options:['確切地址、症狀與已採取的急救措施','只說患者平常很健康','掛斷後再決定地點'],answer:0,why:'清楚位置與狀況能幫助派遣；依接線人員指示並留在患者旁。',source:'help'}
 ,{id:'help-biphasic',topic:'help',title:'症狀可能再次出現',prompt:'嚴重過敏反應暫時改善後，還需要做什麼？',options:['依緊急計畫接受醫療評估並觀察後續症狀','認定不會復發就獨自離開','自行停用之後所有處方藥'],answer:0,why:'嚴重反應可能再次發生；使用腎上腺素後仍需緊急醫療評估，依醫療人員指示觀察。',source:'help'}
);
function shuffled(items){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function queue(mode='short'){if(mode==='all')return shuffled(questions);if(mode==='short'){const keys=shuffled(Object.keys(topics));return shuffled(keys.flatMap((t,i)=>shuffled(questions.filter(q=>q.topic===t)).slice(0,3+(i===0?1:0))));}if(Object.hasOwn(topics,mode))return shuffled(questions.filter(q=>q.topic===mode));throw new Error('未知課程');}
function create(mode){return {items:queue(mode),index:0,answers:[],attempts:[]};}
function submit(s,choice){const q=s.items[s.index];if(!q||s.answers.length>s.index)return null;if(choice!==null&&(!Number.isInteger(choice)||choice<0||choice>=q.options.length))return null;const a={id:q.id,choice,ok:choice===q.answer};s.answers.push(a);return a;}
function retry(s,choice){const q=s.items[s.index];if(!q||s.answers.length<=s.index||!Number.isInteger(choice)||choice<0||choice>=q.options.length)return null;const a={id:q.id,choice,ok:choice===q.answer};s.attempts.push(a);return a;}
function next(s){if(s.answers.length<=s.index||s.index>=s.items.length)return false;s.index++;return true;}
const api={topics,sources,questions,shuffled,queue,create,submit,retry,next};if(typeof module!=='undefined')module.exports=api;else root.AllergySchool=api;
})(typeof globalThis!=='undefined'?globalThis:this);
