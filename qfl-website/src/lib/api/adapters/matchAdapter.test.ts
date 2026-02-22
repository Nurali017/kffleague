import { describe, expect, it } from 'vitest';
import {
  adaptEventsResponse,
  adaptLineupResponse,
  transformTeamStats,
} from './matchAdapter';

describe('matchAdapter', () => {
  it('maps lineup shirt_number to frontend number and preserves amplua/field_position', () => {
    const adapted = adaptLineupResponse({
      game_id: 1001,
      lineups: {
        home_team: {
          team_id: 1,
          team_name: 'Home',
          formation: '4-4-2',
          starters: [
            {
              player_id: 11,
              first_name: 'A',
              last_name: 'B',
              shirt_number: 9,
              position: 'CF',
              amplua: 'F',
              field_position: 'C',
            },
          ],
          substitutes: [],
        },
        away_team: {
          team_id: 2,
          team_name: 'Away',
          formation: '4-2-3-1',
          starters: [],
          substitutes: [],
        },
      },
      referees: [],
      coaches: {},
    });

    expect(adapted.match_id).toBe(1001);
    expect(adapted.lineups.home_team.starters[0].number).toBe(9);
    expect(adapted.lineups.home_team.starters[0].amplua).toBe('F');
    expect(adapted.lineups.home_team.starters[0].field_position).toBe('C');
    expect(adapted.lineups.home_team.starters[0].position).toBe('FWD');
  });

  it('maps cyrillic position labels to fallback role buckets', () => {
    const adapted = adaptLineupResponse({
      game_id: 1003,
      lineups: {
        home_team: {
          team_id: 1,
          team_name: 'Home',
          formation: '4-3-3 down',
          starters: [
            {
              player_id: 21,
              first_name: 'GK',
              last_name: 'Ru',
              shirt_number: 1,
              position: 'ВР (вратарь)',
            },
            {
              player_id: 22,
              first_name: 'DEF',
              last_name: 'Ru',
              shirt_number: 3,
              position: 'ЦЗ (центральный защитник)',
            },
            {
              player_id: 23,
              first_name: 'MID',
              last_name: 'Ru',
              shirt_number: 6,
              position: 'ОП (опорный полузащитник)',
            },
            {
              player_id: 24,
              first_name: 'FWD',
              last_name: 'Ru',
              shirt_number: 9,
              position: 'ЦН (центральный нападающий)',
            },
          ],
          substitutes: [],
        },
        away_team: {
          team_id: 2,
          team_name: 'Away',
          formation: '4-3-3 down',
          starters: [],
          substitutes: [],
        },
      },
      referees: [],
      coaches: {},
    });

    expect(adapted.lineups.home_team.starters.map(player => player.position)).toEqual([
      'GK',
      'DEF',
      'MID',
      'FWD',
    ]);
  });

  it('maps live events to nullable player identifiers', () => {
    const adapted = adaptEventsResponse({
      game_id: 1002,
      total: 1,
      events: [
        {
          id: 77,
          minute: 54,
          event_type: 'goal',
          team_id: 1,
          team_name: 'Home',
          player_id: null,
          player_name: 'Unknown',
        },
      ],
    });

    expect(adapted.game_id).toBe(1002);
    expect(adapted.events[0].player_id).toBeNull();
    expect(adapted.events[0].team_id).toBe(1);
  });

  it('converts team stats array to home/away structure', () => {
    const stats = transformTeamStats(
      [
        { team_id: 1, possession_percent: 55, shots: 10 },
        { team_id: 2, possession_percent: 45, shots: 7 },
      ],
      1,
      2
    );

    expect(stats).toEqual({
      possession: { home: 55, away: 45 },
      shots: { home: 10, away: 7 },
      shots_on_target: { home: 0, away: 0 },
      corners: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 },
      offsides: { home: 0, away: 0 },
      yellow_cards: { home: 0, away: 0 },
      red_cards: { home: 0, away: 0 },
    });
  });
});
