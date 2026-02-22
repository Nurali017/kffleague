import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { matchService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID, DEFAULT_TOUR } from '@/lib/api/endpoints';
import { Game } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';

interface UseMatchesOptions {
  seasonId?: number;
  tour?: number;
  enabled?: boolean;
}

export function useMatches(options: UseMatchesOptions = {}) {
  const { i18n } = useTranslation();
  const { seasonId = DEFAULT_SEASON_ID, tour = DEFAULT_TOUR, enabled = true } = options;
  const prefetched = useRoutePrefetchValue<Game[]>(
    prefetchKeys.matchesByTour(seasonId, tour, i18n.language)
  );

  const { data, error, isLoading, mutate } = useSWR<Game[]>(
    enabled ? queryKeys.games.byTour(seasonId, tour, i18n.language) : null,
    () => matchService.getGamesByTour(seasonId, tour, i18n.language),
    {
      fallbackData: prefetched,
    }
  );

  return {
    matches: data ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
