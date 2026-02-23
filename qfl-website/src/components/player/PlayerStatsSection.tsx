import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlayerPageStats } from '@/types/player';
import { cn } from '@/lib/utils/cn';
import { PlayerPageVariant } from './playerPageVariants';

interface PlayerStatsSectionProps {
  stats?: PlayerPageStats | null;
  variant?: PlayerPageVariant;
}

export function PlayerStatsSection({ stats, variant = 'clarity' }: PlayerStatsSectionProps) {
  const { t } = useTranslation('player');
  const isStudio = variant === 'studio';
  const isData = variant === 'data';

  const statItems = [
    { label: t('gamesPlayed', 'Матчи'), value: stats?.games_played ?? 0 },
    { label: t('minutesPlayed', 'Минуты'), value: stats?.minutes_played ?? 0 },
    { label: t('startingLineup', 'В старте'), value: stats?.started ?? 0 },
    { label: t('substitutedIn', 'Выходы на замену'), value: stats?.subbed_in ?? 0 },
  ];

  return (
    <section
      aria-label={t('seasonStats', 'Season stats')}
      className={cn(
        'border-b',
        isStudio
          ? 'border-white/10 bg-slate-900/70 dark:bg-[#050a13]/85'
          : isData
            ? 'border-slate-200 bg-white dark:border-dark-border dark:bg-dark-surface'
            : 'border-gray-100 bg-white dark:border-dark-border dark:bg-dark-surface'
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-10 md:py-5">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {statItems.map((item) => (
            <article
              key={item.label}
              className={cn(
                'rounded-xl border px-3 py-3 text-center md:px-4',
                isStudio
                  ? 'border-white/15 bg-white/10'
                  : isData
                    ? 'border-slate-200 bg-slate-50 dark:border-dark-border dark:bg-dark-surface/80'
                    : 'border-slate-100 bg-slate-50/50 dark:border-dark-border dark:bg-dark-surface-soft'
              )}
            >
              <p
                className={cn(
                  'text-xl font-black md:text-3xl',
                  isStudio ? 'text-white' : 'text-primary dark:text-accent-cyan'
                )}
              >
                {item.value}
              </p>
              <p
                className={cn(
                  'mt-1 text-[10px] font-bold uppercase tracking-wide md:text-[11px]',
                  isStudio ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
                )}
              >
                {item.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
