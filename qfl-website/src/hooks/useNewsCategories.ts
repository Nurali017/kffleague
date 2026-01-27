import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { newsService } from '@/lib/api/services';

interface UseNewsCategoriesResult {
  categories: string[];
  loading: boolean;
  error: any;
  refetch: () => void;
}

export function useNewsCategories(): UseNewsCategoriesResult {
  const { i18n } = useTranslation();

  const { data, error, isLoading, mutate } = useSWR(
    ['newsCategories', i18n.language],
    () => newsService.getCategories(i18n.language),
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
