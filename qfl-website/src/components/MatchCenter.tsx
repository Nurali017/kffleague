'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useTournament } from '@/contexts/TournamentContext';
import { useMatchCenter } from '@/hooks';
import { MatchCenterFilters } from '@/components/matches/MatchCenterFilters';
import { MatchCard } from '@/components/matches/MatchCard';
import { MatchCenterSkeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { formatMatchDate } from '@/lib/utils/dateFormat';
import { MatchCenterFilters as FiltersType } from '@/types';
import { getMatchCenterFiltersFromUrl, syncMatchCenterFiltersToUrl } from '@/lib/utils/urlState';

export function MatchCenter() {
  const { t, i18n } = useTranslation('match');
  const { t: tErrors } = useTranslation('errors');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { effectiveSeasonId } = useTournament();

  // Initialize filters from URL
  const [filters, setFilters] = useState<FiltersType>(() =>
    getMatchCenterFiltersFromUrl(searchParams)
  );

  // Sync state with URL changes (browser back/forward)
  useEffect(() => {
    const newFilters = getMatchCenterFiltersFromUrl(searchParams);
    setFilters(newFilters);
  }, [searchParams]);

  // Fetch data with current filters
  const { groups, total, loading, error, refetch } = useMatchCenter({
    season_id: filters.season_id || effectiveSeasonId,
    ...filters,
  });

  // Sync filters to URL when they change
  const handleFilterChange = (newFilters: FiltersType) => {
    setFilters(newFilters);

    // Build URL with new filters
    const params = new URLSearchParams();

    if (newFilters.season_id) params.set('season_id', String(newFilters.season_id));
    if (newFilters.tours?.length) params.set('tours', newFilters.tours.join(','));
    if (newFilters.team_ids?.length) params.set('team_ids', newFilters.team_ids.join(','));
    if (newFilters.month) params.set('month', String(newFilters.month));
    if (newFilters.year) params.set('year', String(newFilters.year));
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.hide_past) params.set('hide_past', 'true');

    // Update URL
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl, { scroll: false });
  };

  if (loading) {
    return <MatchCenterSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
        <ErrorMessage message={tErrors('loadMatches')} onRetry={refetch} compact />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <MatchCenterFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Total count */}
      {total > 0 && (
        <div className="text-sm text-gray-600 dark:text-slate-400">
          {t('totalMatches', { count: total })}
        </div>
      )}

      {/* Grouped matches */}
      {groups.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
          <p className="text-gray-500 dark:text-slate-400 text-lg">
            {Object.keys(filters).length > 0
              ? t('noMatchesFiltered')
              : t('noData.noMatches', { ns: 'common' })}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.date} className="space-y-4">
              {/* Date header */}
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-slate-100 capitalize">
                {group.date_label || formatMatchDate(group.date, i18n.language)}
              </h2>

              {/* Matches in this date group */}
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
  );
}
