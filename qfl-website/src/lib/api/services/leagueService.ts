import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID } from '../endpoints';
import { TeamStanding, TableFilters, LeagueTableResponse, ResultsGridResponse } from '@/types';

export const leagueService = {
  async getTable(
    seasonId: number = DEFAULT_SEASON_ID,
    filters?: TableFilters
  ): Promise<LeagueTableResponse> {
    const params = new URLSearchParams();
    if (filters?.tour_from) params.append('tour_from', String(filters.tour_from));
    if (filters?.tour_to) params.append('tour_to', String(filters.tour_to));
    if (filters?.home_away) params.append('home_away', filters.home_away);

    const query = params.toString();
    const endpoint = `${ENDPOINTS.SEASON_TABLE(seasonId)}${query ? `?${query}` : ''}`;

    const response = await apiClient.get<LeagueTableResponse>(endpoint);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch league table');
    }

    return response.data;
  },

  // Backward compatible method for existing LeagueTable component
  async getTableStandings(seasonId: number = DEFAULT_SEASON_ID): Promise<TeamStanding[]> {
    const result = await this.getTable(seasonId);
    return result.table;
  },

  async getResultsGrid(seasonId: number = DEFAULT_SEASON_ID): Promise<ResultsGridResponse> {
    const response = await apiClient.get<ResultsGridResponse>(
      ENDPOINTS.SEASON_RESULTS_GRID(seasonId)
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch results grid');
    }

    return response.data;
  },
};
