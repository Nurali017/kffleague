import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { PlayerStatsTable } from './PlayerStatsTable';
import { ExtendedPlayerStat } from '@/types/statistics';

function createPlayer(overrides: Partial<ExtendedPlayerStat> = {}): ExtendedPlayerStat {
  return {
    player_id: 10,
    first_name: 'Ivan',
    last_name: 'Ivanov',
    photo_url: null,
    country: null,
    team_id: 20,
    team_name: 'Astana',
    team_logo: '',
    position: 'FWD',
    player_type: null,
    top_role: 'FWD',
    position_code: 'FWD',
    games_played: 10,
    games_starting: 10,
    minutes_played: 900,
    started: 10,
    subbed_in: 0,
    goals: 5,
    assists: 2,
    goal_and_assist: 7,
    xg: 4.2,
    shots: 20,
    shots_on_goal: 10,
    passes: 200,
    key_passes: 15,
    pass_accuracy: 85,
    duels: 50,
    duels_won: 30,
    aerial_duel: 15,
    ground_duel: 20,
    tackle: 4,
    interception: 8,
    recovery: 12,
    dribble: 9,
    dribble_success: 6,
    yellow_cards: 1,
    red_cards: 0,
    save_shot: 0,
    dry_match: 0,
    ...overrides,
  };
}

describe('PlayerStatsTable', () => {
  it('renders player and team links for valid ids', () => {
    renderWithProviders(
      <PlayerStatsTable
        subTab="key_stats"
        filters={{ club: 'all', nationality: 'all' }}
        players={[createPlayer()]}
      />
    );

    expect(document.querySelector('a[href="/player/10"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/team/20"]')).toBeInTheDocument();
    expect(screen.getByText('Ivanov I.')).toBeInTheDocument();
    expect(screen.queryByText(/^Поз$/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Astana')).not.toBeInTheDocument();
  });

  it('does not render links for invalid ids', () => {
    renderWithProviders(
      <PlayerStatsTable
        subTab="key_stats"
        filters={{ club: 'all', nationality: 'all' }}
        players={[
          createPlayer({
            player_id: 0,
            team_id: 0,
            team_name: 'No Team',
          }),
        ]}
      />
    );

    expect(document.querySelector('a[href="/player/0"]')).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/team/0"]')).not.toBeInTheDocument();
  });

  it('shows and hides mobile scroll hint after horizontal scroll interaction', async () => {
    renderWithProviders(
      <PlayerStatsTable
        subTab="key_stats"
        filters={{ club: 'all', nationality: 'all' }}
        players={[createPlayer()]}
      />
    );

    const container = screen.getByTestId('player-stats-scroll-container');
    Object.defineProperty(container, 'scrollWidth', { configurable: true, value: 1200 });
    Object.defineProperty(container, 'clientWidth', { configurable: true, value: 300 });

    fireEvent(window, new Event('resize'));
    await waitFor(() => {
      expect(screen.getByTestId('player-stats-scroll-hint')).toBeInTheDocument();
    });

    Object.defineProperty(container, 'scrollLeft', { configurable: true, value: 16, writable: true });
    fireEvent.scroll(container);

    await waitFor(() => {
      expect(screen.queryByTestId('player-stats-scroll-hint')).not.toBeInTheDocument();
    });
  });
});
