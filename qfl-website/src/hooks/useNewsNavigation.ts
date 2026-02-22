import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { newsService } from '@/lib/api/services';
import { NewsNavigation } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';
import { prefetchKeys } from '@/lib/api/prefetchKeys';

interface UseNewsNavigationResult {
  navigation: NewsNavigation;
  loading: boolean;
  error: any;
  refetch: () => void;
}

export function useNewsNavigation(newsId: number | null): UseNewsNavigationResult {
  const { i18n } = useTranslation();
  const prefetched = useRoutePrefetchValue<NewsNavigation>(
    newsId ? prefetchKeys.newsNavigation(newsId, i18n.language) : null
  );

  const { data, error, isLoading, mutate } = useSWR<NewsNavigation>(
    newsId ? queryKeys.news.navigation(newsId, i18n.language) : null,
    () => (newsId ? newsService.getNavigation(newsId, i18n.language) : Promise.resolve({})),
    {
      fallbackData: prefetched,
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute - navigation doesn't change often
    }
  );

  return {
    navigation: data ?? {},
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
