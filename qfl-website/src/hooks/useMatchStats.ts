import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { matchService } from '@/lib/api/services/matchService';
import { MatchPlayerStatsResponse } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';
import { prefetchKeys } from '@/lib/api/prefetchKeys';

export function useMatchStats(matchId: number | null) {
  const { i18n } = useTranslation();
  const prefetched = useRoutePrefetchValue<MatchPlayerStatsResponse>(
    matchId ? prefetchKeys.matchStats(matchId, i18n.language) : null
  );

  const { data, error, isLoading, mutate } = useSWR<MatchPlayerStatsResponse>(
    matchId ? queryKeys.games.stats(matchId, i18n.language) : null,
    () => matchService.getMatchStats(matchId!, i18n.language),
    {
      fallbackData: prefetched,
      revalidateOnFocus: false,
      dedupingInterval: 120000, // 2 minutes
    }
  );

  return {
    stats: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
}
