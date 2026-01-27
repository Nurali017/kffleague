'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLeagueTable } from '@/hooks';

interface TournamentTableMiniProps {
  seasonId?: number;
  homeTeamId?: number;
  awayTeamId?: number;
}

export function TournamentTableMini({ seasonId, homeTeamId, awayTeamId }: TournamentTableMiniProps) {
  const { standings: allStandings, loading, error } = useLeagueTable({
    seasonId,
  });

  // Каждая команда ± 2 позиции
  const standings = useMemo(() => {
    if (!allStandings.length) return [];

    const homePos = allStandings.find(s => s.team_id === homeTeamId)?.position ?? 1;
    const awayPos = allStandings.find(s => s.team_id === awayTeamId)?.position ?? 1;

    // Позиции для home команды (±2)
    const homeRange = new Set<number>();
    for (let i = Math.max(1, homePos - 2); i <= homePos + 2; i++) {
      homeRange.add(i);
    }

    // Позиции для away команды (±2)
    const awayRange = new Set<number>();
    for (let i = Math.max(1, awayPos - 2); i <= awayPos + 2; i++) {
      awayRange.add(i);
    }

    // Объединяем
    const positions = new Set([...homeRange, ...awayRange]);

    return allStandings.filter(s => positions.has(s.position));
  }, [allStandings, homeTeamId, awayTeamId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Турнирная таблица</h3>
        </div>
        <div className="animate-pulse p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !standings.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Турнирная таблица</h3>
        </div>
        <div className="p-6 text-center text-sm text-gray-500">
          Данные недоступны
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">Турнирная таблица</h3>
        <Link
          href="/table"
          className="text-xs font-semibold text-[#1E4D8C] hover:text-[#163A6B] flex items-center gap-1 group"
        >
          Все
          <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Table Head */}
      <div className="flex items-center gap-2 bg-gray-50/50 px-4 py-2 border-b border-gray-100">
        <span className="w-8 text-[10px] font-bold text-gray-400 uppercase text-center">#</span>
        <span className="flex-1 text-[10px] font-bold text-gray-400 uppercase">Команда</span>
        <span className="w-8 text-center text-[10px] font-bold text-gray-400 uppercase">И</span>
        <span className="w-8 text-center text-[10px] font-bold text-gray-400 uppercase">О</span>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-50">
        {standings.map((row) => {
          const isHome = row.team_id === homeTeamId;
          const isAway = row.team_id === awayTeamId;
          const isHighlighted = isHome || isAway;

          let bgClass = 'bg-white hover:bg-gray-50';
          if (isHome) bgClass = 'bg-blue-50/50 hover:bg-blue-50';
          if (isAway) bgClass = 'bg-yellow-50/50 hover:bg-yellow-50';

          return (
            <div
              key={row.team_id}
              className={`flex items-center gap-2 px-4 py-3 transition-colors ${bgClass}`}
            >
              <span
                className={`w-8 text-xs text-center font-bold ${isHighlighted ? 'text-gray-900' : 'text-gray-500'}`}
              >
                {row.position}
              </span>

              <div className="flex-1 flex items-center gap-2 min-w-0">
                {/* Team Logo */}
                {row.team_logo && (
                  <img
                    src={row.team_logo}
                    alt={row.team_name || ''}
                    className="w-5 h-5 object-contain flex-shrink-0"
                  />
                )}
                {/* Team Color Dot for highlighted teams */}
                {isHighlighted && !row.team_logo && (
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isHome ? 'bg-[#1E4D8C]' : 'bg-[#E5B73B]'}`}
                  />
                )}
                <span
                  className={`text-xs truncate ${isHighlighted ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}
                >
                  {row.team_name}
                </span>
              </div>

              <span className="w-8 text-center text-xs text-gray-500 font-medium">
                {row.games_played}
              </span>

              <span
                className={`w-8 text-center text-xs ${isHighlighted ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}
              >
                {row.points}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
