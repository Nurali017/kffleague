import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID } from '../endpoints';
import {
  SquadPlayer,
  TeamCoach,
  TeamDetail,
  TeamOverviewResponse,
  TeamPlayersResponse,
  TeamStats,
} from '@/types';
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

interface TeamMembershipSeed {
  team_id: number;
  team_name?: string | null;
  team_logo?: string | null;
}

interface SeasonTeamsResponse {
  items: TeamMembershipSeed[];
  total: number;
}

function mapSeedToDetail(entry: TeamMembershipSeed): TeamDetail {
  return {
    id: entry.team_id,
    name: entry.team_name || `Team #${entry.team_id}`,
    logo_url: entry.team_logo || undefined,
  };
}

export const teamService = {
  async getTeams(
    seasonId: number = DEFAULT_SEASON_ID,
    language?: string
  ): Promise<TeamDetail[]> {
    const response = await apiClient.get<SeasonTeamsResponse>(
      ENDPOINTS.SEASON_TEAMS(seasonId),
      language ? { lang: language } : undefined
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch teams');
    }

    return response.data.items.map(mapSeedToDetail);
  },

  async getTeamById(
    teamId: number,
    language?: string
  ): Promise<TeamDetail | null> {
    const response = await apiClient.get<TeamDetail>(
      ENDPOINTS.TEAM_DETAIL(teamId),
      language ? { lang: language } : undefined
    );

    if (!response.success) {
      return null;
    }

    return response.data;
  },

  async getTeamStats(
    teamId: number,
    seasonId: number = DEFAULT_SEASON_ID,
    language?: string
  ): Promise<TeamStats | null> {
    const response = await apiClient.get<TeamStats>(
      ENDPOINTS.TEAM_STATS(teamId),
      {
        season_id: seasonId,
        ...(language ? { lang: language } : {}),
      }
    );

    if (!response.success) {
      return null;
    }

    return response.data;
  },

  async getTeamOverview(
    teamId: number,
    seasonId: number = DEFAULT_SEASON_ID,
    language?: string,
    fixturesLimit: number = 5,
    leadersLimit: number = 8
  ): Promise<TeamOverviewResponse | null> {
    const response = await apiClient.get<TeamOverviewResponse>(
      ENDPOINTS.TEAM_OVERVIEW(teamId),
      {
        season_id: seasonId,
        fixtures_limit: fixturesLimit,
        leaders_limit: leadersLimit,
        ...(language ? { lang: language } : {}),
      }
    );

    if (!response.success) {
      return null;
    }

    return response.data;
  },

  async getTeamPlayers(
    teamId: number,
    seasonId: number = DEFAULT_SEASON_ID,
    language?: string
  ): Promise<SquadPlayer[]> {
    const response = await apiClient.get<TeamPlayersResponse>(
      ENDPOINTS.TEAM_PLAYERS(teamId),
      {
        season_id: seasonId,
        ...(language ? { lang: language } : {}),
      }
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
      nationality: player.country?.name,
      country_code: player.country?.code,
      age: player.age,
    }));
  },

  async getTeamGames(
    teamId: number,
    seasonId: number = DEFAULT_SEASON_ID,
    language?: string
  ): Promise<Game[]> {
    const response = await apiClient.get<{ items: Game[]; total: number }>(
      ENDPOINTS.TEAM_GAMES(teamId),
      {
        season_id: seasonId,
        ...(language ? { lang: language } : {}),
      }
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch games');
    }

    return response.data.items;
  },

  async getTeamCoaches(
    teamId: number,
    seasonId: number = DEFAULT_SEASON_ID,
    language?: string
  ): Promise<TeamCoach[]> {
    const response = await apiClient.get<{ items: TeamCoach[]; total: number }>(
      ENDPOINTS.TEAM_COACHES(teamId),
      {
        season_id: seasonId,
        ...(language ? { lang: language } : {}),
      }
    );

    if (!response.success) {
      return [];
    }

    return response.data.items;
  },
};
