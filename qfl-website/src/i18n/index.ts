import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { setLanguageCookie } from '@/lib/i18n/cookies.client';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, type SupportedLanguage } from './types';

export { SUPPORTED_LANGUAGES, LANGUAGE_NAMES };
export type { SupportedLanguage } from './types';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    defaultNS: 'common',
    ns: ['common', 'navigation', 'footer', 'errors', 'table', 'league', 'news', 'match', 'team'],
    supportedLngs: SUPPORTED_LANGUAGES,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'i18nextLng',
      lookupCookie: 'NEXT_LOCALE',
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
        maxAge: 31536000, // 1 year
      },
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    react: {
      useSuspense: false, // Disable suspense for Next.js client-side
    },
  });

export default i18n;

export const getCurrentLanguage = (): SupportedLanguage => {
  const lang = i18n.language?.substring(0, 2) as SupportedLanguage;
  return SUPPORTED_LANGUAGES.includes(lang) ? lang : 'ru';
};

export const changeLanguage = async (lng: SupportedLanguage): Promise<void> => {
  await i18n.changeLanguage(lng);
  localStorage.setItem('i18nextLng', lng);
  setLanguageCookie(lng);
  document.documentElement.lang = lng;
};
