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
    const { i18n } = useTranslation();
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';
    const { currentTournament, currentSeason } = useTournament();
    const { standings: allStandings, loading } = useLeagueTable({});

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
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-100 rounded w-48" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-12 bg-gray-50 rounded" />
                    ))}
                </div>
            </div>
        );
    }

    if (!standings.length) return null;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Link href="/stats" className="text-lg font-black text-gray-900 uppercase underline underline-offset-4 hover:text-primary transition-colors">
                    {(currentTournament.name as Record<string, string>)[lang] || currentTournament.name.short} — {currentSeason.year}
                </Link>
                <ArrowRight className="w-4 h-4 text-gray-900" />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-xs text-gray-400 font-medium border-b border-gray-100">
                            <th className="text-left py-3 w-12">POS</th>
                            <th className="text-left py-3">{lang === 'kz' ? 'КЛУБ' : 'CLUB'}</th>
                            <th className="text-center py-3 w-16">{lang === 'kz' ? 'О' : 'PLAYED'}</th>
                            <th className="text-center py-3 w-14">{lang === 'kz' ? 'Ж' : 'WON'}</th>
                            <th className="text-center py-3 w-14">{lang === 'kz' ? 'Т' : 'DRAWN'}</th>
                            <th className="text-center py-3 w-14">{lang === 'kz' ? 'Ж' : 'LOST'}</th>
                            <th className="text-center py-3 w-14">GF</th>
                            <th className="text-center py-3 w-14">GA</th>
                            <th className="text-center py-3 w-14">GD</th>
                            <th className="text-center py-3 w-16 font-bold">{lang === 'kz' ? 'ҰПАЙ' : 'POINTS'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((team) => {
                            const isCurrentTeam = team.team_id === teamId;
                            return (
                                <tr
                                    key={team.team_id}
                                    className={cn(
                                        'border-b border-gray-50 transition-colors',
                                        isCurrentTeam
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-gray-50'
                                    )}
                                >
                                    <td className={cn('py-4 font-bold', isCurrentTeam ? 'text-white' : 'text-gray-900')}>
                                        {team.position}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            {team.team_logo && (
                                                <img src={team.team_logo} alt="" className="w-6 h-6 object-contain" />
                                            )}
                                            <span className={cn('font-bold', isCurrentTeam ? 'text-white' : 'text-gray-900')}>
                                                {team.team_name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={cn('text-center py-4', isCurrentTeam ? 'text-white/80' : 'text-gray-500')}>
                                        {team.games_played}
                                    </td>
                                    <td className={cn('text-center py-4', isCurrentTeam ? 'text-white/80' : 'text-gray-500')}>
                                        {team.wins}
                                    </td>
                                    <td className={cn('text-center py-4', isCurrentTeam ? 'text-white/80' : 'text-gray-500')}>
                                        {team.draws}
                                    </td>
                                    <td className={cn('text-center py-4', isCurrentTeam ? 'text-white/80' : 'text-gray-500')}>
                                        {team.losses}
                                    </td>
                                    <td className={cn('text-center py-4', isCurrentTeam ? 'text-white/80' : 'text-gray-500')}>
                                        {team.goals_scored}
                                    </td>
                                    <td className={cn('text-center py-4', isCurrentTeam ? 'text-white/80' : 'text-gray-500')}>
                                        {team.goals_conceded}
                                    </td>
                                    <td className={cn('text-center py-4', isCurrentTeam ? 'text-white' : 'text-gray-500')}>
                                        {team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}
                                    </td>
                                    <td className={cn('text-center py-4 font-black', isCurrentTeam ? 'text-white' : 'text-gray-900')}>
                                        {team.points}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
