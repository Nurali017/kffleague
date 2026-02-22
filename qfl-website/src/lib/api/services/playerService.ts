import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID } from '../endpoints';
import {
  PlayerDetailAPIResponse,
  PlayerMatchPerformance,
  PlayerSeasonStatsResponse,
  PlayerTeammatesResponse,
  PlayerTournamentHistoryResponse,
} from '@/types/player';
import {
  adaptPlayerDetailResponse,
  adaptPlayerMatchesResponse,
  adaptPlayerStatsResponse,
  adaptPlayerTeammatesResponse,
  adaptPlayerTournamentsResponse,
} from '../adapters/playerAdapter';

export const playerService = {
  async getPlayerById(
    playerId: number,
    seasonId: number = DEFAULT_SEASON_ID,
    language?: string
  ): Promise<PlayerDetailAPIResponse | null> {
    const response = await apiClient.get<PlayerDetailAPIResponse>(
      ENDPOINTS.PLAYER_DETAIL(playerId),
      {
        season_id: seasonId,
        ...(language ? { lang: language } : {}),
      }
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch player');
    }

    return adaptPlayerDetailResponse(response.data);
  },

  async getPlayerMatches(
    playerId: number,
    options?: {
      seasonId?: number;
      limit?: number;
      language?: string;
    }
  ): Promise<PlayerMatchPerformance[]> {
    const response = await apiClient.get<{ items: PlayerMatchPerformance[] }>(
      ENDPOINTS.PLAYER_MATCHES(playerId),
      {
        season_id: options?.seasonId || DEFAULT_SEASON_ID,
        limit: options?.limit || 10,
        ...(options?.language ? { lang: options.language } : {}),
      }
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch player matches');
    }

    return adaptPlayerMatchesResponse(response.data).items;
  },

  async getPlayerStats(
    playerId: number,
    seasonId: number = DEFAULT_SEASON_ID,
    language?: string
  ): Promise<PlayerSeasonStatsResponse | null> {
    const response = await apiClient.get<PlayerSeasonStatsResponse>(
      ENDPOINTS.PLAYER_STATS(playerId),
      {
        season_id: seasonId,
        ...(language ? { lang: language } : {}),
      }
    );

    if (!response.success) {
      // Return null if no stats found (404)
      if (response.error?.status === 404) {
        return null;
      }
      throw new Error(response.error?.message || 'Failed to fetch player stats');
    }

    return adaptPlayerStatsResponse(response.data);
  },

  async getPlayerTeammates(
    playerId: number,
    options?: {
      seasonId?: number;
      limit?: number;
      language?: string;
    }
  ): Promise<PlayerTeammatesResponse> {
    const response = await apiClient.get<PlayerTeammatesResponse>(
      ENDPOINTS.PLAYER_TEAMMATES(playerId),
      {
        season_id: options?.seasonId || DEFAULT_SEASON_ID,
        limit: options?.limit || 10,
        ...(options?.language ? { lang: options.language } : {}),
      }
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch player teammates');
    }

    return adaptPlayerTeammatesResponse(response.data);
  },

  async getPlayerTournaments(
    playerId: number,
    language?: string
  ): Promise<PlayerTournamentHistoryResponse> {
    const response = await apiClient.get<PlayerTournamentHistoryResponse>(
      ENDPOINTS.PLAYER_TOURNAMENTS(playerId),
      {
        ...(language ? { lang: language } : {}),
      }
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch player tournaments');
    }

    return adaptPlayerTournamentsResponse(response.data);
  },
};
