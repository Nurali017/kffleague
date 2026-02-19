import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { playerStatsService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import {
  PlayerStat,
  PlayerStatsNationality,
  PlayerStatsSortBy,
  PositionCode,
} from '@/types';

interface UsePlayerStatsOptions {
  seasonId?: number;
  sortBy?: PlayerStatsSortBy;
  limit?: number;
  offset?: number;
  teamId?: number;
  positionCode?: PositionCode;
  nationality?: PlayerStatsNationality;
}

export function usePlayerStats(options: UsePlayerStatsOptions = {}) {
  const { i18n } = useTranslation();
  const {
    seasonId = DEFAULT_SEASON_ID,
    sortBy = 'goals',
    limit = 5,
    offset = 0,
    teamId,
    positionCode,
    nationality,
  } = options;

  const { data, error, isLoading, mutate } = useSWR(
    [
      'playerStats',
      seasonId,
      sortBy,
      limit,
      offset,
      teamId ?? null,
      positionCode ?? null,
      nationality ?? null,
      i18n.language,
    ],
    async () => {
      const response = await playerStatsService.getPlayerStats({
        seasonId,
        sortBy,
        limit,
        offset,
        teamId,
        positionCode,
        nationality,
        language: i18n.language,
      });
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
