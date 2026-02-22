import { ReactNode } from 'react';
import type { Metadata } from 'next';
import StatsLayoutClient from './StatsLayoutClient';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { seasonStatsService } from '@/lib/api/services/seasonStatsService';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { buildMetadata, getSeoLang } from '@/lib/seo/metadata';

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
  const { language, seasonId } = getServerPrefetchContext();
  const effectiveSeasonId = seasonId || DEFAULT_SEASON_ID;

  const [seasonStats, goalsByPeriod] = await Promise.all([
    safePrefetch(() => seasonStatsService.getSeasonStatistics(effectiveSeasonId, language)),
    safePrefetch(() => seasonStatsService.getGoalsByPeriod(effectiveSeasonId)),
  ]);

  const prefetch: Record<string, unknown> = {};
  if (seasonStats !== undefined) {
    prefetch[prefetchKeys.seasonStats(effectiveSeasonId, language)] = seasonStats;
  }
  if (goalsByPeriod !== undefined) {
    prefetch[prefetchKeys.seasonGoalsByPeriod(effectiveSeasonId)] = goalsByPeriod;
  }

  return (
    <RoutePrefetchProvider value={prefetch}>
      <StatsLayoutClient>{children}</StatsLayoutClient>
    </RoutePrefetchProvider>
  );
}
