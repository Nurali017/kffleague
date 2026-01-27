export interface GameTeam {
  id: number;
  name: string;
  name_kz?: string | null;
  name_en?: string | null;
  logo_url?: string | null;
}

export interface Stadium {
  id: number | null;
  name: string | null;
  city: string | null;
  capacity: number | null;
}

export interface Game {
  id: string;
  date: string;
  time: string | null;
  tour: number | null;
  season_id: number | null;
  home_score: number | null;
  away_score: number | null;
  home_team: GameTeam;
  away_team: GameTeam;
  stadium: Stadium | null;
  has_stats: boolean;
  has_lineup: boolean;
  visitors: number | null;
  is_live: boolean;
  status: "upcoming" | "live" | "finished";
  ticket_url: string | null;
  video_url: string | null;
}

export interface MatchEvent {
  id: string | number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  minute: number;
  team: 'home' | 'away';
  player_id: string;
  player_name: string;
  assist_player_id?: string;
  assist_player_name?: string;
  substitute_in?: string;  // Для замен
  substitute_out?: string; // Для замен
}

// Расширенное событие матча (из API /live/events/{id})
export interface EnhancedMatchEvent {
  id: number;
  half: 1 | 2; // Разделение по таймам
  minute: number;
  event_type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty';
  team_id: number;
  team_name: string;
  player_id: string;
  player_name: string;
  player_number: number;
  assist_player_id?: string;
  assist_player_name?: string;
  assist_player_number?: number;
  player2_id?: string; // Для замен (выходит)
  player2_name?: string;
  player2_number?: number;
  description?: string;
}

// Статистика игрока в матче (из API /games/{id}/stats)
export interface PlayerMatchStats {
  player_id: string;
  player_name: string;
  player_number: number;
  team_id: number;
  team_name?: string;
  position?: 'GK' | 'DEF' | 'MID' | 'FWD';

  // Статистика
  goals: number;
  assists: number;
  shots: number;
  shots_on_goal: number;
  passes: number;
  passes_accurate?: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played?: number;

  // Опциональные
  rating?: number;
  photo_url?: string;
}

export interface TeamLineup {
  formation: string;  // e.g., "4-4-2"
  starting_11: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface LineupPlayer {
  player_id: string;
  first_name: string;
  last_name: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  photo_url?: string;
  is_captain?: boolean;
}

export interface PlayerCountry {
  id: number;
  code: string;      // ISO код (KZ, RU, etc.)
  name: string;
  flag_url?: string;
}

export interface LineupPlayerExtended {
  player_id: string;
  first_name: string;
  last_name: string;
  number: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  is_captain: boolean;
  photo_url?: string;
  country?: PlayerCountry;

  // Координаты для визуализации (опционально, можно вычислять)
  x?: number; // 0-100
  y?: number; // 0-100
}

export interface TeamLineupData {
  team_id: number;
  team_name: string;
  formation: string; // "4-4-2", "4-3-3"
  coach_name?: string;
  starters: LineupPlayerExtended[];
  substitutes: LineupPlayerExtended[];
}

export interface RefereeInfo {
  name: string;
  role: 'main' | 'assistant' | 'fourth' | 'var';
}

export interface CoachInfo {
  name: string;
  photo_url?: string;
  nationality?: string;
}

// Расширенные составы (из API /games/{id}/lineup)
export interface MatchLineups {
  home_team: TeamLineupData;
  away_team: TeamLineupData;
  referees?: RefereeInfo[];
  coaches?: {
    home: CoachInfo;
    away: CoachInfo;
  };
}

// Расширенный MatchDetail с новыми полями
export interface MatchDetail extends Game {
  // Статус матча (уже есть в Game, переопределяем для расширения)
  minute?: number; // Текущая минута для live матчей
  half?: 1 | 2; // Текущий тайм

  // Статистика команд
  stats?: {
    possession: { home: number; away: number };
    shots: { home: number; away: number };
    shots_on_target: { home: number; away: number };
    corners: { home: number; away: number };
    fouls: { home: number; away: number };
    offsides: { home: number; away: number };
    yellow_cards: { home: number; away: number };
    red_cards: { home: number; away: number };
  };

  // События (расширенные из /live/events/{id})
  events?: MatchEvent[];

  // Статистика игроков (из /games/{id}/stats)
  player_stats?: PlayerMatchStats[];

  // Составы (из /games/{id}/lineup)
  lineups?: MatchLineups;

  // Доп. информация
  referee?: string;
  attendance?: number;
  weather?: string;
}

// Response типы для API
export interface MatchPlayerStatsResponse {
  match_id: string;
  team_stats?: any;
  player_stats: PlayerMatchStats[];
}

export interface LineupResponse {
  match_id: string;
  lineups: MatchLineups;
  referees?: RefereeInfo[];
  coaches?: {
    home: CoachInfo;
    away: CoachInfo;
  };
}

export interface EventsResponse {
  game_id: string;
  total: number;
  events: EnhancedMatchEvent[];
}

// Позиции игроков на поле для визуализации
export interface FormationPosition {
  x: number; // 0-100 (слева направо)
  y: number; // 0-100 (снизу вверх)
}

// Match Center types
export interface DateGroup {
  date: string;
  date_label: string;
  games: Game[];
}

export interface GroupedMatchesResponse {
  groups: DateGroup[];
  total: number;
}

export interface StandardMatchesResponse {
  items: Game[];
  total: number;
}

export interface MatchCenterFilters {
  season_id?: number;
  tours?: number[];
  team_ids?: number[];
  month?: number;
  year?: number;
  date_from?: string;
  date_to?: string;
  status?: 'upcoming' | 'finished' | 'live' | 'all';
  hide_past?: boolean;
  group_by_date?: boolean;
  language?: string;
  limit?: number;
  offset?: number;
}
