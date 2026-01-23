'use client';

import { GameTeam } from '@/types';
import { getTeamLogo, getTeamColor } from '@/lib/utils/teamLogos';

interface HeadToHeadMiniProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
}

// Mock data for demonstration - in real app this would come from API
const mockH2H = {
  homeWins: 3,
  draws: 2,
  awayWins: 1,
  homeForm: ['W', 'L', 'W', 'D', 'W'], // Last 5 matches
  awayForm: ['L', 'W', 'L', 'W', 'D'],
};

export function HeadToHeadMini({ homeTeam, awayTeam }: HeadToHeadMiniProps) {
  const homeLogoUrl = homeTeam.logo_url || getTeamLogo(homeTeam.id);
  const awayLogoUrl = awayTeam.logo_url || getTeamLogo(awayTeam.id);

  // V2 Colors
  const homeColor = getTeamColor(homeTeam.id) || '#1E4D8C';
  const awayColor = getTeamColor(awayTeam.id) || '#E5B73B';

  const getFormBadgeColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-green-500 shadow-sm';
      case 'D': return 'bg-yellow-400 shadow-sm';
      case 'L': return 'bg-red-500 shadow-sm';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header - V2 Style "Scoreboard" */}
      <div className="bg-[#1E4D8C] py-4 px-6 flex items-center justify-center relative overflow-hidden">
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
              <span className="text-3xl font-black text-gray-800 leading-none">{mockH2H.homeWins}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase mt-1">Побед</span>
            </div>

            <div className="h-8 w-px bg-gray-200 mx-2" />

            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-gray-400 leading-none mb-1">{mockH2H.draws}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase">Ничьих</span>
            </div>

            <div className="h-8 w-px bg-gray-200 mx-2" />

            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-gray-800 leading-none">{mockH2H.awayWins}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase mt-1">Побед</span>
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
            <span className="text-xs font-bold text-gray-900 uppercase">Текущая форма</span>
            <span className="text-[10px] text-gray-400 font-medium">Последние 5 матчей</span>
          </div>

          {/* Home Team Form */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: homeColor }} />
              <span className="text-xs font-semibold text-gray-700">{homeTeam.name}</span>
            </div>
            <div className="flex gap-1">
              {mockH2H.homeForm.map((result, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded flex items-center justify-center ${getFormBadgeColor(result)}`}
                >
                  <span className="text-white text-[8px] font-black">{result}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Away Team Form */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: awayColor }} />
              <span className="text-xs font-semibold text-gray-700">{awayTeam.name}</span>
            </div>
            <div className="flex gap-1">
              {mockH2H.awayForm.map((result, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded flex items-center justify-center ${getFormBadgeColor(result)}`}
                >
                  <span className="text-white text-[8px] font-black">{result}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
