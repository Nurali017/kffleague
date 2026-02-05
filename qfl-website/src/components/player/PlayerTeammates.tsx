import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SquadPlayer } from '@/types/team';
import { cn } from '@/lib/utils/cn';
import { PlayerPageVariant } from './playerPageVariants';

interface PlayerTeammatesProps {
  teammates: SquadPlayer[];
  teamId: number;
  variant?: PlayerPageVariant;
}

export function PlayerTeammates({ teammates, teamId, variant = 'clarity' }: PlayerTeammatesProps) {
  const { t } = useTranslation('player');
  const isStudio = variant === 'studio';
  const isData = variant === 'data';

  if (!teammates || teammates.length === 0) return null;

  return (
    <section
      aria-labelledby="teammates-heading"
      className={cn(
        'w-full border-y',
        isStudio
          ? 'border-white/10 bg-[#081428] text-white'
          : isData
            ? 'border-slate-200 bg-white text-slate-900 dark:border-dark-border dark:bg-dark-surface dark:text-white'
            : 'border-slate-200 bg-white text-slate-900 dark:border-dark-border dark:bg-dark-surface dark:text-white'
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-10 md:py-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="teammates-heading" className="text-lg font-black md:text-xl">
            {t('teammates', 'Другие игроки команды')}
          </h2>
          <Link
            href={`/team/${teamId}`}
            className={cn(
              'inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              isStudio
                ? 'border-white/20 bg-white/10 text-white hover:bg-white/15 focus-visible:ring-white/70 focus-visible:ring-offset-[#081428]'
                : 'border-slate-200 bg-white text-slate-700 hover:border-primary/40 hover:text-primary focus-visible:ring-primary focus-visible:ring-offset-white dark:border-dark-border dark:bg-dark-surface dark:text-slate-100 dark:hover:border-accent-cyan/50 dark:hover:text-cyan-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-dark-surface'
            )}
            aria-label={t('viewTeam', 'Открыть страницу команды')}
          >
            {t('viewTeam', 'Команда')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 md:gap-4">
          {teammates.map((player) => {
            const initials = `${player.first_name?.[0] || ''}${player.last_name?.[0] || ''}`.toUpperCase();
            return (
              <Link
                key={player.player_id}
                href={`/player/${player.player_id}`}
                className={cn(
                  'group relative flex h-[220px] w-[172px] shrink-0 flex-col overflow-hidden rounded-2xl border transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:h-[252px] md:w-[190px]',
                  isStudio
                    ? 'border-white/15 bg-white/10 focus-visible:ring-white focus-visible:ring-offset-[#081428]'
                    : isData
                      ? 'border-slate-200 bg-slate-50 focus-visible:ring-primary focus-visible:ring-offset-white dark:border-dark-border dark:bg-dark-surface/70 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-dark-surface'
                      : 'border-slate-200 bg-white shadow-sm focus-visible:ring-primary focus-visible:ring-offset-white dark:border-dark-border dark:bg-dark-surface-soft dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-dark-surface'
                )}
              >
                <div
                  className={cn(
                    'relative h-[148px] w-full overflow-hidden',
                    isStudio ? 'bg-gradient-to-b from-blue-500/60 to-slate-900/80' : 'bg-slate-100 dark:bg-dark-surface-soft/60'
                  )}
                >
                  {player.photo_url ? (
                    <Image
                      src={player.photo_url}
                      alt={`${player.first_name} ${player.last_name}`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 172px, 190px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className={cn('text-4xl font-black', isStudio ? 'text-white/45' : 'text-slate-400')}>
                        {initials}
                      </span>
                    </div>
                  )}

                  {player.jersey_number != null && (
                    <span
                      className={cn(
                        'absolute right-2 top-2 inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-black',
                        isStudio
                          ? 'bg-white/20 text-white'
                          : 'bg-primary text-white dark:bg-cyan-600'
                      )}
                    >
                      #{player.jersey_number}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between px-3 py-3">
                  <div>
                    <p
                      className={cn(
                        'line-clamp-2 text-sm font-bold leading-tight',
                        isStudio ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                      )}
                    >
                      {player.first_name} {player.last_name}
                    </p>
                    <p
                      className={cn(
                        'mt-1 text-xs font-medium',
                        isStudio ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
                      )}
                    >
                      {player.position || t('position', 'Позиция')}
                    </p>
                  </div>

                  {player.age && (
                    <p
                      className={cn(
                        'text-xs font-semibold',
                        isStudio ? 'text-cyan-300' : 'text-primary dark:text-accent-cyan'
                      )}
                    >
                      {player.age} {t('years', 'лет')}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
