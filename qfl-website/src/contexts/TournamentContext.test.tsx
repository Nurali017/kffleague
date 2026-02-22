import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@/test/utils';
import { TournamentProvider, useTournament } from './TournamentContext';

const pushMock = vi.fn();
const { getFrontMapMock } = vi.hoisted(() => ({
  getFrontMapMock: vi.fn(),
}));
let searchParamsMock = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/table',
  useSearchParams: () => searchParamsMock,
}));

vi.mock('@/lib/api/services/tournamentMetaService', () => ({
  tournamentMetaService: {
    getFrontMap: getFrontMapMock,
  },
}));

function Harness() {
  const {
    effectiveSeasonId,
    secondLeagueStage,
    setSecondLeagueStage,
    setTournament,
  } = useTournament();

  return (
    <div>
      <div data-testid="season-id">{effectiveSeasonId}</div>
      <div data-testid="stage">{secondLeagueStage ?? 'none'}</div>
      <button onClick={() => setSecondLeagueStage('final')}>stage-final</button>
      <button onClick={() => setTournament('pl')}>set-pl</button>
    </div>
  );
}

describe('TournamentContext (2l stage support)', () => {
  beforeEach(() => {
    pushMock.mockReset();
    pushMock.mockImplementation((url: string) => {
      const query = url.split('?')[1] || '';
      searchParamsMock = new URLSearchParams(query);
    });

    getFrontMapMock.mockReset();
    getFrontMapMock.mockResolvedValue({
      pl: { season_id: 61 },
      '1l': { season_id: 85 },
      cup: { season_id: 71 },
      '2l': { season_id: 80, stages: { a: 80, b: 81, final: 157 } },
      el: { season_id: 84 },
    });

    searchParamsMock = new URLSearchParams('tournament=2l&stage=b');
    localStorage.clear();
    document.cookie = 'qfl_tournament=; path=/; max-age=0';
    document.cookie = 'qfl_2l_stage=; path=/; max-age=0';
  });

  it('maps stage=b to second league season 81', async () => {
    render(
      <TournamentProvider>
        <Harness />
      </TournamentProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('season-id')).toHaveTextContent('81');
      expect(screen.getByTestId('stage')).toHaveTextContent('b');
    });
  });

  it('reads second league stage from cookie when URL has no stage', async () => {
    searchParamsMock = new URLSearchParams('tournament=2l');
    document.cookie = 'qfl_2l_stage=final; path=/';

    render(
      <TournamentProvider>
        <Harness />
      </TournamentProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('season-id')).toHaveTextContent('157');
      expect(screen.getByTestId('stage')).toHaveTextContent('final');
    });
  });

  it('updates stage season mapping and clears stage when leaving 2l', async () => {
    render(
      <TournamentProvider>
        <Harness />
      </TournamentProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'stage-final' }));
    await waitFor(() => {
      expect(screen.getByTestId('season-id')).toHaveTextContent('157');
      expect(screen.getByTestId('stage')).toHaveTextContent('final');
    });
    expect(pushMock).toHaveBeenCalledWith('/table?tournament=2l&stage=final&season=157', { scroll: false });

    fireEvent.click(screen.getByRole('button', { name: 'set-pl' }));
    await waitFor(() => {
      expect(screen.getByTestId('season-id')).toHaveTextContent('61');
      expect(screen.getByTestId('stage')).toHaveTextContent('none');
    });
    expect(localStorage.getItem('qfl_2l_stage')).toBeNull();
    expect(pushMock).toHaveBeenCalledWith('/table?tournament=pl&season=61&round=26', { scroll: false });
  }, 15000);

  it('uses dynamic front-map season ids for non-2l tournaments', async () => {
    searchParamsMock = new URLSearchParams('tournament=pl');
    getFrontMapMock.mockResolvedValueOnce({
      pl: { season_id: 999 },
      '1l': { season_id: 888 },
      cup: { season_id: 777 },
      '2l': { season_id: 180, stages: { a: 180, b: 181, final: 257 } },
      el: { season_id: 666 },
    });

    render(
      <TournamentProvider>
        <Harness />
      </TournamentProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('season-id')).toHaveTextContent('999');
    });
    expect(pushMock).toHaveBeenCalledWith('/table?tournament=pl&season=999', { scroll: false });
  });
});
