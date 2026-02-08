'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { usePlayerLeaderboard } from '@/hooks/usePlayerLeaderboard';
import { useTournament } from '@/contexts/TournamentContext';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { getTeamLogo, getTeamColor } from '@/lib/utils/teamLogos';
import { PlayerStat } from '@/types';

interface LeaderboardCardProps {
  headerText: string;
  bottomLabel: string;
  players: PlayerStat[];
  statKey: 'goals' | 'assists' | 'dry_match';
  secondaryStatKey?: 'xg' | 'key_passes' | 'save_shot';
  secondaryStatLabel?: string;
  bgColor: string;
  bottomColor: string;
  textColor: string;
  statNumberColor?: string;
}

function LeaderboardCard({
  headerText,
  bottomLabel,
  players,
  statKey,
  secondaryStatKey,
  secondaryStatLabel,
  bgColor,
  bottomColor,
  textColor,
  statNumberColor = 'text-primary',
}: LeaderboardCardProps) {
  const { t } = useTranslation();

  if (players.length === 0) {
    return (
      <div className={`${bgColor} rounded-2xl overflow-hidden`}>
        <div className={`p-6 text-center ${textColor}/80 text-sm min-h-[200px] flex items-center justify-center`}>
          {t('noData.noMatches')}
        </div>
        <div className={`${bottomColor} px-6 py-3 text-center`}>
          <span className="text-white font-bold text-sm uppercase tracking-wider">
            {bottomLabel}
          </span>
        </div>
      </div>
    );
  }

  const topPlayer = players[0];
  const runnerUps = players.slice(1, 5);

  const getPlayerInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ''}${lastName[0] || ''}`;
  };

  const getSecondaryStatValue = (player: PlayerStat) => {
    if (!secondaryStatKey) return null;
    const value = player[secondaryStatKey];
    if (value === null || value === undefined) return null;
    if (secondaryStatKey === 'xg') {
      return typeof value === 'number' ? value.toFixed(1) : value;
    }
    return value;
  };

  return (
    <div className="relative pt-8 h-full">
      {/* Player photo - positioned to overflow above the card */}
      <div className="absolute right-4 top-0 z-10">
        <Link href={`/player/${topPlayer.player_id}`} className="block group/photo">
          {topPlayer.photo_url ? (
            <img
              src={topPlayer.photo_url}
              alt={`${topPlayer.first_name} ${topPlayer.last_name}`}
              loading="lazy"
              className="h-64 w-40 object-contain transition-transform duration-300 group-hover/photo:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div
            className={`h-64 w-40 rounded-lg flex items-center justify-center text-white text-3xl font-bold ${topPlayer.photo_url ? 'hidden' : ''}`}
            style={{ backgroundColor: getTeamColor(topPlayer.team_id) }}
          >
            {getPlayerInitials(topPlayer.first_name, topPlayer.last_name)}
          </div>
          {/* Stat number overlay */}
          <div className="absolute bottom-2 right-0">
            <span className={`${statNumberColor} text-6xl font-black drop-shadow-sm`}>
              {topPlayer[statKey] ?? 0}
            </span>
          </div>
        </Link>
      </div>

      {/* Card container */}
      <div className={`${bgColor} rounded-2xl overflow-hidden h-full flex flex-col`}>
        {/* Header text */}
        <div className="px-6 pt-4">
          <span className={`${textColor === 'text-white' ? 'text-white/60' : 'text-gray-600'} text-sm`}>
            {headerText}
          </span>
        </div>

        {/* Top Player Section */}
        <Link href={`/player/${topPlayer.player_id}`} className="block group/top">
          <div className="px-6 pb-4 min-h-[120px] transition-all duration-300 group-hover/top:bg-black/5 rounded-lg">
            {/* Left side - Player info */}
            <div className="max-w-[55%] pt-8">
              <div className="mb-0.5">
                <span className={`${textColor === 'text-white' ? 'text-white/80' : 'text-gray-800'} text-lg`}>
                  {topPlayer.first_name}
                </span>
              </div>
              <div className="mb-3">
                <span className={`${textColor === 'text-white' ? 'text-white' : 'text-gray-900'} text-2xl font-bold uppercase tracking-tight`}>
                  {topPlayer.last_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={topPlayer.team_logo ?? getTeamLogo(topPlayer.team_id) ?? undefined}
                  alt={topPlayer.team_name}
                  loading="lazy"
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className={`${textColor === 'text-white' ? 'text-white/70' : 'text-gray-700'} text-sm`}>
                  {topPlayer.team_name}
                </span>
              </div>
              {/* Additional stats */}
              {secondaryStatKey && secondaryStatLabel && (
                <div className="mt-2">
                  <span className={`${textColor === 'text-white' ? 'text-white/60' : 'text-gray-600'} text-xs`}>
                    {secondaryStatLabel}:{' '}
                  </span>
                  <span className={`${textColor === 'text-white' ? 'text-white' : 'text-gray-900'} font-semibold`}>
                    {getSecondaryStatValue(topPlayer) ?? '-'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Runner-ups Section */}
        <div className="bg-white/95 dark:bg-dark-surface/95 flex-grow min-h-[240px]">
          {runnerUps.map((player, index) => (
            <Link
              key={player.player_id}
              href={`/player/${player.player_id}`}
              className="flex items-center gap-3 px-6 py-3 hover:bg-white dark:hover:bg-dark-surface-soft hover:shadow-sm hover:translate-x-1 transition-all duration-200 border-b border-gray-100 dark:border-dark-border last:border-b-0 group"
            >
              <span className="text-gray-500 dark:text-slate-400 font-medium w-4">{index + 2}</span>
              <img
                src={player.team_logo ?? getTeamLogo(player.team_id) ?? undefined}
                alt={player.team_name}
                loading="lazy"
                className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-gray-900 dark:text-slate-100 font-semibold group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                  {player.first_name} {player.last_name}
                </span>
                <div className="text-gray-600 dark:text-slate-400 text-sm font-medium">{player.team_name}</div>
              </div>
              <div className="text-right">
                <span className="text-gray-900 dark:text-slate-100 font-bold text-lg block">
                  {player[statKey] ?? 0}
                </span>
                {secondaryStatKey && (
                  <span className="text-gray-500 dark:text-slate-400 text-xs">
                    {secondaryStatLabel}: {getSecondaryStatValue(player) ?? '-'}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Label */}
        <div className={`${bottomColor} px-6 py-3 text-center`}>
          <span className="text-white font-bold text-sm uppercase tracking-wider">
            {bottomLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function PlayerLeaderboardSkeleton() {
  return (
    <section className="relative py-12 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/footer-bg.webp)' }}
      />
      <div className="absolute inset-0 bg-primary/80" />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-12 md:pt-16">
          {[
            { bg: 'bg-accent', bottom: 'bg-[#d4a82d]' },
            { bg: 'bg-primary', bottom: 'bg-[#153d6d]' },
            { bg: 'bg-[#0D847A]', bottom: 'bg-[#0a6b63]' },
          ].map((colors, i) => (
            <div key={i} className="relative pt-16">
              {/* Player photo skeleton */}
              <Skeleton className="absolute right-4 top-0 h-64 w-40 bg-white/20 rounded-lg z-10" />

              {/* Card container */}
              <div className={`${colors.bg} rounded-2xl overflow-hidden`}>
                <div className="px-6 pt-4">
                  <Skeleton className="h-4 w-24 bg-white/20" />
                </div>
                <div className="px-6 pb-4 min-h-[120px]">
                  <div className="max-w-[55%] pt-8 space-y-2">
                    <Skeleton className="h-5 w-20 bg-white/20" />
                    <Skeleton className="h-7 w-32 bg-white/20" />
                    <Skeleton className="h-4 w-24 bg-white/20" />
                  </div>
                </div>
                <div className="bg-white/95">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center gap-3 px-6 py-3">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-8" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`${colors.bottom} px-6 py-3`}>
                  <Skeleton className="h-4 w-32 mx-auto bg-white/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PlayerLeaderboard() {
  const { t } = useTranslation();
  const { t: tErrors } = useTranslation('errors');
  const { effectiveSeasonId } = useTournament();
  const { scorers, assisters, cleanSheets, loading, error, refetch } = usePlayerLeaderboard({ limit: 5, seasonId: effectiveSeasonId });

  if (loading) {
    return <PlayerLeaderboardSkeleton />;
  }

  if (error) {
    return (
      <section className="relative py-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/footer-bg.webp)' }}
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
            <ErrorMessage message={tErrors('loadStats')} onRetry={refetch} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="overflow-visible">
      {/* Header with link */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary dark:text-accent-cyan">{t('playerLeaderboard.title')}</h2>
        <Link
          href="/stats"
          className="text-gray-500 dark:text-slate-400 font-medium text-sm hover:text-primary dark:hover:text-accent-cyan flex items-center transition-colors group"
        >
          {t('playerLeaderboard.viewAllStats')}
          <svg className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-visible">
          <LeaderboardCard
            headerText={t('playerStats.goalsHeader', 'Забитые голы')}
            bottomLabel={t('playerStats.topScorers', 'БОМБАРДИРЫ')}
            players={scorers}
            statKey="goals"
            secondaryStatKey="xg"
            secondaryStatLabel="xG"
            bgColor="bg-accent"
            bottomColor="bg-[#d4a82d]"
            textColor="text-gray-800"
          />
          <LeaderboardCard
            headerText={t('playerStats.assistsHeader', 'Результативные передачи')}
            bottomLabel={t('playerStats.topAssisters', 'АССИСТЕНТЫ')}
            players={assisters}
            statKey="assists"
            secondaryStatKey="key_passes"
            secondaryStatLabel={t('playerLeaderboard.keyPasses')}
            bgColor="bg-primary"
            bottomColor="bg-[#153d6d]"
            textColor="text-white"
            statNumberColor="text-accent"
          />
          <LeaderboardCard
            headerText={t('playerStats.cleanSheetsHeader', 'Сухие матчи')}
            bottomLabel={t('playerStats.topKeepers', 'ВРАТАРИ')}
            players={cleanSheets}
            statKey="dry_match"
            secondaryStatKey="save_shot"
            secondaryStatLabel={t('playerLeaderboard.saves')}
            bgColor="bg-[#0D847A]"
            bottomColor="bg-[#0a6b63]"
            textColor="text-white"
            statNumberColor="text-accent"
          />
      </div>
    </div>
  );
}
