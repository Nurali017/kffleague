'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface TournamentTableMiniProps {
  tourId?: number;
}

// Mock data for demonstration - in real app this would come from API
// We highlight rows 1 (Home) and 4 (Away) for demo
const mockTable = [
  { pos: 1, team: 'Астана', played: 11, points: 28, highlight: 'home' },
  { pos: 2, team: 'Ордабасы', played: 11, points: 25, highlight: null },
  { pos: 3, team: 'Актобе', played: 11, points: 22, highlight: null },
  { pos: 4, team: 'Кайрат', played: 11, points: 20, highlight: 'away' },
  { pos: 5, team: 'Елимай', played: 11, points: 18, highlight: null },
];

export function TournamentTableMini({ tourId }: TournamentTableMiniProps) {
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
        {mockTable.map((row) => {
          const isHome = row.highlight === 'home';
          const isAway = row.highlight === 'away';

          let bgClass = 'bg-white hover:bg-gray-50';
          if (isHome) bgClass = 'bg-blue-50/50 hover:bg-blue-50';
          if (isAway) bgClass = 'bg-yellow-50/50 hover:bg-yellow-50';

          return (
            <div
              key={row.pos}
              className={`flex items-center gap-2 px-4 py-3 transition-colors ${bgClass}`}
            >
              <span
                className={`w-8 text-xs text-center font-bold ${row.highlight ? 'text-gray-900' : 'text-gray-500'
                  }`}
              >
                {row.pos}
              </span>

              <div className="flex-1 flex items-center gap-2 min-w-0">
                {/* Team Color Dot */}
                {row.highlight && (
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isHome ? 'bg-[#1E4D8C]' : 'bg-[#E5B73B]'}`}
                  />
                )}
                <span
                  className={`text-xs truncate ${row.highlight ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                    }`}
                >
                  {row.team}
                </span>
              </div>

              <span className="w-8 text-center text-xs text-gray-500 font-medium">
                {row.played}
              </span>

              <span
                className={`w-8 text-center text-xs ${row.highlight
                    ? 'font-black text-gray-900'
                    : 'font-bold text-gray-700'
                  }`}
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
