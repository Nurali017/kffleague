'use client';

import { useTranslation } from 'react-i18next';
import { TeamStats } from '@/types/team';
import Link from 'next/link';

interface TeamKeyStatsProps {
    stats: TeamStats;
}

// SVG Donut Chart for W/D/L
function MatchesDonut({ played, won, drawn, lost }: { played: number; won: number; drawn: number; lost: number }) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const total = won + drawn + lost || 1;

    const wonPct = won / total;
    const drawnPct = drawn / total;
    const lostPct = lost / total;

    const wonLen = wonPct * circumference;
    const drawnLen = drawnPct * circumference;
    const lostLen = lostPct * circumference;

    const wonOffset = 0;
    const drawnOffset = -(wonLen);
    const lostOffset = -(wonLen + drawnLen);

    return (
        <div className="flex items-center gap-6">
            <div className="relative w-[130px] h-[130px] flex-shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    {/* Background circle */}
                    <circle cx="60" cy="60" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="10" />
                    {/* Won arc - blue */}
                    {won > 0 && (
                        <circle
                            cx="60" cy="60" r={radius} fill="none"
                            stroke="#1E4D8C" strokeWidth="10"
                            strokeDasharray={`${wonLen} ${circumference - wonLen}`}
                            strokeDashoffset={wonOffset}
                            strokeLinecap="round"
                        />
                    )}
                    {/* Drawn arc - cyan */}
                    {drawn > 0 && (
                        <circle
                            cx="60" cy="60" r={radius} fill="none"
                            stroke="#67E8F9" strokeWidth="10"
                            strokeDasharray={`${drawnLen} ${circumference - drawnLen}`}
                            strokeDashoffset={drawnOffset}
                            strokeLinecap="round"
                        />
                    )}
                    {/* Lost arc - red/pink */}
                    {lost > 0 && (
                        <circle
                            cx="60" cy="60" r={radius} fill="none"
                            stroke="#F87171" strokeWidth="10"
                            strokeDasharray={`${lostLen} ${circumference - lostLen}`}
                            strokeDashoffset={lostOffset}
                            strokeLinecap="round"
                        />
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-gray-900">{played}</span>
                    <span className="text-[10px] text-gray-400 font-medium">Matches<br/>played</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-gray-900">{won}</span>
                    <span className="w-2 h-2 rounded-full bg-[#1E4D8C]" />
                    <span className="text-sm text-gray-500">Won</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-gray-900">{drawn}</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-300" />
                    <span className="text-sm text-gray-500">Drawn</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-gray-900">{lost}</span>
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-sm text-gray-500">Lost</span>
                </div>
            </div>
        </div>
    );
}

interface StatCellProps {
    value: string | number;
    label: string;
    avg?: string;
    icon?: React.ReactNode;
}

function StatCell({ value, label, avg, icon }: StatCellProps) {
    return (
        <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
                {icon}
                <span className="text-2xl font-black text-gray-900">{value}</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">{label}</span>
            {avg && <span className="text-[10px] text-gray-400">{avg}</span>}
        </div>
    );
}

export function TeamKeyStats({ stats }: TeamKeyStatsProps) {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';
    const gp = stats.games_played || 1;

    const avgPerMatch = (val: number | undefined | null) => {
        if (val == null) return undefined;
        return `${(val / gp).toFixed(2)} avg. per match`;
    };

    // Extract extra_stats fields if available
    const extra = stats.extra_stats || {};
    const ballsRecovered = extra.balls_recovered ?? extra.recovery ?? null;
    const tacklesWon = extra.tackles_won ?? extra.tackles ?? null;
    const distanceCovered = extra.distance_covered ?? null;
    const saves = extra.saves ?? extra.save_shot ?? null;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">
                {lang === 'kz' ? 'Негізгі статистика' : 'Key stats'}
            </h2>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Donut */}
                <div className="flex-shrink-0">
                    <MatchesDonut
                        played={stats.games_played}
                        won={stats.wins}
                        drawn={stats.draws}
                        lost={stats.losses}
                    />
                </div>

                {/* Right: Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5 flex-1">
                    <StatCell
                        value={stats.goals_scored}
                        label={lang === 'kz' ? 'Голдар' : 'Goals'}
                        avg={avgPerMatch(stats.goals_scored)}
                    />
                    <StatCell
                        value={stats.goals_conceded}
                        label={lang === 'kz' ? 'Жіберілген голдар' : 'Goals conceded'}
                        avg={avgPerMatch(stats.goals_conceded)}
                    />
                    <StatCell
                        value={stats.possession_avg != null ? `${stats.possession_avg}%` : '—'}
                        label={lang === 'kz' ? 'Допты ұстау (%)' : 'Possession (%)'}
                    />
                    <StatCell
                        value={stats.pass_accuracy_avg != null ? `${stats.pass_accuracy_avg}%` : '—'}
                        label={lang === 'kz' ? 'Пас дәлдігі (%)' : 'Passing accuracy (%)'}
                    />

                    {ballsRecovered != null && (
                        <StatCell
                            value={ballsRecovered}
                            label={lang === 'kz' ? 'Доп қайтару' : 'Balls recovered'}
                            avg={avgPerMatch(ballsRecovered)}
                        />
                    )}
                    {tacklesWon != null && (
                        <StatCell
                            value={tacklesWon}
                            label={lang === 'kz' ? 'Таклдар' : 'Tackles won'}
                            avg={avgPerMatch(tacklesWon)}
                        />
                    )}
                    <StatCell
                        value={stats.clean_sheets ?? 0}
                        label={lang === 'kz' ? 'Құрғақ ойындар' : 'Clean sheets'}
                        avg={avgPerMatch(stats.clean_sheets)}
                    />
                    {saves != null && (
                        <StatCell
                            value={saves}
                            label={lang === 'kz' ? 'Сейвтер' : 'Saves'}
                            avg={avgPerMatch(saves)}
                        />
                    )}

                    {distanceCovered != null && (
                        <StatCell
                            value={distanceCovered}
                            label={lang === 'kz' ? 'Жүрілген қашықтық (км)' : 'Distance covered (km)'}
                            avg={avgPerMatch(distanceCovered)}
                        />
                    )}
                    <StatCell
                        value={stats.yellow_cards ?? 0}
                        label={lang === 'kz' ? 'Сары карталар' : 'Yellow cards'}
                        avg={avgPerMatch(stats.yellow_cards)}
                        icon={<span className="w-3 h-4 bg-yellow-400 rounded-sm inline-block" />}
                    />
                    <StatCell
                        value={stats.red_cards ?? 0}
                        label={lang === 'kz' ? 'Қызыл карталар' : 'Red cards'}
                        icon={<span className="w-3 h-4 bg-red-500 rounded-sm inline-block" />}
                    />
                </div>
            </div>

            {/* See all stats button */}
            <div className="mt-6">
                <Link
                    href="/stats"
                    className="inline-block border border-gray-200 rounded-full px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {lang === 'kz' ? 'Барлық статистиканы көру' : 'See all stats'}
                </Link>
            </div>
        </div>
    );
}
