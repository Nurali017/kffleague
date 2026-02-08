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

  return (
    <div className="flex items-center text-sm font-semibold">
      {SUPPORTED_LANGUAGES.map((lng, index) => (
        <span key={lng} className="flex items-center">
          <button
            onClick={() => handleLanguageChange(lng)}
            className={`px-1.5 py-1 uppercase transition-colors duration-200 ${
              currentLang === lng
                ? (variant === 'dark' ? 'text-white font-bold' : 'text-primary dark:text-white font-bold')
                : (variant === 'dark'
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-400 dark:text-slate-500 hover:text-primary/70 dark:hover:text-slate-300')
            }`}
            aria-label={`Switch to ${lng.toUpperCase()}`}
          >
            {lng}
          </button>
          {index < SUPPORTED_LANGUAGES.length - 1 && (
            <span className={variant === 'dark' ? 'text-slate-400' : 'text-slate-300 dark:text-slate-600'}>|</span>
          )}
        </span>
      ))}
    </div>
  );
}
