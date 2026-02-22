import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SecondLeagueHome } from './SecondLeagueHome';
import type { Game, GroupedMatchesResponse, TeamStanding } from '@/types';

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

function createStanding(teamId: number, teamName: string, position: number): TeamStanding {
  return {
    position,
    team_id: teamId,
    team_name: teamName,
    team_logo: null as unknown as string,
    games_played: 10,
    wins: 6,
    draws: 2,
    losses: 2,
    goals_scored: 18,
    goals_conceded: 9,
    goal_difference: 9,
    points: 20,
  };
}

function createMatch(id: number): Game {
  return {
    id,
    date: '2025-08-10',
    time: '18:00',
    tour: 1,
    season_id: 80,
    home_score: 1,
    away_score: 0,
    home_team: { id: id + 1, name: `Home ${id}`, logo_url: null },
    away_team: { id: id + 2, name: `Away ${id}`, logo_url: null },
    stadium: null,
    has_stats: false,
    has_lineup: false,
    visitors: null,
    is_live: false,
    status: 'finished',
    ticket_url: null,
    video_url: null,
  };
}

function createGroupedMatches(matches: Game[]): GroupedMatchesResponse {
  return {
    groups: [
      {
        date: '2025-08-10',
        date_label: '10 августа',
        games: matches,
      },
    ],
    total: matches.length,
  };
}

describe('SecondLeagueHome', () => {
  const groupAStandings = [createStanding(1, 'A Team', 1)];
  const groupBStandings = [createStanding(2, 'B Team', 1)];
  const groupAMatches = createGroupedMatches([createMatch(101)]);
  const groupBMatches = createGroupedMatches([createMatch(201)]);

  it('renders both league sections and final section when final matches exist', () => {
    const finalMatches = createGroupedMatches([createMatch(301)]);

    render(
      <SecondLeagueHome
        groupAStandings={groupAStandings}
        groupBStandings={groupBStandings}
        groupAMatches={groupAMatches}
        groupBMatches={groupBMatches}
        finalMatches={finalMatches}
      />
    );

    expect(screen.getByTestId('second-league-group-a')).toBeInTheDocument();
    expect(screen.getByTestId('second-league-group-b')).toBeInTheDocument();
    expect(screen.getByTestId('second-league-final')).toBeInTheDocument();
  });

  it('hides final section when no final matches are available', () => {
    const finalMatches: GroupedMatchesResponse = { groups: [], total: 0 };

    render(
      <SecondLeagueHome
        groupAStandings={groupAStandings}
        groupBStandings={groupBStandings}
        groupAMatches={groupAMatches}
        groupBMatches={groupBMatches}
        finalMatches={finalMatches}
      />
    );

    expect(screen.getByTestId('second-league-group-a')).toBeInTheDocument();
    expect(screen.getByTestId('second-league-group-b')).toBeInTheDocument();
    expect(screen.queryByTestId('second-league-final')).not.toBeInTheDocument();
  });
});

