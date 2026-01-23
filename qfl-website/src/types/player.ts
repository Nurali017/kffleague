import { PlayerStat } from './playerStats';

export interface PlayerDetail {
  player_id: string;
  first_name: string;
  last_name: string;
  photo_url?: string | null;
  jersey_number?: number;

  // Team info
  team_id: number;
  team_name: string;
  team_logo?: string;

  // Position
  position: 'GK' | 'DEF' | 'MID' | 'FWD';

  // Personal info
  date_of_birth?: string;
  nationality?: string;
  height?: number;  // в см
  weight?: number;  // в кг

  // Season stats (полная информация из PlayerStat)
  season_stats?: PlayerStat;

  // Career info
  bio?: string;
}

export interface PlayerMatchPerformance {
  match_id: string;
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
