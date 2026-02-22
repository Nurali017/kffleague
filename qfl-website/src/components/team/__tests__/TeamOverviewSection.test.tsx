import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import { TeamOverviewSection } from '../TeamOverviewSection';
import { TeamOverviewLeaders } from '@/types/team';

const leadersMock: TeamOverviewLeaders = {
  top_scorer: {
    player_id: 1,
    first_name: 'Дастан',
    last_name: 'Сатпаев',
    photo_url: null,
    team_id: 13,
    team_name: 'Кайрат',
    team_logo: null,
    position: 'CF',
    games_played: 12,
    goals: 8,
    assists: 2,
    passes: 120,
    save_shot: 0,
    dry_match: 0,
    red_cards: 1,
  },
  top_assister: {
    player_id: 2,
    first_name: 'Гиорги',
    last_name: 'Зария',
    photo_url: null,
    team_id: 13,
    team_name: 'Кайрат',
    team_logo: null,
    position: 'CM',
    games_played: 12,
    goals: 2,
    assists: 7,
    passes: 320,
    save_shot: 0,
    dry_match: 0,
    red_cards: 0,
  },
  goals_table: [],
  assists_table: [],
  mini_leaders: {
    passes: null,
    appearances: null,
    saves: null,
    clean_sheets: null,
    red_cards: null,
  },
};

describe('TeamOverviewSection', () => {
  it('renders core overview content', () => {
    renderWithProviders(
      <TeamOverviewSection
        recentMatch={{
          id: 1,
          date: '2026-02-05',
          time: '18:00:00',
          tour: 12,
          status: 'finished',
          home_score: 2,
          away_score: 1,
          has_stats: true,
          has_lineup: true,
          home_team: { id: 13, name: 'Кайрат', logo_url: null },
          away_team: { id: 90, name: 'Тобол', logo_url: null },
          stadium: null,
        }}
        formLast5={[
          {
            game_id: 1,
            is_home: true,
            opponent_name: 'Тобол',
            opponent_logo: null,
            team_score: 2,
            opponent_score: 1,
            result: 'W',
          },
        ]}
        upcomingMatches={[
          {
            id: 2,
            date: '2026-02-09',
            time: '16:00:00',
            tour: 13,
            status: 'upcoming',
            home_score: null,
            away_score: null,
            has_stats: false,
            has_lineup: false,
            home_team: { id: 13, name: 'Кайрат', logo_url: null },
            away_team: { id: 91, name: 'Астана', logo_url: null },
            stadium: null,
          },
        ]}
        standingsWindow={[
          {
            position: 1,
            team_id: 13,
            team_name: 'Кайрат',
            team_logo: null,
            games_played: 12,
            points: 26,
            goal_difference: 12,
            goals_scored: 23,
            goals_conceded: 11,
          },
        ]}
        leaders={leadersMock}
      />
    );

    expect(screen.getAllByText('Кайрат').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Тобол').length).toBeGreaterThan(0);
  });

  it('shows empty states when no match/fixtures', () => {
    renderWithProviders(
      <TeamOverviewSection
        recentMatch={null}
        formLast5={[]}
        upcomingMatches={[]}
        standingsWindow={[]}
        leaders={leadersMock}
      />
    );

    expect(screen.getAllByText(/Нет сыгранных матчей/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Нет предстоящих матчей/i)).toBeInTheDocument();
  });
});
