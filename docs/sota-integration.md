# sota.id Integration Guide

> **Last updated:** 2026-03-06
> **Swagger UI:** https://sota.id/api/public-schema/swagger-ui/
> **OpenAPI schema:** https://sota.id/api/public-schema/?format=json
> **Base URL:** `https://sota.id/api`

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Endpoint Catalog](#3-endpoint-catalog)
4. [Use Case 1 — Reference Data Sync](#4-use-case-1--reference-data-sync)
5. [Use Case 2 — Player Sync](#5-use-case-2--player-sync)
6. [Use Case 3 — Game Stats Sync](#6-use-case-3--game-stats-sync)
7. [Use Case 4 — Season Statistics](#7-use-case-4--season-statistics)
8. [Use Case 5 — Pre-Game Lineup](#8-use-case-5--pre-game-lineup)
9. [Use Case 6 — Live Match Data](#9-use-case-6--live-match-data)
10. [VMix / TV Broadcast Endpoints](#10-vmix--tv-broadcast-endpoints)
11. [Celery Tasks & Scheduling](#11-celery-tasks--scheduling)
12. [Environment Variables](#12-environment-variables)
13. [Unused Endpoints — Development Potential](#13-unused-endpoints--development-potential)
14. [Manual Operations](#14-manual-operations)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Overview

**sota.id** is the Kazakh football data aggregation platform that serves as QFL's primary source of truth for all match data, player statistics, and live events. QFL pulls data from sota.id via a scheduled Celery sync pipeline and stores it in PostgreSQL.

### Data Flow

```
sota.id API
    │
    ▼
SotaClient (httpx, JWT, retry)
    │
    ▼
SyncOrchestrator
    ├── ReferenceSyncService  → tournaments, seasons, teams
    ├── PlayerSyncService     → players, player season stats
    ├── GameSyncService       → games, game events, game stats
    ├── LineupSyncService     → pre-game lineups, live positions
    └── StatsSyncService      → score table, team season stats
    │
    ▼
PostgreSQL
    │
    ▼
FastAPI → Frontend (Next.js)
```

### Key Files

| File | Role |
|------|------|
| `backend/app/services/sota_client.py` | HTTP client — all API calls to sota.id |
| `backend/app/services/sync/orchestrator.py` | Sync pipeline coordinator |
| `backend/app/services/sync/reference_sync.py` | Tournaments, seasons, teams |
| `backend/app/services/sync/player_sync.py` | Players and player stats |
| `backend/app/services/sync/game_sync.py` | Games, events, formations |
| `backend/app/services/sync/lineup_sync.py` | Pre-game + live lineups |
| `backend/app/services/sync/stats_sync.py` | Score table, team season stats |
| `backend/app/services/sync/base.py` | Shared constants (stats field sets) |
| `backend/app/tasks/__init__.py` | Celery Beat schedule |
| `backend/app/utils/lineup_feed_parser.py` | Normalize `/em/` and VSporte lineup entries |
| `scripts/resync_assists.py` | Manual assist re-linking tool |

### Implemented vs Not Implemented (summary)

- **Implemented:** ~17 of 31 endpoints (references, players, games, stats, live /em/)
- **Not implemented:** ~14 endpoints (vmix TV-broadcast, best_players, team_of_week, per-tour stats, player game stats v2)
- **CRITICAL:** Several breaking API changes detected 2026-03-06 — see [SOTA-5] in backlog

---

## 2. Authentication

### Obtaining a Token

```
POST https://sota.id/api/auth/token/
Content-Type: application/json

{
  "email": "...",
  "password": "..."
}
```

**Response:**
```json
{
  "access": "eyJhbGci...",
  "refresh": "eyJhbGci...",
  "multi_token": "eyJhbGci..."
}
```

| Field | Purpose |
|-------|---------|
| `access` | Bearer token for REST API calls (TTL ~23h) |
| `refresh` | Token refresh (not currently used by QFL) |
| `multi_token` | Used as `access_token=` query param on `/em/` live endpoints |

### Using the Token

**REST API endpoints** — Authorization header:
```
Authorization: Bearer <access_token>
Accept-Language: ru    # Optional: ru | kk | en
```

**Live `/em/` endpoints** — Query parameter:
```
https://sota.id/em/{game_sota_id}-list.json?access_token=<access_token>
```

### Retry Policy (SotaClient)

```python
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=8),  # 2s → 4s → 8s
    retry=retry_if_exception_type((
        httpx.ConnectTimeout,
        httpx.ReadTimeout,
        httpx.ConnectError,
        httpx.RemoteProtocolError,
    ))
)
```

The `ensure_authenticated()` method is called before every request and refreshes the JWT if expired.

---

## 3. Endpoint Catalog

> Tested against **Season 2025 Premier League** (`season_id=61`, `tournament_id=7`) and **Season 2026** (`season_id=173`)
> All responses from real curl tests on 2026-03-01, updated 2026-03-06
>
> **API Breaking Changes (2026-03-06):** Seasons/Teams/Games endpoints switched from paginated to flat list responses. Teams endpoint lost `logo`, `city`, `short_name` fields. Season names are now just years. `pass_accuracy` removed from game stats. Players `team` object became `teams` array of IDs. See [SOTA-5] in backlog.

### 3.1 Registry (Reference Data)

| Method | Endpoint | QFL Status | Description |
|--------|----------|-----------|-------------|
| GET | `/api/public/v1/tournaments/` | ✅ Implemented | List of tournaments |
| GET | `/api/public/v1/seasons/` | ✅ Implemented | List of seasons (paginated, 3 languages) |
| GET | `/api/public/v1/teams/?season_id={id}` | ✅ Implemented | Teams in a season |
| GET | `/api/public/v1/players/?season_id={id}` | ✅ Implemented | Players in a season |
| GET | `/api/public/v1/metrics/` | ❌ Not used | Metrics registry (293 total) |

#### GET /api/public/v1/tournaments/

```json
[
  {"id": 7, "name": "Premier League"},
  {"id": 30, "name": "First League"},
  {"id": 65, "name": "Cup. Main tournament"},
  {"id": 74, "name": "Second League Northeast Conference"},
  {"id": 75, "name": "Second League Southwest Conference"},
  {"id": 78, "name": "Womens League"},
  {"id": 139, "name": "Second League Final"}
]
```

> **Changed (2026-03-06):** Tournament IDs changed (was 1,2,3 — now 7,30,65...). `short_name` removed. Names in English regardless of `Accept-Language`.

#### GET /api/public/v1/seasons/

Response is now a **flat list** (not paginated):
```json
[
  {
    "id": 173,
    "name": "2026",
    "start_date": "2026-03-06",
    "end_date": "2026-11-22",
    "tournament_id": 7,
    "tournament_name": "Premier League"
  },
  {
    "id": 61,
    "name": "2025",
    "start_date": "2025-03-01",
    "end_date": "2025-10-27",
    "tournament_id": 7,
    "tournament_name": "Premier League"
  }
]
```

> **Changed (2026-03-06):**
> - Response switched from paginated `{count, results}` to flat list
> - `tournament` (int) → `tournament_id` + `tournament_name`
> - `date_start`/`date_end` → `start_date`/`end_date` (field names changed!)
> - `name` is now just the year ("2026"), not full tournament+year name
> - `Accept-Language` has no effect on season names
> - `tours_count` removed

#### GET /api/public/v1/teams/?season_id=173

Response is now a **flat list** with nested tournament/season data:
```json
[
  {
    "id": 51,
    "name": "Aktobe",
    "tournaments": [
      {
        "id": 7,
        "name": "Premier League",
        "seasons": [{"id": 10, "name": "2024"}, {"id": 61, "name": "2025"}, {"id": 173, "name": "2026"}]
      },
      {
        "id": 65,
        "name": "Cup. Main tournament",
        "seasons": [{"id": 71, "name": "2025"}]
      }
    ],
    "seasons": [10, 61, 71, 173]
  }
]
```

> **Changed (2026-03-06):**
> - Response switched from paginated to flat list
> - Removed: `short_name`, `country`, `logo`, `stadium`, `city`
> - Added: `tournaments` (nested array with seasons), `seasons` (flat ID array)
> - `Accept-Language` still works for `name` (ru=Актобе, kk=Ақтөбе, en=Aktobe)
> - KPL 2026 has 16 teams (was 12 in 2025)

#### GET /api/public/v1/players/?season_id=173

Still paginated (`count`, `results`, `next`), page size = 10:
```json
{
  "count": 332,
  "next": "http://sota.id/api/public/v1/players/?limit=5&offset=0&page=2&season_id=173",
  "results": [
    {
      "id": "01dc336a-47c0-4b24-8a62-8574ef990cb3",
      "first_name": "Неманья",
      "last_name": "Кавнич",
      "teams": [90],
      "birthday": "1995-09-05",
      "type": "defence",
      "country_name": "Черногория",
      "age": 30,
      "top_role": "ЦЗ (центральный защитник)"
    }
  ]
}
```

> **Changed (2026-03-06):**
> - `team` (object `{id, name}`) → `teams` (array of team IDs like `[90]`)
> - Added: `birthday`, `type` (position type: "defence"/"offence"/"midfield"/"goalkeeper")
> - `country` → `country_name`
> - `position` (single char D/M/F/G) → `type` (full word)
> - `top_role` now in Russian when `Accept-Language: ru`
> - `next` URL uses `http://` (not https) — need to handle in pagination
> - Names affected by `Accept-Language` (ru=Неманья Кавнич, en=Nemanja Cavnic)

#### GET /api/public/v1/metrics/

Returns full registry of 293 statistical metrics:
```json
{
  "result": "Success",
  "data": [
    {"id": 1, "name": "Голы", "key": "goal"},
    {"id": 2, "name": "Голевые передачи", "key": "goal_pass"},
    {"id": 3, "name": "Удары", "key": "shot"}
  ]
}
```

---

### 3.2 Games

| Method | Endpoint | QFL Status | Description |
|--------|----------|-----------|-------------|
| GET | `/api/public/v1/games/?season_id={id}&tour={n}` | ⚠️ Partially used | List of games (11 filter params) |
| GET | `/api/public/v1/games/{id}/players/` | ✅ Implemented | Per-game player stats |
| GET | `/api/public/v1/games/{id}/teams/` | ✅ Implemented | Per-game team stats |
| GET | `/api/public/v1/games/{id}/pre_game_lineup/` | ✅ Implemented | Pre-game lineup + referees |
| GET | `/api/public/v1/games/{id}/vmix/generate_link/` | ❌ Not used | VMix TV links + reveals undocumented /em/ endpoints |
| GET | `/api/public/v1/games/vmix/{id}/best-players/{team_id}/?metric={key}` | ❌ Not used | Best players by metric (vmix) |
| GET | `/api/public/v2/games/vmix/{id}/team-players-stats/{team_id}/` | ❌ Not used | All player stats matrix (vmix) |

#### GET /api/public/v1/games/?season_id=173&tour=1

Response is now a **flat list**:
```json
[
  {
    "id": "691bfa4b-...",
    "date": "2026-03-08",
    "tournament_id": 7,
    "home_team": {"id": 91, "name": "Astana", "score": 0},
    "away_team": {"id": 45, "name": "Jetisu", "score": 0},
    "tour": 1,
    "has_stats": false,
    "season_id": 173,
    "season_name": "2026",
    "visitors": null
  }
]
```

> **Changed (2026-03-06):**
> - Response switched from paginated to flat list
> - `home_score`/`away_score` → `home_team.score`/`away_team.score` (nested)
> - Removed: `time`, `stadium`
> - Added: `tournament_id`, `season_id`, `season_name`, `has_stats`
> - Team names in English regardless of `Accept-Language`
>
> **Filter parameters:** `season_id`, `team`, `tour`, `date_from`, `date_to`, `status`, `limit`, `offset`, `lang`

#### GET /api/public/v1/games/{id}/players/

```json
{
  "data": {
    "latest_update_date_time": "2025-03-08T18:00:00Z",
    "players": [
      {
        "id": "01dc336a-47c0-4b24-8a62-8574ef990cb3",
        "first_name": "Nemanja",
        "last_name": "Cavnic",
        "team": "Кайсар",
        "team_id": 94,
        "minutes_played": 90,
        "started": true,
        "position": "M",
        "stats": {
          "shot": 2,
          "shots_on_goal": 1,
          "shots_off_goal": 1,
          "pass": 45,
          "pass_accuracy": 88.9,
          "duel": 8,
          "tackle": 3,
          "corner": 0,
          "offside": 0,
          "foul": 2,
          "yellow_cards": 0,
          "red_cards": 0
        }
      }
    ]
  }
}
```

#### GET /api/public/v1/games/{id}/teams/

```json
{
  "data": {
    "teams": [
      {
        "id": 94,
        "name": "Кайсар",
        "stats": {
          "possession": 55,
          "possession_percent": "55%",
          "shot": 14,
          "shots_on_goal": 6,
          "shots_off_goal": 5,
          "pass": 420,
          "pass_accuracy": 84.3,
          "foul": 12,
          "yellow_cards": 2,
          "red_cards": 0,
          "corner": 5,
          "offside": 2
        }
      }
    ]
  }
}
```

#### GET /api/public/v1/games/{id}/pre_game_lineup/

```json
{
  "data": {
    "date": "2025-03-08",
    "referee": {
      "main": "Иван Иванов",
      "1st_assistant": "Петр Петров",
      "2nd_assistant": "Сергей Сергеев",
      "4th_referee": "Алексей Алексеев",
      "video_assistant_1": null,
      "video_assistant_main": null,
      "match_inspector": null
    },
    "home_team": {
      "id": 94,
      "name": "Кайсар",
      "short_name": "КАЙ",
      "bas_logo_path": "C:\\KPL_FINAL\\LOGO_KOMAND\\Kaisar.png",
      "coach": "Владимир Федотов",
      "first_assistant": null,
      "second_assistant": null,
      "lineup": [
        {
          "player_id": "01dc336a-47c0-4b24-8a62-8574ef990cb3",
          "first_name": "Nemanja",
          "last_name": "Cavnic",
          "player_number": 8,
          "country_name": "Сербия",
          "bas_image_path": "C:\\KPL_FINAL\\SOTA_PHOTO_PLAYER\\Kaisar\\CAVNIC_NEMANJA.png"
        }
      ]
    },
    "away_team": { "...": "same structure" }
  }
}
```

> **Note:** `data` may be `null` for games where lineup has not been entered in sota.id.

---

### 3.3 Seasons

| Method | Endpoint | QFL Status | Description |
|--------|----------|-----------|-------------|
| GET | `/api/public/v1/seasons/{id}/score_table/` | ✅ Implemented | Championship table (v1) |
| GET | `/api/public/v1/seasons/{id}/score_table_v2/` | ❌ No data for s.61 | Championship table (v2) |
| GET | `/api/public/v2/seasons/{id}/score_table/` | ❌ No data for s.61 | Championship table (v2 alt) |
| GET | `/api/public/v1/seasons/{id}/best_players/?metric={key}&max={n}&tour={n}` | ❌ ⭐⭐⭐ HIGH | Best players by metric (empty for past seasons!) |
| GET | `/api/public/v1/seasons/{id}/team_of_week/?tour={n}` | ❌ ⭐⭐⭐ HIGH | Team of the week/tour (empty for past seasons with tour param) |
| GET | `/api/public/v1/seasons/{id}/season_stats_v2/` | ❌ Not used | 71 league-wide metrics |
| GET | `/api/public/v2/seasons/{id}/season_stats/` | ❌ Not used | Same 71 metrics (v2 alt) |
| GET | `/api/public/v1/seasons/vmix/{id}/last-games/{team_id}/` | ❌ Not used | Last 5 games (vmix) |
| GET | `/api/public/v1/seasons/vmix/{id}/score_table/` | ❌ Not used | Table (vmix format) |
| GET | `/api/public/v1/seasons/vmix/{id}/teams_season_stats/?metric={key}` | ❌ Not used | Season stats ranking |
| GET | `/api/public/v1/seasons/vmix/{id}/teams_average_season_stats/{game_id}/` | ❌ Not used | Two-team avg stats |
| GET | `/api/public/v1/seasons/vmix/{id}/teams/{team_id}/best-players/{game_id}/?metric={key}` | ❌ Not used | Team best players |

#### GET /api/public/v1/seasons/61/score_table/

```json
{
  "result": "success",
  "data": {
    "table": [
      {
        "id": 7,
        "name": "Кайрат",
        "logo": "https://sota.id/media/...",
        "rg": 34,
        "wins": 18,
        "draws": 5,
        "losses": 3,
        "goals": "53:19",
        "points": 59,
        "matches": 26,
        "form": ["W", "W", "D", "W", "L"]
      }
    ]
  }
}
```

> **Note:** `goals` is a string `"scored:conceded"`, not separate fields. `rg` = goal difference.

#### GET /api/public/v1/seasons/61/best_players/?metric=goal&max=10&tour=15

```json
{
  "result": "Success",
  "data": {
    "latest_update_date_time": "2026-02-18 14:34",
    "tour": 15,
    "players": []
  }
}
```

> **WARNING (2026-03-06):** Returns empty `players: []` for ALL completed seasons (61, 10), regardless of `tour` param. Data appears to be cleared after season ends. Only useful during active season — must cache in DB.

#### GET /api/public/v1/seasons/61/team_of_week/

Without `tour` param returns last 3 tours' squads (33 players):
```json
{
  "result": "Success",
  "data": {
    "players": [
      {
        "id": "38408933-60ce-49f1-909c-9630d39fc6c7",
        "first_name": "Dinmukhamed",
        "last_name": "Karaman",
        "full_name": "Dinmukhamed Karaman",
        "team": {
          "id": 92,
          "name": "Jenis",
          "image": "https://videos.sota.id/team/image/Jenis.webp"
        },
        "number": 8,
        "captain": false,
        "amplua": "D",
        "position": "L",
        "ordering": 1
      }
    ]
  }
}
```

> **Changed (2026-03-06):**
> - Added: `full_name`, `number`, `captain`, `team.image` (logo URL on videos.sota.id)
> - `value` field removed
> - Without `tour` returns 33 players (last 3 tours), not single tour
> - With `tour=N` returns empty for completed seasons (data cleared)
```

#### GET /api/public/v1/seasons/61/season_stats_v2/

Returns 71 league-wide aggregate metrics:
```json
{
  "data": {
    "stats": [
      {"key": "goal", "name": "Голы", "value": 312},
      {"key": "shot", "name": "Удары", "value": 3420},
      {"key": "yellow_cards", "name": "Жёлтые карточки", "value": 408}
    ]
  }
}
```

---

### 3.4 Teams

| Method | Endpoint | QFL Status | Description |
|--------|----------|-----------|-------------|
| GET | `/api/public/v1/teams/{id}/season_stats/?season_id={id}` | ✅ Implemented | Season stats v1 (10 fields) |
| GET | `/api/public/v2/teams/{id}/season_stats/?season_id={id}` | ✅ Implemented | Season stats v2 (92 metrics) |
| GET | `/api/public/v1/teams/{id}/season_stats_v2/?season_id={id}&tour={n}&single_tour={bool}` | ❌ ⭐⭐ | Per-tour stats |

#### GET /api/public/v2/teams/94/season_stats/?season_id=61

```json
{
  "data": {
    "stats": [
      {"key": "games_played", "name": "Игры", "value": 26},
      {"key": "win", "name": "Победы", "value": 8},
      {"key": "draw", "name": "Ничьи", "value": 7},
      {"key": "match_loss", "name": "Поражения", "value": 11},
      {"key": "goal", "name": "Голы", "value": 35},
      {"key": "goals_conceded", "name": "Пропущено", "value": 48},
      {"key": "shot", "name": "Удары", "value": 348},
      {"key": "pass", "name": "Передачи", "value": 9450},
      {"key": "possession_percent_average", "name": "Владение", "value": 43.2}
    ]
  }
}
```

Full response contains **92 metrics** covering: shots, passes, duels, defense, set pieces, discipline, goalkeeping.

#### GET /api/public/v1/teams/94/season_stats_v2/?season_id=61&tour=5&single_tour=false

Same 92-metric format but cumulative through tour 5 (or single tour if `single_tour=true`).

---

### 3.5 Players

| Method | Endpoint | QFL Status | Description |
|--------|----------|-----------|-------------|
| GET | `/api/public/v1/players/{id}/season_stats/?season_id={id}` | ⚠️ Deprecated | Season stats v1 (14 fields) |
| GET | `/api/public/v2/players/{id}/season_stats/?season_id={id}` | ✅ Implemented | Season stats v2 (50 metrics) |
| GET | `/api/public/v2/players/{id}/game_stats/?game_id={gid}` | ❌ ⭐⭐⭐ HIGH | Per-game stats (50 metrics) |

#### GET /api/public/v2/players/{id}/season_stats/?season_id=61

```json
{
  "data": {
    "stats": [
      {"key": "games_played", "name": "Игры", "value": 24},
      {"key": "goal", "name": "Голы", "value": 3},
      {"key": "goal_pass", "name": "Ассисты", "value": 5},
      {"key": "shot", "name": "Удары", "value": 45},
      {"key": "pass", "name": "Передачи", "value": 1240},
      {"key": "pass_ratio", "name": "Точность передач", "value": 87.3},
      {"key": "dribble", "name": "Дриблинги", "value": 28},
      {"key": "yellow_cards", "name": "Жёлтые карточки", "value": 4}
    ]
  }
}
```

#### GET /api/public/v2/players/{id}/game_stats/?game_id={game_uuid}

Same 50-metric structure scoped to a single game. Can also filter by `season_id` and `tour`.

#### GET /api/public/v1/players/{id}/season_stats/ (deprecated v1)

```json
{
  "data": {
    "games_played": 24,
    "goals": 3,
    "assists": 5,
    "shots": 45,
    "passes": 1240,
    "pass_accuracy": 87.3,
    "yellow_cards": 4,
    "red_cards": 0
  }
}
```

Flat object with 14 fields. Superseded by v2.

---

### 3.6 Live Match Endpoints (`/em/`)

These endpoints are **outside the Swagger spec** and use `?access_token=` auth (not Authorization header).

| Endpoint | QFL Status | Description |
|----------|-----------|-------------|
| `/em/{sota_id}-team-home.json` | ✅ Implemented | Home team live lineup |
| `/em/{sota_id}-team-away.json` | ✅ Implemented | Away team live lineup |
| `/em/{sota_id}-list.json` | ✅ Implemented | Match events (goals, cards, subs) |
| `/em/{sota_id}-stat.json` | ✅ Implemented | Live match stats (109 metrics) |
| `/em/{sota_id}-referies.json` | ✅ Read by vmix | Referee assignments |
| `/em/{sota_id}-lineups-home.json` | ❌ Not used | Simplified home lineup (number+name) |
| `/em/{sota_id}-lineups-away.json` | ❌ Not used | Simplified away lineup |
| `/em/{sota_id}-players-home.json` | ❌ Not used | Home player stats + goals/assists/cards |
| `/em/{sota_id}-players-away.json` | ❌ Not used | Away player stats + goals/assists/cards |

> **Discovery:** The `/em/` endpoint list was found via `GET /api/public/v1/games/{id}/vmix/generate_link/` which returns all available stream links including undocumented `/em/` variants.

#### `/em/{id}-team-home.json` — Live Lineup

```json
[
  {"number": "TEAM",      "first_name": "Жетісу", "last_name": "home", "full_name": "C:\\KPL_FINAL\\LOGO_KOMAND\\Jetysu.png"},
  {"number": "FORMATION", "first_name": "4-3-3 down", "last_name": "ЖЕТ", "full_name": "#2494D2"},
  {"number": "COACH",     "first_name": "Самат", "last_name": "Смаков", "full_name": "Самат Смаков"},
  {"number": "MAIN",      "first_name": "Самат", "last_name": "Смаков", "full_name": "Самат Смаков"},
  {"number": "ОСНОВНЫЕ",  "first_name": "", "last_name": "", "full_name": "", "gk": "", "capitan": "", "amplua": "", "position": "", "id": ""},
  {
    "number": 31,
    "first_name": "Михаил",
    "last_name": "Голубничий",
    "full_name": "Михаил Голубничий",
    "gk": true,
    "capitan": false,
    "bas_image_path": "C:\\KPL_FINAL\\SOTA_PHOTO_PLAYER\\Zhetysu\\MIHAIL_GOLUBNICHII.png",
    "amplua": "Gk",
    "position": "C",
    "id": "205d6bbe-002d-452b-8539-4935084b6371"
  },
  {"number": "ЗАПАСНЫЕ", "...": "marker row — players below are substitutes"},
  {"number": 25, "first_name": "...", "...": "substitute player"}
]
```

**Marker tokens:**

| Token | Meaning |
|-------|---------|
| `TEAM` | Team name + side ("home"/"away"), logo BAS path in `full_name` |
| `FORMATION` | Formation string (e.g. "4-3-3 down"), team short name, kit color `#RRGGBB` in `full_name` |
| `COACH` | Coach name (appears as both `COACH` and `MAIN` entries) |
| `MAIN` | Primary coach marker |
| `ОСНОВНЫЕ` | "STARTERS" section begins — players below are starters |
| `ЗАПАСНЫЕ` | "SUBSTITUTES" section begins — players below are subs |
| `STADIUM/VENUE` | Stadium name in `first_name` |
| `TIME/DATE` | Match time/date |

#### `/em/{id}-list.json` — Match Events

```json
[
  {
    "half": 1,
    "time": 9,
    "action": "КК",
    "number1": "74",
    "first_name1": "Рафаэль",
    "last_name1": "Саксесс",
    "team1": "Жетісу",
    "number2": "",
    "first_name2": "",
    "last_name2": "",
    "team2": "",
    "standard": null
  },
  {
    "half": 2,
    "time": 88,
    "action": "ГОЛ",
    "number1": "79",
    "first_name1": "Глеб",
    "last_name1": "Валгушев",
    "team1": "Қызылжар",
    "number2": "31",
    "first_name2": "Михаил",
    "last_name2": "Голубничий",
    "team2": "Жетісу",
    "standard": null
  }
]
```

**Action types → QFL event_type mapping:**

| sota action | QFL event_type | Notes |
|-------------|---------------|-------|
| `ГОЛ` | `goal` | `player2` = **opponent** (GK), NOT assist |
| `АВТОГОЛ` | `own_goal` | |
| `ПЕНАЛЬТИ` | `penalty` | Scored penalty |
| `НЕЗАБИТЫЙ ПЕНАЛЬТИ` | `missed_penalty` | |
| `ГОЛЕВОЙ ПАС` | `assist` | Separate event, linked to goal by `(half, minute, team_id)` |
| `ЖК` | `yellow_card` | |
| `2ЖК` | `second_yellow` | |
| `КК` | `red_card` | |
| `ЗАМЕНА` | `substitution` | `player1`=off, `player2`=on, same `team1`/`team2` |

> **Critical:** On `ГОЛ` events, `player2` is the **goalkeeper/opponent who conceded**, NOT the assisting player. Assists come as separate `ГОЛЕВОЙ ПАС` events and are linked by `(half, minute, team_id)`.

**Deduplication key:** `(half, minute, event_type, player_id)` or `(half, minute, event_type, normalized_name)`

#### `/em/{id}-stat.json` — Live Match Stats (109 metrics)

```json
[
  {"metric": "name",         "home": "Жетісу",  "away": "Қызылжар"},
  {"metric": "goals",        "home": 0,         "away": 1},
  {"metric": "goals_1",      "home": 0,         "away": 0},
  {"metric": "goals_2",      "home": 0,         "away": 1},
  {"metric": "shots",        "home": 9,         "away": 17},
  {"metric": "shots_on_target","home": 4,       "away": 3},
  {"metric": "corners",      "home": 4,         "away": 3},
  {"metric": "fouls",        "home": 14,        "away": 17},
  {"metric": "yc",           "home": 1,         "away": 6},
  {"metric": "rc",           "home": 1,         "away": 0},
  {"metric": "possessions",  "home": "48%",     "away": "52%"},
  {"metric": "saves",        "home": 1,         "away": 4}
]
```

Each metric has halves variants: `goals`, `goals_1`, `goals_2`, … `goals_5` (for extra time).
`possessions` is a **string** `"48%"`, not a number.

#### `/em/{id}-referies.json`

```json
[
  {"kind": "MAIN",                 "name": "Иван Иванов"},
  {"kind": "ASSISTANT1",           "name": "Петр Петров"},
  {"kind": "ASSISTANT2",           "name": "Сергей Сергеев"},
  {"kind": "REFEREE4",             "name": "Алексей Алексеев"},
  {"kind": "ASSISTANT_VIDEO_MAIN", "name": "Дмитрий Дмитриев"}
]
```

#### `/em/{id}-lineups-home.json` / `-lineups-away.json` — Simple Lineup

```json
[
  {"number": "Жеңіс",    "full_name": "away"},
  {"number": "СТАРТОВЫЙ","full_name": ""},
  {"number": 1,          "full_name": "Сергей Игнатович"},
  {"number": 4,          "full_name": "Саги Совет"}
]
```

Simpler format (just number + name). Uses `СТАРТОВЫЙ` section marker (vs `ОСНОВНЫЕ` in team-home.json).

#### `/em/{id}-players-home.json` / `-players-away.json` — Player Stats

```json
[
  {
    "kind": "home",
    "team": "Кайсар",
    "number": 7,
    "first_name": "Елжас",
    "last_name": "Алтынбеков",
    "full_name": "Елжас Алтынбеков",
    "id": "f6d93df2-3a63-48ec-8c1e-3ecef5386547",
    "goals": 0,
    "assists": 0,
    "yc": 0,
    "rc": 0
  }
]
```

Compact stats: goals, assists, yellow_cards (`yc`), red_cards (`rc`). Useful for real-time scoreboard.

---

## 4. Use Case 1 — Reference Data Sync

**Schedule:** `sync-references-daily` — 06:00 Asia/Almaty
**Service:** `ReferenceSyncService`

### Sync Order

```
1. Tournaments (no deps)
2. Seasons (3 languages: RU, KZ, EN in parallel)
3. Teams (per season_id in SYNC_SEASON_IDS)
```

### Tournament → Championship Mapping

sota.id has no concept of "championship" — QFL maps via `Championship.sota_ids` (array of tournament IDs stored in the DB). The reverse lookup happens in `ReferenceSyncService`.

### Season Sync (3 languages)

For each language, seasons are fetched with `Accept-Language` header. Results are merged:
```python
# Pseudo-code
ru_seasons = await client.get_seasons(lang="ru")
kz_seasons = await client.get_seasons(lang="kk")
en_seasons = await client.get_seasons(lang="en")
# Merge by id → {id: {name_ru: ..., name_kz: ..., name_en: ...}}
```

### Team Photo Sync

Team logos from sota.id are fetched and stored in MinIO:
```
sota.id URL → MinIO object name → DB stores object name → FileUrlType resolves on read
```

---

## 5. Use Case 2 — Player Sync

**Schedule:** part of `sync-games-every-2h`
**Service:** `PlayerSyncService`

### Player Deduplication

Players are identified by `Player.sota_id` (UUID from sota.id `id` field). A player is auto-created if they appear in stats but don't exist in the DB:

```python
async def _get_or_create_player_by_sota(self, sota_uuid: str, ...) -> int:
    # 1. Try lookup by sota_id
    # 2. Try lookup by name + team
    # 3. Create new player
```

### Player Season Stats

`/api/public/v2/players/{id}/season_stats/?season_id=X` returns `[{key, value, name}]`.

All 50+ fields are mapped to `PlayerSeasonStats` columns. Fields not in `PLAYER_SEASON_STATS_FIELDS` go to `extra_stats` (JSONB).

**Key stats fields (from `base.py`):**
- Basic: `games_played`, `games_starting`, `time_on_field_total`
- Goals: `goal`, `goal_pass`, `goal_and_assist`, `owngoal`, `penalty_success`
- Shots: `shot`, `shots_on_goal`, `shots_blocked_opponent`
- Passes: `pass`, `pass_ratio`, `key_pass`, `pass_cross`, `pass_progressive`
- Duels: `duel`, `duel_success`, `aerial_duel`, `ground_duel`
- Defense: `tackle`, `interception`, `recovery`
- Discipline: `yellow_cards`, `second_yellow_cards`, `red_cards`
- GK: `save_shot`, `goals_conceded`, `dry_match`
- Advanced: `xg`, `xg_per_90`

---

## 6. Use Case 3 — Game Stats Sync

**Schedule:** `sync-live-stats-every-15min`
**Service:** `GameSyncService`

### Prerequisite

A game **must have `sota_id` set** (UUID in `Game.sota_id`) for stats sync to work. If `sota_id` is null, sync is skipped.

### Game Stats Flow

```
sync_game_stats(game_id)
  ├── get_game_player_stats(sota_id)  → /games/{id}/players/
  │     └── upsert PlayerGameStats rows
  └── get_game_team_stats(sota_id)    → /games/{id}/teams/
        └── upsert TeamGameStats rows
```

**Fields stored per player per game (`GAME_PLAYER_STATS_FIELDS`):**
`goals`, `assists`, `shot`, `shots_on_goal`, `shots_off_goal`, `pass`, `pass_accuracy`, `duel`, `tackle`, `corner`, `offside`, `foul`, `yellow_cards`, `red_cards`

**Fields stored per team per game (`GAME_TEAM_STATS_FIELDS`):**
`possession`, `possession_percent`, `shot`, `shots_on_goal`, `shots_off_goal`, `pass`, `pass_accuracy`, `foul`, `yellow_cards`, `red_cards`, `corner`, `offside`

### Game Events Flow

```
sync_game_events(game_id)
  └── get_live_match_events(sota_id)  → /em/{sota_id}-list.json
        └── parse + deduplicate → insert GameEvent rows
```

**Assist linking algorithm:**
```
For each event in list:
  if action == "ГОЛЕВОЙ ПАС":
    # Find a goal in same half, within ±1 minute, by same team
    # Link as assist_game_event_id → goal_event_id
```

**Deduplication:** `UNIQUE(game_id, half, minute, event_type, player_id)` + fallback on normalized player name.

---

## 7. Use Case 4 — Season Statistics

**Schedule:** part of `sync-games-every-2h`
**Services:** `StatsSyncService`

### Score Table

```
sync_score_table(season_id)
  └── GET /seasons/{id}/score_table/
        └── goals string "53:19" → goals_scored=53, goals_conceded=19
```

### Team Season Stats (92 metrics)

```
sync_team_season_stats(season_id)
  └── For each team in season:
        GET /v2/teams/{id}/season_stats/?season_id=X
        → [{key, value, name}] → upsert TeamSeasonStats
```

All 92 fields are in `TEAM_SEASON_STATS_FIELDS`. Extra fields → `extra_stats` JSONB.

---

## 8. Use Case 5 — Pre-Game Lineup

**Triggered by:** `check-upcoming-games-every-5min` → `sync_pre_game_lineup(game_id)`
**Service:** `LineupSyncService`

### Sync Flow

```
sync_pre_game_lineup(game_id)
  └── GET /games/{sota_id}/pre_game_lineup/
        ├── Upsert referees (main, assistants, 4th, VAR, inspector)
        ├── Upsert coaches (home + away)
        └── Upsert lineup players (GameLineup rows)
             └── Player lookup: by sota_id → by name → create
```

### Lineup Response Structure

```json
{
  "data": {
    "referee": {"main": "Name", "1st_assistant": "...", "2nd_assistant": "...", "4th_referee": "...", "video_assistant_1": "...", "video_assistant_main": "...", "match_inspector": "..."},
    "home_team": {
      "coach": "Name",
      "lineup": [{"player_id": "uuid", "first_name": "...", "last_name": "...", "player_number": 8, "country_name": "...", "bas_image_path": "..."}]
    },
    "away_team": {"...": "same structure"}
  }
}
```

---

## 9. Use Case 6 — Live Match Data

**Schedule:** `sync-live-events-every-5sec` + `check-upcoming-games-every-5min`
**Service:** `LineupSyncService` + `GameSyncService`

### Live Data Sources (priority order)

```
1. sota.id /em/{sota_id}-team-{side}.json       → positions, kits, formation
2. vsporte.ru /api/v2/qfl/files/{vsporte_id}_team_{side}.json  → fallback
```

### Live Lineup Processing (`sync_live_positions_and_kits`)

```python
for side in ["home", "away"]:
    live_data = await _fetch_from_sota(game.sota_id, side)
    # OR
    live_data = await _fetch_from_vsporte(game.vsporte_id, "host"/"guest")

    for entry in live_data:
        # Extract marker rows → formation, coach, kit_color
        # Extract player rows → update amplua, field_position, lineup_type
```

### Lineup Entry Parsing (`lineup_feed_parser.py`)

The `normalize_lineup_entry()` function handles both sota.id and VSporte formats:

```python
STARTING_MARKERS = {"ОСНОВНЫЕ", "STARTING"}
SUBS_MARKERS = {"ЗАПАСНЫЕ", "SUBS"}
COACH_MARKERS = {"COACH", "MAIN"}
FORMATION_MARKER = "FORMATION"
TEAM_MARKER = "TEAM"
```

- Entries with `number` in `STARTING_MARKERS` → set `current_section = starter`
- Entries with `number` in `SUBS_MARKERS` → set `current_section = substitute`
- Integer `number` entries → actual player row with `amplua` and `position`
- `FORMATION` entry → extract formation string and kit color `#RRGGBB` from `full_name`

### VSporte Fallback

```
URL: https://broadcast.vsporte.ru/api/v2/qfl/files/{vsporte_id}_team_{side}.json
Side mapping: "home" → "host", "away" → "guest"
```

VSporte uses `vsporte_id` stored in `Game.vsporte_id`. The response format is identical to sota.id `/em/` lineup format (same parser handles both).

### Live Caching

```python
LINEUP_LIVE_REFRESH_TTL_SECONDS = 30    # In-memory cache TTL
LINEUP_LIVE_REFRESH_TIMEOUT_SECONDS = 3  # HTTP request timeout
```

---

## 10. VMix / TV Broadcast Endpoints

These endpoints are designed for video production (OBS/vMix broadcast software). They return data in a TV-friendly flat format with BAS file paths.

### Generate VMix Links

```
GET /api/public/v1/games/{id}/vmix/generate_link/
```

Returns all available stream links including undocumented `/em/` endpoints:
```json
[
  {"name": "team-home",      "link": "https://sota.id/em/{id}-team-home.json?access_token=...", "ordering": 1},
  {"name": "team-away",      "link": "https://sota.id/em/{id}-team-away.json?access_token=...", "ordering": 2},
  {"name": "list",           "link": "https://sota.id/em/{id}-list.json?access_token=...",      "ordering": 3},
  {"name": "stat",           "link": "https://sota.id/em/{id}-stat.json?access_token=...",      "ordering": 4},
  {"name": "referies",       "link": "https://sota.id/em/{id}-referies.json?access_token=...", "ordering": 5},
  {"name": "lineups-home",   "link": "https://sota.id/em/{id}-lineups-home.json?access_token=...","ordering": 6},
  {"name": "lineups-away",   "link": "https://sota.id/em/{id}-lineups-away.json?access_token=...","ordering": 7},
  {"name": "players-home",   "link": "https://sota.id/em/{id}-players-home.json?access_token=...","ordering": 8},
  {"name": "players-away",   "link": "https://sota.id/em/{id}-players-away.json?access_token=...","ordering": 9}
]
```

### Best Players in Game (vmix)

```
GET /api/public/v1/games/vmix/{id}/best-players/{team_id}/?metric=shot
```

**Required:** `metric` param (400 if missing).

```json
[
  {"position": "Позиция", "metric_en": "Название метрики", "...": "header row"},
  {
    "position": "",
    "metric_en": "Shots",
    "metric_kz": "Соққылар",
    "image_bas": "C:\\KPL_FINAL\\SOTA_PHOTO_PLAYER\\Kaisar\\GUBAREV_NIKITA.png",
    "name_en": "Nikita Gubarev",
    "name_kz": "Никита Губарев",
    "value": 5,
    "main_team_en": "Kaysar"
  }
]
```

### All Player Stats Matrix (vmix v2)

```
GET /api/public/v2/games/vmix/{id}/team-players-stats/{team_id}/
```

Returns a matrix where rows are metrics and columns are player names:
```json
[
  {"metric_kz": "Название метрики", "Елжас Алтынбеков": "Елжас Алтынбеков", "...": "all players"},
  {"metric_kz": "Ссылка на лого команды", "Елжас Алтынбеков": "C:\\KPL_FINAL\\LOGO_KOMAND\\Kaisar.png"},
  {"metric_kz": "Ссылка на фото", "Елжас Алтынбеков": "C:\\KPL_FINAL\\...\\ALTYNBEKOV.png"},
  {"metric_kz": "Соққылар", "Елжас Алтынбеков": 3, "Нурмат Сарсенов": 1, "...": "per-player values"}
]
```

### Last 5 Games (vmix)

```
GET /api/public/v1/seasons/vmix/{season_id}/last-games/{team_id}/
```

```json
[
  {
    "opponent_en": "Jenis",
    "opponent_kz": "Жеңіс",
    "opponent_image_bas": "C:\\KPL_FINAL\\LOGO_KOMAND\\Jenis.png",
    "score": "2-2",
    "date": "26.10",
    "result": "#F49C00",
    "main_team_en": "Kaysar"
  }
]
```

`result` is a HEX color: `#1DB954` = win, `#F49C00` = draw, `#E0032B` = loss.

### Season Score Table (vmix)

```
GET /api/public/v1/seasons/vmix/{season_id}/score_table/
```

```json
[
  {
    "position": 1,
    "name_kz": "Қайрат",
    "image_bas": "C:\\KPL_FINAL\\LOGO_KOMAND\\Kairat.png",
    "rg": 34,
    "wins": 18,
    "draws": 5,
    "losses": 3,
    "goals": "53:19",
    "points": 59,
    "matches": 26
  }
]
```

### Teams Season Stats Ranking (vmix)

```
GET /api/public/v1/seasons/vmix/{season_id}/teams_season_stats/?metric=shot
```

```json
[
  {"position": "Позиция", "...": "header row"},
  {
    "metric_en": "Shots",
    "metric_kz": "Соққылар",
    "image_bas": "C:\\KPL_FINAL\\LOGO_KOMAND\\Kairat.png",
    "name_en": "Kairat",
    "name_kz": "Қайрат",
    "value": 448,
    "secondary_value": 17.2,
    "games": 26,
    "position": 1
  }
]
```

### Two-Team Average Stats Comparison (vmix)

```
GET /api/public/v1/seasons/vmix/{season_id}/teams_average_season_stats/{game_id}/
```

Returns 11 rows comparing two teams playing in the specified game (season averages):
```json
[
  {"metric_en": "name",                   "team_home": "Kaysar",  "team_away": "Jenis"},
  {"metric_en": "logo",                   "team_home": "C:\\...\\Kaisar.png", "team_away": "C:\\...\\Jenis.png"},
  {"metric_en": "Possessions per match",  "team_home": 18.7,      "team_away": 29.2},
  {"metric_en": "Goals per match",        "team_home": 0.9,       "team_away": 1.3},
  {"metric_en": "Yellow cards per match", "team_home": 1.7,       "team_away": 2.1},
  {"metric_en": "Red cards per match",    "team_home": 0.1,       "team_away": 0.1},
  {"metric_en": "Accurate passes per match","team_home": 219.3,   "team_away": 454.3},
  {"metric_en": "Corner per match",       "team_home": 3.4,       "team_away": 3.7}
]
```

### Team's Best Players for Season (vmix)

```
GET /api/public/v1/seasons/vmix/{season_id}/teams/{team_id}/best-players/{game_id}/?metric=shot
```

```json
[
  {"position": "Позиция", "...": "header row"},
  {
    "position": "",
    "metric_en": "Shots",
    "metric_kz": "Соққылар",
    "image_bas": "C:\\...\\ABIKEN_AIBOL.png",
    "name_en": "Aybol Abiken",
    "name_kz": "Айбол Әбікен",
    "value": "45",
    "main_team_en": "Kaysar"
  }
]
```

---

## 11. Celery Tasks & Scheduling

```python
# backend/app/tasks/__init__.py
# Active only when SOTA_ENABLED=True
```

| Task ID | Schedule | Action |
|---------|----------|--------|
| `sync-references-daily` | 06:00 Asia/Almaty | Tournaments + seasons (3 lang) + teams |
| `sync-games-every-2h` | `0 */2 * * *` | Players + game data + player stats |
| `sync-live-stats-every-15min` | `*/15 * * * *` | Game stats for recent/live games |
| `check-upcoming-games-every-5min` | `*/5 * * * *` | Detect upcoming games, pre-game lineup |
| `sync-live-events-every-5sec` | every 5.0s | Live events from `/em/-list.json` |
| `end-finished-games-every-10min` | `*/10 * * * *` | Mark finished live games |

### Feature Flags

| Flag | Effect |
|------|--------|
| `SOTA_ENABLED=false` | `beat_schedule = {}` — disables ALL Celery sync |
| `Season.sync_enabled=False` | Skip all sync operations for that season |
| `Game.sync_disabled=True` | Skip sync for that specific game |

---

## 12. Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SOTA_ENABLED` | `true` | Master switch for Celery sync pipeline |
| `SOTA_API_EMAIL` | — | Email for JWT authentication |
| `SOTA_API_PASSWORD` | — | Password for JWT authentication |
| `SOTA_API_BASE_URL` | `https://sota.id/api` | API base URL |
| `SYNC_SEASON_IDS` | `[61,85,71,80,84,200]` | Local season IDs synced by Celery tasks. KPL 2026 uses local `200`; SOTA mapping stays in `seasons.sota_season_id=173`. |
| `LINEUP_LIVE_REFRESH_TTL_SECONDS` | `30` | In-memory cache TTL for live lineups |
| `LINEUP_LIVE_REFRESH_TIMEOUT_SECONDS` | `3` | HTTP timeout for live lineup requests |

---

## 13. Unused Endpoints — Development Potential

| Endpoint | Priority | What can be built | Data availability |
|----------|----------|------------------|-------------------|
| `GET /seasons/{id}/best_players/?metric=goal&max=10&tour=N` | ⭐⭐⭐ HIGH | Scorers table, assists table, MVP widget | Active season only — data cleared after end |
| `GET /seasons/{id}/team_of_week/?tour=N` | ⭐⭐⭐ HIGH | "Team of the Tour" page / widget | Active season only (without tour: last 3 tours) |
| `GET /v2/players/{id}/game_stats/?game_id=X` | ⭐⭐⭐ HIGH | Detailed player profile per game (50 metrics) | Works for all seasons |
| `GET /v1/teams/{id}/season_stats_v2/?tour=N&single_tour=bool` | ⭐⭐ MED | Team performance trend by tour (92 metrics) | Works for all seasons |
| `GET /seasons/{id}/season_stats_v2/` | ⭐⭐ MED | League-wide aggregate stats (71 metrics) | Works for all seasons |
| `GET /v2/seasons/{id}/season_stats/` | ⭐⭐ MED | Same 71 metrics (v2 alt) | Works for all seasons |
| `GET /metrics/` | ⭐ LOW | Dynamic metric catalog (293 metrics, 287 unique keys) | Always available |
| `GET /em/{id}-players-{side}.json` | ⭐⭐ MED | 78 fields per player with per-half breakdown | During/after match |
| `GET /vmix/.../teams_average_season_stats/{game_id}/` | ⭐⭐ MED | Pre-match two-team comparison widget | Works for all seasons |
| All other `vmix` endpoints | ⭐ LOW | TV broadcast / OBS integration | Varies |

### Implementing `best_players`

```python
# New SotaClient method:
async def get_best_players(
    self, season_id: int, metric: str, max: int = 10, tour: int | None = None
) -> dict:
    params = {"metric": metric, "max": max}
    if tour:
        params["tour"] = tour
    response = await self._make_request(
        "get",
        f"{self.base_url}/public/v1/seasons/{season_id}/best_players/",
        params=params,
    )
    return response.json()
```

### Implementing `team_of_week`

```python
async def get_team_of_week(self, season_id: int, tour: int | None = None) -> dict:
    params = {"tour": tour} if tour else {}
    response = await self._make_request(
        "get",
        f"{self.base_url}/public/v1/seasons/{season_id}/team_of_week/",
        params=params,
    )
    return response.json()
```

---

## 14. Manual Operations

### Re-sync Assists

```bash
# Single game
docker exec qfl-backend python3 scripts/resync_assists.py <game_id>

# All games
docker exec qfl-backend python3 scripts/resync_assists.py --all

# All games in season
docker exec qfl-backend python3 scripts/resync_assists.py --season <season_id>
```

Use when assist linking fails (team name mismatch, minute offset).

### Trigger Sync via Admin API

```bash
# Trigger reference sync
curl -X POST https://kffleague.kz/api/v1/admin/sync/references/

# Trigger game sync for season
curl -X POST https://kffleague.kz/api/v1/admin/sync/games/?season_id=61

# Sync specific game events
curl -X POST https://kffleague.kz/api/v1/admin/sync/game-events/<game_id>/
```

---

## 15. Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Stats not syncing for a game | `Game.sota_id = NULL` | Set `sota_id` via Admin → Games |
| Assists not linked | Team name mismatch or ±1min offset | Run `scripts/resync_assists.py <game_id>` |
| Sync skipped for season | `Season.sync_enabled = False` | Enable in Admin → Seasons |
| Player not found in lineup | `Player.sota_id` not set | Player auto-created; check for duplicates |
| `401 Unauthorized` on API | Expired JWT or wrong credentials | Check `SOTA_API_EMAIL`/`SOTA_API_PASSWORD` in `.env`, restart Celery |
| `404` on `/em/` endpoint | Game not started or wrong sota_id | Expected for future games; verify `Game.sota_id` |
| Duplicate events | Re-sync triggered twice | Deduplication runs automatically; safe to re-sync |
| `score_table_v2` returns null | v2 endpoints not available for some seasons | Use v1: `/seasons/{id}/score_table/` |
| `best_players` returns empty | Season completed without tour param | Pass explicit `tour=N` for historical data |
| Live lineup shows wrong kits | Colors come from FORMATION marker | Re-run `sync_live_positions_and_kits` |
| VSporte fallback not working | `Game.vsporte_id = NULL` | Set vsporte_id in Admin or use sota_id directly |
