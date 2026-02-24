'use client';

import { useTranslation } from 'react-i18next';
import { MatchCenter } from '@/components/MatchCenter';
import { SeasonYearSelector } from '@/components/ui/SeasonYearSelector';

export default function MatchesPage() {
  const { t } = useTranslation('match');
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 pt-6 md:pt-8 pb-5 md:pb-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-slate-100">
            {t('title')}
          </h1>
          <SeasonYearSelector variant="default" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 pb-8">
        <MatchCenter />
      </div>
    </div>
  );
}
