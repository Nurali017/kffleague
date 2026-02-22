import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { matchService } from '@/lib/api/services/matchService';
import { MatchDetail } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';
import { prefetchKeys } from '@/lib/api/prefetchKeys';


export function useMatchDetail(matchId: number | null) {
  const { i18n } = useTranslation();
  const prefetched = useRoutePrefetchValue<MatchDetail | null>(
    matchId ? prefetchKeys.matchDetail(matchId, i18n.language) : null
  );

  const { data, error, isLoading, mutate } = useSWR<MatchDetail | null>(
    matchId ? queryKeys.games.byId(matchId, i18n.language) : null,
    () => matchService.getMatchById(matchId!, i18n.language),
    {
      fallbackData: prefetched,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    match: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
}
