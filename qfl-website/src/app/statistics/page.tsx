'use client';

import { useState } from 'react';
import { StatisticsHero } from '@/components/statistics/StatisticsHero';
import { StatisticsMainTabs } from '@/components/statistics/StatisticsMainTabs';
import { StatisticsSubTabs } from '@/components/statistics/StatisticsSubTabs';
import { StatisticsFilters } from '@/components/statistics/StatisticsFilters';
import { ClubStatsTable } from '@/components/statistics/ClubStatsTable';
import { PlayerStatsTable } from '@/components/statistics/PlayerStatsTable';
import { mockGoalsByPeriod, mockSeasonHeroStats, mockTeamStatistics, mockPlayerStatistics } from '@/lib/mock/statisticsData';
import { StatSubTab } from '@/types/statistics';

export default function StatisticsPage() {
    const [mainTab, setMainTab] = useState<'clubs' | 'players'>('clubs');
    const [subTab, setSubTab] = useState<StatSubTab>('key_stats');

    // Filters state
    const [phase, setPhase] = useState('all');
    const [selectedClub, setSelectedClub] = useState('all');
    const [selectedPosition, setSelectedPosition] = useState('all');

    return (
        <div className="min-h-screen bg-[#FAFBFC]">
            <StatisticsHero stats={mockSeasonHeroStats} goalsByPeriod={mockGoalsByPeriod} />

            <StatisticsMainTabs activeTab={mainTab} onTabChange={setMainTab} />
            <StatisticsSubTabs
                activeSubTab={subTab}
                onSubTabChange={setSubTab}
                hideGoalkeeping={mainTab === 'clubs'}
            />
            <StatisticsFilters
                mode={mainTab}
                phase={phase}
                onPhaseChange={setPhase}
                selectedClub={selectedClub}
                onClubChange={setSelectedClub}
                selectedPosition={selectedPosition}
                onPositionChange={setSelectedPosition}
                teams={mockTeamStatistics}
            />

            <div className="max-w-[1440px] mx-auto px-4 md:px-20 py-8">
                {mainTab === 'clubs' ? (
                    <ClubStatsTable
                        subTab={subTab}
                        phase={phase}
                        teams={mockTeamStatistics}
                    />
                ) : (
                    <PlayerStatsTable
                        subTab={subTab}
                        filters={{ phase, club: selectedClub, position: selectedPosition }}
                        players={mockPlayerStatistics}
                    />
                )}
            </div>
        </div>
    );
}
