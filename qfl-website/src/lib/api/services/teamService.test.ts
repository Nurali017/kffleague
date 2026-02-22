import { beforeEach, describe, expect, it, vi } from 'vitest';
import { teamService } from './teamService';
import { ENDPOINTS } from '../endpoints';
import { apiClient } from '../client';

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('teamService.getTeams', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads season participants and maps response', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      success: true,
      data: {
        items: [
          { team_id: 1, team_name: 'Astana', team_logo: '/logos/1.png' },
          { team_id: 2, team_name: 'Kairat', team_logo: '/logos/2.png' },
        ],
        total: 2,
      },
    } as any);

    const teams = await teamService.getTeams(61, 'ru');

    expect(apiClient.get).toHaveBeenCalledWith(ENDPOINTS.SEASON_TEAMS(61), {
      lang: 'ru',
    });
    expect(teams).toEqual([
      { id: 1, name: 'Astana', logo_url: '/logos/1.png' },
      { id: 2, name: 'Kairat', logo_url: '/logos/2.png' },
    ]);
  });

  it('uses fallback name when localized team name is missing', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      success: true,
      data: {
        items: [{ team_id: 77, team_name: null, team_logo: null }],
        total: 1,
      },
    } as any);

    await expect(teamService.getTeams(71, 'ru')).resolves.toEqual([
      { id: 77, name: 'Team #77', logo_url: undefined },
    ]);
  });

  it('throws when season teams endpoint fails', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      success: false,
      data: null,
      error: { message: 'teams failed', status: 500 },
    } as any);

    await expect(teamService.getTeams(61, 'ru')).rejects.toThrow('teams failed');
  });
});
