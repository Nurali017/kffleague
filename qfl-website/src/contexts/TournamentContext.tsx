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
import { Tournament, Season, SecondLeagueStage } from '@/types/tournament';
import {
  TOURNAMENTS,
  SEASONS,
  DEFAULT_TOURNAMENT_ID,
  DEFAULT_SECOND_LEAGUE_STAGE,
  getTournamentById,
  getActiveTournaments,
  getSecondLeagueSeasonId,
  isLeagueTournament,
  isCupTournament,
} from '@/config/tournaments';
import {
  setTournamentCookie,
  getClientTournamentCookie,
  setSecondLeagueStageCookie,
  getClientSecondLeagueStageCookie,
  clearSecondLeagueStageCookie,
} from '@/lib/tournament/cookies.client';
import { tournamentMetaService, FrontMapEntry } from '@/lib/api/services/tournamentMetaService';

const STORAGE_KEY = 'qfl_selected_tournament';
const SECOND_LEAGUE_STAGE_STORAGE_KEY = 'qfl_2l_stage';

type TournamentFrontMap = Record<string, FrontMapEntry>;

function isSecondLeagueStage(value: string | null | undefined): value is SecondLeagueStage {
  return value === 'a' || value === 'b' || value === 'final';
}

function getFallbackSeasonId(
  tournamentId: string,
  stage: SecondLeagueStage | null
): number {
  const tournament = getTournamentById(tournamentId);
  if (tournamentId === '2l') {
    return getSecondLeagueSeasonId(stage ?? DEFAULT_SECOND_LEAGUE_STAGE);
  }
  return tournament?.seasonId || TOURNAMENTS[DEFAULT_TOURNAMENT_ID].seasonId;
}

function getSeasonIdFromFrontMap(
  tournamentId: string,
  stage: SecondLeagueStage | null,
  frontMap: TournamentFrontMap | null
): number {
  if (frontMap) {
    const entry = frontMap[tournamentId];
    if (tournamentId === '2l') {
      const stageKey = stage ?? DEFAULT_SECOND_LEAGUE_STAGE;
      const stageSeasonId = entry?.stages?.[stageKey];
      if (stageSeasonId != null && Number.isFinite(stageSeasonId)) {
        return stageSeasonId;
      }
    }
    if (Number.isFinite(entry?.season_id)) {
      return Number(entry?.season_id);
    }
  }

  return getFallbackSeasonId(tournamentId, stage);
}

interface TournamentContextValue {
  currentTournament: Tournament;
  currentSeason: Season;
  effectiveSeasonId: number;
  currentRound: number | null;
  secondLeagueStage: SecondLeagueStage | null;
  availableTournaments: Tournament[];
  availableSeasons: Season[];
  setTournament: (tournamentId: string) => void;
  setSeason: (seasonId: number) => void;
  setRound: (round: number) => void;
  setSecondLeagueStage: (stage: SecondLeagueStage) => void;
  isLeague: boolean;
  isCup: boolean;
  showTable: boolean;
  showBracket: boolean;
}

const TournamentContext = createContext<TournamentContextValue | null>(null);

interface TournamentProviderProps {
  children: ReactNode;
  initialTournamentId?: string;
  initialSecondLeagueStage?: SecondLeagueStage | null;
}

export function TournamentProvider({
  children,
  initialTournamentId,
  initialSecondLeagueStage,
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

  const getInitialSecondLeagueStage = (
    initialTournament: string
  ): SecondLeagueStage | null => {
    if (initialTournament !== '2l') {
      return null;
    }

    const urlStage = searchParams.get('stage');
    if (isSecondLeagueStage(urlStage)) {
      return urlStage;
    }

    if (initialSecondLeagueStage && isSecondLeagueStage(initialSecondLeagueStage)) {
      return initialSecondLeagueStage;
    }

    if (typeof window !== 'undefined') {
      const storedStage = localStorage.getItem(SECOND_LEAGUE_STAGE_STORAGE_KEY);
      if (isSecondLeagueStage(storedStage)) {
        return storedStage;
      }

      const cookieStage = getClientSecondLeagueStageCookie();
      if (cookieStage) {
        return cookieStage;
      }
    }

    return DEFAULT_SECOND_LEAGUE_STAGE;
  };

  const initialTournament = getInitialTournament();
  const [tournamentId, setTournamentId] = useState<string>(initialTournament);
  const [secondLeagueStage, setSecondLeagueStageState] = useState<SecondLeagueStage | null>(() =>
    getInitialSecondLeagueStage(initialTournament)
  );
  const [frontMap, setFrontMap] = useState<TournamentFrontMap | null>(null);

  const currentTournament =
    getTournamentById(tournamentId) || TOURNAMENTS[DEFAULT_TOURNAMENT_ID];

  const effectiveSeasonId = getSeasonIdFromFrontMap(
    currentTournament.id,
    secondLeagueStage,
    frontMap
  );

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

      if (id === '2l') {
        const storedStage =
          typeof window !== 'undefined'
            ? localStorage.getItem(SECOND_LEAGUE_STAGE_STORAGE_KEY)
            : null;

        const nextStage =
          secondLeagueStage ||
          (isSecondLeagueStage(storedStage) ? storedStage : null) ||
          getClientSecondLeagueStageCookie() ||
          DEFAULT_SECOND_LEAGUE_STAGE;

        setSecondLeagueStageState(nextStage);
        if (typeof window !== 'undefined') {
          localStorage.setItem(SECOND_LEAGUE_STAGE_STORAGE_KEY, nextStage);
        }
        setSecondLeagueStageCookie(nextStage);
        const nextSeasonId = getSeasonIdFromFrontMap('2l', nextStage, frontMap);

        updateUrl({
          tournament: id,
          stage: nextStage,
          season: nextSeasonId.toString(),
          round: tournament.currentRound?.toString(),
        });

        return;
      }

      setSecondLeagueStageState(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(SECOND_LEAGUE_STAGE_STORAGE_KEY);
      }
      clearSecondLeagueStageCookie();
      const nextSeasonId = getSeasonIdFromFrontMap(id, null, frontMap);

      updateUrl({
        tournament: id,
        stage: undefined,
        season: nextSeasonId.toString(),
        round: tournament.currentRound?.toString(),
      });
    },
    [frontMap, secondLeagueStage, updateUrl]
  );

  const setSecondLeagueStage = useCallback(
    (stage: SecondLeagueStage) => {
      if (tournamentId !== '2l') {
        return;
      }

      setSecondLeagueStageState(stage);
      if (typeof window !== 'undefined') {
        localStorage.setItem(SECOND_LEAGUE_STAGE_STORAGE_KEY, stage);
      }
      setSecondLeagueStageCookie(stage);
      const nextSeasonId = getSeasonIdFromFrontMap('2l', stage, frontMap);

      updateUrl({
        tournament: '2l',
        stage,
        season: nextSeasonId.toString(),
      });
    },
    [frontMap, tournamentId, updateUrl]
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

    const resolvedTournament = nextTournament ?? tournamentId;

    if (resolvedTournament === '2l') {
      const urlStage = searchParams.get('stage');
      const storedStage =
        typeof window !== 'undefined'
          ? localStorage.getItem(SECOND_LEAGUE_STAGE_STORAGE_KEY)
          : null;

      const nextStage =
        (isSecondLeagueStage(urlStage) ? urlStage : null) ||
        (isSecondLeagueStage(storedStage) ? storedStage : null) ||
        getClientSecondLeagueStageCookie() ||
        DEFAULT_SECOND_LEAGUE_STAGE;

      if (secondLeagueStage !== nextStage) {
        setSecondLeagueStageState(nextStage);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(SECOND_LEAGUE_STAGE_STORAGE_KEY, nextStage);
      }
      setSecondLeagueStageCookie(nextStage);
      return;
    }

    if (secondLeagueStage !== null) {
      setSecondLeagueStageState(null);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SECOND_LEAGUE_STAGE_STORAGE_KEY);
    }
    clearSecondLeagueStageCookie();
  }, [searchParams, secondLeagueStage, tournamentId]);

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

  useEffect(() => {
    if (!frontMap) {
      return;
    }

    const expectedSeasonId = getSeasonIdFromFrontMap(
      tournamentId,
      secondLeagueStage,
      frontMap
    );
    const seasonFromQuery = Number(searchParams.get('season'));
    if (!Number.isFinite(seasonFromQuery) || seasonFromQuery !== expectedSeasonId) {
      updateUrl({ season: expectedSeasonId.toString() });
    }
  }, [frontMap, searchParams, secondLeagueStage, tournamentId, updateUrl]);

  useEffect(() => {
    const storedTournament = localStorage.getItem(STORAGE_KEY);
    const cookieTournament = getClientTournamentCookie();

    if (storedTournament && !cookieTournament && getTournamentById(storedTournament)) {
      setTournamentCookie(storedTournament);
    }

    if (cookieTournament && !storedTournament) {
      localStorage.setItem(STORAGE_KEY, cookieTournament);
    }

    const storedStage = localStorage.getItem(SECOND_LEAGUE_STAGE_STORAGE_KEY);
    const parsedStoredStage = isSecondLeagueStage(storedStage) ? storedStage : null;
    const cookieStage = getClientSecondLeagueStageCookie();

    if (parsedStoredStage && !cookieStage) {
      setSecondLeagueStageCookie(parsedStoredStage);
    }

    if (cookieStage && !parsedStoredStage) {
      localStorage.setItem(SECOND_LEAGUE_STAGE_STORAGE_KEY, cookieStage);
    }
  }, []);

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
      secondLeagueStage,
      availableTournaments: getActiveTournaments(),
      availableSeasons: SEASONS,
      setTournament,
      setSeason,
      setRound,
      setSecondLeagueStage,
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
      secondLeagueStage,
      setTournament,
      setSeason,
      setRound,
      setSecondLeagueStage,
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
