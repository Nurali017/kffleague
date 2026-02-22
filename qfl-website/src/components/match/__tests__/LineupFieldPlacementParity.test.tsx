import { describe, expect, it } from 'vitest';
import { cleanup } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { GameTeam, MatchLineups } from '@/types';
import { LineupField } from '../LineupField';
import { LineupFieldMini } from '../LineupFieldMini';

const homeTeam: GameTeam = { id: 1, name: 'Home', logo_url: null };
const awayTeam: GameTeam = { id: 2, name: 'Away', logo_url: null };

const lineups: MatchLineups = {
  home_team: {
    team_id: 1,
    team_name: 'Home',
    formation: '4-4-2',
    starters: [
      {
        player_id: 101,
        first_name: 'Home',
        last_name: 'Forward',
        number: 9,
        position: 'FWD',
        amplua: 'F',
        field_position: 'C',
        is_captain: false,
      },
      {
        player_id: 102,
        first_name: 'Home',
        last_name: 'Keeper',
        number: 1,
        position: 'GK',
        amplua: 'Gk',
        field_position: 'C',
        is_captain: false,
      },
      {
        player_id: 103,
        first_name: 'Home',
        last_name: 'LeftDef',
        number: 3,
        position: 'DEF',
        amplua: 'D',
        field_position: 'L',
        is_captain: false,
      },
      {
        player_id: 104,
        first_name: 'Home',
        last_name: 'DMLeftA',
        number: 6,
        position: 'MID',
        amplua: 'DM',
        field_position: 'LC',
        is_captain: false,
      },
      {
        player_id: 105,
        first_name: 'Home',
        last_name: 'DMLeftB',
        number: 8,
        position: 'MID',
        amplua: 'DM',
        field_position: 'LC',
        is_captain: false,
      },
      {
        player_id: 106,
        first_name: 'Home',
        last_name: 'NoAmpluaDef',
        number: 4,
        position: 'DEF',
        amplua: null,
        field_position: null,
        is_captain: false,
      },
    ],
    substitutes: [],
  },
  away_team: {
    team_id: 2,
    team_name: 'Away',
    formation: '4-4-2',
    starters: [
      {
        player_id: 201,
        first_name: 'Away',
        last_name: 'Forward',
        number: 10,
        position: 'FWD',
        amplua: 'F',
        field_position: 'C',
        is_captain: false,
      },
      {
        player_id: 202,
        first_name: 'Away',
        last_name: 'Keeper',
        number: 12,
        position: 'GK',
        amplua: 'Gk',
        field_position: 'C',
        is_captain: false,
      },
      {
        player_id: 203,
        first_name: 'Away',
        last_name: 'LeftDef',
        number: 5,
        position: 'DEF',
        amplua: 'D',
        field_position: 'L',
        is_captain: false,
      },
      {
        player_id: 204,
        first_name: 'Away',
        last_name: 'DMRightA',
        number: 6,
        position: 'MID',
        amplua: 'DM',
        field_position: 'RC',
        is_captain: false,
      },
      {
        player_id: 205,
        first_name: 'Away',
        last_name: 'DMRightB',
        number: 8,
        position: 'MID',
        amplua: 'DM',
        field_position: 'RC',
        is_captain: false,
      },
      {
        player_id: 206,
        first_name: 'Away',
        last_name: 'NoAmpluaMid',
        number: 14,
        position: 'MID',
        amplua: null,
        field_position: null,
        is_captain: false,
      },
    ],
    substitutes: [],
  },
};

function collectMarkerPositions(container: HTMLElement): Record<string, string> {
  const markers = container.querySelectorAll<HTMLElement>('[data-testid^="lineup-marker-"]');
  const entries: Array<[string, string]> = [];

  markers.forEach(marker => {
    const markerId = marker.dataset.testid?.replace('lineup-marker-', '');
    if (!markerId) {
      return;
    }
    entries.push([markerId, `${marker.style.left}|${marker.style.top}`]);
  });

  return Object.fromEntries(entries);
}

describe('Lineup field placement parity', () => {
  it('renders identical player marker coordinates in full and mini field views', () => {
    const full = renderWithProviders(
      <LineupField lineups={lineups} homeTeam={homeTeam} awayTeam={awayTeam} />
    );
    const fullPositions = collectMarkerPositions(full.container);
    full.unmount();

    cleanup();

    const mini = renderWithProviders(
      <LineupFieldMini lineups={lineups} homeTeam={homeTeam} awayTeam={awayTeam} />
    );
    const miniPositions = collectMarkerPositions(mini.container);

    expect(miniPositions).toEqual(fullPositions);
  });
});
