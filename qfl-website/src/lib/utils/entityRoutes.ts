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
