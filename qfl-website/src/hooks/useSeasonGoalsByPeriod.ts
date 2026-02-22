import useSWR from 'swr';
import { seasonStatsService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { SeasonGoalsByPeriodResponse } from '@/types/statistics';
import { queryKeys } from '@/lib/api/queryKeys';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';

interface UseSeasonGoalsByPeriodOptions {
  seasonId?: number;
}

export function useSeasonGoalsByPeriod(options: UseSeasonGoalsByPeriodOptions = {}) {
  const { seasonId = DEFAULT_SEASON_ID } = options;
  const prefetched = useRoutePrefetchValue<SeasonGoalsByPeriodResponse>(
    prefetchKeys.seasonGoalsByPeriod(seasonId)
  );

  const { data, error, isLoading, mutate } = useSWR<SeasonGoalsByPeriodResponse>(
    queryKeys.stats.goalsByPeriod(seasonId),
    () => seasonStatsService.getGoalsByPeriod(seasonId),
    {
      fallbackData: prefetched,
    }
  );

  return {
    goalsByPeriod: data?.periods ?? null,
    meta: data?.meta ?? null,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
