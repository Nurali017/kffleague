import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { TeamDetail, TeamStats, SquadPlayer, TeamCoach } from '@/types';
import { Game } from '@/types/match';
import { teamService } from '@/lib/api/services/teamService';

// Teams list hook - fetches from real API
export function useTeams(seasonId: number = DEFAULT_SEASON_ID) {
  const { i18n } = useTranslation();
  const { data, error, isLoading, mutate } = useSWR<TeamDetail[]>(
    ['teams', seasonId, i18n.language],
    async () => {
      return teamService.getTeams(seasonId, i18n.language);
    }
  );

  return {
    teams: data ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}

// Main team detail hook - fetches from real API
export function useTeamDetail(teamId: number | null) {
  const { i18n } = useTranslation();
  const { data, error, isLoading, mutate } = useSWR<TeamDetail | null>(
    teamId ? ['team', teamId, i18n.language] : null,
    async () => {
      return teamService.getTeamById(teamId!, i18n.language);
    }
  );

  return {
    team: data ?? null,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}

// Team stats hook - fetches from real API
export function useTeamStats(
  teamId: number | null,
  seasonId: number = DEFAULT_SEASON_ID
) {
  const { i18n } = useTranslation();
  const { data, error, isLoading, mutate } = useSWR<TeamStats | null>(
    teamId ? ['teamStats', teamId, seasonId, i18n.language] : null,
    async () => {
      return teamService.getTeamStats(teamId!, seasonId, i18n.language);
    }
  );

  return {
    stats: data ?? null,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}

// Team players hook - fetches from real API
export function useTeamPlayers(
  teamId: number | null,
  seasonId: number = DEFAULT_SEASON_ID
) {
  const { i18n } = useTranslation();
  const { data, error, isLoading, mutate } = useSWR<SquadPlayer[]>(
    teamId ? ['teamPlayers', teamId, seasonId, i18n.language] : null,
    async () => {
      return teamService.getTeamPlayers(teamId!, seasonId, i18n.language);
    }
  );

  return {
    players: data ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}

// Team coaches hook
export function useTeamCoaches(
  teamId: number | null,
  seasonId: number = DEFAULT_SEASON_ID
) {
  const { i18n } = useTranslation();
  const { data, error, isLoading } = useSWR<TeamCoach[]>(
    teamId ? ['teamCoaches', teamId, seasonId, i18n.language] : null,
    async () => {
      return teamService.getTeamCoaches(teamId!, seasonId, i18n.language);
    }
  );

  return {
    coaches: data ?? [],
    loading: isLoading,
    error,
  };
}

// Team games hook - fetches from real API
export function useTeamGames(
  teamId: number | null,
  seasonId: number = DEFAULT_SEASON_ID
) {
  const { i18n } = useTranslation();
  const { data, error, isLoading, mutate } = useSWR<Game[]>(
    teamId ? ['teamGames', teamId, seasonId, i18n.language] : null,
    async () => {
      return teamService.getTeamGames(teamId!, seasonId, i18n.language);
    }
  );

  const games = Array.isArray(data) ? data : [];
  const now = new Date();

  // Filter finished games (have scores)
  const recent = games
    .filter((game) => {
      if (game.home_score === undefined || game.away_score === undefined) return false;
      const gameDate = new Date(game.date);
      return gameDate <= now;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter upcoming games (no scores yet)
  const upcoming = games
    .filter((game) => {
      if (game.home_score !== undefined && game.away_score !== undefined) return false;
      const gameDate = new Date(game.date);
      return gameDate > now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    games,
    recentMatches: recent,
    upcomingMatches: upcoming,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
