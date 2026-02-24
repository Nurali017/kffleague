'use client';

import Link from 'next/link';
import { ExternalLink, Download } from 'lucide-react';
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

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={SEASON_CALENDAR_PDF.viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-light dark:bg-accent-cyan dark:text-dark-bg dark:hover:bg-cyan-300"
          >
            <ExternalLink className="h-4 w-4" />
            {t('calendarPdf.open')}
          </a>
          <a
            href={SEASON_CALENDAR_PDF.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-dark-border-soft dark:text-slate-200 dark:hover:bg-dark-surface-soft"
          >
            <Download className="h-4 w-4" />
            {t('calendarPdf.download')}
          </a>
          <Link
            href="/matches"
            className="text-sm font-medium text-primary transition-colors hover:text-primary-light dark:text-accent-cyan dark:hover:text-cyan-300"
          >
            ← {t('title')}
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <iframe
            src={SEASON_CALENDAR_PDF.viewUrl}
            className="h-[70vh] min-h-[480px] w-full rounded-lg"
            title={t('calendarPdf.title')}
          />
          <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">
            {t('calendarPdf.fallback')}{' '}
            <a
              href={SEASON_CALENDAR_PDF.viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              {t('calendarPdf.open')}
            </a>{' '}
            /{' '}
            <a
              href={SEASON_CALENDAR_PDF.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              {t('calendarPdf.download')}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

