'use client';

import { useMemo, useState } from 'react';
import { TournamentAwareLink as Link } from '@/components/navigation/TournamentAwareLink';
import { useTranslation } from 'react-i18next';
import { SquadPlayer } from '@/types';
import { cn } from '@/lib/utils/cn';

interface TeamSquadProps {
  players: SquadPlayer[];
  loading?: boolean;
}

const POSITION_ORDER = ['GK', 'DEF', 'MID', 'FWD'] as const;
type PositionKey = (typeof POSITION_ORDER)[number];

const POSITION_LABELS: Record<PositionKey, { kz: string; ru: string }> = {
  GK: { kz: 'Қақпашылар', ru: 'Вратари' },
  DEF: { kz: 'Қорғаушылар', ru: 'Защитники' },
  MID: { kz: 'Жартылай қорғаушылар', ru: 'Полузащитники' },
  FWD: { kz: 'Шабуылшылар', ru: 'Нападающие' },
};

const POSITION_SINGULAR: Record<PositionKey, { kz: string; ru: string }> = {
  GK: { kz: 'Қақпашы', ru: 'Вратарь' },
  DEF: { kz: 'Қорғаушы', ru: 'Защитник' },
  MID: { kz: 'Жартылай қорғаушы', ru: 'Полузащитник' },
  FWD: { kz: 'Шабуылшы', ru: 'Нападающий' },
};

const POSITION_ACCENT: Record<PositionKey, string> = {
  GK: 'bg-amber-400',
  DEF: 'bg-blue-500',
  MID: 'bg-emerald-500',
  FWD: 'bg-rose-500',
};

const POSITION_PILL_ACTIVE: Record<PositionKey, string> = {
  GK: 'bg-amber-500 text-white',
  DEF: 'bg-blue-500 text-white',
  MID: 'bg-emerald-500 text-white',
  FWD: 'bg-rose-500 text-white',
};

type FilterKey = 'ALL' | PositionKey;

/* ─── Position Filter Tabs ─── */

interface PositionFilterTabsProps {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
  counts: Record<PositionKey, number>;
  total: number;
}

function PositionFilterTabs({ active, onChange, counts, total }: PositionFilterTabsProps) {
  const { t } = useTranslation('team');

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: 'ALL', label: t('squad_filter.all', 'Все'), count: total },
    ...POSITION_ORDER.map((pos) => ({
      key: pos as FilterKey,
      label: t(`squad_filter.${pos}`, POSITION_LABELS[pos].ru),
      count: counts[pos],
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map(({ key, label, count }) => {
        const isActive = active === key;
        let activeClass = 'bg-primary dark:bg-cyan-500 text-white';
        if (key !== 'ALL' && isActive) {
          activeClass = POSITION_PILL_ACTIVE[key as PositionKey];
        }

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
              isActive
                ? activeClass
                : 'bg-gray-100 dark:bg-white/10 text-slate-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/15'
            )}
          >
            {label}
            <span
              className={cn(
                'inline-flex items-center justify-center h-4 min-w-[16px] rounded-full text-[10px] font-bold px-1',
                isActive
                  ? 'bg-white/25 text-white'
                  : 'bg-gray-200 dark:bg-white/10 text-slate-500 dark:text-white/50'
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Player Card Skeleton ─── */

function PlayerCardSkeleton() {
  return (
    <div className="relative h-[240px] md:h-[300px] rounded-xl overflow-hidden bg-gradient-to-br from-[#0b142f] via-[#1a2863] to-[#273790] animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2e]/95 via-[#0a0f2e]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 space-y-2">
        <div className="h-3 w-16 bg-white/10 rounded" />
        <div className="h-4 w-28 bg-white/10 rounded" />
        <div className="h-3 w-20 bg-white/10 rounded" />
      </div>
    </div>
  );
}

/* ─── Player Card ─── */

interface PlayerCardProps {
  player: SquadPlayer;
  lang: 'kz' | 'ru';
}

function PlayerCard({ player, lang }: PlayerCardProps) {
  const { t } = useTranslation('player');
  const [imgBroken, setImgBroken] = useState(false);
  const fullName = `${player.first_name} ${player.last_name}`;
  const showPhoto = player.photo_url && !imgBroken;
  const position = player.position as PositionKey;
  const hasStats =
    (player.games_played != null && player.games_played > 0) ||
    (player.goals != null && player.goals > 0) ||
    (player.assists != null && player.assists > 0);

  const initials = `${player.first_name?.[0] ?? ''}${player.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <Link
      href={`/player/${player.player_id}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40 rounded-xl"
      aria-label={fullName}
    >
      <div className="relative h-[240px] md:h-[300px] rounded-xl overflow-hidden ring-1 ring-inset ring-white/10 group-hover:ring-white/25 transition-all duration-300">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b142f] via-[#1a2863] to-[#273790]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(32,56,153,0.55), transparent 70%), radial-gradient(ellipse at 70% 80%, rgba(94,130,255,0.2), transparent 60%)',
          }}
        />

        {/* Player photo or initials */}
        {showPhoto ? (
          <img
            src={player.photo_url!}
            alt={fullName}
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgBroken(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl md:text-6xl font-black text-white/10 select-none">
              {initials}
            </span>
          </div>
        )}

        {/* Jersey number */}
        {player.jersey_number != null && (
          <span className="absolute top-3 right-3 text-3xl md:text-4xl font-black text-white/20 tabular-nums select-none">
            {player.jersey_number}
          </span>
        )}

        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#0a0f2e]/95 via-[#0a0f2e]/60 to-transparent pointer-events-none" />

        {/* Player info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
          {/* Position */}
          {POSITION_ACCENT[position] && (
            <div className="flex items-center gap-1.5 mb-1">
              <div className={cn('w-1.5 h-1.5 rounded-full', POSITION_ACCENT[position])} />
              <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">
                {POSITION_SINGULAR[position]?.[lang] ?? position}
              </span>
            </div>
          )}

          {/* Name */}
          <p className="text-sm md:text-base font-bold text-white truncate leading-tight">
            {player.first_name}{' '}
            <span className="font-black">{player.last_name}</span>
          </p>

          {/* Nationality / Age */}
          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white/50">
            {player.nationality && <span className="truncate">{player.nationality}</span>}
            {player.nationality && player.age != null && <span>&middot;</span>}
            {player.age != null && (
              <span>
                {player.age} {t('years', 'лет')}
              </span>
            )}
          </div>

          {/* Stats */}
          {hasStats && (
            <div className="mt-1.5 flex items-center gap-2.5 text-[10px] font-semibold text-white/50">
              {player.games_played != null && player.games_played > 0 && (
                <span>М {player.games_played}</span>
              )}
              {player.goals != null && player.goals > 0 && (
                <span className="text-cyan-300/90">Г {player.goals}</span>
              )}
              {player.assists != null && player.assists > 0 && (
                <span>А {player.assists}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ─── Main Component ─── */

export function TeamSquad({ players, loading }: TeamSquadProps) {
  const { t, i18n } = useTranslation('team');
  const lang = i18n.language === 'kz' ? 'kz' : 'ru';
  const [activeFilter, setActiveFilter] = useState<FilterKey>('ALL');

  const counts = useMemo(() => {
    const c: Record<PositionKey, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    players.forEach((p) => {
      const pos = p.position as PositionKey;
      if (c[pos] !== undefined) c[pos]++;
    });
    return c;
  }, [players]);

  const filteredPlayers = useMemo(() => {
    const list =
      activeFilter === 'ALL'
        ? [...players]
        : players.filter((p) => p.position === activeFilter);

    // Sort: position order first, then jersey number
    list.sort((a, b) => {
      const posA = POSITION_ORDER.indexOf(a.position as PositionKey);
      const posB = POSITION_ORDER.indexOf(b.position as PositionKey);
      if (posA !== posB) return posA - posB;
      return (a.jersey_number || 99) - (b.jersey_number || 99);
    });

    return list;
  }, [players, activeFilter]);

  if (loading) {
    return (
      <div>
        <div className="flex gap-2 mb-6">
          {[80, 64, 72, 96, 80].map((w, i) => (
            <div
              key={i}
              className="h-8 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse"
              style={{ width: w }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <PlayerCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b142f] via-[#1a2863] to-[#273790]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(32,56,153,0.55), transparent 70%)',
          }}
        />
        <div className="relative p-12 text-center">
          <div className="text-white/30 mb-2">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-white/60">{t('noSquadData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PositionFilterTabs
        active={activeFilter}
        onChange={setActiveFilter}
        counts={counts}
        total={players.length}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {filteredPlayers.map((player) => (
          <PlayerCard key={player.player_id} player={player} lang={lang} />
        ))}
      </div>
    </div>
  );
}
