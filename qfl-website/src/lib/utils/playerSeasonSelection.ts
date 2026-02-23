export type TournamentId = 'pl' | '1l' | 'cup' | '2l' | 'el';

export interface PlayerSeasonSelectorItem {
  seasonId: number;
  seasonName: string;
  year: string;
  tournamentName: string;
}

export interface PlayerPreSeasonConfig {
  seasonStarted: boolean;
  currentSeasonId: number;
  previousSeasonId: number;
}

interface ResolveDefaultPlayerSeasonIdOptions {
  items: PlayerSeasonSelectorItem[];
  seasonFromUrl: string | null;
  tournamentFromUrl: string | null;
  preSeasonConfig: PlayerPreSeasonConfig;
}

interface BuildCanonicalPlayerQueryOptions {
  seasonId: number;
  inferredTournamentId: TournamentId | null;
  currentTournamentFromUrl: string | null;
}

const TOURNAMENT_IDS: TournamentId[] = ['pl', '1l', 'cup', '2l', 'el'];

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[_-]/g, ' ')
    .replace(/[^a-z0-9а-яәіңғүұқөһ\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeTournamentId(value: string | null | undefined): TournamentId | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase() as TournamentId;
  return TOURNAMENT_IDS.includes(normalized) ? normalized : null;
}

function parsePositiveSeasonId(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function hasSeason(items: PlayerSeasonSelectorItem[], seasonId: number): boolean {
  return items.some((item) => item.seasonId === seasonId);
}

function resolvePremierDefaultSeasonId(
  premierItems: PlayerSeasonSelectorItem[],
  preSeasonConfig: PlayerPreSeasonConfig
): number | null {
  if (premierItems.length === 0) return null;

  if (!preSeasonConfig.seasonStarted) {
    const previousSeason = premierItems.find(
      (item) => item.seasonId === preSeasonConfig.previousSeasonId
    );
    if (previousSeason) {
      return previousSeason.seasonId;
    }
  }

  const sortedBySeason = [...premierItems].sort((a, b) => b.seasonId - a.seasonId);
  return sortedBySeason[0]?.seasonId ?? null;
}

function resolveLegacyFallbackSeasonId(
  items: PlayerSeasonSelectorItem[],
  urlSeasonId: number | null,
  preSeasonConfig: PlayerPreSeasonConfig
): number | null {
  if (urlSeasonId !== null && hasSeason(items, urlSeasonId)) {
    return urlSeasonId;
  }

  if (!preSeasonConfig.seasonStarted) {
    const previousSeason = items.find((item) => item.seasonId === preSeasonConfig.previousSeasonId);
    if (previousSeason) {
      return previousSeason.seasonId;
    }

    const any2025 = items.find((item) => item.year === '2025');
    if (any2025) {
      return any2025.seasonId;
    }
  }

  return items[0]?.seasonId ?? null;
}

export function inferTournamentIdFromItem(
  item: PlayerSeasonSelectorItem
): TournamentId | null {
  const haystack = normalizeText(`${item.tournamentName} ${item.seasonName}`);
  if (!haystack) return null;

  if (haystack.includes('премьер') || haystack.includes('premier')) {
    return 'pl';
  }

  if (
    haystack.includes('первая лига') ||
    haystack.includes('бірінші лига') ||
    haystack.includes('биринши лига') ||
    haystack.includes('first league')
  ) {
    return '1l';
  }

  if (
    haystack.includes('вторая лига') ||
    haystack.includes('екінші лига') ||
    haystack.includes('second league')
  ) {
    return '2l';
  }

  if (
    haystack.includes('женская лига') ||
    haystack.includes('әйелдер лигасы') ||
    haystack.includes('әйелдер лига') ||
    haystack.includes('womens league') ||
    haystack.includes('women s league') ||
    haystack.includes('women league')
  ) {
    return 'el';
  }

  if (
    haystack.includes('кубок') ||
    haystack.includes('кубогы') ||
    haystack.includes('cup')
  ) {
    return 'cup';
  }

  return null;
}

export function resolveDefaultPlayerSeasonId({
  items,
  seasonFromUrl,
  tournamentFromUrl,
  preSeasonConfig,
}: ResolveDefaultPlayerSeasonIdOptions): number | null {
  if (items.length === 0) return null;

  const parsedUrlSeason = parsePositiveSeasonId(seasonFromUrl);
  const hasValidUrlSeason = parsedUrlSeason !== null && hasSeason(items, parsedUrlSeason);
  const normalizedTournamentFromUrl = normalizeTournamentId(tournamentFromUrl);

  if (normalizedTournamentFromUrl === 'pl' && parsedUrlSeason !== null && hasValidUrlSeason) {
    return parsedUrlSeason;
  }

  if (tournamentFromUrl === null && parsedUrlSeason !== null && hasValidUrlSeason) {
    return parsedUrlSeason;
  }

  const premierItems = items.filter((item) => inferTournamentIdFromItem(item) === 'pl');
  if (premierItems.length > 0) {
    return resolvePremierDefaultSeasonId(premierItems, preSeasonConfig);
  }

  return resolveLegacyFallbackSeasonId(items, parsedUrlSeason, preSeasonConfig);
}

export function buildCanonicalPlayerQueryParams(
  currentSearchParams: URLSearchParams,
  options: BuildCanonicalPlayerQueryOptions
): URLSearchParams {
  const nextParams = new URLSearchParams(currentSearchParams.toString());

  nextParams.set('season', String(options.seasonId));

  if (options.inferredTournamentId) {
    nextParams.set('tournament', options.inferredTournamentId);
    return nextParams;
  }

  const normalizedCurrentTournament = normalizeTournamentId(options.currentTournamentFromUrl);
  if (normalizedCurrentTournament) {
    nextParams.set('tournament', normalizedCurrentTournament);
  }

  return nextParams;
}
