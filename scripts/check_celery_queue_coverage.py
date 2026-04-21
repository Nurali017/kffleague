#!/usr/bin/env python3
"""Fail CI when a queue in backend/app/tasks/__init__.py task_routes has no consumer.

Celery routes tasks to named queues via task_routes; workers consume a queue
only when started with "-Q <queue>". Forgetting the "-Q" flag means tasks
silently pile up in Redis with nobody to execute them — exactly how all
telegram posts were orphaned on 2026-04-21 until this guard was added.

Scans:
  * backend/app/tasks/__init__.py — extracts queue names from task_routes
  * docker-compose.prod.yml and docker-compose.media.yml — extracts -Q flags
    from every service command
  * Celery's implicit default queue "celery" is always considered covered
    (workers without -Q consume it automatically).

Exits 0 when every routed queue has at least one worker consuming it.
Exits 1 with a human-readable diff otherwise.
"""
from __future__ import annotations

import ast
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
TASKS_FILE = REPO / "backend" / "app" / "tasks" / "__init__.py"
COMPOSE_FILES = [
    REPO / "docker-compose.prod.yml",
    REPO / "docker-compose.media.yml",
]
# Celery's default queue. Any worker started without -Q consumes "celery".
IMPLICIT_DEFAULT_QUEUE = "celery"


def queues_from_task_routes(path: Path) -> set[str]:
    """Parse task_routes={"<task>": {"queue": "<name>"}} out of tasks/__init__.py."""
    if not path.is_file():
        raise SystemExit(f"Missing {path}")
    tree = ast.parse(path.read_text())
    queues: set[str] = set()
    for node in ast.walk(tree):
        if not isinstance(node, ast.Dict):
            continue
        for k, v in zip(node.keys, node.values):
            if (
                isinstance(k, ast.Constant)
                and k.value == "queue"
                and isinstance(v, ast.Constant)
                and isinstance(v.value, str)
            ):
                queues.add(v.value)
    return queues


_Q_FLAG_RE = re.compile(r"-Q\s+([A-Za-z0-9_,\-]+)")
_CMD_RE = re.compile(r"^\s*command:\s*(.+?)\s*$")


def queues_consumed_by_compose(path: Path) -> tuple[set[str], bool]:
    """Return (explicitly consumed queues, saw_worker_without_Q).

    A worker without -Q implicitly consumes the default queue "celery".
    """
    if not path.is_file():
        return set(), False
    queues: set[str] = set()
    saw_plain_worker = False
    for line in path.read_text().splitlines():
        m = _CMD_RE.match(line)
        if not m:
            continue
        cmd = m.group(1).strip("\"'")
        if "celery" not in cmd or "worker" not in cmd:
            continue
        flags = _Q_FLAG_RE.findall(cmd)
        if not flags:
            saw_plain_worker = True
            continue
        for group in flags:
            for q in group.split(","):
                q = q.strip()
                if q:
                    queues.add(q)
    return queues, saw_plain_worker


def main() -> int:
    routed = queues_from_task_routes(TASKS_FILE)
    consumed: set[str] = set()
    any_plain_worker = False
    for compose in COMPOSE_FILES:
        q, plain = queues_consumed_by_compose(compose)
        consumed.update(q)
        any_plain_worker = any_plain_worker or plain
    if any_plain_worker:
        consumed.add(IMPLICIT_DEFAULT_QUEUE)

    missing = sorted(routed - consumed)
    if missing:
        print("ERROR: celery queues have no consumer:", file=sys.stderr)
        for q in missing:
            print(f"  - {q}", file=sys.stderr)
        print(
            "\nAdd '-Q <queue>' to a worker command in docker-compose.*.yml, "
            "or drop the route from backend/app/tasks/__init__.py.",
            file=sys.stderr,
        )
        return 1

    print(f"OK: routed={sorted(routed)} consumed={sorted(consumed)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
