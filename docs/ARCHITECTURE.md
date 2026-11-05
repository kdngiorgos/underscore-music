# Architecture

## The split

```text
┌──────────────────────────── OFFLINE ────────────────────────────┐
│ theme MIDI ──► key / chord / grid analysis                      │
│                     │                                           │
│                     ▼                                           │
│              conditional symbolic arranger                      │
│              (intensity + chord + loop mask)                    │
│                     │                                           │
│                     ▼                                           │
│               four loop-locked stems                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────── RUNTIME ────────────────────────────┐
│ game state ──► rule table ──► target intensity                  │
│                                  │                              │
│                                  ▼                              │
│                         one-bar lookahead                       │
│                                  │                              │
│                                  ▼                              │
│                  gain scheduler on the audio clock              │
└─────────────────────────────────────────────────────────────────┘
```

The singleton on each side is the core design constraint:

- **The runtime never waits for a model.**
- **The model never has to react in real time.**
- **The arranger output is editable MIDI/audio, not a black-box stream.**

## Week 1 implementation

The current vertical slice deliberately contains no ML. It validates the production contract before expensive training:

- One original 8-bar theme in A minor at 100 BPM.
- Four hand-authored mixes, all exactly 19.2 seconds and loop-locked.
- Four browser `AudioBufferSourceNode`s started together with independent gain nodes.
- A game-state rule table and a next-bar scheduler.
- The visual scene is a thin harness, not the point of the project.

This lets the conductor, transition scheduling, loop timing and visual state be tested independently of the future model.

## Planned arranger

- REMI-style tokenisation: bar, position, instrument, pitch, duration, velocity, plus intensity and chord tokens.
- 20–60M parameter conditional transformer.
- Hard decoding constraints: key mask, chord mask, 1/16 grid, loop wrap and intensity bounds.
- Train from track-ablation labels: 0 drums+bass, 1 + harmony, 2 + lead, 3 + counterline/percussion.
- Evaluate on entire held-out songs, never held-out segments.

## Why the runtime is not learned

Musical transitions are bar-quantised. A 200 ms model is too slow to land on a downbeat, and a network dependency makes a live demo fragile. The runtime is a scheduler; its correctness is a timing property, not a language-model property.

## Why the demo mixes, not just stems

The browser loads four complete mixes so every transition is a simple gain crossfade on synchronized loops. A later Godot/Wwise integration will use the same four-stem contract. The conductor can be replaced without changing the arranger.

## Near-term engineering

- Add `mido`-based theme ingest and export.
- Add the Slakh/Lakh data pipeline and dataset card.
- Add A1–A5 evaluation against B1.
- Add an event-level landing-error test to verify next-bar entry.
- Keep the model checkpoint and training data out of git.
