import useSWR from 'swr';
import { playerStatsService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID } from '@/api/endpoints';
import { PlayerStat, PlayerStatsSortBy } from '@/types';

interface UsePlayerStatsOptions {
  seasonId?: number;
  sortBy?: PlayerStatsSortBy;
  limit?: number;
}

export function usePlayerStats(options: UsePlayerStatsOptions = {}) {
  const { seasonId = DEFAULT_SEASON_ID, sortBy = 'goals', limit = 5 } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['playerStats', seasonId, sortBy, limit],
    async () => {
      const response = await playerStatsService.getPlayerStats({ seasonId, sortBy, limit });
      return response.items;
    }
  );

  return {
    players: (data as PlayerStat[]) ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
