'use client';

import { useTranslation } from 'react-i18next';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  changeLanguage,
} from '@/i18n';

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
}

export function LanguageSwitcher({ variant = 'light' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const currentLang = (i18n.language?.substring(0, 2) || 'ru') as SupportedLanguage;

  const handleLanguageChange = async (lng: SupportedLanguage) => {
    await changeLanguage(lng);
  };

  const colors = variant === 'dark'
    ? {
        active: 'text-white font-bold',
        inactive: 'text-white/50 hover:text-white/80',
        separator: 'text-white/50'
      }
    : {
        active: 'text-[#1E4D8C] font-bold',
        inactive: 'text-[#1E4D8C]/40 hover:text-[#1E4D8C]/70',
        separator: 'text-[#1E4D8C]/40'
      };

  return (
    <div className="flex items-center text-sm font-medium">
      {SUPPORTED_LANGUAGES.map((lng, index) => (
        <span key={lng} className="flex items-center">
          <button
            onClick={() => handleLanguageChange(lng)}
            className={`px-1.5 py-1 uppercase transition-colors ${
              currentLang === lng ? colors.active : colors.inactive
            }`}
            aria-label={`Switch to ${lng.toUpperCase()}`}
          >
            {lng}
          </button>
          {index < SUPPORTED_LANGUAGES.length - 1 && (
            <span className={colors.separator}>|</span>
          )}
        </span>
      ))}
    </div>
  );
}
