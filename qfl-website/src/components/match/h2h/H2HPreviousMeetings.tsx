'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { PreviousMeeting } from '@/types/h2h';
import { getMatchHref } from '@/lib/utils/entityRoutes';
import { TournamentAwareLink } from '@/components/navigation/TournamentAwareLink';
import { formatShortDate } from '@/lib/utils/dateFormat';

interface H2HPreviousMeetingsProps {
  meetings: PreviousMeeting[];
  homeTeamId: number;
  awayTeamId: number;
  homeColor: string;
  awayColor: string;
  initialCount?: number;
}

export function H2HPreviousMeetings({
  meetings,
  homeTeamId,
  awayTeamId,
  homeColor,
  awayColor,
  initialCount = 5,
}: H2HPreviousMeetingsProps) {
  const { t, i18n } = useTranslation('match');
  const prefersReducedMotion = useReducedMotion();
  const [showAll, setShowAll] = useState(false);

  const displayedMeetings = showAll ? meetings : meetings.slice(0, initialCount);
  const hasMore = meetings.length > initialCount;

  if (meetings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        {t('h2h.noData', 'Нет данных о предыдущих встречах')}
      </div>
    );
  }

  return (
    <div className="bg-[#F5F7F9] dark:bg-gray-800 rounded-2xl p-5 sm:p-6">
      {/* Header */}
      <h3 className="text-base font-extrabold uppercase tracking-wide text-gray-900 dark:text-white text-center mb-5">
        {t('h2h.previousMeetings', 'ИСТОРИЯ ВСТРЕЧ')}
      </h3>

      {/* Meeting rows */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displayedMeetings.map((meeting, index) => {
            const matchHref = getMatchHref(meeting.game_id);
            const homeLogo = meeting.home_team_logo;
            const awayLogo = meeting.away_team_logo;

            const matchRow = (
              <div className="space-y-1">
                {/* Date + Season */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-gray-400 font-medium">
                    {formatShortDate(meeting.date, i18n.language)}
                  </span>
                  {meeting.season_name && (
                    <span className="inline-flex items-center px-1.5 py-0.5 bg-primary/10 text-primary rounded-full text-[9px] font-semibold">
                      {meeting.season_name}
                    </span>
                  )}
                </div>

                {/* Match row content */}
                <MeetingRowContent
                  meeting={meeting}
                  matchHref={matchHref}
                  homeLogo={homeLogo}
                  awayLogo={awayLogo}
                  homeColor={homeColor}
                  awayColor={awayColor}
                />
              </div>
            );

            if (prefersReducedMotion) {
              return <div key={meeting.game_id}>{matchRow}</div>;
            }

            return (
              <motion.div
                key={meeting.game_id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                {matchRow}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Show All / Show Less */}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark uppercase tracking-wide transition-colors"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              {t('h2h.showLess', 'Свернуть')}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {t('h2h.showAll', 'Показать все')} ({meetings.length})
            </>
          )}
        </button>
      )}
    </div>
  );
}

function MeetingRowContent({
  meeting,
  matchHref,
  homeLogo,
  awayLogo,
  homeColor,
  awayColor,
}: {
  meeting: PreviousMeeting;
  matchHref: string | null;
  homeLogo: string | null;
  awayLogo: string | null;
  homeColor: string;
  awayColor: string;
}) {
  const inner = (
    <div className="flex items-center justify-center gap-2 sm:gap-3 py-2 px-3 rounded-xl bg-white dark:bg-gray-700 hover:shadow-md transition-shadow">
      <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 text-right flex-1 truncate">
        {meeting.home_team_name}
      </span>
      <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
        {homeLogo ? (
          <img src={homeLogo} alt={meeting.home_team_name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = '/images/placeholders/team.svg'; }} />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600" />
        )}
      </div>
      <div
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-md flex items-center justify-center text-white text-base font-black flex-shrink-0"
        style={{ backgroundColor: homeColor }}
      >
        {meeting.home_score ?? '-'}
      </div>
      <div
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-md flex items-center justify-center text-white text-base font-black flex-shrink-0"
        style={{ backgroundColor: awayColor }}
      >
        {meeting.away_score ?? '-'}
      </div>
      <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
        {awayLogo ? (
          <img src={awayLogo} alt={meeting.away_team_name} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = '/images/placeholders/team.svg'; }} />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600" />
        )}
      </div>
      <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 text-left flex-1 truncate">
        {meeting.away_team_name}
      </span>
    </div>
  );

  if (matchHref) {
    return (
      <TournamentAwareLink href={matchHref} className="block cursor-pointer">
        {inner}
      </TournamentAwareLink>
    );
  }

  return inner;
}
