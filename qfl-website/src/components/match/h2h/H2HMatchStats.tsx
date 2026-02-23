'use client';

import { useTranslation } from 'react-i18next';
import { GameTeam } from '@/types';
import { H2HAggregatedMatchStats } from '@/types/h2h';
import { StatBar } from '../StatBar';

interface H2HMatchStatsProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  matchStats: H2HAggregatedMatchStats;
  homeColor: string;
  awayColor: string;
}

export function H2HMatchStats({
  homeTeam,
  awayTeam,
  matchStats,
  homeColor,
  awayColor,
}: H2HMatchStatsProps) {
  const { t } = useTranslation('match');
  const { team1, team2 } = matchStats;

  return (
    <div className="space-y-6">
      {/* Stat bars */}
      <div className="space-y-5">
        {team1.avg_possession != null && team2.avg_possession != null && (
          <StatBar
            label={t('h2h.matchStats.avgPossession', 'Ср. владение (%)')}
            homeValue={team1.avg_possession}
            awayValue={team2.avg_possession}
            homeColor={homeColor}
            awayColor={awayColor}
            animated
          />
        )}

        {team1.avg_shots != null && team2.avg_shots != null && (
          <StatBar
            label={t('h2h.matchStats.avgShots', 'Удары')}
            homeValue={team1.avg_shots}
            awayValue={team2.avg_shots}
            homeColor={homeColor}
            awayColor={awayColor}
            animated
          />
        )}

        {team1.avg_shots_on_goal != null && team2.avg_shots_on_goal != null && (
          <StatBar
            label={t('h2h.matchStats.avgShotsOnGoal', 'Удары в створ')}
            homeValue={team1.avg_shots_on_goal}
            awayValue={team2.avg_shots_on_goal}
            homeColor={homeColor}
            awayColor={awayColor}
            animated
          />
        )}

        {team1.avg_corners != null && team2.avg_corners != null && (
          <StatBar
            label={t('h2h.matchStats.avgCorners', 'Угловые')}
            homeValue={team1.avg_corners}
            awayValue={team2.avg_corners}
            homeColor={homeColor}
            awayColor={awayColor}
            animated
          />
        )}

        {team1.avg_fouls != null && team2.avg_fouls != null && (
          <StatBar
            label={t('h2h.matchStats.avgFouls', 'Фолы')}
            homeValue={team1.avg_fouls}
            awayValue={team2.avg_fouls}
            homeColor={homeColor}
            awayColor={awayColor}
            animated
          />
        )}
      </div>

      {/* Cards summary grid */}
      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
        <div className="text-center p-2 bg-[#FAFBFC] rounded-lg border border-gray-100">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block w-2.5 h-3.5 bg-yellow-400 rounded-sm" />
            <span className="text-sm font-bold" style={{ color: homeColor }}>
              {team1.total_yellow_cards}
            </span>
            <span className="text-gray-300">-</span>
            <span className="text-sm font-bold" style={{ color: awayColor }}>
              {team2.total_yellow_cards}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 uppercase mt-1">
            {t('h2h.matchStats.yellowCards', 'Жёлтые карточки')}
          </p>
        </div>
        <div className="text-center p-2 bg-[#FAFBFC] rounded-lg border border-gray-100">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block w-2.5 h-3.5 bg-red-500 rounded-sm" />
            <span className="text-sm font-bold" style={{ color: homeColor }}>
              {team1.total_red_cards}
            </span>
            <span className="text-gray-300">-</span>
            <span className="text-sm font-bold" style={{ color: awayColor }}>
              {team2.total_red_cards}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 uppercase mt-1">
            {t('h2h.matchStats.redCards', 'Красные карточки')}
          </p>
        </div>
      </div>

      {/* Based on X matches note */}
      <div className="flex justify-center">
        <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-[10px] font-medium rounded-full">
          {t('h2h.matchStats.basedOn', 'На основе {{count}} матчей', {
            count: matchStats.matches_with_stats,
          })}
        </span>
      </div>
    </div>
  );
}
