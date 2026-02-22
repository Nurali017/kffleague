import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useMatchLineup } from './useMatchLineup';

const swrMockFn = vi.fn();
const getMatchLineupMock = vi.fn();

vi.mock('swr', () => ({
  default: (...args: unknown[]) => swrMockFn(...args),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'ru' },
  }),
}));

vi.mock('@/contexts/RoutePrefetchContext', () => ({
  useRoutePrefetchValue: () => undefined,
}));

vi.mock('@/lib/api/services/matchService', () => ({
  matchService: {
    getMatchLineup: (...args: unknown[]) => getMatchLineupMock(...args),
  },
}));

describe('useMatchLineup', () => {
  beforeEach(() => {
    swrMockFn.mockReset();
    getMatchLineupMock.mockReset();
    swrMockFn.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    });
  });

  it('enables live polling config for live matches', () => {
    useMatchLineup(1, true);

    expect(swrMockFn).toHaveBeenCalledWith(
      ['/games', 1, 'lineup', 'ru'],
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        refreshInterval: 30000,
        dedupingInterval: 5000,
      }),
    );
  });

  it('uses static cache config for non-live matches', () => {
    useMatchLineup(1, false);

    expect(swrMockFn).toHaveBeenCalledWith(
      ['/games', 1, 'lineup', 'ru'],
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: false,
        refreshInterval: 0,
        dedupingInterval: 300000,
      }),
    );
  });
});
