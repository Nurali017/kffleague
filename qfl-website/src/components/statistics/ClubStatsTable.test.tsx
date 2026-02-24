import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { ClubStatsTable } from './ClubStatsTable';
import { TeamStatistics } from '@/types/statistics';

const { routerPushMock } = vi.hoisted(() => ({
  routerPushMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPushMock }),
  useSearchParams: () => new URLSearchParams(),
}));

function createTeam(overrides: Partial<TeamStatistics> = {}): TeamStatistics {
  return {
    team_id: 20,
    team_name: 'Astana',
    team_logo: '',
    games_played: 10,
    wins: 6,
    draws: 2,
    losses: 2,
    goals_scored: 18,
    goals_conceded: 9,
    goal_difference: 9,
    points: 20,
    ...overrides,
  };
}

describe('ClubStatsTable', () => {
  beforeEach(() => {
    routerPushMock.mockReset();
  });

  it('renders team links for valid ids', () => {
    renderWithProviders(
      <ClubStatsTable
        subTab="key_stats"
        teams={[createTeam()]}
      />
    );

    expect(document.querySelector('a[href="/team/20"]')).toBeInTheDocument();
  });

  it('does not render team links for invalid ids', () => {
    renderWithProviders(
      <ClubStatsTable
        subTab="key_stats"
        teams={[createTeam({ team_id: 0, team_name: 'Unknown' })]}
      />
    );

    expect(document.querySelector('a[href="/team/0"]')).not.toBeInTheDocument();
  });

  it('renders mobile scroll hint container', () => {
    renderWithProviders(
      <ClubStatsTable
        subTab="key_stats"
        teams={[createTeam()]}
      />
    );

    expect(screen.getByTestId('club-stats-scroll-hint')).toBeInTheDocument();
  });

  it('navigates when a row is clicked', () => {
    renderWithProviders(
      <ClubStatsTable
        subTab="key_stats"
        teams={[createTeam()]}
      />
    );

    const row = screen.getByText('Astana').closest('tr');
    expect(row).toBeTruthy();
    fireEvent.click(row!);

    expect(routerPushMock).toHaveBeenCalledWith('/team/20', undefined);
  });
});
