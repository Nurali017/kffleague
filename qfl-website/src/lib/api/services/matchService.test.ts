import { beforeEach, describe, expect, it, vi } from 'vitest';

import { matchService } from './matchService';
import { apiClient } from '../client';

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('matchService phase filters', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
  });

  it('passes group filter to /games', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      success: true,
      data: { groups: [], total: 0 },
    } as any);

    await matchService.getMatchCenter({
      season_id: 80,
      group: 'A',
      group_by_date: true,
      language: 'ru',
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      '/games',
      expect.objectContaining({
        season_id: 80,
        group: 'A',
        group_by_date: true,
        lang: 'ru',
      })
    );
  });

  it('passes final filter to /games', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      success: true,
      data: { groups: [], total: 0 },
    } as any);

    await matchService.getMatchCenter({
      season_id: 80,
      final: true,
      group_by_date: true,
      language: 'ru',
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      '/games',
      expect.objectContaining({
        season_id: 80,
        final: true,
        group_by_date: true,
        lang: 'ru',
      })
    );
  });
});
