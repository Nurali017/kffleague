import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { renderWithProviders, screen } from '@/test/utils';
import { FeaturedStatBlock } from './FeaturedStatBlock';

vi.mock('@/components/navigation/TournamentAwareLink', () => ({
  TournamentAwareLink: ({
    children,
  }: {
    children: ReactNode;
  }) => <>{children}</>,
}));

function buildRankings(count: number) {
  return Array.from({ length: count }).map((_, index) => ({
    rank: index + 2,
    name: `Player ${index + 2}`,
    imageUrl: null,
    teamName: `Team ${index + 2}`,
    teamLogoUrl: null,
    value: index + 10,
    href: `/players/${index + 2}`,
  }));
}

const baseProps = {
  title: 'Goals',
  featured: {
    photoUrl: null,
    name: 'Leader',
    teamName: 'Top Team',
    teamLogoUrl: null,
    mainStat: { label: 'Goals', value: 30 },
    circles: [{ value: 50, label: 'Accuracy' }],
  },
  entityLabel: 'Игрок',
  valueLabel: 'Всего',
  viewFullTableHref: '/stats/players',
};

describe('FeaturedStatBlock mobile ranking slider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders one mobile slide and one dot per ranking entry', () => {
    renderWithProviders(<FeaturedStatBlock {...baseProps} rankings={buildRankings(4)} />);

    expect(screen.getAllByTestId('featured-mobile-ranking-slide')).toHaveLength(4);
    expect(screen.getAllByRole('button', { name: /Go to ranking slide/i })).toHaveLength(4);
  });

  it('updates active dot on slider scroll', async () => {
    renderWithProviders(<FeaturedStatBlock {...baseProps} rankings={buildRankings(3)} />);

    const slider = screen.getByTestId('featured-mobile-rankings-slider');
    Object.defineProperty(slider, 'clientWidth', { configurable: true, value: 200 });
    Object.defineProperty(slider, 'scrollLeft', { configurable: true, writable: true, value: 0 });

    slider.scrollLeft = 400;
    fireEvent.scroll(slider);

    await waitFor(() => {
      expect(screen.getByTestId('featured-mobile-ranking-dot-2')).toHaveClass('w-5');
    });
  });

  it('updates active dot on dot click', () => {
    renderWithProviders(<FeaturedStatBlock {...baseProps} rankings={buildRankings(3)} />);

    const slider = screen.getByTestId('featured-mobile-rankings-slider');
    const scrollToMock = vi.fn();
    Object.defineProperty(slider, 'clientWidth', { configurable: true, value: 240 });
    Object.defineProperty(slider, 'scrollTo', { configurable: true, value: scrollToMock });

    fireEvent.click(screen.getByTestId('featured-mobile-ranking-dot-1'));

    expect(scrollToMock).toHaveBeenCalledWith({ left: 240, behavior: 'smooth' });
    expect(screen.getByTestId('featured-mobile-ranking-dot-1')).toHaveClass('w-5');
  });

  it('handles 0 and 1 rankings without rendering dots', () => {
    const { rerender } = renderWithProviders(
      <FeaturedStatBlock {...baseProps} rankings={[]} />
    );

    expect(screen.queryByTestId('featured-mobile-ranking-dots')).not.toBeInTheDocument();
    expect(screen.getByText('Рейтинг пока недоступен.')).toBeInTheDocument();

    rerender(<FeaturedStatBlock {...baseProps} rankings={buildRankings(1)} />);
    expect(screen.queryByTestId('featured-mobile-ranking-dots')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('featured-mobile-ranking-slide')).toHaveLength(1);
  });
});
