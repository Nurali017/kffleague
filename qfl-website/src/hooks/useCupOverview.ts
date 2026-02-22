import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { cupService } from '@/lib/api/services';
import { CupOverviewResponse } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';

interface UseCupOverviewOptions {
  seasonId?: number;
  recentLimit?: number;
  upcomingLimit?: number;
  enabled?: boolean;
}

export function useCupOverview(options: UseCupOverviewOptions = {}) {
  const { i18n } = useTranslation();
  const {
    seasonId,
    recentLimit = 5,
    upcomingLimit = 5,
    enabled = true,
  } = options;

  const prefetched = useRoutePrefetchValue<CupOverviewResponse>(
    seasonId
      ? prefetchKeys.cupOverview(seasonId, i18n.language, recentLimit, upcomingLimit)
      : null
  );

  const { data, error, isLoading, mutate } = useSWR<CupOverviewResponse>(
    enabled && seasonId
      ? queryKeys.cup.overview(seasonId, i18n.language, recentLimit, upcomingLimit)
      : null,
    () => cupService.getOverview(seasonId!, i18n.language, recentLimit, upcomingLimit),
    {
      fallbackData: prefetched,
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  return {
    overview: data ?? null,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
