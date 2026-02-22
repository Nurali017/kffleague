import { FormationPosition, LineupPlayerExtended } from '@/types';

const FALLBACK_ORDER_BY_POSITION: Record<LineupPlayerExtended['position'], number> = {
  GK: 0,
  DEF: 3,
  MID: 10,
  FWD: 13,
};

// Keep this aligned with backend ordering in /backend/app/api/games.py
export const POSITION_ORDER: Record<string, number> = {
  // Goalkeeper
  'Gk|C': 0,
  'Gk|_': 0,
  // Defenders: L → LC → C → RC → R
  'D|L': 1,
  'D|LC': 2,
  'D|C': 3,
  'D|RC': 4,
  'D|R': 5,
  'D|_': 3,
  // Holding line
  'DM|L': 6,
  'DM|LC': 6,
  'DM|C': 6,
  'DM|RC': 7,
  'DM|R': 7,
  'DM|_': 6,
  'M|C': 7,
  'M|RC': 7,
  'M|R': 8,
  // Attacking midfield line
  'AM|L': 9,
  'AM|LC': 9,
  'M|L': 10,
  'M|LC': 10,
  'M|_': 10,
  'AM|C': 10,
  'AM|RC': 11,
  'AM|R': 11,
  'AM|_': 10,
  // Forwards
  'F|L': 12,
  'F|LC': 12,
  'F|C': 13,
  'F|RC': 14,
  'F|R': 14,
  'F|_': 13,
};

type PlacementAmplua = 'Gk' | 'D' | 'DM' | 'M' | 'AM' | 'F';
type PlacementFieldPosition = 'L' | 'LC' | 'C' | 'RC' | 'R';

const ROLE_Y: Record<PlacementAmplua, number> = {
  Gk: 5,
  D: 25,
  DM: 40,
  M: 52,
  AM: 64,
  F: 76,
};

const BASE_X: Record<PlacementFieldPosition, number> = {
  L: 18,
  LC: 34,
  C: 50,
  RC: 66,
  R: 82,
};

const LANE_BOUNDS: Record<PlacementFieldPosition, { min: number; max: number }> = {
  L: { min: 6, max: 24 },
  LC: { min: 24, max: 42 },
  C: { min: 42, max: 58 },
  RC: { min: 58, max: 76 },
  R: { min: 76, max: 94 },
};

const LANE_MARGIN = 2;
const DUPLICATE_OFFSET_STEP = 4;

function getOrderKey(
  amplua?: LineupPlayerExtended['amplua'],
  fieldPosition?: LineupPlayerExtended['field_position']
): string | null {
  if (!amplua) {
    return null;
  }
  return `${amplua}|${fieldPosition || '_'}`;
}

export function getPlayerSortOrder(player: LineupPlayerExtended): number {
  const primaryKey = getOrderKey(player.amplua, player.field_position);
  if (primaryKey && primaryKey in POSITION_ORDER) {
    return POSITION_ORDER[primaryKey];
  }

  const fallbackAmpluaKey = getOrderKey(player.amplua, null);
  if (fallbackAmpluaKey && fallbackAmpluaKey in POSITION_ORDER) {
    return POSITION_ORDER[fallbackAmpluaKey];
  }

  if (player.position in FALLBACK_ORDER_BY_POSITION) {
    return FALLBACK_ORDER_BY_POSITION[player.position];
  }

  return 99;
}

export function orderStartersForPlacement(starters: LineupPlayerExtended[]): LineupPlayerExtended[] {
  return starters
    .map((player, index) => ({
      player,
      index,
      order: getPlayerSortOrder(player),
    }))
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.index - b.index;
    })
    .map(item => item.player);
}

export interface PositionedPlayer {
  player: LineupPlayerExtended;
  position: FormationPosition;
}

interface BuildPlacedPlayersInput {
  starters: LineupPlayerExtended[];
  // Deprecated: kept for backward compatibility with callers.
  formation?: string;
  invertY?: boolean;
  mirrorX?: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizeAmplua(
  amplua: LineupPlayerExtended['amplua']
): PlacementAmplua | null {
  if (!amplua) {
    return null;
  }
  const validAmplua: readonly PlacementAmplua[] = ['Gk', 'D', 'DM', 'M', 'AM', 'F'];
  return validAmplua.includes(amplua) ? amplua : null;
}

function normalizeFieldPosition(
  fieldPosition: LineupPlayerExtended['field_position']
): PlacementFieldPosition | null {
  if (!fieldPosition) {
    return null;
  }
  const validFieldPositions: readonly PlacementFieldPosition[] = ['L', 'LC', 'C', 'RC', 'R'];
  return validFieldPositions.includes(fieldPosition) ? fieldPosition : null;
}

function getFallbackAmpluaByPosition(
  position: LineupPlayerExtended['position']
): PlacementAmplua {
  if (position === 'GK') return 'Gk';
  if (position === 'DEF') return 'D';
  if (position === 'FWD') return 'F';
  return 'M';
}

function resolvePlacementRole(
  player: LineupPlayerExtended
): { amplua: PlacementAmplua; fieldPosition: PlacementFieldPosition } {
  const amplua = normalizeAmplua(player.amplua);
  const fieldPosition = normalizeFieldPosition(player.field_position);

  if (amplua && fieldPosition) {
    return { amplua, fieldPosition };
  }

  return {
    amplua: getFallbackAmpluaByPosition(player.position),
    fieldPosition: 'C',
  };
}

export function buildPlacedPlayers({
  starters,
  formation: _formation,
  invertY = false,
  mirrorX = false,
}: BuildPlacedPlayersInput): PositionedPlayer[] {
  const orderedPlayers = orderStartersForPlacement(starters).slice(0, 11);
  const placementEntries = orderedPlayers.map((player, index) => {
    const role = resolvePlacementRole(player);
    return {
      index,
      player,
      amplua: role.amplua,
      fieldPosition: role.fieldPosition,
      groupKey: `${role.amplua}|${role.fieldPosition}`,
    };
  });

  const entriesByGroup = new Map<string, number[]>();
  for (const entry of placementEntries) {
    const bucket = entriesByGroup.get(entry.groupKey) ?? [];
    bucket.push(entry.index);
    entriesByGroup.set(entry.groupKey, bucket);
  }

  const coordinatesByIndex = new Map<number, FormationPosition>();

  for (const groupIndexes of entriesByGroup.values()) {
    const totalInGroup = groupIndexes.length;
    for (const [groupOffsetIndex, entryIndex] of groupIndexes.entries()) {
      const entry = placementEntries[entryIndex];
      const baseX = BASE_X[entry.fieldPosition];
      const bounds = LANE_BOUNDS[entry.fieldPosition];
      const offset = (groupOffsetIndex - (totalInGroup - 1) / 2) * DUPLICATE_OFFSET_STEP;
      const rawX = clamp(baseX + offset, bounds.min + LANE_MARGIN, bounds.max - LANE_MARGIN);
      const rawY = ROLE_Y[entry.amplua];

      coordinatesByIndex.set(entryIndex, {
        x: mirrorX ? 100 - rawX : rawX,
        y: invertY ? 100 - rawY : rawY,
      });
    }
  }

  return placementEntries.map((entry) => ({
    player: entry.player,
    position: coordinatesByIndex.get(entry.index) ?? { x: 50, y: 50 },
  }));
}
