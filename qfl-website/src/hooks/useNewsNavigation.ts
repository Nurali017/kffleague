import useSWR from 'swr';
import { newsService } from '@/lib/api/services';
import { DEFAULT_LANGUAGE } from '@/api/endpoints';
import { NewsNavigation } from '@/types';

interface UseNewsNavigationOptions {
  language?: string;
}

interface UseNewsNavigationResult {
  navigation: NewsNavigation;
  loading: boolean;
  error: any;
  refetch: () => void;
}

export function useNewsNavigation(
  newsId: number | null,
  options: UseNewsNavigationOptions = {}
): UseNewsNavigationResult {
  const { language = DEFAULT_LANGUAGE } = options;

  const { data, error, isLoading, mutate } = useSWR<NewsNavigation>(
    newsId ? ['newsNavigation', newsId, language] : null,
    () => (newsId ? newsService.getNavigation(newsId, language) : Promise.resolve({})),
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
