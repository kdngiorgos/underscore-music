"""UnderScore CLI."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from underscore.conductor import GameState, next_bar_time, target_intensity
from underscore.render import render_theme


def main() -> None:
    parser = argparse.ArgumentParser(prog="underscore")
    subparsers = parser.add_subparsers(dest="command", required=True)

    render_parser = subparsers.add_parser("render", help="Render the demo theme")
    render_parser.add_argument("--output", type=Path, default=Path("web/stems"))

    conductor_parser = subparsers.add_parser("conductor", help="Run the deterministic state rule")
    conductor_parser.add_argument("--enemies", type=int, default=0)
    conductor_parser.add_argument("--health", type=float, default=1.0)
    conductor_parser.add_argument("--boss", action="store_true")
    conductor_parser.add_argument("--bar-seconds", type=float, default=2.4)
    conductor_parser.add_argument("--now", type=float, default=0.0)

    args = parser.parse_args()
    if args.command == "render":
        print(json.dumps(render_theme(args.output), indent=2))
    elif args.command == "conductor":
        state = GameState(enemies_near=args.enemies, health=args.health, boss=args.boss)
        print(
            json.dumps(
                {
                    "target_intensity": target_intensity(state),
                    "next_bar_seconds": next_bar_time(args.now, args.bar_seconds),
                },
                indent=2,
            )
        )


if __name__ == "__main__":
    main()
