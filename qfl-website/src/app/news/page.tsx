'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import { NewsFilters as NewsFiltersType } from '@/types';
import { NewsGrid } from '@/components/news/NewsGrid';
import { NewsFilters } from '@/components/news/NewsFilters';
import { NewsTabs } from '@/components/news/NewsTabs';
import { NewsPagination } from '@/components/news/NewsPagination';
import { useTournament } from '@/contexts/TournamentContext';
import { useNewsPagination } from '@/hooks';
import { getFiltersFromSearchParams, getPageFromSearchParams, syncFiltersToUrl } from '@/lib/utils/urlState';
import { HeroBackground } from '@/components/ui/HeroBackground';

function NewsPageContent() {
  const { t, ready } = useTranslation('news');
  const searchParams = useSearchParams();
  const { currentTournament } = useTournament();

  // Initialize state from URL
  const [filters, setFilters] = useState<NewsFiltersType>(() => ({
    ...getFiltersFromSearchParams(searchParams),
    tournament_id: currentTournament.id,
  }));
  const [page, setPage] = useState(() => getPageFromSearchParams(searchParams));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch data
  const { news, loading, totalPages } = useNewsPagination(filters, page, 12);

  // Sync URL when filters or page change
  useEffect(() => {
    syncFiltersToUrl(filters, page);
  }, [filters, page]);

  // Sync tournament filter from header selection
  useEffect(() => {
    setFilters((prev) => {
      if (prev.tournament_id === currentTournament.id) return prev;
      return { ...prev, tournament_id: currentTournament.id };
    });
    setPage(1);
  }, [currentTournament.id]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const newFilters = {
        ...getFiltersFromSearchParams(new URLSearchParams(window.location.search)),
        tournament_id: currentTournament.id,
      };
      const newPage = getPageFromSearchParams(new URLSearchParams(window.location.search));
      setFilters(newFilters);
      setPage(newPage);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentTournament.id]);

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

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || !ready) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <div className="relative">
          <HeroBackground
            className="absolute inset-x-0 top-0 h-[400px]"
            patternClassName="absolute inset-x-0 top-0 h-[400px]"
          />
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 pt-8 pb-10">
            <div className="h-10 w-48 bg-white/20 rounded" />
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 -mt-6 pb-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-dark-surface-soft rounded mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-dark-surface-soft rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="relative">
        <HeroBackground
          className="absolute inset-x-0 top-0 h-[400px]"
          patternClassName="absolute inset-x-0 top-0 h-[400px]"
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 pt-8 pb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {t('title')}
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 -mt-6 pb-8">
        {/* Tabs */}
        <NewsTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          variant="hero"
          className="mb-6"
        />

        {/* Filters */}
        <NewsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          variant="hero"
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
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <div className="relative">
          <HeroBackground
            className="absolute inset-x-0 top-0 h-[400px]"
            patternClassName="absolute inset-x-0 top-0 h-[400px]"
          />
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 pt-8 pb-10">
            <div className="h-10 w-48 bg-white/20 rounded" />
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 -mt-6 pb-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-dark-surface-soft rounded mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-dark-surface-soft rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <NewsPageContent />
    </Suspense>
  );
}
