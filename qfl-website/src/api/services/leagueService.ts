import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID } from '../endpoints';
import { TeamStanding } from '../../types';

interface LeagueTableResponse {
  season_id: number;
  table: TeamStanding[];
}

export const leagueService = {
  async getTable(seasonId: number = DEFAULT_SEASON_ID): Promise<TeamStanding[]> {
    const response = await apiClient.get<LeagueTableResponse>(
      ENDPOINTS.SEASON_TABLE(seasonId)
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch league table');
    }

    return response.data.table;
  },
};
