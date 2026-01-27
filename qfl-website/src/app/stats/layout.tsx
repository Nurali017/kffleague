'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSeasonStats } from '@/hooks';
import { StatisticsHero } from '@/components/statistics/StatisticsHero';
import { Skeleton } from '@/components/ui/Skeleton';

// Mock data for goals by period - TODO: Add API endpoint for this
const mockGoalsByPeriod = [
    { period: "0-15'", goals: 45, home: 28, away: 17 },
    { period: "16-30'", goals: 68, home: 36, away: 32 },
    { period: "31-45'", goals: 85, home: 48, away: 37 },
    { period: "46-60'", goals: 74, home: 40, away: 34 },
    { period: "61-75'", goals: 92, home: 54, away: 38 },
    { period: "76-90'", goals: 62, home: 35, away: 27 },
];

function HeroSkeleton() {
    return (
        <div className="bg-gradient-to-r from-[#11305C] to-[#0D2549] text-white py-12 md:py-16">
            <div className="max-w-[1440px] mx-auto px-4 md:px-20">
                <Skeleton className="h-8 w-64 bg-white/20 mb-8" />
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <Skeleton className="h-24 w-48 bg-white/20 mb-10" />
                        <div className="grid grid-cols-2 gap-8">
                            <Skeleton className="h-20 w-full bg-white/20" />
                            <Skeleton className="h-20 w-full bg-white/20" />
                        </div>
                    </div>
                    <Skeleton className="h-48 w-full bg-white/20 rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

function MainTabs() {
    const pathname = usePathname();
    const isTeams = pathname === '/stats/teams' || pathname === '/stats';
    const isPlayers = pathname === '/stats/players';

    return (
        <div className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm">
            <div className="max-w-[1440px] mx-auto px-4 md:px-20">
                <div className="flex gap-1">
                    <Link
                        href="/stats/teams"
                        className={`px-8 py-5 text-lg font-bold transition-all relative ${
                            isTeams
                                ? 'text-[#1E4D8C] dark:text-blue-400'
                                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
                        }`}
                    >
                        Статистика клубов
                        {isTeams && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1E4D8C] dark:bg-blue-400 rounded-t-sm" />
                        )}
                    </Link>
                    <Link
                        href="/stats/players"
                        className={`px-8 py-5 text-lg font-bold transition-all relative ${
                            isPlayers
                                ? 'text-[#1E4D8C] dark:text-blue-400'
                                : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
                        }`}
                    >
                        Статистика игроков
                        {isPlayers && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1E4D8C] dark:bg-blue-400 rounded-t-sm" />
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
    const { stats, loading, error } = useSeasonStats();

    // Transform API response to hero stats format
    const heroStats = stats ? {
        seasonName: stats.season_name || 'Премьер-Лига 2024/25',
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
                <div className="bg-gradient-to-r from-[#11305C] to-[#0D2549] text-white py-12 md:py-16">
                    <div className="max-w-[1440px] mx-auto px-4 md:px-20">
                        <p className="text-red-400">Ошибка загрузки статистики</p>
                    </div>
                </div>
            ) : (
                <StatisticsHero stats={heroStats} goalsByPeriod={mockGoalsByPeriod} />
            )}

            <MainTabs />

            {children}
        </div>
    );
}
