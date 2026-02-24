import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS, DEFAULT_SEASON_ID } from '@/lib/api/endpoints';

export interface LeaguePerformanceTeam {
  team_id: number;
  team_name: string | null;
  team_logo: string | null;
  positions: number[];
}

export interface LeaguePerformanceData {
  season_id: number;
  max_tour: number;
  teams: LeaguePerformanceTeam[];
}

export function useLeaguePerformance(options: {
  seasonId?: number;
  teamIds?: number[];
} = {}) {
  const { i18n } = useTranslation();
  const { seasonId = DEFAULT_SEASON_ID, teamIds } = options;

  const teamIdsStr = teamIds?.join(',') || '';

  const { data, error, isLoading } = useSWR<LeaguePerformanceData>(
    ['/league-performance', seasonId, teamIdsStr, i18n.language],
    async () => {
      const params: Record<string, string> = { lang: i18n.language };
      if (teamIdsStr) params.team_ids = teamIdsStr;

      const response = await apiClient.get<LeaguePerformanceData>(
        ENDPOINTS.SEASON_LEAGUE_PERFORMANCE(seasonId),
        params
      );

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch league performance');
      }

      return response.data;
    }
  );

  return {
    data: data ?? null,
    loading: isLoading,
    error,
  };
}
