'use client';

import { useState } from 'react';
import { useTeamStatsTable } from '@/hooks';
import { StatisticsSubTabs } from '@/components/statistics/StatisticsSubTabs';
import { StatisticsFilters } from '@/components/statistics/StatisticsFilters';
import { ClubStatsTable } from '@/components/statistics/ClubStatsTable';
import { StatSubTab } from '@/types/statistics';

export default function TeamsStatsPage() {
    const [subTab, setSubTab] = useState<StatSubTab>('key_stats');
    const [phase, setPhase] = useState('all');

    const { teams, loading, error } = useTeamStatsTable();

    return (
        <>
            <StatisticsSubTabs
                activeSubTab={subTab}
                onSubTabChange={setSubTab}
                hideGoalkeeping={true}
            />
            <StatisticsFilters
                mode="clubs"
                phase={phase}
                onPhaseChange={setPhase}
            />

            <div className="max-w-[1440px] mx-auto px-4 md:px-20 py-8">
                {error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
                        <p className="text-red-600 dark:text-red-400">Ошибка загрузки статистики команд</p>
                        <p className="text-sm text-red-500 dark:text-red-500 mt-2">{error.message}</p>
                    </div>
                ) : (
                    <ClubStatsTable
                        subTab={subTab}
                        phase={phase}
                        teams={teams}
                        loading={loading}
                    />
                )}
            </div>
        </>
    );
}
