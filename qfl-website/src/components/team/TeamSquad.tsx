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
    <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-200 dark:border-white/10 p-4 sm:p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-white/10 rounded-xl" />
        <div className="w-16 h-16 bg-gray-200 dark:bg-white/10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="w-28 h-3 bg-gray-200 dark:bg-white/10 rounded" />
          <div className="w-40 h-4 bg-gray-200 dark:bg-white/10 rounded" />
          <div className="w-32 h-3 bg-gray-200 dark:bg-white/10 rounded" />
        </div>
      </div>
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
    player.country_code,
    player.nationality,
    player.age ? `${player.age} ${t('years', 'лет')}` : null,
  ].filter((value, index, self) => {
    if (!value) return false;
    return self.indexOf(value) === index;
  });
  const meta = metaParts.join(' • ');

  return (
    <Link
      href={`/player/${player.player_id}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0a162a]"
      aria-label={fullName}
    >
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/10 p-4 sm:p-5 transition-all duration-300 hover:border-gray-300 dark:hover:border-white/25 hover:-translate-y-0.5 hover:shadow-lg">
        <div className="flex items-start gap-4">
          {/* Jersey */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-black bg-[#1E4D8C] text-white dark:bg-white dark:text-slate-900">
              {player.jersey_number ?? '-'}
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gray-200 text-slate-600 dark:bg-white/10 dark:text-white/80">
              {player.position}
            </span>
          </div>

          {/* Player Photo */}
          <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden bg-gray-200 dark:bg-white/10 flex-shrink-0 ring-2 ring-gray-300 dark:ring-white/20">
            {player.photo_url ? (
              <Image
                src={player.photo_url}
                alt={fullName}
                fill
                sizes="(max-width: 640px) 64px, 72px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-white/40 text-lg font-bold">
                {player.first_name?.[0] || ''}
                {player.last_name?.[0] || ''}
              </div>
            )}
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="leading-tight">
              <div className="text-xs sm:text-sm text-slate-500 dark:text-white/60">
                {player.first_name}
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight truncate group-hover:text-[#1E4D8C] dark:group-hover:text-cyan-300 transition-colors">
                {player.last_name}
              </h3>
            </div>

            {meta && (
              <div className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-white/60 truncate">
                {meta}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function TeamSquad({ players, loading }: TeamSquadProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'kz' ? 'kz' : 'ru';

  // Group players by position
  const groupedPlayers = useMemo<Record<PositionKey, { players: SquadPlayer[]; avgAge: number | null; countries: number }>>(() => {
    const groups: Record<PositionKey, { players: SquadPlayer[]; avgAge: number | null; countries: number }> = {
      GK: { players: [], avgAge: null, countries: 0 },
      DEF: { players: [], avgAge: null, countries: 0 },
      MID: { players: [], avgAge: null, countries: 0 },
      FWD: { players: [], avgAge: null, countries: 0 },
    };

    players.forEach((player) => {
      const position = player.position as PositionKey;
      if (groups[position]) {
        groups[position].players.push(player);
      }
    });

    // Sort by jersey number within each group and compute stats
    POSITION_ORDER.forEach((pos) => {
      const group = groups[pos];
      group.players.sort((a, b) => (a.jersey_number || 99) - (b.jersey_number || 99));

      const ages = group.players
        .map((player) => player.age)
        .filter((age): age is number => typeof age === 'number');

      group.avgAge = ages.length
        ? Math.round((ages.reduce((sum, age) => sum + age, 0) / ages.length) * 10) / 10
        : null;

      const countries = new Set(
        group.players
          .map((player) => player.country_code || player.nationality)
          .filter((value): value is string => Boolean(value && value.trim()))
      );
      group.countries = countries.size;
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
          <section
            key={position}
            className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-surface p-4 sm:p-6 shadow-lg dark:shadow-[0_20px_40px_rgba(3,10,25,0.5)]"
          >
            {/* Position Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 rounded-full bg-[#1E4D8C] dark:bg-white/70" />
                <div>
                  <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase">
                    {POSITION_LABELS[position][lang]}
                  </h2>
                  <div className="text-xs text-slate-500 dark:text-white/60">
                    <span>
                      {group.players.length} {lang === 'kz' ? 'ойыншы' : 'игроков'}
                    </span>
                    {group.avgAge !== null && (
                      <span className="ml-3">
                        {lang === 'kz' ? 'орташа жас' : 'ср. возраст'}: {group.avgAge} {lang === 'kz' ? 'жас' : 'лет'}
                      </span>
                    )}
                    {group.countries > 0 && (
                      <span className="ml-3">
                        {lang === 'kz' ? 'ел' : 'страны'}: {group.countries}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
