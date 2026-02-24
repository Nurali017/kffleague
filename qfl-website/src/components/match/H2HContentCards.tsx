'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, LazyMotion, domAnimation, useReducedMotion } from 'motion/react';
import { GameTeam } from '@/types';
import { useH2H } from '@/hooks';
import { HOME_COLOR, AWAY_COLOR } from '@/lib/utils/teamLogos';
import { PRE_SEASON_CONFIG } from '@/config/tournaments';
import {
  H2HOverallRecord,
  H2HFormGuide,
  H2HPreviousMeetings,
  H2HSeasonSoFar,
  H2HSkeleton,
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
            {t('h2h.error', 'Error loading data')}
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
          {t('h2h.noData', 'No previous meetings data')}
        </div>
      </div>
    );
  }

  const Section = prefersReducedMotion ? 'div' : motion.div;
  const sectionProps = (i: number) =>
    prefersReducedMotion
      ? {}
      : { variants: sectionVariants, initial: 'hidden', whileInView: 'visible', viewport: { once: true }, custom: i };

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-6">
        {/* 1. Overall Record */}
        <Section {...sectionProps(0)}>
          <H2HOverallRecord
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            overall={data.overall}
            homeColor={homeColor}
            awayColor={awayColor}
          />
        </Section>

        {/* 2. Form Guide */}
        <Section {...sectionProps(1)}>
          <H2HFormGuide
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            formGuide={data.form_guide}
            homeColor={homeColor}
            awayColor={awayColor}
          />
        </Section>

        {/* 3. Season So Far */}
        <Section {...sectionProps(2)}>
          <H2HSeasonSoFar
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            seasonTable={data.season_table}
            funFacts={data.fun_facts}
            enhancedStats={data.enhanced_season_stats}
            homeColor={homeColor}
            awayColor={awayColor}
          />
        </Section>

        {/* 4. Previous Meetings */}
        <Section {...sectionProps(3)}>
          <H2HPreviousMeetings
            meetings={data.previous_meetings}
            homeTeamId={homeTeam.id}
            awayTeamId={awayTeam.id}
            homeColor={homeColor}
            awayColor={awayColor}
          />
        </Section>
      </div>
    </LazyMotion>
  );
}
