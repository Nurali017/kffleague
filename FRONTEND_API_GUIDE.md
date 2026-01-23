# API Endpoints для фронтенда

**Base URL:** `http://localhost:8000/api/v1`

## 🎮 Матчи (Games)

### Список матчей
```http
GET /games?season_id=61&status=upcoming&language=ru&limit=50&offset=0
```

**Query параметры:**
- `season_id` (int) - ID сезона (default: 61)
- `status` - "upcoming" | "finished" | "live" | "all"
- `team_id` (int) - Фильтр по одной команде
- `tour` (int) - Номер тура
- `language` - "ru" | "kz" | "en" (default: "ru")
- `limit` (int, max: 100) - Лимит результатов
- `offset` (int) - Смещение для пагинации
- `group_by_date` (bool) - Группировка по датам

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "date": "2025-10-26",
      "time": "15:00:00",
      "tour": 26,
      "home_score": 1,
      "away_score": 1,
      "is_live": false,
      "has_stats": true,
      "has_lineup": true,
      "home_team": {
        "id": 13,
        "name": "Кайрат",
        "logo_url": "http://...",
        "primary_color": "#FF0000"
      },
      "away_team": { /* ... */ }
    }
  ],
  "total": 100
}
```

### Детали матча
```http
GET /games/{game_id}?language=ru
```

### Статистика матча
```http
GET /games/{game_id}/stats
```

**Response:**
```json
{
  "game_id": "uuid",
  "team_stats": [
    {
      "team_id": 13,
      "team_name": "Кайрат",
      "possession_percent": 51,
      "shots": 15,
      "shots_on_goal": 2,
      "passes": 485,
      "corners": 5,
      "yellow_cards": 0
    }
  ],
  "player_stats": [
    {
      "player_id": "uuid",
      "first_name": "Дастан",
      "last_name": "Сатпаев",
      "team_name": "Кайрат",
      "goals": 1,
      "assists": 0,
      "shots": 3,
      "passes": 25
    }
  ]
}
```

### Составы матча
```http
GET /games/{game_id}/lineup?language=ru
```

**Response:**
```json
{
  "game_id": "uuid",
  "has_lineup": true,
  "referees": [
    {
      "id": 105,
      "first_name": "Маттео",
      "last_name": "Марчетти",
      "role": "main"
    }
  ],
  "coaches": {
    "home_team": [{ /* ... */ }],
    "away_team": [{ /* ... */ }]
  },
  "lineups": {
    "home_team": {
      "formation": "4-2-3-1",
      "starters": [
        {
          "player_id": "uuid",
          "first_name": "Александр",
          "last_name": "Заруцкий",
          "shirt_number": 1,
          "position": "ВР (вратарь)",
          "is_captain": false,
          "photo_url": "http://..."
        }
      ],
      "substitutes": [{ /* ... */ }]
    },
    "away_team": { /* ... */ }
  }
}
```

## 🔴 Live матчи

### Список активных матчей
```http
GET /live/active-games
```

### События матча
```http
GET /live/events/{game_id}
```

**Response:**
```json
{
  "game_id": "uuid",
  "events": [
    {
      "id": 1,
      "game_id": "uuid",
      "half": 1,
      "minute": 15,
      "event_type": "goal",
      "team_name": "Астана",
      "player_number": 10,
      "player_name": "Марин Томасов",
      "assist_player_name": "Назми Грипши"
    },
    {
      "id": 3,
      "half": 1,
      "minute": 37,
      "event_type": "yellow_card",
      "team_name": "Астана",
      "player_name": "Дмитрий Шомко"
    },
    {
      "id": 4,
      "half": 1,
      "minute": 40,
      "event_type": "substitution",
      "player_name": "Офри Арад",
      "player2_name": "Дамир Касабулат"
    }
  ],
  "total": 13
}
```

**Event types:**
- `goal` - Гол
- `assist` - Голевой пас
- `yellow_card` - Желтая карточка
- `red_card` - Красная карточка
- `substitution` - Замена

### WebSocket для live обновлений
```javascript
const ws = new WebSocket('ws://localhost:8000/api/v1/live/ws/{game_id}');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch(data.type) {
    case 'connected':
      console.log('Connected to live updates');
      break;
    case 'event':
      // Новое событие матча
      console.log('New event:', data.data);
      break;
    case 'status':
      // Статус матча изменился (started/ended)
      console.log('Game status:', data.status);
      break;
    case 'lineup':
      // Обновление составов
      console.log('Lineup updated:', data.data);
      break;
  }
};

// Heartbeat
setInterval(() => ws.send('ping'), 30000);
```

## 👥 Команды

### Список команд
```http
GET /teams?season_id=61&language=ru
```

### Детали команды
```http
GET /teams/{team_id}?season_id=61&language=ru
```

### Состав команды
```http
GET /teams/{team_id}/players?season_id=61&language=ru
```

## 👤 Игроки

### Детали игрока
```http
GET /players/{player_id}?language=ru
```

### Статистика игрока за сезон
```http
GET /players/{player_id}/season-stats?season_id=61
```

## 🏆 Турнирная таблица

```http
GET /standings?season_id=61&language=ru
```

**Response:**
```json
{
  "season_id": 61,
  "standings": [
    {
      "position": 1,
      "team_id": 91,
      "team_name": "Астана",
      "logo_url": "http://...",
      "games_played": 26,
      "wins": 18,
      "draws": 5,
      "losses": 3,
      "goals_for": 52,
      "goals_against": 20,
      "goal_difference": 32,
      "points": 59
    }
  ]
}
```

## 📊 Сезоны

```http
GET /seasons
```

## 🔧 Важные замечания

### Языки
- `ru` - Русский (default)
- `kz` - Казахский
- `en` - English

### Pagination
- `limit` - Максимум записей (max: 100)
- `offset` - Смещение
- Всегда возвращается `total` для подсчета страниц

### CORS
API поддерживает CORS для локальной разработки

### Статусы матчей
- `upcoming` - Предстоящий (дата > сегодня или нет счета)
- `finished` - Завершенный (есть счет или дата < сегодня)
- `live` - Идет трансляция (`is_live: true`)
- `all` - Все матчи

### Цвета команд
В объекте `team` всегда есть:
- `primary_color` - Основной цвет (hex)
- `secondary_color` - Дополнительный цвет (hex)

Используйте для брендинга UI элементов команды.

## 🎯 Примеры использования

### React Hook для live событий
```typescript
import { useEffect, useState } from 'react';

export function useLiveMatchEvents(gameId: string) {
  const [events, setEvents] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/api/v1/live/ws/${gameId}`);

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'event') {
        setEvents(prev => [...prev, data.data]);
      }
    };

    const ping = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('ping');
      }
    }, 30000);

    return () => {
      clearInterval(ping);
      ws.close();
    };
  }, [gameId]);

  return { events, isConnected };
}
```

### Fetch матчей с фильтрами
```typescript
async function fetchUpcomingMatches(teamId?: number) {
  const params = new URLSearchParams({
    season_id: '61',
    status: 'upcoming',
    language: 'ru',
    limit: '20',
    ...(teamId && { team_id: teamId.toString() })
  });

  const res = await fetch(`/api/v1/games?${params}`);
  return res.json();
}
```

### Группировка матчей по датам
```typescript
async function fetchMatchesByDate() {
  const params = new URLSearchParams({
    season_id: '61',
    status: 'all',
    language: 'ru',
    group_by_date: 'true'
  });

  const res = await fetch(`/api/v1/games?${params}`);
  const data = await res.json();

  // Response format:
  // {
  //   groups: [
  //     {
  //       date: "2025-10-26",
  //       display_date: "Сегодня" | "Завтра" | "26 октября",
  //       games: [...]
  //     }
  //   ]
  // }

  return data.groups;
}
```

## 🎨 UI компоненты - примеры

### Таймлайн событий матча
```typescript
// MatchEventTimeline.tsx
import { useEffect, useState } from 'react';

interface MatchEvent {
  id: number;
  half: number;
  minute: number;
  event_type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  team_id: number;
  team_name: string;
  player_name: string;
  player_number?: number;
  player2_name?: string;
  player2_team_name?: string;
  assist_player_name?: string;
}

interface GroupedEvents {
  homeGoals: MatchEvent[];
  awayGoals: MatchEvent[];
  homeCards: MatchEvent[];
  awayCards: MatchEvent[];
  substitutions: MatchEvent[];
}

export function MatchEventTimeline({
  gameId,
  homeTeam,
  awayTeam
}: {
  gameId: string;
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
}) {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [showAllCards, setShowAllCards] = useState(false);
  const [showAllSubs, setShowAllSubs] = useState(false);

  useEffect(() => {
    // Загрузка событий
    fetch(`http://localhost:8000/api/v1/live/events/${gameId}`)
      .then(res => res.json())
      .then(data => setEvents(data.events));

    // WebSocket для live обновлений
    const ws = new WebSocket(`ws://localhost:8000/api/v1/live/ws/${gameId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'event') {
        setEvents(prev => [...prev, data.data]);
      }
    };

    return () => ws.close();
  }, [gameId]);

  // Группировка событий
  const grouped = events.reduce<GroupedEvents>((acc, event) => {
    const isHome = event.team_id === homeTeam.id;

    if (event.event_type === 'goal') {
      isHome ? acc.homeGoals.push(event) : acc.awayGoals.push(event);
    } else if (event.event_type === 'yellow_card' || event.event_type === 'red_card') {
      isHome ? acc.homeCards.push(event) : acc.awayCards.push(event);
    } else if (event.event_type === 'substitution') {
      acc.substitutions.push(event);
    }

    return acc;
  }, {
    homeGoals: [],
    awayGoals: [],
    homeCards: [],
    awayCards: [],
    substitutions: []
  });

  const renderGoal = (event: MatchEvent, isHome: boolean) => (
    <div key={event.id} className={`event-row goal ${isHome ? 'home' : 'away'}`}>
      {isHome ? (
        <>
          <div className="minute">{event.minute}'</div>
          <div className="icon">⚽</div>
          <div className="player-info">
            <div className="player-name">{event.player_name} · 0-1</div>
            {event.assist_player_name && (
              <div className="assist-name">{event.assist_player_name}</div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="player-info align-right">
            <div className="player-name">1-1 · {event.player_name}</div>
            {event.assist_player_name && (
              <div className="assist-name">{event.assist_player_name}</div>
            )}
          </div>
          <div className="icon">⚽</div>
          <div className="minute">{event.minute}'</div>
        </>
      )}
    </div>
  );

  const renderCard = (event: MatchEvent) => (
    <div key={event.id} className="event-row card">
      <div className="player-name">{event.player_name}</div>
      <div className="icon">
        {event.event_type === 'yellow_card' ? '🟨' : '🟥'}
      </div>
      <div className="minute">{event.minute}'</div>
    </div>
  );

  const renderSubstitution = (event: MatchEvent) => (
    <div key={event.id} className="event-row substitution">
      <div className="minute">{event.minute}'</div>
      <div className="icon">🔄</div>
      <div className="player-info">
        <div className="player-out">
          ↓ {event.player_name}
          <span className="role">{event.team_name}</span>
        </div>
        <div className="player-in">
          ↑ {event.player2_name}
          <span className="role">{event.player2_team_name}</span>
        </div>
      </div>
    </div>
  );

  const visibleCards = showAllCards
    ? [...grouped.homeCards, ...grouped.awayCards]
    : [...grouped.homeCards, ...grouped.awayCards].slice(0, 3);

  const visibleSubs = showAllSubs
    ? grouped.substitutions
    : grouped.substitutions.slice(0, 3);

  return (
    <div className="match-timeline">
      {/* Голы домашней команды */}
      {grouped.homeGoals.length > 0 && (
        <div className="section">
          <h3 className="section-title">{homeTeam.name}</h3>
          {grouped.homeGoals.map(event => renderGoal(event, true))}
        </div>
      )}

      {/* Голы гостевой команды */}
      {grouped.awayGoals.length > 0 && (
        <div className="section">
          {grouped.awayGoals.map(event => renderGoal(event, false))}
        </div>
      )}

      {/* Карточки */}
      {(grouped.homeCards.length > 0 || grouped.awayCards.length > 0) && (
        <div className="section">
          <h3 className="section-title">{awayTeam.name}</h3>
          {visibleCards.map(renderCard)}

          {[...grouped.homeCards, ...grouped.awayCards].length > 3 && (
            <button
              className="show-more"
              onClick={() => setShowAllCards(!showAllCards)}
            >
              {showAllCards ? 'Жасыру' : 'Көбірек көрсету'}
            </button>
          )}
        </div>
      )}

      {/* Замены */}
      {grouped.substitutions.length > 0 && (
        <div className="section">
          <h3 className="section-title">Алмастырулар</h3>
          {visibleSubs.map(renderSubstitution)}

          {grouped.substitutions.length > 3 && (
            <button
              className="show-more"
              onClick={() => setShowAllSubs(!showAllSubs)}
            >
              {showAllSubs ? 'Жасыру' : 'Көбірек көрсету'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// CSS пример
/*
.match-timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.event-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;
}

.event-row:last-child {
  border-bottom: none;
}

.event-row.goal .icon {
  font-size: 24px;
}

.event-row.home {
  justify-content: flex-start;
}

.event-row.away {
  justify-content: flex-end;
}

.minute {
  font-weight: 600;
  color: #495057;
  min-width: 40px;
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.player-info.align-right {
  align-items: flex-end;
}

.player-name {
  font-weight: 600;
  font-size: 15px;
}

.assist-name,
.role {
  font-size: 13px;
  color: #6c757d;
}

.player-out {
  color: #dc3545;
}

.player-in {
  color: #28a745;
}

.show-more {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #495057;
}

.show-more:hover {
  background: #f8f9fa;
}
*/
```

### Live счет с auto-refresh
```typescript
// LiveScore.tsx
import { useEffect, useState } from 'react';

interface GameScore {
  id: string;
  home_team: { name: string; logo_url: string; };
  away_team: { name: string; logo_url: string; };
  home_score: number;
  away_score: number;
  is_live: boolean;
}

export function LiveScore({ gameId }: { gameId: string }) {
  const [game, setGame] = useState<GameScore | null>(null);

  useEffect(() => {
    const loadGame = async () => {
      const res = await fetch(`http://localhost:8000/api/v1/games/${gameId}`);
      const data = await res.json();
      setGame(data);
    };

    loadGame();

    // Auto-refresh каждые 30 секунд для live матчей
    const interval = setInterval(() => {
      if (game?.is_live) {
        loadGame();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [gameId, game?.is_live]);

  if (!game) return <div>Loading...</div>;

  return (
    <div className="live-score">
      {game.is_live && <span className="live-badge">🔴 LIVE</span>}

      <div className="team home">
        <img src={game.home_team.logo_url} alt="" />
        <span>{game.home_team.name}</span>
        <span className="score">{game.home_score ?? '-'}</span>
      </div>

      <div className="separator">:</div>

      <div className="team away">
        <span className="score">{game.away_score ?? '-'}</span>
        <span>{game.away_team.name}</span>
        <img src={game.away_team.logo_url} alt="" />
      </div>
    </div>
  );
}
```

### Турнирная таблица
```typescript
// StandingsTable.tsx
import { useEffect, useState } from 'react';

interface Standing {
  position: number;
  team_id: number;
  team_name: string;
  logo_url: string;
  games_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

export function StandingsTable() {
  const [standings, setStandings] = useState<Standing[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/standings?season_id=61&language=ru')
      .then(res => res.json())
      .then(data => setStandings(data.standings));
  }, []);

  return (
    <table className="standings-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Команда</th>
          <th>И</th>
          <th>В</th>
          <th>Н</th>
          <th>П</th>
          <th>Мячи</th>
          <th>РМ</th>
          <th>О</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((team) => (
          <tr key={team.team_id} className={`pos-${team.position}`}>
            <td className="position">{team.position}</td>
            <td className="team">
              <img src={team.logo_url} alt="" className="logo" />
              <span>{team.team_name}</span>
            </td>
            <td>{team.games_played}</td>
            <td>{team.wins}</td>
            <td>{team.draws}</td>
            <td>{team.losses}</td>
            <td>{team.goals_for}:{team.goals_against}</td>
            <td className={team.goal_difference > 0 ? 'positive' : 'negative'}>
              {team.goal_difference > 0 && '+'}{team.goal_difference}
            </td>
            <td className="points"><strong>{team.points}</strong></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Состав команды
```typescript
// TeamLineup.tsx
interface LineupPlayer {
  player_id: string;
  first_name: string;
  last_name: string;
  shirt_number: number;
  position: string;
  is_captain: boolean;
  photo_url: string;
}

interface Lineup {
  formation: string;
  starters: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export function TeamLineup({ gameId }: { gameId: string }) {
  const [homeLineup, setHomeLineup] = useState<Lineup | null>(null);
  const [awayLineup, setAwayLineup] = useState<Lineup | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/games/${gameId}/lineup`)
      .then(res => res.json())
      .then(data => {
        setHomeLineup(data.lineups.home_team);
        setAwayLineup(data.lineups.away_team);
      });
  }, [gameId]);

  const renderPlayer = (player: LineupPlayer) => (
    <div key={player.player_id} className="player">
      <img src={player.photo_url} alt="" className="photo" />
      <span className="number">{player.shirt_number}</span>
      <span className="name">
        {player.first_name} {player.last_name}
        {player.is_captain && ' (C)'}
      </span>
      <span className="position">{player.position}</span>
    </div>
  );

  return (
    <div className="lineup">
      <div className="team home">
        <h3>Стартовый состав ({homeLineup?.formation})</h3>
        <div className="starters">
          {homeLineup?.starters.map(renderPlayer)}
        </div>

        <h4>Запасные</h4>
        <div className="substitutes">
          {homeLineup?.substitutes.map(renderPlayer)}
        </div>
      </div>

      <div className="team away">
        {/* То же самое для гостевой команды */}
      </div>
    </div>
  );
}
```

## 🔥 Performance tips

### 1. Кэширование запросов
```typescript
// cache.ts
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 минута

export async function fetchWithCache(url: string) {
  const cached = cache.get(url);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const res = await fetch(url);
  const data = await res.json();

  cache.set(url, { data, timestamp: Date.now() });

  return data;
}
```

### 2. Оптимизация WebSocket соединений
```typescript
// Singleton WebSocket manager
class WebSocketManager {
  private connections = new Map<string, WebSocket>();

  connect(gameId: string, onMessage: (data: any) => void) {
    if (this.connections.has(gameId)) {
      return this.connections.get(gameId)!;
    }

    const ws = new WebSocket(`ws://localhost:8000/api/v1/live/ws/${gameId}`);
    ws.onmessage = (event) => onMessage(JSON.parse(event.data));

    this.connections.set(gameId, ws);
    return ws;
  }

  disconnect(gameId: string) {
    const ws = this.connections.get(gameId);
    if (ws) {
      ws.close();
      this.connections.delete(gameId);
    }
  }
}

export const wsManager = new WebSocketManager();
```

### 3. Lazy loading для больших списков
```typescript
// InfiniteMatchList.tsx
import { useEffect, useState, useRef } from 'react';

export function InfiniteMatchList() {
  const [matches, setMatches] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [offset, hasMore]);

  const loadMore = async () => {
    const res = await fetch(
      `http://localhost:8000/api/v1/games?limit=20&offset=${offset}`
    );
    const data = await res.json();

    setMatches(prev => [...prev, ...data.items]);
    setOffset(prev => prev + 20);
    setHasMore(data.items.length === 20);
  };

  return (
    <div>
      {matches.map(match => <MatchCard key={match.id} match={match} />)}
      {hasMore && <div ref={loaderRef}>Загрузка...</div>}
    </div>
  );
}
```

## 🐛 Error handling

### Обработка ошибок API
```typescript
async function fetchWithErrorHandling(url: string) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Данные не найдены');
      }
      if (res.status === 500) {
        throw new Error('Ошибка сервера');
      }
      throw new Error('Ошибка загрузки данных');
    }

    return await res.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

### Retry логика для WebSocket
```typescript
function connectWithRetry(gameId: string, maxRetries = 3) {
  let retryCount = 0;

  function connect() {
    const ws = new WebSocket(`ws://localhost:8000/api/v1/live/ws/${gameId}`);

    ws.onclose = () => {
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Reconnecting... (${retryCount}/${maxRetries})`);
        setTimeout(connect, 1000 * retryCount);
      }
    };

    return ws;
  }

  return connect();
}
```

## 📱 Мобильная версия

### Responsive breakpoints
```typescript
// useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Использование:
const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
```

## 🌐 i18n - Интернационализация

### Переключение языков
```typescript
// LanguageSwitcher.tsx
import { useState } from 'react';

type Language = 'ru' | 'kz' | 'en';

export function LanguageSwitcher() {
  const [lang, setLang] = useState<Language>('ru');

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('language', newLang);

    // Перезагрузка данных с новым языком
    window.location.reload();
  };

  return (
    <div className="lang-switcher">
      <button
        onClick={() => changeLanguage('ru')}
        className={lang === 'ru' ? 'active' : ''}
      >
        РУС
      </button>
      <button
        onClick={() => changeLanguage('kz')}
        className={lang === 'kz' ? 'active' : ''}
      >
        ҚАЗ
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={lang === 'en' ? 'active' : ''}
      >
        ENG
      </button>
    </div>
  );
}

// Утилита для получения текущего языка
export function getCurrentLanguage(): Language {
  return (localStorage.getItem('language') as Language) || 'ru';
}
```

## 🎯 Type definitions

### TypeScript типы для всех endpoints
```typescript
// types/api.ts

// Базовые типы
export interface Team {
  id: number;
  name: string;
  name_kz?: string;
  name_en?: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
}

export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  first_name_kz?: string;
  last_name_kz?: string;
  first_name_en?: string;
  last_name_en?: string;
  photo_url?: string;
  birth_date?: string;
  country?: string;
}

// Матчи
export interface Game {
  id: string;
  date: string;
  time?: string;
  tour: number;
  season_id: number;
  home_score?: number;
  away_score?: number;
  has_stats: boolean;
  has_lineup: boolean;
  is_live: boolean;
  stadium?: string;
  visitors?: number;
  video_url?: string;
  home_team: Team;
  away_team: Team;
  season_name?: string;
}

export interface GameListResponse {
  items: Game[];
  total: number;
}

export interface GroupedGamesResponse {
  groups: {
    date: string;
    display_date: string;
    games: Game[];
  }[];
  total: number;
}

// Статистика
export interface TeamStats {
  team_id: number;
  team_name: string;
  logo_url: string;
  possession?: number;
  possession_percent?: number;
  shots: number;
  shots_on_goal: number;
  passes: number;
  pass_accuracy?: number;
  fouls: number;
  yellow_cards: number;
  red_cards: number;
  corners: number;
  offsides: number;
}

export interface PlayerStats {
  player_id: string;
  first_name: string;
  last_name: string;
  team_id: number;
  team_name: string;
  position?: string;
  minutes_played?: number;
  started: boolean;
  goals: number;
  assists: number;
  shots: number;
  passes: number;
  pass_accuracy?: number;
  yellow_cards: number;
  red_cards: number;
}

export interface GameStatsResponse {
  game_id: string;
  team_stats: TeamStats[];
  player_stats: PlayerStats[];
}

// События
export type EventType = 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'substitution';

export interface GameEvent {
  id: number;
  game_id: string;
  half: number;
  minute: number;
  event_type: EventType;
  team_id?: number;
  team_name: string;
  player_id?: string;
  player_number?: number;
  player_name: string;
  player2_id?: string;
  player2_number?: number;
  player2_name?: string;
  player2_team_name?: string;
  assist_player_id?: string;
  assist_player_name?: string;
}

export interface GameEventsResponse {
  game_id: string;
  events: GameEvent[];
  total: number;
}

// Составы
export interface LineupPlayer {
  player_id: string;
  first_name: string;
  last_name: string;
  shirt_number: number;
  is_captain: boolean;
  position: string;
  photo_url?: string;
}

export interface TeamLineup {
  formation: string;
  starters: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface Referee {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  photo_url?: string;
}

export interface Coach {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  photo_url?: string;
}

export interface GameLineupResponse {
  game_id: string;
  has_lineup: boolean;
  referees: Referee[];
  coaches: {
    home_team: Coach[];
    away_team: Coach[];
  };
  lineups: {
    home_team: TeamLineup;
    away_team: TeamLineup;
  };
}

// Турнирная таблица
export interface Standing {
  position: number;
  team_id: number;
  team_name: string;
  logo_url: string;
  games_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

export interface StandingsResponse {
  season_id: number;
  standings: Standing[];
}

// WebSocket сообщения
export interface WSConnectedMessage {
  type: 'connected';
  game_id: string;
  message: string;
}

export interface WSEventMessage {
  type: 'event';
  game_id: string;
  data: GameEvent;
}

export interface WSStatusMessage {
  type: 'status';
  game_id: string;
  status: 'started' | 'ended';
}

export interface WSLineupMessage {
  type: 'lineup';
  game_id: string;
  data: any;
}

export type WSMessage =
  | WSConnectedMessage
  | WSEventMessage
  | WSStatusMessage
  | WSLineupMessage;
```

## 🚀 Production checklist

- [ ] Заменить `http://localhost:8000` на production URL
- [ ] Заменить `ws://localhost:8000` на `wss://` для production
- [ ] Добавить API key если требуется
- [ ] Настроить CORS для production домена
- [ ] Включить compression для API responses
- [ ] Настроить rate limiting на клиенте
- [ ] Добавить monitoring для API errors
- [ ] Тестирование на медленных соединениях
- [ ] Проверить работу offline mode
