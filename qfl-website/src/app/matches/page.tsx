'use client';

import { useTranslation } from 'react-i18next';
import { MatchCenter } from '@/components/MatchCenter';

export default function MatchesPage() {
  const { t } = useTranslation('match');

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1E4D8C] dark:text-blue-400 mb-8">
        {t('title')}
      </h1>
      <MatchCenter />
    </div>
  );
}
