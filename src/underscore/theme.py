"""The original theme and its four intensity arrangements.

This is the Week 1 fixture: original, deterministic and owned by the project.
It is deliberately hand-authored so the runtime can be tested before the
symbolic arranger exists.
"""

from __future__ import annotations

from dataclasses import dataclass

BPM = 100
BEATS_PER_BAR = 4
BARS = 8
SAMPLE_RATE = 44100
INTENSITIES = ("exploration", "alert", "combat", "boss")


@dataclass(frozen=True)
class Note:
    midi: int
    start_beat: float
    duration_beats: float
    velocity: float = 0.8
    instrument: str = "lead"


@dataclass(frozen=True)
class Theme:
    name: str
    bpm: int
    bars: int
    chords: tuple[tuple[int, ...], ...]
    melody: tuple[Note, ...]
    bass: tuple[Note, ...]
    harmony: tuple[Note, ...]
    counter: tuple[Note, ...]


# A minor / F major / C major / G major, repeated for eight bars.
CHORDS = (
    (57, 60, 64),  # Am
    (53, 57, 60),  # F
    (48, 52, 55),  # C
    (55, 59, 62),  # G
    (57, 60, 64),
    (53, 57, 60),
    (48, 52, 55),
    (55, 59, 62),
)

MELODY = (
    Note(69, 0.0, 1.0),
    Note(72, 1.0, 0.5),
    Note(76, 1.5, 1.5),
    Note(74, 3.0, 0.5),
    Note(72, 3.5, 1.0),
    Note(69, 4.5, 0.5),
    Note(65, 5.0, 1.5),
    Note(67, 7.0, 1.0),
    Note(72, 8.0, 1.0),
    Note(76, 9.0, 0.5),
    Note(79, 9.5, 1.5),
    Note(76, 11.0, 0.5),
    Note(74, 11.5, 1.0),
    Note(72, 12.5, 0.5),
    Note(69, 13.0, 1.5),
    Note(67, 15.0, 1.0),
    Note(69, 16.0, 0.5),
    Note(72, 16.5, 0.5),
    Note(76, 17.0, 1.0),
    Note(74, 18.0, 0.5),
    Note(72, 18.5, 1.5),
    Note(69, 20.0, 1.0),
    Note(65, 21.0, 0.5),
    Note(67, 21.5, 2.0),
    Note(72, 24.0, 0.5),
    Note(76, 24.5, 0.5),
    Note(79, 25.0, 1.0),
    Note(81, 26.0, 0.5),
    Note(79, 26.5, 1.5),
    Note(76, 28.0, 0.5),
    Note(74, 28.5, 0.5),
    Note(72, 29.0, 1.5),
    Note(69, 31.0, 1.0),
)

BASS = tuple(
    Note(root - 12, bar * 4, 3.6, velocity=0.72, instrument="bass")
    for bar, chord in enumerate(CHORDS)
    for root in (min(chord),)
)

HARMONY = tuple(
    Note(pitch, bar * 4 + offset, 3.8, velocity=0.34, instrument="pad")
    for bar, chord in enumerate(CHORDS)
    for pitch in chord
    for offset in (0.0, 2.0)
)

COUNTER = (
    Note(81, 0.0, 0.5, 0.55, "counter"),
    Note(79, 1.0, 0.5, 0.55, "counter"),
    Note(76, 2.0, 0.5, 0.55, "counter"),
    Note(79, 3.0, 0.5, 0.55, "counter"),
    Note(77, 4.0, 0.5, 0.55, "counter"),
    Note(76, 5.0, 0.5, 0.55, "counter"),
    Note(72, 6.0, 0.5, 0.55, "counter"),
    Note(74, 7.0, 0.5, 0.55, "counter"),
)

THEME = Theme(
    name="Line of Sight",
    bpm=BPM,
    bars=BARS,
    chords=CHORDS,
    melody=MELODY,
    bass=BASS,
    harmony=HARMONY,
    counter=COUNTER,
)
