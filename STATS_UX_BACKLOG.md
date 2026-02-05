# UX-аудит: Stats → Teams + Players (все турниры)

Дата: 2026-02-05  
Покрытие скринов: `5 турниров × 2 страницы × 2 темы × 2 языка = 40`  
Артефакты: `qfl-website/ux-screenshots/stats/*.png` (+ `manifest.json`)

## Как воспроизвести (скрины/проверка руками)

- Dev-сервер фронта: `qfl-website`
- Скриншоты (Playwright):  
  - `cd qfl-website`  
  - `BASE_URL=http://localhost:3001 npm run screenshots:stats`  
  - Выход: `qfl-website/ux-screenshots/stats`

## Сводка (главное)

1) **Есть критичные разрывы между UI и данными**: позиционный фильтр/колонка на Players не работает (API не отдаёт позицию), а Team Stats отсутствует у `1l` и `cup`.  
2) **Есть проблемы доверия к данным**: в Hero показывается график распределения голов, но данные моковые и одинаковые для всех турниров.  
3) **i18n неполная**: KZ-режим содержит русские и английские строки (табы/колонки/заголовок графика/ошибки).  
4) **Стабильность/перф**: фоллбек логотипов ходит во внешний `via.placeholder.com` → массовые ошибки запросов и “2 errors” в дев-оверлее.

---

## Backlog (P0–P2)

### P0

#### P0 — Players: фильтр “Позиция” и колонка POS вводят в заблуждение (данных нет)
- **Area:** Stats players / Filters / Data
- **Problem:** UI показывает позицию и позволяет фильтровать по GK/DEF/MID/FWD, но API `player-stats` не возвращает `position/top_role/player_type`. В таблице POS = `-`, фильтр может отфильтровать всех игроков.
- **Evidence:** `ru_light_pl_players.png`, `kz_light_pl_players.png`, `ru_dark_1l_players.png`, `ru_light_cup_players.png`
- **Fix (предпочтительно):**
  1) Бэкенд: расширить `GET /api/v1/seasons/{season_id}/player-stats` — добавить `top_role` (локализованный) и/или нормализованную `position_code` (`GK|DEF|MID|FWD`) из `players.player_type`/`players.top_role`.
  2) Фронт: включить корректный фильтр по `position_code`, а если позиция неизвестна — показывать `—` и не включать в фильтрацию.
- **Fix (быстрый fallback):** скрыть фильтр “Позиция” и колонку POS, пока нет данных.
- **Implementation notes:**
  - Backend: `backend/app/api/seasons.py` → `get_player_stats_table()`; `backend/app/schemas/player.py` → `PlayerStatsTableEntry`
  - Backend model: `backend/app/models/player.py` (есть `player_type`, `top_role*`)
  - Frontend: `qfl-website/src/components/statistics/StatisticsFilters.tsx`, `qfl-website/src/components/statistics/PlayerStatsTable.tsx`, `qfl-website/src/types/statistics.ts`, `qfl-website/src/hooks/usePlayerStats.ts` (если есть)
- **Acceptance criteria:**
  - POS отображает реальную позицию (или `—` только там, где реально неизвестно).
  - Переключение GK/DEF/MID/FWD не приводит к “пустой” таблице при наличии игроков.
- **Tests:**
  - Frontend: `npm run lint`, `npm test -- --run`
  - Backend: `pytest` (по месту) + ручная проверка `curl /api/v1/seasons/61/player-stats?limit=1`

#### P0 — Stats Hero: график “When the goals were scored” показывает моковые данные как реальные
- **Area:** Stats teams / Stats players / Data
- **Problem:** распределение голов по периодам берётся из `mockGoalsByPeriod` и одинаково для всех турниров/языков/тем → снижает доверие к разделу “Статистика”.
- **Evidence:** `ru_light_pl_teams.png` и `ru_light_cup_teams.png` (одинаковый график)
- **Fix:** до появления API:
  - либо скрыть график целиком и показать компактный блок “Скоро”,
  - либо явно маркировать как “демо/пример” (не рекомендовано для продакшена).
  - (дальше) добавить реальный endpoint (например, `GET /api/v1/seasons/{id}/goals-by-period`) и подключить.
- **Implementation notes:**
  - Frontend: `qfl-website/src/app/stats/layout.tsx` (убрать `mockGoalsByPeriod`), `qfl-website/src/components/statistics/GoalTimingChart.tsx`
  - Backend: новый endpoint + агрегация по `GameEvent`/`Game` (если есть события с минутой гола)
- **Acceptance criteria:** график не вводит в заблуждение (нет моковых значений “под видом реальных”).
- **Tests:** smoke по всем турнирам, RU/KZ, Light/Dark

#### P0 — Team stats: пусто для `1l` и `cup` (при наличии players/statistics)
- **Area:** Stats teams / Data/API
- **Problem:** `GET /api/v1/seasons/{id}/team-stats` возвращает `total=0` для `1l (85)` и `cup (71)`, поэтому UI показывает empty state, хотя:
  - `GET /statistics` возвращает матчи/голы,
  - `GET /player-stats` возвращает игроков.
- **Evidence:** `ru_light_1l_teams.png`, `ru_light_cup_teams.png` (empty state)
- **Fix (минимум UX):** фронт — улучшить empty-state: объяснить “данные ещё не синхронизированы” + CTA на `/table` (есть) + CTA “Открыть статистику игроков”.
- **Fix (правильное):** бэкенд — обеспечить заполнение `TeamSeasonStats`:
  - Для Cup: получать список команд не из `ScoreTable`, а из `Game` (distinct home/away) и затем синкать v2 stats.
  - Для 1L: починить/перезапустить sync и/или добавить fallback-агрегацию из `Game`, если v2 stats отсутствуют.
- **Implementation notes:**
  - Backend: `backend/app/services/sync_service.py` → `sync_team_season_stats()` (сейчас зависит от `ScoreTable`)
  - Backend: `backend/app/api/seasons.py` → `get_team_stats_table()` (можно добавить fallback при `total=0`)
  - Frontend: `qfl-website/src/app/stats/teams/page.tsx`
- **Acceptance criteria:**
  - `curl /api/v1/seasons/85/team-stats?limit=1` возвращает `total > 0` (или хотя бы базовые показатели).
  - Для `cup (71)` teams-таблица не пустая (или есть честный “coming soon” с понятной причиной).
- **Tests:** backend `pytest` + smoke (5 турниров × 2 страницы)

#### P0 — i18n: в KZ остаются RU/EN строки (табы/колонки/ошибки/заголовок графика)
- **Area:** i18n / Stats teams / Stats players
- **Problem:** в KZ:
  - верхние табы Stats (clubs/players) — на русском,
  - заголовок графика — на английском,
  - колонки players — на английском,
  - часть ошибок — на русском.
- **Evidence:** `kz_light_pl_teams.png`, `kz_light_pl_players.png`, `kz_dark_pl_players.png`
- **Fix:**
  - завести ключи для main tabs и заголовка графика,
  - колонкам players дать i18n-лейблы (не хардкодить EN в `statisticsHelpers`),
  - ошибки/empty-state без `defaultValue` в компонентах (вынести в `statistics.json`).
- **Implementation notes:**
  - Frontend: `qfl-website/src/app/stats/layout.tsx`, `qfl-website/src/components/statistics/GoalTimingChart.tsx`
  - Frontend: `qfl-website/src/lib/mock/statisticsHelpers.ts` (рефактор: возвращать `labelKey`, а не `label`)
  - i18n: `qfl-website/public/locales/ru/statistics.json`, `qfl-website/public/locales/kz/statistics.json`
- **Acceptance criteria:** в RU/KZ нет “случайного” EN/RU (кроме имён команд/игроков из данных).
- **Tests:** smoke по RU/KZ + визуальная проверка переполнений

#### P0 — Внешний placeholder (`via.placeholder.com`) ломает фоллбек логотипов и засоряет консоль ошибками
- **Area:** Stats teams / Stats players / Reliability
- **Problem:** onError-фоллбек логотипов ведёт на внешний домен `via.placeholder.com`, который может быть недоступен → логотипы “падают”, а в dev появляется “2 errors”.
- **Evidence:** “2 errors” присутствует на большинстве скринов, напр. `ru_light_pl_teams.png`, `ru_light_cup_teams.png`
- **Fix:** заменить на локальный ассет (SVG/PNG) в `public/` и использовать его как фоллбек (без внешних запросов).
- **Implementation notes:**
  - `qfl-website/src/components/statistics/ClubStatsTable.tsx`
  - `qfl-website/src/components/statistics/PlayerStatsTable.tsx`
  - добавить ассет: `qfl-website/public/images/placeholders/team.svg` (или аналог)
- **Acceptance criteria:** нет запросов на `via.placeholder.com`, фоллбек стабилен offline.
- **Tests:** smoke + `npm run lint`

---

### P1

#### P1 — Players: список клубов в фильтре не должен зависеть от team-stats
- **Area:** Stats players / Filters / Data
- **Problem:** сейчас список клубов берётся из `useTeamStatsTable()`. Когда team-stats пустой (`1l`, `cup`) — фильтр клубов деградирует, хотя игроки есть.
- **Evidence:** `ru_light_1l_players.png`, `ru_light_cup_players.png`
- **Fix:** получать список команд отдельно:
  - либо новый endpoint `GET /api/v1/seasons/{id}/teams` (distinct teams из PlayerSeasonStats/Game),
  - либо брать команды из `player-stats` (в рамках текущего limit/offset) + отдельный “all teams” запрос.
- **Implementation notes:** `qfl-website/src/app/stats/players/page.tsx`, `qfl-website/src/hooks/useTeamStatsTable.ts` (если есть), backend новый endpoint.
- **Acceptance criteria:** фильтр “Клуб” всегда показывает валидный список клубов для сезона.

#### P1 — Empty states: сделать их “честными” и полезными
- **Area:** Stats teams / UX copy
- **Problem:** “Командная статистика недоступна” выглядит как баг; нет объяснения и альтернативного сценария (например, открыть players).
- **Evidence:** `ru_light_cup_teams.png`, `kz_light_1l_teams.png`
- **Fix:** добавить:
  - причину (“данные ещё не синхронизированы” / “статистика доступна после N туров”),
  - альтернативные CTA: “Открыть статистику игроков”, “Открыть /table (таблица/сетка)”.
- **Implementation notes:** `qfl-website/src/app/stats/teams/page.tsx`, `statistics.json`
- **Acceptance criteria:** пустое состояние не похоже на ошибку и ведёт пользователя дальше.

#### P1 — Навигация: сохранять `?tournament=...` при переключении Teams/Players
- **Area:** Navigation
- **Problem:** main tabs ведут на `/stats/teams` и `/stats/players` без query → ссылка теряет контекст турнира/сезона (хуже для шаринга и воспроизводимости).
- **Evidence:** воспроизводится при ручном клике (не из скрина)
- **Fix:** формировать `href` с сохранением текущих query params (`tournament`, `season`, `round`).
- **Implementation notes:** `qfl-website/src/app/stats/layout.tsx` (`MainTabs` + `useSearchParams`)
- **Acceptance criteria:** при переключении табов URL сохраняет турнир.

#### P1 — Phase filter: скрыть/привести к понятному виду, пока не реализован
- **Area:** Filters
- **Problem:** disabled-select + “скоро/жақында” занимает место и выглядит как сломанный фильтр.
- **Evidence:** `ru_light_pl_teams.png`, `kz_light_pl_players.png`
- **Fix:** либо реализовать, либо заменить на “чип”/тултип без disabled-UI.
- **Implementation notes:** `qfl-website/src/components/statistics/StatisticsFilters.tsx`

---

### P2

#### P2 — Таблицы: улучшить сканируемость (липкий header, зебра, выравнивание чисел)
- **Area:** Tables / Visual
- **Problem:** при скролле теряется контекст колонок, плотность/разделители можно улучшить.
- **Evidence:** любые скрины таблиц, напр. `ru_light_pl_players.png`
- **Fix:** sticky header + лёгкая зебра + правое выравнивание числовых колонок.
- **Implementation notes:** `ClubStatsTable.tsx`, `PlayerStatsTable.tsx`

#### P2 — Доступность: контраст и фокус-стейты в Dark mode
- **Area:** Dark mode / A11y
- **Problem:** некоторые серые/синие состояния в dark могут быть на грани контраста; фокус-стейты у кнопок/селектов не всегда очевидны.
- **Evidence:** `kz_dark_pl_teams.png`, `ru_dark_pl_players.png`
- **Fix:** ревизия цветов, особенно sticky-слои, сортировка и hover.

---

## Данные/API — диагностика по сезонам (факт)

Проверено через backend `http://localhost:8000/api/v1`:

- `pl (61)`: `team-stats.total=15`, `player-stats.total=507` — OK  
- `1l (85)`: `team-stats.total=0`, `player-stats.total=487` — **team-stats отсутствует**  
- `cup (71)`: `team-stats.total=0`, `player-stats.total=504` — **team-stats отсутствует**  
- `2l (80)`: `team-stats.total=11`, `player-stats.total=360` — OK  
- `el (84)`: `team-stats.total=14`, `player-stats.total=342` — OK

### Вероятные причины и куда копать

1) **Cup (71):** `sync_team_season_stats()` берёт команды из `ScoreTable`, но у кубка таблицы нет → синк сразу возвращает `0`.  
   - **Fix:** собирать команды из `Game` (distinct home/away) или из сетки; затем тянуть v2 stats.
2) **1L (85):** таблица (`ScoreTable`) есть, но `TeamSeasonStats` пустая → либо синк не запускается, либо v2 endpoint массово падает и всё “skip”.  
   - **Fix:** логировать/метрить причины, добавить fallback-агрегацию, сделать ретраи.
3) `statistics` endpoint использует `TeamSeasonStats` для карточек/фолов/пенальти → при отсутствии TeamSeasonStats эти поля = `0`.  
   - **Fix:** либо гарантировать TeamSeasonStats, либо считать часть агрегатов из других таблиц.

