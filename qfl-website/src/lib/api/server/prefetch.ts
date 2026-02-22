import 'server-only';

import { getLanguageFromCookie } from '@/lib/i18n/cookies.server';
import {
  getTournamentFromCookie,
  getSecondLeagueStageFromCookie,
} from '@/lib/tournament/cookies.server';
import {
  DEFAULT_SECOND_LEAGUE_STAGE,
  getSecondLeagueSeasonId,
  getTournamentById,
} from '@/config/tournaments';

export function getServerPrefetchContext() {
  const language = getLanguageFromCookie();
  const tournamentId = getTournamentFromCookie();
  const secondLeagueStage = getSecondLeagueStageFromCookie();
  const tournament = getTournamentById(tournamentId);
  const seasonId = tournamentId === '2l'
    ? getSecondLeagueSeasonId(secondLeagueStage ?? DEFAULT_SECOND_LEAGUE_STAGE)
    : tournament?.seasonId;

  return {
    language,
    tournamentId,
    secondLeagueStage,
    seasonId,
  };
}

export async function safePrefetch<T>(fn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await fn();
  } catch {
    return undefined;
  }
}
