import { Tournament, TournamentColors, Season, SecondLeagueStage } from '@/types/tournament';

// Color palettes as RGB channels for Tailwind opacity support
export const TOURNAMENT_COLORS: Record<string, TournamentColors> = {
  pl:  { primary: '30 77 140',  primaryLight: '42 95 163',  primaryDark: '22 58 107', accent: '229 183 59', accentSoft: '240 201 93'  },
  '1l': { primary: '61 122 62', primaryLight: '78 155 79',  primaryDark: '46 94 47',  accent: '123 198 125', accentSoft: '163 217 164' },
  cup: { primary: '74 26 43',   primaryLight: '107 45 66',  primaryDark: '53 18 31',  accent: '139 58 85',  accentSoft: '181 102 126' },
  '2l': { primary: '168 106 43', primaryLight: '196 132 61', primaryDark: '127 79 32', accent: '212 168 92', accentSoft: '229 200 138' },
  el:  { primary: '107 79 160', primaryLight: '133 102 184', primaryDark: '80 59 120', accent: '160 126 214', accentSoft: '196 168 232' },
};

// Season IDs from SOTA API database
// Premier League: 61, First League: 85, Cup: 71, Women's League: 84
// Second League: 80 (Southwest), 81 (Northeast), 157 (Final)
export const TOURNAMENTS: Record<string, Tournament> = {
  pl: {
    id: 'pl',  // Used for news filtering
    seasonId: 61,
    type: 'league',
    format: 'round_robin',
    name: {
      ru: 'Премьер-Лига',
      kz: 'Премьер-Лига',
      short: 'Премьер-Лига',
    },
    sponsorName: 'ПРЕМЬЕР-ЛИГА',
    logo: '/images/tournaments/pl.png',
    colors: {
      primary: '30 77 140',
      primaryLight: '42 95 163',
      primaryDark: '22 58 107',
      accent: '229 183 59',
      accentSoft: '240 201 93',
    },
    order: 1,
    hasTable: true,
    hasBracket: false,
    currentRound: 26,
    totalRounds: 33,
  },
  '1l': {
    id: '1l',  // Used for news filtering
    seasonId: 85, // First League 2025
    type: 'league',
    format: 'round_robin',
    name: {
      ru: 'Первая лига',
      kz: 'Бірінші Лига',
      short: 'Бірінші Лига',
    },
    sponsorName: 'БІРІНШІ ЛИГА',
    logo: '/images/tournaments/1l.png',
    colors: {
      primary: '61 122 62',
      primaryLight: '78 155 79',
      primaryDark: '46 94 47',
      accent: '123 198 125',
      accentSoft: '163 217 164',
    },
    order: 2,
    hasTable: true,
    hasBracket: false,
  },
  cup: {
    id: 'cup',  // Used for news filtering
    seasonId: 71, // Cup 2025
    type: 'cup',
    format: 'knockout',
    name: {
      ru: 'Кубок Казахстана',
      kz: 'Қазақстан Кубогы',
      short: 'Кубок',
    },
    sponsorName: 'OLIMPBET ҚАЗАҚСТАН КУБОГЫ',
    logo: '/images/tournaments/cup.png',
    colors: {
      primary: '74 26 43',
      primaryLight: '107 45 66',
      primaryDark: '53 18 31',
      accent: '139 58 85',
      accentSoft: '181 102 126',
    },
    order: 3,
    hasTable: false,
    hasBracket: true,
  },
  '2l': {
    id: '2l',  // Used for news filtering
    seasonId: 80, // Second League Southwest 2025
    type: 'league',
    format: 'round_robin',
    name: {
      ru: 'Вторая лига',
      kz: 'Екінші Лига',
      short: 'Екінші Лига',
    },
    sponsorName: 'ЕКІНШІ ЛИГА',
    logo: '/images/tournaments/2l.png',
    colors: {
      primary: '168 106 43',
      primaryLight: '196 132 61',
      primaryDark: '127 79 32',
      accent: '212 168 92',
      accentSoft: '229 200 138',
    },
    order: 4,
    hasTable: true,
    hasBracket: false,
  },
  el: {
    id: 'el',  // Used for news filtering
    seasonId: 84, // Women's League 2025
    type: 'league',
    format: 'round_robin',
    name: {
      ru: 'Женская лига',
      kz: 'Әйелдер Лигасы',
      short: 'Әйелдер',
    },
    sponsorName: 'ӘЙЕЛДЕР ЛИГАСЫ',
    logo: '/images/tournaments/el.png',
    colors: {
      primary: '107 79 160',
      primaryLight: '133 102 184',
      primaryDark: '80 59 120',
      accent: '160 126 214',
      accentSoft: '196 168 232',
    },
    order: 5,
    hasTable: true,
    hasBracket: false,
  },
};

export const DEFAULT_TOURNAMENT_ID = 'pl';
export const DEFAULT_SECOND_LEAGUE_STAGE: SecondLeagueStage = 'a';
export const SECOND_LEAGUE_STAGE_SEASON_IDS: Record<SecondLeagueStage, number> = {
  a: 80,
  b: 81,
  final: 157,
};

export const SEASONS: Season[] = [
  {
    id: 61,
    year: '2025',
    tournaments: Object.values(TOURNAMENTS),
    isCurrentSeason: true,
  },
  {
    id: 60,
    year: '2024',
    tournaments: Object.values(TOURNAMENTS),
    isCurrentSeason: false,
  },
];

export function getTournamentById(id: string): Tournament | undefined {
  return TOURNAMENTS[id];
}

export function getActiveTournaments(): Tournament[] {
  return Object.values(TOURNAMENTS).sort((a, b) => a.order - b.order);
}

export function isLeagueTournament(tournament: Tournament): boolean {
  return tournament.type === 'league';
}

export function isCupTournament(tournament: Tournament): boolean {
  return tournament.type === 'cup' || tournament.type === 'supercup';
}

export function getSecondLeagueSeasonId(stage: SecondLeagueStage): number {
  return SECOND_LEAGUE_STAGE_SEASON_IDS[stage];
}
