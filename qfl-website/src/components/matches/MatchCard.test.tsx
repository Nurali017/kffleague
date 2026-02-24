import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { MatchCard } from './MatchCard';
import { Game } from '@/types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict: Record<string, string> = {
        tour: 'Тур',
        live: 'LIVE',
        'scheduleNotice.perMatch': 'Дата и время этого матча могут корректироваться. Окончательное время подтверждается за месяц до начала.',
      };
      return dict[key] ?? key;
    },
  }),
}));

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock('@/components/navigation/TournamentAwareLink', () => ({
  TournamentAwareLink: ({ href, children, ...rest }: any) => (
    <a href={typeof href === 'string' ? href : '#'} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('@/lib/utils/teamLogos', () => ({
  getTeamLogo: () => null,
  HOME_COLOR: '#0057B8',
  AWAY_COLOR: '#FFD700',
}));

const baseMatch: Game = {
  id: 1001,
  date: '2026-09-17',
  time: null,
  tour: 27,
  season_id: 200,
  home_score: null,
  away_score: null,
  home_team: { id: 13, name: 'Қайрат', logo_url: null },
  away_team: { id: 90, name: 'Тобыл', logo_url: null },
  stadium: { id: 10, name: 'Астана Арена', city: 'Астана', capacity: null },
  has_stats: false,
  has_lineup: false,
  visitors: null,
  is_live: false,
  is_technical: false,
  is_schedule_tentative: true,
  status: 'upcoming',
  ticket_url: null,
  video_url: null,
  protocol_url: null,
};

describe('MatchCard schedule disclaimer', () => {
  it('shows disclaimer when enabled and match is tentative', () => {
    render(<MatchCard match={baseMatch} showScheduleDisclaimer />);

    expect(
      screen.getByText('Дата и время этого матча могут корректироваться. Окончательное время подтверждается за месяц до начала.')
    ).toBeInTheDocument();
  });

  it('hides disclaimer when showScheduleDisclaimer is false', () => {
    render(<MatchCard match={baseMatch} />);

    expect(
      screen.queryByText('Дата и время этого матча могут корректироваться. Окончательное время подтверждается за месяц до начала.')
    ).not.toBeInTheDocument();
  });

  it('hides disclaimer when match is not tentative', () => {
    render(
      <MatchCard
        match={{ ...baseMatch, is_schedule_tentative: false }}
        showScheduleDisclaimer
      />
    );

    expect(
      screen.queryByText('Дата и время этого матча могут корректироваться. Окончательное время подтверждается за месяц до начала.')
    ).not.toBeInTheDocument();
  });
});
