'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useTournament } from '@/contexts/TournamentContext';
import { useCupOverview, useCupSchedule, useLeagueTable, useMatchCenter, useResultsGrid } from '@/hooks';
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
import { CupBracket, CupOverview, CupSchedule } from '@/components/cup';
import { MatchCard } from '@/components/matches/MatchCard';

type LeaguePhase = 'all' | 'groupA' | 'groupB' | 'final';

// Skeleton for loading state
function TableSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden animate-pulse">
      <div className="bg-primary h-12" />
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
      <div className="bg-primary h-12" />
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
  const { currentTournament, effectiveSeasonId, showTable, showBracket } = useTournament();
  const isCup = showBracket;
  const isSecondLeague = currentTournament.id === '2l';

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
  const [roundKey, setRoundKey] = useState<string | null>(() => {
    const param = searchParams.get('round_key');
    return param || null;
  });
  const [phase, setPhase] = useState<LeaguePhase>(() => {
    const param = searchParams.get('phase');
    if (param === 'groupA' || param === 'groupB' || param === 'final') {
      return param;
    }
    return isSecondLeague ? 'groupA' : 'all';
  });

  // Update URL when filters or tab change
  useEffect(() => {
    updateSearchParams(
      {
        tab: activeTab !== 'standings' ? activeTab : undefined,
        tour_from: tourFrom !== 1 ? tourFrom : undefined,
        tour_to: tourTo !== DEFAULT_TOUR ? tourTo : undefined,
        home_away: homeAway ?? undefined,
        round_key: isCup ? roundKey ?? undefined : undefined,
        phase: showTable && isSecondLeague && phase !== 'groupA' ? phase : undefined,
      },
      { replace: true }
    );
  }, [activeTab, tourFrom, tourTo, homeAway, roundKey, phase, isCup, isSecondLeague, showTable]);

  const groupFilter = isSecondLeague && phase === 'groupA'
    ? 'A'
    : isSecondLeague && phase === 'groupB'
      ? 'B'
      : undefined;
  const finalFilter = isSecondLeague && phase === 'final';
  const isFinalPhaseSelected = isSecondLeague && phase === 'final';

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
    group: groupFilter,
    final: finalFilter,
    enabled: showTable && !isFinalPhaseSelected,
  });

  const {
    teams: resultsTeams,
    totalTours,
    loading: resultsLoading,
    error: resultsError,
    refetch: refetchResults,
  } = useResultsGrid({
    seasonId: effectiveSeasonId,
    group: groupFilter,
    final: finalFilter,
    enabled: showTable && !isFinalPhaseSelected,
  });

  const {
    groups: finalGroups,
    loading: finalLoading,
    error: finalError,
    refetch: refetchFinal,
  } = useMatchCenter({
    season_id: effectiveSeasonId,
    final: true,
    group_by_date: true,
    enabled: showTable && isFinalPhaseSelected,
  });

  const {
    overview: cupOverview,
    loading: cupOverviewLoading,
    error: cupOverviewError,
    refetch: refetchCupOverview,
  } = useCupOverview({
    seasonId: effectiveSeasonId,
    enabled: isCup,
  });

  const {
    schedule: cupSchedule,
    loading: cupScheduleLoading,
    error: cupScheduleError,
    refetch: refetchCupSchedule,
  } = useCupSchedule({
    seasonId: effectiveSeasonId,
    roundKey,
    enabled: isCup,
  });

  const resolvedMaxTour = totalTours > 0 ? totalTours : DEFAULT_TOUR;

  useEffect(() => {
    if (!showTable) return;

    if (tourTo > resolvedMaxTour) {
      setTourTo(resolvedMaxTour);
    }
    if (tourFrom > resolvedMaxTour) {
      setTourFrom(1);
    }
  }, [resolvedMaxTour, showTable, tourFrom, tourTo]);

  useEffect(() => {
    if (!isCup && roundKey !== null) {
      setRoundKey(null);
    }
  }, [isCup, roundKey]);

  useEffect(() => {
    if (isSecondLeague && phase === 'all') {
      setPhase('groupA');
      return;
    }
    if (!isSecondLeague && phase !== 'all') {
      setPhase('all');
    }
  }, [isSecondLeague, phase]);

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
            <div className="space-y-4">
              {(cupOverviewLoading || cupScheduleLoading) && (
                <div className="mb-3 flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                  <LoadingSpinner size="sm" />
                  <span>{t('updating', { defaultValue: 'Обновление...' })}</span>
                </div>
              )}

              {(cupOverviewError || cupScheduleError) ? (
                <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-8">
                  <ErrorMessage
                    message={tErrors('loadTable')}
                    onRetry={() => {
                      refetchCupOverview();
                      refetchCupSchedule();
                    }}
                  />
                </div>
              ) : (
                <>
                  {cupOverview && <CupOverview overview={cupOverview} />}
                  {cupOverview?.bracket && <CupBracket bracket={cupOverview.bracket} />}
                  {cupSchedule && (
                    <CupSchedule
                      schedule={cupSchedule}
                      selectedRoundKey={roundKey}
                      onRoundChange={setRoundKey}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {/* Table View for League tournaments */}
          {showTable && (
            <>
              {isSecondLeague && (
                <div className="mb-4 md:mb-6">
                  <div className="inline-flex w-full flex-wrap gap-2 rounded-xl border border-gray-100 bg-white p-2 dark:border-dark-border dark:bg-dark-surface">
                    {(['groupA', 'groupB'] as const).map((value) => (
                      <button
                        key={value}
                        onClick={() => setPhase(value)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                          phase === value
                            ? 'bg-accent text-primary-dark'
                            : 'text-gray-600 hover:text-primary dark:text-slate-300 dark:hover:text-accent-cyan'
                        }`}
                      >
                        {t(`phase.${value}`, {
                          defaultValue:
                            value === 'groupA' ? 'Лига A' : 'Лига B',
                        })}
                      </button>
                    ))}
                    <button
                      onClick={() => setPhase('final')}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        phase === 'final'
                          ? 'bg-accent text-primary-dark'
                          : 'text-gray-600 hover:text-primary dark:text-slate-300 dark:hover:text-accent-cyan'
                      }`}
                    >
                      {t('phase.final', { defaultValue: 'Финал' })}
                    </button>
                  </div>
                </div>
              )}

              {isFinalPhaseSelected ? (
                <div className="space-y-6">
                  <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                      {t('phase.final', { defaultValue: 'Финал' })}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                      {t('finalModeDescription', { defaultValue: 'Финал отображается как отдельный матч без турнирной таблицы.' })}
                    </p>
                  </div>

                  {finalLoading ? (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                      <LoadingSpinner size="sm" />
                      <span>{t('updating', { defaultValue: 'Обновление...' })}</span>
                    </div>
                  ) : finalError ? (
                    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-8">
                      <ErrorMessage
                        message={tErrors('loadTable')}
                        onRetry={refetchFinal}
                      />
                    </div>
                  ) : finalGroups.length === 0 ? (
                    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-8 text-center text-gray-500 dark:text-slate-400">
                      {t('finalModeNoMatches', { defaultValue: 'Матчи финала не найдены.' })}
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {finalGroups.map((group) => (
                        <div key={group.date} className="space-y-4">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-slate-100">
                            {group.date_label}
                          </h3>
                          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                            {group.games.map((match) => (
                              <MatchCard key={match.id} match={match} showTour />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
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
                        maxTour={resolvedMaxTour}
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
            </>
          )}

          {/* Bottom padding */}
          <div className="pb-6 md:pb-8" />
        </div>
      </div>
    </div>
  );
}
