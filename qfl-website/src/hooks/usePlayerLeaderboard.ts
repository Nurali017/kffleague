import useSWR from 'swr';
import { playerStatsService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID } from '@/api/endpoints';
import { PlayerStat } from '@/types';

interface UsePlayerLeaderboardOptions {
  seasonId?: number;
  limit?: number;
}

interface PlayerLeaderboardData {
  scorers: PlayerStat[];
  assisters: PlayerStat[];
  cleanSheets: PlayerStat[];
}

export function usePlayerLeaderboard(options: UsePlayerLeaderboardOptions = {}) {
  const { seasonId = DEFAULT_SEASON_ID, limit = 5 } = options;

  const { data, error, isLoading, mutate } = useSWR<PlayerLeaderboardData>(
    ['playerLeaderboard', seasonId, limit],
    async () => {
      const [scorersRes, assistersRes, cleanSheetsRes] = await Promise.all([
        playerStatsService.getPlayerStats({ seasonId, sortBy: 'goals', limit }),
        playerStatsService.getPlayerStats({ seasonId, sortBy: 'assists', limit }),
        playerStatsService.getPlayerStats({ seasonId, sortBy: 'dry_match', limit }),
      ]);
      return {
        scorers: scorersRes.items,
        assisters: assistersRes.items,
        cleanSheets: cleanSheetsRes.items,
      };
    }
  );

  return {
    scorers: data?.scorers ?? [],
    assisters: data?.assisters ?? [],
    cleanSheets: data?.cleanSheets ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
