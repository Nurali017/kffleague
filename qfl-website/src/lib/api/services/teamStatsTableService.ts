import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID } from '../endpoints';
import { TeamStatsTableResponse } from '@/types/statistics';

interface GetTeamStatsOptions {
    seasonId?: number;
    sortBy?: string;
    limit?: number;
    offset?: number;
    language?: string;
}

export const teamStatsTableService = {
    async getTeamStats(options: GetTeamStatsOptions = {}): Promise<TeamStatsTableResponse> {
        const {
            seasonId = DEFAULT_SEASON_ID,
            sortBy = 'points',
            limit = 50,
            offset = 0,
            language,
        } = options;

        const params = new URLSearchParams({
            sort_by: sortBy,
            limit: limit.toString(),
            offset: offset.toString(),
        });
        if (language) {
            params.append('lang', language);
        }

        const response = await apiClient.get<TeamStatsTableResponse>(
            `${ENDPOINTS.SEASON_TEAM_STATS(seasonId)}?${params.toString()}`
        );

        if (!response.success) {
            throw new Error(response.error?.message || 'Failed to fetch team statistics');
        }

        return response.data;
    },
};
