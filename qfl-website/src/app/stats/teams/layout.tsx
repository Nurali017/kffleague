import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { teamStatsTableService } from '@/lib/api/services/teamStatsTableService';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { buildMetadata, getSeoLang } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const lang = getSeoLang();
  return buildMetadata({
    title: lang === 'kz' ? 'Командалар статистикасы' : 'Статистика команд',
    description:
      lang === 'kz'
        ? 'Қазақстан Премьер-Лигасы командаларының статистикасы — ұпайлар, голдар, жеңістер.'
        : 'Статистика команд Казахстанской Премьер-Лиги — очки, голы, победы.',
    path: '/stats/teams',
  });
}

interface StatsTeamsLayoutProps {
  children: ReactNode;
}

export default async function StatsTeamsLayout({
  children,
}: StatsTeamsLayoutProps) {
  const { language, seasonId } = getServerPrefetchContext();
  const effectiveSeasonId = seasonId || DEFAULT_SEASON_ID;
  const sortBy = 'points';
  const limit = 50;
  const offset = 0;

  const table = await safePrefetch(() => teamStatsTableService.getTeamStats({
    seasonId: effectiveSeasonId,
    sortBy,
    limit,
    offset,
    language,
  }));

  const prefetch: Record<string, unknown> = {};
  if (table !== undefined) {
    prefetch[prefetchKeys.teamStatsTable(effectiveSeasonId, sortBy, limit, offset, language)] = table;
  }

  return (
    <RoutePrefetchProvider value={prefetch}>
      {children}
    </RoutePrefetchProvider>
  );
}
