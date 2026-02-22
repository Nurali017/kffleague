import { describe, expect, it } from 'vitest';
import { LineupPlayerExtended } from '@/types';
import { buildPlacedPlayers, getPlayerSortOrder, orderStartersForPlacement } from './lineupPlacement';

function makePlayer(
  playerId: number,
  overrides: Partial<LineupPlayerExtended> = {}
): LineupPlayerExtended {
  return {
    player_id: playerId,
    first_name: String(playerId),
    last_name: String(playerId),
    number: 1,
    position: 'MID',
    is_captain: false,
    ...overrides,
  };
}

describe('lineupPlacement', () => {
  it('sorts starters by amplua + field position with backend-compatible order', () => {
    const starters = [
      makePlayer(301, { amplua: 'F', field_position: 'RC', position: 'FWD' }),
      makePlayer(302, { amplua: 'Gk', field_position: 'C', position: 'GK' }),
      makePlayer(303, { amplua: 'D', field_position: 'C', position: 'DEF' }),
      makePlayer(304, { amplua: 'AM', field_position: 'L', position: 'MID' }),
      makePlayer(305, { amplua: 'D', field_position: 'L', position: 'DEF' }),
    ];

    const orderedIds = orderStartersForPlacement(starters).map(player => player.player_id);
    expect(orderedIds).toEqual([302, 305, 303, 304, 301]);
  });

  it('keeps stable order for players with equal fallback priority', () => {
    const firstMid = makePlayer(401, { position: 'MID' });
    const secondMid = makePlayer(402, { position: 'MID' });

    expect(getPlayerSortOrder(firstMid)).toBe(getPlayerSortOrder(secondMid));

    const orderedIds = orderStartersForPlacement([secondMid, firstMid]).map(
      player => player.player_id
    );
    expect(orderedIds).toEqual([402, 401]);
  });

  it('maps amplua + field_position to expected role-grid coordinates', () => {
    const starters = [
      makePlayer(501, { amplua: 'F', field_position: 'C', position: 'FWD' }),
      makePlayer(502, { amplua: 'AM', field_position: 'LC', position: 'MID' }),
      makePlayer(503, { amplua: 'Gk', field_position: 'C', position: 'GK' }),
      makePlayer(504, { amplua: 'DM', field_position: 'R', position: 'MID' }),
      makePlayer(505, { amplua: 'D', field_position: 'LC', position: 'DEF' }),
    ];

    const byId = Object.fromEntries(
      buildPlacedPlayers({ starters }).map(({ player, position }) => [player.player_id, position])
    );

    expect(byId[503]).toEqual({ x: 50, y: 5 });
    expect(byId[505]).toEqual({ x: 34, y: 25 });
    expect(byId[504]).toEqual({ x: 82, y: 40 });
    expect(byId[502]).toEqual({ x: 34, y: 64 });
    expect(byId[501]).toEqual({ x: 50, y: 76 });
  });

  it('spreads duplicates inside the same lane sector symmetrically', () => {
    const starters = [
      makePlayer(601, { amplua: 'DM', field_position: 'LC', position: 'MID' }),
      makePlayer(602, { amplua: 'DM', field_position: 'LC', position: 'MID' }),
      makePlayer(603, { amplua: 'DM', field_position: 'LC', position: 'MID' }),
    ];

    const byId = Object.fromEntries(
      buildPlacedPlayers({ starters }).map(({ player, position }) => [player.player_id, position])
    );

    expect(byId[601]).toEqual({ x: 30, y: 40 });
    expect(byId[602]).toEqual({ x: 34, y: 40 });
    expect(byId[603]).toEqual({ x: 38, y: 40 });
  });

  it('falls back to position->center lane when amplua or field_position is missing', () => {
    const starters = [
      makePlayer(701, { position: 'GK', amplua: null, field_position: null }),
      makePlayer(702, { position: 'DEF', amplua: 'D', field_position: null }),
      makePlayer(703, { position: 'MID', amplua: null, field_position: 'RC' }),
      makePlayer(704, { position: 'FWD', amplua: null, field_position: null }),
    ];

    const byId = Object.fromEntries(
      buildPlacedPlayers({ starters }).map(({ player, position }) => [player.player_id, position])
    );

    expect(byId[701]).toEqual({ x: 50, y: 5 });
    expect(byId[702]).toEqual({ x: 50, y: 25 });
    expect(byId[703]).toEqual({ x: 50, y: 52 });
    expect(byId[704]).toEqual({ x: 50, y: 76 });
  });

  it('applies away mirroring and vertical inversion correctly', () => {
    const starters = [
      makePlayer(801, { amplua: 'Gk', field_position: 'C', position: 'GK' }),
      makePlayer(802, { amplua: 'D', field_position: 'L', position: 'DEF' }),
    ];

    const byId = Object.fromEntries(
      buildPlacedPlayers({
        starters,
        invertY: true,
        mirrorX: true,
      }).map(({ player, position }) => [player.player_id, position])
    );

    expect(byId[801]).toEqual({ x: 50, y: 95 });
    expect(byId[802]).toEqual({ x: 82, y: 75 });
  });
});
