import { getTournamentById } from '@/config/tournaments';
import { SecondLeagueStage } from '@/types/tournament';

export const TOURNAMENT_COOKIE_NAME = 'qfl_tournament';
export const SECOND_LEAGUE_STAGE_COOKIE_NAME = 'qfl_2l_stage';

function isSecondLeagueStage(value: string | null): value is SecondLeagueStage {
  return value === 'a' || value === 'b' || value === 'final';
}

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

export function setSecondLeagueStageCookie(stage: SecondLeagueStage): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${SECOND_LEAGUE_STAGE_COOKIE_NAME}=${stage}; path=/; max-age=31536000; SameSite=Lax`;
}

export function getClientSecondLeagueStageCookie(): SecondLeagueStage | null {
  if (typeof document === 'undefined') return null;

  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${SECOND_LEAGUE_STAGE_COOKIE_NAME}=([^;]*)`)
  );
  const stage = matches ? decodeURIComponent(matches[1]) : null;

  return isSecondLeagueStage(stage) ? stage : null;
}

export function clearSecondLeagueStageCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${SECOND_LEAGUE_STAGE_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
