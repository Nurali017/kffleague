import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test/utils';
import { MatchCenterFilters } from './MatchCenterFilters';

vi.mock('swr', async () => {
  const actual = await vi.importActual<typeof import('swr')>('swr');
  return {
    ...actual,
    default: () => ({
      data: [
        {
          id: 91,
          name: 'Astana',
          logo_url: null,
        },
      ],
    }),
  };
});

vi.mock('@/contexts/TournamentContext', () => ({
  useTournament: () => ({
    currentTournament: {
      id: 'pl',
      finalStageIds: [],
    },
    effectiveSeasonId: 61,
  }),
}));

describe('MatchCenterFilters', () => {
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
});
