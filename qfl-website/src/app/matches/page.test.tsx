import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import MatchesPage from './page';

const { useTournamentMock } = vi.hoisted(() => ({
  useTournamentMock: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict: Record<string, string> = {
        title: 'Матчи',
        'scheduleNotice.global': 'Календарь носит предварительный характер и может корректироваться по ходу сезона.',
      };
      return dict[key] ?? key;
    },
  }),
}));

vi.mock('@/contexts/TournamentContext', () => ({
  useTournament: () => useTournamentMock(),
}));

vi.mock('@/components/MatchCenter', () => ({
  MatchCenter: () => <div data-testid="match-center" />,
}));

vi.mock('@/components/ui/SeasonYearSelector', () => ({
  SeasonYearSelector: () => <div data-testid="season-year-selector" />,
}));

describe('MatchesPage schedule notice', () => {
  beforeEach(() => {
    useTournamentMock.mockReset();
  });

  it('shows global schedule notice for season 200', () => {
    useTournamentMock.mockReturnValue({ effectiveSeasonId: 200 });

    render(<MatchesPage />);

    expect(
      screen.getByText('Календарь носит предварительный характер и может корректироваться по ходу сезона.')
    ).toBeInTheDocument();
    expect(screen.getByTestId('match-center')).toBeInTheDocument();
  });

  it('hides global schedule notice for non-2026 seasons', () => {
    useTournamentMock.mockReturnValue({ effectiveSeasonId: 61 });

    render(<MatchesPage />);

    expect(
      screen.queryByText('Календарь носит предварительный характер и может корректироваться по ходу сезона.')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('match-center')).toBeInTheDocument();
  });
});
