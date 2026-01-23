'use client';

import Link from 'next/link';
import { LiveMatchData } from './types';

interface LiveMatchProps {
  match: LiveMatchData;
}

export function LiveMatch({ match }: LiveMatchProps) {
  return (
    <Link
      href={`/matches/${match.id}`}
      className="flex items-center gap-3 px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
    >
      {/* Live indicator with pulsing animation */}
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span className="text-xs font-bold text-red-400 uppercase">Live</span>
      </span>

      {/* Match info */}
      <span className="text-xs font-medium">
        {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
      </span>

      {/* Minute */}
      <span className="text-xs text-white/60">{match.minute}&apos;</span>
    </Link>
  );
}
