'use client';

import { useTranslation } from 'react-i18next';
import { useStatsOverview } from '@/hooks/useStatsOverview';
import { usePreSeasonEffectiveId } from '@/contexts/TournamentContext';
import { useSeasonStats } from '@/hooks';
import { FeaturedStatBlock } from './FeaturedStatBlock';
import { MiniStatCard } from './MiniStatCard';
import { LeaguePerformanceChart } from './LeaguePerformanceChart';
import { Skeleton } from '@/components/ui/Skeleton';
import { PlayerStat } from '@/types';
import { getPlayerHref, getTeamHref } from '@/lib/utils/entityRoutes';

/* ---------- Helpers ---------- */

function playerName(p: PlayerStat) {
  const last = (p.last_name || '').trim();
  const first = (p.first_name || '').trim();
  if (last && first) return `${last} ${first[0].toUpperCase()}.`;
  return last || first || '—';
}

function playerFullLast(p: PlayerStat) {
  return (p.last_name || '').trim() || (p.first_name || '').trim() || '—';
}

function safeDiv(a: number | null | undefined, b: number | null | undefined, mult = 100): number {
  if (!a || !b || b === 0) return 0;
  return (a / b) * mult;
}

/* ---------- Skeletons ---------- */

function FeaturedSkeleton() {
  return (
    <div>
      <Skeleton className="h-6 w-24 mb-3" />
      <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden flex flex-col lg:flex-row">
        <Skeleton className="w-full lg:w-[380px] h-[320px]" />
        <div className="flex-1 p-4 space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniSkeleton() {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
      <Skeleton className="h-4 w-16 m-3" />
      <Skeleton className="h-28 mx-3 rounded-lg" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

/* ---------- Main Component ---------- */

export function StatsOverview() {
  const { t } = useTranslation('statistics');
  const effectiveSeasonId = usePreSeasonEffectiveId('previous');
  const { data, loading, error } = useStatsOverview({ seasonId: effectiveSeasonId });
  const { stats: seasonStats } = useSeasonStats({ seasonId: effectiveSeasonId });
  const seasonName = seasonStats?.season_name || '';

  if (error) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
          <p className="text-red-600 dark:text-red-400">
            {t('errors.seasonStatsLoad', { defaultValue: 'Ошибка загрузки статистики' })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-4 md:py-8 space-y-8 md:space-y-14">
      {/* ====== PLAYER STATS ====== */}
      <section>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-slate-100 mb-4 md:mb-6 uppercase tracking-tight">
          {t('overview.playerStats', { defaultValue: 'Статистика игроков' })}
          {seasonName && (
            <span className="block mt-1 md:inline md:mt-0 text-gray-400 dark:text-slate-500 font-medium text-base md:text-xl md:ml-2">
              — {seasonName}
            </span>
          )}
        </h2>

        {loading || !data ? (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <FeaturedSkeleton />
              <FeaturedSkeleton />
            </div>
            <div className="md:hidden mb-2 text-[11px] text-gray-500 dark:text-slate-400">
              {t('overview.swipeMiniCardsHint', { defaultValue: 'Свайпните влево, чтобы увидеть больше лидеров.' })}
            </div>
            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 md:grid md:grid-cols-5 md:overflow-visible">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[76vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
                  <MiniSkeleton />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Featured: Goals + Assists */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              {/* GOALS */}
              {data.player.goals[0] && (
                <FeaturedStatBlock
                  title={t('overview.goals', { defaultValue: 'Голы' })}
                  accentBg="bg-emerald-800"
                  featured={{
                    photoUrl: data.player.goals[0].photo_url,
                    firstName: data.player.goals[0].first_name,
                    name: playerFullLast(data.player.goals[0]),
                    teamName: data.player.goals[0].team_name,
                    teamLogoUrl: data.player.goals[0].team_logo,
                    mainStat: { label: t('playerColumns.goals', { defaultValue: 'Голы' }), value: data.player.goals[0].goals ?? 0 },
                    secondaryStat: { label: t('playerColumns.shots', { defaultValue: 'Удары' }), value: data.player.goals[0].shots ?? 0 },
                    circles: [
                      { value: safeDiv(data.player.goals[0].shots_on_goal, data.player.goals[0].shots), label: t('overview.shotAccuracy', { defaultValue: 'Точн. ударов' }) },
                      { value: safeDiv(data.player.goals[0].goals, data.player.goals[0].shots), label: t('overview.conversionRate', { defaultValue: 'Реализация' }) },
                    ],
                    href: getPlayerHref(data.player.goals[0].player_id),
                  }}
                  rankings={data.player.goals.slice(1).map((p, i) => ({
                    rank: i + 2,
                    name: playerName(p),
                    imageUrl: p.photo_url,
                    teamName: p.team_name,
                    teamLogoUrl: p.team_logo,
                    value: p.goals ?? 0,
                    href: getPlayerHref(p.player_id),
                  }))}
                  entityLabel={t('player', { defaultValue: 'ИГРОК' })}
                  valueLabel={t('overview.total', { defaultValue: 'ВСЕГО' })}
                  viewFullTableHref="/stats/players"
                />
              )}

              {/* ASSISTS */}
              {data.player.assists[0] && (
                <FeaturedStatBlock
                  title={t('overview.assists', { defaultValue: 'Передачи' })}
                  accentBg="bg-red-900"
                  featured={{
                    photoUrl: data.player.assists[0].photo_url,
                    firstName: data.player.assists[0].first_name,
                    name: playerFullLast(data.player.assists[0]),
                    teamName: data.player.assists[0].team_name,
                    teamLogoUrl: data.player.assists[0].team_logo,
                    mainStat: { label: t('playerColumns.assists', { defaultValue: 'Передачи' }), value: data.player.assists[0].assists ?? 0 },
                    secondaryStat: { label: t('playerColumns.key_passes', { defaultValue: 'Ключевые' }), value: data.player.assists[0].key_passes ?? 0 },
                    circles: [
                      { value: data.player.assists[0].pass_accuracy ?? 0, label: t('overview.passAccuracy', { defaultValue: 'Точн. паса' }) },
                    ],
                    href: getPlayerHref(data.player.assists[0].player_id),
                  }}
                  rankings={data.player.assists.slice(1).map((p, i) => ({
                    rank: i + 2,
                    name: playerName(p),
                    imageUrl: p.photo_url,
                    teamName: p.team_name,
                    teamLogoUrl: p.team_logo,
                    value: p.assists ?? 0,
                    href: getPlayerHref(p.player_id),
                  }))}
                  entityLabel={t('player', { defaultValue: 'ИГРОК' })}
                  valueLabel={t('overview.total', { defaultValue: 'ВСЕГО' })}
                  viewFullTableHref="/stats/players"
                />
              )}
            </div>

            {/* Mini cards row */}
            <div className="md:hidden mb-2 text-[11px] text-gray-500 dark:text-slate-400">
              {t('overview.swipeMiniCardsHint', { defaultValue: 'Свайпните влево, чтобы увидеть больше лидеров.' })}
            </div>
            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 md:grid md:grid-cols-5 md:overflow-visible">
              {data.player.topPasses && (
                <div className="w-[76vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
                  <MiniStatCard
                    title={t('overview.passes', { defaultValue: 'Пасы' })}
                    imageUrl={data.player.topPasses.photo_url}
                    name={playerName(data.player.topPasses)}
                    sublabel={data.player.topPasses.team_name}
                    value={data.player.topPasses.passes ?? 0}
                    href="/stats/players"
                  />
                </div>
              )}
              {data.player.topAppearances && (
                <div className="w-[76vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
                  <MiniStatCard
                    title={t('overview.appearances', { defaultValue: 'Матчи' })}
                    imageUrl={data.player.topAppearances.photo_url}
                    name={playerName(data.player.topAppearances)}
                    sublabel={data.player.topAppearances.team_name}
                    value={data.player.topAppearances.games_played ?? 0}
                    href="/stats/players"
                  />
                </div>
              )}
              {data.player.topSaves && (
                <div className="w-[76vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
                  <MiniStatCard
                    title={t('overview.saves', { defaultValue: 'Сейвы' })}
                    imageUrl={data.player.topSaves.photo_url}
                    name={playerName(data.player.topSaves)}
                    sublabel={data.player.topSaves.team_name}
                    value={data.player.topSaves.save_shot ?? 0}
                    href="/stats/players"
                  />
                </div>
              )}
              {data.player.topCleanSheets && (
                <div className="w-[76vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
                  <MiniStatCard
                    title={t('overview.cleanSheets', { defaultValue: 'Сухие матчи' })}
                    imageUrl={data.player.topCleanSheets.photo_url}
                    name={playerName(data.player.topCleanSheets)}
                    sublabel={data.player.topCleanSheets.team_name}
                    value={data.player.topCleanSheets.dry_match ?? 0}
                    href="/stats/players"
                  />
                </div>
              )}
              {data.player.topRedCards && (
                <div className="w-[76vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
                  <MiniStatCard
                    title={t('overview.redCards', { defaultValue: 'Красные карточки' })}
                    imageUrl={data.player.topRedCards.photo_url}
                    name={playerName(data.player.topRedCards)}
                    sublabel={data.player.topRedCards.team_name}
                    value={data.player.topRedCards.red_cards ?? 0}
                    href="/stats/players"
                    bgColor="bg-red-50 dark:bg-red-900/20"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* ====== TEAM STATS ====== */}
      <section>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-slate-100 mb-4 md:mb-6 uppercase tracking-tight">
          {t('overview.teamStats', { defaultValue: 'Статистика команд' })}
          {seasonName && (
            <span className="block mt-1 md:inline md:mt-0 text-gray-400 dark:text-slate-500 font-medium text-base md:text-xl md:ml-2">
              — {seasonName}
            </span>
          )}
        </h2>

        {loading || !data ? (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <FeaturedSkeleton />
              <FeaturedSkeleton />
            </div>
            <div className="md:hidden mb-2 text-[11px] text-gray-500 dark:text-slate-400">
              {t('overview.swipeMiniCardsHint', { defaultValue: 'Свайпните влево, чтобы увидеть больше лидеров.' })}
            </div>
            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 md:grid md:grid-cols-5 md:overflow-visible">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[76vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
                  <MiniSkeleton />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Featured: Goals + Wins */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              {/* GOALS */}
              {data.team.goals[0] && (() => {
                const team = data.team.goals[0];
                return (
                  <FeaturedStatBlock
                    title={t('overview.goals', { defaultValue: 'Голы' })}
                    accentBg="bg-primary"
                    featured={{
                      photoUrl: team.team_logo,
                      name: team.team_name,
                      mainStat: { label: t('playerColumns.goals', { defaultValue: 'Голы' }), value: team.goals_scored ?? 0 },
                      secondaryStat: { label: t('playerColumns.shots', { defaultValue: 'Удары' }), value: team.shots ?? 0 },
                      circles: [
                        { value: safeDiv(team.shots_on_goal, team.shots), label: t('overview.shotAccuracy', { defaultValue: 'Точн. ударов' }) },
                        { value: team.possession ?? 0, label: t('labels.possession', { defaultValue: 'Владение' }) },
                      ],
                      href: getTeamHref(team.team_id),
                    }}
                    rankings={data.team.goals.slice(1).map((t, i) => ({
                      rank: i + 2,
                      name: t.team_name,
                      imageUrl: t.team_logo,
                      value: t.goals_scored ?? 0,
                      href: getTeamHref(t.team_id),
                    }))}
                    entityLabel={t('table.club', { defaultValue: 'Клуб' })}
                    valueLabel={t('overview.total', { defaultValue: 'ВСЕГО' })}
                    viewFullTableHref="/stats/teams"
                  />
                );
              })()}

              {/* WINS */}
              {data.team.wins[0] && (() => {
                const team = data.team.wins[0];
                const gp = team.games_played ?? 1;
                return (
                  <FeaturedStatBlock
                    title={t('overview.wins', { defaultValue: 'Победы' })}
                    accentBg="bg-amber-700"
                    featured={{
                      photoUrl: team.team_logo,
                      name: team.team_name,
                      mainStat: { label: t('overview.wins', { defaultValue: 'Победы' }), value: team.wins ?? 0 },
                      secondaryStat: { label: t('overview.losses', { defaultValue: 'Поражения' }), value: team.losses ?? 0 },
                      circles: [
                        { value: safeDiv(team.wins, gp), label: t('overview.winPct', { defaultValue: 'Побед' }) },
                        { value: safeDiv(team.draws, gp), label: t('overview.drawPct', { defaultValue: 'Ничьих' }) },
                        { value: safeDiv(team.losses, gp), label: t('overview.lossPct', { defaultValue: 'Поражений' }) },
                      ],
                      href: getTeamHref(team.team_id),
                    }}
                    rankings={data.team.wins.slice(1).map((t, i) => ({
                      rank: i + 2,
                      name: t.team_name,
                      imageUrl: t.team_logo,
                      value: t.wins ?? 0,
                      href: getTeamHref(t.team_id),
                    }))}
                    entityLabel={t('table.club', { defaultValue: 'Клуб' })}
                    valueLabel={t('overview.total', { defaultValue: 'ВСЕГО' })}
                    viewFullTableHref="/stats/teams"
                  />
                );
              })()}
            </div>

            {/* Mini cards row */}
            <div className="md:hidden mb-2 text-[11px] text-gray-500 dark:text-slate-400">
              {t('overview.swipeMiniCardsHint', { defaultValue: 'Свайпните влево, чтобы увидеть больше лидеров.' })}
            </div>
            <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 md:grid md:grid-cols-5 md:overflow-visible">
              {data.team.topLosses && (
                <div className="w-[76vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
                  <MiniStatCard
                    title={t('overview.losses', { defaultValue: 'Поражения' })}
                    imageUrl={data.team.topLosses.team_logo}
                    name={data.team.topLosses.team_name}
                    value={data.team.topLosses.losses ?? 0}
                    href="/stats/teams"
                  />
                </div>
              )}
              {data.team.topPasses && (
                <div className="w-[76vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
                  <MiniStatCard
                    title={t('overview.passes', { defaultValue: 'Пасы' })}
                    imageUrl={data.team.topPasses.team_logo}
                    name={data.team.topPasses.team_name}
                    value={data.team.topPasses.passes ?? 0}
                    href="/stats/teams"
                  />
                </div>
              )}
              {data.team.topOffsides && (
                <div className="w-[76vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
                  <MiniStatCard
                    title={t('labels.offsides', { defaultValue: 'Офсайды' })}
                    imageUrl={data.team.topOffsides.team_logo}
                    name={data.team.topOffsides.team_name}
                    value={data.team.topOffsides.offsides ?? 0}
                    href="/stats/teams"
                  />
                </div>
              )}
              {data.team.topTackles && (
                <div className="w-[76vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
                  <MiniStatCard
                    title={t('labels.tackles', { defaultValue: 'Отборы' })}
                    imageUrl={data.team.topTackles.team_logo}
                    name={data.team.topTackles.team_name}
                    value={data.team.topTackles.tackles ?? 0}
                    href="/stats/teams"
                  />
                </div>
              )}
              {data.team.topRedCards && (
                <div className="w-[76vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
                  <MiniStatCard
                    title={t('overview.redCards', { defaultValue: 'Красные карточки' })}
                    imageUrl={data.team.topRedCards.team_logo}
                    name={data.team.topRedCards.team_name}
                    value={data.team.topRedCards.red_cards ?? 0}
                    href="/stats/teams"
                    bgColor="bg-red-50 dark:bg-red-900/20"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* ====== LEAGUE PERFORMANCE ====== */}
      <section>
        <LeaguePerformanceChart />
      </section>
    </div>
  );
}
