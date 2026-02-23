import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SuperCupHero } from './SuperCupHero';

const { useMatchCenterMock, useTournamentMock } = vi.hoisted(() => ({
  useMatchCenterMock: vi.fn(),
  useTournamentMock: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue ?? key,
    i18n: { language: 'ru' },
  }),
}));

vi.mock('@/hooks', () => ({
  useMatchCenter: useMatchCenterMock,
}));

vi.mock('@/contexts/TournamentContext', () => ({
  useTournament: useTournamentMock,
}));

vi.mock('@/components/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-fallback">hero fallback</div>,
}));

vi.mock('@/components/navigation/TournamentAwareLink', () => ({
  TournamentAwareLink: ({ href, children, ...rest }: any) => (
    <a href={typeof href === 'string' ? href : '#'} {...rest}>
      {children}
    </a>
  ),
}));

function baseMatchCenterResponse(ticketUrl: string | null) {
  return {
    groups: [
      {
        date: '2026-02-28',
        date_label: 'Суббота, 28 февраля',
        games: [
          {
            id: 5010,
            date: '2026-02-28',
            time: '17:00:00',
            tour: null,
            season_id: 200,
            home_score: null,
            away_score: null,
            home_team: { id: 13, name: 'Кайрат', logo_url: null },
            away_team: { id: 90, name: 'Тобыл', logo_url: null },
            stadium: { id: 10, name: 'СК «Астана Арена»', city: 'Астана', capacity: null },
            has_stats: false,
            has_lineup: false,
            visitors: null,
            is_live: false,
            status: 'upcoming',
            ticket_url: ticketUrl,
            video_url: null,
          },
        ],
      },
    ],
    total: 1,
    loading: false,
    error: null,
    refetch: vi.fn(),
  };
}

describe('SuperCupHero', () => {
  beforeEach(() => {
    // Set fake time to 2 days before the match
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-26T12:00:00+05:00'));

    useTournamentMock.mockReturnValue({ effectiveSeasonId: 200 });
    useMatchCenterMock.mockReturnValue(baseMatchCenterResponse('https://afisha.yandex.kz/astana/sport/football-kairat-tobyl'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders Super Cup match hero when fixture is found', () => {
    render(<SuperCupHero />);

    expect(screen.getByText('The Super Cup')).toBeInTheDocument();
    expect(screen.getAllByText('Кайрат').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Тобыл').length).toBeGreaterThan(0);
    expect(screen.getByText('17:00')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Купить билет' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Открыть матч/ })).toHaveAttribute('href', '/matches/5010');
  });

  it('renders countdown timer with correct values', () => {
    render(<SuperCupHero />);

    // 2 days + 5 hours remaining (Feb 26 12:00 → Feb 28 17:00)
    expect(screen.getByText('02')).toBeInTheDocument(); // days
    expect(screen.getByText('05')).toBeInTheDocument(); // hours
    // minutes and seconds are both '00'
    expect(screen.getAllByText('00').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('До начала матча')).toBeInTheDocument();
  });

  it('hides countdown when match has started', () => {
    // Set time after kickoff
    vi.setSystemTime(new Date('2026-02-28T18:00:00+05:00'));

    render(<SuperCupHero />);

    expect(screen.queryByText('До начала матча')).not.toBeInTheDocument();
  });

  it('falls back to news hero when no match found', () => {
    useMatchCenterMock.mockReturnValue({
      groups: [],
      total: 0,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SuperCupHero />);

    expect(screen.getByTestId('hero-fallback')).toBeInTheDocument();
  });

  it('hides ticket button when ticket_url is missing', () => {
    useMatchCenterMock.mockReturnValue(baseMatchCenterResponse(null));

    render(<SuperCupHero />);

    expect(screen.queryByRole('link', { name: 'Купить билет' })).not.toBeInTheDocument();
  });
});
