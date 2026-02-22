import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from './constants';

type JsonLdObject = Record<string, unknown>;

export function organizationJsonLd(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    sameAs: [],
    sport: 'Football',
  };
}

export function websiteJsonLd(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/news?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

interface SportsEventInput {
  id: number;
  date: string;
  homeName: string;
  awayName: string;
  homeScore?: number | null;
  awayScore?: number | null;
  stadiumName?: string | null;
  stadiumCity?: string | null;
  status: 'upcoming' | 'live' | 'finished';
}

export function sportsEventJsonLd(match: SportsEventInput): JsonLdObject {
  const eventStatus =
    match.status === 'finished'
      ? 'https://schema.org/EventScheduled'
      : match.status === 'live'
        ? 'https://schema.org/EventScheduled'
        : 'https://schema.org/EventScheduled';

  const result: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.homeName} vs ${match.awayName}`,
    startDate: match.date,
    url: `${SITE_URL}/matches/${match.id}`,
    eventStatus,
    homeTeam: {
      '@type': 'SportsTeam',
      name: match.homeName,
    },
    awayTeam: {
      '@type': 'SportsTeam',
      name: match.awayName,
    },
  };

  if (match.stadiumName) {
    result.location = {
      '@type': 'StadiumOrArena',
      name: match.stadiumName,
      ...(match.stadiumCity
        ? { address: { '@type': 'PostalAddress', addressLocality: match.stadiumCity } }
        : {}),
    };
  }

  return result;
}

interface SportsTeamInput {
  id: number;
  name: string;
  logoUrl?: string | null;
  city?: string | null;
  stadiumName?: string | null;
}

export function sportsTeamJsonLd(team: SportsTeamInput): JsonLdObject {
  const result: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: team.name,
    url: `${SITE_URL}/team/${team.id}`,
    sport: 'Football',
    memberOf: {
      '@type': 'SportsOrganization',
      name: SITE_NAME,
    },
  };

  if (team.logoUrl) {
    result.logo = team.logoUrl;
  }

  if (team.city) {
    result.location = {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: team.city },
    };
  }

  if (team.stadiumName) {
    result.location = {
      ...(result.location as object || {}),
      '@type': 'StadiumOrArena',
      name: team.stadiumName,
    };
  }

  return result;
}

interface PersonInput {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  photoUrl?: string | null;
  teamName?: string | null;
  nationality?: string | null;
}

export function personJsonLd(player: PersonInput): JsonLdObject {
  const name = [player.firstName, player.lastName].filter(Boolean).join(' ');
  const result: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name || 'Player',
    url: `${SITE_URL}/player/${player.id}`,
  };

  if (player.photoUrl) {
    result.image = player.photoUrl;
  }

  if (player.teamName) {
    result.memberOf = {
      '@type': 'SportsTeam',
      name: player.teamName,
    };
  }

  if (player.nationality) {
    result.nationality = player.nationality;
  }

  return result;
}

interface NewsArticleInput {
  id: number;
  title: string;
  excerpt?: string;
  imageUrl?: string | null;
  publishDate: string;
}

export function newsArticleJsonLd(article: NewsArticleInput): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    url: `${SITE_URL}/news/${article.id}`,
    datePublished: article.publishDate,
    image: article.imageUrl || DEFAULT_OG_IMAGE,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.ico`,
      },
    },
    ...(article.excerpt ? { description: article.excerpt } : {}),
  };
}

interface BreadcrumbItem {
  name: string;
  href?: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };
}
