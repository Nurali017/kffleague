import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { SWRConfig } from 'swr';
import { renderHook, waitFor } from '@/test/utils';
import i18n from '@/i18n';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { useCupOverview, useCupSchedule } from '@/hooks';
import { cupService } from '@/lib/api/services';

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <I18nextProvider i18n={i18n}>
        <RoutePrefetchProvider>{children}</RoutePrefetchProvider>
      </I18nextProvider>
    </SWRConfig>
  );
}

describe('cup hooks', () => {
  it('calls cup overview endpoint with season and limits', async () => {
    const overviewSpy = vi.spyOn(cupService, 'getOverview').mockResolvedValue({
      season_id: 71,
      season_name: 'Cup 2025',
      tournament_name: 'Cup',
      championship_name: 'Cup',
      current_round: null,
      groups: null,
      bracket: null,
      recent_results: [],
      upcoming_games: [],
      rounds: [],
    });

    const { result } = renderHook(
      () => useCupOverview({ seasonId: 71, recentLimit: 3, upcomingLimit: 4 }),
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.overview?.season_id).toBe(71);
    });

    expect(overviewSpy).toHaveBeenCalledWith(71, i18n.language, 3, 4);
  });

  it('calls cup schedule endpoint with round_key', async () => {
    const scheduleSpy = vi.spyOn(cupService, 'getSchedule').mockResolvedValue({
      season_id: 71,
      rounds: [],
      total_games: 0,
    });

    const { result } = renderHook(
      () => useCupSchedule({ seasonId: 71, roundKey: '1_4' }),
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.schedule?.season_id).toBe(71);
    });

    expect(scheduleSpy).toHaveBeenCalledWith(71, i18n.language, '1_4');
  });
});
