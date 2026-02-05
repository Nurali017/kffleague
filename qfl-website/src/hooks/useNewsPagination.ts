import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { newsService } from '@/lib/api/services';
import { NewsArticle, NewsFilters } from '@/types';

interface UseNewsPaginationResult {
  news: NewsArticle[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: any;
  refetch: () => void;
}

export function useNewsPagination(
  filters: NewsFilters = {},
  page: number = 1,
  limit: number = 12
): UseNewsPaginationResult {
  const { i18n } = useTranslation();

  const { data, error, isLoading, mutate } = useSWR(
    ['paginatedNews', i18n.language, JSON.stringify(filters), page, limit],
    () => newsService.getPaginated(i18n.language, filters, page, limit),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  return {
    news: data?.items ?? [],
    total: data?.total ?? 0,
    totalPages: data?.pages ?? 0,  // Backend returns 'pages', not 'total_pages'
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
