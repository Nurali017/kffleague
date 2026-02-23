import { GameTeam } from '@/types';

export type TeamNameFontClass = 'text-[11px]' | 'text-[10px]';

export interface TeamNameSizingResult {
  fullName: string;
  displayName: string;
  fontClass: TeamNameFontClass;
}

const BASE_FONT_MAX_LENGTH = 12;
const FALLBACK_SHORTNAME_MIN_LENGTH = 25;

type TeamNameInput = Pick<
  GameTeam,
  'name' | 'short_name' | 'short_name_kz' | 'short_name_en'
>;

function normalize(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function pickShortName(team: TeamNameInput, language?: string): string | null {
  const lang = language?.toLowerCase();

  if (lang?.startsWith('kz')) {
    return normalize(team.short_name_kz) ?? normalize(team.short_name);
  }

  if (lang?.startsWith('en')) {
    return normalize(team.short_name_en) ?? normalize(team.short_name);
  }

  return normalize(team.short_name);
}

function firstWord(value: string): string {
  return value.split(/\s+/)[0] || value;
}

export function getTeamNameSizing(
  team: TeamNameInput,
  language?: string
): TeamNameSizingResult {
  const fullName = normalize(team.name) ?? '-';
  const length = fullName.length;

  if (length <= BASE_FONT_MAX_LENGTH) {
    return {
      fullName,
      displayName: fullName,
      fontClass: 'text-[11px]',
    };
  }

  if (length < FALLBACK_SHORTNAME_MIN_LENGTH) {
    return {
      fullName,
      displayName: fullName,
      fontClass: 'text-[10px]',
    };
  }

  return {
    fullName,
    displayName: pickShortName(team, language) ?? firstWord(fullName),
    fontClass: 'text-[10px]',
  };
}
