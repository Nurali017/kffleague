import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID, DEFAULT_TOUR } from '../endpoints';
import { Game } from '../../types';

interface GamesResponse {
  items: Game[];
}

export const matchService = {
  async getGamesByTour(
    seasonId: number = DEFAULT_SEASON_ID,
    tour: number = DEFAULT_TOUR
  ): Promise<Game[]> {
    const response = await apiClient.get<GamesResponse>(
      ENDPOINTS.SEASON_GAMES(seasonId),
      { tour }
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch games');
    }

    return response.data.items;
  },
};
