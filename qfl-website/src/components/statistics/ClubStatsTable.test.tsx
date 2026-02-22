import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/utils';
import { ClubStatsTable } from './ClubStatsTable';
import { TeamStatistics } from '@/types/statistics';

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
});
