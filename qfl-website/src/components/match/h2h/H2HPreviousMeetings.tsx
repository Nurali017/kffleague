'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { PreviousMeeting } from '@/types/h2h';

interface H2HPreviousMeetingsProps {
  meetings: PreviousMeeting[];
  homeTeamId: number;
  awayTeamId: number;
  initialCount?: number;
}

export function H2HPreviousMeetings({
  meetings,
  homeTeamId,
  awayTeamId,
  initialCount = 3,
}: H2HPreviousMeetingsProps) {
  const { t } = useTranslation('match');
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [showAll, setShowAll] = useState(false);

  const displayedMeetings = showAll ? meetings : meetings.slice(0, initialCount);
  const hasMore = meetings.length > initialCount;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getResultBorder = (meeting: PreviousMeeting) => {
    const { home_score, away_score, home_team_id } = meeting;
    if (home_score === null || away_score === null) return 'border-l-gray-300';

    const isHomeTeamPerspective = home_team_id === homeTeamId;

    if (home_score > away_score) {
      return isHomeTeamPerspective ? 'border-l-green-500' : 'border-l-red-500';
    } else if (home_score < away_score) {
      return isHomeTeamPerspective ? 'border-l-red-500' : 'border-l-green-500';
    }
    return 'border-l-amber-400';
  };

  const handleMatchClick = (gameId: number) => {
    router.push(`/matches/${gameId}`);
  };

  if (meetings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        {t('h2h.noData', 'Нет данных о предыдущих встречах')}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {displayedMeetings.map((meeting, index) => {
          const row = (
            <div
              onClick={() => handleMatchClick(meeting.game_id)}
              className={`flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 border-l-4 ${getResultBorder(meeting)} cursor-pointer transition-shadow hover:shadow-md`}
            >
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium uppercase">
                  <span>{formatDate(meeting.date)}</span>
                  {meeting.season_name && (
                    <span className="inline-flex items-center px-1.5 py-0.5 bg-primary/10 text-primary rounded-full text-[9px] font-semibold">
                      {meeting.season_name}
                    </span>
                  )}
                  {meeting.tour && (
                    <>
                      <span className="text-gray-300">·</span>
                      <span>{t('h2h.tour', 'Тур')} {meeting.tour}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span
                    className={
                      meeting.home_team_id === homeTeamId
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }
                  >
                    {meeting.home_team_name}
                  </span>
                  <span className="text-gray-300">-</span>
                  <span
                    className={
                      meeting.away_team_id === awayTeamId ||
                      meeting.away_team_id === homeTeamId
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }
                  >
                    {meeting.away_team_name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-gray-900 text-white font-mono font-bold rounded-lg min-w-[60px] text-center text-sm">
                  {meeting.home_score !== null && meeting.away_score !== null
                    ? `${meeting.home_score}:${meeting.away_score}`
                    : '-:-'}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          );

          if (prefersReducedMotion) {
            return <div key={meeting.game_id}>{row}</div>;
          }

          return (
            <motion.div
              key={meeting.game_id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              {row}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-primary hover:text-primary-dark uppercase tracking-wide transition-colors rounded-lg hover:bg-primary/5"
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
