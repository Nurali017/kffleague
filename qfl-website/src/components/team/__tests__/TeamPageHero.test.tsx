import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import { TeamPageHero } from '../TeamPageHero';
import { TeamOverviewTeam } from '@/types/team';

const team: TeamOverviewTeam = {
  id: 13,
  name: 'Кайрат',
  city: 'Алматы',
  logo_url: null,
  website: 'fckairat.com',
  stadium: { name: 'Орталық стадион', city: 'Алматы', capacity: 0 },
  primary_color: '#1E4D8C',
  secondary_color: '#2f6fbe',
  accent_color: '#E5B73B',
};

describe('TeamPageHero', () => {
  it('renders team metadata and KPI pills', () => {
    renderWithProviders(
      <TeamPageHero
        team={team}
        summary={{
          games_played: 26,
          wins: 18,
          draws: 5,
          losses: 3,
          goals_scored: 53,
          goals_conceded: 19,
          goal_difference: 34,
          points: 59,
        }}
        seasonName="2025"
        tournamentName="Премьер-Лига"
      />
    );

    expect(screen.getByText('Кайрат')).toBeInTheDocument();
    expect(screen.getByText('Орталық стадион')).toBeInTheDocument();
    expect(screen.getByText('Премьер-Лига · 2025')).toBeInTheDocument();
  });

  it('renders without crashing in dark mode', () => {
    document.documentElement.classList.add('dark');
    renderWithProviders(
      <TeamPageHero
        team={team}
        summary={{
          games_played: 10,
          wins: 6,
          draws: 2,
          losses: 2,
          goals_scored: 20,
          goals_conceded: 8,
          goal_difference: 12,
          points: 20,
        }}
      />
    );

    expect(screen.getByText('Кайрат')).toBeInTheDocument();
    document.documentElement.classList.remove('dark');
  });
});
