'use client';

import { useState } from 'react';
import { usePlayerStats, useTeams } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { StatisticsSubTabs } from '@/components/statistics/StatisticsSubTabs';
import { StatisticsFilters } from '@/components/statistics/StatisticsFilters';
import { PlayerStatsTable } from '@/components/statistics/PlayerStatsTable';
import { StatSubTab } from '@/types/statistics';
import { useTournament } from '@/contexts/TournamentContext';
import { PlayerStatsSortBy, PositionCode } from '@/types';

export default function PlayersStatsPage() {
    const { t } = useTranslation('statistics');
    const { effectiveSeasonId } = useTournament();
    const [subTab, setSubTab] = useState<StatSubTab>('key_stats');
    const [selectedClub, setSelectedClub] = useState('all');
    const [selectedPosition, setSelectedPosition] = useState('all');

    const sortBy: PlayerStatsSortBy = (() => {
        switch (subTab) {
            case 'key_stats':
            case 'goals':
                return 'goals';
            case 'attempts':
                return 'shots';
            case 'distribution':
                return 'passes';
            case 'attacking':
                return 'dribble';
            case 'defending':
                return 'tackle';
            case 'goalkeeping':
                return 'save_shot';
            case 'disciplinary':
                return 'yellow_cards';
            // Tabs not yet implemented in UI columns; use a safe default.
            default:
                return 'goals';
        }
    })();

    const teamId =
        selectedClub !== 'all' && Number.isFinite(Number(selectedClub))
            ? Number(selectedClub)
            : undefined;

    const positionCode =
        selectedPosition !== 'all' ? (selectedPosition as PositionCode) : undefined;

    // Get players with high limit for table view
    const { players, loading, error } = usePlayerStats({
        limit: 100,
        seasonId: effectiveSeasonId,
        sortBy,
        teamId,
        positionCode,
    });

    // Get teams for the filter dropdown (should not depend on team-stats availability)
    const { teams: teamsList } = useTeams(effectiveSeasonId);

    return (
        <>
            <StatisticsSubTabs
                activeSubTab={subTab}
                onSubTabChange={setSubTab}
                hideGoalkeeping={false}
            />
            <StatisticsFilters
                mode="players"
                selectedClub={selectedClub}
                onClubChange={setSelectedClub}
                selectedPosition={selectedPosition}
                onPositionChange={setSelectedPosition}
                teams={teamsList.map((team) => ({
                    team_id: team.id,
                    team_name: team.name,
                    team_logo: team.logo_url ?? null,
                }))}
            />

            <div className="max-w-[1440px] mx-auto px-4 md:px-20 py-8">
                {error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
                        <p className="text-red-600 dark:text-red-400">
                            {t('errors.playerStatsLoad', { defaultValue: 'Ошибка загрузки статистики игроков' })}
                        </p>
                        <p className="text-sm text-red-500 dark:text-red-500 mt-2">{error.message}</p>
                    </div>
                ) : (
                    <PlayerStatsTable
                        subTab={subTab}
                        filters={{ club: selectedClub, position: selectedPosition }}
                        players={players}
                        loading={loading}
                    />
                )}
            </div>
        </>
    );
}
