'use strict';
const SafetyData = [
  {
    "id": "s1",
    "title": "帳號明天停用？",
    "channel": "帳號提醒",
    "sender": "security@cloud-note-help.invalid",
    "url": "https://cloud-note-login.invalid/verify",
    "body": "請在 30 分鐘內重新登入，否則你的照片與筆記會消失。",
    "attachment": "沒有附件；要求帳號密碼與一次性驗證碼。",
    "outcome": "scam",
    "routes": [
      {
        "id": "account",
        "label": "自行開啟原本的 App／官方入口",
        "text": "官方帳號中心沒有停權通知。服務確認這不是他們的登入網域。",
        "sufficient": true
      },
      {
        "id": "contact",
        "label": "用原本已知的電話／聯絡方式確認",
        "text": "你問了熟悉的人，但他沒有該服務的帳號或訂單資料，無法替你確認這則通知。",
        "sufficient": false
      },
      {
        "id": "reply",
        "label": "直接回覆原訊息，問對方是不是真的",
        "text": "對方說：「是真的，趕快照做！」這只重複了原要求，沒有取得獨立查證。",
        "sufficient": false
      }
    ],
    "exposure": "password",
    "incident": "已在模擬頁面輸入密碼，但還沒交驗證碼。"
  },
  {
    "id": "s2",
    "title": "包裹差 12 元",
    "channel": "物流通知",
    "sender": "notice@parcel-billing.invalid",
    "url": "https://parcel-fee.invalid/pay",
    "body": "收件地址不全，請補付 12 元重新配送。",
    "attachment": "付款頁要求信用卡資料。",
    "outcome": "scam",
    "routes": [
      {
        "id": "account",
        "label": "自行開啟原本的 App／官方入口",
        "text": "官方物流查詢：此包裹已配送完成，沒有補費紀錄。",
        "sufficient": true
      },
      {
        "id": "contact",
        "label": "用原本已知的電話／聯絡方式確認",
        "text": "你問了熟悉的人，但他沒有該服務的帳號或訂單資料，無法替你確認這則通知。",
        "sufficient": false
      },
      {
        "id": "reply",
        "label": "直接回覆原訊息，問對方是不是真的",
        "text": "對方說：「是真的，趕快照做！」這只重複了原要求，沒有取得獨立查證。",
        "sufficient": false
      }
    ],
    "exposure": "payment",
    "incident": "已在模擬情境付款並填入卡片資料。"
  },
  {
    "id": "s3",
    "title": "同事分享的文件",
    "channel": "共享文件",
    "sender": "share@notes.example.invalid",
    "url": "https://notes.example.invalid/document/42",
    "body": "這是你上午要求的會議整理，請從自己的文件清單開啟。",
    "attachment": "一般文件通知，沒有要求安裝或重新授權。",
    "outcome": "legit",
    "routes": [
      {
        "id": "account",
        "label": "自行開啟原本的 App／官方入口",
        "text": "你自行開啟的官方文件清單有這份文件，分享者與上午約定一致。",
        "sufficient": true
      },
      {
        "id": "contact",
        "label": "用原本已知的電話／聯絡方式確認",
        "text": "你問了熟悉的人，但他沒有該服務的帳號或訂單資料，無法替你確認這則通知。",
        "sufficient": false
      },
      {
        "id": "reply",
        "label": "直接回覆原訊息，問對方是不是真的",
        "text": "對方說：「是真的，趕快照做！」這只重複了原要求，沒有取得獨立查證。",
        "sufficient": false
      }
    ],
    "exposure": "none",
    "incident": "尚未操作。"
  },
  {
    "id": "s4",
    "title": "主管說先別打電話",
    "channel": "工作聊天",
    "sender": "主任小林（新帳號）",
    "url": "沒有外部網址",
    "body": "我正在開會，立刻幫我買點數卡。不要打來，拍序號就好。",
    "attachment": "要求先墊錢、交出點數卡序號。",
    "outcome": "scam",
    "routes": [
      {
        "id": "account",
        "label": "自行開啟原本的 App／官方入口",
        "text": "你查看自己的帳號與交易紀錄，但這裡無法確認這位聯絡人是否真有提出要求。",
        "sufficient": false
      },
      {
        "id": "contact",
        "label": "用原本已知的電話／聯絡方式確認",
        "text": "你用原本已知的公司分機聯絡主管；主管確認沒提出這個要求，新帳號是假冒。",
        "sufficient": true
      },
      {
        "id": "reply",
        "label": "直接回覆原訊息，問對方是不是真的",
        "text": "對方說：「是真的，趕快照做！」這只重複了原要求，沒有取得獨立查證。",
        "sufficient": false
      }
    ],
    "exposure": "none",
    "incident": "尚未操作，也沒有購買。"
  },
  {
    "id": "s5",
    "title": "社團活動改時間",
    "channel": "活動通知",
    "sender": "hello@club.example.invalid",
    "url": "https://club.example.invalid/events/7",
    "body": "你報名的週末讀書會改為下午三點，登入既有活動頁確認即可。",
    "attachment": "沒有附件、不索取付款或驗證碼。",
    "outcome": "legit",
    "routes": [
      {
        "id": "account",
        "label": "自行開啟原本的 App／官方入口",
        "text": "你自行開啟的報名紀錄顯示活動確實改為三點，主辦單位一致。",
        "sufficient": true
      },
      {
        "id": "contact",
        "label": "用原本已知的電話／聯絡方式確認",
        "text": "你問了熟悉的人，但他沒有該服務的帳號或訂單資料，無法替你確認這則通知。",
        "sufficient": false
      },
      {
        "id": "reply",
        "label": "直接回覆原訊息，問對方是不是真的",
        "text": "對方說：「是真的，趕快照做！」這只重複了原要求，沒有取得獨立查證。",
        "sufficient": false
      }
    ],
    "exposure": "none",
    "incident": "尚未操作。"
  },
  {
    "id": "s6",
    "title": "退款 QR Code",
    "channel": "購物聊天",
    "sender": "客服-退款加速專員",
    "url": "QR Code 解碼：https://refund-fast.invalid/claim",
    "body": "商品有問題嗎？掃碼領退款，不用走平台流程。",
    "attachment": "掃碼頁要求銀行帳號、網銀密碼與簡訊碼。",
    "outcome": "scam",
    "routes": [
      {
        "id": "account",
        "label": "自行開啟原本的 App／官方入口",
        "text": "官方購物 App 的客服確認沒有這筆退款案件，也不會要求提供網銀密碼與簡訊碼。",
        "sufficient": true
      },
      {
        "id": "contact",
        "label": "用原本已知的電話／聯絡方式確認",
        "text": "你問了熟悉的人，但他沒有該服務的帳號或訂單資料，無法替你確認這則通知。",
        "sufficient": false
      },
      {
        "id": "reply",
        "label": "直接回覆原訊息，問對方是不是真的",
        "text": "對方說：「是真的，趕快照做！」這只重複了原要求，沒有取得獨立查證。",
        "sufficient": false
      }
    ],
    "exposure": "otp",
    "incident": "已把一次性驗證碼交給對方。"
  },
  {
    "id": "s7",
    "title": "相簿小工具要所有權限",
    "channel": "授權請求",
    "sender": "照片整理小幫手",
    "url": "https://photo-sort.invalid/connect",
    "body": "只要授權，就能免費整理重複照片。",
    "attachment": "同意畫面要求讀取所有郵件、代你寄信，以及離線持續存取。",
    "outcome": "scam",
    "routes": [
      {
        "id": "account",
        "label": "自行開啟原本的 App／官方入口",
        "text": "你自行開啟的帳號授權頁確認：這個工具確實取得了郵件讀寫與代寄權限，超出相簿整理用途；官方建議撤銷。",
        "sufficient": true
      },
      {
        "id": "contact",
        "label": "用原本已知的電話／聯絡方式確認",
        "text": "你問了熟悉的人，但他沒有該服務的帳號或訂單資料，無法替你確認這則通知。",
        "sufficient": false
      },
      {
        "id": "reply",
        "label": "直接回覆原訊息，問對方是不是真的",
        "text": "對方說：「是真的，趕快照做！」這只重複了原要求，沒有取得獨立查證。",
        "sufficient": false
      }
    ],
    "exposure": "grant",
    "incident": "已按下同意授權，沒有輸入密碼。"
  },
  {
    "id": "s8",
    "title": "發票通知與可疑附件",
    "channel": "電子發票",
    "sender": "invoice@receipt-view.invalid",
    "url": "https://receipt-view.invalid/download",
    "body": "你的發票已開立，請下載 invoice.pdf.exe 檢視。",
    "attachment": "附件完整名稱 invoice.pdf.exe；要求執行程式。",
    "outcome": "scam",
    "routes": [
      {
        "id": "account",
        "label": "自行開啟原本的 App／官方入口",
        "text": "你自行開啟的購物訂單中沒有這筆交易；客服確認不以可執行檔寄送發票。",
        "sufficient": true
      },
      {
        "id": "contact",
        "label": "用原本已知的電話／聯絡方式確認",
        "text": "你問了熟悉的人，但他沒有該服務的帳號或訂單資料，無法替你確認這則通知。",
        "sufficient": false
      },
      {
        "id": "reply",
        "label": "直接回覆原訊息，問對方是不是真的",
        "text": "對方說：「是真的，趕快照做！」這只重複了原要求，沒有取得獨立查證。",
        "sufficient": false
      }
    ],
    "exposure": "clicked",
    "incident": "只打開訊息裡的網頁，沒有下載、執行或輸入資料。"
  },
  {
    "id": "s9",
    "title": "新的裝置登入通知",
    "channel": "帳號提醒",
    "sender": "alerts@cloud.example.invalid",
    "url": "https://cloud.example.invalid/account",
    "body": "你的帳號剛從新裝置登入。不是本人請從既有 App 檢查安全紀錄。",
    "attachment": "不要求回覆密碼或驗證碼。",
    "outcome": "legit",
    "routes": [
      {
        "id": "account",
        "label": "自行開啟原本的 App／官方入口",
        "text": "你自行開啟的帳號紀錄確有這次登入，而且時間與你剛換手機吻合。",
        "sufficient": true
      },
      {
        "id": "contact",
        "label": "用原本已知的電話／聯絡方式確認",
        "text": "你問了熟悉的人，但他沒有該服務的帳號或訂單資料，無法替你確認這則通知。",
        "sufficient": false
      },
      {
        "id": "reply",
        "label": "直接回覆原訊息，問對方是不是真的",
        "text": "對方說：「是真的，趕快照做！」這只重複了原要求，沒有取得獨立查證。",
        "sufficient": false
      }
    ],
    "exposure": "none",
    "incident": "尚未操作。"
  },
  {
    "id": "s10",
    "title": "朋友急用錢",
    "channel": "朋友訊息",
    "sender": "阿青（熟悉的頭像，新號碼）",
    "url": "沒有外部網址",
    "body": "手機壞了，先借我一筆錢，我晚點還，現在沒辦法語音。",
    "attachment": "要求轉帳到不熟悉帳戶。",
    "outcome": "scam",
    "routes": [
      {
        "id": "account",
        "label": "自行開啟原本的 App／官方入口",
        "text": "你查看自己的帳號與交易紀錄，但這裡無法確認這位聯絡人是否真有提出要求。",
        "sufficient": false
      },
      {
        "id": "contact",
        "label": "用原本已知的電話／聯絡方式確認",
        "text": "你打原本通訊錄中的電話，朋友接起來確認沒有借錢，新號碼不是他本人。",
        "sufficient": true
      },
      {
        "id": "reply",
        "label": "直接回覆原訊息，問對方是不是真的",
        "text": "對方說：「是真的，趕快照做！」這只重複了原要求，沒有取得獨立查證。",
        "sufficient": false
      }
    ],
    "exposure": "none",
    "incident": "尚未轉帳。"
  },
  {
    "id": "s11",
    "title": "訂閱續費的真通知",
    "channel": "訂閱提醒",
    "sender": "billing@music.example.invalid",
    "url": "https://music.example.invalid/subscriptions",
    "body": "你訂閱的音樂方案下週續費。可從原本 App 查看方案或取消。",
    "attachment": "不附付款表單，也沒有要求立即轉帳。",
    "outcome": "legit",
    "routes": [
      {
        "id": "account",
        "label": "自行開啟原本的 App／官方入口",
        "text": "你自行開啟的 App 訂閱頁確有同一方案、金額與續費日；是否續訂仍由你決定。",
        "sufficient": true
      },
      {
        "id": "contact",
        "label": "用原本已知的電話／聯絡方式確認",
        "text": "你問了熟悉的人，但他沒有該服務的帳號或訂單資料，無法替你確認這則通知。",
        "sufficient": false
      },
      {
        "id": "reply",
        "label": "直接回覆原訊息，問對方是不是真的",
        "text": "對方說：「是真的，趕快照做！」這只重複了原要求，沒有取得獨立查證。",
        "sufficient": false
      }
    ],
    "exposure": "none",
    "incident": "尚未操作。"
  },
  {
    "id": "s12",
    "title": "最新密碼表快補填",
    "channel": "共享表單",
    "sender": "IT 協助站（群組訊息）",
    "url": "https://account-check.invalid/form",
    "body": "同事都填了！為了系統更新，請把公司密碼與驗證碼填在這張表。",
    "attachment": "表單要求密碼與一次性碼；聲稱已獲主管同意。",
    "outcome": "scam",
    "routes": [
      {
        "id": "account",
        "label": "自行開啟原本的 App／官方入口",
        "text": "你查看自己的帳號與交易紀錄，但這裡無法確認這位聯絡人是否真有提出要求。",
        "sufficient": false
      },
      {
        "id": "contact",
        "label": "用原本已知的電話／聯絡方式確認",
        "text": "你透過公司既有聯絡管道確認：沒有這個表單，也不會用共享表格收集密碼或驗證碼。",
        "sufficient": true
      },
      {
        "id": "reply",
        "label": "直接回覆原訊息，問對方是不是真的",
        "text": "對方說：「是真的，趕快照做！」這只重複了原要求，沒有取得獨立查證。",
        "sufficient": false
      }
    ],
    "exposure": "none",
    "incident": "尚未填表。"
  }
];
if(typeof module!=='undefined')module.exports=SafetyData;
