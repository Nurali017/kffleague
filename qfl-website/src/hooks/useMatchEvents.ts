import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { matchService } from '@/lib/api/services/matchService';
import { EventsResponse } from '@/types';

export function useMatchEvents(matchId: string | null, isLive: boolean = false) {
  const { i18n } = useTranslation();

  const { data, error, isLoading, mutate } = useSWR<EventsResponse>(
    matchId ? [`/live/events/${matchId}`, i18n.language] : null,
    () => matchService.getMatchEvents(matchId!, i18n.language),
    {
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
