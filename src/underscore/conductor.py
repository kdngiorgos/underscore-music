"""Deterministic game-state to intensity rules.

The conductor is intentionally model-free. It schedules changes at the next
bar boundary so the audible transition is sample-accurate even if the game loop
is running at 10 Hz or slower.
"""

from __future__ import annotations

from dataclasses import dataclass

INTENSITY_NAMES = ("exploration", "alert", "combat", "boss")


@dataclass(frozen=True)
class GameState:
    enemies_near: int = 0
    health: float = 1.0
    boss: bool = False
    recently_hit: bool = False


def target_intensity(state: GameState) -> int:
    """Map observable game state to one of four intensity levels."""
    if state.boss:
        return 3
    if state.enemies_near >= 2 or (state.enemies_near >= 1 and state.health < 0.55):
        return 2
    if state.enemies_near >= 1 or state.recently_hit:
        return 1
    return 0


def next_bar_time(now_seconds: float, bar_seconds: float, loop_start: float = 0.0) -> float:
    """Return the first bar boundary at or after now, in the audio clock."""
    if now_seconds <= loop_start:
        return loop_start
    elapsed = now_seconds - loop_start
    bars = elapsed / bar_seconds
    return loop_start + (int(bars) + 1) * bar_seconds
