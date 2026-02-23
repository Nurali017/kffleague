'use client';

import { useTranslation } from 'react-i18next';
import { Crown, Trophy, Star } from 'lucide-react';
import { motion } from 'motion/react';
import {
  TROPHY_CATEGORIES,
  TeamTrophyData,
  getSuperCupTrophyData,
} from '@/config/superCupTrophyData';

const ICON_MAP = {
  crown: Crown,
  trophy: Trophy,
  star: Star,
} as const;

/* ── Compact variant (for homepage hero) ── */

function CompactTrophyCabinet() {
  const { t } = useTranslation('match');
  const [home, away] = getSuperCupTrophyData();

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 dark:bg-black/40 dark:border-white/10 px-3 py-2.5 sm:px-4 sm:py-3">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-white/50 uppercase tracking-wider">
            {t('trophyCabinet.title')}
          </span>
        </div>

        {/* Bars */}
        <div className="space-y-1.5">
          {TROPHY_CATEGORIES.map((cat) => {
            const homeCount = home.trophies[cat.key].count;
            const awayCount = away.trophies[cat.key].count;
            const max = Math.max(homeCount, awayCount, 1);
            const Icon = ICON_MAP[cat.icon as keyof typeof ICON_MAP];

            return (
              <div key={cat.key} className="flex items-center gap-2">
                {/* Home bar (right-aligned) */}
                <div className="flex-1 flex items-center justify-end gap-1.5">
                  <span className="text-xs font-bold text-gray-800 dark:text-white tabular-nums">{homeCount}</span>
                  <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden" style={{ width: '60%' }}>
                    <div
                      className="h-full rounded-full bg-amber-400 animate-sc-bar-fill"
                      style={{ '--bar-width': `${(homeCount / max) * 100}%`, float: 'right' } as React.CSSProperties}
                    />
                  </div>
                </div>

                {/* Icon + label */}
                <div className="flex flex-col items-center w-16 sm:w-20 shrink-0">
                  <Icon className="w-3 h-3 text-amber-500/70 dark:text-amber-400/70" />
                  <span className="text-[10px] text-gray-400 dark:text-white/40 font-medium leading-tight">
                    {t(cat.labelKey)}
                  </span>
                </div>

                {/* Away bar (left-aligned) */}
                <div className="flex-1 flex items-center gap-1.5">
                  <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden" style={{ width: '60%' }}>
                    <div
                      className="h-full rounded-full bg-green-500 animate-sc-bar-fill"
                      style={{ '--bar-width': `${(awayCount / max) * 100}%` } as React.CSSProperties}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-800 dark:text-white tabular-nums">{awayCount}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-white/10">
          <span className="text-sm font-black text-amber-500 dark:text-amber-400 tabular-nums">{home.total}</span>
          <span className="text-[10px] text-gray-400 dark:text-white/40 font-bold uppercase tracking-wider">
            {t('trophyCabinet.total')}
          </span>
          <span className="text-sm font-black text-green-500 dark:text-green-400 tabular-nums">{away.total}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Full variant (for match detail page) ── */

function TrophyCard({ team, delay = 0 }: { team: TeamTrophyData; delay?: number }) {
  const { t } = useTranslation('match');
  const colorClass = team.color === 'amber' ? 'text-gray-900 dark:text-amber-400' : 'text-green-600 dark:text-green-400';
  const bgClass = team.color === 'amber' ? 'bg-amber-400' : 'bg-green-500';
  const glowClass = team.color === 'amber' ? 'shadow-amber-400/20' : 'shadow-green-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 22 }}
      className={`bg-white rounded-2xl border border-gray-200 dark:bg-black/40 dark:backdrop-blur-md dark:border-white/10 p-5 sm:p-6 shadow-lg ${glowClass} dark:animate-sc-trophy-glow`}
    >
      {/* Team name + total */}
      <div className="flex items-center justify-between mb-5">
        <h3 className={`text-lg font-bold ${colorClass}`}>{team.teamName}</h3>
        <div className="flex items-center gap-1.5">
          <span className={`text-2xl font-black ${colorClass} tabular-nums`}>{team.total}</span>
          <span className="text-xs text-gray-400 dark:text-white/40 font-medium">{t('trophyCabinet.trophies')}</span>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {TROPHY_CATEGORIES.map((cat, i) => {
          const data = team.trophies[cat.key];
          const Icon = ICON_MAP[cat.icon as keyof typeof ICON_MAP];

          return (
            <div key={cat.key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${colorClass}`} />
                  <span className="text-sm font-semibold text-gray-700 dark:text-white/80">
                    {t(cat.labelKey)}
                  </span>
                </div>
                <span className={`text-lg font-black ${colorClass} tabular-nums`}>{data.count}</span>
              </div>

              {/* Year pills */}
              <div className="flex flex-wrap gap-1.5">
                {data.years.map((year, j) => (
                  <span
                    key={year}
                    className={`animate-sc-pill-pop inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${bgClass}/15 ${colorClass} border border-current/20`}
                    style={{ animationDelay: `${delay + 0.3 + (i * 0.1) + (j * 0.05)}s`, opacity: 0 }}
                  >
                    {year}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function FullTrophyCabinet() {
  const { t } = useTranslation('match');
  const [home, away] = getSuperCupTrophyData();

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('trophyCabinet.title')}</h2>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrophyCard team={home} delay={0.1} />
        <TrophyCard team={away} delay={0.25} />
      </div>
    </div>
  );
}

/* ── Public API ── */

interface TrophyCabinetProps {
  variant: 'compact' | 'full';
}

export function TrophyCabinet({ variant }: TrophyCabinetProps) {
  return variant === 'compact' ? <CompactTrophyCabinet /> : <FullTrophyCabinet />;
}
