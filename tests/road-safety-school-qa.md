# Road safety school QA — 2026-10-28

## Scope and sources

Original, local-only Taiwan passenger-car knowledge practice, not licensed training or maintenance instructions. No new dependencies. 42 scenarios: speed 6, fluids 8, lights 6, signals/U-turn 10, tires 4, emergencies 4, throttle 4. Short mode draws two per topic (14); complete and topic modes do not repeat within a round.

Source names/links live in `road-safety-engine.js` and render per answer and in the source list:

- Taiwan Road Traffic Safety Rules §93: posted limits first; absent limits: general 50, separated slow lane 40, roads without lane/direction/restriction lines 30. Ceiling is not a safe-speed target. §102/103: officer, blocked intersection, pedestrian priorities; §106: U-turn restrictions and stop/signal/check procedure; §109: headlights, near beam for oncoming/following, fog-lamp restriction.
- Taiwan signs/markings/signals regulations: §206 red, §211 flashing red/yellow; full regulations for octagonal STOP, inverted yield, red max/blue min, double yellow and keep-clear grid. Grid illustration explicitly an uncontrolled access, not signal-controlled intersection. Illustrations not official dimension drawings.
- Toyota Taiwan maintenance overview: fluid functions, vehicle-specific specifications/intervals. EPS and sealed-battery scenarios give fictional manual instructions explicitly; not attributed as a Toyota model specification. The mnemonic does not require eight reservoirs in every vehicle.
- Mazda CX-5 online manual 07030501: hot pressurized cooling caps and fans; 07031401: cold inflation, warm pressure, regular inspection. Example 33 psi is fictional door-label reading, never universal or tire-sidewall MAX.
- Taiwan MOTC 168, 115/10/21: warning lights, leave live traffic to safety, report; triangles only when safe. Blowout scenario starts AFTER safe stop/evacuation, not an unverified instantaneous blowout-control lesson.
- US Fire Administration vehicle fire physical guidance; Taiwan emergency number adapted to 119, not foreign 911. 110 for Taiwan police. No real calling feature.
- Smooth-throttle and near-beam-in-fog advice labelled safety advice rather than quotations of law. Pedal model maps input to an illustration's position, not speed, stopping distance or real vehicle calibration. Vehicle/manual/instructor distinctions explicit.

## Automated verification

`node --check road-safety-school.js`, `node --check road-safety-engine.js`.
`node --test tests/*.test.cjs`: 116 tests passed (including 8 new road tests).
Coverage: unique topic/source/fluids, 20 short-round samples, every topic and complete flow, first answer locking, unsure, reset, 30/40/50 distinction, fog optional not mandatory, clear weather fog off, emergency ordering and input copy, critical safety boundaries and no persistence/network runtime.

## Browser verification

Managed Chromium on the existing public site with exact candidate HTML/CSS/JS injected into a fresh neutral lobby realm (DOM candidate preview, NOT localhost HTTP). Browser localhost/private-address policy was left unchanged. New sources fully inlined for preview; real published URLs verified after release.

- Two full 42-question UI runs, each 42 unique, every answer rendered/locked, 42 review entries, score 42/42. Covers speed slider submit, near/fog toggles and actual beam class, up/down emergency sorting, shuffled choice buttons.
- Unsure remains wrong/pending review and cannot be replaced by clicking disabled answer controls. Exit/restart returns selection; short mode available with 14 total.
- Pedal jump updates model position and textual feedback; reset to 0; fluid card updates; source links present (13).
- Actual Enter activates topic; Tab moves from heading to first lamp button; Space activates it and updates aria-pressed. Native controls preserve keyboard behavior.
- Widths 320×568, 390×844, 844×390, 1280×800: no horizontal overflow in observed states. Mobile top page inspected visually. SVG replaced missing-glyph automotive emoji.
- OS reduced-motion media CSS plus shared `arcade-still` animation opt-out both suppress pedal transition; no animation required to understand state.
- No browser page errors observed in full run. No user data persistence, real vehicle/system interaction or real driving test claimed.

## Release verification checklist

- Push authorized directly, no PR. Verify origin/main SHA and Pages deployment success.
- Preserve the existing server checkout's five unrelated storage-feature edits. Snapshot and retain stash; prepare merged README before fast-forward; compare all added/deleted diff lines before/after.
- Compare published HTML/CSS/JS/SVG, shared assets and lobby on BOTH GitHub Pages and existing port 9487 host to release bytes.
- Run live full game UI, source links, lobby entry and error check. Live results recorded in workspace daily note.
