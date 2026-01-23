import { http, HttpResponse } from 'msw';

export const handlers = [
  // League table mock
  http.get('/api/v1/seasons/:seasonId/table', () => {
    return HttpResponse.json([
      {
        team_id: 1,
        team_name: 'Астана',
        position: 1,
        games_played: 26,
        wins: 18,
        draws: 5,
        losses: 3,
        goals_for: 52,
        goals_against: 18,
        goal_difference: 34,
        points: 59,
        logo_url: null,
      },
      {
        team_id: 2,
        team_name: 'Кайрат',
        position: 2,
        games_played: 26,
        wins: 17,
        draws: 4,
        losses: 5,
        goals_for: 48,
        goals_against: 22,
        goal_difference: 26,
        points: 55,
        logo_url: null,
      },
    ]);
  }),

  // Matches mock
  http.get('/api/v1/seasons/:seasonId/games', () => {
    return HttpResponse.json([
      {
        id: '1',
        date: '2024-11-15',
        time: '18:00',
        tour: 26,
        season_id: 61,
        home_score: 2,
        away_score: 1,
        home_team: { id: 1, name: 'Астана', logo_url: null, score: 2 },
        away_team: { id: 2, name: 'Кайрат', logo_url: null, score: 1 },
        stadium: 'Астана Арена',
      },
    ]);
  }),

  // News slider mock
  http.get('/api/v1/news/slider', () => {
    return HttpResponse.json([
      {
        id: 1,
        title: 'Test Slider News',
        image_url: 'https://example.com/image.jpg',
        publish_date: '2024-11-15',
        is_slider: true,
      },
    ]);
  }),

  // Latest news mock
  http.get('/api/v1/news/latest', () => {
    return HttpResponse.json([
      {
        id: 1,
        title: 'Test Latest News',
        excerpt: 'Test excerpt',
        image_url: 'https://example.com/image.jpg',
        publish_date: '2024-11-15',
        category: 'Новости',
      },
    ]);
  }),

  // Player stats mock
  http.get('/api/v1/seasons/:seasonId/player-stats', () => {
    return HttpResponse.json({
      season_id: 61,
      sort_by: 'goals',
      items: [
        {
          player_id: '1',
          first_name: 'Иван',
          last_name: 'Иванов',
          photo_url: null,
          team_id: 1,
          team_name: 'Астана',
          team_logo: null,
          goals: 15,
          assists: 5,
        },
      ],
      total: 1,
    });
  }),

  // Season stats mock
  http.get('/api/v1/seasons/:seasonId/statistics', () => {
    return HttpResponse.json({
      season_id: 61,
      season_name: '2024',
      matches_played: 156,
      wins: 78,
      draws: 39,
      total_attendance: 250000,
      total_goals: 350,
      goals_per_match: 2.24,
      penalties: 45,
      penalties_scored: 38,
      fouls_per_match: 22,
      yellow_cards: 420,
      second_yellow_cards: 12,
      red_cards: 8,
    });
  }),
];
