#!/usr/bin/env python3
"""Fail CI when a feature flag declared in app/config.py is missing from compose.

When a new `*_enabled: bool = False` (or similar feature toggle) is added to
Settings but nobody wires the matching FOO_BAR_ENABLED env var into
docker-compose.prod.yml, containers silently run with the default False and
the feature appears broken in prod. This has happened three times on QFL:
TELEGRAM_PUBLIC_POSTS_ENABLED, TELEGRAM_TOUR_ANNOUNCE_ENABLED, and
TELEGRAM_MATCH_START_ENABLED — each caught only when something user-visible
didn't post.

Scans:
  * backend/app/config.py — collects Settings fields matching feature-flag
    patterns (names ending in _enabled, starting with telegram_/fcms_/sota_,
    etc., where the value is a bool).
  * docker-compose.prod.yml, docker-compose.media.yml — collects all
    `FOO_BAR=...` keys present in any `environment:` list anywhere.

Exits 0 when every Settings flag appears in at least one compose environment
block. Exits 1 with the list of unmatched flags otherwise.

Allow-list: flags that are intentionally backend-only and not meant to be
configurable per deploy (e.g. tests) can be added to ALLOWLIST below.
"""
from __future__ import annotations

import ast
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CONFIG_FILE = REPO / "backend" / "app" / "config.py"
COMPOSE_FILES = [
    REPO / "docker-compose.prod.yml",
    REPO / "docker-compose.media.yml",
]

# Patterns for Settings field names we treat as "must be configurable in prod."
# We focus on feature flags (*_enabled) and anything that gates external IO.
FEATURE_FLAG_PATTERNS = (
    re.compile(r".*_enabled$"),
    re.compile(r"^telegram_"),
    re.compile(r"^telethon_"),
)

# Fields that we explicitly do NOT require to be in compose.
ALLOWLIST: set[str] = {
    # Internal toggles with sane code defaults, not user-facing knobs:
    "goal_video_ai_fallback_enabled",
    "goal_video_transcode_enabled",
}


def feature_flags_from_config(path: Path) -> list[str]:
    """Extract Settings field names matching feature-flag patterns."""
    tree = ast.parse(path.read_text())
    flags: list[str] = []
    for node in ast.walk(tree):
        if not (isinstance(node, ast.ClassDef) and node.name == "Settings"):
            continue
        for stmt in node.body:
            if not isinstance(stmt, ast.AnnAssign) or not isinstance(stmt.target, ast.Name):
                continue
            name = stmt.target.id
            if name in ALLOWLIST:
                continue
            if any(p.match(name) for p in FEATURE_FLAG_PATTERNS):
                flags.append(name)
    return flags


_ENV_LINE_RE = re.compile(r"^\s*-\s*([A-Z][A-Z0-9_]+)\s*=")


def env_vars_from_compose(path: Path) -> set[str]:
    """Collect every FOO_BAR key appearing in any `environment:` list entry."""
    if not path.is_file():
        return set()
    out: set[str] = set()
    in_env = False
    env_indent = 0
    for line in path.read_text().splitlines():
        stripped = line.lstrip(" ")
        indent = len(line) - len(stripped)
        if re.match(r"^environment:\s*$", stripped):
            in_env = True
            env_indent = indent
            continue
        if in_env and stripped and indent <= env_indent and not stripped.startswith("-"):
            in_env = False
        if in_env:
            m = _ENV_LINE_RE.match(line)
            if m:
                out.add(m.group(1))
    return out


def main() -> int:
    flags = feature_flags_from_config(CONFIG_FILE)
    env_keys: set[str] = set()
    for compose in COMPOSE_FILES:
        env_keys.update(env_vars_from_compose(compose))

    missing = []
    for flag in flags:
        if flag.upper() not in env_keys:
            missing.append(flag)

    if missing:
        print("ERROR: Settings feature flags missing from compose env:", file=sys.stderr)
        for f in missing:
            print(f"  - {f} (expected env key {f.upper()})", file=sys.stderr)
        print(
            "\nAdd '- FOO_BAR=${FOO_BAR:-<default>}' to the relevant service "
            "in docker-compose.prod.yml, or add the field to ALLOWLIST in this "
            "script if it is truly code-internal.",
            file=sys.stderr,
        )
        return 1

    print(f"OK: {len(flags)} feature flags all wired into compose env.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
