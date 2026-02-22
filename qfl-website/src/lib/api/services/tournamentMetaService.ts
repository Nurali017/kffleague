import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { TournamentColors } from '@/types/tournament';

export interface FrontMapEntry {
  season_id: number | null;
  name?: string | null;
  tournament_type?: string | null;
  tournament_format?: string | null;
  has_table?: boolean;
  has_bracket?: boolean;
  sponsor_name?: string | null;
  logo?: string | null;
  colors?: TournamentColors | null;
  current_round?: number | null;
  total_rounds?: number | null;
  sort_order?: number;
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
