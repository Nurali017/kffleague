import { describe, expect, it } from 'vitest';
import {
  adaptPlayerDetailResponse,
  adaptPlayerMatchesResponse,
  adaptPlayerStatsResponse,
  adaptPlayerTeammatesResponse,
} from './playerAdapter';

describe('playerAdapter', () => {
  it('normalizes player detail identifiers to numbers', () => {
    const adapted = adaptPlayerDetailResponse({
      id: '10' as unknown as number,
      first_name: 'A',
      last_name: 'B',
      birthday: null,
      player_type: null,
      country: null,
      photo_url: null,
      age: null,
      top_role: null,
      teams: ['1', '2'] as unknown as number[],
      jersey_number: 9,
    });

    expect(adapted.id).toBe(10);
    expect(adapted.teams).toEqual([1, 2]);
  });

  it('normalizes match ids in player matches list', () => {
    const adapted = adaptPlayerMatchesResponse({
      items: [
        {
          match_id: '101' as unknown as number,
          date: '2025-01-01',
          home_team: { id: 1, name: 'A' },
          away_team: { id: 2, name: 'B' },
          player_team: 'home',
          minutes_played: 90,
          goals: 1,
          assists: 0,
          yellow_card: false,
          red_card: false,
        },
      ],
    });

    expect(adapted.items[0].match_id).toBe(101);
  });

  it('normalizes player_id in season stats payload', () => {
    const adapted = adaptPlayerStatsResponse({
      player_id: '44' as unknown as number,
      season_id: 61,
      team_id: 7,
      games_played: 1,
      games_starting: 1,
      minutes_played: 90,
      goals: 1,
      assists: 0,
      xg: 0.5,
      xg_per_90: 0.5,
      shots: 2,
      shots_on_goal: 1,
      passes: 20,
      pass_accuracy: 80,
      key_passes: 2,
      duels: 5,
      duels_won: 3,
      yellow_cards: 0,
      red_cards: 0,
      extra_stats: null,
    });

    expect(adapted.player_id).toBe(44);
  });

  it('normalizes teammate player identifiers', () => {
    const adapted = adaptPlayerTeammatesResponse({
      items: [
        {
          player_id: '99' as unknown as number,
          first_name: 'Teammate',
          last_name: 'One',
          jersey_number: 11,
          position: 'DEF',
          age: 24,
          photo_url: null,
        },
      ],
      total: 1,
    });

    expect(adapted.items[0].player_id).toBe(99);
  });
});
