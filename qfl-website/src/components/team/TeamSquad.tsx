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
type PositionKey = (typeof POSITION_ORDER)[number];

const POSITION_LABELS: Record<PositionKey, { kz: string; ru: string }> = {
  GK: { kz: 'Қақпашылар', ru: 'Вратари' },
  DEF: { kz: 'Қорғаушылар', ru: 'Защитники' },
  MID: { kz: 'Жартылай қорғаушылар', ru: 'Полузащитники' },
  FWD: { kz: 'Шабуылшылар', ru: 'Нападающие' },
};

function PlayerCardSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-3 animate-pulse">
      <div className="w-11 h-11 bg-gray-200 dark:bg-white/10 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="w-20 h-2.5 bg-gray-200 dark:bg-white/10 rounded" />
        <div className="w-32 h-3.5 bg-gray-200 dark:bg-white/10 rounded" />
      </div>
      <div className="w-6 h-4 bg-gray-200 dark:bg-white/10 rounded" />
    </div>
  );
}

interface PlayerCardProps {
  player: SquadPlayer;
}

function PlayerCard({ player }: PlayerCardProps) {
  const { t } = useTranslation('player');
  const fullName = `${player.first_name} ${player.last_name}`;
  const metaParts = [
    player.nationality,
    player.age ? `${player.age} ${t('years', 'лет')}` : null,
  ].filter(Boolean);
  const meta = metaParts.join(' · ');

  const initials = `${player.first_name?.[0] || ''}${player.last_name?.[0] || ''}`.toUpperCase();

  return (
    <Link
      href={`/player/${player.player_id}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40"
      aria-label={fullName}
    >
      <div className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
        {/* Photo */}
        <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-200 dark:bg-white/10 shrink-0">
          {player.photo_url ? (
            <Image
              src={player.photo_url}
              alt={fullName}
              fill
              sizes="44px"
              className="object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400 dark:text-white/40">
              {initials}
            </div>
          )}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight group-hover:text-primary dark:group-hover:text-cyan-300 transition-colors">
            {player.first_name} <span className="font-black">{player.last_name}</span>
          </p>
          {meta && (
            <p className="mt-0.5 text-[11px] text-slate-400 dark:text-white/50 truncate">{meta}</p>
          )}
        </div>

        {/* Jersey number */}
        {player.jersey_number != null && (
          <span className="text-sm font-bold text-slate-300 dark:text-white/30 shrink-0">
            {player.jersey_number}
          </span>
        )}
      </div>
    </Link>
  );
}

export function TeamSquad({ players, loading }: TeamSquadProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'kz' ? 'kz' : 'ru';

  // Group players by position
  const groupedPlayers = useMemo<Record<PositionKey, { players: SquadPlayer[] }>>(() => {
    const groups: Record<PositionKey, { players: SquadPlayer[] }> = {
      GK: { players: [] },
      DEF: { players: [] },
      MID: { players: [] },
      FWD: { players: [] },
    };

    players.forEach((player) => {
      const position = player.position as PositionKey;
      if (groups[position]) {
        groups[position].players.push(player);
      }
    });

    POSITION_ORDER.forEach((pos) => {
      groups[pos].players.sort((a, b) => (a.jersey_number || 99) - (b.jersey_number || 99));
    });

    return groups;
  }, [players]);

  if (loading) {
    return (
      <div className="space-y-8">
        {POSITION_ORDER.map((pos) => (
          <div key={pos}>
            <div className="w-32 h-6 bg-gray-200 dark:bg-white/10 rounded mb-4 animate-pulse" />
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
      <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-white/10 p-12 text-center">
        <div className="text-slate-300 dark:text-white/40 mb-2">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-slate-500 dark:text-white/60">
          {lang === 'kz' ? 'Құрам туралы мәлімет жоқ' : 'Нет данных о составе'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {POSITION_ORDER.map((position) => {
        const group = groupedPlayers[position];
        if (group.players.length === 0) return null;

        return (
          <section key={position} className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-surface shadow-sm dark:shadow-[0_12px_24px_rgba(3,10,25,0.35)]">
            {/* Position Header */}
            <div className="flex items-center gap-2.5 px-5 pt-5 pb-2">
              <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.06em]">
                {POSITION_LABELS[position][lang]}
              </h2>
              <span className="text-xs text-slate-400 dark:text-white/40">{group.players.length}</span>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-2 px-2 pb-3">
              {group.players.map((player) => (
                <PlayerCard key={player.player_id} player={player} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
