export interface NavItem {
  key: string;
  label: string;
  href?: string;
  children?: NavItem[];
  isLive?: boolean;
}

export interface LiveMatchData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  isLive: boolean;
}
