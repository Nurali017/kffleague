'use client';

import { useTranslation } from 'react-i18next';
import { GameTeam } from '@/types';
import { FormGuide } from '@/types/h2h';

interface H2HFormStreakProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  formGuide: {
    team1: FormGuide;
    team2: FormGuide;
  };
  homeColor: string;
  awayColor: string;
}

const getFormBadgeStyle = (result: string) => {
  switch (result) {
    case 'W':
      return 'bg-green-500 shadow-sm';
    case 'D':
      return 'bg-yellow-400 shadow-sm';
    case 'L':
      return 'bg-red-500 shadow-sm';
    default:
      return 'bg-gray-300';
  }
};

const getFormLabel = (result: string, t: (key: string, defaultValue?: string) => string) => {
  switch (result) {
    case 'W':
      return t('h2h.form.win', 'П');
    case 'D':
      return t('h2h.form.draw', 'Н');
    case 'L':
      return t('h2h.form.loss', 'П');
    default:
      return result;
  }
};

export function H2HFormStreak({
  homeTeam,
  awayTeam,
  formGuide,
  homeColor,
  awayColor,
}: H2HFormStreakProps) {
  const { t } = useTranslation('match');

  const team1Matches = formGuide.team1?.matches || [];
  const team2Matches = formGuide.team2?.matches || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-900 uppercase">
          {t('h2h.currentForm', 'Текущая форма')}
        </span>
        <span className="text-[10px] text-gray-400 font-medium">
          {t('h2h.last5Matches', 'Последние 5 матчей')}
        </span>
      </div>

      {/* Home Team Form */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: homeColor }}
          />
          <span className="text-xs font-semibold text-gray-700 truncate">
            {homeTeam.name}
          </span>
        </div>
        <div className="flex gap-1 ml-4">
          {team1Matches.length > 0 ? (
            team1Matches.slice(0, 5).map((match, i) => (
              <div
                key={match.game_id || i}
                className={`w-6 h-6 rounded flex items-center justify-center ${getFormBadgeStyle(match.result)} transition-transform hover:scale-110`}
                title={`${match.was_home ? 'vs' : '@'} ${match.opponent_name}: ${match.home_score}-${match.away_score}`}
              >
                <span className="text-white text-[9px] font-black">
                  {match.result}
                </span>
              </div>
            ))
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center"
              >
                <span className="text-gray-400 text-[9px]">-</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Away Team Form */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: awayColor }}
          />
          <span className="text-xs font-semibold text-gray-700 truncate">
            {awayTeam.name}
          </span>
        </div>
        <div className="flex gap-1 ml-4">
          {team2Matches.length > 0 ? (
            team2Matches.slice(0, 5).map((match, i) => (
              <div
                key={match.game_id || i}
                className={`w-6 h-6 rounded flex items-center justify-center ${getFormBadgeStyle(match.result)} transition-transform hover:scale-110`}
                title={`${match.was_home ? 'vs' : '@'} ${match.opponent_name}: ${match.home_score}-${match.away_score}`}
              >
                <span className="text-white text-[9px] font-black">
                  {match.result}
                </span>
              </div>
            ))
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center"
              >
                <span className="text-gray-400 text-[9px]">-</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-[9px] text-gray-500">{t('h2h.form.winFull', 'Победа')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-400" />
          <span className="text-[9px] text-gray-500">{t('h2h.form.drawFull', 'Ничья')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-[9px] text-gray-500">{t('h2h.form.lossFull', 'Поражение')}</span>
        </div>
      </div>
    </div>
  );
}
