import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LeaguePerformanceChart } from './LeaguePerformanceChart';

const {
  useLeaguePerformanceMock,
  useTeamsMock,
  usePreSeasonEffectiveIdMock,
} = vi.hoisted(() => ({
  useLeaguePerformanceMock: vi.fn(),
  useTeamsMock: vi.fn(),
  usePreSeasonEffectiveIdMock: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      if (!options?.defaultValue || typeof options.defaultValue !== 'string') {
        return key;
      }
      return options.defaultValue;
    },
  }),
}));

vi.mock('@/hooks/useLeaguePerformance', () => ({
  useLeaguePerformance: (...args: unknown[]) => useLeaguePerformanceMock(...args),
}));

vi.mock('@/hooks', () => ({
  useTeams: (...args: unknown[]) => useTeamsMock(...args),
}));

vi.mock('@/contexts/TournamentContext', () => ({
  usePreSeasonEffectiveId: (...args: unknown[]) => usePreSeasonEffectiveIdMock(...args),
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div data-testid="responsive">{children}</div>,
  LineChart: ({ children }: { children: ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}));

describe('LeaguePerformanceChart mobile UX', () => {
  beforeEach(() => {
    usePreSeasonEffectiveIdMock.mockReset();
    useLeaguePerformanceMock.mockReset();
    useTeamsMock.mockReset();

    usePreSeasonEffectiveIdMock.mockReturnValue(200);
    useTeamsMock.mockReturnValue({
      teams: [
        { id: 1, name: 'Кайрат', logo_url: '/kairat.png' },
        { id: 2, name: 'Астана', logo_url: '/astana.png' },
        { id: 3, name: 'Ордабасы', logo_url: '/ordabasy.png' },
      ],
    });
    useLeaguePerformanceMock.mockReturnValue({
      data: {
        season_id: 200,
        max_tour: 5,
        teams: [
          { team_id: 1, team_name: 'Кайрат', team_logo: '/kairat.png', positions: [1, 1, 1, 2, 1] },
          { team_id: 2, team_name: 'Астана', team_logo: '/astana.png', positions: [2, 2, 2, 1, 2] },
          { team_id: 3, team_name: 'Ордабасы', team_logo: '/ordabasy.png', positions: [3, 3, 3, 3, 3] },
        ],
      },
      loading: false,
      error: null,
    });
  });

  it('renders mobile selectors, legend and chart scroll hint', () => {
    render(<LeaguePerformanceChart />);

    expect(screen.getByTestId('league-team-selector-scroller')).toBeInTheDocument();
    expect(screen.getByTestId('league-legend-scroller')).toBeInTheDocument();
    expect(screen.getByTestId('league-chart-scroll-hint')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('shows and hides reset button when teams are selected and reset', () => {
    render(<LeaguePerformanceChart />);

    expect(screen.queryByText('Сброс')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Кайрат/i }));
    expect(screen.getByText('Сброс')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Сброс'));
    expect(screen.queryByText('Сброс')).not.toBeInTheDocument();
  });
});
