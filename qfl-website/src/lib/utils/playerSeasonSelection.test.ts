import { describe, expect, it } from 'vitest';
import {
  buildCanonicalPlayerQueryParams,
  inferTournamentIdFromItem,
  resolveDefaultPlayerSeasonId,
  type PlayerSeasonSelectorItem,
} from './playerSeasonSelection';

const preSeasonConfig = {
  seasonStarted: false,
  currentSeasonId: 200,
  previousSeasonId: 61,
} as const;

const seasonStartedConfig = {
  seasonStarted: true,
  currentSeasonId: 200,
  previousSeasonId: 61,
} as const;

function item(
  seasonId: number,
  tournamentName: string,
  seasonName: string,
  year: string
): PlayerSeasonSelectorItem {
  return { seasonId, tournamentName, seasonName, year };
}

describe('playerSeasonSelection', () => {
  describe('inferTournamentIdFromItem', () => {
    it('infers tournament codes from ru/kz/en names', () => {
      expect(inferTournamentIdFromItem(item(200, 'Премьер-Лига', 'Премьер-Лига 2026', '2026'))).toBe('pl');
      expect(inferTournamentIdFromItem(item(85, 'Бірінші Лига', 'Бірінші Лига 2025', '2025'))).toBe('1l');
      expect(inferTournamentIdFromItem(item(71, 'Кубок Казахстана', 'Кубок Казахстана 2025', '2025'))).toBe('cup');
      expect(inferTournamentIdFromItem(item(80, 'Second League', 'Second League 2025', '2025'))).toBe('2l');
      expect(inferTournamentIdFromItem(item(84, 'Әйелдер Лигасы', 'Әйелдер Лигасы 2025', '2025'))).toBe('el');
      expect(inferTournamentIdFromItem(item(777, 'Unknown Tournament', 'Unknown 2025', '2025'))).toBeNull();
    });
  });

  describe('resolveDefaultPlayerSeasonId', () => {
    const itemsWithPremier = [
      item(200, 'Премьер-Лига', 'Премьер-Лига 2026', '2026'),
      item(80, 'Вторая лига', 'Вторая лига 2025', '2025'),
      item(61, 'Премьер-Лига', 'Премьер-Лига 2025', '2025'),
    ];

    it('uses previous premier league season in pre-season when available', () => {
      const resolved = resolveDefaultPlayerSeasonId({
        items: itemsWithPremier,
        seasonFromUrl: null,
        tournamentFromUrl: null,
        preSeasonConfig,
      });

      expect(resolved).toBe(61);
    });

    it('uses latest premier league season when season has started', () => {
      const resolved = resolveDefaultPlayerSeasonId({
        items: itemsWithPremier,
        seasonFromUrl: null,
        tournamentFromUrl: null,
        preSeasonConfig: seasonStartedConfig,
      });

      expect(resolved).toBe(200);
    });

    it('ignores non-premier URL context when premier league is available', () => {
      const resolved = resolveDefaultPlayerSeasonId({
        items: itemsWithPremier,
        seasonFromUrl: '80',
        tournamentFromUrl: '2l',
        preSeasonConfig,
      });

      expect(resolved).toBe(61);
    });

    it('respects URL season when tournament=pl and season is valid', () => {
      const resolved = resolveDefaultPlayerSeasonId({
        items: itemsWithPremier,
        seasonFromUrl: '200',
        tournamentFromUrl: 'pl',
        preSeasonConfig,
      });

      expect(resolved).toBe(200);
    });

    it('respects explicit season deep-link when tournament is missing', () => {
      const resolved = resolveDefaultPlayerSeasonId({
        items: itemsWithPremier,
        seasonFromUrl: '80',
        tournamentFromUrl: null,
        preSeasonConfig,
      });

      expect(resolved).toBe(80);
    });

    it('falls back to available seasons when player has no premier league entries', () => {
      const itemsWithoutPremier = [
        item(80, 'Вторая лига', 'Вторая лига 2025', '2025'),
        item(71, 'Кубок Казахстана', 'Кубок Казахстана 2025', '2025'),
      ];

      const resolved = resolveDefaultPlayerSeasonId({
        items: itemsWithoutPremier,
        seasonFromUrl: null,
        tournamentFromUrl: '2l',
        preSeasonConfig,
      });

      expect(resolved).toBe(80);
    });
  });

  describe('buildCanonicalPlayerQueryParams', () => {
    it('updates season/tournament and preserves unrelated query params', () => {
      const current = new URLSearchParams('tournament=2l&season=80&round=5&foo=bar');
      const next = buildCanonicalPlayerQueryParams(current, {
        seasonId: 61,
        inferredTournamentId: 'pl',
        currentTournamentFromUrl: '2l',
      });

      expect(next.get('season')).toBe('61');
      expect(next.get('tournament')).toBe('pl');
      expect(next.get('round')).toBe('5');
      expect(next.get('foo')).toBe('bar');
    });

    it('keeps current tournament if inferred tournament is unavailable', () => {
      const current = new URLSearchParams('tournament=2l&season=80&round=5');
      const next = buildCanonicalPlayerQueryParams(current, {
        seasonId: 61,
        inferredTournamentId: null,
        currentTournamentFromUrl: '2l',
      });

      expect(next.get('season')).toBe('61');
      expect(next.get('tournament')).toBe('2l');
      expect(next.get('round')).toBe('5');
    });

    it('preserves unknown tournament codes when inferred tournament is unavailable', () => {
      const current = new URLSearchParams('tournament=custom-code&season=80');
      const next = buildCanonicalPlayerQueryParams(current, {
        seasonId: 61,
        inferredTournamentId: null,
        currentTournamentFromUrl: 'custom-code',
      });

      expect(next.get('season')).toBe('61');
      expect(next.get('tournament')).toBe('custom-code');
    });
  });
});
