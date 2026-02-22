import { TeamDetail, TeamStats, SquadPlayer } from '@/types';
import { Game } from '@/types/match';

// Interfaces for QJ Style Data
interface QJTeamDetail extends TeamDetail {
    kits?: {
        home: string;
        away: string;
    };
    description?: string;
    socials?: {
        instagram?: string;
        tiktok?: string;
        website?: string;
    };
}

interface LeagueTableItem {
    position: number;
    team_name: string;
    team_logo: string;
    games: number;
    points: number;
    form: string[]; // ['W', 'D', 'L', ...]
}

interface TopScorer {
    player_id: number;
    name: string;
    team_logo: string;
    photo_url: string;
    games: number;
    goals: number;
}

// 1. Teams Data
export const MOCKED_TEAMS: Record<number, QJTeamDetail> = {
    1: {
        id: 1,
        name: 'FC Astana',
        logo_url: '/uploads/astana-logo.png',
        stadium: {
            id: 1,
            name: 'Astana Arena',
            capacity: 30000,
            city: 'Astana',
            location: 'Astana',
            image_url: '/images/astana-arena.jpg'
        },
        founded_year: 2009,
        colors: { primary: '#FFCC00', secondary: '#00AEEF' },
        kits: {
            home: '/images/kits/astana-home.png',
            away: '/images/kits/astana-away.png'
        },
        description: '«Астана» футбол клубының 2009 жылға дейін құрылған командасы. Елордамыздың мақтанышы.',
        socials: {
            website: 'fcastana.kz',
            instagram: 'https://instagram.com/fcastana',
            tiktok: 'https://tiktok.com/@fcastana'
        }
    },
    2: {
        id: 2,
        name: 'FC Kairat',
        logo_url: '/uploads/kairat-logo.png',
        stadium: {
            id: 3,
            name: 'Central Stadium',
            capacity: 23000,
            city: 'Almaty',
            location: 'Almaty',
            image_url: '/images/kairat-stadium.jpg'
        },
        founded_year: 1954,
        colors: { primary: '#EFDF00', secondary: '#000000' },
        kits: {
            home: '/images/kits/kairat-home.png',
            away: '/images/kits/kairat-away.png'
        },
        description: '«Қайрат» халықтық командасы.',
        socials: {
            website: 'fckairat.com',
            instagram: '#',
            tiktok: '#'
        }
    },
    3: { id: 3, name: 'FC Aktobe', logo_url: '/uploads/aktobe-logo.png' },
    4: { id: 4, name: 'FC Ordabasy', logo_url: '/uploads/ordabasy-logo.png' },
    5: { id: 5, name: 'Tobol', logo_url: '/uploads/tobol-logo.png' },
    6: { id: 6, name: 'Elimai', logo_url: '/uploads/elimai-logo.png' },
    7: { id: 7, name: 'Zhas Kyran', logo_url: '/uploads/zhaskyran-logo.png' }
};

// 2. League Table Data
export const MOCKED_TABLE: LeagueTableItem[] = [
    { position: 1, team_name: 'Kairat', team_logo: '/uploads/kairat-logo.png', games: 22, points: 62, form: ['W', 'W', 'D'] },
    { position: 2, team_name: 'Astana', team_logo: '/uploads/astana-logo.png', games: 22, points: 59, form: ['W', 'D', 'W'] },
    { position: 3, team_name: 'Ordabasy', team_logo: '/uploads/ordabasy-logo.png', games: 22, points: 44, form: ['L', 'L', 'D'] },
    { position: 4, team_name: 'Aktobe', team_logo: '/uploads/aktobe-logo.png', games: 22, points: 39, form: ['W', 'L', 'W'] },
    { position: 5, team_name: 'Zhas Kyran', team_logo: '/uploads/zhaskyran-logo.png', games: 22, points: 30, form: ['L', 'W', 'L'] },
];

// 3. Top Scorer Data
export const MOCKED_TOP_SCORER: TopScorer = {
    player_id: 10,
    name: 'Ramazan Karimov',
    team_logo: '/uploads/astana-logo.png',
    photo_url: '/uploads/players/karimov_cutout.png',
    games: 21,
    goals: 7
};

// 4. News Data
export const MOCKED_NEWS = [
    {
        id: 1,
        title: 'Anton Lysyak speaks at Nazarbayev University seminar',
        date: '22 Jan 2026',
        image: '/images/news/lysyak-nu.jpg',
        is_featured: true
    },
    {
        id: 2,
        title: 'Bauyrzhan Sagyndyk passes internship at FC Qarabag',
        date: '22 Jan 2026',
        image: '/images/news/sagyndyk-qarabag.jpg',
        is_featured: false
    },
    {
        id: 3,
        title: 'Bauyrzhan Sagyndyk appointed new head of SSB',
        date: '21 Jan 2026',
        image: '/images/news/sagyndyk-ssb.jpg',
        is_featured: false
    }
];

// 5. Games
const baseDate = new Date();
export const MOCKED_GAMES: Game[] = [
    {
        id: 1,
        date: new Date(baseDate.getTime() - 86400000 * 14).toISOString(),
        time: '18:00',
        tour: 5,
        season_id: 2024,
        status: 'finished',
        home_score: 2,
        away_score: 1,
        is_live: false,
        has_stats: true,
        has_lineup: true,
        visitors: 12000,
        ticket_url: null,
        home_team: { id: 1, name: 'FC Astana', logo_url: '/uploads/astana-logo.png' },
        away_team: { id: 2, name: 'FC Kairat', logo_url: '/uploads/kairat-logo.png' },
        stadium: { id: 1, name: 'Astana Arena', city: 'Astana', capacity: 30000 }
    },
    {
        id: 2,
        date: new Date(baseDate.getTime() - 86400000 * 7).toISOString(),
        time: '19:00',
        tour: 6,
        season_id: 2024,
        status: 'finished',
        home_score: 0,
        away_score: 3,
        is_live: false,
        has_stats: true,
        has_lineup: true,
        visitors: 8500,
        ticket_url: null,
        home_team: { id: 3, name: 'FC Aktobe', logo_url: '/uploads/aktobe-logo.png' },
        away_team: { id: 1, name: 'FC Astana', logo_url: '/uploads/astana-logo.png' },
        stadium: { id: 2, name: 'Koblandy Batyr', city: 'Aktobe', capacity: 13000 }
    },
    {
        id: 3,
        date: new Date(baseDate.getTime() + 86400000 * 3).toISOString(),
        time: '20:00',
        tour: 7,
        season_id: 2024,
        status: 'upcoming',
        home_score: null,
        away_score: null,
        is_live: false,
        has_stats: false,
        has_lineup: false,
        visitors: null,
        ticket_url: 'https://ticket.qfl.kz',
        home_team: { id: 1, name: 'FC Astana', logo_url: '/uploads/astana-logo.png' },
        away_team: { id: 4, name: 'FC Ordabasy', logo_url: '/uploads/ordabasy-logo.png' },
        stadium: { id: 1, name: 'Astana Arena', city: 'Astana', capacity: 30000 }
    }
] as any[];

// Empty placeholders for unused imports if any
export const MOCKED_STATS = {};
export const MOCKED_SQUAD = [];
export const MOCKED_STORIES = [];
