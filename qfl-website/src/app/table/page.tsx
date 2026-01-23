'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useLeagueTable, useResultsGrid } from '@/hooks';
import {
  TableFilters,
  FullLeagueTable,
  TableTabs,
  ResultsGrid,
  type TableTabType,
} from '@/components/table';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { DEFAULT_TOUR } from '@/api/endpoints';

// Skeleton for loading state
function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-[#1E4D8C] h-12" />
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-gray-50">
          <div className="w-8 h-4 bg-gray-200 rounded" />
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="flex-1 h-4 bg-gray-200 rounded" />
          <div className="w-8 h-4 bg-gray-200 rounded" />
          <div className="w-8 h-4 bg-gray-200 rounded" />
          <div className="w-8 h-4 bg-gray-200 rounded" />
          <div className="w-10 h-4 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

// Skeleton for results grid
function ResultsGridSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-[#1E4D8C] h-12" />
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 px-4 py-3 border-b border-gray-50">
          <div className="w-8 h-4 bg-gray-200 rounded" />
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="w-32 h-4 bg-gray-200 rounded" />
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j} className="w-5 h-5 bg-gray-200 rounded-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function LeagueTablePage() {
  const { t } = useTranslation('table');
  const { t: tErrors } = useTranslation('errors');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active tab state
  const [activeTab, setActiveTab] = useState<TableTabType>(() => {
    const tab = searchParams.get('tab');
    return tab === 'results' ? 'results' : 'standings';
  });

  // Initialize state from URL params
  const [tourFrom, setTourFrom] = useState(() => {
    const param = searchParams.get('tour_from');
    return param ? parseInt(param, 10) : 1;
  });

  const [tourTo, setTourTo] = useState(() => {
    const param = searchParams.get('tour_to');
    return param ? parseInt(param, 10) : DEFAULT_TOUR;
  });

  const [homeAway, setHomeAway] = useState<'home' | 'away' | null>(() => {
    const param = searchParams.get('home_away');
    return param === 'home' || param === 'away' ? param : null;
  });

  // Update URL when filters or tab change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab !== 'standings') params.set('tab', activeTab);
    if (tourFrom !== 1) params.set('tour_from', String(tourFrom));
    if (tourTo !== DEFAULT_TOUR) params.set('tour_to', String(tourTo));
    if (homeAway) params.set('home_away', homeAway);

    const queryString = params.toString();
    const newUrl = queryString ? `/table?${queryString}` : '/table';

    router.replace(newUrl, { scroll: false });
  }, [activeTab, tourFrom, tourTo, homeAway, router]);

  // Fetch data based on active tab
  const {
    standings,
    loading: standingsLoading,
    error: standingsError,
    refetch: refetchStandings,
  } = useLeagueTable({
    tourFrom,
    tourTo,
    homeAway,
  });

  const {
    teams: resultsTeams,
    totalTours,
    loading: resultsLoading,
    error: resultsError,
    refetch: refetchResults,
  } = useResultsGrid();

  const handleTabChange = (tab: TableTabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header with geometric background - extends down */}
      <div className="relative">
        {/* Base blue background */}
        <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-r from-[#1E4D8C] to-[#3B82F6]" />
        {/* Geometric pattern overlay */}
        <div
          className="absolute inset-x-0 top-0 h-[400px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/footer-bg.webp)' }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4">
          {/* Title */}
          <div className="pt-8 pb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {t('title')}
            </h1>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <TableTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {/* Standings Tab Content */}
          {activeTab === 'standings' && (
            <>
              {/* Filters - only for standings */}
              <TableFilters
                tourFrom={tourFrom}
                tourTo={tourTo}
                maxTour={DEFAULT_TOUR}
                homeAway={homeAway}
                onTourFromChange={setTourFrom}
                onTourToChange={setTourTo}
                onHomeAwayChange={setHomeAway}
              />

              {/* Content */}
              {standingsLoading ? (
                <TableSkeleton />
              ) : standingsError ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8">
                  <ErrorMessage
                    message={tErrors('loadTable')}
                    onRetry={refetchStandings}
                  />
                </div>
              ) : (
                <FullLeagueTable standings={standings} />
              )}
            </>
          )}

          {/* Results Grid Tab Content */}
          {activeTab === 'results' && (
            <>
              {resultsLoading ? (
                <ResultsGridSkeleton />
              ) : resultsError ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8">
                  <ErrorMessage
                    message={tErrors('loadTable')}
                    onRetry={refetchResults}
                  />
                </div>
              ) : (
                <ResultsGrid teams={resultsTeams} totalTours={totalTours} />
              )}
            </>
          )}

          {/* Bottom padding */}
          <div className="pb-8" />
        </div>
      </div>
    </div>
  );
}
