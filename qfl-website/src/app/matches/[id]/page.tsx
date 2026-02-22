'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMatchDetail, useMatchEvents, useMatchLineup, useMatchStats } from '@/hooks';
import { transformTeamStats } from '@/lib/api/transformers/matchTransformers';
import { PlayerCountry } from '@/types';
import { MatchHeader } from '@/components/MatchHeader';
import { MatchTabs, TabId } from '@/components/match/MatchTabs';
import { MatchVideoCard } from '@/components/match/MatchVideoCard';
import { LineupField } from '@/components/match/LineupField';
import { LineupFieldMini } from '@/components/match/LineupFieldMini';
import { TournamentTableMini } from '@/components/match/TournamentTableMini';
import { MatchStatisticsTab } from '@/components/match/MatchStatisticsTab';
import { MiniKeyStats } from '@/components/match/MiniKeyStats';
import { H2HContentCards } from '@/components/match/H2HContentCards';
import { HOME_COLOR, AWAY_COLOR } from '@/lib/utils/teamLogos';

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 bg-gray-200 dark:bg-dark-border rounded-2xl" />
      <div className="h-24 bg-gray-200 dark:bg-dark-border rounded-xl" />
      <div className="h-12 bg-gray-200 dark:bg-dark-border rounded-lg" />
      <div className="h-96 bg-gray-200 dark:bg-dark-border rounded-xl" />
    </div>
  );
}

function ErrorState({ error }: { error?: string }) {
  return (
    <div className="text-center py-16">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Матч не найден
      </h1>
      <p className="text-gray-500 dark:text-slate-400 mb-8">
        {error || 'К сожалению, информация о матче недоступна'}
      </p>
    </div>
  );
}

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.id ? Number(params.id) : null;
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { i18n } = useTranslation();

  // Data fetching
  const { match, loading: matchLoading, error: matchError } = useMatchDetail(matchId);
  const { events, loading: eventsLoading } = useMatchEvents(matchId, match?.is_live || false);
  const { lineup, loading: lineupLoading } = useMatchLineup(matchId, match?.is_live || false);
  const { stats, loading: statsLoading } = useMatchStats(matchId);

  // Трансформировать team_stats в формат home/away
  const transformedStats = useMemo(() => {
    if (!stats?.team_stats || stats.team_stats.length < 2 || !match) return undefined;

    return transformTeamStats(
      stats.team_stats,
      match.home_team.id,
      match.away_team.id
    );
  }, [stats, match]);

  // Создать маппинг player_id -> country из lineup данных
  const playerCountryMap = useMemo(() => {
    const map: Record<number, PlayerCountry> = {};
    if (lineup?.lineups) {
      const allPlayers = [
        ...(lineup.lineups.home_team?.starters || []),
        ...(lineup.lineups.home_team?.substitutes || []),
        ...(lineup.lineups.away_team?.starters || []),
        ...(lineup.lineups.away_team?.substitutes || []),
      ];
      allPlayers.forEach(player => {
        if (player.country) {
          map[player.player_id] = player.country;
        }
      });
    }
    return map;
  }, [lineup]);

  // Создать расширенный объект match со статистикой
  const matchWithStats = useMemo(() => {
    if (!match) return null;

    return {
      ...match,
      stats: transformedStats,
      player_stats: stats?.player_stats,
    };
  }, [match, transformedStats, stats]);

  if (matchLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (matchError || !match) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <ErrorState error={matchError} />
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBFC] dark:bg-dark-bg min-h-screen">
      {/* 1. Hero Section includes Timeline - full width */}
      <MatchHeader
        match={match}
        events={events?.events || []}
        eventsLoading={eventsLoading}
        playerCountryMap={playerCountryMap}
      />

      {/* 2. Tab Navigation - Sticky & Full Width Container */}
      <MatchTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        protocolUrl={match.protocol_url}
      />

      {/* 3. Tab Content - Constrained Container */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-20 py-8">

        {/* Lineups tab - full width without sidebar */}
        {activeTab === 'lineups' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <LineupField
              lineups={lineup?.lineups}
              homeTeam={match.home_team}
              awayTeam={match.away_team}
              loading={lineupLoading}
            />
          </div>
        )}

        {/* Statistics tab - full width without sidebar */}
        {activeTab === 'statistics' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MatchStatisticsTab match={matchWithStats || match} />
          </div>
        )}

        {/* H2H tab - full width without sidebar */}
        {activeTab === 'h2h' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <H2HContentCards homeTeam={match.home_team} awayTeam={match.away_team} seasonId={match.season_id ?? undefined} />
          </div>
        )}

        {/* Overview tab - with sidebar layout */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left Column - main content */}
            <div className="space-y-8">
              {match.video_url && (
                <MatchVideoCard videoUrl={match.video_url} />
              )}

              {/* Key Stats Section - after video */}
              {matchWithStats?.stats && (
                <MiniKeyStats
                  stats={matchWithStats.stats}
                  homeColor={HOME_COLOR}
                  awayColor={AWAY_COLOR}
                />
              )}
            </div>

            {/* Right Sidebar - 380px fixed width */}
            <div className="space-y-6">
              <LineupFieldMini
                lineups={lineup?.lineups}
                homeTeam={match.home_team}
                awayTeam={match.away_team}
                loading={lineupLoading}
              />
              <TournamentTableMini
                seasonId={match.season_id ?? undefined}
                homeTeamId={match.home_team.id}
                awayTeamId={match.away_team.id}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
