'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TeamOverviewLeaderPlayer, TeamOverviewLeaders } from '@/types/team';
import { DataTableShell, SectionCard, SectionHeader } from './TeamUiPrimitives';

interface TeamPlayerStatsProps {
  leaders: TeamOverviewLeaders;
}

function LeaderSpotlight({
  title,
  player,
  valueLabel,
  value,
}: {
  title: string;
  player: TeamOverviewLeaderPlayer | null;
  valueLabel: string;
  value: number;
}) {
  if (!player) return null;

  return (
    <SectionCard className="p-4 md:p-5 min-h-[220px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-500 dark:text-white/60">{title}</div>
          <h4 className="mt-2 text-xl font-black text-slate-900 dark:text-white leading-tight">
            {player.first_name} {player.last_name}
          </h4>
          {player.position ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-white/60">{player.position}</p>
          ) : null}
        </div>
        {player.team_logo ? (
          <img src={player.team_logo} alt="" className="w-10 h-10 object-contain opacity-80" />
        ) : null}
      </div>

      <div className="mt-6">
        <div className="text-3xl font-black text-[#1E4D8C] dark:text-cyan-300">{value}</div>
        <div className="text-xs text-slate-500 dark:text-white/60">{valueLabel}</div>
      </div>
    </SectionCard>
  );
}

function LeaderboardTable({
  players,
  statKey,
  title,
}: {
  players: TeamOverviewLeaderPlayer[];
  statKey: 'goals' | 'assists';
  title: string;
}) {
  const { t: tTeam } = useTranslation('team');
  const { t: tCommon } = useTranslation('common');

  return (
    <DataTableShell>
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <SectionHeader title={title} />
      </div>
      <table className="w-full min-w-[360px] text-sm">
        <thead>
          <tr className="text-xs text-slate-500 dark:text-white/70 border-b border-gray-200 dark:border-white/10">
            <th className="text-left py-2 px-4 font-semibold">#</th>
            <th className="text-left py-2 font-semibold">{tCommon('table.player', 'Игрок')}</th>
            <th className="text-right py-2 px-4 font-semibold">{tTeam('leaderboard.total', 'Всего')}</th>
          </tr>
        </thead>
        <tbody>
          {players.slice(0, 8).map((player, index) => (
            <tr key={player.player_id} className="border-b border-gray-100 dark:border-white/10 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5">
              <td className="py-2.5 px-4 text-slate-400 dark:text-white/50">{index + 1}</td>
              <td className="py-2.5">
                <Link href={`/player/${player.player_id}`} className="flex items-center gap-2.5 group">
                  {player.photo_url ? (
                    <img src={player.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/15 flex items-center justify-center text-[11px] font-bold text-slate-500 dark:text-white/60">
                      {(player.first_name?.[0] || '') + (player.last_name?.[0] || '')}
                    </div>
                  )}
                  <span className="font-bold text-slate-900 dark:text-white group-hover:text-[#1E4D8C] dark:group-hover:text-cyan-300 transition-colors">
                    {player.first_name} {player.last_name}
                  </span>
                </Link>
              </td>
              <td className="py-2.5 px-4 text-right font-black text-slate-900 dark:text-white">
                {statKey === 'goals' ? player.goals : player.assists}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DataTableShell>
  );
}

function MiniLeaderCard({
  label,
  player,
  value,
}: {
  label: string;
  player: TeamOverviewLeaderPlayer | null;
  value: number;
}) {
  if (!player) return null;

  return (
    <SectionCard className="p-3.5">
      <p className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 dark:text-white/60">{label}</p>
      <div className="mt-2 flex items-center gap-2.5">
        {player.photo_url ? (
          <img src={player.photo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-white/15" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-slate-900 dark:text-white">
            {player.first_name} {player.last_name}
          </p>
          <p className="text-xs text-slate-500 dark:text-white/60">{player.position || '—'}</p>
        </div>
        <div className="text-lg font-black text-slate-900 dark:text-white">{value}</div>
      </div>
    </SectionCard>
  );
}

export function TeamPlayerStats({ leaders }: TeamPlayerStatsProps) {
  const { t: tStats } = useTranslation('statistics');
  const { t: tTeam } = useTranslation('team');

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="space-y-4">
          <LeaderSpotlight
            title={tStats('labels.goals', 'Голы')}
            player={leaders.top_scorer}
            valueLabel={tStats('labels.goals', 'Голы')}
            value={leaders.top_scorer?.goals ?? 0}
          />
          <LeaderboardTable
            players={leaders.goals_table}
            statKey="goals"
            title={tStats('labels.goals', 'Голы')}
          />
        </div>

        <div className="space-y-4">
          <LeaderSpotlight
            title={tStats('labels.assists', 'Передачи')}
            player={leaders.top_assister}
            valueLabel={tStats('labels.assists', 'Передачи')}
            value={leaders.top_assister?.assists ?? 0}
          />
          <LeaderboardTable
            players={leaders.assists_table}
            statKey="assists"
            title={tStats('labels.assists', 'Передачи')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <MiniLeaderCard
          label={tTeam('miniStats.passes', 'Пасы')}
          player={leaders.mini_leaders.passes}
          value={leaders.mini_leaders.passes?.passes ?? 0}
        />
        <MiniLeaderCard
          label={tTeam('miniStats.appearances', 'Матчи')}
          player={leaders.mini_leaders.appearances}
          value={leaders.mini_leaders.appearances?.games_played ?? 0}
        />
        <MiniLeaderCard
          label={tTeam('miniStats.saves', 'Сейвы')}
          player={leaders.mini_leaders.saves}
          value={leaders.mini_leaders.saves?.save_shot ?? 0}
        />
        <MiniLeaderCard
          label={tTeam('miniStats.cleanSheets', 'Сухие матчи')}
          player={leaders.mini_leaders.clean_sheets}
          value={leaders.mini_leaders.clean_sheets?.dry_match ?? 0}
        />
        <MiniLeaderCard
          label={tTeam('miniStats.redCards', 'Красные карточки')}
          player={leaders.mini_leaders.red_cards}
          value={leaders.mini_leaders.red_cards?.red_cards ?? 0}
        />
      </div>

      <div className="text-center">
        <Link
          href="/stats/players"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1E4D8C] dark:text-cyan-300 hover:text-[#163A6B] dark:hover:text-cyan-200 transition-colors"
        >
          {tTeam('buttons.viewFullTable', 'Полная таблица')} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
