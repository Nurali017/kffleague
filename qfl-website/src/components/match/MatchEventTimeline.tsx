'use client';

import { useState } from 'react';
import { EnhancedMatchEvent, GameTeam } from '@/types';
import { GoalIcon, YellowCardIcon, RedCardIcon, SubstitutionIcon, PenaltyIcon } from './MatchEventIcons';

interface MatchEventTimelineProps {
  events: EnhancedMatchEvent[];
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  currentMinute?: number;
  loading?: boolean;
}

export function MatchEventTimeline({
  events,
  homeTeam,
  awayTeam,
  currentMinute = 90,
  loading,
}: MatchEventTimelineProps) {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="w-full mt-8 opacity-50 px-4 md:px-20">
        <div className="h-1 bg-white/20 w-full rounded" />
      </div>
    );
  }

  // Filter relevant events
  const timelineEvents = events.filter(e =>
    ['goal', 'yellow_card', 'red_card', 'substitution', 'penalty'].includes(e.event_type) && e.minute <= 130
  );

  return (
    <div className="w-full mt-10 mb-8 select-none px-4 md:px-12 relative">

      {/* Team Names Header */}
      <div className="flex justify-between items-center mb-10 px-2">
        <h3 className="text-white/90 font-bold uppercase tracking-widest text-lg md:text-xl drop-shadow-md">
          {homeTeam.name}
        </h3>
        {/* Optional: Center Timer or Status can go here if distinct from header */}
        <div className="text-green-500 font-bold text-lg animate-pulse hidden md:block">
          {currentMinute}'
        </div>
        <h3 className="text-white/90 font-bold uppercase tracking-widest text-lg md:text-xl drop-shadow-md text-right">
          {awayTeam.name}
        </h3>
      </div>

      <div className="relative h-24 md:h-32 flex items-center">

        {/* Timeline Axis Track */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 bg-white/10 rounded-full w-full z-0 backdrop-blur-sm shadow-inner" />

        {/* Fill based on current minute (Optional, if we want progress bar style) */}
        {/* <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-white/30 rounded-full z-0" style={{ width: `${(Math.min(currentMinute,90)/90)*100}%` }} /> */}

        {/* Events */}
        {timelineEvents.map((event) => {
          // Scale
          const maxTime = Math.max(95, currentMinute);
          const position = Math.min((event.minute / maxTime) * 100, 100);

          const isHome = event.team_id === homeTeam.id; // Home Top
          const isHovered = hoveredEvent === event.id;

          // Vertical Direction
          const verticalClass = isHome ? 'bottom-[50%] pb-4' : 'top-[50%] pt-4';
          const connectorClass = isHome ? 'bottom-0 h-4' : 'top-0 h-4';
          const labelSort = isHome ? 'flex-col-reverse' : 'flex-col';

          return (
            <div
              key={event.id}
              className={`absolute flex flex-col items-center group cursor-pointer z-10 ${verticalClass}`}
              style={{ left: `${position}%` }}
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
            >
              {/* Connector Line */}
              <div className={`absolute left-1/2 -translate-x-[0.5px] w-[1px] bg-white/30 group-hover:bg-white/60 transition-colors ${connectorClass}`} />

              {/* Event Wrapper */}
              <div className={`relative flex items-center ${labelSort} gap-1 transition-transform duration-300 ${isHovered ? 'scale-110 z-20' : 'z-10'}`}>

                {/* Minute Label */}
                <span className="text-[10px] font-bold text-white/70 font-mono tracking-tighter">
                  {event.minute}'
                </span>

                {/* Icon Container */}
                <EventMarker type={event.event_type} isHovered={isHovered} />

              </div>

              {/* Tooltip */}
              {isHovered && (
                <div className={`absolute left-1/2 -translate-x-1/2 w-48 bg-gray-900 border border-white/10 rounded-lg p-3 shadow-2xl z-50 text-center animate-in fade-in zoom-in-95 duration-150 ${isHome ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
                  <div className="text-xs font-bold text-gray-400 uppercase mb-1">{getEventLabel(event.event_type)}</div>
                  <div className="text-sm font-bold text-white leading-tight">
                    {event.player_name}
                  </div>
                  {event.event_type === 'substitution' && event.player2_name && (
                    <div className="text-xs text-gray-400 mt-1">
                      <span className="text-green-500">In:</span> {event.player_name}<br />
                      <span className="text-red-500">Out:</span> {event.player2_name}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventMarker({ type, isHovered }: { type: string; isHovered: boolean }) {
  // Styling based on image:
  // Goal: Green Circle
  // Yellow Card: Yellow Rect (or Icon)
  // Sub: Blue Circle

  const baseClass = "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-lg border border-white/10 transition-all";

  switch (type) {
    case 'goal':
    case 'penalty':
      return (
        <div className={`${baseClass} bg-[#22C55E] ${isHovered ? 'ring-2 ring-white' : ''}`}>
          <GoalIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
        </div>
      );
    case 'yellow_card':
      return (
        // Just the card rectangle itself, floating? Or in a circle? 
        // Image shows just the yellow rect for card.
        <div className={`transition-transform ${isHovered ? 'scale-110' : ''}`}>
          <YellowCardIcon className="w-4 h-5 md:w-5 md:h-6 shadow-md" />
        </div>
      );
    case 'red_card':
      return (
        <div className={`transition-transform ${isHovered ? 'scale-110' : ''}`}>
          <RedCardIcon className="w-4 h-5 md:w-5 md:h-6 shadow-md" />
        </div>
      );
    case 'substitution':
      return (
        <div className={`${baseClass} bg-[#3B82F6] ${isHovered ? 'ring-2 ring-white' : ''}`}>
          <SubstitutionIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
        </div>
      );
    default:
      return <div className="w-2 h-2 bg-white rounded-full" />;
  }
}

function getEventLabel(type: string) {
  switch (type) {
    case 'goal': return 'Goal';
    case 'penalty': return 'Penalty';
    case 'yellow_card': return 'Yellow Card';
    case 'red_card': return 'Red Card';
    case 'substitution': return 'Substitution';
    default: return 'Event';
  }
}
