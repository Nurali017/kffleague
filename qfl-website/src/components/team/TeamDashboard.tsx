import { MOCKED_TABLE, MOCKED_TOP_SCORER } from '@/lib/mock/teams';
import { Game } from '@/types/match';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// 1. Mini League Table
export function MiniLeagueTable() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <span className="bg-primary-dark text-white text-xs font-bold px-3 py-1 rounded-full uppercase">2025</span>
                <span className="text-xs font-bold text-gray-500">Премьер-Лига</span>
            </div>

            <div className="flex-1 overflow-x-auto no-scrollbar">
                <table className="w-full text-sm placeholder-gray-500">
                    <thead className="text-gray-400 font-normal border-b border-gray-100">
                        <tr>
                            <th className="text-left py-2 font-normal w-8">№</th>
                            <th className="text-left py-2 font-normal">Team</th>
                            <th className="text-center py-2 font-normal">G</th>
                            <th className="text-right py-2 font-normal">P</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {MOCKED_TABLE.map((item) => (
                            <tr key={item.position} className="group hover:bg-gray-50 transition-colors">
                                <td className="py-3 font-semibold text-gray-400 group-hover:text-blue-600">{item.position}</td>
                                <td className="py-3 font-bold text-gray-900 flex items-center gap-2">
                                    <img src={item.team_logo} className="w-5 h-5 object-contain" alt={item.team_name} />
                                    {item.team_name}
                                </td>
                                <td className="py-3 text-center text-gray-500">{item.games}</td>
                                <td className="py-3 text-right font-black text-gray-900">{item.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-center border-t border-gray-100 pt-3">
                <Link href="#" className="text-xs font-bold text-blue-500 flex items-center justify-center gap-1 hover:underline">
                    Full table <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    )
}

// 2. Recent Matches List
export function RecentMatchesList({ matches }: { matches: Game[] }) {
    const displayMatches = matches.slice(0, 2);

    return (
        <div className="flex flex-col gap-4 h-full">
            {displayMatches.map((match) => (
                <div key={match.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-1 flex flex-col justify-center gap-2 relative overflow-hidden">

                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {new Date(match.date).toLocaleDateString()}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                            <img src={match.home_team.logo_url || ''} className="w-12 h-12 object-contain" alt={match.home_team.name} />
                            <span className="text-xs font-bold text-gray-500 leading-tight">{match.home_team.name}</span>
                        </div>

                        <div className="text-4xl font-black text-gray-900 w-1/3 text-center">
                            {match.home_score ?? '-'}
                            <span className="text-gray-300 mx-1">:</span>
                            {match.away_score ?? '-'}
                        </div>

                        <div className="flex flex-col items-center gap-2 w-1/3 text-center">
                            <img src={match.away_team.logo_url || ''} className="w-12 h-12 object-contain" alt={match.away_team.name} />
                            <span className="text-xs font-bold text-gray-500 leading-tight">{match.away_team.name}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// 3. Top Scorer Card
export function TopScorerCard() {
    const scorer = MOCKED_TOP_SCORER;

    return (
        <div className="bg-white rounded-xl p-0 shadow-sm border border-gray-100 h-full overflow-hidden relative">
            <div className="absolute top-6 left-6 z-10">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Top Scorer
                </span>
                <h3 className="text-2xl font-black text-gray-900 leading-tight max-w-[120px]">
                    {scorer.name.split(' ')[0]} <br /> {scorer.name.split(' ')[1]}
                </h3>
            </div>

            <div className="absolute bottom-6 left-6 z-10 flex gap-6">
                <div>
                    <span className="text-4xl font-black text-gray-900 block">{scorer.games}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Games</span>
                </div>
                <div>
                    <span className="text-4xl font-black text-gray-900 block">{scorer.goals}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Goals</span>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 w-[60%] h-[90%] flex items-end justify-end">
                <div className="w-full h-full bg-gradient-to-t from-primary/20 to-transparent rounded-tl-[100px]" />
                {/* <img src={scorer.photo_url} className="h-full object-contain object-bottom" /> */}
            </div>

            <div className="absolute top-6 right-6 opacity-10">
                <img src={scorer.team_logo} alt="Logo" className="w-24 h-24" />
            </div>
        </div>
    )
}

// Parent Wrapper
export function TeamDashboard({ matches }: { matches: Game[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[320px]">
            <MiniLeagueTable />
            <RecentMatchesList matches={matches} />
            <TopScorerCard />
        </div>
    )
}
