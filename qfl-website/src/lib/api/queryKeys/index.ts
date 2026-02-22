export const queryKeys = {
  games: {
    byTour: (seasonId: number, tour: number, language: string) =>
      ['/games', seasonId, 'tour', tour, language] as const,
    byId: (matchId: number, language: string) => ['/games', matchId, language] as const,
    stats: (matchId: number, language: string) => ['/games', matchId, 'stats', language] as const,
    lineup: (matchId: number, language: string) => ['/games', matchId, 'lineup', language] as const,
    events: (matchId: number, language: string) => ['/live', 'events', matchId, language] as const,
    center: (filtersHash: string) => ['/games', 'center', filtersHash] as const,
  },
  teams: {
    list: (seasonId: number, language: string) => ['/teams', seasonId, language] as const,
    byId: (teamId: number, language: string) => ['/teams', teamId, language] as const,
    overview: (teamId: number, seasonId: number, language: string) =>
      ['/teams', teamId, 'overview', seasonId, language] as const,
    stats: (teamId: number, seasonId: number, language: string) =>
      ['/teams', teamId, 'stats', seasonId, language] as const,
    players: (teamId: number, seasonId: number, language: string) =>
      ['/teams', teamId, 'players', seasonId, language] as const,
    games: (teamId: number, seasonId: number, language: string) =>
      ['/teams', teamId, 'games', seasonId, language] as const,
    coaches: (teamId: number, seasonId: number, language: string) =>
      ['/teams', teamId, 'coaches', seasonId, language] as const,
  },
  players: {
    byId: (playerId: number, seasonId: number, language: string) =>
      ['/players', playerId, seasonId, language] as const,
    games: (playerId: number, limit: number, language: string) =>
      ['/players', playerId, 'games', limit, language] as const,
    stats: (playerId: number, seasonId: number, language: string) =>
      ['/players', playerId, 'stats', seasonId, language] as const,
    teammates: (playerId: number, seasonId: number, limit: number, language: string) =>
      ['/players', playerId, 'teammates', seasonId, limit, language] as const,
    tournaments: (playerId: number, language: string) =>
      ['/players', playerId, 'tournaments', language] as const,
  },
  news: {
    slider: (language: string, limit: number, tournamentId: string | undefined) =>
      ['/news', 'slider', language, limit, tournamentId ?? null] as const,
    latest: (language: string, limit: number, tournamentId: string | undefined) =>
      ['/news', 'latest', language, limit, tournamentId ?? null] as const,
    byId: (newsId: number, language: string) => ['/news', newsId, language] as const,
    navigation: (newsId: number, language: string) =>
      ['/news', newsId, 'navigation', language] as const,
    reactions: (newsId: number) => ['/news', newsId, 'reactions'] as const,
    paginated: (language: string, filtersHash: string, page: number, limit: number) =>
      ['/news', 'paginated', language, filtersHash, page, limit] as const,
  },
  pages: {
    leadership: (language: string) => ['/pages', 'leadership', language] as const,
    contacts: (language: string) => ['/pages', 'contacts', language] as const,
    documents: (language: string) => ['/pages', 'documents', language] as const,
  },
  league: {
    table: (
      seasonId: number,
      tourFrom: number | undefined,
      tourTo: number | undefined,
      homeAway: 'home' | 'away' | null | undefined,
      group: string | null | undefined,
      final: boolean | undefined,
      language: string
    ) => ['/seasons', seasonId, 'table', tourFrom, tourTo, homeAway, group, final, language] as const,
    resultsGrid: (
      seasonId: number,
      group: string | null | undefined,
      final: boolean | undefined,
      language: string
    ) => ['/seasons', seasonId, 'results-grid', group, final, language] as const,
  },
  stats: {
    season: (seasonId: number, language: string) =>
      ['/seasons', seasonId, 'statistics', language] as const,
    goalsByPeriod: (seasonId: number) =>
      ['/seasons', seasonId, 'goals-by-period'] as const,
    teamTable: (
      seasonId: number,
      sortBy: string,
      limit: number,
      offset: number,
      language: string
    ) => ['/seasons', seasonId, 'team-stats', sortBy, limit, offset, language] as const,
    players: (
      seasonId: number,
      sortBy: string,
      limit: number,
      offset: number,
      teamId: number | null,
      positionCode: string | null,
      nationality: string | null,
      language: string
    ) => [
      '/seasons',
      seasonId,
      'player-stats',
      sortBy,
      limit,
      offset,
      teamId,
      positionCode,
      nationality,
      language,
    ] as const,
    playerLeaderboard: (seasonId: number, limit: number, language: string) =>
      ['/seasons', seasonId, 'player-leaderboard', limit, language] as const,
  },
  cup: {
    overview: (
      seasonId: number,
      language: string,
      recentLimit: number,
      upcomingLimit: number
    ) => ['/cup', seasonId, 'overview', language, recentLimit, upcomingLimit] as const,
    schedule: (seasonId: number, language: string, roundKey: string | null) =>
      ['/cup', seasonId, 'schedule', language, roundKey] as const,
  },
} as const;
