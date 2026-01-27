import useSWR from 'swr';
import { playerService } from '@/lib/api/services/playerService';
import {
  PlayerDetailAPIResponse,
  PlayerMatchPerformance,
  PlayerSeasonStatsResponse,
  PlayerTeammatesResponse,
  PlayerTournamentHistoryResponse,
} from '@/types/player';
import { useTranslation } from 'react-i18next';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';

export function usePlayerDetail(playerId: string | null, seasonId?: number) {
  const { i18n } = useTranslation();

  const { data, error, isLoading, mutate } = useSWR<PlayerDetailAPIResponse | null>(
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
  const { i18n } = useTranslation();

  const { data, error, isLoading, mutate } = useSWR<PlayerMatchPerformance[]>(
    playerId ? [`/players/${playerId}/games`, limit, i18n.language] : null,
    () => playerService.getPlayerMatches(playerId!, { limit, language: i18n.language }),
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

export function usePlayerSeasonStats(playerId: string | null, seasonId?: number) {
  const { i18n } = useTranslation();

  const { data, error, isLoading, mutate } = useSWR<PlayerSeasonStatsResponse | null>(
    playerId ? [`/players/${playerId}/stats`, seasonId || DEFAULT_SEASON_ID, i18n.language] : null,
    () => playerService.getPlayerStats(playerId!, seasonId || DEFAULT_SEASON_ID, i18n.language),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 min
    }
  );

  return {
    stats: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
}

export function usePlayerTeammates(playerId: string | null, options?: { seasonId?: number; limit?: number }) {
  const { i18n } = useTranslation();

  const { data, error, isLoading, mutate } = useSWR<PlayerTeammatesResponse>(
    playerId
      ? [`/players/${playerId}/teammates`, options?.seasonId || DEFAULT_SEASON_ID, options?.limit || 10, i18n.language]
      : null,
    () => playerService.getPlayerTeammates(playerId!, {
      seasonId: options?.seasonId,
      limit: options?.limit,
      language: i18n.language,
    }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 min
    }
  );

  return {
    teammates: data?.items || [],
    total: data?.total || 0,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
}

export function usePlayerTournaments(playerId: string | null) {
  const { i18n } = useTranslation();

  const { data, error, isLoading, mutate } = useSWR<PlayerTournamentHistoryResponse>(
    playerId ? [`/players/${playerId}/tournaments`, i18n.language] : null,
    () => playerService.getPlayerTournaments(playerId!, i18n.language),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 min
    }
  );

  return {
    tournaments: data?.items || [],
    total: data?.total || 0,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
}
