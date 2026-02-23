'use client';

import { TournamentAwareLink as Link } from '@/components/navigation/TournamentAwareLink';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'motion/react';
import { GameTeam } from '@/types';
import { H2HOverallStats } from '@/types/h2h';
import { getTeamHref } from '@/lib/utils/entityRoutes';
import { getTeamLogo } from '@/lib/utils/teamLogos';
import { HeroBackground } from '@/components/ui/HeroBackground';

interface H2HDonutChartProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  overall: H2HOverallStats;
  homeColor: string;
  awayColor: string;
}

export function H2HDonutChart({
  homeTeam,
  awayTeam,
  overall,
  homeColor,
  awayColor,
}: H2HDonutChartProps) {
  const { t } = useTranslation('match');
  const prefersReducedMotion = useReducedMotion();

  const homeLogoUrl = homeTeam.logo_url || getTeamLogo(homeTeam.id);
  const awayLogoUrl = awayTeam.logo_url || getTeamLogo(awayTeam.id);
  const homeTeamHref = getTeamHref(homeTeam.id);
  const awayTeamHref = getTeamHref(awayTeam.id);

  const { homePercent, drawPercent, awayPercent } = useMemo(() => {
    const total = overall.total_matches || 1;
    return {
      homePercent: (overall.team1_wins / total) * 100,
      drawPercent: (overall.draws / total) * 100,
      awayPercent: (overall.team2_wins / total) * 100,
    };
  }, [overall]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 10;

  const homeLength = (homePercent / 100) * circumference;
  const drawLength = (drawPercent / 100) * circumference;
  const awayLength = (awayPercent / 100) * circumference;

  const homeOffset = 0;
  const drawOffset = homeLength;
  const awayOffset = homeLength + drawLength;

  const TeamLogo = ({
    logoUrl,
    teamName,
    teamHref,
  }: {
    logoUrl: string | null;
    teamName: string;
    teamHref: string | null;
  }) => {
    const inner = (
      <div className="flex flex-col items-center gap-2 w-20 sm:w-24 group">
        <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={teamName}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-white/20" />
          )}
        </div>
        <span className="text-[10px] sm:text-xs text-white/80 text-center font-bold uppercase leading-tight line-clamp-2 group-hover:text-white transition-colors">
          {teamName}
        </span>
      </div>
    );

    if (teamHref) {
      return <Link href={teamHref}>{inner}</Link>;
    }
    return inner;
  };

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Dark hero background */}
      <HeroBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 sm:gap-6 py-6 sm:py-8 px-4">
        {/* Title */}
        <h3 className="text-xs sm:text-sm font-bold text-white/90 uppercase tracking-widest">
          {t('h2h.title', 'HEAD TO HEAD')}
        </h3>

        {/* Teams and Chart */}
        <div className="flex items-center justify-between w-full max-w-md">
          <TeamLogo logoUrl={homeLogoUrl} teamName={homeTeam.name} teamHref={homeTeamHref} />

          {/* Donut Chart */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={strokeWidth}
              />

              {/* Home wins segment */}
              {prefersReducedMotion ? (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={homeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${homeLength} ${circumference - homeLength}`}
                  strokeDashoffset={-homeOffset}
                />
              ) : (
                <motion.circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={homeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${homeLength} ${circumference - homeLength}`}
                  initial={{ strokeDashoffset: circumference }}
                  whileInView={{ strokeDashoffset: -homeOffset }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              )}

              {/* Draws segment */}
              {prefersReducedMotion ? (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${drawLength} ${circumference - drawLength}`}
                  strokeDashoffset={-drawOffset}
                />
              ) : (
                <motion.circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${drawLength} ${circumference - drawLength}`}
                  initial={{ strokeDashoffset: circumference }}
                  whileInView={{ strokeDashoffset: -drawOffset }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                />
              )}

              {/* Away wins segment */}
              {prefersReducedMotion ? (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={awayColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${awayLength} ${circumference - awayLength}`}
                  strokeDashoffset={-awayOffset}
                />
              ) : (
                <motion.circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={awayColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${awayLength} ${circumference - awayLength}`}
                  initial={{ strokeDashoffset: circumference }}
                  whileInView={{ strokeDashoffset: -awayOffset }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                />
              )}
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {overall.team1_wins}-{overall.draws}-{overall.team2_wins}
              </span>
              <span className="text-[10px] text-white/60 font-medium">
                {overall.total_matches} {t('h2h.totalMatches', 'матчей')}
              </span>
            </div>
          </div>

          <TeamLogo logoUrl={awayLogoUrl} teamName={awayTeam.name} teamHref={awayTeamHref} />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: homeColor }}
            />
            <span className="text-white/70 font-medium">
              {overall.team1_wins} {t('h2h.wins', 'побед')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white/40" />
            <span className="text-white/70 font-medium">
              {overall.draws} {t('h2h.draws', 'ничьих')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: awayColor }}
            />
            <span className="text-white/70 font-medium">
              {overall.team2_wins} {t('h2h.wins', 'побед')}
            </span>
          </div>
        </div>

        {/* Goals summary */}
        <div className="flex items-center justify-center gap-8 pt-3 border-t border-white/10 w-full max-w-xs">
          <div className="text-center">
            <span className="text-lg font-bold" style={{ color: homeColor }}>
              {overall.team1_goals}
            </span>
            <p className="text-[10px] text-white/50 uppercase">
              {t('h2h.goalsScored', 'голов')}
            </p>
          </div>
          <div className="text-white/30 text-sm font-medium">vs</div>
          <div className="text-center">
            <span className="text-lg font-bold" style={{ color: awayColor }}>
              {overall.team2_goals}
            </span>
            <p className="text-[10px] text-white/50 uppercase">
              {t('h2h.goalsScored', 'голов')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
