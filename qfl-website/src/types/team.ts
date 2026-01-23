export interface Team {
  id: number;
  name: string;
  logo_url?: string;
}

export interface NextGame {
  game_id: string;
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
  name: string;
  capacity: number;
  location?: string;
  image_url?: string;
}

// API returns basic team info, extended for UI with optional fields
export interface TeamDetail extends Team {
  full_name?: string;
  founded_year?: number;
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
  id: string;
  first_name: string;
  last_name: string;
  birthday: string;
  player_type: string;
  country_name: string;
  country_code: string;
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
  player_id: string;
  first_name: string;
  last_name: string;
  jersey_number: number;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  photo_url?: string;
  nationality?: string;
  country_code?: string;
  age?: number;
  // Season stats (optional)
  games_played?: number;
  goals?: number;
  assists?: number;
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
  shots?: number;
  shots_on_goal?: number;
  possession_avg?: number;
  passes?: number;
  pass_accuracy_avg?: number;
  fouls?: number;
  yellow_cards?: number;
  red_cards?: number;
  corners?: number;
  offsides?: number;
  clean_sheets?: number;
  extra_stats?: Record<string, any>;
}
