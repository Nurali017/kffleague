import useSWR from 'swr';
import { newsService } from '@/lib/api/services';
import { DEFAULT_LANGUAGE } from '@/api/endpoints';

interface UseNewsCategoriesOptions {
  language?: string;
}

interface UseNewsCategoriesResult {
  categories: string[];
  loading: boolean;
  error: any;
  refetch: () => void;
}

export function useNewsCategories(
  options: UseNewsCategoriesOptions = {}
): UseNewsCategoriesResult {
  const { language = DEFAULT_LANGUAGE } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['newsCategories', language],
    () => newsService.getCategories(language),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes - categories don't change often
    }
  );

  return {
    categories: data ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
