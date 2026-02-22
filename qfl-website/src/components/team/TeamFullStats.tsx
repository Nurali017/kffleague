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

/* --- Shared components --- */

function StatDonut({
    value,
    label,
    max,
    colorClass = 'stroke-cyan-300',
    size = 100,
}: {
    value: number;
    label: string;
    max?: number;
    colorClass?: string;
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
                        fill="none" className="stroke-gray-300 dark:stroke-white/20" strokeWidth="8"
                    />
                    {pct > 0 && (
                        <circle
                            cx={size / 2} cy={size / 2} r={radius}
                            fill="none" className={colorClass} strokeWidth="8"
                            strokeDasharray={`${filled} ${circumference - filled}`}
                            strokeLinecap="round"
                        />
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-slate-900 dark:text-white">{value}</span>
                </div>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-white/70 font-medium text-center mt-1">{label}</span>
        </div>
    );
}

function MatchesDonut({ played, won, drawn, lost }: { played: number; won: number; drawn: number; lost: number }) {
    const { t: tTeam } = useTranslation('team');
    const { t: tStats } = useTranslation('statistics');
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
                    <circle cx="50" cy="50" r={radius} fill="none" className="stroke-gray-300 dark:stroke-white/20" strokeWidth="8" />
                    {won > 0 && (
                        <circle cx="50" cy="50" r={radius} fill="none" className="stroke-primary" strokeWidth="8"
                            strokeDasharray={`${wonLen} ${circumference - wonLen}`} strokeDashoffset={0} strokeLinecap="round" />
                    )}
                    {drawn > 0 && (
                        <circle cx="50" cy="50" r={radius} fill="none" className="stroke-cyan-300" strokeWidth="8"
                            strokeDasharray={`${drawnLen} ${circumference - drawnLen}`} strokeDashoffset={-wonLen} strokeLinecap="round" />
                    )}
                    {lost > 0 && (
                        <circle cx="50" cy="50" r={radius} fill="none" className="stroke-red-400" strokeWidth="8"
                            strokeDasharray={`${lostLen} ${circumference - lostLen}`} strokeDashoffset={-(wonLen + drawnLen)} strokeLinecap="round" />
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{played}</span>
                    <span className="text-[9px] text-slate-500 dark:text-white/60 text-center leading-tight max-w-[84px]">
                        {tStats('labels.matchesPlayed', 'Сыграно матчей')}
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900 dark:text-white">{won}</span>
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs text-slate-500 dark:text-white/70">{tTeam('stats.wins', 'Победы')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900 dark:text-white">{drawn}</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-300" />
                    <span className="text-xs text-slate-500 dark:text-white/70">{tTeam('stats.draws', 'Ничьи')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900 dark:text-white">{lost}</span>
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs text-slate-500 dark:text-white/70">{tTeam('stats.losses', 'Поражения')}</span>
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
                <span className="text-xl font-black text-slate-900 dark:text-white">{value}</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-white/70 font-medium">{label}</span>
            {avg && <span className="text-[10px] text-slate-400 dark:text-white/50">{avg}</span>}
        </div>
    );
}

function StatsSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-[0_20px_40px_rgba(3,10,25,0.5)] p-5 md:p-6">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-white/5 p-2 -m-2 rounded-lg transition-colors"
            >
                <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-cyan-300 transition-colors">{title}</h3>
                <ChevronUp className={cn('w-5 h-5 text-slate-400 dark:text-white/50 transition-transform group-hover:text-primary dark:group-hover:text-cyan-300', !open && 'rotate-180')} />
            </button>
            {open && <div className="mt-4 md:mt-5">{children}</div>}
        </div>
    );
}

/* --- Sections --- */

function KeyStatsSection({ s, gp }: { s: TeamStats; gp: number }) {
    const { t: tStats } = useTranslation('statistics');
    const { t: tCommon } = useTranslation('common');

    const avg = (v?: number) =>
        v != null ? `${tCommon('seasonStatLabels.avgPerMatch', 'В среднем за матч')}: ${(v / gp).toFixed(2)}` : undefined;

    return (
        <StatsSection title={tStats('subTabs.keyStats', 'Ключевая статистика')}>
            <div className="flex flex-col lg:flex-row gap-8">
                <MatchesDonut played={s.games_played} won={s.wins} drawn={s.draws} lost={s.losses} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5 flex-1">
                    <StatCell value={s.goals_scored} label={tStats('labels.goals', 'Голы')} avg={avg(s.goals_scored)} />
                    <StatCell value={s.goals_conceded} label={tStats('labels.goalsConceded', 'Пропущенные голы')} avg={avg(s.goals_conceded)} />
                    <StatCell value={s.possession_avg != null ? `${s.possession_avg}%` : '—'} label={tStats('labels.possession', 'Владение (%)')} />
                    <StatCell value={s.pass_accuracy_avg != null ? `${s.pass_accuracy_avg}%` : '—'} label={tStats('labels.passingAccuracy', 'Точность паса (%)')} />
                    <StatCell value={s.recovery ?? '—'} label={tStats('labels.ballsRecovered', 'Возвраты мяча')} avg={avg(s.recovery)} />
                    <StatCell value={s.tackle ?? '—'} label={tStats('labels.tacklesWon', 'Отборы')} avg={avg(s.tackle)} />
                    <StatCell value={s.clean_sheets ?? 0} label={tStats('labels.cleanSheets', 'Сухие матчи')} avg={avg(s.clean_sheets)} />
                    <StatCell
                        value={s.yellow_cards ?? 0} label={tStats('labels.yellowCards', 'Жёлтые карточки')} avg={avg(s.yellow_cards)}
                        icon={<span className="w-3 h-4 bg-yellow-400 rounded-sm inline-block" />}
                    />
                    <StatCell
                        value={s.red_cards ?? 0} label={tStats('labels.redCards', 'Красные карточки')}
                        icon={<span className="w-3 h-4 bg-red-500 rounded-sm inline-block" />}
                    />
                </div>
            </div>
        </StatsSection>
    );
}

function AttackingSection({ s, gp }: { s: TeamStats; gp: number }) {
    const { t: tStats } = useTranslation('statistics');
    const { t: tCommon } = useTranslation('common');

    const avg = (v?: number) =>
        v != null ? `${tCommon('seasonStatLabels.avgPerMatch', 'В среднем за матч')}: ${(v / gp).toFixed(2)}` : undefined;
    const shotsOnTarget = s.shots_on_goal ?? 0;
    const shotsOff = s.shots_off_goal ?? 0;
    const totalShots = shotsOnTarget + shotsOff;

    return (
        <StatsSection title={tStats('subTabs.attacking', 'Атака')}>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex gap-6 flex-shrink-0">
                    <StatDonut
                        value={s.goals_scored}
                        label={tStats('labels.goals', 'Голы')}
                        max={s.goals_scored + (s.goals_conceded || 0)}
                    />
                    <div className="flex flex-col items-center">
                        <StatDonut value={totalShots} label={tStats('labels.totalAttempts', 'Всего ударов')} max={totalShots * 1.2 || 100} />
                        <div className="flex flex-col gap-1 mt-2 text-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 dark:text-white">{shotsOnTarget}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                                <span className="text-slate-500 dark:text-white/70">{tStats('labels.onTarget', 'В створ')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 dark:text-white">{shotsOff}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/30" />
                                <span className="text-slate-500 dark:text-white/70">{tStats('labels.offTarget', 'Мимо')}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5 flex-1">
                    <StatCell value={s.goal_pass ?? '—'} label={tStats('labels.assists', 'Передачи')} />
                    <StatCell value={s.shots ?? '—'} label={tStats('labels.shots', 'Удары')} avg={avg(s.shots)} />
                    <StatCell
                        value={s.key_pass ?? '—'}
                        label={tStats('labels.keyPasses', 'Ключевые передачи')}
                        avg={s.key_pass_per_match != null ? tStats('helpers.perMatch', { value: s.key_pass_per_match }) : undefined}
                    />
                    <StatCell value={s.penalty ?? '—'} label={tStats('labels.penaltiesScored', 'Забитые пенальти')} />
                    <StatCell
                        value={s.corners ?? '—'}
                        label={tStats('labels.corners', 'Угловые')}
                        avg={s.corner_per_match != null ? tStats('helpers.perMatch', { value: s.corner_per_match }) : undefined}
                    />
                    <StatCell value={s.offsides ?? '—'} label={tStats('labels.offsides', 'Офсайды')} />
                    <StatCell
                        value={s.dribble ?? '—'}
                        label={tStats('labels.dribbles', 'Обводки')}
                        avg={s.dribble_ratio != null ? tStats('helpers.successPct', { value: s.dribble_ratio }) : undefined}
                    />
                    <StatCell
                        value={s.xg != null ? s.xg.toFixed(2) : '—'}
                        label={tStats('labels.xg', 'xG')}
                        avg={s.xg_per_match != null ? tStats('helpers.perMatch', { value: s.xg_per_match }) : undefined}
                    />
                </div>
            </div>
        </StatsSection>
    );
}

function DistributionSection({ s, gp }: { s: TeamStats; gp: number }) {
    const { t: tStats } = useTranslation('statistics');

    return (
        <StatsSection title={tStats('subTabs.distribution', 'Пас')}>
            <div className="flex flex-col lg:flex-row gap-8">
                <StatDonut
                    value={s.pass_accuracy_avg != null ? Math.round(s.pass_accuracy_avg) : 0}
                    label={tStats('labels.passingAccuracy', 'Точность паса (%)')}
                    max={100}
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5 flex-1">
                    <StatCell value={s.possession_avg != null ? `${s.possession_avg}%` : '—'} label={tStats('labels.possession', 'Владение (%)')} />
                    <StatCell
                        value={s.passes ?? '—'}
                        label={tStats('labels.passes', 'Пасы')}
                        avg={s.pass_per_match != null ? tStats('helpers.perMatch', { value: s.pass_per_match }) : undefined}
                    />
                    <StatCell value={s.pass_forward ?? '—'} label={tStats('labels.forwardPasses', 'Пасы вперёд')} />
                    <StatCell
                        value={s.pass_long ?? '—'}
                        label={tStats('labels.longPasses', 'Длинные пасы')}
                        avg={s.pass_long_ratio != null ? tStats('helpers.accuracyPct', { value: s.pass_long_ratio }) : undefined}
                    />
                    <StatCell value={s.pass_progressive ?? '—'} label={tStats('labels.progressivePasses', 'Прогрессивные пасы')} />
                    <StatCell
                        value={s.pass_cross ?? '—'}
                        label={tStats('labels.crosses', 'Навесы')}
                        avg={s.pass_cross_ratio != null ? tStats('helpers.accuracyPct', { value: s.pass_cross_ratio }) : undefined}
                    />
                    <StatCell value={s.pass_to_box ?? '—'} label={tStats('labels.passesToBox', 'Пасы в штрафную')} />
                    <StatCell value={s.pass_to_3rd ?? '—'} label={tStats('labels.passesToFinalThird', 'Пасы в финальную треть')} />
                    <StatCell
                        value={s.key_pass ?? '—'}
                        label={tStats('labels.keyPasses', 'Ключевые передачи')}
                        avg={s.key_pass_per_match != null ? tStats('helpers.perMatch', { value: s.key_pass_per_match }) : undefined}
                    />
                </div>
            </div>
        </StatsSection>
    );
}

function DefendingSection({ s, gp }: { s: TeamStats; gp: number }) {
    const { t: tStats } = useTranslation('statistics');

    return (
        <StatsSection title={tStats('subTabs.defending', 'Защита')}>
            <div className="flex flex-col lg:flex-row gap-8">
                <StatDonut
                    value={s.tackle ?? 0}
                    label={tStats('labels.tackles', 'Отборы')}
                    max={(s.tackle ?? 0) * 1.3 || 100}
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5 flex-1">
                    <StatCell
                        value={s.recovery ?? '—'}
                        label={tStats('labels.recoveries', 'Подборы')}
                        avg={s.recovery_per_match != null ? tStats('helpers.perMatch', { value: s.recovery_per_match }) : undefined}
                    />
                    <StatCell
                        value={s.interception ?? '—'}
                        label={tStats('labels.interceptions', 'Перехваты')}
                        avg={s.interception_per_match != null ? tStats('helpers.perMatch', { value: s.interception_per_match }) : undefined}
                    />
                    <StatCell
                        value={s.duel ?? '—'}
                        label={tStats('labels.duels', 'Единоборства')}
                        avg={s.duel_ratio != null ? tStats('helpers.wonPct', { value: s.duel_ratio }) : undefined}
                    />
                    <StatCell
                        value={s.aerial_duel_offence ?? '—'}
                        label={tStats('labels.aerialDuels', 'Верховые единоборства')}
                        avg={s.aerial_duel_offence_ratio != null ? tStats('helpers.wonPct', { value: s.aerial_duel_offence_ratio }) : undefined}
                    />
                    <StatCell
                        value={s.ground_duel_offence ?? '—'}
                        label={tStats('labels.groundDuels', 'Низовые единоборства')}
                        avg={s.ground_duel_offence_ratio != null ? tStats('helpers.wonPct', { value: s.ground_duel_offence_ratio }) : undefined}
                    />
                    <StatCell value={s.clean_sheets ?? 0} label={tStats('labels.cleanSheets', 'Сухие матчи')} />
                    <StatCell value={s.goals_conceded} label={tStats('labels.goalsConceded', 'Пропущенные голы')} />
                    <StatCell value={s.opponent_xg != null ? s.opponent_xg.toFixed(2) : '—'} label={tStats('labels.opponentXg', 'xG соперника')} />
                </div>
            </div>
        </StatsSection>
    );
}

function DisciplinarySection({ s }: { s: TeamStats }) {
    const { t: tStats } = useTranslation('statistics');

    return (
        <StatsSection title={tStats('subTabs.disciplinary', 'Дисциплина')}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-5">
                <StatCell
                    value={s.yellow_cards ?? 0} label={tStats('labels.yellowCards', 'Жёлтые карточки')}
                    icon={<span className="w-3 h-4 bg-yellow-400 rounded-sm inline-block" />}
                />
                <StatCell
                    value={s.red_cards ?? 0} label={tStats('labels.redCards', 'Красные карточки')}
                    icon={<span className="w-3 h-4 bg-red-500 rounded-sm inline-block" />}
                />
                <StatCell value={s.fouls ?? '—'} label={tStats('labels.foulsCommitted', 'Фолы совершены')} />
                <StatCell value={s.foul_taken ?? '—'} label={tStats('labels.foulsSuffered', 'Фолы на себе')} />
                <StatCell value={s.second_yellow_cards ?? 0} label={tStats('labels.secondYellowCards', 'Вторые жёлтые')} />
            </div>
        </StatsSection>
    );
}

/* --- Main Component --- */

export function TeamFullStats({ teamId }: TeamFullStatsProps) {
    const { t: tTeam } = useTranslation('team');
    const { effectiveSeasonId } = useTournament();
    const { stats, loading } = useTeamStats(teamId, effectiveSeasonId);

    if (loading) {
        return (
            <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-white/10 p-8">
                        <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-48" />
                            <div className="grid grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, j) => (
                                    <div key={j} className="h-16 bg-gray-200 dark:bg-white/10 rounded" />
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
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-white/10 p-12 text-center">
                <p className="text-slate-500 dark:text-white/60">
                    {tTeam('no_stats', 'Статистика недоступна')}
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
