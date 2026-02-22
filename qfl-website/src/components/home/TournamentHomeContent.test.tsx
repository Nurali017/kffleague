import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TournamentHomeContent } from './TournamentHomeContent';

vi.mock('./SecondLeagueHome', () => ({
  SecondLeagueHome: () => <div data-testid="second-league-home" />,
}));

vi.mock('./CupHome', () => ({
  CupHome: () => <div data-testid="cup-home" />,
}));

describe('TournamentHomeContent', () => {
  it('renders second league home for 2l tournament', () => {
    render(<TournamentHomeContent tournamentId="2l" secondLeagueData={{}} />);

    expect(screen.getByTestId('second-league-home')).toBeInTheDocument();
    expect(screen.queryByTestId('cup-home')).not.toBeInTheDocument();
  });

  it('renders cup home for cup tournament', () => {
    render(<TournamentHomeContent tournamentId="cup" cupData={{ overview: null }} />);

    expect(screen.getByTestId('cup-home')).toBeInTheDocument();
    expect(screen.queryByTestId('second-league-home')).not.toBeInTheDocument();
  });

  it('renders nothing for other tournaments', () => {
    const { container } = render(<TournamentHomeContent tournamentId="pl" />);
    expect(container.firstChild).toBeNull();
  });
});

