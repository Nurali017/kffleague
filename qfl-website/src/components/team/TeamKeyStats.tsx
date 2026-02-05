'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { TeamOverviewSummary } from '@/types/team';
import { SectionCard, SectionHeader, StatPill } from './TeamUiPrimitives';

interface TeamKeyStatsProps {
  stats: TeamOverviewSummary;
}

export function TeamKeyStats({ stats }: TeamKeyStatsProps) {
  const { t: tTeam } = useTranslation('team');
  const { t: tStats } = useTranslation('statistics');
  const goalDiff = stats.goal_difference ?? stats.goals_scored - stats.goals_conceded;

  return (
    <SectionCard className="p-4 md:p-6">
      <SectionHeader
        title={tTeam('sections.keyStats', 'Ключевая статистика')}
        action={
          <Link
            href="/stats"
            className="text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            {tTeam('buttons.seeAllStats', 'Вся статистика')}
          </Link>
        }
      />

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatPill value={stats.games_played} label={tStats('labels.matchesPlayed', 'Сыграно матчей')} tone="primary" />
        <StatPill value={stats.wins} label={tTeam('stats.wins', 'Победы')} tone="positive" />
        <StatPill value={stats.draws} label={tTeam('stats.draws', 'Ничьи')} tone="warning" />
        <StatPill value={stats.losses} label={tTeam('stats.losses', 'Поражения')} tone="danger" />
        <StatPill value={stats.goals_scored} label={tStats('labels.goals', 'Голы')} />
        <StatPill value={stats.goals_conceded} label={tStats('labels.goalsConceded', 'Пропущенные голы')} tone="danger" />
        <StatPill
          value={`${goalDiff > 0 ? '+' : ''}${goalDiff}`}
          label={tStats('labels.goalDifference', 'Разница')}
          tone={goalDiff >= 0 ? 'positive' : 'danger'}
        />
        <StatPill value={stats.points} label={tTeam('stats.points', 'Очки')} tone="primary" />
      </div>
    </SectionCard>
  );
}

