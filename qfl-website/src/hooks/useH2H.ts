import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { h2hService } from '@/lib/api/services/h2hService';
import { HeadToHeadResponse, computeH2HMetrics, H2HComputedMetrics } from '@/types/h2h';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';

interface UseH2HParams {
  team1Id: number | null;
  team2Id: number | null;
  seasonId?: number | null;
}

interface UseH2HReturn {
  data: HeadToHeadResponse | null;
  metrics: H2HComputedMetrics | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useH2H({
  team1Id,
  team2Id,
  seasonId,
}: UseH2HParams): UseH2HReturn {
  const { i18n } = useTranslation();
  const effectiveSeasonId = seasonId ?? DEFAULT_SEASON_ID;

  const { data, error, isLoading, mutate } = useSWR<HeadToHeadResponse | null>(
    team1Id && team2Id
      ? [`/h2h/${team1Id}/${team2Id}`, effectiveSeasonId, i18n.language]
      : null,
    () => h2hService.getHeadToHead(team1Id!, team2Id!, effectiveSeasonId, i18n.language),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes cache
    }
  );

  const metrics = data ? computeH2HMetrics(data) : null;

  return {
    data: data ?? null,
    metrics,
    loading: isLoading,
    error: error?.message || null,
    refetch: mutate,
  };
}
