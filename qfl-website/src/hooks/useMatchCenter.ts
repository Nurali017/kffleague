import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { matchService } from '@/lib/api/services';
import { MatchCenterFilters, GroupedMatchesResponse } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';

interface UseMatchCenterOptions extends MatchCenterFilters {
  enabled?: boolean;
}

export function useMatchCenter(options: UseMatchCenterOptions = {}) {
  const { i18n } = useTranslation();
  const { enabled = true, ...filters } = options;

  const filtersWithDefaults: MatchCenterFilters = {
    group_by_date: true,
    language: i18n.language,
    ...filters,
  };
  const filtersHash = JSON.stringify(filtersWithDefaults);
  const prefetched = useRoutePrefetchValue<GroupedMatchesResponse>(
    prefetchKeys.matchCenter(filtersHash)
  );

  const { data, error, isLoading, mutate } = useSWR(
    enabled ? queryKeys.games.center(filtersHash) : null,
    () => matchService.getMatchCenter(filtersWithDefaults) as Promise<GroupedMatchesResponse>,
    {
      fallbackData: prefetched,
    }
  );

  return {
    groups: data?.groups ?? [],
    total: data?.total ?? 0,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
