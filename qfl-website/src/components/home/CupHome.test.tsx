import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CupHome } from './CupHome';
import type { CupOverviewResponse, CupScheduleResponse } from '@/types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      if (typeof options?.defaultValue === 'string') {
        return options.defaultValue;
      }
      return key;
    },
  }),
}));

vi.mock('@/components/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section" />,
}));

vi.mock('@/components/NewsSection', () => ({
  NewsFeatured: () => <div data-testid="news-featured" />,
  NewsSideCards: () => <div data-testid="news-side-cards" />,
}));

vi.mock('@/components/cup', () => ({
  CupSchedule: ({ schedule }: { schedule: CupScheduleResponse }) => (
    <div data-testid="cup-schedule-component">
      {schedule.rounds.map((round) => round.round_key).join(',')}
    </div>
  ),
}));

function createOverview(withGroups: boolean): CupOverviewResponse {
  return {
    season_id: 71,
    championship_name: 'Cup',
    groups: withGroups
      ? [{
          group_name: 'A',
          standings: [{
            position: 1,
            team_id: 1,
            team_name: 'Team 1',
            games_played: 3,
            wins: 2,
            draws: 1,
            losses: 0,
            goals_scored: 4,
            goals_conceded: 1,
            goal_difference: 3,
            points: 7,
          }],
        }]
      : [],
    bracket: { season_id: 71, rounds: [] },
    recent_results: [],
    upcoming_games: [],
    rounds: [],
  };
}

function createSchedule(withRounds: boolean): CupScheduleResponse {
  return {
    season_id: 71,
    total_games: withRounds ? 1 : 0,
    rounds: withRounds
      ? [{
          stage_id: 11,
          round_name: '1/4 финала',
          round_key: '1_4',
          is_current: true,
          total_games: 1,
          played_games: 0,
          games: [],
        }]
      : [],
  };
}

describe('CupHome', () => {
  it('shows playoff rounds section when schedule rounds are present', () => {
    render(
      <CupHome
        overview={createOverview(true)}
        schedule={createSchedule(true)}
      />
    );

    expect(screen.getByTestId('cup-home-playoff-rounds')).toBeInTheDocument();
    expect(screen.getByTestId('cup-schedule-component')).toBeInTheDocument();
  });

  it('shows empty playoff rounds state when rounds are missing', () => {
    render(
      <CupHome
        overview={createOverview(false)}
        schedule={createSchedule(false)}
      />
    );

    expect(screen.getByTestId('cup-home-playoff-rounds')).toBeInTheDocument();
    expect(screen.queryByTestId('cup-schedule-component')).not.toBeInTheDocument();
  });

  it('renders final round when schedule contains final stage', () => {
    const scheduleWithFinal: CupScheduleResponse = {
      season_id: 71,
      total_games: 1,
      rounds: [{
        stage_id: 33,
        round_name: 'Финал',
        round_key: 'final',
        is_current: true,
        total_games: 1,
        played_games: 0,
        games: [],
      }],
    };

    render(
      <CupHome
        overview={createOverview(true)}
        schedule={scheduleWithFinal}
      />
    );

    expect(screen.getByTestId('cup-schedule-component')).toHaveTextContent('final');
  });
});
