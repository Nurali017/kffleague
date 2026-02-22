'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { useTournament } from '@/contexts/TournamentContext';
import { teamService } from '@/lib/api/services';
import { MatchCenterFilters as FiltersType } from '@/types';
import { MultiSelect } from '@/components/ui';

interface MatchCenterFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: FiltersType) => void;
  className?: string;
  variant?: 'default' | 'hero';
}

export function MatchCenterFilters({
  filters,
  onFilterChange,
  className = '',
  variant = 'default',
}: MatchCenterFiltersProps) {
  const { t } = useTranslation('match');
  const { i18n } = useTranslation();
  const { effectiveSeasonId } = useTournament();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const isHero = variant === 'hero';

  // Load teams from season participants endpoint to support cup/2l flows.
  const { data: teamsData } = useSWR(
    ['teams-list', filters.season_id || effectiveSeasonId, i18n.language],
    () => teamService.getTeams(filters.season_id || effectiveSeasonId, i18n.language)
  );

  const teams = teamsData?.map(team => ({
    id: team.id,
    name: team.name,
    logo_url: team.logo_url,
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
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors border ${
            isHero
              ? 'bg-white/90 dark:bg-white/10 border-white/20 dark:border-white/20 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-white/20'
              : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-surface-soft'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t('filters.showFilters')}
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-accent text-white text-xs rounded-full">
              {[
                filters.tours?.length,
                filters.month,
                filters.status,
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
        } md:block p-4 rounded-lg border ${
          isHero
            ? 'bg-white/80 dark:bg-dark-bg/50 border-white/15 dark:border-white/10 backdrop-blur-md'
            : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border'
        }`}
      >
        {/* All Filters in One Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          {/* Tour MultiSelect */}
          <div className="sm:col-span-1 lg:col-span-1">
            <label className={`block text-xs font-medium mb-1.5 uppercase ${
              isHero ? 'text-gray-500 dark:text-white/60' : 'text-gray-500 dark:text-slate-400'
            }`}>
              Тур (стадия)
            </label>
            <MultiSelect
              options={tours}
              selected={filters.tours || []}
              onChange={handleToursChange}
              placeholder={t('filters.allTours')}
              variant={isHero ? 'hero' : 'default'}
            />
          </div>

          {/* Month Single Select */}
          <div className="sm:col-span-1 lg:col-span-1">
            <label className={`block text-xs font-medium mb-1.5 uppercase ${
              isHero ? 'text-gray-500 dark:text-white/60' : 'text-gray-500 dark:text-slate-400'
            }`}>
              Месяц
            </label>
            <select
              value={filters.month || ''}
              onChange={(e) => onFilterChange({
                ...filters,
                month: e.target.value ? Number(e.target.value) : undefined
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                isHero
                  ? 'bg-white/85 dark:bg-white/10 border-gray-200 dark:border-white/15 text-gray-900 dark:text-white'
                  : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border text-gray-900 dark:text-slate-100'
              }`}
            >
              <option value="">{t('filters.allMonths')}</option>
              {months.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Clubs Multi-Select */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className={`block text-xs font-medium mb-1.5 uppercase ${
              isHero ? 'text-gray-500 dark:text-white/60' : 'text-gray-500 dark:text-slate-400'
            }`}>
              Клубы
            </label>
            <MultiSelect
              options={teams}
              selected={filters.team_ids || []}
              onChange={handleTeamsChange}
              placeholder={t('filters.allClubs')}
              variant={isHero ? 'hero' : 'default'}
            />
          </div>

          {/* Status Single Select */}
          <div className="sm:col-span-1 lg:col-span-1">
            <label className={`block text-xs font-medium mb-1.5 uppercase ${
              isHero ? 'text-gray-500 dark:text-white/60' : 'text-gray-500 dark:text-slate-400'
            }`}>
              Статус
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({
                ...filters,
                status: (e.target.value || undefined) as 'upcoming' | 'finished' | 'live' | 'all' | undefined
              })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                isHero
                  ? 'bg-white/85 dark:bg-white/10 border-gray-200 dark:border-white/15 text-gray-900 dark:text-white'
                  : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border text-gray-900 dark:text-slate-100'
              }`}
            >
              <option value="">{t('statuses.all')}</option>
              {statuses.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Hide Past Toggle */}
          <div className="flex items-end pb-1 sm:pb-2">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <button
                type="button"
                role="switch"
                aria-checked={filters.hide_past || false}
                onClick={handleHidePastToggle}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  filters.hide_past
                    ? 'bg-primary'
                    : isHero
                      ? 'bg-gray-200 dark:bg-white/20'
                      : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    filters.hide_past ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className={`text-xs leading-tight ${
                isHero ? 'text-gray-700 dark:text-white/70' : 'text-gray-700 dark:text-slate-300'
              }`}>
                Скрыть<br/>прошедшие
              </span>
            </label>
          </div>

          {/* Reset Button */}
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
                isHero
                  ? 'bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-primary dark:text-white'
                  : 'bg-gray-100 dark:bg-dark-surface-soft hover:bg-gray-200 dark:hover:bg-dark-surface-soft text-primary dark:text-accent-cyan'
              }`}
            >
              Сбросить фильтры
            </button>
          </div>
        </div>

        {/* Active Filters Pills */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.tours && filters.tours.length > 0 && (
              <span className={`inline-flex items-center gap-1 px-3 py-1 text-white text-sm rounded-full ${
                isHero ? 'bg-white/20' : 'bg-primary'
              }`}>
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
              <span className={`inline-flex items-center gap-1 px-3 py-1 text-white text-sm rounded-full ${
                isHero ? 'bg-white/20' : 'bg-primary'
              }`}>
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
              <span className={`inline-flex items-center gap-1 px-3 py-1 text-white text-sm rounded-full ${
                isHero ? 'bg-white/20' : 'bg-primary'
              }`}>
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
              <span className={`inline-flex items-center gap-1 px-3 py-1 text-white text-sm rounded-full ${
                isHero ? 'bg-white/20' : 'bg-primary'
              }`}>
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
