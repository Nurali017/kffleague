'use client';

import { useTranslation } from 'react-i18next';
import { useTournament } from '@/contexts/TournamentContext';
import { SecondLeagueStage } from '@/types/tournament';

const STAGE_OPTIONS: Array<{ id: SecondLeagueStage; label: string }> = [
  { id: 'a', label: 'Group A' },
  { id: 'b', label: 'Group B' },
  { id: 'final', label: 'Final Stage' },
];

interface SecondLeagueStageSwitcherProps {
  className?: string;
}

export function SecondLeagueStageSwitcher({ className = '' }: SecondLeagueStageSwitcherProps) {
  const { t } = useTranslation('table');
  const { currentTournament, secondLeagueStage, setSecondLeagueStage } = useTournament();

  if (currentTournament.id !== '2l') {
    return null;
  }

  return (
    <div className={`rounded-xl border border-white/25 bg-white/90 p-2 dark:border-white/15 dark:bg-dark-surface/80 ${className}`}>
      <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
        {t('secondLeagueStage', { defaultValue: 'Вторая лига: этап' })}
      </div>
      <div className="flex flex-wrap gap-2">
        {STAGE_OPTIONS.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setSecondLeagueStage(stage.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
              secondLeagueStage === stage.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-surface-soft dark:text-slate-200 dark:hover:bg-dark-surface'
            }`}
          >
            {t(`secondLeagueStages.${stage.id}`, { defaultValue: stage.label })}
          </button>
        ))}
      </div>
    </div>
  );
}
