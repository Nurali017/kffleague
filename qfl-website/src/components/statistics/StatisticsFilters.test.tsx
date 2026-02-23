import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { StatisticsFilters } from './StatisticsFilters';

describe('StatisticsFilters', () => {
  it('does not render container in clubs mode', () => {
    const { container } = renderWithProviders(<StatisticsFilters mode="clubs" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders controls in players mode', () => {
    renderWithProviders(
      <StatisticsFilters
        mode="players"
        selectedClub="all"
        onClubChange={() => {}}
        selectedNationality="all"
        onNationalityChange={() => {}}
      />
    );

    expect(screen.getByTestId('statistics-filters')).toBeInTheDocument();
    expect(screen.queryByText(/позиц/i)).not.toBeInTheDocument();
  });
});
