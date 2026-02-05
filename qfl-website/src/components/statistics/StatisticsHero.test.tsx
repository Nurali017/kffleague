import { render, screen } from '@testing-library/react';
import type { HTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { StatisticsHero } from './StatisticsHero';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, options?: Record<string, unknown>) => {
      if (!options?.defaultValue || typeof options.defaultValue !== 'string') {
        return _key;
      }

      return options.defaultValue.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
        const value = options[name];
        return value === undefined || value === null ? '' : String(value);
      });
    },
  }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}));

vi.mock('@/components/ui/HeroBackground', () => ({
  HeroBackground: () => <div data-testid="hero-bg" />,
}));

vi.mock('./GoalTimingChart', () => ({
  GoalTimingChart: () => <div data-testid="goal-timing-chart" />,
}));

const baseStats = {
  seasonName: 'Test Season',
  totalGoals: 120,
  goalsPerMatch: 2.4,
  minutesPerGoal: 38,
  totalMatches: 50,
};

describe('StatisticsHero', () => {
  it('renders chart when period data exists and coverage is above zero', () => {
    render(
      <StatisticsHero
        stats={baseStats}
        goalsByPeriod={[
          { period: '0-15', goals: 2, home: 1, away: 1 },
          { period: '16-30', goals: 1, home: 1, away: 0 },
        ]}
        goalsByPeriodMeta={{
          matches_played: 10,
          matches_with_goal_events: 7,
          coverage_pct: 70,
        }}
      />
    );

    expect(screen.getByTestId('goal-timing-chart')).toBeInTheDocument();
    expect(screen.queryByText('Данные по таймингу голов пока недоступны.')).not.toBeInTheDocument();
  });

  it('renders no-data fallback when coverage is zero', () => {
    render(
      <StatisticsHero
        stats={baseStats}
        goalsByPeriod={[{ period: '0-15', goals: 2, home: 1, away: 1 }]}
        goalsByPeriodMeta={{
          matches_played: 10,
          matches_with_goal_events: 0,
          coverage_pct: 0,
        }}
      />
    );

    expect(screen.queryByTestId('goal-timing-chart')).not.toBeInTheDocument();
    expect(screen.getByText('Данные по таймингу голов пока недоступны.')).toBeInTheDocument();
  });
});
