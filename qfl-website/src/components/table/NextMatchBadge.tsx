'use client';

import Link from 'next/link';
import { Home, Plane } from 'lucide-react';
import { NextGame } from '@/types';

interface NextMatchBadgeProps {
  nextGame?: NextGame;
}

export function NextMatchBadge({ nextGame }: NextMatchBadgeProps) {
  if (!nextGame) return <span className="text-gray-300">—</span>;

  const formattedDate = new Date(nextGame.date).toLocaleDateString('kk-KZ', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <Link
      href={`/matches/${nextGame.game_id}`}
      className="flex items-center gap-1.5 group"
      title={`${nextGame.is_home ? 'Үйде' : 'Қонақта'} vs ${nextGame.opponent_name} - ${formattedDate}`}
    >
      {nextGame.is_home ? (
        <Home className="w-3.5 h-3.5 text-green-600" />
      ) : (
        <Plane className="w-3.5 h-3.5 text-blue-600" />
      )}
      {nextGame.opponent_logo ? (
        <img
          src={nextGame.opponent_logo}
          alt={nextGame.opponent_name}
          className="w-5 h-5 object-contain transition-transform group-hover:scale-110"
        />
      ) : (
        <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500">
          {nextGame.opponent_name[0]}
        </span>
      )}
    </Link>
  );
}
