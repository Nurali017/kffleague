'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  usePlayerDetail,
  usePlayerSeasonStats,
  usePlayerTeammates,
  usePlayerTournaments,
} from '@/hooks';
import { PlayerPageHero } from '@/components/player/PlayerPageHero';
import { PlayerStatsSection } from '@/components/player/PlayerStatsSection';
import { PlayerDetailStats } from '@/components/player/PlayerDetailStats';
import { PlayerTeammates } from '@/components/player/PlayerTeammates';
import { PlayerTournaments } from '@/components/player/PlayerTournaments';
import {
  transformPlayer,
  transformStats,
  transformTournaments,
  transformTeammates,
} from '@/lib/api/transformers/playerTransformers';

// Loading skeleton component
function PlayerPageSkeleton() {
  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <div className="h-[400px] bg-gradient-to-br from-[#1E4D8C] to-[#0D2E5C] animate-pulse" />
      <div className="bg-white shadow-sm py-6">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          <div className="flex justify-center gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 w-24 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-8 space-y-8">
        <div className="h-64 bg-white rounded-xl animate-pulse" />
        <div className="h-96 bg-white rounded-xl animate-pulse" />
      </div>
    </main>
  );
}

// Error component
function PlayerNotFound() {
  const { t } = useTranslation('player');

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {t('notFound', 'Ойыншы табылмады')}
        </h1>
        <Link
          href="/"
          className="inline-flex items-center text-[#1E4D8C] hover:text-[#1565C0] font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToHome', 'Басты бетке')}
        </Link>
      </div>
    </main>
  );
}

export default function PlayerProfilePage() {
  const params = useParams();
  const playerId = params?.id as string;
  const { t } = useTranslation('player');

  // Fetch all player data
  const { player: apiPlayer, loading: playerLoading, error: playerError } = usePlayerDetail(playerId);
  const { stats: apiStats, loading: statsLoading } = usePlayerSeasonStats(playerId);
  const { teammates: apiTeammates, loading: teammatesLoading } = usePlayerTeammates(playerId, { limit: 10 });
  const { tournaments: apiTournaments, loading: tournamentsLoading } = usePlayerTournaments(playerId);

  // Transform data to component format
  const player = useMemo(() => transformPlayer(apiPlayer), [apiPlayer]);
  const stats = useMemo(() => transformStats(apiStats), [apiStats]);
  const tournaments = useMemo(() => transformTournaments(apiTournaments), [apiTournaments]);
  const teammates = useMemo(() => transformTeammates(apiTeammates), [apiTeammates]);

  // Loading state
  const isLoading = playerLoading || statsLoading;

  if (isLoading) {
    return <PlayerPageSkeleton />;
  }

  // Error state
  if (playerError || !player) {
    return <PlayerNotFound />;
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* 1. Hero Section */}
      <PlayerPageHero player={player} />

      {/* 2. Stats Summary (White Bar) */}
      <PlayerStatsSection stats={stats} />

      {/* 3. Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-8 space-y-8">
        {/* Detailed Stats (Circles + Grid) */}
        <PlayerDetailStats stats={stats} />

        {/* Tournaments History */}
        {tournaments.length > 0 && (
          <PlayerTournaments tournaments={tournaments} />
        )}
      </div>

      {/* 4. Teammates Section (Carousel) */}
      {teammates.length > 0 && (
        <div className="mt-12">
          <PlayerTeammates
            teammates={teammates}
            teamId={player.team_id || 0}
          />
        </div>
      )}

      {/* Back Button */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-6">
        <Link
          href="/"
          className="inline-flex items-center text-[#1E4D8C] hover:text-[#1565C0] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToHome', 'Басты бетке')}
        </Link>
      </div>
    </main>
  );
}
