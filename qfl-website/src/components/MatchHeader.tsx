'use client';

import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Users, User } from 'lucide-react';
import { MatchDetail, EnhancedMatchEvent } from '@/types';
import { getTeamLogo, getTeamColor } from '@/lib/utils/teamLogos';
import { formatMatchDate } from '@/lib/utils/dateFormat';
import { MatchEventTimeline } from '@/components/match/MatchEventTimeline';
import { Breadcrumbs } from '@/components/match/Breadcrumbs';
import { LeagueBadge } from '@/components/match/LeagueBadge';

interface MatchHeaderProps {
  match: MatchDetail;
  events?: EnhancedMatchEvent[];
  eventsLoading?: boolean;
}

export function MatchHeader({ match, events = [], eventsLoading = false }: MatchHeaderProps) {
  const { t, i18n } = useTranslation('match');

  const homeLogoUrl = match.home_team.logo_url || getTeamLogo(match.home_team.id);
  const awayLogoUrl = match.away_team.logo_url || getTeamLogo(match.away_team.id);
  const homeColor = getTeamColor(match.home_team.id); // Typically blue for home
  const awayColor = getTeamColor(match.away_team.id); // Typically gold/yellow for away

  const hasScore = match.home_score !== undefined && match.away_score !== undefined;
  const isLive = match.is_live || match.status === 'live';

  return (
    <div className="relative overflow-hidden" style={{ minHeight: '280px' }}>
      {/* Base gradient background - darker version */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0a1929] via-[#1E4D8C] to-[#1a3a5c]" />

      {/* Geometric pattern overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: 'url(/footer-bg.webp)' }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-20 py-6 md:py-8">

        {/* Level 1: Context (Top Row) */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <Breadcrumbs
            items={[
              { label: 'Премьер-Лига', href: '/league' },
              { label: `Тур ${match.tour}` }
            ]}
          />
        </div>

        {/* Level 2: Details */}
        <div className="mb-8 md:mb-12 flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatMatchDate(match.date, i18n.language)}</span>
          </div>

          {match.stadium && (
            <>
              <span className="hidden md:inline w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{match.stadium.name}</span>
              </div>
            </>
          )}
        </div>

        {/* Level 3: Main Score (Center) */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-12 max-w-4xl mx-auto">

          {/* Home Team */}
          <div className="flex flex-col items-center text-center group">
            <div className="relative mb-4">
              <div
                className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105"
              >
                {homeLogoUrl ? (
                  <img
                    src={homeLogoUrl}
                    alt={match.home_team.name}
                    className="w-14 h-14 md:w-20 md:h-20 object-contain"
                  />
                ) : (
                  <span className="text-2xl font-bold" style={{ color: homeColor }}>
                    {match.home_team.name[0]}
                  </span>
                )}
              </div>
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl scale-110 -z-10" />
            </div>

            <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight leading-none mb-1">
              {match.home_team.name}
            </h2>
            <p className="text-sm font-medium text-white/50">{t('home')}</p>
          </div>

          {/* Score / Status */}
          <div className="flex flex-col items-center justify-center min-w-[120px] md:min-w-[180px]">
            {hasScore ? (
              <>
                <div className="text-6xl md:text-[80px] font-black text-white leading-none tracking-tighter flex items-center gap-4 drop-shadow-2xl">
                  <span>{match.home_score}</span>
                  <span className="text-white/20 text-4xl md:text-6xl align-top">-</span>
                  <span>{match.away_score}</span>
                </div>

                {isLive ? (
                  <div className="mt-4 flex items-center gap-2 bg-green-500 px-3 py-1 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {match.minute ? `${match.minute}'` : 'LIVE'}
                    </span>
                  </div>
                ) : (
                  <div className="mt-4 px-3 py-1 rounded bg-white/10 text-white/70 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
                    {match.status === 'finished' ? t('finished') : match.status}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="text-4xl md:text-6xl font-bold text-white mb-2">
                  {match.time || '—'}
                </div>
                <div className="px-3 py-1 rounded bg-[#E5B73B] text-[#1E4D8C] text-xs font-bold uppercase tracking-wider">
                  {t('upcoming')}
                </div>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center text-center group">
            <div className="relative mb-4">
              <div
                className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105"
              >
                {awayLogoUrl ? (
                  <img
                    src={awayLogoUrl}
                    alt={match.away_team.name}
                    className="w-14 h-14 md:w-20 md:h-20 object-contain"
                  />
                ) : (
                  <span className="text-2xl font-bold" style={{ color: awayColor }}>
                    {match.away_team.name[0]}
                  </span>
                )}
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-yellow-500/20 blur-xl scale-110 -z-10" />
            </div>

            <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight leading-none mb-1">
              {match.away_team.name}
            </h2>
            <p className="text-sm font-medium text-white/50">{t('away')}</p>
          </div>
        </div>
      </div>

      {/* Timeline Component attaches to bottom */}
      <div className="relative z-20 mt-4">
        <MatchEventTimeline
          events={events}
          homeTeam={match.home_team}
          awayTeam={match.away_team}
          currentMinute={match.minute || (match.status === 'finished' ? 90 : 0)}
          loading={eventsLoading}
        />
      </div>
    </div>
  );
}
