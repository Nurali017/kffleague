import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { setLanguageCookie } from '@/lib/i18n/cookies.client';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, type SupportedLanguage } from './types';

// Russian translations
import commonRu from '../../public/locales/ru/common.json';
import navigationRu from '../../public/locales/ru/navigation.json';
import footerRu from '../../public/locales/ru/footer.json';
import errorsRu from '../../public/locales/ru/errors.json';
import tableRu from '../../public/locales/ru/table.json';
import leagueRu from '../../public/locales/ru/league.json';
import newsRu from '../../public/locales/ru/news.json';
import matchRu from '../../public/locales/ru/match.json';
import teamRu from '../../public/locales/ru/team.json';
import playerRu from '../../public/locales/ru/player.json';
import statisticsRu from '../../public/locales/ru/statistics.json';

// Kazakh translations
import commonKz from '../../public/locales/kz/common.json';
import navigationKz from '../../public/locales/kz/navigation.json';
import footerKz from '../../public/locales/kz/footer.json';
import errorsKz from '../../public/locales/kz/errors.json';
import tableKz from '../../public/locales/kz/table.json';
import leagueKz from '../../public/locales/kz/league.json';
import newsKz from '../../public/locales/kz/news.json';
import matchKz from '../../public/locales/kz/match.json';
import teamKz from '../../public/locales/kz/team.json';
import playerKz from '../../public/locales/kz/player.json';
import statisticsKz from '../../public/locales/kz/statistics.json';

export { SUPPORTED_LANGUAGES, LANGUAGE_NAMES };
export type { SupportedLanguage } from './types';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        common: commonRu,
        navigation: navigationRu,
        footer: footerRu,
        errors: errorsRu,
        table: tableRu,
        league: leagueRu,
        news: newsRu,
        match: matchRu,
        team: teamRu,
        player: playerRu,
        statistics: statisticsRu,
      },
      kz: {
        common: commonKz,
        navigation: navigationKz,
        footer: footerKz,
        errors: errorsKz,
        table: tableKz,
        league: leagueKz,
        news: newsKz,
        match: matchKz,
        team: teamKz,
        player: playerKz,
        statistics: statisticsKz,
      },
    },
    fallbackLng: 'ru',
    defaultNS: 'common',
    ns: ['common', 'navigation', 'footer', 'errors', 'table', 'league', 'news', 'match', 'team', 'player', 'statistics'],
    supportedLngs: SUPPORTED_LANGUAGES,

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
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
