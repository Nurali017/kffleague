import { describe, expect, it } from 'vitest';
import type { UrlObject } from 'url';
import {
  getMatchHref,
  getPlayerHref,
  getTeamHref,
  withTournamentContext,
} from './entityRoutes';

describe('entityRoutes', () => {
  it('keeps entity href builders compatible', () => {
    expect(getMatchHref(10)).toBe('/matches/10');
    expect(getPlayerHref('15')).toBe('/player/15');
    expect(getTeamHref(0)).toBeNull();
  });

  it('adds tournament context to entity string hrefs', () => {
    const href = withTournamentContext(
      '/player/10',
      new URLSearchParams('tournament=2l&season=80&round=5')
    );

    expect(href).toBe('/player/10?tournament=2l&season=80&round=5');
  });

  it('does not overwrite explicit tournament query', () => {
    const href = withTournamentContext(
      '/team/20?tournament=pl&foo=bar',
      new URLSearchParams('tournament=2l&season=80&round=5')
    );

    expect(href).toBe('/team/20?tournament=pl&foo=bar&season=80&round=5');
  });

  it('preserves hash and existing query params', () => {
    const href = withTournamentContext(
      '/matches/42?tab=lineup#timeline',
      new URLSearchParams('tournament=2l&season=80')
    );

    expect(href).toBe('/matches/42?tab=lineup&tournament=2l&season=80#timeline');
  });

  it('supports localized entity routes', () => {
    const href = withTournamentContext(
      '/kz/team/7',
      new URLSearchParams('tournament=2l&season=80')
    );

    expect(href).toBe('/kz/team/7?tournament=2l&season=80');
  });

  it('is no-op for non-entity routes', () => {
    const href = withTournamentContext(
      '/news?page=2',
      new URLSearchParams('tournament=2l&season=80')
    );

    expect(href).toBe('/news?page=2');
  });

  it('merges context for UrlObject hrefs', () => {
    const href: UrlObject = {
      pathname: '/player/11',
      query: { foo: 'bar' },
      hash: '#stats',
    };

    const result = withTournamentContext(
      href,
      new URLSearchParams('tournament=2l&season=80&round=5')
    ) as UrlObject;

    expect(result.pathname).toBe('/player/11');
    expect(result.hash).toBe('#stats');
    expect(result.query).toEqual({
      foo: 'bar',
      tournament: '2l',
      season: '80',
      round: '5',
    });
  });
});
