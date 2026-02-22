import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { newsService } from '@/lib/api/services';
import { NewsReactions } from '@/types';
import { queryKeys } from '@/lib/api/queryKeys';
import { useRoutePrefetchValue } from '@/contexts/RoutePrefetchContext';
import { prefetchKeys } from '@/lib/api/prefetchKeys';

interface UseNewsReactionsResult {
  reactions: NewsReactions;
  loading: boolean;
  error: any;
  incrementView: () => Promise<void>;
  toggleLike: () => Promise<void>;
  refetch: () => void;
}

export function useNewsReactions(newsId: number | null): UseNewsReactionsResult {
  const [isLiking, setIsLiking] = useState(false);
  const prefetched = useRoutePrefetchValue<NewsReactions>(
    newsId ? prefetchKeys.newsReactions(newsId) : null
  );

  const { data, error, isLoading, mutate } = useSWR<NewsReactions>(
    newsId ? queryKeys.news.reactions(newsId) : null,
    () => (newsId ? newsService.getReactions(newsId) : Promise.resolve({ views: 0, likes: 0 })),
    {
      fallbackData: prefetched,
      revalidateOnFocus: false,
      dedupingInterval: 10000, // 10 seconds
    }
  );

  const incrementView = useCallback(async () => {
    if (!newsId) return;

    try {
      await newsService.incrementView(newsId);
      // Refetch to get updated view count
      mutate();
    } catch (err) {
      console.warn('Failed to increment view:', err);
    }
  }, [newsId, mutate]);

  const toggleLike = useCallback(async () => {
    if (!newsId || isLiking) return;

    setIsLiking(true);

    try {
      const result = await newsService.toggleLike(newsId);

      // Optimistic update
      mutate(
        (current) => ({
          views: current?.views ?? 0,
          likes: result.likes,
          liked: result.liked,
        }),
        false
      );
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setIsLiking(false);
    }
  }, [newsId, isLiking, mutate]);

  return {
    reactions: data ?? { views: 0, likes: 0, liked: false },
    loading: isLoading,
    error,
    incrementView,
    toggleLike,
    refetch: mutate,
  };
}
