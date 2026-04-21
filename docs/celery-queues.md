# Celery Queues

Single source of truth for **which queue is consumed by which worker**.
Enforced by `scripts/check_celery_queue_coverage.py` (runs in CI via
`.github/workflows/ci-guards.yml`).

## Queues

| Queue      | Consumer service (compose)      | `-Q` flag in command                       | Tasks routed here                                                                                                                                                        |
|------------|---------------------------------|--------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `celery`   | `celery_worker`                 | `-Q celery,telegram` (implicit default)    | Any task without an explicit route in `task_routes` (sync_tasks, ticket_tasks, weather_tasks, fcms_tasks, youtube_tasks, most of sync_tasks)                             |
| `telegram` | `celery_worker`                 | `-Q celery,telegram`                       | `post_match_start_task`, `post_match_finish_task`, `post_game_event_task`, `post_pregame_lineup_task`, `tour_announce_daily` (see `backend/app/tasks/telegram_tasks.py`) |
| `live`     | `celery_live_worker`            | `-Q live -Ofair`                           | `sync_live_game_events`, `sync_single_game`, `auto_start_live_games`, `auto_end_finished_games`, `fetch_pregame_lineups`                                                 |
| `media`    | media worker (`docker-compose.media.yml`, runs on kff.kz) | `-Q media`                 | `sync_goal_videos_task`, `post_goal_video_task` — ffmpeg-heavy work runs on the dedicated media host                                                                     |

## Rules

1. **Every queue listed in `task_routes`** (see
   `backend/app/tasks/__init__.py`) **MUST have a worker consuming it** via
   `-Q <queue>` in its compose `command:`. Celery workers without `-Q`
   consume the default `celery` queue only — tasks routed to any other
   queue silently pile up in Redis with no consumer.

2. **When adding a new queue:** update the table above, add a worker
   service in compose (or add the queue to an existing worker's `-Q`
   list), and the CI guard should pass.

3. **When adding a new task that uses an existing queue:** no
   infrastructure change needed, just add the route in `task_routes`.

## History

- **2026-04-21** — telegram queue had no consumer for ~1 week. All
  `.delay()`-ed match-start/match-finish/tour-announce tasks piled up
  orphaned in Redis. Fixed by adding `-Q celery,telegram` to
  `celery_worker` command and introducing this guard.
