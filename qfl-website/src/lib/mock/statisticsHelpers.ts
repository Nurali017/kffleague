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
                    { key: 'games_played', label: 'И', sortable: true },
                    { key: 'wins', label: 'В', sortable: true },
                    { key: 'draws', label: 'Н', sortable: true },
                    { key: 'losses', label: 'П', sortable: true },
                    { key: 'goals_scored', label: 'ЗГ', sortable: true },
                    { key: 'goals_conceded', label: 'ПГ', sortable: true },
                    { key: 'goal_difference', label: 'РГ', sortable: true },
                    { key: 'points', label: 'О', sortable: true },
                ];
            case 'goals':
                return [
                    { key: 'goals_scored', label: 'Голы', sortable: true },
                    { key: 'goals_per_match', label: 'Голы/М', format: 'decimal', sortable: true },
                    { key: 'goals_conceded', label: 'Пропущено', sortable: true },
                    { key: 'goals_conceded_per_match', label: 'Проп/М', format: 'decimal', sortable: true },
                    { key: 'goal_difference', label: 'Разница', sortable: true },
                    { key: 'xg', label: 'xG', format: 'decimal', sortable: true },
                ];
            case 'attempts':
                return [
                    { key: 'shots', label: 'Удары', sortable: true },
                    { key: 'shots_on_goal', label: 'В створ', sortable: true },
                    { key: 'shot_accuracy', label: 'Точность', format: 'percentage', sortable: true },
                    { key: 'shots_per_match', label: 'Удары/М', format: 'decimal', sortable: true },
                ];
            case 'distribution':
                return [
                    { key: 'passes', label: 'Передачи', sortable: true },
                    { key: 'pass_accuracy', label: 'Точность', format: 'percentage', sortable: true },
                    { key: 'key_passes', label: 'Ключевые', sortable: true },
                    { key: 'crosses', label: 'Кроссы', sortable: true },
                ];
            case 'attacking':
                return [
                    { key: 'possession', label: 'Владение', format: 'percentage', sortable: true },
                    { key: 'dribbles', label: 'Дриблинг', sortable: true },
                    { key: 'dribble_success', label: 'Дрибл %', format: 'percentage', sortable: true },
                    { key: 'corners', label: 'Угловые', sortable: true },
                ];
            case 'defending':
                return [
                    { key: 'tackles', label: 'Отборы', sortable: true },
                    { key: 'interceptions', label: 'Перехваты', sortable: true },
                    { key: 'recoveries', label: 'Возвраты', sortable: true },
                    { key: 'offsides', label: 'Офсайды', sortable: true },
                ];
            case 'disciplinary':
                return [
                    { key: 'fouls', label: 'Фолы', sortable: true },
                    { key: 'yellow_cards', label: 'ЖК', sortable: true },
                    { key: 'second_yellow_cards', label: '2ЖК', sortable: true },
                    { key: 'red_cards', label: 'КК', sortable: true },
                    { key: 'fouls_per_match', label: 'Фолы/М', format: 'decimal', sortable: true },
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
