import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';

export interface FrontMapEntry {
  season_id: number | null;
  stages?: Record<string, number> | null;
}

interface FrontMapResponse {
  items: Record<string, FrontMapEntry>;
}

export const tournamentMetaService = {
  async getFrontMap(language?: string): Promise<Record<string, FrontMapEntry>> {
    const response = await apiClient.get<FrontMapResponse>(
      ENDPOINTS.CHAMPIONSHIPS_FRONT_MAP,
      language ? { lang: language } : undefined
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch tournament front map');
    }

    return response.data.items || {};
  },
};
