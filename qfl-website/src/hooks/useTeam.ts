import useSWR from 'swr';
import { MOCKED_TEAMS, MOCKED_STATS, MOCKED_SQUAD, MOCKED_GAMES } from '@/lib/mock/teams';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { TeamDetail, TeamStats, SquadPlayer } from '@/types';
import { Game } from '@/types/match';

// Mock sleeper to simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Main team detail hook
export function useTeamDetail(teamId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<TeamDetail | null>(
    teamId ? ['team', teamId] : null,
    async () => {
      await sleep(300); // Simulate latency
      return MOCKED_TEAMS[teamId!] || MOCKED_TEAMS[1]; // Fallback to Astana if not found
    }
  );

  return {
    team: data ?? null,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}

// Team stats hook
export function useTeamStats(
  teamId: number | null,
  seasonId: number = DEFAULT_SEASON_ID
) {
  const { data, error, isLoading, mutate } = useSWR<TeamStats | null>(
    teamId ? ['teamStats', teamId, seasonId] : null,
    async () => {
      await sleep(300);
      return {} as TeamStats; // Mock empty stats
    }
  );

  return {
    stats: data ?? null,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}

// Team players hook
export function useTeamPlayers(
  teamId: number | null,
  seasonId: number = DEFAULT_SEASON_ID
) {
  const { data, error, isLoading, mutate } = useSWR<SquadPlayer[]>(
    teamId ? ['teamPlayers', teamId, seasonId] : null,
    async () => {
      await sleep(300);
      return [];
    }
  );

  return {
    players: data ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}

// Team games hook
export function useTeamGames(
  teamId: number | null,
  seasonId: number = DEFAULT_SEASON_ID
) {
  const { data, error, isLoading, mutate } = useSWR<Game[]>(
    teamId ? ['teamGames', teamId, seasonId] : null,
    async () => {
      await sleep(300);
      return MOCKED_GAMES;
    }
  );

  const games = Array.isArray(data) ? data : [];
  const now = new Date();

  const recent = games
    .filter((game) => {
      if (game.home_score === undefined || game.away_score === undefined) return false;
      const gameDate = new Date(game.date);
      return gameDate <= now;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const upcoming = games
    .filter((game) => {
      if (game.home_score !== undefined && game.away_score !== undefined) return false;
      const gameDate = new Date(game.date);
      return gameDate > now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    recentMatches: recent,
    upcomingMatches: upcoming,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
