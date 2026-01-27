'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
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

  const getResultStyle = (meeting: PreviousMeeting) => {
    const { home_score, away_score, home_team_id } = meeting;
    if (home_score === null || away_score === null) return 'bg-gray-100';

    const isHomeTeamPerspective = home_team_id === homeTeamId;

    if (home_score > away_score) {
      return isHomeTeamPerspective
        ? 'bg-green-50 border-green-200'
        : 'bg-red-50 border-red-200';
    } else if (home_score < away_score) {
      return isHomeTeamPerspective
        ? 'bg-red-50 border-red-200'
        : 'bg-green-50 border-green-200';
    }
    return 'bg-yellow-50 border-yellow-200';
  };

  const handleMatchClick = (gameId: string) => {
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
    <div className="space-y-3">
      {displayedMeetings.map((meeting, index) => (
        <div
          key={meeting.game_id}
          onClick={() => handleMatchClick(meeting.game_id)}
          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md ${getResultStyle(meeting)}`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium uppercase">
              <span>{formatDate(meeting.date)}</span>
              {meeting.season_name && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="truncate">{meeting.season_name}</span>
                </>
              )}
              {meeting.tour && (
                <>
                  <span className="text-gray-300">•</span>
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
            <div className="px-3 py-1.5 bg-white rounded-lg border border-gray-200 font-bold text-gray-900 shadow-sm min-w-[60px] text-center">
              {meeting.home_score !== null && meeting.away_score !== null
                ? `${meeting.home_score}:${meeting.away_score}`
                : '-:-'}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      ))}

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide transition-colors rounded-lg hover:bg-blue-50"
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
