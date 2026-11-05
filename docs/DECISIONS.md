# Decisions

## D-001 — Keep the model offline and the runtime deterministic

Date: 2026-11-05

The research shows that adaptive-music runtime is already solved by Godot, Wwise and FMOD, while the expensive part is the missing intensity content. The project will train an offline arranger and keep the in-game reaction path rule-based with a one-bar lookahead. This avoids adding model latency to a beat-sensitive system.

## D-002 — Build the runtime slice before the arranger

Date: 2026-11-05

The first implementation is a hand-authored four-layer theme plus a browser conductor. It validates loop locking, gain scheduling and the game-state contract before any training data is collected. The arranger will replace the hand-authored layers later; it will not replace the conductor.

## D-003 — Name: UnderScore

Date: 2026-11-05

The working name is **UnderScore**: the supporting score beneath a game's theme. The project is a composer-side tool, not a replacement for middleware or a live generative soundtrack.

## D-004 — Original demo theme and clean licences

Date: 2026-11-05

The demo theme is original and rendered from code. Training will use Slakh/Lakh under CC BY 4.0. FMA is excluded because its per-track licences are mixed, and unclear game-music datasets are excluded.

## D-005 — No ML claim yet

Date: 2026-11-05

The current result is an engineering slice. The 70% preference target, model metrics and VLM/prompted baseline are not measured. Public text must not imply otherwise.
