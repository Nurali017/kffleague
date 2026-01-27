import { config } from '@/config';

export const ENDPOINTS = {
  SEASON_TABLE: (seasonId: number) => `/seasons/${seasonId}/table`,
  SEASON_RESULTS_GRID: (seasonId: number) => `/seasons/${seasonId}/results-grid`,
  SEASON_GAMES: (seasonId: number) => `/seasons/${seasonId}/games`,
  SEASON_PLAYER_STATS: (seasonId: number) => `/seasons/${seasonId}/player-stats`,
  SEASON_TEAM_STATS: (seasonId: number) => `/seasons/${seasonId}/team-stats`,
  SEASON_STATISTICS: (seasonId: number) => `/seasons/${seasonId}/statistics`,
  GAMES: '/games',
  NEWS_SLIDER: '/news/slider',
  NEWS_LATEST: '/news/latest',
  NEWS_BY_ID: (id: number) => `/news/${id}`,
  NEWS_PAGINATED: '/news',
  NEWS_CATEGORIES: '/news/categories',
  NEWS_VIEW: (id: number) => `/news/${id}/view`,
  NEWS_LIKE: (id: number) => `/news/${id}/like`,
  NEWS_REACTIONS: (id: number) => `/news/${id}/reactions`,
  NEWS_NAVIGATION: (id: number) => `/news/${id}/navigation`,
  MATCH_DETAIL: (id: string) => `/games/${id}`,
  MATCH_STATS: (id: string) => `/games/${id}/stats`,
  MATCH_LINEUP: (id: string) => `/games/${id}/lineup`,
  MATCH_EVENTS: (id: string) => `/live/events/${id}`,
  PLAYER_DETAIL: (id: string) => `/players/${id}`,
  PLAYER_MATCHES: (id: string) => `/players/${id}/games`,
  PLAYER_STATS: (id: string) => `/players/${id}/stats`,
  PLAYER_TEAMMATES: (id: string) => `/players/${id}/teammates`,
  PLAYER_TOURNAMENTS: (id: string) => `/players/${id}/tournaments`,
  TEAMS: '/teams',
  TEAM_DETAIL: (id: number) => `/teams/${id}`,
  TEAM_STATS: (id: number) => `/teams/${id}/stats`,
  TEAM_PLAYERS: (id: number) => `/teams/${id}/players`,
  TEAM_GAMES: (id: number) => `/teams/${id}/games`,
  TEAM_COACHES: (id: number) => `/teams/${id}/coaches`,
  HEAD_TO_HEAD: (team1Id: number, team2Id: number) =>
    `/teams/${team1Id}/vs/${team2Id}/head-to-head`,
  // Pages
  PAGE_LEADERSHIP: (lang: string) => `/pages/leadership/${lang}`,
  PAGE_CONTACTS: (lang: string) => `/pages/contacts/${lang}`,
  PAGE_DOCUMENTS: (lang: string) => `/pages/documents/${lang}`,
} as const;

export const DEFAULT_SEASON_ID = config.league.defaultSeasonId;
export const DEFAULT_TOUR = config.league.defaultTour;
export const DEFAULT_LANGUAGE = config.i18n.defaultLanguage;
