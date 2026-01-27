'use client';

import { useState } from 'react';
import { usePlayerStats, useTeamStatsTable } from '@/hooks';
import { StatisticsSubTabs } from '@/components/statistics/StatisticsSubTabs';
import { StatisticsFilters } from '@/components/statistics/StatisticsFilters';
import { PlayerStatsTable } from '@/components/statistics/PlayerStatsTable';
import { StatSubTab } from '@/types/statistics';

export default function PlayersStatsPage() {
    const [subTab, setSubTab] = useState<StatSubTab>('key_stats');
    const [phase, setPhase] = useState('all');
    const [selectedClub, setSelectedClub] = useState('all');
    const [selectedPosition, setSelectedPosition] = useState('all');

    // Get players with high limit for table view
    const { players, loading, error } = usePlayerStats({ limit: 100 });

    // Get teams for the filter dropdown
    const { teams } = useTeamStatsTable();

    // Filter players by club and position
    const filteredPlayers = players.filter(player => {
        if (selectedClub !== 'all' && player.team_id.toString() !== selectedClub) {
            return false;
        }
        if (selectedPosition !== 'all' && player.top_role !== selectedPosition) {
            return false;
        }
        return true;
    });

    return (
        <>
            <StatisticsSubTabs
                activeSubTab={subTab}
                onSubTabChange={setSubTab}
                hideGoalkeeping={false}
            />
            <StatisticsFilters
                mode="players"
                phase={phase}
                onPhaseChange={setPhase}
                selectedClub={selectedClub}
                onClubChange={setSelectedClub}
                selectedPosition={selectedPosition}
                onPositionChange={setSelectedPosition}
                teams={teams}
            />

            <div className="max-w-[1440px] mx-auto px-4 md:px-20 py-8">
                {error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
                        <p className="text-red-600 dark:text-red-400">Ошибка загрузки статистики игроков</p>
                        <p className="text-sm text-red-500 dark:text-red-500 mt-2">{error.message}</p>
                    </div>
                ) : (
                    <PlayerStatsTable
                        subTab={subTab}
                        filters={{ phase, club: selectedClub, position: selectedPosition }}
                        players={filteredPlayers as any}
                        loading={loading}
                    />
                )}
            </div>
        </>
    );
}
