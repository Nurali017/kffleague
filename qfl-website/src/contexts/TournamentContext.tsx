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
import {
  setTournamentCookie,
  getClientTournamentCookie,
} from '@/lib/tournament/cookies.client';
import { tournamentMetaService, FrontMapEntry } from '@/lib/api/services/tournamentMetaService';

const STORAGE_KEY = 'qfl_selected_tournament';

type TournamentFrontMap = Record<string, FrontMapEntry>;

function buildTournamentFromApi(
  id: string,
  entry: FrontMapEntry,
  fallback: Tournament
): Tournament {
  return {
    ...fallback,
    id,
    seasonId: entry.season_id ?? fallback.seasonId,
    type: (entry.tournament_type as Tournament['type']) ?? fallback.type,
    format: (entry.tournament_format as Tournament['format']) ?? fallback.format,
    hasTable: entry.has_table ?? fallback.hasTable,
    hasBracket: entry.has_bracket ?? fallback.hasBracket,
    sponsorName: entry.sponsor_name ?? fallback.sponsorName,
    logo: entry.logo ?? fallback.logo,
    colors: entry.colors ?? fallback.colors,
    order: entry.sort_order ?? fallback.order,
    currentRound: entry.current_round ?? fallback.currentRound,
    totalRounds: entry.total_rounds ?? fallback.totalRounds,
  };
}

function getSeasonIdFromFrontMap(
  tournamentId: string,
  frontMap: TournamentFrontMap | null
): number {
  if (frontMap) {
    const entry = frontMap[tournamentId];
    if (Number.isFinite(entry?.season_id)) {
      return Number(entry?.season_id);
    }
  }

  const tournament = getTournamentById(tournamentId);
  return tournament?.seasonId || TOURNAMENTS[DEFAULT_TOURNAMENT_ID].seasonId;
}

interface TournamentContextValue {
  currentTournament: Tournament;
  currentSeason: Season;
  effectiveSeasonId: number;
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
  initialTournamentId?: string;
}

export function TournamentProvider({
  children,
  initialTournamentId,
}: TournamentProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getInitialTournament = (): string => {
    const urlTournament = searchParams.get('tournament');
    if (urlTournament && getTournamentById(urlTournament)) {
      return urlTournament;
    }

    if (initialTournamentId && getTournamentById(initialTournamentId)) {
      return initialTournamentId;
    }

    return DEFAULT_TOURNAMENT_ID;
  };

  const initialTournament = getInitialTournament();
  const [tournamentId, setTournamentId] = useState<string>(initialTournament);
  const [frontMap, setFrontMap] = useState<TournamentFrontMap | null>(null);

  // Build tournament from API data, falling back to hardcoded config
  const currentTournament = useMemo(() => {
    const fallback = getTournamentById(tournamentId) || TOURNAMENTS[DEFAULT_TOURNAMENT_ID];
    if (frontMap && frontMap[tournamentId]) {
      return buildTournamentFromApi(tournamentId, frontMap[tournamentId], fallback);
    }
    return fallback;
  }, [tournamentId, frontMap]);

  // Build available tournaments from API + fallback
  const availableTournaments = useMemo(() => {
    if (!frontMap) {
      return getActiveTournaments();
    }

    const tournaments: Tournament[] = [];
    for (const [id, entry] of Object.entries(frontMap)) {
      const fallback = getTournamentById(id);
      if (!fallback) continue;
      tournaments.push(buildTournamentFromApi(id, entry, fallback));
    }

    // Add any hardcoded tournaments not in API
    for (const fallback of getActiveTournaments()) {
      if (!frontMap[fallback.id]) {
        tournaments.push(fallback);
      }
    }

    return tournaments.sort((a, b) => a.order - b.order);
  }, [frontMap]);

  const effectiveSeasonId = getSeasonIdFromFrontMap(currentTournament.id, frontMap);

  const seasonFromUrl = Number(searchParams.get('season'));
  const resolvedSeasonFromUrl = Number.isFinite(seasonFromUrl)
    ? seasonFromUrl
    : undefined;

  const fallbackSeason: Season = {
    id: effectiveSeasonId,
    year: String(effectiveSeasonId),
    tournaments: Object.values(TOURNAMENTS),
    isCurrentSeason: false,
  };

  const currentSeason =
    SEASONS.find((s) => s.id === resolvedSeasonFromUrl) ||
    SEASONS.find((s) => s.id === effectiveSeasonId) ||
    SEASONS.find((s) => s.isCurrentSeason) ||
    fallbackSeason;

  const roundFromUrl = Number(searchParams.get('round'));
  const currentRound = Number.isFinite(roundFromUrl)
    ? roundFromUrl
    : currentTournament.currentRound || null;

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
      const queryString = newParams.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setTournament = useCallback(
    (id: string) => {
      const tournament = getTournamentById(id);
      if (!tournament) {
        return;
      }

      setTournamentId(id);

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, id);
        setTournamentCookie(id);
      }

      const nextSeasonId = getSeasonIdFromFrontMap(id, frontMap);

      updateUrl({
        tournament: id,
        season: nextSeasonId.toString(),
        round: tournament.currentRound?.toString(),
      });
    },
    [frontMap, updateUrl]
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

  // Sync tournament from URL changes
  useEffect(() => {
    const urlTournament = searchParams.get('tournament');
    const nextTournament =
      urlTournament && getTournamentById(urlTournament) ? urlTournament : null;

    if (nextTournament && nextTournament !== tournamentId) {
      setTournamentId(nextTournament);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, nextTournament);
      }
      setTournamentCookie(nextTournament);
    }
  }, [searchParams, tournamentId]);

  // Fetch front-map on mount
  useEffect(() => {
    let isMounted = true;

    tournamentMetaService
      .getFrontMap()
      .then((map) => {
        if (isMounted) {
          setFrontMap(map);
        }
      })
      .catch(() => {
        if (isMounted) {
          setFrontMap(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update season in URL when front-map loads
  useEffect(() => {
    if (!frontMap) {
      return;
    }

    const expectedSeasonId = getSeasonIdFromFrontMap(tournamentId, frontMap);
    const seasonFromQuery = Number(searchParams.get('season'));
    if (!Number.isFinite(seasonFromQuery) || seasonFromQuery !== expectedSeasonId) {
      updateUrl({ season: expectedSeasonId.toString() });
    }
  }, [frontMap, searchParams, tournamentId, updateUrl]);

  // Sync localStorage ↔ cookie
  useEffect(() => {
    const storedTournament = localStorage.getItem(STORAGE_KEY);
    const cookieTournament = getClientTournamentCookie();

    if (storedTournament && !cookieTournament && getTournamentById(storedTournament)) {
      setTournamentCookie(storedTournament);
    }

    if (cookieTournament && !storedTournament) {
      localStorage.setItem(STORAGE_KEY, cookieTournament);
    }
  }, []);

  // Apply tournament colors as CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const colors = currentTournament.colors;
    root.style.setProperty('--league-primary', colors.primary);
    root.style.setProperty('--league-primary-light', colors.primaryLight);
    root.style.setProperty('--league-primary-dark', colors.primaryDark);
    root.style.setProperty('--league-accent', colors.accent);
    root.style.setProperty('--league-accent-soft', colors.accentSoft);
  }, [currentTournament]);

  const value = useMemo<TournamentContextValue>(
    () => ({
      currentTournament,
      currentSeason,
      effectiveSeasonId,
      currentRound,
      availableTournaments,
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
      effectiveSeasonId,
      availableTournaments,
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
