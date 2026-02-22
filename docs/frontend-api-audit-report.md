# Frontend API Audit Report

- Timestamp: 2026-02-20T20:19:22.666Z
- Backend: http://localhost:8000
- OpenAPI: http://localhost:8000/openapi.json
- Season: 61
- Language: ru
- Overall: PASS

## Section Summary

| Section | Status | Passed | Failed |
|---|---:|---:|---:|
| contract | PASS | 38 | 0 |
| schema | PASS | 4 | 0 |
| runtime_get | PASS | 35 | 0 |
| runtime_write | PASS | 6 | 0 |
| negative | PASS | 7 | 0 |
| log_guard | PASS | 1 | 0 |

## Failing Checks

- none

## Runtime Matrix

| Section | Key | Method | Path | Status | Expected | Pass | Detail |
|---|---|---|---|---:|---|---:|---|
| contract | SEASON_TABLE | GET | /api/v1/seasons/{}/table | - | /api/v1/seasons/{}/table | yes | ok |
| contract | SEASON_RESULTS_GRID | GET | /api/v1/seasons/{}/results-grid | - | /api/v1/seasons/{}/results-grid | yes | ok |
| contract | SEASON_GAMES | GET | /api/v1/seasons/{}/games | - | /api/v1/seasons/{}/games | yes | ok |
| contract | CUP_OVERVIEW | GET | /api/v1/cup/{}/overview | - | /api/v1/cup/{}/overview | yes | ok |
| contract | CUP_SCHEDULE | GET | /api/v1/cup/{}/schedule | - | /api/v1/cup/{}/schedule | yes | ok |
| contract | SEASON_PLAYER_STATS | GET | /api/v1/seasons/{}/player-stats | - | /api/v1/seasons/{}/player-stats | yes | ok |
| contract | SEASON_TEAM_STATS | GET | /api/v1/seasons/{}/team-stats | - | /api/v1/seasons/{}/team-stats | yes | ok |
| contract | SEASON_STATISTICS | GET | /api/v1/seasons/{}/statistics | - | /api/v1/seasons/{}/statistics | yes | ok |
| contract | SEASON_GOALS_BY_PERIOD | GET | /api/v1/seasons/{}/goals-by-period | - | /api/v1/seasons/{}/goals-by-period | yes | ok |
| contract | GAMES | GET | /api/v1/games | - | /api/v1/games | yes | ok |
| contract | NEWS_SLIDER | GET | /api/v1/news/slider | - | /api/v1/news/slider | yes | ok |
| contract | NEWS_LATEST | GET | /api/v1/news/latest | - | /api/v1/news/latest | yes | ok |
| contract | NEWS_BY_ID | GET | /api/v1/news/{} | - | /api/v1/news/{} | yes | ok |
| contract | NEWS_PAGINATED | GET | /api/v1/news | - | /api/v1/news | yes | ok |
| contract | NEWS_VIEW | POST | /api/v1/news/{}/view | - | /api/v1/news/{}/view | yes | ok |
| contract | NEWS_LIKE | POST | /api/v1/news/{}/like | - | /api/v1/news/{}/like | yes | ok |
| contract | NEWS_REACTIONS | GET | /api/v1/news/{}/reactions | - | /api/v1/news/{}/reactions | yes | ok |
| contract | NEWS_NAVIGATION | GET | /api/v1/news/{}/navigation | - | /api/v1/news/{}/navigation | yes | ok |
| contract | MATCH_DETAIL | GET | /api/v1/games/{} | - | /api/v1/games/{} | yes | ok |
| contract | MATCH_STATS | GET | /api/v1/games/{}/stats | - | /api/v1/games/{}/stats | yes | ok |
| contract | MATCH_LINEUP | GET | /api/v1/games/{}/lineup | - | /api/v1/games/{}/lineup | yes | ok |
| contract | MATCH_EVENTS | GET | /api/v1/live/events/{} | - | /api/v1/live/events/{} | yes | ok |
| contract | PLAYER_DETAIL | GET | /api/v1/players/{} | - | /api/v1/players/{} | yes | ok |
| contract | PLAYER_MATCHES | GET | /api/v1/players/{}/games | - | /api/v1/players/{}/games | yes | ok |
| contract | PLAYER_STATS | GET | /api/v1/players/{}/stats | - | /api/v1/players/{}/stats | yes | ok |
| contract | PLAYER_TEAMMATES | GET | /api/v1/players/{}/teammates | - | /api/v1/players/{}/teammates | yes | ok |
| contract | PLAYER_TOURNAMENTS | GET | /api/v1/players/{}/tournaments | - | /api/v1/players/{}/tournaments | yes | ok |
| contract | TEAMS | GET | /api/v1/teams | - | /api/v1/teams | yes | ok |
| contract | TEAM_DETAIL | GET | /api/v1/teams/{} | - | /api/v1/teams/{} | yes | ok |
| contract | TEAM_OVERVIEW | GET | /api/v1/teams/{}/overview | - | /api/v1/teams/{}/overview | yes | ok |
| contract | TEAM_STATS | GET | /api/v1/teams/{}/stats | - | /api/v1/teams/{}/stats | yes | ok |
| contract | TEAM_PLAYERS | GET | /api/v1/teams/{}/players | - | /api/v1/teams/{}/players | yes | ok |
| contract | TEAM_GAMES | GET | /api/v1/teams/{}/games | - | /api/v1/teams/{}/games | yes | ok |
| contract | TEAM_COACHES | GET | /api/v1/teams/{}/coaches | - | /api/v1/teams/{}/coaches | yes | ok |
| contract | HEAD_TO_HEAD | GET | /api/v1/teams/{}/vs/{}/head-to-head | - | /api/v1/teams/{}/vs/{}/head-to-head | yes | ok |
| contract | PAGE_LEADERSHIP | GET | /api/v1/pages/leadership/{} | - | /api/v1/pages/leadership/{} | yes | ok |
| contract | PAGE_CONTACTS | GET | /api/v1/pages/contacts/{} | - | /api/v1/pages/contacts/{} | yes | ok |
| contract | PAGE_DOCUMENTS | GET | /api/v1/pages/documents/{} | - | /api/v1/pages/documents/{} | yes | ok |
| schema | alembic_head_vs_current | - | - | - | - | yes | head=a2b3c4d5e6f7 current=a2b3c4d5e6f7 |
| schema | db_alembic_version | - | - | - | - | yes | head=a2b3c4d5e6f7 version_table=a2b3c4d5e6f7 |
| schema | games_id_bigint | - | - | - | - | yes | games.id type=bigint |
| schema | games_sota_id_exists | - | - | - | - | yes | games.sota_id columns=1 |
| runtime_get | discovered_ids | - | - | - | - | yes | team1=595 team2=625 player=1184 news=433 game=93 |
| runtime_get | season_table | GET | /api/v1/seasons/61/table?lang=ru | 200 | 200 | yes | keys:season_id,filters,table |
| runtime_get | season_results_grid | GET | /api/v1/seasons/61/results-grid?lang=ru | 200 | 200 | yes | keys:season_id,total_tours,teams |
| runtime_get | season_games | GET | /api/v1/seasons/61/games?tour=26&lang=ru | 200 | 200 | yes | keys:items,total |
| runtime_get | season_player_stats | GET | /api/v1/seasons/61/player-stats?sort_by=goals&limit=5&offset=0&lang=ru | 200 | 200 | yes | keys:season_id,sort_by,items,total |
| runtime_get | season_team_stats | GET | /api/v1/seasons/61/team-stats?sort_by=points&limit=20&offset=0&lang=ru | 200 | 200 | yes | keys:season_id,sort_by,items,total |
| runtime_get | season_statistics | GET | /api/v1/seasons/61/statistics?lang=ru | 200 | 200 | yes | keys:season_id,season_name,matches_played,wins,draws,total_attendance |
| runtime_get | season_goals_by_period | GET | /api/v1/seasons/61/goals-by-period | 200 | 200 | yes | keys:season_id,period_size_minutes,periods,meta |
| runtime_get | games_match_center | GET | /api/v1/games?season_id=61&group_by_date=true&lang=ru&limit=10 | 200 | 200 | yes | keys:groups,total |
| runtime_get | news_slider | GET | /api/v1/news/slider?lang=ru&limit=5&tournament_id=pl | 200 | 200 | yes | keys:0,1,2,3 |
| runtime_get | news_latest | GET | /api/v1/news/latest?lang=ru&limit=10&tournament_id=pl | 200 | 200 | yes | keys:0,1,2,3,4,5 |
| runtime_get | news_paginated | GET | /api/v1/news?lang=ru&page=1&per_page=12&tournament_id=pl | 200 | 200 | yes | keys:items,total,page,per_page,pages |
| runtime_get | news_by_id | GET | /api/v1/news/433?lang=ru | 200 | 200 | yes | keys:id,source_id,source_url,language,title,excerpt |
| runtime_get | news_navigation | GET | /api/v1/news/433/navigation?lang=ru | 200 | 200 | yes | keys:previous |
| runtime_get | news_reactions | GET | /api/v1/news/433/reactions | 200 | 200 | yes | keys:views,likes,liked |
| runtime_get | teams_list | GET | /api/v1/teams?season_id=61&lang=ru | 200 | 200 | yes | keys:items,total |
| runtime_get | team_detail | GET | /api/v1/teams/595?lang=ru | 200 | 200 | yes | keys:id,name,city,logo_url,primary_color,secondary_color |
| runtime_get | team_overview | GET | /api/v1/teams/595/overview?season_id=61&fixtures_limit=5&leaders_limit=8&lang=ru | 200 | 200 | yes | keys:team,season,summary,form_last5,recent_match,upcoming_matches |
| runtime_get | team_stats | GET | /api/v1/teams/595/stats?season_id=61&lang=ru | 404 | 200|404 | yes | keys:detail |
| runtime_get | team_players | GET | /api/v1/teams/595/players?season_id=61&lang=ru | 200 | 200 | yes | keys:items,total |
| runtime_get | team_games | GET | /api/v1/teams/595/games?season_id=61&lang=ru | 200 | 200 | yes | keys:items,total |
| runtime_get | team_coaches | GET | /api/v1/teams/595/coaches?season_id=61&lang=ru | 200 | 200 | yes | keys:items,total |
| runtime_get | head_to_head | GET | /api/v1/teams/595/vs/625/head-to-head?season_id=61&lang=ru | 200 | 200 | yes | keys:team1_id,team1_name,team2_id,team2_name,season_id,overall |
| runtime_get | player_detail | GET | /api/v1/players/1184?season_id=61&lang=ru | 200 | 200 | yes | keys:id,first_name,last_name,birthday,player_type,country |
| runtime_get | player_games | GET | /api/v1/players/1184/games?season_id=61&limit=10&lang=ru | 200 | 200 | yes | keys:items,total |
| runtime_get | player_stats | GET | /api/v1/players/1184/stats?season_id=61&lang=ru | 200 | 200 | yes | keys:player_id,season_id,team_id,games_played,games_starting,minutes_played |
| runtime_get | player_teammates | GET | /api/v1/players/1184/teammates?season_id=61&limit=10&lang=ru | 200 | 200 | yes | keys:items,total |
| runtime_get | player_tournaments | GET | /api/v1/players/1184/tournaments?lang=ru | 200 | 200 | yes | keys:items,total |
| runtime_get | match_detail | GET | /api/v1/games/93?lang=ru | 200 | 200 | yes | keys:id,date,time,tour,season_id,stage_id |
| runtime_get | match_stats | GET | /api/v1/games/93/stats?lang=ru | 200 | 200 | yes | keys:game_id,team_stats,player_stats,events |
| runtime_get | match_lineup | GET | /api/v1/games/93/lineup?lang=ru | 200 | 200 | yes | keys:game_id,has_lineup,referees,coaches,lineups |
| runtime_get | match_events | GET | /api/v1/live/events/93?lang=ru | 200 | 200 | yes | keys:game_id,events,total |
| runtime_get | page_leadership | GET | /api/v1/pages/leadership/ru | 200 | 200 | yes | keys:id,slug,language,title,content,content_text |
| runtime_get | page_contacts | GET | /api/v1/pages/contacts/ru | 200 | 200 | yes | keys:id,slug,language,title,content,content_text |
| runtime_get | page_documents | GET | /api/v1/pages/documents/ru | 200 | 200 | yes | keys:id,slug,language,title,content,content_text |
| runtime_write | post_view | POST | /api/v1/news/433/view | 200 | 200 | yes | keys:ok |
| runtime_write | view_increment | GET | /api/v1/news/433/reactions | 200 | views increment | yes | beforeViews=4 afterViews=5 |
| runtime_write | post_like_first | POST | /api/v1/news/433/like | 200 | 200 + liked=true | yes | keys:likes,liked |
| runtime_write | reactions_after_first_like | GET | /api/v1/news/433/reactions | 200 | 200 + liked=true | yes | keys:views,likes,liked |
| runtime_write | post_like_second | POST | /api/v1/news/433/like | 200 | 200 + liked=false | yes | keys:likes,liked |
| runtime_write | reactions_after_second_like | GET | /api/v1/news/433/reactions | 200 | 200 + liked=false | yes | keys:views,likes,liked |
| negative | news_by_id_not_found | GET | /api/v1/news/999999999?lang=ru | 404 | 404 | yes | keys:detail |
| negative | news_view_not_found | POST | /api/v1/news/999999999/view | 404 | 404 | yes | keys:detail |
| negative | news_like_not_found | POST | /api/v1/news/999999999/like | 404 | 404 | yes | keys:detail |
| negative | news_reactions_not_found | GET | /api/v1/news/999999999/reactions | 404 | 404 | yes | keys:detail |
| negative | team_not_found | GET | /api/v1/teams/999999999?lang=ru | 404 | 404 | yes | keys:detail |
| negative | player_not_found | GET | /api/v1/players/999999999?season_id=61&lang=ru | 404 | 404 | yes | keys:detail |
| negative | game_not_found | GET | /api/v1/games/999999999?lang=ru | 404 | 404 | yes | keys:detail |
| log_guard | no_500_in_tested_routes | - | - | - | - | yes | no 500 lines |
