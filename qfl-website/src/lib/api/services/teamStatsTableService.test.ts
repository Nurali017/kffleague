import { beforeEach, describe, expect, it, vi } from 'vitest';
import { teamStatsTableService } from './teamStatsTableService';
import { apiClient } from '../client';

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('teamStatsTableService.getTeamStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns team stats response without local team-id filtering', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      success: true,
      data: {
        season_id: 61,
        sort_by: 'points',
        items: [
          { team_id: 13, team_name: 'Kairat' },
          { team_id: 46, team_name: 'Shakhter' },
          { team_id: 91, team_name: 'Astana' },
        ],
        total: 3,
      },
    } as any);

    const response = await teamStatsTableService.getTeamStats({
      seasonId: 61,
      language: 'ru',
    });

    expect(response.items.map((team) => team.team_id)).toEqual([13, 46, 91]);
    expect(response.total).toBe(3);
  });

  it('throws when api call fails', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      success: false,
      data: null,
      error: { message: 'Failed to fetch team statistics', status: 500 },
    } as any);

    await expect(teamStatsTableService.getTeamStats({ seasonId: 61 })).rejects.toThrow(
      'Failed to fetch team statistics'
    );
  });
});
