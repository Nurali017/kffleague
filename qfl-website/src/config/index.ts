export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1',
    serverBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000/api/v1',
  },
  league: {
    defaultSeasonId: Number(process.env.NEXT_PUBLIC_DEFAULT_SEASON_ID) || 61,
    defaultTour: Number(process.env.NEXT_PUBLIC_DEFAULT_TOUR) || 26,
  },
  i18n: {
    defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'ru',
  },
} as const;
