'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TeamOverviewSummary, TeamStats } from '@/types/team';
import { SectionCard, SectionHeader } from './TeamUiPrimitives';

interface TeamKeyStatsProps {
  stats: TeamOverviewSummary;
  details?: TeamStats | null;
}

function MatchesRing({
  played,
  won,
  drawn,
  lost,
}: {
  played: number;
  won: number;
  drawn: number;
  lost: number;
}) {
  const { t: tStats } = useTranslation('statistics');
  const total = Math.max(won + drawn + lost, 1);
  const radius = 56;
  const size = 140;
  const circumference = 2 * Math.PI * radius;
  const segmentGap = 3;
  let segmentOffset = 0;
  const segments = [
    { value: won, color: '#1947e5' },
    { value: drawn, color: '#1fc8d7' },
    { value: lost, color: '#ef5aa0' },
  ];

  return (
    <div className="relative h-[140px] w-[140px] shrink-0">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-gray-200 dark:stroke-white/15"
          strokeWidth="6"
        />
        {segments.map((segment, index) => {
          const rawLength = (segment.value / total) * circumference;
          const length = Math.max(rawLength - segmentGap, 0);
          const arc = (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="6"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-segmentOffset}
              strokeLinecap="round"
            />
          );
          segmentOffset += rawLength;
          return length > 0 ? arc : null;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black leading-none text-slate-900 dark:text-white">
          {played}
        </span>
        <span className="mt-0.5 text-[11px] leading-tight text-slate-500 dark:text-white/60">
          {tStats('labels.matchesPlayed', 'Сыграно матчей')}
        </span>
      </div>
    </div>
  );
}

function ResultRow({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span className="w-6 text-base font-black text-slate-900 dark:text-white">{value}</span>
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs text-slate-500 dark:text-white/60">{label}</span>
    </div>
  );
}

function MetricStat({
  value,
  label,
  avg,
  accentColor,
}: {
  value: string;
  label: string;
  avg?: string;
  accentColor?: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        {accentColor ? (
          <span className="h-5 w-3.5 rounded-[2px]" style={{ backgroundColor: accentColor }} />
        ) : null}
        <span className="truncate text-xl font-black leading-none text-slate-900 dark:text-white">
          {value}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-white/60">{label}</p>
      {avg ? (
        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-white/45">{avg}</p>
      ) : null}
    </div>
  );
}

function formatValue(value?: number | null, fractionDigits = 0): string {
  if (value == null || Number.isNaN(value)) return '—';
  if (fractionDigits > 0) return value.toFixed(fractionDigits);
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2);
}

function formatPercent(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return '—';
  return `${Number.isInteger(value) ? value : value.toFixed(2)}%`;
}

export function TeamKeyStats({ stats, details }: TeamKeyStatsProps) {
  const { t: tTeam } = useTranslation('team');
  const { t: tStats } = useTranslation('statistics');

  const goalsScored = details?.goals_scored ?? stats.goals_scored ?? null;
  const goalsConceded = details?.goals_conceded ?? stats.goals_conceded ?? null;
  const possession = details?.possession_avg ?? null;
  const passAccuracy = details?.pass_accuracy_avg ?? null;

  return (
    <SectionCard className="p-4 md:p-5">
      <SectionHeader title={tTeam('sections.keyStats', 'Ключевая статистика')} />

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
        {/* Left — ring + results + button */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <MatchesRing
              played={stats.games_played}
              won={stats.wins}
              drawn={stats.draws}
              lost={stats.losses}
            />
            <div>
              <ResultRow value={stats.wins} label={tTeam('stats.wins', 'Победы')} color="#1947e5" />
              <ResultRow value={stats.draws} label={tTeam('stats.draws', 'Ничьи')} color="#1fc8d7" />
              <ResultRow value={stats.losses} label={tTeam('stats.losses', 'Поражения')} color="#ef5aa0" />
            </div>
          </div>

          <Link
            href="/stats"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10 dark:border-cyan-300/30 dark:bg-cyan-300/10 dark:text-cyan-300 dark:hover:bg-cyan-300/15"
          >
            {tTeam('buttons.seeAllStats', 'Вся статистика')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Right — stats grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          <MetricStat
            value={formatValue(goalsScored)}
            label={tStats('labels.goals', 'Голы')}
          />
          <MetricStat
            value={formatValue(goalsConceded)}
            label={tStats('labels.goalsConceded', 'Пропущенные голы')}
          />
          <MetricStat
            value={formatPercent(possession)}
            label={tStats('labels.possession', 'Владение (%)')}
          />
          <MetricStat
            value={formatPercent(passAccuracy)}
            label={tStats('labels.passingAccuracy', 'Точность паса (%)')}
          />
        </div>
      </div>
    </SectionCard>
  );
}
