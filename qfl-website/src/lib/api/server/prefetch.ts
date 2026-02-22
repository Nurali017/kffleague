import 'server-only';

import { getLanguageFromCookie } from '@/lib/i18n/cookies.server';
import { getTournamentFromCookie } from '@/lib/tournament/cookies.server';
import { getTournamentById } from '@/config/tournaments';

export function getServerPrefetchContext() {
  const language = getLanguageFromCookie();
  const tournamentId = getTournamentFromCookie();
  const tournament = getTournamentById(tournamentId);
  const seasonId = tournament?.seasonId;

  return {
    language,
    tournamentId,
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
