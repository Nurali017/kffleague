'use client';

import { useTranslation } from 'react-i18next';
import { PlayoffBracketResponse } from '@/types';
import { formatMatchDate } from '@/lib/utils/dateFormat';

interface CupBracketProps {
  bracket: PlayoffBracketResponse;
}

export function CupBracket({ bracket }: CupBracketProps) {
  const { t, i18n } = useTranslation('table');

  if (!bracket.rounds.length) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
        <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-slate-100">
          {t('cup.bracket', { defaultValue: 'Сетка плей-офф' })}
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {t('cup.noBracket', { defaultValue: 'Сетка плей-офф пока не определена' })}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-dark-border dark:bg-dark-surface">
      <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-slate-100">
        {t('cup.bracket', { defaultValue: 'Сетка плей-офф' })}
      </h3>
      <div className="space-y-4">
        {bracket.rounds.map((round) => (
          <div key={round.round_name}>
            <div className="mb-2 text-sm font-semibold text-primary">
              {round.round_label}
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {round.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-dark-border dark:bg-dark-surface-soft"
                >
                  {entry.game?.date && (
                    <div className="mb-1 text-xs text-gray-500 dark:text-slate-400">
                      {formatMatchDate(entry.game.date, i18n.language)}
                      {entry.game.time ? ` · ${entry.game.time}` : ''}
                    </div>
                  )}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
                    <span className="truncate text-right text-gray-900 dark:text-slate-100">
                      {entry.game?.home_team?.name || '-'}
                    </span>
                    <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold text-white">
                      {entry.game?.home_score ?? '-'}:{entry.game?.away_score ?? '-'}
                    </span>
                    <span className="truncate text-gray-900 dark:text-slate-100">
                      {entry.game?.away_team?.name || '-'}
                    </span>
                  </div>
                  {(entry.game?.home_penalty_score != null || entry.game?.away_penalty_score != null) && (
                    <div className="mt-1 text-center text-xs text-gray-500 dark:text-slate-400">
                      {t('cup.penalties', { defaultValue: 'пен.' })}{' '}
                      {entry.game?.home_penalty_score ?? '-'}:{entry.game?.away_penalty_score ?? '-'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
