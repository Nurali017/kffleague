import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { newsService } from '@/lib/api/services';
import { NewsNavigation } from '@/types';

interface UseNewsNavigationResult {
  navigation: NewsNavigation;
  loading: boolean;
  error: any;
  refetch: () => void;
}

export function useNewsNavigation(newsId: number | null): UseNewsNavigationResult {
  const { i18n } = useTranslation();

  const { data, error, isLoading, mutate } = useSWR<NewsNavigation>(
    newsId ? ['newsNavigation', newsId, i18n.language] : null,
    () => (newsId ? newsService.getNavigation(newsId, i18n.language) : Promise.resolve({})),
    {
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
