import { beforeEach, describe, expect, it, vi } from 'vitest';

import { leagueService } from './leagueService';
import { apiClient } from '../client';

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('leagueService phase filters', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
  });

  it('passes group/final filters to table endpoint', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      success: true,
      data: { season_id: 80, filters: {}, table: [] },
    } as any);

    await leagueService.getTable(80, { group: 'A', final: true }, 'ru');

    expect(apiClient.get).toHaveBeenCalledWith(
      '/seasons/80/table?group=A&final=true&lang=ru'
    );
  });

  it('passes group/final filters to results-grid endpoint', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      success: true,
      data: { season_id: 80, total_tours: 0, teams: [] },
    } as any);

    await leagueService.getResultsGrid(80, { group: 'B', final: false }, 'ru');

    expect(apiClient.get).toHaveBeenCalledWith(
      '/seasons/80/results-grid',
      { group: 'B', lang: 'ru' }
    );
  });
});
