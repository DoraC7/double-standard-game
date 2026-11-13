# 防失智大挑戰驗收

2026-11-13：候選版完整 Node 測試374項通過。Chromium真實頁面透過本機HTTP，以1280×850、360×740、740×360三種viewport跑完12關，各83項檢查：看卡不能作答、蓋卡、重看、錯答、鎖定、重試、正確回饋、完整回顧、首次與最近分開、無水平溢出、失焦遮罩、手動繼續與重開清空；無pageerror。非真實手機測試。

重跑：`node tests/brain-health-browser-qa.cjs <origin/>`（需既有Chromium CDP18800與環境playwright-core）。來源WHO Dementia，2026-11-13已讀取。未驗證臨床效果，不是量表。
