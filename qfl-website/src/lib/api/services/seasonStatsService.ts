import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID } from '../endpoints';
import { SeasonStatistics } from '@/types';
import { SeasonGoalsByPeriodResponse } from '@/types/statistics';
import { getErrorMessage } from '@/lib/i18n/errorMessages';

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
      throw new Error(response.error?.message || getErrorMessage('fetchSeasonStats'));
    }

    return response.data;
  },

  async getGoalsByPeriod(
    seasonId: number = DEFAULT_SEASON_ID
  ): Promise<SeasonGoalsByPeriodResponse> {
    const response = await apiClient.get<SeasonGoalsByPeriodResponse>(
      ENDPOINTS.SEASON_GOALS_BY_PERIOD(seasonId)
    );

    if (!response.success) {
      throw new Error(response.error?.message || getErrorMessage('fetchSeasonGoals'));
    }

    return response.data;
  },
};
