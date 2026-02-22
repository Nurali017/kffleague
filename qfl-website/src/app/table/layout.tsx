import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { cupService } from '@/lib/api/services/cupService';
import { leagueService } from '@/lib/api/services/leagueService';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { buildMetadata, getSeoLang } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const lang = getSeoLang();
  return buildMetadata({
    title: lang === 'kz' ? 'Турнир кестесі' : 'Турнирная таблица',
    description:
      lang === 'kz'
        ? 'Қазақстан Премьер-Лигасы турнир кестесі — командалардың орны, ұпайлары, матч нәтижелері.'
        : 'Турнирная таблица Казахстанской Премьер-Лиги — позиции команд, очки, результаты матчей.',
    path: '/table',
  });
}

interface TableLayoutProps {
  children: ReactNode;
}

export default async function TableLayout({ children }: TableLayoutProps) {
  const { language, seasonId, tournamentId } = getServerPrefetchContext();
  const effectiveSeasonId = seasonId || DEFAULT_SEASON_ID;

  const [table, resultsGrid, cupOverview, cupSchedule] = await Promise.all([
    tournamentId === 'cup'
      ? Promise.resolve(undefined)
      : safePrefetch(() => leagueService.getTable(effectiveSeasonId, undefined, language)),
    tournamentId === 'cup'
      ? Promise.resolve(undefined)
      : safePrefetch(() => leagueService.getResultsGrid(effectiveSeasonId, undefined, language)),
    tournamentId === 'cup'
      ? safePrefetch(() => cupService.getOverview(effectiveSeasonId, language))
      : Promise.resolve(undefined),
    tournamentId === 'cup'
      ? safePrefetch(() => cupService.getSchedule(effectiveSeasonId, language))
      : Promise.resolve(undefined),
  ]);

  const prefetch: Record<string, unknown> = {};
  if (table !== undefined) {
    prefetch[prefetchKeys.leagueTable(
      effectiveSeasonId,
      undefined,
      undefined,
      undefined,
      undefined,
      false,
      language
    )] = table;
  }
  if (resultsGrid !== undefined) {
    prefetch[prefetchKeys.resultsGrid(effectiveSeasonId, undefined, false, language)] = resultsGrid;
  }
  if (cupOverview !== undefined) {
    prefetch[prefetchKeys.cupOverview(effectiveSeasonId, language, 5, 5)] = cupOverview;
  }
  if (cupSchedule !== undefined) {
    prefetch[prefetchKeys.cupSchedule(effectiveSeasonId, language, null)] = cupSchedule;
  }

  return (
    <RoutePrefetchProvider value={prefetch}>
      {children}
    </RoutePrefetchProvider>
  );
}
