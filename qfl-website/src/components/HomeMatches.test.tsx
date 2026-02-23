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
    t: (key: string, defaultValue?: string) => defaultValue ?? key,
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
    useTournamentMock.mockReturnValue({
      effectiveSeasonId: 200,
      currentRound: 2,
      currentTournament: { id: 'pl' },
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
  });
});
