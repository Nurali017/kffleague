'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from 'motion/react';
import { GameTeam } from '@/types';
import { useH2H } from '@/hooks';
import { computeH2HMetrics } from '@/types/h2h';
import { HOME_COLOR, AWAY_COLOR } from '@/lib/utils/teamLogos';
import { PRE_SEASON_CONFIG, SEASONS } from '@/config/tournaments';
import {
  H2HDonutChart,
  H2HFormStreak,
  H2HPreviousMeetings,
  H2HSeasonStats,
  H2HSkeleton,
  H2HFunFacts,
  H2HMatchStats,
  H2HTopPerformers,
} from './h2h';

interface H2HContentCardsProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  seasonId?: number;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export function H2HContentCards({
  homeTeam,
  awayTeam,
  seasonId,
}: H2HContentCardsProps) {
  const { t } = useTranslation('match');
  const prefersReducedMotion = useReducedMotion();

  const effectiveSeasonId = useMemo(() => {
    if (
      !PRE_SEASON_CONFIG.seasonStarted &&
      seasonId === PRE_SEASON_CONFIG.currentSeasonId
    ) {
      return PRE_SEASON_CONFIG.previousSeasonId;
    }
    return seasonId;
  }, [seasonId]);

  const isFallback = effectiveSeasonId !== seasonId;
  const fallbackYear = isFallback
    ? SEASONS.find(s => s.id === effectiveSeasonId)?.year ?? null
    : null;

  const { data, loading, error } = useH2H({
    team1Id: homeTeam.id,
    team2Id: awayTeam.id,
    seasonId: effectiveSeasonId,
  });

  const homeColor = HOME_COLOR;
  const awayColor = AWAY_COLOR;

  if (loading) {
    return <H2HSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">!</div>
          <p className="text-gray-600 text-sm">
            {t('h2h.error', 'Ошибка загрузки данных')}
          </p>
          <p className="text-gray-400 text-xs mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="text-center text-gray-500 text-sm">
          {t('h2h.noData', 'Нет данных о предыдущих встречах')}
        </div>
      </div>
    );
  }

  const metrics = computeH2HMetrics(data);

  const Section = prefersReducedMotion ? 'div' : motion.div;
  const sectionProps = (i: number) =>
    prefersReducedMotion
      ? {}
      : { variants: sectionVariants, initial: 'hidden', whileInView: 'visible', viewport: { once: true }, custom: i };

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-8">
        {/* 1. Hero Section - Donut Chart (self-contained dark card) */}
        <Section {...sectionProps(0)}>
          <H2HDonutChart
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            overall={data.overall}
            homeColor={homeColor}
            awayColor={awayColor}
          />
        </Section>

        {/* 2. Fun Facts (self-contained Tier 2 card) */}
        <AnimatePresence>
          {data.fun_facts && (
            <Section {...sectionProps(1)}>
              <H2HFunFacts
                homeTeam={homeTeam}
                awayTeam={awayTeam}
                funFacts={data.fun_facts}
                homeColor={homeColor}
                awayColor={awayColor}
              />
            </Section>
          )}
        </AnimatePresence>

        {/* 3. Top Performers (self-contained Tier 2 card) */}
        <AnimatePresence>
          {data.top_performers && (
            <Section {...sectionProps(2)}>
              <H2HTopPerformers
                homeTeam={homeTeam}
                awayTeam={awayTeam}
                topPerformers={data.top_performers}
                homeColor={homeColor}
                awayColor={awayColor}
                fallbackYear={fallbackYear}
              />
            </Section>
          )}
        </AnimatePresence>

        {/* 4. Form Guide (self-contained Tier 2 card) */}
        <Section {...sectionProps(3)}>
          <H2HFormStreak
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            formGuide={data.form_guide}
            homeColor={homeColor}
            awayColor={awayColor}
            fallbackYear={fallbackYear}
          />
        </Section>

        {/* 5. Two Column Layout - Season Stats & Match Stats (Tier 3 embedded) */}
        <Section {...sectionProps(4)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FAFBFC] rounded-2xl border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 text-center">
                {t('h2h.seasonStats', 'Показатели сезона')}{fallbackYear && ` ${fallbackYear}`}
              </h3>
              <H2HSeasonStats
                homeTeam={homeTeam}
                awayTeam={awayTeam}
                seasonTable={data.season_table}
                metrics={metrics}
                homeColor={homeColor}
                awayColor={awayColor}
                enhancedStats={data.enhanced_season_stats}
              />
            </div>

            {data.match_stats ? (
              <div className="bg-[#FAFBFC] rounded-2xl border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 text-center">
                  {t('h2h.matchStats.title', 'Статистика H2H матчей')}
                </h3>
                <H2HMatchStats
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  matchStats={data.match_stats}
                  homeColor={homeColor}
                  awayColor={awayColor}
                />
              </div>
            ) : (
              <div className="bg-[#FAFBFC] rounded-2xl border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 text-center">
                  {t('h2h.previousMeetings', 'История встреч')}
                </h3>
                <H2HPreviousMeetings
                  meetings={data.previous_meetings}
                  homeTeamId={homeTeam.id}
                  awayTeamId={awayTeam.id}
                />
              </div>
            )}
          </div>
        </Section>

        {/* 6. Previous Meetings (full-width, when match_stats exists) */}
        <AnimatePresence>
          {data.match_stats && (
            <Section {...sectionProps(5)}>
              <div className="bg-[#FAFBFC] rounded-2xl border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 text-center">
                  {t('h2h.previousMeetings', 'История встреч')}
                </h3>
                <H2HPreviousMeetings
                  meetings={data.previous_meetings}
                  homeTeamId={homeTeam.id}
                  awayTeamId={awayTeam.id}
                />
              </div>
            </Section>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
