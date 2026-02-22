'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CupOverviewResponse, CupScheduleResponse } from '@/types';
import { HeroSection } from '@/components/HeroSection';
import { NewsFeatured, NewsSideCards } from '@/components/NewsSection';
import { CupSchedule } from '@/components/cup';

interface CupHomeProps {
  overview?: CupOverviewResponse | null;
  schedule?: CupScheduleResponse | null;
}

export function CupHome({ overview, schedule }: CupHomeProps) {
  const { t } = useTranslation('common');
  const { t: tTable } = useTranslation('table');
  const [selectedRoundKey, setSelectedRoundKey] = useState<string | null>(null);
  const hasCupData = Boolean(overview || schedule);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 md:space-y-8 md:py-10">
      <div className="h-[340px] sm:h-[420px] lg:h-[500px]">
        <HeroSection />
      </div>

      {!hasCupData ? (
        <section className="rounded-xl border border-gray-100 bg-white p-6 text-gray-500 dark:border-dark-border dark:bg-dark-surface dark:text-slate-400">
          {t('noData.noMatches')}
        </section>
      ) : (
        <>
          <section
            className="rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface"
            data-testid="cup-home-playoff-rounds"
          >
            <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-slate-100">
              {tTable('cup.homePlayoffRoundsTitle', { defaultValue: 'Раунды плей-офф' })}
            </h3>
            <p className="mb-3 text-sm text-gray-500 dark:text-slate-400">
              {tTable('cup.homeRoundFilterLabel', { defaultValue: 'Выбор раунда' })}
            </p>
            {schedule && schedule.rounds.length > 0 ? (
              <CupSchedule
                schedule={schedule}
                selectedRoundKey={selectedRoundKey}
                onRoundChange={setSelectedRoundKey}
              />
            ) : (
              <p className="text-sm text-gray-500 dark:text-slate-400">
                {tTable('cup.homeNoPlayoffRounds', { defaultValue: 'Раунды плей-офф пока не определены' })}
              </p>
            )}
          </section>
        </>
      )}

      <section className="rounded-xl border border-gray-100 bg-white p-4 md:p-6 dark:border-dark-border dark:bg-dark-surface">
        <div className="mb-4 flex items-center justify-between gap-3 md:mb-6">
          <h2 className="text-xl font-bold tracking-tight text-primary dark:text-accent-cyan md:text-2xl">
            {t('newsSection.title')}
          </h2>
          <Link
            href="/news"
            className="inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-accent-cyan"
          >
            {t('newsSection.viewAll')}
            <ChevronRight className="ml-0.5 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 md:gap-8 lg:grid-cols-3">
          <div className="min-h-[350px] lg:col-span-2">
            <NewsFeatured />
          </div>
          <div className="h-full">
            <NewsSideCards />
          </div>
        </div>
      </section>
    </div>
  );
}
