import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { matchService } from '@/lib/api/services/matchService';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { MatchCenterFilters } from '@/types';
import { buildMetadata, getSeoLang } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const lang = getSeoLang();
  return buildMetadata({
    title: 'Матч-центр',
    description:
      lang === 'kz'
        ? 'Қазақстан Премьер-Лигасы матчтарының кестесі мен нәтижелері.'
        : 'Расписание и результаты матчей Казахстанской Премьер-Лиги.',
    path: '/matches',
  });
}

interface MatchesLayoutProps {
  children: ReactNode;
}

export default async function MatchesLayout({ children }: MatchesLayoutProps) {
  const { language, seasonId } = getServerPrefetchContext();
  const filters: MatchCenterFilters = {
    season_id: seasonId || DEFAULT_SEASON_ID,
    group_by_date: true,
    language,
  };
  const filtersHash = JSON.stringify({
    group_by_date: true,
    language,
    season_id: filters.season_id,
  });

  const center = await safePrefetch(
    () => matchService.getMatchCenter(filters)
  );

  const prefetch: Record<string, unknown> = {};
  if (center !== undefined) {
    prefetch[prefetchKeys.matchCenter(filtersHash)] = center;
  }

  return (
    <RoutePrefetchProvider value={prefetch}>
      {children}
    </RoutePrefetchProvider>
  );
}
