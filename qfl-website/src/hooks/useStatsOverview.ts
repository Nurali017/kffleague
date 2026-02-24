import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { playerStatsService } from '@/lib/api/services';
import { teamStatsTableService } from '@/lib/api/services/teamStatsTableService';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { PlayerStat } from '@/types';
import { TeamStatistics } from '@/types/statistics';

export interface StatsOverviewData {
  player: {
    goals: PlayerStat[];
    assists: PlayerStat[];
    topPasses: PlayerStat | null;
    topAppearances: PlayerStat | null;
    topSaves: PlayerStat | null;
    topCleanSheets: PlayerStat | null;
    topRedCards: PlayerStat | null;
  };
  team: {
    goals: TeamStatistics[];
    wins: TeamStatistics[];
    topLosses: TeamStatistics | null;
    topPasses: TeamStatistics | null;
    topOffsides: TeamStatistics | null;
    topTackles: TeamStatistics | null;
    topRedCards: TeamStatistics | null;
  };
}

export function useStatsOverview(options: { seasonId?: number } = {}) {
  const { i18n } = useTranslation();
  const { seasonId = DEFAULT_SEASON_ID } = options;

  const { data, error, isLoading } = useSWR<StatsOverviewData>(
    ['/stats/overview', seasonId, i18n.language],
    async () => {
      const [
        pGoals, pAssists, pPasses, pApps, pSaves, pCleanSheets, pRedCards,
        tGoals, tWins, tLosses, tPasses, tOffsides, tTackles, tRedCards,
      ] = await Promise.all([
        playerStatsService.getPlayerStats({ seasonId, sortBy: 'goals', limit: 8, language: i18n.language }),
        playerStatsService.getPlayerStats({ seasonId, sortBy: 'assists', limit: 8, language: i18n.language }),
        playerStatsService.getPlayerStats({ seasonId, sortBy: 'passes', limit: 1, language: i18n.language }),
        playerStatsService.getPlayerStats({ seasonId, sortBy: 'games_played', limit: 1, language: i18n.language }),
        playerStatsService.getPlayerStats({ seasonId, sortBy: 'save_shot', limit: 1, language: i18n.language }),
        playerStatsService.getPlayerStats({ seasonId, sortBy: 'dry_match', limit: 1, language: i18n.language }),
        playerStatsService.getPlayerStats({ seasonId, sortBy: 'red_cards', limit: 1, language: i18n.language }),
        teamStatsTableService.getTeamStats({ seasonId, sortBy: 'goals_scored', limit: 8, language: i18n.language }),
        teamStatsTableService.getTeamStats({ seasonId, sortBy: 'wins', limit: 8, language: i18n.language }),
        teamStatsTableService.getTeamStats({ seasonId, sortBy: 'losses', limit: 8, language: i18n.language }),
        teamStatsTableService.getTeamStats({ seasonId, sortBy: 'passes', limit: 1, language: i18n.language }),
        teamStatsTableService.getTeamStats({ seasonId, sortBy: 'offsides', limit: 1, language: i18n.language }),
        teamStatsTableService.getTeamStats({ seasonId, sortBy: 'tackle', limit: 1, language: i18n.language }),
        teamStatsTableService.getTeamStats({ seasonId, sortBy: 'red_cards', limit: 1, language: i18n.language }),
      ]);

      return {
        player: {
          goals: pGoals.items,
          assists: pAssists.items,
          topPasses: pPasses.items[0] ?? null,
          topAppearances: pApps.items[0] ?? null,
          topSaves: pSaves.items[0] ?? null,
          topCleanSheets: pCleanSheets.items[0] ?? null,
          topRedCards: pRedCards.items[0] ?? null,
        },
        team: {
          goals: tGoals.items,
          wins: tWins.items,
          topLosses: tLosses.items[0] ?? null,
          topPasses: tPasses.items[0] ?? null,
          topOffsides: tOffsides.items[0] ?? null,
          topTackles: tTackles.items[0] ?? null,
          topRedCards: tRedCards.items[0] ?? null,
        },
      };
    }
  );

  return { data: data ?? null, loading: isLoading, error };
}
