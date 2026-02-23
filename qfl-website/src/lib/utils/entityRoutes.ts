import type { UrlObject } from 'url';

const TOURNAMENT_CONTEXT_KEYS = ['tournament', 'season', 'round'] as const;
const ENTITY_ROUTE_PATTERN = /^\/(?:[a-z]{2}\/)?(?:team|player|matches)\/[^/?#]+\/?$/i;

type SearchParamsLike = {
  get: (key: string) => string | null;
  toString: () => string;
};

type SearchParamsSource = SearchParamsLike | string | null | undefined;

function toPositiveInteger(value: unknown): number | null {
  if (typeof value === 'number') {
    if (!Number.isInteger(value) || value <= 0) return null;
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed) || parsed <= 0) return null;
    return parsed;
  }

  return null;
}

export function getMatchHref(id: unknown): string | null {
  const normalizedId = toPositiveInteger(id);
  if (normalizedId === null) return null;
  return `/matches/${normalizedId}`;
}

export function getPlayerHref(id: unknown): string | null {
  const normalizedId = toPositiveInteger(id);
  if (normalizedId === null) return null;
  return `/player/${normalizedId}`;
}

export function getTeamHref(id: unknown): string | null {
  const normalizedId = toPositiveInteger(id);
  if (normalizedId === null) return null;
  return `/team/${normalizedId}`;
}

function toSearchParams(source: SearchParamsSource): URLSearchParams {
  if (!source) {
    return new URLSearchParams();
  }

  if (typeof source === 'string') {
    return new URLSearchParams(source);
  }

  return new URLSearchParams(source.toString());
}

function isEntityPath(pathname: string): boolean {
  return ENTITY_ROUTE_PATTERN.test(pathname);
}

function mergeTournamentContext(
  targetParams: URLSearchParams,
  contextParams: URLSearchParams
): boolean {
  let changed = false;

  for (const key of TOURNAMENT_CONTEXT_KEYS) {
    if (targetParams.has(key)) {
      continue;
    }

    const value = contextParams.get(key);
    if (!value) {
      continue;
    }

    targetParams.set(key, value);
    changed = true;
  }

  return changed;
}

function toQueryObject(params: URLSearchParams): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};

  for (const [key, value] of params.entries()) {
    const current = result[key];
    if (current === undefined) {
      result[key] = value;
      continue;
    }

    if (Array.isArray(current)) {
      current.push(value);
      continue;
    }

    result[key] = [current, value];
  }

  return result;
}

function toSearchParamsFromQuery(query: UrlObject['query']): URLSearchParams {
  const params = new URLSearchParams();

  if (!query) {
    return params;
  }

  if (typeof query === 'string') {
    return new URLSearchParams(query);
  }

  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === undefined || rawValue === null) {
      continue;
    }

    if (Array.isArray(rawValue)) {
      rawValue.forEach((value) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      continue;
    }

    params.set(key, String(rawValue));
  }

  return params;
}

function mergeStringHrefWithContext(href: string, contextParams: URLSearchParams): string {
  if (!href.startsWith('/')) {
    return href;
  }

  const hashIndex = href.indexOf('#');
  const basePart = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hashPart = hashIndex >= 0 ? href.slice(hashIndex) : '';

  const queryIndex = basePart.indexOf('?');
  const pathname = queryIndex >= 0 ? basePart.slice(0, queryIndex) : basePart;
  if (!isEntityPath(pathname)) {
    return href;
  }

  const queryString = queryIndex >= 0 ? basePart.slice(queryIndex + 1) : '';
  const nextParams = new URLSearchParams(queryString);
  const hasUpdates = mergeTournamentContext(nextParams, contextParams);
  if (!hasUpdates) {
    return href;
  }

  const nextQuery = nextParams.toString();
  return nextQuery ? `${pathname}?${nextQuery}${hashPart}` : `${pathname}${hashPart}`;
}

function mergeObjectHrefWithContext(href: UrlObject, contextParams: URLSearchParams): UrlObject {
  const pathname = typeof href.pathname === 'string' ? href.pathname : '';
  if (!pathname.startsWith('/') || !isEntityPath(pathname)) {
    return href;
  }

  const nextParams = toSearchParamsFromQuery(href.query);
  const hasUpdates = mergeTournamentContext(nextParams, contextParams);
  if (!hasUpdates) {
    return href;
  }

  return {
    ...href,
    query: toQueryObject(nextParams),
    search: undefined,
  };
}

export function withTournamentContext(
  href: string | UrlObject,
  currentSearchParams: SearchParamsSource
): string | UrlObject {
  const contextParams = toSearchParams(currentSearchParams);

  if (typeof href === 'string') {
    return mergeStringHrefWithContext(href, contextParams);
  }

  return mergeObjectHrefWithContext(href, contextParams);
}
