'use client';

import { useTranslation } from 'react-i18next';
import { usePlayerStats } from '@/hooks/usePlayerStats';
import { PlayerStat } from '@/types/playerStats';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TeamPlayerStatsProps {
    teamId: number;
}

// Featured player card (left side of goals/assists section)
function FeaturedPlayerCard({
    player,
    statLabel,
    statValue,
    extraStats,
}: {
    player: PlayerStat;
    statLabel: string;
    statValue: number | null;
    extraStats: { label: string; value: string | number }[];
}) {
    return (
        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[320px]">
            {/* Team logo watermark */}
            <div className="absolute top-4 right-4 opacity-10">
                <img src={player.team_logo} alt="" className="w-20 h-20" />
            </div>

            <div className="relative z-10">
                <span className="text-gray-400 text-xs font-medium block">
                    {player.position || player.top_role || ''}
                </span>
                <span className="text-sm text-gray-500 block">{player.first_name}</span>
                <h3 className="text-2xl font-black text-gray-900">{player.last_name}</h3>
            </div>

            <div className="relative z-10">
                <div className="text-sm text-gray-500">{statLabel}</div>
                <div className="text-4xl font-black text-gray-900">{statValue ?? 0}</div>
            </div>

            <div className="relative z-10 flex gap-4 mt-2">
                {extraStats.map((stat) => (
                    <div key={stat.label} className="text-center">
                        <div className="text-lg font-black text-gray-900">{stat.value}</div>
                        <div className="text-[10px] text-gray-400 uppercase">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Player photo placeholder */}
            {player.photo_url && (
                <div className="absolute bottom-0 right-0 w-[45%] h-[80%]">
                    <img
                        src={player.photo_url}
                        alt={`${player.first_name} ${player.last_name}`}
                        className="w-full h-full object-contain object-bottom"
                    />
                </div>
            )}
        </div>
    );
}

// Leaderboard table (right side)
function LeaderboardTable({
    players,
    statKey,
}: {
    players: PlayerStat[];
    statKey: 'goals' | 'assists';
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-xs text-gray-400 border-b border-gray-100">
                        <th className="text-left py-3 px-4 font-medium">#</th>
                        <th className="text-left py-3 font-medium">PLAYER</th>
                        <th className="text-right py-3 px-4 font-medium">TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {players.slice(0, 8).map((player, idx) => (
                        <tr key={player.player_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-gray-400 font-medium">{idx + 1}</td>
                            <td className="py-3">
                                <Link href={`/player/${player.player_id}`} className="flex items-center gap-3 group">
                                    {player.photo_url ? (
                                        <img src={player.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                                            {player.first_name[0]}{player.last_name[0]}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                                            {player.first_name} {player.last_name}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                            {player.team_logo && (
                                                <img src={player.team_logo} alt="" className="w-3 h-3 object-contain" />
                                            )}
                                            {player.team_name}
                                        </div>
                                    </div>
                                </Link>
                            </td>
                            <td className="py-3 px-4 text-right font-black text-gray-900">
                                {statKey === 'goals' ? (player.goals ?? 0) : (player.assists ?? 0)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="p-4 text-center border-t border-gray-100">
                <Link
                    href="/stats/players"
                    className="text-xs font-bold text-gray-900 uppercase hover:text-primary transition-colors flex items-center justify-center gap-1"
                >
                    VIEW FULL TABLE <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}

// Mini stat card (bottom row)
function MiniStatCard({
    label,
    player,
    value,
}: {
    label: string;
    player: PlayerStat | null;
    value: string | number;
}) {
    if (!player) return null;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col">
            <h4 className="text-xs font-black text-gray-900 uppercase mb-3">{label}</h4>
            <div className="flex items-center gap-3 flex-1">
                {player.photo_url ? (
                    <img src={player.photo_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        {player.team_logo && (
                            <img src={player.team_logo} alt="" className="w-6 h-6 object-contain" />
                        )}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-gray-400">{player.first_name}</div>
                    <div className="text-sm font-black text-gray-900 truncate">{player.last_name}</div>
                </div>
                <div className="text-right flex items-center gap-1">
                    <span className="text-lg font-black text-gray-900">{value}</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                </div>
            </div>
        </div>
    );
}

export function TeamPlayerStats({ teamId }: TeamPlayerStatsProps) {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'kz' ? 'kz' : 'ru';

    const { players: goalScorers, loading: goalsLoading } = usePlayerStats({ sortBy: 'goals', limit: 20 });
    const { players: assistLeaders, loading: assistsLoading } = usePlayerStats({ sortBy: 'assists', limit: 20 });

    // Filter by team
    const teamGoalScorers = goalScorers.filter(p => p.team_id === teamId);
    const teamAssistLeaders = assistLeaders.filter(p => p.team_id === teamId);

    // For mini cards, derive from goal scorers data (sorted differently)
    const allPlayers = goalScorers.filter(p => p.team_id === teamId);
    const topPasser = [...allPlayers].sort((a, b) => b.passes - a.passes)[0] ?? null;
    const topAppearances = [...allPlayers].sort((a, b) => b.games_played - a.games_played)[0] ?? null;
    const topSaves = [...allPlayers].sort((a, b) => (b.save_shot ?? 0) - (a.save_shot ?? 0))[0] ?? null;
    const topCleanSheets = [...allPlayers].sort((a, b) => (b.dry_match ?? 0) - (a.dry_match ?? 0))[0] ?? null;
    const topRedCards = [...allPlayers].sort((a, b) => b.red_cards - a.red_cards)[0] ?? null;

    if (goalsLoading || assistsLoading) {
        return (
            <div className="space-y-8">
                <div className="animate-pulse h-8 bg-gray-100 rounded w-64" />
                <div className="grid grid-cols-2 gap-6">
                    <div className="animate-pulse h-[320px] bg-gray-50 rounded-2xl" />
                    <div className="animate-pulse h-[320px] bg-gray-50 rounded-2xl" />
                </div>
            </div>
        );
    }

    const topScorer = teamGoalScorers[0];
    const topAssister = teamAssistLeaders[0];

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-black text-gray-900 uppercase">
                {lang === 'kz' ? 'ОЙЫНШЫЛАР СТАТИСТИКАСЫ' : 'СТАТИСТИКА ИГРОКОВ'}
            </h2>

            {/* Goals & Assists sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Goals */}
                <div>
                    <h3 className="text-lg font-black text-gray-900 uppercase mb-4">
                        {lang === 'kz' ? 'ГОЛДАР' : 'ГОЛЫ'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topScorer && (
                            <FeaturedPlayerCard
                                player={topScorer}
                                statLabel={lang === 'kz' ? 'Голдар' : 'Goals'}
                                statValue={topScorer.goals}
                                extraStats={[
                                    { label: lang === 'kz' ? 'Соққылар' : 'Shots', value: topScorer.shots ?? 0 },
                                ]}
                            />
                        )}
                        <LeaderboardTable players={teamGoalScorers} statKey="goals" />
                    </div>
                </div>

                {/* Assists */}
                <div>
                    <h3 className="text-lg font-black text-gray-900 uppercase mb-4">
                        {lang === 'kz' ? 'ГОЛДЫҚ ПАСТАР' : 'АССИСТЫ'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topAssister && (
                            <FeaturedPlayerCard
                                player={topAssister}
                                statLabel={lang === 'kz' ? 'Голдық пастар' : 'Assists'}
                                statValue={topAssister.assists}
                                extraStats={[
                                    { label: lang === 'kz' ? 'Пас дәлдігі' : 'Pass Acc.', value: `${topAssister.pass_accuracy}%` },
                                ]}
                            />
                        )}
                        <LeaderboardTable players={teamAssistLeaders} statKey="assists" />
                    </div>
                </div>
            </div>

            {/* Mini stat cards row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <MiniStatCard label={lang === 'kz' ? 'ПАСТАР' : 'PASSES'} player={topPasser} value={topPasser?.passes ?? 0} />
                <MiniStatCard label={lang === 'kz' ? 'ОЙЫНДАР' : 'APPEARANCES'} player={topAppearances} value={topAppearances?.games_played ?? 0} />
                <MiniStatCard label={lang === 'kz' ? 'СЕЙВТЕР' : 'SAVES'} player={topSaves} value={topSaves?.save_shot ?? 0} />
                <MiniStatCard label={lang === 'kz' ? 'ҚҰРҒАҚ ОЙЫНДАР' : 'CLEAN SHEETS'} player={topCleanSheets} value={topCleanSheets?.dry_match ?? 0} />
                <MiniStatCard label={lang === 'kz' ? 'ҚЫЗЫЛ КАРТА' : 'RED CARDS'} player={topRedCards} value={topRedCards?.red_cards ?? 0} />
            </div>
        </div>
    );
}
