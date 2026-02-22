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
    setTournament,
    currentTournament,
  } = useTournament();

  return (
    <div>
      <div data-testid="season-id">{effectiveSeasonId}</div>
      <div data-testid="tournament-id">{currentTournament.id}</div>
      <button onClick={() => setTournament('pl')}>set-pl</button>
      <button onClick={() => setTournament('2l')}>set-2l</button>
    </div>
  );
}

describe('TournamentContext', () => {
  beforeEach(() => {
    pushMock.mockReset();
    pushMock.mockImplementation((url: string) => {
      const query = url.split('?')[1] || '';
      searchParamsMock = new URLSearchParams(query);
    });

    getFrontMapMock.mockReset();
    getFrontMapMock.mockResolvedValue({
      pl: { season_id: 61, has_table: true, has_bracket: false, sort_order: 1 },
      '1l': { season_id: 85, has_table: true, has_bracket: false, sort_order: 2 },
      cup: { season_id: 71, has_table: false, has_bracket: true, sort_order: 3 },
      '2l': { season_id: 80, has_table: true, has_bracket: false, sort_order: 4 },
      el: { season_id: 84, has_table: true, has_bracket: false, sort_order: 5 },
    });

    searchParamsMock = new URLSearchParams('tournament=pl');
    localStorage.clear();
    document.cookie = 'qfl_tournament=; path=/; max-age=0';
  });

  it('maps 2l to unified season 80', async () => {
    searchParamsMock = new URLSearchParams('tournament=2l');
    render(
      <TournamentProvider>
        <Harness />
      </TournamentProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('season-id')).toHaveTextContent('80');
      expect(screen.getByTestId('tournament-id')).toHaveTextContent('2l');
    });
  });

  it('switches between tournaments correctly', async () => {
    render(
      <TournamentProvider>
        <Harness />
      </TournamentProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('season-id')).toHaveTextContent('61');
    });

    fireEvent.click(screen.getByRole('button', { name: 'set-2l' }));
    await waitFor(() => {
      expect(screen.getByTestId('season-id')).toHaveTextContent('80');
    });

    fireEvent.click(screen.getByRole('button', { name: 'set-pl' }));
    await waitFor(() => {
      expect(screen.getByTestId('season-id')).toHaveTextContent('61');
    });
    expect(pushMock).toHaveBeenCalledWith('/table?tournament=pl&season=61&round=26', { scroll: false });
  }, 15000);

  it('uses dynamic front-map season ids', async () => {
    searchParamsMock = new URLSearchParams('tournament=pl');
    getFrontMapMock.mockResolvedValueOnce({
      pl: { season_id: 999, has_table: true, sort_order: 1 },
      '1l': { season_id: 888, has_table: true, sort_order: 2 },
      cup: { season_id: 777, has_bracket: true, sort_order: 3 },
      '2l': { season_id: 180, has_table: true, sort_order: 4 },
      el: { season_id: 666, has_table: true, sort_order: 5 },
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
