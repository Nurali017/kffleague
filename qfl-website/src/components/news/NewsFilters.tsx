'use client';

import { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NewsFilters as NewsFiltersType } from '@/types';
import { useDebounce } from '@/hooks';

interface NewsFiltersProps {
  filters: NewsFiltersType;
  onFilterChange: (filters: NewsFiltersType) => void;
  className?: string;
  variant?: 'default' | 'hero';
}

export function NewsFilters({
  filters,
  onFilterChange,
  className = '',
  variant = 'default',
}: NewsFiltersProps) {
  const { t } = useTranslation('news');
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const isHero = variant === 'hero';

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 300);

  // Sync searchInput with filters.search when it changes externally
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  // Update filters when debounced search changes
  useEffect(() => {
    // Only update if the debounced search is different from current filter
    if (debouncedSearch !== filters.search) {
      onFilterChange({ ...filters, search: debouncedSearch || undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSortChange = (sort: NewsFiltersType['sort']) => {
    onFilterChange({ ...filters, sort });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFilterChange({
      article_type: filters.article_type,
      tournament_id: filters.tournament_id,
    }); // Keep article_type and tournament filter
  };

  const hasActiveFilters = filters.search || filters.sort;

  return (
    <div className={`mb-6 ${className}`}>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors border ${
            isHero
              ? 'bg-white/90 dark:bg-white/10 border-white/20 dark:border-white/20 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-white/20'
              : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border hover:bg-surface-soft dark:hover:bg-dark-surface-soft'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t('filter', 'Фильтр')}
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-[#E5B73B] text-white text-xs rounded-full">
              {[filters.search, filters.sort].filter(Boolean).length}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
          {/* Search Input */}
          <div className="lg:col-span-8">
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isHero ? 'text-gray-400 dark:text-white/50' : 'text-gray-400 dark:text-slate-500'
                }`}
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t('search', 'Поиск новостей...')}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D8C] dark:focus:ring-blue-500 ${
                  isHero
                    ? 'bg-white/85 dark:bg-white/10 border-gray-200 dark:border-white/15 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/50'
                    : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500'
                }`}
              />
              {searchInput && (
                <button
                  onClick={() => handleSearchChange('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 hover:text-gray-600 ${
                    isHero
                      ? 'text-gray-400 dark:text-white/60 dark:hover:text-white'
                      : 'text-gray-400 dark:text-slate-500 dark:hover:text-slate-300'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sort Select */}
          <div className="lg:col-span-3">
            <div className="relative">
              <select
                value={filters.sort || 'date_desc'}
                onChange={(e) => handleSortChange(e.target.value as NewsFiltersType['sort'])}
                className={`w-full appearance-none px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D8C] dark:focus:ring-blue-500 cursor-pointer ${
                  isHero
                    ? 'bg-white/85 dark:bg-white/10 border-gray-200 dark:border-white/15 text-gray-900 dark:text-white'
                    : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border text-gray-900 dark:text-slate-100'
                }`}
              >
                <option value="date_desc">
                  {t('sortByDate', 'По дате')} ↓
                </option>
                <option value="date_asc">
                  {t('sortByDate', 'По дате')} ↑
                </option>
                <option value="views_desc">
                  {t('sortByViews', 'По просмотрам')}
                </option>
                <option value="likes_desc">
                  {t('sortByLikes', 'По лайкам')}
                </option>
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                  isHero ? 'text-gray-400 dark:text-white/50' : 'text-gray-400 dark:text-slate-500'
                }`}
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="lg:col-span-1">
              <button
                onClick={handleClearFilters}
                className={`w-full h-full min-h-[40px] flex items-center justify-center px-4 py-2 transition-colors ${
                  isHero
                    ? 'text-gray-600 dark:text-white/70 hover:text-[#E5B73B] dark:hover:text-white'
                    : 'text-gray-600 dark:text-slate-400 hover:text-[#E5B73B] dark:hover:text-[#FBBF24]'
                }`}
                title={t('clearFilters', 'Сбросить фильтры')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Active Filters Pills */}
        {hasActiveFilters && (
          <div className={`flex flex-wrap gap-2 mt-3 pt-3 border-t ${
            isHero ? 'border-white/20' : 'border-gray-200 dark:border-dark-border'
          }`}>
            {filters.search && (
              <span className={`inline-flex items-center gap-1 px-3 py-1 text-white text-sm rounded-full ${
                isHero ? 'bg-white/20' : 'bg-[#1E4D8C] dark:bg-cyan-700'
              }`}>
                {t('search', 'Поиск')}: {filters.search}
                <button
                  onClick={() => handleSearchChange('')}
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
