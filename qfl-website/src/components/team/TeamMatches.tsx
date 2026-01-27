'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Game } from '@/types/match';
import { formatMatchDate } from '@/lib/utils/dateFormat';

interface TeamMatchesProps {
  games: Game[];
  teamId: number;
  loading?: boolean;
}

function MatchCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="w-24 h-4 bg-gray-200 rounded" />
        </div>
        <div className="w-16 h-6 bg-gray-200 rounded" />
        <div className="flex items-center gap-3">
          <div className="w-24 h-4 bg-gray-200 rounded" />
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

interface MatchCardProps {
  game: Game;
  teamId: number;
}

function MatchCard({ game, teamId }: MatchCardProps) {
  const { t, i18n } = useTranslation('team');
  const isHome = game.home_team.id === teamId;
  const isFinished = game.home_score !== null && game.away_score !== null;

  // Determine result for the team
  let result: 'W' | 'D' | 'L' | null = null;
  if (isFinished && game.home_score !== null && game.away_score !== null) {
    const teamScore = isHome ? game.home_score : game.away_score;
    const opponentScore = isHome ? game.away_score : game.home_score;
    if (teamScore > opponentScore) result = 'W';
    else if (teamScore < opponentScore) result = 'L';
    else result = 'D';
  }

  const resultColors = {
    W: 'bg-green-500',
    D: 'bg-gray-400',
    L: 'bg-red-500',
  };

  return (
    <Link
      href={`/matches/${game.id}`}
      className="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg hover:border-primary transition-all duration-300"
    >
      {/* Date and Tour */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{formatMatchDate(game.date, i18n.language)}</span>
          {game.time && (
            <>
              <span className="text-gray-300">|</span>
              <span>{game.time}</span>
            </>
          )}
        </div>
        {game.tour && (
          <span className="text-xs font-medium text-gray-400">
            {t('matches_sections.tour', { number: game.tour })}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-4">
        {/* Home Team */}
        <div className={`flex items-center gap-3 flex-1 ${isHome ? 'font-bold' : ''}`}>
          <div className="w-10 h-10 relative flex-shrink-0">
            {game.home_team.logo_url ? (
              <Image
                src={game.home_team.logo_url}
                alt={game.home_team.name}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full" />
            )}
          </div>
          <span className="text-gray-900 truncate">{game.home_team.name}</span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-2 px-4">
          {isFinished ? (
            <div className="flex items-center gap-1">
              {result && (
                <span className={`w-2 h-2 rounded-full ${resultColors[result]}`} />
              )}
              <span className="text-xl font-black text-gray-900 min-w-[60px] text-center">
                {game.home_score} - {game.away_score}
              </span>
            </div>
          ) : (
            <span className="text-sm font-medium text-primary bg-blue-50 px-3 py-1 rounded-full">
              {game.time || 'TBD'}
            </span>
          )}
        </div>

        {/* Away Team */}
        <div className={`flex items-center gap-3 flex-1 justify-end ${!isHome ? 'font-bold' : ''}`}>
          <span className="text-gray-900 truncate text-right">{game.away_team.name}</span>
          <div className="w-10 h-10 relative flex-shrink-0">
            {game.away_team.logo_url ? (
              <Image
                src={game.away_team.logo_url}
                alt={game.away_team.name}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full" />
            )}
          </div>
        </div>
      </div>

      {/* Stadium */}
      {game.stadium && (
        <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
          {game.stadium.name}, {game.stadium.city}
        </div>
      )}
    </Link>
  );
}

export function TeamMatches({ games, teamId, loading }: TeamMatchesProps) {
  const { t, i18n } = useTranslation('team');
  const lang = i18n.language === 'kz' ? 'kz' : 'ru';

  // Split games into finished and upcoming
  const { finishedGames, upcomingGames } = useMemo(() => {
    const finished: Game[] = [];
    const upcoming: Game[] = [];

    games.forEach((game) => {
      if (game.home_score !== null && game.away_score !== null) {
        finished.push(game);
      } else {
        upcoming.push(game);
      }
    });

    // Sort finished by date descending (most recent first)
    finished.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    // Sort upcoming by date ascending (soonest first)
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { finishedGames: finished, upcomingGames: upcoming };
  }, [games]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-500">
          {t('empty.matches')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upcoming Matches */}
      {upcomingGames.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {t('matches_sections.upcoming')}
            <span className="text-sm font-normal text-gray-400">({upcomingGames.length})</span>
          </h2>
          <div className="space-y-3">
            {upcomingGames.map((game) => (
              <MatchCard key={game.id} game={game} teamId={teamId} />
            ))}
          </div>
        </section>
      )}

      {/* Finished Matches */}
      {finishedGames.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t('matches_sections.past')}
            <span className="text-sm font-normal text-gray-400 ml-2">({finishedGames.length})</span>
          </h2>
          <div className="space-y-3">
            {finishedGames.map((game) => (
              <MatchCard key={game.id} game={game} teamId={teamId} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
