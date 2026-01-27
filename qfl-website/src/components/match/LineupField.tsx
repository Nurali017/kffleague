'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { MatchLineups, GameTeam, LineupPlayerExtended } from '@/types';
import { getFormationPositions } from '@/lib/utils/formations';
import { getTeamColor, getTeamLogo } from '@/lib/utils/teamLogos';

// Jersey Icon Component (UEFA Style)
function JerseyIcon({ color, number, isGoalkeeper = false }: { color: string; number: number; isGoalkeeper?: boolean }) {
  // Use a different color for GK if needed, or just secondary
  // For now we use the main color prop

  return (
    <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-transform hover:scale-110 group-hover:scale-110">
      {/* Shadow */}
      <div className="absolute top-1 left-0 w-full h-full bg-black/40 blur-[2px] rounded-full opacity-50" />

      {/* Jersey SVG */}
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full drop-shadow-md z-10">
        <path
          fill={color}
          d="M107.327 21.364c-5.413-4.466-26.674-9.136-27.576-9.333a1.304 1.304 0 0 0-1.101.256c-16.692 13.303-29.519.649-30.057.105a1.322 1.322 0 0 0-1.428-.295 1.301 1.301 0 0 0-.657.582c-1.217.777-7.31 2.45-11.802 3.683-10.71 2.942-13.946 3.998-14.754 5.33C18.5 24.09 8 56.523 8 58.613c0 1.04.97 1.624 1.297 1.822l.005.003c2.182 1.303 8.025 2.748 13.997 2.746 3.27 0 6.546-.476 9.312-1.602l-1.95 46.035c-.017.494.25.954.69 1.187.204.108 13.879 7.197 32.955 7.197 9.594 0 20.556-1.794 31.855-7.172.465-.221.755-.693.741-1.203l-1.625-46.034c9.061 2.65 23.322-3.26 23.926-3.515a1.29 1.29 0 0 0 .764-1.48c-.724-3.135-7.228-30.765-12.64-35.232Z"
        />
        {/* Collar Detail */}
        <path fill="rgba(0,0,0,0.2)" d="M119.177 58.115c-.604.254-14.866 6.164-23.927 3.515l12.05-40.228c5.412 4.468 11.917 32.097 12.641 35.233a1.29 1.29 0 0 1-.764 1.48ZM8 58.589c0-2.09 10.5-34.522 11.952-36.919.808-1.332 12.659 39.888 12.659 39.888-2.766 1.127-6.041 1.602-9.312 1.602-5.972.002-11.815-1.443-13.997-2.746l-.005-.003C8.97 60.214 8 59.63 8 58.589Z" />
      </svg>

      {/* Number */}
      <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] md:text-[11px] font-bold z-20 pt-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
        {number}
      </span>
    </div>
  );
}

// Side List Row
function PlayerRow({ player }: { player: LineupPlayerExtended }) {
  const fullName = `${player.first_name} ${player.last_name}`;
  return (
    <Link
      href={`/player/${player.player_id}`}
      className={`flex items-center gap-3 px-4 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors`}
    >
      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-700">
        {player.number}
      </div>
      {player.country?.flag_url && (
        <img
          src={player.country.flag_url}
          alt={player.country.code}
          className="w-4 h-3 object-cover rounded-[1px] shadow-sm flex-shrink-0"
        />
      )}
      <div className="text-xs font-semibold text-gray-800 truncate">
        {fullName}
      </div>
    </Link>
  );
}

interface LineupFieldProps {
  lineups?: MatchLineups;
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  loading?: boolean;
}

export function LineupField({ lineups, homeTeam, awayTeam, loading }: LineupFieldProps) {
  const { t } = useTranslation('match');

  if (loading) {
    return (
      <div className="animate-pulse h-[800px] bg-gray-200 rounded-xl" />
    );
  }

  if (!lineups || !lineups.home_team || !lineups.away_team) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-sm">{t('lineup.noData')}</p>
      </div>
    );
  }

  // Use team colors or fallbacks
  const homeColor = getTeamColor(homeTeam.id) || '#0057b7'; // Default Blue
  const awayColor = getTeamColor(awayTeam.id) || '#d62828'; // Default Red

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_550px_1fr] gap-0 lg:gap-6 items-start">

      {/* Desktop List: Home - Hidden on Mobile */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-[800px] overflow-y-auto">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3 sticky top-0 z-10">
          <img src={homeTeam.logo_url || getTeamLogo(homeTeam.id) || ''} className="w-8 h-8 object-contain" alt={homeTeam.name} />
          <span className="font-bold text-gray-900">{homeTeam.name}</span>
        </div>
        {lineups.home_team.starters.map(p => <PlayerRow key={p.player_id} player={p} />)}
      </div>

      {/* Field Visualization - The Star */}
      <FieldVisualization
        homeStarters={lineups.home_team.starters}
        awayStarters={lineups.away_team.starters}
        homeFormation={lineups.home_team.formation}
        awayFormation={lineups.away_team.formation}
        homeColor={homeColor}
        awayColor={awayColor}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeCoach={lineups.home_team.coach_name}
        awayCoach={lineups.away_team.coach_name}
      />

      {/* Desktop List: Away - Hidden on Mobile */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-[800px] overflow-y-auto">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3 sticky top-0 z-10">
          <img src={awayTeam.logo_url || getTeamLogo(awayTeam.id) || ''} className="w-8 h-8 object-contain" alt={awayTeam.name} />
          <span className="font-bold text-gray-900">{awayTeam.name}</span>
        </div>
        {lineups.away_team.starters.map(p => <PlayerRow key={p.player_id} player={p} />)}
      </div>

    </div>
  );
}

interface FieldVisualizationProps {
  homeStarters: LineupPlayerExtended[];
  awayStarters: LineupPlayerExtended[];
  homeFormation: string;
  awayFormation: string;
  homeColor: string;
  awayColor: string;
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  homeCoach?: string;
  awayCoach?: string;
}

function FieldVisualization({
  homeStarters,
  awayStarters,
  homeFormation,
  awayFormation,
  homeColor,
  awayColor,
  homeTeam,
  awayTeam,
  homeCoach,
  awayCoach
}: FieldVisualizationProps) {
  const homePositions = getFormationPositions(homeFormation, false);
  const awayPositions = getFormationPositions(awayFormation, true);

  // Home -> GK(y=5)=8%, нападающие(y=80)=46% (имя на своей половине)
  const mapToHomeHalf = (pos: { x: number; y: number }) => ({
    x: pos.x,
    y: pos.y * 0.51 + 5.45
  });

  // Away (inverted) -> нападающие(y=20)=52%, GK(y=95)=92%
  const mapToAwayHalf = (pos: { x: number; y: number }) => ({
    x: pos.x,
    y: pos.y * 0.53 + 41.3
  });

  return (
    <div className="relative w-full aspect-[3/4] md:h-[800px] bg-[#050B14] rounded-xl overflow-hidden border border-gray-800 shadow-2xl">

      {/* Header Overlay (Home Team) - TOP */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-20">
        <div className="flex items-center gap-3">
          <img src={homeTeam.logo_url || getTeamLogo(homeTeam.id) || ''} className="w-10 h-10 object-contain" alt={homeTeam.name} />
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-none">{homeTeam.name}</span>
            <span className="text-white/60 text-xs mt-1">Coach: {homeCoach || 'N/A'}</span>
          </div>
        </div>
        <span className="font-mono text-white/40 text-xl font-bold">{homeFormation}</span>
      </div>

      {/* Field Lines */}
      <div className="absolute inset-0 p-6 z-0">
        <svg className="w-full h-full" viewBox="0 0 500 630" preserveAspectRatio="none">
          <g stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeOpacity="0.3">
            {/* Outer Border */}
            <rect x="0" y="0" width="500" height="630" rx="4" />

            {/* Halfway */}
            <line x1="0" y1="315" x2="500" y2="315" />
            <circle cx="250" cy="315" r="50" />
            <circle cx="250" cy="315" r="4" fill="#3b82f6" fillOpacity="0.3" stroke="none" />

            {/* Home Box (Top) */}
            <rect x="120" y="0" width="260" height="90" />
            <rect x="200" y="0" width="100" height="30" />
            <path d="M 210,90 A 40,40 0 0,0 290,90" />
            <circle cx="250" cy="60" r="2" fill="#3b82f6" fillOpacity="0.3" stroke="none" />

            {/* Away Box (Bottom) */}
            <rect x="120" y="540" width="260" height="90" />
            <rect x="200" y="600" width="100" height="30" />
            <path d="M 210,540 A 40,40 0 0,1 290,540" />
            <circle cx="250" cy="570" r="2" fill="#3b82f6" fillOpacity="0.3" stroke="none" />
          </g>
        </svg>
      </div>

      {/* Footer Overlay (Away Team) - BOTTOM */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent z-20">
        <span className="font-mono text-white/40 text-xl font-bold">{awayFormation}</span>
        <div className="flex items-center gap-3 text-right">
          <div className="flex flex-col items-end">
            <span className="text-white font-bold text-lg leading-none">{awayTeam.name}</span>
            <span className="text-white/60 text-xs mt-1">Coach: {awayCoach || 'N/A'}</span>
          </div>
          <img src={awayTeam.logo_url || getTeamLogo(awayTeam.id) || ''} className="w-10 h-10 object-contain" alt={awayTeam.name} />
        </div>
      </div>

      {/* Players Home */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {homeStarters.slice(0, 11).map((player, index) => {
          const rawPos = homePositions[index];
          if (!rawPos) return null;
          const pos = mapToHomeHalf(rawPos);

          return (
            <PlayerMarker
              key={player.player_id}
              player={player}
              position={pos}
              teamColor={homeColor}
            />
          );
        })}
      </div>

      {/* Players Away */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {awayStarters.slice(0, 11).map((player, index) => {
          const rawPos = awayPositions[index];
          if (!rawPos) return null;
          const pos = mapToAwayHalf(rawPos);

          return (
            <PlayerMarker
              key={player.player_id}
              player={player}
              position={pos}
              teamColor={awayColor}
            />
          );
        })}
      </div>
    </div>
  );
}

interface PlayerMarkerProps {
  player: LineupPlayerExtended;
  position: { x: number; y: number };
  teamColor: string;
}

function PlayerMarker({ player, position, teamColor }: PlayerMarkerProps) {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer flex flex-col items-center gap-1 pointer-events-auto"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      <JerseyIcon color={teamColor} number={player.number} />

      {/* Name Label */}
      <div className="flex items-center justify-center gap-1">
        {player.country?.flag_url && (
          <img
            src={player.country.flag_url}
            alt={player.country.code}
            className="w-3 h-[9px] object-cover rounded-[1px] shadow-sm"
          />
        )}
        <span className="text-[10px] md:text-[11px] font-medium text-white text-center leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-[90px] truncate tracking-wide">
          {player.last_name}
        </span>
        {player.is_captain && (
          <span className="flex items-center justify-center w-4 h-4 bg-yellow-400 rounded-full text-[8px] font-black text-black leading-none shadow-md" title="Captain">
            C
          </span>
        )}
      </div>
    </div>
  );
}
