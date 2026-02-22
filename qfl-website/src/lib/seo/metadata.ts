import { Metadata } from 'next';
import { getLanguageFromCookie } from '@/lib/i18n/cookies.server';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION_KZ,
  SITE_DESCRIPTION_RU,
} from './constants';

export type SeoLang = 'ru' | 'kz';

export function getSeoLang(): SeoLang {
  const lang = getLanguageFromCookie();
  return lang === 'kz' ? 'kz' : 'ru';
}

export function getDefaultDescription(lang: SeoLang): string {
  return lang === 'kz' ? SITE_DESCRIPTION_KZ : SITE_DESCRIPTION_RU;
}

export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trimEnd() + '...';
}

export function matchTitle(
  homeName: string,
  awayName: string,
  homeScore?: number | null,
  awayScore?: number | null
): string {
  if (homeScore != null && awayScore != null) {
    return `${homeName} vs ${awayName} ${homeScore}:${awayScore}`;
  }
  return `${homeName} vs ${awayName}`;
}

export function playerTitle(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  teamName?: string | null
): string {
  const name = [firstName, lastName].filter(Boolean).join(' ') || 'Player';
  if (teamName) return `${name} - ${teamName}`;
  return name;
}

interface BuildMetadataOptions {
  title?: string;
  absoluteTitle?: string;
  description?: string;
  path?: string;
  ogImage?: string | null;
  ogType?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  noIndex?: boolean;
}

export function buildMetadata(opts: BuildMetadataOptions): Metadata {
  const {
    title,
    absoluteTitle,
    description,
    path,
    ogImage,
    ogType = 'website',
    publishedTime,
    noIndex,
  } = opts;

  const canonical = path ? `${SITE_URL}${path}` : undefined;
  const image = ogImage || DEFAULT_OG_IMAGE;

  const metadata: Metadata = {};

  if (absoluteTitle) {
    metadata.title = { absolute: absoluteTitle };
  } else if (title) {
    metadata.title = title;
  }

  if (description) {
    metadata.description = truncateDescription(description);
  }

  if (canonical) {
    metadata.alternates = { canonical };
  }

  metadata.openGraph = {
    title: absoluteTitle || title || SITE_NAME,
    description: description ? truncateDescription(description) : undefined,
    url: canonical,
    siteName: SITE_NAME,
    type: ogType,
    ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    ...(publishedTime && ogType === 'article' ? { publishedTime } : {}),
  };

  metadata.twitter = {
    card: 'summary_large_image',
    title: absoluteTitle || title || SITE_NAME,
    description: description ? truncateDescription(description) : undefined,
    ...(image ? { images: [image] } : {}),
  };

  if (noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}
