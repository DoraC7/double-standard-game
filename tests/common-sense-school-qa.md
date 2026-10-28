# Common sense school QA — 2026-10-28

## Content and scope

24 original situations, six topics × four each: washer dispensing, garment care, cleaning products, kitchen/fridge, appliance electricity and reading instructions. Short round takes two from each (12); full and topic queues have no repeats within a round. Title is commissioned humor, not a real person's diagnosis or ability rating. No timers or data persistence.

### Source verification

All six in-game source URLs were retrieved successfully on 2026-10-28:

- Samsung UK detergent-drawer FAQ: correct compartment for washing aids; fabric softener MAX; capsules/drum vs drawer; automatic dispensing and manual override. Model-scoped main-wash II and flower compartment are provided explicitly in scenarios, not inferred from left/right position. Ordinary main-wash dispensing differs from allowed stain pretreatment; fictional pretreatment label is stated, not attributed as a universal product instruction.
- GINETEX care-symbol overview, ISO 3758:2023: washing number is maximum temperature, crossed triangle no bleaching, crossed square/circle no tumble drying. Locally drawn educational concept figures, not copied official assets. Read complete garment label, not just one symbol.
- UKHSA sodium hypochlorite general information: acid mixtures can release chlorine; ammonia-containing products can produce chloramines. Do not conflate those gases. Appropriate containers, protect children, leave exposure and obtain medical help. Taiwan emergency number 119 adapted, no foreign hotline copied.
- UK FSA chilling/freezing/defrosting: sealed raw meat low in fridge to avoid drips, fridge thawing, wash raw-meat-contact surfaces/utensils/hands, freezing does not guarantee killing bacteria, obey storage labels. No UK storage-time/temperature thresholds silently presented as Taiwan law.
- USFA appliance/electrical safety: major appliances directly to appropriate wall outlets, no extension/strip overload, damaged wires stop use, avoid under-rug/pinched routing. 1650W is an explicitly fictional product label, not a universal Taiwan rating; a total below a stated maximum is not declared sufficient proof of safety.
- USFA heating: heater off when leaving/sleeping, combustibles away, no oven as room heater. Model instructions remain applicable.

All questions include feedback and their related source. Fictional 30mL dosing and product instructions are label-reading tasks, not universal recipes. No physical chemical experiments, electrical repair, smart-device API or actual appliance operation.

## Automated checks

`node --check common-sense-school.js`, `node --check common-sense-engine.js`.
`node --test tests/*.test.cjs`: 124 passed, zero failed (8 new tests).

Coverage includes 24 unique sourced scenarios, six topic counts, all five special interaction kinds, 20 balanced short queues, all-mode completion, immutable first answers including unsure, model-scoped detergent vs softener vs capsule, numeric typing, gas chemistry distinctions, sealed/lower fridge placement, three-step ordering input copy, local-only/no storage/network execution and shared animation integration.

## Browser candidate checks

Exact candidate HTML/CSS/JS inlined into a fresh neutral public lobby realm (DOM preview, not localhost HTTP); no browser policy changes. Reused base stylesheet and shared motion assets checked against published release bytes later. Original illustration embedded as data URI so preview has no unpublished-asset dependency.

- Full 24-question UI completed at 320×568, 844×390 and 1280×800, 24 unique each, score 24/24, 24 review entries. No horizontal overflow in any question in those runs. 390×844 intro inspected visually; no broken images.
- Drawer/fridge selection alone cannot score; confirm disabled until selection. Correct placement visibly marked. Numeric slider submits temperature. Dose selection updates half-full model cup for30mL/60mL capacity. Three-step up/down ordering works without drag-only controls. All answer controls lock after submission.
- Choosing clothes instead of main compartment scores wrong and cannot be replaced by disabled correct button; score stable. Short12 with unsure on all gives0 correct/12 pending, six topics twice each.
- Actual Enter starts a selected topic; Tab moves to first compartment and next; Space selects II main wash, aria-pressed updates, confirm enabled, feedback still hidden (no premature score).
- Shared animation toggle sets arcade-still. Base stylesheet respects OS reduced motion; model cup also suppresses transition when disabled. Essential state remains visible without motion.
- No browser errors observed in full run. No physical devices, actual washing performance, real screen reader or real handheld hardware tested.

## Release checks

Authorized direct push/deployment, no PR. Verify origin/main SHA, successful matching Pages deployment, both public hosts' lobby/new assets/reused styles/effects bytes and a full live game run. Preserve five unrelated existing server-checkout edits using precomputed merges, snapshots and retained stash. Record observed release SHA/deployment/live checks in workspace daily note.
