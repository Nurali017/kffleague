import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils/cn';
import { PlayerPageVariant } from './playerPageVariants';

interface Tournament {
  id: number;
  season: string;
  name: string;
  team: string;
  matches: number;
  minutes: number;
  goals: number;
  assists: number;
  yellow: number;
  red: number;
}

interface PlayerTournamentsProps {
  tournaments: Tournament[];
  variant?: PlayerPageVariant;
}

export function PlayerTournaments({ tournaments, variant = 'clarity' }: PlayerTournamentsProps) {
  const { t } = useTranslation('player');

  const totals = useMemo(() => {
    return tournaments.reduce(
      (acc, item) => {
        acc.matches += item.matches;
        acc.minutes += item.minutes;
        acc.goals += item.goals;
        acc.assists += item.assists;
        acc.yellow += item.yellow;
        acc.red += item.red;
        return acc;
      },
      { matches: 0, minutes: 0, goals: 0, assists: 0, yellow: 0, red: 0 }
    );
  }, [tournaments]);

  if (!tournaments || tournaments.length === 0) return null;

  const isStudio = variant === 'studio';
  const isData = variant === 'data';

  return (
    <section
      role="region"
      aria-label={t('tournaments', 'Турниры')}
      className={cn(
        'overflow-hidden rounded-2xl border',
        isStudio
          ? 'border-white/10 bg-[#0a162a]'
          : isData
            ? 'border-slate-200 bg-white dark:border-dark-border dark:bg-dark-surface'
            : 'border-slate-200 bg-white shadow-sm dark:border-dark-border dark:bg-dark-surface'
      )}
    >
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-2 border-b px-4 py-4 md:px-6 md:py-5',
          isStudio
            ? 'border-white/10'
            : 'border-slate-200 dark:border-dark-border'
        )}
      >
        <h3
          className={cn(
            'text-lg font-black md:text-xl',
            isStudio ? 'text-white' : 'text-slate-900 dark:text-white'
          )}
        >
          {t('tournaments', 'Турниры')}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide md:text-xs',
              isStudio
                ? 'bg-white/10 text-white/75'
                : 'bg-slate-100 text-slate-500 dark:bg-dark-surface dark:text-slate-400'
            )}
          >
            {t('allSeasons', 'Все сезоны')}
          </span>
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide md:text-xs',
              isStudio
                ? 'bg-white/10 text-white/75'
                : 'bg-slate-100 text-slate-500 dark:bg-dark-surface dark:text-slate-400'
            )}
          >
            {t('seasonsCount', { defaultValue: '{{count}} сезонов', count: tournaments.length })}
          </span>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr
              className={cn(
                'text-left text-[10px] font-bold uppercase tracking-wide md:text-xs',
                isStudio
                  ? 'bg-white/10 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-dark-surface dark:text-slate-300'
              )}
            >
              <th className="px-4 py-3 md:px-6">#</th>
              <th className="px-4 py-3 md:px-6">{t('season', 'Сезон')}</th>
              <th className="px-4 py-3 md:px-6">{t('tournament', 'Турнир')}</th>
              <th className="px-4 py-3 md:px-6">{t('club', 'Клуб')}</th>
              <th className="px-3 py-3 text-center md:px-4">{t('matchesShort', 'М')}</th>
              <th className="px-3 py-3 text-center md:px-4">{t('min', 'Мин')}</th>
              <th className="px-3 py-3 text-center md:px-4">{t('goalsShort', 'Г')}</th>
              <th className="px-3 py-3 text-center md:px-4">{t('assistsShort', 'A')}</th>
              <th className="px-3 py-3 text-center md:px-4">{t('goalsPlusAssists', 'Г+A')}</th>
              <th className="px-3 py-3 text-center md:px-4">{t('yellowShort', 'ЖК')}</th>
              <th className="px-3 py-3 text-center md:px-4">{t('redShort', 'КК')}</th>
            </tr>
          </thead>
          <tbody
            className={cn(
              'text-xs md:text-sm',
              isStudio ? 'text-white/85' : 'text-slate-700 dark:text-slate-200'
            )}
          >
            {tournaments.map((tournament, index) => (
              <tr
                key={`${tournament.id}-${index}`}
                className={cn(
                  'border-b transition-colors',
                  isStudio
                    ? 'border-white/10 hover:bg-white/5'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-dark-border dark:hover:bg-slate-800/60'
                )}
              >
                <td className={cn('px-4 py-3 md:px-6', isStudio ? 'text-white/50' : 'text-slate-400 dark:text-slate-500')}>
                  {index + 1}
                </td>
                <td className="px-4 py-3 font-semibold md:px-6">{tournament.season}</td>
                <td
                  className={cn(
                    'px-4 py-3 font-semibold md:px-6',
                    isStudio ? 'text-cyan-300' : 'text-primary dark:text-accent-cyan'
                  )}
                >
                  {tournament.name || '-'}
                </td>
                <td className="px-4 py-3 md:px-6">{tournament.team || '-'}</td>
                <td className="px-3 py-3 text-center font-semibold md:px-4">{tournament.matches}</td>
                <td className="px-3 py-3 text-center md:px-4">{tournament.minutes}</td>
                <td className="px-3 py-3 text-center md:px-4">{tournament.goals}</td>
                <td className="px-3 py-3 text-center md:px-4">{tournament.assists}</td>
                <td className="px-3 py-3 text-center font-black md:px-4">{tournament.goals + tournament.assists}</td>
                <td className="px-3 py-3 text-center md:px-4">{tournament.yellow}</td>
                <td className="px-3 py-3 text-center md:px-4">{tournament.red}</td>
              </tr>
            ))}
            <tr
              className={cn(
                'text-[11px] font-black uppercase tracking-wide md:text-xs',
                isStudio
                  ? 'bg-white/10 text-white'
                  : 'bg-slate-100 text-slate-700 dark:bg-dark-surface dark:text-slate-200'
              )}
            >
              <td colSpan={4} className="px-4 py-3 text-right md:px-6">
                {t('total', 'Итого')}
              </td>
              <td className="px-3 py-3 text-center md:px-4">{totals.matches}</td>
              <td className="px-3 py-3 text-center md:px-4">{totals.minutes}</td>
              <td className="px-3 py-3 text-center md:px-4">{totals.goals}</td>
              <td className="px-3 py-3 text-center md:px-4">{totals.assists}</td>
              <td className="px-3 py-3 text-center md:px-4">{totals.goals + totals.assists}</td>
              <td className="px-3 py-3 text-center md:px-4">{totals.yellow}</td>
              <td className="px-3 py-3 text-center md:px-4">{totals.red}</td>
            </tr>
          </tbody>
        </table>

        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 w-8 md:hidden',
            isStudio
              ? 'bg-gradient-to-l from-[#0a162a] to-transparent'
              : 'bg-gradient-to-l from-white to-transparent dark:from-dark-surface'
          )}
        />
      </div>
    </section>
  );
}
