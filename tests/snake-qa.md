# 貪食蛇驗收

2026-11-13，候選版完整Node測試383項通過。瀏覽器Chromium本機HTTP，1280×850、360×740、740×360：鍵盤轉向、單步輸入限制、失焦清空待轉彎、暫停完整狀態凍結、背景暫停、按鈕轉向、主動吃果、重開清空、無輸入撞牆與無水平溢出。桌面以Hamiltonian路線填滿256格、253分過關（加速約1.6萬步）；手機尺寸主動吃至少1顆後重開及完整撞牆結束。QA時鐘僅於測試頁注入，finally還原requestAnimationFrame/cancelAnimationFrame，重新導覽後原生時鐘無輸入完整8步撞牆，約0.8秒。加速路線不是人工遊玩。

360 viewport另測原生瀏覽器指標滑動與capture、Enter開始、空白鍵暫停、Escape繼續、WASD轉向及暫停凍結；另送合成pointercancel。不代表真實手機操作已驗證。

`node tests/snake-browser-qa.cjs <origin/>`：使用環境既有playwright-core與Chromium CDP18800，不增加產品依賴。
