'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { scaleHover, scaleHoverLarge } from '@/lib/motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useTournament } from '@/contexts/TournamentContext';
import { useLeagueTable } from '@/hooks';
import { LeagueTableSkeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { getTeamLogo, getTeamColor } from '@/lib/utils/teamLogos';

export function LeagueTable() {
  const { t } = useTranslation();
  const { t: tErrors } = useTranslation('errors');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { effectiveSeasonId, showTable, currentTournament } = useTournament();
  const { standings, loading, error, refetch } = useLeagueTable({
    seasonId: effectiveSeasonId,
    limit: 14
  });

  // Show placeholder for non-table tournaments (e.g., Cup)
  if (!showTable) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden h-full flex flex-col">
        <div className="px-5 py-3 bg-[#1E4D8C]">
          <h2 className="text-lg font-bold text-white">{currentTournament.name.ru}</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <p className="text-gray-500 dark:text-slate-400">
            {t('tableLegend.noBracket', { defaultValue: 'Бұл турнир үшін турнирлық кесте жоқ' })}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LeagueTableSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border p-4">
        <ErrorMessage message={tErrors('loadTable')} onRetry={refetch} compact />
      </div>
    );
  }

  // Get position dot color (only for special positions)
  const getPositionDotColor = (position: number) => {
    if (position === 1) return 'bg-[#E5B73B]'; // Чемпион
    if (position <= 4) return 'bg-[#1E4D8C]'; // Еврокубки
    if (position === 14) return 'bg-red-500'; // Вылет
    return null; // No dot for regular positions
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-3 bg-[#1E4D8C]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {t('sections.leagueTable')}
          </h2>
          <Link
            href="/table"
            className="text-sm font-medium text-white/70 hover:text-white flex items-center group"
          >
            <motion.span whileHover={{ color: '#ffffff' }} transition={{ duration: 0.2 }}>
              {t('buttons.fullTable')}
            </motion.span>
            <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[28px_1fr_36px_44px_40px] gap-1 px-5 py-2 bg-gray-100 dark:bg-dark-surface-soft text-[11px] font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">
        <div className="text-center">#</div>
        <div>{t('table.club')}</div>
        <div className="text-center">{t('table.matches')}</div>
        <div className="text-center">{t('table.goalDifference')}</div>
        <div className="text-center">{t('table.points')}</div>
      </div>

      {/* Table body */}
      <div className="divide-y divide-gray-50 dark:divide-dark-border flex-1 overflow-y-auto">
        {standings.map((team) => {
          const logoUrl = team.team_logo || getTeamLogo(team.team_id);
          const teamColor = getTeamColor(team.team_id);

          return (
            <motion.a
              key={team.team_id}
              href={`/team/${team.team_id}`}
              initial="rest"
              whileHover="hover"
              className="grid grid-cols-[28px_1fr_36px_44px_40px] gap-1 px-5 py-2.5 items-center border-l-2 group"
              variants={{
                rest: {
                  y: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0)',
                  borderColor: 'rgba(0, 0, 0, 0)',
                  boxShadow: '0 0 0 0 rgb(0 0 0 / 0)',
                  transition: { duration: 0.2 },
                },
                hover: {
                  y: -2,
                  backgroundColor: isDark ? 'rgba(103, 232, 249, 0.05)' : 'rgba(30, 77, 140, 0.05)',
                  borderColor: isDark ? 'rgb(103, 232, 249)' : 'rgb(30, 77, 140)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  transition: { duration: 0.2 },
                },
              }}
            >
              {/* Position */}
              <div className="flex items-center justify-center gap-1">
                {getPositionDotColor(team.position) && (
                  <motion.span
                    className={`w-1.5 h-1.5 rounded-full ${getPositionDotColor(team.position)}`}
                    variants={scaleHoverLarge}
                  />
                )}
                <motion.span
                  className="text-xs text-gray-500 dark:text-slate-400 font-medium"
                  variants={{
                    rest: { fontWeight: 500 },
                    hover: { fontWeight: 700 },
                  }}
                >
                  {team.position}
                </motion.span>
              </div>

              {/* Team */}
              <div className="flex items-center gap-2 min-w-0">
                {logoUrl ? (
                  <motion.img
                    src={logoUrl}
                    alt={team.team_name}
                    loading="lazy"
                    variants={scaleHover}
                    className="w-5 h-5 object-contain shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <motion.div
                  variants={scaleHover}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0 ${logoUrl ? 'hidden' : ''}`}
                  style={{ backgroundColor: teamColor }}
                >
                  {team.team_name[0]}
                </motion.div>
                <motion.span
                  className="font-medium text-gray-900 dark:text-slate-100 text-sm truncate"
                  variants={{
                    rest: { fontWeight: 500 },
                    hover: { fontWeight: 600 },
                  }}
                >
                  {team.team_name}
                </motion.span>
              </div>

              {/* Stats */}
              <motion.div
                className="text-center text-xs text-[#1E4D8C] dark:text-accent-cyan"
                variants={{
                  rest: { fontWeight: 400 },
                  hover: { fontWeight: 600 },
                }}
              >
                {team.games_played}
              </motion.div>
              <motion.div
                className="text-center text-xs text-[#1E4D8C] dark:text-accent-cyan"
                variants={{
                  rest: { fontWeight: 400 },
                  hover: { fontWeight: 600 },
                }}
              >
                {team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}
              </motion.div>

              {/* Points */}
              <motion.div
                className="text-center text-xs text-[#1E4D8C] dark:text-accent-cyan font-bold"
                variants={{
                  rest: { scale: 1 },
                  hover: { scale: 1.1, transition: { type: 'spring', stiffness: 400, damping: 20 } },
                }}
              >
                {team.points}
              </motion.div>
            </motion.a>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-5 py-2.5 border-t border-gray-100 dark:border-dark-border flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-gray-400 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5B73B]" />
          <span>{t('tableLegend.champion')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E4D8C]" />
          <span>{t('tableLegend.europeanCups')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>{t('tableLegend.relegation')}</span>
        </div>
      </div>
    </div>
  );
}
