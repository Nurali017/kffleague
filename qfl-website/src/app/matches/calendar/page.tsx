'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { SEASON_CALENDAR_PDF } from '@/config/seasonCalendarPdf';

export default function MatchesCalendarPage() {
  const { t } = useTranslation('match');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-6 md:py-8 space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-slate-100">
            {t('calendarPdf.title')}
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-slate-300">
            {t('calendarPdf.description')}
          </p>
        </div>

        <Link
          href="/matches"
          className="inline-block text-sm font-medium text-primary transition-colors hover:text-primary-light dark:text-accent-cyan dark:hover:text-cyan-300"
        >
          ← {t('title')}
        </Link>

        <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <iframe
            src={SEASON_CALENDAR_PDF.viewUrl}
            className="h-[70vh] min-h-[480px] w-full rounded-lg"
            title={t('calendarPdf.title')}
          />
        </div>
      </div>
    </div>
  );
}
