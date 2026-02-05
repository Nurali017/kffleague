import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTournament } from '@/contexts/TournamentContext';
import { PlayerPageStats } from '@/types/player';
import { cn } from '@/lib/utils/cn';
import { PlayerPageVariant } from './playerPageVariants';

interface PlayerStatsSectionProps {
  stats?: PlayerPageStats | null;
  variant?: PlayerPageVariant;
}

export function PlayerStatsSection({ stats, variant = 'clarity' }: PlayerStatsSectionProps) {
  const { t, i18n } = useTranslation('player');
  const lang = (i18n.language === 'ru' ? 'ru' : 'kz') as 'ru' | 'kz';
  const { currentTournament, availableTournaments, setTournament } = useTournament();
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
        'sticky top-20 z-40 border-b shadow-sm backdrop-blur',
        isStudio
          ? 'border-white/10 bg-slate-900/70 dark:bg-[#050a13]/85'
          : isData
            ? 'border-slate-200 bg-white/95 dark:border-dark-border dark:bg-dark-surface/90'
            : 'border-gray-100 bg-white/90 dark:border-dark-border dark:bg-dark-surface/90'
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-10 md:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2
              className={cn(
                'text-lg font-black md:text-2xl',
                isStudio ? 'text-white' : 'text-primary dark:text-accent-cyan'
              )}
            >
              {t('statistics', 'Статистика')}
            </h2>

            <div className="relative group">
              <select
                value={currentTournament.id}
                onChange={(event) => setTournament(event.target.value)}
                className={cn(
                  'min-h-[44px] appearance-none rounded-lg border px-4 pr-10 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2',
                  isStudio
                    ? 'border-white/20 bg-white/10 text-white hover:bg-white/15 focus-visible:ring-white/70 focus-visible:ring-offset-slate-900'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-primary/40 hover:bg-white focus-visible:ring-primary focus-visible:ring-offset-white dark:border-dark-border dark:bg-dark-surface dark:text-slate-100 dark:hover:border-accent-cyan/50 dark:hover:bg-dark-surface-soft dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-dark-surface'
                )}
              >
                {availableTournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.name[lang]}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={cn(
                  'pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2',
                  isStudio ? 'text-white/80' : 'text-primary dark:text-accent-cyan'
                )}
              />
            </div>
          </div>

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
                      : 'border-slate-200 bg-white dark:border-dark-border dark:bg-dark-surface-soft'
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
      </div>
    </section>
  );
}
