import React from 'react';

interface Tournament {
    id: number;
    season: string;
    name: string;
    team: string;
    matches: number;
    minutes: number;
    goals: number;
    assists: number;
    yellow: number;
    red: number;
}

interface PlayerTournamentsProps {
    tournaments: Tournament[];
}

export function PlayerTournaments({ tournaments }: PlayerTournamentsProps) {
    if (!tournaments || tournaments.length === 0) return null;

    return (
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-[#1E4D8C]">Турнирлер</h3>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-wider border border-gray-100">
                    Барлық маусымдар
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr className="bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider">
                            <th className="px-6 py-4 text-left w-12 text-white/50">№</th>
                            <th className="px-6 py-4 text-left">Маусым</th>
                            <th className="px-6 py-4 text-left">Турнир</th>
                            <th className="px-6 py-4 text-center">Клуб</th>
                            <th className="px-6 py-4 text-center">Поз.</th>
                            <th className="px-6 py-4 text-center" title="Матчтар">М</th>
                            <th className="px-6 py-4 text-center" title="Минуттар">Мин</th>
                            <th className="px-6 py-4 text-center" title="Голдар">Г</th>
                            <th className="px-6 py-4 text-center" title="Нәтижелі пастар">НП</th>
                            <th className="px-6 py-4 text-center" title="Гол + Пас">Г+НП</th>
                            <th className="px-6 py-4 text-center opacity-70" title="Қақпаға Соққы">ҚС</th>
                            <th className="px-6 py-4 text-center" title="Сары Қағаз">Жан</th>
                            <th className="px-6 py-4 text-center" title="Қызыл Қағаз">Жек</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {tournaments.map((t, idx) => (
                            <tr key={t.id} className="border-b border-gray-100 hover:bg-blue-50/50 text-gray-700 transition-colors group">
                                <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                                <td className="px-6 py-4 font-bold text-[#1E293B]">{t.season}</td>
                                <td className="px-6 py-4 font-bold text-[#1E4D8C] group-hover:underline cursor-pointer">{t.name}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center group-hover:scale-110 transition-transform">
                                        <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-[10px] shadow-sm">
                                            <span className="font-bold text-[#1E4D8C]">FC</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center font-medium text-gray-500">{t.team}</td>
                                <td className="px-6 py-4 text-center font-black text-[#1E293B] text-base">{t.matches}</td>
                                <td className="px-6 py-4 text-center text-gray-500 font-medium">{t.minutes}</td>
                                <td className="px-6 py-4 text-center font-bold text-gray-900">{t.goals}</td>
                                <td className="px-6 py-4 text-center font-bold text-gray-900">{t.assists}</td>
                                <td className="px-6 py-4 text-center font-black text-[#1E4D8C] bg-blue-50/50 rounded-lg mx-2">{t.goals + t.assists}</td>
                                <td className="px-6 py-4 text-center text-gray-400 font-medium">19</td>
                                <td className="px-6 py-4 text-center">
                                    {t.yellow > 0 && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 font-bold rounded text-xs">{t.yellow}</span>}
                                    {t.yellow === 0 && <span className="text-gray-300">-</span>}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {t.red > 0 && <span className="px-2 py-1 bg-red-100 text-red-700 font-bold rounded text-xs">{t.red}</span>}
                                    {t.red === 0 && <span className="text-gray-300">-</span>}
                                </td>
                            </tr>
                        ))}
                        {/* Total Row */}
                        <tr className="bg-gray-50 font-bold text-[#1E293B] border-t-2 border-gray-100">
                            <td colSpan={5} className="px-6 py-4 text-right uppercase text-xs tracking-wider text-gray-500">Барлығы:</td>
                            <td className="px-6 py-4 text-center text-base">{tournaments.reduce((acc, t) => acc + t.matches, 0)}</td>
                            <td className="px-6 py-4 text-center">{tournaments.reduce((acc, t) => acc + t.minutes, 0)}</td>
                            <td className="px-6 py-4 text-center">{tournaments.reduce((acc, t) => acc + t.goals, 0)}</td>
                            <td className="px-6 py-4 text-center">{tournaments.reduce((acc, t) => acc + t.assists, 0)}</td>
                            <td className="px-6 py-4 text-center text-[#1E4D8C]">{tournaments.reduce((acc, t) => acc + t.goals + t.assists, 0)}</td>
                            <td className="px-6 py-4 text-center text-gray-400">38</td>
                            <td className="px-6 py-4 text-center text-yellow-600 font-bold">{tournaments.reduce((acc, t) => acc + t.yellow, 0)}</td>
                            <td className="px-6 py-4 text-center text-red-600 font-bold">{tournaments.reduce((acc, t) => acc + t.red, 0)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
