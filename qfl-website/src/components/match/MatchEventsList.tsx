'use client';

import Link from 'next/link';
import { Circle } from 'lucide-react';
import { EnhancedMatchEvent, GameTeam } from '@/types';
import { GoalIcon, YellowCardIcon, RedCardIcon, SubstitutionIcon, PenaltyIcon } from './MatchEventIcons';
import { getTeamColor } from '@/lib/utils/teamLogos';

interface MatchEventsListProps {
  events: EnhancedMatchEvent[];
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  loading?: boolean;
}

export function MatchEventsList({ events, homeTeam, awayTeam, loading }: MatchEventsListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
        <div className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-3">
              <div className="h-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-8 text-center text-gray-500">
          Нет событий для отображения
        </div>
      </div>
    );
  }

  // Sort events by minute (latest first)
  const sortedEvents = [...events].sort((a, b) => b.minute - a.minute);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-md">
            <GoalIcon className="w-5 h-5 text-white" />
          </div>
        );
      case 'penalty':
        return (
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shadow-md">
            <PenaltyIcon className="w-5 h-5 text-white" />
          </div>
        );
      case 'yellow_card':
        return (
          <div className="w-8 h-8 flex items-center justify-center">
            <YellowCardIcon className="w-6 h-6 drop-shadow-md" />
          </div>
        );
      case 'red_card':
        return (
          <div className="w-8 h-8 flex items-center justify-center">
            <RedCardIcon className="w-6 h-6 drop-shadow-md" />
          </div>
        );
      case 'substitution':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
            <SubstitutionIcon className="w-5 h-5 text-white" />
          </div>
        );
      default:
        return <Circle className="w-6 h-6 fill-gray-400 text-gray-400" />;
    }
  };

  const getEventLabel = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return 'ГОЛ';
      case 'yellow_card':
        return 'Желтая карточка';
      case 'red_card':
        return 'Красная карточка';
      case 'substitution':
        return 'Замена';
      case 'penalty':
        return 'Пенальти';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Body - список событий */}
      <div className="divide-y divide-gray-200">
        {sortedEvents.map((event) => {
          const label = getEventLabel(event.event_type);

          return (
            <div
              key={event.id}
              className="px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              {/* Time Badge */}
              <div className="text-xs font-semibold text-gray-500 w-8 flex-shrink-0">
                {event.minute}&apos;
              </div>

              {/* Event Icon */}
              <div className="flex-shrink-0">
                {getEventIcon(event.event_type)}
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/player/${event.player_id}`}
                  className="block hover:text-primary transition-colors"
                >
                  <div className="text-[13px] font-semibold text-gray-800">
                    {event.player_name}
                  </div>
                </Link>

                {/* Additional info */}
                {event.event_type === 'substitution' && event.player2_name && (
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Вышел: {event.player2_name}
                  </div>
                )}

                {event.event_type === 'goal' && event.player2_name && (
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Ассист: {event.player2_name}
                  </div>
                )}

                {(event.event_type === 'penalty' || event.event_type === 'yellow_card' || event.event_type === 'red_card') && event.description && (
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {event.description}
                  </div>
                )}
              </div>

              {/* Team Color Indicator */}
              <div className="flex-shrink-0">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: event.team_id === homeTeam.id
                      ? getTeamColor(homeTeam.id) || '#1E4D8C'
                      : getTeamColor(awayTeam.id) || '#E5B73B'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
