# AGENTS.md

This repository is **小龍蝦遊戲間 / Mac's Little Arcade**, a collection of small, free, client-side browser games written with plain HTML, CSS, and JavaScript.

Use this file as the working guide for coding agents. Read `README.md` as the product overview and source of current game descriptions.

## Project goals

Keep the site:

- easy to open and play without accounts or setup;
- fully usable on desktop and mobile;
- lightweight, dependency-free, and deployable as a static site;
- playful without presenting scores as medical, psychological, or personality diagnoses;
- privacy-friendly: do not upload or persist user-entered content unless explicitly requested.

Prefer small, understandable changes over adding frameworks or infrastructure.

## Technology and local development

There is no package manager, build step, paid API, database, or backend.

Run the project from the repository root with:

```sh
python3 -m http.server 8765
```

Then open:

```text
http://localhost:8765/
```

Do not rely on `file://` behavior. Test through an HTTP server so local behavior matches static hosting more closely.

Do not add npm dependencies, frameworks, CDNs, external fonts, analytics, trackers, or hosted assets unless the task explicitly requires them and the tradeoff is justified.

## Repository map

- `index.html` — shared arcade lobby and entry point for all games.
- `double-standard.html` — Double Standard Challenge UI, flow, scoring, sharing, and settings.
- `scenarios.js` — paired perspectives for Double Standard Challenge cases.
- `choices.js` — concrete choices shared by both perspectives of each Double Standard case.
- `three-second-forget.html` — standalone memory game.
- `start-small.html`, `start-small.css`, `start-small.js` — procrastination / small-step game.
- `mini-kart.html`, `mini-kart.css`, `mini-kart.js` — canvas kart racer.
- `hyper-challenge.html`, `hyper-challenge.css`, `hyper-challenge.js` — rhythm/reaction game.
- `bolt.svg`, `box.svg`, `kart.svg`, `masks.svg`, `rocket.svg` — local artwork.
- `v2.html`, `v3.html` — archived prototypes; they are not current entry points.

Before editing a game, inspect all files belonging to that game rather than changing only the first file that appears relevant.

## Important compatibility rules

### Arcade lobby

`index.html` contains compatibility behavior for old shared Double Standard result links using a `#r=` hash. Preserve that redirect unless the task explicitly replaces the sharing format and includes a migration plan.

All game links should remain relative so the site continues to work on GitHub Pages or another static host under a repository subpath.

### Double Standard Challenge

The central mechanic is comparison, not moral scoring:

1. the player chooses how to handle a situation involving someone else;
2. later, the same case is presented from the player's perspective under equivalent conditions;
3. the game compares whether the player's standard changed.

Do not reinterpret individual choices as inherently good/bad, kind/cruel, or as personality traits.

Timeouts are abstentions. They must not silently select an answer and must not count as a matched/mismatched pair.

When adding or editing a case:

- use a unique case title in `scenarios.js`;
- provide both the other-person and self perspectives;
- keep material facts equivalent between the two perspectives;
- provide the corresponding entry in `choices.js` under the same title;
- keep the concrete choice set identical for both perspectives;
- verify the full pair manually, not just the first appearance.

Shared result links are part of the public behavior. Avoid breaking previously generated links.

### Start Small

Keep custom task text local to the current page/session unless persistence is explicitly requested. Do not imply that the game diagnoses or treats ADHD, procrastination, or any health condition.

### Mini Kart

Preserve keyboard and touch controls. Losing focus or hiding the page should not leave controls stuck or allow the race to continue unexpectedly.

When changing movement, collision, drift, boost, or AI logic, test at least one complete race rather than validating only the start screen.

### Hyper Challenge

The game must remain playable without sound. Timing feedback should not depend exclusively on audio.

Preserve pause behavior for page visibility/focus changes and verify both keyboard and pointer controls when changing input logic.

## UI and accessibility expectations

The site is designed for both phones and desktop browsers.

For user-facing changes:

- test narrow mobile width as well as desktop width;
- account for short viewports, including landscape phones;
- keep primary actions reachable without content being clipped;
- use real buttons/links for interactive controls instead of clickable generic elements;
- provide visible keyboard focus states;
- keep touch targets comfortably usable;
- use `aria-*` attributes when they materially improve control state or announcements;
- respect `prefers-reduced-motion` for nonessential animation;
- do not make sound necessary to understand or operate a game;
- do not remove automatic pause-on-blur/visibility behavior from games that already provide it.

Use `textContent` or DOM creation for dynamic text where practical. Avoid introducing `innerHTML` for user-controlled content.

## Style and implementation guidance

Match the existing game/site visual language instead of importing a design system.

This project intentionally uses plain JavaScript. Follow the existing local style in the file you edit. Refactoring is welcome when it directly reduces risk or duplication, but avoid broad rewrites unrelated to the requested change.

Prefer:

- small functions with clear state transitions;
- local assets;
- relative URLs;
- feature detection for browser APIs;
- graceful fallbacks when a feature is optional.

Avoid:

- framework migrations for small features;
- adding storage, accounts, leaderboards, telemetry, or network calls without an explicit product requirement;
- changing gameplay constants incidentally while working on UI;
- mixing unrelated cleanup into a focused pull request;
- editing archived prototypes as if they were production pages.

## Manual validation checklist

There is currently no required automated test suite, so perform focused browser checks for the area you changed.

For every change:

1. serve the repository with `python3 -m http.server 8765`;
2. load `index.html` and verify there are no obvious console/runtime errors;
3. test the changed flow on desktop-sized and phone-sized layouts;
4. verify keyboard focus for any new controls;
5. verify that relative links still work from the local server;
6. check behavior with reduced motion if the change introduces animation.

Additional checks by area:

- lobby: filtering/navigation/random recommendation behavior and old `#r=` redirect;
- Double Standard: at least one complete paired case, timeout behavior, and result/share flow if touched;
- memory game: complete at least one round, including drag/drop or equivalent interaction;
- Start Small: complete a task/obstacle flow and confirm custom text is not persisted unexpectedly;
- Mini Kart: complete at least one race and verify pause/input reset;
- Hyper Challenge: complete a short mode with sound off and verify pause/resume.

If you cannot run a browser test, say so clearly in the PR description and describe what was inspected instead.

## Documentation

Update `README.md` when a change alters:

- the number or identity of games;
- game rules, modes, controls, or major content counts;
- local setup or deployment steps;
- privacy/storage behavior;
- public URLs or sharing behavior.

Do not copy large implementation details into the README; keep it product-facing and keep agent/development rules here.

## Git and pull requests

Use a focused branch and pull request for nontrivial changes.

A good PR should:

- explain the player-facing behavior change;
- list the files/areas touched;
- mention manual checks performed;
- call out compatibility, accessibility, or privacy considerations when relevant;
- avoid bundling unrelated changes.

Treat code-review findings as issues to verify, not instructions to apply blindly. Fix valid findings, explain intentional behavior when a finding does not apply, and resolve review threads only after the concern is addressed.

## Definition of done

A change is done when it:

- satisfies the requested behavior;
- preserves relevant existing game invariants and old shared links;
- works with the static, dependency-free deployment model;
- remains usable on mobile and desktop;
- does not introduce unnecessary data collection or persistence;
- has received the appropriate manual checks;
- updates documentation when user-visible behavior changed.
