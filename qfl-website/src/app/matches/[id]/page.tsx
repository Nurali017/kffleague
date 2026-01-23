'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMatchDetail, useMatchEvents, useMatchLineup, useMatchStats } from '@/hooks';
import { transformTeamStats } from '@/lib/api/transformers/matchTransformers';
import { MatchHeader } from '@/components/MatchHeader';
import { MatchTabs, TabId } from '@/components/match/MatchTabs';
import { MatchEventsList } from '@/components/match/MatchEventsList';
import { MatchVideoCard } from '@/components/match/MatchVideoCard';
import { MatchStatsCard } from '@/components/match/MatchStatsCard';
import { MatchInfoCard } from '@/components/match/MatchInfoCard';
import { LineupField } from '@/components/match/LineupField';
import { HeadToHeadMini } from '@/components/match/HeadToHeadMini';
import { TournamentTableMini } from '@/components/match/TournamentTableMini';
import { MatchStatisticsTab } from '@/components/match/MatchStatisticsTab';

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 bg-gray-200 rounded-2xl" />
      <div className="h-24 bg-gray-200 rounded-xl" />
      <div className="h-12 bg-gray-200 rounded-lg" />
      <div className="h-96 bg-gray-200 rounded-xl" />
    </div>
  );
}

function ErrorState({ error }: { error?: string }) {
  return (
    <div className="text-center py-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Матч не найден
      </h1>
      <p className="text-gray-500 mb-8">
        {error || 'К сожалению, информация о матче недоступна'}
      </p>
    </div>
  );
}

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { i18n } = useTranslation();

  // Data fetching
  const { match, loading: matchLoading, error: matchError } = useMatchDetail(matchId);
  const { events, loading: eventsLoading } = useMatchEvents(matchId, match?.is_live || false);
  const { lineup, loading: lineupLoading } = useMatchLineup(matchId);
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
    <div className="bg-[#FAFBFC] min-h-screen">
      {/* 1. Hero Section includes Timeline - full width */}
      <MatchHeader
        match={match}
        events={events?.events || []}
        eventsLoading={eventsLoading}
      />

      {/* 2. Tab Navigation - Sticky & Full Width Container */}
      <MatchTabs activeTab={activeTab} onTabChange={setActiveTab} />

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

        {/* Other tabs - with sidebar layout */}
        {activeTab !== 'lineups' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left Column - main content */}
            <div className="space-y-8">
              {activeTab === 'overview' && (
                <>
                  <MatchVideoCard />

                  {/* Match Information Card */}
                  <MatchInfoCard match={match} />

                  {/* Expanded Team Statistics */}
                  <MatchStatsCard
                    homeTeam={match.home_team}
                    awayTeam={match.away_team}
                    stats={transformedStats ? [
                      // Владение мячом
                      {
                        label: i18n.language === 'kz' ? 'Допқа иелік ету (%)' : i18n.language === 'en' ? 'Possession (%)' : 'Владение мячом (%)',
                        homeValue: transformedStats.possession.home,
                        awayValue: transformedStats.possession.away
                      },
                      // Удары
                      {
                        label: i18n.language === 'kz' ? 'Соққы' : i18n.language === 'en' ? 'Shots' : 'Удары',
                        homeValue: transformedStats.shots.home,
                        awayValue: transformedStats.shots.away
                      },
                      // Удары в створ
                      {
                        label: i18n.language === 'kz' ? 'Қақпаға тура тебілген соққылар' : i18n.language === 'en' ? 'Shots on Target' : 'Удары в створ',
                        homeValue: transformedStats.shots_on_target.home,
                        awayValue: transformedStats.shots_on_target.away
                      },
                      // Удары мимо (вычисляемое)
                      {
                        label: i18n.language === 'kz' ? 'Қиыс кеткен соққы' : i18n.language === 'en' ? 'Shots off Target' : 'Удары мимо',
                        homeValue: transformedStats.shots.home - transformedStats.shots_on_target.home,
                        awayValue: transformedStats.shots.away - transformedStats.shots_on_target.away
                      },
                      // Угловые
                      {
                        label: i18n.language === 'kz' ? 'Бұрыштамалар' : i18n.language === 'en' ? 'Corners' : 'Угловые',
                        homeValue: transformedStats.corners.home,
                        awayValue: transformedStats.corners.away
                      },
                      // Офсайды
                      {
                        label: i18n.language === 'kz' ? 'Ойыннан тыс қалу' : i18n.language === 'en' ? 'Offsides' : 'Офсайды',
                        homeValue: transformedStats.offsides.home,
                        awayValue: transformedStats.offsides.away
                      },
                      // Фолы
                      {
                        label: i18n.language === 'kz' ? 'Тәртіп бұзу' : i18n.language === 'en' ? 'Fouls' : 'Фолы',
                        homeValue: transformedStats.fouls.home,
                        awayValue: transformedStats.fouls.away
                      },
                      // Желтые карточки
                      {
                        label: i18n.language === 'kz' ? 'Сары қағаздар' : i18n.language === 'en' ? 'Yellow Cards' : 'Желтые карточки',
                        homeValue: transformedStats.yellow_cards.home,
                        awayValue: transformedStats.yellow_cards.away
                      },
                      // Красные карточки
                      {
                        label: i18n.language === 'kz' ? 'Қызыл қағаздар' : i18n.language === 'en' ? 'Red Cards' : 'Красные карточки',
                        homeValue: transformedStats.red_cards.home,
                        awayValue: transformedStats.red_cards.away
                      },
                    ] : undefined}
                  />
                </>
              )}

              {activeTab === 'events' && (
                <MatchEventsList
                  events={events?.events || []}
                  homeTeam={match.home_team}
                  awayTeam={match.away_team}
                  loading={eventsLoading}
                />
              )}

              {activeTab === 'statistics' && (
                <MatchStatisticsTab
                  match={matchWithStats || match}
                />
              )}
            </div>

            {/* Right Sidebar - 380px fixed width */}
            <div className="space-y-6">
              <HeadToHeadMini
                homeTeam={match.home_team}
                awayTeam={match.away_team}
              />
              <TournamentTableMini tourId={match.tour ?? undefined} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
