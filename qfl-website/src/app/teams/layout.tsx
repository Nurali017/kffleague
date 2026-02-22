import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { teamService } from '@/lib/api/services/teamService';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { buildMetadata, getSeoLang } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const lang = getSeoLang();
  return buildMetadata({
    title: lang === 'kz' ? 'Командалар' : 'Команды',
    description:
      lang === 'kz'
        ? 'Қазақстан Премьер-Лигасы командаларының тізімі.'
        : 'Список команд Казахстанской Премьер-Лиги.',
    path: '/teams',
  });
}

interface TeamsLayoutProps {
  children: ReactNode;
}

export default async function TeamsLayout({ children }: TeamsLayoutProps) {
  const { language, seasonId } = getServerPrefetchContext();
  const effectiveSeasonId = seasonId || DEFAULT_SEASON_ID;
  const teams = await safePrefetch(() => teamService.getTeams(effectiveSeasonId, language));

  const prefetch: Record<string, unknown> = {};
  if (teams !== undefined) {
    prefetch[prefetchKeys.teamsList(effectiveSeasonId, language)] = teams;
  }

  return (
    <RoutePrefetchProvider value={prefetch}>
      {children}
    </RoutePrefetchProvider>
  );
}
