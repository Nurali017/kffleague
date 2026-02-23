'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Tournament, Season } from '@/types/tournament';
import {
  TOURNAMENTS,
  SEASONS,
  DEFAULT_TOURNAMENT_ID,
  PRE_SEASON_CONFIG,
  getTournamentById,
  getActiveTournaments,
  isLeagueTournament,
  isCupTournament,
  getPreSeasonSeasonId,
  type PreSeasonPageHint,
} from '@/config/tournaments';
import {
  setTournamentCookie,
  getClientTournamentCookie,
} from '@/lib/tournament/cookies.client';
import { tournamentMetaService, FrontMapEntry } from '@/lib/api/services/tournamentMetaService';

const STORAGE_KEY = 'qfl_selected_tournament';

type TournamentFrontMap = Record<string, FrontMapEntry>;

interface SearchLike {
  get: (key: string) => string | null;
}

interface UpdateUrlOptions {
  replace?: boolean;
  useCurrentLocation?: boolean;
  pathname?: string;
}

function getValidTournamentId(tournamentId: string | null | undefined): string | null {
  if (!tournamentId) {
    return null;
  }

  return getTournamentById(tournamentId) ? tournamentId : null;
}

function getNumericSearchParam(search: SearchLike, key: string): number | null {
  const rawValue = search.get(key);
  if (rawValue === null) {
    return null;
  }

  const value = Number(rawValue);
  return Number.isFinite(value) ? value : null;
}

function getClientPersistedTournamentId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storageTournament = getValidTournamentId(localStorage.getItem(STORAGE_KEY));
  if (storageTournament) {
    return storageTournament;
  }

  return getValidTournamentId(getClientTournamentCookie());
}

function shouldRedirectHomeOnTournamentSwitch(pathname: string): boolean {
  const normalizedPath = pathname.split('?')[0].replace(/\/+$/, '');
  if (!normalizedPath) {
    return false;
  }

  return /^\/(?:[a-z]{2}\/)?(?:player|team|teams|matches)\/[^/]+$/i.test(normalizedPath);
}

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
    finalStageIds: entry.final_stage_ids ?? fallback.finalStageIds,
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
  tournamentSeasons: Array<{ seasonId: number; year: string }>;
  setTournament: (tournamentId: string) => void;
  setSeason: (seasonId: number) => void;
  setRound: (round: number) => void;
  isLeague: boolean;
  isCup: boolean;
  showTable: boolean;
  showBracket: boolean;
  isSwitching: boolean;
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
  const [frontMap, setFrontMap] = useState<TournamentFrontMap | null>(null);
  const [switchTargetTournamentId, setSwitchTargetTournamentId] = useState<string | null>(null);
  const autoManagedSeasonRef = useRef<number | null>(null);
  const lastResolvedTournamentIdRef = useRef<string | null>(null);

  const resolvedTournamentId = useMemo(() => {
    const tournamentFromQuery = getValidTournamentId(searchParams.get('tournament'));
    const tournamentFromSwitchTarget = getValidTournamentId(switchTargetTournamentId);
    const tournamentFromLastResolved = getValidTournamentId(lastResolvedTournamentIdRef.current);
    const tournamentFromClientPersisted = getClientPersistedTournamentId();
    const tournamentFromInitial = getValidTournamentId(initialTournamentId);

    return (
      tournamentFromQuery ||
      tournamentFromSwitchTarget ||
      tournamentFromLastResolved ||
      tournamentFromClientPersisted ||
      tournamentFromInitial ||
      DEFAULT_TOURNAMENT_ID
    );
  }, [initialTournamentId, searchParams, switchTargetTournamentId]);

  // Build tournament from API data, falling back to hardcoded config
  const currentTournament = useMemo(() => {
    const fallback = getTournamentById(resolvedTournamentId) || TOURNAMENTS[DEFAULT_TOURNAMENT_ID];
    if (frontMap && frontMap[resolvedTournamentId]) {
      return buildTournamentFromApi(resolvedTournamentId, frontMap[resolvedTournamentId], fallback);
    }
    return fallback;
  }, [frontMap, resolvedTournamentId]);

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

  const seasonFromUrl = getNumericSearchParam(searchParams, 'season');
  const fallbackSeasonId = getSeasonIdFromFrontMap(resolvedTournamentId, frontMap);

  const isAutoManagedSeason =
    seasonFromUrl !== null &&
    autoManagedSeasonRef.current !== null &&
    seasonFromUrl === autoManagedSeasonRef.current;
  const effectiveSeasonId =
    seasonFromUrl === null || isAutoManagedSeason
      ? fallbackSeasonId
      : seasonFromUrl;

  const fallbackSeason: Season = {
    id: effectiveSeasonId,
    year: String(new Date().getFullYear()),
    tournaments: Object.values(TOURNAMENTS),
    isCurrentSeason: false,
  };

  const currentSeason =
    SEASONS.find((s) => s.id === effectiveSeasonId) ||
    SEASONS.find((s) => s.isCurrentSeason) ||
    fallbackSeason;

  const roundFromUrl = getNumericSearchParam(searchParams, 'round');
  const currentRound = roundFromUrl !== null
    ? roundFromUrl
    : currentTournament.currentRound || null;

  const updateUrl = useCallback(
    (
      params: Record<string, string | undefined>,
      options: UpdateUrlOptions = {}
    ): boolean => {
      const sourceParams = options.useCurrentLocation && typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams(searchParams.toString());

      const newParams = new URLSearchParams(sourceParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined) {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      const queryString = newParams.toString();
      const targetPathname = options.pathname || pathname;
      const newUrl = queryString ? `${targetPathname}?${queryString}` : targetPathname;
      const currentUrl = typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

      if (newUrl === currentUrl) {
        return false;
      }

      if (options.replace) {
        router.replace(newUrl, { scroll: false });
      } else {
        router.push(newUrl, { scroll: false });
      }

      return true;
    },
    [router, pathname, searchParams]
  );

  const isSwitching = switchTargetTournamentId !== null;

  const setTournament = useCallback(
    (id: string) => {
      if (switchTargetTournamentId || id === resolvedTournamentId) {
        return;
      }

      const tournament = getTournamentById(id);
      if (!tournament) {
        return;
      }

      const nextSeasonId = getSeasonIdFromFrontMap(id, frontMap);
      const round = tournament.currentRound?.toString();

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, id);
        setTournamentCookie(id);
      }

      setSwitchTargetTournamentId(id);

      if (shouldRedirectHomeOnTournamentSwitch(pathname)) {
        const params = new URLSearchParams();
        params.set('tournament', id);
        params.set('season', nextSeasonId.toString());
        if (round !== undefined) {
          params.set('round', round);
        }

        const targetUrl = `/?${params.toString()}`;
        const currentUrl = typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

        if (targetUrl === currentUrl) {
          setSwitchTargetTournamentId(null);
          return;
        }

        router.push(targetUrl, { scroll: false });
        return;
      }

      const didNavigate = updateUrl(
        {
          tournament: id,
          season: nextSeasonId.toString(),
          round,
        },
        { useCurrentLocation: true }
      );

      if (!didNavigate) {
        setSwitchTargetTournamentId(null);
      }
    },
    [frontMap, pathname, resolvedTournamentId, router, searchParams, switchTargetTournamentId, updateUrl]
  );

  const setSeason = useCallback(
    (id: number) => {
      updateUrl({ season: id.toString() }, { useCurrentLocation: true });
    },
    [updateUrl]
  );

  const setRound = useCallback(
    (round: number) => {
      updateUrl({ round: round.toString() }, { useCurrentLocation: true });
    },
    [updateUrl]
  );

  // Clear switching state once URL reflects the target tournament
  useEffect(() => {
    if (switchTargetTournamentId && resolvedTournamentId === switchTargetTournamentId) {
      setSwitchTargetTournamentId(null);
    }
  }, [resolvedTournamentId, switchTargetTournamentId]);

  // Remember the latest canonical tournament to avoid SPA fallback rollback.
  useEffect(() => {
    lastResolvedTournamentIdRef.current = resolvedTournamentId;
  }, [resolvedTournamentId]);

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

  // Canonicalize tournament/season query params from resolved URL state
  useEffect(() => {
    const rawTournament = searchParams.get('tournament');
    const seasonValue = getNumericSearchParam(searchParams, 'season');
    const needsTournamentUpdate = rawTournament !== resolvedTournamentId;
    const needsSeasonUpdate =
      seasonValue === null ||
      (
        autoManagedSeasonRef.current !== null &&
        seasonValue === autoManagedSeasonRef.current &&
        seasonValue !== effectiveSeasonId
      );

    const updateParams: Record<string, string | undefined> = {};
    if (needsTournamentUpdate) {
      updateParams.tournament = resolvedTournamentId;
    }
    if (needsSeasonUpdate) {
      updateParams.season = effectiveSeasonId.toString();
      autoManagedSeasonRef.current = effectiveSeasonId;
    }

    if (Object.keys(updateParams).length === 0) {
      return;
    }

    updateUrl(updateParams, { replace: true });
  }, [effectiveSeasonId, resolvedTournamentId, searchParams, updateUrl]);

  // Keep localStorage/cookie aligned with canonical URL tournament
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedTournament = localStorage.getItem(STORAGE_KEY);
    if (storedTournament !== resolvedTournamentId) {
      localStorage.setItem(STORAGE_KEY, resolvedTournamentId);
    }

    const cookieTournament = getClientTournamentCookie();
    if (cookieTournament !== resolvedTournamentId) {
      setTournamentCookie(resolvedTournamentId);
    }
  }, [resolvedTournamentId]);

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

  const tournamentSeasons = useMemo(() => {
    if (frontMap?.[resolvedTournamentId]?.seasons?.length) {
      return frontMap[resolvedTournamentId].seasons!.map((s) => ({
        seasonId: s.season_id,
        year: String(s.year),
      }));
    }
    // No front-map data: show only the current tournament's season
    // to avoid offering invalid years (e.g. 2026 for 1L that has no 2026 season)
    const t = getTournamentById(resolvedTournamentId);
    if (t) {
      const matchingSeason = SEASONS.find((s) => s.id === t.seasonId);
      if (matchingSeason) {
        return [{ seasonId: matchingSeason.id, year: matchingSeason.year }];
      }
    }
    return SEASONS.map((s) => ({ seasonId: s.id, year: s.year }));
  }, [frontMap, resolvedTournamentId]);

  const value = useMemo<TournamentContextValue>(
    () => ({
      currentTournament,
      currentSeason,
      effectiveSeasonId,
      currentRound,
      availableTournaments,
      availableSeasons: SEASONS,
      tournamentSeasons,
      setTournament,
      setSeason,
      setRound,
      isLeague: isLeagueTournament(currentTournament),
      isCup: isCupTournament(currentTournament),
      showTable: currentTournament.hasTable,
      showBracket: currentTournament.hasBracket,
      isSwitching,
    }),
    [
      currentTournament,
      currentSeason,
      currentRound,
      effectiveSeasonId,
      availableTournaments,
      tournamentSeasons,
      setTournament,
      setSeason,
      setRound,
      isSwitching,
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

/**
 * Returns the effective season ID with pre-season override applied.
 * - hint='current' → keeps the new season (e.g. 200 for 2026 PL)
 * - hint='previous' → falls back to previous season (e.g. 61 for 2025 PL)
 *
 * Only overrides when the user hasn't manually selected a different season.
 */
export function usePreSeasonEffectiveId(hint: PreSeasonPageHint): number {
  const { effectiveSeasonId, currentTournament } = useTournament();
  const override = getPreSeasonSeasonId(currentTournament.id, hint);
  if (override !== null && effectiveSeasonId === PRE_SEASON_CONFIG.currentSeasonId) {
    return override;
  }
  return effectiveSeasonId;
}
