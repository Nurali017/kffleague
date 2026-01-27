'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { SquadPlayer } from '@/types';

interface TeamSquadProps {
  players: SquadPlayer[];
  loading?: boolean;
}

// Position groups for display
const POSITION_ORDER = ['GK', 'DEF', 'MID', 'FWD'] as const;

const POSITION_LABELS: Record<string, { kz: string; ru: string }> = {
  GK: { kz: 'Қақпашылар', ru: 'Вратари' },
  DEF: { kz: 'Қорғаушылар', ru: 'Защитники' },
  MID: { kz: 'Жартылай қорғаушылар', ru: 'Полузащитники' },
  FWD: { kz: 'Шабуылшылар', ru: 'Нападающие' },
};

const POSITION_COLORS: Record<string, string> = {
  GK: 'bg-yellow-500',
  DEF: 'bg-blue-500',
  MID: 'bg-green-500',
  FWD: 'bg-red-500',
};

function PlayerCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
          <div className="w-16 h-3 bg-gray-200 rounded" />
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

interface PlayerCardProps {
  player: SquadPlayer;
}

function PlayerCard({ player }: PlayerCardProps) {
  const fullName = `${player.first_name} ${player.last_name}`;

  return (
    <Link
      href={`/player/${player.player_id}`}
      className="group bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg hover:border-primary transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        {/* Player Photo */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          {player.photo_url ? (
            <Image
              src={player.photo_url}
              alt={fullName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
            {fullName}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {/* Position Badge */}
            <span className={`px-2 py-0.5 text-xs font-medium text-white rounded ${POSITION_COLORS[player.position]}`}>
              {player.position}
            </span>
            {/* Country */}
            {player.country_code && (
              <span className="text-xs text-gray-500">
                {player.country_code}
              </span>
            )}
            {/* Age */}
            {player.age && (
              <span className="text-xs text-gray-400">
                {player.age} years
              </span>
            )}
          </div>
        </div>

        {/* Jersey Number */}
        <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
          <span className="text-xl font-black text-gray-700 group-hover:text-white transition-colors">
            {player.jersey_number || '-'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function TeamSquad({ players, loading }: TeamSquadProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'kz' ? 'kz' : 'ru';

  // Group players by position
  const groupedPlayers = useMemo(() => {
    const groups: Record<string, SquadPlayer[]> = {
      GK: [],
      DEF: [],
      MID: [],
      FWD: [],
    };

    players.forEach((player) => {
      if (groups[player.position]) {
        groups[player.position].push(player);
      }
    });

    // Sort by jersey number within each group
    Object.keys(groups).forEach((pos) => {
      groups[pos].sort((a, b) => (a.jersey_number || 99) - (b.jersey_number || 99));
    });

    return groups;
  }, [players]);

  if (loading) {
    return (
      <div className="space-y-8">
        {POSITION_ORDER.map((pos) => (
          <div key={pos}>
            <div className="w-32 h-6 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <PlayerCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-gray-500">
          {lang === 'kz' ? 'Құрам туралы мәлімет жоқ' : 'Нет данных о составе'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {POSITION_ORDER.map((position) => {
        const positionPlayers = groupedPlayers[position];
        if (positionPlayers.length === 0) return null;

        return (
          <section key={position}>
            {/* Position Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-1 h-6 rounded-full ${POSITION_COLORS[position]}`} />
              <h2 className="text-xl font-bold text-gray-900">
                {POSITION_LABELS[position][lang]}
              </h2>
              <span className="text-sm text-gray-400">
                ({positionPlayers.length})
              </span>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positionPlayers.map((player) => (
                <PlayerCard key={player.player_id} player={player} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
