import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_LANGUAGE } from '../endpoints';
import { NewsArticle, SliderNews, NewsPagination, NewsFilters, NewsNavigation, NewsReactions } from '@/types';

export const newsService = {
  async getSlider(
    language: string = DEFAULT_LANGUAGE,
    limit: number = 5,
    tournamentId?: string
  ): Promise<SliderNews[]> {
    const params: Record<string, any> = {
      lang: language,
      limit,
    };
    if (tournamentId) params.tournament_id = tournamentId;

    const response = await apiClient.get<SliderNews[]>(ENDPOINTS.NEWS_SLIDER, params);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch slider news');
    }

    return response.data;
  },

  async getLatest(
    language: string = DEFAULT_LANGUAGE,
    limit: number = 10,
    tournamentId?: string
  ): Promise<NewsArticle[]> {
    const params: Record<string, any> = {
      lang: language,
      limit,
    };
    if (tournamentId) params.tournament_id = tournamentId;

    const response = await apiClient.get<NewsArticle[]>(ENDPOINTS.NEWS_LATEST, params);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch latest news');
    }

    return response.data;
  },

  async getById(
    id: number,
    language: string = DEFAULT_LANGUAGE
  ): Promise<NewsArticle | null> {
    const response = await apiClient.get<NewsArticle>(ENDPOINTS.NEWS_BY_ID(id), {
      lang: language,
    });

    if (!response.success) {
      return null;
    }

    return response.data;
  },

  async getPaginated(
    language: string = DEFAULT_LANGUAGE,
    filters: NewsFilters = {},
    page: number = 1,
    limit: number = 12
  ): Promise<NewsPagination> {
    const params: Record<string, any> = {
      lang: language,
      page,
      per_page: limit,  // Backend expects per_page, not limit
    };

    if (filters.tournament_id) params.tournament_id = filters.tournament_id;
    if (filters.article_type) params.article_type = filters.article_type;
    if (filters.search) params.search = filters.search;
    if (filters.sort) params.sort = filters.sort;
    if (filters.dateFrom) params.date_from = filters.dateFrom;
    if (filters.dateTo) params.date_to = filters.dateTo;

    const response = await apiClient.get<NewsPagination>(ENDPOINTS.NEWS_PAGINATED, params);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch paginated news');
    }

    return response.data;
  },

  async incrementView(id: number): Promise<void> {
    const response = await apiClient.post(ENDPOINTS.NEWS_VIEW(id), {});

    if (!response.success) {
      // Silently fail for view tracking
      console.warn('Failed to increment view count');
    }
  },

  async toggleLike(id: number): Promise<{ likes: number; liked: boolean }> {
    const response = await apiClient.post<{ likes: number; liked: boolean }>(
      ENDPOINTS.NEWS_LIKE(id),
      {}
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to toggle like');
    }

    return response.data;
  },

  async getReactions(id: number): Promise<NewsReactions> {
    const response = await apiClient.get<NewsReactions>(ENDPOINTS.NEWS_REACTIONS(id));

    if (!response.success) {
      // Return default values if endpoint fails
      return { views: 0, likes: 0, liked: false };
    }

    return response.data;
  },

  async getNavigation(
    id: number,
    language: string = DEFAULT_LANGUAGE
  ): Promise<NewsNavigation> {
    const response = await apiClient.get<NewsNavigation>(ENDPOINTS.NEWS_NAVIGATION(id), {
      lang: language,
    });

    if (!response.success) {
      return {};
    }

    return response.data;
  },
};
