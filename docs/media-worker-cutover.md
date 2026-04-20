# Media Worker Cutover

## Что это

Этот runbook выносит `goal-video` pipeline на отдельный сервер через Celery-очередь `media`.

После cutover:
- `sync_goal_videos_task` исполняется только на втором сервере;
- `post_goal_video_task` fallback-ом тоже исполняется на втором сервере;
- `frontend`, `backend API`, live-воркеры, `Postgres`, `Redis` и `MinIO` остаются на основном сервере;
- goal-video attach в Telegram идёт с `media`-хоста: сначала напрямую из локального temp-файла, при ошибке — fallback через MinIO.

## Что должно быть готово

- На основном сервере задеплоен backend image, в котором `app.tasks.goal_video_tasks.sync_goal_videos_task` маршрутизируется в очередь `media`.
- На втором сервере подняты локальные SSH-туннели на primary:
  - `127.0.0.1:15432` -> primary `Postgres:5432`
  - `127.0.0.1:16379` -> primary `Redis:6379`
  - `127.0.0.1:19000` -> primary `MinIO:9000`
- На втором сервере есть:
  - Docker / Docker Compose
  - этот репозиторий
  - файл `.env.media`
  - каталог секретов, указанный в `MEDIA_SECRETS_DIR`
  - Google service account JSON по пути `GOOGLE_SERVICE_ACCOUNT_FILE`
  - Telethon session-файл по пути `TELETHON_SESSION_PATH`

## Файлы второго сервера

- Compose: `docker-compose.media.yml`
- Env: `.env.media`
- Пример env: `.env.media.example`
- Deploy script: `deploy/deploy-media.sh`

## Cutover

### 1. Поднять media-worker на втором сервере

```bash
cp .env.media.example .env.media
# заполнить private endpoints, credentials, GOOGLE_DRIVE_GOALS_FOLDER_ID
# и TELETHON_* / TELEGRAM_* для video attach

bash deploy/deploy-media.sh
```

Проверить:

```bash
docker compose --env-file .env.media -f docker-compose.media.yml logs -f media_worker
```

Нужно увидеть успешный старт Celery worker без ошибок подключения к Redis/Postgres/MinIO.
Так как `docker-compose.media.yml` использует `network_mode: host`, контейнер ходит в локальные SSH-туннели media-хоста по `127.0.0.1`.

### 2. Переключить основной сервер

На основном сервере:
- задеплоить backend image с новым routing на очередь `media`
- убедиться, что `celery_beat` получает `GOOGLE_DRIVE_ENABLED=true` и `GOAL_VIDEO_SYNC_INTERVAL_MINUTES`
- перезапустить как минимум `celery_beat`

После этого scheduled `goal-video` задачи начнут попадать в очередь `media`.

Важно:
- на основном сервере не должно быть worker, который слушает очередь `media`
- остальные `telegram` задачи остаются на основном сервере

### 3. Smoke test

Проверить по одному реальному или тестовому ролику:
- задача уходит в очередь `media`
- второй сервер её забирает
- объект появляется в `goal_videos/...` в текущем MinIO
- у соответствующего `GameEvent` обновляется `video_url`
- video attach в Telegram проходит с локального temp-файла media-хоста
- если прямой attach не удался, `post_goal_video_task` уходит в `media` как fallback

## Rollback

Если cutover неудачный:

1. На втором сервере остановить media-worker:

```bash
docker compose --env-file .env.media -f docker-compose.media.yml stop media_worker
```

2. В backend вернуть route `sync_goal_videos_task` и `post_goal_video_task` с `media` на прежние очереди.

3. На основном сервере задеплоить backend с rollback-изменением и перезапустить:
- `celery_beat`
- основной Celery worker

После rollback `goal-video` снова будет исполняться на primary.

## Наблюдаемость

Минимальный набор проверок после включения:
- логи `media_worker`
- наличие новых объектов в `goal_videos/...`
- обновление `GameEvent.video_url`
- выполнение `post_goal_video_task`
- отсутствие `ffmpeg`-нагрузки на основном сервере в окно ingest
