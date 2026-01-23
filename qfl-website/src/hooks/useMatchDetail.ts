import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { matchService } from '@/lib/api/services/matchService';
import { MatchDetail } from '@/types';


export function useMatchDetail(matchId: string | null) {
  const { i18n } = useTranslation();

  const { data, error, isLoading, mutate } = useSWR<MatchDetail | null>(
    matchId ? [`/games/${matchId}`, i18n.language] : null,
    () => matchService.getMatchById(matchId!, i18n.language),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    match: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
}
