import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID } from '../endpoints';
import { TeamStanding, TableFilters, LeagueTableResponse, ResultsGridResponse } from '@/types';

export const leagueService = {
  async getTable(
    seasonId: number = DEFAULT_SEASON_ID,
    filters?: TableFilters,
    language?: string
  ): Promise<LeagueTableResponse> {
    const params = new URLSearchParams();
    if (filters?.tour_from) params.append('tour_from', String(filters.tour_from));
    if (filters?.tour_to) params.append('tour_to', String(filters.tour_to));
    if (filters?.home_away) params.append('home_away', filters.home_away);
    if (filters?.group) params.append('group', filters.group);
    if (filters?.final) params.append('final', 'true');
    if (language) params.append('lang', language);

    const query = params.toString();
    const endpoint = `${ENDPOINTS.SEASON_TABLE(seasonId)}${query ? `?${query}` : ''}`;

    const response = await apiClient.get<LeagueTableResponse>(endpoint);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch league table');
    }

    return response.data;
  },

  // Backward compatible method for existing LeagueTable component
  async getTableStandings(
    seasonId: number = DEFAULT_SEASON_ID,
    language?: string
  ): Promise<TeamStanding[]> {
    const result = await this.getTable(seasonId, undefined, language);
    return result.table;
  },

  async getResultsGrid(
    seasonId: number = DEFAULT_SEASON_ID,
    filters?: Pick<TableFilters, 'group' | 'final'>,
    language?: string
  ): Promise<ResultsGridResponse> {
    const params: Record<string, string | number | boolean | (string | number)[]> = {};
    if (filters?.group) params.group = filters.group;
    if (filters?.final) params.final = true;
    if (language) params.lang = language;

    const response = await apiClient.get<ResultsGridResponse>(
      ENDPOINTS.SEASON_RESULTS_GRID(seasonId),
      Object.keys(params).length ? params : undefined
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch results grid');
    }

    return response.data;
  },
};
