'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GroupedMatchesResponse, TeamStanding } from '@/types';
import { HeroSection } from '@/components/HeroSection';
import { NewsFeatured, NewsSideCards } from '@/components/NewsSection';
import { PhaseMatchesList } from './PhaseMatchesList';
import { SecondLeaguePhaseCard } from './SecondLeaguePhaseCard';

interface SecondLeagueHomeProps {
  groupAStandings?: TeamStanding[] | null;
  groupBStandings?: TeamStanding[] | null;
  groupAMatches?: GroupedMatchesResponse | null;
  groupBMatches?: GroupedMatchesResponse | null;
  finalMatches?: GroupedMatchesResponse | null;
}

function hasAnyMatches(response?: GroupedMatchesResponse | null) {
  return (response?.groups ?? []).some((group) => group.games.length > 0);
}

export function SecondLeagueHome({
  groupAStandings,
  groupBStandings,
  groupAMatches,
  groupBMatches,
  finalMatches,
}: SecondLeagueHomeProps) {
  const { t } = useTranslation(['common', 'table']);
  const showFinalBlock = hasAnyMatches(finalMatches);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 md:space-y-8 md:py-10">
      <div className="h-[340px] sm:h-[420px] lg:h-[500px]">
        <HeroSection />
      </div>

      {showFinalBlock && (
        <section
          className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-surface"
          data-testid="second-league-final"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-primary dark:text-accent-cyan">
              {t('phase.final', { ns: 'table', defaultValue: 'Финал' })}
            </h2>
            <Link
              href="/matches?final=true"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-accent-cyan"
            >
              {t('buttons.allMatches')}
              <ChevronRight className="ml-0.5 h-4 w-4" />
            </Link>
          </div>
          <PhaseMatchesList groups={finalMatches?.groups} limit={4} />
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div data-testid="second-league-group-a">
          <SecondLeaguePhaseCard
            title={t('phase.groupA', { ns: 'table', defaultValue: 'Лига A' })}
            standings={groupAStandings}
            matchGroups={groupAMatches?.groups}
            tableHref="/table?phase=groupA"
            matchesHref="/matches?group=A"
          />
        </div>

        <div data-testid="second-league-group-b">
          <SecondLeaguePhaseCard
            title={t('phase.groupB', { ns: 'table', defaultValue: 'Лига B' })}
            standings={groupBStandings}
            matchGroups={groupBMatches?.groups}
            tableHref="/table?phase=groupB"
            matchesHref="/matches?group=B"
          />
        </div>
      </div>

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

