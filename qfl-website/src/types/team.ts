export interface Team {
  id: number;
  name: string;
  logo_url?: string;
}

export interface NextGame {
  game_id: number;
  date: string;
  opponent_id: number;
  opponent_name: string;
  opponent_logo: string;
  is_home: boolean;
}

export interface TeamStanding {
  position: number;
  team_id: number;
  team_name: string;
  team_logo?: string;
  games_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_scored: number;
  goals_conceded: number;
  goal_difference: number;
  points: number;
  form?: string;
  next_game?: NextGame;
}

export interface TableFilters {
  tour_from?: number;
  tour_to?: number;
  home_away?: 'home' | 'away' | null;
  group?: string | null;
  final?: boolean;
}

export interface LeagueTableResponse {
  season_id: number;
  filters: TableFilters;
  table: TeamStanding[];
}

// Results Grid types
export interface TeamResultsGrid {
  position: number;
  team_id: number;
  team_name: string;
  team_logo?: string;
  results: (string | null)[]; // "W", "D", "L", null
}

export interface ResultsGridResponse {
  season_id: number;
  total_tours: number;
  teams: TeamResultsGrid[];
}

export interface StadiumInfo {
  id?: number;
  name: string;
  capacity: number;
  city?: string;
  location?: string;
  image_url?: string;
}

// API returns basic team info, extended for UI with optional fields
export interface TeamDetail extends Team {
  full_name?: string;
  founded_year?: number;
  city?: string;
  website?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  colors?: {
    primary: string;
    secondary: string;
  };
  stadium?: StadiumInfo;
  coach?: {
    name: string;
    photo_url?: string;
    nationality?: string;
  };
}

// Player from /teams/{id}/players endpoint
export interface TeamPlayer {
  id: number;
  first_name: string;
  last_name: string;
  birthday: string;
  player_type: string;
  country?: {
    id: number;
    code: string;
    name: string;
    flag_url: string | null;
  } | null;
  photo_url?: string;
  age: number;
  top_role: string;
  team_id: number;
  number: number;
}

// Response from /teams/{id}/players
export interface TeamPlayersResponse {
  items: TeamPlayer[];
  total: number;
}

// Mapped player for squad display
export interface SquadPlayer {
  player_id: number;
  first_name: string;
  last_name: string;
  jersey_number: number | null;
  position: string;
  photo_url?: string | null;
  nationality?: string;
  country_code?: string;
  age?: number | null;
  // Season stats (optional)
  games_played?: number;
  goals?: number;
  assists?: number;
}

// Coach from /teams/{id}/coaches endpoint
export interface TeamCoach {
  id: number;
  first_name: string;
  last_name: string;
  photo_url?: string | null;
  role: string;
  country?: {
    id: number;
    code: string;
    name: string;
    flag_url: string | null;
  } | null;
}

// Stats from /teams/{id}/stats endpoint
export interface TeamStats {
  team_id: number;
  season_id: number;
  games_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_scored: number;
  goals_conceded: number;
  goal_difference: number;
  points: number;
  // xG
  xg?: number;
  xg_per_match?: number;
  opponent_xg?: number;
  // Shots
  shots?: number;
  shots_on_goal?: number;
  shots_off_goal?: number;
  shot_per_match?: number;
  goal_to_shot_ratio?: number;
  // Possession
  possession_avg?: number;
  // Passes
  passes?: number;
  pass_accuracy_avg?: number;
  pass_per_match?: number;
  pass_forward?: number;
  pass_long?: number;
  pass_long_ratio?: number;
  pass_progressive?: number;
  pass_cross?: number;
  pass_cross_ratio?: number;
  pass_to_box?: number;
  pass_to_3rd?: number;
  key_pass?: number;
  key_pass_per_match?: number;
  goal_pass?: number;
  // Defense
  tackle?: number;
  tackle_per_match?: number;
  interception?: number;
  interception_per_match?: number;
  recovery?: number;
  recovery_per_match?: number;
  // Duels
  duel?: number;
  duel_ratio?: number;
  aerial_duel_offence?: number;
  aerial_duel_offence_ratio?: number;
  ground_duel_offence?: number;
  ground_duel_offence_ratio?: number;
  // Dribbles
  dribble?: number;
  dribble_per_match?: number;
  dribble_ratio?: number;
  // Discipline
  fouls?: number;
  foul_taken?: number;
  yellow_cards?: number;
  second_yellow_cards?: number;
  red_cards?: number;
  // Set pieces
  corners?: number;
  corner_per_match?: number;
  offsides?: number;
  // Penalty
  penalty?: number;
  penalty_ratio?: number;
  // Other
  clean_sheets?: number;
  save_shot?: number;
  distance_covered?: number;
  extra_stats?: Record<string, any>;
}

export interface TeamOverviewSeason {
  id: number;
  name: string;
  championship_id: number | null;
}

export interface TeamOverviewTeam {
  id: number;
  name: string;
  city: string | null;
  logo_url: string | null;
  website: string | null;
  stadium: TeamOverviewStadium | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
}

export interface TeamOverviewSummary {
  games_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_scored: number;
  goals_conceded: number;
  goal_difference: number;
  points: number;
}

export interface TeamOverviewMatchTeam {
  id: number;
  name: string;
  logo_url?: string | null;
}

export interface TeamOverviewStadium {
  name: string | null;
  city: string | null;
  capacity?: number | null;
}

export interface TeamOverviewMatch {
  id: number;
  date: string;
  time: string | null;
  tour: number | null;
  status: 'upcoming' | 'finished' | 'live';
  home_score: number | null;
  away_score: number | null;
  has_stats: boolean;
  has_lineup: boolean;
  home_team: TeamOverviewMatchTeam;
  away_team: TeamOverviewMatchTeam;
  stadium: TeamOverviewStadium | null;
}

export interface TeamOverviewFormEntry {
  game_id: number;
  is_home: boolean;
  opponent_name: string;
  opponent_logo?: string | null;
  team_score: number;
  opponent_score: number;
  result: 'W' | 'D' | 'L';
}

export interface TeamOverviewStandingEntry {
  position: number;
  team_id: number;
  team_name: string;
  team_logo?: string | null;
  games_played: number;
  points: number;
  goal_difference: number;
  goals_scored: number;
  goals_conceded: number;
}

export interface TeamOverviewLeaderPlayer {
  player_id: number;
  first_name: string | null;
  last_name: string | null;
  photo_url: string | null;
  team_id: number | null;
  team_name: string | null;
  team_logo: string | null;
  position: string | null;
  games_played: number;
  goals: number;
  assists: number;
  passes: number;
  save_shot: number;
  dry_match: number;
  red_cards: number;
}

export interface TeamOverviewMiniLeaders {
  passes: TeamOverviewLeaderPlayer | null;
  appearances: TeamOverviewLeaderPlayer | null;
  saves: TeamOverviewLeaderPlayer | null;
  clean_sheets: TeamOverviewLeaderPlayer | null;
  red_cards: TeamOverviewLeaderPlayer | null;
}

export interface TeamOverviewLeaders {
  top_scorer: TeamOverviewLeaderPlayer | null;
  top_assister: TeamOverviewLeaderPlayer | null;
  goals_table: TeamOverviewLeaderPlayer[];
  assists_table: TeamOverviewLeaderPlayer[];
  mini_leaders: TeamOverviewMiniLeaders;
}

export interface TeamOverviewCoachPreview {
  id: number;
  first_name: string;
  last_name: string;
  photo_url: string | null;
  role: string;
  country_name: string | null;
}

export interface TeamOverviewResponse {
  team: TeamOverviewTeam;
  season: TeamOverviewSeason | null;
  summary: TeamOverviewSummary;
  form_last5: TeamOverviewFormEntry[];
  recent_match: TeamOverviewMatch | null;
  upcoming_matches: TeamOverviewMatch[];
  standings_window: TeamOverviewStandingEntry[];
  leaders: TeamOverviewLeaders;
  staff_preview: TeamOverviewCoachPreview[];
}
