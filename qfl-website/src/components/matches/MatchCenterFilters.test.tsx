import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from '@/test/utils';
import { MatchCenterFilters } from './MatchCenterFilters';

const { useSWRMock, tournamentContextMock } = vi.hoisted(() => ({
  useSWRMock: vi.fn(),
  tournamentContextMock: {
    currentTournament: {
      id: 'pl',
      finalStageIds: [],
      totalRounds: 30 as number | null,
    },
    effectiveSeasonId: 61,
  },
}));

vi.mock('swr', async (importOriginal) => {
  const actual = await importOriginal<typeof import('swr')>();
  return {
    ...actual,
    default: useSWRMock,
  };
});

vi.mock('@/contexts/TournamentContext', () => ({
  useTournament: () => tournamentContextMock,
}));

describe('MatchCenterFilters', () => {
  beforeEach(() => {
    tournamentContextMock.currentTournament.totalRounds = 30;
    useSWRMock.mockImplementation((key: unknown) => {
      const requestKey = Array.isArray(key) ? key[0] : key;

      if (requestKey === 'teams-list') {
        return {
          data: [
            {
              id: 91,
              name: 'Astana',
              logo_url: null,
            },
          ],
        };
      }

      if (requestKey === 'season-stages') {
        return {
          data: {
            items: [
              { id: 1, season_id: 61, name: 'Тур 2', stage_number: 2, sort_order: 2 },
              { id: 2, season_id: 61, name: 'Тур 30', stage_number: null, sort_order: 30 },
              { id: 3, season_id: 61, name: 'Тур 1', stage_number: 1, sort_order: 1 },
              { id: 4, season_id: 61, name: 'Тур 2 дубль', stage_number: 2, sort_order: 10 },
            ],
            total: 4,
          },
        };
      }

      return { data: undefined };
    });
  });

  it('uses single-select controls for month and status and maps values to filters', () => {
    const onFilterChange = vi.fn();

    renderWithProviders(
      <MatchCenterFilters
        filters={{}}
        onFilterChange={onFilterChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Все месяцы' }));
    const mayInput = screen.getByLabelText('Май');
    expect(mayInput).toHaveAttribute('type', 'radio');
    fireEvent.click(mayInput);

    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ month: 5 })
    );

    fireEvent.click(screen.getByRole('button', { name: 'Все матчи' }));
    const liveInput = screen.getByLabelText('В прямом эфире');
    expect(liveInput).toHaveAttribute('type', 'radio');
    fireEvent.click(liveInput);

    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'live' })
    );
  });

  it('builds tour options dynamically from stages and includes tour 30', () => {
    const onFilterChange = vi.fn();

    renderWithProviders(
      <MatchCenterFilters
        filters={{}}
        onFilterChange={onFilterChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Все туры' }));

    const tourThirty = screen.getByLabelText('Тур 30');
    expect(tourThirty).toHaveAttribute('type', 'checkbox');
    expect(screen.getByLabelText('Тур 1')).toBeInTheDocument();
    expect(screen.getAllByText('Тур 2')).toHaveLength(1);

    fireEvent.click(tourThirty);

    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ tours: [30] })
    );
  });

  it('falls back to selected tours when stages and total rounds are unavailable', () => {
    tournamentContextMock.currentTournament.totalRounds = null;
    useSWRMock.mockImplementation((key: unknown) => {
      const requestKey = Array.isArray(key) ? key[0] : key;
      if (requestKey === 'teams-list') {
        return { data: [] };
      }
      if (requestKey === 'season-stages') {
        return { data: { items: [], total: 0 } };
      }
      return { data: undefined };
    });

    renderWithProviders(
      <MatchCenterFilters
        filters={{ tours: [27] }}
        onFilterChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Тур 27' }));
    expect(screen.getByLabelText('Тур 27')).toBeInTheDocument();
  });

  it('uses readable text classes on mobile show-filters button in dark mode', () => {
    renderWithProviders(
      <MatchCenterFilters
        filters={{}}
        onFilterChange={vi.fn()}
      />
    );

    const showFiltersButton = screen.getByRole('button', { name: 'Показать фильтры' });
    expect(showFiltersButton).toHaveClass('text-gray-900');
    expect(showFiltersButton).toHaveClass('dark:text-slate-100');
  });
});
