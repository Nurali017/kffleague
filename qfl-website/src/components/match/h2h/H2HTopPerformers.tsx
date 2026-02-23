'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { GameTeam } from '@/types';
import { H2HTopPerformers as H2HTopPerformersType } from '@/types/h2h';

interface H2HTopPerformersProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  topPerformers: H2HTopPerformersType;
  homeColor: string;
  awayColor: string;
  fallbackYear?: string | null;
}

function PlayerInitials({ name, teamColor }: { name: string; teamColor: string }) {
  const parts = name.split(' ');
  const initials = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : name.slice(0, 2);
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${teamColor}15` }}
    >
      <span className="text-[10px] font-bold uppercase" style={{ color: teamColor }}>
        {initials}
      </span>
    </div>
  );
}

function PerformerRow({
  name,
  photoUrl,
  teamId,
  count,
  homeTeamId,
  homeColor,
  awayColor,
  rank,
  index,
  animated,
}: {
  name: string;
  photoUrl: string | null;
  teamId: number;
  count: number;
  homeTeamId: number;
  homeColor: string;
  awayColor: string;
  rank: number;
  index: number;
  animated: boolean;
}) {
  const isHomeTeam = teamId === homeTeamId;
  const teamColor = isHomeTeam ? homeColor : awayColor;
  const isFirst = rank === 1;

  const content = (
    <div className={`flex items-center gap-3 py-1.5 px-2 rounded-lg ${isFirst ? 'bg-accent/5' : ''}`}>
      <span className="text-xs text-gray-400 w-4 text-right font-medium">
        {rank}
      </span>
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={name}
          width={isFirst ? 40 : 32}
          height={isFirst ? 40 : 32}
          className={`${isFirst ? 'w-10 h-10' : 'w-8 h-8'} rounded-full object-cover flex-shrink-0`}
        />
      ) : (
        <PlayerInitials name={name} teamColor={teamColor} />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: teamColor }}
          />
          <span className="text-xs font-medium text-gray-900 truncate">
            {name}
          </span>
        </div>
      </div>
      <span className="text-sm font-black text-gray-900 ml-auto">
        {count}
      </span>
    </div>
  );

  if (!animated) return content;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
    >
      {content}
    </motion.div>
  );
}

export function H2HTopPerformers({
  homeTeam,
  awayTeam,
  topPerformers,
  homeColor,
  awayColor,
  fallbackYear,
}: H2HTopPerformersProps) {
  const { t } = useTranslation('match');
  const prefersReducedMotion = useReducedMotion();
  const { top_scorers, top_assisters } = topPerformers;

  if (top_scorers.length === 0 && top_assisters.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-md border-l-4 border-l-primary overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="text-center">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            {t('h2h.topPerformers.title', 'Лидеры сезона')}{fallbackYear && ` ${fallbackYear}`}
          </h3>
          <div className="w-12 h-0.5 bg-accent mx-auto mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Top Scorers */}
          {top_scorers.length > 0 && (
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-medium mb-2 text-center">
                {t('h2h.topPerformers.topScorers', 'Бомбардиры')}
              </div>
              <div className="bg-gray-50 rounded-xl px-2 py-2 divide-y divide-gray-100">
                {top_scorers.map((scorer, i) => (
                  <PerformerRow
                    key={scorer.player_id}
                    name={scorer.player_name}
                    photoUrl={scorer.photo_url}
                    teamId={scorer.team_id}
                    count={scorer.count}
                    homeTeamId={homeTeam.id}
                    homeColor={homeColor}
                    awayColor={awayColor}
                    rank={i + 1}
                    index={i}
                    animated={!prefersReducedMotion}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Top Assisters */}
          {top_assisters.length > 0 && (
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-medium mb-2 text-center">
                {t('h2h.topPerformers.topAssisters', 'Ассистенты')}
              </div>
              <div className="bg-gray-50 rounded-xl px-2 py-2 divide-y divide-gray-100">
                {top_assisters.map((assister, i) => (
                  <PerformerRow
                    key={assister.player_id}
                    name={assister.player_name}
                    photoUrl={assister.photo_url}
                    teamId={assister.team_id}
                    count={assister.count}
                    homeTeamId={homeTeam.id}
                    homeColor={homeColor}
                    awayColor={awayColor}
                    rank={i + 1}
                    index={i}
                    animated={!prefersReducedMotion}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
