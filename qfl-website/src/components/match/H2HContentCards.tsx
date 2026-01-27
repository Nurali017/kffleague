'use client';

import { useTranslation } from 'react-i18next';
import { GameTeam } from '@/types';
import { useH2H } from '@/hooks';
import { computeH2HMetrics } from '@/types/h2h';
import { getTeamColor } from '@/lib/utils/teamLogos';
import {
  H2HDonutChart,
  H2HFormStreak,
  H2HPreviousMeetings,
  H2HSeasonStats,
  H2HSkeleton,
} from './h2h';

interface H2HContentCardsProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  seasonId?: number;
}

export function H2HContentCards({
  homeTeam,
  awayTeam,
  seasonId,
}: H2HContentCardsProps) {
  const { t } = useTranslation('match');

  const { data, loading, error } = useH2H({
    team1Id: homeTeam.id,
    team2Id: awayTeam.id,
    seasonId,
  });

  const homeColor = getTeamColor(homeTeam.id) || '#1E4D8C';
  const awayColor = getTeamColor(awayTeam.id) || '#E5B73B';

  // Loading state
  if (loading) {
    return <H2HSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">!</div>
          <p className="text-gray-600 text-sm">
            {t('h2h.error', 'Ошибка загрузки данных')}
          </p>
          <p className="text-gray-400 text-xs mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="text-center text-gray-500 text-sm">
          {t('h2h.noData', 'Нет данных о предыдущих встречах')}
        </div>
      </div>
    );
  }

  const metrics = computeH2HMetrics(data);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section - Overall Stats with Donut Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <H2HDonutChart
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          overall={data.overall}
          homeColor={homeColor}
          awayColor={awayColor}
        />
      </div>

      {/* Form Guide Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <H2HFormStreak
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          formGuide={data.form_guide}
          homeColor={homeColor}
          awayColor={awayColor}
        />
      </div>

      {/* Two Column Layout - Season Stats & Previous Meetings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Season Stats Comparison */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 text-center">
            {t('h2h.seasonStats', 'Показатели сезона')}
          </h3>
          <H2HSeasonStats
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            seasonTable={data.season_table}
            metrics={metrics}
            homeColor={homeColor}
            awayColor={awayColor}
          />
        </div>

        {/* Previous Meetings History */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 text-center">
            {t('h2h.previousMeetings', 'История встреч')}
          </h3>
          <H2HPreviousMeetings
            meetings={data.previous_meetings}
            homeTeamId={homeTeam.id}
            awayTeamId={awayTeam.id}
          />
        </div>
      </div>
    </div>
  );
}
