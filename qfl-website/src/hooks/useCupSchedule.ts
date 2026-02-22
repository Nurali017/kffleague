import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { cupService } from '@/lib/api/services';
import { CupScheduleResponse } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';

interface UseCupScheduleOptions {
  seasonId?: number;
  roundKey?: string | null;
  enabled?: boolean;
}

export function useCupSchedule(options: UseCupScheduleOptions = {}) {
  const { i18n } = useTranslation();
  const {
    seasonId,
    roundKey = null,
    enabled = true,
  } = options;

  const prefetched = useRoutePrefetchValue<CupScheduleResponse>(
    seasonId ? prefetchKeys.cupSchedule(seasonId, i18n.language, roundKey) : null
  );

  const { data, error, isLoading, mutate } = useSWR<CupScheduleResponse>(
    enabled && seasonId
      ? queryKeys.cup.schedule(seasonId, i18n.language, roundKey)
      : null,
    () => cupService.getSchedule(seasonId!, i18n.language, roundKey ?? undefined),
    {
      fallbackData: prefetched,
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  return {
    schedule: data ?? null,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
