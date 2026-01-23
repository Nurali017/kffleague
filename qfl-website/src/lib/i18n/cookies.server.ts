import { cookies } from 'next/headers';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/i18n/types';

export const LANGUAGE_COOKIE_NAME = 'NEXT_LOCALE';

/**
 * Server-side: Read language preference from cookies
 * Returns saved language or 'ru' as fallback
 */
export function getLanguageFromCookie(): SupportedLanguage {
  const cookieStore = cookies();
  const lang = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
    ? (lang as SupportedLanguage)
    : 'ru';
}
