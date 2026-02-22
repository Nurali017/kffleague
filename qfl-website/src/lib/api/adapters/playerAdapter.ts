import {
  PlayerDetailAPIResponse,
  PlayerMatchPerformance,
  PlayerSeasonStatsResponse,
  PlayerTeammatesResponse,
  PlayerTournamentHistoryResponse,
} from '@/types/player';

export function adaptPlayerDetailResponse(dto: PlayerDetailAPIResponse): PlayerDetailAPIResponse {
  return {
    ...dto,
    id: Number(dto.id),
    teams: (dto.teams || []).map((teamId) => Number(teamId)),
  };
}

export function adaptPlayerMatchesResponse(
  dto: { items: PlayerMatchPerformance[] }
): { items: PlayerMatchPerformance[] } {
  return {
    items: dto.items.map((item) => ({
      ...item,
      match_id: Number(item.match_id),
    })),
  };
}

export function adaptPlayerStatsResponse(
  dto: PlayerSeasonStatsResponse
): PlayerSeasonStatsResponse {
  return {
    ...dto,
    player_id: Number(dto.player_id),
  };
}

export function adaptPlayerTeammatesResponse(
  dto: PlayerTeammatesResponse
): PlayerTeammatesResponse {
  return {
    ...dto,
    items: dto.items.map((item) => ({
      ...item,
      player_id: Number(item.player_id),
    })),
  };
}

export function adaptPlayerTournamentsResponse(
  dto: PlayerTournamentHistoryResponse
): PlayerTournamentHistoryResponse {
  return dto;
}
