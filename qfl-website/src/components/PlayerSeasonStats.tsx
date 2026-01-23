'use client';

import { useTranslation } from 'react-i18next';
import { PlayerStat } from '@/types/playerStats';

interface PlayerSeasonStatsProps {
  stats?: PlayerStat;
}

interface StatCardProps {
  label: string;
  value: number | null | undefined;
  unit?: string;
  color?: string;
}

function StatCard({ label, value, unit = '', color = 'bg-blue-50' }: StatCardProps) {
  const displayValue = value ?? 0;

  return (
    <div className={`${color} rounded-xl p-4`}>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold text-[#1E4D8C]">
        {displayValue}{unit}
      </div>
    </div>
  );
}

export function PlayerSeasonStats({ stats }: PlayerSeasonStatsProps) {
  const { t } = useTranslation('player');

  if (!stats) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-[#1E4D8C] mb-4">
          {t('seasonStats')}
        </h3>
        <p className="text-gray-500 text-center py-8">{t('noStats')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-[#1E4D8C] mb-6">
        {t('seasonStats')}
      </h3>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label={t('stats.games')}
          value={stats.games_played}
        />
        <StatCard
          label={t('stats.minutes')}
          value={stats.minutes_played}
        />
        <StatCard
          label={t('stats.goals')}
          value={stats.goals}
          color="bg-green-50"
        />
        <StatCard
          label={t('stats.assists')}
          value={stats.assists}
          color="bg-green-50"
        />
      </div>

      {/* Attacking Stats */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-[#E5B73B] pl-3">
          {t('tabs.attacking')}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label={t('stats.goalAndAssist')}
            value={stats.goal_and_assist}
          />
          <StatCard
            label={t('stats.xg')}
            value={stats.xg}
          />
          <StatCard
            label={t('stats.shots')}
            value={stats.shots}
          />
          <StatCard
            label={t('stats.shotsOnGoal')}
            value={stats.shots_on_goal}
          />
        </div>
      </div>

      {/* Passing Stats */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-[#E5B73B] pl-3">
          {t('tabs.passing')}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            label={t('stats.passes')}
            value={stats.passes}
          />
          <StatCard
            label={t('stats.keyPasses')}
            value={stats.key_passes}
          />
          <StatCard
            label={t('stats.passAccuracy')}
            value={stats.pass_accuracy}
            unit="%"
          />
        </div>
      </div>

      {/* Defending & Duels */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-[#E5B73B] pl-3">
          {t('tabs.defending')}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label={t('stats.tackle')}
            value={stats.tackle}
          />
          <StatCard
            label={t('stats.interception')}
            value={stats.interception}
          />
          <StatCard
            label={t('stats.recovery')}
            value={stats.recovery}
          />
          <StatCard
            label={t('stats.duelsWon')}
            value={stats.duels_won}
          />
        </div>
      </div>

      {/* Dribbling & Discipline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-3">
            {t('stats.dribble')}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label={t('stats.dribble')}
              value={stats.dribble}
            />
            <StatCard
              label={t('stats.dribbleSuccess')}
              value={stats.dribble_success}
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-3">
            {t('tabs.discipline')}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label={t('stats.yellowCards')}
              value={stats.yellow_cards}
              color="bg-yellow-50"
            />
            <StatCard
              label={t('stats.redCards')}
              value={stats.red_cards}
              color="bg-red-50"
            />
          </div>
        </div>
      </div>

      {/* Goalkeeper Stats (if applicable) */}
      {(stats.save_shot !== null || stats.dry_match !== null) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-[#E5B73B] pl-3">
            {t('tabs.goalkeeping')}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.save_shot !== null && (
              <StatCard
                label={t('stats.saves')}
                value={stats.save_shot}
                color="bg-purple-50"
              />
            )}
            {stats.dry_match !== null && (
              <StatCard
                label={t('stats.cleanSheets')}
                value={stats.dry_match}
                color="bg-purple-50"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
