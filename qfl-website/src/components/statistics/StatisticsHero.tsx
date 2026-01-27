'use client';

import { GoalsByPeriodData, SeasonHeroStats } from '@/types/statistics';
import { GoalTimingChart } from './GoalTimingChart';
import { motion } from 'framer-motion';

interface StatisticsHeroProps {
    stats: SeasonHeroStats;
    goalsByPeriod: GoalsByPeriodData[];
}

export function StatisticsHero({ stats, goalsByPeriod }: StatisticsHeroProps) {
    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#11305C] to-[#0D2549] text-white py-12 md:py-16">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 L100 0 L100 100 Z" fill="white" />
                </svg>
            </div>

            <div className="relative max-w-[1440px] mx-auto px-4 md:px-20">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl md:text-2xl font-bold tracking-wide text-white/50 uppercase mb-8"
                >
                    {stats.seasonName}
                </motion.h1>

                <div className="grid md:grid-cols-2 gap-12 items-end">
                    {/* Left: Key metrics */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-baseline gap-4">
                            <span className="text-7xl md:text-8xl font-black tracking-tighter text-white">
                                {stats.totalGoals}
                            </span>
                            <span className="text-2xl font-medium text-white/80">
                                Total goals
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mt-10">
                            <div className="border-l-4 border-[#E5B73B] pl-4">
                                <div className="text-4xl font-bold">{stats.goalsPerMatch}</div>
                                <div className="text-sm font-medium text-white/60 uppercase tracking-wider mt-1">Goals per match</div>
                            </div>
                            <div className="border-l-4 border-[#22C55E] pl-4">
                                <div className="text-4xl font-bold">{stats.minutesPerGoal}&apos;</div>
                                <div className="text-sm font-medium text-white/60 uppercase tracking-wider mt-1">Minutes per goal</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
                    >
                        <GoalTimingChart data={goalsByPeriod} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
