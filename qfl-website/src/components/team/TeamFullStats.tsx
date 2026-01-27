'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTeamStats } from '@/hooks/useTeam';
import { useTournament } from '@/contexts/TournamentContext';
import { TeamStats } from '@/types/team';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface TeamFullStatsProps {
    teamId: number;
}

/* ─── Shared components ─── */

function StatDonut({
    value,
    label,
    max,
    color = '#1E4D8C',
    size = 100,
}: {
    value: number;
    label: string;
    max?: number;
    color?: string;
    size?: number;
}) {
    const radius = (size - 16) / 2;
    const circumference = 2 * Math.PI * radius;
    const pct = max ? Math.min(value / max, 1) : 1;
    const filled = pct * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none" stroke="#F3F4F6" strokeWidth="8"
                    />
                    {pct > 0 && (
                        <circle
                            cx={size / 2} cy={size / 2} r={radius}
                            fill="none" stroke={color} strokeWidth="8"
                            strokeDasharray={`${filled} ${circumference - filled}`}
                            strokeLinecap="round"
                        />
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-gray-900">{value}</span>
                </div>
            </div>
            <span className="text-[10px] text-gray-400 font-medium text-center mt-1">{label}</span>
        </div>
    );
}

function MatchesDonut({ played, won, drawn, lost }: { played: number; won: number; drawn: number; lost: number }) {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const total = won + drawn + lost || 1;
    const wonLen = (won / total) * circumference;
    const drawnLen = (drawn / total) * circumference;
    const lostLen = (lost / total) * circumference;

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-[100px] h-[100px] flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="8" />
                    {won > 0 && (
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1E4D8C" strokeWidth="8"
                            strokeDasharray={`${wonLen} ${circumference - wonLen}`} strokeDashoffset={0} strokeLinecap="round" />
                    )}
                    {drawn > 0 && (
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="#67E8F9" strokeWidth="8"
                            strokeDasharray={`${drawnLen} ${circumference - drawnLen}`} strokeDashoffset={-wonLen} strokeLinecap="round" />
                    )}
                    {lost > 0 && (
                        <circle cx="50" cy="50" r={radius} fill="none" stroke="#F87171" strokeWidth="8"
                            strokeDasharray={`${lostLen} ${circumference - lostLen}`} strokeDashoffset={-(wonLen + drawnLen)} strokeLinecap="round" />
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-gray-900">{played}</span>
                    <span className="text-[9px] text-gray-400">Matches<br className="hidden" /> played</span>
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                    <span className="text-base font-black text-gray-900">{won}</span>
                    <span className="w-2 h-2 rounded-full bg-[#1E4D8C]" />
                    <span className="text-xs text-gray-500">Won</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-base font-black text-gray-900">{drawn}</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-300" />
                    <span className="text-xs text-gray-500">Drawn</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-base font-black text-gray-900">{lost}</span>
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs text-gray-500">Lost</span>
                </div>
            </div>
        </div>
    );
}

function StatCell({ value, label, avg, icon }: { value: string | number; label: string; avg?: string; icon?: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
                {icon}
                <span className="text-xl font-black text-gray-900">{value}</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">{label}</span>
            {avg && <span className="text-[10px] text-gray-400">{avg}</span>}
        </div>
    );
}

function StatsSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between mb-0"
            >
                <h3 className="text-lg font-black text-gray-900">{title}</h3>
                <ChevronUp className={cn('w-5 h-5 text-gray-400 transition-transform', !open && 'rotate-180')} />
            </button>
            {open && <div className="mt-5">{children}</div>}
        </div>
    );
}

/* ─── Sections ─── */

function KeyStatsSection({ s, gp }: { s: TeamStats; gp: number }) {
    const avg = (v?: number) => v != null ? `${(v / gp).toFixed(2)} avg. per match` : undefined;

    return (
        <StatsSection title="Key stats">
            <div className="flex flex-col lg:flex-row gap-8">
                <MatchesDonut played={s.games_played} won={s.wins} drawn={s.draws} lost={s.losses} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5 flex-1">
                    <StatCell value={s.goals_scored} label="Goals" avg={avg(s.goals_scored)} />
                    <StatCell value={s.goals_conceded} label="Goals conceded" avg={avg(s.goals_conceded)} />
                    <StatCell value={s.possession_avg != null ? `${s.possession_avg}%` : '—'} label="Possession (%)" />
                    <StatCell value={s.pass_accuracy_avg != null ? `${s.pass_accuracy_avg}%` : '—'} label="Passing accuracy (%)" />
                    <StatCell value={s.recovery ?? '—'} label="Balls recovered" avg={avg(s.recovery)} />
                    <StatCell value={s.tackle ?? '—'} label="Tackles won" avg={avg(s.tackle)} />
                    <StatCell value={s.clean_sheets ?? 0} label="Clean sheets" avg={avg(s.clean_sheets)} />
                    <StatCell
                        value={s.yellow_cards ?? 0} label="Yellow cards" avg={avg(s.yellow_cards)}
                        icon={<span className="w-3 h-4 bg-yellow-400 rounded-sm inline-block" />}
                    />
                    <StatCell
                        value={s.red_cards ?? 0} label="Red cards"
                        icon={<span className="w-3 h-4 bg-red-500 rounded-sm inline-block" />}
                    />
                </div>
            </div>
        </StatsSection>
    );
}

function AttackingSection({ s, gp }: { s: TeamStats; gp: number }) {
    const avg = (v?: number) => v != null ? `${(v / gp).toFixed(2)} avg. per match` : undefined;
    const shotsOnTarget = s.shots_on_goal ?? 0;
    const shotsOff = s.shots_off_goal ?? 0;
    const totalShots = shotsOnTarget + shotsOff;

    return (
        <StatsSection title="Attacking">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex gap-6 flex-shrink-0">
                    <StatDonut value={s.goals_scored} label="Goals" max={s.goals_scored + (s.goals_conceded || 0)} />
                    <div className="flex flex-col items-center">
                        <StatDonut value={totalShots} label="Total attempts" max={totalShots * 1.2 || 100} />
                        <div className="flex flex-col gap-1 mt-2 text-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-900">{shotsOnTarget}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1E4D8C]" />
                                <span className="text-gray-500">On target</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-900">{shotsOff}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                <span className="text-gray-500">Off target</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5 flex-1">
                    <StatCell value={s.goal_pass ?? '—'} label="Assists" />
                    <StatCell value={s.shots ?? '—'} label="Shots" avg={avg(s.shots)} />
                    <StatCell value={s.key_pass ?? '—'} label="Key passes" avg={s.key_pass_per_match != null ? `${s.key_pass_per_match} per match` : undefined} />
                    <StatCell value={s.penalty ?? '—'} label="Penalties scored" />
                    <StatCell value={s.corners ?? '—'} label="Corners" avg={s.corner_per_match != null ? `${s.corner_per_match} per match` : undefined} />
                    <StatCell value={s.offsides ?? '—'} label="Offsides" />
                    <StatCell value={s.dribble ?? '—'} label="Dribbles" avg={s.dribble_ratio != null ? `${s.dribble_ratio}% success` : undefined} />
                    <StatCell value={s.xg != null ? s.xg.toFixed(2) : '—'} label="xG" avg={s.xg_per_match != null ? `${s.xg_per_match} per match` : undefined} />
                </div>
            </div>
        </StatsSection>
    );
}

function DistributionSection({ s, gp }: { s: TeamStats; gp: number }) {
    return (
        <StatsSection title="Distribution">
            <div className="flex flex-col lg:flex-row gap-8">
                <StatDonut
                    value={s.pass_accuracy_avg != null ? Math.round(s.pass_accuracy_avg) : 0}
                    label="Passing accuracy (%)"
                    max={100}
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5 flex-1">
                    <StatCell value={s.possession_avg != null ? `${s.possession_avg}%` : '—'} label="Possession (%)" />
                    <StatCell value={s.passes ?? '—'} label="Passes" avg={s.pass_per_match != null ? `${s.pass_per_match} per match` : undefined} />
                    <StatCell value={s.pass_forward ?? '—'} label="Forward passes" />
                    <StatCell value={s.pass_long ?? '—'} label="Long passes" avg={s.pass_long_ratio != null ? `${s.pass_long_ratio}% accuracy` : undefined} />
                    <StatCell value={s.pass_progressive ?? '—'} label="Progressive passes" />
                    <StatCell value={s.pass_cross ?? '—'} label="Crosses" avg={s.pass_cross_ratio != null ? `${s.pass_cross_ratio}% accuracy` : undefined} />
                    <StatCell value={s.pass_to_box ?? '—'} label="Passes to box" />
                    <StatCell value={s.pass_to_3rd ?? '—'} label="Passes to final third" />
                    <StatCell value={s.key_pass ?? '—'} label="Key passes" avg={s.key_pass_per_match != null ? `${s.key_pass_per_match} per match` : undefined} />
                </div>
            </div>
        </StatsSection>
    );
}

function DefendingSection({ s, gp }: { s: TeamStats; gp: number }) {
    return (
        <StatsSection title="Defending">
            <div className="flex flex-col lg:flex-row gap-8">
                <StatDonut
                    value={s.tackle ?? 0}
                    label="Tackles"
                    max={(s.tackle ?? 0) * 1.3 || 100}
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5 flex-1">
                    <StatCell value={s.recovery ?? '—'} label="Recoveries" avg={s.recovery_per_match != null ? `${s.recovery_per_match} per match` : undefined} />
                    <StatCell value={s.interception ?? '—'} label="Interceptions" avg={s.interception_per_match != null ? `${s.interception_per_match} per match` : undefined} />
                    <StatCell value={s.duel ?? '—'} label="Duels" avg={s.duel_ratio != null ? `${s.duel_ratio}% won` : undefined} />
                    <StatCell value={s.aerial_duel_offence ?? '—'} label="Aerial duels" avg={s.aerial_duel_offence_ratio != null ? `${s.aerial_duel_offence_ratio}% won` : undefined} />
                    <StatCell value={s.ground_duel_offence ?? '—'} label="Ground duels" avg={s.ground_duel_offence_ratio != null ? `${s.ground_duel_offence_ratio}% won` : undefined} />
                    <StatCell value={s.clean_sheets ?? 0} label="Clean sheets" />
                    <StatCell value={s.goals_conceded} label="Goals conceded" />
                    <StatCell value={s.opponent_xg != null ? s.opponent_xg.toFixed(2) : '—'} label="Opponent xG" />
                </div>
            </div>
        </StatsSection>
    );
}

function DisciplinarySection({ s }: { s: TeamStats }) {
    return (
        <StatsSection title="Disciplinary">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5">
                <StatCell
                    value={s.yellow_cards ?? 0} label="Yellow cards"
                    icon={<span className="w-3 h-4 bg-yellow-400 rounded-sm inline-block" />}
                />
                <StatCell
                    value={s.red_cards ?? 0} label="Red cards"
                    icon={<span className="w-3 h-4 bg-red-500 rounded-sm inline-block" />}
                />
                <StatCell value={s.fouls ?? '—'} label="Fouls committed" />
                <StatCell value={s.foul_taken ?? '—'} label="Fouls suffered" />
                <StatCell value={s.second_yellow_cards ?? 0} label="Second yellow cards" />
            </div>
        </StatsSection>
    );
}

/* ─── Main Component ─── */

export function TeamFullStats({ teamId }: TeamFullStatsProps) {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';
    const { currentSeason } = useTournament();
    const { stats, loading } = useTeamStats(teamId, currentSeason.id);

    if (loading) {
        return (
            <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-8">
                        <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-100 rounded w-48" />
                            <div className="grid grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, j) => (
                                    <div key={j} className="h-16 bg-gray-50 rounded" />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-gray-400">
                    {lang === 'kz' ? 'Статистика жоқ' : 'Нет статистики'}
                </p>
            </div>
        );
    }

    const gp = stats.games_played || 1;

    return (
        <div className="space-y-6">
            <KeyStatsSection s={stats} gp={gp} />
            <AttackingSection s={stats} gp={gp} />
            <DistributionSection s={stats} gp={gp} />
            <DefendingSection s={stats} gp={gp} />
            <DisciplinarySection s={stats} />
        </div>
    );
}
