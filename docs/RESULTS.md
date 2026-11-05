# Results

No trained-arranger result exists yet. This file will be the only place where a measured result may appear.

## Week 1 engineering check

| Check | Status | Evidence |
|---|---|---|
| Four loop-locked mixes | pass | `uv run underscore render --output web/stems` |
| Mix duration | pass | 19.2 s at 44.1 kHz, 8 bars at 100 BPM |
| Conductor rule tests | pass | `uv run pytest` |
| Audio decode in Chromium | pass | browser reports “Score ready”; `scripts/verify_demo.mjs` |
| Runtime gain schedule | pass | start gains exploration=1, boss transition gains boss=1 |
| Next-bar scheduling | implemented | one-bar lookahead in `web/app.js` |
| ML preference over B1 | not measured | model not built |

## Target, not result

The research target is **70% blind preference over the mute/filter baseline** with 20 listeners × 12 trials. It is a hypothesis. No listener study has been run.

## Planned headline table

| Method | Preference vs B1 | 95% CI | Chord compliance | Loop seam | Status |
|---|---:|---:|---:|---:|---|
| B0 one loop | pending | — | — | — | not run |
| B1 mute/filter | 50% by definition | — | — | — | baseline |
| B2 prompted model | pending | pending | pending | pending | not run |
| UnderScore arranger | pending | pending | pending | pending | model not built |

## Evidence rules

- Every listener trial gets a recorded trial ID, order, theme and model version.
- Automatic metrics run from a committed script with a fixed seed.
- Ablated training labels are disclosed as removals, not composer-authored additions.
- FMA and unclear game-music datasets are not used for training.
