'use client';

import { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NewsFilters as NewsFiltersType } from '@/types';
import { useDebounce } from '@/hooks';

interface NewsFiltersProps {
  filters: NewsFiltersType;
  onFilterChange: (filters: NewsFiltersType) => void;
  categories: string[];
  className?: string;
}

export function NewsFilters({
  filters,
  onFilterChange,
  categories,
  className = '',
}: NewsFiltersProps) {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: category === 'all' ? undefined : category,
    });
  };

  const handleSortChange = (sort: NewsFiltersType['sort']) => {
    onFilterChange({ ...filters, sort });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFilterChange({ article_type: filters.article_type }); // Keep article_type (managed by tabs)
  };

  const hasActiveFilters = filters.search || filters.category || filters.sort;

  return (
    <div className={`mb-6 ${className}`}>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-surface-soft dark:hover:bg-dark-surface-soft transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t('news.filter', 'Фильтр')}
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-[#E5B73B] text-white text-xs rounded-full">
              {[filters.search, filters.category, filters.sort].filter(Boolean).length}
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="md:col-span-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t('news.search', 'Поиск новостей...')}
                className="w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D8C] dark:focus:ring-blue-500 bg-white dark:bg-dark-surface text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
              />
              {searchInput && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Select */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={filters.category || 'all'}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full appearance-none px-4 py-2 pr-10 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D8C] dark:focus:ring-blue-500 bg-white dark:bg-dark-surface text-gray-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="all">
                  {t('news.allCategories', 'Все категории')}
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Sort Select */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={filters.sort || 'date_desc'}
                onChange={(e) => handleSortChange(e.target.value as NewsFiltersType['sort'])}
                className="w-full appearance-none px-4 py-2 pr-10 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4D8C] dark:focus:ring-blue-500 bg-white dark:bg-dark-surface text-gray-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="date_desc">
                  {t('news.sortByDate', 'По дате')} ↓
                </option>
                <option value="date_asc">
                  {t('news.sortByDate', 'По дате')} ↑
                </option>
                <option value="views_desc">
                  {t('news.sortByViews', 'По просмотрам')}
                </option>
                <option value="likes_desc">
                  {t('news.sortByLikes', 'По лайкам')}
                </option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="md:col-span-1">
              <button
                onClick={handleClearFilters}
                className="w-full h-full flex items-center justify-center px-4 py-2 text-gray-600 dark:text-slate-400 hover:text-[#E5B73B] dark:hover:text-[#FBBF24] transition-colors"
                title={t('news.clearFilters', 'Сбросить фильтры')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Active Filters Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#1E4D8C] dark:bg-blue-600 text-white text-sm rounded-full">
                {t('news.search', 'Поиск')}: {filters.search}
                <button
                  onClick={() => handleSearchChange('')}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E5B73B] dark:bg-amber-500 text-white text-sm rounded-full">
                {filters.category}
                <button
                  onClick={() => handleCategoryChange('all')}
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
