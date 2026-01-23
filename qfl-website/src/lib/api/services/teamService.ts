import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID } from '../endpoints';
import { TeamDetail, TeamStats, TeamPlayersResponse, SquadPlayer } from '@/types';
import { Game } from '@/types/match';

// Map player_type to position category
function mapPlayerTypeToPosition(
  playerType: string
): 'GK' | 'DEF' | 'MID' | 'FWD' {
  const type = playerType.toLowerCase();
  if (type.includes('goalkeeper') || type === 'gk') return 'GK';
  if (type.includes('defender') || type.includes('defence') || type === 'def')
    return 'DEF';
  if (
    type.includes('midfielder') ||
    type.includes('halfback') ||
    type === 'mid'
  )
    return 'MID';
  return 'FWD'; // forward, striker, attacker
}

export const teamService = {
  async getTeamById(teamId: number): Promise<TeamDetail | null> {
    const response = await apiClient.get<TeamDetail>(
      ENDPOINTS.TEAM_DETAIL(teamId)
    );

    if (!response.success) {
      return null;
    }

    return response.data;
  },

  async getTeamStats(
    teamId: number,
    seasonId: number = DEFAULT_SEASON_ID
  ): Promise<TeamStats | null> {
    const response = await apiClient.get<TeamStats>(
      ENDPOINTS.TEAM_STATS(teamId),
      { season_id: seasonId }
    );

    if (!response.success) {
      return null;
    }

    return response.data;
  },

  async getTeamPlayers(
    teamId: number,
    seasonId: number = DEFAULT_SEASON_ID
  ): Promise<SquadPlayer[]> {
    const response = await apiClient.get<TeamPlayersResponse>(
      ENDPOINTS.TEAM_PLAYERS(teamId),
      { season_id: seasonId }
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch players');
    }

    // Map TeamPlayer to SquadPlayer
    return response.data.items.map((player) => ({
      player_id: player.id,
      first_name: player.first_name,
      last_name: player.last_name,
      jersey_number: player.number,
      position: mapPlayerTypeToPosition(player.player_type),
      photo_url: player.photo_url,
      nationality: player.country_name,
      country_code: player.country_code,
      age: player.age,
    }));
  },

  async getTeamGames(
    teamId: number,
    seasonId: number = DEFAULT_SEASON_ID
  ): Promise<Game[]> {
    const response = await apiClient.get<Game[]>(
      ENDPOINTS.TEAM_GAMES(teamId),
      { season_id: seasonId }
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch games');
    }

    return response.data;
  },
};
