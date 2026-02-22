import {
  EventsResponse,
  LineupPlayerExtended,
  LineupResponse,
  MatchDetail,
  TeamLineupData,
} from '@/types';

export interface BackendTeamStatsEntry {
  team_id: number;
  possession_percent?: number | null;
  shots?: number | null;
  shots_on_goal?: number | null;
  corners?: number | null;
  fouls?: number | null;
  offsides?: number | null;
  yellow_cards?: number | null;
  red_cards?: number | null;
}

export interface BackendCountry {
  id: number;
  code: string;
  name: string;
  flag_url?: string | null;
}

export interface BackendLineupPlayer {
  player_id: number;
  first_name: string;
  last_name: string;
  shirt_number: number;
  position?: string | null;
  amplua?: 'Gk' | 'D' | 'DM' | 'M' | 'AM' | 'F' | null;
  field_position?: 'L' | 'LC' | 'C' | 'RC' | 'R' | null;
  is_captain?: boolean | null;
  photo_url?: string | null;
  country?: BackendCountry | null;
}

export interface BackendLineupTeam {
  team_id: number;
  team_name: string;
  formation?: string | null;
  kit_color?: string | null;
  starters?: BackendLineupPlayer[];
  substitutes?: BackendLineupPlayer[];
}

export interface BackendCoach {
  first_name?: string | null;
  last_name?: string | null;
}

export interface BackendReferee {
  first_name?: string | null;
  last_name?: string | null;
  role: 'main' | 'assistant' | 'fourth' | 'var';
}

export interface BackendLineupResponse {
  game_id: number;
  has_lineup?: boolean;
  rendering?: {
    mode?: 'field' | 'list' | 'hidden' | null;
    source?: 'team_squad' | 'sota_api' | 'vsporte_api' | 'matches_players' | 'none' | null;
    field_allowed_by_rules?: boolean | null;
    field_data_valid?: boolean | null;
  } | null;
  lineups: {
    home_team: BackendLineupTeam;
    away_team: BackendLineupTeam;
  };
  referees?: BackendReferee[];
  coaches?: {
    home_team?: BackendCoach[];
    away_team?: BackendCoach[];
    home?: { name: string; photo_url?: string; nationality?: string };
    away?: { name: string; photo_url?: string; nationality?: string };
  };
}

export interface BackendLiveEvent {
  id: number;
  half?: 1 | 2 | null;
  minute: number;
  event_type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty';
  team_id?: number | null;
  team_name?: string | null;
  player_id?: number | null;
  player_name?: string | null;
  player_number?: number | null;
  assist_player_id?: number | null;
  assist_player_name?: string | null;
  assist_player_number?: number | null;
  player2_id?: number | null;
  player2_name?: string | null;
  player2_number?: number | null;
  description?: string | null;
}

export interface BackendLiveEventsResponse {
  game_id: number;
  total?: number;
  events?: BackendLiveEvent[];
}

function mapPosition(position?: string | null): 'GK' | 'DEF' | 'MID' | 'FWD' {
  if (!position) return 'MID';

  const normalized = position.trim().toUpperCase();
  const token = normalized.split(/\s+/)[0] || '';
  const code = token.replace(/[^A-ZА-ЯЁ0-9]/g, '');

  if (['GK', 'G', 'ВР', 'ГК', 'ВРТ'].includes(code)) return 'GK';
  if (['CD', 'LD', 'RD', 'LB', 'RB', 'CB', 'D', 'ЛЗ', 'ПЗ', 'ЦЗ', 'ЗЩ', 'ЗАЩ'].includes(code)) {
    return 'DEF';
  }
  if (['DM', 'CM', 'AM', 'LM', 'RM', 'LW', 'RW', 'M', 'ОП', 'ЦП', 'АП', 'ПП', 'ЛП', 'ПЗЩ'].includes(code)) {
    return 'MID';
  }
  if (['CF', 'ST', 'FW', 'F', 'ЦН', 'НП', 'ЦФ', 'НАП'].includes(code)) return 'FWD';

  if (normalized.includes('ВРАТ')) return 'GK';
  if (normalized.includes('ЗАЩИТ')) return 'DEF';
  if (normalized.includes('ПОЛУЗАЩ')) return 'MID';
  if (normalized.includes('НАПАД')) return 'FWD';

  return 'MID';
}

function transformPlayers(players: BackendLineupPlayer[] = []): LineupPlayerExtended[] {
  return players.map((player) => ({
    player_id: player.player_id,
    first_name: player.first_name,
    last_name: player.last_name,
    number: player.shirt_number,
    position: mapPosition(player.position),
    amplua: player.amplua ?? null,
    field_position: player.field_position ?? null,
    is_captain: player.is_captain ?? false,
    photo_url: player.photo_url ?? undefined,
    country: player.country
      ? {
          id: player.country.id,
          code: player.country.code,
          name: player.country.name,
          flag_url: player.country.flag_url ?? undefined,
        }
      : undefined,
  }));
}

function transformTeamLineup(
  teamData: BackendLineupTeam,
  coaches: BackendCoach[] = []
): TeamLineupData {
  return {
    team_id: teamData.team_id,
    team_name: teamData.team_name,
    formation: teamData.formation || '4-4-2',
    kit_color: teamData.kit_color || null,
    coach_name: coaches[0]
      ? `${coaches[0].first_name || ''} ${coaches[0].last_name || ''}`.trim()
      : undefined,
    starters: transformPlayers(teamData.starters),
    substitutes: transformPlayers(teamData.substitutes),
  };
}

export function adaptLineupResponse(backendResponse: BackendLineupResponse): LineupResponse {
  const homeTeam = backendResponse.lineups.home_team;
  const awayTeam = backendResponse.lineups.away_team;

  const hasAnyLineupData =
    (homeTeam.starters?.length || 0) +
      (homeTeam.substitutes?.length || 0) +
      (awayTeam.starters?.length || 0) +
      (awayTeam.substitutes?.length || 0) >
    0;

  const mode =
    backendResponse.rendering?.mode ||
    (hasAnyLineupData ? 'field' : 'hidden');
  const source =
    backendResponse.rendering?.source ||
    (hasAnyLineupData ? 'matches_players' : 'none');

  return {
    match_id: backendResponse.game_id,
    has_lineup: backendResponse.has_lineup ?? hasAnyLineupData,
    rendering: {
      mode,
      source,
      field_allowed_by_rules: backendResponse.rendering?.field_allowed_by_rules ?? false,
      field_data_valid: backendResponse.rendering?.field_data_valid ?? false,
    },
    lineups: {
      home_team: transformTeamLineup(
        homeTeam,
        backendResponse.coaches?.home_team || []
      ),
      away_team: transformTeamLineup(
        awayTeam,
        backendResponse.coaches?.away_team || []
      ),
    },
    referees: backendResponse.referees?.map((referee) => ({
      name: `${referee.first_name || ''} ${referee.last_name || ''}`.trim(),
      role: referee.role,
    })),
    coaches: backendResponse.coaches?.home && backendResponse.coaches?.away
      ? {
          home: backendResponse.coaches.home,
          away: backendResponse.coaches.away,
        }
      : undefined,
  };
}

export function adaptEventsResponse(backendResponse: BackendLiveEventsResponse): EventsResponse {
  return {
    game_id: backendResponse.game_id,
    total: backendResponse.total || 0,
    events: (backendResponse.events || []).map((event) => ({
      id: event.id,
      half: event.half || 1,
      minute: event.minute,
      event_type: event.event_type,
      team_id: event.team_id ?? null,
      team_name: event.team_name || '',
      player_id: event.player_id ?? null,
      player_name: event.player_name || '',
      player_number: event.player_number ?? null,
      assist_player_id: event.assist_player_id ?? null,
      assist_player_name: event.assist_player_name ?? undefined,
      assist_player_number: event.assist_player_number ?? undefined,
      player2_id: event.player2_id ?? null,
      player2_name: event.player2_name ?? undefined,
      player2_number: event.player2_number ?? undefined,
      description: event.description ?? undefined,
    })),
  };
}

export function transformTeamStats(
  teamStats: BackendTeamStatsEntry[],
  homeTeamId: number,
  awayTeamId: number
): MatchDetail['stats'] {
  const homeStats = teamStats.find((team) => team.team_id === homeTeamId);
  const awayStats = teamStats.find((team) => team.team_id === awayTeamId);

  if (!homeStats || !awayStats) return undefined;

  return {
    possession: {
      home: homeStats.possession_percent || 0,
      away: awayStats.possession_percent || 0,
    },
    shots: {
      home: homeStats.shots || 0,
      away: awayStats.shots || 0,
    },
    shots_on_target: {
      home: homeStats.shots_on_goal || 0,
      away: awayStats.shots_on_goal || 0,
    },
    corners: {
      home: homeStats.corners || 0,
      away: awayStats.corners || 0,
    },
    fouls: {
      home: homeStats.fouls || 0,
      away: awayStats.fouls || 0,
    },
    offsides: {
      home: homeStats.offsides || 0,
      away: awayStats.offsides || 0,
    },
    yellow_cards: {
      home: homeStats.yellow_cards || 0,
      away: awayStats.yellow_cards || 0,
    },
    red_cards: {
      home: homeStats.red_cards || 0,
      away: awayStats.red_cards || 0,
    },
  };
}
