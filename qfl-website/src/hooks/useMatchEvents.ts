import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { matchService } from '@/lib/api/services/matchService';
import { EventsResponse } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';
import { prefetchKeys } from '@/lib/api/prefetchKeys';

export function useMatchEvents(matchId: number | null, isLive: boolean = false) {
  const { i18n } = useTranslation();
  const prefetched = useRoutePrefetchValue<EventsResponse>(
    matchId ? prefetchKeys.matchEvents(matchId, i18n.language) : null
  );

  const { data, error, isLoading, mutate } = useSWR<EventsResponse>(
    matchId ? queryKeys.games.events(matchId, i18n.language) : null,
    () => matchService.getMatchEvents(matchId!, i18n.language),
    {
      fallbackData: prefetched,
      revalidateOnFocus: isLive, // Обновлять для live матчей
      refreshInterval: isLive ? 30000 : 0, // Каждые 30 сек для live
      dedupingInterval: isLive ? 10000 : 60000,
    }
  );

  return {
    events: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
}
