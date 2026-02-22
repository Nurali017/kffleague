# QFL Backend — API Documentation

> REST API сайта Казахстанской Федерации Футбола (kff.1sportkz.com).
> **Base URL:** `https://kff.1sportkz.com/api/v1`

---

## Содержание

1. [Архитектура](#1-архитектура)
2. [Общие паттерны](#2-общие-паттерны)
3. [Иерархия данных](#3-иерархия-данных)
4. [Championships](#4-championships) — 3 эндпоинта
5. [Seasons](#5-seasons) — 15 эндпоинтов
6. [Games](#6-games) — 4 эндпоинта
7. [Teams](#7-teams) — 8 эндпоинтов
8. [Players](#8-players) — 6 эндпоинтов
9. [Clubs](#9-clubs) — 2 эндпоинта
10. [Cities](#10-cities) — 1 эндпоинт
11. [Partners](#11-partners) — 1 эндпоинт
12. [Cup](#12-cup) — 2 эндпоинта
13. [Countries](#13-countries) — 7 эндпоинтов
14. [News](#14-news) — 6 эндпоинтов
15. [Pages](#15-pages) — 5 эндпоинтов
16. [Live / WebSocket](#16-live--websocket) — 8 + WS
17. [Приложение](#17-приложение)

---

## 1. Архитектура

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Сайт      │────▶│  Backend    │────▶│ PostgreSQL  │◀────│ Celery Beat │
│  (Next.js)  │◀────│  (FastAPI)  │     │             │     │ (авто-синк) │
└─────────────┘     └──────┬──────┘     └─────────────┘     └──────┬──────┘
                           │                                       │
                    ┌──────┴──────┐                         ┌──────┴──────┐
                    │   MinIO     │                         │  SOTA API   │
                    │  (файлы)    │                         │ (sokfa.kz)  │
                    └─────────────┘                         └─────────────┘
```

| Компонент | Технология | Назначение |
|-----------|-----------|------------|
| Backend | FastAPI + SQLAlchemy async | REST API + WebSocket |
| БД | PostgreSQL 15 | 33 модели |
| Файлы | MinIO | Логотипы, фото, изображения |
| Очереди | Celery + Redis | Фоновая синхронизация с SOTA |
| Источник | SOTA API (sokfa.kz) | Спортивные данные: команды, матчи, статистика |

---

## 2. Общие паттерны

### 2.1 Локализация (`lang`)

Большинство публичных эндпоинтов принимают query-параметр `lang`:

| Значение | Язык | Описание |
|----------|------|----------|
| `ru` | Русский | По умолчанию для большинства эндпоинтов |
| `kz` | Казахский | По умолчанию для teams, players, countries |
| `en` | Английский | — |

Допустимые значения: `^(kz|ru|en)$`. При передаче `lang=kz` поля `name`, `first_name` и т.д. возвращают значения из `name_kz`, `first_name_kz` с фоллбеком на `ru` → `en`.

### 2.2 Пагинация

**Стандартная** (большинство эндпоинтов):
```
?limit=50&offset=0
```
- `limit` — кол-во записей (default: 50, max: 100; для brackets/team_tournaments max: 200)
- `offset` — смещение (default: 0)

**Постраничная** (только News):
```
?page=1&per_page=20
```
- `page` — номер страницы (min: 1)
- `per_page` — записей на странице (default: 20, range: 1-100)

### 2.3 Формат ответов

Все списковые эндпоинты возвращают:
```json
{
  "items": [...],
  "total": 42
}
```

News дополнительно возвращает:
```json
{
  "items": [...],
  "total": 42,
  "page": 1,
  "per_page": 20,
  "pages": 3
}
```

### 2.4 Файловые URL (MinIO)

Все URL файлов (логотипы, фото, флаги) автоматически резолвятся на уровне ORM через `FileUrlType`:
- **В БД**: `player_photos/abc123.webp`
- **В API**: `https://kff.1sportkz.com/storage/player_photos/abc123.webp`

Поля с URL: `logo_url`, `photo_url`, `flag_url`, `cover_image`, `images[]`.

### 2.5 Идентификаторы

Все модели используют числовые ID (`Integer` или `BigInteger`):
- **Game** — `BigInteger` (большие числа, например `1234567`)
- Все остальные — `Integer`

### 2.6 Сезон по умолчанию

Многие эндпоинты принимают `season_id`. Если не указан — используется `settings.current_season_id` (текущий активный сезон, настраивается в конфиге).

### 2.7 Статусы матчей

Статус вычисляется динамически из полей `is_live`, `home_score`, `away_score`, `date`:

| Значение | Условие |
|----------|---------|
| `live` | `is_live = true` |
| `finished` | `home_score IS NOT NULL AND away_score IS NOT NULL AND NOT is_live` |
| `upcoming` | Всё остальное |

### 2.8 Ошибки

```json
{ "detail": "Not found" }
```

| Код | Когда |
|-----|-------|
| 404 | Ресурс не найден |
| 422 | Невалидные параметры |

---

## 3. Иерархия данных

```
Championship (8)                        ← "ПРЕМЬЕР-ЛИГА", "ПЕРВАЯ ЛИГА", "КУБОК"
  └── Tournament (7)                    ← championship_id FK
       └── Season (29)
            ├── Stage (106)             ← туры / этапы сезона
            │    └── Game (881)         ← stage_id FK (+ penalty scores)
            ├── TeamTournament (64)     ← привязка команд + группы
            ├── PlayoffBracket (15)     ← сетка плей-офф
            ├── ScoreTable              ← турнирная таблица
            ├── PlayerSeasonStats       ← статистика игроков
            └── TeamSeasonStats         ← статистика команд

Club (54)                               ← организация-клуб
  └── Team (119)                        ← club_id FK
       ├── PlayerTeam (4370)            ← привязка игрок ↔ команда
       └── TeamCoach (415)              ← привязка тренер ↔ команда

City (100)
  ├── Stadium (110)                     ← city_id FK
  └── Club (54)                         ← city_id FK

Country (249)
  ├── Player (2043)                     ← country_id FK
  ├── Coach (234)
  └── City (100)                        ← country_id FK

Partner (8)                             ← спонсоры
  ├── → Championship (M:1)
  └── → Season (M:1)
```

**Пример полной цепочки:**
```
Championship: "ПРЕМЬЕР-ЛИГА"
  └── Tournament: "Premier League" (id=7)
       └── Season: "2025" (id=61)
            ├── Stage: "5 тур" → Game: "Астана vs Тобол" (stage_id=42)
            ├── TeamTournament: Астана (team_id=91, group=null)
            └── ScoreTable: Астана (position=1, points=25)

Club: "Астана" (city=Астана)
  ├── Team: "Астана" (id=91)        ← основная, Премьер-лига
  ├── Team: "Астана М" (id=626)     ← молодёжная
  └── Team: "Астана Ж" (id=653)     ← женская
```

---

## 4. Championships

Чемпионаты — верхний уровень иерархии турниров.

### GET /championships

Список всех активных чемпионатов.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | Язык (`kz`, `ru`, `en`) |

**Сортировка:** `sort_order ASC, id ASC`

**Ответ:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "ПРЕМЬЕР-ЛИГА",
      "short_name": "ПЛ",
      "slug": "premier-league",
      "sort_order": 1,
      "is_active": true
    }
  ],
  "total": 8
}
```

### GET /championships/tree

Полное дерево: Championship → Tournament → Season. Используется для навигации по сайту.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | Язык |

**Eager loading:** `Championship.tournaments → Tournament.seasons`

**Ответ:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "ПРЕМЬЕР-ЛИГА",
      "short_name": "ПЛ",
      "slug": "premier-league",
      "tournaments": [
        {
          "id": 7,
          "name": "Premier League",
          "seasons": [
            {
              "id": 61,
              "name": "2025",
              "date_start": "2025-03-01",
              "date_end": "2025-11-30",
              "sync_enabled": true
            }
          ]
        }
      ]
    }
  ],
  "total": 8
}
```

### GET /championships/{championship_id}

| Параметр | Тип | Описание |
|----------|-----|----------|
| `championship_id` | int | **path** |
| `lang` | string | `ru` |

**Ответ:** `ChampionshipResponse` (те же поля что в списке)

**Ошибки:** `404` — чемпионат не найден

---

## 5. Seasons

Самый объёмный модуль — 15 эндпоинтов. Сезон содержит матчи, таблицу, статистику, туры, сетку плей-офф.

### GET /seasons

Список всех сезонов.

**Сортировка:** `date_start DESC`

**Ответ:**
```json
{
  "items": [
    {
      "id": 61,
      "name": "2025",
      "tournament_id": 7,
      "tournament_name": "Premier League",
      "championship_name": "ПРЕМЬЕР-ЛИГА",
      "date_start": "2025-03-01",
      "date_end": "2025-11-30",
      "sync_enabled": true
    }
  ],
  "total": 29
}
```

### GET /seasons/{season_id}

Детали сезона.

**Ответ:** `SeasonResponse` (те же поля + может включать `stages[]`)

**Ошибки:** `404`

### PATCH /seasons/{season_id}/sync

Включить/выключить автосинхронизацию с SOTA.

**Body:**
```json
{ "sync_enabled": true }
```

### GET /seasons/{season_id}/table

Турнирная таблица.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `group` | string? | — | Фильтр по группе (из `TeamTournament.group_name`, напр. `"A"`, `"B"`) |
| `tour_from` | int? | — | Тур с (включительно) |
| `tour_to` | int? | — | Тур по (включительно) |
| `home_away` | string? | — | `home` или `away` |
| `lang` | string | `ru` | Язык |

**Логика:** Без фильтров — возвращает хранимую таблицу из `ScoreTable`. С фильтрами — динамически рассчитывает по играм за указанный диапазон туров. С `group` — возвращает только команды указанной группы (комбинируется с `tour_from`/`tour_to`/`home_away`).

**Ответ:**
```json
{
  "season_id": 61,
  "filters": { "tour_from": 1, "tour_to": 10, "home_away": "home" },
  "table": [
    {
      "position": 1,
      "team_id": 91,
      "team_name": "Астана",
      "team_logo": "https://kff.1sportkz.com/storage/team_logos/astana.png",
      "games_played": 10,
      "wins": 8,
      "draws": 1,
      "losses": 1,
      "goals_scored": 22,
      "goals_conceded": 7,
      "goal_difference": 15,
      "points": 25,
      "form": ["W", "W", "D", "W", "L"],
      "next_game": {
        "game_id": 12345,
        "opponent_id": 90,
        "opponent_name": "Тобол",
        "is_home": true,
        "date": "2025-06-15"
      }
    }
  ]
}
```

### GET /seasons/{season_id}/results-grid

Матрица результатов — каждая команда vs каждая по турам.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `group` | string? | — | Фильтр по группе |
| `lang` | string | `ru` | Язык |

**Ответ:**
```json
{
  "season_id": 61,
  "total_tours": 33,
  "teams": [
    {
      "position": 1,
      "team_id": 91,
      "team_name": "Астана",
      "team_logo": "https://...",
      "results": [
        { "tour": 1, "result": "W", "score": "2:1", "opponent_id": 90 },
        { "tour": 2, "result": "D", "score": "1:1", "opponent_id": 13 }
      ]
    }
  ]
}
```

### GET /seasons/{season_id}/games

Матчи сезона.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `tour` | int? | — | Фильтр по конкретному туру |
| `lang` | string | `ru` | Язык |

**Сортировка:** `date DESC, time DESC`

**Ответ:**
```json
{
  "items": [
    {
      "id": 12345,
      "date": "2025-05-10",
      "time": "18:00:00",
      "tour": 5,
      "season_id": 61,
      "home_score": 2,
      "away_score": 1,
      "has_stats": true,
      "stadium": "Астана Арена",
      "visitors": 15000,
      "home_team": { "id": 91, "name": "Астана", "logo": "https://..." },
      "away_team": { "id": 90, "name": "Тобол", "logo": "https://..." },
      "season_name": "2025"
    }
  ],
  "total": 264
}
```

### GET /seasons/{season_id}/stages

Список туров/этапов сезона.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | Язык |

**Сортировка:** `sort_order ASC`

**Ответ:**
```json
{
  "items": [
    {
      "id": 42,
      "season_id": 61,
      "name": "5 тур",
      "stage_number": 5,
      "sort_order": 5
    }
  ],
  "total": 33
}
```

### GET /seasons/{season_id}/stages/{stage_id}/games

Матчи конкретного тура.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | Язык |

**Ответ:** Тот же формат что `/seasons/{id}/games`, но отфильтровано по `stage_id`. Дополнительно содержит: `stage_id`, `stage_name`, `home_penalty_score`, `away_penalty_score`.

### GET /seasons/{season_id}/bracket

Сетка плей-офф сезона, сгруппированная по раундам.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | Язык |

**Раунды (round_name → round_label):**
| round_name | round_label |
|-----------|-------------|
| `1_16` | 1/16 финала |
| `1_8` | 1/8 финала |
| `1_4` | 1/4 финала |
| `1_2` | 1/2 финала |
| `final` | Финал |
| `3rd_place` | Матч за 3-е место |

**Ответ:**
```json
{
  "season_id": 42,
  "rounds": [
    {
      "round_name": "1_8",
      "round_label": "1/8 финала",
      "entries": [
        {
          "id": 1,
          "round_name": "1_8",
          "side": "left",
          "sort_order": 1,
          "is_third_place": false,
          "game": {
            "id": 12345,
            "date": "2025-05-10",
            "time": "18:00:00",
            "status": "finished",
            "home_team": { "id": 91, "name": "Астана", "logo": "https://..." },
            "away_team": { "id": 90, "name": "Тобол", "logo": "https://..." },
            "home_score": 2,
            "away_score": 1,
            "home_penalty_score": null,
            "away_penalty_score": null
          }
        }
      ]
    }
  ]
}
```

### GET /seasons/{season_id}/teams

Команды-участники сезона (через TeamTournament).

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | Язык |

**Ответ:**
```json
{
  "items": [
    {
      "id": 1,
      "team_id": 91,
      "team_name": "Астана",
      "team_logo": "https://...",
      "season_id": 61,
      "group_name": null,
      "is_disqualified": false,
      "fine_points": 0,
      "sort_order": 1
    }
  ],
  "total": 14
}
```

### GET /seasons/{season_id}/groups

Команды сезона, разбитые по группам. Для турниров с групповым этапом (Вторая лига, Кубок).

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | Язык |

**Ответ:**
```json
{
  "season_id": 71,
  "groups": {
    "A": [
      {
        "id": 1,
        "team_id": 629,
        "team_name": "Алтай М",
        "team_logo": "https://...",
        "season_id": 71,
        "group_name": "A",
        "is_disqualified": false,
        "fine_points": 0,
        "sort_order": 1
      }
    ],
    "B": [
      { "id": 5, "team_id": 648, "team_name": "АКАС", "group_name": "B" }
    ]
  }
}
```

### GET /seasons/{season_id}/player-stats

Таблица статистики игроков сезона с сортировкой и фильтрами.

| Параметр | Тип | Default | Допустимые значения |
|----------|-----|---------|---------------------|
| `sort_by` | string | `goals` | см. таблицу ниже |
| `team_id` | int? | — | Фильтр по команде |
| `group` | string? | — | Фильтр по группе |
| `position_code` | string? | — | `GK`, `DEF`, `MID`, `FWD` |
| `nationality` | string? | — | `kz` (казахстанцы), `foreign` (легионеры) |
| `limit` | int | 50 | max: 100 |
| `offset` | int | 0 | — |
| `lang` | string | `ru` | — |

**Допустимые значения `sort_by`:**

| Значение | Описание |
|----------|----------|
| `goals` | Голы |
| `assists` | Голевые передачи |
| `xg` | Expected goals |
| `shots` | Удары |
| `shots_on_goal` | Удары в створ |
| `passes` | Передачи |
| `key_passes` | Ключевые передачи |
| `pass_accuracy` | Точность передач (%) |
| `duels` | Единоборства |
| `duels_won` | Выигранные единоборства |
| `aerial_duel` | Воздушные единоборства |
| `ground_duel` | Наземные единоборства |
| `tackle` | Отборы |
| `interception` | Перехваты |
| `recovery` | Подборы |
| `dribble` | Обводки |
| `dribble_success` | Успешные обводки |
| `minutes_played` | Минуты на поле |
| `games_played` | Матчи |
| `yellow_cards` | Жёлтые карточки |
| `red_cards` | Красные карточки |
| `save_shot` | Сейвы (для вратарей) |
| `dry_match` | Сухие матчи |

**Ответ:**
```json
{
  "season_id": 61,
  "sort_by": "goals",
  "items": [
    {
      "player_id": 1234,
      "first_name": "Иван",
      "last_name": "Иванов",
      "photo_url": "https://...",
      "country": { "code": "KZ", "name": "Казахстан", "flag_url": "https://..." },
      "team_id": 91,
      "team_name": "Астана",
      "team_logo": "https://...",
      "player_type": "footballer",
      "top_role": "forward",
      "position_code": "FWD",
      "games_played": 10,
      "games_starting": 8,
      "minutes_played": 720,
      "goals": 8,
      "assists": 3,
      "xg": 7.2,
      "shots": 42,
      "shots_on_goal": 18,
      "passes": 320,
      "pass_accuracy": 85.5,
      "key_passes": 12,
      "duels": 80,
      "duels_won": 48,
      "yellow_cards": 2,
      "red_cards": 0
    }
  ],
  "total": 250
}
```

### GET /seasons/{season_id}/team-stats

Таблица статистики команд сезона.

| Параметр | Тип | Default | Допустимые значения |
|----------|-----|---------|---------------------|
| `sort_by` | string | `points` | см. таблицу ниже |
| `group` | string? | — | Фильтр по группе |
| `limit` | int | 50 | max: 100 |
| `offset` | int | 0 | — |
| `lang` | string | `ru` | — |

**Допустимые значения `sort_by`:**

| Значение | Описание |
|----------|----------|
| `points` | Очки |
| `goals_scored` | Забитые голы |
| `goals_conceded` | Пропущенные голы |
| `goal_difference` | Разница голов |
| `wins` | Победы |
| `draws` | Ничьи |
| `losses` | Поражения |
| `games_played` | Матчи |
| `shots` | Удары |
| `shots_on_goal` | Удары в створ |
| `possession_avg` | Среднее владение (%) |
| `passes` | Передачи |
| `pass_accuracy_avg` | Средняя точность передач (%) |
| `key_pass` | Ключевые передачи |
| `tackle` | Отборы |
| `interception` | Перехваты |
| `recovery` | Подборы |
| `dribble` | Обводки |
| `fouls` | Фолы |
| `yellow_cards` | Жёлтые карточки |
| `red_cards` | Красные карточки |
| `xg` | Expected goals |
| `corners` | Угловые |
| `offsides` | Офсайды |

**Ответ:**
```json
{
  "season_id": 61,
  "sort_by": "points",
  "items": [
    {
      "team_id": 91,
      "team_name": "Астана",
      "team_logo": "https://...",
      "games_played": 10,
      "wins": 8,
      "draws": 1,
      "losses": 1,
      "goals_scored": 22,
      "goals_conceded": 7,
      "goal_difference": 15,
      "points": 25,
      "shots": 150,
      "shots_on_goal": 60,
      "possession_avg": 58.2,
      "passes": 4800,
      "pass_accuracy_avg": 85.0,
      "key_pass": 120,
      "tackle": 180,
      "interception": 90,
      "recovery": 350,
      "dribble": 75,
      "fouls": 110,
      "yellow_cards": 18,
      "red_cards": 1,
      "xg": 20.5,
      "corners": 55,
      "offsides": 12
    }
  ],
  "total": 14
}
```

### GET /seasons/{season_id}/statistics

Общая агрегированная статистика сезона.

**Ответ:**
```json
{
  "season_id": 61,
  "season_name": "2025",
  "matches_played": 132,
  "wins": 80,
  "draws": 30,
  "total_attendance": 450000,
  "average_attendance": 3409,
  "total_goals": 310,
  "goals_per_match": 2.35,
  "penalties": 22,
  "penalties_scored": 18,
  "fouls_per_match": 24.5,
  "yellow_cards": 420,
  "second_yellow_cards": 8,
  "red_cards": 12
}
```

### GET /seasons/{season_id}/goals-by-period

Распределение голов по 15-минутным интервалам.

**Ответ:**
```json
{
  "season_id": 61,
  "period_size_minutes": 15,
  "periods": [
    { "period": "0-15", "goals": 35, "home": 20, "away": 15 },
    { "period": "16-30", "goals": 42, "home": 25, "away": 17 },
    { "period": "31-45", "goals": 50, "home": 28, "away": 22 },
    { "period": "46-60", "goals": 48, "home": 22, "away": 26 },
    { "period": "61-75", "goals": 55, "home": 30, "away": 25 },
    { "period": "76-90+", "goals": 80, "home": 45, "away": 35 }
  ],
  "meta": {
    "matches_played": 132,
    "matches_with_goal_events": 128,
    "coverage_pct": 96.97
  }
}
```

---

## 6. Games

Match Center — матчи, статистика, составы.

### GET /games

Список матчей с фильтрацией и группировкой.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `season_id` | int? | current | Сезон (по умолчанию текущий) |
| `team_id` | int? | — | Фильтр по команде (home или away) |
| `team_ids` | list[int]? | — | Несколько команд: `?team_ids=91&team_ids=90` |
| `tour` | int? | — | Номер тура |
| `tours` | list[int]? | — | Несколько туров: `?tours=18&tours=19` |
| `month` | int? | — | Месяц (1-12), требует `year` |
| `year` | int? | — | Год |
| `date_from` | date? | — | Начало диапазона (YYYY-MM-DD) |
| `date_to` | date? | — | Конец диапазона |
| `status` | string? | — | `upcoming`, `finished`, `live`, `all` |
| `hide_past` | bool | false | Скрыть матчи до сегодня |
| `group_by_date` | bool | false | Группировка по датам |
| `lang` | string | `ru` | Язык |
| `limit` | int | 50 | max: 100 |
| `offset` | int | 0 | — |

**Сортировка:** `date DESC, time DESC`

**Обычный ответ:**
```json
{
  "items": [
    {
      "id": 12345,
      "date": "2025-05-10",
      "time": "18:00:00",
      "tour": 5,
      "season_id": 61,
      "stage_id": 42,
      "stage_name": "5 тур",
      "home_score": 2,
      "away_score": 1,
      "home_penalty_score": null,
      "away_penalty_score": null,
      "has_stats": true,
      "has_lineup": true,
      "is_live": false,
      "status": "finished",
      "has_score": true,
      "visitors": 15000,
      "ticket_url": null,
      "video_url": "https://...",
      "protocol_url": null,
      "stadium": "Астана Арена",
      "stadium_info": {
        "id": 15,
        "name": "Астана Арена",
        "city": "Астана",
        "capacity": 30000,
        "address": "пр. Туран, 55",
        "photo_url": "https://..."
      },
      "home_team": {
        "id": 91,
        "name": "Астана",
        "logo": "https://..."
      },
      "away_team": {
        "id": 90,
        "name": "Тобол",
        "logo": "https://..."
      },
      "season_name": "2025"
    }
  ],
  "total": 264
}
```

**Группированный ответ** (`group_by_date=true`):
```json
{
  "groups": [
    {
      "date": "2025-05-10",
      "date_label": "10 мая, суббота",
      "games": [ ... ]
    },
    {
      "date": "2025-05-11",
      "date_label": "11 мая, воскресенье",
      "games": [ ... ]
    }
  ],
  "total": 264
}
```

### GET /games/{game_id}

Детали матча.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | Язык |

**Eager loading:** `home_team`, `away_team`, `season`, `stadium_rel`, `stage`, `referees → referee`

**Ответ:**
```json
{
  "id": 12345,
  "date": "2025-05-10",
  "time": "18:00:00",
  "tour": 5,
  "season_id": 61,
  "stage_id": 42,
  "stage_name": "5 тур",
  "home_score": 2,
  "away_score": 1,
  "home_penalty_score": null,
  "away_penalty_score": null,
  "has_stats": true,
  "has_lineup": true,
  "is_live": false,
  "status": "finished",
  "has_score": true,
  "visitors": 15000,
  "ticket_url": null,
  "video_url": "https://...",
  "protocol_url": null,
  "referee": "Петров П.П.",
  "stadium": {
    "id": 15,
    "name": "Астана Арена",
    "city": "Астана",
    "capacity": 30000,
    "address": "пр. Туран, 55",
    "photo_url": "https://..."
  },
  "home_team": { "id": 91, "name": "Астана", "logo": "https://..." },
  "away_team": { "id": 90, "name": "Тобол", "logo": "https://..." },
  "season_name": "2025"
}
```

**Ошибки:** `404`

### GET /games/{game_id}/stats

Полная статистика матча: командная, индивидуальная и события.

**Ответ:**
```json
{
  "game_id": 12345,
  "team_stats": [
    {
      "team_id": 91,
      "team_name": "Астана",
      "logo_url": "https://...",
      "primary_color": "#FFD700",
      "secondary_color": "#003DA5",
      "accent_color": "#FFFFFF",
      "possession": 58.2,
      "possession_percent": 58,
      "shots": 15,
      "shots_on_goal": 7,
      "passes": 480,
      "pass_accuracy": 85.5,
      "fouls": 12,
      "yellow_cards": 2,
      "red_cards": 0,
      "corners": 6,
      "offsides": 2,
      "extra_stats": {}
    }
  ],
  "player_stats": [
    {
      "player_id": 1234,
      "first_name": "Иван",
      "last_name": "Иванов",
      "country": { "code": "KZ", "flag_url": "https://..." },
      "team_id": 91,
      "team_name": "Астана",
      "team_primary_color": "#FFD700",
      "team_secondary_color": "#003DA5",
      "team_accent_color": "#FFFFFF",
      "position": "FWD",
      "minutes_played": 90,
      "started": true,
      "goals": 1,
      "assists": 0,
      "shots": 4,
      "passes": 32,
      "pass_accuracy": 87.5,
      "yellow_cards": 0,
      "red_cards": 0,
      "extra_stats": {}
    }
  ],
  "events": [
    {
      "id": 12345,
      "half": 1,
      "minute": 23,
      "event_type": "goal",
      "team_id": 91,
      "team_name": "Астана",
      "player_id": 1234,
      "player_name": "Иванов И.",
      "player_number": 9,
      "player2_id": 5678,
      "player2_name": "Петров П.",
      "player2_number": 10
    }
  ]
}
```

> **Примечание:** Голы и ассисты в `player_stats` берутся из таблицы `game_events` (единый источник правды), а не из `game_player_stats`.

### GET /games/{game_id}/lineup

Составы команд, тренеры, судьи.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | Язык |

**Особое поведение:** Для лайв-матчей — автоматически обновляет состав из SOTA, если TTL истёк.

**Ответ:**
```json
{
  "game_id": 12345,
  "has_lineup": true,
  "referees": [
    {
      "id": 5,
      "first_name": "Пётр",
      "last_name": "Петров",
      "role": "main",
      "photo_url": "https://...",
      "country": { "code": "KZ", "name": "Казахстан", "flag_url": "https://..." }
    }
  ],
  "coaches": {
    "home_team": [
      {
        "id": 10,
        "first_name": "Александр",
        "last_name": "Смирнов",
        "role": "head_coach",
        "photo_url": "https://...",
        "country": { "code": "KZ", "name": "Казахстан", "flag_url": "https://..." }
      }
    ],
    "away_team": [ ... ]
  },
  "lineups": {
    "home_team": {
      "team_id": 91,
      "team_name": "Астана",
      "formation": "4-3-3",
      "kit_color": "#FFD700",
      "starters": [
        {
          "player_id": 100,
          "first_name": "Иван",
          "last_name": "Иванов",
          "country": { "code": "KZ", "flag_url": "https://..." },
          "shirt_number": 1,
          "is_captain": false,
          "position": "goalkeeper",
          "amplua": "GK",
          "field_position": { "x": 50, "y": 5 },
          "photo_url": "https://..."
        }
      ],
      "substitutes": [
        {
          "player_id": 200,
          "first_name": "...",
          "last_name": "...",
          "shirt_number": 12,
          "is_captain": false,
          "position": "goalkeeper",
          "amplua": "GK",
          "field_position": null,
          "photo_url": "https://..."
        }
      ]
    },
    "away_team": { ... }
  }
}
```

**Сортировка стартёров:** по линиям (GK → DEF → MID → FWD), внутри линии по стороне (L → C → R).

**Formation:** Определяется автоматически из позиций игроков (кол-во DEF-MID-FWD).

---

## 7. Teams

### GET /teams

Список команд.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `season_id` | int? | — | Фильтр по сезону |
| `lang` | string | `kz` | Язык |

**Ответ:**
```json
{
  "items": [
    {
      "id": 91,
      "name": "Астана",
      "logo_url": "https://...",
      "primary_color": "#FFD700",
      "secondary_color": "#003DA5",
      "accent_color": "#FFFFFF"
    }
  ],
  "total": 14
}
```

> **Примечание:** Исключаются команды из `EXCLUDED_TEAM_IDS` (например, id=46).

### GET /teams/{team_id}

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `kz` | Язык |

**Eager loading:** `Team.stadium`, `Team.club`

**Ответ:**
```json
{
  "id": 91,
  "name": "Астана",
  "city": "Астана",
  "logo_url": "https://...",
  "primary_color": "#FFD700",
  "secondary_color": "#003DA5",
  "accent_color": "#FFFFFF",
  "website": "https://fc-astana.kz",
  "stadium": { "name": "Астана Арена", "city": "Астана" },
  "club_id": 3,
  "club_name": "Астана"
}
```

**Ошибки:** `404`

### GET /teams/{team_id}/overview

Комплексный обзор команды: форма, результаты, лидеры, позиция в таблице.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `season_id` | int? | current | Сезон |
| `fixtures_limit` | int | 5 | Кол-во предстоящих матчей (1-10) |
| `leaders_limit` | int | 8 | Кол-во лидеров (3-20) |
| `lang` | string | `ru` | Язык |

**Ответ:**
```json
{
  "team": {
    "id": 91,
    "name": "Астана",
    "city": "Астана",
    "logo_url": "https://...",
    "website": "https://fc-astana.kz",
    "stadium": "Астана Арена",
    "primary_color": "#FFD700",
    "secondary_color": "#003DA5",
    "accent_color": "#FFFFFF"
  },
  "season": { "id": 61, "name": "2025", "tournament_id": 7 },
  "summary": {
    "games_played": 10,
    "wins": 8,
    "draws": 1,
    "losses": 1,
    "goals_scored": 22,
    "goals_conceded": 7,
    "goal_difference": 15,
    "points": 25
  },
  "form_last5": [
    { "result": "W", "game_id": 12345, "opponent_name": "Тобол", "score": "2:1" },
    { "result": "W", "game_id": 12345, "opponent_name": "Кайрат", "score": "3:0" },
    { "result": "D", "game_id": 12345, "opponent_name": "Ордабасы", "score": "1:1" }
  ],
  "recent_match": {
    "game_id": 12345,
    "date": "2025-05-10",
    "opponent_name": "Тобол",
    "opponent_logo": "https://...",
    "is_home": true,
    "score": "2:1",
    "result": "W"
  },
  "upcoming_matches": [
    {
      "game_id": 12345,
      "date": "2025-05-17",
      "opponent_name": "Кайрат",
      "opponent_logo": "https://...",
      "is_home": false
    }
  ],
  "standings_window": [
    { "position": 1, "team_id": 91, "team_name": "Астана", "points": 25, "is_current": true },
    { "position": 2, "team_id": 90, "team_name": "Тобол", "points": 22, "is_current": false }
  ],
  "leaders": {
    "top_scorer": { "player_id": 1234, "name": "Иванов И.", "photo_url": "...", "value": 8 },
    "top_assister": { "player_id": 5678, "name": "Петров П.", "photo_url": "...", "value": 5 },
    "goals_table": [
      { "player_id": 1234, "name": "Иванов И.", "photo_url": "...", "value": 8 }
    ],
    "assists_table": [ ... ],
    "mini_leaders": {
      "yellow_cards": { "player_id": 9012, "name": "Козлов К.", "value": 4 },
      "minutes_played": { "player_id": 100, "name": "Вратарёв В.", "value": 900 }
    }
  },
  "staff_preview": [
    { "id": 10, "name": "Смирнов А.", "role": "head_coach", "photo_url": "..." }
  ]
}
```

### GET /teams/{team_id}/players

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `season_id` | int? | current | Сезон |
| `lang` | string | `kz` | Язык |

**Ответ:**
```json
{
  "items": [
    {
      "id": 1234,
      "first_name": "Иван",
      "last_name": "Иванов",
      "birthday": "1995-03-15",
      "player_type": "footballer",
      "country": { "code": "KZ", "name": "Казахстан", "flag_url": "https://..." },
      "photo_url": "https://...",
      "age": 30,
      "top_role": "forward",
      "team_id": 91,
      "number": 9
    }
  ],
  "total": 25
}
```

### GET /teams/{team_id}/games

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `season_id` | int? | current | Сезон |
| `lang` | string | `kz` | Язык |

**Ответ:** Формат аналогичен `/seasons/{id}/games`.

### GET /teams/{team_id}/stats

Сезонная статистика команды (40+ метрик).

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `season_id` | int? | current | Сезон |
| `lang` | string | `ru` | Язык |

**Ответ:** `TeamSeasonStatsResponse` — те же поля что в `/seasons/{id}/team-stats`, но для одной команды + `extra_stats` (JSON).

### GET /teams/{team_id}/coaches

Тренерский штаб команды.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `season_id` | int? | current | Сезон |
| `lang` | string | `kz` | Язык |

**Сортировка по ролям:** head_coach → assistant → goalkeeper_coach → fitness_coach → other

**Ответ:**
```json
{
  "items": [
    {
      "id": 10,
      "first_name": "Александр",
      "last_name": "Смирнов",
      "photo_url": "https://...",
      "role": "head_coach",
      "country": { "code": "KZ", "name": "Казахстан", "flag_url": "https://..." }
    }
  ],
  "total": 4
}
```

### GET /teams/{team1_id}/vs/{team2_id}/head-to-head

Очные встречи двух команд.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `season_id` | int? | current | Сезон |
| `lang` | string | `ru` | Язык |

**Ответ:**
```json
{
  "team1_id": 91,
  "team1_name": "Астана",
  "team2_id": 90,
  "team2_name": "Тобол",
  "season_id": 61,
  "overall": {
    "total_matches": 15,
    "team1_wins": 8,
    "draws": 3,
    "team2_wins": 4,
    "team1_goals": 22,
    "team2_goals": 14
  },
  "form_guide": {
    "team1": {
      "team_id": 91,
      "team_name": "Астана",
      "matches": [
        { "game_id": 12345, "result": "W", "score": "2:1", "date": "2025-05-10", "is_home": true }
      ]
    },
    "team2": { ... }
  },
  "season_table": [
    {
      "position": 1,
      "team_id": 91,
      "team_name": "Астана",
      "logo_url": "https://...",
      "games_played": 10,
      "wins": 8,
      "draws": 1,
      "losses": 1,
      "goals_scored": 22,
      "goals_conceded": 7,
      "goal_difference": 15,
      "points": 25,
      "clean_sheets": 5
    }
  ],
  "previous_meetings": [
    {
      "game_id": 12345,
      "date": "2025-05-10",
      "home_team_id": 91,
      "home_team_name": "Астана",
      "away_team_id": 90,
      "away_team_name": "Тобол",
      "home_score": 2,
      "away_score": 1,
      "tour": 5,
      "season_name": "2025"
    }
  ]
}
```

> **Примечание:** `previous_meetings` — последние 10 матчей между командами.

---

## 8. Players

### GET /players

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `season_id` | int? | — | Фильтр по сезону |
| `team_id` | int? | — | Фильтр по команде |
| `limit` | int | 50 | max: 100 |
| `offset` | int | 0 | — |
| `lang` | string | `kz` | Язык |

**Ответ:**
```json
{
  "items": [
    {
      "id": 1234,
      "first_name": "Иван",
      "last_name": "Иванов",
      "birthday": "1995-03-15",
      "player_type": "footballer",
      "country": { "code": "KZ", "name": "Казахстан", "flag_url": "https://..." },
      "photo_url": "https://...",
      "age": 30,
      "top_role": "forward"
    }
  ],
  "total": 250
}
```

### GET /players/{player_id}

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `season_id` | int? | — | Фильтрует привязки к командам |
| `lang` | string | `kz` | Язык |

**Ответ:**
```json
{
  "id": 1234,
  "first_name": "Иван",
  "last_name": "Иванов",
  "birthday": "1995-03-15",
  "player_type": "footballer",
  "country": { "code": "KZ", "name": "Казахстан", "flag_url": "https://..." },
  "photo_url": "https://...",
  "age": 30,
  "top_role": "forward",
  "height": 182,
  "weight": 78,
  "gender": "male",
  "jersey_number": 9,
  "teams": [
    { "team_id": 91, "team_name": "Астана", "team_logo": "https://...", "number": 9 }
  ]
}
```

**Ошибки:** `404`

### GET /players/{player_id}/stats

Сезонная статистика игрока (50+ метрик).

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `season_id` | int? | current | Сезон |

**Ответ:**
```json
{
  "player_id": 1234,
  "season_id": 61,
  "team_id": 91,
  "games_played": 10,
  "games_starting": 8,
  "minutes_played": 720,
  "goals": 8,
  "assists": 3,
  "xg": 7.2,
  "xg_per_90": 0.9,
  "shots": 42,
  "shots_on_goal": 18,
  "passes": 320,
  "pass_accuracy": 85.5,
  "key_passes": 12,
  "duels": 80,
  "duels_won": 48,
  "aerial_duel": 15,
  "ground_duel": 65,
  "tackle": 22,
  "interception": 8,
  "recovery": 35,
  "dribble": 18,
  "dribble_success": 12,
  "yellow_cards": 2,
  "red_cards": 0,
  "save_shot": 0,
  "dry_match": 0,
  "extra_stats": {
    "crosses": 15,
    "long_balls": 8,
    "blocked_shots": 2,
    "clearances": 5
  }
}
```

**Ошибки:** `404` — статистика не найдена

### GET /players/{player_id}/games

Матчи игрока в сезоне.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `season_id` | int? | current | Сезон |
| `limit` | int | 50 | max: 100 |

**Ответ:** `GameListResponse` — стандартный формат списка матчей.

### GET /players/{player_id}/teammates

Одноклубники игрока.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `season_id` | int? | current | Сезон |
| `limit` | int | 10 | max: 50 |
| `lang` | string | `kz` | Язык |

**Ответ:**
```json
{
  "items": [
    {
      "player_id": 5678,
      "first_name": "Пётр",
      "last_name": "Петров",
      "jersey_number": 10,
      "position": "midfielder",
      "age": 27,
      "photo_url": "https://..."
    }
  ],
  "total": 24
}
```

### GET /players/{player_id}/tournaments

История выступлений игрока по сезонам.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `kz` | Язык |

**Ответ:**
```json
{
  "items": [
    {
      "season_id": 61,
      "season_name": "2025",
      "tournament_name": "Premier League",
      "team_id": 91,
      "team_name": "Астана",
      "position": "forward",
      "games_played": 10,
      "minutes_played": 720,
      "goals": 8,
      "assists": 3,
      "yellow_cards": 2,
      "red_cards": 0
    },
    {
      "season_id": 10,
      "season_name": "2024",
      "tournament_name": "Premier League",
      "team_id": 91,
      "team_name": "Астана",
      "position": "forward",
      "games_played": 28,
      "minutes_played": 2340,
      "goals": 15,
      "assists": 7,
      "yellow_cards": 5,
      "red_cards": 1
    }
  ],
  "total": 5
}
```

---

## 9. Clubs

Клубы — организации, объединяющие несколько команд (основная, молодёжная, женская).

### GET /clubs

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `city_id` | int? | — | Фильтр по городу |
| `lang` | string | `ru` | Язык |

**Сортировка:** `name ASC`

**Ответ:**
```json
{
  "items": [
    {
      "id": 3,
      "name": "Астана",
      "short_name": "AST",
      "logo_url": "https://...",
      "city_name": "Астана",
      "is_active": true
    }
  ],
  "total": 54
}
```

### GET /clubs/{club_id}

Клуб с его командами.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | Язык |

**Eager loading:** `Club.teams`

**Ответ:**
```json
{
  "id": 3,
  "name": "Астана",
  "short_name": "AST",
  "logo_url": "https://...",
  "city_name": "Астана",
  "is_active": true,
  "teams": [
    { "id": 91, "name": "Астана", "logo_url": "https://..." },
    { "id": 626, "name": "Астана М", "logo_url": "https://..." },
    { "id": 653, "name": "Астана Ж", "logo_url": "https://..." }
  ]
}
```

**Ошибки:** `404`

---

## 10. Cities

### GET /cities

Список всех городов.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | Язык |

**Eager loading:** `City.country`

**Ответ:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Астана",
      "country_id": 1,
      "country_name": "Казахстан"
    }
  ],
  "total": 100
}
```

---

## 11. Partners

Спонсоры и партнёры чемпионатов/сезонов.

### GET /partners

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `championship_id` | int? | — | Фильтр по чемпионату |
| `season_id` | int? | — | Фильтр по сезону |

**Фильтрация:** `is_active = true`. Сортировка по `sort_order ASC`.

**Ответ:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Sponsor Name",
      "logo_url": "https://...",
      "website": "https://sponsor.kz",
      "sort_order": 1,
      "is_active": true
    }
  ],
  "total": 8
}
```

---

## 12. Cup

Кубковые турниры — агрегированный обзор и расписание.

Prefix: `/cup`

### GET /cup/{season_id}/overview

Агрегированный обзор кубкового турнира.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | `kz`, `ru`, `en` |
| `recent_limit` | int | 5 | 1–20, кол-во последних результатов |
| `upcoming_limit` | int | 5 | 1–20, кол-во ближайших матчей |

**Логика:**
- Автоматически определяет **текущий раунд**: приоритет live → первый незавершённый → последний завершённый
- Если в сезоне есть `TeamTournament` с `group_name` → включает **групповые таблицы** (`groups[]`)
- Если есть `PlayoffBracket` → включает **сетку плей-офф** (`bracket`)
- `recent_results` — последние N завершённых матчей (самые свежие первыми)
- `upcoming_games` — ближайшие N предстоящих матчей (самые ранние первыми)
- `rounds` — список всех раундов для навигации (без массива `games`)

**Ответ:**
```json
{
  "season_id": 71,
  "season_name": "Кубок Казахстана 2025",
  "tournament_name": "Кубок Казахстана",
  "championship_name": "Кубок",
  "current_round": {
    "stage_id": 301,
    "round_name": "1/4 финала",
    "round_key": "1_4",
    "is_current": true,
    "total_games": 4,
    "played_games": 2,
    "games": [
      {
        "id": 50001,
        "date": "2025-07-10",
        "time": "18:00:00",
        "stage_name": "1/4 финала",
        "home_team": { "id": 91, "name": "Астана", "logo_url": "https://..." },
        "away_team": { "id": 90, "name": "Тобол", "logo_url": "https://..." },
        "home_score": 2,
        "away_score": 1,
        "home_penalty_score": null,
        "away_penalty_score": null,
        "status": "finished",
        "is_live": false
      }
    ]
  },
  "groups": [
    {
      "group_name": "A",
      "standings": [
        {
          "position": 1,
          "team_id": 91,
          "team_name": "Астана",
          "team_logo": "https://...",
          "games_played": 4,
          "wins": 3,
          "draws": 1,
          "losses": 0,
          "goals_scored": 8,
          "goals_conceded": 2,
          "goal_difference": 6,
          "points": 10
        }
      ]
    }
  ],
  "bracket": {
    "season_id": 71,
    "rounds": [
      {
        "round_name": "1/4 финала",
        "round_label": "1/4 финала",
        "matches": [
          {
            "id": 1,
            "home_team": { "id": 91, "name": "Астана", "logo_url": "https://..." },
            "away_team": { "id": 90, "name": "Тобол", "logo_url": "https://..." },
            "game": { "game_id": 50001, "home_score": 2, "away_score": 1, "status": "finished" }
          }
        ]
      }
    ]
  },
  "recent_results": [
    {
      "id": 50001,
      "date": "2025-07-10",
      "time": "18:00:00",
      "stage_name": "1/4 финала",
      "home_team": { "id": 91, "name": "Астана", "logo_url": "https://..." },
      "away_team": { "id": 90, "name": "Тобол", "logo_url": "https://..." },
      "home_score": 2,
      "away_score": 1,
      "status": "finished",
      "is_live": false
    }
  ],
  "upcoming_games": [
    {
      "id": 50003,
      "date": "2025-07-15",
      "time": "19:00:00",
      "stage_name": "1/2 финала",
      "home_team": { "id": 91, "name": "Астана", "logo_url": "https://..." },
      "away_team": { "id": 13, "name": "Кайрат", "logo_url": "https://..." },
      "home_score": null,
      "away_score": null,
      "status": "upcoming",
      "is_live": false
    }
  ],
  "rounds": [
    { "stage_id": 300, "round_name": "1/8 финала", "round_key": "1_8", "is_current": false, "total_games": 8, "played_games": 8, "games": [] },
    { "stage_id": 301, "round_name": "1/4 финала", "round_key": "1_4", "is_current": true, "total_games": 4, "played_games": 2, "games": [] },
    { "stage_id": 302, "round_name": "1/2 финала", "round_key": "1_2", "is_current": false, "total_games": 2, "played_games": 0, "games": [] }
  ]
}
```

> **Примечание:** `rounds[]` в ответе overview содержит пустой `games[]` — это для навигации. Для полного расписания используйте `/cup/{season_id}/schedule`.

### GET /cup/{season_id}/schedule

Полное расписание кубка по раундам.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | `kz`, `ru`, `en` |
| `round_key` | string? | — | Фильтр по ключу раунда (см. [17.8](#178-ключи-раундов-cup-round_key)) |

**Логика:**
- Возвращает все раунды с полным списком матчей (`games[]`)
- С `round_key` — возвращает только указанный раунд
- Текущий раунд помечен `is_current: true`
- `total_games` — общее кол-во матчей по всем раундам (или по одному при фильтре)

**Ответ:**
```json
{
  "season_id": 71,
  "rounds": [
    {
      "stage_id": 301,
      "round_name": "1/4 финала",
      "round_key": "1_4",
      "is_current": true,
      "total_games": 4,
      "played_games": 2,
      "games": [
        {
          "id": 50001,
          "date": "2025-07-10",
          "time": "18:00:00",
          "stage_name": "1/4 финала",
          "home_team": { "id": 91, "name": "Астана", "logo_url": "https://..." },
          "away_team": { "id": 90, "name": "Тобол", "logo_url": "https://..." },
          "home_score": 2,
          "away_score": 1,
          "home_penalty_score": null,
          "away_penalty_score": null,
          "status": "finished",
          "is_live": false
        }
      ]
    }
  ],
  "total_games": 14
}
```

---

## 13. Countries

Справочник стран.

### GET /countries

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `kz` | Язык |
| `include_inactive` | bool | false | Включить неактивные страны |

**Ответ:**
```json
{
  "items": [
    {
      "id": 1,
      "code": "KZ",
      "name": "Казахстан",
      "name_kz": "Қазақстан",
      "name_en": "Kazakhstan",
      "flag_url": "https://...",
      "is_active": true
    }
  ],
  "total": 249
}
```

### GET /countries/{country_id}

| Параметр | Тип | Default |
|----------|-----|---------|
| `lang` | string | `kz` |

**Ошибки:** `404`

### POST /countries

Создание страны.

**Body:**
```json
{
  "code": "KZ",
  "name": "Казахстан",
  "name_kz": "Қазақстан",
  "name_en": "Kazakhstan"
}
```

**Ошибки:** `400` — код уже существует

### PUT /countries/{country_id}

Обновление страны (partial update).

### POST /countries/{country_id}/flag

Загрузка флага (multipart/form-data).

**Body:** `file` (UploadFile)

**Поведение:** Загружает изображение в MinIO, обновляет `flag_url`.

### GET /countries/{country_id}/flag

Возвращает файл флага с правильными Content-Type заголовками.

**Ошибки:** `404` — флаг не найден

### DELETE /countries/{country_id}

Мягкое удаление (soft delete) — устанавливает `is_active = false`.

---

## 14. News

### GET /news

Список новостей с постраничной пагинацией.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | Язык |
| `tournament_id` | string? | — | Фильтр по турниру (`pl`, `1l`, `cup`, `2l`, `el`) |
| `article_type` | string? | — | `news` или `analytics` |
| `page` | int | 1 | Номер страницы (min: 1) |
| `per_page` | int | 20 | Записей на страницу (1-100) |

**Ответ:**
```json
{
  "items": [
    {
      "id": 42,
      "title": "Заголовок новости",
      "description": "Краткое описание...",
      "language": "ru",
      "publish_date": "2025-05-10T12:00:00",
      "images": ["https://..."],
      "tournament_id": "pl",
      "article_type": "news"
    }
  ],
  "total": 150,
  "page": 1,
  "per_page": 20,
  "pages": 8
}
```

### GET /news/article-types

Типы статей с количеством.

| Параметр | Тип | Default |
|----------|-----|---------|
| `lang` | string | `ru` |

**Ответ:**
```json
{
  "news": 120,
  "analytics": 30
}
```

### GET /news/latest

Последние новости.

| Параметр | Тип | Default | Описание |
|----------|-----|---------|----------|
| `lang` | string | `ru` | Язык |
| `tournament_id` | string? | — | Фильтр |
| `limit` | int | 10 | max: 50 |

**Ответ:** `list[NewsListItem]` (массив, не обёрнут в `items`).

### GET /news/slider

Новости для слайдера на главной.

| Параметр | Тип | Default |
|----------|-----|---------|
| `lang` | string | `ru` |
| `tournament_id` | string? | — |

**Поведение:** Только записи с `is_slider = true`, сортировка по `slider_order`.

### GET /news/{news_id}

Полная новость.

| Параметр | Тип | Default |
|----------|-----|---------|
| `lang` | string | `ru` |

**Ответ включает:** все поля + `images[]` (массив URL из MinIO).

**Ошибки:** `404`

### GET /news/{news_id}/navigation

Предыдущая и следующая новость (для навигации).

| Параметр | Тип | Default |
|----------|-----|---------|
| `lang` | string | `ru` |

**Ответ:**
```json
{
  "previous": { "id": 41, "title": "Предыдущая новость" },
  "next": { "id": 43, "title": "Следующая новость" }
}
```

Поля `previous` / `next` могут быть `null` (если первая/последняя).

---

## 15. Pages

Страницы CMS (статические страницы сайта).

### GET /pages

Список всех страниц.

| Параметр | Тип | Default |
|----------|-----|---------|
| `lang` | string | `ru` |

**Ответ:** `list[PageListResponse]` (массив).

### GET /pages/{slug}

Страница по slug.

| Параметр | Тип | Default |
|----------|-----|---------|
| `slug` | string | **path** |
| `lang` | string | `ru` |

**Ошибки:** `404`

### GET /pages/contacts/{language}

Страница контактов. Пробует slug `baylanystar`, затем `kontakty`.

### GET /pages/documents/{language}

Документы. Возвращает страницу + `files[]` (из MinIO, отфильтрованы по языку).

**Ответ:**
```json
{
  "id": 5,
  "title": "Документы",
  "content": "...",
  "files": [
    { "name": "Устав КФФ.pdf", "url": "https://...", "size": 1024000 }
  ]
}
```

### GET /pages/leadership/{language}

Руководство. Возвращает страницу + `photos[]` (из MinIO). Также резолвит URL фотографий в `structured_data.members[].photo`.

---

## 16. Live / WebSocket

Лайв-трансляции матчей в реальном времени.

### POST /live/start/{game_id}

Запустить трансляцию матча.

**Поведение:**
1. Синхронизирует составы из SOTA
2. Устанавливает `is_live = true`
3. Синхронизирует начальные события
4. Рассылает WebSocket broadcast `status: started`

**Ответ:**
```json
{
  "game_id": 12345,
  "is_live": true,
  "new_events_count": 0,
  "error": null
}
```

### POST /live/stop/{game_id}

Остановить трансляцию.

**Поведение:** `is_live = false`, broadcast `status: ended`.

### POST /live/sync-lineup/{game_id}

Синхронизировать составы из SOTA.

**Ответ:**
```json
{
  "game_id": 12345,
  "home_formation": "4-3-3",
  "away_formation": "4-4-2",
  "lineup_count": 36,
  "error": null
}
```

### POST /live/sync-events/{game_id}

Синхронизировать события матча.

**Ответ:**
```json
{
  "game_id": 12345,
  "new_events_count": 3,
  "events": [ ... ]
}
```

### GET /live/events/{game_id}

Все события матча.

**Ответ:**
```json
{
  "game_id": 12345,
  "events": [
    {
      "id": 12345,
      "event_type": "goal",
      "half": 1,
      "minute": 23,
      "team_id": 91,
      "player_id": 1234,
      "player_name": "Иванов И.",
      "player_number": 9
    }
  ],
  "total": 12
}
```

### GET /live/active-games

Текущие активные трансляции.

**Ответ:**
```json
{
  "count": 2,
  "games": [
    {
      "id": 12345,
      "date": "2025-05-10",
      "time": "18:00:00",
      "home_team_id": 91,
      "away_team_id": 90,
      "home_score": 1,
      "away_score": 0
    }
  ]
}
```

### GET /live/connections/{game_id}

Количество активных WebSocket подключений к матчу.

**Ответ:**
```json
{
  "game_id": 12345,
  "connections": 342
}
```

### WS /live/ws/{game_id}

WebSocket подключение для получения событий матча в реальном времени.

**URL:** `wss://kff.1sportkz.com/api/v1/live/ws/{game_id}`

**Сообщения от сервера:**

```json
// Подключение установлено
{ "type": "connected", "game_id": 12345, "message": "Connected to game 12345" }

// Событие матча (гол, карточка, замена...)
{ "type": "event", "game_id": 12345, "data": {
    "id": 12345,
    "event_type": "goal",
    "half": 1,
    "minute": 23,
    "team_id": 91,
    "player_id": 1234,
    "player_name": "Иванов И."
  }
}

// Обновление составов
{ "type": "lineup", "game_id": 12345, "data": {
    "home_team": { "formation": "4-3-3", "starters": [...], "substitutes": [...] },
    "away_team": { ... }
  }
}

// Изменение статуса матча
{ "type": "status", "game_id": 12345, "status": "started" }
{ "type": "status", "game_id": 12345, "status": "ended" }

// Ответ на ping
{ "type": "pong" }
```

**Сообщения от клиента:**
```json
// Keep-alive (рекомендуется каждые 30 секунд)
{ "type": "ping" }
```

---

## 17. Приложение

### 17.1 Все модели данных

| Модель | Таблица | Описание |
|--------|---------|----------|
| Championship | `championships` | Чемпионаты (Премьер-Лига, 1Л, Кубок) |
| Tournament | `tournaments` | Турниры (привязка к SOTA API) |
| Season | `seasons` | Сезоны турниров |
| Stage | `stages` | Туры / этапы внутри сезона |
| Team | `teams` | Команды |
| Club | `clubs` | Клубы (объединяют команды) |
| City | `cities` | Города |
| Country | `countries` | Страны |
| Player | `players` | Игроки |
| PlayerTeam | `player_teams` | Привязка игрок ↔ команда (сезон, номер) |
| Coach | `coaches` | Тренеры |
| TeamCoach | `team_coaches` | Привязка тренер ↔ команда (роль) |
| Referee | `referees` | Судьи |
| Stadium | `stadiums` | Стадионы |
| Game | `games` | Матчи (BigInteger ID, содержит дату, счёт, статус) |
| GameEvent | `game_events` | События матча (голы, карточки, замены) |
| GameLineup | `game_lineups` | Составы матча (позиция на поле) |
| GameTeamStats | `game_team_stats` | Командная статистика матча |
| GamePlayerStats | `game_player_stats` | Индивидуальная статистика матча |
| GameReferee | `game_referees` | Судьи матча (роль) |
| ScoreTable | `score_table` | Турнирная таблица (кеш) |
| TeamSeasonStats | `team_season_stats` | Агрегированная статистика команды за сезон |
| PlayerSeasonStats | `player_season_stats` | Агрегированная статистика игрока за сезон |
| TeamTournament | `team_tournaments` | Участие команды в сезоне + группа |
| PlayoffBracket | `playoff_brackets` | Сетка плей-офф |
| Partner | `partners` | Спонсоры и партнёры |
| News | `news` | Новости (мультиязычные) |
| Page | `pages` | Статические страницы CMS |
| AdminUser | `admin_users` | Пользователи админки |
| AdminSession | `admin_sessions` | Сессии авторизации |

### 17.2 Статусы матчей (Game)

| Значение | Условие | Описание |
|----------|---------|----------|
| `upcoming` | нет счёта, не лайв | Предстоящий матч |
| `live` | `is_live = true` | Идёт прямо сейчас |
| `finished` | есть счёт, не лайв | Завершён |

### 17.3 Типы событий (GameEventType)

| Значение | Описание |
|----------|----------|
| `goal` | Гол |
| `own_goal` | Автогол |
| `penalty_goal` | Гол с пенальти |
| `penalty_miss` | Незабитый пенальти |
| `yellow_card` | Жёлтая карточка |
| `second_yellow` | Вторая жёлтая карточка |
| `red_card` | Красная карточка |
| `substitution` | Замена (player → player2) |
| `var_decision` | Решение VAR |

### 17.4 Позиции игроков

| Код | amplua | Описание |
|-----|--------|----------|
| `GK` | goalkeeper | Вратарь |
| `DEF` | defender | Защитник |
| `MID` | midfielder | Полузащитник |
| `FWD` | forward | Нападающий |

### 17.5 Роли тренеров (CoachRole)

| Значение | Описание |
|----------|----------|
| `head_coach` | Главный тренер |
| `assistant` | Помощник |
| `goalkeeper_coach` | Тренер вратарей |
| `fitness_coach` | Тренер по физподготовке |
| `other` | Другое |

### 17.6 Роли судей (RefereeRole)

| Значение | Описание |
|----------|----------|
| `main` | Главный судья |
| `assistant_1` | Ассистент 1 |
| `assistant_2` | Ассистент 2 |
| `fourth` | Резервный |
| `var` | VAR |
| `avar` | Помощник VAR |

### 17.7 Раунды плей-офф

| round_name | round_label |
|-----------|-------------|
| `1_16` | 1/16 финала |
| `1_8` | 1/8 финала |
| `1_4` | 1/4 финала |
| `1_2` | 1/2 финала |
| `final` | Финал |
| `3rd_place` | Матч за 3-е место |

### 17.8 Ключи раундов Cup (`round_key`)

Автоматически генерируются из названий стадий. Используются в `GET /cup/{season_id}/schedule?round_key=...`.

| Название стадии | `round_key` |
|-----------------|-------------|
| 1/16 финала | `1_16` |
| 1/8 финала | `1_8` |
| 1/4 финала | `1_4` |
| 1/2 финала | `1_2` |
| Финал | `final` |
| За 3-е место | `3rd_place` |
| Тур 1, Тур 2, ... | `group_1`, `group_2`, ... |
| Группа A, Группа B, ... | `group_a`, `group_b`, ... |
| Другие | транслитерация + slugify |
