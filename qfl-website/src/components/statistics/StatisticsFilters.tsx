'use client';

import { useTranslation } from 'react-i18next';
import { PlayerStatsNationalityFilter } from '@/types';
import { TeamStatistics } from '@/types/statistics';

interface StatisticsFiltersProps {
    mode: 'clubs' | 'players';
    // For player stats only
    selectedClub?: string;
    onClubChange?: (clubId: string) => void;
    selectedNationality?: PlayerStatsNationalityFilter;
    onNationalityChange?: (nationality: PlayerStatsNationalityFilter) => void;
    teams?: TeamStatistics[];
}

export function StatisticsFilters({
    mode,
    selectedClub,
    onClubChange,
    selectedNationality,
    onNationalityChange,
    teams = []
}: StatisticsFiltersProps) {
    const { t } = useTranslation('statistics');
    const showClubFilter = mode === 'players' && Boolean(onClubChange);
    const showNationalityFilter = mode === 'players' && Boolean(onNationalityChange);
    const hasFilters = showClubFilter || showNationalityFilter;

    const getNationalityLabel = (type: PlayerStatsNationalityFilter) => {
        if (type === 'kz') return t('filters.kazakhstanPlayers');
        if (type === 'foreign') return t('filters.foreignPlayers');
        return t('filters.allNationalities');
    };

    if (!hasFilters) {
        return null;
    }

    return (
        <div data-testid="statistics-filters" className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border py-3 md:py-4">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
                <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3 md:gap-4">
                    {/* Club Filter (Player stats only) */}
                    {showClubFilter && onClubChange && (
                        <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2 w-full md:w-auto">
                            <span className="text-xs md:text-sm font-semibold text-gray-600 dark:text-slate-300 shrink-0">
                                {t('filters.club')}:
                            </span>
                            <select
                                value={selectedClub}
                                onChange={(e) => onClubChange(e.target.value)}
                                className="min-w-0 w-full md:w-auto md:min-w-[220px] px-3 py-2.5 border border-gray-300 dark:border-dark-border-soft rounded-lg text-sm bg-white dark:bg-dark-surface text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500 focus:border-transparent"
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

                    {showNationalityFilter && onNationalityChange && (
                        <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2 w-full md:w-auto">
                            <span className="text-xs md:text-sm font-semibold text-gray-600 dark:text-slate-300 shrink-0">
                                {t('filters.nationality')}:
                            </span>
                            <div className="flex gap-1 border border-gray-200 dark:border-dark-border rounded-lg overflow-x-auto p-1 bg-gray-50 dark:bg-dark-surface-soft no-scrollbar min-w-0 w-full md:w-auto">
                                {(['all', 'kz', 'foreign'] as PlayerStatsNationalityFilter[]).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => onNationalityChange(type)}
                                        className={`shrink-0 px-3 py-2 min-h-[36px] text-xs font-bold rounded transition-colors ${
                                            selectedNationality === type
                                                ? 'bg-primary dark:bg-cyan-600 text-white shadow-sm'
                                                : 'text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-dark-surface-soft'
                                        }`}
                                    >
                                        {getNationalityLabel(type)}
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
