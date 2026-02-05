'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { usePlayerStats } from '@/hooks';

const AVATAR_PLACEHOLDER_SRC = '/images/placeholders/avatar.svg';

interface Player {
  player_id: string;
  first_name: string;
  last_name: string;
  photo_url?: string | null;
  team_name: string;
  team_logo?: string;
  goals?: number | null;
  assists?: number | null;
}

interface PlayerTableProps {
  title: string;
  statLabel: string;
  players: Player[];
  statKey: 'goals' | 'assists';
  loading?: boolean;
}

function PlayerRowSkeleton() {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      <td className="py-3 px-3 text-center">
        <div className="h-4 w-4 bg-gray-200 rounded mx-auto" />
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      </td>
      <td className="py-3 px-3 text-center">
        <div className="h-4 w-6 bg-gray-200 rounded mx-auto" />
      </td>
    </tr>
  );
}

function PlayerTable({ title, statLabel, players, statKey, loading }: PlayerTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-[#1E4D8C]">{title}</h3>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-[#1E4D8C] text-white text-xs">
            <th className="py-2 px-3 text-left w-8">#</th>
            <th className="py-2 px-3 text-left">ИГРОК</th>
            <th className="py-2 px-3 text-right">{statLabel}</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <>
              <PlayerRowSkeleton />
              <PlayerRowSkeleton />
              <PlayerRowSkeleton />
              <PlayerRowSkeleton />
              <PlayerRowSkeleton />
              <PlayerRowSkeleton />
            </>
          ) : (
            players.slice(0, 6).map((player, index) => (
              <tr
                key={player.player_id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-3 text-gray-400 font-medium">{index + 1}.</td>
                <td className="py-3 px-3">
                  <Link
                    href={`/player/${player.player_id}`}
                    className="flex items-center space-x-3 hover:text-[#E5B73B] transition-colors"
                  >
                    <img
                      src={
                        player.photo_url ||
                        AVATAR_PLACEHOLDER_SRC
                      }
                      alt={`${player.first_name} ${player.last_name}`}
                      className="w-10 h-10 rounded-full object-cover bg-gray-200"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.dataset.fallbackApplied) return;
                        img.dataset.fallbackApplied = 'true';
                        img.src = AVATAR_PLACEHOLDER_SRC;
                      }}
                    />
                    <span className="font-medium text-[#1E4D8C]">
                      {player.last_name}
                    </span>
                  </Link>
                </td>
                <td className="py-3 px-3 text-right font-bold text-[#1E4D8C]">
                  {statKey === 'goals' ? player.goals : player.assists}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        <button className="text-[#1E4D8C] font-bold text-sm hover:text-[#E5B73B] flex items-center transition-colors">
          Полный список
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}

export function PlayerStatsTable() {
  const { players: scorers, loading: scorersLoading } = usePlayerStats({
    sortBy: 'goals',
    limit: 6,
  });
  const { players: assisters, loading: assistersLoading } = usePlayerStats({
    sortBy: 'assists',
    limit: 6,
  });

  return (
    <div className="space-y-6">
      <PlayerTable
        title="Бомбардиры"
        statLabel="ГОЛЫ"
        players={scorers}
        statKey="goals"
        loading={scorersLoading}
      />
      <PlayerTable
        title="Ассистенты"
        statLabel="ГОЛЕВЫЕ ПЕРЕДАЧИ"
        players={assisters}
        statKey="assists"
        loading={assistersLoading}
      />
    </div>
  );
}
