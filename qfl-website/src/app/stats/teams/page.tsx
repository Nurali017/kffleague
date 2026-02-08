'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useTeamStatsTable } from '@/hooks';
import { StatisticsSubTabs } from '@/components/statistics/StatisticsSubTabs';
import { StatisticsFilters } from '@/components/statistics/StatisticsFilters';
import { ClubStatsTable } from '@/components/statistics/ClubStatsTable';
import { StatSubTab } from '@/types/statistics';
import { useTournament } from '@/contexts/TournamentContext';

export default function TeamsStatsPage() {
    const { t, i18n } = useTranslation('statistics');
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';
    const searchParams = useSearchParams();
    const { effectiveSeasonId, currentTournament } = useTournament();
    const [subTab, setSubTab] = useState<StatSubTab>('key_stats');

    const { teams, loading, error } = useTeamStatsTable({ seasonId: effectiveSeasonId });
    const tournamentName =
        currentTournament.name[lang] || currentTournament.name.short || currentTournament.name.ru;
    const query = searchParams.toString();
    const tableHref = query ? `/table?${query}` : '/table';
    const playersHref = query ? `/stats/players?${query}` : '/stats/players';

    return (
        <>
            <StatisticsSubTabs
                activeSubTab={subTab}
                onSubTabChange={setSubTab}
                hideGoalkeeping={true}
            />
            <StatisticsFilters mode="clubs" />

            <div className="max-w-[1440px] mx-auto px-4 md:px-20 py-6 md:py-8">
                {error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
                        <p className="text-red-600 dark:text-red-400">{t('loadError')}</p>
                        <p className="text-sm text-red-500 dark:text-red-500 mt-2">{error.message}</p>
                    </div>
                ) : !loading && teams.length === 0 ? (
                    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-10 text-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                            {t('emptyState.title', { defaultValue: 'Командная статистика недоступна' })}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                            {t('emptyState.description', {
                                tournament: tournamentName,
                                defaultValue: `Для турнира «${tournamentName}» пока нет данных.`,
                            })}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                            {t('emptyState.reason', {
                                defaultValue: 'Данные ещё готовятся или не синхронизированы.',
                            })}
                        </p>
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href={tableHref}
                                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold transition-colors"
                            >
                                {currentTournament.hasTable
                                    ? t('emptyState.openTable', { defaultValue: 'Открыть таблицу' })
                                    : currentTournament.hasBracket
                                        ? t('emptyState.openBracket', { defaultValue: 'Открыть сетку' })
                                        : t('emptyState.openTournament', { defaultValue: 'Открыть турнир' })}
                            </Link>
                            <Link
                                href={playersHref}
                                className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 dark:border-dark-border-soft bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-surface-soft text-gray-900 dark:text-slate-100 font-semibold transition-colors"
                            >
                                {t('emptyState.openPlayers', { defaultValue: 'Открыть статистику игроков' })}
                            </Link>
                        </div>
                    </div>
                ) : (
                    <ClubStatsTable
                        subTab={subTab}
                        teams={teams}
                        loading={loading}
                    />
                )}
            </div>
        </>
    );
}
