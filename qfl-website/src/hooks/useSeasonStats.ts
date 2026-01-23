import useSWR from 'swr';
import { seasonStatsService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID } from '@/api/endpoints';
import { SeasonStatistics } from '@/types';

interface UseSeasonStatsOptions {
  seasonId?: number;
}

export function useSeasonStats(options: UseSeasonStatsOptions = {}) {
  const { seasonId = DEFAULT_SEASON_ID } = options;

  const { data, error, isLoading, mutate } = useSWR<SeasonStatistics>(
    ['seasonStats', seasonId],
    () => seasonStatsService.getSeasonStatistics(seasonId)
  );

  return {
    stats: data,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
