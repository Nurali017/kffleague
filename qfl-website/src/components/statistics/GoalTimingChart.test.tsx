import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { GoalTimingChart } from './GoalTimingChart';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      if (!options?.defaultValue || typeof options.defaultValue !== 'string') {
        return key;
      }

      return options.defaultValue.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
        const value = options[name];
        return value === undefined || value === null ? '' : String(value);
      });
    },
  }),
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div data-testid="responsive">{children}</div>,
  BarChart: ({ children }: { children: ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  CartesianGrid: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  Bar: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Cell: () => <div />,
}));

describe('GoalTimingChart', () => {
  it('shows coverage badge when metadata is provided', () => {
    render(
      <GoalTimingChart
        data={[
          { period: '0-15', goals: 2, home: 1, away: 1 },
          { period: '16-30', goals: 1, home: 1, away: 0 },
        ]}
        meta={{
          matches_played: 10,
          matches_with_goal_events: 7,
          coverage_pct: 70,
        }}
      />
    );

    expect(screen.getByText('Coverage: 70% (7/10)')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('does not show coverage badge when metadata is missing', () => {
    render(<GoalTimingChart data={[{ period: '0-15', goals: 2, home: 1, away: 1 }]} />);

    expect(screen.queryByText(/Coverage:/)).not.toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});
