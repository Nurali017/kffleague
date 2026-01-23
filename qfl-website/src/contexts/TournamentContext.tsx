'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Tournament, Season } from '@/types/tournament';
import {
  TOURNAMENTS,
  SEASONS,
  DEFAULT_TOURNAMENT_ID,
  getTournamentById,
  getActiveTournaments,
  isLeagueTournament,
  isCupTournament,
} from '@/config/tournaments';

const STORAGE_KEY = 'qfl_selected_tournament';

interface TournamentContextValue {
  currentTournament: Tournament;
  currentSeason: Season;
  currentRound: number | null;
  availableTournaments: Tournament[];
  availableSeasons: Season[];
  setTournament: (tournamentId: string) => void;
  setSeason: (seasonId: number) => void;
  setRound: (round: number) => void;
  isLeague: boolean;
  isCup: boolean;
  showTable: boolean;
  showBracket: boolean;
}

const TournamentContext = createContext<TournamentContextValue | null>(null);

interface TournamentProviderProps {
  children: ReactNode;
}

export function TournamentProvider({ children }: TournamentProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get initial tournament from URL or localStorage
  const getInitialTournament = (): string => {
    const urlTournament = searchParams.get('tournament');
    if (urlTournament && getTournamentById(urlTournament)) {
      return urlTournament;
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && getTournamentById(stored)) {
        return stored;
      }
    }

    return DEFAULT_TOURNAMENT_ID;
  };

  const [tournamentId, setTournamentId] = useState<string>(getInitialTournament);

  const currentTournament =
    getTournamentById(tournamentId) || TOURNAMENTS[DEFAULT_TOURNAMENT_ID];

  // Season from URL or default
  const seasonId = Number(searchParams.get('season')) || undefined;
  const currentSeason =
    SEASONS.find((s) => s.id === seasonId) ||
    SEASONS.find((s) => s.isCurrentSeason)!;

  // Round from URL or tournament default
  const currentRound =
    Number(searchParams.get('round')) || currentTournament.currentRound || null;

  // Update URL when tournament changes
  const updateUrl = useCallback(
    (params: Record<string, string | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined) {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });
      const newUrl = `${pathname}?${newParams.toString()}`;
      router.push(newUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setTournament = useCallback(
    (id: string) => {
      const tournament = getTournamentById(id);
      if (tournament) {
        setTournamentId(id);
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, id);
        }
        updateUrl({
          tournament: id,
          round: tournament.currentRound?.toString(),
        });
      }
    },
    [updateUrl]
  );

  const setSeason = useCallback(
    (id: number) => {
      updateUrl({ season: id.toString() });
    },
    [updateUrl]
  );

  const setRound = useCallback(
    (round: number) => {
      updateUrl({ round: round.toString() });
    },
    [updateUrl]
  );

  // Sync URL tournament param with state on mount and URL changes
  useEffect(() => {
    const urlTournament = searchParams.get('tournament');
    if (urlTournament && getTournamentById(urlTournament)) {
      setTournamentId(urlTournament);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, urlTournament);
      }
    }
  }, [searchParams]);

  const value = useMemo<TournamentContextValue>(
    () => ({
      currentTournament,
      currentSeason,
      currentRound,
      availableTournaments: getActiveTournaments(),
      availableSeasons: SEASONS,
      setTournament,
      setSeason,
      setRound,
      isLeague: isLeagueTournament(currentTournament),
      isCup: isCupTournament(currentTournament),
      showTable: currentTournament.hasTable,
      showBracket: currentTournament.hasBracket,
    }),
    [
      currentTournament,
      currentSeason,
      currentRound,
      setTournament,
      setSeason,
      setRound,
    ]
  );

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within TournamentProvider');
  }
  return context;
}
