'use client';

import { MatchDetail } from '@/types';

interface MiniKeyStatsProps {
  stats: MatchDetail['stats'];
  homeColor: string;
  awayColor: string;
}

// SVG Progress Circle for possession
function ProgressCircle({ value, color }: { value: number; color: string }) {
  const size = 56;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className="stroke-gray-200 dark:stroke-dark-border"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-slate-200">
        {value}
      </span>
    </div>
  );
}

// Possession row with progress circles
function PossessionRow({
  homeValue,
  awayValue,
  homeColor,
  awayColor
}: {
  homeValue: number;
  awayValue: number;
  homeColor: string;
  awayColor: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <ProgressCircle value={homeValue} color={homeColor} />

      <div className="flex-1">
        <p className="text-center text-xs font-medium text-gray-500 dark:text-slate-400 tracking-wide">
          Possession (%)
        </p>
      </div>

      <ProgressCircle value={awayValue} color={awayColor} />
    </div>
  );
}

// Simple stat row with numbers and bar (no circles)
function SimpleStatRow({
  label,
  homeValue,
  awayValue,
  homeColor,
  awayColor
}: {
  label: string;
  homeValue: number;
  awayValue: number;
  homeColor: string;
  awayColor: string;
}) {
  const total = homeValue + awayValue;
  const homePercent = total === 0 ? 50 : (homeValue / total) * 100;
  const awayPercent = total === 0 ? 50 : (awayValue / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-700 dark:text-slate-200 w-8">{homeValue}</span>
        <span className="text-xs font-medium text-gray-500 dark:text-slate-400 tracking-wide">{label}</span>
        <span className="text-sm font-bold text-gray-700 dark:text-slate-200 w-8 text-right">{awayValue}</span>
      </div>

      <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-100 dark:bg-dark-border">
        <div
          className="transition-all duration-700 ease-out rounded-l-full"
          style={{ width: `${homePercent}%`, backgroundColor: homeColor }}
        />
        <div
          className="transition-all duration-700 ease-out rounded-r-full"
          style={{ width: `${awayPercent}%`, backgroundColor: awayColor }}
        />
      </div>
    </div>
  );
}

export function MiniKeyStats({ stats, homeColor, awayColor }: MiniKeyStatsProps) {
  if (!stats) return null;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-dark-border p-6 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6">Key stats</h3>

      <div className="space-y-6">
        {/* Possession with circles */}
        <PossessionRow
          homeValue={stats.possession?.home || 0}
          awayValue={stats.possession?.away || 0}
          homeColor={homeColor}
          awayColor={awayColor}
        />

        {/* Other stats - simple rows */}
        <SimpleStatRow
          label="Total attempts"
          homeValue={stats.shots?.home || 0}
          awayValue={stats.shots?.away || 0}
          homeColor={homeColor}
          awayColor={awayColor}
        />

        <SimpleStatRow
          label="Shots on target"
          homeValue={stats.shots_on_target?.home || 0}
          awayValue={stats.shots_on_target?.away || 0}
          homeColor={homeColor}
          awayColor={awayColor}
        />

        <SimpleStatRow
          label="Corners taken"
          homeValue={stats.corners?.home || 0}
          awayValue={stats.corners?.away || 0}
          homeColor={homeColor}
          awayColor={awayColor}
        />
      </div>
    </div>
  );
}
