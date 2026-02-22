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
import { queryKeys } from '@/lib/api/queryKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';
import { prefetchKeys } from '@/lib/api/prefetchKeys';

export function usePlayerDetail(playerId: number | null, seasonId?: number) {
  const { i18n } = useTranslation();
  const resolvedSeasonId = seasonId || DEFAULT_SEASON_ID;
  const prefetched = useRoutePrefetchValue<PlayerDetailAPIResponse | null>(
    playerId ? prefetchKeys.playerDetail(playerId, resolvedSeasonId, i18n.language) : null
  );

  const { data, error, isLoading, mutate } = useSWR<PlayerDetailAPIResponse | null>(
    playerId
      ? queryKeys.players.byId(playerId, resolvedSeasonId, i18n.language)
      : null,
    () => playerService.getPlayerById(
      playerId!,
      resolvedSeasonId,
      i18n.language
    ),
    {
      fallbackData: prefetched,
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

export function usePlayerMatches(playerId: number | null, limit: number = 10) {
  const { i18n } = useTranslation();
  const prefetched = useRoutePrefetchValue<PlayerMatchPerformance[]>(
    playerId ? prefetchKeys.playerMatches(playerId, limit, i18n.language) : null
  );

  const { data, error, isLoading, mutate } = useSWR<PlayerMatchPerformance[]>(
    playerId ? queryKeys.players.games(playerId, limit, i18n.language) : null,
    () => playerService.getPlayerMatches(playerId!, { limit, language: i18n.language }),
    {
      fallbackData: prefetched,
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

export function usePlayerSeasonStats(playerId: number | null, seasonId?: number) {
  const { i18n } = useTranslation();
  const resolvedSeasonId = seasonId || DEFAULT_SEASON_ID;
  const prefetched = useRoutePrefetchValue<PlayerSeasonStatsResponse | null>(
    playerId ? prefetchKeys.playerSeasonStats(playerId, resolvedSeasonId, i18n.language) : null
  );

  const { data, error, isLoading, mutate } = useSWR<PlayerSeasonStatsResponse | null>(
    playerId
      ? queryKeys.players.stats(playerId, resolvedSeasonId, i18n.language)
      : null,
    () => playerService.getPlayerStats(playerId!, resolvedSeasonId, i18n.language),
    {
      fallbackData: prefetched,
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

export function usePlayerTeammates(playerId: number | null, options?: { seasonId?: number; limit?: number }) {
  const { i18n } = useTranslation();
  const resolvedSeasonId = options?.seasonId || DEFAULT_SEASON_ID;
  const resolvedLimit = options?.limit || 10;
  const prefetched = useRoutePrefetchValue<PlayerTeammatesResponse>(
    playerId
      ? prefetchKeys.playerTeammates(playerId, resolvedSeasonId, resolvedLimit, i18n.language)
      : null
  );

  const { data, error, isLoading, mutate } = useSWR<PlayerTeammatesResponse>(
    playerId
      ? queryKeys.players.teammates(
          playerId,
          resolvedSeasonId,
          resolvedLimit,
          i18n.language
        )
      : null,
    () => playerService.getPlayerTeammates(playerId!, {
      seasonId: options?.seasonId,
      limit: options?.limit,
      language: i18n.language,
    }),
    {
      fallbackData: prefetched,
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

export function usePlayerTournaments(playerId: number | null) {
  const { i18n } = useTranslation();
  const prefetched = useRoutePrefetchValue<PlayerTournamentHistoryResponse>(
    playerId ? prefetchKeys.playerTournaments(playerId, i18n.language) : null
  );

  const { data, error, isLoading, mutate } = useSWR<PlayerTournamentHistoryResponse>(
    playerId ? queryKeys.players.tournaments(playerId, i18n.language) : null,
    () => playerService.getPlayerTournaments(playerId!, i18n.language),
    {
      fallbackData: prefetched,
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
