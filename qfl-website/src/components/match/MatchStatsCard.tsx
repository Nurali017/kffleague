'use client';

import { GameTeam } from '@/types';
import { HOME_COLOR, AWAY_COLOR } from '@/lib/utils/teamLogos';

interface MatchStat {
  label: string;
  homeValue: number;
  awayValue: number;
}

interface MatchStatsCardProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  stats?: MatchStat[];
}

const defaultStats: MatchStat[] = [
  { label: 'Владение мячом (%)', homeValue: 58, awayValue: 42 },
  { label: 'Удары по воротам', homeValue: 15, awayValue: 8 },
  { label: 'Удары в створ', homeValue: 7, awayValue: 3 },
  { label: 'Угловые', homeValue: 6, awayValue: 4 },
  { label: 'Офсайды', homeValue: 2, awayValue: 5 },
  { label: 'Фолы', homeValue: 12, awayValue: 10 },
];

export function MatchStatsCard({ homeTeam, awayTeam, stats = defaultStats }: MatchStatsCardProps) {
  const homeColor = HOME_COLOR;
  const awayColor = AWAY_COLOR;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900">Статистика команд</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: homeColor }} />
            <span className="text-xs font-semibold text-gray-500">{homeTeam.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: awayColor }} />
            <span className="text-xs font-semibold text-gray-500">{awayTeam.name}</span>
          </div>
        </div>
      </div>

      {/* Stats Body */}
      <div className="p-6 space-y-6">
        {stats.map((stat, index) => {
          const total = stat.homeValue + stat.awayValue;
          // Avoid division by zero
          const homePercentage = total === 0 ? 50 : Math.min((stat.homeValue / total) * 100, 100);
          const awayPercentage = total === 0 ? 50 : Math.min((stat.awayValue / total) * 100, 100);

          // Determine winner of stat for bold styling
          const homeWin = stat.homeValue > stat.awayValue;
          const awayWin = stat.awayValue > stat.homeValue;

          return (
            <div key={index} className="space-y-2">
              {/* Stat Header - Values + Label */}
              <div className="flex items-center justify-between text-sm">
                <span className={`w-12 text-left font-bold ${homeWin ? 'text-gray-900 text-base' : 'text-gray-500'}`}>
                  {stat.homeValue}
                </span>

                <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider text-center flex-1">
                  {stat.label}
                </span>

                <span className={`w-12 text-right font-bold ${awayWin ? 'text-gray-900 text-base' : 'text-gray-500'}`}>
                  {stat.awayValue}
                </span>
              </div>

              {/* Dual Progress Bar */}
              <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
                {/* Home Bar (Grows from Left) */}
                <div
                  className="rounded-l-full transition-all duration-1000 ease-out flex justify-end"
                  style={{ width: `50%` }} // Half width container
                >
                  <div
                    className="h-full bg-blue-700 transition-all duration-1000"
                    style={{
                      width: `${(stat.homeValue / Math.max(stat.homeValue, stat.awayValue)) * 100}%`,
                      opacity: homeWin ? 1 : 0.7
                    }}
                  />
                </div>

                {/* Divide Space */}
                <div className="w-0.5 bg-white z-10" />

                {/* Away Bar (Grows from Right - visual trick using flex) */}
                <div
                  className="rounded-r-full transition-all duration-1000 ease-out flex justify-start"
                  style={{ width: `50%` }} // Half width container
                >
                  <div
                    className="h-full bg-yellow-500 transition-all duration-1000"
                    style={{
                      width: `${(stat.awayValue / Math.max(stat.homeValue, stat.awayValue)) * 100}%`,
                      opacity: awayWin ? 1 : 0.7
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
