import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { newsService } from '@/lib/api/services/newsService';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { NewsFilters } from '@/types';
import { buildMetadata, getSeoLang } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const lang = getSeoLang();
  return buildMetadata({
    title: lang === 'kz' ? 'Жаңалықтар' : 'Новости',
    description:
      lang === 'kz'
        ? 'Қазақстан Премьер-Лигасының соңғы жаңалықтары мен мақалалары.'
        : 'Последние новости и статьи Казахстанской Премьер-Лиги.',
    path: '/news',
  });
}

interface NewsLayoutProps {
  children: ReactNode;
}

export default async function NewsLayout({ children }: NewsLayoutProps) {
  const { language, tournamentId } = getServerPrefetchContext();
  const filters: NewsFilters = {
    championship_code: tournamentId,
  };
  const filtersHash = JSON.stringify(filters);
  const page = 1;
  const limit = 12;

  const newsPage = await safePrefetch(() =>
    newsService.getPaginated(language, filters, page, limit)
  );

  const prefetch: Record<string, unknown> = {};
  if (newsPage !== undefined) {
    prefetch[prefetchKeys.newsPaginated(language, filtersHash, page, limit)] = newsPage;
  }

  return (
    <RoutePrefetchProvider value={prefetch}>
      {children}
    </RoutePrefetchProvider>
  );
}
