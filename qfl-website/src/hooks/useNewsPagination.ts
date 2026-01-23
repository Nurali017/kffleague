import useSWR from 'swr';
import { newsService } from '@/lib/api/services';
import { DEFAULT_LANGUAGE } from '@/api/endpoints';
import { NewsArticle, NewsFilters } from '@/types';

interface UseNewsPaginationOptions {
  language?: string;
}

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
  limit: number = 12,
  options: UseNewsPaginationOptions = {}
): UseNewsPaginationResult {
  const { language = DEFAULT_LANGUAGE } = options;

  const { data, error, isLoading, mutate } = useSWR(
    ['paginatedNews', language, JSON.stringify(filters), page, limit],
    () => newsService.getPaginated(language, filters, page, limit),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  return {
    news: data?.items ?? [],
    total: data?.total ?? 0,
    totalPages: data?.total_pages ?? 0,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
