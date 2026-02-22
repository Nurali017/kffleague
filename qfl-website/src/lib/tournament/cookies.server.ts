import { cookies } from 'next/headers';
import { DEFAULT_TOURNAMENT_ID, getTournamentById } from '@/config/tournaments';

export const TOURNAMENT_COOKIE_NAME = 'qfl_tournament';

/**
 * Server-side: Read tournament preference from cookies
 * Returns saved tournament ID or DEFAULT_TOURNAMENT_ID as fallback
 */
export function getTournamentFromCookie(): string {
  const cookieStore = cookies();
  const tournamentId = cookieStore.get(TOURNAMENT_COOKIE_NAME)?.value;

  // Validate that the tournament exists
  if (tournamentId && getTournamentById(tournamentId)) {
    return tournamentId;
  }

  return DEFAULT_TOURNAMENT_ID;
}
