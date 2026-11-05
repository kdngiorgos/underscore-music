# LiveScore — sources

Compiled 2026-11-04. Every entry gives the direct URL, the date, what it supports, and how
far it was verified.

**Verification key**

- **A — direct**: page or PDF fetched and read in this session.
- **B — snippet**: content surfaced by the search tool, quoted with enough context to be
  reliable, but the page was not independently fetched.
- **C — secondary**: a third-party summary, vendor roundup, or forum post. Useful for
  leads, not for facts.
- **D — unverified**: seen only as a title, a navigation item, or a claim I could not check.

Where a source is a vendor, this is stated. Vendor performance numbers are never treated as
measurements.

---

## 1. Project context (local)

| Source | Date | Supports | Ver. |
|---|---|---|---|
| `AGENTS.md` (this repo) | 2026-11-04 | Hardware, honesty rules, hard limits, phase dates | A |
| `docs/EVALUATION_CRITERIA.md` | 2026-11-04 | The eight weighted criteria and required verdicts | A |
| `docs/SHORTLIST.md` | 2026-11-04 | The LiveScore one-paragraph brief and its stated risks | A |
| `CONTEXT.md` | 2026-11-04 | Owner's taste, constraints, "no dependence on communities he cannot reach" | A |

---

## 2. Magenta RealTime 2 — verified capabilities

| # | Source | Date | Supports | Ver. |
|---|---|---|---|---|
| S1 | https://magenta.withgoogle.com/magenta-realtime-2 | 2026-06-04 | Release date; 40 ms frames; ~200 ms control latency; 230M/2.4B; "any Apple Silicon MacBook incl. Air" for small; MLX/C++ engine; MIDI/text/audio control; fine-tuning announced as future work | **A** |
| S2 | https://github.com/magenta/magenta-realtime | ongoing | Apache-2.0 code; real-time streaming requires Apple Silicon; both models run offline on Apple Silicon **or NVIDIA GPU**; future updates will support supervised fine-tuning | **A** |
| S3 | https://huggingface.co/google/magenta-realtime-2 | 2026 | Weights CC-BY-4.0; terms of use; ~71k hours of stock music, mostly instrumental; SpectroStream 48 kHz stereo at 25 Hz / 64 RVQ; MusicCoCa 768-d; 128-dim MIDI multihot input; **20 s effective receptive field**; evaluation "forthcoming" | **A** |
| S4 | https://raw.githubusercontent.com/magenta/magenta-realtime/main/docs/models.md | 2026 | Device support table; model component breakdown; checkpoint layout | **A** |
| S5 | https://raw.githubusercontent.com/magenta/magenta-realtime/main/docs/benchmark.md | 2026 | A latency benchmark exists but is Apple/MLX only; **no public numbers** | **A** |
| S6 | https://arxiv.org/abs/2508.04651 | v1 2025-08-06, v3 2025-11-05 | "Live music models" definition; MRT v1 beats other open models on automatic quality metrics; Lyria RealTime is the API counterpart | **A** |
| S7 | https://arxiv.org/abs/2508.05207 | 2025-08-07 | SpectroStream codec (cited by the model card; not read) | B |
| S8 | https://mer.vin/2026/06/magenta-realtime-2-open-live-music-ai-on-mac-with-midi-audio-and-text-control/ | 2026-06 | Independent restatement of ~200 ms control latency; corroborates S1 | C |
| S9 | https://huggingface.co/babakarto/magenta-rt-local-windows | undated | Claims a Windows/12 GB PyTorch port with ~1.1 GB small weights | **D — do not build on this** |

**Note on S9.** A community port is not a supported path. Nothing in the official repo
promises real-time on NVIDIA, and the model card's `mlxfn` container is Apple-specific.
Plan for offline-only on the RTX 3060.

---

## 3. Adaptive/interactive music middleware — the baseline

| # | Source | Date | Supports | Ver. |
|---|---|---|---|---|
| S10 | https://www.audiokinetic.com/en/public-library/2025.1.1_9262/?source=Help&id=working_with_cues | Wwise 2025.1 docs | Interactive music is built from Music Segments, Tracks, sub-tracks, cues and Stingers; cues can trigger Events; Stingers needed for precise sync | **A** |
| S11 | https://www.audiokinetic.com/en/public-library/2025.1.12_9287/?source=Help&id=creating_interactive_music | Wwise 2025.1 docs | Chapter structure: understanding interactive music, music hierarchies, transitions, Stingers, MIDI | **A** (nav + body) |
| S12 | https://www.audiokinetic.com/en/community/blog/the-interactive-music-of-wylde-flowers | undated | Worked example of Stinger-based adaptive music in a shipped game | B |
| S13 | https://www.fmod.com/docs/2.04/studio/glossary.html | FMOD 2.04 | Parameters, transition timelines, quantisation (glossary entry points) | **B** — page fetch returned empty; content inferred from indexed snippets |
| S14 | https://qa.fmod.com/t/seamless-transitions-for-complicated-adaptive-music-systems/19480 | undated | Practitioners hit real seam/transition problems with layered adaptive music | C |
| S15 | https://docs.godotengine.org/en/stable/classes/class_audiostreaminteractive.html | Godot 4.7 | **`AudioStreamInteractive`**: clips + transition table; transitions on next beat / next bar / end; crossfade in beats; filler clips; auto-advance. MIT-licensed engine. | **A** |
| S16 | https://docs.godotengine.org/en/stable/tutorials/audio/audio_streams.html | Godot 4.7 | AudioStream basics; context for S15 | **A** |
| S17 | https://elias.audio/ | undated | ELIAS positions itself explicitly against FMOD/Wwise as a music-first adaptive engine | C |
| S18 | https://www.gamedeveloper.com/audio/composing-adaptive-music-for-video-games-using-elias | undated | Composer-facing workflow for adaptive composition in ELIAS | C |

**Use of these sources:** S15 is the most consequential. A free, MIT-licensed engine already
does bar-quantised interactive music. Any project claiming "the music responds to the game"
as its novelty is competing with a built-in feature.

---

## 4. Commercial generative/adaptive competitors

| # | Source | Date | Supports | Ver. |
|---|---|---|---|---|
| S19 | https://reactionalmusic.com/engine/ | 2026 (© line) | Note-by-note generation with virtual instruments; claimed **<5 ms** control latency; Unity/Unreal; Wwise via Audio Input, FMOD via Programmer Sound; analyses commercial tracks for tempo/harmony; API `SetControl("Intensity", …)`, `TriggerStinger` | **A — vendor claims** |
| S20 | https://docs.reactionalmusic.com | undated | Integration docs exist (referenced from S19, not read) | D |
| S21 | https://gamedevaihub.com/best-ai-music-generators-indie-games/ | 2026 | Survey of 15+ AI music tools aimed at indie games; Mubert marketed as "best adaptive" with SDK/API and game-state input; Wondera claimed to respond to gameplay state; AIVA/Soundraw/Soundverse/Ecrett/Sonauto pricing and licensing; explicit statement that custom indie scores run $2,000–$20,000 | **A — secondary/vendor roundup** |
| S22 | https://www.audiocipher.com/post/adaptive-music-machine-learning | undated | Frames Reactional and Infinite Album as ML-driven adaptive music for games | C |
| S23 | https://musically.com/2023/10/23/ai-music-startup-infinite-album-goes-live-with-desktop-app/ | 2023-10-23 | Infinite Album shipped a real-time generative soundtrack product for streamers/games | C |
| S24 | https://forum.defold.com/t/melodrive-an-ai-adaptive-music-system/26626 | undated | Melodrive marketed "infinite stream of original, emotionally variable music in realtime" — evidence the pitch has been tried before | C |
| S25 | https://www.audiokinetic.com/en/public-library/strata/ | undated | Audiokinetic ships a library product ("Strata") referenced in Wwise docs navigation; **scope and pricing not verified** | **D** |

---

## 5. Academic prior art

| # | Source | Date | Supports | Ver. |
|---|---|---|---|---|
| S26 | https://arxiv.org/abs/2310.16334 | NeurIPS 2024 (v4 2024-11-25) | **AccoMontage-3**: lead sheet → piano arrangement → multi-track orchestration, VQ + multi-stream Transformer for long-term style; claims better coherence and structure than baselines. The closest prior art to "arrange a theme". | **A** |
| S27 | https://dl.acm.org/doi/abs/10.1145/3555858.3555947 | 2022 | **PreGLAM-MMM**: MMM transformer extends a composed adaptive score with variation stems; 48-participant study | **B** |
| S28 | https://summit.sfu.ca/item/35366 | 2022 | Full thesis text: generative score performed comparably to linear music and **outperformed composed adaptive music** on emotional congruency, immersion and preference, while the composed score better matched specific game events | **B** — substantial abstract/quotes surfaced |
| S29 | https://caleplut.com/?p=130 | undated | Author's own summary: "our score is highly adaptive but has a very limited amount of musical content… we use MMM to expand it" | **A** |
| S30 | https://nime.org/proceedings/2026/nime2026_128.pdf | NIME 2026 | 98-novice usability study of two MMM variants — shows this line of work is still active in 2026 | B |
| S31 | https://arxiv.org/abs/2207.01698 | 2022-07-04 | Transformer adaptive-music architecture: generates layers, arousal/valence selects them; explicit statement that arousal maps to number of active layers | **A** |
| S32 | https://www.sciencedirect.com/science/article/abs/pii/S1875952119300795 | 2020 | Plut & Pasquier, "Generative music in video games: state of the art, challenges and prospects" — the canonical survey; notes academic/industry gulf | B |
| S33 | https://repositorio-aberto.up.pt/bitstream/10216/161336/2/684342.pdf | 2024 | MSc thesis on adaptive music in games; conventional horizontal/vertical framing | B |
| S34 | https://arxiv.org/abs/2605.22717 | 2026-05-21 | **Live Music Diffusion Models**: block-wise KV caching and ARC-Forcing make interactive diffusion competitive with discrete AR; runs locally on a consumer gaming laptop. Evidence the local-interactive frontier is moving fast and is contested by strong labs. | **A** |
| S35 | https://nime.org/proceedings/2026/nime2026_153.pdf | NIME 2026 | Speculative execution to mask diffusion latency in live gesture-controlled music | B |
| S36 | https://link.springer.com/article/10.1007/s10462-026-11582-x | 2026 | Survey of music generation: diffusion is hard to use interactively; discrete AR dominates live settings | B |

---

## 6. Data and licences

| # | Source | Date | Supports | Ver. |
|---|---|---|---|---|
| S37 | http://www.slakh.com/ | 2019 (WASPAA) | **Slakh2100**: 2,100 songs, 145 h, 4–48 tracks each, 34 instrument classes, aligned MIDI + rendered audio; **CC BY 4.0**; known duplicate-MIDI bug with a documented fix | **A** |
| S38 | https://colinraffel.com/projects/lmd/ | 2016 | **Lakh MIDI v0.1**: 176,581 files; **CC BY 4.0** | B |
| S39 | https://github.com/mdeff/fma | 2017 (ISMIR) | **FMA**: 106,574 tracks, per-track CC; metadata CC BY 4.0; *"We do not hold the copyright on the audio… The dataset is meant for research purposes."* | **A** |
| S40 | https://transactions.ismir.net/articles/381/files/6adb41ce8b65e.pdf | 2025/26 | **MuVGM**: 7,129 tracks, 1,484 games, 39 consoles; alignment of symbolic + audio + metadata. Licence unclear. | B — PDF fetch failed |
| S41 | https://arxiv.org/html/2404.04420v1 | 2024 | **NES-VMDB**: 98,940 gameplay clips from 389 NES games with symbolic soundtracks. Licence unclear. | B |
| S42 | https://facebookresearch.github.io/audiocraft/model_cards/MUSICGEN_MODEL_CARD.html | 2023 | MusicGen weights **CC-BY-NC 4.0**; melody variant conditions on chromagram; FAD 4.93, chroma cosine 0.44 on their card | B |
| S43 | https://github.com/facebookresearch/audiocraft | 2023 | Confirms CC-BY-NC weights | B |
| S44 | https://creativecommons.org/licenses/by/4.0/legalcode | — | Text of CC BY 4.0 (attribution obligations) | D — standard, not re-read |

**Unresolved licence items:** soundfont choice (GeneralUser GS vs FluidR3_GM terms not
verified); licence status of any game-music evaluation set; Steam disclosure obligations for
a shipped demo.

---

## 7. Reception, disclosure and ethics

| # | Source | Date | Supports | Ver. |
|---|---|---|---|---|
| S45 | https://arxiv.org/html/2512.02785v1 | 2025-12-02 (CHB Reports) | 178-participant study: identical tracks rated **3.18/5 when framed as soundtracks vs 2.88/5 when framed as AI** (p<.001); AI attitudes are the strongest predictor of liking; listeners identify AI music by "excessive repetition, rigid or unnatural structure, atypical harmonic progressions" | **A** |
| S46 | https://link.springer.com/article/10.1007/s00146-025-02601-6 | 2025 (AI & Society) | 43-musician interview study; dominant concern is uncompensated training data, not tool use; "double standard" where musicians welcome tools that displace others | **B** — substantial quoted content |
| S47 | https://eprints.whiterose.ac.uk/id/eprint/203688/1/KJW%20TOG%20Preprint.pdf | 2023 (ACM TOG) | 11 professional game composers interviewed about AI music technology | **D** — PDF could not be fetched; findings not read |
| S48 | https://store.steampowered.com/news/group/4145017/view/3862463747997849618 | 2024-01 | Steam requires disclosure of pre-generated and live-generated AI content; player reporting system for live-generated content | B |
| S49 | https://www.videogameschronicle.com/news/valve-has-significantly-rewritten-steams-rules-for-how-developers-much-disclose-ai-use/ | 2026-01 | Valve rewrote disclosure rules to focus on player-facing AI content; ~8,000 titles disclosed in H1 2025 vs ~1,000 in all of 2024 | B |
| S50 | https://www.pcgamer.com/software/ai/steam-updates-ai-disclosure-form-to-specify-that-its-focused-on-ai-generated-content-that-is-consumed-by-players-not-efficiency-tools-used-behind-the-scenes/ | 2026-01-16 | Confirms the January 2026 narrowing | B |
| S51 | https://www.ign.com/articles/stellar-blade-blood-rain-dev-shift-up-releases-entirely-ai-generated-k-pop-music-video-starring-evie-and-pretty-much-everyone-hates-it | 2026-07/08 | Backlash to an AI-generated music video for a major Korean game | B |
| S52 | https://www.gamereactor.eu/shift-up-receives-backlash-for-ai-generated-stellar-blade-music-video-1755233/ | 2026 | The specific backlash article cited in `SHORTLIST.md` | B |
| S53 | https://automaton-media.com/en/news/stellar-blade-blood-rain-technical-director-addresses-controversial-ai-generated-music-video-says-studio-will-draw-a-clear-line-between-experimental-and-in-game-content/ | 2026 | Studio drew a line between "experimental" and "in-game" content — evidence that in-game AI music is treated as a different category | B |

---

## 8. Market and cost evidence

| # | Source | Date | Supports | Ver. |
|---|---|---|---|---|
| S54 | https://www.twine.net/blog/video-game-music-cost-guide/ | undated | Indie score: 30–45 min, **$3,000–$15,000**, 5–10% of dev budget | C |
| S55 | https://www.gamesoundcon.com/post/game-audio-industry-survey-2023 | 2023 | 58% of freelance game composers charge per finished minute — consistent with adaptive work multiplying cost | B |
| S56 | https://vi-control.net/community/threads/what-options-do-i-have-when-scoring-an-indie-game.169777/ | undated | Developers arriving with $1,500–$2,000 music budgets and no sense of scope | C |
| S57 | https://www.reddit.com/r/gamedev/comments/1rj80mx/price_range_for_indie_game_music_unserious_people/ | 2026 | Composer reporting they can no longer justify 8–10 tracks for ≤$1,000 | C |
| S58 | https://discussions.unity.com/t/how-much-should-i-expect-to-pay-for-an-indie-game-music/506918?page=2 | undated | ~$300/finished minute with exclusive rights as a common quote | C |
| S59 | https://medium.com/@chris_composer/5-game-composers-answer-questions-about-writing-music-for-games-668873e13d9b | undated | Quotes of $4,000–$60,000 for a small indie score | C |

---

## 9. Sources that would change the verdict if read

These are the gaps that most limit confidence. Each is one fetch away and should be closed
before any commit of two months.

1. **S47** — the 11-composer study. If composers say they would refuse to use generated
   layers at all, the only viable user disappears.
2. **S27/S28** — the full PreGLAM-MMM evaluation. If it already establishes that generative
   layers beat composed adaptive layers, the novelty claim narrows to transitions and
   loops.
3. **S25** — Audiokinetic Strata. If a major vendor already sells pre-made adaptive cues at
   indie prices, the "solo dev without a composer" market is gone.
4. **S13** — FMOD's actual transition documentation, to state the baseline precisely rather
   than approximately.
5. **S9** — the Windows MRT2 port. If it is real and fast, the renderer story changes; the
   core design does not depend on it either way.
