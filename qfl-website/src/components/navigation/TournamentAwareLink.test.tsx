import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import { TournamentAwareLink } from './TournamentAwareLink';

let searchParamsMock = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useSearchParams: () => searchParamsMock,
}));

describe('TournamentAwareLink', () => {
  beforeEach(() => {
    searchParamsMock = new URLSearchParams();
    window.history.replaceState({}, '', '/');
  });

  it('adds tournament context for entity routes', () => {
    searchParamsMock = new URLSearchParams('tournament=2l&season=80&round=5');

    render(
      <TournamentAwareLink href="/player/10">Player</TournamentAwareLink>
    );

    expect(screen.getByRole('link', { name: 'Player' })).toHaveAttribute(
      'href',
      '/player/10?tournament=2l&season=80&round=5'
    );
  });

  it('does not overwrite explicit tournament in href', () => {
    searchParamsMock = new URLSearchParams('tournament=2l&season=80&round=5');

    render(
      <TournamentAwareLink href="/player/10?tournament=pl&foo=bar">Player</TournamentAwareLink>
    );

    expect(screen.getByRole('link', { name: 'Player' })).toHaveAttribute(
      'href',
      '/player/10?tournament=pl&foo=bar&season=80&round=5'
    );
  });

  it('is no-op for non-entity routes', () => {
    searchParamsMock = new URLSearchParams('tournament=2l&season=80');

    render(
      <TournamentAwareLink href="/news?page=2">News</TournamentAwareLink>
    );

    expect(screen.getByRole('link', { name: 'News' })).toHaveAttribute(
      'href',
      '/news?page=2'
    );
  });
});
