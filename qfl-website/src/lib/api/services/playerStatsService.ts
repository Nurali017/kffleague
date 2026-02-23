import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID } from '../endpoints';
import {
  PlayerStatsNationality,
  PlayerStatsResponse,
  PlayerStatsSortBy,
  PositionCode,
} from '@/types';
import { getErrorMessage } from '@/lib/i18n/errorMessages';

interface GetPlayerStatsParams {
  seasonId?: number;
  sortBy?: PlayerStatsSortBy;
  limit?: number;
  offset?: number;
  teamId?: number;
  positionCode?: PositionCode;
  nationality?: PlayerStatsNationality;
  language?: string;
}

export const playerStatsService = {
  async getPlayerStats({
    seasonId = DEFAULT_SEASON_ID,
    sortBy = 'goals',
    limit = 20,
    offset = 0,
    teamId,
    positionCode,
    nationality,
    language,
  }: GetPlayerStatsParams = {}): Promise<PlayerStatsResponse> {
    const response = await apiClient.get<PlayerStatsResponse>(
      ENDPOINTS.SEASON_PLAYER_STATS(seasonId),
      {
        sort_by: sortBy,
        limit,
        offset,
        ...(typeof teamId === 'number' ? { team_id: teamId } : {}),
        ...(positionCode ? { position_code: positionCode } : {}),
        ...(nationality ? { nationality } : {}),
        ...(language ? { lang: language } : {}),
      }
    );

    if (!response.success) {
      throw new Error(response.error?.message || getErrorMessage('fetchTeamStats'));
    }

    return response.data;
  },
};
