import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { matchService } from '@/lib/api/services/matchService';
import { LineupResponse } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';
import { prefetchKeys } from '@/lib/api/prefetchKeys';

export function useMatchLineup(matchId: number | null, isLive: boolean = false) {
  const { i18n } = useTranslation();
  const prefetched = useRoutePrefetchValue<LineupResponse>(
    matchId ? prefetchKeys.matchLineup(matchId, i18n.language) : null
  );

  const { data, error, isLoading, mutate } = useSWR<LineupResponse>(
    matchId ? queryKeys.games.lineup(matchId, i18n.language) : null,
    () => matchService.getMatchLineup(matchId!, i18n.language),
    {
      fallbackData: prefetched,
      revalidateOnFocus: isLive,
      refreshInterval: isLive ? 30000 : 0,
      dedupingInterval: isLive ? 5000 : 300000,
    }
  );

  return {
    lineup: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
}
