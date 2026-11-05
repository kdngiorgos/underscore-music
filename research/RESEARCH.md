# LiveScore — independent research report

Researched: 2026-11-04. Status: pre-selection research, no code written, nothing measured.
Author: independent research subagent. Not an advocate for the idea.

Labels used throughout: **[FACT]** verified against a primary source; **[VENDOR]** a
capability or number asserted by the party selling it; **[INFERENCE]** my reasoning,
which could be wrong.

---

## 1. Executive verdict

**Verdict: conditional, borderline. 62/100. Confidence: medium.**

LiveScore as written in the shortlist ("a composer inside your game") is the weakest
of the four ideas on differentiation and the second weakest on demand. Adaptive game
music is a solved engineering problem with three mature free or cheap answers (Wwise,
FMOD, and Godot's built-in `AudioStreamInteractive`), plus at least one commercial
generative competitor (Reactional) and several hosted AI-music services that already
advertise game-state reactivity.

But there is a real, narrow, unsolved problem underneath it, and it is not the one in
the shortlist. The expensive part of adaptive music is not the runtime, it is the
**content**: a composer must write three to five musically coherent intensity layers
for every cue, which is the single largest multiplier on game-music cost. No existing
tool generates those layers from a composer's own theme while guaranteeing that they
stay in key, on the bar grid, and loop seamlessly.

The defensible project is therefore:

> **A trained model that takes one theme and writes the missing adaptive layers, plus a
> deterministic runtime that schedules them to the bar.** The model is the contribution;
> the runtime is deliberately not ML.

That reframing matters because it inverts the shortlist's premise. The shortlist implies
a model reacting live inside the game. The evidence says a model should **not** be in the
reaction path at all: musical reactions must be bar-quantised, and a 200 ms model latency
is fatal to a beat-accurate response. The model belongs offline, in content production.
The reaction path belongs to rules.

This is a real project, but it is a **second-tier** one against DrawPlay on demo impact
and against Cheater vs Referee on research depth. It is worth five days to find out
whether the model can actually beat the deterministic baseline, because if it cannot,
the project collapses into an audio-engineering exercise with no ML justification.

**The single question that decides it:** can a small trained symbolic model produce an
intensity layer that listeners prefer to the standard "mute and filter the existing
stems" approach, on themes it has never seen? If not, park it.

---

## 2. The problem and who has it

### 2.1 The production problem is real

Adaptive music is built from **vertical layering** (several synchronised versions of the
same cue at different intensities, crossfaded) and **horizontal re-sequencing** (segments
re-ordered or branched). [FACT] Wwise's interactive-music hierarchy is exactly this:
Music Segments containing Music Tracks and sub-tracks, switched by States and Switches,
with transitions and stingers. FMOD exposes the same model through parameters and
transition timelines. Godot 4.7 ships `AudioStreamInteractive`, with transitions that can
fire on `TRANSITION_FROM_TIME_NEXT_BEAT` or `NEXT_BAR`, plus crossfade and filler clips.

The cost is multiplicative. A cue that needs four intensity levels is four cues that must
share tempo, key, chord progression, orchestration and loop length. Every layer must be
written, mixed and kept in sync forever. This is why a 30–45 minute indie score is quoted
at roughly **$3,000–$15,000** [FACT, Twine cost guide; corroborated by composer forum
threads quoting $2,000–$20,000], and why many small games ship one looping track instead.

### 2.2 But the user is ambiguous, and that is a strategic problem

Two different people are being conflated:

| User | Has a theme? | Wants AI? | Can pay? | Pain |
|---|---|---|---|---|
| Solo dev / game jam | No | Yes, cheap | No | Wants *any* music that reacts |
| Small studio with composer | Yes | Sceptical | Some | Wants the layers without 4× the work |

The first user does not need a theme-preserving arranger; they need cheap music, and
that market is already saturated by text-to-music tools. The second user is the one with
the real problem, and is also the one most hostile to the product. The shortlist already
half-recognises this ("a safer position is a tool for solo developers without a composer,
or one that extends a composer's own themes") — but those are two different products, and
only the second one justifies training a model.

**Choose the second user.** It is the only version where the ML is load-bearing.

### 2.3 What the user actually does today

1. Compose or license one theme.
2. Duplicate the DAW project three or four times and strip parts out, or add parts in.
3. Export stems, wire them into Wwise/FMOD/Godot, map game parameters to volume.
4. Hand-tune transitions so the seams are inaudible.

Step 2 is the labour. Step 4 is already solved by middleware. A tool that does step 2
and outputs drop-in layers for step 3 is a genuine time saver and requires no runtime
replacement — which massively lowers adoption friction and removes the "AI in my game"
fear, because the output is ordinary audio files the composer edits.

---

## 3. Demand evidence, and what it does not show

**What is verified:**

- Adaptive-music tooling is standard, free at indie scale, and documented publicly by
  Audiokinetic and FMOD. [FACT]
- Composer cost for an indie score is in the low thousands to low tens of thousands of
  dollars, and adaptive work is priced per finished minute. [FACT, vendor/marketplace
  pricing pages; these are asking prices, not transaction data]
- Commercial products already sell "adaptive/generative game music": Reactional Engine
  (note-by-note generation, Unity/Unreal integration, Wwise/FMOD bridges, claimed <5 ms
  control latency), Mubert (real-time streams via SDK/API, "feed it game state"), and
  Wondera (claimed gameplay-state-reactive agents). [VENDOR]
- Hosted text-to-music tools explicitly market to indie game developers with stem export
  and looping. [VENDOR]
- Valve requires disclosure of **live-generated AI content** on Steam and gives players a
  reporting button for it; the policy was revised in January 2026 to cover content the
  player sees or hears. [FACT]

**What is not verified:**

- That anyone is blocked by the *layer authoring* step specifically. I found no survey,
  no issue tracker, no forum thread that names it. It is my inference from the structure
  of the tooling and from composer pricing.
- That indie developers would pay for it. Reactional and Mubert exist; I found no public
  revenue, user counts, or retention.
- That composers would accept it. The one directly relevant study (11 professional game
  composers interviewed about AI music technology, White Rose / ACM TOG) I could not read
  in full, so I make no claim about its findings. [Unresolved]

**Honest reading:** demand is *plausible and structurally motivated*, not *evidenced*.
That is a 6/10, not an 8.

---

## 4. State of the art

### 4.1 Comparison table

| System | What it does | Runtime? | Trained model? | Licence / cost | Relevance |
|---|---|---|---|---|---|
| **Wwise** (Audiokinetic) | Segments, tracks, states, switches, RTPCs, stingers, transitions | Yes, sample-accurate | No | Free under revenue threshold, otherwise paid | The baseline everyone measures against |
| **FMOD Studio** | Parameters, transition timelines, quantisation, layering | Yes | No | Free under threshold | Same |
| **Godot `AudioStreamInteractive`** | Clips + transition table, next-beat / next-bar transitions, crossfade, filler clips | Yes | No | MIT | Free baseline; also the demo host |
| **Reactional Engine** | Note-by-note generation with virtual instruments, analyses commercial tracks for tempo/harmony, Unity/Unreal, Wwise/FMOD bridges | Yes, claimed <5 ms | Music *analysis*, not a generative audio model (vendor framing) | Commercial | Closest commercial competitor |
| **Mubert** | Continuous non-repeating streams, SDK/API, game-state input | Yes (hosted) | Yes (hosted) | Subscription | Closest "AI adaptive" service |
| **MRT2** (Google DeepMind, 2026-06-04) | 230M / 2.4B codec-LM streaming 48 kHz stereo, steered by text, audio and MIDI | Yes, Apple Silicon only | Yes, but **fine-tuning not released** | Code Apache-2.0, weights CC-BY-4.0 | Best open live model; not trainable today |
| **AccoMontage-3** (NeurIPS 2024) | Lead sheet → piano arrangement → multi-track orchestration, long-term style prior | No (offline) | Yes | Research code | Prior art for "arrange a theme" |
| **PreGLAM-MMM** (Plut, 2022) | MMM transformer generates variation stems that extend a composed adaptive score | No (pre-rendered) | Yes | Research | Closest academic system; already did the user study |
| **Santos et al. 2022** | Transformer generates layers, arousal/valence selects them | Conceptual | Yes | Preprint | Architecture proposal, weak evaluation |

### 4.2 What each one tells us

**The runtime is not the gap.** Godot gives away bar-quantised interactive music for
free. Any project whose contribution is "the music changes when the game changes" is
competing with a built-in engine feature.

**The commercial gap is already being filled.** Reactional is the honest threat: it does
note-by-note generation, integrates with both major middleware, and targets the same
"music reacts to gameplay" pitch. Its weakness is that it generates from its own musical
material and analysis, not from *your* theme's missing layers, and it is closed and
commercial. That is a narrow gap, not a wide one.

**The academic gap is narrower than the shortlist implies.** AccoMontage-3 already
orchestrates a lead sheet into multiple tracks with long-term structure. PreGLAM-MMM
already generated variation stems from a composed adaptive score and ran a 48-participant
study. A new project cannot claim "we generate adaptive music from a theme" as novel. It
can only claim the specific constraints and the specific evaluation.

**MRT2 is real but is not the project.** [FACT] It exists, it is open-weight, it streams
at 40 ms frames with ~200 ms control latency, and the 230M model runs real-time on any
Apple Silicon Mac including Airs. [FACT] Fine-tuning is explicitly "coming soon" and not
released. [FACT] Real-time streaming is Apple-Silicon-only; NVIDIA GPUs get offline
inference only. [FACT] The effective receptive field is about 20 seconds. [FACT] It was
trained on ~71k hours of stock music, mostly instrumental.

That last fact is the important one. **A 20-second receptive field cannot hold a
three-minute musical structure, cannot recall a theme stated forty seconds ago, and
cannot plan a boss fight.** It is an instrument, not a composer. Google says so
themselves: they call it "AI musical instruments". Using it as the composer inside a game
would be a category error.

### 4.3 What MRT2 does and does not settle

| Claim in the shortlist | Verdict |
|---|---|
| "Runs a small live music model on Apple Silicon" | **True.** 230M real-time on any Apple Silicon Mac. |
| "Usable locally" | **True, with conditions.** Mac only for real-time; the Windows 3060 can only run it offline. A community PyTorch port claims 12 GB support but is unverified and I would not build on it. |
| "Can be trained/fine-tuned on game music" | **False today.** Fine-tuning is announced, not shipped. |
| "Could be the composer inside your game" | **No.** 20 s receptive field, no long-term structure, MIDI control is a per-frame pitch-state vector (off/on/onset/sustain), not musical direction. |

**Consequence for the design:** do not make MRT2 a dependency. Treat it as an optional
*renderer* — a way to make generated MIDI sound expensive — and only after the core
system works. The core must run on the 3060 and on CPU.

---

## 5. What is actually unsolved

Strip away everything already solved and four things remain:

1. **Layer authoring from a theme.** Given one arrangement, produce the missing intensity
   levels without the composer writing them. Constraint: identical tempo, metre, key,
   chord progression, loop length, and instrumentation family. This is a *conditional
   generation under hard musical constraints* problem, not a text-to-music problem.
2. **Loop-safe generation.** Game music loops. A model that generates eight bars must
   produce a last bar that leads back into the first without a seam. Almost no music model
   is evaluated on this.
3. **Non-repetition at constant identity.** Players notice loops within minutes. The
   standard fix is more content, which costs money. A model that varies indefinitely while
   keeping the theme recognisable solves the actual complaint. Nobody measures this.
4. **Transition audibility.** Crossfading two layers works only if they are arranged to
   crossfade. Measuring whether a listener can hear the seam is cheap and nobody does it.

Items 1–4 are one coherent research object: **theme-preserving adaptive arrangement with
measurable seamlessness and non-repetition**. That is the project.

---

## 6. Exact technical approach

### 6.1 Two components, deliberately separated

**The Arranger (ML, offline).** A conditional symbolic transformer.

- Input: a theme as multi-track MIDI (or a lead sheet plus chord track), a target
  intensity `i ∈ {0,1,2,3}`, and the theme's musical context (key, tempo, metre, chord
  sequence per bar, section boundaries, loop length in bars).
- Output: one new layer as MIDI — the notes that should be added at that intensity.
- Rendering: FluidSynth with a permissively licensed soundfont. Optional later swap to
  MRT2 for timbre.

**The Conductor (deterministic, runtime).** A scheduler, not a model.

- Input: a game-state vector (combat, health, enemy count, area, scripted beat) at ~10 Hz.
- Maps state → target intensity via a small, inspectable rule table (the designer edits it).
- **Lookahead:** issues the layer command at least one bar early, so the change lands on
  the next downbeat. This is the direct answer to the 200 ms latency problem: you do not
  react faster, you schedule earlier.
- Hands the command to Godot's `AudioStreamInteractive` (or a custom crossfade mixer),
  which already guarantees next-bar transitions and beat-length fades.

This split is the most important design decision in the report. It is also the honest one:
**the runtime does not need ML, and putting ML there would make it worse.**

### 6.2 The model

Start from a proven small architecture rather than inventing one.

- Tokenisation: REMI-style (bar, position, instrument, pitch, duration, velocity) with
  added `intensity` and `chord` tokens, following the AccoMontage-3 / MMM lineage.
- Size: 20–60M parameters. On a 3060 this trains in hours, not days.
- Conditioning: intensity embedding added to every token; chord and key as prefix tokens
  *and* as a decoding mask.
- **Constrained decoding (the contribution):**
  - key mask: suppress pitches outside the key except chromatic passing tones with a
    learned allowance;
  - chord mask: at each bar, suppress pitches outside the current chord's scale;
  - grid quantisation: snap onsets to a 1/16 grid, always;
  - loop wrap: the final bar's generation is conditioned on the first bar's tokens, so the
    model composes *into* the loop point rather than stopping at it;
  - intensity monotonicity: density and velocity bounds derived from `i`.
- These are hard constraints, not losses. They make the "stays in key, stays on the grid,
  loops cleanly" claim true by construction, which is much stronger than reporting an
  average accuracy.

### 6.3 Training task (self-supervised, with ground truth)

From each multi-track song in the training set:

1. Segment into 8- or 16-bar loops at a detected tempo and downbeat.
2. Estimate key and per-bar chords.
3. Define intensity levels by **track ablation**: level 0 = drums + bass; 1 = + harmony;
   2 = + lead; 3 = + countermelody/percussion. This gives real, musically coherent
   layers with real ground truth, derived from actual arrangements rather than synthesised.
4. Build triples `(theme = levels 0..k, target = level j, layer = tracks added between k
   and j)`.
5. Hold out entire songs, not segments, to prevent leakage.

The ablation trick is the reason this project has ground truth at all. It is also its
biggest methodological weakness: ablated layers are *removals*, so the model learns
"what a composer would have added" only insofar as the original arrangement is
representative. Say this in the write-up.

### 6.4 Why not just prompt a big model

Because prompting cannot do the job:

- A text-to-music model cannot take a specific theme and emit a layer that is
  sample-aligned to its bar grid, in its key, over its exact chord changes, at its loop
  length. MusicGen-melody conditions on a chromagram, not on bar-accurate arrangement, and
  its weights are CC-BY-NC (non-commercial). [FACT]
- A hosted model means per-request cost, network latency and a dependency the demo cannot
  survive, plus a Steam disclosure for live-generated content.
- An LLM writing MIDI is a plausible cheap baseline and should be tested as one — I expect
  it to produce plausible notes that violate the chord grid often enough to be audible.

The trained model earns its place by **guaranteeing** constraints a prompted model can only
approximate, and by running locally and free.

---

## 7. Data and licences

### 7.1 Usable today

| Source | Content | Licence | Verdict |
|---|---|---|---|
| **Slakh2100** | 2,100 songs, 145 h, aligned multi-track MIDI + rendered audio, 34 instrument classes | CC BY 4.0 [FACT] | **Primary training set.** Multi-track alignment is exactly what the ablation task needs. |
| **Lakh MIDI v0.1** | 176,581 MIDI files, 10,521 h | CC BY 4.0 [FACT] | Secondary; needs cleaning, no aligned audio. |
| **FMA** | 106,574 tracks, per-track CC | Metadata CC BY 4.0; audio under the artist's licence; "meant for research purposes" [FACT] | **Avoid for training.** Mixed NC/ND licences and an explicit research-only framing make commercial use unsafe. Usable only as a fully-audited CC-BY/CC0 subset, which is more work than it is worth here. |
| **MRT2 weights** | 230M / 2.4B | CC BY 4.0 weights, Apache-2.0 code; Google claims no rights in outputs; user responsible for non-infringement [FACT] | Usable as a renderer with attribution. Not needed for v1. |

### 7.2 Avoid

- **MuVGM** (7,129 game tracks, 1,484 games) and **NES-VMDB** (98,940 clips, 389 games):
  the most relevant domain data that exists, and the licences are not clear. Game
  soundtracks are copyrighted; transcription does not launder them. Do not train on these
  without a written licence. [Unresolved — and the main reason the domain-gap risk below
  cannot be fully fixed.]
- **Any Suno/Udio/Stable Audio output** as training data: terms forbid it or are unclear,
  and it would contaminate the provenance story.
- **Demucs-separated stems from copyrighted tracks**: the separation model is MIT but the
  outputs inherit the source licence. Separation is not a laundering step.

### 7.3 Unresolved licence items

1. **Soundfont.** FluidSynth itself is LGPL. The soundfont is the issue. GeneralUser GS
   and FluidR3_GM are both *commonly reported* as permissively licensed, but I did not
   verify either text. **Verify the exact terms of whichever is chosen and ship the licence
   file.** Unresolved.
2. **Evaluation themes.** If the blind test uses self-composed themes, they are owned and
   clean. If it uses held-out Slakh songs, the CC BY attribution must be shown in the demo
   credits.
3. **Steam/console disclosure.** If the shipped demo generates music at runtime, it is
   "live-generated AI content" and must be disclosed. If layers are pre-generated, it is
   "pre-generated" and must still be disclosed. Either way, plan for the label. [FACT]

### 7.4 Ethics of imitation

The design never imitates an artist. It conditions on a *theme the user supplies* and on
abstract musical properties (key, chords, intensity), not on a named style or a corpus of
one composer's work. There is no voice cloning, no artist-name prompting, and no training
on a living composer's catalogue. The output is MIDI, editable by the composer, who
retains authorship of the result. State this explicitly in the README — it is the single
strongest defence against the hostility documented in §9.

---

## 8. Baseline and headline metric

### 8.1 The baseline must be strong, or the result is worthless

Three baselines, in increasing strength:

- **B0 — Loop.** One layer, no adaptation. The thing small games actually ship.
- **B1 — Vertical layering (mute/filter).** The industry default applied to a single
  theme: derive "layers" by muting tracks and applying low-pass/EQ. This is the honest
  deterministic competitor and the one that matters. If the model cannot beat this, the
  ML is unjustified.
- **B2 — Prompted large model.** A local text-to-MIDI or text-to-audio model asked to
  "add a combat layer to this theme". Expected to fail the alignment constraints; included
  to prove the point rather than to win.

Report against all three. B1 decides the project.

### 8.2 Headline metric

> **Blind two-alternative forced-choice preference for Arranger layers over vertical
> layering (B1), on held-out themes, with a mixed-effects model controlling for listener
> and theme.**

Reported as a percentage with a 95% confidence interval, plus the trial count. A CV line
reads: *"68% blind preference over the industry-standard layering baseline (n=240 trials,
20 listeners, 12 held-out themes; 95% CI 61–74%)."*

Numbers above are **targets, not results**. Nothing has been measured.

### 8.3 Key secondary metric

> **Theme-locked novelty:** over a 20-minute simulated session, the percentage of 8-bar
> windows that are not near-duplicates of any earlier window, while still containing the
> theme's head motif above a chroma-similarity threshold.

Baselines: B0 scores 0% novel / 100% motif; a random-variation system scores high novelty
but low motif recall. The claim only holds if both numbers are high simultaneously. This
is the metric that captures "the music never gets boring but is still the same piece",
which is the actual player complaint.

---

## 9. Evaluation protocol

### 9.1 Automatic (primary, reproducible, no humans needed)

Held-out split by song. All metrics computed by a committed script from a recorded config
and seed; raw outputs in `results/`.

| ID | Metric | Definition | Target |
|---|---|---|---|
| A1 | Chord-tone compliance | % of generated onsets inside the active chord/scale, with a passing-tone allowance | ≥ 90% |
| A2 | Grid lock | % of onsets within ±20 ms of a 1/16 grid; downbeat onset rate | ≥ 95% |
| A3 | Loop seam ratio | distance(chroma+MFCC) across the loop point ÷ mean within-loop distance; < 1 means the seam is less surprising than normal music | < 0.8 |
| A4 | Intensity monotonicity | Spearman ρ between requested level and measured energy (onset density, RMS, spectral centroid) | ρ ≥ 0.8 |
| A5 | Structural fidelity | correlation of the generated layer's self-similarity matrix with the theme's | ≥ 0.6 |
| A6 | Non-duplicate rate | % of 8-bar windows not near-duplicates over 20 min | ≥ 90% |
| A7 | Motif recall | chroma correlation of the theme's head motif in each window | ≥ 0.8 |
| A8 | Landing error | ms between intended downbeat and audible layer entry, in the Godot build | 0 ms (by design) |
| A9 | Cost | generation time per 8 bars, CPU-only and GPU | < 100 ms CPU |

### 9.2 Human (small, local, unpaid)

Deliberately small because the owner cannot recruit a panel and CONTEXT.md rules out ideas
that depend on communities he cannot reach.

- **H1 — 2AFC preference** (the headline). 20 listeners × 12 trials, balanced ordering,
  randomised, no AI label. Mixed-effects logistic regression with random intercepts for
  listener and theme.
- **H2 — Seam detection.** "Did the music jump?" on model transitions vs. hard cuts vs.
  composer-authored transitions. Validates the seamlessness claim perceptually, not just
  numerically.
- **H3 — Theme recognition.** Three excerpts, one containing the theme. A validity check:
  if variation destroys identity, H1 is meaningless.

n=20 is enough to distinguish 65% from 50% with reasonable power; it is **not** enough to
claim a small effect. Say so.

### 9.3 Stress-testing the evaluation itself

Does this measure the real problem? Partly. Three honest weaknesses:

1. **Preference in isolation ≠ better game music.** A layer that sounds good alone may
   clash in context. Mitigation: also rate 5-minute play sessions holistically, and report
   the gap. Plut's study is the warning here: generative music scored *better* on
   immersion and emotional congruency but *worse* at matching specific game events. Both
   must be reported.
2. **Ablated ground truth is not composer ground truth.** The model is scored against
   removals, not against what a composer would have written. A1–A5 measure compliance, not
   taste. Only H1 touches taste, and only weakly.
3. **The head-motif metric can be gamed** by repeating the motif verbatim, which raises A7
   and lowers A6. That is why they are reported as a pair.

A game-task study (does the music change player behaviour or reported immersion?) is the
gold standard and is **out of scope**: it needs a finished game and 50+ players. Note it as
future work, do not promise it.

---

## 10. Architecture

```
OFFLINE (Windows 3060, or CPU)
┌──────────────────────────────────────────────────────────────────┐
│ Slakh2100 / Lakh MIDI (CC BY 4.0)                                │
│   └─ segment → key/chord/beat estimate → track-ablation labels    │
│        └─ tokenise (REMI + intensity + chord)                     │
│             └─ train conditional transformer (20–60M)             │
│                  └─ constrained decode (key/chord/grid/loop)      │
│                       └─ render stems (FluidSynth + soundfont)    │
│                            └─ optional: MRT2 re-render            │
└──────────────────────────────────────────────────────────────────┘
                              │  layer bank: L0..L3 per section
                              ▼
RUNTIME (Godot 4.7, deterministic)
┌──────────────────────────────────────────────────────────────────┐
│ game events ──► state aggregator (10 Hz)                          │
│                     └─► Conductor: rules → target intensity       │
│                          + one-bar lookahead                      │
│                              └─► AudioStreamInteractive           │
│                                   (next-bar transition, crossfade) │
│                                        └─► 48 kHz out             │
└──────────────────────────────────────────────────────────────────┘
```

The dashed boundary is the point: **ML on the left, rules on the right.** The runtime is
testable without a model, and the model is testable without the runtime. That separation is
what makes two months realistic.

---

## 11. Two-month plan

Aligned to the repo's phases. Assumes selection on 2026-11-11.

| Week | Dates | Deliverable | Exit test |
|---|---|---|---|
| 1 | 11-11 → 11-18 | Vertical slice: one theme, hand-authored layers, Godot scene, Conductor with next-bar transitions, no ML | A playable 60 s demo where music changes on the bar |
| 2 | 11-18 → 11-25 | Data pipeline: Slakh ingestion, segmentation, ablation labels, tokeniser, splits | Dataset builds reproducibly; a held-out song never appears in train |
| 3–4 | 11-25 → 12-09 | Train the Arranger; unconstrained first, then constrained decoding; A1–A5 harness | Beats B1 on A1/A2/A3; first samples are listenable |
| 5 | 12-09 → 12-16 | Integrate: model layers replace hand-authored ones; A8 landing error; latency budget | Zero-millisecond landing error in-engine |
| 6 | 12-16 → 12-23 | Evaluation: A6/A7 20-minute session, H1–H3 blind test, ablations | Headline number with CI; feature freeze |
| 7–8 | 12-23 → 01-04 | Write-up, video, CV bullets, interview guide, one-command reproduction | A stranger can reproduce the headline number |

**Scope discipline.** If week 3 slips, drop the constrained decoder to post-hoc filtering
and keep the evaluation. If week 5 slips, drop the Godot integration and demo in a
standalone player. Never drop the baseline comparison — without it there is no result.

---

## 12. Five-day zero-cost test

Purpose: kill or confirm the one assumption everything rests on — *that a trained symbolic
model beats mute/filter layering on held-out themes*.

**Day 1 — data.** Download Slakh2100 (tens of GB, inside the 100 GB budget). Build the ablation triples for
a 200-song subset. Verify split integrity. Output: a dataset card and a tokenised shard.

**Day 2 — model.** Train a 20–30M conditional transformer on the subset. No constraints
yet. A few hours on the 3060. Output: a checkpoint that produces something.

**Day 3 — constraints and automatic metrics.** Add key/chord masks, grid quantisation and
loop wrap. Run A1–A5 on 20 held-out songs against B1. Output: a table.

**Day 4 — listening test.** Render 10 held-out themes × 2 intensities × {model, B1}.
Run a 2AFC with 12–15 local listeners (friends, classmates; unpaid; no panel service).
Output: a preference rate with a CI.

**Day 5 — decide.** Write `docs/DECISIONS.md` against the kill criteria below.

**Cost:** zero. Everything is local, open-licence and already on disk or a free download.

**What would make the test misleading:** 12 listeners is noisy; a null result does not
prove the idea is bad, and a positive result does not prove it scales. Treat it as a
screen, not a verdict.

---

## 13. Demo

**The 60 seconds.**

0–10 s: a small top-down game. Quiet exploration, sparse music. A caption: *"one theme,
written once."*
10–25 s: enemies appear. On the next downbeat, drums and bass enter — visibly, on the beat.
The player does nothing special; the music just responds.
25–40 s: a mini-boss. Full arrangement. Then a toggle: *"same theme, no generated layers"* —
the music collapses to filtered mush (B1). The difference is audible in two seconds.
40–55 s: a 20-minute timelapse counter. Caption: *"0 repeated bars"*.
55–60 s: the layer stack shown as four waveforms, with the AI-generated ones highlighted.

**Why it lands:** the "toggle off" moment makes the ML visibly responsible. Most AI-music
demos ask you to judge quality; this one shows you a before and after.

**Failure mode:** if the generated layers sound like General MIDI, the demo dies. Mitigate
by choosing a style where MIDI is idiomatic (chiptune, lo-fi, synthwave) rather than
orchestral, and by rendering with a good soundfont.

---

## 14. Risks

| # | Risk | Severity | Mitigation | Residual |
|---|---|---|---|---|
| R1 | Model cannot beat mute/filter layering | **Fatal** | Five-day test before committing | High until tested |
| R2 | Generated layers sound cheap (MIDI timbre) | High | Pick an idiom where MIDI works; good soundfont; optional MRT2 render | Medium |
| R3 | Domain gap: Slakh is rock/pop, games are orchestral/electronic | High | Train on broad multi-track data; evaluate on self-composed themes in target styles; report the gap | Medium |
| R4 | Human evaluation is noisy and hard to recruit | High | Small n, within-subject design, automatic metrics as primary evidence | Medium |
| R5 | Prior art (AccoMontage-3, MMM) reduces novelty to "constraints + evaluation" | Medium | Own the evaluation and the runtime integration; cite honestly | Medium |
| R6 | Market is crowded and incumbents are better funded | Medium | Position as open, local, theme-preserving; do not claim to replace middleware | High |
| R7 | Composer/player hostility to AI music | Medium | Never imitate artists; output is editable MIDI; composer keeps authorship; disclose | Medium |
| R8 | Two-month scope (model + runtime + eval + write-up) | Medium | Strict phase gates; drop integration before dropping evaluation | Medium |
| R9 | MRT2 dependency proves unworkable | Low | It is optional by design | Low |
| R10 | Licence surprise (soundfont, eval audio) | Low | Verify before shipping; self-compose eval themes | Low |

---

## 15. Kill criteria

Stop, and record why in `docs/DECISIONS.md`, if **any** of these hold:

1. **Preference ≤ 55%** for model layers over B1 with a CI spanning 50%, after the day-4
   test is repeated once with more trials. *The ML adds nothing.*
2. **Chord-tone compliance < 85%** on held-out themes after constraints are implemented.
   *The constraints do not work.*
3. **Loop seam ratio ≥ 1.0.** *The "seamless" claim is false.*
4. **Generation takes > 1 s per 8 bars on CPU**, making the tool slower than a composer's
   copy-paste. *The workflow value disappears.*
5. **No licence-clean soundfont or evaluation audio can be found.** *Cannot publish.*
6. **Week 4 arrives with no listenable output.** *The model is not converging in the time
   available.*

Kill criterion 1 is the important one. Everything else is fixable.

---

## 16. Scoped fallback

If the Arranger fails but the rest works, the fallback is **not** another ML project. It is:

> **LiveScore Conductor — an open-source, model-free adaptive-music toolkit for Godot that
> takes a theme and a rule table and produces bar-quantised transitions, with a documented
> evaluation harness for seam audibility and repetition.**

That is a useful engineering artifact and a decent portfolio piece, but it fails the
project's ML-depth criterion and should not be presented as the flagship. Be explicit about
that rather than dressing it up.

A second fallback, if the model works but audio quality does not: ship the system as a
**MIDI-layer generator** for composers (a DAW-side tool, not a runtime), where the composer
renders with their own instruments. Smaller demo, cleaner value proposition.

---

## 17. Expansion paths

Only after the core result exists.

- **Paper (plausible, not strong).** ISMIR or NeurIPS Creative AI: "constrained
  intensity-conditioned arrangement with loop-safe decoding and a seam-audibility
  evaluation." The contribution is the task and the evaluation, not the architecture. A
  workshop paper is realistic; a main-conference paper is not, given AccoMontage-3.
- **Open source (most likely).** A Godot plugin plus a small model plus a dataset card.
  The Godot audio community is underserved compared with Unity, and the integration is
  already written. This is the path with the least additional work.
- **Startup (weak).** Reactional, Mubert, Wwise and Audiokinetic all occupy adjacent
  ground. A solo open-source tool is a better outcome than a startup pitch here.
- **Research extension (interesting).** Long-horizon control of live models — using a
  planner to steer MRT2 past its 20-second horizon. That is a genuinely open problem and a
  better paper than the core project, but it depends on MRT2 behaviour nobody has measured.

---

## 18. Open questions

1. **Does anyone specifically want layer generation?** No direct evidence found. One week of
   asking in r/GameAudio and r/gamedev would settle it, but the owner cannot validate a
   community he is not in, and CONTEXT.md rules that out as a dependency.
2. **Can a theme survive heavy variation and still be recognisable?** Unknown; H3 tests it.
3. **What does MRT2's 230M model actually sound like?** No published evaluation; the
   technical report is "forthcoming". Nobody should plan around it until someone listens.
4. **Does the stereo/48 kHz output of MRT2 survive being driven by generated MIDI?** Its
   MIDI conditioning is a per-frame pitch-state vector; dense polyphonic input may or may
   not be followed well. Unverified.
5. **Is Audiokinetic Strata (a pre-made adaptive music library) a direct competitor?** It
   appears in Audiokinetic's documentation navigation; pricing and scope not verified.
6. **Would a composer accept MIDI from a model?** The 11-composer study exists; its findings
   were not read here.

---

## 19. Summary judgement

LiveScore survives, barely, and only in a form the shortlist did not propose. The runtime
is not the product; the content pipeline is. The model must be small, symbolic, constrained
and offline. The evaluation must be a blind comparison against the boring baseline, because
that is the only thing that proves the ML is doing work.

If the five-day test shows the model cannot beat mute-and-filter, the honest conclusion is
that adaptive game music does not need a trained model, and the idea should be parked. That
is a real possible outcome and the report should be read as expecting it roughly half the
time.
