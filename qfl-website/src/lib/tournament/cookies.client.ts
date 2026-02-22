import { getTournamentById } from '@/config/tournaments';

export const TOURNAMENT_COOKIE_NAME = 'qfl_tournament';

/**
 * Client-side: Set tournament preference cookie
 */
export function setTournamentCookie(tournamentId: string): void {
  if (typeof document !== 'undefined' && getTournamentById(tournamentId)) {
    document.cookie = `${TOURNAMENT_COOKIE_NAME}=${tournamentId}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

/**
 * Client-side: Read tournament preference from cookie
 */
export function getClientTournamentCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${TOURNAMENT_COOKIE_NAME}=([^;]*)`)
  );

  const tournamentId = matches ? decodeURIComponent(matches[1]) : null;

  // Validate that the tournament exists
  if (tournamentId && getTournamentById(tournamentId)) {
    return tournamentId;
  }

  return null;
}
