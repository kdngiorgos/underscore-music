import pytest

from underscore.conductor import GameState, next_bar_time, target_intensity


def test_intensity_rules() -> None:
    assert target_intensity(GameState()) == 0
    assert target_intensity(GameState(enemies_near=1)) == 1
    assert target_intensity(GameState(enemies_near=2)) == 2
    assert target_intensity(GameState(enemies_near=1, health=0.4)) == 2
    assert target_intensity(GameState(boss=True)) == 3


def test_next_bar_time() -> None:
    assert next_bar_time(0.0, 2.4) == 0.0
    assert next_bar_time(1.0, 2.4) == pytest.approx(2.4)
    assert next_bar_time(2.4, 2.4) == pytest.approx(4.8)
    assert next_bar_time(5.0, 2.4) == pytest.approx(7.2)
