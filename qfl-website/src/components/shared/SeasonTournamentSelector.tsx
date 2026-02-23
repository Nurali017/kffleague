'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

export interface SeasonTournamentItem {
  seasonId: number;
  seasonName: string;
  year: string;
  tournamentName: string;
}

interface SeasonTournamentSelectorProps {
  items: SeasonTournamentItem[];
  selectedSeasonId: number | null;
  onSeasonChange: (seasonId: number) => void;
}

export function SeasonTournamentSelector({
  items,
  selectedSeasonId,
  onSeasonChange,
}: SeasonTournamentSelectorProps) {
  const { t } = useTranslation('common');

  const { years, tournamentsByYear, selectedYear } = useMemo(() => {
    const byYear = new Map<string, SeasonTournamentItem[]>();
    for (const item of items) {
      const list = byYear.get(item.year) ?? [];
      list.push(item);
      byYear.set(item.year, list);
    }

    const sortedYears = Array.from(byYear.keys()).sort((a, b) => Number(b) - Number(a));

    let activeYear = sortedYears[0] ?? '';
    if (selectedSeasonId) {
      for (const [year, yearItems] of byYear.entries()) {
        if (yearItems.some((i) => i.seasonId === selectedSeasonId)) {
          activeYear = year;
          break;
        }
      }
    }

    return {
      years: sortedYears,
      tournamentsByYear: byYear,
      selectedYear: activeYear,
    };
  }, [items, selectedSeasonId]);

  const currentTournaments = tournamentsByYear.get(selectedYear) ?? [];

  const handleYearChange = (year: string) => {
    const yearItems = tournamentsByYear.get(year);
    if (yearItems?.length) {
      onSeasonChange(yearItems[0].seasonId);
    }
  };

  const handleTournamentChange = (seasonId: number) => {
    onSeasonChange(seasonId);
  };

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <label className="block text-[10px] font-bold text-slate-400 dark:text-white/50 uppercase tracking-wider mb-1">
          {t('seasonSelector.year', 'Жыл')}
        </label>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            className="appearance-none bg-white dark:bg-dark-surface border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 pr-8 text-sm font-bold text-slate-900 dark:text-white cursor-pointer hover:border-gray-300 dark:hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-cyan-300/30"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/50 pointer-events-none" />
        </div>
      </div>

      <div className="relative">
        <label className="block text-[10px] font-bold text-slate-400 dark:text-white/50 uppercase tracking-wider mb-1">
          {t('seasonSelector.tournament', 'Турнир')}
        </label>
        <div className="relative">
          <select
            value={selectedSeasonId ?? ''}
            onChange={(e) => handleTournamentChange(Number(e.target.value))}
            className="appearance-none bg-white dark:bg-dark-surface border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 pr-8 text-sm font-bold text-slate-900 dark:text-white cursor-pointer hover:border-gray-300 dark:hover:border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-cyan-300/30"
          >
            {currentTournaments.map((item) => (
              <option key={item.seasonId} value={item.seasonId}>
                {item.tournamentName}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/50 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
