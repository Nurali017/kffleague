'use client';

import { useTranslation } from 'react-i18next';
import { GameTeam } from '@/types';
import { useH2H } from '@/hooks';
import { getTeamLogo, HOME_COLOR, AWAY_COLOR } from '@/lib/utils/teamLogos';
import { H2HMiniSkeleton } from './h2h';

interface HeadToHeadMiniProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  seasonId?: number;
}

export function HeadToHeadMini({
  homeTeam,
  awayTeam,
  seasonId,
}: HeadToHeadMiniProps) {
  const { t } = useTranslation('match');

  const { data, loading, error } = useH2H({
    team1Id: homeTeam.id,
    team2Id: awayTeam.id,
    seasonId,
  });

  const homeLogoUrl = homeTeam.logo_url || getTeamLogo(homeTeam.id);
  const awayLogoUrl = awayTeam.logo_url || getTeamLogo(awayTeam.id);
  const homeColor = HOME_COLOR;
  const awayColor = AWAY_COLOR;

  const getFormBadgeColor = (result: string) => {
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

  // Loading state
  if (loading) {
    return <H2HMiniSkeleton />;
  }

  // Error or no data - show placeholder
  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-primary py-4 px-6 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] relative z-10">
            HEAD TO HEAD
          </h3>
        </div>
        <div className="p-6 text-center text-gray-500 text-sm">
          {error
            ? t('h2h.error', 'Ошибка загрузки')
            : t('h2h.noData', 'Нет данных')}
        </div>
      </div>
    );
  }

  const { overall, form_guide } = data;
  const team1Matches = form_guide.team1?.matches || [];
  const team2Matches = form_guide.team2?.matches || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header - V2 Style "Scoreboard" */}
      <div className="bg-primary py-4 px-6 flex items-center justify-center relative overflow-hidden">
        {/* Abstract pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] relative z-10">
          HEAD TO HEAD
        </h3>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Teams + H2H Stats */}
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-2 w-16">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full p-2 border border-gray-100">
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

          {/* Stats Center */}
          <div className="flex items-end gap-1 pb-2">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-gray-800 leading-none">
                {overall.team1_wins}
              </span>
              <span className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                {t('h2h.wins', 'Побед')}
              </span>
            </div>

            <div className="h-8 w-px bg-gray-200 mx-2" />

            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-gray-400 leading-none mb-1">
                {overall.draws}
              </span>
              <span className="text-[9px] text-gray-400 font-bold uppercase">
                {t('h2h.draws', 'Ничьих')}
              </span>
            </div>

            <div className="h-8 w-px bg-gray-200 mx-2" />

            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-gray-800 leading-none">
                {overall.team2_wins}
              </span>
              <span className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                {t('h2h.wins', 'Побед')}
              </span>
            </div>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-2 w-16">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full p-2 border border-gray-100">
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

        {/* Form Guide (Last 5 matches) */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
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
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: homeColor }}
              />
              <span className="text-xs font-semibold text-gray-700">
                {homeTeam.name}
              </span>
            </div>
            <div className="flex gap-1">
              {team1Matches.length > 0
                ? team1Matches.slice(0, 5).map((match, i) => (
                    <div
                      key={match.game_id || i}
                      className={`w-5 h-5 rounded flex items-center justify-center ${getFormBadgeColor(match.result)}`}
                      title={`${match.was_home ? 'vs' : '@'} ${match.opponent_name}: ${match.home_score}-${match.away_score}`}
                    >
                      <span className="text-white text-[8px] font-black">
                        {match.result}
                      </span>
                    </div>
                  ))
                : Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center"
                    >
                      <span className="text-gray-400 text-[8px]">-</span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Away Team Form */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: awayColor }}
              />
              <span className="text-xs font-semibold text-gray-700">
                {awayTeam.name}
              </span>
            </div>
            <div className="flex gap-1">
              {team2Matches.length > 0
                ? team2Matches.slice(0, 5).map((match, i) => (
                    <div
                      key={match.game_id || i}
                      className={`w-5 h-5 rounded flex items-center justify-center ${getFormBadgeColor(match.result)}`}
                      title={`${match.was_home ? 'vs' : '@'} ${match.opponent_name}: ${match.home_score}-${match.away_score}`}
                    >
                      <span className="text-white text-[8px] font-black">
                        {match.result}
                      </span>
                    </div>
                  ))
                : Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center"
                    >
                      <span className="text-gray-400 text-[8px]">-</span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Total matches footer */}
        <div className="pt-3 border-t border-gray-100 text-center">
          <span className="text-[10px] text-gray-400">
            {overall.total_matches} {t('h2h.totalMatches', 'матчей всего')}
          </span>
        </div>
      </div>
    </div>
  );
}
