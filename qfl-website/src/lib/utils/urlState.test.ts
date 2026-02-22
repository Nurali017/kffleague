import { describe, expect, it, beforeEach } from 'vitest';

import {
  getMatchCenterFiltersFromUrl,
  syncMatchCenterFiltersToUrl,
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

  it('syncs final phase to URL', () => {
    syncMatchCenterFiltersToUrl({
      season_id: 80,
      final: true,
    });

    const params = new URLSearchParams(window.location.search);
    expect(params.get('season_id')).toBe('80');
    expect(params.get('final')).toBe('true');
    expect(params.get('group')).toBeNull();
  });
});
