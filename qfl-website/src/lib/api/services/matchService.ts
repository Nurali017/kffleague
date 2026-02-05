import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_SEASON_ID, DEFAULT_TOUR } from '../endpoints';
import {
  Game,
  MatchDetail,
  MatchPlayerStatsResponse,
  LineupResponse,
  EventsResponse,
  MatchCenterFilters,
  GroupedMatchesResponse,
  StandardMatchesResponse,
} from '@/types';
import {
  transformLineupResponse,
  transformMatchEvents,
} from '../transformers/matchTransformers';

interface GamesResponse {
  items: Game[];
}

export const matchService = {
  async getGamesByTour(
    seasonId: number = DEFAULT_SEASON_ID,
    tour: number = DEFAULT_TOUR,
    language?: string
  ): Promise<Game[]> {
    const response = await apiClient.get<GamesResponse>(
      ENDPOINTS.SEASON_GAMES(seasonId),
      {
        tour,
        ...(language ? { lang: language } : {}),
      }
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch games');
    }

    return response.data.items;
  },

  async getMatchById(
    matchId: string,
    language?: string
  ): Promise<MatchDetail | null> {
    const response = await apiClient.get<MatchDetail>(
      ENDPOINTS.MATCH_DETAIL(matchId),
      language ? { lang: language } : undefined
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch match');
    }

    return response.data;
  },

  async getMatchStats(
    matchId: string,
    language?: string
  ): Promise<MatchPlayerStatsResponse> {
    const response = await apiClient.get<MatchPlayerStatsResponse>(
      ENDPOINTS.MATCH_STATS(matchId),
      language ? { lang: language } : undefined
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch player stats');
    }

    return response.data;
  },

  async getMatchLineup(
    matchId: string,
    language?: string
  ): Promise<LineupResponse> {
    const response = await apiClient.get<any>(
      ENDPOINTS.MATCH_LINEUP(matchId),
      language ? { lang: language } : undefined
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch lineup');
    }

    // Применить трансформацию: shirt_number → number
    return transformLineupResponse(response.data);
  },

  async getMatchEvents(
    matchId: string,
    language?: string
  ): Promise<EventsResponse> {
    const response = await apiClient.get<any>(
      ENDPOINTS.MATCH_EVENTS(matchId),
      language ? { lang: language } : undefined
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch events');
    }

    // Применить трансформацию для событий
    return transformMatchEvents(response.data);
  },

  async getMatchCenter(
    filters: MatchCenterFilters = {}
  ): Promise<GroupedMatchesResponse | StandardMatchesResponse> {
    const params: Record<string, any> = {};

    if (filters.season_id) params.season_id = filters.season_id;
    if (filters.tours?.length) params.tours = filters.tours;
    if (filters.team_ids?.length) params.team_ids = filters.team_ids;
    if (filters.month) params.month = filters.month;
    if (filters.year) params.year = filters.year;
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    if (filters.status) params.status = filters.status;
    if (filters.hide_past !== undefined) params.hide_past = filters.hide_past;
    if (filters.group_by_date !== undefined) params.group_by_date = filters.group_by_date;
    if (filters.language) params.language = filters.language;
    if (filters.limit) params.limit = filters.limit;
    if (filters.offset) params.offset = filters.offset;

    const response = await apiClient.get<GroupedMatchesResponse | StandardMatchesResponse>(
      ENDPOINTS.GAMES,
      params
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch matches');
    }

    return response.data;
  },
};
