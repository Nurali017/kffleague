'use client';

import { useTranslation } from 'react-i18next';
import { PlayoffBracketResponse } from '@/types';

interface CupBracketProps {
  bracket: PlayoffBracketResponse;
}

export function CupBracket({ bracket }: CupBracketProps) {
  const { t } = useTranslation('table');

  if (!bracket.rounds.length) {
    return null;
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
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
