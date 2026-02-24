'use client';

import { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
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
      <div className="min-w-[48px] rounded-lg border border-white/20 bg-black/60 px-2 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] backdrop-blur-md sm:min-w-[72px] sm:rounded-xl sm:px-4 sm:py-3 lg:min-w-[80px] lg:px-5 lg:py-4">
        <span
          className="block text-center text-xl font-black leading-none tabular-nums text-white sm:text-3xl lg:text-4xl"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/60 sm:mt-1.5 sm:text-xs">
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
  const countdownUnits = [
    { value: countdown.days, label: t('superCupHero.countdownDays', 'дн') },
    { value: countdown.hours, label: t('superCupHero.countdownHours', 'ч') },
    { value: countdown.minutes, label: t('superCupHero.countdownMinutes', 'мин') },
    { value: countdown.seconds, label: t('superCupHero.countdownSeconds', 'сек') },
  ];

  return (
    <motion.div
      variants={heroContainer}
      initial="hidden"
      animate="visible"
      className="relative flex h-full w-full flex-col overflow-hidden rounded-xl shadow-xl sm:rounded-2xl"
    >
      {/* ── Poster background ── */}
      <img
        src="/images/supercup-hero-poster.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-[center_35%] pointer-events-none select-none"
      />

      {/* ── Layered overlay for readability ── */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/90 via-black/68 to-black/78" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_90%_at_0%_50%,rgba(245,158,11,0.30)_0%,rgba(0,0,0,0)_66%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_90%_at_100%_50%,rgba(34,197,94,0.28)_0%,rgba(0,0,0,0)_66%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(95%_65%_at_50%_52%,rgba(0,0,0,0.00)_30%,rgba(0,0,0,0.40)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[44%] pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* ── Content ── */}
      <div className="relative z-10 flex h-full flex-col justify-between p-3.5 sm:p-5 lg:p-8">

        {/* TOP: Badge + metadata */}
        <motion.div variants={badgeSlideDown} className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-white/20 to-white/10 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full w-fit backdrop-blur-md ring-1 ring-white/20">
            <img src="/images/tournaments/sc.png" alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase">
              {t('superCupHero.badge', SUPER_CUP_FEATURED_MATCH.heroTitle)}
            </span>
          </div>

          <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold tracking-wide text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] sm:text-[13px]">
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
                <span className="max-w-[190px] truncate sm:max-w-none">{stadiumLabel}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* MIDDLE: Teams + VS */}
        <div className="my-auto flex flex-row items-center justify-center gap-4 sm:gap-10 lg:gap-16">
          {/* Home team */}
          <motion.div variants={teamLogoLeft}>
            <Link href={getTeamHref(featuredGame.home_team.id) || '#'} className="group flex max-w-[124px] flex-col items-center gap-1.5 sm:max-w-none sm:gap-3">
              <div className="relative flex h-16 w-16 items-center justify-center sm:h-28 sm:w-28 lg:h-36 lg:w-36">
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
              <span className="line-clamp-2 text-center text-[13px] font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-colors group-hover:text-amber-400 sm:text-lg sm:font-bold lg:text-xl">
                {featuredGame.home_team.name}
              </span>
            </Link>
          </motion.div>

          {/* VS badge */}
          <motion.div variants={vsBadge}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 sm:h-16 sm:w-16 lg:h-18 lg:w-18">
              <span className="text-base font-black italic tracking-widest text-white sm:text-2xl lg:text-2xl">VS</span>
            </div>
          </motion.div>

          {/* Away team */}
          <motion.div variants={teamLogoRight}>
            <Link href={getTeamHref(featuredGame.away_team.id) || '#'} className="group flex max-w-[124px] flex-col items-center gap-1.5 sm:max-w-none sm:gap-3">
              <div className="relative flex h-16 w-16 items-center justify-center sm:h-28 sm:w-28 lg:h-36 lg:w-36">
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
              <span className="line-clamp-2 text-center text-[13px] font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-colors group-hover:text-amber-400 sm:text-lg sm:font-bold lg:text-xl">
                {featuredGame.away_team.name}
              </span>
            </Link>
          </motion.div>
        </div>

        {/* BOTTOM: Countdown + CTA buttons */}
        <div className="flex flex-col items-center">
          <div
            data-testid="supercup-bottom-backplate"
            className="flex w-full max-w-[360px] flex-col gap-2.5 rounded-2xl border border-white/15 bg-black/44 px-2.5 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md sm:max-w-[480px] sm:gap-3 sm:px-4 sm:py-3 lg:max-w-[520px]"
          >
            {/* Countdown timer */}
            {!countdown.isExpired && (
              <motion.div variants={countdownReveal} className="flex w-full flex-col items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs text-white/60 font-bold uppercase tracking-widest">
                  {t('superCupHero.countdownLabel', 'До начала матча')}
                </span>
                <div
                  className="grid w-full max-w-[280px] grid-cols-4 gap-2 sm:flex sm:w-auto sm:max-w-none sm:items-center sm:gap-3"
                  aria-label={t('superCupHero.countdownLabel', 'До начала матча')}
                >
                  {countdownUnits.map((unit, index) => (
                    <Fragment key={unit.label}>
                      {index > 0 && (
                        <span className="mt-3 hidden self-start text-3xl font-black text-white/40 animate-sc-separator-blink sm:block lg:mt-4 lg:text-4xl">:</span>
                      )}
                      <CountdownUnit value={unit.value} label={unit.label} />
                    </Fragment>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA buttons */}
            <motion.div variants={buttonsSlideUp} className="flex w-full flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
              {ticketHref && (
                <a
                  href={ticketHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/90 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-[#0a1628] shadow-lg shadow-white/20 transition-all hover:bg-white hover:shadow-white/40 sm:flex-1 sm:max-w-[220px] sm:px-6 sm:py-3 sm:text-[13px]"
                >
                  {t('superCupHero.ticketCta', 'Купить билет')}
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </a>
              )}
              <Link
                href={matchHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.24] bg-white/[0.14] px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:border-white/[0.3] hover:bg-white/[0.2] sm:flex-1 sm:max-w-[220px] sm:px-6 sm:py-3 sm:text-[13px]"
              >
                {t('superCupHero.matchCta', 'Открыть матч')}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
