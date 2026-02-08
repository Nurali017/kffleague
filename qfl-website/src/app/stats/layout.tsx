'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSeasonGoalsByPeriod, useSeasonStats } from '@/hooks';
import { StatisticsHero } from '@/components/statistics/StatisticsHero';
import { Skeleton } from '@/components/ui/Skeleton';
import { HeroBackground } from '@/components/ui/HeroBackground';
import { useTournament } from '@/contexts/TournamentContext';

function HeroSkeleton() {
    return (
        <div className="relative overflow-hidden text-white py-8 md:py-10">
            <HeroBackground />
            <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-20">
                <div className="grid md:grid-cols-2 gap-8">
                    <Skeleton className="h-32 w-full bg-white/20 rounded-2xl" />
                    <Skeleton className="h-48 w-full bg-white/20 rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

function MainTabs() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { t } = useTranslation('statistics');
    const isTeams = pathname === '/stats/teams' || pathname === '/stats';
    const isPlayers = pathname === '/stats/players';

    const query = searchParams.toString();
    const teamsHref = query ? `/stats/teams?${query}` : '/stats/teams';
    const playersHref = query ? `/stats/players?${query}` : '/stats/players';

  return (
        <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border sticky top-14 md:top-16 z-40 shadow-sm -mt-3 md:-mt-6">
            <div className="max-w-[1440px] mx-auto px-4 md:px-20">
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                    <Link
                        href={teamsHref}
                        className={`shrink-0 px-4 md:px-8 py-3 md:py-5 text-sm md:text-lg font-bold transition-all relative ${
                            isTeams
                                ? 'text-primary dark:text-accent-cyan'
                                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
                        }`}
                    >
                        {t('mainTabs.clubs', { defaultValue: 'Статистика клубов' })}
                        {isTeams && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary dark:bg-accent-cyan rounded-t-sm" />
                        )}
                    </Link>
                    <Link
                        href={playersHref}
                        className={`shrink-0 px-4 md:px-8 py-3 md:py-5 text-sm md:text-lg font-bold transition-all relative ${
                            isPlayers
                                ? 'text-primary dark:text-accent-cyan'
                                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
                        }`}
                    >
                        {t('mainTabs.players', { defaultValue: 'Статистика игроков' })}
                        {isPlayers && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary dark:bg-accent-cyan rounded-t-sm" />
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );
}

interface StatsLayoutProps {
    children: ReactNode;
}

export default function StatsLayout({ children }: StatsLayoutProps) {
    const { t, i18n } = useTranslation('statistics');
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';
    const { effectiveSeasonId, currentTournament } = useTournament();
    const { stats, loading, error } = useSeasonStats({ seasonId: effectiveSeasonId });
    const { goalsByPeriod, meta: goalsByPeriodMeta } = useSeasonGoalsByPeriod({ seasonId: effectiveSeasonId });

    // Transform API response to hero stats format
    const tournamentName =
        currentTournament.name[lang] || currentTournament.name.short || currentTournament.name.ru;
    const heroStats = stats ? {
        seasonName: `${tournamentName} ${stats.season_name || ''}`.trim(),
        totalGoals: stats.total_goals,
        goalsPerMatch: stats.goals_per_match,
        minutesPerGoal: stats.goals_per_match > 0 ? Math.round(90 / stats.goals_per_match) : 0,
        totalMatches: stats.matches_played,
    } : null;

    return (
        <div className="min-h-screen bg-[#FAFBFC] dark:bg-dark-bg">
            {loading ? (
                <HeroSkeleton />
            ) : error || !heroStats ? (
                <div className="relative overflow-hidden text-white py-12 md:py-16">
                    <HeroBackground />
                    <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-20">
                        <p className="text-red-400">{t('errors.seasonStatsLoad', { defaultValue: 'Ошибка загрузки статистики' })}</p>
                    </div>
                </div>
            ) : (
                <StatisticsHero
                    stats={heroStats}
                    goalsByPeriod={goalsByPeriod}
                    goalsByPeriodMeta={goalsByPeriodMeta}
                />
            )}

            <MainTabs />

            {children}
        </div>
    );
}
