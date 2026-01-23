import useSWR from 'swr';
import { newsService } from '@/lib/api/services';
import { DEFAULT_LANGUAGE } from '@/api/endpoints';
import { SliderNews, NewsArticle } from '@/types';

interface UseSliderNewsOptions {
  language?: string;
  limit?: number;
}

export function useSliderNews(options: UseSliderNewsOptions = {}) {
  const { language = DEFAULT_LANGUAGE, limit = 5 } = options;

  const { data, error, isLoading, mutate } = useSWR<SliderNews[]>(
    ['sliderNews', language, limit],
    () => newsService.getSlider(language, limit)
  );

  return {
    sliderNews: data ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}

interface UseLatestNewsOptions {
  language?: string;
  limit?: number;
}

export function useLatestNews(options: UseLatestNewsOptions = {}) {
  const { language = DEFAULT_LANGUAGE, limit = 10 } = options;

  const { data, error, isLoading, mutate } = useSWR<NewsArticle[]>(
    ['latestNews', language, limit],
    () => newsService.getLatest(language, limit)
  );

  return {
    latestNews: data ?? [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}

interface UseNewsByIdOptions {
  language?: string;
}

export function useNewsById(id: number | null, options: UseNewsByIdOptions = {}) {
  const { language = DEFAULT_LANGUAGE } = options;

  const { data, error, isLoading, mutate } = useSWR<NewsArticle | null>(
    id ? ['news', id, language] : null,
    () => (id ? newsService.getById(id, language) : null)
  );

  return {
    news: data ?? null,
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
