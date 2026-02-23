export const SUPER_CUP_HERO_ENABLED = true;

export const SUPER_CUP_FEATURED_MATCH = {
  heroTitle: 'The Super Cup',
  date: '2026-02-28',
  homeTeamId: 13,
  awayTeamId: 90,
  h2hSeasonId: 61,
  canonicalTicketUrl: 'https://afisha.yandex.kz/astana/sport/football-kairat-tobyl',
  kickoffTime: '2026-02-28T17:00:00+05:00',
} as const;

/** Check if a match is the Super Cup match by team IDs */
export function isSuperCupMatch(homeTeamId: number, awayTeamId: number): boolean {
  const ids = [homeTeamId, awayTeamId].sort((a, b) => a - b);
  const scIds = [SUPER_CUP_FEATURED_MATCH.homeTeamId, SUPER_CUP_FEATURED_MATCH.awayTeamId].sort((a, b) => a - b);
  return ids[0] === scIds[0] && ids[1] === scIds[1];
}

