import { ReactNode } from 'react';
import type { Metadata } from 'next';
import StatsLayoutClient from './StatsLayoutClient';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { seasonStatsService } from '@/lib/api/services/seasonStatsService';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { buildMetadata, getSeoLang } from '@/lib/seo/metadata';
import { PRE_SEASON_CONFIG } from '@/config/tournaments';

export async function generateMetadata(): Promise<Metadata> {
  const lang = getSeoLang();
  return buildMetadata({
    title: lang === 'kz' ? 'Статистика' : 'Статистика',
    description:
      lang === 'kz'
        ? 'Қазақстан Премьер-Лигасының маусым статистикасы.'
        : 'Статистика сезона Казахстанской Премьер-Лиги.',
    path: '/stats',
  });
}

interface StatsLayoutProps {
  children: ReactNode;
}

export default async function StatsLayout({ children }: StatsLayoutProps) {
  const { language, seasonId, tournamentId } = getServerPrefetchContext();
  let baseSeasonId = seasonId || DEFAULT_SEASON_ID;

  // Pre-season: stats pages show previous season data
  if (!PRE_SEASON_CONFIG.seasonStarted && tournamentId === 'pl' && baseSeasonId === PRE_SEASON_CONFIG.currentSeasonId) {
    baseSeasonId = PRE_SEASON_CONFIG.previousSeasonId;
  }

  const [seasonStats, goalsByPeriod] = await Promise.all([
    safePrefetch(() => seasonStatsService.getSeasonStatistics(baseSeasonId, language)),
    safePrefetch(() => seasonStatsService.getGoalsByPeriod(baseSeasonId)),
  ]);

  const prefetch: Record<string, unknown> = {};
  if (seasonStats !== undefined) {
    prefetch[prefetchKeys.seasonStats(baseSeasonId, language)] = seasonStats;
  }
  if (goalsByPeriod !== undefined) {
    prefetch[prefetchKeys.seasonGoalsByPeriod(baseSeasonId)] = goalsByPeriod;
  }

  return (
    <RoutePrefetchProvider value={prefetch}>
      <StatsLayoutClient>{children}</StatsLayoutClient>
    </RoutePrefetchProvider>
  );
}
