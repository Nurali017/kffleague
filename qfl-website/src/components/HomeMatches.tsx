'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronRight } from 'lucide-react';
import { useTournament } from '@/contexts/TournamentContext';
import { useMatches } from '@/hooks';
import { formatMatchDate } from '@/lib/utils/dateFormat';
import { getTeamLogo } from '@/lib/utils/teamLogos';

export function HomeMatches() {
  const { t, i18n } = useTranslation('match');
  const { effectiveSeasonId, currentRound } = useTournament();
  const { matches, loading, error } = useMatches({
    seasonId: effectiveSeasonId,
    tour: currentRound ?? 26
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-xl shadow-sm p-4 md:p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold text-[#1E4D8C] dark:text-accent-cyan flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t('title')}
          </h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-100 dark:bg-dark-surface rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !matches) {
    return (
      <div className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-xl shadow-sm p-4 md:p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold text-[#1E4D8C] dark:text-accent-cyan flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t('title')}
          </h2>
        </div>
        <p className="text-gray-500 dark:text-slate-400 text-sm text-center py-8">
          {t('noData.noMatches', { ns: 'common' })}
        </p>
      </div>
    );
  }

  // Show up to 6 matches to fit without scroll
  const displayGames = matches.slice(0, 8);

  // Get date from first match for display
  const matchDate = displayGames.length > 0 && displayGames[0].date
    ? formatMatchDate(displayGames[0].date, i18n.language)
    : '';

  return (
    <div className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border rounded-xl shadow-sm p-4 md:p-6 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-2 gap-2">
        <h2 className="text-lg md:text-xl font-bold text-[#1E4D8C] dark:text-accent-cyan flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {t('title')}
        </h2>
        <Link
          href="/matches"
          className="text-gray-500 dark:text-slate-400 font-medium text-sm hover:text-[#1E4D8C] dark:hover:text-accent-cyan flex items-center transition-colors group"
        >
          Барлығы
          <ChevronRight className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Date header */}
      {matchDate && (
        <div className="text-sm text-gray-500 dark:text-slate-400 mb-3">
          {matchDate}
        </div>
      )}

      <div className="space-y-2 flex-1">
        {displayGames.length === 0 ? (
          <p className="text-gray-500 dark:text-slate-400 text-sm text-center py-8">
            {t('noData.noMatches', { ns: 'common' })}
          </p>
        ) : (
          displayGames.map((game) => (
            <Link
              key={game.id}
              href={`/matches/${game.id}`}
              className="block bg-gray-50 dark:bg-dark-surface-soft hover:bg-gray-100 dark:hover:bg-dark-surface-soft rounded-lg p-2 md:p-2.5 transition-colors"
            >
              {/* Teams */}
              <div className="flex items-center justify-between gap-3">
                {/* Home team */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <img
                    src={game.home_team.logo_url || getTeamLogo(game.home_team.id) || '/images/team-placeholder.png'}
                    alt={game.home_team.name}
                    className="w-6 h-6 object-contain flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = '/images/team-placeholder.png';
                    }}
                  />
                  <span className="font-medium text-gray-900 dark:text-slate-100 truncate text-xs sm:text-sm">
                    {game.home_team.name}
                  </span>
                </div>

                {/* Score or Time */}
                <div className="flex-shrink-0 text-center min-w-[52px] sm:min-w-[60px]">
                  {game.home_score !== null && game.away_score !== null ? (
                    <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-slate-100">
                      {game.home_score} : {game.away_score}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                      {game.time || '-'}
                    </div>
                  )}
                </div>

                {/* Away team */}
                <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                  <span className="font-medium text-gray-900 dark:text-slate-100 truncate text-xs sm:text-sm text-right">
                    {game.away_team.name}
                  </span>
                  <img
                    src={game.away_team.logo_url || getTeamLogo(game.away_team.id) || '/images/team-placeholder.png'}
                    alt={game.away_team.name}
                    className="w-6 h-6 object-contain flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = '/images/team-placeholder.png';
                    }}
                  />
                </div>
              </div>

              {/* Live badge */}
              {(game.is_live || game.status === 'live') && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
