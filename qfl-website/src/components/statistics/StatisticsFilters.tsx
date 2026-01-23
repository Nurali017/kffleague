'use client';

import { TeamStatistics } from '@/types/statistics';

interface StatisticsFiltersProps {
    mode: 'clubs' | 'players';
    phase: string;
    onPhaseChange: (phase: string) => void;
    // For player stats only
    selectedClub?: string;
    onClubChange?: (clubId: string) => void;
    selectedPosition?: string;
    onPositionChange?: (position: string) => void;
    teams?: TeamStatistics[];
}

export function StatisticsFilters({
    mode,
    phase,
    onPhaseChange,
    selectedClub,
    onClubChange,
    selectedPosition,
    onPositionChange,
    teams = []
}: StatisticsFiltersProps) {
    return (
        <div className="bg-white border-b border-gray-200 py-4">
            <div className="max-w-[1440px] mx-auto px-4 md:px-20">
                <div className="flex flex-wrap items-center gap-4">

                    {/* Phase Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Phase:</span>
                        <select
                            value={phase}
                            onChange={(e) => onPhaseChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4D8C] focus:border-transparent"
                        >
                            <option value="all">All matches</option>
                            <option value="main">Main tournament</option>
                            <option value="qualifying">Qualifying</option>
                        </select>
                    </div>

                    {/* Club Filter (Player stats only) */}
                    {mode === 'players' && onClubChange && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Club:</span>
                            <select
                                value={selectedClub}
                                onChange={(e) => onClubChange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4D8C] focus:border-transparent"
                            >
                                <option value="all">All clubs</option>
                                {teams.map(team => (
                                    <option key={team.team_id} value={team.team_id.toString()}>
                                        {team.team_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Position Filter (Player stats only) */}
                    {mode === 'players' && onPositionChange && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Position:</span>
                            <div className="flex gap-1 border border-gray-200 rounded-lg overflow-hidden p-1 bg-gray-50">
                                {['all', 'GK', 'DEF', 'MID', 'FWD'].map(pos => (
                                    <button
                                        key={pos}
                                        onClick={() => onPositionChange(pos)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded transition-colors uppercase ${selectedPosition === pos
                                                ? 'bg-[#1E4D8C] text-white shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
