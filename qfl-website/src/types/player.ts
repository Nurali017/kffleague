import { PlayerStat } from './playerStats';

export interface CountryInfo {
  id: number;
  code: string;
  name: string;
  flag_url?: string;
}

export interface PlayerDetail {
  player_id: number;
  first_name: string;
  last_name: string;
  photo_url?: string | null;
  jersey_number?: number;

  // Team info
  team_id: number;
  team_name: string;
  team_logo?: string;

  // Position
  position: 'GK' | 'DEF' | 'MID' | 'FWD' | string;

  // Personal info
  date_of_birth?: string | null;
  birthday?: string | null;
  nationality?: string | null;
  country?: CountryInfo | null;
  height?: number | null;
  weight?: number | null;
  age?: number | null;

  // Season stats (полная информация из PlayerStat)
  season_stats?: PlayerStat;

  // Career info
  bio?: string;
  top_role?: string;
  teams?: number[];
}

// API response format for player detail
export interface PlayerDetailAPIResponse {
  id: number;
  first_name: string | null;
  last_name: string | null;
  birthday: string | null;
  player_type: string | null;
  country: CountryInfo | null;
  photo_url: string | null;
  age: number | null;
  top_role: string | null;
  teams: number[];
  jersey_number: number | null;
}

export interface PlayerMatchPerformance {
  match_id: number;
  date: string;
  home_team: { id: number; name: string; logo_url?: string };
  away_team: { id: number; name: string; logo_url?: string };
  home_score?: number;
  away_score?: number;
  player_team: 'home' | 'away';
  result?: 'W' | 'D' | 'L';  // Win/Draw/Loss

  // Player performance
  minutes_played: number;
  goals: number;
  assists: number;
  yellow_card: boolean;
  red_card: boolean;
  rating?: number;  // 0-10
}

// Player season stats response from /players/{id}/stats
export interface PlayerSeasonStatsResponse {
  player_id: number;
  season_id: number;
  team_id: number | null;

  // Basic stats
  games_played: number | null;
  games_starting: number | null;
  minutes_played: number | null;

  // Goals & Assists
  goals: number | null;
  assists: number | null;
  xg: number | null;
  xg_per_90: number | null;

  // Shots
  shots: number | null;
  shots_on_goal: number | null;

  // Passes
  passes: number | null;
  pass_accuracy: number | null;
  key_passes: number | null;

  // Duels
  duels: number | null;
  duels_won: number | null;

  // Discipline
  yellow_cards: number | null;
  red_cards: number | null;

  // All 50+ metrics from v2 API
  extra_stats: Record<string, unknown> | null;
}

// Player teammate
export interface PlayerTeammate {
  player_id: number;
  first_name: string | null;
  last_name: string | null;
  jersey_number: number | null;
  position: string | null;
  age: number | null;
  photo_url: string | null;
}

export interface PlayerTeammatesResponse {
  items: PlayerTeammate[];
  total: number;
}

// Player tournament history
export interface PlayerTournamentHistory {
  season_id: number;
  season_name: string | null;
  tournament_name: string | null;
  team_id: number | null;
  team_name: string | null;
  position: string | null;
  games_played: number | null;
  minutes_played: number | null;
  goals: number | null;
  assists: number | null;
  yellow_cards: number | null;
  red_cards: number | null;
}

export interface PlayerTournamentHistoryResponse {
  items: PlayerTournamentHistory[];
  total: number;
}

// Stats format for player page components (matches mock data structure)
export interface PlayerPageStats {
  games_played: number;
  minutes_played: number;
  started: number;
  subbed_in: number;

  // Detailed stats
  goals: number;
  assists: number;
  shots: number;
  shots_on_goal: number;
  passes: number;
  key_passes: number;
  pass_accuracy: number;
  interception: number;
  dribble: number;

  yellow_cards: number;
  red_cards: number;
  duels: number;
  duels_won: number;
  duels_won_percentage: number;
}

// Match format for player page table (matches mock data structure)
export interface PlayerPageMatch {
  round: number;
  home: string;
  away: string;
  score: string;
  date: string;
  minutes: number;
  goals?: number;
  assists?: number;
  yellow_card?: boolean;
  red_card?: boolean;
}
