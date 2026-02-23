'use client';

import { TournamentAwareLink as Link } from '@/components/navigation/TournamentAwareLink';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'motion/react';
import { GameTeam } from '@/types';
import { FormGuide } from '@/types/h2h';
import { getMatchHref, getTeamHref } from '@/lib/utils/entityRoutes';
import { getTeamLogo } from '@/lib/utils/teamLogos';

interface H2HFormStreakProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  formGuide: {
    team1: FormGuide;
    team2: FormGuide;
  };
  homeColor: string;
  awayColor: string;
  fallbackYear?: string | null;
}

const getFormBadgeStyle = (result: string) => {
  switch (result) {
    case 'W':
      return 'bg-green-500 ring-2 ring-green-500/20';
    case 'D':
      return 'bg-yellow-400 ring-2 ring-yellow-400/20';
    case 'L':
      return 'bg-red-500 ring-2 ring-red-500/20';
    default:
      return 'bg-gray-300';
  }
};

export function H2HFormStreak({
  homeTeam,
  awayTeam,
  formGuide,
  homeColor,
  awayColor,
  fallbackYear,
}: H2HFormStreakProps) {
  const { t } = useTranslation('match');
  const prefersReducedMotion = useReducedMotion();

  const team1Matches = formGuide.team1?.matches || [];
  const team2Matches = formGuide.team2?.matches || [];
  const homeTeamHref = getTeamHref(homeTeam.id);
  const awayTeamHref = getTeamHref(awayTeam.id);
  const homeLogoUrl = homeTeam.logo_url || getTeamLogo(homeTeam.id);
  const awayLogoUrl = awayTeam.logo_url || getTeamLogo(awayTeam.id);

  const Badge = ({ result, gameId, wasHome, opponentName, homeScore, awayScore, index }: {
    result: string;
    gameId?: number;
    wasHome: boolean;
    opponentName: string;
    homeScore: number | null;
    awayScore: number | null;
    index: number;
  }) => {
    const matchHref = gameId ? getMatchHref(gameId) : null;
    const className = `w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${getFormBadgeStyle(result)} transition-transform hover:scale-110`;
    const title = `${wasHome ? 'vs' : '@'} ${opponentName}: ${homeScore}-${awayScore}`;

    const inner = (
      <span className="text-white text-[10px] font-black">{result}</span>
    );

    const badge = matchHref ? (
      <Link href={matchHref} className={className} title={title}>{inner}</Link>
    ) : (
      <div className={className} title={title}>{inner}</div>
    );

    if (prefersReducedMotion) return badge;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: index * 0.06 }}
      >
        {badge}
      </motion.div>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-md border-l-4 border-l-primary overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-900 uppercase">
            {t('h2h.currentForm', 'Текущая форма')}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            {t('h2h.last5Matches', 'Последние 5 матчей')}{fallbackYear && ` · ${fallbackYear}`}
          </span>
        </div>

        {/* Home Team Form */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {homeLogoUrl && (
              <img src={homeLogoUrl} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
            )}
            {homeTeamHref ? (
              <Link href={homeTeamHref} className="text-xs font-semibold text-gray-700 truncate hover:text-primary transition-colors">
                {homeTeam.name}
              </Link>
            ) : (
              <span className="text-xs font-semibold text-gray-700 truncate">
                {homeTeam.name}
              </span>
            )}
          </div>
          <div className="flex gap-1 ml-4">
            {team1Matches.length > 0 ? (
              team1Matches.slice(0, 5).map((match, i) => (
                <Badge
                  key={match.game_id || i}
                  result={match.result}
                  gameId={match.game_id}
                  wasHome={match.was_home}
                  opponentName={match.opponent_name}
                  homeScore={match.home_score}
                  awayScore={match.away_score}
                  index={i}
                />
              ))
            ) : (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-200 flex items-center justify-center"
                >
                  <span className="text-gray-400 text-[10px]">-</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Away Team Form */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {awayLogoUrl && (
              <img src={awayLogoUrl} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
            )}
            {awayTeamHref ? (
              <Link href={awayTeamHref} className="text-xs font-semibold text-gray-700 truncate hover:text-primary transition-colors">
                {awayTeam.name}
              </Link>
            ) : (
              <span className="text-xs font-semibold text-gray-700 truncate">
                {awayTeam.name}
              </span>
            )}
          </div>
          <div className="flex gap-1 ml-4">
            {team2Matches.length > 0 ? (
              team2Matches.slice(0, 5).map((match, i) => (
                <Badge
                  key={match.game_id || i}
                  result={match.result}
                  gameId={match.game_id}
                  wasHome={match.was_home}
                  opponentName={match.opponent_name}
                  homeScore={match.home_score}
                  awayScore={match.away_score}
                  index={i}
                />
              ))
            ) : (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-200 flex items-center justify-center"
                >
                  <span className="text-gray-400 text-[10px]">-</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <span className="text-[10px] text-gray-500">{t('h2h.form.winFull', 'Победа')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-yellow-400" />
            <span className="text-[10px] text-gray-500">{t('h2h.form.drawFull', 'Ничья')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-red-500" />
            <span className="text-[10px] text-gray-500">{t('h2h.form.lossFull', 'Поражение')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
