from pathlib import Path

from underscore.render import render_theme


def test_render_outputs_four_loop_locked_mixes(tmp_path: Path) -> None:
    metadata = render_theme(tmp_path)
    assert metadata["bars"] == 8
    assert metadata["bpm"] == 100
    assert len(metadata["layers"]) == 4
    for name in metadata["layers"]:
        assert (tmp_path / f"{name}.wav").stat().st_size > 100_000
