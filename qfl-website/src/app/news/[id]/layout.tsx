import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { JsonLd } from '@/components/JsonLd';
import { newsService } from '@/lib/api/services/newsService';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { buildMetadata } from '@/lib/seo/metadata';
import { newsArticleJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { getLanguageFromCookie } from '@/lib/i18n/cookies.server';

interface NewsDetailLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const newsId = Number(params.id);
  if (!Number.isInteger(newsId) || newsId <= 0) return {};

  const language = getLanguageFromCookie();
  const article = await safePrefetch(() =>
    newsService.getById(newsId, language)
  );
  if (!article) return {};

  return buildMetadata({
    title: article.title,
    description: article.excerpt || article.title,
    path: `/news/${newsId}`,
    ogImage: article.image_url || null,
    ogType: 'article',
    publishedTime: article.publish_date,
  });
}

export default async function NewsDetailLayout({
  children,
  params,
}: NewsDetailLayoutProps) {
  const newsId = Number(params.id);
  if (!Number.isInteger(newsId) || newsId <= 0) {
    return children;
  }

  const { language } = getServerPrefetchContext();

  const [article, navigation, reactions] = await Promise.all([
    safePrefetch(() => newsService.getById(newsId, language)),
    safePrefetch(() => newsService.getNavigation(newsId, language)),
    safePrefetch(() => newsService.getReactions(newsId)),
  ]);

  const prefetch: Record<string, unknown> = {};
  if (article !== undefined) {
    prefetch[prefetchKeys.newsById(newsId, language)] = article;
  }
  if (navigation !== undefined) {
    prefetch[prefetchKeys.newsNavigation(newsId, language)] = navigation;
  }
  if (reactions !== undefined) {
    prefetch[prefetchKeys.newsReactions(newsId)] = reactions;
  }

  const jsonLd = article
    ? [
        newsArticleJsonLd({
          id: newsId,
          title: article.title,
          excerpt: article.excerpt,
          imageUrl: article.image_url,
          publishDate: article.publish_date,
        }),
        breadcrumbJsonLd([
          { name: 'Жаңалықтар', href: '/news' },
          { name: article.title },
        ]),
      ]
    : [];

  return (
    <RoutePrefetchProvider value={prefetch}>
      {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
      {children}
    </RoutePrefetchProvider>
  );
}
