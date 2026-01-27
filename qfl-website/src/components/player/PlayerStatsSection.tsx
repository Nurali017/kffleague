import React from 'react';
import { PlayerPageStats } from '@/types/player';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTournament } from '@/contexts/TournamentContext';

interface PlayerStatsSectionProps {
    stats?: PlayerPageStats | null;
}

export function PlayerStatsSection({ stats }: PlayerStatsSectionProps) {
    const { i18n } = useTranslation();
    const lang = (i18n.language === 'ru' ? 'ru' : 'kz') as 'ru' | 'kz';
    const { currentTournament, availableTournaments, setTournament } = useTournament();

    const gamesPlayed = stats?.games_played ?? 0;
    const minutesPlayed = stats?.minutes_played ?? 0;
    const started = stats?.started ?? 0;
    const subbedIn = stats?.subbed_in ?? 0;

    const statItems = [
        { label: 'Матчқа қатысты', value: gamesPlayed },
        { label: 'Минут алаңда өткізді', value: minutesPlayed },
        { label: 'Бастапқы құрамда', value: started },
        { label: 'Қосалқы құрамнан шықты', value: subbedIn },
    ];

    return (
        <div className="w-full bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm/50">
            <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-6">

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
                    {/* Title & Season Selector */}
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                        <h2 className="text-2xl font-black text-[#1E4D8C]">Статистика</h2>

                        <div className="relative group">
                            <select
                                value={currentTournament.id}
                                onChange={(e) => setTournament(e.target.value)}
                                className="appearance-none bg-blue-50 text-[#1E4D8C] text-sm font-bold px-4 py-2.5 pr-10 rounded-lg outline-none cursor-pointer hover:bg-blue-100 transition-colors border border-transparent focus:border-[#1E4D8C]/20"
                            >
                                {availableTournaments.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name[lang]}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E4D8C] pointer-events-none group-hover:translate-y-[-2px] transition-transform" />
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex-1 w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-16 justify-end">
                        {statItems.map((item, index) => (
                            <div key={index} className="flex flex-col items-center md:items-end text-center md:text-right group">
                                <span className="text-4xl md:text-5xl font-black text-[#1E4D8C] mb-1 group-hover:scale-105 transition-transform duration-300">
                                    {item.value}
                                </span>
                                <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wide">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
