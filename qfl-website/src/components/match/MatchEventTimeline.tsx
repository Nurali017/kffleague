'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { EnhancedMatchEvent, GameTeam, PlayerCountry } from '@/types';
import { GoalIcon, YellowCardIcon, RedCardIcon, SubstitutionIcon, PenaltyIcon, JerseyIcon } from './MatchEventIcons';
import { getTeamLogo, getTeamColor, getTeamInitials } from '@/lib/utils/teamLogos';
import { bottomSheetSlideUp, modalBackdrop } from '@/lib/motion';

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
  const [activeEventId, setActiveEventId] = useState<number | null>(null);

  const timelineEvents = useMemo(() => {
    return events
      .filter((e) =>
        ['goal', 'yellow_card', 'red_card', 'substitution', 'penalty'].includes(e.event_type) && e.minute <= 130
      )
      .slice()
      .sort((a, b) => (a.minute - b.minute) || (a.team_id - b.team_id) || (a.id - b.id));
  }, [events]);

  const maxEventMinute = useMemo(() => {
    if (timelineEvents.length === 0) return 0;
    return timelineEvents.reduce((acc, e) => Math.max(acc, e.minute), 0);
  }, [timelineEvents]);

  const maxTime = Math.max(95, currentMinute, maxEventMinute);

  // Close on escape + lock body scroll while the mobile sheet is open
  useEffect(() => {
    if (activeEventId === null) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveEventId(null);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeEventId]);

  const activeEvent = useMemo(() => {
    if (activeEventId === null) return null;
    return timelineEvents.find((e) => e.id === activeEventId) || null;
  }, [activeEventId, timelineEvents]);

  if (loading) {
    return (
      <div className="w-full mt-6 md:mt-8 opacity-50 px-4 md:px-20">
        <div className="h-1 bg-white/20 w-full rounded" />
      </div>
    );
  }

  return (
    <div className="w-full mt-8 md:mt-10 mb-6 md:mb-8 select-none px-4 md:px-20 relative">

      {/* Mobile Timeline (touch) */}
      <div className="md:hidden" data-testid="match-timeline-mobile">
        <MobileTimeline
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          events={timelineEvents}
          maxTime={maxTime}
          activeEventId={activeEventId}
          onEventToggle={(id) => setActiveEventId((prev) => (prev === id ? null : id))}
        />

        <AnimatePresence>
          {activeEvent && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 z-[60]"
                variants={modalBackdrop}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setActiveEventId(null)}
                aria-hidden="true"
                data-testid="timeline-event-backdrop"
              />

              <motion.div
                className="
                  fixed inset-x-0 bottom-0 z-[70]
                  rounded-t-2xl border border-white/10 bg-gray-950/95 shadow-2xl
                  max-h-[80vh] overflow-hidden
                "
                variants={bottomSheetSlideUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                role="dialog"
                aria-modal="true"
                aria-label="Детали события"
              >
                <div className="px-4 pt-3 pb-2 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-white font-extrabold shrink-0">{activeEvent.minute}&apos;</span>
                    <EventMarker type={activeEvent.event_type} isHovered={false} />
                    <span className="text-gray-300 uppercase text-xs font-semibold truncate">
                      {getEventLabel(activeEvent.event_type)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveEventId(null)}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                    aria-label="Закрыть"
                  >
                    <X className="w-5 h-5 text-white/80" />
                  </button>
                </div>

                <div className="px-4 py-4 overflow-y-auto">
                  {activeEvent.event_type === 'substitution' && activeEvent.player2_name ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 text-xs font-extrabold">ON</span>
                        <span className="text-green-400">▲</span>
                        <JerseyIcon
                          number={activeEvent.player2_number || 0}
                          color={getTeamColor(activeEvent.team_id)}
                          className="w-10 h-10 flex-shrink-0"
                        />
                        {activeEvent.player2_id && playerCountryMap[activeEvent.player2_id]?.flag_url && (
                          <img
                            src={playerCountryMap[activeEvent.player2_id].flag_url}
                            alt={playerCountryMap[activeEvent.player2_id].code}
                            className="w-5 h-4 object-cover rounded-[1px]"
                          />
                        )}
                        <span className="text-white text-base font-bold whitespace-nowrap truncate">
                          {activeEvent.player2_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 text-xs font-extrabold">OFF</span>
                        <span className="text-red-400">▼</span>
                        <JerseyIcon
                          number={activeEvent.player_number || 0}
                          color={getTeamColor(activeEvent.team_id)}
                          className="w-10 h-10 flex-shrink-0"
                        />
                        {activeEvent.player_id && playerCountryMap[activeEvent.player_id]?.flag_url && (
                          <img
                            src={playerCountryMap[activeEvent.player_id].flag_url}
                            alt={playerCountryMap[activeEvent.player_id].code}
                            className="w-5 h-4 object-cover rounded-[1px]"
                          />
                        )}
                        <span className="text-white text-base font-bold whitespace-nowrap truncate">
                          {activeEvent.player_name}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <JerseyIcon
                        number={activeEvent.player_number || 0}
                        color={getTeamColor(activeEvent.team_id)}
                        className="w-12 h-12 flex-shrink-0"
                      />
                      {activeEvent.player_id && playerCountryMap[activeEvent.player_id]?.flag_url && (
                        <img
                          src={playerCountryMap[activeEvent.player_id].flag_url}
                          alt={playerCountryMap[activeEvent.player_id].code}
                          className="w-5 h-4 object-cover rounded-[1px]"
                        />
                      )}
                      <span className="text-white text-lg font-extrabold whitespace-nowrap truncate">
                        {activeEvent.player_name}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Timeline (hover tooltip) */}
      <div className="hidden md:block" data-testid="match-timeline-desktop">
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
                  <div className="absolute left-1/2 -translate-x-1/2 min-w-[160px] max-w-[85vw] bg-gray-900/95 border border-white/10 rounded-lg p-3 md:p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 bottom-full mb-2">
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
    </div>
  );
}

interface MobileTimelineProps {
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  events: EnhancedMatchEvent[];
  maxTime: number;
  activeEventId: number | null;
  onEventToggle: (id: number) => void;
}

function MobileTimeline({ homeTeam, awayTeam, events, maxTime, activeEventId, onEventToggle }: MobileTimelineProps) {
  const PX_PER_MIN = 8;
  const TRACK_PAD_LEFT = 16;
  const TRACK_PAD_RIGHT = 24;
  const trackWidthPx = maxTime * PX_PER_MIN + TRACK_PAD_LEFT + TRACK_PAD_RIGHT;

  // Anti-collision: group by team side + minute and offset the 2nd/3rd icon in the same minute
  const groupCounts = new Map<string, number>();

  return (
    <div className="flex items-center gap-2 h-28">
      <div className="relative z-10 shrink-0">
        <TimelineEndpoint homeTeam={homeTeam} awayTeam={awayTeam} label="KO" position="static" />
      </div>

      <div className="flex-1 overflow-x-auto no-scrollbar h-full">
        <div className="relative h-full min-w-max" style={{ width: trackWidthPx }}>
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-white/10 rounded-full backdrop-blur-sm shadow-inner"
            style={{ left: TRACK_PAD_LEFT, right: TRACK_PAD_RIGHT }}
          />

          {events.map((event) => {
            const isHome = event.team_id === homeTeam.id;
            const side = isHome ? 'home' : 'away';
            const groupKey = `${side}:${event.minute}`;
            const idx = groupCounts.get(groupKey) || 0;
            groupCounts.set(groupKey, idx + 1);

            const clusterOffset = idx * 12;
            const leftPx = TRACK_PAD_LEFT + event.minute * PX_PER_MIN + clusterOffset;

            const isActive = activeEventId === event.id;
            const verticalClass = isHome ? 'bottom-[50%] pb-4' : 'top-[50%] pt-4';
            const connectorClass = isHome ? 'bottom-0 h-4' : 'top-0 h-4';

            return (
              <div
                key={event.id}
                className={`absolute flex flex-col items-center ${isActive ? 'z-40' : 'z-10'} ${verticalClass}`}
                style={{ left: leftPx, transform: 'translateX(-50%)' }}
              >
                <div className={`absolute left-1/2 -translate-x-[0.5px] w-[1px] bg-white/30 ${connectorClass}`} />

                <button
                  type="button"
                  onClick={() => onEventToggle(event.id)}
                  className={`
                    flex flex-col items-center gap-1
                    rounded-lg px-2 py-1.5
                    transition-transform duration-200
                    ${isActive ? 'scale-110 bg-white/10' : 'active:scale-95'}
                  `}
                  aria-label={`Открыть событие ${event.minute}'`}
                  data-testid={`timeline-event-${event.id}`}
                >
                  <EventMarker type={event.event_type} isHovered={isActive} />
                  <span className="text-[10px] font-bold text-white/70 font-mono tracking-tighter">
                    {event.minute}&apos;
                  </span>
                </button>
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
