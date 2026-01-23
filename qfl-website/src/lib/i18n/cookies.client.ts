import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/i18n/types';

export const LANGUAGE_COOKIE_NAME = 'NEXT_LOCALE';

/**
 * Client-side: Set language preference cookie
 */
export function setLanguageCookie(lang: SupportedLanguage): void {
  if (typeof document !== 'undefined') {
    document.cookie = `${LANGUAGE_COOKIE_NAME}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

/**
 * Client-side: Read language preference from cookie
 */
export function getClientLanguageCookie(): SupportedLanguage | null {
  if (typeof document === 'undefined') return null;

  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${LANGUAGE_COOKIE_NAME}=([^;]*)`)
  );

  const lang = matches ? decodeURIComponent(matches[1]) : null;
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
    ? (lang as SupportedLanguage)
    : null;
}
