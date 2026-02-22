'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { DateGroup } from '@/types';
import { getTeamLogo } from '@/lib/utils/teamLogos';

interface PhaseMatchesListProps {
  groups?: DateGroup[] | null;
  limit?: number;
}

export function PhaseMatchesList({ groups, limit = 4 }: PhaseMatchesListProps) {
  const { t } = useTranslation('common');
  const matches = (groups ?? []).flatMap((group) => group.games).slice(0, limit);

  if (matches.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-slate-400" data-testid="phase-matches-empty">
        {t('noData.noMatches')}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {matches.map((match) => {
        const homeLogo = match.home_team.logo_url || getTeamLogo(match.home_team.id) || '/images/team-placeholder.png';
        const awayLogo = match.away_team.logo_url || getTeamLogo(match.away_team.id) || '/images/team-placeholder.png';
        const scoreText =
          match.home_score !== null && match.away_score !== null
            ? `${match.home_score}:${match.away_score}`
            : (match.time || '-');

        return (
          <Link
            key={match.id}
            href={`/matches/${match.id}`}
            className="block rounded-lg bg-gray-50 p-2.5 transition-colors hover:bg-gray-100 dark:bg-dark-surface-soft dark:hover:bg-dark-surface"
          >
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
              <div className="flex items-center justify-end gap-2 min-w-0">
                <span className="truncate text-right text-gray-900 dark:text-slate-100">
                  {match.home_team.name}
                </span>
                <img
                  src={homeLogo}
                  alt={match.home_team.name}
                  className="h-5 w-5 shrink-0 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/images/team-placeholder.png';
                  }}
                />
              </div>

              <div className="min-w-[52px] text-center text-xs font-bold text-primary dark:text-accent-cyan">
                {scoreText}
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={awayLogo}
                  alt={match.away_team.name}
                  className="h-5 w-5 shrink-0 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/images/team-placeholder.png';
                  }}
                />
                <span className="truncate text-gray-900 dark:text-slate-100">
                  {match.away_team.name}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

