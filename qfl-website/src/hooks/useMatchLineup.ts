import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { matchService } from '@/lib/api/services/matchService';
import { LineupResponse } from '@/types';

export function useMatchLineup(matchId: string | null) {
  const { i18n } = useTranslation();

  const { data, error, isLoading, mutate } = useSWR<LineupResponse>(
    matchId ? [`/games/${matchId}/lineup`, i18n.language] : null,
    () => matchService.getMatchLineup(matchId!, i18n.language),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes (составы меняются редко)
    }
  );

  return {
    lineup: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
}
