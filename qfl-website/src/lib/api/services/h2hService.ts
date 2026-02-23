import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID } from '../endpoints';
import { HeadToHeadResponse } from '@/types/h2h';
import { getErrorMessage } from '@/lib/i18n/errorMessages';

export const h2hService = {
  async getHeadToHead(
    team1Id: number,
    team2Id: number,
    seasonId: number = DEFAULT_SEASON_ID,
    language: string = 'ru'
  ): Promise<HeadToHeadResponse | null> {
    const response = await apiClient.get<HeadToHeadResponse>(
      ENDPOINTS.HEAD_TO_HEAD(team1Id, team2Id),
      { season_id: seasonId, lang: language }
    );

    if (!response.success) {
      throw new Error(response.error?.message || getErrorMessage('fetchH2H'));
    }

    return response.data;
  },
};
