import { apiClient } from '../client';
import { ENDPOINTS, DEFAULT_LANGUAGE } from '../endpoints';
import { NewsArticle, SliderNews } from '../../types';

export const newsService = {
  async getSlider(
    language: string = DEFAULT_LANGUAGE,
    limit: number = 5
  ): Promise<SliderNews[]> {
    const response = await apiClient.get<SliderNews[]>(ENDPOINTS.NEWS_SLIDER, {
      language,
      limit,
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch slider news');
    }

    return response.data;
  },

  async getLatest(
    language: string = DEFAULT_LANGUAGE,
    limit: number = 10
  ): Promise<NewsArticle[]> {
    const response = await apiClient.get<NewsArticle[]>(ENDPOINTS.NEWS_LATEST, {
      language,
      limit,
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch latest news');
    }

    return response.data;
  },
};
