import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test/utils';
import PlayersStatsPage from './page';

const {
  usePlayerStatsMock,
  useTeamsMock,
  useTournamentMock,
  usePreSeasonEffectiveIdMock,
} = vi.hoisted(() => ({
  usePlayerStatsMock: vi.fn(),
  useTeamsMock: vi.fn(),
  useTournamentMock: vi.fn(),
  usePreSeasonEffectiveIdMock: vi.fn(),
}));

vi.mock('@/hooks', () => ({
  usePlayerStats: (...args: unknown[]) => usePlayerStatsMock(...args),
  useTeams: (...args: unknown[]) => useTeamsMock(...args),
}));

vi.mock('@/contexts/TournamentContext', () => ({
  useTournament: () => useTournamentMock(),
  usePreSeasonEffectiveId: (...args: unknown[]) => usePreSeasonEffectiveIdMock(...args),
}));

vi.mock('@/config/tournaments', () => ({
  PRE_SEASON_CONFIG: { seasonStarted: false, previousSeasonId: 61 },
}));

vi.mock('@/components/statistics/StatisticsSubTabs', () => ({
  StatisticsSubTabs: () => <div data-testid="stats-subtabs" />,
}));

vi.mock('@/components/statistics/StatisticsFilters', () => ({
  StatisticsFilters: () => <div data-testid="stats-filters" />,
}));

vi.mock('@/components/statistics/PlayerStatsTable', () => ({
  PlayerStatsTable: () => <div data-testid="player-stats-table" />,
}));

describe('Players stats page season selection', () => {
  beforeEach(() => {
    usePlayerStatsMock.mockReset();
    useTeamsMock.mockReset();
    useTournamentMock.mockReset();
    usePreSeasonEffectiveIdMock.mockReset();

    useTournamentMock.mockReturnValue({});
    usePreSeasonEffectiveIdMock.mockReturnValue(180);
    usePlayerStatsMock.mockReturnValue({
      players: [],
      loading: false,
      error: null,
    });
    useTeamsMock.mockReturnValue({
      teams: [],
      loading: false,
      error: null,
    });
  });

  it('uses effectiveSeasonId for both players stats and teams filter', () => {
    renderWithProviders(<PlayersStatsPage />);

    const firstCallArg = usePlayerStatsMock.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(usePlayerStatsMock).toHaveBeenCalledWith(
      expect.objectContaining({ seasonId: 180 })
    );
    expect(firstCallArg).not.toHaveProperty('positionCode');
    expect(useTeamsMock).toHaveBeenCalledWith(180);
    expect(usePlayerStatsMock).not.toHaveBeenCalledWith(
      expect.objectContaining({ seasonId: 61 })
    );
    expect(useTeamsMock).not.toHaveBeenCalledWith(61);
  });
});
