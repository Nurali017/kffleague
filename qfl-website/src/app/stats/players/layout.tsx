import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { playerStatsService } from '@/lib/api/services/playerStatsService';
import { teamService } from '@/lib/api/services/teamService';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { buildMetadata, getSeoLang } from '@/lib/seo/metadata';
import { PRE_SEASON_CONFIG } from '@/config/tournaments';

export async function generateMetadata(): Promise<Metadata> {
  const lang = getSeoLang();
  return buildMetadata({
    title: lang === 'kz' ? 'Ойыншылар статистикасы' : 'Статистика игроков',
    description:
      lang === 'kz'
        ? 'Қазақстан Премьер-Лигасы ойыншыларының статистикасы — голдар, пасстар, ойындар.'
        : 'Статистика игроков Казахстанской Премьер-Лиги — голы, передачи, матчи.',
    path: '/stats/players',
  });
}

interface StatsPlayersLayoutProps {
  children: ReactNode;
}

export default async function StatsPlayersLayout({
  children,
}: StatsPlayersLayoutProps) {
  const { language, seasonId, tournamentId } = getServerPrefetchContext();
  let effectiveSeasonId = seasonId || DEFAULT_SEASON_ID;

  // Pre-season: stats pages show previous season data
  if (!PRE_SEASON_CONFIG.seasonStarted && tournamentId === 'pl' && effectiveSeasonId === PRE_SEASON_CONFIG.currentSeasonId) {
    effectiveSeasonId = PRE_SEASON_CONFIG.previousSeasonId;
  }
  const defaultSort = 'goals';
  const defaultLimit = 100;
  const defaultOffset = 0;

  const [playerStats, teams] = await Promise.all([
    safePrefetch(() => playerStatsService.getPlayerStats({
      seasonId: effectiveSeasonId,
      sortBy: defaultSort,
      limit: defaultLimit,
      offset: defaultOffset,
      language,
    })),
    safePrefetch(() => teamService.getTeams(effectiveSeasonId, language)),
  ]);

  const prefetch: Record<string, unknown> = {};
  if (playerStats !== undefined) {
    prefetch[prefetchKeys.playerStats(
      effectiveSeasonId,
      defaultSort,
      defaultLimit,
      defaultOffset,
      null,
      null,
      null,
      language
    )] = playerStats.items;
  }
  if (teams !== undefined) {
    prefetch[prefetchKeys.teamsList(effectiveSeasonId, language)] = teams;
  }

  return (
    <RoutePrefetchProvider value={prefetch}>
      {children}
    </RoutePrefetchProvider>
  );
}
