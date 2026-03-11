# Документация: Ключи статистики игроков и команд

## Источник данных

- **SOTA API v2** → синхронизация через `backend/app/services/sync/stats_sync.py` → PostgreSQL
- **Голы/ассисты** — единственный источник: таблица `game_events` (не game_player_stats)
- **Фронтенд колонки**: `src/lib/mock/statisticsHelpers.ts` → `getColumnsForSubTab(subTab, mode)`
- **Переводы**: `public/locales/{kz,ru}/statistics.json`

---

## SubTabs (вкладки)

| SubTab | KZ | RU |
|---|---|---|
| `key_stats` | Негізгі статистика | Ключевая статистика |
| `goals` | Голдар | Голы |
| `attempts` | Соққылар | Удары |
| `distribution` | Пас | Пас |
| `attacking` | Шабуыл | Атака |
| `defending` | Қорғаныс | Защита |
| `goalkeeping` | Қақпашы | Вратарская |
| `disciplinary` | Тәртіп | Дисциплина |

---

## ИГРОКИ (mode = 'players')

### key_stats / goals

| Ключ | SOTA API | Сокр. | Формат | KZ | RU |
|---|---|---|---|---|---|
| `games_played` | `games_played` | М | number | Матчтар | Матчи |
| `goals` | `goal` | Г | number | Голдар | Голы |
| `assists` | `goal_pass` | А | number | пастар | Передачи |
| `minutes_played` | `time_on_field_total` | Мн | number | Минут | Минуты |
| `goal_and_assist` | `goal_and_assist` | Г+П | number | Г+П | Г+П |
| `penalty_success` | `penalty_success` | Пн | number | Пенальти | Пенальти |
| `owngoal` | `owngoal` | АГ | number | Автоголдар | Автоголы |
| `xg_per_90` | `xg_per_90` | xG90 | decimal | xG/90 | xG/90 |

### attempts (Удары)

| Ключ | SOTA API | Сокр. | Формат | KZ | RU |
|---|---|---|---|---|---|
| `shots` | `shot` | Уд | number | Соққылар | Удары |
| `shots_on_goal` | `shots_on_goal` | Дл | number | Дәл | В створ |
| `shots_blocked_opponent` | `shots_blocked_opponent` | Бл | number | Бұғатталған | Заблокированные |
| `goal_out_box` | `goal_out_box` | ГШ | number | Айып алаңынан тыс | Из-за штрафной |

### distribution (Пас)

| Ключ | SOTA API | Сокр. | Формат | KZ | RU |
|---|---|---|---|---|---|
| `passes` | `pass` | Пс | number | Пастар | Пасы |
| `pass_accuracy` | `pass_ratio` | Т% | percentage | Дәлдік | Точность |
| `key_passes` | `key_pass` | Кл | number | Шешуші | Ключевые |
| `pass_acc` | `pass_acc` | ТП | number | Дәл пастар | Точные пасы |
| `pass_forward` | `pass_forward` | ВП | number | Алға пастар | Пасы вперёд |
| `pass_progressive` | `pass_progressive` | Прг | number | Прогрессивті | Прогрессивные |
| `pass_cross` | `pass_cross` | Кр | number | Кросстар | Навесы |
| `pass_to_box` | `pass_to_box` | Шт | number | Айып алаңына | В штрафную |
| `pass_to_3rd` | `pass_to_3rd` | Ф3 | number | Соңғы үшінші | В фін. треть |

### attacking (Шабуыл / Атака)

| Ключ | SOTA API | Сокр. | Формат | KZ | RU |
|---|---|---|---|---|---|
| `dribble` | `dribble` | Др | number | Дриблинг | Дриблинг |
| `dribble_success` | `dribble_success` | У% | number | Сәтті дриблинг | Успешные обводки |
| `xg` | `xg` | xG | decimal | xG | xG |
| `dribble_per_90` | `dribble_per_90` | Д90 | decimal | Дриблинг/90 | Дрибл/90 |
| `corner` | `corner` | Уг | number | Бұрыштама | Угловые |
| `offside` | `offside` | Оф | number | Офсайд | Офсайды |

### defending (Қорғаныс / Защита)

| Ключ | SOTA API | Сокр. | Формат | KZ | RU |
|---|---|---|---|---|---|
| `tackle` | `tackle` | От | number | Допты тартып алу | Отборы |
| `interception` | `interception` | Пр | number | Қарсыластың пасын тартып алу | Перехваты |
| `recovery` | `recovery` | Вз | number | Допты жинау | Возвраты |
| `tackle_per_90` | `tackle_per_90` | О90 | decimal | Тарту/90 | Отборы/90 |
| `aerial_duel` | `aerial_duel` | ВЕ | number | Әуе күресі | Верховые ед. |
| `aerial_duel_success` | `aerial_duel_success` | ВЕУ | number | Әуе сәтті | Верх. успех |
| `ground_duel` | `ground_duel` | НЕ | number | Жер күресі | Низовые ед. |
| `ground_duel_success` | `ground_duel_success` | НЕУ | number | Жер сәтті | Низ. успех |

### goalkeeping (Қақпашы / Вратарская)

| Ключ | SOTA API | Сокр. | Формат | KZ | RU |
|---|---|---|---|---|---|
| `save_shot` | `save_shot` | Св | number | Сейвтер | Сейвы |
| `dry_match` | `dry_match` | Сх | number | Құрғақ матчтар | Сухие |
| `goals_conceded` | `goals_conceded` | ПГ | number | Жіберілген | Пропущено |
| `save_shot_ratio` | `save_shot_ratio` | С% | decimal | Сейв % | Сейвы % |
| `save_shot_penalty` | `save_shot_penalty` | ПнС | number | Пенальти сейв | Сейвы пенальти |
| `exit` | `exit` | Вых | number | Шығулар | Выходы |
| `exit_success` | `exit_success` | УВ | number | Сәтті шығу | Усп. выходы |

### disciplinary (Тәртіп / Дисциплина)

| Ключ | SOTA API | Сокр. | Формат | KZ | RU |
|---|---|---|---|---|---|
| `foul` | `foul` | Фл | number | Фолдар | Фолы |
| `foul_taken` | `foul_taken` | ФП | number | Өзіне фолдар | Фолы на себе |
| `yellow_cards` | `yellow_cards` | ЖК | number | СҚ | ЖК |
| `second_yellow_cards` | `second_yellow_cards` | 2Ж | number | 2С | 2Ж |
| `red_cards` | `red_cards` | КК | number | ҚҚ | КК |

---

## КОМАНДЫ (mode = 'clubs')

### key_stats (Негізгі статистика)

| Ключ | SOTA API | Сокр. | Формат | KZ | RU |
|---|---|---|---|---|---|
| `games_played` | `games_played` | И | number | Ойындар | Игры |
| `wins` | `win` | В | number | Жеңістер | Победы |
| `draws` | `draw` | Н | number | Тең ойындар | Ничьи |
| `losses` | `match_loss` | П | number | Жеңілістер | Поражения |
| `goals_scored` | `goal` | ЗГ | number | Соққан голдар | Забитые голы |
| `goals_conceded` | `goals_conceded` | ПГ | number | Өткізіп алған голдар | Пропущ. голы |
| `goal_difference` | `goals_difference` | РГ | number | Гол айырмасы | Разница голов |
| `points` | `points` | О | number | Ұпайлар | Очки |

### goals (Голдар / Голы)

| Ключ | SOTA API | Сокр. | Формат | KZ | RU |
|---|---|---|---|---|---|
| `goals_scored` | `goal` | ЗГ | number | Соққан голдар | Забитые голы |
| `goals_per_match` | *computed* | ГМ | decimal | Матчтағы голдар | Голы за матч |
| `goals_conceded` | `goals_conceded` | ПГ | number | Өткізіп алған голдар | Пропущ. голы |
| `goals_conceded_per_match` | *computed* | ПМ | decimal | Матчтағы жіберген | Пропущено за матч |
| `goal_difference` | `goals_difference` | РГ | number | Гол айырмасы | Разница голов |
| `xg` | `xg` | xG | decimal | xG | xG |
| `opponent_xg` | `opponent_xg` | xGA | decimal | Қарсылас xG | xG соперника |
| `penalty` | `penalty` | Пн | number | Пенальти | Пенальти |
| `penalty_ratio` | `penalty_ratio` | Пн% | decimal | Пенальти % | Пенальти % |

### attempts (Соққылар / Удары)

| Ключ | SOTA API | Сокр. | Формат | KZ | RU |
|---|---|---|---|---|---|
| `shots` | `shot` | Уд | number | Соққылар | Удары |
| `shots_on_goal` | `shots_on_goal` | Ст | number | Дәл бағытталған | В створ |
| `shot_accuracy` | *computed* | Т% | percentage | Соққы дәлдігі | Точность ударов |
| `shots_per_match` | *computed* | УМ | decimal | Матчтағы соққы | Удары за матч |
| `shots_off_goal` | `shots_off_goal` | Мм | number | Қақпадан тыс | Мимо створа |
| `freekick_shot` | `freekick_shot` | ШтУд | number | Штрафтық соққы | Удары со штраф. |

### distribution (Пас)

| Ключ | SOTA API | Сокр. | Формат | KZ | RU |
|---|---|---|---|---|---|
| `passes` | `pass` | Пс | number | Пастар | Передачи |
| `pass_accuracy` | `pass_ratio` | Т% | percentage | Пас дәлдігі | Точность передач |
| `key_passes` | `key_pass` | Кл | number | Шешуші пастар | Ключевые передачи |
| `crosses` | `pass_cross` | Кр | number | Кросстар | Кроссы |
| `pass_per_match` | `pass_per_match` | ПМ | decimal | Матчтағы пастар | Пасы за матч |
| `pass_forward` | `pass_forward` | ВП | number | Алға пастар | Пасы вперёд |
| `pass_long` | `pass_long` | ДП | number | Ұзын пастар | Длинные пасы |
| `pass_progressive` | `pass_progressive` | Прг | number | Прогрессивті | Прогрессивные |
| `pass_to_box` | `pass_to_box` | Шт | number | Айып алаңына | В штрафную |
| `pass_to_3rd` | `pass_to_3rd` | Ф3 | number | Соңғы үшінші | В фин. треть |
| `goal_pass` | `goal_pass` | ГП | number | Голдік пастар | Голевые пасы |

### attacking (Шабуыл / Атака)

| Ключ | SOTA API | Сокр. | Формат | KZ | RU |
|---|---|---|---|---|---|
| `possession` | `possession_percent_average` | Вл | percentage | Допты бақылау | Владение |
| `dribbles` | `dribble` | Др | number | Дриблинг | Дриблинг |
| `dribble_success` | `dribble_ratio` | Д% | percentage | Дриблинг % | Дриблинг % |
| `corners` | `corner` | Уг | number | Бұрыштама | Угловые |

### defending (Қорғаныс / Защита)

| Ключ | SOTA API | Сокр. | Формат | KZ | RU |
|---|---|---|---|---|---|
| `tackles` | `tackle` | От | number | Допты тартып алу | Отборы |
| `interceptions` | `interception` | Пр | number | Қарсыластың пасын тартып алу | Перехваты |
| `recoveries` | `recovery` | Вз | number | Допты қайтару | Возвраты |
| `offsides` | `offside` | Оф | number | Офсайдтар | Офсайды |
| `tackle_per_match` | `tackle_per_match` | ОМ | decimal | Тартып алу/матч | Отборы/матч |
| `interception_per_match` | `interception_per_match` | ПрМ | decimal | Қарсылас пасын тарту/матч | Перехв./матч |
| `recovery_per_match` | `recovery_per_match` | ВзМ | decimal | Қайтару/матч | Возвраты/матч |
| `duel` | `duel` | Ед | number | Доп үшін күрес | Единоборства |
| `duel_ratio` | `duel_ratio` | Ед% | decimal | Доп үшін күрес % | Единоборства % |
| `aerial_duel_offence` | `aerial_duel_offence` | ВА | number | Әуе шабуыл | Верхов. атака |
| `aerial_duel_defence` | `aerial_duel_defence` | ВЗ | number | Әуе қорғаныс | Верхов. защита |
| `ground_duel_offence` | `ground_duel_offence` | НА | number | Жер шабуыл | Низов. атака |
| `ground_duel_defence` | `ground_duel_defence` | НЗ | number | Жер қорғаныс | Низов. защита |
| `tackle1_1` | `tackle1-1` | 1v1 | number | 1v1 тартып алу | 1v1 отборы |

### disciplinary (Тәртіп / Дисциплина)

| Ключ | SOTA API | Сокр. | Формат | KZ | RU |
|---|---|---|---|---|---|
| `fouls` | `foul` | Фл | number | Фолдар | Фолы |
| `foul_taken` | `foul_taken` | ФП | number | Өзіне фолдар | Фолы на себе |
| `yellow_cards` | `yellow_cards` | ЖК | number | Сары қағаздар | Жёлтые карточки |
| `second_yellow_cards` | `second_yellow_cards` | 2Ж | number | Екінші сары қағаз | Вторые жёлтые |
| `red_cards` | `red_cards` | КК | number | Қызыл қағаздар | Красные карточки |
| `fouls_per_match` | *computed* | ФМ | decimal | Матчтағы фолдар | Фолы за матч |

---

## Сезонная статистика (GET /seasons/{id}/statistics)

| Ключ | KZ | RU |
|---|---|---|
| `matches_played` | Ойналған матчтар | Сыграно матчей |
| `total_goals` | Барлық гол | Всего голов |
| `goals_per_match` | Матчтағы голдар саны | Голы за матч |
| `total_attendance` | Жалпы көрермен саны | Общая посещаемость |
| `average_attendance` | Орташа көрермен саны | Средняя посещаемость |
| `avg_xg_per_match` | Орташа xG (матч) | Средний xG за матч |
| `pass_accuracy` | Пас дәлдігі (%) | Точность паса (%) |
| `shots_on_target_pct` | Дәл соққылар | Удары в створ |
| `clean_sheets` | Құрғақ матчтар | Сухие матчи |
| `yellow_cards` | Сары қағаздар | Жёлтые карточки |
| `red_cards` | Қызыл қағаздар | Красные карточки |
| `fouls_per_match` | Фолдар (орташа) | Фолы (в среднем за матч) |
| `total_minutes` | Жалпы ойын уақыты | Общее игровое время |
| `kazakh_minutes_pct` | Қазақтар 🇰🇿 | Казахстанцы 🇰🇿 |
| `average_age` | Орташа жас | Средний возраст |
| `total_players` | Турнир ойыншылары | Игроки в турнире |
| `penalties` | Пенальти | Пенальти |

---

## Маппинг SOTA API → БД (ключевые отличия)

Большинство ключей совпадают. Ниже перечислены только те, где SOTA ключ **отличается** от ключа в БД:

### Игроки (player_sync.py)

| SOTA API | → | БД (PlayerSeasonStats) |
|---|---|---|
| `goal` | → | `goals` |
| `goal_pass` | → | `assists` |
| `time_on_field_total` | → | `minutes_played` |
| `shot` | → | `shots` |
| `pass` | → | `passes` |
| `pass_ratio` | → | `pass_accuracy` |
| `key_pass` | → | `key_passes` |

### Команды (stats_sync.py)

| SOTA API | → | БД (TeamSeasonStats) |
|---|---|---|
| `win` | → | `wins` |
| `draw` | → | `draws` |
| `match_loss` | → | `losses` |
| `goal` | → | `goals_scored` |
| `goals_difference` | → | `goals_difference` |
| `shot` | → | `shots` |
| `possession_percent_average` | → | `possession_avg` |
| `pass` | → | `passes` |
| `pass_ratio` | → | `pass_accuracy_avg` |
| `key_pass` | → | `key_pass` |
| `pass_cross` | → | `pass_cross` |
| `foul` | → | `fouls` |
| `corner` | → | `corners` |
| `offside` | → | `offsides` |
| `tackle1-1` | → | `tackle1_1` |

### Вычисляемые поля (API, не из SOTA)

| Ключ | Формула |
|---|---|
| `goals_per_match` | `goals_scored / games_played` |
| `goals_conceded_per_match` | `goals_conceded / games_played` |
| `shot_accuracy` | `shots_on_goal / shots * 100` |
| `shots_per_match` | `shots / games_played` |
| `fouls_per_match` | `fouls / games_played` |

---

## API эндпоинты

| Эндпоинт | Описание |
|---|---|
| `GET /seasons/{id}/player-stats?sort_by=goals&position_code=FWD&nationality=kz` | Таблица игроков |
| `GET /seasons/{id}/team-stats?sort_by=points` | Таблица команд |
| `GET /seasons/{id}/statistics` | Агрегированная стата сезона |
| `GET /seasons/{id}/goals-by-period` | Голы по периодам матча |
| `GET /players/{id}/stats?season_id=` | Статы конкретного игрока |
| `GET /teams/{id}/stats?season_id=` | Статы конкретной команды |
| `GET /games/{id}/stats` | Статы за матч |

---

## Ключевые файлы

| Файл | Описание |
|---|---|
| `src/lib/mock/statisticsHelpers.ts` | Колонки для каждого subTab + форматирование |
| `public/locales/kz/statistics.json` | Казахские переводы (clubColumns, playerColumns, labels) |
| `public/locales/ru/statistics.json` | Русские переводы |
| `src/types/playerStats.ts` | TypeScript тип `PlayerStat` (74 поля) + `PlayerStatsSortBy` |
| `src/types/statistics.ts` | TypeScript тип `TeamStatistics` (125 полей) + `StatSubTab` |
| `backend/app/models/player_season_stats.py` | DB модель — 50+ полей |
| `backend/app/models/team_season_stats.py` | DB модель — 92 поля |
| `backend/app/api/seasons/stats.py` | API эндпоинты: player-stats, team-stats, statistics |
| `backend/app/services/sync/stats_sync.py` | Синхронизация команд из SOTA API v2 |
| `backend/app/services/sync/player_sync.py` | Синхронизация игроков из SOTA API v2 |
| `backend/app/services/sync/base.py` | Константы SOTA полей + базовый класс |
