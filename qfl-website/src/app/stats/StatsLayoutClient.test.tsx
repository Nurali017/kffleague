import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders, screen } from '@/test/utils';
import StatsLayout from './StatsLayoutClient';

const { useSeasonStatsMock, useSeasonGoalsByPeriodMock, useTournamentMock } = vi.hoisted(() => ({
  useSeasonStatsMock: vi.fn(),
  useSeasonGoalsByPeriodMock: vi.fn(),
  useTournamentMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/stats/teams',
  useSearchParams: () => new URLSearchParams('tournament=2l&season=180'),
}));

vi.mock('@/hooks', () => ({
  useSeasonStats: (...args: unknown[]) => useSeasonStatsMock(...args),
  useSeasonGoalsByPeriod: (...args: unknown[]) => useSeasonGoalsByPeriodMock(...args),
}));

vi.mock('@/contexts/TournamentContext', () => ({
  useTournament: () => useTournamentMock(),
}));

vi.mock('@/config/tournaments', () => ({
  PRE_SEASON_CONFIG: { seasonStarted: false, previousSeasonId: 61 },
}));

vi.mock('@/components/statistics/StatisticsHero', () => ({
  StatisticsHero: () => <div data-testid="statistics-hero" />,
}));

vi.mock('@/components/ui/Skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

vi.mock('@/components/ui/HeroBackground', () => ({
  HeroBackground: () => <div data-testid="hero-background" />,
}));

describe('StatsLayoutClient season selection', () => {
  beforeEach(() => {
    useTournamentMock.mockReset();
    useSeasonStatsMock.mockReset();
    useSeasonGoalsByPeriodMock.mockReset();

    useTournamentMock.mockReturnValue({
      effectiveSeasonId: 180,
      currentTournament: {
        name: { ru: 'Вторая лига', kz: 'Екінші Лига', short: '2Л' },
      },
    });
    useSeasonStatsMock.mockReturnValue({
      stats: {
        season_name: '2026',
        total_goals: 0,
        goals_per_match: 0,
        matches_played: 0,
      },
      loading: false,
      error: null,
    });
    useSeasonGoalsByPeriodMock.mockReturnValue({
      goalsByPeriod: null,
      meta: null,
      loading: false,
      error: null,
    });
  });

  it('uses effectiveSeasonId for stats hooks', () => {
    renderWithProviders(
      <StatsLayout>
        <div data-testid="stats-content" />
      </StatsLayout>
    );

    expect(useSeasonStatsMock).toHaveBeenCalledWith({ seasonId: 180 });
    expect(useSeasonGoalsByPeriodMock).toHaveBeenCalledWith({ seasonId: 180 });
    expect(useSeasonStatsMock).not.toHaveBeenCalledWith({ seasonId: 61 });
    expect(screen.getByTestId('statistics-hero')).toBeInTheDocument();
  });
});
