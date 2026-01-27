'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GameTeam } from '@/types';
import { H2HOverallStats } from '@/types/h2h';
import { getTeamLogo } from '@/lib/utils/teamLogos';

interface H2HDonutChartProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  overall: H2HOverallStats;
  homeColor: string;
  awayColor: string;
}

export function H2HDonutChart({
  homeTeam,
  awayTeam,
  overall,
  homeColor,
  awayColor,
}: H2HDonutChartProps) {
  const { t } = useTranslation('match');

  const homeLogoUrl = homeTeam.logo_url || getTeamLogo(homeTeam.id);
  const awayLogoUrl = awayTeam.logo_url || getTeamLogo(awayTeam.id);

  // Calculate percentages for donut chart
  const { homePercent, drawPercent, awayPercent } = useMemo(() => {
    const total = overall.total_matches || 1;
    return {
      homePercent: (overall.team1_wins / total) * 100,
      drawPercent: (overall.draws / total) * 100,
      awayPercent: (overall.team2_wins / total) * 100,
    };
  }, [overall]);

  // SVG Donut chart calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 12;

  const homeOffset = 0;
  const homeLength = (homePercent / 100) * circumference;

  const drawOffset = homeLength;
  const drawLength = (drawPercent / 100) * circumference;

  const awayOffset = homeLength + drawLength;
  const awayLength = (awayPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Title */}
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
        {t('h2h.title', 'HEAD TO HEAD')}
      </h3>

      {/* Teams and Chart */}
      <div className="flex items-center justify-between w-full max-w-md">
        {/* Home Team */}
        <div className="flex flex-col items-center gap-2 w-20">
          <div className="w-14 h-14 flex items-center justify-center bg-gray-50 rounded-full p-2 border border-gray-100">
            {homeLogoUrl ? (
              <img
                src={homeLogoUrl}
                alt={homeTeam.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200" />
            )}
          </div>
          <span className="text-[10px] text-gray-500 text-center font-bold uppercase leading-tight line-clamp-2">
            {homeTeam.name}
          </span>
        </div>

        {/* Donut Chart */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
            />

            {/* Home wins segment */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={homeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={`${homeLength} ${circumference - homeLength}`}
              strokeDashoffset={-homeOffset}
              className="transition-all duration-700 ease-out"
            />

            {/* Draws segment */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#9CA3AF"
              strokeWidth={strokeWidth}
              strokeDasharray={`${drawLength} ${circumference - drawLength}`}
              strokeDashoffset={-drawOffset}
              className="transition-all duration-700 ease-out"
            />

            {/* Away wins segment */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={awayColor}
              strokeWidth={strokeWidth}
              strokeDasharray={`${awayLength} ${circumference - awayLength}`}
              strokeDashoffset={-awayOffset}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-gray-900">
              {overall.team1_wins}-{overall.draws}-{overall.team2_wins}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              {overall.total_matches} {t('h2h.totalMatches', 'матчей')}
            </span>
          </div>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center gap-2 w-20">
          <div className="w-14 h-14 flex items-center justify-center bg-gray-50 rounded-full p-2 border border-gray-100">
            {awayLogoUrl ? (
              <img
                src={awayLogoUrl}
                alt={awayTeam.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200" />
            )}
          </div>
          <span className="text-[10px] text-gray-500 text-center font-bold uppercase leading-tight line-clamp-2">
            {awayTeam.name}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: homeColor }}
          />
          <span className="text-gray-600 font-medium">
            {overall.team1_wins} {t('h2h.wins', 'побед')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span className="text-gray-600 font-medium">
            {overall.draws} {t('h2h.draws', 'ничьих')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: awayColor }}
          />
          <span className="text-gray-600 font-medium">
            {overall.team2_wins} {t('h2h.wins', 'побед')}
          </span>
        </div>
      </div>

      {/* Goals summary */}
      <div className="flex items-center justify-center gap-8 pt-2 border-t border-gray-100 w-full">
        <div className="text-center">
          <span className="text-lg font-bold" style={{ color: homeColor }}>
            {overall.team1_goals}
          </span>
          <p className="text-[10px] text-gray-500 uppercase">
            {t('h2h.goalsScored', 'голов')}
          </p>
        </div>
        <div className="text-gray-300">vs</div>
        <div className="text-center">
          <span className="text-lg font-bold" style={{ color: awayColor }}>
            {overall.team2_goals}
          </span>
          <p className="text-[10px] text-gray-500 uppercase">
            {t('h2h.goalsScored', 'голов')}
          </p>
        </div>
      </div>
    </div>
  );
}
