'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { TournamentAwareLink as Link } from '@/components/navigation/TournamentAwareLink';
import { useTranslation } from 'react-i18next';
import { HeroSection } from '@/components/HeroSection';
import { HeroSkeleton } from '@/components/ui/Skeleton';
import { useTournament } from '@/contexts/TournamentContext';
import { useMatchCenter } from '@/hooks';
import { formatMatchDate } from '@/lib/utils/dateFormat';
import { getTeamLogo } from '@/lib/utils/teamLogos';
import { getMatchHref, getTeamHref } from '@/lib/utils/entityRoutes';
import { SUPER_CUP_FEATURED_MATCH } from '@/config/featuredMatch';
import { motion } from 'motion/react';

/* ── Motion variants ── */

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const badgeSlideDown = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } },
};

const teamLogoLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 22 } },
};

const teamLogoRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 22 } },
};

const vsBadge = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 14 } },
};

const buttonsSlideUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 220, damping: 20 } },
};

const countdownReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 22, delay: 0.2 } },
};

/* ── Countdown hook ── */

function useCountdown(targetIso: string) {
  const targetMs = useMemo(() => new Date(targetIso).getTime(), [targetIso]);

  const calcRemaining = useCallback(() => {
    const diff = Math.max(0, targetMs - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isExpired: diff <= 0,
    };
  }, [targetMs]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const id = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, [calcRemaining]);

  return remaining;
}

/* ── Countdown unit sub-component ── */

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 sm:px-4 sm:py-3 lg:px-5 lg:py-4 min-w-[52px] sm:min-w-[68px] lg:min-w-[80px]">
        <span
          className="block text-center text-2xl sm:text-3xl lg:text-4xl font-black text-white tabular-nums leading-none"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-1.5 text-[10px] sm:text-xs text-white/50 font-bold uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

/* ── Helpers ── */

function formatKickoffTime(raw: string | null): string | null {
  if (!raw) return null;
  if (raw.length >= 5) return raw.slice(0, 5);
  return raw;
}

/* ── Component ── */

export function SuperCupHero() {
  const { t, i18n } = useTranslation('match');
  const { effectiveSeasonId } = useTournament();

  const { groups, loading, error } = useMatchCenter({
    season_id: effectiveSeasonId,
    date_from: SUPER_CUP_FEATURED_MATCH.date,
    date_to: SUPER_CUP_FEATURED_MATCH.date,
    team_ids: [SUPER_CUP_FEATURED_MATCH.homeTeamId, SUPER_CUP_FEATURED_MATCH.awayTeamId],
    group_by_date: true,
    status: 'all',
  });

  const countdown = useCountdown(SUPER_CUP_FEATURED_MATCH.kickoffTime);

  const games = groups.flatMap((group) => group.games);
  const featuredGame =
    games.find(
      (game) =>
        game.home_team.id === SUPER_CUP_FEATURED_MATCH.homeTeamId &&
        game.away_team.id === SUPER_CUP_FEATURED_MATCH.awayTeamId
    ) ??
    games.find((game) => {
      const ids = [game.home_team.id, game.away_team.id].sort((a, b) => a - b);
      return (
        ids[0] === Math.min(SUPER_CUP_FEATURED_MATCH.homeTeamId, SUPER_CUP_FEATURED_MATCH.awayTeamId) &&
        ids[1] === Math.max(SUPER_CUP_FEATURED_MATCH.homeTeamId, SUPER_CUP_FEATURED_MATCH.awayTeamId)
      );
    });

  if (loading) {
    return <HeroSkeleton />;
  }

  if (error || !featuredGame) {
    return <HeroSection />;
  }

  const matchHref = getMatchHref(featuredGame.id) ?? '/matches';
  const dateLabel = formatMatchDate(featuredGame.date, i18n.language);
  const timeLabel = formatKickoffTime(featuredGame.time);
  const stadiumLabel = featuredGame.stadium?.name ?? featuredGame.stadium?.city ?? null;

  const homeLogo = featuredGame.home_team.logo_url || getTeamLogo(featuredGame.home_team.id) || '/images/team-placeholder.png';
  const awayLogo = featuredGame.away_team.logo_url || getTeamLogo(featuredGame.away_team.id) || '/images/team-placeholder.png';

  const ticketHref = featuredGame.ticket_url || null;

  return (
    <motion.div
      variants={heroContainer}
      initial="hidden"
      animate="visible"
      className="relative h-full w-full overflow-hidden rounded-2xl flex flex-col shadow-xl"
    >
      {/* ── Poster background ── */}
      <img
        src="/images/supercup-hero-poster.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-[center_35%] pointer-events-none select-none"
      />

      {/* ── Dark gradient overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/30" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-5 lg:p-8">

        {/* TOP: Badge + metadata */}
        <motion.div variants={badgeSlideDown} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-white/15 to-white/5 text-white/90 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full w-fit backdrop-blur-sm ring-1 ring-white/15">
            <img src="/images/tournaments/sc.png" alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase">
              {t('superCupHero.badge', SUPER_CUP_FEATURED_MATCH.heroTitle)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-[13px] text-white/60 font-medium tracking-wide">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateLabel}</span>
            </div>
            {timeLabel && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLabel}</span>
              </div>
            )}
            {stadiumLabel && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{stadiumLabel}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* MIDDLE: Teams + VS */}
        <div className="flex flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-16 my-4 sm:my-6">
          {/* Home team */}
          <motion.div variants={teamLogoLeft}>
            <Link href={getTeamHref(featuredGame.home_team.id) || '#'} className="flex flex-col items-center gap-2 sm:gap-3 group">
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-2xl animate-sc-pulse-glow" />
                <div className="animate-sc-float relative transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={homeLogo}
                    alt={featuredGame.home_team.name}
                    className="max-w-full max-h-full object-contain drop-shadow-[0_4px_24px_rgba(251,191,36,0.3)]"
                    onError={(e) => { e.currentTarget.src = '/images/team-placeholder.png'; }}
                  />
                </div>
              </div>
              <span className="text-white font-bold text-sm sm:text-lg lg:text-xl text-center tracking-tight leading-tight drop-shadow-lg group-hover:text-amber-400 transition-colors">
                {featuredGame.home_team.name}
              </span>
            </Link>
          </motion.div>

          {/* VS badge */}
          <motion.div variants={vsBadge}>
            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-white font-black text-lg sm:text-2xl lg:text-2xl italic tracking-widest">VS</span>
            </div>
          </motion.div>

          {/* Away team */}
          <motion.div variants={teamLogoRight}>
            <Link href={getTeamHref(featuredGame.away_team.id) || '#'} className="flex flex-col items-center gap-2 sm:gap-3 group">
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-2xl animate-sc-pulse-glow" />
                <div className="animate-sc-float relative transition-transform duration-300 group-hover:scale-105" style={{ animationDelay: '1s' }}>
                  <img
                    src={awayLogo}
                    alt={featuredGame.away_team.name}
                    className="max-w-full max-h-full object-contain drop-shadow-[0_4px_24px_rgba(251,191,36,0.3)]"
                    onError={(e) => { e.currentTarget.src = '/images/team-placeholder.png'; }}
                  />
                </div>
              </div>
              <span className="text-white font-bold text-sm sm:text-lg lg:text-xl text-center tracking-tight leading-tight drop-shadow-lg group-hover:text-amber-400 transition-colors">
                {featuredGame.away_team.name}
              </span>
            </Link>
          </motion.div>
        </div>

        {/* BOTTOM: Countdown + CTA buttons */}
        <div className="flex flex-col items-center gap-4 sm:gap-5">
          {/* Countdown timer */}
          {!countdown.isExpired && (
            <motion.div variants={countdownReveal} className="flex flex-col items-center gap-2">
              <span className="text-[10px] sm:text-xs text-white/40 font-bold uppercase tracking-widest">
                {t('superCupHero.countdownLabel', 'До начала матча')}
              </span>
              <div className="flex items-center gap-2 sm:gap-3" aria-label={t('superCupHero.countdownLabel', 'До начала матча')}>
                <CountdownUnit value={countdown.days} label={t('superCupHero.countdownDays', 'дн')} />
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white/40 animate-sc-separator-blink self-start mt-2 sm:mt-3 lg:mt-4">:</span>
                <CountdownUnit value={countdown.hours} label={t('superCupHero.countdownHours', 'ч')} />
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white/40 animate-sc-separator-blink self-start mt-2 sm:mt-3 lg:mt-4">:</span>
                <CountdownUnit value={countdown.minutes} label={t('superCupHero.countdownMinutes', 'мин')} />
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white/40 animate-sc-separator-blink self-start mt-2 sm:mt-3 lg:mt-4">:</span>
                <CountdownUnit value={countdown.seconds} label={t('superCupHero.countdownSeconds', 'сек')} />
              </div>
            </motion.div>
          )}

          {/* CTA buttons */}
          <motion.div variants={buttonsSlideUp} className="flex flex-row items-center gap-3">
            {ticketHref && (
              <a
                href={ticketHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 sm:flex-none justify-center items-center gap-2 bg-white/90 hover:bg-white text-[#0a1628] px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-[12px] sm:text-[13px] transition-all uppercase tracking-wider shadow-lg shadow-white/20 hover:shadow-white/40"
              >
                {t('superCupHero.ticketCta', 'Купить билет')}
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>
            )}
            <Link
              href={matchHref}
              className="inline-flex flex-1 sm:flex-none justify-center items-center gap-2 bg-white/[0.07] hover:bg-white/[0.12] backdrop-blur-md border border-white/[0.1] hover:border-white/[0.18] text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-[12px] sm:text-[13px] transition-all uppercase tracking-wider"
            >
              {t('superCupHero.matchCta', 'Открыть матч')}
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
