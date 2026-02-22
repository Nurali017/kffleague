import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { seasonStatsService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { SeasonStatistics } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';

interface UseSeasonStatsOptions {
  seasonId?: number;
}

export function useSeasonStats(options: UseSeasonStatsOptions = {}) {
  const { i18n } = useTranslation();
  const { seasonId = DEFAULT_SEASON_ID } = options;
  const prefetched = useRoutePrefetchValue<SeasonStatistics>(
    prefetchKeys.seasonStats(seasonId, i18n.language)
  );

  const { data, error, isLoading, mutate } = useSWR<SeasonStatistics>(
    queryKeys.stats.season(seasonId, i18n.language),
    () => seasonStatsService.getSeasonStatistics(seasonId, i18n.language),
    {
      fallbackData: prefetched,
    }
  );

  return {
    stats: data,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
