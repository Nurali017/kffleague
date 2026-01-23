import { config } from '../config';

export const ENDPOINTS = {
  SEASON_TABLE: (seasonId: number) => `/seasons/${seasonId}/table`,
  SEASON_GAMES: (seasonId: number) => `/seasons/${seasonId}/games`,
  SEASON_PLAYER_STATS: (seasonId: number) => `/seasons/${seasonId}/player-stats`,
  SEASON_STATISTICS: (seasonId: number) => `/seasons/${seasonId}/statistics`,
  NEWS_SLIDER: '/news/slider',
  NEWS_LATEST: '/news/latest',

  // Match detail endpoints
  MATCH_DETAIL: (id: string) => `/games/${id}`,
  MATCH_STATS: (id: string) => `/games/${id}/stats`,
  MATCH_LINEUP: (id: string) => `/games/${id}/lineup`,
  MATCH_EVENTS: (id: string) => `/live/events/${id}`,
} as const;

export const DEFAULT_SEASON_ID = config.league.defaultSeasonId;
export const DEFAULT_TOUR = config.league.defaultTour;
export const DEFAULT_LANGUAGE = config.i18n.defaultLanguage;
