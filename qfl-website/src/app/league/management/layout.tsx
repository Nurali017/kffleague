import { ReactNode } from 'react';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { pagesService } from '@/lib/api/services/pagesService';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';

interface LeagueManagementLayoutProps {
  children: ReactNode;
}

export default async function LeagueManagementLayout({
  children,
}: LeagueManagementLayoutProps) {
  const { language } = getServerPrefetchContext();
  const page = await safePrefetch(() => pagesService.getLeadershipPage(language));

  const prefetch: Record<string, unknown> = {};
  if (page !== undefined) {
    prefetch[prefetchKeys.pagesLeadership(language)] = page;
  }

  return (
    <RoutePrefetchProvider value={prefetch}>
      {children}
    </RoutePrefetchProvider>
  );
}
