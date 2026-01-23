import useSWR from 'swr';
import { leagueService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID } from '@/api/endpoints';
import { ResultsGridResponse } from '@/types';

interface UseResultsGridOptions {
  seasonId?: number;
}

export function useResultsGrid(options: UseResultsGridOptions = {}) {
  const { seasonId = DEFAULT_SEASON_ID } = options;

  const { data, error, isLoading, mutate } = useSWR<ResultsGridResponse>(
    ['resultsGrid', seasonId],
    () => leagueService.getResultsGrid(seasonId)
  );

  return {
    data,
    teams: data?.teams ?? [],
    totalTours: data?.total_tours ?? 0,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
