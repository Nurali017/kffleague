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
}

export interface FormGuideMatch {
  game_id: string;
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
  game_id: string;
  date: string;
  home_team_id: number;
  home_team_name: string;
  away_team_id: number;
  away_team_name: string;
  home_score: number | null;
  away_score: number | null;
  tour: number | null;
  season_name: string | null;
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
