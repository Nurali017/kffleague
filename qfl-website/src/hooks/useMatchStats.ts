import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { matchService } from '@/lib/api/services/matchService';
import { MatchPlayerStatsResponse } from '@/types';

export function useMatchStats(matchId: string | null) {
  const { i18n } = useTranslation();

  const { data, error, isLoading, mutate } = useSWR<MatchPlayerStatsResponse>(
    matchId ? [`/games/${matchId}/stats`, i18n.language] : null,
    () => matchService.getMatchStats(matchId!, i18n.language),
    {
      revalidateOnFocus: false,
      dedupingInterval: 120000, // 2 minutes
    }
  );

  return {
    stats: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
}
