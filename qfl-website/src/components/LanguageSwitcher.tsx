'use client';

import { useTranslation } from 'react-i18next';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  changeLanguage,
} from '@/i18n';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLang = (i18n.language?.substring(0, 2) || 'ru') as SupportedLanguage;

  const handleLanguageChange = async (lng: SupportedLanguage) => {
    await changeLanguage(lng);
  };

  return (
    <div className="flex items-center text-[#1E4D8C] text-sm font-medium">
      {SUPPORTED_LANGUAGES.map((lng, index) => (
        <span key={lng} className="flex items-center">
          <button
            onClick={() => handleLanguageChange(lng)}
            className={`px-1.5 py-1 uppercase transition-colors ${
              currentLang === lng
                ? 'text-[#1E4D8C] font-bold'
                : 'text-[#1E4D8C]/40 hover:text-[#1E4D8C]/70'
            }`}
            aria-label={`Switch to ${lng.toUpperCase()}`}
          >
            {lng}
          </button>
          {index < SUPPORTED_LANGUAGES.length - 1 && (
            <span className="text-[#1E4D8C]/40">|</span>
          )}
        </span>
      ))}
    </div>
  );
}
