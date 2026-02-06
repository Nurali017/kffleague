'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeagueTable } from '@/hooks/useLeagueTable';
import { useTournament } from '@/contexts/TournamentContext';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface TeamLeagueTableProps {
    teamId: number;
}

export function TeamLeagueTable({ teamId }: TeamLeagueTableProps) {
    const { t: tTable, i18n } = useTranslation('table');
    const { t: tCommon } = useTranslation('common');
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';
    const { currentTournament, currentSeason, effectiveSeasonId } = useTournament();
    const { standings: allStandings, loading } = useLeagueTable({
        seasonId: effectiveSeasonId
    });

    // Show current team + 3 nearest (4 total)
    const standings = useMemo(() => {
        if (!allStandings.length) return [];
        const idx = allStandings.findIndex((s) => s.team_id === teamId);
        if (idx === -1) return allStandings.slice(0, 4);
        const start = Math.max(0, idx - 1);
        const end = Math.min(allStandings.length, start + 4);
        return allStandings.slice(Math.max(0, end - 4), end);
    }, [allStandings, teamId]);

    if (loading) {
        return (
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-[0_20px_40px_rgba(3,10,25,0.5)] p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-48" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-12 bg-gray-100 dark:bg-white/5 rounded" />
                    ))}
                </div>
            </div>
        );
    }

    if (!standings.length) return null;

    return (
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-[0_20px_40px_rgba(3,10,25,0.5)] p-4 md:p-6">
            <div className="flex items-center gap-2 mb-6">
                <Link href="/stats" className="text-xs font-bold text-slate-500 dark:text-white/60 uppercase tracking-wider hover:text-[#1E4D8C] dark:hover:text-cyan-300 transition-colors">
                    {(currentTournament.name as Record<string, string>)[lang] || currentTournament.name.short} — {currentSeason.year}
                </Link>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-white" />
            </div>

            <div className="relative">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-sm">
                    <thead>
                        <tr className="text-xs text-slate-500 dark:text-white/70 font-medium border-b border-gray-200 dark:border-white/10">
                            <th className="text-left py-3 w-12 font-semibold text-slate-500 dark:text-white/60">
                                {tCommon('table.position', '#')}
                            </th>
                            <th className="text-left py-3 font-semibold text-slate-500 dark:text-white/60">
                                {tTable('columns.team', 'Команда')}
                            </th>
                            <th
                                className="text-center py-3 w-14 font-semibold text-slate-500 dark:text-white/60"
                                title={tTable('columns.played', 'И')}
                            >
                                {tTable('columns.playedShort', 'И')}
                            </th>
                            <th
                                className="text-center py-3 w-12 font-semibold text-slate-500 dark:text-white/60"
                                title={tTable('legend.win', 'Победа')}
                            >
                                {tTable('columns.wins', 'В')}
                            </th>
                            <th
                                className="text-center py-3 w-12 font-semibold text-slate-500 dark:text-white/60"
                                title={tTable('legend.draw', 'Ничья')}
                            >
                                {tTable('columns.draws', 'Н')}
                            </th>
                            <th
                                className="text-center py-3 w-12 font-semibold text-slate-500 dark:text-white/60"
                                title={tTable('legend.loss', 'Поражение')}
                            >
                                {tTable('columns.losses', 'П')}
                            </th>
                            <th className="text-center py-3 w-12 font-semibold text-slate-500 dark:text-white/60" title={tTable('columns.goalsFor', 'ЗМ')}>
                                {tTable('columns.goalsFor', 'ЗМ')}
                            </th>
                            <th className="text-center py-3 w-12 font-semibold text-slate-500 dark:text-white/60" title={tTable('columns.goalsAgainst', 'ПМ')}>
                                {tTable('columns.goalsAgainst', 'ПМ')}
                            </th>
                            <th className="text-center py-3 w-12 font-semibold text-slate-500 dark:text-white/60" title={tTable('columns.goalDiffShort', 'РМ')}>
                                {tTable('columns.goalDiffShort', 'РМ')}
                            </th>
                            <th
                                className="text-center py-3 w-14 font-bold text-slate-900 dark:text-white"
                                title={tTable('columns.points', 'О')}
                            >
                                {tTable('columns.pointsShort', 'О')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((team) => {
                            const isCurrentTeam = team.team_id === teamId;
                            return (
                                <tr
                                    key={team.team_id}
                                    className={cn(
                                        'border-b border-gray-100 dark:border-white/10 last:border-0 transition-colors',
                                        isCurrentTeam
                                            ? 'bg-[#1E4D8C]/5 dark:bg-cyan-300/15'
                                            : 'hover:bg-gray-50 dark:hover:bg-white/5'
                                    )}
                                >
                                    <td className={cn('py-4 font-bold', isCurrentTeam ? 'text-[#1E4D8C] dark:text-cyan-300' : 'text-slate-900 dark:text-white')}>
                                        {team.position}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            {team.team_logo && (
                                                <img src={team.team_logo} alt="" className="w-6 h-6 object-contain" />
                                            )}
                                            <span className={cn('font-bold', isCurrentTeam ? 'text-[#1E4D8C] dark:text-cyan-300' : 'text-slate-900 dark:text-white')}>
                                                {team.team_name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={cn('text-center py-4', isCurrentTeam ? 'text-[#1E4D8C]/70 dark:text-cyan-300/80' : 'text-slate-500 dark:text-white/60')}>
                                        {team.games_played}
                                    </td>
                                    <td className={cn('text-center py-4', isCurrentTeam ? 'text-[#1E4D8C]/70 dark:text-cyan-300/80' : 'text-slate-500 dark:text-white/60')}>
                                        {team.wins}
                                    </td>
                                    <td className={cn('text-center py-4', isCurrentTeam ? 'text-[#1E4D8C]/70 dark:text-cyan-300/80' : 'text-slate-500 dark:text-white/60')}>
                                        {team.draws}
                                    </td>
                                    <td className={cn('text-center py-4', isCurrentTeam ? 'text-[#1E4D8C]/70 dark:text-cyan-300/80' : 'text-slate-500 dark:text-white/60')}>
                                        {team.losses}
                                    </td>
                                    <td className={cn('text-center py-4', isCurrentTeam ? 'text-[#1E4D8C]/70 dark:text-cyan-300/80' : 'text-slate-500 dark:text-white/60')}>
                                        {team.goals_scored}
                                    </td>
                                    <td className={cn('text-center py-4', isCurrentTeam ? 'text-[#1E4D8C]/70 dark:text-cyan-300/80' : 'text-slate-500 dark:text-white/60')}>
                                        {team.goals_conceded}
                                    </td>
                                    <td className={cn('text-center py-4', isCurrentTeam ? 'text-[#1E4D8C] dark:text-cyan-300' : 'text-slate-500 dark:text-white/60')}>
                                        {team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}
                                    </td>
                                    <td className={cn('text-center py-4 font-black', isCurrentTeam ? 'text-[#1E4D8C] dark:text-cyan-300' : 'text-slate-900 dark:text-white')}>
                                        {team.points}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    </table>
                </div>

                {/* Scroll indicator gradient - visible on mobile */}
                <div className="absolute right-0 top-0 bottom-0 w-5 md:w-8 bg-gradient-to-l from-white dark:from-dark-surface to-transparent pointer-events-none md:hidden" />
            </div>
        </div>
    );
}
