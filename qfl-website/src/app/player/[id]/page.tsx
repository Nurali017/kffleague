'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MOCK_PLAYER_DATA } from '@/app/player/mockData';
import { PlayerPageHero } from '@/components/player/PlayerPageHero';
import { PlayerStatsSection } from '@/components/player/PlayerStatsSection';
import { PlayerDetailStats } from '@/components/player/PlayerDetailStats';
import { PlayerMatchesTable } from '@/components/player/PlayerMatchesTable';
import { PlayerTeammates } from '@/components/player/PlayerTeammates';
import { PlayerTournaments } from '@/components/player/PlayerTournaments';

export default function PlayerProfilePage() {
    // Use MOCK DATA directly
    const { player, stats, matches, tournaments, teammates } = MOCK_PLAYER_DATA;

    return (
        <main className="min-h-screen bg-[#F8F9FA] pb-20">
            {/* 1. Hero Section */}
            <PlayerPageHero player={player as any} />

            {/* 2. Stats Summary (White Bar) */}
            <PlayerStatsSection stats={stats as any} />

            {/* 3. Main Content Area */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-8 space-y-8">

                {/* Detailed Stats (Circles + Grid) */}
                <PlayerDetailStats stats={stats as any} />

                {/* Matches History */}
                <PlayerMatchesTable matches={matches as any} />

                {/* Tournaments History (NEW) */}
                <PlayerTournaments tournaments={tournaments} />

            </div>

            {/* 4. Teammates Section (Carousel) */}
            <div className="mt-12">
                <PlayerTeammates teammates={teammates as any} teamId={99} />
            </div>

            {/* Back Button (Floating or Bottom) */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-6">
                <Link href="/" className="inline-flex items-center text-[#1E4D8C] hover:text-[#1565C0] font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Басты бетке
                </Link>
            </div>
        </main>
    );
}
