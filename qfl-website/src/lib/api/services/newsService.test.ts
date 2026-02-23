import { beforeEach, describe, expect, it, vi } from 'vitest';

import { newsService } from './newsService';
import { apiClient } from '../client';

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('newsService filters mapping', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.post).mockReset();
  });

  it('passes article_type/search/sort/date filters to backend params', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      success: true,
      data: { items: [], total: 0, page: 1, per_page: 12, pages: 0 },
    } as any);

    await newsService.getPaginated(
      'ru',
      {
        championship_code: 'pl',
        article_type: 'analytics',
        search: 'тактика',
        sort: 'likes_desc',
        dateFrom: '2026-01-01',
        dateTo: '2026-01-31',
      },
      2,
      12
    );

    expect(apiClient.get).toHaveBeenCalledWith('/news', {
      lang: 'ru',
      page: 2,
      per_page: 12,
      championship_code: 'pl',
      article_type: 'analytics',
      search: 'тактика',
      sort: 'likes_desc',
      date_from: '2026-01-01',
      date_to: '2026-01-31',
    });
  });
});
