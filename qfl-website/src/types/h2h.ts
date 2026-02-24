/**
 * Head-to-Head (H2H) statistics types
 * Mirrors backend schemas from backend/app/schemas/head_to_head.py
 */

export interface H2HOverallStats {
  total_matches: number;
  team1_wins: number;
  draws: number;
  team2_wins: number;
  team1_goals: number;
  team2_goals: number;
  team1_home_wins: number;
  team1_away_wins: number;
  team2_home_wins: number;
  team2_away_wins: number;
}

export interface FormGuideMatch {
  game_id: number;
  date: string;
  result: 'W' | 'D' | 'L';
  opponent_id: number;
  opponent_name: string;
  opponent_logo_url: string | null;
  home_score: number | null;
  away_score: number | null;
  was_home: boolean;
}

export interface FormGuide {
  team_id: number;
  team_name: string;
  matches: FormGuideMatch[];
}

export interface SeasonTableEntry {
  position: number | null;
  team_id: number;
  team_name: string;
  logo_url: string | null;
  games_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_scored: number;
  goals_conceded: number;
  goal_difference: number;
  points: number;
  clean_sheets: number;
}

export interface PreviousMeeting {
  game_id: number;
  date: string;
  home_team_id: number;
  home_team_name: string;
  away_team_id: number;
  away_team_name: string;
  home_score: number | null;
  away_score: number | null;
  tour: number | null;
  season_name: string | null;
  home_team_logo: string | null;
  away_team_logo: string | null;
}

// Phase 1: Fun Facts

export interface H2HBiggestWin {
  game_id: number;
  date: string;
  score: string;
  goal_difference: number;
}

export interface H2HGoalsByHalf {
  team1_first_half: number;
  team1_second_half: number;
  team2_first_half: number;
  team2_second_half: number;
}

export interface H2HFunFacts {
  avg_goals_per_match: number;
  over_2_5_percent: number;
  btts_percent: number;
  team1_biggest_win: H2HBiggestWin | null;
  team2_biggest_win: H2HBiggestWin | null;
  team1_unbeaten_streak: number;
  team2_unbeaten_streak: number;
  goals_by_half: H2HGoalsByHalf | null;
  team1_worst_defeat: H2HBiggestWin | null;
  team2_worst_defeat: H2HBiggestWin | null;
}

// Phase 1: Aggregated Match Stats

export interface H2HTeamMatchStats {
  avg_possession: number | null;
  avg_shots: number | null;
  avg_shots_on_goal: number | null;
  avg_corners: number | null;
  avg_fouls: number | null;
  total_yellow_cards: number;
  total_red_cards: number;
}

export interface H2HAggregatedMatchStats {
  matches_with_stats: number;
  team1: H2HTeamMatchStats;
  team2: H2HTeamMatchStats;
}

// Phase 2: Top Performers

export interface H2HTopPerformer {
  player_id: number;
  player_name: string;
  team_id: number;
  photo_url: string | null;
  count: number;
}

export interface H2HTopPerformers {
  top_scorers: H2HTopPerformer[];
  top_assisters: H2HTopPerformer[];
}

// Phase 3: Enhanced Season Stats

export interface H2HEnhancedSeasonTeamStats {
  xg: number | null;
  xg_per_match: number | null;
  possession_avg: number | null;
  pass_accuracy_avg: number | null;
  duel_ratio: number | null;
  shots_per_match: number | null;
}

export interface H2HEnhancedSeasonStats {
  team1: H2HEnhancedSeasonTeamStats | null;
  team2: H2HEnhancedSeasonTeamStats | null;
}

export interface HeadToHeadResponse {
  team1_id: number;
  team1_name: string;
  team2_id: number;
  team2_name: string;
  season_id: number;
  overall: H2HOverallStats;
  form_guide: {
    team1: FormGuide;
    team2: FormGuide;
  };
  season_table: SeasonTableEntry[];
  previous_meetings: PreviousMeeting[];
  fun_facts: H2HFunFacts | null;
  match_stats: H2HAggregatedMatchStats | null;
  top_performers: H2HTopPerformers | null;
  enhanced_season_stats: H2HEnhancedSeasonStats | null;
}

// Computed metrics helpers
export interface H2HComputedMetrics {
  team1WinRate: number;
  team2WinRate: number;
  team1GoalsPerGame: number;
  team2GoalsPerGame: number;
  team1CleanSheetRate: number;
  team2CleanSheetRate: number;
}

export function computeH2HMetrics(
  data: HeadToHeadResponse
): H2HComputedMetrics {
  const { overall, season_table } = data;
  const totalMatches = overall.total_matches || 1;

  // Find teams in season table
  const team1Entry = season_table.find(t => t.team_id === data.team1_id);
  const team2Entry = season_table.find(t => t.team_id === data.team2_id);

  return {
    team1WinRate: (overall.team1_wins / totalMatches) * 100,
    team2WinRate: (overall.team2_wins / totalMatches) * 100,
    team1GoalsPerGame: overall.team1_goals / totalMatches,
    team2GoalsPerGame: overall.team2_goals / totalMatches,
    team1CleanSheetRate: team1Entry
      ? (team1Entry.clean_sheets / (team1Entry.games_played || 1)) * 100
      : 0,
    team2CleanSheetRate: team2Entry
      ? (team2Entry.clean_sheets / (team2Entry.games_played || 1)) * 100
      : 0,
  };
}
