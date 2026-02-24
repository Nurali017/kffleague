'use client';

import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'motion/react';
import { GameTeam } from '@/types';
import { FormGuide, FormGuideMatch } from '@/types/h2h';
import { getTeamInitials } from '@/lib/utils/teamLogos';

interface H2HFormGuideProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  formGuide: { team1: FormGuide; team2: FormGuide };
  homeColor: string;
  awayColor: string;
}

function getResultColor(result: 'W' | 'D' | 'L'): string {
  switch (result) {
    case 'W': return '#22C55E';
    case 'L': return '#EF4444';
    case 'D': return '#9CA3AF';
  }
}

function getOpponentResultColor(result: 'W' | 'D' | 'L'): string {
  switch (result) {
    case 'W': return '#EF4444';
    case 'L': return '#22C55E';
    case 'D': return '#9CA3AF';
  }
}

function MatchRow({
  match,
  teamLogoUrl,
  teamName,
  index,
  prefersReducedMotion,
}: {
  match: FormGuideMatch;
  teamLogoUrl: string | null | undefined;
  teamName: string;
  index: number;
  prefersReducedMotion: boolean | null;
}) {
  const teamLogo = teamLogoUrl;
  const oppLogo = match.opponent_logo_url;
  const teamAbbrev = getTeamInitials(teamName);
  const oppAbbrev = getTeamInitials(match.opponent_name);

  const teamScore = match.was_home ? match.home_score : match.away_score;
  const oppScore = match.was_home ? match.away_score : match.home_score;

  const resultColor = getResultColor(match.result);
  const oppResultColor = getOpponentResultColor(match.result);

  const Wrapper = prefersReducedMotion ? 'div' : motion.div;
  const wrapperProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: -12 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        transition: { duration: 0.3, delay: index * 0.06, ease: 'easeOut' as const },
      };

  return (
    <Wrapper {...wrapperProps} className="flex items-center gap-1.5 sm:gap-2 py-1.5">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-9 sm:w-10 text-right truncate uppercase">
        {teamAbbrev}
      </span>
      <div className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0">
        {teamLogo ? (
          <img src={teamLogo} alt={teamName} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = '/images/placeholders/team.svg'; }} />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600" />
        )}
      </div>
      <div
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0"
        style={{ backgroundColor: resultColor }}
      >
        {teamScore ?? '-'}
      </div>
      <div
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0"
        style={{ backgroundColor: oppResultColor }}
      >
        {oppScore ?? '-'}
      </div>
      <div className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0">
        {oppLogo ? (
          <img src={oppLogo} alt={match.opponent_name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = '/images/placeholders/team.svg'; }} />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600" />
        )}
      </div>
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-9 sm:w-10 truncate uppercase">
        {oppAbbrev}
      </span>
    </Wrapper>
  );
}

function TeamFormColumn({
  team,
  formGuide,
  prefersReducedMotion,
}: {
  team: GameTeam;
  formGuide: FormGuide;
  prefersReducedMotion: boolean | null;
}) {
  const teamLogo = team.logo_url;
  const matches = formGuide.matches.slice(0, 5);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        {teamLogo && (
          <img src={teamLogo} alt={team.name} className="w-6 h-6 object-contain flex-shrink-0" onError={(e) => { e.currentTarget.src = '/images/placeholders/team.svg'; }} />
        )}
        <span className="text-sm font-bold text-gray-900 dark:text-white truncate uppercase">
          {team.name}
        </span>
      </div>
      <div className="space-y-0.5">
        {matches.length > 0 ? (
          matches.map((match, i) => (
            <MatchRow
              key={match.game_id}
              match={match}
              teamLogoUrl={teamLogo}
              teamName={formGuide.team_name}
              index={i}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))
        ) : (
          <p className="text-xs text-gray-400 py-2 text-center">-</p>
        )}
      </div>
    </div>
  );
}

export function H2HFormGuide({
  homeTeam,
  awayTeam,
  formGuide,
}: H2HFormGuideProps) {
  const { t } = useTranslation('match');
  const prefersReducedMotion = useReducedMotion();

  const homeLogo = homeTeam.logo_url;
  const awayLogo = awayTeam.logo_url;

  return (
    <div className="bg-[#F5F7F9] dark:bg-gray-800 rounded-2xl p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
          {homeLogo && (
            <img src={homeLogo} alt={homeTeam.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = '/images/placeholders/team.svg'; }} />
          )}
        </div>
        <h3 className="text-base font-extrabold uppercase tracking-wide text-gray-900 dark:text-white text-center">
          {t('h2h.formGuide', 'ТЕКУЩАЯ ФОРМА')}
        </h3>
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
          {awayLogo && (
            <img src={awayLogo} alt={awayTeam.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = '/images/placeholders/team.svg'; }} />
          )}
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamFormColumn team={homeTeam} formGuide={formGuide.team1} prefersReducedMotion={prefersReducedMotion} />
        <TeamFormColumn team={awayTeam} formGuide={formGuide.team2} prefersReducedMotion={prefersReducedMotion} />
      </div>
    </div>
  );
}
