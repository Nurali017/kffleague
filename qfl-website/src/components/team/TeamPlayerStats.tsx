'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TeamOverviewLeaderPlayer, TeamOverviewLeaders } from '@/types/team';
import { SectionCard } from './TeamUiPrimitives';

interface TeamPlayerStatsProps {
  leaders: TeamOverviewLeaders;
}

/* ------------------------------------------------------------------ */
/*  LeaderPanel – featured player (#1) + leaderboard table (#2–#8)    */
/* ------------------------------------------------------------------ */

function LeaderPanel({
  title,
  players,
  statKey,
  statLabel,
  secondaryLabel,
}: {
  title: string;
  players: TeamOverviewLeaderPlayer[];
  statKey: 'goals' | 'assists';
  statLabel: string;
  secondaryLabel: string;
}) {
  const { t: tTeam } = useTranslation('team');
  const { t: tCommon } = useTranslation('common');

  if (!players.length) return null;

  const featured = players[0];
  const rest = players.slice(1, 5);
  const statValue = statKey === 'goals' ? featured.goals : featured.assists;
  const firstName = featured.first_name?.trim() || '';
  const lastName = featured.last_name?.trim() || '';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

  return (
    <SectionCard className="overflow-hidden">
      {/* Section title */}
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-xs font-black uppercase tracking-[0.08em] text-slate-500 dark:text-white/60">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
        {/* Left – Featured player */}
        <div className="flex flex-col">
          {/* Photo on gradient bg */}
          <div className="relative bg-gradient-to-br from-[#0b142f] via-[#1a2863] to-[#273790] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_85%,rgba(32,56,153,0.55),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(94,130,255,0.2),transparent_58%)]" />

            {featured.team_logo && (
              <img
                src={featured.team_logo}
                alt=""
                className="absolute top-3 right-3 w-8 h-8 object-contain opacity-40"
              />
            )}

            <div className="relative flex items-end justify-center min-h-[200px] px-4 pt-4">
              {featured.photo_url ? (
                <img
                  src={featured.photo_url}
                  alt={`${firstName} ${lastName}`}
                  className="relative z-10 h-[180px] w-auto object-contain object-bottom"
                />
              ) : (
                <div className="relative z-10 h-[120px] w-[100px] rounded-xl border border-white/20 bg-white/15 flex items-center justify-center text-2xl font-black text-white/60 mb-4">
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Stats + name — below photo, card bg */}
          <div className="px-4 pt-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-white/60 text-xs">{statLabel}</span>
              <span className="text-slate-900 dark:text-white text-lg font-black">{statValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-white/60 text-xs">{secondaryLabel}</span>
              <span className="text-slate-900 dark:text-white text-lg font-black">{featured.games_played}</span>
            </div>
          </div>

          <Link
            href={`/player/${featured.player_id}`}
            className="flex items-center gap-2 px-4 pb-4 pt-3 mt-auto hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <span className="text-slate-400 dark:text-white/50 text-sm font-bold">1</span>
            <div className="min-w-0">
              <span className="block text-slate-500 dark:text-white/70 text-xs leading-tight">{firstName}</span>
              <span className="block text-slate-900 dark:text-white text-base font-black leading-tight truncate">{lastName}</span>
            </div>
          </Link>
        </div>

        {/* Right – Leaderboard table */}
        <div className="flex flex-col">
          {/* Table header */}
          <div className="grid grid-cols-[28px_1fr_48px] gap-2 px-4 py-2 border-b border-gray-200 dark:border-white/10 text-[11px] font-semibold text-slate-400 dark:text-white/50 uppercase tracking-wide">
            <span>#</span>
            <span>{tCommon('table.player', 'Игрок')}</span>
            <span className="text-right">{tTeam('leaderboard.total', 'Всего')}</span>
          </div>

          {/* Player rows */}
          <div className="flex-1">
            {rest.map((player, index) => {
              const pFirst = player.first_name?.trim() || '';
              const pLast = player.last_name?.trim() || '';
              const pInitials = `${pFirst[0] || ''}${pLast[0] || ''}`.toUpperCase();
              const pValue = statKey === 'goals' ? player.goals : player.assists;

              return (
                <Link
                  key={player.player_id}
                  href={`/player/${player.player_id}`}
                  className="grid grid-cols-[28px_1fr_48px] gap-2 items-center px-4 py-2.5 border-b border-gray-100 dark:border-white/[0.06] last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <span className="text-xs text-slate-400 dark:text-white/40 font-medium">
                    {index + 2}
                  </span>
                  <div className="flex items-center gap-2.5 min-w-0">
                    {player.photo_url ? (
                      <img
                        src={player.photo_url}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/15 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-white/60 shrink-0">
                        {pInitials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="block text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary dark:group-hover:text-cyan-300 transition-colors">
                        {pFirst} {pLast}
                      </span>
                      {player.team_name && (
                        <span className="block text-[11px] text-slate-400 dark:text-white/50 truncate">
                          {player.team_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-right text-sm font-black text-slate-900 dark:text-white">
                    {pValue}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* View full table link */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-white/10">
            <Link
              href="/stats/players"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary dark:text-cyan-300 hover:text-primary-dark dark:hover:text-cyan-200 transition-colors uppercase tracking-wide"
            >
              {tTeam('buttons.viewFullTable', 'Полная таблица')}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/*  MiniLeaderCard – bottom stat leader cards                         */
/* ------------------------------------------------------------------ */

function MiniLeaderCard({
  player,
  value,
}: {
  player: TeamOverviewLeaderPlayer;
  value: number;
}) {
  const firstName = player.first_name?.trim() || '';
  const lastName = player.last_name?.trim() || '';
  const hasPlayerName = Boolean(firstName || lastName);
  const primaryName = hasPlayerName ? firstName || lastName : player.team_name || '—';
  const secondaryName = hasPlayerName ? lastName || firstName : '';
  const playerName = [firstName, lastName].filter(Boolean).join(' ').trim() || 'Player';
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.trim().toUpperCase() || 'PL';

  return (
    <SectionCard className="overflow-hidden border-gray-200/90 shadow-sm dark:shadow-[0_18px_36px_rgba(3,10,25,0.42)]">
      <div className="relative h-[104px] bg-gradient-to-r from-[#0b142f] via-[#1a2863] to-[#273790]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_85%,rgba(32,56,153,0.55),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(94,130,255,0.2),transparent_58%)]" />

        {player.team_logo ? (
          <img
            src={player.team_logo}
            alt={player.team_name || ''}
            className="absolute left-3 bottom-3 h-7 w-7 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
          />
        ) : (
          <div className="absolute left-3 bottom-3 h-7 w-7 rounded-md border border-white/30 bg-white/15 text-[10px] font-black text-white flex items-center justify-center">
            {initials}
          </div>
        )}

        {player.photo_url ? (
          <img
            src={player.photo_url}
            alt={playerName}
            className="absolute right-2 bottom-0 h-[102px] w-[92px] object-cover object-top"
          />
        ) : (
          <div className="absolute right-3 bottom-3 h-14 w-10 rounded-lg border border-white/20 bg-white/15" />
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-white/10 px-3 py-3">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[10px] uppercase tracking-[0.08em] text-slate-500 dark:text-white/65">
              {primaryName}
            </p>
            <p className="truncate text-sm leading-none font-black text-slate-900 dark:text-white">
              {secondaryName || primaryName}
            </p>
          </div>
          <div className="shrink-0 inline-flex items-center gap-1 text-sm font-black text-slate-900 dark:text-white">
            <span>{value}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-white/65" />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/*  TeamPlayerStats – main export                                     */
/* ------------------------------------------------------------------ */

export function TeamPlayerStats({ leaders }: TeamPlayerStatsProps) {
  const { t: tStats } = useTranslation('statistics');
  const { t: tTeam } = useTranslation('team');

  const miniCards = [
    {
      key: 'passes',
      label: tTeam('miniStats.passes', 'Пасы'),
      player: leaders.mini_leaders.passes,
      value: leaders.mini_leaders.passes?.passes ?? 0,
    },
    {
      key: 'appearances',
      label: tTeam('miniStats.appearances', 'Матчи'),
      player: leaders.mini_leaders.appearances,
      value: leaders.mini_leaders.appearances?.games_played ?? 0,
    },
    {
      key: 'saves',
      label: tTeam('miniStats.saves', 'Сейвы'),
      player: leaders.mini_leaders.saves,
      value: leaders.mini_leaders.saves?.save_shot ?? 0,
    },
    {
      key: 'cleanSheets',
      label: tTeam('miniStats.cleanSheets', 'Сухие матчи'),
      player: leaders.mini_leaders.clean_sheets,
      value: leaders.mini_leaders.clean_sheets?.dry_match ?? 0,
    },
    {
      key: 'redCards',
      label: tTeam('miniStats.redCards', 'Красные карточки'),
      player: leaders.mini_leaders.red_cards,
      value: leaders.mini_leaders.red_cards?.red_cards ?? 0,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top section – two leader panels side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <LeaderPanel
          title={tStats('labels.goals', 'Голы')}
          players={leaders.goals_table}
          statKey="goals"
          statLabel={tStats('labels.goals', 'Голы')}
          secondaryLabel={tStats('labels.matchesPlayed', 'Матчи')}
        />
        <LeaderPanel
          title={tStats('labels.assists', 'Передачи')}
          players={leaders.assists_table}
          statKey="assists"
          statLabel={tStats('labels.assists', 'Передачи')}
          secondaryLabel={tStats('labels.matchesPlayed', 'Матчи')}
        />
      </div>

      {/* Bottom section – mini stat leader cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {miniCards.map((card) => {
          if (!card.player) return null;

          return (
            <div key={card.key} className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-[0.04em] text-slate-700 dark:text-white/85">
                {card.label}
              </p>
              <MiniLeaderCard player={card.player} value={card.value} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
