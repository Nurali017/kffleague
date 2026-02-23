import { PRE_SEASON_CONFIG } from '@/config/tournaments';
import { DEFAULT_TOUR } from '@/lib/api/endpoints';
import { MatchCenterFilters } from '@/types';

export const HOME_MATCHES_DEFAULT_LIMIT = 20;
export const HOME_MATCHES_PRESEASON_LIMIT = 40;
export const HOME_MATCHES_PRESEASON_DATE_FROM = '2026-02-28';
export const HOME_MATCHES_PRESEASON_DATE_TO = '2026-03-08';

interface GetHomeMatchesQueryPlanOptions {
  tournamentId: string;
  seasonId: number;
  currentRound: number | null;
  totalRounds?: number | null;
  seasonStarted?: boolean;
}

type HomeMatchesTourQueryPlan = {
  source: 'tour';
  tour: number;
};

type HomeMatchesMatchCenterQueryPlan = {
  source: 'matchCenter';
  matchCenterFilters: MatchCenterFilters;
};

export type HomeMatchesQueryPlan =
  | HomeMatchesTourQueryPlan
  | HomeMatchesMatchCenterQueryPlan;

export function getHomeMatchesQueryPlan(
  options: GetHomeMatchesQueryPlanOptions
): HomeMatchesQueryPlan {
  const seasonStarted = options.seasonStarted ?? PRE_SEASON_CONFIG.seasonStarted;
  const isPremierLeaguePreSeason =
    options.tournamentId === 'pl' &&
    !seasonStarted &&
    options.seasonId === PRE_SEASON_CONFIG.currentSeasonId;

  if (isPremierLeaguePreSeason) {
    return {
      source: 'matchCenter',
      matchCenterFilters: {
        season_id: options.seasonId,
        group_by_date: true,
        date_from: HOME_MATCHES_PRESEASON_DATE_FROM,
        date_to: HOME_MATCHES_PRESEASON_DATE_TO,
        hide_past: false,
        limit: HOME_MATCHES_PRESEASON_LIMIT,
      },
    };
  }

  if (options.tournamentId === '1l' || options.tournamentId === 'el') {
    const normalizedTotalRounds = Number(options.totalRounds);
    const normalizedCurrentRound = Number(options.currentRound);
    const lastTour = Number.isInteger(normalizedTotalRounds) && normalizedTotalRounds > 0
      ? normalizedTotalRounds
      : Number.isInteger(normalizedCurrentRound) && normalizedCurrentRound > 0
        ? normalizedCurrentRound
        : null;

    if (lastTour !== null) {
      return {
        source: 'tour',
        tour: lastTour,
      };
    }
  }

  if (options.currentRound !== null) {
    return {
      source: 'tour',
      tour: options.currentRound,
    };
  }

  return {
    source: 'matchCenter',
    matchCenterFilters: {
      season_id: options.seasonId,
      group_by_date: true,
      limit: HOME_MATCHES_DEFAULT_LIMIT,
    },
  };
}

export function getHomeMatchesTourFallback(plan: HomeMatchesQueryPlan): number {
  return plan.source === 'tour' ? plan.tour : DEFAULT_TOUR;
}
