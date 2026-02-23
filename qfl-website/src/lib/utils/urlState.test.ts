import { describe, expect, it, beforeEach } from 'vitest';

import {
  buildSearchParams,
  getMatchCenterFiltersFromUrl,
} from './urlState';

describe('urlState match-center phase filters', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/matches');
  });

  it('parses group filter from URL', () => {
    const filters = getMatchCenterFiltersFromUrl(
      new URLSearchParams('season_id=80&group=A&tours=1,2')
    );

    expect(filters.season_id).toBe(80);
    expect(filters.group).toBe('A');
    expect(filters.final).toBeUndefined();
    expect(filters.tours).toEqual([1, 2]);
  });

  it('parses final filter and ignores group when both are present', () => {
    const filters = getMatchCenterFiltersFromUrl(
      new URLSearchParams('group=A&final=true')
    );

    expect(filters.final).toBe(true);
    expect(filters.group).toBeUndefined();
  });

  it('builds final phase query params without mutating input', () => {
    const initial = new URLSearchParams('season_id=80&group=A&tours=1,2');
    const next = buildSearchParams(initial, {
      season_id: 80,
      group: undefined,
      final: 'true',
      tours: undefined,
    });

    expect(initial.get('group')).toBe('A');
    expect(next.get('season_id')).toBe('80');
    expect(next.get('final')).toBe('true');
    expect(next.get('group')).toBeNull();
    expect(next.get('tours')).toBeNull();
  });
});
