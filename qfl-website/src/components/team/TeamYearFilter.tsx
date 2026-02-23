'use client';

import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import type { TeamYearOption } from '@/hooks/useTeam';

interface TeamYearFilterProps {
  items: TeamYearOption[];
  selectedSeasonId: number;
  onSeasonChange: (seasonId: number) => void;
}

export function TeamYearFilter({ items, selectedSeasonId, onSeasonChange }: TeamYearFilterProps) {
  const { t } = useTranslation('common');

  const selectedYear = useMemo(() => {
    const selected = items.find((item) => item.seasonId === selectedSeasonId);
    return selected?.year ?? (items[0]?.year ?? '');
  }, [items, selectedSeasonId]);

  useEffect(() => {
    if (!items.length) return;
    const hasSelected = items.some((item) => item.seasonId === selectedSeasonId);
    if (!hasSelected) {
      onSeasonChange(items[0].seasonId);
    }
  }, [items, onSeasonChange, selectedSeasonId]);

  const handleYearChange = (year: string) => {
    const target = items.find((item) => item.year === year);
    if (target && target.seasonId !== selectedSeasonId) {
      onSeasonChange(target.seasonId);
    }
  };

  if (!items.length) return null;

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
            {items.map((item) => (
              <option key={item.year} value={item.year}>
                {item.year}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/50 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
