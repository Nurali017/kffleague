import { StatSubTab } from '@/types/statistics';

export interface ColumnDefinition {
    key: string;
    label: string;
    format?: 'number' | 'percentage' | 'decimal';
    sortable?: boolean;
}

export function formatValue(value: any, format?: string) {
    if (value === null || value === undefined) return '-';
    if (format === 'percentage') return `${value}%`;
    if (format === 'decimal') return Number(value).toFixed(2);
    return value;
}

export function getColumnsForSubTab(subTab: StatSubTab, mode: 'clubs' | 'players'): ColumnDefinition[] {
    if (mode === 'clubs') {
        switch (subTab) {
            case 'key_stats':
                return [
                    { key: 'matches_played', label: 'MP', sortable: true },
                    { key: 'wins', label: 'W', sortable: true },
                    { key: 'draws', label: 'D', sortable: true },
                    { key: 'losses', label: 'L', sortable: true },
                    { key: 'goals', label: 'GF', sortable: true },
                    { key: 'goals_conceded', label: 'GA', sortable: true },
                    { key: 'goal_difference', label: 'GD', sortable: true },
                    { key: 'points', label: 'Pts', sortable: true },
                ];
            case 'goals':
                return [
                    { key: 'goals', label: 'Goals', sortable: true },
                    { key: 'goals_per_match', label: 'Avg Goals', format: 'decimal', sortable: true },
                    { key: 'goals_conceded', label: 'Conceded', sortable: true },
                    { key: 'goals_conceded_per_match', label: 'Avg Conceded', format: 'decimal', sortable: true },
                    { key: 'goal_difference', label: 'Diff', sortable: true },
                ];
            case 'attempts':
                return [
                    { key: 'shots', label: 'Shots', sortable: true },
                    { key: 'shots_on_target', label: 'On Target', sortable: true },
                    { key: 'shot_accuracy', label: 'Accuracy', format: 'percentage', sortable: true },
                    { key: 'shots_per_match', label: 'Shots/Match', format: 'decimal', sortable: true },
                ];
            case 'distribution':
                return [
                    { key: 'passes', label: 'Passes', sortable: true },
                    { key: 'pass_accuracy', label: 'Accuracy', format: 'percentage', sortable: true },
                    { key: 'key_passes', label: 'Key Passes', sortable: true },
                    { key: 'crosses', label: 'Crosses', sortable: true },
                ];
            case 'attacking':
                return [
                    { key: 'attacks', label: 'Attacks', sortable: true },
                    { key: 'dangerous_attacks', label: 'Dang. Attacks', sortable: true },
                    { key: 'possession', label: 'Possession', format: 'percentage', sortable: true },
                    { key: 'dribbles_successful', label: 'Dribbles', sortable: true },
                ];
            case 'defending':
                return [
                    { key: 'tackles', label: 'Tackles', sortable: true },
                    { key: 'interceptions', label: 'Interceptions', sortable: true },
                    { key: 'blocks', label: 'Blocks', sortable: true },
                    { key: 'clearances', label: 'Clearances', sortable: true },
                ];
            case 'disciplinary':
                return [
                    { key: 'fouls', label: 'Fouls', sortable: true },
                    { key: 'yellow_cards', label: 'Yellow', sortable: true },
                    { key: 'red_cards', label: 'Red', sortable: true },
                    { key: 'fouls_per_match', label: 'Fouls/M', format: 'decimal', sortable: true },
                ];
            default:
                return [];
        }
    } else {
        // Players
        switch (subTab) {
            case 'key_stats':
            case 'goals':
                return [
                    { key: 'games_played', label: 'Matches', sortable: true },
                    { key: 'goals', label: 'Goals', sortable: true },
                    { key: 'assists', label: 'Assists', sortable: true },
                    { key: 'minutes_played', label: 'Minutes', sortable: true },
                ];
            case 'attempts':
                return [
                    { key: 'shots', label: 'Shots', sortable: true },
                    { key: 'shots_on_goal', label: 'On Target', sortable: true },
                ];
            case 'distribution':
                return [
                    { key: 'passes', label: 'Passes', sortable: true },
                    { key: 'pass_accuracy', label: 'Accuracy', format: 'percentage', sortable: true },
                    { key: 'key_passes', label: 'Key Passes', sortable: true },
                ];
            case 'defending':
                return [
                    { key: 'tackle', label: 'Tackles', sortable: true },
                    { key: 'interception', label: 'Interceptions', sortable: true },
                    { key: 'recovery', label: 'Recoveries', sortable: true },
                ];
            case 'goalkeeping':
                return [
                    { key: 'save_shot', label: 'Saves', sortable: true },
                    { key: 'dry_match', label: 'Clean Sheets', sortable: true },
                ];
            case 'disciplinary':
                return [
                    { key: 'yellow_cards', label: 'Yellow', sortable: true },
                    { key: 'red_cards', label: 'Red', sortable: true },
                ];
            default:
                return [];
        }
    }
}
