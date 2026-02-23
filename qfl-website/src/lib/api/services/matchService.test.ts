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

  it('loads all grouped pages and merges date groups split by pagination', async () => {
    const game = (id: number) => ({ id } as any);

    vi.mocked(apiClient.get)
      .mockResolvedValueOnce({
        success: true,
        data: {
          total: 3,
          groups: [
            { date: '2025-05-01', date_label: '1 мая', games: [game(1)] },
            { date: '2025-05-02', date_label: '2 мая', games: [game(2)] },
          ],
        },
      } as any)
      .mockResolvedValueOnce({
        success: true,
        data: {
          total: 3,
          groups: [
            { date: '2025-05-02', date_label: '2 мая', games: [game(3)] },
          ],
        },
      } as any);

    const response = await matchService.getMatchCenterAll({
      season_id: 80,
      group_by_date: true,
      language: 'ru',
    });

    expect(apiClient.get).toHaveBeenNthCalledWith(
      1,
      '/games',
      expect.objectContaining({
        season_id: 80,
        group_by_date: true,
        lang: 'ru',
        limit: 100,
        offset: 0,
      })
    );
    expect(apiClient.get).toHaveBeenNthCalledWith(
      2,
      '/games',
      expect.objectContaining({
        season_id: 80,
        group_by_date: true,
        lang: 'ru',
        limit: 100,
        offset: 100,
      })
    );

    expect(response.total).toBe(3);
    expect('groups' in response).toBe(true);
    if ('groups' in response) {
      expect(response.groups).toHaveLength(2);
      expect(response.groups[0].games.map((g: any) => g.id)).toEqual([1]);
      expect(response.groups[1].games.map((g: any) => g.id)).toEqual([2, 3]);
    }
  });
});
