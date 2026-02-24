import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { GameTeam } from '@/types';
import {
  H2HFormGuide,
  H2HOverallRecord,
  H2HPreviousMeetings,
  H2HSeasonSoFar,
} from './index';

const { getTeamLogoMock } = vi.hoisted(() => ({
  getTeamLogoMock: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: unknown) =>
      typeof defaultValue === 'string' ? defaultValue : key,
    i18n: { language: 'ru' },
  }),
}));

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => true,
}));

vi.mock('@/components/navigation/TournamentAwareLink', () => ({
  TournamentAwareLink: ({ href, children, ...rest }: any) => (
    <a href={typeof href === 'string' ? href : '#'} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('@/lib/utils/entityRoutes', () => ({
  getMatchHref: (matchId: number) => `/matches/${matchId}`,
}));

vi.mock('@/lib/utils/teamLogos', () => ({
  getTeamLogo: (...args: unknown[]) => getTeamLogoMock(...args),
  getTeamInitials: (name: string) => name.slice(0, 3).toUpperCase(),
}));

const homeTeam: GameTeam = {
  id: 13,
  name: 'Қайрат',
  logo_url: '/api/v1/files/teams/kairat/logo',
};

const awayTeam: GameTeam = {
  id: 90,
  name: 'Тобол',
  logo_url: '/api/v1/files/teams/tobol/logo',
};

const overall = {
  total_matches: 3,
  team1_wins: 1,
  draws: 1,
  team2_wins: 1,
  team1_goals: 4,
  team2_goals: 4,
  team1_home_wins: 1,
  team1_away_wins: 0,
  team2_home_wins: 0,
  team2_away_wins: 1,
};

const formGuide = {
  team1: {
    team_id: 13,
    team_name: 'Қайрат',
    matches: [
      {
        game_id: 7001,
        date: '2026-01-20',
        result: 'W' as const,
        opponent_id: 90,
        opponent_name: 'Тобол',
        opponent_logo_url: '/api/v1/files/teams/tobol/logo',
        home_score: 2,
        away_score: 0,
        was_home: true,
      },
    ],
  },
  team2: {
    team_id: 90,
    team_name: 'Тобол',
    matches: [
      {
        game_id: 7001,
        date: '2026-01-20',
        result: 'L' as const,
        opponent_id: 13,
        opponent_name: 'Қайрат',
        opponent_logo_url: '/api/v1/files/teams/kairat/logo',
        home_score: 2,
        away_score: 0,
        was_home: false,
      },
    ],
  },
};

const seasonTable = [
  {
    position: 1,
    team_id: 13,
    team_name: 'Қайрат',
    logo_url: '/api/v1/files/teams/kairat/logo',
    games_played: 1,
    wins: 1,
    draws: 0,
    losses: 0,
    goals_scored: 2,
    goals_conceded: 0,
    goal_difference: 2,
    points: 3,
    clean_sheets: 1,
  },
  {
    position: 2,
    team_id: 90,
    team_name: 'Тобол',
    logo_url: '/api/v1/files/teams/tobol/logo',
    games_played: 1,
    wins: 0,
    draws: 0,
    losses: 1,
    goals_scored: 0,
    goals_conceded: 2,
    goal_difference: -2,
    points: 0,
    clean_sheets: 0,
  },
];

const previousMeetings = [
  {
    game_id: 7001,
    date: '2026-01-20',
    home_team_id: 13,
    home_team_name: 'Қайрат',
    away_team_id: 90,
    away_team_name: 'Тобол',
    home_score: 2,
    away_score: 0,
    tour: 1,
    season_name: '2026',
    home_team_logo: '/api/v1/files/teams/kairat/logo',
    away_team_logo: '/api/v1/files/teams/tobol/logo',
  },
];

describe('H2H logo behavior', () => {
  beforeEach(() => {
    getTeamLogoMock.mockReset();
  });

  it('does not render "Дома" and "В гостях" labels in overall record', () => {
    const { container } = render(
      <H2HOverallRecord
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        overall={overall}
        homeColor="#ef4444"
        awayColor="#16a34a"
      />
    );

    expect(screen.queryByText('Дома')).not.toBeInTheDocument();
    expect(screen.queryByText('В гостях')).not.toBeInTheDocument();
    expect(container.querySelector('.h-5.rounded-full.overflow-hidden')).toBeNull();
  });

  it('does not call getTeamLogo in H2H components and relies on API logo_url', () => {
    render(
      <>
        <H2HOverallRecord
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          overall={overall}
          homeColor="#ef4444"
          awayColor="#16a34a"
        />
        <H2HFormGuide
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          formGuide={formGuide}
          homeColor="#ef4444"
          awayColor="#16a34a"
        />
        <H2HSeasonSoFar
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          seasonTable={seasonTable}
          funFacts={null}
          enhancedStats={null}
          homeColor="#ef4444"
          awayColor="#16a34a"
        />
        <H2HPreviousMeetings
          meetings={previousMeetings}
          homeTeamId={homeTeam.id}
          awayTeamId={awayTeam.id}
          homeColor="#ef4444"
          awayColor="#16a34a"
        />
      </>
    );

    expect(getTeamLogoMock).not.toHaveBeenCalled();
    expect(screen.getAllByAltText('Қайрат').length).toBeGreaterThan(0);
    expect(screen.getAllByAltText('Тобол').length).toBeGreaterThan(0);
  });
});
