type SupportedLanguage = 'ru' | 'kz' | 'en';

const LOCALE_MAP: Record<SupportedLanguage, string> = {
  ru: 'ru-RU',
  kz: 'kk-KZ',
  en: 'en-US',
};

function getLocale(language: string): string {
  const lang = language.substring(0, 2) as SupportedLanguage;
  return LOCALE_MAP[lang] || 'ru-RU';
}

export function formatMatchDate(dateStr: string, language: string): string {
  const date = new Date(dateStr);
  const locale = getLocale(language);

  return date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function formatNewsDate(dateStr: string, language: string): string {
  const date = new Date(dateStr);
  const locale = getLocale(language);

  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatShortDate(dateStr: string, language: string): string {
  const date = new Date(dateStr);
  const locale = getLocale(language);

  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
  });
}

export function formatDateRange(dates: string[], language: string): string {
  if (dates.length === 0) return '';

  const locale = getLocale(language);
  const sortedDates = [...dates].map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());

  const startDate = sortedDates[0];
  const endDate = sortedDates[sortedDates.length - 1];

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
  };

  const startFormatted = startDate.toLocaleDateString(locale, formatOptions);
  const endFormatted = endDate.toLocaleDateString(locale, formatOptions);

  if (startDate.getTime() === endDate.getTime()) {
    return startFormatted;
  }

  return `${startFormatted} - ${endFormatted}`;
}
