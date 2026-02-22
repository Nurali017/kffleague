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
import { BackendLineupResponse, BackendLiveEventsResponse } from '../adapters/matchAdapter';

interface GamesResponse {
  items: Game[];
}

type MatchCenterQuery = Record<
  string,
  string | number | boolean | Array<string | number>
>;

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
    matchId: number,
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
    matchId: number,
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
    matchId: number,
    language?: string
  ): Promise<LineupResponse> {
    const response = await apiClient.get<BackendLineupResponse>(
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
    matchId: number,
    language?: string
  ): Promise<EventsResponse> {
    const response = await apiClient.get<BackendLiveEventsResponse>(
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
    const params: MatchCenterQuery = {};

    if (filters.season_id) params.season_id = filters.season_id;
    if (filters.group) params.group = filters.group;
    if (filters.final) params.final = true;
    if (filters.tours?.length) params.tours = filters.tours;
    if (filters.team_ids?.length) params.team_ids = filters.team_ids;
    if (filters.month) params.month = filters.month;
    if (filters.year) params.year = filters.year;
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    if (filters.status) params.status = filters.status;
    if (filters.hide_past !== undefined) params.hide_past = filters.hide_past;
    if (filters.group_by_date !== undefined) params.group_by_date = filters.group_by_date;
    if (filters.language) params.lang = filters.language;
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
