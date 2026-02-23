import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { CupOverviewResponse, CupScheduleResponse } from '@/types';
import { getErrorMessage } from '@/lib/i18n/errorMessages';

export const cupService = {
  async getOverview(
    seasonId: number,
    language?: string,
    recentLimit: number = 5,
    upcomingLimit: number = 5
  ): Promise<CupOverviewResponse> {
    const response = await apiClient.get<CupOverviewResponse>(
      ENDPOINTS.CUP_OVERVIEW(seasonId),
      {
        ...(language ? { lang: language } : {}),
        recent_limit: recentLimit,
        upcoming_limit: upcomingLimit,
      }
    );

    if (!response.success) {
      throw new Error(response.error?.message || getErrorMessage('fetchCupOverview'));
    }

    return response.data;
  },

  async getSchedule(
    seasonId: number,
    language?: string,
    roundKey?: string
  ): Promise<CupScheduleResponse> {
    const response = await apiClient.get<CupScheduleResponse>(
      ENDPOINTS.CUP_SCHEDULE(seasonId),
      {
        ...(language ? { lang: language } : {}),
        ...(roundKey ? { round_key: roundKey } : {}),
      }
    );

    if (!response.success) {
      throw new Error(response.error?.message || getErrorMessage('fetchCupSchedule'));
    }

    return response.data;
  },
};
