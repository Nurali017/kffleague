import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { TeamCoach, TeamDetail, TeamOverviewResponse, TeamStats, SquadPlayer } from '@/types';
import { Game } from '@/types/match';
import { teamService } from '@/lib/api/services/teamService';
import { queryKeys } from '@/lib/api/queryKeys';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';

// Teams list hook - fetches from real API
export function useTeams(seasonId: number = DEFAULT_SEASON_ID) {
  const { i18n } = useTranslation();
  const prefetched = useRoutePrefetchValue<TeamDetail[]>(
    prefetchKeys.teamsList(seasonId, i18n.language)
  );
  const { data, error, isLoading, mutate } = useSWR<TeamDetail[]>(
    queryKeys.teams.list(seasonId, i18n.language),
    async () => {
      return teamService.getTeams(seasonId, i18n.language);
    },
    {
      fallbackData: prefetched,
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
  const prefetched = useRoutePrefetchValue<TeamDetail | null>(
    teamId ? prefetchKeys.teamDetail(teamId, i18n.language) : null
  );
  const { data, error, isLoading, mutate } = useSWR<TeamDetail | null>(
    teamId ? queryKeys.teams.byId(teamId, i18n.language) : null,
    async () => {
      return teamService.getTeamById(teamId!, i18n.language);
    },
    {
      fallbackData: prefetched,
    }
  );

  return {
    team: data ?? null,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}

// Team overview hook - aggregated endpoint for team page overview
export function useTeamOverview(
  teamId: number | null,
  seasonId: number = DEFAULT_SEASON_ID
) {
  const { i18n } = useTranslation();
  const prefetched = useRoutePrefetchValue<TeamOverviewResponse | null>(
    teamId ? prefetchKeys.teamOverview(teamId, seasonId, i18n.language) : null
  );
  const { data, error, isLoading, mutate } = useSWR<TeamOverviewResponse | null>(
    teamId ? queryKeys.teams.overview(teamId, seasonId, i18n.language) : null,
    async () => {
      return teamService.getTeamOverview(teamId!, seasonId, i18n.language);
    },
    {
      fallbackData: prefetched,
    }
  );

  return {
    overview: data ?? null,
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
  const prefetched = useRoutePrefetchValue<TeamStats | null>(
    teamId ? prefetchKeys.teamStats(teamId, seasonId, i18n.language) : null
  );
  const { data, error, isLoading, mutate } = useSWR<TeamStats | null>(
    teamId ? queryKeys.teams.stats(teamId, seasonId, i18n.language) : null,
    async () => {
      return teamService.getTeamStats(teamId!, seasonId, i18n.language);
    },
    {
      fallbackData: prefetched,
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
  const prefetched = useRoutePrefetchValue<SquadPlayer[]>(
    teamId ? prefetchKeys.teamPlayers(teamId, seasonId, i18n.language) : null
  );
  const { data, error, isLoading, mutate } = useSWR<SquadPlayer[]>(
    teamId ? queryKeys.teams.players(teamId, seasonId, i18n.language) : null,
    async () => {
      return teamService.getTeamPlayers(teamId!, seasonId, i18n.language);
    },
    {
      fallbackData: prefetched,
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
    teamId ? queryKeys.teams.coaches(teamId, seasonId, i18n.language) : null,
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
  const prefetched = useRoutePrefetchValue<Game[]>(
    teamId ? prefetchKeys.teamGames(teamId, seasonId, i18n.language) : null
  );
  const { data, error, isLoading, mutate } = useSWR<Game[]>(
    teamId ? queryKeys.teams.games(teamId, seasonId, i18n.language) : null,
    async () => {
      return teamService.getTeamGames(teamId!, seasonId, i18n.language);
    },
    {
      fallbackData: prefetched,
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
