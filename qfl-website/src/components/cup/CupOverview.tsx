'use client';

import { useTranslation } from 'react-i18next';
import { CupOverviewResponse } from '@/types';
import { formatMatchDate } from '@/lib/utils/dateFormat';

interface CupOverviewProps {
  overview: CupOverviewResponse;
}

function CupGameRow({ game }: { game: CupOverviewResponse['recent_results'][number] }) {
  const { i18n } = useTranslation();

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3 dark:border-dark-border dark:bg-dark-surface-soft">
      <div className="mb-2 text-xs text-gray-500 dark:text-slate-400">
        {formatMatchDate(game.date, i18n.language)}
        {game.stage_name ? ` · ${game.stage_name}` : ''}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
        <span className="truncate text-right text-gray-900 dark:text-slate-100">
          {game.home_team?.name || '-'}
        </span>
        <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-white">
          {game.home_score ?? '-'}:{game.away_score ?? '-'}
        </span>
        <span className="truncate text-gray-900 dark:text-slate-100">
          {game.away_team?.name || '-'}
        </span>
      </div>
    </div>
  );
}

export function CupOverview({ overview }: CupOverviewProps) {
  const { t } = useTranslation('table');

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
        <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
          {overview.tournament_name || t('bracketTitle', { defaultValue: 'Кубок' })}
        </h2>
        {overview.current_round && (
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            {t('cup.currentRound', { defaultValue: 'Текущий раунд' })}: {overview.current_round.round_name}
          </p>
        )}
      </div>

      {overview.groups && overview.groups.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
          <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-slate-100">
            {t('cup.groups', { defaultValue: 'Группы' })}
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {overview.groups.map((group) => (
              <div key={group.group_name} className="rounded-lg border border-gray-100 dark:border-dark-border">
                <div className="border-b border-gray-100 px-3 py-2 font-semibold dark:border-dark-border">
                  {t('cup.group', { defaultValue: 'Группа' })} {group.group_name}
                </div>
                <div className="p-3 space-y-1 text-sm">
                  {group.standings.slice(0, 5).map((team) => (
                    <div key={team.team_id} className="flex items-center justify-between gap-2">
                      <span className="truncate text-gray-900 dark:text-slate-100">
                        {team.position}. {team.team_name || '-'}
                      </span>
                      <span className="font-bold text-primary">{team.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
          <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-slate-100">
            {t('cup.recentResults', { defaultValue: 'Последние результаты' })}
          </h3>
          {overview.recent_results.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {t('cup.noRecentResults', { defaultValue: 'Нет сыгранных матчей' })}
            </p>
          ) : (
            <div className="space-y-2">
              {overview.recent_results.map((game) => (
                <CupGameRow key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
          <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-slate-100">
            {t('cup.upcomingGames', { defaultValue: 'Ближайшие матчи' })}
          </h3>
          {overview.upcoming_games.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {t('cup.noUpcomingGames', { defaultValue: 'Нет ближайших матчей' })}
            </p>
          ) : (
            <div className="space-y-2">
              {overview.upcoming_games.map((game) => (
                <CupGameRow key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
