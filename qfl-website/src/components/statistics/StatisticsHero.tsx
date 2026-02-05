'use client';

import { GoalsByPeriodData, GoalsByPeriodMeta, SeasonHeroStats } from '@/types/statistics';
import { GoalTimingChart } from './GoalTimingChart';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeroBackground } from '@/components/ui/HeroBackground';

interface StatisticsHeroProps {
    stats: SeasonHeroStats;
    goalsByPeriod?: GoalsByPeriodData[] | null;
    goalsByPeriodMeta?: GoalsByPeriodMeta | null;
}

export function StatisticsHero({ stats, goalsByPeriod, goalsByPeriodMeta }: StatisticsHeroProps) {
    const { t } = useTranslation('statistics');
    const coveragePct = goalsByPeriodMeta?.coverage_pct ?? 0;
    const hasChartData = Boolean(goalsByPeriod?.length) && coveragePct > 0;

    const summaryItems = [
        {
            label: t('playerColumns.games_played', { defaultValue: 'Матчи' }),
            value: stats.totalMatches,
        },
        {
            label: t('hero.totalGoals', { defaultValue: 'Всего голов' }),
            value: stats.totalGoals,
        },
        {
            label: t('hero.goalsPerMatch', { defaultValue: 'Голов за матч' }),
            value: stats.goalsPerMatch,
        },
        {
            label: t('hero.minutesPerGoal', { defaultValue: 'Минут на гол' }),
            value: `${stats.minutesPerGoal}'`,
        },
    ];

    return (
        <div className="relative overflow-hidden text-white py-8 md:py-10">
            <HeroBackground />
            <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-20">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Left: Season stats table */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/10 rounded-2xl border border-white/15 backdrop-blur-sm overflow-hidden"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 text-[11px] md:text-xs uppercase tracking-wider text-white/70">
                            {summaryItems.map((item) => (
                                <div key={item.label} className="px-4 py-3 md:px-6 md:py-4 text-center">
                                    {item.label}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 text-3xl md:text-4xl font-bold text-white">
                            {summaryItems.map((item) => (
                                <div key={item.label} className="px-4 py-4 md:px-6 md:py-5 text-center">
                                    {item.value}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
                    >
                        {hasChartData ? (
                            <GoalTimingChart data={goalsByPeriod ?? []} meta={goalsByPeriodMeta ?? undefined} />
                        ) : (
                            <div className="h-[200px] w-full flex items-center justify-center text-center text-sm text-white/70 px-4">
                                {t('hero.goalsByPeriodNoData', {
                                    defaultValue: 'Данные по таймингу голов пока недоступны.',
                                })}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
