import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { matchService } from '@/lib/api/services';
import { DEFAULT_SEASON_ID, DEFAULT_TOUR } from '@/api/endpoints';
import { Game } from '@/types';

interface UseMatchesOptions {
  seasonId?: number;
  tour?: number;
}

export function useMatches(options: UseMatchesOptions = {}) {
  const { i18n } = useTranslation();
  const { seasonId = DEFAULT_SEASON_ID, tour = DEFAULT_TOUR } = options;

  const { data, error, isLoading, mutate } = useSWR<Game[]>(
    ['matches', seasonId, tour, i18n.language],
    () => matchService.getGamesByTour(seasonId, tour, i18n.language)
  );

  return {
    matches: data ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
