import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@/test/utils';
import { TournamentProvider, useTournament } from './TournamentContext';

const pushMock = vi.fn();
const replaceMock = vi.fn();
const { getFrontMapMock } = vi.hoisted(() => ({
  getFrontMapMock: vi.fn(),
}));
let searchParamsMock = new URLSearchParams();
let pathnameMock = '/table';

function applyNavigation(url: string) {
  const parsed = new URL(url, 'http://localhost');
  pathnameMock = parsed.pathname;
  searchParamsMock = new URLSearchParams(parsed.search);
  window.history.replaceState({}, '', `${parsed.pathname}${parsed.search}`);
}

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
  usePathname: () => pathnameMock,
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
    isSwitching,
  } = useTournament();

  return (
    <div>
      <div data-testid="season-id">{effectiveSeasonId}</div>
      <div data-testid="tournament-id">{currentTournament.id}</div>
      <div data-testid="is-switching">{String(isSwitching)}</div>
      <button onClick={() => setTournament('pl')}>set-pl</button>
      <button onClick={() => setTournament('2l')}>set-2l</button>
      <button onClick={() => setTournament('cup')}>set-cup</button>
    </div>
  );
}

describe('TournamentContext', () => {
  beforeEach(() => {
    pushMock.mockReset();
    replaceMock.mockReset();

    pushMock.mockImplementation((url: string) => {
      applyNavigation(url);
    });
    replaceMock.mockImplementation((url: string) => {
      applyNavigation(url);
    });

    getFrontMapMock.mockReset();
    getFrontMapMock.mockResolvedValue({
      pl: { season_id: 61, has_table: true, has_bracket: false, sort_order: 1 },
      '1l': { season_id: 85, has_table: true, has_bracket: false, sort_order: 2 },
      cup: { season_id: 71, has_table: false, has_bracket: true, sort_order: 3 },
      '2l': { season_id: 80, has_table: true, has_bracket: false, sort_order: 4 },
      el: { season_id: 84, has_table: true, has_bracket: false, sort_order: 5 },
    });

    pathnameMock = '/table';
    searchParamsMock = new URLSearchParams('tournament=pl');
    window.history.replaceState({}, '', '/table?tournament=pl');
    localStorage.clear();
    document.cookie = 'qfl_tournament=; path=/; max-age=0';
  });

  it('maps 2l to unified season 80', async () => {
    pathnameMock = '/table';
    searchParamsMock = new URLSearchParams('tournament=2l');
    window.history.replaceState({}, '', '/table?tournament=2l');

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

  it('canonicalizes missing season in query via replace', async () => {
    render(
      <TournamentProvider>
        <Harness />
      </TournamentProvider>
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/table?tournament=pl&season=61', { scroll: false });
    });
  });

  it('uses dynamic front-map season ids for canonicalization', async () => {
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
      expect(replaceMock).toHaveBeenCalledWith('/table?tournament=pl&season=999', { scroll: false });
    });
  });

  it('prefers client persisted tournament over initial fallback when query is missing', async () => {
    pathnameMock = '/table';
    searchParamsMock = new URLSearchParams();
    window.history.replaceState({}, '', '/table');
    localStorage.setItem('qfl_selected_tournament', '2l');

    render(
      <TournamentProvider initialTournamentId="pl">
        <Harness />
      </TournamentProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tournament-id')).toHaveTextContent('2l');
      expect(replaceMock).toHaveBeenCalledWith('/table?tournament=2l&season=80', { scroll: false });
    });
  });

  it('keeps tournament when route changes to detail page without query', async () => {
    pathnameMock = '/table';
    searchParamsMock = new URLSearchParams('tournament=2l&season=80');
    window.history.replaceState({}, '', '/table?tournament=2l&season=80');

    const { rerender } = render(
      <TournamentProvider>
        <Harness />
      </TournamentProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tournament-id')).toHaveTextContent('2l');
      expect(screen.getByTestId('season-id')).toHaveTextContent('80');
    });

    replaceMock.mockClear();
    pathnameMock = '/matches/123';
    searchParamsMock = new URLSearchParams();
    window.history.replaceState({}, '', '/matches/123');

    rerender(
      <TournamentProvider>
        <Harness />
      </TournamentProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tournament-id')).toHaveTextContent('2l');
      expect(replaceMock).toHaveBeenCalledWith('/matches/123?tournament=2l&season=80', { scroll: false });
    });
  });

  it('switches between tournaments using URL-first navigation', async () => {
    render(
      <TournamentProvider>
        <Harness />
      </TournamentProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('season-id')).toHaveTextContent('61');
    });

    pushMock.mockClear();
    fireEvent.click(screen.getByRole('button', { name: 'set-2l' }));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/table?tournament=2l&season=80', { scroll: false });
      expect(screen.getByTestId('season-id')).toHaveTextContent('80');
    });

    fireEvent.click(screen.getByRole('button', { name: 'set-pl' }));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/table?tournament=pl&season=61&round=26', { scroll: false });
      expect(screen.getByTestId('season-id')).toHaveTextContent('61');
    });
  }, 15000);

  it('redirects to selected tournament home from details routes', async () => {
    pathnameMock = '/player/157';
    searchParamsMock = new URLSearchParams('tournament=pl&season=61');
    window.history.replaceState({}, '', '/player/157?tournament=pl&season=61');

    render(
      <TournamentProvider>
        <Harness />
      </TournamentProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('season-id')).toHaveTextContent('61');
    });

    pushMock.mockClear();
    fireEvent.click(screen.getByRole('button', { name: 'set-cup' }));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/?tournament=cup&season=71', { scroll: false });
    });
  });

  it('keeps current route on match center list', async () => {
    pathnameMock = '/matches';
    searchParamsMock = new URLSearchParams('tournament=pl&season=61');
    window.history.replaceState({}, '', '/matches?tournament=pl&season=61');

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
      expect(pushMock).toHaveBeenCalledWith('/matches?tournament=2l&season=80', { scroll: false });
    });
  });

  it('prevents rapid multi-switch while navigation is in-flight on list routes', async () => {
    pathnameMock = '/table';
    searchParamsMock = new URLSearchParams('tournament=pl&season=61');
    window.history.replaceState({}, '', '/table?tournament=pl&season=61');

    const pushCalls: string[] = [];
    pushMock.mockReset();
    pushMock.mockImplementation((url: string) => {
      pushCalls.push(url);
      // Simulate in-flight transition: URL/search params not updated yet.
    });

    render(
      <TournamentProvider>
        <Harness />
      </TournamentProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('season-id')).toHaveTextContent('61');
    });

    fireEvent.click(screen.getByRole('button', { name: 'set-2l' }));
    fireEvent.click(screen.getByRole('button', { name: 'set-cup' }));
    fireEvent.click(screen.getByRole('button', { name: 'set-pl' }));

    await waitFor(() => {
      expect(pushCalls).toEqual(['/table?tournament=2l&season=80']);
      expect(screen.getByTestId('is-switching')).toHaveTextContent('true');
    });
  });

  it('prevents rapid multi-switch while navigation is in-flight on details routes', async () => {
    pathnameMock = '/team/91';
    searchParamsMock = new URLSearchParams('tournament=pl&season=61');
    window.history.replaceState({}, '', '/team/91?tournament=pl&season=61');

    const pushCalls: string[] = [];
    pushMock.mockReset();
    pushMock.mockImplementation((url: string) => {
      pushCalls.push(url);
      // Simulate in-flight transition: URL/search params not updated yet.
    });

    render(
      <TournamentProvider>
        <Harness />
      </TournamentProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('season-id')).toHaveTextContent('61');
    });

    fireEvent.click(screen.getByRole('button', { name: 'set-2l' }));
    fireEvent.click(screen.getByRole('button', { name: 'set-cup' }));

    await waitFor(() => {
      expect(pushCalls).toEqual(['/?tournament=2l&season=80']);
      expect(screen.getByTestId('is-switching')).toHaveTextContent('true');
    });
  });

  it('does not navigate when selecting active tournament', async () => {
    searchParamsMock = new URLSearchParams('tournament=pl&season=61');
    window.history.replaceState({}, '', '/table?tournament=pl&season=61');

    render(
      <TournamentProvider>
        <Harness />
      </TournamentProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('season-id')).toHaveTextContent('61');
    });

    pushMock.mockClear();
    fireEvent.click(screen.getByRole('button', { name: 'set-pl' }));
    expect(pushMock).not.toHaveBeenCalled();
  });
});
