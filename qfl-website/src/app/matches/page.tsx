'use client';

import { useTranslation } from 'react-i18next';
import { MatchCenter } from '@/components/MatchCenter';

export default function MatchesPage() {
  const { t } = useTranslation('match');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-[1400px] mx-auto px-4 pt-6 md:pt-8 pb-5 md:pb-6">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-slate-100">
          {t('title')}
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 pb-8">
        <MatchCenter />
      </div>
    </div>
  );
}
