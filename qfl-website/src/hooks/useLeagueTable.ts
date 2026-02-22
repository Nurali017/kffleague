import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { leagueService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { TeamStanding, TableFilters, LeagueTableResponse } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';

interface UseLeagueTableOptions {
  seasonId?: number;
  limit?: number;
  tourFrom?: number;
  tourTo?: number;
  homeAway?: 'home' | 'away' | null;
  group?: string | null;
  final?: boolean;
  enabled?: boolean;
}

export function useLeagueTable(options: UseLeagueTableOptions = {}) {
  const { i18n } = useTranslation();
  const {
    seasonId = DEFAULT_SEASON_ID,
    limit,
    tourFrom,
    tourTo,
    homeAway,
    group,
    final = false,
    enabled = true,
  } = options;

  const filters: TableFilters | undefined = (tourFrom || tourTo || homeAway || group || final)
    ? {
        tour_from: tourFrom,
        tour_to: tourTo,
        home_away: homeAway,
        group,
        final,
      }
    : undefined;
  const prefetched = useRoutePrefetchValue<LeagueTableResponse>(
    prefetchKeys.leagueTable(
      seasonId,
      tourFrom,
      tourTo,
      homeAway,
      group,
      final,
      i18n.language
    )
  );

  const { data, error, isLoading, mutate } = useSWR<LeagueTableResponse>(
    enabled
      ? queryKeys.league.table(seasonId, tourFrom, tourTo, homeAway, group, final, i18n.language)
      : null,
    () => leagueService.getTable(seasonId, filters, i18n.language),
    {
      fallbackData: prefetched,
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  const standings = data?.table ?? [];

  return {
    standings: limit ? standings.slice(0, limit) : standings,
    filters: data?.filters,
    seasonId: data?.season_id,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
