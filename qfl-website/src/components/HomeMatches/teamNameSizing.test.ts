import { describe, expect, it } from 'vitest';

import { getTeamNameSizing } from './teamNameSizing';

describe('getTeamNameSizing', () => {
  it('keeps full name and 11px font for names up to 12 chars', () => {
    const result = getTeamNameSizing({ name: 'A'.repeat(12) });

    expect(result).toEqual({
      fullName: 'A'.repeat(12),
      displayName: 'A'.repeat(12),
      fontClass: 'text-[11px]',
    });
  });

  it('uses 9px font and full name for 13-24 chars', () => {
    const result = getTeamNameSizing({ name: 'B'.repeat(24) });

    expect(result).toEqual({
      fullName: 'B'.repeat(24),
      displayName: 'B'.repeat(24),
      fontClass: 'text-[9px]',
    });
  });

  it('uses short_name for 25+ chars', () => {
    const result = getTeamNameSizing({
      name: 'Очень Длинное Название Команды Проверка',
      short_name: 'ОДНК',
    });

    expect(result).toEqual({
      fullName: 'Очень Длинное Название Команды Проверка',
      displayName: 'ОДНК',
      fontClass: 'text-[9px]',
    });
  });

  it('uses language specific short_name when available', () => {
    const kz = getTeamNameSizing(
      {
        name: 'Очень Длинное Название Команды Проверка',
        short_name: 'RU',
        short_name_kz: 'KZ',
        short_name_en: 'EN',
      },
      'kz'
    );

    const en = getTeamNameSizing(
      {
        name: 'Очень Длинное Название Команды Проверка',
        short_name: 'RU',
        short_name_kz: 'KZ',
        short_name_en: 'EN',
      },
      'en'
    );

    expect(kz.displayName).toBe('KZ');
    expect(en.displayName).toBe('EN');
  });

  it('falls back to first word when short_name is missing', () => {
    const result = getTeamNameSizing({
      name: 'Очень Длинное Название Команды Проверка',
    });

    expect(result).toEqual({
      fullName: 'Очень Длинное Название Команды Проверка',
      displayName: 'Очень',
      fontClass: 'text-[9px]',
    });
  });

  it('trims whitespace in name and short_name', () => {
    const result = getTeamNameSizing(
      {
        name: '   Очень Длинное Название Команды Проверка   ',
        short_name: '  СК  ',
      },
      'ru'
    );

    expect(result).toEqual({
      fullName: 'Очень Длинное Название Команды Проверка',
      displayName: 'СК',
      fontClass: 'text-[9px]',
    });
  });

  it('handles empty name safely', () => {
    const result = getTeamNameSizing({ name: '   ' });

    expect(result).toEqual({
      fullName: '-',
      displayName: '-',
      fontClass: 'text-[11px]',
    });
  });
});
