import useSWR from 'swr';
import { playerService } from '@/lib/api/services/playerService';
import { PlayerDetail, PlayerMatchPerformance } from '@/types/player';
import { useTranslation } from 'react-i18next';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';

export function usePlayerDetail(playerId: string | null, seasonId?: number) {
  const { i18n } = useTranslation();

  const { data, error, isLoading, mutate } = useSWR<PlayerDetail | null>(
    playerId
      ? [`/players/${playerId}`, seasonId || DEFAULT_SEASON_ID, i18n.language]
      : null,
    () => playerService.getPlayerById(
      playerId!,
      seasonId || DEFAULT_SEASON_ID,
      i18n.language
    ),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 min
    }
  );

  return {
    player: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
}

export function usePlayerMatches(playerId: string | null, limit: number = 10) {
  const { data, error, isLoading, mutate } = useSWR<PlayerMatchPerformance[]>(
    playerId ? [`/players/${playerId}/games`, limit] : null,
    () => playerService.getPlayerMatches(playerId!, { limit }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 min
    }
  );

  return {
    matches: data || [],
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
}
