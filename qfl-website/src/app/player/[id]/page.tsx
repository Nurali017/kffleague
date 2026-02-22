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
  useTeamDetail,
} from '@/hooks';
import { useTournament } from '@/contexts/TournamentContext';
import { PlayerPageHero } from '@/components/player/PlayerPageHero';
import { PlayerStatsSection } from '@/components/player/PlayerStatsSection';
import { PlayerDetailStats } from '@/components/player/PlayerDetailStats';
import { PlayerTeammates } from '@/components/player/PlayerTeammates';
import { PlayerTournaments } from '@/components/player/PlayerTournaments';
import { HeroBackground } from '@/components/ui/HeroBackground';
import {
  transformPlayer,
  transformStats,
  transformTournaments,
  transformTeammates,
} from '@/lib/api/transformers/playerTransformers';
import {
  DEFAULT_PLAYER_PAGE_VARIANT,
} from '@/components/player/playerPageVariants';

// Loading skeleton component
function PlayerPageSkeleton() {
  return (
    <main className="min-h-screen bg-surface-muted dark:bg-dark-bg overflow-x-hidden">
      {/* Hero skeleton */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden animate-pulse">
        <HeroBackground />
      </div>
      {/* Stats bar skeleton */}
      <div className="bg-white dark:bg-dark-surface shadow-sm py-4 md:py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="h-8 w-32 bg-gray-200 dark:bg-dark-surface-soft rounded animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="h-10 w-16 bg-gray-200 dark:bg-dark-surface-soft rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-100 dark:bg-dark-surface rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Content skeleton */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-8 space-y-8 md:space-y-10">
        <div className="h-64 md:h-80 bg-white dark:bg-dark-surface rounded-2xl animate-pulse" />
        <div className="h-48 md:h-64 bg-white dark:bg-dark-surface rounded-2xl animate-pulse" />
      </div>
    </main>
  );
}

// Error component
function PlayerNotFound() {
  const { t } = useTranslation('player');

  return (
    <main className="min-h-screen bg-surface-muted dark:bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-dark-surface flex items-center justify-center">
          <span className="text-3xl text-gray-400 dark:text-slate-500">?</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {t('notFound', 'Ойыншы табылмады')}
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
          {t('notFoundDescription', 'Сіз іздеген ойыншы табылмады немесе жойылған болуы мүмкін.')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center min-h-[44px] px-4 py-2 text-primary hover:text-primary-light dark:text-accent-cyan dark:hover:text-cyan-200 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted dark:focus-visible:ring-offset-dark-bg rounded-lg"
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
  const rawPlayerId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const parsedPlayerId = Number.parseInt(rawPlayerId ?? '', 10);
  const isPlayerIdValid = Number.isInteger(parsedPlayerId) && parsedPlayerId > 0;
  const playerId = isPlayerIdValid ? parsedPlayerId : null;
  const { t } = useTranslation('player');
  const { effectiveSeasonId } = useTournament();

  // Fetch all player data
  const { player: apiPlayer, loading: playerLoading, error: playerError } = usePlayerDetail(playerId, effectiveSeasonId);
  const { stats: apiStats, loading: statsLoading } = usePlayerSeasonStats(playerId, effectiveSeasonId);
  const { teammates: apiTeammates, loading: teammatesLoading } = usePlayerTeammates(playerId, { limit: 10, seasonId: effectiveSeasonId });
  const { tournaments: apiTournaments, loading: tournamentsLoading } = usePlayerTournaments(playerId);
  const teamId = apiPlayer?.teams?.[0] ?? null;
  const { team } = useTeamDetail(teamId);

  // Transform data to component format
  const player = useMemo(() => transformPlayer(apiPlayer), [apiPlayer]);
  const stats = useMemo(() => transformStats(apiStats), [apiStats]);
  const tournaments = useMemo(() => transformTournaments(apiTournaments), [apiTournaments]);
  const teammates = useMemo(() => transformTeammates(apiTeammates), [apiTeammates]);
  const pageVariant = DEFAULT_PLAYER_PAGE_VARIANT;

  if (!isPlayerIdValid) {
    return <PlayerNotFound />;
  }

  // Loading state
  const isLoading = playerLoading || statsLoading;

  if (isLoading) {
    return <PlayerPageSkeleton />;
  }

  // Error state
  if (playerError || !player) {
    return <PlayerNotFound />;
  }

  const mainClasses = pageVariant === 'studio'
    ? 'min-h-screen bg-slate-100 dark:bg-[#090f1a] pb-20 overflow-x-hidden'
    : pageVariant === 'data'
      ? 'min-h-screen bg-[#f2f6fb] dark:bg-[#0b1220] pb-20 overflow-x-hidden'
      : 'min-h-screen bg-surface-muted dark:bg-dark-bg pb-20 overflow-x-hidden';
  const contentGap = pageVariant === 'data' ? 'space-y-6 md:space-y-8' : 'space-y-8 md:space-y-10';

  return (
    <main className={mainClasses}>
      {/* 1. Hero Section */}
      <PlayerPageHero player={player} team={team} variant={pageVariant} />

      {/* 2. Stats Summary (White Bar) */}
      <PlayerStatsSection stats={stats} variant={pageVariant} />

      {/* 3. Main Content Area */}
      <div className={`max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-8 ${contentGap}`}>
        {/* Detailed Stats (Circles + Grid) */}
        <PlayerDetailStats stats={stats} variant={pageVariant} />

        {/* Tournaments History */}
        {tournaments.length > 0 && (
          <PlayerTournaments tournaments={tournaments} variant={pageVariant} />
        )}
      </div>

      {/* 4. Teammates Section (Carousel) */}
      {teammates.length > 0 && (
        <div className="mt-8 md:mt-12">
          <PlayerTeammates
            teammates={teammates}
            teamId={player.team_id || 0}
            variant={pageVariant}
          />
        </div>
      )}

      {/* Back Button */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 py-6">
        <Link
          href="/"
          className="inline-flex items-center min-h-[44px] px-2 py-2 -ml-2 text-primary hover:text-primary-light dark:text-accent-cyan dark:hover:text-cyan-200 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToHome', 'Басты бетке')}
        </Link>
      </div>
    </main>
  );
}
