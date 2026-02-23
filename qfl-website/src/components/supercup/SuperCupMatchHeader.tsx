'use client';

import { TournamentAwareLink as Link } from '@/components/navigation/TournamentAwareLink';
import { useTranslation } from 'react-i18next';
import { Calendar, Building, Users, Clock, ArrowRight } from 'lucide-react';
import { SUPER_CUP_FEATURED_MATCH } from '@/config/featuredMatch';
import { MatchDetail, EnhancedMatchEvent, PlayerCountry } from '@/types';
import { getTeamLogo } from '@/lib/utils/teamLogos';
import { formatMatchDayDate, formatMatchTime } from '@/lib/utils/dateFormat';
import { getTeamHref } from '@/lib/utils/entityRoutes';
import { MatchEventTimeline } from '@/components/match/MatchEventTimeline';
import { WhistleIcon } from '@/components/icons/WhistleIcon';

interface SuperCupMatchHeaderProps {
  match: MatchDetail;
  events?: EnhancedMatchEvent[];
  eventsLoading?: boolean;
  playerCountryMap?: Record<number, PlayerCountry>;
}

export function SuperCupMatchHeader({
  match,
  events = [],
  eventsLoading = false,
  playerCountryMap = {},
}: SuperCupMatchHeaderProps) {
  const { t, i18n } = useTranslation('match');
  const displayTime = formatMatchTime(match.time) || match.time;

  const homeLogoUrl = match.home_team.logo_url || getTeamLogo(match.home_team.id);
  const awayLogoUrl = match.away_team.logo_url || getTeamLogo(match.away_team.id);
  const homeTeamHref = getTeamHref(match.home_team.id);
  const awayTeamHref = getTeamHref(match.away_team.id);

  const hasScore = match.home_score !== undefined && match.away_score !== undefined;
  const isLive = match.is_live || match.status === 'live';

  const TeamLogo = ({ src, alt, href }: { src: string | null; alt: string; href: string | null }) => {
    const img = (
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-2xl animate-sc-pulse-glow" />
        <div className="animate-sc-float relative">
          {src ? (
            <img
              src={src}
              alt={alt}
              className="w-14 h-14 sm:w-20 sm:h-20 md:w-36 md:h-36 object-contain drop-shadow-[0_4px_24px_rgba(251,191,36,0.3)]"
            />
          ) : (
            <span className="text-2xl font-bold text-amber-400">{alt[0]}</span>
          )}
        </div>
      </div>
    );

    if (href) {
      return (
        <Link href={href} className="flex flex-col items-center text-center group min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70">
          <div className="relative mb-2 md:mb-4 transition-transform duration-500 group-hover:scale-105">
            {img}
          </div>
          <h2 className="text-[13px] sm:text-lg md:text-3xl font-bold text-white tracking-tight leading-tight mb-1 max-w-[120px] sm:max-w-[190px] md:max-w-full break-words group-hover:text-amber-400 transition-colors">
            {alt}
          </h2>
        </Link>
      );
    }

    return (
      <div className="flex flex-col items-center text-center min-w-0">
        <div className="relative mb-2 md:mb-4">{img}</div>
        <h2 className="text-[13px] sm:text-lg md:text-3xl font-bold text-white tracking-tight leading-tight mb-1 max-w-[120px] sm:max-w-[190px] md:max-w-full break-words">
          {alt}
        </h2>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden" style={{ minHeight: '280px' }}>
      {/* Poster background */}
      <img
        src="/images/supercup-hero-poster.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-[center_35%] pointer-events-none select-none"
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-3 sm:px-4 md:px-10 lg:px-20 py-4 md:py-8">

        {/* Super Cup badge + quick info */}
        <div className="mb-4 md:mb-10 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-amber-400/5 text-amber-400 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full w-fit backdrop-blur-sm ring-1 ring-amber-400/30">
            <img src="/images/tournaments/sc.png" alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase">
              {t('superCupHero.badge', 'The Super Cup')}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 md:gap-4 text-[11px] md:text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400/60" />
              <span>{formatMatchDayDate(match.date, i18n.language)}</span>
            </div>
            {match.time && (
              <>
                <span className="w-1 h-1 rounded-full bg-amber-400/30" />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400/60" />
                  <span>Kick Off: {displayTime}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Teams + Score */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 md:gap-12 max-w-4xl mx-auto">
          <TeamLogo src={homeLogoUrl} alt={match.home_team.name} href={homeTeamHref} />

          {/* Score / Status */}
          <div className="flex flex-col items-center justify-center min-w-[72px] sm:min-w-[120px] md:min-w-[180px]">
            {hasScore ? (
              <>
                <div className="text-[34px] sm:text-6xl md:text-[80px] font-black text-white leading-none tracking-tighter flex items-center gap-1.5 sm:gap-4 drop-shadow-2xl">
                  <span>{match.home_score}</span>
                  <span className="text-amber-400/30 text-xl sm:text-4xl md:text-6xl align-top">-</span>
                  <span>{match.away_score}</span>
                </div>

                {isLive ? (
                  <div className="mt-1.5 sm:mt-4 flex items-center gap-2 bg-green-500 px-2.5 py-1 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {match.minute ? `${match.minute}'` : 'LIVE'}
                    </span>
                  </div>
                ) : (
                  <div className="mt-1.5 sm:mt-4 px-2.5 py-1 rounded bg-amber-400/15 text-amber-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider backdrop-blur-sm border border-amber-400/20">
                    {match.status === 'finished' ? t('finished') : match.status}
                  </div>
                )}
                {match.is_technical && (
                  <div className="mt-1 text-xs sm:text-sm text-orange-400 font-medium">
                    Техническая победа
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="text-[34px] md:text-6xl font-bold text-white mb-1.5 md:mb-2">
                  {displayTime || '—'}
                </div>
                <div className="px-2.5 py-1 rounded bg-amber-400/15 text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-amber-400/20">
                  {t('upcoming')}
                </div>
              </div>
            )}
          </div>

          <TeamLogo src={awayLogoUrl} alt={match.away_team.name} href={awayTeamHref} />
        </div>

        {/* Ticket CTA */}
        {(() => {
          const ticketHref = match.ticket_url || SUPER_CUP_FEATURED_MATCH.canonicalTicketUrl;
          return ticketHref ? (
            <div className="flex justify-center mt-4 md:mt-6">
              <a
                href={ticketHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white/90 hover:bg-white text-[#0a1628] px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-[11px] sm:text-[13px] transition-all uppercase tracking-wider shadow-lg shadow-white/20 hover:shadow-white/40"
              >
                {t('superCupHero.ticketCta', 'Купить билет')}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : null;
        })()}

        {(match.stadium || match.visitors || match.referee) && (
          <div className="mt-4 md:mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {match.stadium && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-black/30 px-2.5 py-1 text-[11px] md:text-xs text-white/80">
                <Building className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                <span>{match.stadium.name}{match.stadium.city ? `, ${match.stadium.city}` : ''}</span>
              </div>
            )}
            {match.visitors && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-black/30 px-2.5 py-1 text-[11px] md:text-xs text-white/80">
                <Users className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                <span>{match.visitors.toLocaleString(i18n.language === 'kz' ? 'kk-KZ' : 'ru-RU')}</span>
              </div>
            )}
            {match.referee && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-black/30 px-2.5 py-1 text-[11px] md:text-xs text-white/80">
                <WhistleIcon className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                <span>{match.referee}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="relative z-20 mt-4 hidden md:block">
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
