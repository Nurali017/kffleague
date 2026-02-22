'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { CupScheduleResponse } from '@/types';
import { getMatchHref, getTeamHref } from '@/lib/utils/entityRoutes';
import { formatMatchDate } from '@/lib/utils/dateFormat';

interface CupScheduleProps {
  schedule: CupScheduleResponse;
  selectedRoundKey: string | null;
  onRoundChange: (roundKey: string | null) => void;
}

export function CupSchedule({
  schedule,
  selectedRoundKey,
  onRoundChange,
}: CupScheduleProps) {
  const { t, i18n } = useTranslation('table');

  const filteredRounds = selectedRoundKey
    ? schedule.rounds.filter((r) => r.round_key === selectedRoundKey)
    : schedule.rounds;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
      <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-slate-100">
        {t('cup.schedule', { defaultValue: 'Расписание кубка' })}
      </h3>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => onRoundChange(null)}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            selectedRoundKey === null
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-surface-soft dark:text-slate-200 dark:hover:bg-dark-surface'
          }`}
        >
          {t('cup.allRounds', { defaultValue: 'Все раунды' })}
        </button>
        {schedule.rounds.map((round) => (
          <button
            key={round.round_key}
            onClick={() => onRoundChange(round.round_key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
              selectedRoundKey === round.round_key
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-surface-soft dark:text-slate-200 dark:hover:bg-dark-surface'
            }`}
          >
            {round.round_name}
          </button>
        ))}
      </div>

      {filteredRounds.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {t('cup.noSchedule', { defaultValue: 'Нет матчей по выбранному раунду' })}
        </p>
      ) : (
        <div className="space-y-3">
          {filteredRounds.map((round) => (
            <div key={round.round_key}>
              <div className="mb-2 text-sm font-semibold text-primary">
                {round.round_name}
              </div>
              <div className="space-y-2">
                {round.games.map((game) => (
                  <div
                    key={game.id}
                    className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-dark-border dark:bg-dark-surface-soft"
                  >
                    <div className="mb-1 text-xs text-gray-500 dark:text-slate-400">
                      {formatMatchDate(game.date, i18n.language)}
                      {game.time ? ` · ${game.time}` : ''}
                    </div>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
                      {(() => {
                        const homeTeamHref = getTeamHref(game.home_team?.id);
                        if (!homeTeamHref) {
                          return (
                            <span className="truncate text-right text-gray-900 dark:text-slate-100">
                              {game.home_team?.name || '-'}
                            </span>
                          );
                        }

                        return (
                          <Link href={homeTeamHref} className="truncate text-right text-gray-900 dark:text-slate-100 hover:text-primary transition-colors">
                            {game.home_team?.name || '-'}
                          </Link>
                        );
                      })()}
                      {(() => {
                        const matchHref = getMatchHref(game.id);
                        const score = `${game.home_score ?? '-'}:${game.away_score ?? '-'}`;
                        if (!matchHref) {
                          return (
                            <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-white">
                              {score}
                            </span>
                          );
                        }

                        return (
                          <Link
                            href={matchHref}
                            className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-white hover:opacity-90 transition-opacity"
                          >
                            {score}
                          </Link>
                        );
                      })()}
                      {(() => {
                        const awayTeamHref = getTeamHref(game.away_team?.id);
                        if (!awayTeamHref) {
                          return (
                            <span className="truncate text-gray-900 dark:text-slate-100">
                              {game.away_team?.name || '-'}
                            </span>
                          );
                        }

                        return (
                          <Link href={awayTeamHref} className="truncate text-gray-900 dark:text-slate-100 hover:text-primary transition-colors">
                            {game.away_team?.name || '-'}
                          </Link>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
