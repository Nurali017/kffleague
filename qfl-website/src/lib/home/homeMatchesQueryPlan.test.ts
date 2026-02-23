import { describe, expect, it } from 'vitest';
import {
  getHomeMatchesQueryPlan,
  HOME_MATCHES_DEFAULT_LIMIT,
  HOME_MATCHES_PRESEASON_DATE_FROM,
  HOME_MATCHES_PRESEASON_DATE_TO,
  HOME_MATCHES_PRESEASON_LIMIT,
} from './homeMatchesQueryPlan';

describe('getHomeMatchesQueryPlan', () => {
  it('returns match center range for PL pre-season even when round exists', () => {
    const plan = getHomeMatchesQueryPlan({
      tournamentId: 'pl',
      seasonId: 200,
      currentRound: 2,
    });

    expect(plan.source).toBe('matchCenter');
    if (plan.source !== 'matchCenter') return;

    expect(plan.matchCenterFilters).toEqual({
      season_id: 200,
      group_by_date: true,
      date_from: HOME_MATCHES_PRESEASON_DATE_FROM,
      date_to: HOME_MATCHES_PRESEASON_DATE_TO,
      hide_past: false,
      limit: HOME_MATCHES_PRESEASON_LIMIT,
    });
  });

  it('falls back to current round when season already started', () => {
    const plan = getHomeMatchesQueryPlan({
      tournamentId: 'pl',
      seasonId: 200,
      currentRound: 2,
      seasonStarted: true,
    });

    expect(plan).toEqual({
      source: 'tour',
      tour: 2,
    });
  });

  it('returns default match center query when round is missing outside pre-season mode', () => {
    const plan = getHomeMatchesQueryPlan({
      tournamentId: 'pl',
      seasonId: 61,
      currentRound: null,
    });

    expect(plan.source).toBe('matchCenter');
    if (plan.source !== 'matchCenter') return;

    expect(plan.matchCenterFilters).toEqual({
      season_id: 61,
      group_by_date: true,
      limit: HOME_MATCHES_DEFAULT_LIMIT,
    });
  });
});
