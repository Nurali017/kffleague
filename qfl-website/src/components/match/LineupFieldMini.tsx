'use client';

import Link from 'next/link';
import { MatchLineups, GameTeam, LineupPlayerExtended, LineupRenderingMode } from '@/types';
import { buildPlacedPlayers, orderStartersForPlacement } from '@/lib/utils/lineupPlacement';
import { getPlayerHref, getTeamHref } from '@/lib/utils/entityRoutes';
import { HOME_COLOR, AWAY_COLOR, getTeamLogo } from '@/lib/utils/teamLogos';

const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;

function resolveKitColor(raw: string | null | undefined, fallback: string): string {
  if (!raw) return fallback;
  const color = raw.trim();
  return HEX_COLOR_RE.test(color) ? color.toUpperCase() : fallback;
}

// Mini Jersey Icon Component
function JerseyIconMini({ color, number }: { color: string; number: number }) {
  return (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <svg viewBox="0 0 128 128" fill="none" className="w-full h-full drop-shadow-sm">
        <path
          fill={color}
          d="M107.327 21.364c-5.413-4.466-26.674-9.136-27.576-9.333a1.304 1.304 0 0 0-1.101.256c-16.692 13.303-29.519.649-30.057.105a1.322 1.322 0 0 0-1.428-.295 1.301 1.301 0 0 0-.657.582c-1.217.777-7.31 2.45-11.802 3.683-10.71 2.942-13.946 3.998-14.754 5.33C18.5 24.09 8 56.523 8 58.613c0 1.04.97 1.624 1.297 1.822l.005.003c2.182 1.303 8.025 2.748 13.997 2.746 3.27 0 6.546-.476 9.312-1.602l-1.95 46.035c-.017.494.25.954.69 1.187.204.108 13.879 7.197 32.955 7.197 9.594 0 20.556-1.794 31.855-7.172.465-.221.755-.693.741-1.203l-1.625-46.034c9.061 2.65 23.322-3.26 23.926-3.515a1.29 1.29 0 0 0 .764-1.48c-.724-3.135-7.228-30.765-12.64-35.232Z"
        />
        <path fill="rgba(0,0,0,0.2)" d="M119.177 58.115c-.604.254-14.866 6.164-23.927 3.515l12.05-40.228c5.412 4.468 11.917 32.097 12.641 35.233a1.29 1.29 0 0 1-.764 1.48ZM8 58.589c0-2.09 10.5-34.522 11.952-36.919.808-1.332 12.659 39.888 12.659 39.888-2.766 1.127-6.041 1.602-9.312 1.602-5.972.002-11.815-1.443-13.997-2.746l-.005-.003C8.97 60.214 8 59.63 8 58.589Z" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-white text-[7px] font-bold pt-0.5" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}>
        {number}
      </span>
    </div>
  );
}

interface LineupFieldMiniProps {
  lineups?: MatchLineups;
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  loading?: boolean;
  renderingMode?: LineupRenderingMode;
}

function MiniPlayerName({ player }: { player: LineupPlayerExtended }) {
  const playerHref = getPlayerHref(player.player_id);

  const content = (
    <>
      <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-700">
        {player.number}
      </span>
      <span className="truncate text-gray-800">{`${player.first_name} ${player.last_name}`}</span>
    </>
  );

  if (!playerHref) {
    return (
      <div className="flex items-center gap-2 py-1 text-xs">
        {content}
      </div>
    );
  }

  return (
    <Link href={playerHref} className="flex items-center gap-2 py-1 text-xs hover:text-primary transition-colors">
      {content}
    </Link>
  );
}

export function LineupFieldMini({
  lineups,
  homeTeam,
  awayTeam,
  loading,
  renderingMode = 'field',
}: LineupFieldMiniProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Составы</h3>
        </div>
        <div className="animate-pulse aspect-[3/4] bg-gray-100" />
      </div>
    );
  }

  if (renderingMode === 'hidden') {
    return null;
  }

  if (!lineups || !lineups.home_team || !lineups.away_team) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Составы</h3>
        </div>
        <div className="p-6 text-center text-sm text-gray-500">
          Данные недоступны
        </div>
      </div>
    );
  }

  const homeColor = resolveKitColor(lineups.home_team.kit_color, HOME_COLOR);
  const awayColor = resolveKitColor(lineups.away_team.kit_color, AWAY_COLOR);
  const homeTeamHref = getTeamHref(homeTeam.id);
  const awayTeamHref = getTeamHref(awayTeam.id);
  const homeStartersOrdered = orderStartersForPlacement(lineups.home_team.starters).slice(0, 11);
  const awayStartersOrdered = orderStartersForPlacement(lineups.away_team.starters).slice(0, 11);

  if (renderingMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Составы</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4">
          <div>
            {homeTeamHref ? (
              <Link href={homeTeamHref} className="flex items-center gap-2 mb-2 hover:text-primary transition-colors">
                <img src={homeTeam.logo_url || getTeamLogo(homeTeam.id) || ''} className="w-5 h-5 object-contain" alt={homeTeam.name} />
                <span className="text-xs font-bold text-gray-800">{homeTeam.name}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <img src={homeTeam.logo_url || getTeamLogo(homeTeam.id) || ''} className="w-5 h-5 object-contain" alt={homeTeam.name} />
                <span className="text-xs font-bold text-gray-800">{homeTeam.name}</span>
              </div>
            )}
            <div className="space-y-1">
              {homeStartersOrdered.map((player) => (
                <MiniPlayerName key={player.player_id} player={player} />
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            {awayTeamHref ? (
              <Link href={awayTeamHref} className="flex items-center gap-2 mb-2 hover:text-primary transition-colors">
                <img src={awayTeam.logo_url || getTeamLogo(awayTeam.id) || ''} className="w-5 h-5 object-contain" alt={awayTeam.name} />
                <span className="text-xs font-bold text-gray-800">{awayTeam.name}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <img src={awayTeam.logo_url || getTeamLogo(awayTeam.id) || ''} className="w-5 h-5 object-contain" alt={awayTeam.name} />
                <span className="text-xs font-bold text-gray-800">{awayTeam.name}</span>
              </div>
            )}
            <div className="space-y-1">
              {awayStartersOrdered.map((player) => (
                <MiniPlayerName key={player.player_id} player={player} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const homePlacedPlayers = buildPlacedPlayers({
    starters: homeStartersOrdered,
    invertY: false,
    mirrorX: false,
  });
  const awayPlacedPlayers = buildPlacedPlayers({
    starters: awayStartersOrdered,
    invertY: true,
    mirrorX: true,
  });

  // Map to field halves to match full-size lineup placement
  const mapToHomeHalf = (pos: { x: number; y: number }) => ({
    x: pos.x,
    y: pos.y * 0.51 + 5.45,
  });

  const mapToAwayHalf = (pos: { x: number; y: number }) => ({
    x: pos.x,
    y: pos.y * 0.53 + 41.3,
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">Составы</h3>
      </div>

      {/* Field */}
      <div className="relative w-full aspect-[3/4] bg-[#050B14]">
        {/* Home Team Header */}
        <div className="absolute top-0 left-0 right-0 px-3 py-2 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-20">
          {homeTeamHref ? (
            <Link href={homeTeamHref} className="flex items-center gap-2 group">
              <img src={homeTeam.logo_url || getTeamLogo(homeTeam.id) || ''} className="w-5 h-5 object-contain" alt={homeTeam.name} />
              <span className="text-white font-semibold text-xs truncate max-w-[100px] group-hover:text-cyan-300 transition-colors">{homeTeam.name}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <img src={homeTeam.logo_url || getTeamLogo(homeTeam.id) || ''} className="w-5 h-5 object-contain" alt={homeTeam.name} />
              <span className="text-white font-semibold text-xs truncate max-w-[100px]">{homeTeam.name}</span>
            </div>
          )}
          <span className="font-mono text-white/50 text-xs font-bold">{lineups.home_team.formation}</span>
        </div>

        {/* Field Lines */}
        <div className="absolute inset-0 p-3 z-0">
          <svg className="w-full h-full" viewBox="0 0 500 630" preserveAspectRatio="none">
            <g stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeOpacity="0.25">
              <rect x="0" y="0" width="500" height="630" rx="4" />
              <line x1="0" y1="315" x2="500" y2="315" />
              <circle cx="250" cy="315" r="50" />
              <circle cx="250" cy="315" r="4" fill="#3b82f6" fillOpacity="0.25" stroke="none" />
              <rect x="120" y="0" width="260" height="90" />
              <rect x="200" y="0" width="100" height="30" />
              <path d="M 210,90 A 40,40 0 0,0 290,90" />
              <rect x="120" y="540" width="260" height="90" />
              <rect x="200" y="600" width="100" height="30" />
              <path d="M 210,540 A 40,40 0 0,1 290,540" />
            </g>
          </svg>
        </div>

        {/* Away Team Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent z-20">
          <span className="font-mono text-white/50 text-xs font-bold">{lineups.away_team.formation}</span>
          {awayTeamHref ? (
            <Link href={awayTeamHref} className="flex items-center gap-2 group">
              <span className="text-white font-semibold text-xs truncate max-w-[100px] group-hover:text-cyan-300 transition-colors">{awayTeam.name}</span>
              <img src={awayTeam.logo_url || getTeamLogo(awayTeam.id) || ''} className="w-5 h-5 object-contain" alt={awayTeam.name} />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-xs truncate max-w-[100px]">{awayTeam.name}</span>
              <img src={awayTeam.logo_url || getTeamLogo(awayTeam.id) || ''} className="w-5 h-5 object-contain" alt={awayTeam.name} />
            </div>
          )}
        </div>

        {/* Home Players */}
        <div className="absolute inset-0 z-10">
          {homePlacedPlayers.map(({ player, position }) => {
            const pos = mapToHomeHalf(position);
            return (
              <PlayerMarkerMini
                key={player.player_id}
                player={player}
                position={pos}
                teamColor={homeColor}
              />
            );
          })}
        </div>

        {/* Away Players */}
        <div className="absolute inset-0 z-10">
          {awayPlacedPlayers.map(({ player, position }) => {
            const pos = mapToAwayHalf(position);
            return (
              <PlayerMarkerMini
                key={player.player_id}
                player={player}
                position={pos}
                teamColor={awayColor}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface PlayerMarkerMiniProps {
  player: LineupPlayerExtended;
  position: { x: number; y: number };
  teamColor: string;
}

function PlayerMarkerMini({ player, position, teamColor }: PlayerMarkerMiniProps) {
  const playerHref = getPlayerHref(player.player_id);

  const content = (
    <>
      <JerseyIconMini color={teamColor} number={player.number} />
      <span className="text-[7px] font-medium text-white text-center leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] max-w-[50px] truncate">
        {player.last_name}
      </span>
    </>
  );

  if (!playerHref) {
    return (
      <div
        data-testid={`lineup-marker-${player.player_id}`}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={playerHref}
      data-testid={`lineup-marker-${player.player_id}`}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      {content}
    </Link>
  );
}
