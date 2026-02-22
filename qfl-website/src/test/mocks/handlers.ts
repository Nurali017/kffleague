import { http, HttpResponse } from 'msw';

export const handlers = [
  // League table mock
  http.get('/api/v1/seasons/:seasonId/table', () => {
    return HttpResponse.json({
      season_id: 61,
      table: [
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
      ],
    });
  }),

  // Matches mock
  http.get('/api/v1/seasons/:seasonId/games', () => {
    return HttpResponse.json({
      items: [
        {
          id: 1,
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
      ],
    });
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
      },
    ]);
  }),

  // Player stats mock
  http.get('/api/v1/seasons/:seasonId/player-stats', ({ request, params }) => {
    const url = new URL(request.url);
    const seasonId = Number(params.seasonId);
    const sortBy = url.searchParams.get('sort_by') ?? 'goals';
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const offset = Number(url.searchParams.get('offset') ?? '0');
    const teamIdRaw = url.searchParams.get('team_id');
    const positionCode = url.searchParams.get('position_code');
    const nationality = url.searchParams.get('nationality');

    const allItems = [
      {
        player_id: 1,
        first_name: 'Иван',
        last_name: 'Иванов',
        photo_url: null,
        country: {
          id: 1,
          code: 'KZ',
          name: 'Казахстан',
          flag_url: null,
        },
        team_id: 1,
        team_name: 'Астана',
        team_logo: '/images/placeholders/team.svg',
        player_type: 'forward',
        top_role: 'FW',
        position_code: 'FWD',
        games_played: 26,
        minutes_played: 2100,
        goals: 15,
        assists: 5,
        goal_and_assist: 20,
        xg: 10.5,
        shots: 42,
        shots_on_goal: 19,
        passes: 480,
        key_passes: 25,
        pass_accuracy: 78,
        duels: 120,
        duels_won: 63,
        aerial_duel: 22,
        ground_duel: 98,
        tackle: 5,
        interception: 4,
        recovery: 12,
        dribble: 40,
        dribble_success: 22,
        yellow_cards: 2,
        red_cards: 0,
        save_shot: null,
        dry_match: null,
      },
      {
        player_id: 2,
        first_name: 'Павел',
        last_name: 'Петров',
        photo_url: null,
        country: {
          id: 2,
          code: 'RS',
          name: 'Сербия',
          flag_url: null,
        },
        team_id: 1,
        team_name: 'Астана',
        team_logo: '/images/placeholders/team.svg',
        player_type: 'goalkeeper',
        top_role: 'Goalkeeper',
        position_code: 'GK',
        games_played: 26,
        minutes_played: 2340,
        goals: 0,
        assists: 0,
        goal_and_assist: 0,
        xg: 0,
        shots: 0,
        shots_on_goal: 0,
        passes: 610,
        key_passes: 0,
        pass_accuracy: 71,
        duels: null,
        duels_won: null,
        aerial_duel: null,
        ground_duel: null,
        tackle: null,
        interception: 0,
        recovery: 0,
        dribble: null,
        dribble_success: null,
        yellow_cards: 1,
        red_cards: 0,
        save_shot: 45,
        dry_match: 8,
      },
      {
        player_id: 3,
        first_name: 'Азамат',
        last_name: 'Алиев',
        photo_url: null,
        country: {
          id: 1,
          code: 'KZ',
          name: 'Казахстан',
          flag_url: null,
        },
        team_id: 2,
        team_name: 'Кайрат',
        team_logo: '/images/placeholders/team.svg',
        player_type: 'midfielder',
        top_role: 'CM',
        position_code: 'MID',
        games_played: 26,
        minutes_played: 2000,
        goals: 3,
        assists: 7,
        goal_and_assist: 10,
        xg: 3.1,
        shots: 20,
        shots_on_goal: 8,
        passes: 1200,
        key_passes: 40,
        pass_accuracy: 88,
        duels: 160,
        duels_won: 92,
        aerial_duel: 30,
        ground_duel: 130,
        tackle: 25,
        interception: 18,
        recovery: 50,
        dribble: 18,
        dribble_success: 10,
        yellow_cards: 4,
        red_cards: 1,
        save_shot: null,
        dry_match: null,
      },
    ];

    const teamId = teamIdRaw ? Number(teamIdRaw) : null;
    let items = allItems;
    if (teamId !== null && Number.isFinite(teamId)) {
      items = items.filter((p) => p.team_id === teamId);
    }
    if (positionCode) {
      items = items.filter((p) => p.position_code === positionCode);
    }
    if (nationality === 'kz') {
      items = items.filter((p) => p.country?.code?.toUpperCase() === 'KZ');
    } else if (nationality === 'foreign') {
      items = items.filter((p) => {
        const code = p.country?.code?.toUpperCase();
        return Boolean(code) && code !== 'KZ';
      });
    }

    items = [...items].sort((a, b) => {
      const av = (a as any)[sortBy] as number | null | undefined;
      const bv = (b as any)[sortBy] as number | null | undefined;

      const aNum = typeof av === 'number' && Number.isFinite(av) ? av : null;
      const bNum = typeof bv === 'number' && Number.isFinite(bv) ? bv : null;

      if (aNum === null && bNum === null) return 0;
      if (aNum === null) return 1;
      if (bNum === null) return -1;
      return bNum - aNum;
    });

    const total = items.length;
    const paginated = items.slice(offset, offset + limit);

    return HttpResponse.json({
      season_id: Number.isFinite(seasonId) ? seasonId : 61,
      sort_by: sortBy,
      items: paginated,
      total,
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

  // Goals by period mock
  http.get('/api/v1/seasons/:seasonId/goals-by-period', ({ params }) => {
    const seasonId = Number(params.seasonId);
    return HttpResponse.json({
      season_id: Number.isFinite(seasonId) ? seasonId : 61,
      period_size_minutes: 15,
      periods: [
        { period: '0-15', goals: 45, home: 24, away: 21 },
        { period: '16-30', goals: 58, home: 30, away: 28 },
        { period: '31-45+', goals: 67, home: 35, away: 32 },
        { period: '46-60', goals: 62, home: 34, away: 28 },
        { period: '61-75', goals: 71, home: 38, away: 33 },
        { period: '76-90+', goals: 47, home: 25, away: 22 },
      ],
      meta: {
        matches_played: 156,
        matches_with_goal_events: 120,
        coverage_pct: 76.9,
      },
    });
  }),

  http.get('/api/v1/non-existent', () => {
    return HttpResponse.json(
      { message: 'Not Found' },
      { status: 404 }
    );
  }),
];
