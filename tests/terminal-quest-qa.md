# Terminal Quest QA — 2026-10-20

## Automated checks

- `node --test tests/terminal-quest.test.cjs`: virtual filesystem behavior, errors without mutations, quoted names, hidden files, command completion, final-delivery evidence, equivalent paths and all 14 missions.
- `node --check terminal-quest.js` and `git diff --check`.

## Local browser checks

Served with `python3 -m http.server 8765 --bind 127.0.0.1`. An isolated Chromium launched via the host's existing Playwright Core performed the checks; the OpenClaw browser tool rejected loopback navigation, so no browser configuration or navigation policy was changed. No runtime dependency was added to the game.

- Completed all 14 missions through the command input and next buttons, including an absolute-path `cd` alternative.
- All four concept questions: deliberately selected an incorrect answer (next remains hidden), then the correct one.
- Typed `$ pwd`: shows prompt-marker guidance, does not pass the mission.
- Expanded both hints; removed a seeded file then restored it with Undo; created an unwanted file then restored the mission checkpoint with Retry.
- `clear` visibly clears terminal output without clearing the filesystem or exported transcript.
- Exported `.txt` contains commands, output, undo/retry markers, concept answers, completion evidence and the player's own note; download filename verified.
- Sandbox deletion does not change lesson filesystem or completion; sandbox reset restores initial files.
- Command-history up/down, completion button and Tab focus navigation verified. Tab reaches Run rather than trapping focus.
- Desktop 1365px, mobile widths 390px and 320px, landscape 844×390: no horizontal document overflow, Run remains usable; screenshots inspected on desktop and 390px.
- Reduced-motion setting: reload works and clears progress as documented. No localStorage or sessionStorage entries.
- Lobby: eight cards, learning filter includes both terminal and zhuyin, random recommendation dialog opens with the correct category label and relative play link, Escape closes it, terminal card navigates correctly.
- Old `?old=1#r=abc` lobby link still redirects to `double-standard.html?old=1#r=abc`.
- No page runtime errors observed in these flows.

No claim of physical-device, Safari or real shell/Git execution testing. This game intentionally runs only the documented command subset.

## Follow-up: terminology and uname — 2026-10-20

- Replaced 補完 with 自動補全 in UI, feedback, and documentation. Ctrl+Space/button still complete; Tab still moves focus to Run.
- Added explicitly fictional `uname` information with POSIX-style `-a`, `-s`, `-n`, `-r`, `-v`, `-m` flags; no device detection. Unsupported commands now explain the simulator limitation rather than implying a real command does not exist.
- `node --test tests/terminal-quest.test.cjs`: 15/15 passed, including all 14 missions and new uname flag/error/non-mutation checks.
- Focused local Chromium checks at 1365×950, 390×844, 320×640, and 844×390: completion button/Ctrl+Space, Tab focus, uname output/help, unsupported-command guidance, transcript export, lesson/sandbox isolation, lobby link, no horizontal overflow or page runtime errors. Mobile screenshot inspected.
