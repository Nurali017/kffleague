import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { JsonLd } from '@/components/JsonLd';
import { matchService } from '@/lib/api/services/matchService';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { buildMetadata, matchTitle, getSeoLang } from '@/lib/seo/metadata';
import { sportsEventJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { getLanguageFromCookie } from '@/lib/i18n/cookies.server';

interface MatchDetailLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const matchId = Number(params.id);
  if (!Number.isInteger(matchId) || matchId <= 0) return {};

  const language = getLanguageFromCookie();
  const match = await safePrefetch(() =>
    matchService.getMatchById(matchId, language)
  );
  if (!match) return {};

  const lang = getSeoLang();
  const title = matchTitle(
    match.home_team.name,
    match.away_team.name,
    match.home_score,
    match.away_score
  );

  const dateStr = match.date
    ? new Date(match.date).toLocaleDateString(lang === 'kz' ? 'kk-KZ' : 'ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const description =
    lang === 'kz'
      ? `${match.home_team.name} мен ${match.away_team.name} арасындағы матч. ${dateStr}${match.stadium?.name ? `. ${match.stadium.name}` : ''}`
      : `Матч ${match.home_team.name} — ${match.away_team.name}. ${dateStr}${match.stadium?.name ? `. ${match.stadium.name}` : ''}`;

  return buildMetadata({
    title,
    description,
    path: `/matches/${matchId}`,
    ogImage: match.home_team.logo_url || null,
  });
}

export default async function MatchDetailLayout({
  children,
  params,
}: MatchDetailLayoutProps) {
  const matchId = Number(params.id);
  if (!Number.isInteger(matchId) || matchId <= 0) {
    return children;
  }

  const { language } = getServerPrefetchContext();

  const [detail, stats, lineup, events] = await Promise.all([
    safePrefetch(() => matchService.getMatchById(matchId, language)),
    safePrefetch(() => matchService.getMatchStats(matchId, language)),
    safePrefetch(() => matchService.getMatchLineup(matchId, language)),
    safePrefetch(() => matchService.getMatchEvents(matchId, language)),
  ]);

  const prefetch: Record<string, unknown> = {};
  if (detail !== undefined) {
    prefetch[prefetchKeys.matchDetail(matchId, language)] = detail;
  }
  if (stats !== undefined) {
    prefetch[prefetchKeys.matchStats(matchId, language)] = stats;
  }
  if (lineup !== undefined) {
    prefetch[prefetchKeys.matchLineup(matchId, language)] = lineup;
  }
  if (events !== undefined) {
    prefetch[prefetchKeys.matchEvents(matchId, language)] = events;
  }

  const jsonLd = detail
    ? [
        sportsEventJsonLd({
          id: matchId,
          date: detail.date,
          homeName: detail.home_team.name,
          awayName: detail.away_team.name,
          homeScore: detail.home_score,
          awayScore: detail.away_score,
          stadiumName: detail.stadium?.name,
          stadiumCity: detail.stadium?.city,
          status: detail.status,
        }),
        breadcrumbJsonLd([
          { name: 'Матч-центр', href: '/matches' },
          { name: `${detail.home_team.name} vs ${detail.away_team.name}` },
        ]),
      ]
    : [];

  return (
    <RoutePrefetchProvider value={prefetch}>
      {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
      {children}
    </RoutePrefetchProvider>
  );
}
