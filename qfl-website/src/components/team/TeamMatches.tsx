'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Game } from '@/types/match';
import { formatMatchDate } from '@/lib/utils/dateFormat';
import { EmptyState, SectionCard } from './TeamUiPrimitives';

interface TeamMatchesProps {
  games: Game[];
  teamId: number;
  loading?: boolean;
}

function MatchCardSkeleton() {
  return (
    <SectionCard className="p-4 animate-pulse">
      <div className="h-4 w-40 rounded bg-gray-200 dark:bg-white/10" />
      <div className="mt-3 h-10 rounded bg-gray-200 dark:bg-white/10" />
    </SectionCard>
  );
}

function ResultBadge({ result }: { result: 'W' | 'D' | 'L' | null }) {
  if (!result) return null;

  const style =
    result === 'W'
      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300'
      : result === 'L'
        ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300'
        : 'bg-gray-100 text-slate-600 dark:bg-white/10 dark:text-white/80';

  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${style}`}>{result}</span>
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

  let result: 'W' | 'D' | 'L' | null = null;
  if (isFinished) {
    const teamScore = isHome ? game.home_score : game.away_score;
    const opponentScore = isHome ? game.away_score : game.home_score;
    if (teamScore !== null && opponentScore !== null) {
      if (teamScore > opponentScore) result = 'W';
      else if (teamScore < opponentScore) result = 'L';
      else result = 'D';
    }
  }

  return (
    <Link href={`/matches/${game.id}`} className="block">
      <SectionCard className="p-4 md:p-5 hover:border-gray-300 dark:hover:border-white/25 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-slate-500 dark:text-white/60">
            {formatMatchDate(game.date, i18n.language)}
            {game.time ? ` · ${game.time.slice(0, 5)}` : ''}
          </div>
          <div className="flex items-center gap-2">
            {game.tour ? (
              <span className="text-xs text-slate-500 dark:text-white/60">
                {t('matches_sections.tour', { number: game.tour })}
              </span>
            ) : null}
            <ResultBadge result={result} />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div className={`flex items-center gap-2.5 min-w-0 flex-1 ${isHome ? 'font-black' : 'font-semibold'}`}>
            <div className="relative w-9 h-9 shrink-0">
              {game.home_team.logo_url ? (
                <Image src={game.home_team.logo_url} alt={game.home_team.name} fill className="object-contain" />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-white/15" />
              )}
            </div>
            <span className="truncate text-slate-900 dark:text-white">{game.home_team.name}</span>
          </div>

          <div className="rounded-full bg-gray-100 dark:bg-white/10 px-3 py-1 text-sm font-black text-slate-900 dark:text-white shrink-0">
            {isFinished ? `${game.home_score}:${game.away_score}` : (game.time?.slice(0, 5) || t('tbd', 'Уточняется'))}
          </div>

          <div className={`flex items-center justify-end gap-2.5 min-w-0 flex-1 ${!isHome ? 'font-black' : 'font-semibold'}`}>
            <span className="truncate text-slate-900 dark:text-white text-right">{game.away_team.name}</span>
            <div className="relative w-9 h-9 shrink-0">
              {game.away_team.logo_url ? (
                <Image src={game.away_team.logo_url} alt={game.away_team.name} fill className="object-contain" />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-white/15" />
              )}
            </div>
          </div>
        </div>

        {game.stadium?.name ? (
          <div className="mt-3 text-xs text-slate-500 dark:text-white/60">
            {game.stadium.name}{game.stadium.city ? `, ${game.stadium.city}` : ''}
          </div>
        ) : null}
      </SectionCard>
    </Link>
  );
}

export function TeamMatches({ games, teamId, loading }: TeamMatchesProps) {
  const { t } = useTranslation('team');

  const { finishedGames, upcomingGames } = useMemo(() => {
    const finished: Game[] = [];
    const upcoming: Game[] = [];
    for (const game of games) {
      if (game.home_score !== null && game.away_score !== null) finished.push(game);
      else upcoming.push(game);
    }

    finished.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    upcoming.sort((a, b) => +new Date(a.date) - +new Date(b.date));
    return { finishedGames: finished, upcomingGames: upcoming };
  }, [games]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <MatchCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!games.length) {
    return (
      <EmptyState description={t('empty.matches', 'Матчи не найдены')} />
    );
  }

  return (
    <div className="space-y-8">
      {upcomingGames.length ? (
        <section>
          <h2 className="mb-4 text-lg font-black text-slate-900 dark:text-white">
            {t('matches_sections.upcoming', 'Предстоящие матчи')}
            <span className="ml-2 text-sm font-medium text-slate-500 dark:text-white/60">({upcomingGames.length})</span>
          </h2>
          <div className="space-y-3">
            {upcomingGames.map((game) => (
              <MatchCard key={game.id} game={game} teamId={teamId} />
            ))}
          </div>
        </section>
      ) : null}

      {finishedGames.length ? (
        <section>
          <h2 className="mb-4 text-lg font-black text-slate-900 dark:text-white">
            {t('matches_sections.past', 'Прошедшие матчи')}
            <span className="ml-2 text-sm font-medium text-slate-500 dark:text-white/60">({finishedGames.length})</span>
          </h2>
          <div className="space-y-3">
            {finishedGames.map((game) => (
              <MatchCard key={game.id} game={game} teamId={teamId} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
