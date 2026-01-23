import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID } from '../endpoints';
import { PlayerDetail, PlayerMatchPerformance } from '@/types/player';

export const playerService = {
  async getPlayerById(
    playerId: string,
    seasonId: number = DEFAULT_SEASON_ID,
    language?: string
  ): Promise<PlayerDetail | null> {
    const response = await apiClient.get<PlayerDetail>(
      ENDPOINTS.PLAYER_DETAIL(playerId),
      {
        season_id: seasonId,
        ...(language ? { language } : {}),
      }
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch player');
    }

    return response.data;
  },

  async getPlayerMatches(
    playerId: string,
    options?: {
      seasonId?: number;
      limit?: number;
    }
  ): Promise<PlayerMatchPerformance[]> {
    const response = await apiClient.get<{ items: PlayerMatchPerformance[] }>(
      ENDPOINTS.PLAYER_MATCHES(playerId),
      {
        season_id: options?.seasonId || DEFAULT_SEASON_ID,
        limit: options?.limit || 10,
      }
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch player matches');
    }

    return response.data.items;
  },
};
