'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { useTournament } from '@/contexts/TournamentContext';

interface SeasonYearSelectorProps {
  variant?: 'default' | 'hero' | 'inline';
}

export function SeasonYearSelector({ variant = 'default' }: SeasonYearSelectorProps) {
  const { t } = useTranslation('common');
  const { tournamentSeasons, effectiveSeasonId, setSeason } = useTournament();

  const selectedYear = useMemo(() => {
    const selected = tournamentSeasons.find((s) => s.seasonId === effectiveSeasonId);
    return selected?.year ?? (tournamentSeasons[0]?.year ?? '');
  }, [tournamentSeasons, effectiveSeasonId]);

  const handleYearChange = (year: string) => {
    const target = tournamentSeasons.find((s) => s.year === year);
    if (target && target.seasonId !== effectiveSeasonId) {
      setSeason(target.seasonId);
    }
  };

  if (tournamentSeasons.length <= 1) return null;

  if (variant === 'hero') {
    return (
      <div className="relative">
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          className="appearance-none bg-white/15 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 pr-8 text-sm font-bold text-white cursor-pointer hover:bg-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          {tournamentSeasons.map((s) => (
            <option key={s.year} value={s.year} className="text-gray-900">
              {s.year}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none" />
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="relative">
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          className="appearance-none bg-transparent border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 pr-8 text-sm font-bold text-gray-900 dark:text-white cursor-pointer hover:border-gray-300 dark:hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-cyan-300/30"
        >
          {tournamentSeasons.map((s) => (
            <option key={s.year} value={s.year}>
              {s.year}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/50 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="relative">
        <label className="block text-[10px] font-bold text-slate-400 dark:text-white/50 uppercase tracking-wider mb-1">
          {t('seasonSelector.year', 'Год')}
        </label>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            className="appearance-none bg-white dark:bg-dark-surface border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 pr-8 text-sm font-bold text-slate-900 dark:text-white cursor-pointer hover:border-gray-300 dark:hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-cyan-300/30"
          >
            {tournamentSeasons.map((s) => (
              <option key={s.year} value={s.year}>
                {s.year}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/50 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
