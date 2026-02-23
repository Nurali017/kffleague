'use client';

import { TournamentAwareLink as Link } from '@/components/navigation/TournamentAwareLink';
import { useTranslation } from 'react-i18next';
import { GameTeam } from '@/types';
import { SeasonTableEntry, H2HComputedMetrics, H2HEnhancedSeasonStats } from '@/types/h2h';
import { getTeamHref } from '@/lib/utils/entityRoutes';
import { StatBar } from '../StatBar';

interface H2HSeasonStatsProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  seasonTable: SeasonTableEntry[];
  metrics: H2HComputedMetrics;
  homeColor: string;
  awayColor: string;
  enhancedStats?: H2HEnhancedSeasonStats | null;
}

export function H2HSeasonStats({
  homeTeam,
  awayTeam,
  seasonTable,
  metrics,
  homeColor,
  awayColor,
  enhancedStats,
}: H2HSeasonStatsProps) {
  const { t } = useTranslation('match');
  const homeTeamHref = getTeamHref(homeTeam.id);
  const awayTeamHref = getTeamHref(awayTeam.id);

  const homeEntry = seasonTable.find((t) => t.team_id === homeTeam.id);
  const awayEntry = seasonTable.find((t) => t.team_id === awayTeam.id);

  const homeGoalsPerGame = homeEntry
    ? homeEntry.goals_scored / (homeEntry.games_played || 1)
    : 0;
  const awayGoalsPerGame = awayEntry
    ? awayEntry.goals_scored / (awayEntry.games_played || 1)
    : 0;

  const homeConcededPerGame = homeEntry
    ? homeEntry.goals_conceded / (homeEntry.games_played || 1)
    : 0;
  const awayConcededPerGame = awayEntry
    ? awayEntry.goals_conceded / (awayEntry.games_played || 1)
    : 0;

  const homeWinRate = homeEntry
    ? (homeEntry.wins / (homeEntry.games_played || 1)) * 100
    : 0;
  const awayWinRate = awayEntry
    ? (awayEntry.wins / (awayEntry.games_played || 1)) * 100
    : 0;

  const t1 = enhancedStats?.team1;
  const t2 = enhancedStats?.team2;

  return (
    <div className="space-y-6">
      {/* Position in table — gradient split card */}
      {homeEntry && awayEntry && (
        <div className="flex items-stretch rounded-xl overflow-hidden">
          <div
            className="flex-1 p-3 text-center"
            style={{ backgroundColor: `${homeColor}08` }}
          >
            <span className="text-2xl font-black text-gray-900">
              #{homeEntry.position || '-'}
            </span>
            {homeTeamHref ? (
              <div>
                <Link href={homeTeamHref} className="text-[10px] font-semibold text-primary hover:text-primary-dark transition-colors">
                  {homeTeam.name}
                </Link>
              </div>
            ) : (
              <p className="text-[10px] text-gray-500 uppercase mt-1">{homeTeam.name}</p>
            )}
            <p className="text-[10px] text-gray-500 uppercase mt-1">
              {t('h2h.tablePosition', 'позиция')}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center px-3 bg-gray-50">
            <span className="text-[10px] text-gray-400 uppercase font-medium">
              {t('h2h.points', 'Очки')}
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-lg font-bold" style={{ color: homeColor }}>
                {homeEntry.points}
              </span>
              <span className="text-gray-300">-</span>
              <span className="text-lg font-bold" style={{ color: awayColor }}>
                {awayEntry.points}
              </span>
            </div>
          </div>
          <div
            className="flex-1 p-3 text-center"
            style={{ backgroundColor: `${awayColor}08` }}
          >
            <span className="text-2xl font-black text-gray-900">
              #{awayEntry.position || '-'}
            </span>
            {awayTeamHref ? (
              <div>
                <Link href={awayTeamHref} className="text-[10px] font-semibold text-primary hover:text-primary-dark transition-colors">
                  {awayTeam.name}
                </Link>
              </div>
            ) : (
              <p className="text-[10px] text-gray-500 uppercase mt-1">{awayTeam.name}</p>
            )}
            <p className="text-[10px] text-gray-500 uppercase mt-1">
              {t('h2h.tablePosition', 'позиция')}
            </p>
          </div>
        </div>
      )}

      {/* Performance stats */}
      <div className="space-y-5">
        <StatBar
          label={t('h2h.goalsPerGame', 'Голов за игру')}
          homeValue={parseFloat(homeGoalsPerGame.toFixed(1))}
          awayValue={parseFloat(awayGoalsPerGame.toFixed(1))}
          homeColor={homeColor}
          awayColor={awayColor}
          animated
        />

        <StatBar
          label={t('h2h.concededPerGame', 'Пропущено за игру')}
          homeValue={parseFloat(homeConcededPerGame.toFixed(1))}
          awayValue={parseFloat(awayConcededPerGame.toFixed(1))}
          homeColor={homeColor}
          awayColor={awayColor}
          animated
        />

        <StatBar
          label={t('h2h.winRate', 'Победы (%)')}
          homeValue={Math.round(homeWinRate)}
          awayValue={Math.round(awayWinRate)}
          homeColor={homeColor}
          awayColor={awayColor}
          animated
        />

        {homeEntry && awayEntry && (
          <StatBar
            label={t('h2h.cleanSheets', 'Сухие матчи')}
            homeValue={homeEntry.clean_sheets}
            awayValue={awayEntry.clean_sheets}
            homeColor={homeColor}
            awayColor={awayColor}
            animated
          />
        )}
      </div>

      {/* Advanced stats */}
      {(t1?.xg_per_match != null || t1?.possession_avg != null) && (
        <div className="space-y-5 pt-4 border-t border-gray-100">
          <div className="text-[10px] text-gray-400 uppercase font-medium text-center tracking-wider">
            {t('h2h.enhanced.title', 'Расширенная статистика')}
          </div>

          {t1?.xg_per_match != null && t2?.xg_per_match != null && (
            <StatBar
              label={t('h2h.enhanced.xgPerMatch', 'xG / матч')}
              homeValue={parseFloat(t1.xg_per_match.toFixed(2))}
              awayValue={parseFloat(t2.xg_per_match.toFixed(2))}
              homeColor={homeColor}
              awayColor={awayColor}
              animated
            />
          )}

          {t1?.possession_avg != null && t2?.possession_avg != null && (
            <StatBar
              label={t('h2h.enhanced.possessionAvg', 'Владение (%)')}
              homeValue={parseFloat(t1.possession_avg.toFixed(1))}
              awayValue={parseFloat(t2.possession_avg.toFixed(1))}
              homeColor={homeColor}
              awayColor={awayColor}
              animated
            />
          )}

          {t1?.pass_accuracy_avg != null && t2?.pass_accuracy_avg != null && (
            <StatBar
              label={t('h2h.enhanced.passAccuracy', 'Точность пасов (%)')}
              homeValue={parseFloat(t1.pass_accuracy_avg.toFixed(1))}
              awayValue={parseFloat(t2.pass_accuracy_avg.toFixed(1))}
              homeColor={homeColor}
              awayColor={awayColor}
              animated
            />
          )}

          {t1?.duel_ratio != null && t2?.duel_ratio != null && (
            <StatBar
              label={t('h2h.enhanced.duelRatio', 'Единоборства (%)')}
              homeValue={parseFloat(t1.duel_ratio.toFixed(1))}
              awayValue={parseFloat(t2.duel_ratio.toFixed(1))}
              homeColor={homeColor}
              awayColor={awayColor}
              animated
            />
          )}

          {t1?.shots_per_match != null && t2?.shots_per_match != null && (
            <StatBar
              label={t('h2h.enhanced.shotsPerMatch', 'Удары / матч')}
              homeValue={parseFloat(t1.shots_per_match.toFixed(1))}
              awayValue={parseFloat(t2.shots_per_match.toFixed(1))}
              homeColor={homeColor}
              awayColor={awayColor}
              animated
            />
          )}
        </div>
      )}

      {/* Additional stats row */}
      {homeEntry && awayEntry && (
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
          <div className="text-center p-2 bg-[#FAFBFC] rounded-lg border border-gray-100">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-bold" style={{ color: homeColor }}>
                {homeEntry.wins}
              </span>
              <span className="text-gray-300">-</span>
              <span className="text-sm font-bold" style={{ color: awayColor }}>
                {awayEntry.wins}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 uppercase mt-1">
              {t('h2h.seasonWins', 'Побед')}
            </p>
          </div>
          <div className="text-center p-2 bg-[#FAFBFC] rounded-lg border border-gray-100">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-bold" style={{ color: homeColor }}>
                {homeEntry.goals_scored}
              </span>
              <span className="text-gray-300">-</span>
              <span className="text-sm font-bold" style={{ color: awayColor }}>
                {awayEntry.goals_scored}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 uppercase mt-1">
              {t('h2h.goalsScored', 'голов')}
            </p>
          </div>
          <div className="text-center p-2 bg-[#FAFBFC] rounded-lg border border-gray-100">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-bold" style={{ color: homeColor }}>
                {homeEntry.goal_difference > 0 ? '+' : ''}
                {homeEntry.goal_difference}
              </span>
              <span className="text-gray-300">-</span>
              <span className="text-sm font-bold" style={{ color: awayColor }}>
                {awayEntry.goal_difference > 0 ? '+' : ''}
                {awayEntry.goal_difference}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 uppercase mt-1">
              {t('h2h.goalDiff', 'Разница')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
