'use client';

import { useTranslation } from 'react-i18next';
import { Filter } from 'lucide-react';

interface TableFiltersProps {
  tourFrom: number;
  tourTo: number;
  maxTour: number;
  homeAway: 'home' | 'away' | null;
  onTourFromChange: (value: number) => void;
  onTourToChange: (value: number) => void;
  onHomeAwayChange: (value: 'home' | 'away' | null) => void;
}

export function TableFilters({
  tourFrom,
  tourTo,
  maxTour,
  homeAway,
  onTourFromChange,
  onTourToChange,
  onHomeAwayChange,
}: TableFiltersProps) {
  const { t } = useTranslation('table');

  const tourOptions = Array.from({ length: maxTour }, (_, i) => i + 1);

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border p-3 sm:p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">{t('filters.title')}</span>
        </div>

        {/* Tour range */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-sm text-gray-500 dark:text-slate-400">{t('filters.tour')}</label>
          <select
            value={tourFrom}
            onChange={(e) => onTourFromChange(Number(e.target.value))}
            className="min-w-0 flex-1 sm:flex-none px-3 py-1.5 text-sm border border-gray-200 dark:border-dark-border-soft rounded-lg focus:outline-none focus:border-[#1E4D8C] dark:focus:border-blue-400 bg-white dark:bg-dark-surface-soft dark:text-slate-100"
          >
            {tourOptions.map((tour) => (
              <option key={tour} value={tour} disabled={tour > tourTo}>
                {tour}
              </option>
            ))}
          </select>
          <span className="text-gray-400 dark:text-slate-500">—</span>
          <select
            value={tourTo}
            onChange={(e) => onTourToChange(Number(e.target.value))}
            className="min-w-0 flex-1 sm:flex-none px-3 py-1.5 text-sm border border-gray-200 dark:border-dark-border-soft rounded-lg focus:outline-none focus:border-[#1E4D8C] dark:focus:border-blue-400 bg-white dark:bg-dark-surface-soft dark:text-slate-100"
          >
            {tourOptions.map((tour) => (
              <option key={tour} value={tour} disabled={tour < tourFrom}>
                {tour}
              </option>
            ))}
          </select>
        </div>

        {/* Home/Away toggle */}
        <div className="flex items-center w-full sm:w-auto">
          <div className="inline-flex w-full sm:w-auto rounded-lg border border-gray-200 dark:border-dark-border-soft p-0.5 bg-gray-50 dark:bg-dark-surface">
            <button
              onClick={() => onHomeAwayChange(null)}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                homeAway === null
                  ? 'bg-[#E5B73B] text-[#0F2D52] shadow-sm'
                  : 'text-gray-600 dark:text-slate-300 hover:text-[#1E4D8C] dark:hover:text-accent-cyan'
              }`}
            >
              {t('filters.all')}
            </button>
            <button
              onClick={() => onHomeAwayChange('home')}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                homeAway === 'home'
                  ? 'bg-[#E5B73B] text-[#0F2D52] shadow-sm'
                  : 'text-gray-600 dark:text-slate-300 hover:text-[#1E4D8C] dark:hover:text-accent-cyan'
              }`}
            >
              {t('filters.home')}
            </button>
            <button
              onClick={() => onHomeAwayChange('away')}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                homeAway === 'away'
                  ? 'bg-[#E5B73B] text-[#0F2D52] shadow-sm'
                  : 'text-gray-600 dark:text-slate-300 hover:text-[#1E4D8C] dark:hover:text-accent-cyan'
              }`}
            >
              {t('filters.away')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
