export type TournamentType = 'league' | 'cup' | 'supercup';
export type TournamentFormat = 'round_robin' | 'knockout' | 'group_knockout';

export interface TournamentColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentSoft: string;
}

export interface Tournament {
  id: string;  // Used for news filtering: pl, 1l, cup, 2l, el
  seasonId: number;
  type: TournamentType;
  format: TournamentFormat;
  name: {
    ru: string;
    kz: string;
    short: string;
  };
  sponsorName?: string;
  logo: string;
  colors: TournamentColors;
  order: number;
  hasTable: boolean;
  hasBracket: boolean;
  currentRound?: number;
  totalRounds?: number;
}

export interface Season {
  id: number;
  year: string;
  tournaments: Tournament[];
  isCurrentSeason: boolean;
}

// Cup bracket types
export interface BracketMatch {
  id: string;
  round: string;
  homeTeam: {
    id: number;
    name: string;
    logo_url?: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo_url?: string;
  };
  homeScore?: number;
  awayScore?: number;
  homeAggregate?: number;
  awayAggregate?: number;
  winner?: 'home' | 'away';
  date?: string;
  time?: string;
}

export interface BracketRound {
  id: string;
  name: string;
  matches: BracketMatch[];
}

export interface TournamentGroup {
  id: string;
  name: string;
  standings: Array<{
    position: number;
    team_id: number;
    team_name: string;
    logo_url?: string;
    games_played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_scored: number;
    goals_conceded: number;
    points: number;
  }>;
}
