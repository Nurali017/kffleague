'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import { NewsFilters as NewsFiltersType } from '@/types';
import { NewsGrid } from '@/components/news/NewsGrid';
import { NewsFilters } from '@/components/news/NewsFilters';
import { NewsTabs } from '@/components/news/NewsTabs';
import { NewsPagination } from '@/components/news/NewsPagination';
import { useNewsPagination, useNewsCategories } from '@/hooks';
import { getFiltersFromSearchParams, getPageFromSearchParams, syncFiltersToUrl } from '@/lib/utils/urlState';

export default function NewsPage() {
  const { t } = useTranslation('news');
  const searchParams = useSearchParams();

  // Initialize state from URL
  const [filters, setFilters] = useState<NewsFiltersType>(() =>
    getFiltersFromSearchParams(searchParams)
  );
  const [page, setPage] = useState(() => getPageFromSearchParams(searchParams));

  // Fetch data
  const { news, loading, totalPages } = useNewsPagination(filters, page, 12);
  const { categories } = useNewsCategories();

  // Sync URL when filters or page change
  useEffect(() => {
    syncFiltersToUrl(filters, page);
  }, [filters, page]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const newFilters = getFiltersFromSearchParams(new URLSearchParams(window.location.search));
      const newPage = getPageFromSearchParams(new URLSearchParams(window.location.search));
      setFilters(newFilters);
      setPage(newPage);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Determine active tab from filters
  const activeTab = filters.article_type === 'news' ? 'news'
    : filters.article_type === 'analytics' ? 'analytics'
    : 'all';

  const handleTabChange = (tab: 'all' | 'news' | 'analytics') => {
    const newFilters = {
      ...filters,
      article_type: tab === 'all' ? undefined : tab as NewsFiltersType['article_type'],
    };
    setFilters(newFilters);
    setPage(1); // Reset to first page when tab changes
  };

  const handleFilterChange = (newFilters: NewsFiltersType) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1E4D8C] dark:text-blue-400">
          {t('title')}
        </h1>
      </div>

      {/* Tabs */}
      <NewsTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mb-6"
      />

      {/* Filters */}
      <NewsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
      />

      {/* News Grid */}
      <NewsGrid news={news} loading={loading} showStats />

      {/* Pagination */}
      <NewsPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
