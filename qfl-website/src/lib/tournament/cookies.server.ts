import { cookies } from 'next/headers';
import { DEFAULT_TOURNAMENT_ID, getTournamentById } from '@/config/tournaments';
import { SecondLeagueStage } from '@/types/tournament';

export const TOURNAMENT_COOKIE_NAME = 'qfl_tournament';
export const SECOND_LEAGUE_STAGE_COOKIE_NAME = 'qfl_2l_stage';

function isSecondLeagueStage(value: string | undefined): value is SecondLeagueStage {
  return value === 'a' || value === 'b' || value === 'final';
}

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

export function getSecondLeagueStageFromCookie(): SecondLeagueStage | null {
  const cookieStore = cookies();
  const stage = cookieStore.get(SECOND_LEAGUE_STAGE_COOKIE_NAME)?.value;
  return isSecondLeagueStage(stage) ? stage : null;
}
