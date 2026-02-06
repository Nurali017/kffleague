'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useTournament } from '@/contexts/TournamentContext';
import { useLeagueTable, useResultsGrid } from '@/hooks';
import {
  TableFilters,
  FullLeagueTable,
  TableTabs,
  ResultsGrid,
  type TableTabType,
} from '@/components/table';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingSpinner } from '@/components/ui';
import { HeroBackground } from '@/components/ui/HeroBackground';
import { DEFAULT_TOUR } from '@/lib/api/endpoints';
import { updateSearchParams } from '@/lib/utils/urlState';

// Skeleton for loading state
function TableSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden animate-pulse">
      <div className="bg-[#1E4D8C] h-12" />
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-gray-50 dark:border-dark-border">
          <div className="w-8 h-4 bg-gray-200 dark:bg-dark-surface-soft rounded" />
          <div className="w-6 h-6 bg-gray-200 dark:bg-dark-surface-soft rounded-full" />
          <div className="flex-1 h-4 bg-gray-200 dark:bg-dark-surface-soft rounded" />
          <div className="w-8 h-4 bg-gray-200 dark:bg-dark-surface-soft rounded" />
          <div className="w-8 h-4 bg-gray-200 dark:bg-dark-surface-soft rounded" />
          <div className="w-8 h-4 bg-gray-200 dark:bg-dark-surface-soft rounded" />
          <div className="w-10 h-4 bg-gray-200 dark:bg-dark-surface-soft rounded" />
        </div>
      ))}
    </div>
  );
}

// Skeleton for results grid
function ResultsGridSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden animate-pulse">
      <div className="bg-[#1E4D8C] h-12" />
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 px-4 py-3 border-b border-gray-50 dark:border-dark-border">
          <div className="w-8 h-4 bg-gray-200 dark:bg-dark-surface-soft rounded" />
          <div className="w-6 h-6 bg-gray-200 dark:bg-dark-surface-soft rounded-full" />
          <div className="w-32 h-4 bg-gray-200 dark:bg-dark-surface-soft rounded" />
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j} className="w-5 h-5 bg-gray-200 dark:bg-dark-surface-soft rounded-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function LeagueTablePage() {
  const { t } = useTranslation('table');
  const { t: tErrors } = useTranslation('errors');
  const searchParams = useSearchParams();
  const { effectiveSeasonId, showTable, showBracket, currentTournament } = useTournament();

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
    updateSearchParams(
      {
        tab: activeTab !== 'standings' ? activeTab : undefined,
        tour_from: tourFrom !== 1 ? tourFrom : undefined,
        tour_to: tourTo !== DEFAULT_TOUR ? tourTo : undefined,
        home_away: homeAway ?? undefined,
      },
      { replace: true }
    );
  }, [activeTab, tourFrom, tourTo, homeAway]);

  // Fetch data based on active tab and selected tournament
  const {
    standings,
    loading: standingsLoading,
    error: standingsError,
    refetch: refetchStandings,
  } = useLeagueTable({
    seasonId: effectiveSeasonId,
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
  } = useResultsGrid({
    seasonId: effectiveSeasonId,
  });

  const hasStandings = standings.length > 0;
  const showStandingsSkeleton = standingsLoading && !hasStandings;
  const showStandingsUpdating = standingsLoading && hasStandings;

  const hasResults = resultsTeams.length > 0;
  const showResultsSkeleton = resultsLoading && !hasResults;
  const showResultsUpdating = resultsLoading && hasResults;

  const handleTabChange = (tab: TableTabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Hero Header with geometric background - extends down */}
      <div className="relative">
        <HeroBackground
          className="absolute inset-x-0 top-0 h-[320px] md:h-[400px]"
          patternClassName="absolute inset-x-0 top-0 h-[320px] md:h-[400px]"
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4">
          {/* Title - dynamic based on tournament type */}
          <div className="pt-6 md:pt-8 pb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              {showBracket ? t('bracketTitle', { defaultValue: 'Кубок турнирі' }) : t('title')}
            </h1>
          </div>

          {/* Bracket View for Cup tournaments */}
          {showBracket && (
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
              <div className="bg-[#1E4D8C] px-4 md:px-6 py-3 md:py-4">
                <h2 className="text-base md:text-lg font-bold text-white">{currentTournament.name.ru}</h2>
              </div>
              <div className="p-5 md:p-8 text-center">
                <p className="text-gray-500 dark:text-slate-400 mb-4">
                  {t('bracketComingSoon', { defaultValue: 'Кубок турнирінің кестесі жуықта қолжетімді болады' })}
                </p>
                <p className="text-sm text-gray-400 dark:text-slate-500">
                  {t('bracketDescription', { defaultValue: 'Турнир сетка скоро будет доступна' })}
                </p>
              </div>
            </div>
          )}

          {/* Table View for League tournaments */}
          {showTable && (
            <>
              {/* Tabs */}
              <div className="mb-4 md:mb-6">
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

                  {showStandingsUpdating && (
                    <div className="mb-3 flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                      <LoadingSpinner size="sm" />
                      <span>{t('updating', { defaultValue: 'Обновление...' })}</span>
                    </div>
                  )}

                  {/* Content */}
                  {showStandingsSkeleton ? (
                    <TableSkeleton />
                  ) : standingsError ? (
                    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-8">
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
                  {showResultsUpdating && (
                    <div className="mb-3 flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                      <LoadingSpinner size="sm" />
                      <span>{t('updating', { defaultValue: 'Обновление...' })}</span>
                    </div>
                  )}

                  {showResultsSkeleton ? (
                    <ResultsGridSkeleton />
                  ) : resultsError ? (
                    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-8">
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
            </>
          )}

          {/* Bottom padding */}
          <div className="pb-6 md:pb-8" />
        </div>
      </div>
    </div>
  );
}
