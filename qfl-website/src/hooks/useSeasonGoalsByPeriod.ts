import useSWR from 'swr';
import { seasonStatsService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { SeasonGoalsByPeriodResponse } from '@/types/statistics';

interface UseSeasonGoalsByPeriodOptions {
  seasonId?: number;
}

export function useSeasonGoalsByPeriod(options: UseSeasonGoalsByPeriodOptions = {}) {
  const { seasonId = DEFAULT_SEASON_ID } = options;

  const { data, error, isLoading, mutate } = useSWR<SeasonGoalsByPeriodResponse>(
    ['seasonGoalsByPeriod', seasonId],
    () => seasonStatsService.getGoalsByPeriod(seasonId)
  );

  return {
    goalsByPeriod: data?.periods ?? null,
    meta: data?.meta ?? null,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
