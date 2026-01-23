'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Game } from '@/types';
import { getTeamLogo, getTeamColor } from '@/lib/utils/teamLogos';

interface MatchCardProps {
  match: Game;
  showTour?: boolean;
  className?: string;
}

export function MatchCard({ match, showTour = true, className = '' }: MatchCardProps) {
  const { t } = useTranslation('match');

  const homeLogoUrl = match.home_team.logo_url || getTeamLogo(match.home_team.id);
  const awayLogoUrl = match.away_team.logo_url || getTeamLogo(match.away_team.id);
  const homeColor = getTeamColor(match.home_team.id);
  const awayColor = getTeamColor(match.away_team.id);

  const isFinished = match.status === 'finished' && match.home_score !== null && match.away_score !== null;
  const isLive = match.is_live || match.status === 'live';
  const isUpcoming = match.status === 'upcoming';

  return (
    <motion.div
      className={`bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-slate-700 last:border-b-0 ${className}`}
      whileHover={{ backgroundColor: 'rgb(249 250 251)' }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/matches/${match.id}`} className="block">
        <div className="py-4 px-4 flex items-center gap-6">
          {/* Left: Tour & Date */}
          <div className="flex flex-col w-32 shrink-0">
            {showTour && match.tour && (
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                {t('tour')} {match.tour}
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              {match.date && match.time ? `${match.date}, ${match.time}` : match.date || match.time}
            </span>
          </div>

          {/* Center: Teams & Score */}
          <div className="flex items-center justify-center gap-6 flex-1 min-w-0">
            {/* Home Team */}
            <div className="flex items-center gap-3 justify-end flex-1 min-w-0">
              <span className="text-base font-medium text-gray-900 dark:text-slate-100 truncate text-right">
                {match.home_team.name}
              </span>
              {homeLogoUrl ? (
                <img
                  src={homeLogoUrl}
                  alt={match.home_team.name}
                  loading="lazy"
                  className="w-9 h-9 object-contain shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: homeColor }}
                >
                  {match.home_team.name[0]}
                </div>
              )}
            </div>

            {/* Score */}
            <div className="px-4 text-center shrink-0">
              {isFinished ? (
                <div className="text-xl font-bold text-gray-900 dark:text-slate-100">
                  {match.home_score} - {match.away_score}
                </div>
              ) : isLive ? (
                <div className="text-xl font-bold text-red-500">
                  {match.home_score ?? 0} - {match.away_score ?? 0}
                </div>
              ) : (
                <div className="text-base font-medium text-gray-400 dark:text-slate-500">
                  -
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {awayLogoUrl ? (
                <img
                  src={awayLogoUrl}
                  alt={match.away_team.name}
                  loading="lazy"
                  className="w-9 h-9 object-contain shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: awayColor }}
                >
                  {match.away_team.name[0]}
                </div>
              )}
              <span className="text-base font-medium text-gray-900 dark:text-slate-100 truncate">
                {match.away_team.name}
              </span>
            </div>
          </div>

          {/* Right: Stadium & Actions */}
          <div className="flex items-center gap-4 w-80 shrink-0 justify-end">
            {/* Stadium Info */}
            {match.stadium && (match.stadium.name || match.stadium.city) && (
              <div className="flex flex-col flex-1 min-w-0">
                {match.stadium.city && (
                  <span className="text-sm text-gray-900 dark:text-slate-100 truncate">
                    {match.stadium.city}
                  </span>
                )}
                {match.stadium.name && (
                  <span className="text-xs text-gray-500 dark:text-slate-400 truncate">
                    «{match.stadium.name}»
                  </span>
                )}
              </div>
            )}

            {/* Ticket Button or Live Badge */}
            {isLive ? (
              <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded whitespace-nowrap">
                {t('live')}
              </span>
            ) : match.ticket_url && isUpcoming ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.open(match.ticket_url!, '_blank');
                }}
                className="px-4 py-1.5 bg-transparent hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-sm font-medium rounded border border-gray-300 dark:border-slate-600 transition-colors whitespace-nowrap"
              >
                Купить билет
              </button>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
