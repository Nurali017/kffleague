export interface PlayerStat {
  player_id: string;
  first_name: string;
  last_name: string;
  photo_url: string | null;
  team_id: number;
  team_name: string;
  team_logo: string;
  games_played: number;
  minutes_played: number;
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

export type PlayerStatsSortBy = 'goals' | 'assists' | 'dry_match';
