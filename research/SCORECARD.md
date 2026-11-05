# LiveScore — scorecard

Scored against `docs/EVALUATION_CRITERIA.md` on 2026-11-04.
Nothing in this project has been built or measured. Scores reflect research evidence only.

---

## 1. Weighted score

| # | Criterion | Weight | Score /10 | Points | Confidence in score |
|---|---|---:|---:|---:|---|
| 1 | Real problem and demand | 12 | **6** | 7.2 | Medium |
| 2 | ML depth and novelty | 18 | **5** | 9.0 | Medium |
| 3 | Evaluation rigor and baseline | 15 | **7** | 10.5 | Medium-high |
| 4 | 60-second demo impact | 15 | **8** | 12.0 | Medium |
| 5 | Feasibility in two months | 15 | **6** | 9.0 | Medium |
| 6 | Data and licence clarity | 10 | **8** | 8.0 | High |
| 7 | Differentiation and defensibility | 10 | **4** | 4.0 | High |
| 8 | Expansion optionality | 5 | **5** | 2.5 | Medium |
| | **Total** | **100** | | **62.2 → 62 / 100** | **Medium** |

**Verdict: Conditional.**

Not "advance", because the central technical claim is unproven and the market position is
weak. Not "park", because the underlying labour problem is real, the ML core is legitimate,
the data is clean, and five days of local work can settle the decisive question.

---

## 2. Per-criterion justification

### 1. Real problem and demand — 6/10

**For.** Adaptive music is genuinely expensive to produce: a cue with four intensity levels
is four synchronised cues, and indie scores are quoted at $3,000–$15,000 for 30–45 minutes.
Composers are paid per finished minute, so the multiplier is direct. Middleware solves the
*runtime*; nothing solves the *authoring*. That gap is real.

**Against.** No direct evidence that anyone is blocked specifically by layer authoring. I
found no survey, issue thread or forum discussion naming it. The user is ambiguous: solo
developers have no theme to extend, and composers — the ones with the problem — are the
group most hostile to AI music. The owner cannot validate either community, and
`CONTEXT.md` rules out depending on communities he is not in.

**What would raise it.** Five interviews with indie composers or audio leads confirming the
layer multiplier is their biggest cost. One week of asking, if the owner can reach anyone.

---

### 2. ML depth and novelty — 5/10

**For.** The task is real conditional generation under hard constraints: key, chord, metre,
bar grid, loop length, intensity. It needs a trained model, a self-supervised dataset
construction method (track ablation), constrained decoding, and ablations. That is more
than an API wrapper and it is trainable on the stated hardware.

**Against.** "Arrange a lead sheet into multiple tracks" was published at NeurIPS 2024
(AccoMontage-3). "Generate variation stems to extend a composed adaptive score" was
published in 2022 (PreGLAM-MMM) and has a 48-participant evaluation. Symbolic music
transformers are a well-trodden architecture. The genuinely new parts are narrow: intensity
conditioning, loop-safe decoding, and a seam-audibility evaluation. Nothing here is a new
method.

**Also.** The most interesting live model of 2026, MRT2, cannot be fine-tuned yet, so the
project cannot train at the audio level. That caps the ML depth at symbolic.

**What would raise it.** A novel decoding scheme that provably guarantees loop continuity
(not just empirically), or a long-horizon planner for live models that beats MRT2's 20-second
receptive field. Either would be a genuine contribution.

---

### 3. Evaluation rigor and baseline — 7/10

**For.** The evaluation is unusually clean for a generative-music project:

- held-out split by song, so no segment leakage;
- a strong, honest non-ML baseline (mute/filter layering) that is the actual industry default;
- automatic metrics that are cheap and reproducible (chord compliance, grid lock, loop-seam
  ratio, intensity monotonicity, non-duplicate rate, motif recall);
- a small blind 2AFC with a mixed-effects model;
- targets set in advance, and kill criteria with numbers.

**Against.** The headline depends on human preference, and the owner cannot recruit a large
or representative panel. n≈20 gives a wide CI and no power for small effects. The automatic
metrics measure *compliance*, not *taste*: a layer can be 100% in key and still be dull.
Ablated ground truth is removal, not composition. And a preference test in isolation does
not measure whether the music is better *in a game* — Plut's study found generative music
scored better on immersion but worse on event matching, which is exactly the confound.

**What would raise it.** A within-subject game-session rating alongside the 2AFC, and a
larger, better-recruited panel.

---

### 4. 60-second demo impact — 8/10

**For.** "Play the game, the music changes on the beat, then toggle the AI layers off and
hear it collapse" is understandable in ten seconds and makes the ML visibly responsible.
That toggle is the strongest single asset this idea has. The 60-second script in
`RESEARCH.md` §13 is concrete and shootable.

**Against.** Execution risk is high: General-MIDI timbre will make even a correct result
sound cheap, and a cheap-sounding music demo defeats itself. The demo also depends on a
playable game scene existing, which is extra work.

**What would raise it.** Choosing a genre where MIDI is idiomatic (chiptune, lo-fi,
synthwave) and using a good soundfont, or rendering through MRT2 if it proves usable.

---

### 5. Feasibility in two months — 6/10

**For.** The symbolic model is small (20–60M) and trains in hours on a 3060. Slakh2100 is
145 hours with aligned MIDI and audio, CC BY 4.0, one download. Godot's
`AudioStreamInteractive` already provides bar-quantised transitions, so the runtime is
integration rather than invention. Everything runs locally and free.

**Against.** Three subsystems in eight weeks: data pipeline, model plus constrained
decoding, and runtime plus evaluation. Each is individually feasible; together they are
tight. The blind test needs 20 listeners and a quiet room. The fallback renderer (MRT2) is
Mac-only for real-time, and the RTX 3060 can only run it offline. The owner has ~4 hours a
week, so all of this is agent-executed with no human in the loop for routine judgement.

**What would raise it.** Dropping the Godot integration to a standalone player, and using
held-out Slakh songs instead of self-composed themes for the listening test.

---

### 6. Data and licence clarity — 8/10

**For.** The primary training set is verified CC BY 4.0 with aligned multi-track MIDI, which
is exactly what the ablation task needs. Lakh MIDI is CC BY 4.0. The evaluation themes can
be self-composed and therefore owned outright. MRT2 weights are CC BY 4.0 with Google
disclaiming rights in outputs. No artist imitation is involved anywhere: conditioning is on
the user's own theme and on abstract musical properties, never on a named artist.

**Against.** Three unresolved items: the soundfont licence (must be checked and shipped),
the licence status of game-music datasets (MuVGM, NES-VMDB — both unusable without a
licence), and Steam's disclosure requirement for AI-generated content, which applies whether
the music is pre-generated or live.

**What would raise it.** Verifying one soundfont's terms and committing the licence file;
self-composing all evaluation themes.

---

### 7. Differentiation and defensibility — 4/10

**This is the criterion that sinks the idea as originally framed.**

The field is crowded at every layer:

- **Runtime:** Wwise, FMOD, and Godot's built-in `AudioStreamInteractive` (MIT, free).
- **Generative runtime:** Reactional (note-by-note, Wwise/FMOD bridges, claimed <5 ms),
  Mubert (game-state-driven streams via SDK), Wondera (claimed gameplay-reactive agents).
- **Content:** every major text-to-music service, plus AIVA and Soundraw, marketed directly
  at indie game developers with stems and looping.
- **Research:** AccoMontage-3 (NeurIPS 2024) for arrangement, PreGLAM-MMM for adaptive
  variation stems with a user study, plus a live 2026 line of work on interactive diffusion.

What is left is a narrow, defensible-enough niche: **open, local, theme-preserving layer
generation with guaranteed musical constraints and a published seam/repetition
evaluation.** That is a real gap, but it is a gap between well-funded neighbours, not a new
category. There is no moat beyond being first to publish this specific evaluation and
giving the tool away.

**What would raise it.** Evidence that incumbents cannot serve the theme-preserving case
(e.g., Reactional requires its own catalogue), or a constraint guarantee strong enough to be
a technical differentiator rather than a feature.

---

### 8. Expansion optionality — 5/10

**For.** An open-source Godot plugin plus a small model is a plausible, low-extra-cost
artifact, and Godot's audio tooling is underserved relative to Unity. A workshop paper at
ISMIR or NeurIPS Creative AI is realistic. The long-horizon-control extension (steering
MRT2 past 20 seconds) is a better paper than the core project.

**Against.** A main-conference paper is unlikely given AccoMontage-3. The startup path is
weak: three funded competitors and two dominant middleware vendors. The owner's stated
preference is against "better versions of something familiar", which this partly is.

**What would raise it.** A striking headline number that makes the evaluation itself
citable, or adoption by even a handful of Godot developers.

---

## 3. Required stress test

### 3.1 The strongest argument for the idea

Adaptive music costs a multiple of linear music because every cue must exist in three to
five synchronised versions, and that multiplier is paid in composer hours. The runtime for
adaptive music is already free and solved; the *content* is not. A model that takes one
theme and writes the missing layers — with hard guarantees on key, bar grid and loop
continuity, running locally, outputting editable MIDI the composer owns — attacks the
expensive half of a real production workflow while leaving the composer in control. That is
a defensible use of ML and it produces a demo that lands in ten seconds.

### 3.2 The strongest argument against the idea

The premise in the shortlist is already solved and the remaining gap is thin. Godot gives
away bar-quantised interactive music; Wwise and FMOD are industry standard; Reactional
already sells note-by-note generative adaptive music with middleware bridges; Mubert already
takes game state. Meanwhile the people with the actual pain — composers — are the group most
hostile to AI music, and the people who would accept AI music — solo developers — do not
have a theme to extend and are already served by cheap text-to-music. The project risks
being a well-engineered answer to a question that two better-resourced groups have already
answered differently.

### 3.3 The assumption most likely to kill it

**That a trained symbolic model produces layers listeners actually prefer to simply muting
and filtering the existing stems.**

If it does not, the ML is decorative: the deterministic baseline is cheaper, sample-accurate,
predictable, and already inside every engine. The five-day test exists solely to test this.

### 3.4 Falsifiable one-week test, zero cost, local hardware

Defined in full in `RESEARCH.md` §12. In one line: train a 20–30M conditional transformer on
a 200-song Slakh subset, add key/chord/grid/loop constraints, and run a 12–15 person 2AFC
against mute/filter layering on 10 held-out themes. Pass if preference ≥ 60% with a CI
excluding 50%, chord compliance ≥ 85%, and loop-seam ratio < 1.0.

### 3.5 Explicit kill criteria

1. Preference ≤ 55% (CI spanning 50%) after one repeat with more trials.
2. Chord-tone compliance < 85% on held-out themes with constraints enabled.
3. Loop-seam ratio ≥ 1.0.
4. Generation slower than 1 s per 8 bars on CPU.
5. No licence-clean soundfont or evaluation audio.
6. Week 4 with no listenable output.

### 3.6 Scoped-down fallback

**LiveScore Conductor:** a model-free, open-source Godot adaptive-music toolkit — rule table,
one-bar lookahead, bar-quantised transitions, plus a seam-audibility and repetition
evaluation harness. Useful engineering, honest portfolio piece, **fails the ML-depth
criterion**, and must not be presented as the flagship. A second fallback keeps the model
but drops the runtime: a DAW-side MIDI layer generator for composers.

### 3.7 Comparison with existing approaches

| Approach | Does it generate layers from *your* theme? | Guarantees key/bar/loop? | Local & free? | Open? |
|---|---|---|---|---|
| Wwise / FMOD / Godot layering | No — you author every layer | Yes (sample-accurate) | Godot yes; others conditionally | Godot yes |
| Reactional Engine | No — generates from its own material and analysis | Claims tight musical timing | No (commercial) | No |
| Mubert / hosted AI music | No — generates a stream, not your theme's layers | No | No | No |
| AccoMontage-3 (research) | Yes, orchestration from a lead sheet | Offline; not loop- or intensity-conditioned | Yes | Research code |
| **LiveScore (proposed)** | **Yes, intensity layers** | **By construction** | **Yes** | **Yes** |

The table is the whole case. Every row is true; the last row is narrow.

### 3.8 Why a trained model, not a prompted large model

A prompted model cannot take a specific theme and emit a layer that is sample-aligned to its
bar grid, in its key, over its exact chord changes, at its loop length, and that wraps
seamlessly at the loop point. MusicGen-melody conditions on a chromagram, not on bar-accurate
arrangement, and its weights are CC-BY-NC. A hosted model adds per-request cost, network
latency, a dependency the demo cannot survive, and a live-generated-content disclosure. The
trained model earns its place by **guaranteeing** what a prompt can only approximate, and by
running locally for free. An LLM-writing-MIDI baseline should still be run and reported, to
prove the point rather than assert it.

### 3.9 Licence and data risks

Verified: Slakh2100 and Lakh MIDI are CC BY 4.0; MRT2 weights are CC BY 4.0 with Google
disclaiming output rights; FMA is per-track CC and explicitly research-oriented, so it is
excluded.

Unresolved: the soundfont licence; the licence status of game-music datasets (MuVGM,
NES-VMDB), which are the most domain-relevant and are unusable as things stand; Steam's
disclosure obligations for a shipped demo.

Ethics: no artist imitation, no artist-name prompting, no training on a living composer's
catalogue, output is editable MIDI owned by the user. This is the strongest available defence
against the documented hostility, and it should be stated in the README rather than assumed.

### 3.10 Confidence

**Medium.** High confidence in the technical facts about MRT2, the middleware landscape, the
dataset licences and the Steam policy — all were checked against primary sources. Low
confidence in demand, because it is inferred from tool structure and pricing rather than
observed. The score could reasonably move 6 points either way once the five-day test and the
four unread sources in `SOURCES.md` §9 are closed.

---

## 4. Ranked reasons, one line each

1. **For:** the layer-authoring multiplier is the expensive half of adaptive music and nothing solves it.
2. **Against:** every neighbouring layer — runtime, generative runtime, content — is already occupied.
3. **Decides it:** whether a small trained arranger beats mute-and-filter on held-out themes.

---

**Total: 62/100. Verdict: Conditional. Confidence: medium.**
