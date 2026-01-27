import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { seasonStatsService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID } from '@/api/endpoints';
import { SeasonStatistics } from '@/types';

interface UseSeasonStatsOptions {
  seasonId?: number;
}

export function useSeasonStats(options: UseSeasonStatsOptions = {}) {
  const { i18n } = useTranslation();
  const { seasonId = DEFAULT_SEASON_ID } = options;

  const { data, error, isLoading, mutate } = useSWR<SeasonStatistics>(
    ['seasonStats', seasonId, i18n.language],
    () => seasonStatsService.getSeasonStatistics(seasonId, i18n.language)
  );

  return {
    stats: data,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
