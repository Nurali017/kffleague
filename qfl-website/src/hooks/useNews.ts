import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { newsService } from '@/lib/api/services';
import { SliderNews, NewsArticle } from '@/types';

interface UseSliderNewsOptions {
  limit?: number;
}

export function useSliderNews(options: UseSliderNewsOptions = {}) {
  const { i18n } = useTranslation();
  const { limit = 5 } = options;

  const { data, error, isLoading, mutate } = useSWR<SliderNews[]>(
    ['sliderNews', i18n.language, limit],
    () => newsService.getSlider(i18n.language, limit)
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
}

export function useLatestNews(options: UseLatestNewsOptions = {}) {
  const { i18n } = useTranslation();
  const { limit = 10 } = options;

  const { data, error, isLoading, mutate } = useSWR<NewsArticle[]>(
    ['latestNews', i18n.language, limit],
    () => newsService.getLatest(i18n.language, limit)
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

  const { data, error, isLoading, mutate } = useSWR<NewsArticle | null>(
    id ? ['news', id, i18n.language] : null,
    () => (id ? newsService.getById(id, i18n.language) : null)
  );

  return {
    news: data ?? null,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
