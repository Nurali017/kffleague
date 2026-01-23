import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID } from '../endpoints';
import { PlayerStatsResponse, PlayerStatsSortBy } from '@/types';

interface GetPlayerStatsParams {
  seasonId?: number;
  sortBy?: PlayerStatsSortBy;
  limit?: number;
}

export const playerStatsService = {
  async getPlayerStats({
    seasonId = DEFAULT_SEASON_ID,
    sortBy = 'goals',
    limit = 20,
  }: GetPlayerStatsParams = {}): Promise<PlayerStatsResponse> {
    const response = await apiClient.get<PlayerStatsResponse>(
      ENDPOINTS.SEASON_PLAYER_STATS(seasonId),
      { sort_by: sortBy, limit }
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch player stats');
    }

    return response.data;
  },
};
