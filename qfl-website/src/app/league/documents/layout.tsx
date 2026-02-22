import { ReactNode } from 'react';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { pagesService } from '@/lib/api/services/pagesService';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';

interface LeagueDocumentsLayoutProps {
  children: ReactNode;
}

export default async function LeagueDocumentsLayout({
  children,
}: LeagueDocumentsLayoutProps) {
  const { language } = getServerPrefetchContext();
  const page = await safePrefetch(() => pagesService.getDocumentsPage(language));

  const prefetch: Record<string, unknown> = {};
  if (page !== undefined) {
    prefetch[prefetchKeys.pagesDocuments(language)] = page;
  }

  return (
    <RoutePrefetchProvider value={prefetch}>
      {children}
    </RoutePrefetchProvider>
  );
}
