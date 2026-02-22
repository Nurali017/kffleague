import { ReactNode } from 'react';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { pagesService } from '@/lib/api/services/pagesService';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';

interface ContactsLayoutProps {
  children: ReactNode;
}

export default async function ContactsLayout({ children }: ContactsLayoutProps) {
  const { language } = getServerPrefetchContext();
  const page = await safePrefetch(() => pagesService.getContactsPage(language));

  const prefetch: Record<string, unknown> = {};
  if (page !== undefined) {
    prefetch[prefetchKeys.pagesContacts(language)] = page;
  }

  return (
    <RoutePrefetchProvider value={prefetch}>
      {children}
    </RoutePrefetchProvider>
  );
}
