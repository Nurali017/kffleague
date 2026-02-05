export interface PlayerStat {
  player_id: string;
  first_name: string;
  last_name: string;
  photo_url: string | null;
  team_id: number;
  team_name: string;
  team_logo: string;
  position?: string;
  player_type?: string | null;
  top_role?: string | null;
  position_code?: 'GK' | 'DEF' | 'MID' | 'FWD' | null;
  games_played: number;
  games_starting?: number;
  minutes_played: number;
  started?: number;
  subbed_in?: number;
  goals: number | null;
  assists: number | null;
  goal_and_assist: number | null;
  xg: number | null;
  shots: number | null;
  shots_on_goal: number | null;
  passes: number;
  key_passes: number;
  pass_accuracy: number;
  duels: number | null;
  duels_won: number | null;
  aerial_duel: number | null;
  ground_duel: number | null;
  tackle: number | null;
  interception: number;
  recovery: number;
  dribble: number | null;
  dribble_success: number | null;
  yellow_cards: number;
  red_cards: number;
  save_shot: number | null;
  dry_match: number | null;
}

export interface PlayerStatsResponse {
  season_id: number;
  sort_by: string;
  items: PlayerStat[];
  total: number;
}

export type PositionCode = 'GK' | 'DEF' | 'MID' | 'FWD';

export type PlayerStatsSortBy =
  | 'goals'
  | 'assists'
  | 'xg'
  | 'shots'
  | 'shots_on_goal'
  | 'passes'
  | 'key_passes'
  | 'pass_accuracy'
  | 'duels'
  | 'duels_won'
  | 'aerial_duel'
  | 'ground_duel'
  | 'tackle'
  | 'interception'
  | 'recovery'
  | 'dribble'
  | 'dribble_success'
  | 'minutes_played'
  | 'games_played'
  | 'yellow_cards'
  | 'red_cards'
  | 'save_shot'
  | 'dry_match';
