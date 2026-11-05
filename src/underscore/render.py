"""Render the original theme into four loop-locked WAV mixes."""

from __future__ import annotations

import json
import math
import wave
from pathlib import Path

import numpy as np

from underscore.theme import BARS, BPM, SAMPLE_RATE, THEME, Note


def render_theme(output_dir: Path, *, sample_rate: int = SAMPLE_RATE) -> dict:
    bar_seconds = 60 / BPM * 4
    duration = BARS * bar_seconds
    samples = int(duration * sample_rate)
    output_dir.mkdir(parents=True, exist_ok=True)

    melody = _render_notes(THEME.melody, samples, sample_rate, kind="triangle", gain=0.42)
    harmony = _render_notes(THEME.harmony, samples, sample_rate, kind="sine", gain=0.16)
    bass = _render_notes(THEME.bass, samples, sample_rate, kind="saw", gain=0.26)
    counter = _render_notes(THEME.counter, samples, sample_rate, kind="square", gain=0.12)
    drums = _render_drums(samples, sample_rate)

    mixes = {
        "exploration": melody * 0.72 + harmony,
        "alert": melody * 0.78 + harmony + bass * 0.72,
        "combat": melody * 0.82 + harmony + bass * 0.9 + drums * 0.65,
        "boss": melody + harmony + bass + counter + drums,
    }
    metadata = {
        "title": THEME.name,
        "bpm": BPM,
        "bars": BARS,
        "bar_seconds": bar_seconds,
        "duration_seconds": duration,
        "sample_rate": sample_rate,
        "layers": list(mixes),
    }
    for name, audio in mixes.items():
        _write_wav(output_dir / f"{name}.wav", _normalize(audio), sample_rate)
    (output_dir / "metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    return metadata


def _render_notes(
    notes: tuple[Note, ...], samples: int, sample_rate: int, *, kind: str, gain: float
) -> np.ndarray:
    beat_seconds = 60 / BPM
    out = np.zeros(samples, dtype=np.float64)
    for note in notes:
        start = int(note.start_beat * beat_seconds * sample_rate)
        duration = note.duration_beats * beat_seconds
        length = min(samples - start, int(duration * sample_rate))
        if length <= 0:
            continue
        t = np.arange(length) / sample_rate
        frequency = 440.0 * 2 ** ((note.midi - 69) / 12)
        if kind == "triangle":
            wave = 2 * np.abs(2 * ((frequency * t) % 1) - 1) - 1
        elif kind == "saw":
            wave = 2 * ((frequency * t) % 1) - 1
        elif kind == "square":
            wave = np.sign(np.sin(2 * math.pi * frequency * t))
        else:
            wave = np.sin(2 * math.pi * frequency * t)
        attack = min(int(0.012 * sample_rate), length)
        release = min(int(0.12 * sample_rate), max(0, length - attack))
        envelope = np.ones(length)
        envelope[:attack] = np.linspace(0, 1, attack)
        if release:
            envelope[-release:] *= np.linspace(1, 0, release)
        out[start : start + length] += wave * envelope * note.velocity * gain
    return out


def _render_drums(samples: int, sample_rate: int) -> np.ndarray:
    beat_seconds = 60 / BPM
    out = np.zeros(samples, dtype=np.float64)
    rng = np.random.default_rng(7)
    for bar in range(BARS):
        bar_start = bar * 4 * beat_seconds
        for beat in (0.0, 2.0):
            start = int((bar_start + beat) * sample_rate)
            length = min(int(0.16 * sample_rate), samples - start)
            if length > 0:
                t = np.arange(length) / sample_rate
                kick = np.sin(2 * math.pi * 58 * t) * np.exp(-t * 24)
                out[start : start + length] += kick * 0.8
        for beat in (1.0, 3.0):
            start = int((bar_start + beat) * sample_rate)
            length = min(int(0.11 * sample_rate), samples - start)
            if length > 0:
                t = np.arange(length) / sample_rate
                snare = rng.normal(0, 1, length) * np.exp(-t * 30) * 0.5
                out[start : start + length] += snare
        for step in range(8):
            start = int((bar_start + step * 0.5) * sample_rate)
            length = min(int(0.035 * sample_rate), samples - start)
            if length > 0:
                t = np.arange(length) / sample_rate
                hat = rng.normal(0, 1, length) * np.exp(-t * 90) * 0.16
                out[start : start + length] += hat
    return out


def _normalize(audio: np.ndarray) -> np.ndarray:
    rms = float(np.sqrt(np.mean(audio**2))) or 1.0
    target_rms = 0.13
    return np.tanh(audio / rms * target_rms)


def _write_wav(path: Path, audio: np.ndarray, sample_rate: int) -> None:
    pcm = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(sample_rate)
        handle.writeframes(pcm.tobytes())
