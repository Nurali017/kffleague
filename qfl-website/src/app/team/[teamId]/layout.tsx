import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { RoutePrefetchProvider } from '@/contexts/RoutePrefetchContext';
import { JsonLd } from '@/components/JsonLd';
import { teamService } from '@/lib/api/services/teamService';
import { DEFAULT_SEASON_ID } from '@/lib/api/endpoints';
import { getServerPrefetchContext, safePrefetch } from '@/lib/api/server/prefetch';
import { prefetchKeys } from '@/lib/api/prefetchKeys';
import { buildMetadata, getSeoLang } from '@/lib/seo/metadata';
import { sportsTeamJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { getLanguageFromCookie } from '@/lib/i18n/cookies.server';

interface TeamDetailLayoutProps {
  children: ReactNode;
  params: {
    teamId: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { teamId: string };
}): Promise<Metadata> {
  const teamId = Number(params.teamId);
  if (!Number.isInteger(teamId) || teamId <= 0) return {};

  const language = getLanguageFromCookie();
  const overview = await safePrefetch(() =>
    teamService.getTeamOverview(teamId, DEFAULT_SEASON_ID, language)
  );
  if (!overview) return {};

  const lang = getSeoLang();
  const { team } = overview;
  const description =
    lang === 'kz'
      ? `${team.name}${team.city ? ` (${team.city})` : ''} — Қазақстан Премьер-Лигасы командасы.`
      : `${team.name}${team.city ? ` (${team.city})` : ''} — команда Казахстанской Премьер-Лиги.`;

  return buildMetadata({
    title: team.name,
    description,
    path: `/team/${teamId}`,
    ogImage: team.logo_url || null,
  });
}

export default async function TeamDetailLayout({
  children,
  params,
}: TeamDetailLayoutProps) {
  const teamId = Number(params.teamId);
  if (!Number.isInteger(teamId) || teamId <= 0) {
    return children;
  }

  const { language, seasonId } = getServerPrefetchContext();
  const effectiveSeasonId = seasonId || DEFAULT_SEASON_ID;

  const [overview, stats, players, games] = await Promise.all([
    safePrefetch(() => teamService.getTeamOverview(teamId, effectiveSeasonId, language)),
    safePrefetch(() => teamService.getTeamStats(teamId, effectiveSeasonId, language)),
    safePrefetch(() => teamService.getTeamPlayers(teamId, effectiveSeasonId, language)),
    safePrefetch(() => teamService.getTeamGames(teamId, effectiveSeasonId, language)),
  ]);

  const prefetch: Record<string, unknown> = {};
  if (overview !== undefined) {
    prefetch[prefetchKeys.teamOverview(teamId, effectiveSeasonId, language)] = overview;
  }
  if (stats !== undefined) {
    prefetch[prefetchKeys.teamStats(teamId, effectiveSeasonId, language)] = stats;
  }
  if (players !== undefined) {
    prefetch[prefetchKeys.teamPlayers(teamId, effectiveSeasonId, language)] = players;
  }
  if (games !== undefined) {
    prefetch[prefetchKeys.teamGames(teamId, effectiveSeasonId, language)] = games;
  }

  const jsonLd = overview
    ? [
        sportsTeamJsonLd({
          id: teamId,
          name: overview.team.name,
          logoUrl: overview.team.logo_url,
          city: overview.team.city,
          stadiumName: overview.team.stadium?.name,
        }),
        breadcrumbJsonLd([
          { name: 'Командалар', href: '/teams' },
          { name: overview.team.name },
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
