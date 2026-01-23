'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { useTournament } from '@/contexts/TournamentContext';
import { leagueService } from '@/lib/api/services';
import { MatchCenterFilters as FiltersType } from '@/types';
import { MultiSelect } from '@/components/ui';

interface MatchCenterFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: FiltersType) => void;
  className?: string;
}

export function MatchCenterFilters({
  filters,
  onFilterChange,
  className = '',
}: MatchCenterFiltersProps) {
  const { t } = useTranslation('match');
  const { currentSeason } = useTournament();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Load teams from league table
  const { data: tableData } = useSWR(
    ['teams-list', filters.season_id || currentSeason.id],
    () => leagueService.getTable(filters.season_id || currentSeason.id)
  );

  const teams = tableData?.table.map(standing => ({
    id: standing.team_id,
    name: standing.team_name,
    logo_url: standing.team_logo,
  })) ?? [];

  // Generate tour options (1-26) for MultiSelect
  const tours = Array.from({ length: 26 }, (_, i) => ({
    id: i + 1,
    name: `${t('tour')} ${i + 1}`,
  }));

  // Generate month options for MultiSelect
  const months = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: t(`months.${i + 1}`),
  }));

  // Status options for MultiSelect
  const statuses = [
    { id: 'upcoming', name: t('statuses.upcoming') },
    { id: 'live', name: t('statuses.live') },
    { id: 'finished', name: t('statuses.finished') },
  ];

  const handleToursChange = (tourIds: number[]) => {
    onFilterChange({ ...filters, tours: tourIds.length > 0 ? tourIds : undefined });
  };

  const handleTeamsChange = (teamIds: number[]) => {
    onFilterChange({ ...filters, team_ids: teamIds.length > 0 ? teamIds : undefined });
  };

  const handleHidePastToggle = () => {
    onFilterChange({ ...filters, hide_past: !filters.hide_past });
  };

  const handleClearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters =
    (filters.tours && filters.tours.length > 0) ||
    filters.month !== undefined ||
    filters.status !== undefined ||
    (filters.team_ids && filters.team_ids.length > 0) ||
    filters.hide_past;

  return (
    <div className={`mb-6 ${className}`}>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface-soft transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t('filters.showFilters')}
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-[#E5B73B] text-white text-xs rounded-full">
              {[
                filters.tours?.length,
                filters.months?.length,
                filters.statuses?.length,
                filters.team_ids?.length,
                filters.hide_past,
              ].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filters Container */}
      <div
        className={`${
          mobileFiltersOpen ? 'block' : 'hidden'
        } md:block bg-white dark:bg-dark-surface p-4 rounded-lg border border-gray-200 dark:border-slate-700`}
      >
        {/* All Filters in One Row */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          {/* Tour MultiSelect */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5 uppercase">
              Тур (стадия)
            </label>
            <MultiSelect
              options={tours}
              selected={filters.tours || []}
              onChange={handleToursChange}
              placeholder={t('filters.allTours')}
            />
          </div>

          {/* Month Single Select */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5 uppercase">
              Месяц
            </label>
            <select
              value={filters.month || ''}
              onChange={(e) => onFilterChange({
                ...filters,
                month: e.target.value ? Number(e.target.value) : undefined
              })}
              className="w-full px-3 py-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4D8C]"
            >
              <option value="">{t('filters.allMonths')}</option>
              {months.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Clubs Multi-Select */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5 uppercase">
              Клубы
            </label>
            <MultiSelect
              options={teams}
              selected={filters.team_ids || []}
              onChange={handleTeamsChange}
              placeholder={t('filters.allClubs')}
            />
          </div>

          {/* Status Single Select */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5 uppercase">
              Статус
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({
                ...filters,
                status: (e.target.value || undefined) as 'upcoming' | 'finished' | 'live' | 'all' | undefined
              })}
              className="w-full px-3 py-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4D8C]"
            >
              <option value="">{t('statuses.all')}</option>
              {statuses.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Hide Past Toggle */}
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <button
                type="button"
                role="switch"
                aria-checked={filters.hide_past || false}
                onClick={handleHidePastToggle}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E4D8C] focus:ring-offset-2 ${
                  filters.hide_past
                    ? 'bg-[#1E4D8C]'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    filters.hide_past ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className="text-xs text-gray-700 dark:text-slate-300 leading-tight">
                Скрыть<br/>прошедшие
              </span>
            </label>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              className="w-full px-4 py-2 text-sm bg-gray-100 dark:bg-dark-surface-soft hover:bg-gray-200 dark:hover:bg-slate-700 text-[#1E4D8C] dark:text-blue-400 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>

        {/* Active Filters Pills */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.tours && filters.tours.length > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#1E4D8C] text-white text-sm rounded-full">
                {filters.tours.length === 1
                  ? `${t('tour')} ${filters.tours[0]}`
                  : `${filters.tours.length} ${t('tour').toLowerCase()}`}
                <button
                  onClick={() => onFilterChange({ ...filters, tours: undefined })}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.month && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#1E4D8C] text-white text-sm rounded-full">
                {months.find(m => m.id === filters.month)?.name}
                <button
                  onClick={() => onFilterChange({ ...filters, month: undefined })}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#1E4D8C] text-white text-sm rounded-full">
                {statuses.find(s => s.id === filters.status)?.name}
                <button
                  onClick={() => onFilterChange({ ...filters, status: undefined })}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.team_ids && filters.team_ids.length > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#1E4D8C] text-white text-sm rounded-full">
                {t('filters.selectedCount', { count: filters.team_ids.length })}
                <button
                  onClick={() => onFilterChange({ ...filters, team_ids: undefined })}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
