import { SITE_URL } from '@/lib/seo/constants';

const DEFAULT_NEWS_BASE_URL = SITE_URL;
const EXTERNAL_LINK_REL = 'noopener noreferrer nofollow';
const UNSAFE_SCHEMES = new Set(['javascript', 'vbscript', 'data', 'file']);
const PLAYER_MARKERS = new Set(['player', 'players']);
const TEAM_MARKERS = new Set(['team', 'teams', 'club', 'clubs']);

function normalizeHostname(hostname?: string | null): string | null {
  if (!hostname) return null;
  return hostname.toLowerCase().trim().replace(/\.$/, '');
}

function hostVariants(hostname?: string | null): string[] {
  const normalized = normalizeHostname(hostname);
  if (!normalized) return [];
  if (normalized.startsWith('www.')) {
    return [normalized, normalized.slice(4)];
  }
  return [normalized, `www.${normalized}`];
}

function normalizeBaseUrl(baseUrl?: string | null, fallbackBaseUrl: string = DEFAULT_NEWS_BASE_URL): string {
  const candidates = [baseUrl, fallbackBaseUrl, DEFAULT_NEWS_BASE_URL];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const value = candidate.trim();
    if (!value) continue;
    try {
      const parsed = new URL(value);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.toString();
      }
    } catch {
      if (value.startsWith('/')) continue;
      try {
        const parsed = new URL(`https://${value}`);
        return parsed.toString();
      } catch {
        // no-op
      }
    }
  }
  return DEFAULT_NEWS_BASE_URL;
}

function buildInternalHosts(baseUrl: string, fallbackBaseUrl: string): Set<string> {
  const hosts = new Set<string>();
  for (const candidate of [baseUrl, fallbackBaseUrl, DEFAULT_NEWS_BASE_URL]) {
    try {
      const parsed = new URL(candidate);
      for (const variant of hostVariants(parsed.hostname)) {
        hosts.add(variant);
      }
    } catch {
      // no-op
    }
  }
  return hosts;
}

function looksInternalHostname(hostname?: string | null): boolean {
  const normalized = normalizeHostname(hostname);
  if (!normalized) return false;
  if (normalized === 'localhost' || normalized === '0.0.0.0' || normalized === '::1') return true;
  if (normalized.endsWith('.local') || normalized.startsWith('qfl-') || normalized === 'minio') return true;

  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(normalized)) {
    if (normalized.startsWith('127.') || normalized.startsWith('10.')) return true;
    if (normalized.startsWith('192.168.')) return true;
    if (normalized.startsWith('172.')) {
      const second = Number(normalized.split('.')[1]);
      if (second >= 16 && second <= 31) return true;
    }
  }

  return !normalized.includes('.');
}

function normalizeHttpUrlForPublic(
  url: string,
  options: { baseOrigin: string; internalHosts: Set<string> }
): string {
  try {
    const parsed = new URL(url);
    const hostname = normalizeHostname(parsed.hostname);
    if (hostname && looksInternalHostname(hostname) && !options.internalHosts.has(hostname)) {
      return new URL(`${parsed.pathname}${parsed.search}${parsed.hash}`, options.baseOrigin).toString();
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function normalizeUrl(
  rawUrl: string | null | undefined,
  options: {
    baseUrl: string;
    baseOrigin: string;
    internalHosts: Set<string>;
    isHref: boolean;
  }
): string | null {
  if (!rawUrl) return null;
  let value = rawUrl.trim();
  if (!value) return null;

  if (value.startsWith('#')) {
    return options.isHref ? value : null;
  }
  if (value.startsWith('//')) {
    value = `https:${value}`;
  }

  let parsed: URL | null = null;
  try {
    parsed = new URL(value);
  } catch {
    parsed = null;
  }

  if (parsed) {
    const scheme = parsed.protocol.replace(':', '').toLowerCase();
    if (UNSAFE_SCHEMES.has(scheme)) return null;
    if (options.isHref && (scheme === 'mailto' || scheme === 'tel')) return value;
    if (scheme !== 'http' && scheme !== 'https') return null;
    return normalizeHttpUrlForPublic(parsed.toString(), options);
  }

  try {
    const absolute = new URL(value, options.baseUrl);
    if (absolute.protocol !== 'http:' && absolute.protocol !== 'https:') return null;
    return normalizeHttpUrlForPublic(absolute.toString(), options);
  } catch {
    return null;
  }
}

function toRelativeIfInternal(url: string, internalHosts: Set<string>): string {
  try {
    const parsed = new URL(url);
    const hostname = normalizeHostname(parsed.hostname);
    if (!hostname || !internalHosts.has(hostname)) return url;
    const path = parsed.pathname || '/';
    return `${path}${parsed.search}${parsed.hash}`;
  } catch {
    return url;
  }
}

function isExternalHref(href: string, internalHosts: Set<string>): boolean {
  const lowered = href.toLowerCase();
  if (lowered.startsWith('/') || lowered.startsWith('#') || lowered.startsWith('mailto:') || lowered.startsWith('tel:')) {
    return false;
  }
  try {
    const parsed = new URL(href);
    const hostname = normalizeHostname(parsed.hostname);
    return !hostname || !internalHosts.has(hostname);
  } catch {
    return false;
  }
}

function parsePositiveInt(value?: string | null): number | null {
  if (!value) return null;
  const match = value.trim().match(/^(\d+)/);
  if (!match) return null;
  const parsed = Number(match[1]);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function rewritePlayerTeamPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 2) return null;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const marker = segments[index].toLowerCase();
    const candidateId = parsePositiveInt(segments[index + 1]);
    if (!candidateId) continue;

    if (PLAYER_MARKERS.has(marker)) {
      return `/player/${candidateId}`;
    }
    if (TEAM_MARKERS.has(marker)) {
      return `/team/${candidateId}`;
    }
  }
  return null;
}

function rewritePlayerTeamHref(href: string, internalHosts: Set<string>): string {
  try {
    const parsed = href.startsWith('/') ? new URL(href, DEFAULT_NEWS_BASE_URL) : new URL(href);
    const hostname = normalizeHostname(parsed.hostname);
    if (hostname && !internalHosts.has(hostname)) {
      return href;
    }
    const rewrittenPath = rewritePlayerTeamPath(parsed.pathname);
    if (!rewrittenPath) return href;
    return `${rewrittenPath}${parsed.search}${parsed.hash}`;
  } catch {
    return href;
  }
}

export function normalizeNewsMediaUrl(
  mediaUrl: string | null | undefined,
  options: { sourceUrl?: string | null; fallbackBaseUrl?: string } = {}
): string | null {
  const baseUrl = normalizeBaseUrl(options.sourceUrl, options.fallbackBaseUrl ?? DEFAULT_NEWS_BASE_URL);
  const internalHosts = buildInternalHosts(baseUrl, options.fallbackBaseUrl ?? DEFAULT_NEWS_BASE_URL);
  const baseOrigin = new URL(baseUrl).origin;
  return normalizeUrl(mediaUrl, {
    baseUrl,
    baseOrigin,
    internalHosts,
    isHref: false,
  });
}

export function normalizeNewsHtmlContent(
  content: string | null | undefined,
  options: { sourceUrl?: string | null; fallbackBaseUrl?: string } = {}
): string {
  if (!content) return '';
  if (typeof DOMParser === 'undefined') return content;

  const baseUrl = normalizeBaseUrl(options.sourceUrl, options.fallbackBaseUrl ?? DEFAULT_NEWS_BASE_URL);
  const internalHosts = buildInternalHosts(baseUrl, options.fallbackBaseUrl ?? DEFAULT_NEWS_BASE_URL);
  const baseOrigin = new URL(baseUrl).origin;

  const parser = new DOMParser();
  const document = parser.parseFromString(content, 'text/html');

  const anchors = document.querySelectorAll<HTMLAnchorElement>('a');
  anchors.forEach((anchor) => {
    const normalizedHref = normalizeUrl(anchor.getAttribute('href'), {
      baseUrl,
      baseOrigin,
      internalHosts,
      isHref: true,
    });

    if (!normalizedHref) {
      anchor.removeAttribute('href');
      anchor.removeAttribute('target');
      anchor.removeAttribute('rel');
      return;
    }

    let nextHref = rewritePlayerTeamHref(normalizedHref, internalHosts);
    nextHref = toRelativeIfInternal(nextHref, internalHosts);
    anchor.setAttribute('href', nextHref);

    if (isExternalHref(nextHref, internalHosts)) {
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', EXTERNAL_LINK_REL);
    } else {
      anchor.removeAttribute('target');
      anchor.removeAttribute('rel');
    }
  });

  const srcNodes = document.querySelectorAll<HTMLElement>('img[src], source[src], iframe[src]');
  srcNodes.forEach((node) => {
    const rawSrc = node.getAttribute('src');
    const normalizedSrc = normalizeUrl(rawSrc, {
      baseUrl,
      baseOrigin,
      internalHosts,
      isHref: false,
    });
    if (!normalizedSrc) {
      node.removeAttribute('src');
      return;
    }
    node.setAttribute('src', normalizedSrc);
  });

  return document.body.innerHTML;
}

