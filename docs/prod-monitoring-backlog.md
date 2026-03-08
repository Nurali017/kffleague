# Production Monitoring Backlog

## Сессия 2: 2026-03-07, 13:14–13:25 UTC (19:14–19:25 Astana)

**Контекст:** Матч #884 идет live (KPL 2026, тур 1). Прошло ~1 час после рестарта backend (12:04) и frontend (11:45).

### Сводка по серверу

| Метрика | Значение | Статус | Изменение vs Сессия 1 |
|---------|----------|--------|----------------------|
| RAM | 3744 / 7940 MB used (204 MB free, 4196 avail) | WARNING | Без изменений |
| Swap | 247 / 4096 MB used | OK | Без изменений |
| Disk / | 20G / 59G (35%) | OK | +1% |

### Сводка по контейнерам

| Container | CPU% | RAM | Errors (3h) | Status | Тренд |
|-----------|------|-----|-------------|--------|-------|
| qfl-frontend | **81.04%** | 277 MB | 60 fetch errors/hr | HIGH | Улучшение (было 184%) |
| qfl-backend | **45.79%** | **823 MB** | 1898 ASGI exceptions (3h) | CRITICAL | Ухудшение RAM (было 805MB) |
| qfl-db | **7.66%** | 420 MB | **1422 "too many clients"** (3h) | CRITICAL | Ухудшение (было 75/hr) |
| onesport-admin | 5.30% | **940 MB** | 848 502s for kffleague (3h) | HIGH | Без изменений |
| qfl-celery-worker | 0.06% | 262 MB | 0 errors | OK | Улучшение |
| qfl-celery-beat | 0.00% | 85 MB | 0 | OK | Стабилен |
| qfl-redis | 0.63% | 16 MB | 0 | OK | Стабилен |
| qfl-minio | 0.00% | 233 MB | 0 | OK | Стабилен |
| qfl-admin | 0.00% | 46 MB | 0 | OK | Стабилен |

---

## P0 — CRITICAL

### 1. [qfl-db] Connection pool exhaustion — 1422 FATAL за 3 часа

- **Severity:** CRITICAL
- **Тренд:** УХУДШЕНИЕ (было 75/hr в Сессии 1, теперь 474/hr)
- **Конфигурация:** `max_connections = 100`, текущие: 36/100 (стабилизировалось после рестартов)
- **Лог (12:55-12:57 UTC — пик):**
```
2026-03-07 12:55:12.172 UTC FATAL: sorry, too many clients already
2026-03-07 12:55:12.193 UTC FATAL: sorry, too many clients already
2026-03-07 12:55:12.234 UTC FATAL: sorry, too many clients already
2026-03-07 12:57:38.779 UTC FATAL: sorry, too many clients already  (x13 за 1 секунду)
```
- **Каскадный эффект:**
  - Backend: 1898 ASGI exceptions, 259 gunicorn worker restarts за 3 часа
  - Frontend: 60+ `SocketError`/`ECONNRESET` за час
  - Nginx: 848 502 Bad Gateway для kffleague за 3 часа
- **Причина:** Во время live матча сотни одновременных запросов к backend → каждый gunicorn worker открывает DB connections → pool overflow → PG отвечает "too many clients"
- **SQLAlchemy traceback:**
```
File "/usr/local/lib/python3.11/site-packages/sqlalchemy/pool/impl.py", line 169, in _do_get
File "/usr/local/lib/python3.11/site-packages/sqlalchemy/pool/base.py", line 393, in _create_connection
File "/usr/local/lib/python3.11/site-packages/sqlalchemy/pool/base.py", line 898, in __connect
    self.dbapi_connection = connection = pool._invoke_creator(self)
```
- **Рекомендация:**
  1. **Срочно:** Увеличить `max_connections` до 200 в postgresql.conf
  2. **Срочно:** Настроить SQLAlchemy pool: `pool_size=5, max_overflow=10` (ограничить per-worker)
  3. **Долгосрочно:** Поставить PgBouncer перед PostgreSQL
  4. **Долгосрочно:** Уменьшить gunicorn workers с 4 до 2

### 2. [qfl-backend] 1898 ASGI exceptions + 259 worker restarts за 3 часа

- **Severity:** CRITICAL
- **Тренд:** НОВАЯ ПРОБЛЕМА (раньше были 500-ки от missing column `source`, теперь от connection exhaustion)
- **Лог (пик в 10:26-10:33 — 30 exceptions за 7 минут):**
```
[2026-03-07 10:33:07 +0000] [158] [ERROR] Exception in ASGI application  (x6 за 1 секунду)
[2026-03-07 10:33:08 +0000] [158] [ERROR] Exception in ASGI application  (x2 за 1 секунду)
```
- **Worker restarts (10:26-11:30 — 20 restarts):**
```
[2026-03-07 11:22:41 +0000] [1405] Worker exiting (pid: 1405)
[2026-03-07 11:22:44 +0000] [1467] Booting worker with pid: 1467
[2026-03-07 11:26:16 +0000] [1455] Worker exiting (pid: 1455)
[2026-03-07 11:26:18 +0000] [1528] Booting worker with pid: 1528
```
- **Причина:** Connection pool exhaustion → worker hangs → gunicorn kills + restarts worker
- **Рекомендация:** Решится после P0#1 (увеличение max_connections + настройка pool)

### 3. [qfl-db] Несанкционированные подключения + рестарт БД

- **Severity:** CRITICAL
- **Лог (08:12 UTC):**
```
FATAL: terminating connection due to administrator command  (x45 подключений)
FATAL: the database system is shutting down  (x5)
```
- **Лог (отдельные попытки):**
```
FATAL: role "postgres" does not exist
FATAL: database "qfl" does not exist
FATAL: role "qfl" does not exist
FATAL: role "app" does not exist
```
- **Причина:** БД была перезапущена в 08:12 UTC (вероятно вручную). Попытки подключения с несуществующими ролями — либо сканирование, либо misconfigured клиенты.
- **Рекомендация:**
  1. Убедиться что PG не доступен извне Docker network
  2. Добавить `pg_hba.conf` правила для reject неизвестных ролей
  3. Мониторить логи на попытки брутфорса

---

## P1 — HIGH

### 4. [qfl-backend] 26,919 ответов 404 за 3 часа (player stats)

- **Severity:** HIGH
- **Тренд:** УХУДШЕНИЕ (было 8,283/hr, теперь ~9,000/hr)
- **Лог:**
```
GET /api/v1/players/362/stats?season_id=200&lang=ru HTTP/1.1  404
GET /api/v1/players/2628/stats?season_id=200&lang=ru HTTP/1.1  404
GET /api/v1/players/988/stats?season_id=200&lang=ru HTTP/1.1   404
GET /api/v1/players/418/stats?season_id=200&lang=ru HTTP/1.1   404
... (сотни уникальных player IDs)
```
- **Статистика за 1 час:** 9111 из 9568 ответов (95.2%) = 404
- **Причина:** Сезон 200 только начался → у игроков нет индивидуальной статистики → endpoint возвращает 404. Frontend всегда запрашивает stats для каждого игрока.
- **Влияние:** 26,919 бесполезных запросов в 3 часа → давление на DB и backend
- **Рекомендация:**
  1. Endpoint `/players/:id/stats` должен возвращать `200` с пустым объектом вместо 404
  2. Frontend: не запрашивать stats если сезон только начался, или кешировать ответ

### 5. [qfl-backend] 500 ошибка на `/players/325/teammates` — продолжается

- **Severity:** HIGH
- **Тренд:** БЕЗ ИЗМЕНЕНИЙ (ошибка из Сессии 1 не исправлена)
- **Лог:**
```
GET /api/v1/players/325/teammates?season_id=200&limit=10&lang=ru  500
GET /api/v1/players/325/teammates?season_id=200&limit=10&lang=kz  500
```
- **Root cause (traceback):**
```python
File "/app/app/api/players.py", line 293, in get_player_teammates
    player_team = player_team_result.scalar_one_or_none()
# sqlalchemy.exc.MultipleResultsFound: Multiple rows were found when one or none was required
```
- **Причина:** Игрок #325 зарегистрирован в нескольких командах в сезоне 200
- **Рекомендация:** Заменить `.scalar_one_or_none()` на `.first()` в `players.py:293`

### 6. [qfl-frontend] 81% CPU + fetch errors

- **Severity:** HIGH
- **Тренд:** УЛУЧШЕНИЕ (было 184% CPU в Сессии 1, теперь 81%)
- **RAM:** 277 MB (было 423 MB) — тоже улучшение
- **Fetch errors за час:** 60 (было 778)
- **Лог:**
```
TypeError: fetch failed
  [cause]: SocketError: other side closed
TypeError: fetch failed
  [cause]: Error: read ECONNRESET
```
- **Причина:** Backend перегружен → сбрасывает соединения → frontend SSR получает errors. Плюс SSR генерирует каждую страницу при каждом запросе.
- **Трафик на game 884:** 23,596 запросов к backend за 1 час (только один live матч!)
- **Total backend requests:** 89,413 за 1 час
- **Рекомендация:**
  1. ISR с revalidate=15-30s для match pages
  2. Client-side polling для live events вместо SSR
  3. nginx proxy_cache для static API responses (table, team info)

### 7. [onesport-admin] Nginx 940 MB RAM + 848 502s

- **Severity:** HIGH
- **Тренд:** БЕЗ ИЗМЕНЕНИЙ
- **Лог:**
```
[error] recv() failed (104: Connection reset by peer) while reading response header from upstream,
  client: 95.182.104.30, server: kffleague.kz, upstream: "http://172.18.0.6:8000/..."
[error] connect() failed (111: Connection refused) while connecting to upstream,
  client: 2.76.180.15, server: 1sportkz.com, upstream: "http://172.18.0.6:3000/..."
```
- **Причина:** Backend сбрасывает connections (перегружен), nginx получает 502
- **Рекомендация:** Решится после P0#1 + P1#6. Дополнительно: proxy_cache для hot endpoints

---

## P2 — MEDIUM

### 8. [qfl-db] Высокие sync times на checkpoints

- **Severity:** MEDIUM
- **Лог:**
```
checkpoint complete: wrote 676 buffers; sync=23.204 s (longest=5.159 s, average=0.704 s)
checkpoint complete: wrote 511 buffers; sync=10.746 s (longest=4.438 s, average=0.430 s)
```
- **Причина:** Disk I/O pressure. Sync times 10-23 секунд = диск не успевает за write load
- **Рекомендация:**
  1. Увеличить `checkpoint_completion_target` до 0.9
  2. Увеличить `wal_buffers` до 64MB
  3. Рассмотреть SSD-backed storage

### 9. [qfl-backend] Gunicorn "Bad file descriptor" warning

- **Severity:** MEDIUM
- **Лог:**
```
[2026-03-07 12:16:16 +0000] [211] [INFO] Error while closing socket [Errno 9] Bad file descriptor
```
- **Причина:** Workers crash/restart, оставляют open sockets
- **Рекомендация:** Симптом P0#1/P0#2. Решится после стабилизации connection pool.

---

## P3 — LOW

### 10. [qfl-admin] Стабилен

- CPU: 0.00%, RAM: 46 MB
- Без ошибок

### 11. [qfl-redis] Стабилен

- CPU: 0.63%, RAM: 16 MB
- Без ошибок

### 12. [qfl-minio] Стабилен

- CPU: 0.00%, RAM: 233 MB
- Без ошибок

### 13. [qfl-celery-beat] Работает корректно

- sync-live-events каждые 15 сек (ожидаемо)
- check-upcoming-games каждые 5 мин
- end-finished-games каждые 10 мин
- sync-live-stats каждые 2 часа

### 14. [qfl-celery-worker] Стабилен (улучшение)

- CPU: 0.06%, RAM: 262 MB
- Без ошибок за последний час
- Sync tasks успешно выполняются:
```
Task sync_live_game_events succeeded in 6.68s: {'active_games': 1, 'total_new_events': 0}
```

---

## Приоритизированный план действий

| # | Действие | Severity | Ожидаемый эффект | Статус |
|---|----------|----------|------------------|--------|
| 1 | Увеличить PG `max_connections` до 200 | CRITICAL | Устранение "too many clients" (1422 FATAL/3h) | TODO |
| 2 | Настроить SQLAlchemy pool: `pool_size=5, max_overflow=10` | CRITICAL | Ограничение connections per worker | TODO |
| 3 | Fix `players.py:293` — `.first()` вместо `.scalar_one_or_none()` | HIGH | -500 errors на /teammates | TODO |
| 4 | Player stats endpoint: 200 + пустой объект вместо 404 | HIGH | -9000 404/hr, снижение нагрузки | TODO |
| 5 | ISR для match/player pages (revalidate=15-30s) | HIGH | Снижение frontend CPU с 81% до ~15% | TODO |
| 6 | Redis кеширование hot endpoints (table, game stats) | HIGH | Снижение backend CPU и DB нагрузки | TODO |
| 7 | ~~ALTER TABLE game_events ADD COLUMN source~~ | ~~CRITICAL~~ | ~~Было в Сессии 1~~ | DONE (исправлено) |
| 8 | PgBouncer перед PostgreSQL | MEDIUM | Долгосрочная стабильность connections | TODO |
| 9 | Docker log rotation | MEDIUM | Снижение disk I/O | TODO |

---

## Сравнение Сессия 1 vs Сессия 2

| Проблема | Сессия 1 (12:38) | Сессия 2 (13:14) | Тренд |
|----------|-----------------|-----------------|-------|
| Frontend CPU | 184% | 81% | Улучшение (рестарт) |
| Frontend errors/hr | 778 | 60 | Улучшение |
| Backend CPU | 57% | 46% | Улучшение |
| Backend RAM | 805 MB | 823 MB | Ухудшение |
| DB "too many clients"/hr | 75 | 474 | УХУДШЕНИЕ |
| ASGI exceptions (3h) | N/A | 1898 | НОВОЕ |
| Worker restarts (3h) | N/A | 259 | НОВОЕ |
| 404 rate/hr | 8,283 | 9,000+ | Ухудшение |
| Player 325 500s | 107/hr | Продолжается | Без исправления |
| `game_events.source` errors | 338/hr | 0 | ИСПРАВЛЕНО |
| nginx 502s (kffleague) | ~1000/hr | 283/hr | Улучшение |

---

*Следующий мониторинг рекомендуется после внедрения P0 исправлений (max_connections, pool settings).*
