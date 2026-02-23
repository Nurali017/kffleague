'use client';

import { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { NewsFilters as NewsFiltersType } from '@/types';
import { NewsGrid } from '@/components/news/NewsGrid';
import { NewsFilters } from '@/components/news/NewsFilters';
import { NewsTabs } from '@/components/news/NewsTabs';
import { NewsPagination } from '@/components/news/NewsPagination';
import { useTournament } from '@/contexts/TournamentContext';
import { useNewsPagination } from '@/hooks';
import { buildSearchParams, getFiltersFromSearchParams, getPageFromSearchParams } from '@/lib/utils/urlState';
import { HeroBackground } from '@/components/ui/HeroBackground';

function NewsPageContent() {
  const { t, ready } = useTranslation('news');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { currentTournament } = useTournament();
  const [mounted, setMounted] = useState(false);

  const filters = useMemo<NewsFiltersType>(() => {
    const parsed = getFiltersFromSearchParams(new URLSearchParams(searchParams.toString()));
    return {
      ...parsed,
      championship_code: currentTournament.id,
    };
  }, [currentTournament.id, searchParams]);

  const page = useMemo(
    () => getPageFromSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const getCurrentUrl = useCallback(() => {
    const currentQuery = searchParams.toString();
    return currentQuery ? `${pathname}?${currentQuery}` : pathname;
  }, [pathname, searchParams]);

  const buildNewsUrl = useCallback(
    (nextFilters: NewsFiltersType, nextPage: number) => {
      const nextParams = buildSearchParams(searchParams, {
        championship_code: nextFilters.championship_code,
        article_type: nextFilters.article_type,
        search: nextFilters.search,
        sort: nextFilters.sort,
        dateFrom: nextFilters.dateFrom,
        dateTo: nextFilters.dateTo,
        page: nextPage > 1 ? nextPage : undefined,
      });

      const nextQuery = nextParams.toString();
      return nextQuery ? `${pathname}?${nextQuery}` : pathname;
    },
    [pathname, searchParams]
  );

  // Keep URL championship in sync with selected tournament
  useEffect(() => {
    if (searchParams.get('championship_code') === currentTournament.id) {
      return;
    }

    const nextUrl = buildNewsUrl(filters, 1);
    const currentUrl = getCurrentUrl();
    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [buildNewsUrl, currentTournament.id, filters, getCurrentUrl, router, searchParams]);

  const { news, loading, totalPages } = useNewsPagination(filters, page, 12);

  // Determine active tab from filters
  const activeTab = filters.article_type === 'news' ? 'news'
    : filters.article_type === 'analytics' ? 'analytics'
    : 'all';

  const handleTabChange = (tab: 'all' | 'news' | 'analytics') => {
    const newFilters = {
      ...filters,
      article_type: tab === 'all' ? undefined : tab as NewsFiltersType['article_type'],
    };
    const nextUrl = buildNewsUrl(newFilters, 1);
    const currentUrl = getCurrentUrl();
    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  };

  const handleFilterChange = (newFilters: NewsFiltersType) => {
    const nextUrl = buildNewsUrl(newFilters, 1);
    const currentUrl = getCurrentUrl();
    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  };

  const handlePageChange = (newPage: number) => {
    const nextUrl = buildNewsUrl(filters, newPage);
    const currentUrl = getCurrentUrl();
    if (nextUrl !== currentUrl) {
      router.push(nextUrl, { scroll: false });
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || !ready) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <div className="relative">
          <HeroBackground
            className="absolute inset-x-0 top-0 h-[320px] md:h-[400px]"
            patternClassName="absolute inset-x-0 top-0 h-[320px] md:h-[400px]"
          />
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 pt-6 md:pt-8 pb-10">
            <div className="h-10 w-48 bg-white/20 rounded" />
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 -mt-4 md:-mt-6 pb-8">
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
          className="absolute inset-x-0 top-0 h-[320px] md:h-[400px]"
          patternClassName="absolute inset-x-0 top-0 h-[320px] md:h-[400px]"
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 pt-6 md:pt-8 pb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            {t('title')}
          </h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 -mt-4 md:-mt-6 pb-8">
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
            className="absolute inset-x-0 top-0 h-[320px] md:h-[400px]"
            patternClassName="absolute inset-x-0 top-0 h-[320px] md:h-[400px]"
          />
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 pt-6 md:pt-8 pb-10">
            <div className="h-10 w-48 bg-white/20 rounded" />
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 -mt-4 md:-mt-6 pb-8">
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
