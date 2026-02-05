import { Tournament, Season } from '@/types/tournament';

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
    order: 5,
    hasTable: true,
    hasBracket: false,
  },
};

export const DEFAULT_TOURNAMENT_ID = 'pl';

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
