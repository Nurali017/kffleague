'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils/cn';

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

  if (!items.length) return null;

  return (
    <div className="space-y-2.5">
      {/* Year pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {years.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => handleYearChange(year)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-bold whitespace-nowrap transition-all',
              selectedYear === year
                ? 'bg-primary text-white shadow-sm dark:bg-cyan-600'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/15 dark:hover:text-white/80'
            )}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Tournament pills (only when multiple tournaments in the selected year) */}
      {currentTournaments.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {currentTournaments.map((item) => (
            <button
              key={item.seasonId}
              type="button"
              onClick={() => onSeasonChange(item.seasonId)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all border',
                selectedSeasonId === item.seasonId
                  ? 'bg-primary/10 text-primary border-primary/20 dark:bg-cyan-300/15 dark:text-cyan-300 dark:border-cyan-300/25'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:border-white/10 dark:text-white/50 dark:hover:border-white/20 dark:hover:text-white/70'
              )}
            >
              {item.tournamentName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
