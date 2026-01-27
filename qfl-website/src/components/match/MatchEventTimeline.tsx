'use client';

import { useState } from 'react';
import { EnhancedMatchEvent, GameTeam, PlayerCountry } from '@/types';
import { GoalIcon, YellowCardIcon, RedCardIcon, SubstitutionIcon, PenaltyIcon, JerseyIcon } from './MatchEventIcons';
import { getTeamLogo, getTeamColor, getTeamInitials } from '@/lib/utils/teamLogos';

interface MatchEventTimelineProps {
  events: EnhancedMatchEvent[];
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  currentMinute?: number;
  loading?: boolean;
  playerCountryMap?: Record<string, PlayerCountry>;
}

export function MatchEventTimeline({
  events,
  homeTeam,
  awayTeam,
  currentMinute = 90,
  loading,
  playerCountryMap = {},
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
    <div className="w-full mt-10 mb-8 select-none px-4 md:px-20 relative">

      <div className="flex items-center gap-2 md:gap-4 h-28 md:h-36">

        {/* KO Marker - Left (Static Flex Item) */}
        <div className="relative z-10 shrink-0">
          <TimelineEndpoint
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            label="KO"
            position="static"
          />
        </div>

        {/* Timeline Track & Events Area */}
        <div className="flex-1 relative h-full flex items-center">
          {/* Timeline Axis Track */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 bg-white/10 rounded-full w-full z-0 backdrop-blur-sm shadow-inner" />

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
                className={`absolute flex flex-col items-center group cursor-pointer ${isHovered ? 'z-40' : 'z-10'} ${verticalClass}`}
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
                    {event.minute}&apos;
                  </span>

                  {/* Icon Container */}
                  <EventMarker type={event.event_type} isHovered={isHovered} />

                </div>

                {/* Tooltip - always opens upward */}
                {isHovered && (
                  <div className="absolute left-1/2 -translate-x-1/2 min-w-[200px] bg-gray-900/95 border border-white/10 rounded-lg p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 bottom-full mb-2">
                    {/* Header with minute and event type */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white font-bold">{event.minute}&apos;</span>
                      <EventMarker type={event.event_type} isHovered={false} />
                      <span className="text-gray-400 uppercase text-xs">{getEventLabel(event.event_type)}</span>
                    </div>

                    {event.event_type === 'substitution' && event.player2_name ? (
                      /* Substitution - show two players */
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-green-500 text-xs font-bold">ON</span>
                          <span className="text-green-500">▲</span>
                          <JerseyIcon number={event.player2_number || 0} color={getTeamColor(event.team_id)} className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" />
                          {event.player2_id && playerCountryMap[event.player2_id]?.flag_url && (
                            <img
                              src={playerCountryMap[event.player2_id].flag_url}
                              alt={playerCountryMap[event.player2_id].code}
                              className="w-4 h-3 object-cover rounded-[1px]"
                            />
                          )}
                          <span className="text-white text-sm font-medium whitespace-nowrap">{event.player2_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-500 text-xs font-bold">OFF</span>
                          <span className="text-red-500">▼</span>
                          <JerseyIcon number={event.player_number || 0} color={getTeamColor(event.team_id)} className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" />
                          {event.player_id && playerCountryMap[event.player_id]?.flag_url && (
                            <img
                              src={playerCountryMap[event.player_id].flag_url}
                              alt={playerCountryMap[event.player_id].code}
                              className="w-4 h-3 object-cover rounded-[1px]"
                            />
                          )}
                          <span className="text-white text-sm whitespace-nowrap">{event.player_name}</span>
                        </div>
                      </div>
                    ) : (
                      /* Other events - single player */
                      <div className="flex items-center gap-3">
                        <JerseyIcon number={event.player_number || 0} color={getTeamColor(event.team_id)} className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0" />
                        {event.player_id && playerCountryMap[event.player_id]?.flag_url && (
                          <img
                            src={playerCountryMap[event.player_id].flag_url}
                            alt={playerCountryMap[event.player_id].code}
                            className="w-4 h-3 object-cover rounded-[1px]"
                          />
                        )}
                        <span className="text-white font-bold whitespace-nowrap">{event.player_name}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface TeamLogoMarkerProps {
  team: GameTeam;
  position: 'top' | 'bottom';
}

function TeamLogoMarker({ team, position }: TeamLogoMarkerProps) {
  const [imageError, setImageError] = useState(false);

  // Get logo URL with fallback chain
  const logoUrl = team.logo_url || getTeamLogo(team.id);
  const teamColor = getTeamColor(team.id);
  const teamInitials = getTeamInitials(team.name);

  // If no logo URL or image error, show colored circle with initials
  if (!logoUrl || imageError) {
    return (
      <div
        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold shadow-md"
        style={{ backgroundColor: teamColor }}
      >
        {teamInitials}
      </div>
    );
  }

  return (
    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
      <img
        src={logoUrl}
        alt={`${team.name} logo`}
        className="w-8 h-8 md:w-10 md:h-10 object-contain"
        onError={() => setImageError(true)}
      />
    </div>
  );
}

interface TimelineEndpointProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  label: string;
  position: 'left' | 'right' | 'static';
}

function TimelineEndpoint({ homeTeam, awayTeam, label, position }: TimelineEndpointProps) {
  const positionClass = position === 'static' ? '' : (position === 'left' ? 'absolute left-0 top-1/2 -translate-y-1/2' : 'absolute right-0 top-1/2 -translate-y-1/2');

  return (
    <div className={`${positionClass} z-10 flex flex-col items-center gap-1`}>
      {/* Home Team Logo (Top) */}
      <TeamLogoMarker team={homeTeam} position="top" />

      {/* Label */}
      <div className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-wider">
        {label}
      </div>

      {/* Away Team Logo (Bottom) */}
      <TeamLogoMarker team={awayTeam} position="bottom" />
    </div>
  );
}

function EventMarker({ type, isHovered }: { type: string; isHovered: boolean }) {
  switch (type) {
    case 'goal':
      return (
        <div className={`transition-transform ${isHovered ? 'scale-110' : ''}`}>
          <GoalIcon className="w-5 h-5 md:w-6 md:h-6" color="white" />
        </div>
      );
    case 'penalty':
      return (
        <div className={`transition-transform ${isHovered ? 'scale-110' : ''}`}>
          <GoalIcon className="w-5 h-5 md:w-6 md:h-6" color="#F97316" />
        </div>
      );
    case 'yellow_card':
      return (
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
        <div className={`flex flex-col items-center gap-0.5 transition-transform ${isHovered ? 'scale-110' : ''}`}>
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-green-500" />
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-500" />
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
