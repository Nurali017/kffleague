'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { Game } from '@/types';
import { getTeamLogo, HOME_COLOR, AWAY_COLOR } from '@/lib/utils/teamLogos';

interface MatchCardProps {
  match: Game;
  showTour?: boolean;
  className?: string;
}

export function MatchCard({ match, showTour = true, className = '' }: MatchCardProps) {
  const { t } = useTranslation('match');

  const homeLogoUrl = match.home_team.logo_url || getTeamLogo(match.home_team.id);
  const awayLogoUrl = match.away_team.logo_url || getTeamLogo(match.away_team.id);
  const homeColor = HOME_COLOR;
  const awayColor = AWAY_COLOR;

  const isFinished = match.status === 'finished' && match.home_score !== null && match.away_score !== null;
  const isLive = match.is_live || match.status === 'live';
  const isUpcoming = match.status === 'upcoming';

  return (
    <motion.div
      className={`bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border last:border-b-0 hover:bg-gray-50 dark:hover:bg-dark-surface-soft transition-colors ${className}`}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/matches/${match.id}`} className="block">
        <div className="px-3 py-3 md:px-4 md:py-4">
          {/* Mobile layout */}
          <div className="md:hidden space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                {showTour && match.tour && (
                  <span className="text-xs font-semibold text-gray-900 dark:text-slate-100">
                    {t('tour')} {match.tour}
                  </span>
                )}
                <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
                  {match.date && match.time ? `${match.date}, ${match.time}` : match.date || match.time}
                </p>
              </div>
              {isLive ? (
                <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded whitespace-nowrap">
                  {t('live')}
                </span>
              ) : null}
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="flex items-center gap-2 min-w-0 justify-end">
                <span className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate text-right">
                  {match.home_team.name}
                </span>
                {homeLogoUrl ? (
                  <img
                    src={homeLogoUrl}
                    alt={match.home_team.name}
                    loading="lazy"
                    className="w-8 h-8 object-contain shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: homeColor }}
                  >
                    {match.home_team.name[0]}
                  </div>
                )}
              </div>

              <div className="px-1 text-center shrink-0">
                {isFinished ? (
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-lg font-bold text-gray-900 dark:text-slate-100 whitespace-nowrap">
                      {match.home_score} - {match.away_score}
                    </div>
                    {match.is_technical && (
                      <span className="text-[10px] text-orange-500 font-medium">Т</span>
                    )}
                  </div>
                ) : isLive ? (
                  <div className="text-lg font-bold text-red-500 whitespace-nowrap">
                    {match.home_score ?? 0} - {match.away_score ?? 0}
                  </div>
                ) : (
                  <div className="text-base font-semibold text-gray-400 dark:text-slate-500 whitespace-nowrap">
                    -
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 min-w-0">
                {awayLogoUrl ? (
                  <img
                    src={awayLogoUrl}
                    alt={match.away_team.name}
                    loading="lazy"
                    className="w-8 h-8 object-contain shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: awayColor }}
                  >
                    {match.away_team.name[0]}
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                  {match.away_team.name}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              {match.stadium && (match.stadium.name || match.stadium.city) ? (
                <div className="min-w-0">
                  {match.stadium.city ? (
                    <p className="text-xs text-gray-900 dark:text-slate-100 truncate">
                      {match.stadium.city}
                    </p>
                  ) : null}
                  {match.stadium.name ? (
                    <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                      «{match.stadium.name}»
                    </p>
                  ) : null}
                </div>
              ) : <div />}

              {match.ticket_url && isUpcoming ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(match.ticket_url!, '_blank');
                  }}
                  className="px-3 py-1.5 bg-transparent hover:bg-gray-100 dark:hover:bg-dark-surface-soft text-gray-700 dark:text-slate-300 text-xs font-medium rounded border border-gray-300 dark:border-dark-border-soft transition-colors whitespace-nowrap"
                >
                  Купить билет
                </button>
              ) : null}
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* Left: Tour & Date */}
            <div className="flex flex-col w-32 lg:w-36 shrink-0">
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
            <div className="flex items-center justify-center gap-4 lg:gap-6 flex-1 min-w-0">
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

              <div className="px-2 lg:px-4 text-center shrink-0">
                {isFinished ? (
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-xl font-bold text-gray-900 dark:text-slate-100 whitespace-nowrap">
                      {match.home_score} - {match.away_score}
                    </div>
                    {match.is_technical && (
                      <span className="text-[10px] text-orange-500 font-medium">Т</span>
                    )}
                  </div>
                ) : isLive ? (
                  <div className="text-xl font-bold text-red-500 whitespace-nowrap">
                    {match.home_score ?? 0} - {match.away_score ?? 0}
                  </div>
                ) : (
                  <div className="text-base font-medium text-gray-400 dark:text-slate-500 whitespace-nowrap">
                    -
                  </div>
                )}
              </div>

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
            <div className="flex items-center gap-3 lg:gap-4 w-56 lg:w-80 shrink-0 justify-end">
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
                  className="px-4 py-1.5 bg-transparent hover:bg-gray-100 dark:hover:bg-dark-surface-soft text-gray-700 dark:text-slate-300 text-sm font-medium rounded border border-gray-300 dark:border-dark-border-soft transition-colors whitespace-nowrap"
                >
                  Купить билет
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
