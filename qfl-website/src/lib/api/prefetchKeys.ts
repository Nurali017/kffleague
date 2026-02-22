export const prefetchKeys = {
  matchesByTour: (seasonId: number, tour: number, language: string) =>
    `matches:${seasonId}:${tour}:${language}:tour`,
  matchDetail: (matchId: number, language: string) =>
    `matches:${matchId}:${language}:detail`,
  matchStats: (matchId: number, language: string) =>
    `matches:${matchId}:${language}:stats`,
  matchLineup: (matchId: number, language: string) =>
    `matches:${matchId}:${language}:lineup`,
  matchEvents: (matchId: number, language: string) =>
    `matches:${matchId}:${language}:events`,
  matchCenter: (filtersHash: string) =>
    `matches:center:${filtersHash}`,

  teamOverview: (teamId: number, seasonId: number, language: string) =>
    `teams:${teamId}:${seasonId}:${language}:overview`,
  teamDetail: (teamId: number, language: string) =>
    `teams:${teamId}:${language}:detail`,
  teamStats: (teamId: number, seasonId: number, language: string) =>
    `teams:${teamId}:${seasonId}:${language}:stats`,
  teamPlayers: (teamId: number, seasonId: number, language: string) =>
    `teams:${teamId}:${seasonId}:${language}:players`,
  teamGames: (teamId: number, seasonId: number, language: string) =>
    `teams:${teamId}:${seasonId}:${language}:games`,
  teamsList: (seasonId: number, language: string) =>
    `teams:${seasonId}:${language}:list`,

  playerDetail: (playerId: number, seasonId: number, language: string) =>
    `players:${playerId}:${seasonId}:${language}:detail`,
  playerSeasonStats: (playerId: number, seasonId: number, language: string) =>
    `players:${playerId}:${seasonId}:${language}:stats`,
  playerTeammates: (
    playerId: number,
    seasonId: number,
    limit: number,
    language: string
  ) => `players:${playerId}:${seasonId}:${limit}:${language}:teammates`,
  playerTournaments: (playerId: number, language: string) =>
    `players:${playerId}:${language}:tournaments`,
  playerMatches: (playerId: number, limit: number, language: string) =>
    `players:${playerId}:${limit}:${language}:matches`,

  newsById: (newsId: number, language: string) =>
    `news:${newsId}:${language}:detail`,
  newsSlider: (language: string, limit: number, tournamentId: string | undefined) =>
    `news:${language}:${limit}:${tournamentId ?? ''}:slider`,
  newsLatest: (language: string, limit: number, tournamentId: string | undefined) =>
    `news:${language}:${limit}:${tournamentId ?? ''}:latest`,
  newsNavigation: (newsId: number, language: string) =>
    `news:${newsId}:${language}:navigation`,
  newsReactions: (newsId: number) =>
    `news:${newsId}:reactions`,
  newsPaginated: (
    language: string,
    filtersHash: string,
    page: number,
    limit: number
  ) => `news:${language}:${filtersHash}:${page}:${limit}:paginated`,

  pagesLeadership: (language: string) => `pages:${language}:leadership`,
  pagesContacts: (language: string) => `pages:${language}:contacts`,
  pagesDocuments: (language: string) => `pages:${language}:documents`,

  leagueTable: (
    seasonId: number,
    tourFrom: number | undefined,
    tourTo: number | undefined,
    homeAway: 'home' | 'away' | null | undefined,
    group: string | null | undefined,
    final: boolean | undefined,
    language: string
  ) => `league:${seasonId}:${tourFrom ?? ''}:${tourTo ?? ''}:${homeAway ?? ''}:${group ?? ''}:${final ? 1 : 0}:${language}:table`,
  resultsGrid: (
    seasonId: number,
    group: string | null | undefined,
    final: boolean | undefined,
    language: string
  ) => `league:${seasonId}:${group ?? ''}:${final ? 1 : 0}:${language}:results-grid`,

  seasonStats: (seasonId: number, language: string) =>
    `stats:${seasonId}:${language}:season`,
  seasonGoalsByPeriod: (seasonId: number) =>
    `stats:${seasonId}:goals-by-period`,
  teamStatsTable: (
    seasonId: number,
    sortBy: string,
    limit: number,
    offset: number,
    language: string
  ) => `stats:${seasonId}:${sortBy}:${limit}:${offset}:${language}:team-table`,
  playerStats: (
    seasonId: number,
    sortBy: string,
    limit: number,
    offset: number,
    teamId: number | null,
    positionCode: string | null,
    nationality: string | null,
    language: string
  ) => `stats:${seasonId}:${sortBy}:${limit}:${offset}:${teamId ?? ''}:${positionCode ?? ''}:${nationality ?? ''}:${language}:players`,
  playerLeaderboard: (seasonId: number, limit: number, language: string) =>
    `stats:${seasonId}:${limit}:${language}:player-leaderboard`,

  cupOverview: (
    seasonId: number,
    language: string,
    recentLimit: number,
    upcomingLimit: number
  ) => `cup:${seasonId}:${language}:${recentLimit}:${upcomingLimit}:overview`,
  cupSchedule: (seasonId: number, language: string, roundKey: string | null) =>
    `cup:${seasonId}:${language}:${roundKey ?? ''}:schedule`,
} as const;
