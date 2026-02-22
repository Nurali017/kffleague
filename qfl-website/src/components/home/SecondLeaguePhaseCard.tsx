'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DateGroup, TeamStanding } from '@/types';
import { getTeamLogo } from '@/lib/utils/teamLogos';
import { PhaseMatchesList } from './PhaseMatchesList';

interface SecondLeaguePhaseCardProps {
  title: string;
  standings?: TeamStanding[] | null;
  matchGroups?: DateGroup[] | null;
  tableHref: string;
  matchesHref: string;
}

export function SecondLeaguePhaseCard({
  title,
  standings,
  matchGroups,
  tableHref,
  matchesHref,
}: SecondLeaguePhaseCardProps) {
  const { t } = useTranslation('common');
  const topRows = (standings ?? []).slice(0, 5);

  return (
    <article className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-surface">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-primary dark:text-accent-cyan">{title}</h3>
        <div className="flex items-center gap-3 text-xs">
          <Link
            href={tableHref}
            className="inline-flex items-center text-gray-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-accent-cyan"
          >
            {t('buttons.fullTable')}
            <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
          </Link>
          <Link
            href={matchesHref}
            className="inline-flex items-center text-gray-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-accent-cyan"
          >
            {t('buttons.allMatches')}
            <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="mb-4 overflow-hidden rounded-lg border border-gray-100 dark:border-dark-border">
        <div className="grid grid-cols-[28px_1fr_32px_36px] gap-2 bg-gray-50 px-3 py-2 text-[11px] uppercase tracking-wide text-gray-500 dark:bg-dark-surface-soft dark:text-slate-400">
          <span className="text-center">#</span>
          <span>{t('table.club')}</span>
          <span className="text-center">{t('table.matches')}</span>
          <span className="text-center">{t('table.points')}</span>
        </div>

        {topRows.length === 0 ? (
          <div className="px-3 py-4 text-sm text-gray-500 dark:text-slate-400">
            {t('noData.noMatches')}
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-dark-border">
            {topRows.map((team) => (
              <div
                key={team.team_id}
                className="grid grid-cols-[28px_1fr_32px_36px] items-center gap-2 px-3 py-2.5 text-sm"
              >
                <span className="text-center text-gray-500 dark:text-slate-400">{team.position}</span>
                <div className="flex min-w-0 items-center gap-2">
                  <img
                    src={team.team_logo || getTeamLogo(team.team_id) || '/images/team-placeholder.png'}
                    alt={team.team_name}
                    className="h-5 w-5 shrink-0 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/images/team-placeholder.png';
                    }}
                  />
                  <span className="truncate text-gray-900 dark:text-slate-100">{team.team_name}</span>
                </div>
                <span className="text-center text-gray-700 dark:text-slate-300">{team.games_played}</span>
                <span className="text-center font-bold text-primary dark:text-accent-cyan">{team.points}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <PhaseMatchesList groups={matchGroups} limit={4} />
    </article>
  );
}

