import type { CSSProperties } from 'react';
import type { Tournament, TournamentColors } from '@/types/tournament';

const DEFAULT_CHANNELS: [number, number, number] = [30, 77, 140];

type TournamentVarName =
  | '--t-primary'
  | '--t-primary-light'
  | '--t-primary-dark'
  | '--t-accent'
  | '--t-accent-soft';

export type TournamentStyleVars = CSSProperties &
  Record<TournamentVarName, string>;

function clampChannel(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function clampAlpha(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(1, Math.max(0, value));
}

export function parseRgbChannels(channels: string): [number, number, number] {
  const parts = channels
    .trim()
    .split(/\s+/)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  if (parts.length < 3) {
    return DEFAULT_CHANNELS;
  }

  return [
    clampChannel(parts[0]),
    clampChannel(parts[1]),
    clampChannel(parts[2]),
  ];
}

export function rgb(channels: string): string {
  const [red, green, blue] = parseRgbChannels(channels);
  return `rgb(${red}, ${green}, ${blue})`;
}

export function rgbAlpha(channels: string, alpha: number): string {
  const [red, green, blue] = parseRgbChannels(channels);
  return `rgba(${red}, ${green}, ${blue}, ${clampAlpha(alpha)})`;
}

export function getTournamentStyleVars(
  source: Pick<Tournament, 'colors'> | TournamentColors
): TournamentStyleVars {
  const colors = 'colors' in source ? source.colors : source;

  return {
    '--t-primary': colors.primary,
    '--t-primary-light': colors.primaryLight,
    '--t-primary-dark': colors.primaryDark,
    '--t-accent': colors.accent,
    '--t-accent-soft': colors.accentSoft,
  };
}
