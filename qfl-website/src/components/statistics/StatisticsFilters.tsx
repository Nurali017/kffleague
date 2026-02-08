'use client';

import { useTranslation } from 'react-i18next';
import { TeamStatistics } from '@/types/statistics';

interface StatisticsFiltersProps {
    mode: 'clubs' | 'players';
    // For player stats only
    selectedClub?: string;
    onClubChange?: (clubId: string) => void;
    selectedPosition?: string;
    onPositionChange?: (position: string) => void;
    teams?: TeamStatistics[];
}

export function StatisticsFilters({
    mode,
    selectedClub,
    onClubChange,
    selectedPosition,
    onPositionChange,
    teams = []
}: StatisticsFiltersProps) {
    const { t } = useTranslation('statistics');

    const getPositionLabel = (pos: string) => {
        if (pos === 'all') return t('filters.allPositions');
        return t(`filters.positions.${pos}`);
    };

    return (
        <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border py-4">
            <div className="max-w-[1440px] mx-auto px-4 md:px-20">
                <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 md:gap-4">
                    {/* Club Filter (Player stats only) */}
                    {mode === 'players' && onClubChange && (
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300 shrink-0">
                                {t('filters.club')}:
                            </span>
                            <select
                                value={selectedClub}
                                onChange={(e) => onClubChange(e.target.value)}
                                className="min-w-0 w-full md:w-auto px-3 py-2 border border-gray-300 dark:border-dark-border-soft rounded-lg text-sm bg-white dark:bg-dark-surface text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">{t('filters.allClubs')}</option>
                                {teams.map(team => (
                                    <option key={team.team_id} value={team.team_id.toString()}>
                                        {team.team_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Position Filter (Player stats only) */}
                    {mode === 'players' && onPositionChange && (
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300 shrink-0">
                                {t('filters.position')}:
                            </span>
                            <div className="flex gap-1 border border-gray-200 dark:border-dark-border rounded-lg overflow-x-auto p-1 bg-gray-50 dark:bg-dark-surface-soft no-scrollbar min-w-0 w-full md:w-auto">
                                {['all', 'GK', 'DEF', 'MID', 'FWD'].map(pos => (
                                    <button
                                        key={pos}
                                        onClick={() => onPositionChange(pos)}
                                        className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded transition-colors uppercase ${selectedPosition === pos
                                                ? 'bg-primary dark:bg-cyan-600 text-white shadow-sm'
                                                : 'text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-dark-surface-soft'
                                            }`}
                                    >
                                        {getPositionLabel(pos)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
