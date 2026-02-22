export interface CupTeamBrief {
  id: number;
  name: string;
  logo_url?: string | null;
}

export interface CupGameBrief {
  id: number;
  date: string;
  time?: string | null;
  stage_name?: string | null;
  home_team?: CupTeamBrief | null;
  away_team?: CupTeamBrief | null;
  home_score?: number | null;
  away_score?: number | null;
  home_penalty_score?: number | null;
  away_penalty_score?: number | null;
  status?: string | null;
  is_live: boolean;
}

export interface CupGroupStandingEntry {
  position: number;
  team_id: number;
  team_name?: string | null;
  team_logo?: string | null;
  games_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_scored: number;
  goals_conceded: number;
  goal_difference: number;
  points: number;
}

export interface CupGroup {
  group_name: string;
  standings: CupGroupStandingEntry[];
}

export interface CupRound {
  stage_id?: number | null;
  round_name: string;
  round_key: string;
  is_current: boolean;
  total_games: number;
  played_games: number;
  games: CupGameBrief[];
}

export interface BracketGameTeam {
  id: number;
  name: string;
  logo_url?: string | null;
}

export interface BracketGameBrief {
  id: number;
  date: string;
  time?: string | null;
  home_team?: BracketGameTeam | null;
  away_team?: BracketGameTeam | null;
  home_score?: number | null;
  away_score?: number | null;
  home_penalty_score?: number | null;
  away_penalty_score?: number | null;
  status?: string | null;
}

export interface PlayoffBracketEntry {
  id: number;
  round_name: string;
  side: string;
  sort_order: number;
  is_third_place: boolean;
  game?: BracketGameBrief | null;
}

export interface PlayoffRound {
  round_name: string;
  round_label: string;
  entries: PlayoffBracketEntry[];
}

export interface PlayoffBracketResponse {
  season_id: number;
  rounds: PlayoffRound[];
}

export interface CupOverviewResponse {
  season_id: number;
  season_name?: string | null;
  tournament_name?: string | null;
  championship_name?: string | null;
  current_round?: CupRound | null;
  groups?: CupGroup[] | null;
  bracket?: PlayoffBracketResponse | null;
  recent_results: CupGameBrief[];
  upcoming_games: CupGameBrief[];
  rounds: CupRound[];
}

export interface CupScheduleResponse {
  season_id: number;
  rounds: CupRound[];
  total_games: number;
}
