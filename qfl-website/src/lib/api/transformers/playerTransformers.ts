import { PlayerDetailAPIResponse, PlayerTeammate, PlayerTournamentHistory, PlayerSeasonStatsResponse } from '@/types/player';

export function transformPlayer(apiPlayer: PlayerDetailAPIResponse | null | undefined) {
  if (!apiPlayer) return null;
  return {
    player_id: apiPlayer.id,
    first_name: apiPlayer.first_name || '',
    last_name: apiPlayer.last_name || '',
    jersey_number: undefined as number | undefined,
    team_id: apiPlayer.teams?.[0] || 0,
    team_name: '',
    position: apiPlayer.top_role || '',
    date_of_birth: apiPlayer.birthday,
    age: apiPlayer.age,
    height: undefined as number | undefined,
    weight: undefined as number | undefined,
    nationality: apiPlayer.country?.name || '',
    photo_url: apiPlayer.photo_url,
    country: apiPlayer.country,
  };
}

export function transformStats(apiStats: PlayerSeasonStatsResponse | null | undefined) {
  if (!apiStats) {
    return {
      games_played: 0,
      minutes_played: 0,
      started: 0,
      subbed_in: 0,
      goals: 0,
      assists: 0,
      shots: 0,
      shots_on_goal: 0,
      passes: 0,
      key_passes: 0,
      pass_accuracy: 0,
      interception: 0,
      dribble: 0,
      yellow_cards: 0,
      red_cards: 0,
      duels: 0,
      duels_won: 0,
      duels_won_percentage: 0,
    };
  }

  const duels = apiStats.duels || 0;
  const duelsWon = apiStats.duels_won || 0;
  const duelsWonPercentage = duels > 0 ? Math.round((duelsWon / duels) * 100) : 0;

  return {
    games_played: apiStats.games_played || 0,
    minutes_played: apiStats.minutes_played || 0,
    started: apiStats.games_starting || 0,
    subbed_in: (apiStats.games_played || 0) - (apiStats.games_starting || 0),
    goals: apiStats.goals || 0,
    assists: apiStats.assists || 0,
    shots: apiStats.shots || 0,
    shots_on_goal: apiStats.shots_on_goal || 0,
    passes: apiStats.passes || 0,
    key_passes: apiStats.key_passes || 0,
    pass_accuracy: apiStats.pass_accuracy || 0,
    interception: (apiStats.extra_stats?.interception as number) || 0,
    dribble: (apiStats.extra_stats?.dribble as number) || 0,
    yellow_cards: apiStats.yellow_cards || 0,
    red_cards: apiStats.red_cards || 0,
    duels: duels,
    duels_won: duelsWon,
    duels_won_percentage: duelsWonPercentage,
  };
}

export function transformTournaments(apiTournaments: PlayerTournamentHistory[]) {
  if (!apiTournaments || apiTournaments.length === 0) return [];

  return apiTournaments.map((t, index) => ({
    id: index + 1,
    season: t.season_name || String(t.season_id),
    name: t.tournament_name || '',
    team: t.team_name || '',
    matches: t.games_played || 0,
    minutes: t.minutes_played || 0,
    goals: t.goals || 0,
    assists: t.assists || 0,
    yellow: t.yellow_cards || 0,
    red: t.red_cards || 0,
  }));
}

export function transformTeammates(apiTeammates: PlayerTeammate[]) {
  if (!apiTeammates || apiTeammates.length === 0) return [];

  return apiTeammates.map((t) => ({
    player_id: t.player_id,
    jersey_number: t.jersey_number,
    first_name: t.first_name || '',
    last_name: t.last_name || '',
    position: t.position || '',
    age: t.age,
    photo_url: t.photo_url,
  }));
}
