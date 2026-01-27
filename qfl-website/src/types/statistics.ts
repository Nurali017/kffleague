import { PlayerStat } from './playerStats';

export interface GoalsByPeriodData {
    period: string;
    goals: number;
    home: number;
    away: number;
}

export interface SeasonHeroStats {
    seasonName: string;
    totalGoals: number;
    goalsPerMatch: number;
    minutesPerGoal: number;
    totalMatches: number;
}

export interface TeamStatistics {
    team_id: number;
    team_name: string;
    team_logo?: string | null;
    // Basic stats
    games_played?: number | null;
    matches_played?: number | null; // Alias for mock data
    wins?: number | null;
    draws?: number | null;
    losses?: number | null;
    goals_scored?: number | null;
    goals?: number | null; // Alias for mock data
    goals_conceded?: number | null;
    goal_difference?: number | null;
    points?: number | null;
    // Goals per match
    goals_per_match?: number | null;
    goals_conceded_per_match?: number | null;
    // Shots
    shots?: number | null;
    shots_on_goal?: number | null;
    shots_on_target?: number | null; // Alias for mock data
    shot_accuracy?: number | null;
    shots_per_match?: number | null;
    // Passes
    passes?: number | null;
    pass_accuracy?: number | null;
    key_passes?: number | null;
    crosses?: number | null;
    // Possession & Attacking
    possession?: number | null;
    dribbles?: number | null;
    dribbles_successful?: number | null; // Alias for mock data
    dribble_success?: number | null;
    attacks?: number | null; // Mock data field
    dangerous_attacks?: number | null; // Mock data field
    // Defense
    tackles?: number | null;
    interceptions?: number | null;
    recoveries?: number | null;
    clearances?: number | null; // Mock data field
    blocked_shots?: number | null; // Mock data field
    blocks?: number | null; // Mock data field
    // Discipline
    fouls?: number | null;
    fouls_per_match?: number | null;
    yellow_cards?: number | null;
    second_yellow_cards?: number | null;
    red_cards?: number | null;
    // Set pieces
    corners?: number | null;
    offsides?: number | null;
    // xG
    xg?: number | null;
    xg_per_match?: number | null;
}

export interface TeamStatsTableResponse {
    season_id: number;
    sort_by: string;
    items: TeamStatistics[];
    total: number;
}

// Extends the existing PlayerStat to include position for filtering
export interface ExtendedPlayerStat extends PlayerStat {
    position: 'GK' | 'DEF' | 'MID' | 'FWD';
    // Add any other fields missing from PlayerStat that we need for specific columns
    distance_covered?: number;
    top_speed?: number;
    shots_per_match?: number;
}

export type StatSubTab =
    | 'key_stats'
    | 'goals'
    | 'attempts'
    | 'distribution'
    | 'attacking'
    | 'defending'
    | 'goalkeeping'
    | 'disciplinary';
