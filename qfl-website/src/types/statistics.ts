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
    team_logo: string;
    matches_played: number;
    wins: number;
    draws: number;
    losses: number;
    goals: number;
    goals_conceded: number;
    goal_difference: number;
    points: number;
    goals_per_match: number;
    goals_conceded_per_match: number;
    shots: number;
    shots_on_target: number;
    shot_accuracy: number;
    shots_per_match: number;
    passes: number;
    pass_accuracy: number;
    key_passes: number;
    crosses: number;
    attacks: number;
    dangerous_attacks: number;
    possession: number;
    dribbles_successful: number;
    tackles: number;
    interceptions: number;
    blocks: number;
    clearances: number;
    fouls: number;
    yellow_cards: number;
    red_cards: number;
    fouls_per_match: number;
}

// Extends the existing PlayerStat to include position for filtering
export interface ExtendedPlayerStat extends PlayerStat {
    position: 'GK' | 'DEF' | 'MID' | 'FWD';
    // Add any other fields missing from PlayerStat that we need for specific columns
    distance_covered?: number;
    top_speed?: number;
    shots_per_match?: number;
    xg?: number | null;
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
