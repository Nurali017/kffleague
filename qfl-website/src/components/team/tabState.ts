export const TEAM_PAGE_TABS = ['overview', 'matches', 'squad', 'stats', 'staff'] as const;

export type TeamPageTab = (typeof TEAM_PAGE_TABS)[number];

export const DEFAULT_TEAM_PAGE_TAB: TeamPageTab = 'overview';

export function parseTeamPageTab(value: string | null | undefined): TeamPageTab | null {
  if (!value) return null;
  return (TEAM_PAGE_TABS as readonly string[]).includes(value) ? (value as TeamPageTab) : null;
}

