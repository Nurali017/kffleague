import useSWR from 'swr';
import { matchService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID, DEFAULT_TOUR } from '@/api/endpoints';
import { Game } from '@/types';

interface UseMatchesOptions {
  seasonId?: number;
  tour?: number;
}

export function useMatches(options: UseMatchesOptions = {}) {
  const { seasonId = DEFAULT_SEASON_ID, tour = DEFAULT_TOUR } = options;

  const { data, error, isLoading, mutate } = useSWR<Game[]>(
    ['matches', seasonId, tour],
    () => matchService.getGamesByTour(seasonId, tour)
  );

  return {
    matches: data ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
