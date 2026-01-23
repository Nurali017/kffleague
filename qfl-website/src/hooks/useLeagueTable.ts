import useSWR from 'swr';
import { leagueService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID } from '@/api/endpoints';
import { TeamStanding, TableFilters, LeagueTableResponse } from '@/types';

interface UseLeagueTableOptions {
  seasonId?: number;
  limit?: number;
  tourFrom?: number;
  tourTo?: number;
  homeAway?: 'home' | 'away' | null;
}

export function useLeagueTable(options: UseLeagueTableOptions = {}) {
  const {
    seasonId = DEFAULT_SEASON_ID,
    limit,
    tourFrom,
    tourTo,
    homeAway
  } = options;

  const filters: TableFilters | undefined = (tourFrom || tourTo || homeAway)
    ? { tour_from: tourFrom, tour_to: tourTo, home_away: homeAway }
    : undefined;

  const { data, error, isLoading, mutate } = useSWR<LeagueTableResponse>(
    ['leagueTable', seasonId, tourFrom, tourTo, homeAway],
    () => leagueService.getTable(seasonId, filters)
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
