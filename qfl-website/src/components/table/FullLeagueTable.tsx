'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { TeamStanding } from '@/types';
import { FormIndicator } from './FormIndicator';
import { NextMatchBadge } from './NextMatchBadge';
import { getTeamLogo, getTeamColor } from '@/lib/utils/teamLogos';

interface FullLeagueTableProps {
  standings: TeamStanding[];
}

export function FullLeagueTable({ standings }: FullLeagueTableProps) {
  const { t } = useTranslation('table');

  // Get position indicator color
  const getPositionStyle = (position: number) => {
    if (position === 1) return { dot: 'bg-[#E5B73B]', border: 'border-l-[#E5B73B]' };
    if (position <= 4) return { dot: 'bg-[#1E4D8C]', border: 'border-l-[#1E4D8C]' };
    if (position >= 13) return { dot: 'bg-red-500', border: 'border-l-red-500' };
    return { dot: null, border: 'border-l-transparent' };
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1E4D8C] text-white text-xs font-medium">
              <th className="py-3 px-4 text-center w-12">#</th>
              <th className="py-3 px-4 text-left">{t('columns.team')}</th>
              <th className="py-3 px-2 text-center w-10">{t('columns.played')}</th>
              <th className="py-3 px-2 text-center w-10">{t('columns.wins')}</th>
              <th className="py-3 px-2 text-center w-10">{t('columns.draws')}</th>
              <th className="py-3 px-2 text-center w-10">{t('columns.losses')}</th>
              <th className="py-3 px-2 text-center w-10">{t('columns.goalsFor')}</th>
              <th className="py-3 px-2 text-center w-10">{t('columns.goalsAgainst')}</th>
              <th className="py-3 px-2 text-center w-12">{t('columns.goalDiff')}</th>
              <th className="py-3 px-2 text-center w-12 bg-[#163A6B]">{t('columns.points')}</th>
              <th className="py-3 px-2 text-center w-28">{t('columns.form')}</th>
              <th className="py-3 px-2 text-center w-16">{t('columns.nextMatch')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
            {standings.map((team) => {
              const logoUrl = team.team_logo || getTeamLogo(team.team_id);
              const teamColor = getTeamColor(team.team_id);
              const positionStyle = getPositionStyle(team.position);

              return (
                <tr
                  key={team.team_id}
                  className={`hover:bg-[#1E4D8C]/5 dark:hover:bg-blue-500/10 transition-colors border-l-4 ${positionStyle.border}`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      {positionStyle.dot && (
                        <span className={`w-2 h-2 rounded-full ${positionStyle.dot}`} />
                      )}
                      <span className="font-bold text-gray-700 dark:text-slate-200">{team.position}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/team/${team.team_id}`}
                      className="flex items-center gap-3 group"
                    >
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={team.team_name}
                          className="w-7 h-7 object-contain transition-transform group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${logoUrl ? 'hidden' : ''}`}
                        style={{ backgroundColor: teamColor }}
                      >
                        {team.team_name[0]}
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-slate-100 group-hover:text-[#1E4D8C] dark:group-hover:text-blue-400 transition-colors">
                        {team.team_name}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3 px-2 text-center text-sm text-gray-600 dark:text-slate-300">{team.games_played}</td>
                  <td className="py-3 px-2 text-center text-sm text-green-600 dark:text-green-400 font-medium">{team.wins}</td>
                  <td className="py-3 px-2 text-center text-sm text-gray-500 dark:text-slate-400">{team.draws}</td>
                  <td className="py-3 px-2 text-center text-sm text-red-500 dark:text-red-400">{team.losses}</td>
                  <td className="py-3 px-2 text-center text-sm text-gray-600 dark:text-slate-300">{team.goals_scored}</td>
                  <td className="py-3 px-2 text-center text-sm text-gray-600 dark:text-slate-300">{team.goals_conceded}</td>
                  <td className="py-3 px-2 text-center text-sm font-medium">
                    <span className={team.goal_difference > 0 ? 'text-green-600 dark:text-green-400' : team.goal_difference < 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-slate-400'}>
                      {team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center bg-gray-50 dark:bg-dark-surface-soft">
                    <span className="text-lg font-bold text-[#1E4D8C] dark:text-accent-cyan">{team.points}</span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex justify-center">
                      <FormIndicator form={team.form} />
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex justify-center">
                      <NextMatchBadge nextGame={team.next_game} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Table */}
      <div className="lg:hidden">
        <div className="bg-[#1E4D8C] text-white text-[10px] font-medium grid grid-cols-[40px_1fr_32px_40px_36px_70px] gap-1 px-3 py-2">
          <div className="text-center">#</div>
          <div>{t('columns.team')}</div>
          <div className="text-center">{t('columns.playedShort')}</div>
          <div className="text-center">{t('columns.goalDiffShort')}</div>
          <div className="text-center">{t('columns.pointsShort')}</div>
          <div className="text-center">{t('columns.form')}</div>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-dark-border">
          {standings.map((team) => {
            const logoUrl = team.team_logo || getTeamLogo(team.team_id);
            const teamColor = getTeamColor(team.team_id);
            const positionStyle = getPositionStyle(team.position);

            return (
              <Link
                key={team.team_id}
                href={`/team/${team.team_id}`}
                className={`grid grid-cols-[40px_1fr_32px_40px_36px_70px] gap-1 px-3 py-2.5 items-center hover:bg-[#1E4D8C]/5 dark:hover:bg-blue-500/10 border-l-4 ${positionStyle.border}`}
              >
                <div className="flex items-center justify-center gap-1">
                  {positionStyle.dot && (
                    <span className={`w-1.5 h-1.5 rounded-full ${positionStyle.dot}`} />
                  )}
                  <span className="text-xs font-bold text-gray-700 dark:text-slate-200">{team.position}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={team.team_name}
                      className="w-5 h-5 object-contain shrink-0"
                    />
                  ) : (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0"
                      style={{ backgroundColor: teamColor }}
                    >
                      {team.team_name[0]}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">
                    {team.team_name}
                  </span>
                </div>
                <div className="text-center text-xs text-gray-600 dark:text-slate-300">{team.games_played}</div>
                <div className="text-center text-xs font-medium">
                  <span className={team.goal_difference > 0 ? 'text-green-600 dark:text-green-400' : team.goal_difference < 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-slate-400'}>
                    {team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}
                  </span>
                </div>
                <div className="text-center text-sm font-bold text-[#1E4D8C] dark:text-accent-cyan">{team.points}</div>
                <div className="flex justify-center">
                  <FormIndicator form={team.form} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E5B73B]" />
          <span>{t('legend.champion')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1E4D8C]" />
          <span>{t('legend.euroCups')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>{t('legend.relegation')}</span>
        </div>
      </div>
    </div>
  );
}
