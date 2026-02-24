'use client';

import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'motion/react';
import { GameTeam } from '@/types';
import { SeasonTableEntry, H2HFunFacts, H2HEnhancedSeasonStats } from '@/types/h2h';

interface H2HSeasonSoFarProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  seasonTable: SeasonTableEntry[];
  funFacts: H2HFunFacts | null;
  enhancedStats: H2HEnhancedSeasonStats | null;
  homeColor: string;
  awayColor: string;
}

type CompareMode = 'higher' | 'lower';

function ComparisonRow({
  label,
  value1,
  value2,
  compareMode = 'higher',
  index,
  prefersReducedMotion,
}: {
  label: string;
  value1: string | number;
  value2: string | number;
  compareMode?: CompareMode;
  index: number;
  prefersReducedMotion: boolean | null;
}) {
  const num1 = typeof value1 === 'number' ? value1 : parseFloat(String(value1));
  const num2 = typeof value2 === 'number' ? value2 : parseFloat(String(value2));
  const canCompare = !isNaN(num1) && !isNaN(num2) && num1 !== num2;

  let left1Better = false;
  let left2Better = false;
  if (canCompare) {
    if (compareMode === 'higher') {
      left1Better = num1 > num2;
      left2Better = num2 > num1;
    } else {
      left1Better = num1 < num2;
      left2Better = num2 < num1;
    }
  }

  const bgClass = index % 2 === 0 ? 'bg-white dark:bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700/30';

  const Wrapper = prefersReducedMotion ? 'div' : motion.div;
  const wrapperProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.3, delay: index * 0.04, ease: 'easeOut' as const },
      };

  return (
    <Wrapper {...wrapperProps} className={`grid grid-cols-3 items-center px-4 py-2.5 ${bgClass}`}>
      <div className="text-right">
        <span
          className={`text-sm font-semibold inline-block min-w-[48px] text-center rounded-md px-1.5 py-0.5 ${
            left1Better ? 'bg-amber-50 text-amber-700 font-bold dark:bg-amber-900/30 dark:text-amber-300' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {value1}
        </span>
      </div>
      <div className="text-center">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
          {label}
        </span>
      </div>
      <div className="text-left">
        <span
          className={`text-sm font-semibold inline-block min-w-[48px] text-center rounded-md px-1.5 py-0.5 ${
            left2Better ? 'bg-amber-50 text-amber-700 font-bold dark:bg-amber-900/30 dark:text-amber-300' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {value2}
        </span>
      </div>
    </Wrapper>
  );
}

export function H2HSeasonSoFar({
  homeTeam,
  awayTeam,
  seasonTable,
  funFacts,
  enhancedStats,
  homeColor,
  awayColor,
}: H2HSeasonSoFarProps) {
  const { t } = useTranslation('match');
  const prefersReducedMotion = useReducedMotion();

  const homeLogo = homeTeam.logo_url;
  const awayLogo = awayTeam.logo_url;

  const team1Entry = seasonTable.find((e) => e.team_id === homeTeam.id);
  const team2Entry = seasonTable.find((e) => e.team_id === awayTeam.id);

  const safeDiv = (a: number, b: number): string => {
    if (b === 0) return '0.0';
    return (a / b).toFixed(1);
  };

  const rows: { label: string; v1: string | number; v2: string | number; compare: CompareMode }[] = [];

  if (team1Entry && team2Entry) {
    rows.push(
      { label: t('h2h.position', 'Позиция'), v1: team1Entry.position ?? '-', v2: team2Entry.position ?? '-', compare: 'lower' },
      { label: t('h2h.won', 'Победы'), v1: team1Entry.wins, v2: team2Entry.wins, compare: 'higher' },
      { label: t('h2h.drawn', 'Ничьи'), v1: team1Entry.draws, v2: team2Entry.draws, compare: 'higher' },
      { label: t('h2h.lost', 'Поражения'), v1: team1Entry.losses, v2: team2Entry.losses, compare: 'lower' },
      {
        label: t('h2h.avgGoalsScored', 'Ср. голы забитые'),
        v1: safeDiv(team1Entry.goals_scored, team1Entry.games_played),
        v2: safeDiv(team2Entry.goals_scored, team2Entry.games_played),
        compare: 'higher',
      },
      {
        label: t('h2h.avgGoalsConceded', 'Ср. голы пропущенные'),
        v1: safeDiv(team1Entry.goals_conceded, team1Entry.games_played),
        v2: safeDiv(team2Entry.goals_conceded, team2Entry.games_played),
        compare: 'lower',
      },
      { label: t('h2h.cleanSheets', 'Сухие матчи'), v1: team1Entry.clean_sheets, v2: team2Entry.clean_sheets, compare: 'higher' },
    );
  }

  if (enhancedStats?.team1?.shots_per_match != null && enhancedStats?.team2?.shots_per_match != null) {
    rows.push({
      label: t('h2h.shotsPerMatch', 'Удары / матч'),
      v1: enhancedStats.team1.shots_per_match.toFixed(1),
      v2: enhancedStats.team2.shots_per_match.toFixed(1),
      compare: 'higher',
    });
  }

  return (
    <div className="bg-[#F5F7F9] dark:bg-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 sm:p-6 pb-3">
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
          {homeLogo && (
            <img src={homeLogo} alt={homeTeam.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = '/images/placeholders/team.svg'; }} />
          )}
        </div>
        <div className="text-center">
          <h3 className="text-base font-extrabold uppercase tracking-wide text-gray-900 dark:text-white">
            {t('h2h.seasonSoFar', 'СЕЗОН')}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {homeTeam.name} {t('h2h.vs', 'vs')} {awayTeam.name}
          </p>
        </div>
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
          {awayLogo && (
            <img src={awayLogo} alt={awayTeam.name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = '/images/placeholders/team.svg'; }} />
          )}
        </div>
      </div>

      {/* Team name sub-headers */}
      <div className="grid grid-cols-3 items-center px-4 pb-2">
        <div className="text-right">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {homeTeam.name}
          </span>
        </div>
        <div />
        <div className="text-left">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {awayTeam.name}
          </span>
        </div>
      </div>

      {/* Comparison Rows */}
      <div className="border-t border-gray-200 dark:border-gray-600">
        {rows.map((row, i) => (
          <ComparisonRow
            key={row.label}
            label={row.label}
            value1={row.v1}
            value2={row.v2}
            compareMode={row.compare}
            index={i}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>

      {/* Biggest Win / Worst Defeat */}
      {funFacts && (
        <div className="border-t-2 border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-3 items-center px-4 py-3 bg-white dark:bg-gray-700/50">
            <div className="text-right">
              <span className="text-sm font-bold" style={{ color: homeColor }}>
                {funFacts.team1_biggest_win?.score ?? '-'}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                {t('h2h.biggestWin', 'Крупнейшая победа')}
              </span>
            </div>
            <div className="text-left">
              <span className="text-sm font-bold" style={{ color: awayColor }}>
                {funFacts.team2_biggest_win?.score ?? '-'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center px-4 py-3 bg-gray-50 dark:bg-gray-700/30">
            <div className="text-right">
              <span className="text-sm font-bold" style={{ color: homeColor }}>
                {funFacts.team1_worst_defeat?.score ?? '-'}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                {t('h2h.worstDefeat', 'Крупнейшее поражение')}
              </span>
            </div>
            <div className="text-left">
              <span className="text-sm font-bold" style={{ color: awayColor }}>
                {funFacts.team2_worst_defeat?.score ?? '-'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
