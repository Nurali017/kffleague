export interface SeasonStatistics {
  season_id: number;
  season_name: string | null;
  matches_played: number;
  wins: number;
  draws: number;
  total_attendance: number;
  total_goals: number;
  goals_per_match: number;
  penalties: number;
  penalties_scored: number;
  fouls_per_match: number;
  yellow_cards: number;
  second_yellow_cards: number;
  red_cards: number;
}
