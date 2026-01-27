import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID } from '../endpoints';
import { SeasonStatistics } from '@/types';

export const seasonStatsService = {
  async getSeasonStatistics(
    seasonId: number = DEFAULT_SEASON_ID,
    language?: string
  ): Promise<SeasonStatistics> {
    const response = await apiClient.get<SeasonStatistics>(
      ENDPOINTS.SEASON_STATISTICS(seasonId),
      language ? { lang: language } : undefined
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch season statistics');
    }

    return response.data;
  },
};
