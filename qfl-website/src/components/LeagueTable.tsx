'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { scaleHover, scaleHoverLarge } from '@/lib/motion';
import { useLeagueTable } from '@/hooks';
import { LeagueTableSkeleton } from '@/components/ui/Skeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { getTeamLogo, getTeamColor } from '@/lib/utils/teamLogos';

export function LeagueTable() {
  const { t } = useTranslation();
  const { t: tErrors } = useTranslation('errors');
  const { standings, loading, error, refetch } = useLeagueTable({ limit: 14 });

  if (loading) {
    return <LeagueTableSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
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
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full flex flex-col">
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
      <div className="grid grid-cols-[28px_1fr_36px_44px_40px] gap-1 px-5 py-2 bg-gray-100 text-[11px] font-medium text-gray-500 uppercase tracking-wide">
        <div className="text-center">#</div>
        <div>{t('table.club')}</div>
        <div className="text-center">{t('table.matches')}</div>
        <div className="text-center">{t('table.goalDifference')}</div>
        <div className="text-center">{t('table.points')}</div>
      </div>

      {/* Table body */}
      <div className="divide-y divide-gray-50 flex-1 overflow-y-auto">
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
                  backgroundColor: 'rgba(30, 77, 140, 0.05)',
                  borderColor: 'rgb(30, 77, 140)',
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
                  className="text-xs text-gray-500 font-medium"
                  variants={{
                    rest: { color: 'rgb(107 114 128)', fontWeight: 500 },
                    hover: { color: '#1E4D8C', fontWeight: 700 },
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
                  className="font-medium text-gray-900 text-sm truncate"
                  variants={{
                    rest: { color: 'rgb(17 24 39)', fontWeight: 500 },
                    hover: { color: '#1E4D8C', fontWeight: 600 },
                  }}
                >
                  {team.team_name}
                </motion.span>
              </div>

              {/* Stats */}
              <motion.div
                className="text-center text-xs text-[#1E4D8C]"
                variants={{
                  rest: { fontWeight: 400 },
                  hover: { fontWeight: 600 },
                }}
              >
                {team.games_played}
              </motion.div>
              <motion.div
                className="text-center text-xs text-[#1E4D8C]"
                variants={{
                  rest: { fontWeight: 400 },
                  hover: { fontWeight: 600 },
                }}
              >
                {team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}
              </motion.div>

              {/* Points */}
              <motion.div
                className="text-center text-xs text-[#1E4D8C] font-bold"
                variants={{
                  rest: { scale: 1, color: '#1E4D8C' },
                  hover: { scale: 1.1, color: '#E5B73B', transition: { type: 'spring', stiffness: 400, damping: 20 } },
                }}
              >
                {team.points}
              </motion.div>
            </motion.a>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-5 py-2.5 border-t border-gray-100 flex items-center gap-4 text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5B73B]" />
          <span>Чемпион</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E4D8C]" />
          <span>Еврокубки</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>Вылет</span>
        </div>
      </div>
    </div>
  );
}
