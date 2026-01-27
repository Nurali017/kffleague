import {
  MatchDetail,
  LineupResponse,
  EventsResponse,
  LineupPlayerExtended,
  TeamLineupData,
} from '@/types';

/**
 * Преобразует массив team_stats в структуру home/away для фронтенда
 */
export function transformTeamStats(
  teamStats: Array<{
    team_id: number;
    possession_percent?: number;
    shots?: number;
    shots_on_goal?: number;
    corners?: number;
    fouls?: number;
    offsides?: number;
    yellow_cards?: number;
    red_cards?: number;
  }>,
  homeTeamId: number,
  awayTeamId: number
): MatchDetail['stats'] {
  const homeStats = teamStats.find(t => t.team_id === homeTeamId);
  const awayStats = teamStats.find(t => t.team_id === awayTeamId);

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

/**
 * Маппинг позиций из бэкенда в формат фронтенда
 */
function mapPosition(position?: string): 'GK' | 'DEF' | 'MID' | 'FWD' {
  if (!position) return 'MID';

  const code = position.split(' ')[0].toUpperCase();

  if (code === 'GK') return 'GK';
  if (['CD', 'LD', 'RD', 'LB', 'RB', 'CB', 'D'].includes(code)) return 'DEF';
  if (['DM', 'CM', 'AM', 'LM', 'RM', 'LW', 'RW', 'M'].includes(code)) return 'MID';
  if (['CF', 'ST', 'FW', 'F'].includes(code)) return 'FWD';

  return 'MID';
}

/**
 * Преобразует бэкенд ответ составов: shirt_number → number
 */
export function transformLineupResponse(backendResponse: any): LineupResponse {
  const transformPlayers = (players: any[]): LineupPlayerExtended[] => {
    return players.map(p => ({
      player_id: p.player_id,
      first_name: p.first_name,
      last_name: p.last_name,
      number: p.shirt_number,  // ← КЛЮЧЕВАЯ ТРАНСФОРМАЦИЯ
      position: mapPosition(p.position),
      is_captain: p.is_captain || false,
      photo_url: p.photo_url,
      country: p.country ? {
        id: p.country.id,
        code: p.country.code,
        name: p.country.name,
        flag_url: p.country.flag_url,
      } : undefined,
    }));
  };

  const transformTeamLineup = (teamData: any, coaches: any[]): TeamLineupData => ({
    team_id: teamData.team_id,
    team_name: teamData.team_name,
    formation: teamData.formation || '4-4-2',
    coach_name: coaches?.[0]
      ? `${coaches[0].first_name || ''} ${coaches[0].last_name || ''}`.trim()
      : undefined,
    starters: transformPlayers(teamData.starters || []),
    substitutes: transformPlayers(teamData.substitutes || []),
  });

  return {
    match_id: backendResponse.game_id,
    lineups: {
      home_team: transformTeamLineup(
        backendResponse.lineups.home_team,
        backendResponse.coaches?.home_team || []
      ),
      away_team: transformTeamLineup(
        backendResponse.lineups.away_team,
        backendResponse.coaches?.away_team || []
      ),
    },
    referees: backendResponse.referees?.map((r: any) => ({
      name: `${r.first_name || ''} ${r.last_name || ''}`.trim(),
      role: r.role,
    })),
    coaches: backendResponse.coaches,
  };
}

/**
 * Преобразует события матча, добавляя недостающие поля
 */
export function transformMatchEvents(backendResponse: any): EventsResponse {
  return {
    game_id: backendResponse.game_id,
    total: backendResponse.total || 0,
    events: backendResponse.events?.map((e: any) => ({
      id: e.id,
      half: e.half || 1,
      minute: e.minute,
      event_type: e.event_type,
      team_id: e.team_id,
      team_name: e.team_name || '',
      player_id: e.assist_player_id || 'unknown',  // ВРЕМЕННАЯ ЗАГЛУШКА
      player_name: e.player_name || '',
      player_number: e.player_number,
      assist_player_id: e.assist_player_id,
      assist_player_name: e.assist_player_name,
      assist_player_number: e.assist_player_number,
      player2_id: undefined,  // Backend пока не предоставляет
      player2_name: e.player2_name,
      player2_number: e.player2_number,
      description: e.description,
    })) || [],
  };
}
