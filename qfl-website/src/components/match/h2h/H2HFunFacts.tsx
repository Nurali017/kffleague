'use client';

import { useTranslation } from 'react-i18next';
import { Target, TrendingUp, Users, Timer } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { GameTeam } from '@/types';
import { H2HFunFacts as H2HFunFactsType } from '@/types/h2h';

interface H2HFunFactsProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  funFacts: H2HFunFactsType;
  homeColor: string;
  awayColor: string;
}

const tileVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' as const },
  }),
};

export function H2HFunFacts({
  homeTeam,
  awayTeam,
  funFacts,
  homeColor,
  awayColor,
}: H2HFunFactsProps) {
  const { t } = useTranslation('match');
  const prefersReducedMotion = useReducedMotion();

  const Tile = prefersReducedMotion ? 'div' : motion.div;
  const tileProps = (i: number) =>
    prefersReducedMotion
      ? {}
      : { variants: tileVariants, initial: 'hidden', whileInView: 'visible', viewport: { once: true }, custom: i };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-md border-l-4 border-l-primary overflow-hidden">
      <div className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide text-center">
          {t('h2h.funFacts.title', 'Интересные факты')}
        </h3>

        {/* Stats Grid 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {/* Goals per match */}
          <Tile {...tileProps(0)} className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-xl p-4 text-center">
            <Target className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-3xl font-black text-gray-900">
              {funFacts.avg_goals_per_match}
            </div>
            <div className="text-[10px] text-gray-500 uppercase font-medium mt-1">
              {t('h2h.funFacts.goalsPerMatch', 'голов / матч')}
            </div>
          </Tile>

          {/* Over 2.5 */}
          <Tile {...tileProps(1)} className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-3xl font-black text-gray-900">
              {funFacts.over_2_5_percent}%
            </div>
            <div className="text-[10px] text-gray-500 uppercase font-medium mt-1">
              {t('h2h.funFacts.over25', 'тотал > 2.5')}
            </div>
          </Tile>

          {/* BTTS */}
          <Tile {...tileProps(2)} className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-3xl font-black text-gray-900">
              {funFacts.btts_percent}%
            </div>
            <div className="text-[10px] text-gray-500 uppercase font-medium mt-1">
              {t('h2h.funFacts.btts', 'обе забили')}
            </div>
          </Tile>

          {/* Goals by half */}
          {funFacts.goals_by_half ? (
            <Tile {...tileProps(3)} className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-xl p-4 text-center">
              <Timer className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="flex items-center justify-center gap-3">
                <div>
                  <div className="text-lg font-black text-gray-900">
                    {funFacts.goals_by_half.team1_first_half + funFacts.goals_by_half.team2_first_half}
                  </div>
                  <div className="text-[10px] text-gray-400">1-й</div>
                </div>
                <div className="text-gray-300">|</div>
                <div>
                  <div className="text-lg font-black text-gray-900">
                    {funFacts.goals_by_half.team1_second_half + funFacts.goals_by_half.team2_second_half}
                  </div>
                  <div className="text-[10px] text-gray-400">2-й</div>
                </div>
              </div>
              <div className="text-[10px] text-gray-500 uppercase font-medium mt-1">
                {t('h2h.funFacts.goalsByHalf', 'голы по таймам')}
              </div>
            </Tile>
          ) : (
            <Tile {...tileProps(3)} className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-xl p-4 text-center">
              <Timer className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-3xl font-black text-gray-900">-</div>
              <div className="text-[10px] text-gray-500 uppercase font-medium mt-1">
                {t('h2h.funFacts.goalsByHalf', 'голы по таймам')}
              </div>
            </Tile>
          )}
        </div>

        {/* Biggest Wins & Streaks */}
        <div className="space-y-2">
          {(funFacts.team1_biggest_win || funFacts.team2_biggest_win) && (
            <div className="flex items-stretch gap-2">
              {funFacts.team1_biggest_win && (
                <div className="flex-1 rounded-xl p-3 text-center border-l-4 bg-gray-50" style={{ borderLeftColor: homeColor }}>
                  <div className="text-[10px] text-gray-400 uppercase font-medium mb-1">
                    {t('h2h.funFacts.biggestWin', 'крупнейшая победа')}
                  </div>
                  <div className="text-xs font-medium text-gray-500 truncate">
                    {homeTeam.name}
                  </div>
                  <div className="text-lg font-black mt-0.5" style={{ color: homeColor }}>
                    {funFacts.team1_biggest_win.score}
                  </div>
                </div>
              )}
              {funFacts.team2_biggest_win && (
                <div className="flex-1 rounded-xl p-3 text-center border-l-4 bg-gray-50" style={{ borderLeftColor: awayColor }}>
                  <div className="text-[10px] text-gray-400 uppercase font-medium mb-1">
                    {t('h2h.funFacts.biggestWin', 'крупнейшая победа')}
                  </div>
                  <div className="text-xs font-medium text-gray-500 truncate">
                    {awayTeam.name}
                  </div>
                  <div className="text-lg font-black mt-0.5" style={{ color: awayColor }}>
                    {funFacts.team2_biggest_win.score}
                  </div>
                </div>
              )}
            </div>
          )}

          {(funFacts.team1_unbeaten_streak > 0 || funFacts.team2_unbeaten_streak > 0) && (
            <div className="flex items-stretch gap-2">
              <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <div className="text-[10px] text-gray-400 uppercase font-medium mb-1">
                  {t('h2h.funFacts.unbeatenStreak', 'серия без поражений')}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <div className="text-lg font-black" style={{ color: homeColor }}>
                      {funFacts.team1_unbeaten_streak}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[80px]">
                      {homeTeam.name}
                    </div>
                  </div>
                  <div className="text-gray-300">-</div>
                  <div>
                    <div className="text-lg font-black" style={{ color: awayColor }}>
                      {funFacts.team2_unbeaten_streak}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[80px]">
                      {awayTeam.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
