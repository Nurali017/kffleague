'use client';

import { GameTeam } from '@/types';
import { getTeamColor } from '@/lib/utils/teamLogos';
import { StatBar } from './StatBar';

interface H2HContentCardsProps {
    homeTeam: GameTeam;
    awayTeam: GameTeam;
}

// Mock Data
const mockPreviousMeetings = [
    { date: '21.05.2023', home: 'Астана', away: 'Ордабасы', score: '2:0', competition: 'Премьер-Лига' },
    { date: '14.09.2022', home: 'Ордабасы', away: 'Астана', score: '1:1', competition: 'Кубок QFL' },
    { date: '02.04.2022', home: 'Астана', away: 'Ордабасы', score: '1:0', competition: 'Премьер-Лига' },
];

export function H2HContentCards({ homeTeam, awayTeam }: H2HContentCardsProps) {
    const homeColor = getTeamColor(homeTeam.id) || '#1E4D8C';
    const awayColor = getTeamColor(awayTeam.id) || '#E5B73B';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* 1. Season Stats Comparison */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 text-center">
                    Показатели сезона
                </h3>

                <div className="space-y-6">
                    <StatBar
                        label="Голов за игру"
                        homeValue={1.8}
                        awayValue={1.5}
                        homeColor={homeColor}
                        awayColor={awayColor}
                    />
                    <StatBar
                        label="Пропущенных"
                        homeValue={0.9}
                        awayValue={1.1}
                        homeColor={homeColor}
                        awayColor={awayColor}
                    />
                    <StatBar
                        label="Желтые карточки"
                        homeValue={2.1}
                        awayValue={2.4}
                        homeColor={homeColor}
                        awayColor={awayColor}
                    />
                    <StatBar
                        label="Победы (%)"
                        homeValue={62}
                        awayValue={48}
                        homeColor={homeColor}
                        awayColor={awayColor}
                    />
                </div>
            </div>

            {/* 2. Previous Meetings List */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 text-center">
                    История встреч
                </h3>

                <div className="space-y-4">
                    {mockPreviousMeetings.map((game, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-default">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold text-gray-400">{game.date} • {game.competition}</span>
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <span className={game.home === homeTeam.name ? 'text-gray-900' : 'text-gray-500'}>{game.home}</span>
                                    <span className="text-gray-300 mx-1">-</span>
                                    <span className={game.away === awayTeam.name ? 'text-gray-900' : 'text-gray-500'}>{game.away}</span>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-white rounded-lg border border-gray-200 font-bold text-gray-900 shadow-sm">
                                {game.score}
                            </div>
                        </div>
                    ))}

                    <button className="w-full py-2 text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide mt-2">
                        Показать всю историю
                    </button>
                </div>
            </div>

        </div>
    );
}
