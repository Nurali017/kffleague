import { SUPER_CUP_FEATURED_MATCH } from './featuredMatch';

export interface TrophyCategory {
  key: 'championships' | 'cups' | 'superCups';
  labelKey: string;
  icon: string;
}

export interface TeamTrophyData {
  teamId: number;
  teamName: string;
  color: string;
  trophies: {
    championships: { count: number; years: number[] };
    cups: { count: number; years: number[] };
    superCups: { count: number; years: number[] };
  };
  total: number;
}

export const TROPHY_CATEGORIES: TrophyCategory[] = [
  { key: 'championships', labelKey: 'trophyCabinet.championships', icon: 'crown' },
  { key: 'cups', labelKey: 'trophyCabinet.cups', icon: 'trophy' },
  { key: 'superCups', labelKey: 'trophyCabinet.superCups', icon: 'star' },
];

export const KAIRAT_TROPHIES: TeamTrophyData = {
  teamId: SUPER_CUP_FEATURED_MATCH.homeTeamId,
  teamName: 'Кайрат',
  color: 'amber',
  trophies: {
    championships: { count: 5, years: [1992, 2004, 2020, 2021, 2022] },
    cups: { count: 10, years: [1992, 1999, 2000, 2001, 2003, 2014, 2015, 2017, 2021, 2024] },
    superCups: { count: 3, years: [2016, 2021, 2022] },
  },
  total: 18,
};

export const TOBOL_TROPHIES: TeamTrophyData = {
  teamId: SUPER_CUP_FEATURED_MATCH.awayTeamId,
  teamName: 'Тобыл',
  color: 'green',
  trophies: {
    championships: { count: 2, years: [2010, 2023] },
    cups: { count: 3, years: [2007, 2023, 2025] },
    superCups: { count: 3, years: [2024, 2009, 2011] },
  },
  total: 8,
};

export function getSuperCupTrophyData(): [TeamTrophyData, TeamTrophyData] {
  return [KAIRAT_TROPHIES, TOBOL_TROPHIES];
}
