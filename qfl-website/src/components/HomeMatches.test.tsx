import { describe, expect, it, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeMatches } from './HomeMatches';
import { Game } from '@/types';

const { useMatchCenterMock, useMatchesMock, useTournamentMock } = vi.hoisted(() => ({
  useMatchCenterMock: vi.fn(),
  useMatchesMock: vi.fn(),
  useTournamentMock: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: unknown) =>
      typeof defaultValue === 'string' ? defaultValue : key,
    i18n: { language: 'ru' },
  }),
}));

vi.mock('@/hooks', () => ({
  useMatchCenter: useMatchCenterMock,
  useMatches: useMatchesMock,
}));

vi.mock('@/contexts/TournamentContext', () => ({
  useTournament: useTournamentMock,
}));

vi.mock('@/components/navigation/TournamentAwareLink', () => ({
  TournamentAwareLink: ({ href, children, ...rest }: any) => (
    <a href={typeof href === 'string' ? href : '#'} {...rest}>
      {children}
    </a>
  ),
}));

function makeGame(id: number, homeName: string, awayName: string, date: string, time: string): Game {
  return {
    id,
    date,
    time,
    tour: 1,
    season_id: 200,
    home_score: null,
    away_score: null,
    home_team: { id: id * 2, name: homeName, logo_url: null },
    away_team: { id: id * 2 + 1, name: awayName, logo_url: null },
    stadium: null,
    has_stats: false,
    has_lineup: false,
    visitors: null,
    is_live: false,
    status: 'upcoming',
    ticket_url: null,
    video_url: null,
  };
}

describe('HomeMatches', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useTournamentMock.mockReturnValue({
      effectiveSeasonId: 200,
      currentRound: 2,
      currentTournament: { id: 'pl', totalRounds: null },
    });

    useMatchesMock.mockReturnValue({
      matches: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    useMatchCenterMock.mockReturnValue({
      groups: [
        {
          date: '2026-02-28',
          date_label: 'Суббота, 28 февраля 2026',
          games: [makeGame(5001, 'Кайрат', 'Тобол', '2026-02-28', '17:00:00')],
        },
        {
          date: '2026-03-07',
          date_label: 'Суббота, 7 марта 2026',
          games: [
            makeGame(5002, 'Окжетпес', 'Елимай', '2026-03-07', '14:00:00'),
            makeGame(5003, 'Ордабасы', 'Иртыш', '2026-03-07', '15:00:00'),
            makeGame(5004, 'Алтай', 'Кайрат', '2026-03-07', '16:00:00'),
            makeGame(5005, 'Актобе', 'Тобол', '2026-03-07', '17:00:00'),
          ],
        },
        {
          date: '2026-03-08',
          date_label: 'Воскресенье, 8 марта 2026',
          games: [
            makeGame(5006, 'Кызылжар', 'Каспий', '2026-03-08', '14:00:00'),
            makeGame(5007, 'Атырау', 'Улытау', '2026-03-08', '15:00:00'),
            makeGame(5008, 'Кайсар', 'Женис', '2026-03-08', '16:00:00'),
            makeGame(5009, 'Астана', 'Жетысу', '2026-03-08', '18:00:00'),
          ],
        },
      ],
      total: 9,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('uses pre-season query and renders Super Cup + all first-round matches without truncation', () => {
    render(<HomeMatches />);

    expect(useMatchesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      })
    );

    expect(useMatchCenterMock).toHaveBeenCalledWith(
      expect.objectContaining({
        season_id: 200,
        group_by_date: true,
        date_from: '2026-02-28',
        date_to: '2026-03-08',
        hide_past: false,
        limit: 40,
        enabled: true,
      })
    );

    expect(screen.getByText('Суббота, 28 февраля 2026')).toBeInTheDocument();
    expect(screen.getByText('Суббота, 7 марта 2026')).toBeInTheDocument();
    expect(screen.getByText('Воскресенье, 8 марта 2026')).toBeInTheDocument();

    const matchLinks = screen
      .getAllByRole('link')
      .filter((el) => /^\/matches\/\d+$/.test(el.getAttribute('href') ?? ''));

    expect(matchLinks).toHaveLength(9);
    expect(screen.queryByRole('link', { name: 'Календарь дат (PDF)' })).not.toBeInTheDocument();
  });

  it('keeps compact list for non pre-season tournaments', () => {
    useTournamentMock.mockReturnValue({
      effectiveSeasonId: 85,
      currentRound: null,
      currentTournament: { id: '1l', totalRounds: 30 },
    });

    useMatchesMock.mockReturnValue({
      matches: [
        makeGame(6001, 'Тeam 1', 'Тeam 2', '2026-03-10', '12:00:00'),
        makeGame(6002, 'Тeam 3', 'Тeam 4', '2026-03-10', '13:00:00'),
        makeGame(6003, 'Тeam 5', 'Тeam 6', '2026-03-10', '14:00:00'),
        makeGame(6004, 'Тeam 7', 'Тeam 8', '2026-03-10', '15:00:00'),
        makeGame(6005, 'Тeam 9', 'Тeam 10', '2026-03-10', '16:00:00'),
        makeGame(6006, 'Тeam 11', 'Тeam 12', '2026-03-11', '12:00:00'),
        makeGame(6007, 'Тeam 13', 'Тeam 14', '2026-03-11', '13:00:00'),
        makeGame(6008, 'Тeam 15', 'Тeam 16', '2026-03-11', '14:00:00'),
        makeGame(6009, 'Тeam 17', 'Тeam 18', '2026-03-11', '15:00:00'),
      ],
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<HomeMatches />);

    expect(useMatchesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        seasonId: 85,
        tour: 30,
        enabled: true,
      })
    );

    expect(useMatchCenterMock).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      })
    );

    const matchLinks = screen
      .getAllByRole('link')
      .filter((el) => /^\/matches\/\d+$/.test(el.getAttribute('href') ?? ''));

    expect(matchLinks).toHaveLength(8);
    expect(screen.queryByRole('link', { name: 'Календарь дат (PDF)' })).not.toBeInTheDocument();
  });
});
