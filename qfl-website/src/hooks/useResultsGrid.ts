import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { leagueService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { ResultsGridResponse } from '@/types';

interface UseResultsGridOptions {
  seasonId?: number;
}

export function useResultsGrid(options: UseResultsGridOptions = {}) {
  const { i18n } = useTranslation();
  const { seasonId = DEFAULT_SEASON_ID } = options;

  const { data, error, isLoading, mutate } = useSWR<ResultsGridResponse>(
    ['resultsGrid', seasonId, i18n.language],
    () => leagueService.getResultsGrid(seasonId, i18n.language),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
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
