'use client';

import { useTranslation } from 'react-i18next';
import { GameTeam } from '@/types';
import { SeasonTableEntry, H2HComputedMetrics } from '@/types/h2h';
import { StatBar } from '../StatBar';

interface H2HSeasonStatsProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  seasonTable: SeasonTableEntry[];
  metrics: H2HComputedMetrics;
  homeColor: string;
  awayColor: string;
}

export function H2HSeasonStats({
  homeTeam,
  awayTeam,
  seasonTable,
  metrics,
  homeColor,
  awayColor,
}: H2HSeasonStatsProps) {
  const { t } = useTranslation('match');

  // Find teams in season table
  const homeEntry = seasonTable.find((t) => t.team_id === homeTeam.id);
  const awayEntry = seasonTable.find((t) => t.team_id === awayTeam.id);

  // Calculate additional metrics from season table
  const homeGoalsPerGame = homeEntry
    ? homeEntry.goals_scored / (homeEntry.games_played || 1)
    : 0;
  const awayGoalsPerGame = awayEntry
    ? awayEntry.goals_scored / (awayEntry.games_played || 1)
    : 0;

  const homeConcededPerGame = homeEntry
    ? homeEntry.goals_conceded / (homeEntry.games_played || 1)
    : 0;
  const awayConcededPerGame = awayEntry
    ? awayEntry.goals_conceded / (awayEntry.games_played || 1)
    : 0;

  const homeWinRate = homeEntry
    ? (homeEntry.wins / (homeEntry.games_played || 1)) * 100
    : 0;
  const awayWinRate = awayEntry
    ? (awayEntry.wins / (awayEntry.games_played || 1)) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Position in table */}
      {homeEntry && awayEntry && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div className="text-center">
            <span className="text-2xl font-black text-gray-900">
              #{homeEntry.position || '-'}
            </span>
            <p className="text-[10px] text-gray-500 uppercase mt-1">
              {t('h2h.tablePosition', 'позиция')}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase font-medium">
              {t('h2h.points', 'Очки')}
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-lg font-bold" style={{ color: homeColor }}>
                {homeEntry.points}
              </span>
              <span className="text-gray-300">-</span>
              <span className="text-lg font-bold" style={{ color: awayColor }}>
                {awayEntry.points}
              </span>
            </div>
          </div>
          <div className="text-center">
            <span className="text-2xl font-black text-gray-900">
              #{awayEntry.position || '-'}
            </span>
            <p className="text-[10px] text-gray-500 uppercase mt-1">
              {t('h2h.tablePosition', 'позиция')}
            </p>
          </div>
        </div>
      )}

      {/* Stats comparison */}
      <div className="space-y-5">
        <StatBar
          label={t('h2h.goalsPerGame', 'Голов за игру')}
          homeValue={parseFloat(homeGoalsPerGame.toFixed(1))}
          awayValue={parseFloat(awayGoalsPerGame.toFixed(1))}
          homeColor={homeColor}
          awayColor={awayColor}
        />

        <StatBar
          label={t('h2h.concededPerGame', 'Пропущено за игру')}
          homeValue={parseFloat(homeConcededPerGame.toFixed(1))}
          awayValue={parseFloat(awayConcededPerGame.toFixed(1))}
          homeColor={homeColor}
          awayColor={awayColor}
        />

        <StatBar
          label={t('h2h.winRate', 'Победы (%)')}
          homeValue={Math.round(homeWinRate)}
          awayValue={Math.round(awayWinRate)}
          homeColor={homeColor}
          awayColor={awayColor}
        />

        {homeEntry && awayEntry && (
          <StatBar
            label={t('h2h.cleanSheets', 'Сухие матчи')}
            homeValue={homeEntry.clean_sheets}
            awayValue={awayEntry.clean_sheets}
            homeColor={homeColor}
            awayColor={awayColor}
          />
        )}
      </div>

      {/* Additional stats row */}
      {homeEntry && awayEntry && (
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-bold" style={{ color: homeColor }}>
                {homeEntry.wins}
              </span>
              <span className="text-gray-300">-</span>
              <span className="text-sm font-bold" style={{ color: awayColor }}>
                {awayEntry.wins}
              </span>
            </div>
            <p className="text-[9px] text-gray-500 uppercase mt-1">
              {t('h2h.seasonWins', 'Побед')}
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-bold" style={{ color: homeColor }}>
                {homeEntry.goals_scored}
              </span>
              <span className="text-gray-300">-</span>
              <span className="text-sm font-bold" style={{ color: awayColor }}>
                {awayEntry.goals_scored}
              </span>
            </div>
            <p className="text-[9px] text-gray-500 uppercase mt-1">
              {t('h2h.goalsScored', 'Голов')}
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-bold" style={{ color: homeColor }}>
                {homeEntry.goal_difference > 0 ? '+' : ''}
                {homeEntry.goal_difference}
              </span>
              <span className="text-gray-300">-</span>
              <span className="text-sm font-bold" style={{ color: awayColor }}>
                {awayEntry.goal_difference > 0 ? '+' : ''}
                {awayEntry.goal_difference}
              </span>
            </div>
            <p className="text-[9px] text-gray-500 uppercase mt-1">
              {t('h2h.goalDiff', 'Разница')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
