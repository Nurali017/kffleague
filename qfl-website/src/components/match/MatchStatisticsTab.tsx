'use client';

import { useState } from 'react';
import { MatchDetail } from '@/types';
import { getTeamLogo, getTeamColor } from '@/lib/utils/teamLogos';
import { CircleStat } from './CircleStat';
import { StatBar } from './StatBar';
import { H2HContentCards } from './H2HContentCards';

interface MatchStatisticsTabProps {
    // We now iterate on the full match object to get stats
    match: MatchDetail;
    // Keep individual teams for H2H if needed, but match object has them too
    homeTeam?: never; // Deprecated prop check
    awayTeam?: never;
}

type StatSubTab = 'match' | 'h2h';

export function MatchStatisticsTab({ match }: MatchStatisticsTabProps) {
    const [activeSubTab, setActiveSubTab] = useState<StatSubTab>('match');

    const { home_team, away_team, stats } = match;

    const homeColor = getTeamColor(home_team.id) || '#1E4D8C';
    const awayColor = getTeamColor(away_team.id) || '#E5B73B';
    const homeLogo = home_team.logo_url || getTeamLogo(home_team.id);
    const awayLogo = away_team.logo_url || getTeamLogo(away_team.id);

    // Helper to safely get stat values, defaulting to 0
    const getStat = (category: keyof NonNullable<typeof stats>, team: 'home' | 'away') => {
        if (!stats || !stats[category]) return 0;
        return stats[category][team] || 0;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Sub-Tab Navigation */}
            <div className="flex justify-center">
                <div className="bg-white p-1 rounded-full border border-gray-200 inline-flex shadow-sm">
                    <button
                        onClick={() => setActiveSubTab('match')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeSubTab === 'match' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Матч
                    </button>
                    <button
                        onClick={() => setActiveSubTab('h2h')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeSubTab === 'h2h' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        H2H История
                    </button>
                </div>
            </div>

            {activeSubTab === 'match' && (
                <div className="space-y-8">
                    {!stats ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                            <p className="text-gray-500">Статистика матча пока недоступна</p>
                        </div>
                    ) : (
                        <>
                            {/* Key Metrics - Circles */}
                            <div className="flex flex-wrap justify-center gap-8 md:gap-16 py-4">
                                <CircleStat
                                    label="Владение"
                                    value={`${getStat('possession', 'home')}%`}
                                    subValue={`vs ${getStat('possession', 'away')}%`}
                                    color={homeColor}
                                    logoUrl={homeLogo || undefined}
                                />
                                <CircleStat
                                    label="Удары"
                                    value={getStat('shots', 'home')}
                                    subValue={`vs ${getStat('shots', 'away')}`}
                                    color={homeColor}
                                />
                                <CircleStat
                                    label="В створ"
                                    value={getStat('shots_on_target', 'home')}
                                    subValue={`vs ${getStat('shots_on_target', 'away')}`}
                                    color={homeColor}
                                />
                            </div>

                            {/* Detailed Bars */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm max-w-4xl mx-auto">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center">
                                            {homeLogo && <img src={homeLogo} className="w-full h-full object-contain" alt={home_team.name} />}
                                        </div>
                                        <span className="font-bold text-gray-900 hidden md:inline">{home_team.name}</span>
                                    </div>

                                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Детали</h3>

                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-gray-900 hidden md:inline">{away_team.name}</span>
                                        <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center">
                                            {awayLogo && <img src={awayLogo} className="w-full h-full object-contain" alt={away_team.name} />}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <StatBar
                                        label="Удары в створ"
                                        homeValue={getStat('shots_on_target', 'home')}
                                        awayValue={getStat('shots_on_target', 'away')}
                                        homeColor={homeColor}
                                        awayColor={awayColor}
                                    />
                                    <StatBar
                                        label="Удары мимо"
                                        homeValue={getStat('shots', 'home') - getStat('shots_on_target', 'home')}
                                        awayValue={getStat('shots', 'away') - getStat('shots_on_target', 'away')}
                                        homeColor={homeColor}
                                        awayColor={awayColor}
                                    />
                                    <div className="h-px bg-gray-100 my-4" />
                                    <StatBar
                                        label="Угловые"
                                        homeValue={getStat('corners', 'home')}
                                        awayValue={getStat('corners', 'away')}
                                        homeColor={homeColor}
                                        awayColor={awayColor}
                                    />
                                    <StatBar
                                        label="Офсайды"
                                        homeValue={getStat('offsides', 'home')}
                                        awayValue={getStat('offsides', 'away')}
                                        homeColor={homeColor}
                                        awayColor={awayColor}
                                    />
                                    <div className="h-px bg-gray-100 my-4" />
                                    <StatBar
                                        label="Фолы"
                                        homeValue={getStat('fouls', 'home')}
                                        awayValue={getStat('fouls', 'away')}
                                        homeColor={homeColor}
                                        awayColor={awayColor}
                                    />
                                    <StatBar
                                        label="Желтые карточки"
                                        homeValue={getStat('yellow_cards', 'home')}
                                        awayValue={getStat('yellow_cards', 'away')}
                                        homeColor={homeColor}
                                        awayColor={awayColor}
                                    />
                                    <StatBar
                                        label="Красные карточки"
                                        homeValue={getStat('red_cards', 'home')}
                                        awayValue={getStat('red_cards', 'away')}
                                        homeColor={homeColor}
                                        awayColor={awayColor}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {activeSubTab === 'h2h' && (
                <H2HContentCards homeTeam={home_team} awayTeam={away_team} />
            )}

        </div>
    );
}
