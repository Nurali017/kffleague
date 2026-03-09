# Production Monitoring Backlog

## Сессия 3: 2026-03-08, 09:51–11:15 UTC (15:51–17:15 Astana) — 6 snapshot'ов за 1.5 часа

**Контекст:** Матч #889 live (KPL 2026). Вчера задеплоены критические фиксы: `max_connections=200`, SQLAlchemy `pool_size=5/max_overflow=10`, gunicorn workers 4→2, player stats 200. Мониторинг подтверждения фиксов + поиск новых проблем. Также мониторинг самого сервера на предмет ресурсных ограничений.

### Сервер: Intel Xeon 4-core, 8 GB RAM, 14 контейнеров

| Метрика | S1 (09:51) | S2 (09:58) | S3 (10:10) | S4 (10:33) | S5 (10:53) | S6 (11:15) | Статус |
|---------|-----------|-----------|-----------|-----------|-----------|-----------|--------|
| **Load avg** | **6.64** | **8.14** | **7.75** | **9.46** | **6.90** | **7.66** | **CRITICAL** |
| RAM used | 2.9G | 2.9G | 2.9G | 2.9G | 2.9G | 2.9G | OK (4.8G avail) |
| Free RAM | 259M | 262M | 245M | 228M | 268M | 413M | OK |
| Swap | 259M | 274M | 274M | 272M | 272M | 269M | OK |
| Disk | 32% | — | — | — | — | 32% | OK |

### Сводка по QFL контейнерам (CPU% min–max за сессию)

| Container | CPU% range | RAM range | Errors/hr | Status | vs Сессия 2 |
|-----------|-----------|-----------|-----------|--------|-------------|
| qfl-frontend | **13–144%** | 167–260 MB | 1 (Server Action) | **HIGH** | CPU ~same, errors FIXED |
| qfl-backend | 6–44% | 410–453 MB | 0 | OK | CPU ↓↓, RAM ↓↓, errors FIXED |
| qfl-db | 0.7–12% | 233–251 MB | 0 | OK | "too many clients" FIXED |
| qfl-celery-worker | 0.2–20% | 222–256 MB | 0 | OK | Стабилен |
| qfl-celery-beat | 0.00% | 90 MB | 0 | OK | Стабилен |
| qfl-redis | 0.6–0.7% | 14 MB | 0 | OK | Стабилен |
| qfl-minio | 0.00% | 266–325 MB | 0 | OK | Стабилен |
| qfl-admin | 0.00–2.5% | 35–42 MB | 0 | OK | Стабилен |

### Не-QFL контейнеры (тоже потребляют ресурсы сервера)

| Container | CPU% range | RAM | Роль |
|-----------|-----------|-----|------|
| onesport-backend | **17–52%** | 184–196 MB | 1sport API |
| onesport-admin (nginx) | 3.7–7.4% | **986 MB–1.35 GB** | Reverse proxy |
| postgres (onesport) | 6.5–17.6% | 404–443 MB | 1sport DB |
| fbackend | 0–16% | 131–140 MB | Неизвестный сервис |
| kffleague-php | 0.00% | 46–48 MB | Legacy PHP |
| kffleague-db | 0.01% | 59–63 MB | Legacy MariaDB |

### Трафик за сессию

| Snapshot | Requests/10min | 404s | 500s | Game 889 req |
|----------|---------------|------|------|-------------|
| S1 (09:51) | 3,210 | 7 | 0 | 1,239 |
| S2 (09:58) | 3,211 | 16 | 0 | — |
| S3 (10:10) | 4,749 | 8 | 0 | — |
| S4 (10:33) | 6,046 | 5 | 0 | — |
| S5 (10:53) | 3,706 | 73 | 0 | 277 |
| S6 (11:15) | 1,133 | 2 | 0 | — |

### DB состояние (стабильно)

| Метрика | Значение | Статус |
|---------|----------|--------|
| Connections | 16/200 (8–10 idle, 1–2 active) | OK |
| Cache hit ratio | 99.99% | OK |
| shared_buffers | 512 MB | OK |
| work_mem | 4 MB | OK |
| "idle in transaction" | 0–2 (кратковременно в S4–S5) | WATCH |

---

### Подтверждённые фиксы (P0 вчерашние — ВСЕ РАБОТАЮТ)

| Проблема | Сессия 2 (7 марта) | Сессия 3 (8 марта) | Результат |
|----------|-------------------|-------------------|-----------|
| DB "too many clients" | 474 FATAL/hr | **0** за 1.5 часа | **FIXED** |
| ASGI exceptions | 1898/3h | **0** | **FIXED** |
| Worker restarts | 259/3h | **0** | **FIXED** |
| Backend CPU | 46% avg | **8–44%** (avg ~18%) | **IMPROVED** |
| Backend RAM | 823 MB | **410–453 MB** | **IMPROVED** (-45%) |
| 500 errors | Десятки/hr | **0** за 1.5 часа | **FIXED** |
| 404 rate | 9,000/hr | **~70/hr** | **FIXED** (-99%) |
| Frontend fetch errors | 60/hr | **0** | **FIXED** |
| nginx 502s | 283/hr | **0** (визуально) | **FIXED** |

---

## P0 — CRITICAL (новые/обновлённые)

### 1. [СЕРВЕР] Load average 7.8 avg на 4 ядрах — перегрузка 195%

- **Severity:** CRITICAL
- **Тренд:** НОВАЯ ПРОБЛЕМА (ранее не мониторился сервер целиком)
- **Данные за сессию:**
  - min: 6.64 (S1), max: **9.46** (S4, пик матча), avg: ~7.8
  - 4 ядра = load > 4.0 означает очередь процессов
  - Load **9.46 = 237%** ёмкости CPU
- **Распределение CPU по потребителям (пиковый S4):**
  - qfl-frontend: 144% (~1.4 ядра)
  - onesport-backend: 36% (~0.4 ядра)
  - qfl-backend: 18% (~0.2 ядра)
  - postgres (onesport): 15% (~0.15 ядра)
  - qfl-db: 10% (~0.1 ядра)
  - Итого видимый: ~2.3 ядра, + kernel overhead + IO wait = 9.46 load
- **Риски:**
  - При 2+ одновременных live матчах load может дойти до 15+ → system freeze
  - Нет запаса на рост трафика
  - swap 270 MB = умеренное давление на RAM
- **Рекомендация (приоритет):**
  1. **Срочно:** ISR на frontend → снизит CPU с ~144% до ~15% (экономия 1.3 ядра)
  2. **Среднесрочно:** Апгрейд до 8 ядер (или вынести onesport на отдельный сервер)
  3. **Среднесрочно:** nginx proxy_cache для hot API endpoints (table, game info)

### 2. [qfl-db] 93% rollback rate — 1.65M rollbacks vs 133K commits

- **Severity:** CRITICAL
- **Тренд:** НОВАЯ ПРОБЛЕМА (не отслеживалось ранее)
- **Данные:**
  - Начало сессии: commits=118,121 / rollbacks=1,570,236 (93.0%)
  - Конец сессии: commits=132,640 / rollbacks=1,648,597 (92.5%)
  - За 1.5 часа: +14,519 commits, +78,361 rollbacks (соотношение 5.4:1)
- **Вероятные причины:**
  1. SQLAlchemy `AUTOBEGIN` → каждый SELECT = BEGIN + ROLLBACK (если нет commit)
  2. Накопленные rollbacks от вчерашнего connection exhaustion
  3. Pool recycling при connection errors
- **Влияние:** Высокая нагрузка на WAL, дополнительный disk I/O
- **Рекомендация:**
  1. Проверить SQLAlchemy: используется ли `autocommit` для read-only queries
  2. Сбросить статистику: `SELECT pg_stat_reset()` для чистого baseline
  3. Перемониторить rollback ratio после сброса

### 3. [qfl-db] Massive seq scans — отсутствующие индексы

- **Severity:** CRITICAL (влияет на CPU и IO)
- **Тренд:** УХУДШЕНИЕ (сессия 2 фиксировала N+1, но не конкретные таблицы)
- **Данные (cumulative с последнего restart):**

| Таблица | Seq scans | Idx scans | Проблема |
|---------|-----------|-----------|----------|
| seasons | **760,019** | 10,817 | N+1: каждый запрос сканирует все 12 строк |
| teams | **487,000** | 469,786 | 50% seq scan |
| championships | **170,853** | 4,556 | N+1 |
| countries | **131,785** | 319,844 | 30% seq scan |
| game_broadcasters | **112,585** | **0** | **Нет индексов вообще** |
| stages | **108,287** | **0** | **Нет индексов вообще** |
| broadcasters | **95,837** | **0** | **Нет индексов вообще** |
| score_table | **83,883** | **0** | **Нет индексов вообще** |

- **Рекомендация:**
  1. **Срочно:** Создать индексы на `game_broadcasters`, `stages`, `broadcasters`, `score_table`
  2. **Срочно:** Кеширование `seasons` (12 строк, 760K scans — идеально для Redis/in-memory)
  3. Eager loading для `teams` и `championships` в API handlers

---

## P1 — HIGH (обновлённые)

### 4. [qfl-frontend] CPU spikes 13–144% (SSR без кеширования)

- **Severity:** HIGH
- **Тренд:** БЕЗ УЛУЧШЕНИЙ (было 81% avg в С2, сейчас ~80% avg, пик 144%)
- **Паттерн:** Spiky — быстро вырастает до 134–144%, потом падает до 13–46%
- **RAM:** 167–260 MB (улучшение vs 277 MB в С2)
- **Fetch errors:** 0 (FIXED, было 60/hr)
- **Новая ошибка (единичная):**
```
Error: Failed to find Server Action "x". This request might be from an older or newer deployment.
```
- **Причина:** SSR рендерит каждую страницу при каждом запросе, нет ISR/кеша
- **Влияние:** Потребляет ~1.3 из 4 ядер на пике — главный потребитель CPU сервера
- **Рекомендация:** ISR с `revalidate=15-30s` для match/player pages (первый приоритет)

### 5. [qfl-backend] Gunicorn "Bad file descriptor" — продолжается

- **Severity:** MEDIUM (понижено, было P2#9)
- **Тренд:** Продолжается, но не критично (2 warning за сессию)
- **Лог:**
```
[2026-03-08 09:46:11 +0000] [818] [INFO] Error while closing socket [Errno 9] Bad file descriptor
[2026-03-08 09:46:54 +0000] [807] [INFO] Error while closing socket [Errno 9] Bad file descriptor
```
- **Причина:** Gunicorn пытается закрыть уже закрытый socket. Не вызывает ошибок для пользователей.

### 6. [СЕРВЕР] 3 zombie mariadb процессов

- **Severity:** LOW
- **Данные:**
```
root 1011662 Mar02 [mariadb] <defunct>
root 3335169 Mar06 [mariadb] <defunct>
root 3339151 Mar06 [mariadb] <defunct>
```
- **Причина:** `kffleague-db` (legacy MariaDB) оставляет zombie processes
- **Рекомендация:** `docker restart kffleague-db` или добавить `init: true` в docker-compose

### 7. [СЕРВЕР] onesport-admin nginx: 986 MB–1.35 GB RAM

- **Severity:** MEDIUM
- **Тренд:** БЕЗ ИЗМЕНЕНИЙ (было 940 MB в С2)
- **Причина:** nginx reverse proxy кеширует в RAM. На сервере с 8 GB это значительно.
- **Рекомендация:** Проверить `proxy_cache` размеры, рассмотреть ограничение `worker_connections`

---

## P3 — OK (без проблем)

| Container | CPU | RAM | Статус |
|-----------|-----|-----|--------|
| qfl-celery-worker | 0.2–20% | 222–256 MB | Tasks succeed в 3–8s |
| qfl-celery-beat | 0.00% | 90 MB | sync-live-events каждые 15s |
| qfl-redis | 0.6–0.7% | 14 MB | Стабилен |
| qfl-minio | 0.00% | 266–325 MB | Стабилен |
| qfl-admin | 0.00–2.5% | 35–42 MB | Стабилен |

---

## Ёмкость сервера: нужен ли апгрейд?

### Текущие ресурсы: 4 vCPU / 8 GB RAM / 59 GB HDD

| Ресурс | Использование | Запас | Оценка |
|--------|--------------|-------|--------|
| **CPU** | **195% avg, 237% peak** | **ОТРИЦАТЕЛЬНЫЙ** | **НУЖЕН АПГРЕЙД** |
| RAM | 2.9G used / 4.8G avail | ~2G запаса | Достаточно |
| Swap | 270 MB / 4 GB | 3.7G свободно | OK |
| Disk | 18G / 59G (32%) | 41G свободно | OK |

### Что потребляет CPU (avg за сессию):
1. **qfl-frontend SSR**: ~80% (~0.8 ядра) — **МОЖНО ОПТИМИЗИРОВАТЬ**
2. **onesport-backend**: ~35% (~0.35 ядра) — не наш код
3. **qfl-backend**: ~18% (~0.18 ядра) — OK
4. **postgres (onesport)**: ~12% (~0.12 ядра) — не наш код
5. **qfl-db**: ~6% (~0.06 ядра) — OK
6. **onesport-admin nginx**: ~5% — OK
7. Остальные: ~5%

### Сценарии:

**Сценарий A: ISR на frontend (code change)**
- Ожидаемое снижение frontend CPU: 80% → ~10%
- Экономия: ~0.7 ядра
- Load avg: 7.8 → ~5.3 (ещё выше 4.0, но терпимо)
- **Стоимость:** 0 (код)

**Сценарий B: Апгрейд до 8 ядер**
- Load avg / capacity: 7.8/8 = 97.5% — впритык
- **С ISR:** 5.3/8 = 66% — комфортно
- **Стоимость:** ~$30-50/мес доп.

**Сценарий C: Вынести onesport на отдельный сервер**
- Экономия: ~0.5 ядра CPU + 1.5 GB RAM
- **Стоимость:** отдельный сервер

### Рекомендация:
1. **Сначала ISR** (бесплатно, -0.7 ядра)
2. **Потом оценить** — если load всё ещё >5, апгрейд до 8 ядер
3. **Долгосрочно** — разделить onesport и qfl на разные серверы

---

## Обновлённый приоритизированный план действий

| # | Действие | Severity | Ожидаемый эффект | Статус |
|---|----------|----------|------------------|--------|
| 1 | ~~Увеличить PG `max_connections` до 200~~ | ~~CRITICAL~~ | ~~Устранение "too many clients"~~ | **DONE** ✓ |
| 2 | ~~Настроить SQLAlchemy pool: `pool_size=5, max_overflow=10`~~ | ~~CRITICAL~~ | ~~Ограничение connections per worker~~ | **DONE** ✓ |
| 3 | ~~Gunicorn workers 4→2~~ | ~~CRITICAL~~ | ~~Снижение connection pressure~~ | **DONE** ✓ |
| 4 | ~~Player stats 200: пустой объект вместо 404~~ | ~~HIGH~~ | ~~-9000 404/hr~~ | **DONE** ✓ (404 упали на 99%) |
| 5 | ISR для match/player pages (revalidate=15-30s) | **CRITICAL** | -0.7 ядра CPU, снижение load avg 7.8→5.3 | TODO |
| 6 | Индексы: `game_broadcasters`, `stages`, `broadcasters`, `score_table` | **CRITICAL** | Устранение 400K+ seq scans | TODO |
| 7 | Redis кеш для `seasons` (12 строк, 760K scans) | HIGH | Снижение DB нагрузки | TODO |
| 8 | Fix `players.py:293` — `.first()` вместо `.scalar_one_or_none()` | HIGH | -500 errors на /teammates | TODO |
| 9 | nginx proxy_cache для hot endpoints (table, game info) | HIGH | Снижение backend load | TODO |
| 10 | Исследовать PG rollback ratio 93% | MEDIUM | Снижение WAL/IO нагрузки | TODO |
| 11 | Апгрейд сервера до 8 ядер (если ISR недостаточно) | MEDIUM | Запас CPU для роста | TODO |
| 12 | PgBouncer перед PostgreSQL | MEDIUM | Долгосрочная стабильность | TODO |
| 13 | Docker log rotation | LOW | Снижение disk I/O | TODO |

---

## Сравнение Сессия 1 vs Сессия 2 vs Сессия 3

| Проблема | Сессия 1 (7 марта, 12:38) | Сессия 2 (7 марта, 13:14) | Сессия 3 (8 марта, 09:51–11:15) | Тренд |
|----------|--------------------------|--------------------------|--------------------------------|-------|
| Server load avg | N/A | N/A | **7.8 avg / 9.46 peak** | НОВОЕ |
| Frontend CPU | 184% | 81% | **13–144% (avg ~80%)** | Без изменений |
| Frontend errors/hr | 778 | 60 | **0** | **FIXED** |
| Backend CPU | 57% | 46% | **8–44% (avg ~18%)** | **IMPROVED** |
| Backend RAM | 805 MB | 823 MB | **410–453 MB** | **IMPROVED (-45%)** |
| DB "too many clients" | 75/hr | 474/hr | **0** | **FIXED** |
| ASGI exceptions | N/A | 1898/3h | **0** | **FIXED** |
| Worker restarts | N/A | 259/3h | **0** | **FIXED** |
| 500 errors | Десятки | Десятки | **0** | **FIXED** |
| 404 rate/hr | 8,283 | 9,000+ | **~70** | **FIXED (-99%)** |
| DB connections | overflow | 36/100 | **16/200** | **FIXED** |
| nginx 502s/hr | ~1000 | 283 | **~0** | **FIXED** |
| PG rollback rate | N/A | N/A | **93%** | НОВОЕ |
| Seq scans (seasons) | N/A | N/A | **760K** | НОВОЕ |

---

*Следующий мониторинг рекомендуется после ISR и индексов (пункты 5, 6, 7).*

---

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
