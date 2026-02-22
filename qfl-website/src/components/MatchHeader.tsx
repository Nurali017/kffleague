'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Calendar, Building, Users, Clock } from 'lucide-react';
import { MatchDetail, EnhancedMatchEvent, PlayerCountry } from '@/types';
import { getTeamLogo, HOME_COLOR, AWAY_COLOR } from '@/lib/utils/teamLogos';
import { formatMatchDayDate } from '@/lib/utils/dateFormat';
import { getTeamHref } from '@/lib/utils/entityRoutes';
import { MatchEventTimeline } from '@/components/match/MatchEventTimeline';
import { WhistleIcon } from '@/components/icons/WhistleIcon';
import { HeroBackground } from '@/components/ui/HeroBackground';

interface MatchHeaderProps {
  match: MatchDetail;
  events?: EnhancedMatchEvent[];
  eventsLoading?: boolean;
  playerCountryMap?: Record<number, PlayerCountry>;
}

export function MatchHeader({ match, events = [], eventsLoading = false, playerCountryMap = {} }: MatchHeaderProps) {
  const { t, i18n } = useTranslation('match');

  const homeLogoUrl = match.home_team.logo_url || getTeamLogo(match.home_team.id);
  const awayLogoUrl = match.away_team.logo_url || getTeamLogo(match.away_team.id);
  const homeColor = HOME_COLOR;
  const awayColor = AWAY_COLOR;
  const homeTeamHref = getTeamHref(match.home_team.id);
  const awayTeamHref = getTeamHref(match.away_team.id);

  const hasScore = match.home_score !== undefined && match.away_score !== undefined;
  const isLive = match.is_live || match.status === 'live';

  return (
    <div className="relative overflow-hidden" style={{ minHeight: '280px' }}>
      <HeroBackground />

      <div className="relative z-10 max-w-[1440px] mx-auto px-3 sm:px-4 md:px-20 py-5 md:py-8">

        {/* Match Information Bar */}
        <div className="mb-6 md:mb-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:gap-4 text-xs md:text-sm text-white/80">
          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/60" />
            <span>{formatMatchDayDate(match.date, i18n.language)}</span>
          </div>

          {/* Kick Off Time */}
          {match.time && (
            <>
              <span className="hidden md:inline w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/60" />
                <span>Kick Off: {match.time}</span>
              </div>
            </>
          )}

          {/* Stadium */}
          {match.stadium && (
            <>
              <span className="hidden md:inline w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-white/60" />
                <span>
                  {match.stadium.name}
                  {match.stadium.city ? `, ${match.stadium.city}` : ''}
                </span>
              </div>
            </>
          )}

          {/* Attendance */}
          {match.visitors && (
            <>
              <span className="hidden md:inline w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-white/60" />
                <span>Attendance: {match.visitors.toLocaleString(i18n.language === 'en' ? 'en-US' : i18n.language === 'kz' ? 'kk-KZ' : 'ru-RU')}</span>
              </div>
            </>
          )}

          {/* Referee */}
          {match.referee && (
            <>
              <span className="hidden md:inline w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2">
                <WhistleIcon className="w-4 h-4 text-white/60" />
                <span>Ref: {match.referee}</span>
              </div>
            </>
          )}
        </div>

        {/* Level 3: Main Score (Center) */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 md:gap-12 max-w-4xl mx-auto">

          {/* Home Team */}
          {homeTeamHref ? (
            <Link
              href={homeTeamHref}
              className="flex flex-col items-center text-center group min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <div className="relative mb-4">
                <div
                  className="w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-105"
                >
                  {homeLogoUrl ? (
                    <img
                      src={homeLogoUrl}
                      alt={match.home_team.name}
                      className="w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain drop-shadow-2xl"
                    />
                  ) : (
                    <span className="text-2xl font-bold" style={{ color: homeColor }}>
                      {match.home_team.name[0]}
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-sm sm:text-xl md:text-3xl font-bold text-white tracking-tight leading-tight mb-1 max-w-full break-words group-hover:text-accent transition-colors">
                {match.home_team.name}
              </h2>
              <p className="text-[11px] sm:text-sm font-medium text-white/50">{t('home')}</p>
            </Link>
          ) : (
            <div className="flex flex-col items-center text-center group min-w-0">
              <div className="relative mb-4">
                <div
                  className="w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-105"
                >
                  {homeLogoUrl ? (
                    <img
                      src={homeLogoUrl}
                      alt={match.home_team.name}
                      className="w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain drop-shadow-2xl"
                    />
                  ) : (
                    <span className="text-2xl font-bold" style={{ color: homeColor }}>
                      {match.home_team.name[0]}
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-sm sm:text-xl md:text-3xl font-bold text-white tracking-tight leading-tight mb-1 max-w-full break-words">
                {match.home_team.name}
              </h2>
              <p className="text-[11px] sm:text-sm font-medium text-white/50">{t('home')}</p>
            </div>
          )}

          {/* Score / Status */}
          <div className="flex flex-col items-center justify-center min-w-[86px] sm:min-w-[120px] md:min-w-[180px]">
            {hasScore ? (
              <>
                <div className="text-3xl sm:text-6xl md:text-[80px] font-black text-white leading-none tracking-tighter flex items-center gap-2 sm:gap-4 drop-shadow-2xl">
                  <span>{match.home_score}</span>
                  <span className="text-white/20 text-2xl sm:text-4xl md:text-6xl align-top">-</span>
                  <span>{match.away_score}</span>
                </div>

                {isLive ? (
                  <div className="mt-2 sm:mt-4 flex items-center gap-2 bg-green-500 px-2.5 py-1 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {match.minute ? `${match.minute}'` : 'LIVE'}
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 sm:mt-4 px-2.5 py-1 rounded bg-white/10 text-white/70 text-[10px] sm:text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
                    {match.status === 'finished' ? t('finished') : match.status}
                  </div>
                )}
                {match.is_technical && (
                  <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-orange-400 font-medium">
                    Техническая победа
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="text-3xl md:text-6xl font-bold text-white mb-2">
                  {match.time || '—'}
                </div>
                <div className="px-2.5 py-1 rounded bg-accent text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  {t('upcoming')}
                </div>
              </div>
            )}
          </div>

          {/* Away Team */}
          {awayTeamHref ? (
            <Link
              href={awayTeamHref}
              className="flex flex-col items-center text-center group min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <div className="relative mb-4">
                <div
                  className="w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-105"
                >
                  {awayLogoUrl ? (
                    <img
                      src={awayLogoUrl}
                      alt={match.away_team.name}
                      className="w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain drop-shadow-2xl"
                    />
                  ) : (
                    <span className="text-2xl font-bold" style={{ color: awayColor }}>
                      {match.away_team.name[0]}
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-sm sm:text-xl md:text-3xl font-bold text-white tracking-tight leading-tight mb-1 max-w-full break-words group-hover:text-accent transition-colors">
                {match.away_team.name}
              </h2>
              <p className="text-[11px] sm:text-sm font-medium text-white/50">{t('away')}</p>
            </Link>
          ) : (
            <div className="flex flex-col items-center text-center group min-w-0">
              <div className="relative mb-4">
                <div
                  className="w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-105"
                >
                  {awayLogoUrl ? (
                    <img
                      src={awayLogoUrl}
                      alt={match.away_team.name}
                      className="w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain drop-shadow-2xl"
                    />
                  ) : (
                    <span className="text-2xl font-bold" style={{ color: awayColor }}>
                      {match.away_team.name[0]}
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-sm sm:text-xl md:text-3xl font-bold text-white tracking-tight leading-tight mb-1 max-w-full break-words">
                {match.away_team.name}
              </h2>
              <p className="text-[11px] sm:text-sm font-medium text-white/50">{t('away')}</p>
            </div>
          )}
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
          playerCountryMap={playerCountryMap}
        />
      </div>
    </div>
  );
}
