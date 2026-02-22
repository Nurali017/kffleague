import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/constants';
import { config } from '@/config';

const API = config.api.serverBaseUrl;

// Active season IDs: PL=61, 1L=85, Cup=71, 2L-SW=80, 2L-NE=81, WL=84, 2L-Final=157
const GAME_SEASON_IDS = [61, 85, 71, 80, 81, 84, 157];

interface GameItem {
  id: number;
}

interface TeamItem {
  team_id: number;
}

interface PlayerStatItem {
  player_id: number;
}

interface NewsItem {
  id: number;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = [
    { url: '/', priority: 1.0 },
    { url: '/matches', priority: 0.9 },
    { url: '/table', priority: 0.9 },
    { url: '/teams', priority: 0.8 },
    { url: '/stats', priority: 0.7 },
    { url: '/stats/players', priority: 0.7 },
    { url: '/stats/teams', priority: 0.7 },
    { url: '/news', priority: 0.9 },
    { url: '/league', priority: 0.5 },
    { url: '/league/documents', priority: 0.4 },
    { url: '/league/management', priority: 0.4 },
    { url: '/contacts', priority: 0.4 },
    { url: '/media', priority: 0.5 },
  ];

  for (const page of staticPages) {
    entries.push({
      url: `${SITE_URL}${page.url}`,
      changeFrequency: page.url === '/' ? 'daily' : 'weekly',
      priority: page.priority,
    });
  }

  // Matches from all active seasons
  const matchPromises = GAME_SEASON_IDS.map((seasonId) =>
    fetchJson<{ items: GameItem[] }>(`${API}/seasons/${seasonId}/games`)
  );
  const matchResults = await Promise.all(matchPromises);

  const matchIds = new Set<number>();
  for (const result of matchResults) {
    if (result?.items) {
      for (const game of result.items) {
        matchIds.add(game.id);
      }
    }
  }
  for (const id of matchIds) {
    entries.push({
      url: `${SITE_URL}/matches/${id}`,
      changeFrequency: 'daily',
      priority: 0.7,
    });
  }

  // Teams from Premier League season
  const teamsData = await fetchJson<{ items: TeamItem[] }>(
    `${API}/seasons/61/teams`
  );
  if (teamsData?.items) {
    for (const team of teamsData.items) {
      entries.push({
        url: `${SITE_URL}/team/${team.team_id}`,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Players from Premier League stats
  const playersData = await fetchJson<{ items: PlayerStatItem[] }>(
    `${API}/seasons/61/player-stats?limit=500`
  );
  if (playersData?.items) {
    for (const player of playersData.items) {
      entries.push({
        url: `${SITE_URL}/player/${player.player_id}`,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  // News (paginated)
  let page = 1;
  const perPage = 100;
  let hasMore = true;
  while (hasMore) {
    const newsData = await fetchJson<{ items: NewsItem[]; pages: number }>(
      `${API}/news?page=${page}&per_page=${perPage}`
    );
    if (newsData?.items) {
      for (const article of newsData.items) {
        entries.push({
          url: `${SITE_URL}/news/${article.id}`,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
      hasMore = page < (newsData.pages || 1);
      page++;
    } else {
      hasMore = false;
    }
  }

  return entries;
}
