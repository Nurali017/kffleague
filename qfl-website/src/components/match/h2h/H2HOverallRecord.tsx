'use client';

import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'motion/react';
import { GameTeam } from '@/types';
import { H2HOverallStats } from '@/types/h2h';

interface H2HOverallRecordProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  overall: H2HOverallStats;
  homeColor: string;
  awayColor: string;
}

function ProgressRing({
  value,
  total,
  color,
  sublabel,
  index,
  prefersReducedMotion,
}: {
  value: number;
  total: number;
  color: string;
  sublabel: string;
  index: number;
  prefersReducedMotion: boolean | null;
}) {
  const radius = 37;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? value / total : 0;
  const strokeDashoffset = circumference * (1 - ratio);

  const Wrapper = prefersReducedMotion ? 'div' : motion.div;
  const wrapperProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.6 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true },
        transition: { type: 'spring' as const, stiffness: 260, damping: 20, delay: index * 0.1 },
      };

  return (
    <Wrapper {...wrapperProps} className="flex flex-col items-center gap-1.5">
      <div className="relative w-20 h-20 sm:w-[90px] sm:h-[90px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-none">
            {value}
          </span>
        </div>
      </div>
      <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase">
        /{total} {sublabel}
      </span>
    </Wrapper>
  );
}

export function H2HOverallRecord({
  homeTeam,
  awayTeam,
  overall,
  homeColor,
  awayColor,
}: H2HOverallRecordProps) {
  const { t } = useTranslation('match');
  const prefersReducedMotion = useReducedMotion();

  const homeLogo = homeTeam.logo_url;
  const awayLogo = awayTeam.logo_url;
  const total = overall.total_matches || 1;

  return (
    <div className="bg-[#F5F7F9] dark:bg-gray-800 rounded-2xl p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
          {homeLogo && (
            <img src={homeLogo} alt={homeTeam.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = '/images/placeholders/team.svg'; }} />
          )}
        </div>
        <div className="text-center">
          <h3 className="text-base font-extrabold uppercase tracking-wide text-gray-900 dark:text-white">
            {t('h2h.headToHead', 'HEAD TO HEAD')}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {homeTeam.name} {t('h2h.vs', 'vs')} {awayTeam.name}
          </p>
        </div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
          {awayLogo && (
            <img src={awayLogo} alt={awayTeam.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = '/images/placeholders/team.svg'; }} />
          )}
        </div>
      </div>

      {/* Progress Rings */}
      <div className="flex items-start justify-center gap-4 sm:gap-8 mb-6">
        <ProgressRing
          value={overall.team1_wins}
          total={total}
          color={homeColor}
          sublabel={t('h2h.wins', 'Побед')}
          index={0}
          prefersReducedMotion={prefersReducedMotion}
        />
        <ProgressRing
          value={overall.draws}
          total={total}
          color="#9CA3AF"
          sublabel={t('h2h.draws', 'Ничьих')}
          index={1}
          prefersReducedMotion={prefersReducedMotion}
        />
        <ProgressRing
          value={overall.team2_wins}
          total={total}
          color={awayColor}
          sublabel={t('h2h.wins', 'Побед')}
          index={2}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>
    </div>
  );
}
