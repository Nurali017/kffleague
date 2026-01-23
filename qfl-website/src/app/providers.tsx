'use client';

import { ReactNode, Suspense, useEffect } from 'react';
import { SWRConfig } from 'swr';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { swrConfig } from '@/lib/swr/config';
import { TournamentProvider } from '@/contexts/TournamentContext';
import {
  setLanguageCookie,
  getClientLanguageCookie,
} from '@/lib/i18n/cookies.client';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Sync localStorage and cookie on mount
  useEffect(() => {
    const storedLang = localStorage.getItem('i18nextLng');
    const cookieLang = getClientLanguageCookie();

    // If localStorage has language but cookie doesn't, set cookie
    if (storedLang && !cookieLang) {
      setLanguageCookie(storedLang as 'ru' | 'kz');
    }

    // If cookie has language but localStorage doesn't, set localStorage
    if (cookieLang && !storedLang) {
      localStorage.setItem('i18nextLng', cookieLang);
    }
  }, []);

  return (
    <SWRConfig value={swrConfig}>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={null}>
          <TournamentProvider>{children}</TournamentProvider>
        </Suspense>
      </I18nextProvider>
    </SWRConfig>
  );
}
