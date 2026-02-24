'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { MatchCenter } from '@/components/MatchCenter';
import { SeasonYearSelector } from '@/components/ui/SeasonYearSelector';
import { useTournament } from '@/contexts/TournamentContext';
import { SEASON_CALENDAR_PDF } from '@/config/seasonCalendarPdf';

export default function MatchesPage() {
  const { t } = useTranslation('match');
  const { effectiveSeasonId } = useTournament();
  const showScheduleNotice = effectiveSeasonId === SEASON_CALENDAR_PDF.seasonId;

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
        {showScheduleNotice && (
          <div className="mb-4 space-y-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700/70 dark:bg-amber-900/25 dark:text-amber-100">
            <p>{t('scheduleNotice.global')}</p>
            <Link
              href="/matches/calendar"
              className="inline-flex rounded-md bg-white/80 px-3 py-1.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-white dark:bg-amber-200/20 dark:text-amber-100 dark:hover:bg-amber-200/30"
            >
              {t('calendarPdf.cta')}
            </Link>
          </div>
        )}
        <MatchCenter />
      </div>
    </div>
  );
}
