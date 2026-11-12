(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.DailyLaw=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{'use strict';
const topics={"consumer": "消費與退貨", "labor": "工作與休假", "rental": "租屋與租借", "civil": "契約與賠償", "privacy": "個資與行銷", "copyright": "網路與著作權", "marriage": "婚姻與家事", "property": "夫妻財產與繼承", "accident": "意外與賠償", "injury": "傷害與告訴"};
const sources={"consumer": ["消費者保護法 §19", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0170001&flno=19"], "records": ["勞動基準法 §30", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=30"], "wage": ["勞動基準法 §26", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=26"], "break": ["勞動基準法 §35", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=35"], "leave": ["勞動基準法 §38", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=38"], "repair": ["民法 §429", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=429"], "notice": ["民法 §430", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=430"], "care": ["民法 §432", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=432"], "end": ["民法 §450", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=450"], "agreement": ["民法 §153", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=153"], "benefit": ["民法 §179", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=179"], "damage": ["民法 §184", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=184"], "collect": ["個人資料保護法 §19", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0050021&flno=19"], "use": ["個人資料保護法 §20", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0050021&flno=20"], "rights": ["個人資料保護法 §3", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0050021&flno=3"], "fair": ["著作權法 §65", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070017&flno=65"], "copy": ["著作權法 §22", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070017&flno=22"], "public": ["著作權法 §26-1", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070017&flno=26-1"], "license": ["著作權法 §37", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0070017&flno=37"], "marry": ["民法 §982", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=982"], "divorce": ["民法 §1050", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1050"], "familycost": ["民法 §1003-1", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1003-1"], "child": ["民法 §1055-1", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1055-1"], "ownership": ["民法 §1017", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1017"], "residual": ["民法 §1030-1", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1030-1"], "inherit": ["民法 §1148", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1148"], "renounce": ["民法 §1174", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1174"], "injurycost": ["民法 §193", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=193"], "objectcost": ["民法 §196", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=196"], "fault": ["民法 §217", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=217"], "hurt": ["刑法 §277", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=277"], "negligent": ["刑法 §284", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=284"], "complaint": ["刑法 §287", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=287"], "deadline": ["刑事訴訟法 §237", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=237"], "withdraw": ["刑事訴訟法 §238", "https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=238"]};
const questions=[
  {
    "id": "consumer-1",
    "topic": "consumer",
    "title": "網購不等於只能認賠",
    "display": "訂單：向企業網購一般背包，收貨第3天；無法定合理例外情事。",
    "prompt": "賣家已依法提供解除資訊。單純改變心意，原則上可怎麼做？",
    "options": [
      "七日內退回商品或書面通知解除，不必說明理由",
      "沒瑕疵就絕不能解除",
      "一定要店家先同意才有權解除"
    ],
    "answer": 0,
    "why": "本題符合通訊交易且排除合理例外。消保法§19原則允許收受後七日內退回或書面通知解除，無須理由與費用。不是所有網購都適用，也不是無限制試用期。",
    "source": "consumer",
    "icon": "01"
  },
  {
    "id": "consumer-2",
    "topic": "consumer",
    "title": "實體店也有七天？",
    "display": "小票：在實體店試穿並買下衣服，沒有瑕疵，也沒有店家另給退貨承諾。",
    "prompt": "只是回家不喜歡顏色，可直接主張消保法§19七日解除嗎？",
    "options": [
      "不能只因不喜歡就套用該條；它針對通訊或訪問交易",
      "所有購物一律七日退貨",
      "刷卡就一定算通訊交易"
    ],
    "answer": 0,
    "why": "§19的適用範圍是通訊交易、訪問交易，不是所有買賣。實體購物另看店家約定；有瑕疵時的權利是另一問題，本題已排除。",
    "source": "consumer",
    "icon": "02"
  },
  {
    "id": "consumer-3",
    "topic": "consumer",
    "title": "期限內發出，不是等客服回覆",
    "display": "紀錄：符合§19的網購，解除資訊已提供，在法定七日期間內發出明確解除的書面通知。",
    "prompt": "店家第十天才回覆。哪個觀念正確？",
    "options": [
      "期間內發出書面，依法視為解除，不以客服回覆日為準",
      "必須客服第七天前讀取才有效",
      "店家可以一直不讀讓期限消失"
    ],
    "answer": 0,
    "why": "§19規定，期間內已交運商品或發出書面，契約視為解除。實務應保留發送內容與時間等證據；不要把本題當作所有期限都採發信日的規則。",
    "source": "consumer",
    "icon": "03"
  },
  {
    "id": "consumer-4",
    "topic": "consumer",
    "title": "退貨權不能被一行字消滅",
    "display": "商品頁：一般企業網購、沒有合理例外情事。頁面寫「本店所有商品一律不得依消保法退貨」。",
    "prompt": "這句話能直接排除本題的法定解除權嗎？",
    "options": [
      "不能，違反§19的約定無效",
      "買家看過就一律有效",
      "企業字體夠大就能排除法律"
    ],
    "answer": 0,
    "why": "在本題符合§19且無合理例外前提下，企業不能靠店規排除法定權利。客製化等是否有合理例外須另依法判斷，不能由一句所有商品不退貨取代。",
    "source": "consumer",
    "icon": "04"
  },
  {
    "id": "labor-1",
    "topic": "labor",
    "title": "打卡紀錄不只是公司的",
    "display": "申請單：受勞基法保障的勞工，向雇主申請自己的出勤紀錄影本。",
    "prompt": "雇主說內部資料一概不給，正確觀念？",
    "options": [
      "雇主不得拒絕勞工申請自己的出勤紀錄副本或影本",
      "出勤紀錄永遠只能雇主看",
      "只有離職後才可申請"
    ],
    "answer": 0,
    "why": "勞基法§30要求雇主保存出勤紀錄五年，記載至分鐘，勞工申請副本或影本不得拒絕。這是自己的紀錄，不是任意索取同事資料。",
    "source": "records",
    "icon": "05"
  },
  {
    "id": "labor-2",
    "topic": "labor",
    "title": "先扣薪當保證金？",
    "display": "薪資通知：公司說怕員工未來弄壞設備，每月先扣一筆薪水作賠償準備金。",
    "prompt": "雇主可以這樣預扣嗎？",
    "options": [
      "不得預扣工資作違約金或賠償費用",
      "只要叫準備金就可以",
      "公司覺得有風險就能任意預扣"
    ],
    "answer": 0,
    "why": "§26禁止預扣工資作違約金或賠償費用。若真的發生損害，責任與求償須另行確認，不代表勞工永遠不必賠，也不代表可先扣。",
    "source": "wage",
    "icon": "06"
  },
  {
    "id": "labor-3",
    "topic": "labor",
    "title": "休息不是只有喝口水",
    "display": "班表：適用勞基法的一般工作，沒有輪班、連續性或緊急性調配例外，連續工作四小時。",
    "prompt": "依法至少應有多久休息？",
    "options": [
      "三十分鐘",
      "五分鐘",
      "一定工作八小時後才可休息"
    ],
    "answer": 0,
    "why": "§35原則是繼續工作四小時至少休息三十分鐘；輪班或工作有連續性、緊急性者可另行調配，本題已排除。",
    "source": "break",
    "icon": "07"
  },
  {
    "id": "labor-4",
    "topic": "labor",
    "title": "特休誰排？",
    "display": "對話：勞工已有特休資格，主管說「日期全部由我單方面指定」。",
    "prompt": "哪個說法符合§38？",
    "options": [
      "原則由勞工排定，急迫經營需求等可協商調整",
      "特休一律由雇主指定",
      "排了日期任何情況都不能協商"
    ],
    "answer": 0,
    "why": "特休期日由勞工排定。雇主基於急迫經營需求或勞工因個人因素，可與他方協商調整，不是任一方永遠不能討論。",
    "source": "leave",
    "icon": "08"
  },
  {
    "id": "rental-1",
    "topic": "rental",
    "title": "修繕先確認誰負擔",
    "display": "租約卡：設備需修繕；本題沒有另訂修繕負擔，也沒有其他習慣或特別規定。",
    "prompt": "依民法租賃的一般原則，修繕由誰負擔？",
    "options": [
      "出租人",
      "不論原因都由承租人",
      "誰先發現就由誰付"
    ],
    "answer": 0,
    "why": "§429原則由出租人負擔，但有契約或習慣例外。住宅租賃另可能有強制規範，不能把本題解成所有租約都能任意轉嫁。",
    "source": "repair",
    "icon": "09"
  },
  {
    "id": "rental-2",
    "topic": "rental",
    "title": "漏水不等於立刻停付全部租金",
    "display": "文件卡：租賃存續中，修繕依法應由出租人負擔。承租人尚未催告，想逕自停付所有租金。",
    "prompt": "若依§430處理，哪個流程較符合條件？",
    "options": [
      "定相當期限催告，逾期不修再依法選擇救濟",
      "完全不通知就永久免租",
      "自己任意裝修後所有費用都可扣"
    ],
    "answer": 0,
    "why": "§430以必要修繕應出租人負擔、定相當期限催告仍不修為條件，才有終止或自行修繕請償還費用、於租金扣除等救濟。不是一漏水就任意拒付全部租金。",
    "source": "notice",
    "icon": "10"
  },
  {
    "id": "rental-3",
    "topic": "rental",
    "title": "正常使用的痕跡",
    "display": "點交卡：雙方確認地板變化只是依約正常使用所致，沒有違反善良管理人注意義務。",
    "prompt": "可否只因地板不像全新，就認定承租人依§432必須賠？",
    "options": [
      "不能僅憑不像全新就認定，正常約定使用有例外",
      "只要有任何痕跡就一定賠全新價",
      "租客任何損害都絕不用賠"
    ],
    "answer": 0,
    "why": "§432要求善良管理人注意；違反義務致損壞可能賠償，但依約或物之性質使用造成的變更、毀損有例外。是否屬正常使用仍要看證據。",
    "source": "care",
    "icon": "11"
  },
  {
    "id": "rental-4",
    "topic": "rental",
    "title": "租借期限不是裝飾",
    "display": "租借卡：租腳踏車至週日18點，期限已到、沒有續租或其他延續租賃的情況。",
    "prompt": "依一般定期租賃原則，期限屆滿如何？",
    "options": [
      "租賃關係於期限屆滿消滅，應處理返還",
      "一定自動免費延長一年",
      "不再看手機就不算到期"
    ],
    "answer": 0,
    "why": "§450規定定有期限租賃於期限屆滿消滅。本題排除續租等情形；實際返還義務與是否另有續租要看事實，不把腳踏車情境直接套用所有住宅租賃爭議。",
    "source": "end",
    "icon": "12"
  },
  {
    "id": "civil-1",
    "topic": "civil",
    "title": "沒簽紙本就沒契約？",
    "display": "對話卡：雙方口頭談妥一般二手桌買賣的物品與價金，無須特定形式，沒有其他成立障礙。",
    "prompt": "未簽紙本，是否因此一定沒有契約？",
    "options": [
      "不是；必要意思表示一致，原則可成立",
      "任何契約一定要紙本簽名",
      "一定要先付清才可能成立"
    ],
    "answer": 0,
    "why": "民法§153重點是意思表示一致，明示或默示皆可能。法律要求特定形式的契約另論；契約成立與日後能否證明內容是不同問題。",
    "source": "agreement",
    "icon": "13"
  },
  {
    "id": "civil-2",
    "topic": "civil",
    "title": "聊天還在談，不急著蓋章",
    "display": "對話卡：賣家說桌子3000元，買家只回「2000才買」，對價金尚未合意。",
    "prompt": "能只憑這兩句認定已按3000元成交嗎？",
    "options": [
      "不能，必要的價金尚未一致",
      "買家回話就一定接受原價",
      "賣家單方面宣布就必成交"
    ],
    "answer": 0,
    "why": "§153要求意思一致。本題對價金仍在磋商，不能把還價當原價承諾；完整對話與後續行為可能影響實際判斷。",
    "source": "agreement",
    "icon": "14"
  },
  {
    "id": "civil-3",
    "topic": "civil",
    "title": "誤匯入帳不是抽獎",
    "display": "銀行確認：陌生款項是誤匯，你沒有任何收受此利益的法律原因。",
    "prompt": "對款項的基本法律觀念？",
    "options": [
      "原則有返還不當得利義務，應透過銀行核實處理",
      "進帳就永遠屬於我",
      "先花掉就一定不用返還"
    ],
    "answer": 0,
    "why": "§179對無法律上原因受利益、致他人受損害者原則要求返還。實務安全做法是聯絡銀行核實，不照陌生人指示轉到另一帳戶；後者是防詐建議，不是法條原文。",
    "source": "benefit",
    "icon": "15"
  },
  {
    "id": "civil-4",
    "topic": "civil",
    "title": "不是故意，仍可能要賠",
    "display": "情境卡：你因疏忽碰壞別人的手機；有過失、不法侵害所有權、損害與因果關係均已確認。",
    "prompt": "單說不是故意，就當然不用賠嗎？",
    "options": [
      "不能，過失也可能構成侵權賠償",
      "只有故意才會有民事責任",
      "道歉後所有責任一定消失"
    ],
    "answer": 0,
    "why": "§184包含故意或過失不法侵害他人權利的責任。本題必要事實已確認；實際金額、與有過失等仍須另看證據，不代表任何意外都自動全賠。",
    "source": "damage",
    "icon": "16"
  },
  {
    "id": "privacy-1",
    "topic": "privacy",
    "title": "不是所有蒐集都只看同意書",
    "display": "資料卡：一般公司蒐集普通個資，不是§6特種資料；公司有特定目的。",
    "prompt": "個資法§19的合法依據，只有本人同意一種嗎？",
    "options": [
      "不只同意，法律明文、符合條件的契約關係等也可能",
      "只有簽同意書一條路",
      "有特定目的就不用其他法定條件"
    ],
    "answer": 0,
    "why": "§19要求特定目的並符合列舉條件之一，同意只是其中一種；有契約關係時另要求適當安全措施。不是有目的就能無限蒐集。",
    "source": "collect",
    "icon": "17"
  },
  {
    "id": "privacy-2",
    "topic": "privacy",
    "title": "配送電話，不等於任意轉賣",
    "display": "資料卡：公司原為配送蒐集電話，現在想另作目的外利用；沒有取得新同意，也未確認任何法定例外。",
    "prompt": "應先做什麼判斷？",
    "options": [
      "核對是否在原目的必要範圍，或另有法定例外依據",
      "只要資料在公司就可任意轉賣",
      "電話不是個資所以不用管"
    ],
    "answer": 0,
    "why": "§20原則限制在蒐集目的必要範圍，目的外利用須符合法定例外。原始蒐集合法不等於後續用途全部合法；本題不是對某家公司真實行為的判決。",
    "source": "use",
    "icon": "18"
  },
  {
    "id": "privacy-3",
    "topic": "privacy",
    "title": "拒收行銷，不是繼續轟炸",
    "display": "通知卡：企業利用你的個資行銷，你已明確表示拒絕接受該行銷。",
    "prompt": "依§20，企業應如何？",
    "options": [
      "立即停止利用你的個資行銷",
      "等你拒絕十次才停",
      "只要曾買過就永遠不能拒絕"
    ],
    "answer": 0,
    "why": "當事人表示拒絕接受行銷時，應即停止利用其個資行銷。這不等於企業連依法必要的交易、帳務資料都必須立刻刪除。",
    "source": "use",
    "icon": "19"
  },
  {
    "id": "privacy-4",
    "topic": "privacy",
    "title": "加入會員就放棄所有個資權？",
    "display": "會員條款卡：「永久放棄依個資法查詢、閱覽與更正等權利」。",
    "prompt": "這種預先放棄可否限制§3所列權利？",
    "options": [
      "不得預先拋棄或以特約限制這些法定權利",
      "勾選過就能永久排除",
      "會員條款永遠優先於法律"
    ],
    "answer": 0,
    "why": "§3列有查詢、閱覽、複製、更正、停止蒐集處理利用、刪除等依法行使的權利，不得預先拋棄或以特約限制。各項請求仍有法定條件，不代表一請求就無條件全刪。",
    "source": "rights",
    "icon": "20"
  },
  {
    "id": "copyright-1",
    "topic": "copyright",
    "title": "註明作者不等於拿到授權",
    "display": "素材卡：有著作權的他人照片，沒有取得授權，也不適用任何法定例外。你想重製整張做海報。",
    "prompt": "只標作者名字就足夠嗎？",
    "options": [
      "不夠；署名不能取代必要的授權",
      "寫來源就一律可複製",
      "照片出現在網路就沒著作權"
    ],
    "answer": 0,
    "why": "§22原則由著作人專有重製權，法律另有例外。題目已排除例外；出處標示與利用授權是不同問題。",
    "source": "copy",
    "icon": "21"
  },
  {
    "id": "copyright-2",
    "topic": "copyright",
    "title": "沒收錢，就一定合理使用？",
    "display": "貼文卡：想大量轉載他人作品到免費社團。",
    "prompt": "判斷合理使用時，能只憑沒有營利就確定合法嗎？",
    "options": [
      "不能，須綜合目的、著作性質、利用質量比例及市場影響",
      "免費就全部合法",
      "貼不到一半永遠合法"
    ],
    "answer": 0,
    "why": "§65列有四項重要因素並要求審酌一切情狀，不是單看營利與否，也沒有所有作品共用的固定百分比安全線。不能只憑這段情境替個案下最後結論。",
    "source": "fair",
    "icon": "22"
  },
  {
    "id": "copyright-3",
    "topic": "copyright",
    "title": "公開上傳，不只是留一份",
    "display": "上傳卡：未獲授權、無法定例外，把受保護影片上傳公開頁面，讓不特定人線上觀看。",
    "prompt": "涉及哪一項需要注意的權利？",
    "options": [
      "公開傳輸權，並可能另涉重製等權利",
      "檔案不賣錢就不涉及權利",
      "只要自己看過就能公開上傳"
    ],
    "answer": 0,
    "why": "§26-1原則由著作人專有公開傳輸權。把作品放到公眾可線上觀看的頁面，不等於僅自己留存；本題排除授權與例外。",
    "source": "public",
    "icon": "23"
  },
  {
    "id": "copyright-4",
    "topic": "copyright",
    "title": "授權範圍要看清楚",
    "display": "授權卡：作者只授權你在一份紙本活動手冊印照片，沒有授權網路發布；本題無法定例外。",
    "prompt": "可否直接把照片另放到公開網站？",
    "options": [
      "先另取得網路利用授權，不把紙本授權自動擴張",
      "拿過一次授權就永遠全用途可用",
      "手冊沒賣錢所以網站也自動可用"
    ],
    "answer": 0,
    "why": "§37規定授權地域、時間、內容、利用方法等依約定；約定不明部分推定未授權。本題授權已限紙本，網站公開利用不能直接視為包含在內。",
    "source": "license",
    "icon": "24"
  },
  {
    "id": "marriage-1",
    "topic": "marriage",
    "title": "宴客不等於完成結婚",
    "display": "情境卡：雙方剛辦婚宴；要依現行民法成立一般婚姻，尚未辦結婚登記。",
    "prompt": "依§982，應完成哪組形式？",
    "options": [
      "書面、二人以上證人簽名，雙方向戶政辦結婚登記",
      "只要宴請親友就完成",
      "只要其中一方口頭宣布即可"
    ],
    "answer": 0,
    "why": "民法§982要求書面、二人以上證人簽名及雙方結婚登記。不是只要宴客或同居就完成；其他結婚要件與特殊情況仍須另確認。",
    "source": "marry",
    "icon": "25"
  },
  {
    "id": "marriage-2",
    "topic": "marriage",
    "title": "兩願離婚，不只傳訊息",
    "display": "對話卡：夫妻私下同意離婚，沒有法院程序，只互傳訊息說分開。",
    "prompt": "要依法完成兩願離婚，應注意什麼？",
    "options": [
      "書面、二人以上證人簽名及戶政離婚登記",
      "雙方說好就一定已完成離婚",
      "分居一天自動離婚"
    ],
    "answer": 0,
    "why": "§1050的兩願離婚有書面、證人與登記形式。法院裁判、調解等是不同程序，本題不是判定某份實際協議的效力。",
    "source": "divorce",
    "icon": "26"
  },
  {
    "id": "marriage-3",
    "topic": "marriage",
    "title": "家務也算家庭付出",
    "display": "家庭卡：一方有薪工作，另一方做大量家事與照顧；沒有其他費用分擔約定或特別規定。",
    "prompt": "家庭生活費用的分擔，法律只看薪水數字嗎？",
    "options": [
      "不只薪水，依經濟能力、家事勞動及其他情事分擔",
      "沒領薪水者等於完全沒有貢獻",
      "一律每人現金付相同金額"
    ],
    "answer": 0,
    "why": "§1003-1明列經濟能力、家事勞動或其他情事。不是家務一律折成固定時薪，也不是法律一律要求現金各半。",
    "source": "familycost",
    "icon": "27"
  },
  {
    "id": "marriage-4",
    "topic": "marriage",
    "title": "孩子的安排，不是比誰賺多",
    "display": "家事卡：父母對未成年子女權利義務的安排有爭議，由法院裁判。",
    "prompt": "法院應以什麼為核心，而非只看父母單一收入？",
    "options": [
      "子女最佳利益，綜合意願、照顧與生活等情狀",
      "一定交給收入較高者",
      "一定依父母性別自動決定"
    ],
    "answer": 0,
    "why": "§1055-1要求子女最佳利益並綜合審酌，經濟能力只是因素之一，不是單一勝負規則；實際個案仍須調查事實。",
    "source": "child",
    "icon": "28"
  },
  {
    "id": "property-1",
    "topic": "property",
    "title": "結婚，不是財產自動全共有",
    "display": "財產卡：夫妻採法定財產制，某項婚後財產能明確證明由妻所有。",
    "prompt": "能只因結婚就說丈夫已自動取得一半所有權嗎？",
    "options": [
      "不能，婚前婚後財產原則各自所有",
      "可以，婚後所有東西都自動共有一半",
      "只要同住一年就全部共有"
    ],
    "answer": 0,
    "why": "§1017在法定財產制下原則各自所有。不能證明夫或妻所有時有共有推定；法定財產制消滅時的剩餘財產差額請求是另一問題。",
    "source": "ownership",
    "icon": "29"
  },
  {
    "id": "property-2",
    "topic": "property",
    "title": "差額分配，不是所有東西切半",
    "display": "財產卡：法定財產制關係消滅，計算剩餘財產差額分配。財產清單含繼承取得的財產。",
    "prompt": "哪個觀念較正確？",
    "options": [
      "依法核算婚後剩餘財產差額，繼承等法定排除項目另看",
      "全部婚前婚後財產不分來源直接各半",
      "房屋登記一方名下就永遠不需計算任何差額"
    ],
    "answer": 0,
    "why": "§1030-1原則看現存婚後財產扣除婚姻存續所負債務後之差額；繼承或其他無償取得財產、慰撫金排除。法院另可能調整或免除，不能把本題當完整個案計算公式。",
    "source": "residual",
    "icon": "30"
  },
  {
    "id": "property-3",
    "topic": "property",
    "title": "繼承債務，不當然無限背",
    "display": "遺產卡：繼承人承受遺產與債務；本題沒有隱匿遺產等喪失利益的特殊情形。",
    "prompt": "依§1148，債務清償責任的基本範圍？",
    "options": [
      "原則以因繼承所得遺產為限",
      "不論遺產多少都要用自己全部財產無限清償",
      "只有資產會繼承，債務一律消失"
    ],
    "answer": 0,
    "why": "§1148規定以因繼承所得遺產為限負清償責任。仍應查明財產、債務及法定程序，不能理解成可隨意處分遺產而完全無風險。",
    "source": "inherit",
    "icon": "31"
  },
  {
    "id": "property-4",
    "topic": "property",
    "title": "拋棄繼承，不是群組說不要",
    "display": "文件卡：繼承人知悉自己得繼承，決定拋棄；目前尚在法定期間內。",
    "prompt": "應依哪個法定方式與期限辦理？",
    "options": [
      "知悉得繼承起三個月內，以書面向法院為之",
      "在親友群組說不要就完成",
      "任何時候向銀行口頭說明即可"
    ],
    "answer": 0,
    "why": "§1174要求知悉得繼承起三個月內書面向法院；拋棄後原則須書面通知因拋棄而應繼承之人。實際起算與應備文件應即向法院或法律專業確認，不把期限等到最後。",
    "source": "renounce",
    "icon": "32"
  },
  {
    "id": "accident-1",
    "topic": "accident",
    "title": "跌倒，不代表店家自動全責",
    "display": "現場卡：有人在商店跌倒，但原因、店家是否有過失及因果關係都還未查明。",
    "prompt": "能只憑受傷，就判定店家依一般過失侵權一定全賠嗎？",
    "options": [
      "不能，需查明適用責任基礎及相關事實證據",
      "只要受傷就一律店家全賠",
      "沒有錄影就一律任何人都不必賠"
    ],
    "answer": 0,
    "why": "§184一般過失侵權需確認過失、不法侵害、損害與因果關係等要件。也可能有其他法律責任基礎；本題資料不足，不能直接下責任與比例結論。",
    "source": "damage",
    "icon": "33"
  },
  {
    "id": "accident-2",
    "topic": "accident",
    "title": "受傷損失，不只一張收據",
    "display": "損害卡：不法侵害身體健康的責任與因果關係已確認，造成勞動能力減少、生活照護需要增加。",
    "prompt": "§193所涵蓋的賠償可能包括？",
    "options": [
      "勞動能力損失及增加生活需要等可證明損害",
      "法律永遠只看掛號費",
      "只要有傷就固定賠一百萬元"
    ],
    "answer": 0,
    "why": "§193明列喪失或減少勞動能力、增加生活需要的損害。須提出必要、合理及相關證明，不是列出任何金額都可照單全收；其他損害另依適用規定。",
    "source": "injurycost",
    "icon": "34"
  },
  {
    "id": "accident-3",
    "topic": "accident",
    "title": "舊物損壞，不直接等於全新價",
    "display": "物品卡：他人的舊物因不法行為損壞，正在核對損失；尚未認定修復方式與金額。",
    "prompt": "依§196，應以何種觀念判斷，而非直接套新品售價？",
    "options": [
      "核對物因毀損減少的價額及損害證據",
      "一律按最貴全新品價格賠",
      "二手物品一律沒有價值"
    ],
    "answer": 0,
    "why": "§196規定得請求物因毀損所減少價額。實際修復必要費用、折舊等須依個案認定，不是所有項目一律打同一折扣。",
    "source": "objectcost",
    "icon": "35"
  },
  {
    "id": "accident-4",
    "topic": "accident",
    "title": "雙方有過失，不是自動五五分",
    "display": "事故卡：雙方對損害發生都有過失，但程度與影響不同。",
    "prompt": "法院依§217可能如何處理賠償？",
    "options": [
      "依與有過失等事實，可能減輕或免除，不自動各半",
      "只要雙方有錯永遠五五分",
      "有一點受傷就完全不用看自己的過失"
    ],
    "answer": 0,
    "why": "§217在被害人與有過失時，法院得減輕或免除。比例需依證據與個案，不靠一個通用百分比；有過失也不等於完全失去所有請求。",
    "source": "fault",
    "icon": "36"
  },
  {
    "id": "injury-1",
    "topic": "injury",
    "title": "不是故意撞到，也可能有刑責？",
    "display": "情境卡：行為人因過失造成他人身體傷害，過失、傷害與因果關係等要件已確認。",
    "prompt": "只有故意傷害才可能有刑事責任嗎？",
    "options": [
      "不是，刑法也有過失傷害規定",
      "對，說不是故意就絕無刑責",
      "只要有人受傷不問過失就必定犯罪"
    ],
    "answer": 0,
    "why": "刑法§284有過失傷害規定。沒有故意不等於沒有過失；但真正意外、欠缺過失等要件的情況不能只因有人受傷就認定犯罪。",
    "source": "negligent",
    "icon": "37"
  },
  {
    "id": "injury-2",
    "topic": "injury",
    "title": "傷害案件，都一樣告訴乃論？",
    "display": "案件卡：比較一般人犯普通傷害（§277第1項）與傷害致死、致重傷結果加重情形（同條第2項），無公務員職務例外。",
    "prompt": "能說所有傷害案件都須告訴乃論嗎？",
    "options": [
      "不能；§287所列範圍不包括所有傷害情形",
      "能，任何致死重傷也都一樣",
      "傷害一律都完全不需告訴"
    ],
    "answer": 0,
    "why": "§287列普通傷害§277第1項等為告訴乃論，有明定例外；不是所有傷害犯罪都在其中。案件法律定性須依實際事實確認。",
    "source": "complaint",
    "icon": "38"
  },
  {
    "id": "injury-3",
    "topic": "injury",
    "title": "六個月，從什麼時候算？",
    "display": "程序卡：已確認屬告訴乃論之罪，得為告訴之人已知悉犯人。",
    "prompt": "刑事訴訟法§237的一般告訴期間？",
    "options": [
      "自知悉犯人時起六個月內",
      "一定從驗傷單印出起三年",
      "等對方回覆道歉後才起算"
    ],
    "answer": 0,
    "why": "§237以得為告訴之人知悉犯人時起六個月為原則。不是一律以事故日或驗傷日取代；起算可能有爭議，應及早確認，不把和解洽談當自動停止計時。",
    "source": "deadline",
    "icon": "39"
  },
  {
    "id": "injury-4",
    "topic": "injury",
    "title": "和解書，不等於自動撤告",
    "display": "程序卡：普通告訴乃論案件已提告，雙方私下簽和解，尚未作撤回告訴的程序表示。",
    "prompt": "能只因簽了和解，就保證刑事程序已自動結束嗎？",
    "options": [
      "不能，和解與撤回告訴應分別確認，另看程序與案件性質",
      "能，任何刑案簽和解即自動消失",
      "撤告後隨時都可對同案重新告訴"
    ],
    "answer": 0,
    "why": "§238允許告訴乃論案件於第一審辯論終結前撤回告訴，撤回後不得再行告訴。和解內容與程序表示要核對；非告訴乃論案件更不能靠私下和解保證終止追訴。",
    "source": "withdraw",
    "icon": "40"
  }
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
return {topics,questions,sources,create,select,submit,retry,next,shuffle};
});
