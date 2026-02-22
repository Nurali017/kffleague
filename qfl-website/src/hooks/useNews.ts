import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { newsService } from '@/lib/api/services';
import { SliderNews, NewsArticle } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';
import { prefetchKeys } from '@/lib/api/prefetchKeys';

interface UseSliderNewsOptions {
  limit?: number;
  tournamentId?: string;
}

export function useSliderNews(options: UseSliderNewsOptions = {}) {
  const { i18n } = useTranslation();
  const { limit = 5, tournamentId } = options;
  const prefetched = useRoutePrefetchValue<SliderNews[]>(
    prefetchKeys.newsSlider(i18n.language, limit, tournamentId)
  );

  const { data, error, isLoading, mutate } = useSWR<SliderNews[]>(
    queryKeys.news.slider(i18n.language, limit, tournamentId),
    () => newsService.getSlider(i18n.language, limit, tournamentId),
    {
      fallbackData: prefetched,
    }
  );

  return {
    sliderNews: data ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}

interface UseLatestNewsOptions {
  limit?: number;
  tournamentId?: string;
}

export function useLatestNews(options: UseLatestNewsOptions = {}) {
  const { i18n } = useTranslation();
  const { limit = 10, tournamentId } = options;
  const prefetched = useRoutePrefetchValue<NewsArticle[]>(
    prefetchKeys.newsLatest(i18n.language, limit, tournamentId)
  );

  const { data, error, isLoading, mutate } = useSWR<NewsArticle[]>(
    queryKeys.news.latest(i18n.language, limit, tournamentId),
    () => newsService.getLatest(i18n.language, limit, tournamentId),
    {
      fallbackData: prefetched,
    }
  );

  return {
    latestNews: data ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}

export function useNewsById(id: number | null) {
  const { i18n } = useTranslation();
  const prefetched = useRoutePrefetchValue<NewsArticle | null>(
    id ? prefetchKeys.newsById(id, i18n.language) : null
  );

  const { data, error, isLoading, mutate } = useSWR<NewsArticle | null>(
    id ? queryKeys.news.byId(id, i18n.language) : null,
    () => (id ? newsService.getById(id, i18n.language) : null),
    {
      fallbackData: prefetched,
    }
  );

  return {
    news: data ?? null,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
