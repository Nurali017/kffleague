import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { teamStatsTableService } from '@/lib/api/services/teamStatsTableService';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { TeamStatsTableResponse } from '@/types/statistics';

interface UseTeamStatsTableOptions {
    seasonId?: number;
    sortBy?: string;
    limit?: number;
    offset?: number;
}

export function useTeamStatsTable(options: UseTeamStatsTableOptions = {}) {
    const { i18n } = useTranslation();
    const {
        seasonId = DEFAULT_SEASON_ID,
        sortBy = 'points',
        limit = 50,
        offset = 0,
    } = options;

    const { data, error, isLoading, mutate } = useSWR<TeamStatsTableResponse>(
        ['teamStatsTable', seasonId, sortBy, limit, offset, i18n.language],
        () => teamStatsTableService.getTeamStats({ seasonId, sortBy, limit, offset, language: i18n.language })
    );

    return {
        teams: data?.items || [],
        total: data?.total || 0,
        loading: isLoading,
        error,
        refetch: mutate,
    };
}
