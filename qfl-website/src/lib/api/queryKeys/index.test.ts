import { describe, expect, it } from 'vitest';
import { queryKeys } from './index';

describe('queryKeys', () => {
  it('builds games tour key with numeric identifiers', () => {
    expect(queryKeys.games.byTour(61, 26, 'ru')).toEqual([
      '/games',
      61,
      'tour',
      26,
      'ru',
    ]);
  });

  it('builds news paginated key with stable hash and pagination', () => {
    expect(queryKeys.news.paginated('kz', '{"type":"NEWS"}', 2, 12)).toEqual([
      '/news',
      'paginated',
      'kz',
      '{"type":"NEWS"}',
      2,
      12,
    ]);
  });

  it('keeps nullable filters in league table key', () => {
    expect(queryKeys.league.table(61, undefined, undefined, null, null, false, 'ru')).toEqual([
      '/seasons',
      61,
      'table',
      undefined,
      undefined,
      null,
      null,
      false,
      'ru',
    ]);
  });

  it('encodes phase filters in results-grid key', () => {
    expect(queryKeys.league.resultsGrid(80, 'A', false, 'ru')).toEqual([
      '/seasons',
      80,
      'results-grid',
      'A',
      false,
      'ru',
    ]);
  });

  it('encodes optional stats filters in players key', () => {
    expect(
      queryKeys.stats.players(61, 'goals', 10, 0, null, 'GK', null, 'ru')
    ).toEqual([
      '/seasons',
      61,
      'player-stats',
      'goals',
      10,
      0,
      null,
      'GK',
      null,
      'ru',
    ]);
  });

  it('builds cup schedule key with nullable round key', () => {
    expect(queryKeys.cup.schedule(71, 'ru', null)).toEqual([
      '/cup',
      71,
      'schedule',
      'ru',
      null,
    ]);
  });
});
