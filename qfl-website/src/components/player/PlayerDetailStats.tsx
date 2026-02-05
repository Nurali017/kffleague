import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlayerPageStats } from '@/types/player';
import { cn } from '@/lib/utils/cn';
import { PlayerPageVariant } from './playerPageVariants';

interface PlayerDetailStatsProps {
  stats?: PlayerPageStats | null;
  variant?: PlayerPageVariant;
}

interface StatTileProps {
  label: string;
  value: number | string;
  highlight?: boolean;
  variant: PlayerPageVariant;
}

interface CircularChartProps {
  value: number;
  label: string;
  variant: PlayerPageVariant;
}

function StatTile({ label, value, highlight = false, variant }: StatTileProps) {
  return (
    <article
      className={cn(
        'rounded-xl border px-3 py-3 transition-colors md:px-4',
        variant === 'studio'
          ? 'border-white/15 bg-white/10'
          : variant === 'data'
            ? 'border-slate-200 bg-slate-50 dark:border-dark-border dark:bg-dark-surface/80'
            : 'border-slate-200 bg-white dark:border-dark-border dark:bg-dark-surface-soft',
        highlight && variant !== 'studio' ? 'ring-2 ring-primary/20 dark:ring-accent-cyan/20' : ''
      )}
    >
      <p
        className={cn(
          'text-xl font-black md:text-2xl',
          variant === 'studio'
            ? 'text-white'
            : highlight
              ? 'text-primary dark:text-accent-cyan'
              : 'text-slate-900 dark:text-white'
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          'mt-1 text-[10px] font-bold uppercase tracking-wide md:text-[11px]',
          variant === 'studio' ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
        )}
      >
        {label}
      </p>
    </article>
  );
}

function CircularChart({ value, label, variant }: CircularChartProps) {
  const radius = 44;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative flex h-[140px] w-[140px] flex-col items-center justify-center md:h-[170px] md:w-[170px]">
      <svg className="h-full w-full -rotate-90">
        <circle
          className={cn(variant === 'studio' ? 'text-white/20' : 'text-slate-200 dark:text-slate-700')}
          strokeWidth={stroke}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        <circle
          className={cn(
            'transition-all duration-700',
            variant === 'studio' ? 'text-cyan-300' : 'text-primary dark:text-accent-cyan'
          )}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            'text-2xl font-black md:text-3xl',
            variant === 'studio' ? 'text-white' : 'text-slate-900 dark:text-white'
          )}
        >
          {clamped}%
        </span>
      </div>
      <span
        className={cn(
          'absolute -bottom-6 text-center text-[10px] font-bold uppercase tracking-wide md:-bottom-7 md:text-xs',
          variant === 'studio' ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function PlayerDetailStats({ stats, variant = 'clarity' }: PlayerDetailStatsProps) {
  const { t } = useTranslation('player');

  if (!stats) return null;

  const duels = stats.duels ?? 0;
  const duelsWon = stats.duels_won ?? 0;
  const duelsWonPercentage = duels > 0 ? Math.round((duelsWon / duels) * 100) : 0;
  const passAccuracy = stats.pass_accuracy ?? 0;

  const statTiles = [
    { label: t('stats.goals', 'Голы'), value: stats.goals ?? 0, highlight: true },
    { label: t('stats.assists', 'Ассисты'), value: stats.assists ?? 0, highlight: true },
    { label: t('shotsOnTarget', 'Удары'), value: stats.shots ?? 0 },
    { label: t('shotsOnTargetAccurate', 'В створ'), value: stats.shots_on_goal ?? 0 },
    { label: t('totalPasses', 'Передачи'), value: stats.passes ?? 0 },
    { label: t('keyPassesLabel', 'Ключевые передачи'), value: stats.key_passes ?? 0 },
    { label: t('successfulDuels', 'Выигранные единоборства'), value: duelsWonPercentage },
    { label: t('duelsLabel', 'Единоборства'), value: duels },
    { label: t('duelsWonLabel', 'Выиграно'), value: duelsWon },
    { label: t('stats.yellowCards', 'Желтые карточки'), value: stats.yellow_cards ?? 0 },
    { label: t('stats.redCards', 'Красные карточки'), value: stats.red_cards ?? 0 },
    { label: t('ballRecoveries', 'Перехваты'), value: stats.interception ?? 0 },
  ];

  return (
    <section
      aria-labelledby="detail-stats-heading"
      className={cn(
        'rounded-2xl border p-4 md:p-6',
        variant === 'studio'
          ? 'border-white/10 bg-[#0a162a] text-white shadow-[0_20px_40px_rgba(3,10,25,0.5)]'
          : variant === 'data'
            ? 'border-slate-200 bg-white dark:border-dark-border dark:bg-dark-surface'
            : 'border-slate-200 bg-white shadow-sm dark:border-dark-border dark:bg-dark-surface'
      )}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h2
          id="detail-stats-heading"
          className={cn(
            'text-lg font-black md:text-xl',
            variant === 'studio' ? 'text-white' : 'text-slate-900 dark:text-white'
          )}
        >
          {t('detailedStats', 'Детальная статистика')}
        </h2>
        <span
          className={cn(
            'rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide',
            variant === 'studio'
              ? 'bg-white/10 text-white/75'
              : 'bg-slate-100 text-slate-500 dark:bg-dark-surface dark:text-slate-400'
          )}
        >
          {t('seasonStats', 'Season')}
        </span>
      </div>

      <div className="grid gap-8 xl:grid-cols-[200px_1fr_200px] xl:items-center">
        <div className="mx-auto mb-2 xl:mb-0">
          <CircularChart value={passAccuracy} label={t('passAccuracyLabel', 'Точность передач')} variant={variant} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {statTiles.map((item) => (
            <StatTile
              key={item.label}
              label={item.label}
              value={item.value}
              highlight={item.highlight}
              variant={variant}
            />
          ))}
        </div>

        <div className="mx-auto mt-2 xl:mt-0">
          <CircularChart value={duelsWonPercentage} label={t('successfulDuels', 'Выигранные дуэли')} variant={variant} />
        </div>
      </div>
    </section>
  );
}
