import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { leagueService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { ResultsGridResponse } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';

interface UseResultsGridOptions {
  seasonId?: number;
  group?: string | null;
  final?: boolean;
  enabled?: boolean;
}

export function useResultsGrid(options: UseResultsGridOptions = {}) {
  const { i18n } = useTranslation();
  const {
    seasonId = DEFAULT_SEASON_ID,
    group,
    final = false,
    enabled = true,
  } = options;
  const prefetched = useRoutePrefetchValue<ResultsGridResponse>(
    prefetchKeys.resultsGrid(seasonId, group, final, i18n.language)
  );

  const { data, error, isLoading, mutate } = useSWR<ResultsGridResponse>(
    enabled ? queryKeys.league.resultsGrid(seasonId, group, final, i18n.language) : null,
    () => leagueService.getResultsGrid(seasonId, { group: group ?? undefined, final }, i18n.language),
    {
      fallbackData: prefetched,
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  return {
    data,
    teams: data?.teams ?? [],
    totalTours: data?.total_tours ?? 0,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
