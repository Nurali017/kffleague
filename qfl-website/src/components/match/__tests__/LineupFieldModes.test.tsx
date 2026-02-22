import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
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
        player_id: 11,
        first_name: 'Home',
        last_name: 'Keeper',
        number: 1,
        position: 'GK',
        amplua: 'Gk',
        field_position: 'C',
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
        player_id: 21,
        first_name: 'Away',
        last_name: 'Forward',
        number: 9,
        position: 'FWD',
        amplua: 'F',
        field_position: 'C',
        is_captain: false,
      },
    ],
    substitutes: [],
  },
};

describe('Lineup field modes', () => {
  it('does not render field markers in list mode', () => {
    const { container } = renderWithProviders(
      <LineupField
        lineups={lineups}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        renderingMode="list"
      />
    );

    expect(screen.getByText('Home Keeper')).toBeInTheDocument();
    expect(screen.getByText('Away Forward')).toBeInTheDocument();
    expect(container.querySelector('[data-testid^="lineup-marker-"]')).toBeNull();
  });

  it('renders markers in field mode', () => {
    const { container } = renderWithProviders(
      <LineupField
        lineups={lineups}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        renderingMode="field"
      />
    );

    expect(container.querySelector('[data-testid="lineup-marker-11"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="lineup-marker-21"]')).not.toBeNull();
  });

  it('mini card also skips field markers in list mode', () => {
    const { container } = renderWithProviders(
      <LineupFieldMini
        lineups={lineups}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        renderingMode="list"
      />
    );

    expect(screen.getByText('Home Keeper')).toBeInTheDocument();
    expect(screen.getByText('Away Forward')).toBeInTheDocument();
    expect(container.querySelector('[data-testid^="lineup-marker-"]')).toBeNull();
  });
});

