# Production Monitoring Backlog

## P3 — SEO backlog

### Core Web Vitals cleanup for mobile-first SEO

- **Priority:** P3
- **Reason:** Search Console on `2026-04-12` shows no URL groups in `Good` for Core Web Vitals; mobile issues affect the largest share of search traffic.
- **Scope:**
  - Reduce `CLS` on desktop and mobile templates with reserved media dimensions and more stable async UI blocks.
  - Improve mobile `LCP` with better image delivery, `next/image`, and lighter above-the-fold payloads.
  - Improve mobile `INP` by deferring hydration for heavy widgets on match center and table surfaces.
  - Stabilize font rendering and late-loading layout regions that shift after hydration.
- **Acceptance:**
  - In the next 28-day GSC Core Web Vitals window, at least part of the affected URL groups returns to `Good`.
  - `CLS` stops appearing as a shared issue across both mobile and desktop reports.

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

### 3. [qfl-db] Massive seq scans — отсутствующие индексы — **DONE 2026-04-20** ✓

- **Severity:** ~~CRITICAL~~ (влияет на CPU и IO)
- **Тренд:** УХУДШЕНИЕ (сессия 2 фиксировала N+1, но не конкретные таблицы)
- **Фикс:** Индексы добавлены миграциями `b5c6d7e8f9g0_add_missing_indexes.py` (stages, teams, countries, championships), `f1e2d3c4b5a6_add_broadcasters.py` (broadcasters + game_broadcasters), `zx0y1z2a3b4c5_add_broadcaster_id_index.py`, `n2v3w4x5y6z7_add_score_table_team_id_index.py`, `p3q4r5s6t7u8_add_score_table_season_id_index.py`.
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

## Сессия 2026-04-21 — goal-video pipeline incident

**Контекст:** III тур 2-й Лиги. Live-матчи Ордабасы М–Хромтау, Жас Кыран–Талас, Туран М–Хан-Тәңірі М. Семь голов забито, у 6 из 7 `video_url = NULL`, хотя клипы в Google Drive уже были. Текстовые оповещения в Telegram ушли, видеоклипы — нет.

### 8. [goal-video-sync] Cursor advancing past delayed Drive-index entries — **FIXED 2026-04-21 commit `be7adbc`**

- **Severity:** HIGH (блокировал отправку всех видео голов сегодня)
- **Где:** `qfl-backend/app/services/goal_video_sync_service.py`, задача `sync_goal_videos_task` на очереди `media` (media-host `kff.kz`).
- **Симптомы:** 18+ итераций подряд `listed=0, matched=0`, хотя в `GOOGLE_DRIVE_GOALS_FOLDER_ID` лежат свежезалитые клипы.
- **Корень:**
  - Google Drive индексирует `modifiedTime` с задержкой (секунды–минуты).
  - Тик каждые 2 мин обновлял Redis-курсор `qfl:goal-videos:last-sync` на `now()` **независимо** от результата.
  - Файл, попавший в Drive-индекс *после* тика, который бы его увидел, навсегда оказывался за горизонтом (его `modifiedTime` ниже сохранённого pointer'а).
  - Фильтр `modifiedTime > since` на стороне Drive отсекал его каждую следующую итерацию.
- **Фикс (`be7adbc`):**
  - Запрос к Drive идёт с 15-минутным overlap-окном (`_SINCE_OVERLAP_MINUTES`), `_is_processed` держит re-reads идемпотентными.
  - Pointer двигается только при непустом листинге и только до `max(modifiedTime)` найденных файлов (новая функция `_compute_next_sync_pointer`).
  - Префильтр по `_is_processed` поднят до резолва папок, чтобы AI folder-matcher не дёргался зря на overlap-повторах.
  - Юнит-тесты в `tests/services/test_goal_video_sync_service.py` (10/10 passed).
- **Разблокировка инцидента:** сбросил Redis pointer на 2 часа назад (`SET qfl:goal-videos:last-sync '2026-04-21T08:30:00+00:00'`) — next tick поймал 7 зависших клипов и линковал их один за другим.

### 9. [deploy] Media-host `kff.kz` не в CI/CD workflow — **TODO**

- **Severity:** MEDIUM
- **Что:** `.github/workflows/deploy.yml` сейчас деплоит только `DEPLOY_HOST` (=`kmff.kz`). Новый backend-образ для `qfl-media-worker` на `kff.kz` надо руками: `ssh root@kff.kz 'cd /root/qfl-media && docker compose --env-file .env.media -f docker-compose.media.yml pull && up -d'`.
- **Следствие:** после push в main media-host отстаёт. Сегодня фикс `be7adbc` лежит в GHCR, на `kmff.kz` применён, на `kff.kz` — **нет** (ждёт ручного pull).
- **План:** добавить второй job `deploy-media` в workflow + 3 GitHub Secrets (`DEPLOY_MEDIA_HOST=kff.kz`, `DEPLOY_MEDIA_USER=root`, `DEPLOY_MEDIA_SSH_KEY`).

### 10. [frontend] `POST /api/revalidate → 404` — ISR-кэш страниц матчей не инвалидируется — **TODO**

- **Severity:** MEDIUM (видео доезжает в БД и в Telegram, но на странице матча показывается только после следующего ISR-тика)
- **Лог из media-worker (повторяется на каждой привязке):**
  ```
  HTTP Request: POST https://kffleague.kz/api/revalidate "HTTP/1.1 404 Not Found"
  WARNING: ISR revalidation failed for game <id>: Client error '404 Not Found'
  ```
- **Причина:** маршрут `/api/revalidate` на фронте `qfl-frontend` (Next.js) отсутствует или переименован. `_download_and_link` в `goal_video_sync_service.py` продолжает стучаться по старому URL.
- **Обход:** `docker restart qfl-frontend` сбрасывает весь ISR-кэш — видео появляются сразу.
- **План:** найти актуальный revalidation-эндпоинт на фронте и поправить URL/секрет в media-воркере.

### 11. [media-host] Intermittent SSL `record layer failure` to googleapis.com — **MONITOR**

- **Severity:** LOW (retry сохраняет идемпотентность, но растрачивает квоту Drive API)
- **Дата:** 2026-04-21, во время инцидента несколько download/list упало с `ssl.SSLError: [SSL] record layer failure (_ssl.c:2590)`.
- **Поведение:** tenacity retry (3 попытки с exponential backoff) чаще всего покрывает. Файл не помечается processed — следующий тик подхватит.
- **Если станет регулярным:** диагностика сетевого стека kff.kz ↔ `*.googleapis.com` (MTU, DNS, прокси).

### 12. [goal-video-sync] Timing matcher занимает неправильный клип при нескольких близких голах — **LOW**

- **Severity:** LOW (видео корректного матча, может быть клип другого события внутри того же матча)
- **Пример:** файл `[15-24-42]` (62-я минута Жас Кыран) был привязан к event 16929 (Веремеев 63'), а не 16928 (Бораналиев 62'). В Telegram ушёл правильный матч, но подпись не совпадает с содержимым клипа.
- **План:** усилить tiebreaker `_optimal_time_match` (использовать имя игрока из имени файла, когда оно есть) или перейти на Hungarian-assignment с окном по минуте.

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
| 5 | ISR для match/player pages (revalidate=15-30s) | **CRITICAL** | -0.7 ядра CPU, снижение load avg 7.8→5.3 | **PARTIAL 2026-04-20** (matches=30s, player/team=60s) |
| 6 | ~~Индексы: `game_broadcasters`, `stages`, `broadcasters`, `score_table`~~ | ~~CRITICAL~~ | ~~Устранение 400K+ seq scans~~ | **DONE 2026-04-20** ✓ (alembic `b5c6d7e8f9g0`, `n2v3w4x5y6z7`, `p3q4r5s6t7u8`, `zx0y1z2a3b4c5`, `f1e2d3c4b5a6`) |
| 7 | ~~Redis кеш для `seasons` (12 строк, 760K scans)~~ | ~~HIGH~~ | ~~Снижение DB нагрузки~~ | **DONE 2026-04-21** ✓ (in-process TTL 60s + invalidation; `backend/app/api/seasons/router.py:121,181`) |
| 8 | ~~Fix `players.py:293` — `.first()` вместо `.scalar_one_or_none()`~~ | ~~HIGH~~ | ~~-500 errors на /teammates~~ | **DONE 2026-04-20** ✓ (`backend/app/api/players.py:401`) |
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

### 4. [qfl-backend] 26,919 ответов 404 за 3 часа (player stats) — **DONE 2026-04-20** ✓

- **Severity:** ~~HIGH~~ (исправлено)
- **Фикс:** `backend/app/api/players.py:297-300` — при `stats is None` возвращается `None` (HTTP 200), 404 больше нет.
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

### 5. [qfl-backend] 500 ошибка на `/players/325/teammates` — **DONE 2026-04-20** ✓

- **Severity:** ~~HIGH~~ (исправлено)
- **Фикс:** `backend/app/api/players.py:401` — `scalars().first()` вместо `.scalar_one_or_none()`.
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
| 3 | ~~Fix `players.py:293` — `.first()` вместо `.scalar_one_or_none()`~~ | ~~HIGH~~ | ~~-500 errors на /teammates~~ | **DONE 2026-04-20** ✓ (`backend/app/api/players.py:401`) |
| 4 | ~~Player stats endpoint: 200 + пустой объект вместо 404~~ | ~~HIGH~~ | ~~-9000 404/hr, снижение нагрузки~~ | **DONE 2026-04-20** ✓ (`backend/app/api/players.py:297-300`) |
| 5 | ISR для match/player pages (revalidate=15-30s) | HIGH | Снижение frontend CPU с 81% до ~15% | **PARTIAL 2026-04-20** (matches=30s done, player/team=60s) |
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

---

## Сессия: 2026-04-19, ~15:00 UTC — после восстановления celery_beat

**Контекст:** Live-матч 932 (Тобыл), целый день celery_beat был в рестарт-лупе из-за `ImportError: Missing module "rsa"` (telethon dep). После фикса (smouting rsa+pyasn1 в `/home/debian/qfl/backend/telegram-deps/` + patch `docker-compose.prod.yml` секций celery_worker и celery_beat) SOTA live-sync снова работает. Снимок нагрузки показал несколько долгоиграющих узких мест.

### Snapshot сервера (15:01 UTC)

| Метрика | Значение | Оценка |
|---|---|---|
| Load avg 1/5/15 min | **6.46 / 8.07 / 10.40** | ⚠️ высоко (4 vCPU → норма ≤ 4.0) |
| RAM used | 4.0 / 7.8 GB | OK |
| Swap used | **1.1 / 4.0 GB** | ⚠️ давление на память |
| Disk %util | 10.8% | OK |
| TCP estab | 4 | OK |

Тренд: load падает 10.4 → 8.07 → 6.46, пик прошёл. Вероятно совпал с рестарт-лупом celery_beat + активностью соседнего onesport-backend.

### CPU по контейнерам

| Container | CPU% | RAM | Заметка |
|---|---|---|---|
| onesport-backend | **37.9%** | 150 MB | Не наш, соседний проект |
| qfl-backend | 24.7% | 569 MB | Gunicorn, live-запросы от матча 932 |
| celery-live-worker | 9.0% | 270 MB | sync матча 932 каждые 15 сек |
| celery-worker | 8.3% | 727 MB | SOTA season_stats + goal_video_sync |
| postgres (onesport) | 4.1% | 433 MB | Не наш |
| qfl-db | 3.8% | 265 MB | OK |
| celery-beat | 0.3% | 50 MB | Восстановлен, стабилен |

---

### 🔴 P1 — INSERT `player_tour_stats` занимает 11 сек на вызов

```
calls=19083  avg=11155.2 ms  total=212874.9 sec (~59 часов CPU БД)
```

**Почему критично:** Каждый INSERT блокирует 11 секунд. При синке туров после матчей эта таблица пишется массово, занимая весь доступный CPU БД. Суммарно занято **59 часов CPU** — больше чем все остальные запросы вместе.

**Диагностика (на прод):**
```sql
\d+ player_tour_stats
SELECT * FROM pg_indexes WHERE tablename='player_tour_stats';
-- Проверить: триггеры, ON CONFLICT UPDATE на больших индексах, иностранные ключи с каскадом
EXPLAIN ANALYZE INSERT INTO player_tour_stats (...) VALUES (...);
```

**Гипотезы:**
- `ON CONFLICT DO UPDATE` с большим индексом → полный index scan
- Триггер пересчёта ranks/totals синхронно
- FK каскад проверка

**Fix:** либо батч INSERT через COPY/executemany, либо вынести ranking-пересчёт в отдельный job, либо упростить ON CONFLICT.

**Файлы:** `backend/app/services/sync/player_stats_sync_service.py` или похожий.

---

### 🔴 P1 — INSERT `player_season_stats` 3.7 сек на вызов

```
calls=15161  avg=3671.0 ms  total=55655.7 sec (~15.4 часов CPU БД)
```

Та же проблема масштабом меньше.

---

### 🟡 P2 — UPDATE `player_season_stats SET goal_rank=...` 6.3 сек

```
calls=3873  avg=6307.7 ms  total=24430 sec (~6.8 часов)
```

Пересчёт ranks синхронно на каждый goal. Должен быть денормализован или батчевым.

---

### 🟡 P2 — SOTA 404 спам для `season_id=173` — **DONE 2026-04-21** ✓

```
364 SOTA `season_stats` 404 за 10 мин ≈ 0.6 req/sec впустую
```

`sync_player_season_stats` зовёт несуществующие UUID для старого `season_id=173`. Бесполезная нагрузка на celery-worker + внешнее API + логи.

**Fix (2026-04-21):** сезон 173 убран из `SYNC_SEASON_IDS` + внедрён общий dead-pair guard по паре `(local_season_id, sota_season_id)` с Redis TTL (`backend/app/services/sync/guardrails.py`, `player_sync.py:198`, `player_tour_stats_sync.py:68`). Триггер — `SOTA_DEAD_SEASON_MIN_404=30`, `_RATIO=0.8`, `_TTL=3600s`. Считает только `httpx.HTTPStatusError == 404` (не 5xx/timeout), требует 0 успешных ответов в прогоне.

---

### 🟡 P2 — SIGSEGV в celery_worker (Worker-2, job 122) — **PARTIAL 2026-04-21** ⚠️

```
ERROR: Process 'ForkPoolWorker-2' pid:10 exited with 'signal 11 (SIGSEGV)'
```

Упал после batch SOTA `season_stats` запросов. Скорее всего memory corruption в C-extension (httpx/psycopg2). Celery автоматически рестартанул Worker-2.

**Побочный эффект:** оставил зависшую транзакцию PID 671133 `idle in transaction (aborted)` 10+ сек на `INSERT player_season_stats` → блокирует autovacuum этой таблицы.

**Fix (2026-04-21, partial):** для web-path внедрён отдельный engine с `statement_timeout=30s` через asyncpg `server_settings` — зависшие HTTP-запросы автокилятся. Celery engine оставлен без timeout'а осознанно, чтобы не убить долгие sync job'ы (`backend/app/database.py:11-43`). Zombie-транзакции в celery всё ещё возможны после SIGSEGV — нужен отдельный scoped timeout на конкретные celery-задачи или мониторинг.

---

### 🟢 P3 — `goal_video_sync_task` крутит 7-8 сек впустую каждые 2 мин — **DONE 2026-04-21** ✓

```
sync_goal_videos_task: listed=0 matched=0 elapsed=7.6s (× 30 раз/час)
```

Google Drive API зовётся впустую, когда живых матчей нет или видео ещё не выгружены. Не критично, но `GOAL_VIDEO_SYNC_INTERVAL_MINUTES=2` слишком агрессивно.

**Fix (2026-04-21):** дефолт поднят с 2 до 5 минут во всех точках (`backend/app/config.py:112`, `backend/.env.example`, `backend/docker-compose.yml`, `docker-compose.prod.yml`, `.env.production.example`, `.env.media.example`). Early-return без активных матчей уже был в `goal_video_sync_service.py:549-551`. Задача также перенесена на отдельный media-host `kff.kz`.

---

### ✅ Что работает нормально

- `celery-live-worker` — без ошибок, sync матча 932 за 1.6–3 сек
- `celery-beat` — после фикса mount'ов rsa/pyasn1 стабилен, тики firing'ают каждые 15 сек
- Backend gunicorn — только INFO-level socket close, никаких 500
- Custom emoji + Telethon импорт — работает после ручной установки зависимостей

---

### Долг: telethon deps в image — **DONE 2026-04-20** ✓

**Фикс:** `backend/requirements.txt:45-48` теперь содержит `telethon==1.43.1`, `cryptg==0.5.0`, `rsa==4.9.1`, `pyasn1==0.6.3`. Bind-mount убрать из `docker-compose.prod.yml` при следующем деплое, если ещё не убран.

**Сейчас:** telethon, cryptg, pyaes, rsa, pyasn1 лежат в `/home/debian/qfl/backend/telegram-deps/` на хосте и маунтятся bind-mount'ом в 3 контейнера (qfl-backend, celery_worker, celery_beat). 

**Почему плохо:**
- Не в git — при пересоздании сервера потеряются
- При обновлении образа надо помнить про маунты
- Пустые dirs на хосте = сломанный импорт (как случилось с rsa/pyasn1)

**Fix:** Добавить в `backend/requirements.txt`:
```
telethon==1.43.1
cryptg==0.5.0
rsa==4.9.1
pyasn1==0.6.3
```
Пересобрать и задеплоить backend image. Убрать bind-mount'ы из `docker-compose.prod.yml`. Оставить только mount session-файла `.telethon_qfl_session.session`.

---

### Action items (в порядке приоритета)

1. ~~[P0] Фикс celery_beat (rsa ImportError)~~ — **DONE** 2026-04-19
2. [P1] Профилирование INSERT `player_tour_stats` — инструментарий добавлен (`DEBUG_SYNC_TIMINGS` флаг, 2026-04-21); включить на один прогон → решить batch refactor vs убрать sleep + concurrent fetch
3. ~~[P1] Добавить telethon+cryptg+rsa+pyasn1 в `requirements.txt`, убрать bind-mount'ы~~ — **DONE 2026-04-20** ✓ (`backend/requirements.txt:45-48`; bind-mount убрать из `docker-compose.prod.yml` при следующем деплое)
4. ~~[P2] Graceful skip SOTA 404 для несуществующих игроков / убрать `season_id=173`~~ — **DONE 2026-04-21** ✓ (dead-pair guard в `guardrails.py`)
5. ~~[P2] `statement_timeout=30s` в DB-сессиях~~ — **PARTIAL 2026-04-21** (web-engine only; celery оставлен без timeout'а осознанно)
6. [P2] Убить `pg_terminate_backend(671133)` если висит — проверить, возможно уже отвалилась
7. ~~[P3] `GOAL_VIDEO_SYNC_INTERVAL_MINUTES` 2 → 5~~ — **DONE 2026-04-21** ✓

---

## Сессия: 2026-04-20, ~05:13 UTC — SSR prefetch timeout на `/matches/[id]`

**Контекст:** Пользователь получил в браузере generic `Server Components render` error на `/matches/932`. Frontend-логи показали 193 `SSR prefetch timeout` (digest `1966969364`) за последние 10 минут, 323 за сутки — резкий всплеск именно сейчас.

### Диагностика

| Проверка | Результат |
|---|---|
| `/api/v1/games/932` прямой curl из сети контейнеров | **200 за 2–10 ms** |
| `/api/v1/games/932/lineup` | **200 за 110 ms** |
| `/api/v1/live/events/932` | **200 за 10 ms** |
| `node fetch` изнутри `qfl-frontend` → бэкенд | **111 ms** |
| `curl https://kffleague.kz/ru/matches/929` (SSR) | **3.3–3.8 s** (time_starttransfer 3.37 s) |
| `safePrefetch`/`fetchDetailOrNotFound` timeout | **3000 ms** (`qfl-website/src/lib/api/server/prefetch.ts:57,85`) |
| Результат: `safePrefetch` таймаутит → `generateMetadata` возвращает `{}` → отрендеренная страница содержит `og:image = /images/og-default.png` и дефолтный title (подтверждено в HTML) |

**Симптом:** `fetchDetailOrNotFound` в `matches/[id]/page.tsx:21` перевыбрасывает ошибку (не 404) → error.tsx boundary → клиент видит «Server Components render» с digest `1966969364`.

### Корневая причина — разовый скрипт на хосте

```
PID 2995610: ffmpeg -y -i /tmp/qfl-transcode-b7nljqtn/in.mp4 \
  -c:v libx264 -preset medium -crf 20 -c:a aac -b:a 128k \
  -movflags +faststart -threads 2 ...
PPID 2989487: python /tmp/fix_missing_videos.py
```

`fix_missing_videos.py` — ручной one-shot для пяти видео (929 Кенесбек/Попов, 931 Милованович/Анане/Медина). Вызывает `app.utils.video_transcode.transcode_mp4` последовательно.

**Нагрузка на хост в момент проблемы:**
- Load avg 1/5/15: **3.70 / 2.32 / 1.51** (4 vCPU → норма ≤ 4.0)
- `%Cpu(s)`: 66.7 us, **33.3 wa** — система I/O-bound
- ffmpeg: **181% CPU**, 2 defunct ffmpeg от прошлых запусков (Apr19, pid 2124106, 2144203)
- Swap: 921 MB used

**Вывод:** ffmpeg `preset medium` + HDD + `threads 2` забивает диск/CPU → Next.js SSR-рендер `/matches/[id]` тормозит до 3.3+ s (хотя сами fetch'и быстрые — медленный сам React-рендер под нагрузкой). Каждый SSR hit превышает 3000 ms timeout.

### 🟡 P2 — SSR prefetch timeout = 3000 ms слишком жёсткий — **DONE 2026-04-21** ✓

**Риск:** Любой всплеск CPU/IO на сервере (транскод, фоновая задача, burst трафика) мгновенно ломает `/matches/[id]`, `/player/[id]`, `/team/[teamId]` — все страницы на `fetchDetailOrNotFound`/`safePrefetch`.

**Статус:** `qfl-website/src/lib/api/server/prefetch.ts` уже использует `5000 ms`; дополнительной задачи на этот пункт не требуется.

### 🟡 P2 — One-shot скрипты на хосте грузят прод

**Проблема:** `fix_missing_videos.py` запущен напрямую `python /tmp/...` (root), параллельно с прод-нагрузкой, без nice/ionice. Остались 2 defunct ffmpeg от прошлых запусков — значит запускается не впервые.

**Fix:**
1. Для ad-hoc транскодов использовать `nice -n 19 ionice -c3 python ...` или запускать внутри celery-worker с низким приоритетом.
2. `-preset veryfast` вместо `medium` (на этом железе разницы в качестве почти нет, скорость ×3–4).
3. Зачистить `<defunct> ffmpeg` (reparent к init — должны убраться рестартом celery).

### 🟡 P2 — `/og/lineup/[gameId]` сломан: Chromium не установлен в `qfl-frontend` — **DONE 2026-04-20** ✓

**Фикс:** `qfl-website/Dockerfile` переведён на `node:22-bookworm-slim` (строка 38); `npx playwright install chromium` выполняется в билде (строки 66-67). Chromium доступен в образе, маршрут `/og/lineup/[gameId]` снова рендерит PNG.


**Симптом:** `docker logs qfl-frontend` полон:
```
[og-lineup] attempt 1 failed for https://0.0.0.0:3000/kz/matches/929:
  browserType.launch: Executable doesn't exist at
  /ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell
```

Маршрут `qfl-website/src/app/og/lineup/[gameId]/route.tsx` импортирует `playwright` и вызывает `chromium.launch()`. В образе нет браузеров → 3 ретрая → 502. Telegram-постер из backend, который через этот endpoint получает PNG составов, сейчас не работает.

**Fix:** в Dockerfile `qfl-website` добавить `npx playwright install --with-deps chromium` (или использовать официальный `mcr.microsoft.com/playwright` base).

### Action items (только новые из этой сессии)

1. ~~[P2] Поднять `SSR_PREFETCH_TIMEOUT_MS` (или хардкод) до 5000 ms в `qfl-website/src/lib/api/server/prefetch.ts`~~ — **DONE 2026-04-21** ✓
2. ~~[P2] Chromium в `qfl-frontend` образе — починить `/og/lineup/[gameId]` для Telegram-постера.~~ — **DONE 2026-04-20** ✓ (`qfl-website/Dockerfile:38,66-67`)
3. [P2] Регламент для ad-hoc хост-скриптов: `nice`/`ionice` + `-preset veryfast`; в идеале — celery-таска с priority.
4. [P3] Зачистить defunct ffmpeg (PID 2124106, 2144203 от 19 апреля).

---

## Сессия: 2026-04-20 — ревизия backlog'а

Верификация всех TODO предыдущих сессий против актуального кода.

### Сводка

- **DONE: 6**
  - teammates fix (`backend/app/api/players.py:401`)
  - player stats 200 вместо 404 (`backend/app/api/players.py:297-300`)
  - индексы на `game_broadcasters` / `stages` / `broadcasters` / `score_table` (5 alembic-миграций)
  - telethon/cryptg/rsa/pyasn1 в `backend/requirements.txt:45-48`
  - Chromium в `qfl-frontend` образе (`qfl-website/Dockerfile:38,66-67`)
  - ISR для `matches/[id]` — revalidate=30s (`qfl-website/src/app/[locale]/matches/[id]/layout.tsx:11`)

- **PARTIAL: 2**
  - ISR для `player/[id]` и `team/[teamId]` — сейчас 60s, требуется 15–30s (`layout.tsx:18` и `layout.tsx:14` соответственно)
  - SOTA `season_id=173` — сезон уже исключён из `.env.example:25 SYNC_SEASON_IDS`, но per-season 404-skip в `sync_player_season_stats` не реализован (есть только per-player try/except в `backend/app/services/sync/player_sync.py:354-356`)

- **OPEN: 14**

> **Обновление 2026-04-21 (PR1-3 deploy):** часть открытых пунктов закрыта — см. раздел ниже «Сессия: 2026-04-21 — PR1-3 deploy». Актуальная сводка: **DONE: 10, PARTIAL: 3, OPEN: 10**.

### Открытые пункты в приоритете

**P1 (высокий эффект на прод):**
- INSERT `player_tour_stats` ~11 сек/вызов — **инструментарий добавлен 2026-04-21** (`DEBUG_SYNC_TIMINGS`); batch refactor / убрать sleep — следующая волна
- INSERT `player_season_stats` ~3.7 сек/вызов — то же
- ~~Redis-кеш для `/seasons`~~ — **DONE 2026-04-21** ✓ (in-process TTL cache, не Redis, но функционально эквивалентно)
- nginx `proxy_cache` для hot endpoints (table, game info)

**P2:**
- ~~`SSR_PREFETCH_TIMEOUT_MS` 3000 → 5000~~ — **DONE** (уже было 5000 в коде)
- ~~`statement_timeout=30s` в SQLAlchemy `connect_args`~~ — **PARTIAL 2026-04-21** (web-engine only; celery без timeout'а осознанно)
- UPDATE `player_season_stats SET goal_rank` ~6.3 сек — денормализация ranks или батчевый пересчёт (ждёт ops-проверки перед refactor'ом)
- PgBouncer перед PostgreSQL
- PG rollback ratio 93% — диагностика (вероятно AUTOBEGIN без commit)
- ISR для `player/[id]`, `team/[teamId]`: 60s → 30s — **DEFERRED** (не снижает CPU pressure, решим по метрикам)
- Регламент для ad-hoc хост-скриптов (nice/ionice или celery-task)
- ~~SOTA per-season 404 skip для мёртвых сезонов~~ — **DONE 2026-04-21** ✓ (dead-pair guard в `guardrails.py`)

**P3:**
- ~~`GOAL_VIDEO_SYNC_INTERVAL_MINUTES` 2 → 5~~ — **DONE 2026-04-21** ✓
- Docker log rotation
- Core Web Vitals cleanup mobile (CLS/LCP/INP)
- Зачистить defunct ffmpeg PID 2124106, 2144203 (от 2026-04-19)
- onesport-admin nginx RAM 986 MB–1.35 GB — проверить proxy_cache / worker_connections
- 3 zombie mariadb процессов (`kffleague-db`) — `docker restart kffleague-db` или `init: true`

---

## Сессия: 2026-04-21 — PR1-3 deploy (cache + guardrails + instrumentation)

**Контекст:** реализация первой волны плана оптимизации. Три условных PR объединены в два коммита:
- backend `e227ad9` (`feat(prod): seasons cache, web statement_timeout, SOTA dead-pair guard`)
- infra `923a061` (`feat(prod): wire new env vars + baseline doc for PR1-3 deploy`)

### Что задеплоено

**PR 1 — hygiene + read-path relief:**
- In-process TTL cache (60s) для `GET /api/v1/seasons` и `GET /api/v1/seasons/{id}` + синхронная инвалидация в public `PATCH /sync`, admin `POST` и admin `PATCH` (`backend/app/api/seasons/router.py:121,181`, `backend/app/services/season_api_cache.py`, `backend/app/api/admin/seasons.py:86,117`).
- Web-only engine с `statement_timeout=30s` через asyncpg `server_settings`; celery engine оставлен без timeout'а (`backend/app/database.py:11-43`).
- `GOAL_VIDEO_SYNC_INTERVAL_MINUTES` дефолт 2 → 5 во всех точках конфига.

**PR 2 — SOTA failure damping:**
- Dead-season guard по паре `(local_season_id, sota_season_id)` с Redis TTL (`backend/app/services/sync/guardrails.py`, применён в `player_sync.py:198` и `player_tour_stats_sync.py:68`).
- Триггер: `SOTA_DEAD_SEASON_MIN_404=30`, `_RATIO=0.8`, `_TTL=3600s`. Только на `httpx.HTTPStatusError == 404`, не на 5xx/timeout.
- Конфигурируемые env-vars в `docker-compose.prod.yml` (строки 95-101, 244-247, 296-299, 341-344).

**PR 3 — instrumentation before write-path refactor:**
- Агрегированные timing-метрики под `DEBUG_SYNC_TIMINGS` флагом (default off): `fetch_seconds`, `db_seconds`, `sleep_seconds`, `total_seconds`, `players_processed`, `success_count`, `not_found_count`. Одна log-строка на прогон, без per-player spam.
- Decision gate для следующей волны: по разбивке времени выбрать batched upsert / убрать sleep / concurrent fetch.

### Верификация после деплоя (2026-04-21 ~13:45 UTC)

- `https://kffleague.kz/api/v1/seasons` cold: TTFB 487 ms → warm (cache hit): TTFB 113 ms (×4 speedup).
- Все 9 контейнеров Up, 6 healthy, celery-beat/worker/live-worker пересозданы с новым образом и env-vars.
- Backend healthy через 1 чек после `docker compose restart`.

### Тесты
- 13 новых: `tests/test_database_config.py` (3), `tests/api/test_seasons_cache.py` (5), `tests/services/test_sync_runtime_guardrails.py` (5). Все зелёные.
- Ключевой тест: `test_player_season_stats_marks_only_dead_pair_and_keeps_other_pair` — 35 игроков с multi-sota `(173;174)`; пара `(200,173)` помечена dead после 30 × 404, пара `(200,174)` продолжает работать.

### Baseline для измерения эффекта
Оформлен в `docs/monitoring/baseline-2026-04-21.md`:
- Как снимать (pg_stat_statements_reset → 30–60 мин окно → delta).
- Expected deltas: `seasons.seq_scan` падает кратно, `listed=0 matched=0` в ~2.5x, появляется классификация bottleneck для extended stats.
- Ops-чеклист для `goal_rank` перед рефактором (размер таблицы, lock contention, autovacuum).

### Что осознанно не сделали
- ISR `player/[id]`, `team/[teamId]`: 60 → 30s — отложено, не снижает capacity pressure.
- nginx `proxy_cache` — волна 2, после суток наблюдений за in-process cache.
- Batched upsert для `player_tour_stats` / `player_season_stats` — ждёт данных от `DEBUG_SYNC_TIMINGS`.
- Denormalization `goal_rank` — ждёт ops-проверки.

### Инцидент при деплое (разрешён)
Backend и infra pipelines стартовали параллельно → гонка за recreate celery-контейнеров → infra упал с conflict имени `qfl-celery-live-worker` (остался в broken rename-state). Ручная очистка через `docker compose rm -sf celery_live_worker` + rerun infra pipeline (attempt 3, 35s) → успех. **Рекомендация:** в `.github/workflows/deploy.yml` у infra добавить `docker compose rm -sf` или `--remove-orphans` перед `up -d`.

### Action items на следующую сессию
1. [P1] Включить `DEBUG_SYNC_TIMINGS=true` на один прогон → классифицировать bottleneck `player_tour_stats` / `player_season_stats`.
2. [P1] Снять delta baseline-метрик (24 ч после деплоя) → подтвердить эффект cache + dead-pair guard.
3. [P1] По результатам (1): batched upsert или убрать sleep + concurrent fetch.
4. [P2] nginx `proxy_cache` для `/api/v1/seasons` и `/api/v1/championships` (волна 2 плана).
5. [P2] Ops-проверка перед `goal_rank` рефактором (чеклист в `baseline-2026-04-21.md`).
