import React from 'react';
import { PlayerPageStats } from '@/types/player';

interface PlayerDetailStatsProps {
    stats?: PlayerPageStats | null;
}

const StatItem = ({ label, value }: { label: string; value: number | string }) => (
    <div className="flex flex-col items-center justify-center p-3 transition-colors hover:bg-gray-50 rounded-lg">
        <span className="text-3xl md:text-3xl font-black text-[#1E293B] mb-1">{value}</span>
        <span className="text-[10px] text-gray-500 text-center font-bold leading-tight max-w-[120px] uppercase">
            {label}
        </span>
    </div>
);

const CircularChart = ({ value, label, color = "text-[#1E4D8C]" }: { value: number; label: string; color?: string }) => {
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center relative w-[160px] h-[160px] md:w-[200px] md:h-[200px]">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
                <circle
                    className="text-gray-100"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50%"
                    cy="50%"
                />
                {/* Progress Circle */}
                <circle
                    className={`${color} transition-all duration-1000 ease-out`}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50%"
                    cy="50%"
                />
            </svg>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-6xl font-black text-[#1E293B]">{value}%</span>
            </div>
            <div className="absolute -bottom-8 w-full text-center">
                <span className="text-sm font-bold text-[#1E293B] uppercase tracking-wide">{label}</span>
            </div>
        </div>
    );
};

export function PlayerDetailStats({ stats }: PlayerDetailStatsProps) {
    if (!stats) return null;

    const passAccuracy = stats.pass_accuracy ?? 0;
    const duels = stats.duels ?? 0;
    const duelsWon = stats.duels_won ?? 0;
    const duelsWonPercentage = duels > 0 ? Math.round((duelsWon / duels) * 100) : 0;

    return (
        <div className="w-full bg-white rounded-2xl p-8 md:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex flex-col xl:flex-row items-center justify-center gap-12 xl:gap-20">

                {/* Left Circle - Pass Accuracy */}
                <div className="flex-shrink-0 mb-8 xl:mb-0 transform hover:scale-105 transition-transform duration-300">
                    <CircularChart
                        value={passAccuracy}
                        label="Пастар дәлдігі"
                        color="text-[#0055D4]"
                    />
                </div>

                {/* Center Grid - Stats */}
                <div className="flex-1 w-full max-w-4xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-y-10 gap-x-4">
                        <StatItem value={stats.passes ?? 0} label="Пастардың барлығы" />
                        <StatItem value={stats.goals ?? 0} label="Голдар" />
                        <StatItem value={stats.assists ?? 0} label="Нәтижелі пастар" />
                        <StatItem value={duelsWonPercentage} label="Сәтті жекпе-жектер" />

                        <StatItem value={stats.shots ?? 0} label="Қақпаға соққылар" />
                        <StatItem value={stats.shots_on_goal ?? 0} label="Қақпаға дөп бағытталған" />
                        <StatItem value={stats.interception ?? 0} label="Допты тартып алу" />
                        <StatItem value={stats.dribble ?? 0} label="Допты алып өту" />

                        <StatItem value={stats.key_passes ?? 0} label="Дәл пастар" />
                        <StatItem value={stats.yellow_cards ?? 0} label="Сары қағаздар" />
                        <StatItem value={stats.red_cards ?? 0} label="Қызыл қағаздар" />
                        <StatItem value={stats.duels ?? 0} label="Жекпе-жектер" />

                        <StatItem value={stats.passes ?? 0} label="Дөп пастар" />
                        <StatItem value={stats.duels_won ?? 0} label="Жеңген жекпе-жектер" />
                    </div>
                </div>

                {/* Right Circle - Duels Won */}
                <div className="flex-shrink-0 mt-8 xl:mt-0 transform hover:scale-105 transition-transform duration-300">
                    <CircularChart
                        value={duelsWonPercentage}
                        label="Сәтті жекпе-жектер"
                        color="text-[#55C5E6]"
                    />
                </div>

            </div>
        </div>
    );
}
